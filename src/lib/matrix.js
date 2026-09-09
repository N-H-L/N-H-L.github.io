/* CogniScale - figural matrix reasoning engine.
 *
 * Two item families:
 *   A) "attr"  3x3 matrices whose cells are described by visual attributes
 *              (shape, count, fill, size, rotation), each attribute governed by
 *              one rule from the Carpenter/Just/Shell taxonomy:
 *                 constant-in-a-row, progression, distribution-of-three.
 *   B) "logic" 3x3 matrices whose cells are 3x3 mark grids, where the third
 *              cell in each row is a boolean function (OR/AND/XOR/ANDNOT) of
 *              the first two.
 *
 * Item difficulty rises with the number of simultaneously governing rules,
 * which is the standard difficulty driver reported for matrix tests.
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) { module.exports = factory(require('./prng.js')); }
  else { root.CS = root.CS || {}; root.CS.matrix = factory(root.CS.prng); }
}(typeof self !== 'undefined' ? self : this, function (prng) {
  'use strict';

  var DOMAIN = {
    shape: ['circle', 'square', 'triangle', 'diamond', 'pentagon', 'hexagon', 'star'],
    count: [1, 2, 3, 4],
    fill:  ['none', 'light', 'solid', 'hatch', 'dots'],
    size:  ['sm', 'md', 'lg'],
    rot:   [0, 30, 45, 60, 90, 135]
  };

  var ATTRS = ['shape', 'count', 'fill', 'size', 'rot'];
  var DEFAULT_CELL = { shape: 'circle', count: 1, fill: 'none', size: 'md', rot: 0 };

  /* Shapes whose four rotation steps are all visually distinct.
   * Excluded: circle (fully symmetric), square + diamond (90 degree symmetry
   * makes 0/90 and 45/135 identical). The verifier enforces this. */
  var ROT_SAFE = ['triangle', 'pentagon', 'hexagon', 'star'];

  // ---------------------------------------------------------------- rules ---

  function valueAt(rule, r, c) {
    var d = rule.domain || [];
    var n, i;
    switch (rule.kind) {
      case 'fixed':
        return rule.value;
      case 'constant':                      // constant along each row
        return d[r % d.length];
      case 'progress':                      // steps by rule.step along the row
        n = d.length;
        i = (rule.starts[r] + c * rule.step) % n;
        return d[((i % n) + n) % n];
      case 'latin':                         // distribution-of-three (Latin square)
        return d[(c + r * (rule.shift || 1)) % 3];
      default:
        throw new Error('matrix: unknown rule kind "' + rule.kind + '"');
    }
  }

  function buildGrid(spec) {
    var grid = [];
    for (var r = 0; r < 3; r++) {
      var row = [];
      for (var c = 0; c < 3; c++) {
        var cell = {};
        for (var i = 0; i < ATTRS.length; i++) {
          var a = ATTRS[i];
          cell[a] = spec.rules[a] ? valueAt(spec.rules[a], r, c) : DEFAULT_CELL[a];
        }
        row.push(cell);
      }
      grid.push(row);
    }
    return grid;
  }

  /* Attributes that change anywhere in the matrix. */
  function varyingAttrs(spec) {
    return ATTRS.filter(function (a) {
      var rule = spec.rules && spec.rules[a];
      return rule && rule.kind !== 'fixed';
    });
  }

  /* Attributes that change along a row. These are what the third column
   * depends on, and therefore what a distractor must get wrong. */
  function rowVaryingAttrs(spec) {
    return ATTRS.filter(function (a) {
      var rule = spec.rules && spec.rules[a];
      return rule && (rule.kind === 'progress' || rule.kind === 'latin');
    });
  }

  /* A cell's visual signature. Attributes that cannot be seen for a given shape
   * are normalised away, so two options that render identically can never be
   * counted as distinct. */
  function signature(cell) {
    var rot = cell.rot;
    if (cell.shape === 'circle') rot = 0;
    else if (cell.shape === 'square' || cell.shape === 'diamond') rot = rot % 90;
    return [cell.shape, cell.count, cell.fill, cell.size, rot].join('|');
  }

  function sameCell(a, b) { return signature(a) === signature(b); }

  function cloneCell(cell) {
    var out = {};
    for (var k in cell) { if (Object.prototype.hasOwnProperty.call(cell, k)) out[k] = cell[k]; }
    return out;
  }

  // ---------------------------------------------------------- distractors ---

  /* When the attribute is governed by a rule, draw the wrong value from that
   * rule's OWN domain rather than the global one. A distractor built from a
   * value the matrix never shows is not a plausible reasoning error, and for
   * rotation it can be actively unfair: an angle outside the rule's domain may
   * land within a few degrees of the correct one once the shape's rotational
   * symmetry is taken into account, making two options look the same. */
  function perturb(cell, attr, rnd, spec) {
    var rule = spec && spec.rules && spec.rules[attr];
    var source = (rule && rule.kind !== 'fixed' && rule.domain && rule.domain.length > 1)
      ? rule.domain
      : DOMAIN[attr];
    var others = source.filter(function (v) { return v !== cell[attr]; });
    if (!others.length) others = DOMAIN[attr].filter(function (v) { return v !== cell[attr]; });
    var out = cloneCell(cell);
    out[attr] = others[rnd.int(others.length)];
    return out;
  }

  /* Six options: the correct completion plus five principled distractors.
   *   - repetition errors  (a cell copied from elsewhere in the matrix)
   *   - wrong-rule errors  (the row rule carried one step too far)
   *   - difference errors  (correct answer with one governing attribute wrong)
   * Collisions are repaired deterministically, then asserted by the verifier. */
  function buildOptions(spec, grid, rnd) {
    var correct = grid[2][2];
    var rowVary = rowVaryingAttrs(spec);
    var vary = varyingAttrs(spec);
    var pool = rowVary.length ? rowVary : vary;
    var cands = [];

    function push(cell) {
      if (!cell) return;
      if (sameCell(cell, correct)) return;
      for (var i = 0; i < cands.length; i++) { if (sameCell(cands[i], cell)) return; }
      cands.push(cell);
    }

    // repetition errors
    push(grid[2][1]);
    push(grid[1][2]);
    push(grid[1][1]);

    // wrong-rule error: carry each row rule one extra step
    var overshoot = cloneCell(correct);
    rowVary.forEach(function (a) { overshoot[a] = valueAt(spec.rules[a], 2, 3); });
    push(overshoot);

    // difference errors: one governing attribute wrong at a time
    for (var i = 0; i < pool.length && cands.length < 5; i++) {
      push(perturb(correct, pool[i], rnd, spec));
    }

    // two-attribute error
    if (pool.length >= 2) push(perturb(perturb(correct, pool[0], rnd, spec), pool[1], rnd, spec));

    /* Top up deterministically. Governing attributes are preferred because
     * those distractors are the psychologically interesting ones, but a
     * distractor that alters a non-governing attribute is equally, verifiably
     * wrong - it violates the implicit "this attribute is constant" rule - so
     * the pool widens to every attribute when the governing ones run dry.
     * Rotation is only usable on shapes where it is actually visible. */
    var wide = pool.slice();
    ATTRS.forEach(function (a) {
      if (wide.indexOf(a) !== -1) return;
      if (a === 'rot' && ROT_SAFE.indexOf(correct.shape) === -1) return;
      wide.push(a);
    });
    if (!wide.length) wide = ['fill'];

    var guard = 0;
    while (cands.length < 5 && guard < 600) {
      var attr = wide[guard % wide.length];
      var base = cands.length ? cands[guard % cands.length] : correct;
      push(perturb(base, attr, rnd, spec));
      guard++;
    }

    var options = rnd.shuffle(cands.slice(0, 5).concat([correct]));
    var answer = -1;
    for (var j = 0; j < options.length; j++) { if (sameCell(options[j], correct)) answer = j; }
    return { options: options, answer: answer, correct: correct };
  }

  // -------------------------------------------------- family B: mark logic ---

  var OPS = {
    or:     function (a, b) { return a | b; },
    and:    function (a, b) { return a & b; },
    xor:    function (a, b) { return a ^ b; },
    andnot: function (a, b) { return a & ~b; }
  };
  var OP_NAMES = ['or', 'and', 'xor', 'andnot'];
  var MASK = 0x1FF; // nine mark positions

  function bits(n) { return n & MASK; }

  function popcount(n) {
    var c = 0;
    n = n & MASK;
    while (n) { n &= n - 1; c++; }
    return c;
  }

  /* Build three rows of (a, b, op(a,b)) such that the intended operator is the
   * ONLY one of the four that reproduces all three rows. */
  function buildLogicGrid(spec, rnd, depth) {
    var f = OPS[spec.op];
    if (!f) throw new Error('matrix: unknown op "' + spec.op + '" for ' + spec.id);
    var rows = [];
    var guard = 0;

    while (rows.length < 3 && guard < 8000) {
      guard++;
      var a = bits(rnd.int(512));
      var b = bits(rnd.int(512));
      var out = bits(f(a, b));
      if (popcount(a) < 2 || popcount(a) > 6) continue;  // keep cells readable
      if (popcount(b) < 2 || popcount(b) > 6) continue;
      if (popcount(out) < 1 || popcount(out) > 7) continue;
      if (out === a || out === b) continue;              // non-degenerate
      if (bits(a & b) === 0) continue;                   // forces OR != XOR
      rows.push([a, b, out]);
    }
    if (rows.length < 3) throw new Error('matrix: could not build logic grid for ' + spec.id);

    var consistent = OP_NAMES.filter(function (name) {
      return rows.every(function (row) { return bits(OPS[name](row[0], row[1])) === row[2]; });
    });
    if (consistent.length !== 1) {
      var d = (depth || 0) + 1;
      if (d > 12) throw new Error('matrix: ambiguous logic grid for ' + spec.id);
      return buildLogicGrid(spec, prng.make(spec.id + ':retry' + d), d);
    }
    return rows;
  }

  function buildLogicOptions(spec, rows, rnd) {
    var correct = rows[2][2];
    var a = rows[2][0], b = rows[2][1];
    var cands = [];

    function push(v) {
      v = bits(v);
      if (v === correct) return;
      if (popcount(v) === 0 || popcount(v) > 8) return;
      if (cands.indexOf(v) !== -1) return;
      cands.push(v);
    }

    // the results a solver gets by applying the wrong operator
    OP_NAMES.forEach(function (name) { if (name !== spec.op) push(OPS[name](a, b)); });
    push(bits(OPS.or(a, b)) & ~bits(OPS.and(a, b)));

    // single-mark perturbations of the correct answer
    var guard = 0;
    while (cands.length < 5 && guard < 600) {
      push(correct ^ (1 << rnd.int(9)));
      guard++;
    }

    var options = rnd.shuffle(cands.slice(0, 5).concat([correct]));
    return { options: options, answer: options.indexOf(correct), correct: correct };
  }

  // ------------------------------------------------------------- assembly ---

  function build(spec) {
    var rnd = prng.make(spec.id);
    if (spec.family === 'logic') {
      var rows = buildLogicGrid(spec, prng.make(spec.id + ':grid'), 0);
      var lo = buildLogicOptions(spec, rows, rnd);
      return {
        id: spec.id, family: 'logic', op: spec.op, rows: rows,
        options: lo.options, answer: lo.answer, correct: lo.correct, rules: 1,
        prompt: spec.prompt || 'Which figure completes the bottom row?'
      };
    }
    var grid = buildGrid(spec);
    var ao = buildOptions(spec, grid, rnd);
    return {
      id: spec.id, family: 'attr', grid: grid,
      options: ao.options, answer: ao.answer, correct: ao.correct,
      rules: varyingAttrs(spec).length,
      prompt: spec.prompt || 'Which figure completes the matrix?'
    };
  }

  return {
    DOMAIN: DOMAIN, ATTRS: ATTRS, ROT_SAFE: ROT_SAFE, OPS: OPS, OP_NAMES: OP_NAMES, MASK: MASK,
    valueAt: valueAt, buildGrid: buildGrid, build: build,
    varyingAttrs: varyingAttrs, rowVaryingAttrs: rowVaryingAttrs,
    signature: signature, sameCell: sameCell, popcount: popcount
  };
}));
