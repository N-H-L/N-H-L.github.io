#!/usr/bin/env node
/* CogniScale - generates the raster images the site references.
 *
 * Open Graph and apple-touch-icon have to be real PNGs (X/Twitter will not
 * render an SVG card), so rather than ship a dangling reference this writes them
 * with a minimal PNG encoder built on Node's zlib. No image dependency.
 *
 * Output: assets/img/og-default.png, assets/img/apple-touch-icon.png,
 *         assets/img/logo.svg, favicon.svg
 */
'use strict';

var fs = require('fs');
var path = require('path');
var zlib = require('zlib');

// ------------------------------------------------------------- PNG encoder ---

var CRC_TABLE = (function () {
  var t = new Int32Array(256);
  for (var n = 0; n < 256; n++) {
    var c = n;
    for (var k = 0; k < 8; k++) c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
    t[n] = c;
  }
  return t;
})();

function crc32(buf) {
  var c = 0xFFFFFFFF;
  for (var i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xFF] ^ (c >>> 8);
  return (c ^ 0xFFFFFFFF) >>> 0;
}

function chunk(type, data) {
  var len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  var body = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  var crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body), 0);
  return Buffer.concat([len, body, crc]);
}

function encodePng(width, height, rgba) {
  var raw = Buffer.alloc((width * 4 + 1) * height);
  for (var y = 0; y < height; y++) {
    raw[y * (width * 4 + 1)] = 0;                       // filter: none
    rgba.copy(raw, y * (width * 4 + 1) + 1, y * width * 4, (y + 1) * width * 4);
  }
  var ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;    // bit depth
  ihdr[9] = 6;    // colour type: RGBA
  ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0;
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]),
    chunk('IHDR', ihdr),
    chunk('IDAT', zlib.deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0))
  ]);
}

// ------------------------------------------------------------- tiny canvas ---

function Canvas(w, h) {
  this.w = w; this.h = h;
  this.data = Buffer.alloc(w * h * 4);
}

Canvas.prototype.blend = function (x, y, col, alpha) {
  if (x < 0 || y < 0 || x >= this.w || y >= this.h || alpha <= 0) return;
  if (alpha > 1) alpha = 1;
  var i = (y * this.w + x) * 4;
  var d = this.data;
  var ia = 1 - alpha;
  d[i]     = Math.round(col[0] * alpha + d[i] * ia);
  d[i + 1] = Math.round(col[1] * alpha + d[i + 1] * ia);
  d[i + 2] = Math.round(col[2] * alpha + d[i + 2] * ia);
  d[i + 3] = Math.round(255 * alpha + d[i + 3] * ia);
};

Canvas.prototype.fill = function (col) {
  for (var y = 0; y < this.h; y++) for (var x = 0; x < this.w; x++) this.blend(x, y, col, 1);
};

Canvas.prototype.rect = function (x0, y0, x1, y1, col, alpha) {
  for (var y = Math.max(0, Math.floor(y0)); y < Math.min(this.h, Math.ceil(y1)); y++) {
    for (var x = Math.max(0, Math.floor(x0)); x < Math.min(this.w, Math.ceil(x1)); x++) {
      this.blend(x, y, col, alpha == null ? 1 : alpha);
    }
  }
};

/* Rounded rectangle with anti-aliased corners. */
Canvas.prototype.roundRect = function (x0, y0, x1, y1, r, col) {
  for (var y = Math.floor(y0); y < Math.ceil(y1); y++) {
    for (var x = Math.floor(x0); x < Math.ceil(x1); x++) {
      var dx = 0, dy = 0;
      if (x < x0 + r) dx = x0 + r - x - 0.5; else if (x > x1 - r) dx = x - (x1 - r) + 0.5;
      if (y < y0 + r) dy = y0 + r - y - 0.5; else if (y > y1 - r) dy = y - (y1 - r) + 0.5;
      var d = Math.sqrt(dx * dx + dy * dy);
      var a = d <= r - 0.5 ? 1 : (d >= r + 0.5 ? 0 : r + 0.5 - d);
      this.blend(x, y, col, a);
    }
  }
};

/* Stamp an anti-aliased disc - the brush used to stroke curves. */
Canvas.prototype.disc = function (cx, cy, r, col, alpha) {
  var x0 = Math.floor(cx - r - 1), x1 = Math.ceil(cx + r + 1);
  var y0 = Math.floor(cy - r - 1), y1 = Math.ceil(cy + r + 1);
  for (var y = y0; y <= y1; y++) {
    for (var x = x0; x <= x1; x++) {
      var d = Math.sqrt((x + 0.5 - cx) * (x + 0.5 - cx) + (y + 0.5 - cy) * (y + 0.5 - cy));
      var a = d <= r - 0.5 ? 1 : (d >= r + 0.5 ? 0 : r + 0.5 - d);
      this.blend(x, y, col, a * (alpha == null ? 1 : alpha));
    }
  }
};

Canvas.prototype.stroke = function (fn, t0, t1, steps, width, col) {
  for (var i = 0; i <= steps; i++) {
    var p = fn(t0 + (t1 - t0) * (i / steps));
    this.disc(p[0], p[1], width / 2, col);
  }
};

Canvas.prototype.toPng = function () { return encodePng(this.w, this.h, this.data); };

// ------------------------------------------------------------- stroke font ---
/* A minimal single-stroke font. There is no font rasteriser available here and
 * a social card with no words on it wastes the impression, so glyphs are drawn
 * as polylines on a unit box (x and y both 0..1, y increasing downwards) and
 * stroked with the same disc brush as the curves. Uppercase only, which suits
 * the card's typographic register anyway. */
var GLYPHS = {
  'A': [[[0,1],[0.5,0],[1,1]], [[0.17,0.62],[0.83,0.62]]],
  'B': [[[0,0],[0,1]], [[0,0],[0.68,0],[0.94,0.16],[0.7,0.47],[0,0.47]], [[0.7,0.47],[1,0.72],[0.72,1],[0,1]]],
  'C': [[[1,0.17],[0.72,0],[0.28,0],[0,0.28],[0,0.72],[0.28,1],[0.72,1],[1,0.83]]],
  'D': [[[0,0],[0,1]], [[0,0],[0.58,0],[1,0.36],[1,0.64],[0.58,1],[0,1]]],
  'E': [[[1,0],[0,0],[0,1],[1,1]], [[0,0.5],[0.76,0.5]]],
  'F': [[[1,0],[0,0],[0,1]], [[0,0.5],[0.74,0.5]]],
  'G': [[[1,0.17],[0.72,0],[0.28,0],[0,0.28],[0,0.72],[0.28,1],[0.76,1],[1,0.78],[1,0.55],[0.6,0.55]]],
  'H': [[[0,0],[0,1]], [[1,0],[1,1]], [[0,0.5],[1,0.5]]],
  'I': [[[0.5,0],[0.5,1]]],
  'J': [[[1,0],[1,0.74],[0.74,1],[0.3,1],[0.04,0.78]]],
  'K': [[[0,0],[0,1]], [[1,0],[0,0.53]], [[0.34,0.36],[1,1]]],
  'L': [[[0,0],[0,1],[1,1]]],
  'M': [[[0,1],[0,0],[0.5,0.62],[1,0],[1,1]]],
  'N': [[[0,1],[0,0],[1,1],[1,0]]],
  'O': [[[0.5,0],[0.13,0.2],[0,0.5],[0.13,0.8],[0.5,1],[0.87,0.8],[1,0.5],[0.87,0.2],[0.5,0]]],
  'P': [[[0,1],[0,0],[0.7,0],[1,0.27],[0.7,0.55],[0,0.55]]],
  'Q': [[[0.5,0],[0.13,0.2],[0,0.5],[0.13,0.8],[0.5,1],[0.87,0.8],[1,0.5],[0.87,0.2],[0.5,0]], [[0.62,0.7],[1.0,1.04]]],
  'R': [[[0,1],[0,0],[0.7,0],[1,0.27],[0.7,0.55],[0,0.55]], [[0.5,0.55],[1,1]]],
  'S': [[[1,0.17],[0.7,0],[0.26,0],[0.02,0.23],[0.17,0.45],[0.78,0.58],[1,0.78],[0.76,1],[0.28,1],[0,0.84]]],
  'T': [[[0,0],[1,0]], [[0.5,0],[0.5,1]]],
  'U': [[[0,0],[0,0.72],[0.28,1],[0.72,1],[1,0.72],[1,0]]],
  'V': [[[0,0],[0.5,1],[1,0]]],
  'W': [[[0,0],[0.22,1],[0.5,0.36],[0.78,1],[1,0]]],
  'X': [[[0,0],[1,1]], [[1,0],[0,1]]],
  'Y': [[[0,0],[0.5,0.52],[1,0]], [[0.5,0.52],[0.5,1]]],
  'Z': [[[0,0],[1,0],[0,1],[1,1]]],
  '0': [[[0.5,0],[0.13,0.2],[0,0.5],[0.13,0.8],[0.5,1],[0.87,0.8],[1,0.5],[0.87,0.2],[0.5,0]]],
  '1': [[[0.16,0.2],[0.5,0],[0.5,1]]],
  '2': [[[0.04,0.22],[0.3,0],[0.7,0],[0.96,0.26],[0.05,1],[1,1]]],
  '3': [[[0.05,0.15],[0.35,0],[0.75,0],[0.95,0.25],[0.58,0.47],[0.95,0.72],[0.72,1],[0.3,1],[0.02,0.85]]],
  '4': [[[0.76,1],[0.76,0],[0,0.68],[1,0.68]]],
  '5': [[[1,0],[0.15,0],[0.05,0.44],[0.6,0.41],[0.95,0.6],[0.85,0.92],[0.4,1],[0.04,0.88]]],
  '6': [[[0.9,0.1],[0.55,0],[0.2,0.2],[0.05,0.6],[0.2,0.92],[0.6,1],[0.92,0.82],[0.85,0.55],[0.5,0.45],[0.15,0.6]]],
  '7': [[[0,0],[1,0],[0.4,1]]],
  '8': [[[0.5,0.46],[0.2,0.32],[0.22,0.08],[0.5,0],[0.78,0.08],[0.8,0.32],[0.5,0.46],[0.15,0.62],[0.18,0.92],[0.5,1],[0.82,0.92],[0.85,0.62],[0.5,0.46]]],
  '9': [[[0.1,0.9],[0.45,1],[0.8,0.8],[0.95,0.4],[0.8,0.08],[0.4,0],[0.08,0.18],[0.15,0.45],[0.5,0.55],[0.85,0.4]]],
  '.': [[[0.42,0.99],[0.5,0.99]]],
  '-': [[[0.1,0.55],[0.9,0.55]]],
  '/': [[[0.9,0],[0.1,1]]],
  '+': [[[0.5,0.2],[0.5,0.85]], [[0.15,0.52],[0.85,0.52]]],
  '·': [[[0.42,0.52],[0.5,0.52]]]
};

var GLYPH_WIDTH = { 'I': 0.26, 'J': 0.72, 'L': 0.78, 'T': 0.86, '1': 0.5, '.': 0.32, '·': 0.36, '-': 0.6, '/': 0.6 };

function textWidth(str, size, tracking) {
  var w = 0;
  for (var i = 0; i < str.length; i++) {
    var ch = str[i].toUpperCase();
    if (ch === ' ') { w += size * 0.42 + tracking; continue; }
    w += (GLYPH_WIDTH[ch] != null ? GLYPH_WIDTH[ch] : 1) * size * 0.72 + tracking;
  }
  return w - tracking;
}

/* x, y = left edge and cap-height top. size = cap height in pixels. */
Canvas.prototype.text = function (str, x, y, size, weight, col, tracking, alpha) {
  tracking = tracking == null ? size * 0.14 : tracking;
  var cursor = x;
  for (var i = 0; i < str.length; i++) {
    var ch = str[i].toUpperCase();
    if (ch === ' ') { cursor += size * 0.42 + tracking; continue; }
    var g = GLYPHS[ch];
    var gw = (GLYPH_WIDTH[ch] != null ? GLYPH_WIDTH[ch] : 1) * size * 0.72;
    if (g) {
      for (var s = 0; s < g.length; s++) {
        var poly = g[s];
        for (var p = 0; p < poly.length - 1; p++) {
          var ax = cursor + poly[p][0] * gw,      ay = y + poly[p][1] * size;
          var bx = cursor + poly[p + 1][0] * gw,  by = y + poly[p + 1][1] * size;
          var dist = Math.hypot(bx - ax, by - ay);
          var steps = Math.max(2, Math.ceil(dist * 2.2));
          for (var t = 0; t <= steps; t++) {
            var f = t / steps;
            this.disc(ax + (bx - ax) * f, ay + (by - ay) * f, weight / 2, col, alpha);
          }
        }
      }
    }
    cursor += gw + tracking;
  }
  return cursor - tracking;
};

// ------------------------------------------------------------------ assets ---

var BRAND = [31, 68, 112];
var BRAND_DEEP = [22, 50, 84];
var WHITE = [255, 255, 255];
var ACCENT = [214, 132, 96];

var root = path.join(__dirname, '..');
var imgDir = path.join(root, 'assets', 'img');
if (!fs.existsSync(imgDir)) fs.mkdirSync(imgDir, { recursive: true });

/* --- Open Graph card, 1200x630 -------------------------------------------- */
(function () {
  var W = 1200, H = 630;
  var c = new Canvas(W, H);

  // vertical gradient background
  for (var y = 0; y < H; y++) {
    var t = y / H;
    c.rect(0, y, W, y + 1, [
      Math.round(BRAND[0] + (BRAND_DEEP[0] - BRAND[0]) * t),
      Math.round(BRAND[1] + (BRAND_DEEP[1] - BRAND[1]) * t),
      Math.round(BRAND[2] + (BRAND_DEEP[2] - BRAND[2]) * t)
    ], 1);
  }

  // the distribution, sitting low as a watermark behind the words
  var baseY = 560, peakY = 300, mu = 640, sigma = 190;
  function bell(x) { return baseY - (baseY - peakY) * Math.exp(-Math.pow(x - mu, 2) / (2 * sigma * sigma)); }

  for (var x = 60; x < W - 60; x++) {
    for (var yy = Math.ceil(bell(x)); yy < baseY; yy++) c.blend(x, yy, WHITE, 0.055);
  }
  c.rect(60, baseY, W - 60, baseY + 2, WHITE, 0.32);
  c.stroke(function (t) { return [t, bell(t)]; }, 60, W - 60, 3600, 6, [255, 255, 255]);
  var markX = mu + sigma;
  for (var my = Math.floor(bell(markX)); my < baseY; my++) c.blend(Math.round(markX), my, ACCENT, 0.7);
  c.disc(markX, bell(markX), 10, ACCENT);

  // logo mark + wordmark
  c.roundRect(72, 62, 122, 112, 12, WHITE);
  (function () {
    var bx = 81, bw = 32, by0 = 101, by1 = 73;
    c.stroke(function (t) {
      var px = bx + bw * t;
      var py = by0 - (by0 - by1) * Math.exp(-Math.pow(t - 0.5, 2) / (2 * 0.016));
      return [px, py];
    }, 0, 1, 400, 4.5, BRAND);
  })();
  c.text('COGNISCALE', 138, 76, 24, 3.6, WHITE, 5.5, 0.95);

  // headline
  c.text('FREE IQ TEST', 72, 190, 92, 11, WHITE, 12);

  // accent rule
  c.rect(72, 322, 232, 328, ACCENT, 1);

  // sub-line
  c.text('30 ITEMS  ·  30 MINUTES  ·  NO SIGN-UP', 72, 366, 25, 3.6, WHITE, 5, 0.88);
  c.text('SCORED WITH ITEM RESPONSE THEORY', 72, 414, 25, 3.6, WHITE, 5, 0.62);

  fs.writeFileSync(path.join(imgDir, 'og-default.png'), c.toPng());
  console.log('assets/img/og-default.png  1200x630');
})();

/* --- apple-touch-icon, 180x180 -------------------------------------------- */
(function () {
  var S = 180;
  var c = new Canvas(S, S);
  c.roundRect(0, 0, S, S, 40, BRAND);
  var baseY = 132, peakY = 46, mu = 90, sigma = 26;
  function bell(x) { return baseY - (baseY - peakY) * Math.exp(-Math.pow(x - mu, 2) / (2 * sigma * sigma)); }
  c.stroke(function (x) { return [x, bell(x)]; }, 26, S - 26, 900, 13, WHITE);
  c.disc(mu, peakY, 13, WHITE);
  fs.writeFileSync(path.join(imgDir, 'apple-touch-icon.png'), c.toPng());
  console.log('assets/img/apple-touch-icon.png  180x180');
})();

/* --- vector marks ---------------------------------------------------------- */
var FAVICON =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">' +
  '<rect width="32" height="32" rx="8" fill="#1f4470"/>' +
  '<path d="M4.5 24.5C9.5 24.5 10 7.5 16 7.5s6.5 17 11.5 17" fill="none" stroke="#fff" ' +
  'stroke-width="2.5" stroke-linecap="round"/>' +
  '<circle cx="16" cy="7.5" r="2.4" fill="#fff"/></svg>\n';

var LOGO =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 48" width="240" height="48">' +
  '<rect width="32" height="32" y="8" rx="8" fill="#1f4470"/>' +
  '<path d="M4.5 32.5C9.5 32.5 10 15.5 16 15.5s6.5 17 11.5 17" fill="none" stroke="#fff" ' +
  'stroke-width="2.5" stroke-linecap="round"/>' +
  '<circle cx="16" cy="15.5" r="2.4" fill="#fff"/>' +
  '<text x="44" y="32" font-family="system-ui,-apple-system,Segoe UI,Roboto,sans-serif" ' +
  'font-size="21" font-weight="650" fill="#17181d">CogniScale</text></svg>\n';

fs.writeFileSync(path.join(root, 'assets', 'favicon.svg'), FAVICON);
fs.writeFileSync(path.join(imgDir, 'logo.svg'), LOGO);
console.log('assets/favicon.svg, assets/img/logo.svg');
