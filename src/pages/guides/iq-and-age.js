/* Guide: how IQ changes with age. */
'use strict';

var guide = require('./_guide.js');
var P = require('../_parts.js');

var REFS = [
  { id: 'g13r1', text: 'Salthouse, T. A. (2009). When does age-related cognitive decline begin? Neurobiology of Aging, 30(4), 507-514.', url: 'https://doi.org/10.1016/j.neurobiolaging.2008.09.023', linkText: 'doi:10.1016/j.neurobiolaging.2008.09.023' },
  { id: 'g13r2', text: 'Schaie, K. W. (1994). The course of adult intellectual development. American Psychologist, 49(4), 304-313.' },
  { id: 'g13r3', text: 'Horn, J. L., & Cattell, R. B. (1967). Age differences in fluid and crystallized intelligence. Acta Psychologica, 26, 107-129.' },
  { id: 'g13r4', text: 'Deary, I. J., Whalley, L. J., Lemmon, H., Crawford, J. R., & Starr, J. M. (2000). The stability of individual differences in mental ability from childhood to old age: Follow-up of the 1932 Scottish Mental Survey. Intelligence, 28(1), 49-55.' },
  { id: 'g13r5', text: 'Hartshorne, J. K., & Germine, L. T. (2015). When does cognitive functioning peak? The asynchronous rise and fall of different cognitive abilities across the life span. Psychological Science, 26(4), 433-443.', url: 'https://doi.org/10.1177/0956797614567339', linkText: 'doi:10.1177/0956797614567339' },
  { id: 'g13r6', text: 'Wechsler, D. (2008). Wechsler Adult Intelligence Scale - Fourth Edition: Technical and Interpretive Manual. Pearson.' },
  { id: 'g13r7', text: 'Pietschnig, J., & Voracek, M. (2015). One century of global IQ gains: A formal meta-analysis of the Flynn effect (1909-2013). Perspectives on Psychological Science, 10(3), 282-306.', url: 'https://doi.org/10.1177/1745691615577701', linkText: 'doi:10.1177/1745691615577701' }
];

module.exports = guide({
  slug: 'iq-and-age',
  crumb: 'IQ and age',
  h1: 'How IQ changes with age',
  title: 'How IQ Changes With Age: What Rises, What Declines | CogniScale',
  description: 'Raw reasoning speed peaks early and declines; vocabulary and knowledge keep rising into the sixties. Why your IQ score barely moves anyway.',
  lede: 'Two things are true at once: raw reasoning ability declines from surprisingly early adulthood, and your IQ score can stay almost unchanged for fifty years. Age norming is what reconciles them.',
  updated: '2026-09-09',
  published: '2026-09-09',
  toc: [
    { id: 'why-stable', label: 'Why your score barely moves' },
    { id: 'two-curves', label: 'Two curves, opposite directions' },
    { id: 'when', label: 'When decline starts - a real dispute' },
    { id: 'asynchronous', label: 'Different abilities peak at different ages' },
    { id: 'rank', label: 'What stays remarkably stable' }
  ],
  refs: REFS,

  bodyTop:
    '<h2 id="why-stable">Why your score barely moves</h2>' +
    '<p>People are often surprised that a 70-year-old and a 25-year-old can both have an IQ of 110 while ' +
    'performing quite differently on the raw test. The explanation is that IQ scores are ' +
    '<b>age-normed</b>.</p>' +
    '<p>Clinical tests band their standardisation samples by age and score you against your own band.' +
    P.ref(6, 'g13r6') + ' Your IQ is not "how much reasoning you did" - it is "how you compare with other ' +
    'people your age". Since the whole reference group ages with you, the number can stay flat while the ' +
    'underlying raw performance changes considerably.</p>' +
    '<div class="note">' +
      '<p style="margin:0">This makes IQ a poor instrument for the question most people are actually ' +
      'asking. "Am I declining?" is a question about <b>raw performance over time</b>, and an age-normed ' +
      'score is specifically designed to hide that. To see decline you need the raw scores, or norms ' +
      'from a single age band applied throughout.</p>' +
    '</div>' +

    '<h2 id="two-curves">Two curves, opposite directions</h2>' +
    '<p>Averaging "cognitive ability" across the lifespan hides the most important fact, which is that ' +
    'its components move in opposite directions.</p>' +
    '<p>The distinction goes back to work in the 1960s separating <b>fluid</b> ability - reasoning on ' +
    'novel problems - from <b>crystallised</b> ability - accumulated knowledge and vocabulary. Fluid ' +
    'ability peaked early and declined; crystallised ability held up or continued rising well into later ' +
    'life.' + P.ref(3, 'g13r3') + '</p>' +
    '<div class="table-wrap"><table>' +
      '<thead><tr><th>Ability</th><th>Trajectory</th><th>Typical task</th></tr></thead>' +
      '<tbody>' +
        '<tr><td>Processing speed</td><td>Declines from the twenties, steadily</td><td>Symbol search, simple reaction</td></tr>' +
        '<tr><td>Fluid reasoning</td><td>Peaks in the twenties or thirties, then declines</td><td>Matrices, number series</td></tr>' +
        '<tr><td>Working memory</td><td>Gradual decline through adulthood</td><td>Complex span</td></tr>' +
        '<tr><td>Vocabulary and knowledge</td><td>Rises into the fifties or sixties, then plateaus</td><td>Vocabulary, general information</td></tr>' +
      '</tbody>' +
    '</table></div>' +
    '<p>This is why an older person can be markedly better at their job while being measurably slower on ' +
    'a matrix item. Most real work leans on accumulated knowledge and pattern recognition, which is ' +
    'exactly the part that holds up. See ' +
    '<a href="/guides/fluid-vs-crystallised-intelligence/">fluid vs crystallised intelligence</a> for ' +
    'the full distinction.</p>',

  bodyBottom:
    '<h2 id="when">When decline starts - a real dispute</h2>' +
    '<p>Here the literature genuinely disagrees, and the disagreement is instructive because it turns ' +
    'entirely on study design.</p>' +
    '<p><b>Cross-sectional studies</b> compare people of different ages at one moment. These consistently ' +
    'show decline in reasoning, speed and memory beginning in the <b>twenties or thirties</b>.' +
    P.ref(1, 'g13r1') + '</p>' +
    '<p><b>Longitudinal studies</b> follow the same people for decades. These typically show little ' +
    'decline before the <b>sixties</b>.' + P.ref(2, 'g13r2') + '</p>' +
    '<p>Forty years apart is not a rounding error. Each design has a distinct flaw:</p>' +
    '<ul>' +
      '<li><b>Cross-sectional studies confound age with cohort.</b> A 70-year-old tested today grew up ' +
      'with less schooling and different nutrition than a 30-year-old. Some of the apparent "decline" is ' +
      'the Flynn effect seen sideways - later cohorts simply score higher.' + P.ref(7, 'g13r7') + '</li>' +
      '<li><b>Longitudinal studies are inflated by practice and attrition.</b> Participants get better at ' +
      'the tests through repeated exposure, which masks decline. And people who drop out are ' +
      'disproportionately those declining fastest, so the surviving sample looks healthier than the ' +
      'population.</li>' +
    '</ul>' +
    '<p>The reasonable synthesis: some genuine decline in fluid abilities probably begins earlier than ' +
    'the longitudinal picture suggests and later than the cross-sectional one implies, it is gradual, ' +
    'and it is small relative to the differences between individuals of the same age.</p>' +

    '<h2 id="asynchronous">Different abilities peak at different ages</h2>' +
    '<p>A large study using web-based testing of tens of thousands of participants found there is no ' +
    'single age at which "cognitive functioning" peaks, because different abilities peak at markedly ' +
    'different times.' + P.ref(5, 'g13r5') + '</p>' +
    '<p>Processing speed peaked earliest, around the late teens to early twenties. Short-term memory ' +
    'peaked in the mid-thirties. Emotion recognition peaked later still, in the forties or fifties. ' +
    'Vocabulary peaked latest of all - in some analyses not until the late sixties or beyond.</p>' +
    '<p>The practical implication is that "peak mental age" is not a meaningful concept. At 22 you are ' +
    'near your best on raw speed and considerably short of your best on knowledge. At 55 the reverse. ' +
    'Which matters depends entirely on the task.</p>' +

    '<h2 id="rank">What stays remarkably stable</h2>' +
    '<p>The most striking finding in this whole area concerns not the level but the <b>ranking</b>.</p>' +
    '<p>Scotland tested almost every eleven-year-old in the country in 1932. Decades later, researchers ' +
    'traced surviving participants and retested them at age 77 on the same instrument. The correlation ' +
    'between scores taken 66 years apart was around <b>0.6</b>, rising above 0.7 once corrected for ' +
    'measurement error.' + P.ref(4, 'g13r4') + '</p>' +
    '<p>That is an extraordinary degree of stability for anything measured across two thirds of a ' +
    'century. Absolute performance changes a great deal; your position relative to your peers changes ' +
    'far less.</p>' +
    '<p>Two caveats keep it honest. A correlation of 0.6 still leaves substantial individual movement - ' +
    'plenty of people shifted considerably. And rank stability is not permanence: it is compatible with ' +
    'everyone declining together.</p>' +

    '<h3>What this means for your score here</h3>' +
    '<p>This test does <b>not</b> age-norm. It has one set of provisional item parameters applied to ' +
    'everyone, because age-banded norms would require a standardisation sample we do not have.</p>' +
    '<p>The consequence is straightforward and worth knowing: if you are past your forties, this test ' +
    'will tend to <b>underestimate</b> you relative to a properly age-normed clinical test, because 23 ' +
    'of its 30 items tap fluid reasoning and spatial ability - the abilities that decline - and only ' +
    'seven tap verbal knowledge, which does not. If you are in your twenties, the reverse bias applies ' +
    'mildly. The <a href="/methodology/">methodology page</a> states this among the other limitations.</p>',

  faq: [
    {
      q: 'Does IQ decline with age?',
      a: '<p>Your IQ <i>score</i> usually does not, because scores are normed against your own age group. ' +
         'Raw performance is a different matter: fluid reasoning and processing speed decline while ' +
         'vocabulary and knowledge keep rising into the fifties or sixties.</p>'
    },
    {
      q: 'At what age is intelligence at its peak?',
      a: '<p>There is no single peak. Processing speed peaks around the late teens to early twenties, ' +
         'short-term memory in the mid-thirties, emotion recognition in the forties or fifties, and ' +
         'vocabulary not until the sixties or later. "Peak mental age" is not a coherent question.</p>'
    },
    {
      q: 'Why do studies disagree about when decline starts?',
      a: '<p>Because of design. Cross-sectional studies compare different people and confound age with ' +
         'generation, exaggerating decline. Longitudinal studies follow the same people but are ' +
         'flattered by practice effects and by the fastest decliners dropping out. The truth sits ' +
         'between them.</p>'
    },
    {
      q: 'Will this test underestimate me if I am older?',
      a: '<p>Probably slightly, yes. It applies one set of item parameters to everyone rather than ' +
         'age-banded norms, and 23 of its 30 items tap the abilities that decline with age. Treat the ' +
         'result as a comparison against adults in general rather than against your own age group.</p>'
    }
  ],

  related: [
    { href: '/guides/fluid-vs-crystallised-intelligence/', title: 'Fluid vs crystallised intelligence',
      text: 'Why the two halves of ability move in opposite directions across a lifetime.' },
    { href: '/guides/average-iq/', title: 'What is an average IQ?',
      text: 'How norming works, and why the average is pinned at 100 whatever happens to raw scores.' }
  ]
});
