/* ===========================================================================
 * tools/series-ambiguity.js
 * ---------------------------------------------------------------------------
 * The classic way a "what comes next" item goes wrong is not an arithmetic
 * slip - it is a SECOND rule that also fits every shown term but predicts a
 * different next term. If that rival answer happens to be one of the offered
 * options, the item has two defensible answers and is unfair.
 *
 * This searches a broad space of simple rule families, keeps only those that
 * reproduce every shown term exactly, and reports the distinct next terms they
 * predict - flagging any rival prediction that appears among the options.
 *
 *   node tools/series-ambiguity.js
 * ======================================================================== */
'use strict';

var bank = require('../src/data/items.js');
var build = require('../src/lib/bank.js');
var items = build.build(bank.presentationOrder()).filter(function (i) { return i.type === 'series'; });

var A = 'A'.charCodeAt(0);
function isLetterSeries(shown) { return typeof shown[0] === 'string'; }

/* Map a letter series onto numbers so the same machinery applies.
 * Single letters -> alphabet index. Pairs -> handled as two interleaved runs. */
function toNums(shown) {
  if (typeof shown[0] === 'number') return { kind: 'num', seq: shown.slice() };
  if (shown.every(function (s) { return /^[A-Z]$/.test(s); })) {
    return { kind: 'letter', seq: shown.map(function (s) { return s.charCodeAt(0) - A; }) };
  }
  if (shown.every(function (s) { return /^[A-Z]{2}$/.test(s); })) {
    return {
      kind: 'pair',
      first: shown.map(function (s) { return s.charCodeAt(0) - A; }),
      second: shown.map(function (s) { return s.charCodeAt(1) - A; })
    };
  }
  return null;
}

/* ---- candidate rule families ------------------------------------------- */
/* Each returns {name, next} if it reproduces every term, else null. */
var FAMILIES = [
  function constantDiff(s) {
    var d = s[1] - s[0];
    for (var i = 1; i < s.length; i++) if (s[i] - s[i - 1] !== d) return null;
    return { name: 'constant difference ' + d, next: s[s.length - 1] + d };
  },

  function constantRatio(s) {
    if (s[0] === 0) return null;
    var r = s[1] / s[0];
    for (var i = 1; i < s.length; i++) if (s[i - 1] === 0 || s[i] / s[i - 1] !== r) return null;
    return { name: 'constant ratio ' + r, next: s[s.length - 1] * r };
  },

  function secondDiff(s) {
    if (s.length < 4) return null;
    var d = s.slice(1).map(function (v, i) { return v - s[i]; });
    var dd = d[1] - d[0];
    for (var i = 1; i < d.length; i++) if (d[i] - d[i - 1] !== dd) return null;
    return { name: 'second difference ' + dd, next: s[s.length - 1] + d[d.length - 1] + dd };
  },

  function affine(s) {                       // x -> a*x + b, small integer a,b
    for (var a = -3; a <= 4; a++) {
      for (var b = -12; b <= 12; b++) {
        if (a === 1 && b === 0) continue;
        var okAll = true;
        for (var i = 1; i < s.length; i++) if (a * s[i - 1] + b !== s[i]) { okAll = false; break; }
        if (okAll) return { name: 'x -> ' + a + 'x' + (b >= 0 ? '+' + b : b),
                            next: a * s[s.length - 1] + b };
      }
    }
    return null;
  },

  function cyclicDiff(s) {                   // repeating block of differences
    var d = s.slice(1).map(function (v, i) { return v - s[i]; });
    for (var p = 2; p <= 4; p++) {
      if (d.length < p + 1) continue;        // need to see the cycle repeat once
      var okAll = true;
      for (var i = p; i < d.length; i++) if (d[i] !== d[i - p]) { okAll = false; break; }
      if (okAll) return { name: 'difference cycle of ' + p + ' [' + d.slice(0, p).join(',') + ']',
                          next: s[s.length - 1] + d[d.length - p] };
    }
    return null;
  },

  function interleaved(s) {                  // two alternating arithmetic runs
    if (s.length < 5) return null;
    var odd = s.filter(function (_, i) { return i % 2 === 0; });
    var even = s.filter(function (_, i) { return i % 2 === 1; });
    if (odd.length < 2 || even.length < 2) return null;
    function arith(run) {
      var d = run[1] - run[0];
      for (var i = 1; i < run.length; i++) if (run[i] - run[i - 1] !== d) return null;
      return d;
    }
    var d1 = arith(odd), d2 = arith(even);
    if (d1 === null || d2 === null) return null;
    var nextIsOdd = s.length % 2 === 0;
    return {
      name: 'interleaved runs (+' + d1 + ' / +' + d2 + ')',
      next: nextIsOdd ? odd[odd.length - 1] + d1 : even[even.length - 1] + d2
    };
  },

  function polyFit(s) {                       // lowest-degree exact polynomial
    for (var deg = 1; deg <= 3; deg++) {
      if (s.length < deg + 2) continue;       // need slack, or the fit is trivial
      var coef = fitPoly(s, deg);
      if (!coef) continue;
      var okAll = s.every(function (v, i) { return Math.abs(evalPoly(coef, i) - v) < 1e-6; });
      if (okAll) return { name: 'degree-' + deg + ' polynomial in n',
                          next: Math.round(evalPoly(coef, s.length)) };
    }
    return null;
  }
];

/* Least-squares polynomial fit via normal equations (small, well conditioned). */
function fitPoly(s, deg) {
  var n = deg + 1, i, j, k;
  var Amat = [], bvec = [];
  for (i = 0; i < n; i++) {
    Amat.push(new Array(n).fill(0));
    bvec.push(0);
    for (j = 0; j < n; j++) for (k = 0; k < s.length; k++) Amat[i][j] += Math.pow(k, i + j);
    for (k = 0; k < s.length; k++) bvec[i] += s[k] * Math.pow(k, i);
  }
  for (i = 0; i < n; i++) {                   // gaussian elimination
    var piv = i;
    for (j = i + 1; j < n; j++) if (Math.abs(Amat[j][i]) > Math.abs(Amat[piv][i])) piv = j;
    if (Math.abs(Amat[piv][i]) < 1e-12) return null;
    var t = Amat[i]; Amat[i] = Amat[piv]; Amat[piv] = t;
    var tb = bvec[i]; bvec[i] = bvec[piv]; bvec[piv] = tb;
    for (j = i + 1; j < n; j++) {
      var f = Amat[j][i] / Amat[i][i];
      for (k = i; k < n; k++) Amat[j][k] -= f * Amat[i][k];
      bvec[j] -= f * bvec[i];
    }
  }
  var x = new Array(n).fill(0);
  for (i = n - 1; i >= 0; i--) {
    var sum = bvec[i];
    for (j = i + 1; j < n; j++) sum -= Amat[i][j] * x[j];
    x[i] = sum / Amat[i][i];
  }
  return x;
}
function evalPoly(c, x) {
  return c.reduce(function (acc, v, i) { return acc + v * Math.pow(x, i); }, 0);
}

/* ---- run ---------------------------------------------------------------- */
console.log('CogniScale series ambiguity search');
console.log('==================================\n');

var problems = [];

items.forEach(function (it) {
  var m = toNums(it.shown);
  console.log('  ' + it.id + '   ' + it.shown.join(', ') + ', ?    key = ' + it.correct);

  if (!m) { console.log('      (format not analysable automatically)\n'); return; }

  var predictions = {};   // nextValueAsShown -> [rule names]

  function record(name, nextNum, render) {
    if (!isFinite(nextNum)) return;
    var shownVal = render(nextNum);
    if (shownVal === null) return;
    (predictions[shownVal] = predictions[shownVal] || []).push(name);
  }

  if (m.kind === 'pair') {
    // fit each letter position independently, then recombine
    var f1 = [], f2 = [];
    FAMILIES.forEach(function (fam) {
      var a = fam(m.first), b = fam(m.second);
      if (a) f1.push(a);
      if (b) f2.push(b);
    });
    f1.forEach(function (a) {
      f2.forEach(function (b) {
        var l1 = a.next, l2 = b.next;
        if (l1 < 0 || l1 > 25 || l2 < 0 || l2 > 25) return;
        record(a.name + ' / ' + b.name, 1,
               function () { return String.fromCharCode(A + l1) + String.fromCharCode(A + l2); });
      });
    });
  } else {
    var seq = m.seq;
    FAMILIES.forEach(function (fam) {
      var r = fam(seq);
      if (!r) return;
      record(r.name, r.next, function (v) {
        if (m.kind === 'letter') {
          if (v < 0 || v > 25 || v !== Math.round(v)) return null;
          return String.fromCharCode(A + v);
        }
        return String(v);
      });
    });
  }

  var keys = Object.keys(predictions);
  var optionStrings = it.options.map(String);

  keys.forEach(function (k) {
    var isKey = k === String(it.correct);
    var onMenu = optionStrings.indexOf(k) !== -1;
    var flag = isKey ? 'KEY   ' : (onMenu ? 'RIVAL ' : 'other ');
    console.log('      ' + flag + k + '   <- ' + predictions[k].join('; '));
    if (!isKey && onMenu) {
      problems.push(it.id + ': rule "' + predictions[k][0] + '" also fits every shown term and ' +
                    'predicts ' + k + ', which is offered as an option');
    }
  });

  if (keys.indexOf(String(it.correct)) === -1) {
    console.log('      !! no searched rule family reproduced the keyed answer');
  }
  console.log('');
});

if (problems.length) {
  console.log('AMBIGUOUS - ' + problems.length + ' item(s) have a second defensible answer:\n');
  problems.forEach(function (p) { console.log('  * ' + p); });
  process.exit(1);
}
console.log('PASSED - no rival rule predicts a different offered option.');
