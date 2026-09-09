/* Guide: the main types of IQ test. */
'use strict';

var guide = require('./_guide.js');
var P = require('../_parts.js');

var REFS = [
  { id: 'g15r1', text: 'Wechsler, D. (2008). Wechsler Adult Intelligence Scale - Fourth Edition: Technical and Interpretive Manual. Pearson.' },
  { id: 'g15r2', text: 'Roid, G. H. (2003). Stanford-Binet Intelligence Scales, Fifth Edition: Technical Manual. Riverside Publishing.' },
  { id: 'g15r3', text: 'Raven, J. (2000). The Raven Progressive Matrices: Change and stability over culture and time. Cognitive Psychology, 41(1), 1-48.', url: 'https://doi.org/10.1006/cogp.1999.0735', linkText: 'doi:10.1006/cogp.1999.0735' },
  { id: 'g15r4', text: 'Carroll, J. B. (1993). Human Cognitive Abilities: A Survey of Factor-Analytic Studies. Cambridge University Press.' },
  { id: 'g15r5', text: 'Condon, D. M., & Revelle, W. (2014). The International Cognitive Ability Resource: Development and initial validation of a public-domain measure. Intelligence, 43, 52-64.', url: 'https://doi.org/10.1016/j.intell.2014.01.004', linkText: 'doi:10.1016/j.intell.2014.01.004' },
  { id: 'g15r6', text: 'American Educational Research Association, American Psychological Association, & National Council on Measurement in Education (2014). Standards for Educational and Psychological Testing. AERA.' },
  { id: 'g15r7', text: 'Binet, A., & Simon, T. (1905). Methodes nouvelles pour le diagnostic du niveau intellectuel des anormaux. L\'Annee Psychologique, 11, 191-244.' },
  { id: 'g15r8', text: 'Cattell, R. B. (1963). Theory of fluid and crystallized intelligence: A critical experiment. Journal of Educational Psychology, 54(1), 1-22.' }
];

module.exports = guide({
  slug: 'types-of-iq-tests',
  crumb: 'Types of IQ test',
  h1: 'The main types of IQ test, and what each is for',
  title: 'Types of IQ Test, Compared | CogniScale',
  description: 'Individual clinical batteries, group tests, non-verbal matrices and online tests measure different things under different conditions. A practical comparison.',
  lede: '"IQ test" covers instruments that differ enormously in what they sample, who may administer them, and what their scores can support. Knowing which kind you are looking at answers most questions about it.',
  updated: '2026-09-09',
  published: '2026-09-09',
  toc: [
    { id: 'clinical', label: 'Individual clinical batteries' },
    { id: 'nonverbal', label: 'Non-verbal and matrix tests' },
    { id: 'group', label: 'Group and screening tests' },
    { id: 'online', label: 'Online tests' },
    { id: 'compare', label: 'Side by side' },
    { id: 'which', label: 'Which one do you need' }
  ],
  refs: REFS,

  bodyTop:
    '<h2 id="clinical">Individual clinical batteries</h2>' +
    '<p>These are the instruments people mean by "a real IQ test": administered one-to-one by a ' +
    'qualified psychologist, taking one to two hours, and producing a profile rather than a single ' +
    'number.</p>' +
    '<p>The <b>Wechsler Adult Intelligence Scale</b> is the most widely used. It reports a Full Scale IQ ' +
    'built from index scores covering verbal comprehension, perceptual reasoning, working memory and ' +
    'processing speed. Its standardisation sample comprised 2,200 adults stratified against census ' +
    'figures, and full-scale reliability is around 0.98.' + P.ref(1, 'g15r1') + ' Parallel versions exist ' +
    'for children.</p>' +
    '<p>The <b>Stanford-Binet</b> descends from the original 1905 Binet-Simon scale, built to identify ' +
    'children needing additional support in school - the task that created the field.' + P.ref(7, 'g15r7') +
    ' The current edition covers five factors in both verbal and non-verbal formats.' + P.ref(2, 'g15r2') + '</p>' +
    '<p>What you are paying for with these is not harder puzzles. It is:</p>' +
    '<ul>' +
      '<li><b>Controlled conditions</b> - a trained administrator observing how you work, not just what ' +
      'you answer.</li>' +
      '<li><b>Breadth</b> - several distinct abilities sampled with enough items each to be reliable ' +
      'separately.</li>' +
      '<li><b>Proper norms</b> - a large representative standardisation sample, banded by age.</li>' +
      '<li><b>Standing</b> - only these support diagnostic or legal decisions.' + P.ref(6, 'g15r6') + '</li>' +
    '</ul>' +

    '<h2 id="nonverbal">Non-verbal and matrix tests</h2>' +
    '<p>These strip out language entirely. <b>Raven\'s Progressive Matrices</b> is the archetype: grids ' +
    'of figures with a missing cell, no words, no arithmetic.' + P.ref(3, 'g15r3') + '</p>' +
    '<p>They exist for good reasons. They can be given across languages with only the instructions ' +
    'translated; they suit people with language impairments or limited schooling; and they load heavily ' +
    'on fluid reasoning, the ability most associated with the general factor.' + P.ref(8, 'g15r8') + '</p>' +
    '<p>The trade is narrowness. A matrices score says little about verbal comprehension, acquired ' +
    'knowledge or processing speed. It is a deep measurement of one broad ability rather than a survey ' +
    'of several - which is exactly right for research and incomplete for clinical assessment. See ' +
    '<a href="/guides/ravens-progressive-matrices/">how matrices work</a>.</p>',

  bodyBottom:
    '<h2 id="group">Group and screening tests</h2>' +
    '<p>Group tests are administered to many people at once, on paper or by computer, without individual ' +
    'observation. Military selection batteries and educational screening instruments are the main ' +
    'examples, and the format dates to the need to sort very large numbers of recruits quickly.</p>' +
    '<p>They are cheap per head and reasonably reliable, but they lose the administrator’s observation - ' +
    'nobody notices that you misheard the instruction, or worked carefully rather than quickly. Brief ' +
    'screeners exist for the same reason: a fifteen-minute estimate that flags whether a full assessment ' +
    'is warranted, without pretending to replace one.</p>' +

    '<h2 id="online">Online tests</h2>' +
    '<p>The category covers everything from serious research instruments to entertainment.</p>' +
    '<p>At the serious end sit publicly documented research measures. The International Cognitive Ability ' +
    'Resource was developed and validated on 96,958 participants across 199 countries, with published ' +
    'reliability figures and item statistics.' + P.ref(5, 'g15r5') + ' Its 16-item short form reached an ' +
    'internal consistency of 0.81, and a later study reported a correlation of about 0.81 with WAIS-IV ' +
    'Full Scale IQ in a university sample. A short online battery can carry real signal.</p>' +
    '<p>At the other end are tests that produce a number by a formula nobody publishes, frequently ' +
    'behind a payment, often with no norms at all.</p>' +
    '<p>Four questions separate them, and all four are answerable before you start:</p>' +
    '<ol>' +
      '<li>Is the <b>scoring method published</b>?</li>' +
      '<li>Is a <b>margin of error</b> reported with the score?</li>' +
      '<li>Is the <b>norm group described</b> - and if there is not one, does the site admit it?</li>' +
      '<li>Are you asked to <b>pay to see your result</b>?</li>' +
    '</ol>' +
    '<p>A "no" to the first three or a "yes" to the fourth is enough to disregard the number. The longer ' +
    'version of this checklist is in ' +
    '<a href="/guides/are-online-iq-tests-accurate/">are online IQ tests accurate</a>.</p>' +

    '<h2 id="compare">Side by side</h2>' +
    '<div class="table-wrap"><table>' +
      '<thead><tr><th></th><th>Clinical battery</th><th>Matrices</th><th>Group test</th><th>This test</th></tr></thead>' +
      '<tbody>' +
        '<tr><td>Time</td><td>60-120 min</td><td>20-45 min</td><td>30-90 min</td><td>~30 min</td></tr>' +
        '<tr><td>Supervised</td><td>Yes, one-to-one</td><td>Usually</td><td>Group setting</td><td>No</td></tr>' +
        '<tr><td>Abilities sampled</td><td>Four or more</td><td>One (fluid)</td><td>Varies</td><td>Four</td></tr>' +
        '<tr><td>Norms</td><td>Large, stratified, age-banded</td><td>Published</td><td>Population-specific</td><td><b>Provisional</b></td></tr>' +
        '<tr><td>Reports uncertainty</td><td>Yes</td><td>Yes</td><td>Usually</td><td>Yes</td></tr>' +
        '<tr><td>Diagnostic standing</td><td>Yes</td><td>Limited</td><td>No</td><td>None</td></tr>' +
        '<tr><td>Cost</td><td>Often substantial</td><td>Varies</td><td>Varies</td><td>Free</td></tr>' +
      '</tbody>' +
    '</table></div>' +
    '<p>The row that matters most is norms. Everything downstream of it - what the number means, whether ' +
    'it can be compared with anyone else’s - depends on the reference group, and it is the row where ' +
    'this test is weakest and says so.</p>' +

    '<h2 id="which">Which one do you need</h2>' +
    '<ul>' +
      '<li><b>A diagnosis, an accommodation, or anything with consequences</b> - an individually ' +
      'administered clinical battery, from a qualified psychologist. Nothing else will be accepted, and ' +
      'nothing else should be.</li>' +
      '<li><b>A cross-language or low-literacy assessment</b> - a non-verbal matrices test.</li>' +
      '<li><b>Research on a large sample</b> - a documented online instrument with published psychometrics.</li>' +
      '<li><b>Curiosity, and a sense of how you reason</b> - a free test like this one, read as an ' +
      'estimate with an interval rather than a verdict.</li>' +
    '</ul>' +
    '<p>This site is firmly in the last category, and the <a href="/methodology/">methodology page</a> ' +
    'sets out exactly what that supports: a real item response model, rule-generated items verified on ' +
    'every build, an honest confidence interval - and provisional norms rather than a standardisation ' +
    'sample.</p>',

  faq: [
    {
      q: 'What is the most accurate IQ test?',
      a: '<p>An individually administered clinical battery such as the WAIS, given by a qualified ' +
         'psychologist. Full-scale reliability is around 0.98, the norms come from a large stratified ' +
         'sample, and an administrator observes how you work rather than only what you answer.</p>'
    },
    {
      q: 'What is the difference between the WAIS and Raven\'s Matrices?',
      a: '<p>Breadth. The WAIS samples four broad domains and reports a Full Scale IQ with an index ' +
         'profile. Raven\'s measures fluid reasoning only, using no language at all - deeper on one ' +
         'ability, silent on the others.</p>'
    },
    {
      q: 'Can a free online test replace a professional assessment?',
      a: '<p>No. Unsupervised tests cannot verify identity or conditions, usually lack a proper ' +
         'standardisation sample, and carry no diagnostic standing. A well-built one is informative ' +
         'about how you reason; it is not evidence for any decision that matters.</p>'
    },
    {
      q: 'Why do different tests give me different scores?',
      a: '<p>Because they sample different abilities, use different norm groups collected in different ' +
         'years, and carry their own measurement error. A gap of several points between two properly ' +
         'built tests is entirely ordinary, which is why scores should be read as intervals.</p>'
    }
  ],

  related: [
    { href: '/guides/how-iq-tests-are-made/', title: 'How IQ tests are built',
      text: 'The pipeline from blueprint to norms, and which stage cheap tests skip.' },
    { href: '/guides/are-online-iq-tests-accurate/', title: 'Are online IQ tests accurate?',
      text: 'Reliability, validity and norming, with an eight-point checklist.' }
  ]
});
