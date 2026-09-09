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
