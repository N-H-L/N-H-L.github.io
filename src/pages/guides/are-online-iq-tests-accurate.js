/* Guide: are online IQ tests accurate. */
'use strict';

var guide = require('./_guide.js');
var P = require('../_parts.js');
var cfg = require('../../../site.config.js');

var REFS = [
  { id: 'g3r1', text: 'Condon, D. M., & Revelle, W. (2014). The International Cognitive Ability Resource: Development and initial validation of a public-domain measure. Intelligence, 43, 52-64.', url: 'https://doi.org/10.1016/j.intell.2014.01.004', linkText: 'doi:10.1016/j.intell.2014.01.004' },
  { id: 'g3r2', text: 'Young, S. R., & Keith, T. Z. (2020). An examination of the convergent validity of the ICAR16 and WAIS-IV. Journal of Psychoeducational Assessment, 38(8), 1052-1059.', url: 'https://doi.org/10.1177/0734282920943455', linkText: 'doi:10.1177/0734282920943455' },
  { id: 'g3r3', text: 'Wechsler, D. (2008). Wechsler Adult Intelligence Scale - Fourth Edition: Technical and Interpretive Manual. Pearson.' },
  { id: 'g3r4', text: 'American Educational Research Association, American Psychological Association, & National Council on Measurement in Education (2014). Standards for Educational and Psychological Testing. AERA.' },
  { id: 'g3r5', text: 'Embretson, S. E., & Reise, S. P. (2000). Item Response Theory for Psychologists. Lawrence Erlbaum Associates.' },
  { id: 'g3r6', text: 'Cronbach, L. J., & Meehl, P. E. (1955). Construct validity in psychological tests. Psychological Bulletin, 52(4), 281-302.' }
];

module.exports = guide({
  slug: 'are-online-iq-tests-accurate',
  crumb: 'Are online IQ tests accurate?',
  h1: 'Are online IQ tests accurate?',
  title: 'Are Online IQ Tests Accurate? The Evidence | CogniScale',
  description: 'Some online IQ tests are defensible; most are not. What reliability, validity and norming mean, what the research shows, and an eight-point checklist.',
  lede: 'Some are genuinely informative. Most are decorative. The gap between them is not a matter of opinion - it comes down to three properties you can check.',
  updated: '2026-09-06',
  published: '2026-09-06',
  toc: [
    { id: 'three', label: 'Three questions that settle it' },
    { id: 'evidence', label: 'What the research actually shows' },
    { id: 'comparison', label: 'Online versus supervised: a comparison' },
    { id: 'checklist', label: 'Eight-point checklist' },
    { id: 'flags', label: 'Red flags' },
    { id: 'this-test', label: 'How this site scores against its own checklist' }
  ],
  refs: REFS,

  bodyTop:
    '<h2 id="three">Three questions that settle it</h2>' +
    '<p>"Accurate" is too loose a word to argue about. Psychometrics splits it into three properties, and ' +
    'a test can be strong on one and useless on another.' + P.ref(4, 'g3r4') + '</p>' +

    '<h3>1. Reliability - would it give you the same answer twice?</h3>' +
    '<p>If the same person takes the test twice under the same conditions, how close are the two scores? ' +
    'A test with poor reliability is measuring noise, and nothing else about it can rescue that. ' +
    'Reliability is reported as a coefficient between 0 and 1; the WAIS-IV reports about .98 for Full ' +
    'Scale IQ.' + P.ref(3, 'g3r3') + ' A short online test in the .80s is doing well.</p>' +

    '<h3>2. Validity - is it measuring the thing it claims to?</h3>' +
    '<p>A reliable test can reliably measure the wrong thing. Validity is established by showing the ' +
    'scores behave as a measure of the construct should: correlating with established instruments, ' +
    'predicting outcomes the construct ought to predict, and having the expected internal ' +
    'structure.' + P.ref(6, 'g3r6') + ' This is where most free online tests have nothing to offer, ' +
    'because nobody has ever checked.</p>' +

    '<h3>3. Norming - is the scale anchored to anything?</h3>' +
    '<p>An IQ number is a rank within a reference population. That requires a standardisation sample. ' +
    'A test that has never been administered to a defined sample cannot know whether your raw score of ' +
    '24 out of 30 is the 60th or the 95th percentile - it can only assume. Most online tests, ' +
    '<b>including this one</b>, are weakest here.</p>' +

    '<h2 id="evidence">What the research actually shows</h2>' +
    '<p>The useful evidence comes from the International Cognitive Ability Resource, a public research ' +
    'project built specifically to test whether an open, brief, online battery can work. The initial ' +
    'validation drew on 96,958 participants from 199 countries; the 16-item short form reached an internal ' +
    'consistency of &alpha;&nbsp;=&nbsp;0.81.' + P.ref(1, 'g3r1') + '</p>' +
    '<p>The direct comparison came later. Young and Keith administered the ICAR16 alongside the WAIS-IV to ' +
    '97 university students. The correlation between ICAR16 scores and WAIS-IV Full Scale IQ was ' +
    '<b>r&nbsp;=&nbsp;.81</b>, and between the latent general factors, <b>.94</b>.' + P.ref(2, 'g3r2') + '</p>' +
    '<div class="note">' +
      '<h4>Read that result carefully</h4>' +
      '<p>An r of .81 is high, and it comes with real caveats. The sample was 97 university students - ' +
      'small, and restricted in range, which usually <em>deflates</em> a correlation rather than inflating ' +
      'it. But a student convenience sample also cannot be assumed to represent the general population, ' +
      'and the study\'s own authors called for replication in larger samples.</p>' +
      '<p style="margin:0">What it does establish: <b>a short, unsupervised, browser-based reasoning test ' +
      'is capable of capturing much of what an hour-long supervised battery captures.</b> What it does not ' +
      'establish: that any particular website has built one.</p>' +
    '</div>' +
    '<p>The critical distinction is between <em>the format</em> and <em>the implementation</em>. Being ' +
    'online is not the problem. Being unvalidated is.</p>',

  bodyBottom:
    '<h2 id="comparison">Online versus supervised: a comparison</h2>' +
    '<div class="table-wrap"><table>' +
      '<thead><tr><th></th><th>Supervised battery (e.g. WAIS-IV)</th><th>A well-built online test</th>' +
      '<th>A typical free online test</th></tr></thead>' +
      '<tbody>' +
        '<tr><td><b>Reliability</b></td><td>~.98</td><td>~.80-.90</td><td>Usually unknown</td></tr>' +
        '<tr><td><b>Standard error</b></td><td>~2 points</td><td>~4-6 points</td><td>Unknown</td></tr>' +
        '<tr><td><b>Norms</b></td><td>Large stratified sample</td><td>Sometimes; often provisional</td><td>Usually none</td></tr>' +
        '<tr><td><b>Abilities covered</b></td><td>Broad, multiple indices</td><td>Narrow, reasoning-focused</td><td>Varies</td></tr>' +
        '<tr><td><b>Conditions</b></td><td>Invigilated, standardised</td><td>Unsupervised</td><td>Unsupervised</td></tr>' +
        '<tr><td><b>Time</b></td><td>60-90 min</td><td>15-35 min</td><td>2-15 min</td></tr>' +
        '<tr><td><b>Cost</b></td><td>Several hundred, via a psychologist</td><td>Free or low</td><td>Free, or paywalled at the result</td></tr>' +
        '<tr><td><b>Clinical standing</b></td><td>Yes</td><td>None</td><td>None</td></tr>' +
      '</tbody>' +
    '</table></div>' +
    '<p>The honest summary: a good online test tells you roughly which part of the distribution you are ' +
    'in. It will not distinguish 112 from 118, and it cannot support a diagnosis, an accommodation ' +
    'request or an application to anything.</p>' +

    '<h2 id="checklist">Eight-point checklist</h2>' +
    '<p>Apply this to any online IQ test, including this one.</p>' +
    '<ol>' +
      '<li><b>Does it publish its method?</b> If there is no page explaining how items were built and how ' +
      'the score is computed, there is nothing to evaluate.</li>' +
      '<li><b>Does it report a margin of error?</b> Every measurement has one. A bare number with no ' +
      'interval is overstating its precision - always.</li>' +
      '<li><b>Does it say where its norms come from?</b> And if they are provisional, does it say so?</li>' +
      '<li><b>Is it long enough?</b> Below about 20 items, a score cannot be precise regardless of ' +
      'anything else. Five-question tests are entertainment.</li>' +
      '<li><b>Does it cite anything?</b> Real references to real papers, not "based on scientific ' +
      'research" with nothing attached.</li>' +
      '<li><b>Does it state its limitations?</b> A test that lists no weaknesses has not looked for ' +
      'any.</li>' +
      '<li><b>Does it ask for money to see your score?</b> The single most reliable red flag.</li>' +
      '<li><b>Does the score seem too flattering?</b> Tests that hand out 130s to most takers are ' +
      'optimising for sharing, not measurement.</li>' +
    '</ol>' +

    '<h2 id="flags">Red flags</h2>' +
    '<ul>' +
      '<li><b>A paywall at the result.</b> You have done the work; the score is then held hostage. ' +
      'This model has no incentive to be accurate, only to seem tantalising.</li>' +
      '<li><b>"Certified" or "official" claims.</b> There is no certifying body for online IQ tests. ' +
      'The word is decorative.</li>' +
      '<li><b>Impossibly high scores.</b> A test reporting 145+ to a meaningful share of takers is not ' +
      'measuring the tail; it is miscalibrated.</li>' +
      '<li><b>No mention of error, ever.</b></li>' +
      '<li><b>Instant results from very few questions.</b> Precision requires items. There is no way ' +
      'around that.</li>' +
      '<li><b>Email required before the score.</b> The product is your address.</li>' +
    '</ul>' +

    '<h2 id="this-test">How this site scores against its own checklist</h2>' +
    '<p>It would be poor form to publish that list without applying it here.</p>' +
    '<div class="table-wrap"><table>' +
      '<thead><tr><th>Criterion</th><th>This test</th></tr></thead>' +
      '<tbody>' +
        '<tr><td>Method published</td><td>Yes &mdash; <a href="/methodology/">in full</a>, including the scoring model</td></tr>' +
        '<tr><td>Margin of error reported</td><td>Yes &mdash; a 95% interval on every result</td></tr>' +
        '<tr><td>Norms disclosed</td><td>Yes, and they are the weak point: <b>provisional and rational, not empirical</b></td></tr>' +
        '<tr><td>Length</td><td>30 items, about 30 minutes</td></tr>' +
        '<tr><td>References</td><td>17 sources on the methodology page</td></tr>' +
        '<tr><td>Limitations stated</td><td>Yes &mdash; <a href="/methodology/#limitations">nine of them</a></td></tr>' +
        '<tr><td>Paywall</td><td>None. No account, no email</td></tr>' +
        '<tr><td>Score inflation</td><td>Scores are capped at ' + cfg.test.reportCeiling + ' because a 30-item test cannot resolve beyond it</td></tr>' +
      '</tbody>' +
    '</table></div>' +
    '<p>The row that matters most is the third one. This test has no standardisation sample of its own, ' +
    'so the absolute number it gives you is the least trustworthy part of the report - which is exactly ' +
    'why it comes with an interval attached and a page explaining why.</p>',

  faq: [
    {
      q: 'Are free online IQ tests accurate?',
      a: '<p>A minority are reasonably accurate; most are not. The research shows the format can work - a ' +
         'short online battery correlated r = .81 with the WAIS-IV in one study - but that finding applies ' +
         'to a specific validated instrument, not to online tests in general. Judge each one on whether it ' +
         'publishes a method, reports error, and discloses its norms.</p>'
    },
    {
      q: 'How much can an online IQ score differ from a real one?',
      a: '<p>Expect a band rather than a point. A good short online test has a standard error of roughly ' +
         '4 to 6 IQ points, so a 95% interval of about &plusmn;9 to &plusmn;12. On top of that, ' +
         'unsupervised conditions and provisional norms can add systematic bias in either direction.</p>'
    },
    {
      q: 'Which online IQ test is the most accurate?',
      a: '<p>The most defensible ones are those derived from published, validated item banks - the ICAR ' +
         'work being the clearest example - and those that publish their scoring model and error. Be ' +
         'suspicious of any ranking, including this sentence: nobody has run a controlled comparison of ' +
         'the popular free tests against a supervised battery.</p>'
    },
    {
      q: 'Can an online IQ test diagnose anything?',
      a: '<p>No. Diagnosis requires a qualified clinician, a standardised individually administered ' +
         'instrument, and evidence beyond a single score. No online test can do this, and any that ' +
         'implies otherwise should be disregarded entirely.</p>'
    }
  ],

  related: [
    { href: '/methodology/', title: 'How this test is built', text: 'Item construction, the scoring model, precision and limitations.' },
    { href: '/guides/iq-score-ranges/', title: 'IQ score ranges and percentiles', text: 'What each score corresponds to, and how rare it is.' },
    { href: '/guides/iq-test-practice-questions/', title: 'Practice questions', text: 'Worked examples of each question type, with explanations.' },
    { href: '/guides/average-iq/', title: 'What is an average IQ?', text: 'Why 100 is the average by construction rather than by measurement.' }
  ]
});
