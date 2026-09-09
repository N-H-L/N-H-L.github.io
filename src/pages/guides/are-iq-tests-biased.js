/* Guide: are IQ tests biased. */
'use strict';

var guide = require('./_guide.js');
var P = require('../_parts.js');

var REFS = [
  { id: 'g8r1', text: 'American Educational Research Association, American Psychological Association, & National Council on Measurement in Education (2014). Standards for Educational and Psychological Testing. AERA.' },
  { id: 'g8r2', text: 'Neisser, U., Boodoo, G., Bouchard, T. J., et al. (1996). Intelligence: Knowns and unknowns. American Psychologist, 51(2), 77-101.' },
  { id: 'g8r3', text: 'Nisbett, R. E., Aronson, J., Blair, C., Dickens, W., Flynn, J., Halpern, D. F., & Turkheimer, E. (2012). Intelligence: New findings and theoretical developments. American Psychologist, 67(2), 130-159.', url: 'https://doi.org/10.1037/a0026699', linkText: 'doi:10.1037/a0026699' },
  { id: 'g8r4', text: 'Steele, C. M., & Aronson, J. (1995). Stereotype threat and the intellectual test performance of African Americans. Journal of Personality and Social Psychology, 69(5), 797-811.' },
  { id: 'g8r5', text: 'Wicherts, J. M., Dolan, C. V., & Hessen, D. J. (2005). Stereotype threat and group differences in test performance: A question of measurement invariance. Journal of Personality and Social Psychology, 89(5), 696-716.', url: 'https://doi.org/10.1037/0022-3514.89.5.696', linkText: 'doi:10.1037/0022-3514.89.5.696' },
  { id: 'g8r6', text: 'Raven, J. (2000). The Raven Progressive Matrices: Change and stability over culture and time. Cognitive Psychology, 41(1), 1-48.', url: 'https://doi.org/10.1006/cogp.1999.0735', linkText: 'doi:10.1006/cogp.1999.0735' },
  { id: 'g8r7', text: 'Ritchie, S. J., & Tucker-Drob, E. M. (2018). How much does education improve intelligence? A meta-analysis. Psychological Science, 29(8), 1358-1369.', url: 'https://doi.org/10.1177/0956797618774253', linkText: 'doi:10.1177/0956797618774253' },
  { id: 'g8r8', text: 'Wicherts, J. M., Borsboom, D., & Dolan, C. V. (2010). Why national IQs do not support evolutionary theories of intelligence. Personality and Individual Differences, 48(2), 91-96.', url: 'https://doi.org/10.1016/j.paid.2009.05.028', linkText: 'doi:10.1016/j.paid.2009.05.028' },
  { id: 'g8r9', text: 'Duckworth, A. L., Quinn, P. D., Lynam, D. R., Loeber, R., & Stouthamer-Loeber, M. (2011). Role of test motivation in intelligence testing. PNAS, 108(19), 7716-7720.', url: 'https://doi.org/10.1073/pnas.1018601108', linkText: 'doi:10.1073/pnas.1018601108' }
];

module.exports = guide({
  slug: 'are-iq-tests-biased',
  crumb: 'Are IQ tests biased?',
  h1: 'Are IQ tests biased?',
  title: 'Are IQ Tests Biased? What Bias Really Means | CogniScale',
  description: 'Test bias has a precise technical meaning, and it is not the same as a score gap. What the evidence shows, what it cannot settle, and where this test is weakest.',
  lede: '"Biased" means something specific in psychometrics, and it is not what most arguments about it assume. Separating the technical question from the political one makes both easier to think about.',
  updated: '2026-09-09',
  published: '2026-09-09',
  toc: [
    { id: 'three-meanings', label: 'Three different things called bias' },
    { id: 'gap-is-not-bias', label: 'A score gap is not itself bias' },
    { id: 'cultural-loading', label: 'Cultural loading is real' },
    { id: 'threat', label: 'Stereotype threat and what it explains' },
    { id: 'this-test', label: 'Where this test is weakest' }
  ],
  refs: REFS,

  bodyTop:
    '<h2 id="three-meanings">Three different things called bias</h2>' +
    '<p>Arguments about test bias usually go badly because the participants are using the word to mean ' +
    'three unrelated things. The testing standards used across the field distinguish them carefully.' +
    P.ref(1, 'g8r1') + '</p>' +
    '<div class="table-wrap"><table>' +
      '<thead><tr><th>Sense</th><th>The question it asks</th><th>How it is tested</th></tr></thead>' +
      '<tbody>' +
        '<tr><td><b>Predictive bias</b></td><td>Does the test systematically over- or under-predict a real outcome for one group?</td><td>Compare regression slopes and intercepts across groups</td></tr>' +
        '<tr><td><b>Measurement bias</b></td><td>Does the test measure the same thing, on the same scale, in each group?</td><td>Measurement invariance testing; differential item functioning</td></tr>' +
        '<tr><td><b>Content or cultural loading</b></td><td>Does answering require knowledge that is unevenly distributed for reasons unrelated to reasoning?</td><td>Item review, cross-cultural comparison</td></tr>' +
      '</tbody>' +
    '</table></div>' +
    '<p>These can come apart. A test can be free of predictive bias and still be culturally loaded. It ' +
    'can measure the same construct in two groups while those groups have had wildly unequal ' +
    'opportunities to develop it. Establishing one thing tells you very little about the others - which ' +
    'is precisely why the argument goes in circles.</p>' +

    '<h2 id="gap-is-not-bias">A score gap is not itself bias</h2>' +
    '<p>This is the technical point that most often gets lost, and it cuts both ways.</p>' +
    '<p>If two groups differ in average score, that difference alone tells you nothing about whether the ' +
    'instrument is faulty. A thermometer is not biased because it reads lower in Reykjavik than in ' +
    'Cairo. Whether a test is <i>measuring badly</i> is a separate question from whether the thing being ' +
    'measured <i>differs</i>, and separate again from <i>why</i> it differs.</p>' +
    '<div class="note">' +
      '<p style="margin:0">The corollary is the part people skip: showing a test is technically unbiased ' +
      'does <b>not</b> show that the scores reflect equal opportunity. If a group has had systematically ' +
      'less schooling, an unbiased test will faithfully record the consequence. Faithful measurement of ' +
      'an unequal situation is still measurement of an unequal situation.</p>' +
    '</div>' +
    '<p>That matters here because education has a demonstrated causal effect on measured intelligence - ' +
    'roughly one to five IQ points per additional year, established using compulsory-schooling reforms ' +
    'as natural experiments.' + P.ref(7, 'g8r7') + ' Unequal schooling is therefore sufficient to ' +
    'produce score differences without any defect in the test at all.</p>' +
    '<p>Major expert reviews have consistently reported that well-constructed tests show little evidence ' +
    'of predictive bias, while stressing that the causes of group differences in scores remain ' +
    'unresolved and are not settled by the psychometric evidence.' + P.ref(2, 'g8r2') + P.ref(3, 'g8r3') +
    ' This site takes no position on those causes; a test score is not the kind of evidence that could ' +
    'settle them.</p>',

  bodyBottom:
    '<h2 id="cultural-loading">Cultural loading is real</h2>' +
    '<p>Some item types are obviously culture-bound. A vocabulary question asks whether you have met a ' +
    'word, and which words you have met depends on your language, schooling and reading. A general ' +
    'knowledge question is worse still. These items can be excellent predictors within a culture and ' +
    'close to meaningless across cultures.</p>' +
    '<p>Figural matrices were designed to reduce this. They use no words, require no facts, and ask only ' +
    'that you infer a rule from a pattern - which is why they travel better than verbal tests and why ' +
    'they dominate cross-cultural work.' + P.ref(6, 'g8r6') + '</p>' +
    '<p>"Culture-reduced" is not "culture-free", though. Matrix items still assume:</p>' +
    '<ul>' +
      '<li>familiarity with reading a grid left-to-right and top-to-bottom;</li>' +
      '<li>comfort with abstract, decontextualised puzzles as a legitimate activity;</li>' +
      '<li>experience of formal testing, and of the implicit rule that you should keep going when stuck;</li>' +
      '<li>schooling in the analytic style of thinking these items reward.</li>' +
    '</ul>' +
    '<p>None of that is innate. All of it is unevenly distributed. It is one reason cross-national score ' +
    'comparisons are treated sceptically by measurement specialists - such datasets are frequently built ' +
    'from small, unrepresentative and non-comparable samples, and rarely satisfy the invariance ' +
    'requirements that would make the comparison meaningful in the first place.' + P.ref(8, 'g8r8') + '</p>' +

    '<h2 id="threat">Stereotype threat and what it explains</h2>' +
    '<p>A well-known line of research showed that making a negative stereotype salient before a test ' +
    'depressed the performance of the stereotyped group.' + P.ref(4, 'g8r4') + ' The finding shaped ' +
    'decades of discussion about testing.</p>' +
    '<p>A later analysis raised a sharp technical objection. If stereotype threat lowers scores, it ' +
    'should show up as a violation of measurement invariance - the test would be functioning differently ' +
    'under threat. Re-analysing the data, the authors found the evidence for this was weaker and more ' +
    'inconsistent than the standard account implied.' + P.ref(5, 'g8r5') + '</p>' +
    '<p>The honest summary is that situational factors clearly affect test performance, that stereotype ' +
    'threat is one candidate mechanism, and that its size and generality are actively contested.</p>' +
    '<p>What is not contested is that <b>motivation</b> moves scores substantially. A meta-analysis of ' +
    'studies offering material incentives found average gains of around 0.64 standard deviations, ' +
    'concentrated among lower scorers.' + P.ref(9, 'g8r9') + ' Any unsupervised test - including this one ' +
    '- is measuring effort as well as ability, and cannot distinguish the two.</p>' +

    '<h2 id="this-test">Where this test is weakest</h2>' +
    '<p>Applying all of the above to this site specifically, rather than in the abstract:</p>' +
    '<div class="table-wrap"><table>' +
      '<thead><tr><th>Concern</th><th>Status here</th></tr></thead>' +
      '<tbody>' +
        '<tr><td>Language dependence</td><td><b>Real.</b> Seven of 30 items are verbal and assume fluent English, including two vocabulary-in-context items. A fluent non-native speaker will be underestimated.</td></tr>' +
        '<tr><td>Cultural content</td><td><b>Partly mitigated.</b> The other 23 items are figural, numeric or spatial and require no cultural knowledge - but they still assume familiarity with formal testing.</td></tr>' +
        '<tr><td>Predictive bias</td><td><b>Unknown.</b> Testing it requires an external criterion and group data we do not have and do not collect.</td></tr>' +
        '<tr><td>Measurement invariance</td><td><b>Untested.</b> This needs a large sample with demographic data. We hold no such data by design.</td></tr>' +
        '<tr><td>Motivation and conditions</td><td><b>Uncontrolled.</b> Nobody is supervising you. Effort, interruptions and fatigue all enter the score.</td></tr>' +
      '</tbody>' +
    '</table></div>' +
    '<p>Two of those say "unknown", and that is not evasion - it follows directly from a deliberate ' +
    'design decision. This test stores nothing and asks for no demographic information, which means the ' +
    'data needed to test for bias does not exist. We think that is the right trade for a free public ' +
    'test, but it has a cost, and the cost is that we cannot make the reassuring claim.</p>' +
    '<p>The practical implication: if English is not your first language, treat the verbal domain score ' +
    'as an underestimate and weight the figural, numeric and spatial domains more heavily. The ' +
    '<a href="/methodology/">methodology page</a> sets out the rest of what the test can and cannot ' +
    'support.</p>',

  faq: [
    {
      q: 'Does a difference in average scores between groups prove the test is biased?',
      a: '<p>No. Bias in the technical sense means the test measures differently or predicts differently ' +
         'across groups. A difference in scores is compatible with an unbiased test faithfully recording ' +
         'differences in the environments and opportunities that produced them. Equally, showing a test ' +
         'is unbiased does not show those environments were equal.</p>'
    },
    {
      q: 'Are non-verbal tests like matrices culture-free?',
      a: '<p>Culture-reduced, not culture-free. They avoid vocabulary and factual knowledge, which is why ' +
         'they travel better across languages. But they still assume familiarity with grids, with ' +
         'abstract puzzles as a worthwhile activity, and with formal testing itself - all of which are ' +
         'products of schooling.</p>'
    },
    {
      q: 'Will this test underestimate me if English is not my first language?',
      a: '<p>Probably, yes. Seven of the 30 items are verbal and two turn on knowing specific English ' +
         'words. Your verbal domain score is the one to discount; the figural, numeric and spatial ' +
         'domains are far less language-dependent.</p>'
    },
    {
      q: 'Has this test been checked for bias?',
      a: '<p>No, and it cannot be with the current design. Testing for predictive bias or measurement ' +
         'invariance requires demographic data and an external criterion. This test stores nothing about ' +
         'you and asks no demographic questions, so that data does not exist. We would rather say this ' +
         'plainly than imply a check we have not done.</p>'
    }
  ],

  related: [
    { href: '/guides/are-online-iq-tests-accurate/', title: 'Are online IQ tests accurate?',
      text: 'Reliability, validity and norming - and an eight-point checklist with this site marked against it.' },
    { href: '/guides/how-iq-tests-are-made/', title: 'How IQ tests are built',
      text: 'Item writing, piloting, norming and the standardisation sample that decides what your score means.' }
  ],

  ctaHeading: 'Take it with the caveats in mind',
  ctaSub: 'Thirty questions, a score with the uncertainty attached, and every limitation stated openly.'
});
