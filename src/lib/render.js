/* CogniScale - SVG renderers.
 *
 * Pure string-producing functions, so the same code draws the live test in the
 * browser and the offline contact sheet used to eyeball every item before
 * release. Figures use var(--fig-ink) rather than a hard-coded colour, so they
 * invert correctly in dark mode.
 *
 * Shared fill patterns live in one document-level <defs> (see defs()), emitted
 * once per page; every figure references them by id.
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) { module.exports = factory(require('./spatial.js')); }
  else { root.CS = root.CS || {}; root.CS.render = factory(root.CS.spatial); }
}(typeof self !== 'undefined' ? self : this, function (spatial) {
  'use strict';

  var INK = 'var(--fig-ink, #1c1e26)';

  function defs() {
    return '<svg class="cs-defs" aria-hidden="true" focusable="false" width="0" height="0">' +
      '<defs>' +
      '<pattern id="cs-hatch" patternUnits="userSpaceOnUse" width="7" height="7" patternTransform="rotate(45)">' +
        '<line x1="0" y1="0" x2="0" y2="7" stroke="' + INK + '" stroke-width="2.4"/>' +
      '</pattern>' +
      '<pattern id="cs-dots" patternUnits="userSpaceOnUse" width="8" height="8">' +
        '<circle cx="2.6" cy="2.6" r="1.7" fill="' + INK + '"/>' +
      '</pattern>' +
      '</defs></svg>';
  }

  // ------------------------------------------------------------- geometry ---

  function polygonPoints(n, r, startDeg) {
    var pts = [];
    for (var i = 0; i < n; i++) {
      var a = ((startDeg + i * (360 / n)) * Math.PI) / 180;
      pts.push((Math.cos(a) * r).toFixed(2) + ',' + (Math.sin(a) * r).toFixed(2));
    }
    return pts.join(' ');
  }

  function starPoints(r, inner) {
    var pts = [];
    for (var i = 0; i < 10; i++) {
      var rad = i % 2 === 0 ? r : r * inner;
      var a = ((-90 + i * 36) * Math.PI) / 180;
      pts.push((Math.cos(a) * rad).toFixed(2) + ',' + (Math.sin(a) * rad).toFixed(2));
    }
    return pts.join(' ');
  }

  function fillAttr(fill) {
    switch (fill) {
      case 'solid': return 'fill="' + INK + '" fill-opacity="1"';
      case 'light': return 'fill="' + INK + '" fill-opacity="0.22"';
      case 'hatch': return 'fill="url(#cs-hatch)"';
      case 'dots':  return 'fill="url(#cs-dots)"';
      default:      return 'fill="none"';
    }
  }

  function shapeEl(shape, r, fill) {
    var f = fillAttr(fill);
    var stroke = 'stroke="' + INK + '" stroke-width="3" stroke-linejoin="round"';
    switch (shape) {
      case 'circle':   return '<circle cx="0" cy="0" r="' + r.toFixed(2) + '" ' + f + ' ' + stroke + '/>';
      case 'square':   return '<rect x="' + (-r * 0.86).toFixed(2) + '" y="' + (-r * 0.86).toFixed(2) +
                              '" width="' + (r * 1.72).toFixed(2) + '" height="' + (r * 1.72).toFixed(2) +
                              '" rx="2" ' + f + ' ' + stroke + '/>';
      case 'triangle': return '<polygon points="' + polygonPoints(3, r * 1.12, -90) + '" ' + f + ' ' + stroke + '/>';
      case 'diamond':  return '<polygon points="' + polygonPoints(4, r * 1.12, -90) + '" ' + f + ' ' + stroke + '/>';
      case 'pentagon': return '<polygon points="' + polygonPoints(5, r * 1.06, -90) + '" ' + f + ' ' + stroke + '/>';
      case 'hexagon':  return '<polygon points="' + polygonPoints(6, r * 1.04, -90) + '" ' + f + ' ' + stroke + '/>';
      case 'star':     return '<polygon points="' + starPoints(r * 1.16, 0.45) + '" ' + f + ' ' + stroke + '/>';
      default:         return '';
    }
  }

  var SIZE_SCALE = { sm: 0.62, md: 0.82, lg: 1.0 };

  /* Where to put each copy when an item shows more than one shape. */
  function layout(count) {
    switch (count) {
      case 1:  return [[0, 0]];
      case 2:  return [[-19, 0], [19, 0]];
      case 3:  return [[0, -20], [-20, 15], [20, 15]];
      default: return [[-19, -19], [19, -19], [-19, 19], [19, 19]];
    }
  }
  var COUNT_SHRINK = { 1: 1.0, 2: 0.68, 3: 0.60, 4: 0.58 };

  // ------------------------------------------------- matrix cells (family A) --

  function attrCell(cell) {
    var n = cell.count || 1;
    var base = 30 * (SIZE_SCALE[cell.size] || 0.82) * (COUNT_SHRINK[n] || 0.6);
    var spots = layout(n);
    var out = '';
    for (var i = 0; i < n; i++) {
      var t = 'translate(' + (50 + spots[i][0]) + ',' + (50 + spots[i][1]) + ')';
      if (cell.rot) t += ' rotate(' + cell.rot + ')';
      out += '<g transform="' + t + '">' + shapeEl(cell.shape, base, cell.fill) + '</g>';
    }
    return out;
  }

  /* Furthest any ink in this cell reaches from the cell centre, in viewBox
   * units. The drawing area is 104 wide, so anything at or above 52 would be
   * clipped by the cell border. Exposed so the verifier can assert that no
   * combination of size, count and shape overflows its box. */
  var SHAPE_REACH = {
    circle: 1.0, square: 1.22, triangle: 1.12, diamond: 1.12,
    pentagon: 1.06, hexagon: 1.04, star: 1.16
  };

  function attrCellExtent(cell) {
    var n = cell.count || 1;
    var base = 30 * (SIZE_SCALE[cell.size] || 0.82) * (COUNT_SHRINK[n] || 0.6);
    var reach = base * (SHAPE_REACH[cell.shape] || 1.2) + 1.5; // +1.5 for stroke width
    var spots = layout(n);
    var max = 0;
    for (var i = 0; i < spots.length; i++) {
      var d = Math.max(Math.abs(spots[i][0]), Math.abs(spots[i][1])) + reach;
      if (d > max) max = d;
    }
    return max;
  }

  // -------------------------------------------------- logic cells (family B) --

  function logicCell(bitsValue) {
    var out = '';
    for (var i = 0; i < 9; i++) {
      var on = (bitsValue >> i) & 1;
      var col = i % 3, row = Math.floor(i / 3);
      var cx = 22 + col * 28, cy = 22 + row * 28;
      out += '<rect x="' + (cx - 10) + '" y="' + (cy - 10) + '" width="20" height="20" rx="3" ' +
             'fill="' + (on ? INK : 'none') + '" fill-opacity="' + (on ? 1 : 0) + '" ' +
             'stroke="' + INK + '" stroke-opacity="' + (on ? 1 : 0.17) + '" stroke-width="1.6"/>';
    }
    return out;
  }

  function cellContent(item, cell) {
    return item.family === 'logic' ? logicCell(cell) : attrCell(cell);
  }

  // -------------------------------------------------------- matrix figure ----

  /* The 3x3 stimulus with the bottom-right cell left blank. */
  function matrixStimulus(item) {
    var cells = [];
    for (var r = 0; r < 3; r++) {
      for (var c = 0; c < 3; c++) {
        var isBlank = (r === 2 && c === 2);
        var x = c * 104, y = r * 104;
        var body;
        if (isBlank) {
          body = '<text x="52" y="52" text-anchor="middle" dominant-baseline="central" ' +
                 'font-size="38" font-weight="600" fill="' + INK + '" fill-opacity="0.32">?</text>';
        } else {
          var cell = item.family === 'logic' ? item.rows[r][c] : item.grid[r][c];
          body = cellContent(item, cell);
        }
        cells.push(
          '<g transform="translate(' + x + ',' + y + ')">' +
            '<rect x="1" y="1" width="102" height="102" rx="7" fill="none" ' +
              'stroke="var(--fig-grid, #c9c6bf)" stroke-width="1.5"' +
              (isBlank ? ' stroke-dasharray="5 4"' : '') + '/>' +
            body +
          '</g>'
        );
      }
    }
    return '<svg class="cs-fig cs-fig-matrix" viewBox="0 0 312 312" role="img" ' +
           'aria-label="Three by three matrix of figures with the bottom-right cell missing">' +
           cells.join('') + '</svg>';
  }

  /* One answer option for a matrix item. */
  function matrixOption(item, cell) {
    return '<svg class="cs-fig cs-fig-opt" viewBox="0 0 104 104" aria-hidden="true" focusable="false">' +
           '<g transform="translate(2,2)">' + cellContent(item, cell) + '</g></svg>';
  }

  // ------------------------------------------------------- spatial figures ---

  function polyomino(cells, opts) {
    opts = opts || {};
    var unit = opts.unit || 22;
    var pad = opts.pad || 6;
    var b = spatial.bounds(cells);
    var w = b.w * unit + pad * 2;
    var h = b.h * unit + pad * 2;
    var maxDim = Math.max(w, h);
    var offX = pad + (maxDim - w) / 2;
    var offY = pad + (maxDim - h) / 2;

    var rects = cells.map(function (p) {
      return '<rect x="' + (offX + p[0] * unit).toFixed(1) + '" y="' + (offY + p[1] * unit).toFixed(1) +
             '" width="' + unit + '" height="' + unit + '" rx="2.5" ' +
             'fill="' + INK + '" fill-opacity="0.16" stroke="' + INK + '" stroke-width="2.2" stroke-linejoin="round"/>';
    }).join('');

    return '<svg class="cs-fig ' + (opts.className || '') + '" viewBox="0 0 ' + maxDim.toFixed(1) + ' ' + maxDim.toFixed(1) + '" ' +
           (opts.label ? 'role="img" aria-label="' + opts.label + '"' : 'aria-hidden="true" focusable="false"') +
           '>' + rects + '</svg>';
  }

  function spatialStimulus(item) {
    return polyomino(item.target, { unit: 26, className: 'cs-fig-target', label: 'The target figure' });
  }
  function spatialOption(item, cells) {
    return polyomino(cells, { unit: 22, className: 'cs-fig-opt' });
  }

  // ---------------------------------------------------------- series text ----

  function seriesStimulus(item) {
    var parts = item.shown.map(function (t) {
      return '<span class="cs-term">' + t + '</span>';
    });
    parts.push('<span class="cs-term cs-term-blank" aria-label="missing term">?</span>');
    return '<div class="cs-series" role="img" aria-label="Series: ' +
           item.shown.join(', ') + ', then a missing term">' + parts.join('<span class="cs-comma">,</span>') + '</div>';
  }

  // -------------------------------------------------------------- dispatch ---

  function stimulus(item) {
    switch (item.type) {
      case 'matrix':  return matrixStimulus(item);
      case 'series':  return seriesStimulus(item);
      case 'spatial': return spatialStimulus(item);
      case 'verbal':  return '';
      default: throw new Error('render: unknown item type ' + item.type);
    }
  }

  function option(item, value) {
    switch (item.type) {
      case 'matrix':  return matrixOption(item, value);
      case 'spatial': return spatialOption(item, value);
      case 'series':  return '<span class="cs-opt-term">' + value + '</span>';
      case 'verbal':  return '<span class="cs-opt-text">' + escapeHtml(String(value)) + '</span>';
      default: return '';
    }
  }

  function escapeHtml(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  return {
    defs: defs, stimulus: stimulus, option: option,
    matrixStimulus: matrixStimulus, matrixOption: matrixOption,
    spatialStimulus: spatialStimulus, spatialOption: spatialOption,
    seriesStimulus: seriesStimulus, polyomino: polyomino,
    attrCell: attrCell, attrCellExtent: attrCellExtent,
    logicCell: logicCell, escapeHtml: escapeHtml
  };
}));
