#!/usr/bin/env node
/* CogniScale - static site build.
 *
 *   node build.js
 *
 * Renders every page module through the shared layout into dist/ with clean
 * URLs (dist/methodology/index.html serves /methodology/), bundles the shared
 * test engine for the browser, copies assets, and emits robots.txt, a sitemap,
 * the web manifest and ads.txt.
 *
 * The engine bundle matters: src/lib/*.js are UMD modules, so the exact same
 * files that the offline verifier requires are the ones the browser runs. There
 * is no second implementation of the scoring to drift out of sync.
 */
'use strict';

var fs = require('fs');
var path = require('path');
var zlib = require('zlib');

var cfg = require('./site.config.js');
var layout = require('./src/layout.js');

var ROOT = __dirname;
var DIST = path.join(ROOT, cfg.outDir || 'dist');

// ------------------------------------------------------------------ helpers --

function rmrf(p) {
  if (fs.existsSync(p)) fs.rmSync(p, { recursive: true, force: true });
}
function mkdirp(p) {
  if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
}
function write(rel, content) {
  var full = path.join(DIST, rel);
  mkdirp(path.dirname(full));
  fs.writeFileSync(full, content);
  return full;
}
function copyDir(from, to) {
  mkdirp(to);
  fs.readdirSync(from, { withFileTypes: true }).forEach(function (e) {
    var src = path.join(from, e.name);
    var dst = path.join(to, e.name);
    if (e.isDirectory()) copyDir(src, dst);
    else fs.copyFileSync(src, dst);
  });
}
function gzipSize(buf) {
  return zlib.gzipSync(Buffer.from(buf), { level: 9 }).length;
}
function kb(n) { return (n / 1024).toFixed(1) + ' KB'; }

// -------------------------------------------------------------------- build --

console.log('CogniScale build');
console.log('================');

rmrf(DIST);
mkdirp(DIST);

var css = fs.readFileSync(path.join(ROOT, 'assets', 'css', 'main.css'), 'utf8');

/* Collapse the stylesheet a little. Deliberately conservative: strip comments
 * and leading indentation only, because the whole file is inlined into every
 * page and correctness beats the last few bytes. */
function minifyCss(src) {
  return src
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .split('\n')
    .map(function (l) { return l.trim(); })
    .filter(Boolean)
    .join('\n');
}
var cssMin = minifyCss(css);

// -- pages -------------------------------------------------------------------

var pages = require('./src/pages/index.js');
var built = [];

pages.forEach(function (page) {
  var html = layout.render(page, cssMin);
  var rel = page.slug ? path.join(page.slug, 'index.html') : 'index.html';
  write(rel, html);
  built.push({ slug: page.slug, bytes: Buffer.byteLength(html), gz: gzipSize(html), page: page });
});

// 404 lives at the root and is not a canonical URL
var notFound = require('./src/pages/404.js');
write('404.html', layout.render(notFound, cssMin));

// -- assets ------------------------------------------------------------------

copyDir(path.join(ROOT, 'assets'), path.join(DIST, 'assets'));
fs.copyFileSync(path.join(ROOT, 'assets', 'favicon.svg'), path.join(DIST, 'favicon.svg'));

/* The browser bundle. Order matters - each UMD module attaches to window.CS and
 * the later ones read the earlier ones off it. */
var ENGINE_MODULES = [
  'src/lib/prng.js',
  'src/lib/matrix.js',
  'src/lib/series.js',
  'src/lib/spatial.js',
  'src/lib/irt.js',
  'src/data/items.js',
  'src/lib/bank.js',
  'src/lib/render.js'
];

var engine = ENGINE_MODULES.map(function (m) {
  return '/* ---- ' + m + ' ---- */\n' + fs.readFileSync(path.join(ROOT, m), 'utf8');
}).join('\n');

/* Test settings travel with the bundle so the page has no inline config. */
var runtimeCfg = 'window.CS=window.CS||{};window.CS.config=' + JSON.stringify({
  timeLimitSeconds: cfg.test.timeLimitSeconds,
  reportFloor: cfg.test.reportFloor,
  reportCeiling: cfg.test.reportCeiling,
  adsEnabledOnTest: cfg.ads.enabledOnTest,
  publisherId: cfg.ads.publisherId,
  slots: cfg.ads.slots,
  name: cfg.name
}) + ';\n';

write('assets/js/engine.js', runtimeCfg + engine);

// -- robots, sitemap, manifest, ads.txt --------------------------------------

var indexable = built.filter(function (b) { return !b.page.noindex; });

var sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n' +
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
  indexable.map(function (b) {
    var loc = layout.url(b.slug);
    var priority = !b.slug ? '1.0' : (b.slug === 'test' ? '0.9' : (b.slug === 'methodology' ? '0.8' : '0.6'));
    var freq = !b.slug || b.slug === 'test' ? 'weekly' : 'monthly';
    return '  <url>\n' +
      '    <loc>' + loc + '</loc>\n' +
      '    <lastmod>' + (b.page.updated || new Date().toISOString().slice(0, 10)) + '</lastmod>\n' +
      '    <changefreq>' + freq + '</changefreq>\n' +
      '    <priority>' + priority + '</priority>\n' +
      '  </url>';
  }).join('\n') +
  '\n</urlset>\n';
write('sitemap.xml', sitemap);

/* GitHub Pages runs Jekyll over the published directory unless this file is
 * present. Jekyll silently skips files and folders beginning with an
 * underscore and can rewrite others, so disable it: this directory is already
 * a finished static site. */
write('.nojekyll', '');

write('robots.txt',
  'User-agent: *\n' +
  'Allow: /\n' +
  '\n' +
  '# Result pages are per-session and carry no unique content worth indexing.\n' +
  'Disallow: /test/?*\n' +
  '\n' +
  'Sitemap: ' + cfg.origin + '/sitemap.xml\n');

write('site.webmanifest', JSON.stringify({
  name: cfg.name + ' - ' + cfg.tagline,
  short_name: cfg.name,
  description: 'A free, research-grounded IQ test scored with item response theory.',
  start_url: '/',
  display: 'standalone',
  background_color: '#faf9f6',
  theme_color: '#1f4470',
  icons: [
    { src: '/favicon.svg', sizes: 'any', type: 'image/svg+xml' },
    { src: '/assets/img/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }
  ]
}, null, 2));

/* ads.txt is what lets AdSense confirm you are an authorised seller of your own
 * inventory. Without it a growing share of demand simply will not bid. */
if (cfg.ads.publisherId) {
  var pub = cfg.ads.publisherId.replace(/^ca-/, '');
  write('ads.txt', 'google.com, ' + pub + ', DIRECT, f08c47fec0942fa0\n');
} else {
  write('ads.txt', '# Add your AdSense publisher id to site.config.js and rebuild.\n' +
    '# The line will read:  google.com, pub-XXXXXXXXXXXXXXXX, DIRECT, f08c47fec0942fa0\n');
}

// ------------------------------------------------------------------ report ---

var totalBytes = 0, totalGz = 0;
console.log('');
console.log('  page                                    size     gzip');
built.sort(function (a, b) { return (a.slug || '').localeCompare(b.slug || ''); }).forEach(function (b) {
  totalBytes += b.bytes; totalGz += b.gz;
  console.log('  /' + (b.slug ? b.slug + '/' : '').padEnd(38) + kb(b.bytes).padStart(8) + kb(b.gz).padStart(9));
});

var engineBytes = fs.statSync(path.join(DIST, 'assets/js/engine.js')).size;
console.log('');
console.log('  ' + built.length + ' pages + 404   html ' + kb(totalBytes) + ' (' + kb(totalGz) + ' gzipped)');
console.log('  inline css     ' + kb(Buffer.byteLength(cssMin)) + ' (' + kb(gzipSize(cssMin)) + ' gzipped, per page)');
console.log('  engine.js      ' + kb(engineBytes) + ' (' + kb(gzipSize(fs.readFileSync(path.join(DIST, 'assets/js/engine.js')))) + ' gzipped)');
console.log('');
console.log('  wrote ' + (cfg.outDir || 'dist') + '/  -  ' + (cfg.ads.publisherId ? 'ads ENABLED' : 'ads disabled (no publisher id set)'));
