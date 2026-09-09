window.CS=window.CS||{};window.CS.config={"timeLimitSeconds":1800,"reportFloor":65,"reportCeiling":135,"adsEnabledOnTest":false,"publisherId":"","slots":{"homeBelowFold":"","articleInline":"","resultsBelow":""},"name":"CogniScale"};
/* ---- src/lib/prng.js ---- */
/* CogniScale - deterministic seeded PRNG.
 * Shared by the browser test engine and the offline item verifier so that an
 * item id always renders the exact same figure everywhere. */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) { module.exports = factory(); }
  else { root.CS = root.CS || {}; root.CS.prng = factory(); }
}(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  /* xfnv1a string hash -> 32-bit seed */
  function hash(str) {
    var h = 2166136261 >>> 0;
    for (var i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return h >>> 0;
  }

  /* mulberry32 */
  function mulberry32(a) {
    return function () {
      a = (a + 0x6D2B79F5) | 0;
      var t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function make(seedStr) {
    var next = mulberry32(hash(String(seedStr)));
    var api = {
      next: next,
      int: function (n) { return Math.floor(next() * n); },
      pick: function (arr) { return arr[Math.floor(next() * arr.length)]; },
      shuffle: function (arr) {
        var a = arr.slice();
        for (var i = a.length - 1; i > 0; i--) {
          var j = Math.floor(next() * (i + 1));
          var t = a[i]; a[i] = a[j]; a[j] = t;
        }
        return a;
      }
    };
    return api;
  }

  return { hash: hash, mulberry32: mulberry32, make: make };
}));

/* ---- src/lib/matrix.js ---- */
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

/* ---- src/lib/series.js ---- */
/* CogniScale - letter and number series engine.
 *
 * Every series is defined by a declarative generator spec rather than a
 * hard-coded list of terms. The offline verifier re-derives each answer from
 * the spec, so a mistyped item cannot ship: the stated rule and the keyed
 * answer are the same object.
 *
 * Item types mirror the "letter and number series" family, which carries one of
 * the highest g-loadings of the common reasoning item formats.
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) { module.exports = factory(require('./prng.js')); }
  else { root.CS = root.CS || {}; root.CS.series = factory(root.CS.prng); }
}(typeof self !== 'undefined' ? self : this, function (prng) {
  'use strict';

  var ALPHA = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  function letter(i) {
    var n = ((i % 26) + 26) % 26;
    return ALPHA.charAt(n);
  }
  function letterIndex(ch) { return ALPHA.indexOf(String(ch).toUpperCase()); }

  /* Produce the first n terms of a generator spec. */
  function terms(spec, n) {
    var out = [];
    var i, a, b, t;

    switch (spec.kind) {
      case 'arith':                       // a0, a0+d, a0+2d, ...
        for (i = 0; i < n; i++) out.push(spec.a0 + i * spec.d);
        return out;

      case 'geom':                        // a0, a0*r, a0*r^2, ...
        for (i = 0; i < n; i++) out.push(spec.a0 * Math.pow(spec.r, i));
        return out;

      case 'quad':                        // constant second difference
        a = spec.a0; b = spec.d0;
        for (i = 0; i < n; i++) { out.push(a); a += b; b += spec.dd; }
        return out;

      case 'fib':                         // a(n) = a(n-1) + a(n-2)
        a = spec.a0; b = spec.a1;
        for (i = 0; i < n; i++) { out.push(a); t = a + b; a = b; b = t; }
        return out;

      case 'cycleStep':                   // repeating cycle of increments
        a = spec.a0;
        for (i = 0; i < n; i++) { out.push(a); a += spec.steps[i % spec.steps.length]; }
        return out;

      case 'mulAdd':                      // a(n) = a(n-1) * m + k
        a = spec.a0;
        for (i = 0; i < n; i++) { out.push(a); a = a * spec.m + spec.k; }
        return out;

      case 'alt': {                       // two interleaved sub-series
        var A = terms(spec.A, Math.ceil(n / 2));
        var B = terms(spec.B, Math.ceil(n / 2));
        for (i = 0; i < n; i++) out.push(i % 2 === 0 ? A[i / 2] : B[(i - 1) / 2]);
        return out;
      }

      case 'letters':                     // single letters stepping through the alphabet
        for (i = 0; i < n; i++) out.push(letter(letterIndex(spec.start) + i * spec.step));
        return out;

      case 'lettersCycle':                // letters with a repeating step cycle
        a = letterIndex(spec.start);
        for (i = 0; i < n; i++) { out.push(letter(a)); a += spec.steps[i % spec.steps.length]; }
        return out;

      case 'letterPair': {                // two letters, each with its own step
        var p = letterIndex(spec.start[0]);
        var q = letterIndex(spec.start[1]);
        for (i = 0; i < n; i++) {
          out.push(letter(p) + letter(q));
          p += spec.steps[0];
          q += spec.steps[1];
        }
        return out;
      }

      default:
        throw new Error('series: unknown generator kind "' + spec.kind + '"');
    }
  }

  var NUMERIC_KINDS = ['arith', 'geom', 'quad', 'fib', 'cycleStep', 'mulAdd', 'alt'];

  function isNumeric(spec) { return NUMERIC_KINDS.indexOf(spec.kind) !== -1; }

  /* Distractors. For numeric items these are the values a solver lands on by
   * making a specific, nameable mistake - continuing the last difference
   * linearly, dropping the second difference, going one step too far - plus
   * tight near-misses so that the answer cannot be picked by magnitude alone. */
  function buildOptions(item, rnd) {
    var seq = terms(item.gen, item.show + 1);
    var shown = seq.slice(0, item.show);
    var correct = seq[item.show];
    var numeric = isNumeric(item.gen);
    var cands = [];

    function push(v) {
      if (v === undefined || v === null) return;
      if (numeric) {
        if (!isFinite(v)) return;
        if (Math.abs(v) > 1e7) return;
        v = Math.round(v);
      }
      if (v === correct) return;
      if (cands.indexOf(v) !== -1) return;
      cands.push(v);
    }

    if (numeric) {
      var last = shown[shown.length - 1];
      var prev = shown[shown.length - 2];
      var lastDiff = last - prev;
      push(last + lastDiff);                        // ignored the changing step
      push(seq[item.show + 1] !== undefined ? terms(item.gen, item.show + 2)[item.show + 1] : null); // one term too far
      push(correct + lastDiff);
      push(correct - lastDiff);
      push(last + (lastDiff > 0 ? 1 : -1));
      push(correct + (correct > 20 ? 10 : 2));
      push(correct - (correct > 20 ? 10 : 2));
      push(correct + 1);
      push(correct - 1);
      var guard = 0;
      while (cands.length < 4 && guard < 200) {
        push(correct + (rnd.int(2) ? 1 : -1) * (2 + rnd.int(12)));
        guard++;
      }
    } else {
      // letter items: perturb by alphabet position, preserving item shape
      var mk = function (delta, which) {
        if (correct.length === 1) return letter(letterIndex(correct) + delta);
        var p = letterIndex(correct[0]), q = letterIndex(correct[1]);
        if (which === 0) p += delta; else q += delta;
        return letter(p) + letter(q);
      };
      var mkBoth = function (d0, d1) {
        if (correct.length === 1) return letter(letterIndex(correct) + d0);
        return letter(letterIndex(correct[0]) + d0) + letter(letterIndex(correct[1]) + d1);
      };

      if (correct.length === 1) {
        [1, -1, 2, -2, 3].forEach(function (d) { push(mk(d, 0)); });
      } else {
        /* Alternate WHICH letter is wrong. Previously every first-letter
         * variant was pushed before any second-letter one, and the later
         * slice(0, 4) cut the list before reaching them - so all four
         * distractors shared the correct second letter and the item quietly
         * collapsed into a single-rule problem. */
        push(mk(1, 0));
        push(mk(-1, 1));
        push(mk(2, 0));
        push(mk(1, 1));
        push(mkBoth(1, 1));
        push(mk(-1, 0));
        push(mk(-2, 1));
        push(mk(2, 1));
      }
      var g2 = 0;
      while (cands.length < 4 && g2 < 200) {
        push(mk((rnd.int(2) ? 1 : -1) * (1 + rnd.int(6)), rnd.int(2)));
        g2++;
      }
    }

    var options = rnd.shuffle(cands.slice(0, 4).concat([correct]));
    return {
      shown: shown,
      options: options,
      answer: options.indexOf(correct),
      correct: correct
    };
  }

  function build(item) {
    var rnd = prng.make(item.id);
    var o = buildOptions(item, rnd);
    return {
      id: item.id,
      shown: o.shown,
      options: o.options,
      answer: o.answer,
      correct: o.correct,
      numeric: isNumeric(item.gen),
      prompt: item.prompt || 'What comes next in the series?',
      rationale: item.rationale
    };
  }

  return {
    ALPHA: ALPHA, letter: letter, letterIndex: letterIndex,
    terms: terms, isNumeric: isNumeric, build: build
  };
}));

/* ---- src/lib/spatial.js ---- */
/* CogniScale - spatial rotation engine.
 *
 * A planar analogue of the Shepard-Metzler / Vandenberg-Kuse mental rotation
 * task. The target is a CHIRAL polyomino - a figure whose mirror image cannot
 * be produced by any rotation of the original. The solver must pick the option
 * that is a pure rotation of the target; the strong distractors are rotations
 * of its mirror image, which is the classic error in mental rotation research.
 *
 * Correctness here is decidable rather than a matter of judgement: figures are
 * reduced to a canonical form (translate to origin, take the lexicographically
 * smallest of the four rotations) and compared exactly. The verifier asserts
 * that every target is genuinely chiral and that exactly one option matches.
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) { module.exports = factory(require('./prng.js')); }
  else { root.CS = root.CS || {}; root.CS.spatial = factory(root.CS.prng); }
}(typeof self !== 'undefined' ? self : this, function (prng) {
  'use strict';

  function key(cells) {
    return cells.map(function (p) { return p[0] + ',' + p[1]; }).sort().join(' ');
  }

  function translateToOrigin(cells) {
    var minX = Infinity, minY = Infinity;
    cells.forEach(function (p) { if (p[0] < minX) minX = p[0]; if (p[1] < minY) minY = p[1]; });
    return cells.map(function (p) { return [p[0] - minX, p[1] - minY]; });
  }

  function rotate(cells) {                 // 90 degrees clockwise: (x,y) -> (y,-x)
    return translateToOrigin(cells.map(function (p) { return [p[1], -p[0]]; }));
  }

  function mirror(cells) {                 // reflect across the vertical axis
    return translateToOrigin(cells.map(function (p) { return [-p[0], p[1]]; }));
  }

  function rotations(cells) {
    var out = [], cur = translateToOrigin(cells);
    for (var i = 0; i < 4; i++) { out.push(cur); cur = rotate(cur); }
    return out;
  }

  /* Canonical form: smallest key across the four rotations. Two figures share a
   * canonical form exactly when one is a rotation of the other. */
  function canonical(cells) {
    return rotations(cells).map(key).sort()[0];
  }

  function isChiral(cells) {
    return canonical(cells) !== canonical(mirror(cells));
  }

  function bounds(cells) {
    var maxX = 0, maxY = 0;
    cells.forEach(function (p) { if (p[0] > maxX) maxX = p[0]; if (p[1] > maxY) maxY = p[1]; });
    return { w: maxX + 1, h: maxY + 1 };
  }

  /* A near-miss figure: move one cell to a different legal position, keeping the
   * polyomino connected and the same size. */
  function variants(cells, rnd) {
    var out = [];
    var base = translateToOrigin(cells);
    var set = {};
    base.forEach(function (p) { set[p[0] + ',' + p[1]] = true; });

    var neighbours = [[1, 0], [-1, 0], [0, 1], [0, -1]];
    var frontier = [];
    base.forEach(function (p) {
      neighbours.forEach(function (d) {
        var q = [p[0] + d[0], p[1] + d[1]];
        if (!set[q[0] + ',' + q[1]]) frontier.push(q);
      });
    });

    for (var i = 0; i < base.length; i++) {
      for (var j = 0; j < frontier.length; j++) {
        var candidate = base.slice(0, i).concat(base.slice(i + 1)).concat([frontier[j]]);
        if (candidate.length !== base.length) continue;
        if (key(candidate).split(' ').length !== base.length) continue;   // no overlap
        if (!connected(candidate)) continue;
        if (canonical(candidate) === canonical(base)) continue;
        out.push(translateToOrigin(candidate));
      }
    }
    return rnd ? rnd.shuffle(out) : out;
  }

  function connected(cells) {
    if (!cells.length) return false;
    var set = {};
    cells.forEach(function (p) { set[p[0] + ',' + p[1]] = true; });
    var seen = {};
    var stack = [cells[0]];
    var n = 0;
    while (stack.length) {
      var p = stack.pop();
      var k = p[0] + ',' + p[1];
      if (seen[k] || !set[k]) continue;
      seen[k] = true; n++;
      stack.push([p[0] + 1, p[1]], [p[0] - 1, p[1]], [p[0], p[1] + 1], [p[0], p[1] - 1]);
    }
    return n === cells.length;
  }

  function build(item) {
    var rnd = prng.make(item.id);
    var target = translateToOrigin(item.cells);
    var targetCanon = canonical(target);
    var mirrored = mirror(target);

    var turns = item.turns || (1 + rnd.int(3));           // 90 / 180 / 270
    var correct = rotations(target)[turns % 4];

    var cands = [];
    var seen = {};

    function push(cells) {
      var k = key(cells);
      if (seen[k]) return;
      if (canonical(cells) === targetCanon) return;        // never a second right answer
      seen[k] = true;
      cands.push(translateToOrigin(cells));
    }

    // strong distractors: rotations of the mirror image
    var mr = rotations(mirrored);
    rnd.shuffle([0, 1, 2, 3]).forEach(function (i) { push(mr[i]); });

    // weaker distractors: a near-miss figure, itself rotated
    variants(target, rnd).slice(0, 6).forEach(function (v) {
      push(rotations(v)[rnd.int(4)]);
    });

    var options = rnd.shuffle(cands.slice(0, 4).concat([correct]));
    var answer = -1;
    for (var i = 0; i < options.length; i++) {
      if (canonical(options[i]) === targetCanon) answer = i;
    }

    return {
      id: item.id,
      target: target,
      options: options,
      answer: answer,
      correct: correct,
      chiral: isChiral(target),
      prompt: item.prompt || 'Which figure is a rotation of the figure on the left?',
      rationale: item.rationale
    };
  }

  return {
    key: key, translateToOrigin: translateToOrigin, rotate: rotate, mirror: mirror,
    rotations: rotations, canonical: canonical, isChiral: isChiral,
    connected: connected, variants: variants, bounds: bounds, build: build
  };
}));

/* ---- src/lib/irt.js ---- */
/* CogniScale - item response theory scoring.
 *
 * Scoring uses a three-parameter logistic (3PL) model:
 *
 *     P(correct | theta) = c + (1 - c) / (1 + exp(-D * a * (theta - b)))
 *
 * where a is discrimination, b is difficulty, c is the lower asymptote (the
 * probability of getting the item right by guessing, fixed at 1/k for a k-option
 * item) and D = 1.702 puts the logistic on the normal-ogive metric.
 *
 * Ability is estimated by EAP (expected a posteriori) over a fixed quadrature
 * grid with a standard normal prior. EAP is used rather than maximum likelihood
 * because ML is undefined for perfect and zero scores, and because the posterior
 * standard deviation gives a per-person standard error - which is what makes an
 * honest confidence interval possible instead of a bare point estimate.
 *
 * A raw number-correct total is deliberately NOT used: it treats a hard item and
 * an easy item as equal evidence, which they are not.
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) { module.exports = factory(); }
  else { root.CS = root.CS || {}; root.CS.irt = factory(); }
}(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var D = 1.702;
  var GRID_MIN = -4.0;
  var GRID_MAX = 4.0;
  var GRID_STEP = 0.02;

  function grid() {
    var g = [];
    for (var t = GRID_MIN; t <= GRID_MAX + 1e-9; t += GRID_STEP) g.push(Math.round(t * 1e6) / 1e6);
    return g;
  }
  var THETA = grid();

  function normalPdf(x) { return Math.exp(-0.5 * x * x) / Math.sqrt(2 * Math.PI); }

  /* Abramowitz & Stegun 7.1.26 */
  function erf(x) {
    var sign = x < 0 ? -1 : 1;
    x = Math.abs(x);
    var t = 1 / (1 + 0.3275911 * x);
    var y = 1 - ((((1.061405429 * t - 1.453152027) * t + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-x * x);
    return sign * y;
  }
  function normalCdf(z) { return 0.5 * (1 + erf(z / Math.SQRT2)); }

  function pCorrect(theta, item) {
    var c = item.c != null ? item.c : 0;
    return c + (1 - c) / (1 + Math.exp(-D * item.a * (theta - item.b)));
  }

  /* Fisher information for a 3PL item - used for test information and for
   * choosing which items carry the estimate. */
  function information(theta, item) {
    var c = item.c != null ? item.c : 0;
    var p = pCorrect(theta, item);
    if (p <= c + 1e-9 || p >= 1 - 1e-9) return 0;
    var q = 1 - p;
    var num = Math.pow(D * item.a, 2) * Math.pow(p - c, 2) * q;
    var den = Math.pow(1 - c, 2) * p;
    return num / den;
  }

  /* EAP estimate.
   * `scored` is an array of { item, correct } - one entry per ADMINISTERED item.
   * Unanswered items must be passed in as correct:false by the caller; the test
   * instructions state that omissions are scored as incorrect, which keeps
   * skipping from being a scoring strategy. */
  function estimate(scored) {
    var i, j, t, p;
    var logLik = new Array(THETA.length);

    for (i = 0; i < THETA.length; i++) {
      t = THETA[i];
      var ll = Math.log(normalPdf(t));
      for (j = 0; j < scored.length; j++) {
        p = pCorrect(t, scored[j].item);
        p = Math.min(Math.max(p, 1e-9), 1 - 1e-9);
        ll += scored[j].correct ? Math.log(p) : Math.log(1 - p);
      }
      logLik[i] = ll;
    }

    // normalise in log space for numerical stability
    var max = -Infinity;
    for (i = 0; i < logLik.length; i++) { if (logLik[i] > max) max = logLik[i]; }

    var post = new Array(THETA.length);
    var sum = 0;
    for (i = 0; i < THETA.length; i++) { post[i] = Math.exp(logLik[i] - max); sum += post[i]; }
    for (i = 0; i < THETA.length; i++) { post[i] /= sum; }

    var mean = 0;
    for (i = 0; i < THETA.length; i++) mean += THETA[i] * post[i];

    var varSum = 0;
    for (i = 0; i < THETA.length; i++) varSum += post[i] * Math.pow(THETA[i] - mean, 2);
    var sd = Math.sqrt(varSum);

    var info = 0;
    for (j = 0; j < scored.length; j++) info += information(mean, scored[j].item);

    return { theta: mean, sem: sd, posterior: post, thetaGrid: THETA, information: info, n: scored.length };
  }

  /* Marginal reliability from the posterior variance:  1 - E[var] / var(theta). */
  function reliability(sem) {
    var r = 1 - (sem * sem) / 1;
    return Math.max(0, Math.min(1, r));
  }

  function toIQ(theta) { return 100 + 15 * theta; }
  function toTheta(iq) { return (iq - 100) / 15; }

  function percentileFromTheta(theta) { return normalCdf(theta) * 100; }

  /* How unusual a score is, measured in the tail it actually falls in.
   * Reporting only the upper tail makes every below-average score come back as
   * "more common than 1 in 2", which is true but tells the reader nothing. So
   * for a score above the mean this answers "1 in N score at least this high",
   * and for one below the mean, "1 in N score at least this low". */
  function rarityAtOrAbove(theta) {
    var p = 1 - normalCdf(theta);
    if (p <= 0) return Infinity;
    return 1 / p;
  }

  function rarity(theta) {
    var above = 1 - normalCdf(theta);
    var below = normalCdf(theta);
    var tail = theta >= 0 ? above : below;
    if (tail <= 0) return { ratio: Infinity, direction: theta >= 0 ? 'above' : 'below' };
    return { ratio: 1 / tail, direction: theta >= 0 ? 'above' : 'below' };
  }

  function round(x, dp) {
    var m = Math.pow(10, dp || 0);
    return Math.round(x * m) / m;
  }

  /* Full report for a set of scored responses. `bounds` clamps the REPORTED
   * score to the range the test can actually resolve; the raw estimate is kept
   * alongside so the UI can say the score was capped rather than silently lie. */
  function report(scored, bounds) {
    var e = estimate(scored);
    var rawIQ = toIQ(e.theta);
    var semIQ = 15 * e.sem;
    var lo = bounds && bounds.floor != null ? bounds.floor : -Infinity;
    var hi = bounds && bounds.ceiling != null ? bounds.ceiling : Infinity;
    var iq = Math.min(Math.max(rawIQ, lo), hi);

    return {
      theta: e.theta,
      sem: e.sem,
      semIQ: semIQ,
      iq: Math.round(iq),
      rawIQ: rawIQ,
      capped: rawIQ > hi ? 'high' : (rawIQ < lo ? 'low' : null),
      ci68: [Math.round(iq - semIQ), Math.round(iq + semIQ)],
      ci95: [Math.round(iq - 1.96 * semIQ), Math.round(iq + 1.96 * semIQ)],
      percentile: percentileFromTheta(e.theta),
      rarity: rarity(e.theta).ratio,
      rarityDirection: rarity(e.theta).direction,
      reliability: reliability(e.sem),
      information: e.information,
      nItems: e.n,
      nCorrect: scored.filter(function (s) { return s.correct; }).length
    };
  }

  return {
    D: D, THETA: THETA,
    pCorrect: pCorrect, information: information, estimate: estimate, report: report,
    toIQ: toIQ, toTheta: toTheta, normalCdf: normalCdf, erf: erf,
    percentileFromTheta: percentileFromTheta, rarityAtOrAbove: rarityAtOrAbove, rarity: rarity,
    reliability: reliability, round: round
  };
}));

/* ---- src/data/items.js ---- */
/* CogniScale - the item bank.
 *
 * Thirty items across four reasoning domains. The blueprint follows the item
 * families used by the International Cognitive Ability Resource (matrix
 * reasoning, letter/number series, verbal reasoning, spatial rotation), which is
 * the best-documented open framework for this kind of battery. The ITEMS
 * THEMSELVES ARE ORIGINAL: the ICAR bank is licensed for academic use only, so
 * nothing from it is reproduced here. What is borrowed is the published
 * construction methodology, not the content.
 *
 * IRT parameters
 * --------------
 *   a  discrimination. Set per domain from the reported g-loadings of each item
 *      family: verbal reasoning and letter/number series load highest (~.8),
 *      matrix reasoning next, spatial rotation lowest.
 *   b  difficulty, on the theta metric (0 = population mean, 1 = +1 SD).
 *      Assigned rationally from the structural complexity of each item - the
 *      number of simultaneously governing rules for matrices, the depth of the
 *      generating rule for series, the inference type for verbal items.
 *   c  lower asymptote, computed at build time as 1 / (number of options).
 *
 * These b values are PROVISIONAL - rational rather than empirically calibrated
 * on a norming sample of this test's own takers. /methodology says so plainly,
 * and the reported score is capped to the range this design can resolve.
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) { module.exports = factory(); }
  else { root.CS = root.CS || {}; root.CS.itemBank = factory(); }
}(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var DOMAINS = {
    MR: {
      code: 'MR',
      name: 'Figural reasoning',
      chc: 'Gf - induction (I)',
      blurb: 'Inferring the rules that govern an abstract pattern, then applying them.',
      a: 1.25
    },
    NL: {
      code: 'NL',
      name: 'Numeric & symbolic series',
      chc: 'Gf - quantitative reasoning (RQ)',
      blurb: 'Detecting the generating rule behind a sequence of numbers or letters.',
      a: 1.45
    },
    VR: {
      code: 'VR',
      name: 'Verbal & logical reasoning',
      chc: 'Gc / Gf - language development and deduction',
      blurb: 'Relational analogies and deductive inference expressed in words.',
      a: 1.40
    },
    SR: {
      code: 'SR',
      name: 'Spatial rotation',
      chc: 'Gv - visualisation (Vz)',
      blurb: 'Mentally rotating a figure and distinguishing rotation from reflection.',
      a: 1.00
    }
  };

  // ------------------------------------------------------- matrix reasoning --
  var MR = [
    {
      id: 'MR.01', domain: 'MR', b: -1.85, family: 'attr',
      rules: {
        shape: { kind: 'fixed', value: 'triangle' },
        count: { kind: 'latin', domain: [1, 2, 3], shift: 1 }
      },
      rationale: 'One rule: every row and every column contains one, two and three triangles - never a repeat. The bottom row already shows three and one, and the right column already shows three and one, so the missing cell holds two.'
    },
    {
      id: 'MR.02', domain: 'MR', b: -1.35, family: 'attr',
      rules: {
        shape: { kind: 'latin', domain: ['circle', 'square', 'triangle'], shift: 1 }
      },
      rationale: 'One rule: each of the three shapes appears exactly once in every row and every column.'
    },
    {
      id: 'MR.03', domain: 'MR', b: -0.85, family: 'attr',
      rules: {
        shape: { kind: 'latin', domain: ['circle', 'square', 'triangle'], shift: 1 },
        fill:  { kind: 'constant', domain: ['none', 'light', 'solid'] }
      },
      rationale: 'Two rules: each shape appears once per row and column, while shading is constant along each row and changes between rows.'
    },
    {
      id: 'MR.04', domain: 'MR', b: -0.45, family: 'attr',
      rules: {
        shape: { kind: 'fixed', value: 'hexagon' },
        size:  { kind: 'progress', domain: ['sm', 'md', 'lg'], starts: [0, 1, 2], step: 1 },
        fill:  { kind: 'latin', domain: ['none', 'light', 'solid'], shift: 1 }
      },
      rationale: 'Two rules: size steps up along each row (wrapping back to small), and each shading appears once per row and column.'
    },
    {
      id: 'MR.05', domain: 'MR', b: -0.10, family: 'attr',
      rules: {
        shape: { kind: 'fixed', value: 'hexagon' },
        fill:  { kind: 'latin', domain: ['none', 'light', 'solid'], shift: 2 },
        count: { kind: 'latin', domain: [1, 2, 3], shift: 1 }
      },
      rationale: 'Two independent distribute-three rules. Each row and column holds one, two and three hexagons exactly once, and separately shows each of the three shadings exactly once. The two rules run on opposite diagonals, so working out one does not hand you the other.'
    },
    {
      id: 'MR.06', domain: 'MR', b: 0.20, family: 'logic', op: 'or',
      prompt: 'In each row, the third figure combines the first two. Which figure completes the bottom row?',
      rationale: 'The third cell contains every mark that appears in the first cell OR the second cell (a union).'
    },
    {
      id: 'MR.07', domain: 'MR', b: 0.55, family: 'attr',
      rules: {
        shape: { kind: 'latin', domain: ['triangle', 'square', 'circle'], shift: 1 },
        fill:  { kind: 'latin', domain: ['none', 'solid', 'hatch'], shift: 2 },
        size:  { kind: 'constant', domain: ['sm', 'md', 'lg'] }
      },
      rationale: 'Three rules running at once: shape and shading each appear once per row and column (on different diagonals), and size is constant along each row.'
    },
    {
      id: 'MR.08', domain: 'MR', b: 1.05, family: 'logic', op: 'xor',
      prompt: 'In each row, the third figure is derived from the first two. Which figure completes the bottom row?',
      rationale: 'The third cell keeps only the marks that appear in exactly one of the first two cells. Marks present in both cancel out.'
    },
    {
      id: 'MR.09', domain: 'MR', b: 1.50, family: 'attr',
      rules: {
        shape: { kind: 'fixed', value: 'triangle' },
        count: { kind: 'latin', domain: [1, 2, 3], shift: 1 },
        rot:   { kind: 'progress', domain: [0, 30, 60, 90], starts: [0, 2, 1], step: 1 },
        fill:  { kind: 'latin', domain: ['none', 'solid', 'dots'], shift: 2 }
      },
      rationale: 'Three rules at once. The number of triangles is a distribute-three across rows and columns; the shading is a second distribute-three running on the other diagonal; and the figure turns 30 degrees at each step, cycling back to upright after 90 - as the middle row shows.'
    },
    {
      id: 'MR.10', domain: 'MR', b: 1.95, family: 'logic', op: 'andnot',
      prompt: 'In each row, the third figure is derived from the first two. Which figure completes the bottom row?',
      rationale: 'The third cell keeps the marks of the first cell, except those that also appear in the second cell - the second figure subtracts from the first.'
    }
  ];

  // ----------------------------------------------- letter and number series --
  var NL = [
    {
      id: 'NL.01', domain: 'NL', b: -1.90, show: 5,
      gen: { kind: 'arith', a0: 3, d: 4 },
      rationale: 'A constant difference: each term is 4 more than the one before.'
    },
    {
      id: 'NL.02', domain: 'NL', b: -1.20, show: 5,
      gen: { kind: 'lettersCycle', start: 'B', steps: [2, 3] },
      rationale: 'The step through the alphabet alternates: forward 2, then forward 3, then 2 again.'
    },
    {
      id: 'NL.03', domain: 'NL', b: -0.55, show: 5,
      gen: { kind: 'quad', a0: 2, d0: 3, dd: 2 },
      rationale: 'The differences are 3, 5, 7, 9 - they themselves grow by 2 each time, so the next difference is 11.'
    },
    {
      id: 'NL.04', domain: 'NL', b: 0.10, show: 6,
      gen: { kind: 'alt', A: { kind: 'arith', a0: 4, d: 5 }, B: { kind: 'arith', a0: 20, d: -4 } },
      rationale: 'Two sequences are interleaved. The 1st, 3rd and 5th terms rise by 5; the 2nd, 4th and 6th fall by 4.'
    },
    {
      id: 'NL.05', domain: 'NL', b: 0.75, show: 5,
      gen: { kind: 'mulAdd', a0: 2, m: 2, k: 1 },
      rationale: 'Each term is the previous term doubled, plus 1.'
    },
    {
      id: 'NL.06', domain: 'NL', b: 1.35, show: 4,
      gen: { kind: 'letterPair', start: 'AZ', steps: [2, -1] },
      rationale: 'Each pair moves independently: the first letter advances 2 places, the second moves back 1.'
    },
    {
      id: 'NL.07', domain: 'NL', b: 1.90, show: 6,
      gen: { kind: 'cycleStep', a0: 4, steps: [3, 6, 12] },
      rationale: 'The increments repeat in a cycle of three: +3, +6, +12, then +3, +6, +12 again.'
    }
  ];

  // --------------------------------------------- verbal and logical reasoning --
  var VR = [
    {
      id: 'VR.01', domain: 'VR', b: -1.75,
      kind: 'analogy',
      stem: 'Doctor is to hospital as teacher is to ___',
      options: ['school', 'student', 'textbook', 'lesson', 'chalk'],
      answerText: 'school',
      rationale: 'The relation is practitioner to workplace. A doctor works in a hospital; a teacher works in a school. The other options are things a teacher uses or deals with, not the place they work.'
    },
    {
      id: 'VR.02', domain: 'VR', b: -1.15,
      kind: 'odd',
      stem: 'Which one does not belong with the others?',
      options: ['copper', 'iron', 'oxygen', 'zinc', 'nickel'],
      answerText: 'oxygen',
      rationale: 'Copper, iron, zinc and nickel are metals. Oxygen is a non-metal, and at room temperature a gas.'
    },
    {
      id: 'VR.03', domain: 'VR', b: -0.40,
      kind: 'analogy',
      stem: 'Sculptor is to marble as poet is to ___',
      options: ['words', 'poem', 'rhyme', 'publisher', 'emotion'],
      answerText: 'words',
      rationale: 'The relation is maker to raw material. Marble is what a sculptor works with, so the answer must be what a poet works with: words. A poem is the finished product, not the material.'
    },
    {
      id: 'VR.04', domain: 'VR', b: 0.20,
      kind: 'deduction',
      stem: 'Every rose in this garden is red. Some flowers in this garden are not red.\n\nWhich statement must be true?',
      options: [
        'Some flowers in this garden are not roses.',
        'All flowers in this garden are roses.',
        'Some roses in this garden are not red.',
        'No roses in this garden are flowers.',
        'None of these must be true.'
      ],
      answerText: 'Some flowers in this garden are not roses.',
      rationale: 'A flower that is not red cannot be a rose, because every rose here is red. Since some flowers are not red, those flowers are not roses.'
    },
    {
      id: 'VR.05', domain: 'VR', b: 0.70,
      kind: 'deduction',
      stem: 'Five runners finish a race with no ties. Nadia finishes ahead of Omar. Priya finishes behind Omar but ahead of Quinn. Ravi finishes last.\n\nWho finishes third?',
      options: ['Priya', 'Omar', 'Quinn', 'Nadia', 'It cannot be determined.'],
      answerText: 'Priya',
      rationale: 'The clues force the order Nadia, Omar, Priya, Quinn, Ravi. Nadia is ahead of Omar, Omar is ahead of Priya, Priya is ahead of Quinn, and Ravi is last - so Priya is third.'
    },
    {
      id: 'VR.06', domain: 'VR', b: 1.30,
      kind: 'deduction',
      stem: 'In a warehouse the rule is: if a shipment is fragile, then it is sealed with blue tape.\n\nA shipment arrives that is not sealed with blue tape. What follows?',
      options: [
        'The shipment is not fragile.',
        'The shipment is fragile.',
        'The shipment may or may not be fragile.',
        'Every fragile shipment has arrived.',
        'Nothing follows from this.'
      ],
      answerText: 'The shipment is not fragile.',
      rationale: 'If being fragile guarantees blue tape, then no blue tape guarantees not fragile. Denying the consequent lets you deny the antecedent. (The reverse move - seeing blue tape and concluding "fragile" - would be invalid, because non-fragile items may also be taped.)'
    },
    {
      id: 'VR.07', domain: 'VR', b: 1.90,
      kind: 'deduction',
      stem: 'Every member of the choir is also a member of the orchestra. Some members of the orchestra are teachers.\n\nWhich statement must be true?',
      options: [
        'Some teachers are members of the orchestra.',
        'Some members of the choir are teachers.',
        'All teachers are members of the orchestra.',
        'Some members of the choir are not teachers.',
        'No member of the choir is a teacher.'
      ],
      answerText: 'Some teachers are members of the orchestra.',
      rationale: '"Some orchestra members are teachers" and "some teachers are orchestra members" say the same thing - "some" statements can be reversed. Nothing forces any of them to be in the choir, so the tempting option about choir members being teachers does not follow.'
    }
  ];

  // ------------------------------------------------------- spatial rotation --
  var SR = [
    {
      id: 'SR.01', domain: 'SR', b: -1.25, turns: 1,
      cells: [[1, 0], [2, 0], [0, 1], [1, 1]],
      rationale: 'Turning the figure a quarter-turn reproduces the correct option exactly. The others are mirror images - they would need to be flipped over, not turned.'
    },
    {
      id: 'SR.02', domain: 'SR', b: -0.60, turns: 3,
      cells: [[0, 0], [0, 1], [0, 2], [0, 3], [1, 3]],
      rationale: 'The correct option is the same L-shape turned; the mirror-image options have the short foot on the wrong side.'
    },
    {
      id: 'SR.03', domain: 'SR', b: 0.05, turns: 2,
      cells: [[0, 0], [1, 0], [0, 1], [1, 1], [0, 2]],
      rationale: 'A half-turn maps the figure onto the correct option. Reflections keep the same outline but reverse the handedness of the notch.'
    },
    {
      id: 'SR.04', domain: 'SR', b: 0.70, turns: 1,
      cells: [[1, 0], [2, 0], [0, 1], [1, 1], [1, 2]],
      rationale: 'Only one option can be produced by rotation. Tracking a single distinctive cell - the isolated arm - through the turn is the quickest check.'
    },
    {
      id: 'SR.05', domain: 'SR', b: 1.35, turns: 3,
      cells: [[1, 0], [1, 1], [0, 2], [1, 2], [0, 3]],
      rationale: 'The offset zig-zag is chiral, so its mirror image can never be rotated back onto it. The correct option is a three-quarter turn of the original.'
    },
    {
      id: 'SR.06', domain: 'SR', b: 1.95, turns: 2,
      cells: [[0, 0], [1, 0], [1, 1], [1, 2], [2, 2], [2, 3]],
      rationale: 'A six-cell staircase. Rotating it keeps the direction of the steps; reflecting it reverses them, which is what every distractor does.'
    }
  ];

  var ITEMS = MR.concat(NL).concat(VR).concat(SR);

  /* Presentation order.
   *
   * Each domain's easy-to-hard ladder is stretched evenly across the whole test
   * rather than dealt out in a fixed cycle. Every item gets a fractional
   * position (its rank within its own domain, normalised to 0..1); sorting on
   * that interleaves the four domains no matter how many items each contains,
   * and it makes the test as a whole run easy-to-hard.
   *
   * Two properties this protects, both checked by the verifier:
   *   - no domain clusters (a run of one item type is monotonous, and a run of
   *     hard items from one domain can stall a test taker outright)
   *   - the hardest items are never all bunched at the end, where time pressure
   *     and fatigue would confound difficulty with endurance
   */
  var DOMAIN_TIEBREAK = { MR: 0, NL: 1, VR: 2, SR: 3 };

  function presentationOrder() {
    var groups = { MR: MR, NL: NL, VR: VR, SR: SR };
    var ranked = [];

    Object.keys(groups).forEach(function (d) {
      var list = groups[d];
      list.forEach(function (item, i) {
        ranked.push({
          item: item,
          // centre of this item's slice of its domain's ladder
          pos: (i + 0.5) / list.length,
          tie: DOMAIN_TIEBREAK[d]
        });
      });
    });

    ranked.sort(function (x, y) {
      if (x.pos !== y.pos) return x.pos - y.pos;
      return x.tie - y.tie;
    });

    return ranked.map(function (r) { return r.item; });
  }

  return {
    DOMAINS: DOMAINS,
    MR: MR, NL: NL, VR: VR, SR: SR,
    ITEMS: ITEMS,
    presentationOrder: presentationOrder
  };
}));

/* ---- src/lib/bank.js ---- */
/* CogniScale - assembles item specs into runtime items.
 *
 * Every runtime item carries: the rendered payload, its option list, the index
 * of the correct option, and its 3PL parameters. The guessing parameter c is
 * derived from the actual number of options rather than assumed, so a five-
 * option item is never scored as though it had six.
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory(
      require('./prng.js'), require('./matrix.js'), require('./series.js'),
      require('./spatial.js'), require('../data/items.js')
    );
  } else {
    root.CS = root.CS || {};
    root.CS.bank = factory(root.CS.prng, root.CS.matrix, root.CS.series, root.CS.spatial, root.CS.itemBank);
  }
}(typeof self !== 'undefined' ? self : this, function (prng, matrix, series, spatial, itemBank) {
  'use strict';

  function buildVerbal(spec) {
    var rnd = prng.make(spec.id);
    var options = rnd.shuffle(spec.options);
    var answer = options.indexOf(spec.answerText);
    if (answer === -1) {
      throw new Error('bank: ' + spec.id + ' answerText is not among its options');
    }
    return {
      id: spec.id, type: 'verbal', kind: spec.kind,
      stem: spec.stem, options: options, answer: answer,
      prompt: spec.prompt || null, rationale: spec.rationale
    };
  }

  function buildOne(spec) {
    var built;
    if (spec.domain === 'MR') {
      built = matrix.build(spec);
      built.type = 'matrix';
    } else if (spec.domain === 'NL') {
      built = series.build(spec);
      built.type = 'series';
    } else if (spec.domain === 'SR') {
      built = spatial.build(spec);
      built.type = 'spatial';
    } else if (spec.domain === 'VR') {
      built = buildVerbal(spec);
    } else {
      throw new Error('bank: unknown domain "' + spec.domain + '" for ' + spec.id);
    }

    var domain = itemBank.DOMAINS[spec.domain];
    built.domain = spec.domain;
    built.domainName = domain.name;
    built.a = spec.a != null ? spec.a : domain.a;
    built.b = spec.b;
    built.c = 1 / built.options.length;
    if (!built.rationale) built.rationale = spec.rationale;
    return built;
  }

  /* All items, in the order they are presented. */
  function build() {
    return itemBank.presentationOrder().map(buildOne);
  }

  /* Just the 3PL parameters - enough to score, without the payloads. */
  function params(items) {
    return items.map(function (it) {
      return { id: it.id, domain: it.domain, a: it.a, b: it.b, c: it.c };
    });
  }

  return { build: build, buildOne: buildOne, buildVerbal: buildVerbal, params: params, DOMAINS: itemBank.DOMAINS };
}));

/* ---- src/lib/render.js ---- */
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
