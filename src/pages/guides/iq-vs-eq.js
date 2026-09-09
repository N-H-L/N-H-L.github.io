/* Guide: IQ vs EQ. */
'use strict';

var guide = require('./_guide.js');
var P = require('../_parts.js');

var REFS = [
  { id: 'g11r1', text: 'Salovey, P., & Mayer, J. D. (1990). Emotional intelligence. Imagination, Cognition and Personality, 9(3), 185-211.' },
  { id: 'g11r2', text: 'Goleman, D. (1995). Emotional Intelligence: Why It Can Matter More Than IQ. Bantam Books.' },
  { id: 'g11r3', text: 'Mayer, J. D., Roberts, R. D., & Barsade, S. G. (2008). Human abilities: Emotional intelligence. Annual Review of Psychology, 59, 507-536.', url: 'https://doi.org/10.1146/annurev.psych.59.103006.093646', linkText: 'doi:10.1146/annurev.psych.59.103006.093646' },
  { id: 'g11r4', text: 'Joseph, D. L., & Newman, D. A. (2010). Emotional intelligence: An integrative meta-analysis and cascading model. Journal of Applied Psychology, 95(1), 54-78.', url: 'https://doi.org/10.1037/a0017286', linkText: 'doi:10.1037/a0017286' },
  { id: 'g11r5', text: "O'Boyle, E. H., Humphrey, R. H., Pollack, J. M., Hawver, T. H., & Story, P. A. (2011). The relation between emotional intelligence and job performance: A meta-analysis. Journal of Organizational Behavior, 32(5), 788-818.", url: 'https://doi.org/10.1002/job.714', linkText: 'doi:10.1002/job.714' },
  { id: 'g11r6', text: 'Van Rooy, D. L., & Viswesvaran, C. (2004). Emotional intelligence: A meta-analytic investigation of predictive validity and nomological net. Journal of Vocational Behavior, 65(1), 71-95.' },
  { id: 'g11r7', text: 'Sackett, P. R., Zhang, C., Berry, C. M., & Lievens, F. (2022). Revisiting meta-analytic estimates of validity in personnel selection. Journal of Applied Psychology, 107(11), 2040-2068.', url: 'https://doi.org/10.1037/apl0000994', linkText: 'doi:10.1037/apl0000994' },
  { id: 'g11r8', text: 'Carroll, J. B. (1993). Human Cognitive Abilities: A Survey of Factor-Analytic Studies. Cambridge University Press.' }
];

module.exports = guide({
  slug: 'iq-vs-eq',
  crumb: 'IQ vs EQ',
  h1: 'IQ vs EQ: what each one actually predicts',
  title: 'IQ vs EQ: What the Evidence Says About Each | CogniScale',
  description: 'Emotional intelligence is real but smaller than the popular claim. What EQ measures, how it differs from IQ, and why "EQ matters more" outran its evidence.',
  lede: 'The claim that emotional intelligence matters more than IQ came from a bestseller, not from a finding. The research underneath it is more interesting, and considerably more modest.',
  updated: '2026-09-09',
  published: '2026-09-09',
  toc: [
    { id: 'origins', label: 'Where the idea came from' },
    { id: 'two-kinds', label: 'Two very different things called EQ' },
    { id: 'personality', label: 'The personality problem' },
    { id: 'predicts', label: 'What each actually predicts' },
    { id: 'verdict', label: 'The honest comparison' }
  ],
  refs: REFS,

  bodyTop:
    '<h2 id="origins">Where the idea came from</h2>' +
    '<p>The academic concept arrived in 1990, defined as the ability to monitor emotions in yourself and ' +
    'others, discriminate between them, and use that information to guide thinking and action.' +
    P.ref(1, 'g11r1') + ' It was a careful proposal for a new ability, offered tentatively.</p>' +
    '<p>Five years later a popular book carried the subtitle <i>Why It Can Matter More Than IQ</i>, sold ' +
    'in enormous numbers, and fixed that comparison in the public mind.' + P.ref(2, 'g11r2') + '</p>' +
    '<p>The researchers who introduced the construct have since been explicit that popular accounts ' +
    'overstate it, and that much of what gets marketed as emotional intelligence is a mixture of ' +
    'personality traits and motivational qualities rather than an ability.' + P.ref(3, 'g11r3') + '</p>' +

    '<h2 id="two-kinds">Two very different things called EQ</h2>' +
    '<p>This is the distinction that resolves most of the confusion, and almost nothing written for a ' +
    'general audience draws it.</p>' +
    '<div class="table-wrap"><table>' +
      '<thead><tr><th></th><th>Ability EI</th><th>Trait EI</th></tr></thead>' +
      '<tbody>' +
        '<tr><td>What it is</td><td>A cognitive ability: perceiving and reasoning about emotion</td><td>A self-perception: how emotionally capable you believe you are</td></tr>' +
        '<tr><td>How it is measured</td><td>Performance test with right and wrong answers</td><td>Self-report questionnaire</td></tr>' +
        '<tr><td>Analogous to</td><td>An IQ subtest</td><td>A personality inventory</td></tr>' +
        '<tr><td>Correlates with IQ</td><td>Modestly, positively</td><td>Close to zero</td></tr>' +
      '</tbody>' +
    '</table></div>' +
    '<p>Ability EI behaves like an ability. It has correct answers, correlates modestly with general ' +
    'intelligence, and can be placed within the standard hierarchical model of cognitive abilities.' +
    P.ref(8, 'g11r8') + '</p>' +
    '<p>Trait EI behaves like personality, because to a large extent it <i>is</i> personality. Asking ' +
    'people to rate how well they read a room measures their self-image, which is a genuinely different ' +
    'thing from their skill at reading rooms.</p>' +
    '<div class="note">' +
      '<p style="margin:0">Whenever you see a claim about EQ, the first question is which of these was ' +
      'measured. Most impressive-sounding results in the popular literature come from self-report - and ' +
      'a self-report measure predicting a self-reported outcome is a much weaker finding than it looks.</p>' +
    '</div>',

  bodyBottom:
    '<h2 id="personality">The personality problem</h2>' +
    '<p>The sharpest criticism of trait EI is that it does not measure anything new. Its questionnaires ' +
    'overlap heavily with established personality dimensions - particularly emotional stability, ' +
    'extraversion, agreeableness and conscientiousness.</p>' +
    '<p>The test that matters here is <b>incremental validity</b>: once you already know someone’s ' +
    'personality and cognitive ability, does an EI score tell you anything more?</p> ' +
    '<p>Meta-analytic work finds the answer is a qualified yes - the increment is real but small, and it ' +
    'is much larger in jobs with high emotional demands than in jobs without them.' + P.ref(4, 'g11r4') +
    P.ref(5, 'g11r5') + ' For a nurse, a negotiator or a salesperson, emotional skill plausibly does ' +
    'work that general ability does not. For a statistician, considerably less.</p>' +
    '<p>That is a defensible, useful finding. It is not "more important than IQ".</p>' +

    '<h2 id="predicts">What each actually predicts</h2>' +
    '<p>Setting the two side by side on the outcome they are most often compared on - job performance - ' +
    'and using correlations that have survived methodological scrutiny:</p>' +
    '<div class="table-wrap"><table>' +
      '<thead><tr><th>Predictor</th><th>Approx. correlation with job performance</th><th>Variance explained</th></tr></thead>' +
      '<tbody>' +
        '<tr><td>General cognitive ability</td><td>~0.31' + P.ref(7, 'g11r7') + '</td><td>~10%</td></tr>' +
        '<tr><td>Emotional intelligence (mixed measures)</td><td>~0.2-0.3' + P.ref(5, 'g11r5') + P.ref(6, 'g11r6') + '</td><td>~4-9%</td></tr>' +
      '</tbody>' +
    '</table></div>' +
    '<p>Two honest caveats about that table. The EI figure covers measures that mix ability and trait ' +
    'approaches, and the trait ones carry personality variance that would otherwise be credited to ' +
    'personality. And the cognitive ability figure is itself a downward revision of the long-quoted 0.51, ' +
    'after a 2022 re-analysis found earlier corrections too aggressive.' + P.ref(7, 'g11r7') + '</p>' +
    '<p>So the two are closer than the older literature implied - but that is partly because the IQ ' +
    'estimate came down, not because the EQ estimate went up.</p>' +

    '<h2 id="verdict">The honest comparison</h2>' +
    '<ul>' +
      '<li><b>Both are real, and both are modest.</b> Each explains something in the range of 4% to 10% ' +
      'of the variance in job performance. Neither is close to determining an individual outcome.</li>' +
      '<li><b>They are not competitors.</b> They predict partly different things, and the interesting ' +
      'question is what each adds to the other, not which wins.</li>' +
      '<li><b>Ability EI is a genuine construct; trait EI is largely personality.</b> Conflating them is ' +
      'the single biggest source of inflated claims.</li>' +
      '<li><b>Context decides which matters.</b> Emotional demand in the role is the moderator that ' +
      'keeps showing up.</li>' +
      '<li><b>"EQ matters more than IQ" is a book subtitle</b>, not a research finding.</li>' +
    '</ul>' +
    '<p>This site measures four narrow reasoning abilities and makes no claim beyond them. It does not ' +
    'measure emotional intelligence, personality, judgement, persistence or social skill - and a score ' +
    'here says nothing about any of those. What a cognitive score does and does not license is set out ' +
    'in <a href="/guides/what-iq-predicts/">what IQ actually predicts</a>.</p>',

  faq: [
    {
      q: 'Is EQ more important than IQ?',
      a: '<p>That claim comes from the subtitle of a 1995 bestseller rather than from evidence. On job ' +
         'performance both explain roughly 4% to 10% of the variance, and they predict partly different ' +
         'things. Emotional intelligence matters more in emotionally demanding roles, which is a useful ' +
         'finding and a much narrower one.</p>'
    },
    {
      q: 'What is the difference between ability EI and trait EI?',
      a: '<p>Ability EI is measured with a performance test that has correct answers and behaves like a ' +
         'cognitive ability. Trait EI is a self-report questionnaire measuring how emotionally capable ' +
         'you believe you are, and it overlaps heavily with standard personality dimensions. Most ' +
         'striking popular claims rest on the self-report kind.</p>'
    },
    {
      q: 'Can you test EQ the way you test IQ?',
      a: '<p>Ability-based measures try to, using items with scoreable answers. They are harder to build ' +
         'than cognitive items, because deciding the correct emotional response is less clear-cut than ' +
         'deciding which figure completes a matrix - the scoring key itself becomes contestable.</p>'
    },
    {
      q: 'Does this test measure emotional intelligence?',
      a: '<p>No. It measures four narrow reasoning abilities: figural, numeric, verbal and spatial. It ' +
         'says nothing about emotional skill, personality or social judgement, and we would rather state ' +
         'that than imply broader coverage than the items support.</p>'
    }
  ],

  related: [
    { href: '/guides/what-iq-predicts/', title: 'What IQ actually predicts',
      text: 'School, work, income and health - and how loose those correlations really are.' },
    { href: '/guides/fluid-vs-crystallised-intelligence/', title: 'Fluid vs crystallised intelligence',
      text: 'The two-way split that does hold up in the data, and what each one covers.' }
  ]
});
