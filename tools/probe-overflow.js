/* One-off diagnostic: name the elements that stick out past the viewport. */
'use strict';
var { spawn } = require('child_process');
var fs = require('fs');
var os = require('os');
var path = require('path');

var BIN = ['C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
           'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe']
          .find(function (p) { return fs.existsSync(p); });
var URL_ = process.argv[2] || 'http://localhost:4173/404.html';
var WIDTH = +(process.argv[3] || 390);

function sleep(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }

(async function () {
  var profile = fs.mkdtempSync(path.join(os.tmpdir(), 'cs-probe-'));
  var chrome = spawn(BIN, ['--headless=new', '--disable-gpu', '--no-first-run',
    '--user-data-dir=' + profile, '--remote-debugging-port=9334', 'about:blank'], { stdio: 'ignore' });

  try {
    var v;
    for (var i = 0; i < 60; i++) {
      try { v = await (await fetch('http://127.0.0.1:9334/json/list')).json(); break; }
      catch (e) { await sleep(250); }
    }
    var target = v.find(function (t) { return t.type === 'page'; });
    var ws = new WebSocket(target.webSocketDebuggerUrl);
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

    await send('Page.enable');
    await send('Emulation.setDeviceMetricsOverride',
      { width: WIDTH, height: 844, deviceScaleFactor: 1, mobile: true });
    await send('Page.navigate', { url: URL_ });
    await sleep(1500);

    var res = await send('Runtime.evaluate', {
      returnByValue: true,
      expression: `(function(){
        var vw = document.documentElement.clientWidth;
        var out = [];
        document.querySelectorAll('*').forEach(function(el){
          var r = el.getBoundingClientRect();
          if (r.width === 0 && r.height === 0) return;
          if (r.right > vw + 0.5 || r.left < -0.5) {
            var cs = getComputedStyle(el);
            out.push({
              tag: el.tagName.toLowerCase(),
              cls: (el.className && el.className.baseVal !== undefined ? el.className.baseVal : el.className || '').toString().slice(0,60),
              id: el.id || '',
              left: +r.left.toFixed(1), right: +r.right.toFixed(1), width: +r.width.toFixed(1),
              pos: cs.position, ws: cs.whiteSpace, ov: cs.overflowX,
              txt: (el.textContent||'').trim().slice(0,40)
            });
          }
        });
        return { vw: vw, scrollW: document.documentElement.scrollWidth, offenders: out };
      })()`
    });
    var d = res.result.value;
    console.log('viewport ' + d.vw + '  scrollWidth ' + d.scrollW +
                '  overflow ' + (d.scrollW - d.vw) + 'px');
    console.log('offending elements (outermost first):\n');
    d.offenders.slice(0, 25).forEach(function (o) {
      console.log('  <' + o.tag + (o.id ? '#' + o.id : '') + (o.cls ? '.' + o.cls.split(/\s+/).join('.') : '') + '>');
      console.log('      left ' + o.left + '  right ' + o.right + '  width ' + o.width +
                  '  position:' + o.pos + '  overflow-x:' + o.ov);
      if (o.txt) console.log('      text: "' + o.txt + '"');
    });
    if (!d.offenders.length) console.log('  (none - overflow may come from a scroll container)');
    ws.close();
  } finally {
    chrome.kill();
    try { fs.rmSync(profile, { recursive: true, force: true }); } catch (e) {}
  }
})();
