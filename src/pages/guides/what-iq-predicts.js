/* Guide: what IQ actually predicts. */
'use strict';

var guide = require('./_guide.js');
var P = require('../_parts.js');

var REFS = [
  { id: 'g7r1', text: 'Deary, I. J., Strand, S., Smith, P., & Fernandes, C. (2007). Intelligence and educational achievement. Intelligence, 35(1), 13-21.', url: 'https://doi.org/10.1016/j.intell.2006.02.001', linkText: 'doi:10.1016/j.intell.2006.02.001' },
  { id: 'g7r2', text: 'Schmidt, F. L., & Hunter, J. E. (1998). The validity and utility of selection methods in personnel psychology. Psychological Bulletin, 124(2), 262-274.' },
  { id: 'g7r3', text: 'Sackett, P. R., Zhang, C., Berry, C. M., & Lievens, F. (2022). Revisiting meta-analytic estimates of validity in personnel selection. Journal of Applied Psychology, 107(11), 2040-2068.', url: 'https://doi.org/10.1037/apl0000994', linkText: 'doi:10.1037/apl0000994' },
  { id: 'g7r4', text: 'Strenze, T. (2007). Intelligence and socioeconomic success: A meta-analytic review of longitudinal research. Intelligence, 35(5), 401-426.', url: 'https://doi.org/10.1016/j.intell.2006.09.004', linkText: 'doi:10.1016/j.intell.2006.09.004' },
  { id: 'g7r5', text: 'Calvin, C. M., Deary, I. J., Fenton, C., Roberts, B. A., Der, G., Leckenby, N., & Batty, G. D. (2011). Intelligence in youth and all-cause mortality: systematic review with meta-analysis. International Journal of Epidemiology, 40(3), 626-644.', url: 'https://doi.org/10.1093/ije/dyq190', linkText: 'doi:10.1093/ije/dyq190' },
  { id: 'g7r6', text: 'Deary, I. J., Whiteman, M. C., Starr, J. M., Whalley, L. J., & Fox, H. C. (2004). The impact of childhood intelligence on later life: Following up the Scottish Mental Surveys of 1932 and 1947. Journal of Personality and Social Psychology, 86(1), 130-147.' },
  { id: 'g7r7', text: 'Neisser, U., Boodoo, G., Bouchard, T. J., et al. (1996). Intelligence: Knowns and unknowns. American Psychologist, 51(2), 77-101.' },
  { id: 'g7r8', text: 'Nisbett, R. E., Aronson, J., Blair, C., Dickens, W., Flynn, J., Halpern, D. F., & Turkheimer, E. (2012). Intelligence: New findings and theoretical developments. American Psychologist, 67(2), 130-159.', url: 'https://doi.org/10.1037/a0026699', linkText: 'doi:10.1037/a0026699' }
];

module.exports = guide({
  slug: 'what-iq-predicts',
  crumb: 'What IQ predicts',
  h1: 'What IQ actually predicts',
  title: 'What Does IQ Actually Predict? | CogniScale',
  description: 'IQ correlates with school results, job performance, income and even lifespan - but the correlations are far looser than most people assume. What the numbers mean.',
  lede: 'IQ is one of the better predictors psychology has of real-world outcomes. It is also a much weaker predictor of any individual life than either its champions or its critics tend to admit.',
  updated: '2026-09-09',
  published: '2026-09-09',
  toc: [
    { id: 'reading-correlations', label: 'How to read a correlation' },
    { id: 'school', label: 'School results' },
    { id: 'work', label: 'Job performance' },
    { id: 'money', label: 'Income and status' },
    { id: 'health', label: 'Health and lifespan' },
    { id: 'limits', label: 'What it does not tell you' }
  ],
  refs: REFS,

  bodyTop:
    '<h2 id="reading-correlations">How to read a correlation</h2>' +
    '<p>Everything below is reported as a correlation, so it is worth spending sixty seconds on what ' +
    'those numbers mean - because this is where almost all misreading happens.</p>' +
    '<p>A correlation of <b>r = 0.5</b> sounds like "half". It is not. Square it and you get the share of ' +
    'variance accounted for: 0.25, or a quarter. Three quarters of the differences between people on the ' +
    'outcome are down to something else.</p>' +
    '<div class="table-wrap"><table>' +
      '<thead><tr><th>Correlation</th><th>Variance explained</th><th>In plain terms</th></tr></thead>' +
      '<tbody>' +
        '<tr><td>0.2</td><td>4%</td><td>Detectable across thousands of people; useless for predicting one</td></tr>' +
        '<tr><td>0.3</td><td>9%</td><td>A real but loose tendency</td></tr>' +
        '<tr><td>0.5</td><td>25%</td><td>Strong by psychology standards</td></tr>' +
        '<tr><td>0.8</td><td>64%</td><td>Rare outside measures of the same thing</td></tr>' +
      '</tbody>' +
    '</table></div>' +
    '<p>Keep that table in mind. A correlation strong enough to be one of the most robust findings in ' +
    'psychology can still leave you unable to say much about the person in front of you.</p>' +

    '<h2 id="school">School results</h2>' +
    '<p>This is where IQ predicts best, which is unsurprising: IQ tests were invented to predict school ' +
    'performance, and both tasks reward the same abstract, verbal, quantitative reasoning.</p>' +
    '<p>The landmark study followed more than 70,000 English children from an ability test at age 11 to ' +
    'their national exam results at 16. The correlation between the latent ability factor and exam ' +
    'performance was <b>0.81</b>.' + P.ref(1, 'g7r1') + ' That is an unusually strong result for ' +
    'psychology - roughly two thirds of the variance in exam outcomes.</p>' +
    '<p>Two caveats stop that being the whole story. It is a correlation between <i>latent factors</i>, ' +
    'which are statistically cleaned of measurement error and so run higher than what you would see ' +
    'between two raw test scores. And it was measured within a single national curriculum, where what is ' +
    'examined and what the test samples overlap heavily by design.</p>' +
    '<p>Even at 0.81, the study found plenty of children whose results departed sharply from prediction ' +
    'in both directions.</p>',

  bodyBottom:
    '<h2 id="work">Job performance</h2>' +
    '<p>For decades the standard reference was a 1998 meta-analysis reporting that general mental ability ' +
    'predicted job performance at around <b>r = 0.51</b>, better than any other single selection method.' +
    P.ref(2, 'g7r2') + ' That figure was repeated so often it became folklore.</p>' +
    '<p>In 2022 it was substantially revised. A re-analysis argued that the earlier corrections for range ' +
    'restriction had been applied too aggressively, inflating validity estimates across the board. With ' +
    'more defensible corrections, cognitive ability predicts job performance at roughly ' +
    '<b>r = 0.31</b> - still useful, still among the better predictors, but around 10% of variance rather ' +
    'than 26%.' + P.ref(3, 'g7r3') + '</p>' +
    '<div class="note">' +
      '<p style="margin:0">This is a good example of science correcting itself, and of why you should be ' +
      'wary of any site quoting the 0.51 figure without noting it has been challenged. The direction of ' +
      'the finding survived; the magnitude did not.</p>' +
    '</div>' +
    '<p>Validity also varies by job complexity. Cognitive ability matters more for work involving novel ' +
    'problems and less for highly routinised work - which is intuitive, and consistent with fluid ' +
    'reasoning being about handling situations you have not memorised a response to.</p>' +

    '<h2 id="money">Income and status</h2>' +
    '<p>A meta-analysis of longitudinal studies - measuring ability first and outcomes years later - put ' +
    'the correlation between intelligence and later income at about <b>0.23</b>, with occupational status ' +
    'around <b>0.37</b> and educational attainment around <b>0.56</b>.' + P.ref(4, 'g7r4') + '</p>' +
    '<p>So the causal chain looks less like "clever people earn more" and more like "ability predicts how ' +
    'far you get in education, education predicts what job you can enter, and the job predicts the pay". ' +
    'Each link loses information.</p>' +
    '<p>At an income correlation of 0.23, intelligence accounts for about 5% of the variation in what ' +
    'people earn. Parental background, field of work, geography, negotiation, timing and luck occupy ' +
    'most of the rest. Anyone selling IQ as the key to financial success is misreading their own ' +
    'evidence.</p>' +

    '<h2 id="health">Health and lifespan</h2>' +
    '<p>The most surprising finding in this literature is that childhood intelligence predicts how long ' +
    'you live. A systematic review pooling 16 studies found that a one standard deviation advantage in ' +
    'youth intelligence - 15 IQ points - was associated with roughly a <b>24% lower risk of death</b> ' +
    'over follow-up periods of up to 69 years.' + P.ref(5, 'g7r5') + '</p>' +
    '<p>This line of work owes much to an unusual resource: Scotland tested almost every eleven-year-old ' +
    'in the country in 1932 and again in 1947, and researchers later traced those same people into old ' +
    'age.' + P.ref(6, 'g7r6') + '</p>' +
    '<p>Why the link exists is genuinely unsettled. Candidate explanations include health literacy and ' +
    'treatment adherence, safer and less physically damaging occupations, socioeconomic advantage acting ' +
    'on both, and the possibility that test performance partly indexes general bodily integrity. These ' +
    'are not mutually exclusive, and the evidence does not currently pick between them.</p>' +

    '<h2 id="limits">What it does not tell you</h2>' +
    '<p>Pulling the numbers together:</p>' +
    '<div class="table-wrap"><table>' +
      '<thead><tr><th>Outcome</th><th>Approx. correlation</th><th>Variance explained</th></tr></thead>' +
      '<tbody>' +
        '<tr><td>School exam results (latent factors)</td><td>0.81</td><td>~66%</td></tr>' +
        '<tr><td>Educational attainment</td><td>0.56</td><td>~31%</td></tr>' +
        '<tr><td>Occupational status</td><td>0.37</td><td>~14%</td></tr>' +
        '<tr><td>Job performance (2022 estimate)</td><td>0.31</td><td>~10%</td></tr>' +
        '<tr><td>Income</td><td>0.23</td><td>~5%</td></tr>' +
      '</tbody>' +
    '</table></div>' +
    '<p>The pattern is consistent: IQ predicts best where the outcome most resembles the test, and the ' +
    'prediction weakens steadily as you move toward things people actually care about.</p>' +
    '<p>Three limits are worth stating plainly.</p>' +
    '<ul>' +
      '<li><b>Group averages are not individual forecasts.</b> Every correlation above is compatible with ' +
      'enormous numbers of individual exceptions, and the exceptions are not rare curiosities - at r=0.3 ' +
      'they are most of the distribution.</li>' +
      '<li><b>Correlation is not mechanism.</b> Ability, schooling and background are entangled, and ' +
      'observational studies mostly cannot separate them.</li>' +
      '<li><b>The tests do not sample everything.</b> Persistence, judgement under uncertainty, ' +
      'creativity, social skill and simply choosing well are largely outside what an IQ test looks at, ' +
      'and they are not obviously less consequential.' + P.ref(7, 'g7r7') + P.ref(8, 'g7r8') + '</li>' +
    '</ul>' +
    '<p>A score from this or any other test is a reading on one narrow instrument. It is genuinely ' +
    'informative at the level of populations. It is a weak basis for any conclusion about a person, ' +
    'including yourself.</p>',

  faq: [
    {
      q: 'Is IQ the best predictor of job performance?',
      a: '<p>It is among the better ones, but the widely quoted figure of 0.51 has been revised. A 2022 ' +
         're-analysis argued earlier corrections for range restriction were too aggressive and put the ' +
         'estimate nearer 0.31 - about 10% of the variance in performance. Structured interviews and job ' +
         'knowledge tests perform comparably on the updated figures.</p>'
    },
    {
      q: 'Does a high IQ mean you will earn more?',
      a: '<p>On average, slightly. The longitudinal correlation with income is about 0.23, which is ' +
         'roughly 5% of the variation in earnings. Field of work, family background, geography and luck ' +
         'together account for far more. It is a real tendency and a poor individual forecast.</p>'
    },
    {
      q: 'Why would IQ predict how long someone lives?',
      a: '<p>The association is well replicated - about a 24% lower mortality risk per 15 IQ points in ' +
         'youth - but the explanation is not settled. Health literacy, occupational hazard, ' +
         'socioeconomic position and general bodily integrity are all plausible contributors, and the ' +
         'current evidence does not decide between them.</p>'
    },
    {
      q: 'If IQ predicts outcomes, should I be worried about a low score?',
      a: '<p>Not on the basis of a short unsupervised test, no. Outside education the correlations ' +
         'explain between 5% and 15% of the variance in outcomes, and a 30-item online test carries a ' +
         'confidence interval of roughly plus or minus nine points on top of that. The score is a weak ' +
         'signal about you specifically.</p>'
    }
  ],

  related: [
    { href: '/guides/iq-score-ranges/', title: 'IQ score ranges and percentiles',
      text: 'What a given score means as a rank, and how much measurement error sits around it.' },
    { href: '/guides/can-you-improve-your-iq/', title: 'Can you improve your IQ?',
      text: 'What the training research actually shows, and what reliably moves the number.' }
  ],

  ctaHeading: 'See where you land',
  ctaSub: 'A score, the interval around it, and an explanation of every question you missed.'
});
