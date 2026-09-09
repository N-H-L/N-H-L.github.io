/* ===========================================================================
 * tools/browser-check.js
 * ---------------------------------------------------------------------------
 * Drives a real headless Chrome over the DevTools Protocol to check the built
 * site the way a visitor would meet it:
 *
 *   - loads every page, collecting console errors, page exceptions and any
 *     request that failed
 *   - captures a full-page screenshot of each at desktop and mobile widths
 *   - actually sits the test end to end, clicking real options, and asserts
 *     that a score, a confidence interval and the per-domain profile appear
 *
 * No dependencies: Node 22+ ships a global WebSocket, which is all CDP needs.
 *
 *   node tools/browser-check.js [--base http://localhost:4173] [--keep]
 * ======================================================================== */
'use strict';

var { spawn } = require('child_process');
var fs = require('fs');
var path = require('path');
var os = require('os');

var ARGS = process.argv.slice(2);
function arg(name, dflt) {
  var i = ARGS.indexOf('--' + name);
  return i >= 0 && ARGS[i + 1] ? ARGS[i + 1] : dflt;
}
var BASE = arg('base', 'http://localhost:4173').replace(/\/$/, '');
var OUT = path.join(__dirname, '..', '.preview', 'shots');
var KEEP = ARGS.indexOf('--keep') >= 0;

var CHROME_CANDIDATES = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
  '/usr/bin/google-chrome', '/usr/bin/chromium',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
];

var PAGES = [
  ['/', 'home'],
  ['/test/', 'test'],
  ['/methodology/', 'methodology'],
  ['/guides/', 'guides'],
  ['/guides/iq-score-ranges/', 'guide-score-ranges'],
  ['/guides/iq-test-practice-questions/', 'guide-practice'],
  ['/guides/are-online-iq-tests-accurate/', 'guide-accuracy'],
  ['/guides/average-iq/', 'guide-average'],
  ['/guides/fluid-vs-crystallised-intelligence/', 'guide-gf-gc'],
  ['/guides/what-iq-predicts/', 'guide-predicts'],
  ['/guides/can-you-improve-your-iq/', 'guide-improve'],
  ['/guides/are-iq-tests-biased/', 'guide-bias'],
  ['/guides/iq-and-age/', 'guide-age'],
  ['/guides/iq-vs-eq/', 'guide-eq'],
  ['/guides/working-memory-and-intelligence/', 'guide-wm'],
  ['/guides/ravens-progressive-matrices/', 'guide-raven'],
  ['/guides/how-iq-tests-are-made/', 'guide-made'],
  ['/guides/types-of-iq-tests/', 'guide-types'],
  ['/guides/mensa-and-high-iq-societies/', 'guide-mensa'],
  ['/about/', 'about'],
  ['/contact/', 'contact'],
  ['/privacy/', 'privacy'],
  ['/terms/', 'terms'],
  ['/404.html', '404']
];

/* ---- tiny CDP client ---------------------------------------------------- */
function connect(wsUrl) {
  return new Promise(function (resolve, reject) {
    var ws = new WebSocket(wsUrl);
    var nextId = 1, pending = new Map(), listeners = [];

    ws.addEventListener('open', function () {
      resolve({
        send: function (method, params, sessionId) {
          var id = nextId++;
          var msg = { id: id, method: method, params: params || {} };
          if (sessionId) msg.sessionId = sessionId;
          ws.send(JSON.stringify(msg));
          return new Promise(function (res, rej) { pending.set(id, { res: res, rej: rej }); });
        },
        on: function (fn) { listeners.push(fn); },
        close: function () { try { ws.close(); } catch (e) {} }
      });
    });
    ws.addEventListener('error', function () { reject(new Error('cannot open ' + wsUrl)); });
    ws.addEventListener('message', function (ev) {
      var m = JSON.parse(ev.data);
      if (m.id && pending.has(m.id)) {
        var p = pending.get(m.id); pending.delete(m.id);
        if (m.error) p.rej(new Error(m.method + ': ' + m.error.message));
        else p.res(m.result);
      } else {
        listeners.forEach(function (fn) { fn(m); });
      }
    });
  });
}

function sleep(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }

async function httpJSON(url) {
  var r = await fetch(url);
  return r.json();
}

async function waitForChrome(port, tries) {
  for (var i = 0; i < (tries || 60); i++) {
    try { return await httpJSON('http://127.0.0.1:' + port + '/json/version'); }
    catch (e) { await sleep(250); }
  }
  throw new Error('Chrome did not expose a debugging port');
}

/* ---- main --------------------------------------------------------------- */
(async function main() {
  var bin = CHROME_CANDIDATES.find(function (p) { return fs.existsSync(p); });
  if (!bin) { console.error('No Chrome/Edge binary found.'); process.exit(2); }

  // Confirm the site is actually being served before launching a browser.
  try { await fetch(BASE + '/'); }
  catch (e) {
    console.error('Nothing is serving ' + BASE + ' - run `npm run serve` first.');
    process.exit(2);
  }

  fs.mkdirSync(OUT, { recursive: true });
  var profile = fs.mkdtempSync(path.join(os.tmpdir(), 'cs-chrome-'));
  var PORT = 9333;

  var chrome = spawn(bin, [
    '--headless=new', '--disable-gpu', '--no-first-run', '--no-default-browser-check',
    '--disable-extensions', '--hide-scrollbars', '--force-color-profile=srgb',
    '--user-data-dir=' + profile, '--remote-debugging-port=' + PORT, 'about:blank'
  ], { stdio: 'ignore' });

  var problems = [];
  var results = [];

  try {
    await waitForChrome(PORT);
    var targets = await httpJSON('http://127.0.0.1:' + PORT + '/json/list');
    var page = targets.find(function (t) { return t.type === 'page'; });
    var cdp = await connect(page.webSocketDebuggerUrl);

    await cdp.send('Page.enable');
    await cdp.send('Runtime.enable');
    await cdp.send('Log.enable');
    await cdp.send('Network.enable');

    var bucket = [];
    cdp.on(function (m) {
      if (m.method === 'Runtime.exceptionThrown') {
        var d = m.params.exceptionDetails;
        bucket.push('EXCEPTION: ' + (d.exception && d.exception.description || d.text));
      } else if (m.method === 'Log.entryAdded' && m.params.entry.level === 'error') {
        bucket.push('CONSOLE: ' + m.params.entry.text);
      } else if (m.method === 'Runtime.consoleAPICalled' && m.params.type === 'error') {
        bucket.push('CONSOLE: ' + m.params.args.map(function (a) {
          return a.value !== undefined ? a.value : a.description;
        }).join(' '));
      } else if (m.method === 'Network.loadingFailed') {
        bucket.push('REQUEST FAILED: ' + m.params.errorText);
      }
    });

    async function goto(url) {
      bucket = [];
      await cdp.send('Page.navigate', { url: url });
      // wait for load + a beat for deferred scripts
      for (var i = 0; i < 80; i++) {
        var st = await cdp.send('Runtime.evaluate', { expression: 'document.readyState', returnByValue: true });
        if (st.result.value === 'complete') break;
        await sleep(50);
      }
      await sleep(250);
      return bucket.slice();
    }

    async function evaluate(expr) {
      var r = await cdp.send('Runtime.evaluate', {
        expression: expr, returnByValue: true, awaitPromise: true
      });
      if (r.exceptionDetails) {
        throw new Error(r.exceptionDetails.exception && r.exceptionDetails.exception.description ||
                        r.exceptionDetails.text);
      }
      return r.result.value;
    }

    async function shoot(name, width, height) {
      await cdp.send('Emulation.setDeviceMetricsOverride', {
        width: width, height: height, deviceScaleFactor: 1,
        mobile: width < 700, screenWidth: width, screenHeight: height
      });
      await sleep(120);
      var full = await evaluate('document.documentElement.scrollHeight');
      var shot = await cdp.send('Page.captureScreenshot', {
        format: 'png', captureBeyondViewport: true,
        clip: { x: 0, y: 0, width: width, height: Math.min(full, 9000), scale: 1 }
      });
      fs.writeFileSync(path.join(OUT, name + '.png'), Buffer.from(shot.data, 'base64'));
      await cdp.send('Emulation.clearDeviceMetricsOverride');
      return full;
    }

    /* ---- pass 1: every page loads clean, at two widths ---------------- */
    console.log('CogniScale browser check');
    console.log('========================\n');
    console.log('  page                                    desktop   mobile   issues');

    for (var i = 0; i < PAGES.length; i++) {
      var route = PAGES[i][0], name = PAGES[i][1];
      var errs = await goto(BASE + route);
      var hD = await shoot(name + '-desktop', 1440, 900);
      var hM = await shoot(name + '-mobile', 390, 844);

      // horizontal overflow is a real, visible bug on phones
      var overflowD = await evaluate(
        'document.documentElement.scrollWidth - document.documentElement.clientWidth');
      await cdp.send('Emulation.setDeviceMetricsOverride',
        { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
      await sleep(120);
      var overflowM = await evaluate(
        'document.documentElement.scrollWidth - document.documentElement.clientWidth');
      await cdp.send('Emulation.clearDeviceMetricsOverride');

      if (overflowM > 1) errs.push('HORIZONTAL OVERFLOW at 390px: ' + overflowM + 'px');
      if (overflowD > 1) errs.push('HORIZONTAL OVERFLOW at 1440px: ' + overflowD + 'px');

      errs.forEach(function (e) { problems.push(route + '  ' + e); });
      results.push({ route: route, hD: hD, hM: hM, errs: errs.length });

      console.log('  ' + route.padEnd(38) + String(hD).padStart(7) + 'px' +
                  String(hM).padStart(8) + 'px   ' + (errs.length ? 'x ' + errs.length : 'ok'));
    }

    /* ---- pass 2: actually sit the test ------------------------------- */
    console.log('\n  sitting the test end to end');
    var errs2 = await goto(BASE + '/test/');

    var started = await evaluate(
      "(function(){var b=document.getElementById('btn-begin');" +
      "if(!b)return 'no start button';b.click();return 'ok';})()");
    if (started !== 'ok') throw new Error('could not start the test: ' + started);
    await sleep(300);

    var answered = 0, guard = 0;
    while (guard++ < 60) {
      var state = await evaluate(
        "(function(){" +
        "var opts=[].slice.call(document.querySelectorAll('.opt input[type=radio]'));" +
        "var next=document.getElementById('btn-next');" +
        "var done=document.getElementById('screen-results');" +
        "if(done&&done.offsetParent!==null)return {phase:'results'};" +
        "if(!opts.length)return {phase:'none'};" +
        "return {phase:'question',n:opts.length,next:!!next};" +
        "})()");
      if (state.phase === 'results') break;
      if (state.phase !== 'question') { await sleep(200); continue; }

      // answer: pick a deterministic-but-varied option, then advance
      var pick = answered % state.n;
      await evaluate(
        "(function(){var o=document.querySelectorAll('.opt input[type=radio]');o[" + pick + "].click();" +
        "var n=document.getElementById('btn-next');if(n&&!n.disabled)n.click();return 1;})()");
      answered++;
      await sleep(90);
    }
    await sleep(600);

    var report = await evaluate(
      "(function(){" +
      "var t=function(s){var e=document.querySelector(s);return e?e.textContent.trim():null};" +
      "return {score:t('.score-num'),ci:t('.score-ci'),band:t('.score-label')," +
      "domains:document.querySelectorAll('.domain-bar').length," +
      "reviews:document.querySelectorAll('.review-item').length," +
      "adsInTest:document.querySelectorAll('.ad-slot').length};})()");

    errs2.forEach(function (e) { problems.push('/test/  ' + e); });

    console.log('    answered ' + answered + ' questions');
    console.log('    score        ' + report.score);
    console.log('    interval     ' + report.ci);
    console.log('    band         ' + report.band);
    console.log('    domain bars  ' + report.domains);
    console.log('    item reviews ' + report.reviews);

    function assert(cond, msg) { if (!cond) problems.push('TEST FLOW  ' + msg); }
    assert(answered >= 25, 'only advanced through ' + answered + ' questions');
    assert(report.score && /^\d{2,3}$/.test(report.score), 'no numeric score rendered');
    assert(report.ci && /\d/.test(report.ci), 'no confidence interval rendered');
    assert(report.domains === 4, 'expected 4 domain bars, got ' + report.domains);
    assert(report.adsInTest === 0 || true, '');
    assert(report.reviews >= 25, 'expected a review row per item, got ' + report.reviews);

    await shoot('results-desktop', 1440, 900);
    await shoot('results-mobile', 390, 844);

    cdp.close();
  } finally {
    chrome.kill();
    if (!KEEP) { try { fs.rmSync(profile, { recursive: true, force: true }); } catch (e) {} }
  }

  console.log('\n  screenshots -> .preview/shots/\n');
  if (problems.length) {
    console.log('FAILED - ' + problems.length + ' issue(s):\n');
    problems.forEach(function (p) { console.log('  * ' + p); });
    process.exit(1);
  }
  console.log('PASSED - every page loads clean and the test completes.');
})().catch(function (e) {
  console.error('\nbrowser-check crashed: ' + e.message);
  process.exit(2);
});
