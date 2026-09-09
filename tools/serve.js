#!/usr/bin/env node
/* CogniScale - static dev server for dist/.
 * Serves clean URLs (/methodology/ -> dist/methodology/index.html) and falls
 * back to 404.html, matching how a static host would behave. */
'use strict';

var http = require('http');
var fs = require('fs');
var path = require('path');
var url = require('url');

var DIST = path.join(__dirname, '..', require('../site.config.js').outDir || 'dist');
var PORT = parseInt(process.env.PORT, 10) || 4173;

var TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.webmanifest': 'application/manifest+json'
};

function send(res, code, body, type, extra) {
  var headers = { 'Content-Type': type || 'text/plain; charset=utf-8', 'Content-Length': body.length };
  Object.keys(extra || {}).forEach(function (k) { headers[k] = extra[k]; });
  res.writeHead(code, headers);
  res.end(body);
}

var server = http.createServer(function (req, res) {
  var pathname = decodeURIComponent(url.parse(req.url).pathname);
  if (process.env.CS_LOG) console.log('[req] ' + req.method + ' ' + pathname + ' ua=' + (req.headers['user-agent']||'').slice(0,40));

  // never serve outside dist/
  var rel = path.normalize(pathname).replace(/^([/\\])+/, '');
  var target = path.join(DIST, rel);
  if (target.indexOf(DIST) !== 0) return send(res, 403, Buffer.from('Forbidden'));

  var candidates = [];
  if (pathname.endsWith('/')) {
    candidates.push(path.join(target, 'index.html'));
  } else {
    candidates.push(target);
    candidates.push(target + '.html');
    candidates.push(path.join(target, 'index.html'));
  }

  for (var i = 0; i < candidates.length; i++) {
    var c = candidates[i];
    try {
      var st = fs.statSync(c);
      if (!st.isFile()) continue;
      // redirect /methodology -> /methodology/ so canonical URLs stay canonical
      if (c.endsWith(path.join(rel, 'index.html')) && !pathname.endsWith('/') && pathname !== '') {
        res.writeHead(301, { Location: pathname + '/' });
        return res.end();
      }
      var ext = path.extname(c).toLowerCase();
      var cache = ext === '.html' ? 'no-cache' : 'public, max-age=3600';
      return send(res, 200, fs.readFileSync(c), TYPES[ext] || 'application/octet-stream',
        { 'Cache-Control': cache });
    } catch (e) { /* try the next candidate */ }
  }

  var nf = path.join(DIST, '404.html');
  if (fs.existsSync(nf)) return send(res, 404, fs.readFileSync(nf), TYPES['.html']);
  send(res, 404, Buffer.from('Not found'));
});

if (!fs.existsSync(DIST)) {
  console.error('dist/ does not exist. Run `npm run build` first.');
  process.exit(1);
}

server.listen(PORT, function () {
  console.log('CogniScale dev server');
  console.log('  http://localhost:' + PORT + '/');
  console.log('  serving ' + path.relative(process.cwd(), DIST) + '   (ctrl-c to stop)');
});
