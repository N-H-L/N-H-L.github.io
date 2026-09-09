/* Screenshot specific items from the contact sheet.
 *   node tools/shot-item.js MR.01 MR.05 MR.09
 */
'use strict';
var { spawn } = require('child_process');
var fs = require('fs'); var os = require('os'); var path = require('path');

var BIN = ['C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
           'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe']
          .find(function (p) { return fs.existsSync(p); });
var IDS = process.argv.slice(2);
var OUT = path.join(__dirname, '..', '.preview', 'frames');
function sleep(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }

(async function () {
  fs.mkdirSync(OUT, { recursive: true });
  var profile = fs.mkdtempSync(path.join(os.tmpdir(), 'cs-item-'));
  var ch = spawn(BIN, ['--headless=new', '--disable-gpu', '--no-first-run', '--hide-scrollbars',
    '--force-color-profile=srgb', '--user-data-dir=' + profile,
    '--remote-debugging-port=9338', 'about:blank'], { stdio: 'ignore' });
  try {
    var list;
    for (var i = 0; i < 60; i++) {
      try { list = await (await fetch('http://127.0.0.1:9338/json/list')).json(); break; }
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
    function send(me, pa) {
      var mid = id++;
      ws.send(JSON.stringify({ id: mid, method: me, params: pa || {} }));
      return new Promise(function (r) { pending.set(mid, r); });
    }
    async function ev(expr) {
      var r = await send('Runtime.evaluate', { expression: expr, returnByValue: true });
      return r.result && r.result.value;
    }

    await send('Page.enable'); await send('Runtime.enable');
    await send('Emulation.setDeviceMetricsOverride',
      { width: 1000, height: 900, deviceScaleFactor: 2, mobile: false });
    await send('Page.navigate', { url: 'http://localhost:4173/_contact-sheet.html' });
    await sleep(2200);

    for (var k = 0; k < IDS.length; k++) {
      var wanted = IDS[k];
      var box = await ev(
        "(function(){var want=" + JSON.stringify(wanted) + ";" +
        "var all=[].slice.call(document.querySelectorAll('*'));" +
        "var hits=all.filter(function(c){return (c.textContent||'').indexOf(want)!==-1 && c.querySelector && c.querySelector('svg');});" +
        "if(!hits.length)return null;" +
        "var e=hits[hits.length-1];" +
        "e.scrollIntoView({block:'start'});" +
        "var r=e.getBoundingClientRect();" +
        "return {x:Math.max(0,r.left-8),y:Math.max(0,r.top-8),w:Math.min(1000,r.width+16),h:r.height+16};})()");
      if (!box) { console.log('  ' + wanted + ': not found'); continue; }
      await sleep(400);
      var shot = await send('Page.captureScreenshot', {
        format: 'png',
        clip: { x: box.x, y: box.y, width: box.w, height: Math.min(box.h, 1400), scale: 1 }
      });
      var f = path.join(OUT, 'item-' + wanted.replace('.', '') + '.png');
      fs.writeFileSync(f, Buffer.from(shot.data, 'base64'));
      console.log('  ' + wanted + ' -> ' + path.basename(f));
    }
    ws.close();
  } finally {
    ch.kill();
    try { fs.rmSync(profile, { recursive: true, force: true }); } catch (e) {}
  }
})();
