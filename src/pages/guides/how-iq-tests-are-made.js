/* Guide: how IQ tests are built and normed. */
'use strict';

var guide = require('./_guide.js');
var P = require('../_parts.js');

var REFS = [
  { id: 'g10r1', text: 'American Educational Research Association, American Psychological Association, & National Council on Measurement in Education (2014). Standards for Educational and Psychological Testing. AERA.' },
  { id: 'g10r2', text: 'Wechsler, D. (2008). Wechsler Adult Intelligence Scale - Fourth Edition: Technical and Interpretive Manual. Pearson.' },
  { id: 'g10r3', text: 'Lord, F. M., & Novick, M. R. (1968). Statistical Theories of Mental Test Scores. Addison-Wesley.' },
  { id: 'g10r4', text: 'Embretson, S. E., & Reise, S. P. (2000). Item Response Theory for Psychologists. Lawrence Erlbaum.' },
  { id: 'g10r5', text: 'Cronbach, L. J., & Meehl, P. E. (1955). Construct validity in psychological tests. Psychological Bulletin, 52(4), 281-302.' },
  { id: 'g10r6', text: 'Pietschnig, J., & Voracek, M. (2015). One century of global IQ gains: A formal meta-analysis of the Flynn effect (1909-2013). Perspectives on Psychological Science, 10(3), 282-306.', url: 'https://doi.org/10.1177/1745691615577701', linkText: 'doi:10.1177/1745691615577701' },
  { id: 'g10r7', text: 'Condon, D. M., & Revelle, W. (2014). The International Cognitive Ability Resource: Development and initial validation of a public-domain measure. Intelligence, 43, 52-64.', url: 'https://doi.org/10.1016/j.intell.2014.01.004', linkText: 'doi:10.1016/j.intell.2014.01.004' },
  { id: 'g10r8', text: 'Carroll, J. B. (1993). Human Cognitive Abilities: A Survey of Factor-Analytic Studies. Cambridge University Press.' }
];

module.exports = guide({
  slug: 'how-iq-tests-are-made',
  crumb: 'How IQ tests are built',
  h1: 'How IQ tests are built and normed',
  title: 'How IQ Tests Are Built and Normed | CogniScale',
  description: 'What separates a real psychometric instrument from a quiz: a blueprint, piloted items, item statistics, a standardisation sample, and published reliability evidence.',
  lede: 'A score only means something because of work done long before you sat down. Understanding that pipeline is the fastest way to tell a real test from a quiz wearing its clothes.',
  updated: '2026-09-09',
  published: '2026-09-09',
  toc: [
    { id: 'blueprint', label: '1. The blueprint' },
    { id: 'items', label: '2. Writing and piloting items' },
    { id: 'stats', label: '3. Item statistics' },
    { id: 'norming', label: '4. The standardisation sample' },
    { id: 'evidence', label: '5. Reliability and validity' },
    { id: 'decay', label: '6. Norms decay' },
    { id: 'scorecard', label: 'Where this test sits' }
  ],
  refs: REFS,

  bodyTop:
    '<h2 id="blueprint">1. The blueprint</h2>' +
    '<p>Before an item is written, a test needs a specification: what it claims to measure, and how that ' +
    'claim maps onto content.</p>' +
    '<p>For cognitive ability the usual reference is the Cattell-Horn-Carroll model, built from a survey ' +
    'of more than 460 factor-analytic datasets. It arranges abilities in three strata: general ability at ' +
    'the top, around a dozen broad abilities beneath it, and many narrow ones below those.' +
    P.ref(8, 'g10r8') + ' A blueprint says which broad abilities will be sampled, with how many items ' +
    'each, and why.</p>' +
    '<p>Skipping this step is what produces tests that are really just a pile of puzzles. If nobody can ' +
    'say what construct an item was chosen to measure, the total has no defined meaning.</p>' +

    '<h2 id="items">2. Writing and piloting items</h2>' +
    '<p>Items are drafted against the blueprint, reviewed for ambiguity and cultural loading, then ' +
    '<b>piloted</b> - given to a sample purely to find out how they behave. Piloting is where most items ' +
    'die. Typical failure modes:</p>' +
    '<ul>' +
      '<li><b>Two defensible answers.</b> A second reading of the item works and is not the key.</li>' +
      '<li><b>A giveaway distractor.</b> One option is obviously odd, so the item becomes a three-way ' +
      'guess.</li>' +
      '<li><b>Negative discrimination.</b> High scorers get it wrong more often than low scorers - a ' +
      'reliable sign the item is measuring something other than intended.</li>' +
      '<li><b>Ceiling or floor.</b> Almost everyone passes or almost everyone fails, so the item ' +
      'separates nobody.</li>' +
    '</ul>' +
    '<p>An automatic generation approach changes this stage considerably: if items are produced from ' +
    'explicit rules, correctness can be proved rather than piloted, and difficulty can be predicted from ' +
    'structure.' + P.ref(7, 'g10r7') + ' It does not remove the need for empirical data - it removes the ' +
    'need to <i>discover</i> that an item is broken.</p>' +

    '<h2 id="stats">3. Item statistics</h2>' +
    '<p>Every surviving item gets numbers attached. Classical test theory gives two:' + P.ref(3, 'g10r3') + '</p>' +
    '<ul>' +
      '<li><b>Difficulty (p)</b> - the proportion answering correctly.</li>' +
      '<li><b>Discrimination</b> - how well the item separates people who scored high overall from those ' +
      'who scored low.</li>' +
    '</ul>' +
    '<p>Modern tests use item response theory instead, which models the probability of a correct answer ' +
    'as a function of ability.' + P.ref(4, 'g10r4') + ' The three-parameter logistic model gives each ' +
    'item:</p>' +
    '<div class="table-wrap"><table>' +
      '<thead><tr><th>Parameter</th><th>Meaning</th></tr></thead>' +
      '<tbody>' +
        '<tr><td><b>b</b> - difficulty</td><td>The ability level at which the item becomes an even bet</td></tr>' +
        '<tr><td><b>a</b> - discrimination</td><td>How sharply the item separates people around that level</td></tr>' +
        '<tr><td><b>c</b> - guessing</td><td>The floor set by chance on a multiple-choice item</td></tr>' +
      '</tbody>' +
    '</table></div>' +
    '<p>The payoff is that a hard item passed counts as stronger evidence than an easy one, and the model ' +
    'reports <i>how precisely</i> ability has been estimated at each point on the scale - which is where ' +
    'the confidence interval on a score comes from.</p>',

  bodyBottom:
    '<h2 id="norming">4. The standardisation sample</h2>' +
    '<p>This is the step that actually creates the IQ number, and the step cheap tests skip.</p>' +
    '<p>A large sample is recruited to match a target population on age, sex, education, region and other ' +
    'characteristics. The WAIS-IV standardisation sample, for instance, comprised 2,200 adults stratified ' +
    'against United States census figures.' + P.ref(2, 'g10r2') + ' Their raw scores are then transformed ' +
    'so the mean becomes 100 and the standard deviation 15.</p>' +
    '<div class="note">' +
      '<p style="margin:0">Everything an IQ score means comes from this sample. The number is a ' +
      '<b>rank against a specific reference group</b>, not a measurement of a quantity. Change the ' +
      'reference group and the same performance yields a different score. A test with no ' +
      'standardisation sample is not producing an IQ in any meaningful sense, whatever number it ' +
      'prints.</p>' +
    '</div>' +
    '<p>Norms are usually banded by age, because raw performance varies systematically across the ' +
    'lifespan. A 65-year-old and a 25-year-old with identical raw scores receive different IQs, because ' +
    'each is ranked against their own age group.</p>' +

    '<h2 id="evidence">5. Reliability and validity</h2>' +
    '<p>Two different questions, routinely confused.</p>' +
    '<p><b>Reliability</b> asks whether the test measures consistently. Internal consistency ' +
    '(coefficient alpha, or preferably omega) checks whether items agree with each other; test-retest ' +
    'checks stability over time. The WAIS-IV reports full-scale reliability around 0.98, which is ' +
    'exceptionally high and reflects its length.' + P.ref(2, 'g10r2') + '</p>' +
    '<p><b>Validity</b> asks whether it measures the right thing - and is not a single number but an ' +
    'accumulating argument built from several kinds of evidence: does the internal structure match the ' +
    'blueprint, does it correlate with established measures, does it predict relevant outcomes.' +
    P.ref(5, 'g10r5') + P.ref(1, 'g10r1') + '</p>' +
    '<p>A test can be highly reliable and invalid. A bathroom scale that always reads four kilos heavy is ' +
    'perfectly reliable. Reliability is necessary and nowhere near sufficient.</p>' +

    '<h2 id="decay">6. Norms decay</h2>' +
    '<p>A standardisation sample is a photograph of a population at a moment. Raw performance drifted ' +
    'upward through the twentieth century at roughly <b>0.28 IQ points per year</b>.' + P.ref(6, 'g10r6') + '</p>' +
    '<p>So a test normed in 2000 and still scored against those norms will, by 2026, be handing out ' +
    'scores several points too generous. This is why publishers renorm every decade or two, and why the ' +
    'date of the norms is a material fact about any score. See ' +
    '<a href="/guides/average-iq/">what is an average IQ</a> for how renorming keeps the mean pinned at ' +
    '100.</p>' +

    '<h2 id="scorecard">Where this test sits</h2>' +
    '<p>Honestly, against the pipeline above:</p>' +
    '<div class="table-wrap"><table>' +
      '<thead><tr><th>Stage</th><th>This test</th></tr></thead>' +
      '<tbody>' +
        '<tr><td>Blueprint</td><td><b>Yes.</b> Four broad CHC abilities, item counts and rationale published in the methodology.</td></tr>' +
        '<tr><td>Item correctness</td><td><b>Proved, not piloted.</b> Rule-generated items, verified by two independent implementations on every build.</td></tr>' +
        '<tr><td>Item parameters</td><td><b>Rational, not empirical.</b> Difficulty assigned from structural complexity, anchored to published data for comparable item families.</td></tr>' +
        '<tr><td>Scoring model</td><td><b>Yes.</b> Three-parameter logistic IRT with expected a posteriori estimation.</td></tr>' +
        '<tr><td>Standardisation sample</td><td><b>No.</b> This is the honest gap.</td></tr>' +
        '<tr><td>Reliability</td><td><b>Estimated from the model</b>, not from a retest study.</td></tr>' +
        '<tr><td>Validity evidence</td><td><b>Argued from item design</b>, not demonstrated against a criterion.</td></tr>' +
      '</tbody>' +
    '</table></div>' +
    '<p>The machinery downstream of norming is genuine. The norms themselves are provisional, which is ' +
    'why the score is reported as an interval and capped at the extremes rather than presented as a ' +
    'precise figure. A site that quietly skipped step 4 and printed a confident number would be doing ' +
    'something worse than being imprecise - it would be hiding which part is guesswork.</p>',

  faq: [
    {
      q: 'What is a standardisation sample and why does it matter?',
      a: '<p>It is the group whose performance defines the scale. Their scores are transformed so the ' +
         'mean is 100 and the standard deviation 15, and everyone else is ranked against them. Without ' +
         'one, an IQ number has no defined reference point - it is a raw score wearing a costume.</p>'
    },
    {
      q: 'What is the difference between reliability and validity?',
      a: '<p>Reliability is consistency; validity is measuring the right thing. A scale that always reads ' +
         'four kilos heavy is perfectly reliable and completely invalid. Reliability is necessary but ' +
         'nowhere near sufficient, and a test reporting only reliability is telling you the easier half ' +
         'of the story.</p>'
    },
    {
      q: 'Why do IQ tests need renorming?',
      a: '<p>Because raw performance drifted upward at roughly 0.28 points a year through the twentieth ' +
         'century. Norms collected in 2000 would by now produce scores several points too generous, so ' +
         'publishers restandardise every decade or two to pull the mean back to 100.</p>'
    },
    {
      q: 'Does this test have proper norms?',
      a: '<p>No, and we say so throughout. The item parameters are rational - assigned from structural ' +
         'complexity and anchored to published difficulty data for comparable item families - rather ' +
         'than calibrated on a standardisation sample. The scoring model is real IRT; the norms it ' +
         'operates on are provisional.</p>'
    }
  ],

  related: [
    { href: '/guides/are-online-iq-tests-accurate/', title: 'Are online IQ tests accurate?',
      text: 'An eight-point checklist for judging any online test, with this one marked against it.' },
    { href: '/guides/average-iq/', title: 'What is an average IQ?',
      text: 'Why the average is 100 by construction, and how renorming keeps it there.' }
  ],

  ctaHeading: 'See the pipeline in action',
  ctaSub: 'Thirty items, an IRT-scored result, and a methodology page that shows its working.'
});
