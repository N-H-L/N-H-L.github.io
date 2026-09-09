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
