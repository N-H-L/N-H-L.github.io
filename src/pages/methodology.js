/* CogniScale - methodology / research page.
 *
 * The precision table and the item-blueprint table on this page are COMPUTED
 * FROM THE SHIPPED ITEM BANK at build time, not typed in. If the bank changes,
 * this page changes with it, and it cannot quietly drift into being wrong. */
'use strict';

var P = require('./_parts.js');
var bank = require('../lib/bank.js');
var irt = require('../lib/irt.js');
var itemBank = require('../data/items.js');
var cfg = require('../../site.config.js');

var items = bank.build();

// ---- computed: measurement precision across the reportable range ------------
var precisionRows = [];
for (var t = -2.5; t <= 2.51; t += 0.5) {
  var info = items.reduce(function (acc, it) { return acc + irt.information(t, it); }, 0);
  var sem = 15 / Math.sqrt(info);
  var iq = Math.round(100 + 15 * t);
  precisionRows.push(
    '<tr><td class="num">' + iq + '</td>' +
    '<td class="num">' + sem.toFixed(1) + '</td>' +
    '<td class="num">&plusmn;' + (1.96 * sem).toFixed(0) + '</td>' +
    '<td class="num">' + (Math.round(irt.percentileFromTheta(t) * 10) / 10) + '</td></tr>'
  );
}

// ---- computed: the blueprint ------------------------------------------------
var blueprintRows = ['MR', 'NL', 'VR', 'SR'].map(function (code) {
  var d = itemBank.DOMAINS[code];
  var xs = items.filter(function (i) { return i.domain === code; });
  var bs = xs.map(function (i) { return i.b; });
  return '<tr>' +
    '<td><b>' + P.esc(d.name) + '</b><br><span class="small muted">' + P.esc(d.chc) + '</span></td>' +
    '<td class="num">' + xs.length + '</td>' +
    '<td class="num">' + xs[0].options.length + '</td>' +
    '<td class="num">' + d.a.toFixed(2) + '</td>' +
    '<td class="num">' + Math.min.apply(null, bs).toFixed(1) + ' to ' + Math.max.apply(null, bs).toFixed(1) + '</td>' +
    '</tr>';
}).join('');

var totalMinutes = Math.round(cfg.test.timeLimitSeconds / 60);

var REFS = [
  { id: 'r1', text: 'Carroll, J. B. (1993). Human Cognitive Abilities: A Survey of Factor-Analytic Studies. Cambridge University Press.' },
  { id: 'r2', text: 'Cattell, R. B. (1963). Theory of fluid and crystallized intelligence: A critical experiment. Journal of Educational Psychology, 54(1), 1-22.' },
  { id: 'r3', text: 'Schneider, W. J., & McGrew, K. S. (2018). The Cattell-Horn-Carroll theory of cognitive abilities. In D. P. Flanagan & E. M. McDonough (Eds.), Contemporary Intellectual Assessment (4th ed., pp. 73-163). Guilford Press.' },
  { id: 'r4', text: 'Condon, D. M., & Revelle, W. (2014). The International Cognitive Ability Resource: Development and initial validation of a public-domain measure. Intelligence, 43, 52-64.', url: 'https://doi.org/10.1016/j.intell.2014.01.004', linkText: 'doi:10.1016/j.intell.2014.01.004' },
  { id: 'r5', text: 'Young, S. R., & Keith, T. Z. (2020). An examination of the convergent validity of the ICAR16 and WAIS-IV. Journal of Psychoeducational Assessment, 38(8), 1052-1059.', url: 'https://doi.org/10.1177/0734282920943455', linkText: 'doi:10.1177/0734282920943455' },
  { id: 'r6', text: 'Carpenter, P. A., Just, M. A., & Shell, P. (1990). What one intelligence test measures: A theoretical account of the processing in the Raven Progressive Matrices Test. Psychological Review, 97(3), 404-431.' },
  { id: 'r7', text: 'Embretson, S. E., & Reise, S. P. (2000). Item Response Theory for Psychologists. Lawrence Erlbaum Associates.' },
  { id: 'r8', text: 'Birnbaum, A. (1968). Some latent trait models and their use in inferring an examinee’s ability. In F. M. Lord & M. R. Novick, Statistical Theories of Mental Test Scores (pp. 397-479). Addison-Wesley.' },
  { id: 'r9', text: 'Bock, R. D., & Mislevy, R. J. (1982). Adaptive EAP estimation of ability in a microcomputer environment. Applied Psychological Measurement, 6(4), 431-444.' },
  { id: 'r10', text: 'Shepard, R. N., & Metzler, J. (1971). Mental rotation of three-dimensional objects. Science, 171(3972), 701-703.' },
  { id: 'r11', text: 'Vandenberg, S. G., & Kuse, A. R. (1978). Mental rotations, a group test of three-dimensional spatial visualization. Perceptual and Motor Skills, 47(2), 599-604.' },
  { id: 'r12', text: 'Pietschnig, J., & Voracek, M. (2015). One century of global IQ gains: A formal meta-analysis of the Flynn effect (1909-2013). Perspectives on Psychological Science, 10(3), 282-306.', url: 'https://doi.org/10.1177/1745691615577701', linkText: 'doi:10.1177/1745691615577701' },
  { id: 'r13', text: 'Frey, M. C., & Detterman, D. K. (2004). Scholastic assessment or g? The relationship between the Scholastic Assessment Test and general cognitive ability. Psychological Science, 15(6), 373-378.' },
  { id: 'r14', text: 'Deary, I. J., Strand, S., Smith, P., & Fernandes, C. (2007). Intelligence and educational achievement. Intelligence, 35(1), 13-21.' },
  { id: 'r15', text: 'Wechsler, D. (2008). Wechsler Adult Intelligence Scale - Fourth Edition: Technical and Interpretive Manual. Pearson.' },
  { id: 'r16', text: 'American Educational Research Association, American Psychological Association, & National Council on Measurement in Education (2014). Standards for Educational and Psychological Testing. AERA.' },
  { id: 'r17', text: 'Gierl, M. J., & Haladyna, T. M. (Eds.) (2013). Automatic Item Generation: Theory and Practice. Routledge.' }
];

module.exports = {
  slug: 'methodology',
  title: 'How This IQ Test Works: Methodology and Evidence | CogniScale',
  ogTitle: 'Methodology - how the CogniScale IQ test is built and scored',
  description: 'The full method behind this free IQ test: what it measures, how items are built and verified, the item response model used to score it, and its limits.',
  updated: '2026-09-06',
  breadcrumbs: [{ slug: '', name: 'Home' }, { slug: 'methodology', name: 'Methodology' }],
  ogType: 'article',
  jsonld: [{
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'How this IQ test works: methodology and evidence',
    description: 'The construct measured, item construction and verification, the item response model used for scoring, measured precision, and stated limitations.',
    inLanguage: 'en',
    datePublished: '2026-09-06',
    dateModified: '2026-09-06',
    author: { '@type': 'Organization', name: cfg.name, url: cfg.origin + '/' },
    publisher: { '@id': cfg.origin + '/#org' },
    mainEntityOfPage: { '@type': 'WebPage', '@id': cfg.origin + '/methodology/' },
    citation: REFS.map(function (r) { return r.text; })
  }],

  body:
    '<div class="wrap"><div class="page-head prose">' +
      '<h1>How this test works</h1>' +
      '<p class="lede">Everything below describes the test you can actually take on this site: what it ' +
      'measures, how each question was built, how the score is computed, how precise it is, and where it ' +
      'falls down. If any of it looks wrong, <a href="/contact/">say so</a>.</p>' +
    '</div></div>' +

    '<div class="wrap prose">' +
      P.updatedLine('2026-09-06') +

      '<div class="toc">' +
        '<h4>On this page</h4>' +
        '<ol>' +
          '<li><a href="#construct">What is being measured</a></li>' +
          '<li><a href="#item-types">Why these four question types</a></li>' +
          '<li><a href="#construction">How the items were built and checked</a></li>' +
          '<li><a href="#scoring">How the score is computed</a></li>' +
          '<li><a href="#precision">How precise the score is</a></li>' +
          '<li><a href="#norms">Where the norms come from</a></li>' +
          '<li><a href="#limitations">Limitations</a></li>' +
          '<li><a href="#privacy">What happens to your data</a></li>' +
          '<li><a href="#references">References</a></li>' +
        '</ol>' +
      '</div>' +

      // ------------------------------------------------------------ construct
      '<h2 id="construct">1. What is being measured</h2>' +
      '<p>Scores on almost any set of cognitive tasks correlate positively with one another. Someone who ' +
      'does well on verbal problems tends to do better than average on spatial ones too. That pattern - the ' +
      '"positive manifold" - is the oldest robust finding in the field, and the general factor extracted ' +
      'from it is conventionally written <em>g</em>.' + P.ref(1, 'r1') + '</p>' +

      '<p>The dominant map of what sits underneath <em>g</em> is the Cattell&ndash;Horn&ndash;Carroll model, ' +
      'which arranges abilities in three strata: <em>g</em> at the top, around eight to sixteen broad ' +
      'abilities beneath it, and dozens of narrow abilities below those.' + P.ref(3, 'r3') + ' ' +
      'The broad abilities this test samples are:</p>' +

      '<ul>' +
        '<li><b>Fluid reasoning (Gf)</b> &mdash; solving novel problems that cannot be answered from stored ' +
        'knowledge. Cattell separated this from crystallised ability in 1963 and the distinction has held up.' + P.ref(2, 'r2') + '</li>' +
        '<li><b>Comprehension-knowledge (Gc)</b> &mdash; the breadth and depth of acquired knowledge, and the ' +
        'ability to reason with it.</li>' +
        '<li><b>Visual processing (Gv)</b> &mdash; generating, holding and transforming visual images.</li>' +
      '</ul>' +

      '<p>A 30-item test cannot measure all of CHC. What it can do is sample a few broad abilities that load ' +
      'heavily on <em>g</em> and report a composite, which is what this test does.</p>' +

      // ----------------------------------------------------------- item types
      '<h2 id="item-types">2. Why these four question types</h2>' +
      '<p>The blueprint follows the International Cognitive Ability Resource (ICAR), a public research ' +
      'project that set out to build a validated cognitive battery outside the commercial publishers. ' +
      'Condon and Revelle’s initial validation drew on 96,958 participants from 199 countries and settled ' +
      'on four item types: matrix reasoning, letter and number series, verbal reasoning, and ' +
      'three-dimensional rotation.' + P.ref(4, 'r4') + ' Their 16-item short form reached an internal ' +
      'consistency of &alpha;&nbsp;=&nbsp;0.81 and &omega;<sub>total</sub>&nbsp;=&nbsp;0.83.</p>' +

      '<p>A later study administered that short form alongside the WAIS-IV, the standard supervised adult ' +
      'battery, to 97 university students. ICAR16 scores correlated <b>r&nbsp;=&nbsp;.81</b> with WAIS-IV ' +
      'Full Scale IQ, and the latent general factors correlated .94.' + P.ref(5, 'r5') + ' That is strong ' +
      'evidence that a short, unsupervised, purely online battery of this shape captures much of what a long ' +
      'supervised one does &mdash; with two caveats worth stating up front: the sample was small and made up ' +
      'of students, which restricts range and tends to <em>deflate</em> correlations, while a convenience ' +
      'sample of this kind also cannot be assumed representative.</p>' +

      '<div class="note note-strong">' +
        '<h4>What this test borrows, and what it does not</h4>' +
        '<p>The ICAR item bank is licensed for academic use only. <b>No ICAR item appears on this site.</b> ' +
        'What is taken from that work is the published <em>methodology</em> &mdash; which item families to use, ' +
        'how to construct them, and roughly how they behave. Every question here is original and was written ' +
        'for this test.</p>' +
      '</div>' +

      '<div class="table-wrap"><table>' +
        '<caption class="visually-hidden">Test blueprint by domain</caption>' +
        '<thead><tr><th>Domain</th><th class="num">Items</th><th class="num">Options</th>' +
        '<th class="num">Discrimination (a)</th><th class="num">Difficulty range (b)</th></tr></thead>' +
        '<tbody>' + blueprintRows + '</tbody>' +
      '</table></div>' +
      '<p class="small muted">Generated directly from the live item bank at build time. Discrimination is ' +
      'set per domain from the reported <em>g</em>-loadings of each item family: verbal reasoning and ' +
      'letter/number series load highest, spatial rotation lowest.' + P.ref(4, 'r4') + '</p>' +

      // ---------------------------------------------------------- construction
      '<h2 id="construction">3. How the items were built and checked</h2>' +

      '<h3>Figural matrices</h3>' +
      '<p>Each matrix is generated from an explicit rule set rather than drawn freehand. The rules are the ' +
      'ones Carpenter, Just and Shell identified when they reverse-engineered what the Raven’s matrices ' +
      'actually demand: <em>constant in a row</em>, <em>quantitative pairwise progression</em>, ' +
      '<em>distribution of three</em>, and <em>figure addition and subtraction</em>. Their central finding was ' +
      'that item difficulty is driven mainly by the number of rules a solver must hold and apply at ' +
      'once.' + P.ref(6, 'r6') + ' This test uses that directly: easy matrices run one rule, the hardest run three.</p>' +
      '<p>A second family presents each cell as a grid of marks where the third cell in a row is a boolean ' +
      'function (union, intersection, exclusive-or, or subtraction) of the first two. Building items by ' +
      'algorithm rather than by hand is the approach the automatic item generation literature ' +
      'recommends,' + P.ref(17, 'r17') + ' and it has a practical benefit: the universe of possible items is ' +
      'large enough that item exposure is much less of a threat.</p>' +

      '<h3>Series</h3>' +
      '<p>Each series is stored as a declarative generator - an arithmetic step, a constant second difference, ' +
      'a repeating cycle of increments, two interleaved sub-sequences, a recurrence - rather than as a typed ' +
      'list of terms. The build re-derives every displayed term and the keyed answer from that generator, so ' +
      'the rule stated in the explanation and the answer marked correct are guaranteed to be the same thing.</p>' +

      '<h3>Spatial rotation</h3>' +
      '<p>The spatial items are a planar version of the Shepard and Metzler rotation task' + P.ref(10, 'r10') + ' ' +
      'in the group-administered form Vandenberg and Kuse popularised.' + P.ref(11, 'r11') + ' Each target ' +
      'figure is <em>chiral</em>: its mirror image cannot be produced by any rotation of the original. That ' +
      'property is what makes the item well-posed, and it is what makes the strong distractors possible - ' +
      'they are reflections, which is the classic error in this task.</p>' +

      '<h3>Verbal reasoning</h3>' +
      '<p>Verbal items are analogies, category exclusions and deductive inferences. Vocabulary is kept ' +
      'deliberately common: the target is the relation or the inference, not whether you happen to know an ' +
      'unusual word. This is the item family most exposed to cultural and educational background, which is ' +
      'noted again under <a href="#limitations">limitations</a>.</p>' +

      '<h3>Every item is machine-checked before release</h3>' +
      '<p>A verifier runs over the whole bank on every build and refuses to ship if any assertion fails. ' +
      'It currently proves, for all 30 items:</p>' +
      '<ul>' +
        '<li>exactly one option is correct, and it is the one keyed as correct</li>' +
        '<li>no two options render identically (rotations of a circle, for instance, are not "different")</li>' +
        '<li>a matrix’s answer is genuinely determined by a rule that operates along the row</li>' +
        '<li>a matrix that varies rotation uses a shape on which rotation is actually visible</li>' +
        '<li>a boolean matrix is explained by exactly one operator, so no second reading works</li>' +
        '<li>a series answer is re-derivable from its declared generating rule</li>' +
        '<li>a spatial target is chiral, so its reflections really are wrong</li>' +
        '<li>no figure overflows its box and gets clipped</li>' +
        '<li>the difficulty ladder has no gap large enough to leave a band of ability unresolved</li>' +
      '</ul>' +
      '<p>This catches construction errors. It cannot catch an item that is well-formed but measures the ' +
      'wrong thing &mdash; only data can do that, which is the subject of <a href="#norms">section 6</a>.</p>' +

      // -------------------------------------------------------------- scoring
      '<h2 id="scoring">4. How the score is computed</h2>' +
      '<p>Most free tests count correct answers and apply a formula. That treats every question as equal ' +
      'evidence, when a hard question obviously tells you more about a strong performer than an easy one does. ' +
      'This test uses an item response model instead.' + P.ref(7, 'r7') + '</p>' +

      '<p>Each item is described by three parameters, in the three-parameter logistic model:' + P.ref(8, 'r8') + '</p>' +
      '<div class="note"><p style="margin:0;font-family:var(--mono);font-size:.92rem">' +
      'P(correct | &theta;) = c + (1 &minus; c) / (1 + e<sup>&minus;1.702&thinsp;a&thinsp;(&theta; &minus; b)</sup>)' +
      '</p></div>' +
      '<ul>' +
        '<li><b>b</b> &mdash; difficulty: the ability level at which the item is at the halfway point.</li>' +
        '<li><b>a</b> &mdash; discrimination: how sharply the item separates people around that point.</li>' +
        '<li><b>c</b> &mdash; the guessing floor, fixed at 1&thinsp;/&thinsp;(number of options), so a ' +
        'six-option matrix is never scored as though a blind guess were impossible.</li>' +
      '</ul>' +

      '<p>Ability (&theta;) is estimated by <b>expected a posteriori</b> estimation over a fixed grid with a ' +
      'standard normal prior.' + P.ref(9, 'r9') + ' EAP is used rather than maximum likelihood for two ' +
      'reasons: maximum likelihood is undefined for a perfect or a zero score, and the posterior standard ' +
      'deviation gives a per-person standard error &mdash; which is what makes an honest confidence interval ' +
      'possible instead of a bare number.</p>' +

      '<p>The final score is the conventional deviation IQ, <b>100 + 15&thinsp;&theta;</b>. Unanswered ' +
      'questions are scored as incorrect; the test says so before you start, so that skipping is not a ' +
      'scoring strategy.</p>' +

      // ------------------------------------------------------------ precision
      '<h2 id="precision">5. How precise the score is</h2>' +
      '<p>Every measurement has error, and a test that hides it is misleading you. The table below is ' +
      'computed from the test information function of the actual item bank on this site.</p>' +

      '<div class="table-wrap"><table>' +
        '<caption class="visually-hidden">Measurement precision across the score range</caption>' +
        '<thead><tr><th class="num">Score</th><th class="num">Standard error</th>' +
        '<th class="num">95% interval</th><th class="num">Percentile</th></tr></thead>' +
        '<tbody>' + precisionRows.join('') + '</tbody>' +
      '</table></div>' +

      '<p>Read that as: a reported score of 100 means the evidence is consistent with a true standing ' +
      'anywhere in roughly the low 90s to the high 100s. Precision is best in the middle, because that is ' +
      'where most of the items sit, and degrades toward the tails where there are fewer items to separate ' +
      'people. Scores outside ' + cfg.test.reportFloor + '&ndash;' + cfg.test.reportCeiling + ' are not ' +
      'reported as numbers at all, because a 30-item test cannot resolve them; the result page says so ' +
      'explicitly when it happens.</p>' +

      '<p>For comparison, the WAIS-IV reports a Full Scale IQ reliability of about .98 and a standard error ' +
      'of measurement near 2.2 points.' + P.ref(15, 'r15') + ' It takes 60 to 90 minutes with a trained ' +
      'examiner present. This test is faster and free; it is also less precise, and the gap is the honest ' +
      'price of that.</p>' +

      // ---------------------------------------------------------------- norms
      '<h2 id="norms">6. Where the norms come from</h2>' +
      '<div class="note note-strong">' +
        '<h4>The weakest part of this test, stated plainly</h4>' +
        '<p style="margin:0">The item difficulties here are <b>rational, not empirical</b>. They were assigned ' +
        'from the structural complexity of each item and anchored to published difficulty data for comparable ' +
        'item families. They have <b>not</b> been calibrated on a norming sample of this test’s own takers, ' +
        'because this site collects no data with which to do that.</p>' +
      '</div>' +
      '<p>A properly normed test is standardised on a large sample chosen to represent a defined population, ' +
      'and its score scale is fixed against that sample’s actual performance.' + P.ref(16, 'r16') + ' ' +
      'This test is not normed in that sense. What it does instead is place items on a scale derived from ' +
      'published performance on structurally similar item families, then assume the reference population is ' +
      'standard normal.</p>' +
      '<p>The practical consequence: <b>relative</b> information is more trustworthy than the ' +
      '<b>absolute</b> number. Which of your four domain scores is strongest, and whether you are broadly ' +
      'above or below the middle, is fairly robust. Whether your score is 118 rather than 112 is not &mdash; ' +
      'and the confidence interval on the result page is there to keep that visible.</p>' +
      '<p>There is a further wrinkle that affects every IQ test, not just this one. Raw performance has ' +
      'drifted upward for a century &mdash; the Flynn effect. The largest meta-analysis, covering 271 samples ' +
      'and close to four million people across 31 countries, puts the gain at about 0.28 IQ points per year ' +
      'for full-scale scores, and larger for fluid reasoning specifically.' + P.ref(12, 'r12') + ' Publishers ' +
      'respond by renorming every decade or two. Any test’s scale is therefore tied to a moment in time.</p>' +

      // ---------------------------------------------------------- limitations
      '<h2 id="limitations">7. Limitations</h2>' +
      '<ol>' +
        '<li><b>Not a clinical instrument.</b> This score cannot diagnose anything, cannot support an ' +
        'application for accommodations or a gifted programme, and is not equivalent to a supervised ' +
        'assessment. Only a qualified psychologist can produce a score with standing.</li>' +
        '<li><b>Provisional norms.</b> See section 6. The absolute number is the least trustworthy part ' +
        'of the report.</li>' +
        '<li><b>Unsupervised conditions.</b> There is no invigilator. Interruptions, note-taking, second ' +
        'attempts and outside help are all possible, and all of them break the assumptions.</li>' +
        '<li><b>Practice effects.</b> Retaking the same 30 items will inflate your score. Real batteries ' +
        'maintain alternate forms and recommend retest intervals for exactly this reason.</li>' +
        '<li><b>A narrow slice of CHC.</b> Working memory, processing speed, auditory processing and ' +
        'long-term retrieval are not measured at all. The composite is not a full-scale IQ.</li>' +
        '<li><b>Cultural and linguistic loading.</b> The verbal items assume fluent English and a broadly ' +
        'Western schooling background. The figural, series and spatial items are less exposed to this but ' +
        'not free of it &mdash; test-taking familiarity itself is learned.</li>' +
        '<li><b>Subscores are noisy.</b> Each domain score rests on six to ten items. Domain scores are ' +
        'reported with deliberately wide intervals and should be read as a rough profile shape, never as ' +
        'four separate precise measurements.</li>' +
        '<li><b>Day-to-day variation.</b> Sleep, illness, stress, caffeine, motivation and the device you ' +
        'are using all move scores around, and none of that is captured.</li>' +
        '<li><b>A score is a rank, not a quantity.</b> It describes where performance sits relative to a ' +
        'reference distribution. It does not measure a substance, and it does not set a ceiling on anyone.</li>' +
      '</ol>' +

      // -------------------------------------------------------------- privacy
      '<h2 id="privacy">8. What happens to your data</h2>' +
      '<p>The test runs entirely in your browser. Questions are generated locally, your answers are held in ' +
      'your browser’s own session storage so that a refresh does not lose your progress, and the score is ' +
      'computed on your device. None of it is transmitted to this site, because there is no server-side ' +
      'component to receive it. Closing the tab discards it.</p>' +
      '<p>The site is funded by display advertising, which is the one third party involved. Ads appear on ' +
      'content pages and below the score on the results page &mdash; never during the test itself. ' +
      '<a href="/privacy/">The privacy policy has the detail.</a></p>' +

      // ----------------------------------------------------------- references
      '<h2 id="references">9. References</h2>' +
      P.refs(REFS) +

      '<hr>' +
      '<p class="small muted">Found an error, an ambiguous item, or a claim that overstates the evidence? ' +
      '<a href="/contact/">Report it</a> &mdash; corrections are made and dated on this page.</p>' +
    '</div>' +

    P.cta('See where you land', 'Thirty questions, about ' + totalMinutes + ' minutes, and a score with the uncertainty attached.')
};
