/* Guide: Mensa and high-IQ societies. */
'use strict';

var guide = require('./_guide.js');
var P = require('../_parts.js');

var REFS = [
  { id: 'g14r1', text: 'Wechsler, D. (2008). Wechsler Adult Intelligence Scale - Fourth Edition: Technical and Interpretive Manual. Pearson.' },
  { id: 'g14r2', text: 'American Educational Research Association, American Psychological Association, & National Council on Measurement in Education (2014). Standards for Educational and Psychological Testing. AERA.' },
  { id: 'g14r3', text: 'Roid, G. H. (2003). Stanford-Binet Intelligence Scales, Fifth Edition: Technical Manual. Riverside Publishing.' },
  { id: 'g14r4', text: 'Pietschnig, J., & Voracek, M. (2015). One century of global IQ gains: A formal meta-analysis of the Flynn effect (1909-2013). Perspectives on Psychological Science, 10(3), 282-306.', url: 'https://doi.org/10.1177/1745691615577701', linkText: 'doi:10.1177/1745691615577701' },
  { id: 'g14r5', text: 'Condon, D. M., & Revelle, W. (2014). The International Cognitive Ability Resource: Development and initial validation of a public-domain measure. Intelligence, 43, 52-64.', url: 'https://doi.org/10.1016/j.intell.2014.01.004', linkText: 'doi:10.1016/j.intell.2014.01.004' }
];

module.exports = guide({
  slug: 'mensa-and-high-iq-societies',
  crumb: 'Mensa and high-IQ societies',
  h1: 'Mensa and high-IQ societies: what it takes to qualify',
  title: 'Mensa IQ Requirement: The 98th Percentile Explained | CogniScale',
  description: 'Mensa requires the 98th percentile on an approved supervised test - about 130 on a Wechsler scale, 148 on Cattell III B. Why the numbers differ.',
  lede: 'Mensa asks for the top 2%. That single criterion produces several different qualifying numbers depending on the test, which is the source of nearly all the confusion about it.',
  updated: '2026-09-09',
  published: '2026-09-09',
  toc: [
    { id: 'criterion', label: 'One criterion, several numbers' },
    { id: 'routes', label: 'The two routes in' },
    { id: 'why-supervised', label: 'Why online scores never count' },
    { id: 'other-societies', label: 'The other societies' },
    { id: 'worth-it', label: 'What membership does and does not mean' }
  ],
  refs: REFS,

  bodyTop:
    '<h2 id="criterion">One criterion, several numbers</h2>' +
    '<p>Mensa was founded in 1946 with a deliberately simple entry rule that has not changed: a score at ' +
    'or above the <b>98th percentile</b> on an approved, properly administered intelligence test. That ' +
    'is the whole criterion. Everything else is implementation.</p>' +
    '<p>The confusion starts because "98th percentile" converts to different IQ numbers on different ' +
    'scales. IQ scales all set the mean at 100, but they do not all use the same standard deviation.</p>' +
    '<div class="table-wrap"><table>' +
      '<thead><tr><th>Test</th><th>Standard deviation</th><th>98th percentile score</th></tr></thead>' +
      '<tbody>' +
        '<tr><td>Wechsler scales (WAIS, WISC)</td><td>15' + P.ref(1, 'g14r1') + '</td><td>~130</td></tr>' +
        '<tr><td>Stanford-Binet (older forms)</td><td>16' + P.ref(3, 'g14r3') + '</td><td>~132</td></tr>' +
        '<tr><td>Cattell III B (used by British Mensa)</td><td>24</td><td>~148</td></tr>' +
      '</tbody>' +
    '</table></div>' +
    '<div class="note">' +
      '<p style="margin:0">This is why someone saying "my IQ is 148" may be describing exactly the same ' +
      'ability as someone saying "my IQ is 130". <b>An IQ number is meaningless without knowing the ' +
      'scale it came from.</b> The percentile is the portable statement; the IQ figure is not.</p>' +
    '</div>' +
    '<p>The 98th percentile means roughly 1 person in 50. That is selective, but it is not rare in the ' +
    'way the surrounding mystique implies - in a large secondary school there will be several dozen ' +
    'people who would qualify.</p>',

  bodyBottom:
    '<h2 id="routes">The two routes in</h2>' +
    '<p><b>1. Sit Mensa’s own supervised admission test.</b> Administered under proctored conditions by ' +
    'the national chapter. The test used varies by country; some chapters administer a battery of two ' +
    'instruments where reaching the threshold on either is sufficient.</p>' +
    '<p><b>2. Submit prior evidence.</b> A qualifying score from an approved test already taken under ' +
    'proper conditions - typically a clinical instrument such as a Wechsler scale or Stanford-Binet ' +
    'administered by a qualified psychologist. Some chapters also accept certain standardised admissions ' +
    'tests at specified thresholds.</p>' +
    '<p>Which instruments qualify, and at what cut, <b>varies by national chapter and changes over ' +
    'time</b>. Check your own country’s Mensa organisation rather than relying on any third-party list, ' +
    'including this one.</p>' +

    '<h2 id="why-supervised">Why online scores never count</h2>' +
    '<p>No unsupervised online test can qualify you for Mensa, and this is not gatekeeping for its own ' +
    'sake. There are four solid reasons, and they apply to <b>this test as much as any other</b>.</p>' +
    '<ul>' +
      '<li><b>Identity and conditions are unverified.</b> Nobody can confirm who sat the test, whether ' +
      'they were interrupted, or whether they looked anything up.</li>' +
      '<li><b>Item exposure.</b> A fixed public item set leaks. Once answers circulate, scores stop ' +
      'measuring reasoning and start measuring exposure.</li>' +
      '<li><b>Norms are usually absent.</b> A defensible score requires a standardisation sample matched ' +
      'to a target population. Most free tests have none - and say nothing about it.' + P.ref(2, 'g14r2') + '</li>' +
      '<li><b>Precision collapses at the tails.</b> This is the decisive one for a 98th-percentile ' +
      'decision.</li>' +
    '</ul>' +
    '<p>That last point deserves expanding, because it explains a design decision on this site. A test ' +
    'estimates ability most precisely where it has the most items near your level. A 30-item test has ' +
    'few items hard enough to discriminate among the top 2%, so the confidence interval widens sharply ' +
    'out there. Reporting "IQ 132" from a short test implies a precision the test cannot deliver.</p>' +
    '<p>This is exactly why results here are <b>capped at 65 and 135</b> and reported as an interval ' +
    'rather than a point. A score of "135 or above" is an honest statement about what a 30-item test can ' +
    'resolve. "IQ 148, Mensa level" would not be.' + P.ref(5, 'g14r5') + '</p>' +

    '<h2 id="other-societies">The other societies</h2>' +
    '<p>Mensa is the largest and least restrictive. Several smaller societies set higher cuts:</p>' +
    '<div class="table-wrap"><table>' +
      '<thead><tr><th>Society</th><th>Percentile</th><th>Approx. rarity</th></tr></thead>' +
      '<tbody>' +
        '<tr><td>Mensa</td><td>98th</td><td>1 in 50</td></tr>' +
        '<tr><td>Intertel</td><td>99th</td><td>1 in 100</td></tr>' +
        '<tr><td>Triple Nine Society</td><td>99.9th</td><td>1 in 1,000</td></tr>' +
        '<tr><td>Prometheus Society</td><td>99.997th</td><td>~1 in 30,000</td></tr>' +
      '</tbody>' +
    '</table></div>' +
    '<p>A statistical caution about the bottom of that table. Distinguishing the 99.9th percentile from ' +
    'the 99.997th requires a test with enough sufficiently difficult items <i>and</i> a standardisation ' +
    'sample large enough to contain meaningful numbers of people that rare. A sample of 2,200 adults - ' +
    'typical for a major clinical test - contains perhaps two people above the 99.9th percentile. ' +
    'Norms that far out are extrapolation from a fitted curve, not observation.</p>' +
    '<p>Add the Flynn effect on top, which shifts raw performance by roughly 0.28 points a year and makes ' +
    'the vintage of the norms material,' + P.ref(4, 'g14r4') + ' and scores quoted above about 145 should ' +
    'be treated with real caution regardless of source.</p>' +

    '<h2 id="worth-it">What membership does and does not mean</h2>' +
    '<p>Membership means one thing precisely: on one supervised test, on one day, you scored in the top ' +
    '2% of a reference group. It is a legitimate, verifiable fact.</p>' +
    '<p>It does not mean you will do well at work, be right in arguments, or be good at anything in ' +
    'particular. The correlations between cognitive ability and real outcomes are real but loose - ' +
    'around 0.31 with job performance and 0.23 with income - as set out in ' +
    '<a href="/guides/what-iq-predicts/">what IQ actually predicts</a>. A threshold on one measure ' +
    'carries no more weight than that measure does.</p>' +
    '<p>The honest case for joining is social rather than evidential: people who enjoy this kind of ' +
    'puzzle often enjoy the company of others who do. That is a perfectly good reason. Treating the ' +
    'membership card as a verdict on your worth is not.</p>' +
    '<p><b>If you want to try:</b> take this test for interest by all means, but for a qualifying score ' +
    'contact your national Mensa organisation and sit their supervised test. Nothing you do ' +
    'unsupervised at home can substitute for it.</p>',

  faq: [
    {
      q: 'What IQ do you need for Mensa?',
      a: '<p>The 98th percentile on an approved supervised test - about 130 on a Wechsler scale (SD 15), ' +
         '132 on older Stanford-Binet forms (SD 16), or about 148 on the Cattell III B (SD 24) used by ' +
         'British Mensa. All three describe the same level of ability on different scales.</p>'
    },
    {
      q: 'Why do people quote different Mensa IQ numbers?',
      a: '<p>Because IQ scales use different standard deviations. The percentile is the meaningful ' +
         'statement; the IQ number depends entirely on which scale produced it. An IQ figure quoted ' +
         'without its scale is not interpretable.</p>'
    },
    {
      q: 'Can an online IQ test qualify me for Mensa?',
      a: '<p>No. Mensa accepts only supervised tests taken under verified conditions, either its own ' +
         'admission test or an approved instrument administered by a qualified professional. That ' +
         'includes this test - no unsupervised result can establish eligibility.</p>'
    },
    {
      q: 'Why does this test not report scores above 135?',
      a: '<p>Because it cannot resolve them honestly. A 30-item test has too few very hard items to ' +
         'distinguish reliably among the top few percent, so the confidence interval widens sharply at ' +
         'the extremes. Reporting a precise high number would imply a precision the test does not have.</p>'
    }
  ],

  related: [
    { href: '/guides/iq-score-ranges/', title: 'IQ score ranges and percentiles',
      text: 'The full table from 55 to 145, with rarity and the measurement error most tables omit.' },
    { href: '/guides/are-online-iq-tests-accurate/', title: 'Are online IQ tests accurate?',
      text: 'What separates a defensible online test from a number generator.' }
  ]
});
