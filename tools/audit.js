#!/usr/bin/env node
/* CogniScale - build audit.
 *
 * Checks the generated site for the things that actually break search
 * visibility and user trust:
 *   - every internal link resolves to a file that exists
 *   - exactly one <h1> per page
 *   - title and meta description present and within sensible pixel-ish limits
 *   - a self-referencing canonical on every indexable page
 *   - every JSON-LD block is valid JSON
 *   - Open Graph image, sitemap, robots and manifest all present and consistent
 *   - no ad markup inside the test flow
 *   - images and svgs carry alt text or are explicitly decorative
 *
 * Run with `npm run audit`. Non-zero exit means something is wrong.
 */
'use strict';

var fs = require('fs');
var path = require('path');
var cfg = require('../site.config.js');

var DIST = path.join(__dirname, '..', require('../site.config.js').outDir || 'dist');
var problems = [];
var warnings = [];
var checked = 0;

function fail(page, msg) { problems.push(page + ': ' + msg); }
function warn(page, msg) { warnings.push(page + ': ' + msg); }

function walk(dir, out) {
  out = out || [];
  fs.readdirSync(dir, { withFileTypes: true }).forEach(function (e) {
    var p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else out.push(p);
  });
  return out;
}

if (!fs.existsSync(DIST)) {
  console.error('dist/ does not exist. Run `npm run build` first.');
  process.exit(1);
}

var allFiles = walk(DIST);
var htmlFiles = allFiles.filter(function (f) { return f.endsWith('.html'); });

function urlToFile(href) {
  var clean = href.split('#')[0].split('?')[0];
  if (!clean) return null;
  var rel = clean.replace(/^\/+/, '');
  var candidates = [
    path.join(DIST, rel),
    path.join(DIST, rel, 'index.html'),
    path.join(DIST, rel + '.html')
  ];
  return candidates.some(function (c) {
    try { return fs.statSync(c).isFile(); } catch (e) { return false; }
  });
}

htmlFiles.forEach(function (file) {
  var name = '/' + path.relative(DIST, file).replace(/\\/g, '/');
  var html = fs.readFileSync(file, 'utf8');
  checked++;

  // ---- headings
  var h1s = html.match(/<h1[\s>]/g) || [];
  if (h1s.length !== 1) fail(name, 'expected exactly 1 <h1>, found ' + h1s.length);

  // ---- title
  var titleM = html.match(/<title>([^<]*)<\/title>/);
  if (!titleM || !titleM[1].trim()) fail(name, 'missing <title>');
  else {
    var t = titleM[1];
    if (t.length > 65) warn(name, 'title is ' + t.length + ' chars, likely truncated in results: "' + t + '"');
    if (t.length < 15) warn(name, 'title is very short (' + t.length + ' chars)');
  }

  // ---- meta description
  var descM = html.match(/<meta name="description" content="([^"]*)"/);
  if (!descM || !descM[1].trim()) fail(name, 'missing meta description');
  else {
    var d = descM[1];
    if (d.length > 165) warn(name, 'meta description is ' + d.length + ' chars, likely truncated');
    if (d.length < 70) warn(name, 'meta description is only ' + d.length + ' chars');
  }

  /* Every table must sit inside .table-wrap, which is what gives it its own
   * horizontal scroll. An unwrapped table is wider than a phone screen and
   * makes the whole page scroll sideways - a real, visible defect that is easy
   * to introduce by mis-typing the wrapper class. */
  var tableIdx = -1;
  while ((tableIdx = html.indexOf('<table', tableIdx + 1)) !== -1) {
    var before = html.slice(Math.max(0, tableIdx - 120), tableIdx);
    if (before.indexOf('table-wrap') === -1) {
      fail(name, 'a <table> is not wrapped in .table-wrap and will overflow on narrow screens');
    }
  }

  // ---- canonical
  var isNoindex = /<meta name="robots" content="noindex/.test(html);
  var canonM = html.match(/<link rel="canonical" href="([^"]*)"/);
  if (!canonM) fail(name, 'missing canonical link');
  else if (!isNoindex) {
    var expected = cfg.origin + (name === '/index.html' ? '/' : '/' + name.replace(/index\.html$/, '').replace(/^\//, ''));
    if (canonM[1] !== expected && name !== '/404.html') {
      warn(name, 'canonical is ' + canonM[1] + ', expected ' + expected);
    }
  }

  // ---- Open Graph
  ['og:title', 'og:description', 'og:url', 'og:image', 'og:type'].forEach(function (p) {
    if (html.indexOf('property="' + p + '"') === -1) fail(name, 'missing ' + p);
  });

  // ---- JSON-LD validity
  var ldBlocks = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g) || [];
  ldBlocks.forEach(function (block, i) {
    var json = block.replace(/^<script type="application\/ld\+json">/, '').replace(/<\/script>$/, '');
    try {
      var parsed = JSON.parse(json.replace(/\\u003c/g, '<'));
      if (!parsed['@context']) fail(name, 'JSON-LD block ' + i + ' has no @context');
      if (!parsed['@type']) fail(name, 'JSON-LD block ' + i + ' has no @type');
    } catch (e) {
      fail(name, 'JSON-LD block ' + i + ' is not valid JSON: ' + e.message);
    }
  });

  // ---- internal links resolve
  var hrefs = [];
  var re = /href="(\/[^"]*)"/g;
  var m;
  while ((m = re.exec(html)) !== null) hrefs.push(m[1]);
  hrefs.forEach(function (h) {
    if (h.indexOf('//') === 0) return;
    if (!urlToFile(h)) fail(name, 'broken internal link: ' + h);
  });

  // ---- ads must never be inside the test flow
  var testSection = html.match(/<section class="screen" id="screen-test"[\s\S]*?<\/section>/);
  if (testSection && /adsbygoogle|ad-slot/.test(testSection[0])) {
    fail(name, 'an ad slot is inside the test question flow');
  }

  // ---- accessibility basics
  var imgs = html.match(/<img\b[^>]*>/g) || [];
  imgs.forEach(function (img) {
    if (!/\balt=/.test(img)) fail(name, 'an <img> has no alt attribute');
  });
  var svgs = html.match(/<svg\b[^>]*>/g) || [];
  svgs.forEach(function (svg) {
    if (!/aria-hidden="true"|role="img"/.test(svg)) {
      warn(name, 'an <svg> is neither aria-hidden nor role="img"');
    }
  });

  // ---- viewport + lang
  if (html.indexOf('name="viewport"') === -1) fail(name, 'missing viewport meta');
  if (!/<html lang="[a-z-]+"/.test(html)) fail(name, 'missing lang on <html>');

  /* ---- no raw template leakage.
   * Only flags placeholders in markup positions - inside an attribute value, or
   * as the whole of a text node. The bare words appear legitimately in prose on
   * the methodology page ("maximum likelihood is undefined for a perfect
   * score"), so a plain substring search produces false positives. */
  var LEAK = /(="(undefined|null|NaN|\[object Object\])")|(>\s*(undefined|NaN|\[object Object\])\s*<)/;
  var leak = html.match(LEAK);
  if (leak) warn(name, 'suspicious rendered value in markup: ' + leak[0].slice(0, 80));
});

// ---------------------------------------------------------- site-level files

['sitemap.xml', 'robots.txt', 'site.webmanifest', 'favicon.svg', '404.html', 'ads.txt']
  .forEach(function (f) {
    if (!fs.existsSync(path.join(DIST, f))) fail('site', 'missing ' + f);
  });

['assets/img/og-default.png', 'assets/img/apple-touch-icon.png', 'assets/js/engine.js',
 'assets/js/test.js', 'assets/js/site.js', 'assets/js/ads.js']
  .forEach(function (f) {
    if (!fs.existsSync(path.join(DIST, f))) fail('site', 'missing ' + f);
  });

// sitemap must list every indexable page and nothing else
var sitemap = fs.readFileSync(path.join(DIST, 'sitemap.xml'), 'utf8');
var locs = (sitemap.match(/<loc>([^<]+)<\/loc>/g) || []).map(function (l) {
  return l.replace(/<\/?loc>/g, '');
});
locs.forEach(function (loc) {
  var rel = loc.replace(cfg.origin, '');
  if (!urlToFile(rel)) fail('sitemap', 'lists a URL with no file: ' + loc);
});

htmlFiles.forEach(function (file) {
  var name = path.relative(DIST, file).replace(/\\/g, '/');
  if (name === '404.html') return;
  var html = fs.readFileSync(file, 'utf8');
  if (/<meta name="robots" content="noindex/.test(html)) return;
  var expected = cfg.origin + '/' + name.replace(/index\.html$/, '');
  if (locs.indexOf(expected) === -1) fail('sitemap', 'does not list ' + expected);
});

if (locs.length !== new Set(locs).size) fail('sitemap', 'contains duplicate URLs');

// robots must point at the sitemap
var robots = fs.readFileSync(path.join(DIST, 'robots.txt'), 'utf8');
if (robots.indexOf(cfg.origin + '/sitemap.xml') === -1) fail('robots.txt', 'does not reference the sitemap');

// ------------------------------------------------------------------- report

console.log('CogniScale build audit');
console.log('======================');
console.log(htmlFiles.length + ' pages checked, ' + locs.length + ' sitemap URLs');
console.log('');

if (warnings.length) {
  console.log('WARNINGS (' + warnings.length + ')');
  warnings.forEach(function (w) { console.log('  ! ' + w); });
  console.log('');
}

if (problems.length) {
  console.log('FAILURES (' + problems.length + ')');
  problems.forEach(function (p) { console.log('  x ' + p); });
  process.exit(1);
}
console.log('PASSED - no blocking issues.');
