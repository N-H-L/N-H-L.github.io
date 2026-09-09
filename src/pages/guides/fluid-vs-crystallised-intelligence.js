/* Guide: fluid vs crystallised intelligence. */
'use strict';

var guide = require('./_guide.js');
var P = require('../_parts.js');

var REFS = [
  { id: 'g4r1', text: 'Cattell, R. B. (1943). The measurement of adult intelligence. Psychological Bulletin, 40(3), 153-193.' },
  { id: 'g4r2', text: 'Cattell, R. B. (1963). Theory of fluid and crystallized intelligence: A critical experiment. Journal of Educational Psychology, 54(1), 1-22.' },
  { id: 'g4r3', text: 'Horn, J. L., & Cattell, R. B. (1966). Refinement and test of the theory of fluid and crystallized general intelligences. Journal of Educational Psychology, 57(5), 253-270.' },
  { id: 'g4r4', text: 'Carroll, J. B. (1993). Human Cognitive Abilities: A Survey of Factor-Analytic Studies. Cambridge University Press.' },
  { id: 'g4r5', text: 'Schneider, W. J., & McGrew, K. S. (2018). The Cattell-Horn-Carroll theory of cognitive abilities. In D. P. Flanagan & E. M. McDonough (Eds.), Contemporary Intellectual Assessment (4th ed., pp. 73-163). Guilford Press.' },
  { id: 'g4r6', text: 'Salthouse, T. A. (2009). When does age-related cognitive decline begin? Neurobiology of Aging, 30(4), 507-514.' },
  { id: 'g4r7', text: 'Pietschnig, J., & Voracek, M. (2015). One century of global IQ gains: A formal meta-analysis of the Flynn effect (1909-2013). Perspectives on Psychological Science, 10(3), 282-306.', url: 'https://doi.org/10.1177/1745691615577701', linkText: 'doi:10.1177/1745691615577701' },
  { id: 'g4r8', text: 'Melby-Lervåg, M., Redick, T. S., & Hulme, C. (2016). Working memory training does not improve performance on measures of intelligence or other measures of "far transfer". Perspectives on Psychological Science, 11(4), 512-534.' }
];

module.exports = guide({
  slug: 'fluid-vs-crystallised-intelligence',
  crumb: 'Fluid vs crystallised',
  h1: 'Fluid vs crystallised intelligence',
  title: 'Fluid vs Crystallised Intelligence Explained | CogniScale',
  description: 'Cattell split intelligence into fluid reasoning and crystallised knowledge in 1963. What each is, how they are measured, and why they age differently.',
  lede: 'One is the ability to work out something you have never seen before. The other is everything you already know. They are correlated, measured differently, and they age in opposite directions.',
  updated: '2026-09-06',
  published: '2026-09-06',
  toc: [
    { id: 'distinction', label: 'The distinction Cattell drew' },
    { id: 'definitions', label: 'What each one actually is' },
    { id: 'measure', label: 'How each is measured' },
    { id: 'lifespan', label: 'Why they diverge across a lifetime' },
    { id: 'chc', label: 'How the model grew into CHC' },
    { id: 'training', label: 'Can fluid intelligence be trained?' },
    { id: 'your-score', label: 'What this means for your result' }
  ],
  refs: REFS,

  bodyTop:
    '<h2 id="distinction">The distinction Cattell drew</h2>' +
    '<p>By the 1940s it was well established that scores on almost any pair of cognitive tests correlate ' +
    'positively - the "positive manifold" that motivates a general factor. Raymond Cattell\'s contribution ' +
    'was to argue that this single factor was hiding two rather different things.' + P.ref(1, 'g4r1') + '</p>' +
    '<p>He formalised it in 1963 in a paper pointedly titled a "critical experiment": general ability ' +
    'splits into <b>fluid intelligence (Gf)</b>, the capacity to reason about novel material, and ' +
    '<b>crystallised intelligence (Gc)</b>, the body of knowledge and skill a person has accumulated and ' +
    'can bring to bear.' + P.ref(2, 'g4r2') + ' John Horn extended the framework through the 1960s, and ' +
    'the pair became the foundation of what is now the standard model of cognitive ' +
    'abilities.' + P.ref(3, 'g4r3') + '</p>' +
    '<p>The reason the distinction stuck is that the two behave differently in ways a single factor ' +
    'cannot explain. They load on different tasks, they respond differently to education, they follow ' +
    'different trajectories across a lifetime, and they have risen at different rates over the past ' +
    'century.</p>' +

    '<h2 id="definitions">What each one actually is</h2>' +
    '<div class="grid grid-2" style="margin:1.6em 0">' +
      '<div class="card">' +
        '<span class="domain-tag">Gf</span>' +
        '<h3 style="margin-top:0">Fluid reasoning</h3>' +
        '<p class="small">Solving problems that cannot be answered from stored knowledge. Spotting a rule ' +
        'in an unfamiliar pattern, drawing an inference, holding several constraints in mind at once.</p>' +
        '<p class="small muted" style="margin:0"><b>Peaks</b> in the twenties, declines gradually after. ' +
        '<b>Less</b> dependent on schooling and culture. <b>More</b> dependent on working memory.</p>' +
      '</div>' +
      '<div class="card">' +
        '<span class="domain-tag">Gc</span>' +
        '<h3 style="margin-top:0">Crystallised knowledge</h3>' +
        '<p class="small">The breadth and depth of what you know, and how well you can reason with it. ' +
        'Vocabulary, general information, verbal comprehension, accumulated expertise.</p>' +
        '<p class="small muted" style="margin:0"><b>Rises</b> through most of adult life. <b>Strongly</b> ' +
        'shaped by education, reading and cultural exposure. <b>The product</b> of fluid ability applied ' +
        'over years.</p>' +
      '</div>' +
    '</div>' +
    '<p>Cattell\'s "investment" idea connects them: crystallised ability is what you get when fluid ' +
    'ability is invested in learning over time. Someone with strong fluid reasoning who reads widely for ' +
    'twenty years accumulates a great deal of crystallised knowledge. That is why the two correlate ' +
    'substantially in any adult sample, typically around .5 to .7, while remaining distinguishable.</p>',

  bodyBottom:
    '<h2 id="measure">How each is measured</h2>' +
    '<div class="table-wrap"><table>' +
      '<thead><tr><th>Task type</th><th>Primarily loads on</th><th>Why</th></tr></thead>' +
      '<tbody>' +
        '<tr><td>Figural matrices</td><td>Gf</td><td>The rules are in the figure; no prior knowledge helps</td></tr>' +
        '<tr><td>Number and letter series</td><td>Gf</td><td>The generating rule must be induced on the spot</td></tr>' +
        '<tr><td>Vocabulary</td><td>Gc</td><td>Depends entirely on what has been learned</td></tr>' +
        '<tr><td>General information</td><td>Gc</td><td>Retrieval of stored facts</td></tr>' +
        '<tr><td>Verbal analogies</td><td>Both</td><td>Needs the words <em>and</em> the relational inference</td></tr>' +
        '<tr><td>Mental rotation</td><td>Gv, with Gf</td><td>Visual transformation, largely knowledge-free</td></tr>' +
      '</tbody>' +
    '</table></div>' +
    '<p>Note the third row from the bottom. Verbal analogies sit across the boundary, which is why they ' +
    'are useful (high g-loading) and awkward (they penalise a test taker whose vocabulary reflects a ' +
    'different language background rather than weaker reasoning). Any test using them has to keep the ' +
    'vocabulary deliberately common, which is the approach ' +
    '<a href="/methodology/#construction">taken here</a>.</p>' +

    '<h2 id="lifespan">Why they diverge across a lifetime</h2>' +
    '<p>This is the most striking evidence for the distinction. Cross-sectional and longitudinal studies ' +
    'converge on the same picture: fluid reasoning peaks somewhere in the twenties and declines slowly ' +
    'thereafter, while crystallised knowledge continues rising into the sixties or ' +
    'beyond.' + P.ref(6, 'g4r6') + '</p>' +
    '<p>A 60-year-old typically solves novel matrix problems more slowly and less accurately than they ' +
    'did at 25, and has a substantially larger vocabulary and far more domain knowledge. Two abilities ' +
    'moving in opposite directions inside one person is difficult to reconcile with a single undivided ' +
    'general ability.</p>' +
    '<div class="note">' +
      '<p style="margin:0"><b>This is why properly built IQ tests are age-normed.</b> You are compared ' +
      'with people your own age, not against a 25-year-old\'s fluid reasoning. It is also why a test ' +
      'weighted towards fluid items - like <a href="/test/">the one on this site</a> - will tend to score ' +
      'older takers slightly harshly if it is <em>not</em> age-normed. That limitation is stated ' +
      '<a href="/methodology/#limitations">on the methodology page</a>.</p>' +
    '</div>' +
    '<p>The century-scale evidence points the same way. In the largest meta-analysis of the Flynn effect, ' +
    'gains ran at about 0.41 IQ points per year for fluid measures against 0.21 for ' +
    'crystallised.' + P.ref(7, 'g4r7') + ' Whatever changed over the twentieth century affected abstract ' +
    'reasoning roughly twice as much as accumulated knowledge.</p>' +

    '<h2 id="chc">How the model grew into CHC</h2>' +
    '<p>Horn kept finding factors that fitted neither category cleanly and added them: visual processing, ' +
    'short-term memory, long-term retrieval, processing speed, auditory processing. Separately, John ' +
    'Carroll re-analysed more than 460 datasets spanning decades of factor-analytic research and produced ' +
    'a three-stratum model: <em>g</em> at the top, broad abilities in the middle, narrow abilities at the ' +
    'bottom.' + P.ref(4, 'g4r4') + '</p>' +
    '<p>The two frameworks were close enough to merge, and the result - Cattell-Horn-Carroll theory - is ' +
    'now the organising framework for essentially every major cognitive battery in ' +
    'use.' + P.ref(5, 'g4r5') + ' Gf and Gc remain two of its broad abilities; they are simply no longer ' +
    'the only two.</p>' +

    '<h2 id="training">Can fluid intelligence be trained?</h2>' +
    '<p>This is the most commercially attractive question in the field, and the evidence is discouraging.</p>' +
    '<p>Working-memory training programmes reliably improve performance on the trained task, and on tasks ' +
    'closely resembling it. The question is whether that transfers to general fluid reasoning. The ' +
    'best-powered meta-analysis of this literature concluded that it does not: near transfer is real, far ' +
    'transfer to measures of intelligence is not supported.' + P.ref(8, 'g4r8') + '</p>' +
    '<p>Practice on a specific test format does raise scores <em>on that format</em>. That is a practice ' +
    'effect, and it is the reason retaking the same test inflates your result without indicating any ' +
    'change in underlying ability. Crystallised knowledge, by contrast, is straightforwardly improvable - ' +
    'by reading, studying and doing things. That is what it is.</p>' +

    '<h2 id="your-score">What this means for your result</h2>' +
    '<p><a href="/test/">The test on this site</a> is deliberately weighted towards fluid reasoning: the ' +
    'figural matrices, the number and letter series and the spatial rotation items are all primarily Gf ' +
    'and Gv measures, with the verbal items straddling Gf and Gc.</p>' +
    '<p>So when you look at your domain profile, the shape carries a real interpretation. A strong verbal ' +
    'score with weaker figural and spatial scores suggests knowledge-based reasoning outrunning abstract ' +
    'pattern induction - a common profile in people who read a great deal. The reverse pattern is common ' +
    'in younger takers and in people whose first language is not the test\'s.</p>' +
    '<p>Both are ordinary. Neither is better. And each domain rests on six to ten items, so read the ' +
    'shape rather than the individual numbers.</p>',

  faq: [
    {
      q: 'What is the difference between fluid and crystallised intelligence?',
      a: '<p>Fluid intelligence is the ability to reason about genuinely novel problems - spotting a ' +
         'pattern you have never seen, drawing an inference without prior knowledge. Crystallised ' +
         'intelligence is accumulated knowledge and skill, such as vocabulary and general information. ' +
         'Cattell distinguished them in 1963 and the split has held up across sixty years of research.</p>'
    },
    {
      q: 'Which one do IQ tests measure?',
      a: '<p>Full batteries such as the WAIS measure both, along with working memory and processing speed. ' +
         'Short online tests are usually weighted towards fluid reasoning, because matrix and series items ' +
         'are quick to administer and less dependent on language and schooling.</p>'
    },
    {
      q: 'Does fluid intelligence decline with age?',
      a: '<p>Yes, gradually, from a peak in the twenties. Crystallised knowledge moves the other way, ' +
         'rising through most of adult life. Age-normed tests compare you with people your own age, which ' +
         'is why a properly normed score does not fall simply because you got older.</p>'
    },
    {
      q: 'Can you increase your fluid intelligence?',
      a: '<p>The evidence for lasting gains is weak. Brain-training and working-memory programmes reliably ' +
         'improve the trained task but the best meta-analysis finds no convincing transfer to general ' +
         'reasoning. Practice on a specific test format does raise scores on that format, which is a ' +
         'practice effect rather than a change in ability.</p>'
    }
  ],

  related: [
    { href: '/methodology/', title: 'How this test is built', text: 'Which abilities the four question types sample, and why.' },
    { href: '/guides/average-iq/', title: 'What is an average IQ?', text: 'Norming, renorming, and the Flynn effect.' },
    { href: '/guides/iq-test-practice-questions/', title: 'Practice questions', text: 'Worked examples of each item type.' },
    { href: '/guides/iq-score-ranges/', title: 'IQ score ranges', text: 'What each score means in percentile terms.' }
  ]
});
