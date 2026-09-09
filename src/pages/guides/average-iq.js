/* Guide: what is an average IQ. */
'use strict';

var guide = require('./_guide.js');
var P = require('../_parts.js');

var REFS = [
  { id: 'g2r1', text: 'Wechsler, D. (2008). Wechsler Adult Intelligence Scale - Fourth Edition: Technical and Interpretive Manual. Pearson.' },
  { id: 'g2r2', text: 'Flynn, J. R. (1987). Massive IQ gains in 14 nations: What IQ tests really measure. Psychological Bulletin, 101(2), 171-191.' },
  { id: 'g2r3', text: 'Pietschnig, J., & Voracek, M. (2015). One century of global IQ gains: A formal meta-analysis of the Flynn effect (1909-2013). Perspectives on Psychological Science, 10(3), 282-306.', url: 'https://doi.org/10.1177/1745691615577701', linkText: 'doi:10.1177/1745691615577701' },
  { id: 'g2r4', text: 'Bratsberg, B., & Rogeberg, O. (2018). Flynn effect and its reversal are both environmentally caused. PNAS, 115(26), 6674-6678.', url: 'https://doi.org/10.1073/pnas.1718793115', linkText: 'doi:10.1073/pnas.1718793115' },
  { id: 'g2r5', text: 'Salthouse, T. A. (2009). When does age-related cognitive decline begin? Neurobiology of Aging, 30(4), 507-514.' },
  { id: 'g2r6', text: 'Wicherts, J. M., Borsboom, D., & Dolan, C. V. (2010). Why national IQs do not support evolutionary theories of intelligence. Personality and Individual Differences, 48(2), 91-96.', url: 'https://doi.org/10.1016/j.paid.2009.05.028', linkText: 'doi:10.1016/j.paid.2009.05.028' },
  { id: 'g2r7', text: 'American Educational Research Association, American Psychological Association, & National Council on Measurement in Education (2014). Standards for Educational and Psychological Testing. AERA.' }
];

module.exports = guide({
  slug: 'average-iq',
  crumb: 'What is average IQ?',
  h1: 'What is an average IQ?',
  title: 'What Is an Average IQ? Why It Is Exactly 100 | CogniScale',
  description: 'The average IQ is 100 because the scale is defined that way, not because it was measured. What that means, plus renorming, the Flynn effect and age.',
  lede: 'The average IQ is 100. That is true by definition rather than by measurement - and understanding why explains most of what is confusing about these scores.',
  updated: '2026-09-06',
  published: '2026-09-06',
  toc: [
    { id: 'why-100', label: 'Why the average is exactly 100' },
    { id: 'spread', label: 'What "average" covers' },
    { id: 'renorming', label: 'Renorming and the Flynn effect' },
    { id: 'age', label: 'Does average IQ change with age?' },
    { id: 'countries', label: 'Average IQ by country: handle with care' }
  ],
  refs: REFS,

  bodyTop:
    '<h2 id="why-100">Why the average is exactly 100</h2>' +
    '<p>Because somebody decided it should be. That is not a flippant answer - it is the whole ' +
    'explanation.</p>' +
    '<p>When a test publisher builds an IQ test, they administer it to a large standardisation sample ' +
    'selected to match a target population on age, sex, education, region and other characteristics. Then ' +
    'they take the raw score distribution from that sample and transform it so that the mean becomes 100 ' +
    'and the standard deviation becomes 15.' + P.ref(1, 'g2r1') + '</p>' +
    '<p>So "the average IQ is 100" is not a finding about humanity. It is a description of the scale. If ' +
    'everyone in the world woke up tomorrow able to solve twice as many matrix problems, the average IQ ' +
    'would still be 100 the moment the test was renormed. What would change is the raw performance behind ' +
    'the number.</p>' +
    '<div class="note">' +
      '<p style="margin:0">This is the single most useful thing to understand about IQ scores: <b>the ' +
      'number is a rank within a reference group, not a measurement of a quantity.</b> A thermometer ' +
      'reading of 20&deg;C means something without reference to other thermometers. An IQ of 100 means ' +
      'nothing at all except "middling, compared with this particular group of people".</p>' +
    '</div>' +

    '<h2 id="spread">What "average" covers</h2>' +
    '<p>"Average" in everyday speech means one point. In test interpretation it means a band, and a wide ' +
    'one. The conventional average range is <b>90 to 109</b>, which contains roughly half of all people. ' +
    'Widen it to 85-115 - one standard deviation either side - and you have captured about 68%.</p>' +
    '<p>Which means: most people are average, and the differences within that band are small enough that ' +
    'measurement error swamps them on any short test. Someone reported at 104 and someone reported at 97 ' +
    'have not been meaningfully distinguished.</p>',

  bodyBottom:
    '<h2 id="renorming">Renorming and the Flynn effect</h2>' +
    '<p>Here is where the "average is 100 by definition" point stops being a technicality.</p>' +
    '<p>Across the twentieth century, raw performance on IQ tests rose steadily. James Flynn documented ' +
    'the pattern across fourteen nations in 1987, and it now carries his name.' + P.ref(2, 'g2r2') + ' The ' +
    'largest meta-analysis to date pooled 271 independent samples covering close to four million people in ' +
    '31 countries between 1909 and 2013. It put the gain at roughly <b>0.28 IQ points per year</b> for ' +
    'full-scale scores - and notably larger for fluid reasoning (about 0.41 points a year) than for ' +
    'crystallised knowledge (about 0.21).' + P.ref(3, 'g2r3') + '</p>' +
    '<p>Compounded over decades that is enormous. Someone scoring at the average on a 1950 norm set would ' +
    'score well below average against a 2010 norm set, without having got any worse at anything. Publishers ' +
    'respond by renorming every decade or two, which pulls the mean back to 100.</p>' +
    '<p>Two practical consequences:</p>' +
    '<ul>' +
      '<li><b>Old scores inflate.</b> A score from a test normed thirty years ago is generally too high by ' +
      'modern standards. This matters in any setting where a threshold has legal or educational ' +
      'consequences.</li>' +
      '<li><b>The gains are not universal or permanent.</b> Analysis of Norwegian conscript data found the ' +
      'rise reversing in cohorts born after about 1975, and the pattern within families indicated ' +
      'environmental rather than genetic causes.' + P.ref(4, 'g2r4') + '</li>' +
    '</ul>' +

    '<h2 id="age">Does average IQ change with age?</h2>' +
    '<p>On a properly normed test, no - and that is deliberate. Scores are age-normed, meaning you are ' +
    'compared with people of your own age. A 70-year-old scoring 100 performed averagely <em>for a ' +
    '70-year-old</em>.</p>' +
    '<p>Underneath that normalisation, raw performance does change with age, and the two broad abilities ' +
    'move differently. Fluid reasoning - solving novel problems - peaks in the twenties and declines ' +
    'gradually thereafter. Crystallised knowledge - vocabulary, accumulated information - holds steady or ' +
    'keeps rising well into later life.' + P.ref(5, 'g2r5') + ' Age-norming hides this divergence by ' +
    'design, which is usually what you want and occasionally not.</p>' +
    '<p>One consequence for this site specifically: <a href="/test/">the test here is not age-normed</a>, ' +
    'because doing so would require a standardisation sample it does not have. It leans on fluid reasoning ' +
    'items, so older test takers are likely to be scored slightly harshly relative to a properly age-normed ' +
    'instrument. That is stated in the <a href="/methodology/#limitations">limitations</a>.</p>' +

    '<h2 id="countries">Average IQ by country: handle with care</h2>' +
    '<p>Tables ranking countries by average IQ circulate widely. They deserve much more scepticism than ' +
    'they usually get, for reasons that are methodological before they are anything else.</p>' +
    '<ul>' +
      '<li><b>The underlying samples are often tiny and unrepresentative.</b> Many entries in the ' +
      'best-known datasets rest on convenience samples - a few hundred schoolchildren in one city - ' +
      'extrapolated to an entire national population. Some entries are estimated from neighbouring ' +
      'countries rather than measured at all.' + P.ref(6, 'g2r6') + '</li>' +
      '<li><b>Tests are rarely normed for the population taking them.</b> Administering an instrument ' +
      'standardised on one population to a very different one, in a second language, violates the ' +
      'assumptions that make the score interpretable.' + P.ref(7, 'g2r7') + '</li>' +
      '<li><b>The Flynn effect makes cross-era comparison invalid.</b> Data gathered decades apart cannot ' +
      'be placed on one scale without correction, and often is not corrected.</li>' +
      '<li><b>Schooling, nutrition, health and test familiarity all move scores.</b> These vary enormously ' +
      'between countries and are precisely the environmental factors shown to drive the Flynn ' +
      'effect.' + P.ref(4, 'g2r4') + '</li>' +
    '</ul>' +
    '<p>The honest summary: differences in measured average performance between populations are real in ' +
    'the data, and the datasets themselves are too weak, and too confounded with schooling and measurement ' +
    'artefacts, to support the interpretations usually built on them.</p>',

  faq: [
    {
      q: 'What is the average IQ score?',
      a: '<p>100, by definition. The scale is constructed so that the mean of the standardisation sample ' +
         'is exactly 100 with a standard deviation of 15. The conventional "average range" is 90 to 109, ' +
         'which covers roughly half of all people.</p>'
    },
    {
      q: 'Is an IQ of 110 good?',
      a: '<p>It is above average - around the 75th percentile, so higher than about three quarters of ' +
         'people. On a short test the measurement error is large enough that a reported 110 is consistent ' +
         'with a true score anywhere from roughly 101 to 119.</p>'
    },
    {
      q: 'Has average intelligence actually increased?',
      a: '<p>Raw test performance rose substantially through the twentieth century - about 0.28 IQ points ' +
         'a year on full-scale scores. Whether that constitutes an increase in intelligence itself, or ' +
         'better schooling, nutrition, health and familiarity with abstract test formats, is still debated. ' +
         'The reversal seen in recent Scandinavian cohorts points to environmental causes.</p>'
    },
    {
      q: 'Why do I score differently on different IQ tests?',
      a: '<p>Different tests sample different abilities, use different norm groups and have different ' +
         'amounts of measurement error. Add day-to-day variation in sleep, stress and motivation, and a ' +
         'spread of 10 points or so across tests is entirely ordinary.</p>'
    }
  ],

  related: [
    { href: '/guides/iq-score-ranges/', title: 'IQ score ranges and percentiles', text: 'The full table, from 55 to 145, with rarity at each level.' },
    { href: '/guides/fluid-vs-crystallised-intelligence/', title: 'Fluid vs crystallised intelligence', text: 'The two abilities that age in opposite directions.' },
    { href: '/guides/are-online-iq-tests-accurate/', title: 'Are online IQ tests accurate?', text: 'How much to trust a score from a browser.' },
    { href: '/test/', title: 'Take the test', text: 'Thirty questions, scored with a stated margin of error.' }
  ]
});
