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
