#!/usr/bin/env node
/* CogniScale - runtime smoke test.
 *
 * Runs the SHIPPED browser bundle (dist/assets/js/engine.js) inside a V8 context
 * with a browser-shaped global, then exercises it end to end. This is the check
 * that catches the class of bug a static audit cannot: a module that throws on
 * load, a renderer that produces broken markup, a scoring path that disagrees
 * with itself, or - the most common one - the runner reaching for an element id
 * that the page does not actually contain.
 *
 * Deliberately not a DOM emulator. Instead it verifies the CONTRACT between
 * assets/js/test.js and dist/test/index.html: every id and selector the runner
 * looks up must exist in the page it runs on.
 *
 * Run with `npm run smoke`.
 */
'use strict';

var fs = require('fs');
var path = require('path');
var vm = require('vm');

var ROOT = path.join(__dirname, '..');
var DIST = path.join(ROOT, require('../site.config.js').outDir || 'dist');

var failures = [];
var checks = 0;

function check(cond, msg) {
  checks++;
  if (!cond) failures.push(msg);
}

if (!fs.existsSync(path.join(DIST, 'assets/js/engine.js'))) {
  console.error('dist/ is missing or stale. Run `npm run build` first.');
  process.exit(1);
}

// ------------------------------------------------ 1. the bundle must evaluate

var sandbox = { console: console };
sandbox.self = sandbox;
sandbox.window = sandbox;
sandbox.globalThis = sandbox;
vm.createContext(sandbox);

var engineSrc = fs.readFileSync(path.join(DIST, 'assets/js/engine.js'), 'utf8');
try {
  vm.runInContext(engineSrc, sandbox, { filename: 'engine.js' });
} catch (e) {
  console.error('FATAL: engine.js threw while loading: ' + e.message);
  process.exit(1);
}

var CS = sandbox.CS;
check(!!CS, 'engine did not define window.CS');
['prng', 'matrix', 'series', 'spatial', 'irt', 'itemBank', 'bank', 'render', 'config']
  .forEach(function (k) { check(!!CS[k], 'engine is missing CS.' + k); });

// ------------------------------------------------- 2. items build in-browser

var items = CS.bank.build();
check(items.length === 30, 'expected 30 items in the browser bundle, got ' + items.length);

items.forEach(function (it, i) {
  check(it.options && it.options.length >= 4, it.id + ': too few options at runtime');
  check(it.answer >= 0 && it.answer < it.options.length, it.id + ': answer index out of range at runtime');
  check(['matrix', 'series', 'spatial', 'verbal'].indexOf(it.type) !== -1, it.id + ': unknown type ' + it.type);
  check(!!it.domainName, it.id + ': no domainName');
  check(typeof it.a === 'number' && typeof it.b === 'number' && typeof it.c === 'number',
    it.id + ': incomplete IRT parameters at runtime');
});

// ------------------------------------------- 3. every item renders to markup

function looksLikeHtml(s) {
  if (typeof s !== 'string') return false;
  if (s.indexOf('undefined') !== -1) return false;
  if (s.indexOf('NaN') !== -1) return false;
  if (s.indexOf('[object Object]') !== -1) return false;
  var open = (s.match(/<svg\b/g) || []).length;
  var close = (s.match(/<\/svg>/g) || []).length;
  return open === close;
}

items.forEach(function (it) {
  var stim = CS.render.stimulus(it);
  if (it.type === 'verbal') {
    check(stim === '', it.id + ': verbal items should have no stimulus figure');
    check(!!it.stem && it.stem.length > 10, it.id + ': verbal item has no usable stem');
  } else {
    check(!!stim && stim.length > 50, it.id + ': stimulus rendered empty');
    check(looksLikeHtml(stim), it.id + ': stimulus markup looks malformed or contains a placeholder');
  }

  it.options.forEach(function (v, i) {
    var o = CS.render.option(it, v);
    check(!!o && o.length > 5, it.id + ' option ' + i + ': rendered empty');
    check(looksLikeHtml(o), it.id + ' option ' + i + ': markup looks malformed');
  });

  check(!!it.rationale && it.rationale.length > 20, it.id + ': no rationale at runtime');
});

// ------------------------------------------------------- 4. scoring end-to-end

function scoreRun(pattern) {
  var scored = items.map(function (it, i) { return { item: it, correct: pattern(it, i) }; });
  return CS.irt.report(scored, { floor: CS.config.reportFloor, ceiling: CS.config.reportCeiling });
}

var allWrong = scoreRun(function () { return false; });
var allRight = scoreRun(function () { return true; });
var half = scoreRun(function (it, i) { return i % 2 === 0; });
var easyOnly = scoreRun(function (it) { return it.b < 0; });

check(allWrong.iq < half.iq, 'scoring is not monotonic: all-wrong (' + allWrong.iq + ') >= half (' + half.iq + ')');
check(half.iq < allRight.iq, 'scoring is not monotonic: half (' + half.iq + ') >= all-right (' + allRight.iq + ')');
/* Both bounds must be reachable, or the cap is a claim that never fires.
 * This is exactly the bug this assertion was added to catch: with a ceiling of
 * 140 and a maximum attainable estimate of 138, nothing was ever capped. */
check(allRight.capped === 'high',
  'the reportCeiling (' + CS.config.reportCeiling + ') is unreachable - a perfect score returns ' +
  Math.round(allRight.rawIQ) + ', so no score is ever capped high');
check(allWrong.capped === 'low',
  'the reportFloor (' + CS.config.reportFloor + ') is unreachable - an all-wrong score returns ' +
  Math.round(allWrong.rawIQ) + ', so no score is ever capped low');
check(easyOnly.iq > allWrong.iq && easyOnly.iq < allRight.iq, 'easy-items-only score out of range: ' + easyOnly.iq);

[allWrong, half, allRight, easyOnly].forEach(function (r, i) {
  check(isFinite(r.iq), 'report ' + i + ': IQ is not finite');
  check(isFinite(r.semIQ) && r.semIQ > 0, 'report ' + i + ': SEM is not a positive number');
  check(r.ci95[0] < r.ci95[1], 'report ' + i + ': confidence interval is inverted');
  check(r.percentile >= 0 && r.percentile <= 100, 'report ' + i + ': percentile out of bounds');
  check(r.nCorrect >= 0 && r.nCorrect <= items.length, 'report ' + i + ': nCorrect out of bounds');
});

// per-domain subscores must also be computable
['MR', 'NL', 'VR', 'SR'].forEach(function (code) {
  var subset = items.filter(function (it) { return it.domain === code; })
    .map(function (it, i) { return { item: it, correct: i % 2 === 0 }; });
  var r = CS.irt.report(subset, { floor: 55, ceiling: 145 });
  check(isFinite(r.iq), 'domain ' + code + ': subscore is not finite');
  check(r.semIQ > allRight.semIQ * 0.5, 'domain ' + code + ': subscore SEM is implausibly small for ' +
    subset.length + ' items');
});

// ---------------------------------- 5. the runner's DOM contract holds

var runnerSrc = fs.readFileSync(path.join(ROOT, 'assets/js/test.js'), 'utf8');
var pageHtml = fs.readFileSync(path.join(DIST, 'test/index.html'), 'utf8');

var idRe = /getElementById\(['"]([^'"]+)['"]\)/g;
var ids = [];
var m;
while ((m = idRe.exec(runnerSrc)) !== null) {
  if (ids.indexOf(m[1]) === -1) ids.push(m[1]);
}
check(ids.length > 8, 'suspiciously few element ids found in the runner (' + ids.length + ')');

/* Ids the runner creates itself at run time rather than finding in the page. */
var RUNTIME_CREATED = ['q-heading', 'btn-print', 'btn-restart'];

ids.forEach(function (id) {
  if (RUNTIME_CREATED.indexOf(id) !== -1) return;
  check(pageHtml.indexOf('id="' + id + '"') !== -1,
    'runner looks up #' + id + ' but /test/ contains no such element');
});

/* Class hooks the runner and the ad loader depend on. */
[['screen-test', 'class="screen" id="screen-test"'],
 ['tpl-results-ad', 'id="tpl-results-ad"']].forEach(function (pair) {
  check(pageHtml.indexOf(pair[1]) !== -1, 'page is missing the hook: ' + pair[0]);
});

/* The results ad template must exist and must sit OUTSIDE the question flow. */
var testSection = pageHtml.match(/<section class="screen" id="screen-test"[\s\S]*?<\/section>/);
check(!!testSection, 'could not locate the question section in /test/');
if (testSection) {
  check(testSection[0].indexOf('tpl-results-ad') === -1,
    'the results ad template is inside the question flow');
}

// site.js and ads.js must be referenced by the page
['assets/js/engine.js', 'assets/js/test.js', 'assets/js/site.js', 'assets/js/ads.js']
  .forEach(function (src) {
    check(pageHtml.indexOf(src) !== -1, '/test/ does not load ' + src);
  });

// ------------------------------------------------------ 6. determinism

var second = CS.bank.build();
check(JSON.stringify(items.map(function (i) { return i.id + ':' + i.answer; })) ===
      JSON.stringify(second.map(function (i) { return i.id + ':' + i.answer; })),
  'item generation is not deterministic between builds');

var nodeItems = require('../src/lib/bank.js').build();
check(JSON.stringify(nodeItems.map(function (i) { return i.id + ':' + i.answer; })) ===
      JSON.stringify(items.map(function (i) { return i.id + ':' + i.answer; })),
  'the browser bundle and the Node modules disagree about the answer key');

// ------------------------------------------------------------------ report

console.log('CogniScale runtime smoke test');
console.log('=============================');
console.log(items.length + ' items exercised, ' + checks + ' assertions');
console.log('');
/* Rarity must describe the tail the score actually falls in. Reporting only the
 * upper tail made every below-average score read "more common than 1 in 2". */
check(allWrong.rarityDirection === 'below',
  'a well-below-average score should report rarity in the lower tail');
check(allRight.rarityDirection === 'above',
  'a well-above-average score should report rarity in the upper tail');
check(allWrong.rarity > 5,
  'rarity for a bottom-end score should be meaningfully rare, got 1 in ' + allWrong.rarity.toFixed(1));
check(allRight.rarity > 5,
  'rarity for a top-end score should be meaningfully rare, got 1 in ' + allRight.rarity.toFixed(1));
check(Math.abs(allWrong.rarity - 1 / (allWrong.percentile / 100)) < 0.01,
  'lower-tail rarity should be the reciprocal of the percentile');

console.log('  scoring sanity');
console.log('    all wrong       IQ ' + String(allWrong.iq).padStart(4) +
  '   (raw ' + allWrong.rawIQ.toFixed(1) + ', capped ' + allWrong.capped + ')');
console.log('    easy items only IQ ' + String(easyOnly.iq).padStart(4) +
  '   95% CI ' + easyOnly.ci95[0] + '-' + easyOnly.ci95[1]);
console.log('    every other one IQ ' + String(half.iq).padStart(4) +
  '   95% CI ' + half.ci95[0] + '-' + half.ci95[1]);
console.log('    all correct     IQ ' + String(allRight.iq).padStart(4) +
  '   (raw ' + allRight.rawIQ.toFixed(1) + ', capped ' + allRight.capped + ')');
console.log('');
console.log('  runner DOM contract: ' + ids.length + ' element ids checked against /test/');
console.log('');

if (failures.length) {
  console.log('FAILED (' + failures.length + ' of ' + checks + ')');
  failures.forEach(function (f) { console.log('  x ' + f); });
  process.exit(1);
}
console.log('PASSED - all ' + checks + ' assertions hold.');
