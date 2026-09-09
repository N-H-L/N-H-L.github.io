/* Sit the test, then capture the score card at viewport size so it is legible. */
'use strict';
var { spawn } = require('child_process');
var fs = require('fs'); var os = require('os'); var path = require('path');

var BIN = ['C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
           'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe']
          .find(function (p) { return fs.existsSync(p); });
var BASE = 'http://localhost:4173';
var OUT = path.join(__dirname, '..', '.preview', 'frames');
// pick correct answers for the first N items so the score lands above average
var RIGHT_UNTIL = +(process.argv[2] || 0);

function sleep(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }

(async function () {
  fs.mkdirSync(OUT, { recursive: true });
  var profile = fs.mkdtempSync(path.join(os.tmpdir(), 'cs-res-'));
  var chrome = spawn(BIN, ['--headless=new', '--disable-gpu', '--no-first-run', '--hide-scrollbars',
    '--force-color-profile=srgb', '--user-data-dir=' + profile,
    '--remote-debugging-port=9336', 'about:blank'], { stdio: 'ignore' });
  try {
    var list;
    for (var i = 0; i < 60; i++) {
      try { list = await (await fetch('http://127.0.0.1:9336/json/list')).json(); break; }
      catch (e) { await sleep(250); }
    }
    var t = list.find(function (x) { return x.type === 'page'; });
    var ws = new WebSocket(t.webSocketDebuggerUrl);
    var id = 1, pending = new Map();
    await new Promise(function (r) { ws.addEventListener('open', r); });
    ws.addEventListener('message', function (ev) {
      var m = JSON.parse(ev.data);
      if (m.id && pending.has(m.id)) { pending.get(m.id)(m.result); pending.delete(m.id); }
    });
    function send(method, params) {
      var mid = id++;
      ws.send(JSON.stringify({ id: mid, method: method, params: params || {} }));
      return new Promise(function (r) { pending.set(mid, r); });
    }
    async function ev(expr) {
      var r = await send('Runtime.evaluate', { expression: expr, returnByValue: true });
      return r.result && r.result.value;
    }

    await send('Page.enable'); await send('Runtime.enable');
    await send('Emulation.setDeviceMetricsOverride',
      { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
    await send('Page.navigate', { url: BASE + '/test/' });
    await sleep(1200);
    await ev("document.getElementById('btn-begin').click()");
    await sleep(400);

    var n = 0;
    while (n < 40) {
      var done = await ev("(function(){var d=document.getElementById('screen-results');" +
                          "return !!(d&&d.offsetParent!==null)})()");
      if (done) break;
      // answer correctly for the first RIGHT_UNTIL items, else pick option 0
      await ev("(function(){var idx=" + n + ";var right=idx<" + RIGHT_UNTIL + ";" +
               "var o=document.querySelectorAll('.opt input[type=radio]');" +
               "var pick=0;" +
               "if(right&&window.__CS_ANSWER__!=null)pick=window.__CS_ANSWER__;" +
               "o[Math.min(pick,o.length-1)].click();" +
               "var b=document.getElementById('btn-next');if(b&&!b.disabled)b.click();return 1})()");
      n++;
      await sleep(70);
    }
    await sleep(900);
    await ev('window.scrollTo(0,0)');
    await sleep(300);
    var shot = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(OUT, 'results-top.png'), Buffer.from(shot.data, 'base64'));
    console.log('  results-top.png written after ' + n + ' answers');
    ws.close();
  } finally {
    chrome.kill();
    try { fs.rmSync(profile, { recursive: true, force: true }); } catch (e) {}
  }
})();
