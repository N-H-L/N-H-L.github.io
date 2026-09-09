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
