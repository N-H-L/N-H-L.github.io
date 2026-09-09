/* Guide: IQ score ranges and percentiles. Table computed from the normal CDF. */
'use strict';

var guide = require('./_guide.js');
var P = require('../_parts.js');
var irt = require('../../lib/irt.js');

function rarity(p) {
  if (p <= 0) return '-';
  var n = 1 / p;
  if (n < 2) return 'about 1 in 2';
  return '1 in ' + Math.round(n).toLocaleString('en-GB');
}

var SCORES = [55, 60, 65, 70, 75, 80, 85, 90, 95, 100, 105, 110, 115, 120, 125, 130, 135, 140, 145];

var rows = SCORES.map(function (iq) {
  var z = (iq - 100) / 15;
  var below = irt.normalCdf(z);
  var pctile = below * 100;
  var above = 1 - below;
  var pctText = pctile < 0.1 ? '&lt;0.1' : (pctile > 99.9 ? '&gt;99.9' : (Math.round(pctile * 10) / 10).toString());
  var highlight = iq === 100 ? ' style="background:color-mix(in srgb, var(--brand) 7%, transparent)"' : '';
  return '<tr' + highlight + '>' +
    '<td class="num"><b>' + iq + '</b></td>' +
    '<td class="num">' + (z > 0 ? '+' : '') + z.toFixed(2) + '</td>' +
    '<td class="num">' + pctText + '</td>' +
    '<td class="num">' + rarity(above) + '</td>' +
    '</tr>';
}).join('');

var REFS = [
  { id: 'g1r1', text: 'Wechsler, D. (2008). Wechsler Adult Intelligence Scale - Fourth Edition: Technical and Interpretive Manual. Pearson.' },
  { id: 'g1r2', text: 'American Educational Research Association, American Psychological Association, & National Council on Measurement in Education (2014). Standards for Educational and Psychological Testing. AERA.' },
  { id: 'g1r3', text: 'Roid, G. H. (2003). Stanford-Binet Intelligence Scales, Fifth Edition: Technical Manual. Riverside Publishing.' },
  { id: 'g1r4', text: 'Gottfredson, L. S. (1997). Why g matters: The complexity of everyday life. Intelligence, 24(1), 79-132.' },
  { id: 'g1r5', text: 'Deary, I. J., Strand, S., Smith, P., & Fernandes, C. (2007). Intelligence and educational achievement. Intelligence, 35(1), 13-21.' }
];

module.exports = guide({
  slug: 'iq-score-ranges',
  crumb: 'IQ score ranges',
  h1: 'IQ score ranges and percentiles',
  title: 'IQ Score Ranges and Percentiles Explained | CogniScale',
  description: 'A full IQ score table from 55 to 145 with percentiles and rarity. What 85, 100, 115 and 130 mean, and the measurement error most tables leave out.',
  lede: 'What a given IQ score corresponds to in percentile terms, how rare it is, and - just as important - how much of the number is measurement error.',
  updated: '2026-09-06',
  published: '2026-09-06',
  toc: [
    { id: 'scale', label: 'The scale is built, not discovered' },
    { id: 'table', label: 'Full score, percentile and rarity table' },
    { id: 'labels', label: 'Classification labels, and their limits' },
    { id: 'tails', label: 'Why rarity accelerates at the extremes' },
    { id: 'error', label: 'The part most tables leave out' },
    { id: 'sd', label: 'A note on SD 15 versus SD 16' }
  ],
  refs: REFS,

  bodyTop:
    '<h2 id="scale">The scale is built, not discovered</h2>' +
    '<p>An IQ score is not a count of anything. There is no unit of intelligence being tallied up. What a ' +
    'modern IQ score reports is a <b>rank</b>: where your performance sits within a reference distribution ' +
    'of other people\'s performance, expressed on a scale that has been deliberately fixed so the average is ' +
    '100 and the standard deviation is 15.' + P.ref(1, 'g1r1') + '</p>' +

    '<p>That choice is a convention, not a discovery. Test publishers standardise a test on a large sample ' +
    'chosen to represent a population, look at the raw score distribution, and then stretch and shift it ' +
    'onto the 100/15 scale. This is what "deviation IQ" means: your score expresses how many standard ' +
    'deviations you sit from the mean of your age-matched norm group.</p>' +

    '<p>Two consequences follow immediately, and they explain most of the confusion around these numbers:</p>' +
    '<ul>' +
      '<li><b>The average is 100 by construction.</b> It cannot be otherwise. If the population got ' +
      'uniformly better at the test tomorrow, the average would still be reported as 100 after renorming.</li>' +
      '<li><b>Scores are only meaningful relative to a norm group.</b> "IQ 120" is shorthand for ' +
      '"performed better than about 91% of the people in the reference sample". Change the reference ' +
      'sample and the number changes.</li>' +
    '</ul>' +

    '<h2 id="table">Full score, percentile and rarity table</h2>' +
    '<p>Percentiles below are computed from the normal distribution with a mean of 100 and a standard ' +
    'deviation of 15. "Percentile" is the share of people expected to score at or below that value; ' +
    '"rarity" is roughly how many people you would need before expecting to find one scoring that high or ' +
    'higher.</p>' +

    '<div class="table-wrap"><table>' +
      '<caption class="visually-hidden">IQ score, standard deviations from the mean, percentile and rarity</caption>' +
      '<thead><tr><th class="num">IQ</th><th class="num">SD from mean</th>' +
      '<th class="num">Percentile</th><th class="num">Scoring this high or higher</th></tr></thead>' +
      '<tbody>' + rows + '</tbody>' +
    '</table></div>' +

    '<p>The middle of that table is where almost everyone is. About 68% of people fall between 85 and 115, ' +
    'and about 95% between 70 and 130. The interesting-sounding scores are, by construction, the ones ' +
    'almost nobody has.</p>',

  bodyBottom:
    '<h2 id="labels">Classification labels, and their limits</h2>' +
    '<p>Test manuals attach descriptive labels to score bands. These are useful shorthand and are widely ' +
    'misused, so it is worth being precise about what they are.</p>' +

    '<div class="table-wrap"><table>' +
      '<thead><tr><th class="num">Range</th><th>Typical descriptive label</th><th class="num">Roughly</th></tr></thead>' +
      '<tbody>' +
        '<tr><td class="num">130+</td><td>Very superior / extremely high</td><td class="num">~2%</td></tr>' +
        '<tr><td class="num">120-129</td><td>Superior / very high</td><td class="num">~7%</td></tr>' +
        '<tr><td class="num">110-119</td><td>High average</td><td class="num">~16%</td></tr>' +
        '<tr><td class="num">90-109</td><td>Average</td><td class="num">~50%</td></tr>' +
        '<tr><td class="num">80-89</td><td>Low average</td><td class="num">~16%</td></tr>' +
        '<tr><td class="num">70-79</td><td>Borderline / very low</td><td class="num">~7%</td></tr>' +
        '<tr><td class="num">Below 70</td><td>Extremely low</td><td class="num">~2%</td></tr>' +
      '</tbody>' +
    '</table></div>' +

    '<div class="note note-strong">' +
      '<h4>Three things these labels are not</h4>' +
      '<p><b>They are not standardised across publishers.</b> The Wechsler scales and the Stanford-Binet ' +
      'use different wording for overlapping bands, and both have revised their terminology over ' +
      'time.' + P.ref(1, 'g1r1') + P.ref(3, 'g1r3') + '</p>' +
      '<p><b>They are not diagnoses.</b> A diagnosis of intellectual disability, for example, requires ' +
      'evidence of deficits in adaptive functioning alongside a low score, assessed by a qualified ' +
      'clinician. A number on its own diagnoses nothing.' + P.ref(2, 'g1r2') + '</p>' +
      '<p style="margin:0"><b>They are not hard boundaries.</b> Given a standard error of a few points, ' +
      'the difference between a reported 129 and a reported 131 is well inside noise, and yet they land ' +
      'in different labelled bands. Treat band edges as blurry.</p>' +
    '</div>' +

    '<h2 id="tails">Why rarity accelerates at the extremes</h2>' +
    '<p>Look again at the rarity column. Going from 100 to 115 takes you from 1 in 2 to about 1 in 6. ' +
    'Going from 130 to 145 takes you from roughly 1 in 44 to roughly 1 in 741. The same 15-point step ' +
    'costs vastly more the further out you go.</p>' +
    '<p>That is just the shape of the normal curve: the tails thin out exponentially. It has one very ' +
    'practical implication. <b>Near the extremes, small differences in score correspond to large ' +
    'differences in rarity</b> - which is exactly where measurement error is largest and where there are ' +
    'fewest items to distinguish people. Precise-sounding claims about very high scores are the least ' +
    'trustworthy numbers in the whole field, and any test that hands out 150s freely is telling you ' +
    'something about the test rather than about you.</p>' +

    '<h2 id="error">The part most tables leave out</h2>' +
    '<p>Every table like the one above presents scores as exact. They are not. A score is an estimate with ' +
    'a standard error of measurement attached, and a responsible report states it.</p>' +
    '<p>Even the WAIS-IV, administered one-to-one by a trained examiner over an hour or more, has a ' +
    'standard error of about 2.2 points on Full Scale IQ - so a reported 100 carries a 95% confidence ' +
    'interval of roughly 96 to 104.' + P.ref(1, 'g1r1') + ' A good short online test is considerably less ' +
    'precise: <a href="/test/">the test on this site</a> reports an interval of about &plusmn;9 points near ' +
    'the middle of the range, and says so on the result page.</p>' +
    '<p>The practical rule: <b>read any single IQ score as a band, not a point.</b> If two scores differ ' +
    'by less than about 10 points on a short test, you have not learned that one person is higher than the ' +
    'other.</p>' +

    '<h2 id="sd">A note on SD 15 versus SD 16</h2>' +
    '<p>Most modern tests use a standard deviation of 15, but not all. Older Stanford-Binet forms and some ' +
    'high-range tests use 16, and Cattell\'s scales used 24. The same underlying performance produces ' +
    'different numbers on each scale, which is why comparing a score from one test against another without ' +
    'noting the metric is meaningless.</p>' +
    '<p>At +2 SD, an SD-15 test reports 130 and an SD-16 test reports 132. At +4 SD the gap widens to 160 ' +
    'versus 164. If someone quotes a very high IQ without naming the test and the scale, the number does ' +
    'not mean anything specific.</p>',

  faq: [
    {
      q: 'What is a good IQ score?',
      a: '<p>Anything from 90 to 109 is squarely average, which describes roughly half of all people. ' +
         'Above 130 is around the 98th percentile. But "good" is doing a lot of work here: the scale is ' +
         'purely relative, so the question is really "compared with whom?" A score predicts group-level ' +
         'outcomes modestly and individual outcomes poorly.</p>'
    },
    {
      q: 'What percentile is an IQ of 120?',
      a: '<p>About the 91st percentile - roughly 1 in 11 people score 120 or higher on a scale with a mean ' +
         'of 100 and a standard deviation of 15.</p>'
    },
    {
      q: 'Is an IQ of 130 considered gifted?',
      a: '<p>130 is the threshold many gifted programmes use, and it sits near the 98th percentile. But ' +
         'thresholds vary by jurisdiction and programme, most require more than a single test score, and ' +
         'the measurement error around any one score means a person can land either side of 130 on ' +
         'different days.</p>'
    },
    {
      q: 'Can an IQ score change over time?',
      a: '<p>Rank order is fairly stable across adulthood, but individual scores do move - with practice, ' +
         'education, health, and simple measurement noise. Scores taken in early childhood are much less ' +
         'predictive of adult scores than people assume.</p>'
    }
  ],

  related: [
    { href: '/guides/average-iq/', title: 'What is an average IQ?', text: 'Why the average is exactly 100 by design, and what renorming does to it.' },
    { href: '/guides/are-online-iq-tests-accurate/', title: 'Are online IQ tests accurate?', text: 'What separates a defensible online test from a number generator.' },
    { href: '/methodology/', title: 'How this test is scored', text: 'The item response model behind the score, and its stated precision.' },
    { href: '/guides/fluid-vs-crystallised-intelligence/', title: 'Fluid vs crystallised intelligence', text: 'The two broad abilities behind most reasoning tests.' }
  ]
});
