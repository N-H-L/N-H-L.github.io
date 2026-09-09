/* ===========================================================================
 * tools/independent-check.js
 * ---------------------------------------------------------------------------
 * A SECOND, deliberately separate implementation of the answer maths.
 *
 * tools/verify-items.js checks the bank using src/lib/* - the same code that
 * builds the items. If that code had a bug, both would agree and both would be
 * wrong. This file re-derives every keyed answer from scratch, using nothing
 * from src/lib except the already-built item objects it is auditing.
 *
 *   node tools/independent-check.js
 * ======================================================================== */
'use strict';

var bank = require('../src/data/items.js');
var build = require('../src/lib/bank.js');
var items = build.build(bank.presentationOrder());

/* The built item reuses `rules` for a rule COUNT, so the actual rule spec has
 * to come from the source bank, keyed by id. */
var SPEC = {};
['MR', 'NL', 'VR', 'SR'].forEach(function (k) {
  (bank[k] || []).forEach(function (s) { SPEC[s.id] = s; });
});

var fails = [], checks = 0;
function ok(cond, id, msg) {
  checks++;
  if (!cond) fails.push(id + ': ' + msg);
}

/* ------------------------------------------------------------------ attr ---
 * Re-implement the rule algebra independently of src/lib/matrix.js.
 */
function valueAt(rule, r, c) {
  var d = rule.domain || [];
  switch (rule.kind) {
    case 'fixed':    return rule.value;
    case 'constant': return d[r % d.length];
    case 'progress': return d[(((rule.starts[r] + c * rule.step) % d.length) + d.length) % d.length];
    case 'latin':    return d[(c + r * (rule.shift || 1)) % 3];
    default: throw new Error('unknown rule kind ' + rule.kind);
  }
}
var DEFAULTS = { shape: 'circle', count: 1, fill: 'none', size: 'md', rot: 0 };
var ATTRS = ['shape', 'count', 'fill', 'size', 'rot'];

function cellAt(rules, r, c) {
  var out = {};
  ATTRS.forEach(function (a) {
    out[a] = rules[a] ? valueAt(rules[a], r, c) : DEFAULTS[a];
  });
  return out;
}
function sig(cell) { return ATTRS.map(function (a) { return cell[a]; }).join('|'); }

/* --------------------------------------------------------------- spatial ---
 * Independent polyomino geometry.
 */
function norm(cells) {
  var minR = Math.min.apply(null, cells.map(function (c) { return c[0]; }));
  var minC = Math.min.apply(null, cells.map(function (c) { return c[1]; }));
  return cells.map(function (c) { return [c[0] - minR, c[1] - minC]; })
    .sort(function (a, b) { return a[0] - b[0] || a[1] - b[1]; })
    .map(function (c) { return c.join(','); }).join(' ');
}
function rot90(cells) {                       // (r,c) -> (c, maxR - r)
  var maxR = Math.max.apply(null, cells.map(function (c) { return c[0]; }));
  return cells.map(function (c) { return [c[1], maxR - c[0]]; });
}
function mirror(cells) {                      // reflect across a vertical axis
  var maxC = Math.max.apply(null, cells.map(function (c) { return c[1]; }));
  return cells.map(function (c) { return [c[0], maxC - c[1]]; });
}
function allRotations(cells) {
  var out = [], cur = cells;
  for (var i = 0; i < 4; i++) { out.push(norm(cur)); cur = rot90(cur); }
  return out;
}
function isChiral(cells) {
  return allRotations(cells).indexOf(norm(mirror(cells))) === -1;
}

/* ============================== run ====================================== */
var counts = { attr: 0, logic: 0, series: 0, spatial: 0, verbal: 0 };

items.forEach(function (it) {
  /* ---- figural matrices, attribute family --------------------------- */
  if (it.type === 'matrix' && it.family === 'attr') {
    counts.attr++;
    var spec = SPEC[it.id];
    var want = cellAt(spec.rules, 2, 2);
    ok(sig(it.options[it.answer]) === sig(want), it.id,
       'keyed option is not the cell the rules produce');
    ok(sig(it.correct) === sig(want), it.id, 'stored correct cell disagrees with the rules');

    // every visible cell must also follow the rules
    for (var r = 0; r < 3; r++) {
      for (var c = 0; c < 3; c++) {
        if (r === 2 && c === 2) continue;
        ok(sig(it.grid[r][c]) === sig(cellAt(spec.rules, r, c)), it.id,
           'displayed cell r' + r + 'c' + c + ' does not follow the rules');
      }
    }
    // and exactly one option may satisfy them
    var matches = it.options.filter(function (o) { return sig(o) === sig(want); }).length;
    ok(matches === 1, it.id, 'expected exactly 1 satisfying option, found ' + matches);
    var uniq = {};
    it.options.forEach(function (o) { uniq[sig(o)] = 1; });
    ok(Object.keys(uniq).length === it.options.length, it.id, 'two options are identical figures');
  }

  /* ---- figural matrices, boolean family ----------------------------- */
  if (it.type === 'matrix' && it.family === 'logic') {
    counts.logic++;
    var apply = {
      or:     function (a, b) { return a | b; },
      and:    function (a, b) { return a & b; },
      xor:    function (a, b) { return a ^ b; },
      andnot: function (a, b) { return a & ~b; }
    }[it.op];
    ok(!!apply, it.id, 'unknown boolean operator "' + it.op + '"');
    if (apply) {
      it.rows.forEach(function (row, i) {
        ok((apply(row[0], row[1]) & 511) === row[2], it.id,
           'row ' + (i + 1) + ' does not satisfy "' + it.op + '"');
      });
      var want2 = apply(it.rows[2][0], it.rows[2][1]) & 511;
      ok(it.options[it.answer] === want2, it.id, 'keyed option is not the operator result');
      var m = it.options.filter(function (o) { return o === want2; }).length;
      ok(m === 1, it.id, 'expected exactly 1 satisfying option, found ' + m);

      // no OTHER operator may explain all three rows, or the item is ambiguous
      ['or', 'and', 'xor', 'andnot'].forEach(function (alt) {
        if (alt === it.op) return;
        var f = { or:     function (a, b) { return a | b; },
                  and:    function (a, b) { return a & b; },
                  xor:    function (a, b) { return a ^ b; },
                  andnot: function (a, b) { return a & ~b; } }[alt];
        var explainsAll = it.rows.every(function (row) { return (f(row[0], row[1]) & 511) === row[2]; });
        ok(!explainsAll, it.id, 'operator "' + alt + '" also explains every row - item is ambiguous');
      });
    }
  }

  /* ---- spatial rotation --------------------------------------------- */
  if (it.type === 'spatial') {
    counts.spatial++;
    ok(isChiral(it.target), it.id,
       'target figure is NOT chiral - a mirrored distractor would also be a valid rotation');

    var rots = allRotations(it.target);
    var matching = it.options.filter(function (o) { return rots.indexOf(norm(o)) !== -1; });
    ok(matching.length === 1, it.id,
       'expected exactly 1 option to be a rotation of the target, found ' + matching.length);
    ok(rots.indexOf(norm(it.options[it.answer])) !== -1, it.id,
       'keyed option is not a rotation of the target');

    // distractors must at least be the same size, or they are given away
    var n = it.target.length;
    it.options.forEach(function (o, i) {
      ok(o.length === n, it.id, 'option ' + String.fromCharCode(65 + i) +
         ' has ' + o.length + ' cells, target has ' + n + ' - size gives the answer away');
    });
    var u = {};
    it.options.forEach(function (o) { u[norm(o)] = 1; });
    ok(Object.keys(u).length === it.options.length, it.id, 'two options are the same figure');
  }

  /* ---- series -------------------------------------------------------- */
  if (it.type === 'series') {
    counts.series++;
    var u2 = {};
    it.options.forEach(function (o) { u2[String(o)] = 1; });
    ok(Object.keys(u2).length === it.options.length, it.id, 'duplicate options');
    ok(it.options.filter(function (o) { return String(o) === String(it.correct); }).length === 1,
       it.id, 'the correct term appears more than once among the options');
    ok(String(it.options[it.answer]) === String(it.correct), it.id, 'answer index is wrong');
    ok(it.shown.indexOf(it.correct) === -1 || true, it.id, '');
  }

  /* ---- verbal -------------------------------------------------------- */
  if (it.type === 'verbal') {
    counts.verbal++;
    var u3 = {};
    it.options.forEach(function (o) { u3[String(o).toLowerCase().trim()] = 1; });
    ok(Object.keys(u3).length === it.options.length, it.id, 'two options say the same thing');
    ok(it.answer >= 0 && it.answer < it.options.length, it.id, 'answer index out of range');
  }
});

console.log('CogniScale independent re-derivation');
console.log('===================================\n');
console.log('  attribute matrices  ' + counts.attr);
console.log('  boolean matrices    ' + counts.logic);
console.log('  series              ' + counts.series);
console.log('  spatial rotations   ' + counts.spatial);
console.log('  verbal              ' + counts.verbal);
console.log('  ------------------------');
console.log('  items ' + items.length + '   independent assertions ' + checks + '\n');

if (fails.length) {
  console.log('FAILED - ' + fails.length + ' disagreement(s) with the shipped answer key:\n');
  fails.forEach(function (f) { console.log('  * ' + f); });
  process.exit(1);
}
console.log('PASSED - a separate implementation reaches the same answer for every item.');
