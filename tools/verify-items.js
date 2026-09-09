#!/usr/bin/env node
/* CogniScale - offline item bank verifier.
 *
 * This is the gate that stops a broken item from reaching a test taker. It
 * proves, item by item, the properties that a multiple-choice reasoning item
 * has to have in order for its score to mean anything:
 *
 *   - exactly one option is correct, and it is the keyed one
 *   - no two options are indistinguishable when rendered
 *   - a matrix's answer is genuinely determined by a rule that operates along
 *     the row (otherwise the third column is not inferable)
 *   - a matrix using rotation uses a shape on which rotation is visible
 *   - a logic matrix is explained by exactly one boolean operator
 *   - a series answer is re-derivable from its declared generator
 *   - a spatial target is chiral, so its mirror images are true distractors
 *   - the difficulty ladder covers the range the test claims to measure
 *
 * Run with `npm run verify`. Non-zero exit means do not ship.
 */
'use strict';

var path = require('path');
var matrix  = require('../src/lib/matrix.js');
var series  = require('../src/lib/series.js');
var spatial = require('../src/lib/spatial.js');
var bank    = require('../src/lib/bank.js');
var render  = require('../src/lib/render.js');
var irt     = require('../src/lib/irt.js');
var itemBank = require('../src/data/items.js');

var failures = [];
var warnings = [];
var checks = 0;

function check(cond, id, msg) {
  checks++;
  if (!cond) failures.push(id + ': ' + msg);
}
function warn(cond, id, msg) {
  if (!cond) warnings.push(id + ': ' + msg);
}

// ---------------------------------------------------------------- generic ---

var items = bank.build();

check(items.length === itemBank.ITEMS.length, 'bank', 'presentation order dropped items');

var seenIds = {};
items.forEach(function (it) {
  check(!seenIds[it.id], it.id, 'duplicate item id');
  seenIds[it.id] = true;

  check(it.options && it.options.length >= 4, it.id, 'needs at least 4 options, has ' + (it.options || []).length);
  check(it.answer >= 0 && it.answer < it.options.length, it.id, 'answer index ' + it.answer + ' out of range');
  check(typeof it.b === 'number' && isFinite(it.b), it.id, 'missing or non-finite difficulty b');
  check(typeof it.a === 'number' && it.a > 0, it.id, 'missing or non-positive discrimination a');
  check(Math.abs(it.c - 1 / it.options.length) < 1e-9, it.id, 'guessing parameter c does not match option count');
  check(!!it.rationale && it.rationale.length > 20, it.id, 'missing or too-short rationale');
});

// ----------------------------------------------------------------- matrix ---

itemBank.MR.forEach(function (spec) {
  var it = bank.buildOne(spec);
  var id = spec.id;

  check(it.options.length === 6, id, 'matrix items should offer 6 options, has ' + it.options.length);

  if (spec.family === 'attr') {
    var sigs = it.options.map(matrix.signature);
    var uniq = {};
    sigs.forEach(function (s) { uniq[s] = true; });
    check(Object.keys(uniq).length === sigs.length, id, 'two options render identically');

    var correctSig = matrix.signature(it.correct);
    var nMatching = sigs.filter(function (s) { return s === correctSig; }).length;
    check(nMatching === 1, id, 'expected exactly 1 correct option, found ' + nMatching);
    check(matrix.signature(it.options[it.answer]) === correctSig, id, 'keyed answer is not the correct cell');

    // the third column must be inferable: at least one rule varies along a row
    var rowVary = matrix.rowVaryingAttrs(spec);
    check(rowVary.length >= 1, id, 'no rule varies along a row - the answer is not inferable');

    // rotation must be visible on the shape used
    if (spec.rules.rot && spec.rules.rot.kind !== 'fixed') {
      var shapesUsed = {};
      it.grid.forEach(function (row) { row.forEach(function (c) { shapesUsed[c.shape] = true; }); });
      Object.keys(shapesUsed).forEach(function (s) {
        check(matrix.ROT_SAFE.indexOf(s) !== -1, id,
          'varies rotation on shape "' + s + '", where some rotations are visually identical');
      });

      /* Being on a rotation-safe shape is not enough. A regular shape maps onto
       * itself every 360/n degrees, so two rotation values that differ by close
       * to a whole symmetry step look nearly identical on screen - an
       * equilateral triangle at 0 and at 135 degrees differs by only 15. Reduce
       * every angle into one symmetry period and demand real separation. */
      var SYM_ORDER = { triangle: 3, square: 4, diamond: 4, pentagon: 5, hexagon: 6, star: 5 };
      var MIN_SEP = 25;
      var angles = spec.rules.rot.domain || [];
      Object.keys(shapesUsed).forEach(function (shp) {
        var order = SYM_ORDER[shp];
        if (!order) return;
        var period = 360 / order;
        var eff = angles.map(function (a) { return ((a % period) + period) % period; });
        for (var x = 0; x < eff.length; x++) {
          for (var y = x + 1; y < eff.length; y++) {
            var d = Math.abs(eff[x] - eff[y]);
            d = Math.min(d, period - d);
            check(d >= MIN_SEP, id, 'rotations ' + angles[x] + ' and ' + angles[y] + ' on a ' + shp +
                  ' are only ' + d.toFixed(0) + ' degrees apart once its ' + period +
                  '-degree symmetry is allowed for (need ' + MIN_SEP + ')');
          }
        }
      });
    }

    // every rule domain is well formed
    Object.keys(spec.rules).forEach(function (attr) {
      var r = spec.rules[attr];
      if (r.kind === 'latin') check(r.domain.length === 3, id, 'latin rule on ' + attr + ' needs exactly 3 values');
      if (r.kind === 'constant') check(r.domain.length === 3, id, 'constant rule on ' + attr + ' needs exactly 3 values');
      if (r.kind === 'progress') {
        check(r.starts && r.starts.length === 3, id, 'progress rule on ' + attr + ' needs 3 starts');

        /* A progress rule steps modulo its domain, so it can silently wrap.
         * That is fine when the solver can SEE a wrap somewhere in the grid and
         * infer that the sequence cycles. It is not fine when the only wrap in
         * the whole matrix is the hidden answer cell: the visible evidence then
         * points at a value that is not offered, and the keyed answer requires
         * assuming a cycle nothing demonstrated. */
        if (r.domain && r.starts) {
          var n = r.domain.length, wrapCells = [];
          for (var rr = 0; rr < 3; rr++) {
            for (var cc = 0; cc < 3; cc++) {
              var raw = r.starts[rr] + cc * r.step;
              if (raw < 0 || raw >= n) wrapCells.push(rr + ',' + cc);
            }
          }
          var onlyAtAnswer = wrapCells.length === 1 && wrapCells[0] === '2,2';
          check(!onlyAtAnswer, id, 'progress rule on ' + attr + ' wraps ONLY at the hidden ' +
                'answer cell - the visible grid implies a different, unoffered value');
        }
      }
      if (r.kind !== 'fixed') {
        check(matrix.DOMAIN[attr] != null, id, 'rule on unknown attribute ' + attr);
        r.domain.forEach(function (v) {
          check(matrix.DOMAIN[attr].indexOf(v) !== -1, id, 'value "' + v + '" not in domain of ' + attr);
        });
      }
    });
  } else {
    // logic family: exactly one operator explains all three rows
    var consistent = matrix.OP_NAMES.filter(function (name) {
      return it.rows.every(function (row) {
        return (matrix.OPS[name](row[0], row[1]) & matrix.MASK) === row[2];
      });
    });
    check(consistent.length === 1, id, 'logic matrix is explained by ' + consistent.length + ' operators, must be exactly 1');
    check(consistent[0] === spec.op, id, 'logic matrix resolves to "' + consistent[0] + '" not the declared "' + spec.op + '"');

    var u = {};
    it.options.forEach(function (o) { u[o] = true; });
    check(Object.keys(u).length === it.options.length, id, 'duplicate options');
    check(it.options[it.answer] === it.correct, id, 'keyed answer is not the correct figure');
    check(it.options.filter(function (o) { return o === it.correct; }).length === 1, id, 'correct figure appears more than once');

    it.rows.forEach(function (row, i) {
      row.forEach(function (cellBits, j) {
        var n = matrix.popcount(cellBits);
        warn(n >= 1 && n <= 8, id, 'row ' + i + ' cell ' + j + ' has ' + n + ' marks (hard to read)');
      });
    });
  }
});

// every drawn cell has to fit inside its 104-unit box, or the figure is clipped
itemBank.MR.filter(function (s) { return s.family !== 'logic'; }).forEach(function (spec) {
  var it = bank.buildOne(spec);
  var cells = [];
  it.grid.forEach(function (row) { row.forEach(function (c) { cells.push(c); }); });
  it.options.forEach(function (c) { cells.push(c); });
  cells.forEach(function (c) {
    var e = render.attrCellExtent(c);
    check(e <= 52, spec.id, 'a figure reaches ' + e.toFixed(1) + ' units from centre and would be clipped (max 52): ' +
      JSON.stringify(c));
  });
});

// ----------------------------------------------------------------- series ---

itemBank.NL.forEach(function (spec) {
  var it = bank.buildOne(spec);
  var id = spec.id;

  // re-derive the answer straight from the declared generator
  var derived = series.terms(spec.gen, spec.show + 1);
  var expected = derived[spec.show];
  check(it.correct === expected, id, 'keyed answer ' + it.correct + ' does not match generator output ' + expected);
  check(String(it.shown.join(',')) === String(derived.slice(0, spec.show).join(',')), id, 'displayed terms do not match the generator');
  check(it.options[it.answer] === expected, id, 'answer index does not point at the generated term');

  var u = {};
  it.options.forEach(function (o) { u[String(o)] = true; });
  check(Object.keys(u).length === it.options.length, id, 'duplicate options');
  check(it.options.filter(function (o) { return o === expected; }).length === 1, id, 'correct term appears more than once');
  check(it.shown.length >= 4, id, 'fewer than 4 visible terms is not enough to fix a rule');

  if (series.isNumeric(spec.gen)) {
    it.options.forEach(function (o) {
      check(typeof o === 'number' && isFinite(o), id, 'non-numeric option in a numeric series');
      check(Math.abs(o) < 1e7, id, 'option magnitude is unreasonable: ' + o);
    });
  } else {
    var len = String(expected).length;
    it.options.forEach(function (o) {
      check(String(o).length === len, id, 'option "' + o + '" has a different shape from the answer, which gives it away');
    });
  }
});

// ---------------------------------------------------------------- spatial ---

itemBank.SR.forEach(function (spec) {
  var it = bank.buildOne(spec);
  var id = spec.id;

  check(spatial.isChiral(spec.cells), id, 'target figure is not chiral - its mirror image IS a rotation, so distractors would also be correct');
  check(spatial.connected(spec.cells), id, 'target figure is not a connected polyomino');

  var targetCanon = spatial.canonical(it.target);
  var matching = it.options.filter(function (o) { return spatial.canonical(o) === targetCanon; });
  check(matching.length === 1, id, 'expected exactly 1 rotation of the target among the options, found ' + matching.length);
  check(spatial.canonical(it.options[it.answer]) === targetCanon, id, 'keyed answer is not a rotation of the target');

  var keys = {};
  it.options.forEach(function (o) { keys[spatial.key(o)] = true; });
  check(Object.keys(keys).length === it.options.length, id, 'two options are the same figure in the same orientation');

  it.options.forEach(function (o) {
    check(o.length === spec.cells.length, id, 'an option has a different number of cells from the target');
  });
});

// ----------------------------------------------------------------- verbal ---

itemBank.VR.forEach(function (spec) {
  var it = bank.buildOne(spec);
  var id = spec.id;

  check(spec.options.indexOf(spec.answerText) !== -1, id, 'answerText is not one of the options');
  check(it.options[it.answer] === spec.answerText, id, 'answer index does not point at answerText');

  var u = {};
  spec.options.forEach(function (o) { u[o.toLowerCase().trim()] = true; });
  check(Object.keys(u).length === spec.options.length, id, 'duplicate options');
  check(!!spec.stem && spec.stem.length > 10, id, 'missing or trivial stem');
  check(spec.options.length === 5, id, 'verbal items should offer 5 options, has ' + spec.options.length);
});

// -------------------------------------------------------- bank-level tests --

var bs = items.map(function (i) { return i.b; }).sort(function (x, y) { return x - y; });
check(bs[0] <= -1.5, 'bank', 'no easy items: lowest difficulty is ' + bs[0].toFixed(2));
check(bs[bs.length - 1] >= 1.5, 'bank', 'no hard items: highest difficulty is ' + bs[bs.length - 1].toFixed(2));

// no large gap in the difficulty ladder - a gap means a band of ability the
// test cannot separate
var maxGap = 0, gapAt = null;
for (var i = 1; i < bs.length; i++) {
  var g = bs[i] - bs[i - 1];
  if (g > maxGap) { maxGap = g; gapAt = bs[i - 1]; }
}
warn(maxGap < 0.6, 'bank', 'difficulty gap of ' + maxGap.toFixed(2) + ' near theta=' + (gapAt || 0).toFixed(2));

// every domain represented, and each domain's ladder rises
['MR', 'NL', 'VR', 'SR'].forEach(function (d) {
  var inDomain = items.filter(function (i) { return i.domain === d; });
  check(inDomain.length >= 5, 'bank', 'domain ' + d + ' has only ' + inDomain.length + ' items');
});

// measurement precision across the reportable range
var scoreCurve = [];
for (var t = -2.0; t <= 2.01; t += 0.5) {
  var info = items.reduce(function (acc, it) { return acc + irt.information(t, it); }, 0);
  var sem = 1 / Math.sqrt(info);
  scoreCurve.push({ theta: t, iq: Math.round(100 + 15 * t), sem: 15 * sem, info: info });
  check(info > 0.9, 'bank', 'test information is only ' + info.toFixed(2) + ' at theta=' + t.toFixed(1) +
    ' (SEM ' + (15 * sem).toFixed(1) + ' IQ points) - too imprecise to report');
}

// ------------------------------------------------------------------ report --

console.log('CogniScale item bank verification');
console.log('=================================');
console.log('items: ' + items.length + '   assertions: ' + checks);
console.log('');
console.log('  domain  n   b range          mean a');
['MR', 'NL', 'VR', 'SR'].forEach(function (d) {
  var xs = items.filter(function (i) { return i.domain === d; });
  var bsD = xs.map(function (i) { return i.b; });
  var meanA = xs.reduce(function (s, i) { return s + i.a; }, 0) / xs.length;
  console.log('  ' + d.padEnd(7) + String(xs.length).padEnd(4) +
    (Math.min.apply(null, bsD).toFixed(2) + ' .. ' + Math.max.apply(null, bsD).toFixed(2)).padEnd(17) +
    meanA.toFixed(2));
});

console.log('');
console.log('  measurement precision (from test information)');
console.log('    IQ    SEM     95% CI width');
scoreCurve.forEach(function (p) {
  console.log('   ' + String(p.iq).padStart(4) + '   ' + p.sem.toFixed(2).padStart(5) +
    '   +/-' + (1.96 * p.sem).toFixed(1));
});

if (warnings.length) {
  console.log('');
  console.log('WARNINGS (' + warnings.length + ')');
  warnings.forEach(function (w) { console.log('  ! ' + w); });
}

console.log('');
if (failures.length) {
  console.log('FAILED (' + failures.length + ' of ' + checks + ' assertions)');
  failures.forEach(function (f) { console.log('  x ' + f); });
  process.exit(1);
}
console.log('PASSED - all ' + checks + ' assertions hold. Bank is safe to ship.');
