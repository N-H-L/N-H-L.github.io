/* Capture legible viewport-sized frames at chosen scroll offsets.
 * node tools/shots.js            -> .preview/frames/*.png
 */
'use strict';
var { spawn } = require('child_process');
var fs = require('fs'); var os = require('os'); var path = require('path');

var BIN = ['C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
           'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe']
          .find(function (p) { return fs.existsSync(p); });
var BASE = 'http://localhost:4173';
var OUT = path.join(__dirname, '..', '.preview', 'frames');

// [route, name, [scrollY offsets], width, height]
var FRAMES = [
  ['/', 'home-1', [0], 1440, 900],
  ['/', 'home-2', [820], 1440, 900],
  ['/', 'home-3', [1700], 1440, 900],
  ['/', 'home-4', [2600], 1440, 900],
  ['/methodology/', 'method-1', [0], 1440, 900],
  ['/methodology/', 'method-2', [1100], 1440, 900],
  ['/methodology/', 'method-3', [2600], 1440, 900],
  ['/guides/', 'guides-1', [0], 1440, 900],
  ['/guides/iq-score-ranges/', 'guide-1', [420], 1440, 900],
  ['/test/', 'test-intro', [0], 1440, 900],
  ['/', 'home-m1', [0], 390, 844],
  ['/', 'home-m2', [760], 390, 844]
];

function sleep(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }

(async function () {
  fs.mkdirSync(OUT, { recursive: true });
  var profile = fs.mkdtempSync(path.join(os.tmpdir(), 'cs-shots-'));
  var chrome = spawn(BIN, ['--headless=new', '--disable-gpu', '--no-first-run', '--hide-scrollbars',
    '--force-color-profile=srgb', '--user-data-dir=' + profile,
    '--remote-debugging-port=9335', 'about:blank'], { stdio: 'ignore' });
  try {
    var list;
    for (var i = 0; i < 60; i++) {
      try { list = await (await fetch('http://127.0.0.1:9335/json/list')).json(); break; }
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
    await send('Page.enable'); await send('Runtime.enable');

    var last = null;
    for (var f = 0; f < FRAMES.length; f++) {
      var route = FRAMES[f][0], name = FRAMES[f][1], ys = FRAMES[f][2],
          w = FRAMES[f][3], h = FRAMES[f][4];
      await send('Emulation.setDeviceMetricsOverride',
        { width: w, height: h, deviceScaleFactor: 1, mobile: w < 700 });
      if (last !== route + '|' + w) {
        await send('Page.navigate', { url: BASE + route });
        await sleep(900);
        last = route + '|' + w;
      }
      await send('Runtime.evaluate', { expression: 'window.scrollTo(0,' + ys[0] + ')' });
      await sleep(350);
      var shot = await send('Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync(path.join(OUT, name + '.png'), Buffer.from(shot.data, 'base64'));
      console.log('  ' + name + '.png  ' + w + 'x' + h + '  ' + route + ' @' + ys[0]);
    }
    ws.close();
  } finally {
    chrome.kill();
    try { fs.rmSync(profile, { recursive: true, force: true }); } catch (e) {}
  }
})();
