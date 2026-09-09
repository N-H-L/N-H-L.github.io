/* Guide: working memory and intelligence. */
'use strict';

var guide = require('./_guide.js');
var P = require('../_parts.js');

var REFS = [
  { id: 'g12r1', text: 'Kyllonen, P. C., & Christal, R. E. (1990). Reasoning ability is (little more than) working-memory capacity?! Intelligence, 14(4), 389-433.' },
  { id: 'g12r2', text: 'Conway, A. R. A., Kane, M. J., & Engle, R. W. (2003). Working memory capacity and its relation to general intelligence. Trends in Cognitive Sciences, 7(12), 547-552.', url: 'https://doi.org/10.1016/j.tics.2003.10.005', linkText: 'doi:10.1016/j.tics.2003.10.005' },
  { id: 'g12r3', text: 'Engle, R. W. (2002). Working memory capacity as executive attention. Current Directions in Psychological Science, 11(1), 19-23.' },
  { id: 'g12r4', text: 'Ackerman, P. L., Beier, M. E., & Boyle, M. O. (2005). Working memory and intelligence: The same or different constructs? Psychological Bulletin, 131(1), 30-60.', url: 'https://doi.org/10.1037/0033-2909.131.1.30', linkText: 'doi:10.1037/0033-2909.131.1.30' },
  { id: 'g12r5', text: 'Baddeley, A. (2000). The episodic buffer: A new component of working memory? Trends in Cognitive Sciences, 4(11), 417-423.' },
  { id: 'g12r6', text: 'Carpenter, P. A., Just, M. A., & Shell, P. (1990). What one intelligence test measures: A theoretical account of the processing in the Raven Progressive Matrices Test. Psychological Review, 97(3), 404-431.' },
  { id: 'g12r7', text: 'Melby-Lervag, M., Redick, T. S., & Hulme, C. (2016). Working memory training does not improve performance on measures of intelligence or other measures of far transfer. Perspectives on Psychological Science, 11(4), 512-534.', url: 'https://doi.org/10.1177/1745691616635612', linkText: 'doi:10.1177/1745691616635612' },
  { id: 'g12r8', text: 'Carroll, J. B. (1993). Human Cognitive Abilities: A Survey of Factor-Analytic Studies. Cambridge University Press.' }
];

module.exports = guide({
  slug: 'working-memory-and-intelligence',
  crumb: 'Working memory and intelligence',
  h1: 'Working memory and intelligence',
  title: 'Working Memory and Intelligence | CogniScale',
  description: 'Working memory capacity is one of the strongest correlates of reasoning ability - but they are not the same thing, and training one does not raise the other.',
  lede: 'One 1990 paper asked whether reasoning ability is "little more than" working-memory capacity. The question has not gone away, and the answer explains a lot about why matrix items feel the way they do.',
  updated: '2026-09-09',
  published: '2026-09-09',
  toc: [
    { id: 'what-it-is', label: 'What working memory is' },
    { id: 'the-claim', label: 'The strong claim' },
    { id: 'how-close', label: 'How close are they really' },
    { id: 'matrices', label: 'Why matrix items load on it' },
    { id: 'training', label: 'Why training it does not help' }
  ],
  refs: REFS,

  bodyTop:
    '<h2 id="what-it-is">What working memory is</h2>' +
    '<p>Working memory is not "short-term memory" in the everyday sense. It is not a bucket that holds ' +
    'seven items. It is the capacity to <b>hold information available while doing something to it</b>, ' +
    'in the face of distraction.' + P.ref(5, 'g12r5') + '</p>' +
    '<p>The distinction shows up in how it is measured. A simple span task asks you to repeat a list of ' +
    'digits - that is storage. A <i>complex</i> span task interleaves the storage with an unrelated ' +
    'processing demand: read a sentence, judge whether it makes sense, remember a letter, read another ' +
    'sentence, and so on, then recall the letters in order.</p>' +
    '<p>Complex span correlates far better with reasoning than simple span does. The processing ' +
    'requirement is what makes the difference, which is the first clue that the relevant construct is ' +
    'not storage but something closer to <b>controlled attention</b> - the ability to keep goal-relevant ' +
    'information active while resisting interference.' + P.ref(3, 'g12r3') + '</p>' +

    '<h2 id="the-claim">The strong claim</h2>' +
    '<p>In 1990 a study of several hundred participants used structural equation modelling to compare ' +
    'latent factors for reasoning ability and working-memory capacity. The correlation between them was ' +
    'so high that the authors titled the paper with a provocation: reasoning ability is ' +
    '<i>(little more than)</i> working-memory capacity?!' + P.ref(1, 'g12r1') + '</p>' +
    '<p>That finding reframed a lot of research. If the two are nearly the same at the latent level, then ' +
    'reasoning tests might be measuring a fairly basic capacity constraint rather than anything ' +
    'mysterious - and the door opens to a mechanistic account of individual differences in intelligence.</p>' +
    '<div class="note">' +
      '<p style="margin:0">Note the phrase "at the latent level". Latent-variable models strip out ' +
      'measurement error, so correlations between latent factors run substantially higher than ' +
      'correlations between the raw test scores you would actually observe. Two constructs can be ' +
      'near-identical as latent variables while any two individual tests of them correlate far more ' +
      'modestly.</p>' +
    '</div>',

  bodyBottom:
    '<h2 id="how-close">How close are they really</h2>' +
    '<p>The strong claim did not survive intact. A meta-analysis pooling 86 samples found the average ' +
    'correlation between working-memory measures and reasoning was around <b>0.5</b> - substantial, ' +
    'clearly one of the strongest relationships in differential psychology, but well short of ' +
    'identity.' + P.ref(4, 'g12r4') + '</p>' +
    '<p>At r = 0.5, roughly a quarter of the variance is shared and three quarters is not. The current ' +
    'consensus position is that working-memory capacity is a strong <i>correlate</i> and plausible ' +
    'partial <i>cause</i> of reasoning ability, but that the two are separable constructs.' +
    P.ref(2, 'g12r2') + '</p>' +
    '<p>This is also how the hierarchical model of abilities treats them. In the Cattell-Horn-Carroll ' +
    'framework, short-term and working memory is its own broad ability sitting alongside fluid ' +
    'reasoning, both loading on general ability but neither reducible to the other.' + P.ref(8, 'g12r8') + '</p>' +

    '<h2 id="matrices">Why matrix items load on it</h2>' +
    '<p>If you have ever felt a matrix item slip away from you - you had the pattern, then lost it while ' +
    'checking the options - you have felt the working-memory component directly.</p>' +
    '<p>The computational analysis of matrix solving found that difficulty was driven mainly by the ' +
    '<b>number of rules operating simultaneously</b>, and that the bottleneck was the need to hold ' +
    'partial conclusions in mind while deriving further ones.' + P.ref(6, 'g12r6') + '</p>' +
    '<p>That is a working-memory demand almost by definition. It also explains a pattern in this test:</p>' +
    '<ul>' +
      '<li>A one-rule matrix is easy for nearly everyone. The rule is visible and there is nothing to ' +
      'hold.</li>' +
      '<li>A three-rule matrix is hard, not because any single rule is subtle, but because you must keep ' +
      'two conclusions alive while working out the third.</li>' +
      '<li>People who fail hard matrix items often report finding <i>a</i> rule and stopping - which is ' +
      'what happens when capacity runs out before the search does.</li>' +
    '</ul>' +
    '<p>Number and letter series work the same way: holding a candidate rule while testing it against ' +
    'later terms is a storage-plus-processing demand. This is part of why the two domains correlate as ' +
    'strongly as they do.</p>' +

    '<h2 id="training">Why training it does not help</h2>' +
    '<p>The tight link between working memory and reasoning produced an obvious hypothesis: train ' +
    'working memory, raise reasoning. It is the intellectual foundation of the entire brain-training ' +
    'industry.</p>' +
    '<p>It has not worked. A meta-analysis of 87 studies found that working-memory training reliably ' +
    'improves the trained task, produces some near transfer to very similar tasks, and yields effects ' +
    'close to zero on reasoning, verbal ability, arithmetic and attention once active control groups are ' +
    'used.' + P.ref(7, 'g12r7') + '</p>' +
    '<p>Why the correlation exists but the intervention fails is genuinely instructive. A correlation ' +
    'between capacity and reasoning is consistent with several stories:</p>' +
    '<ul>' +
      '<li>capacity constrains reasoning (training should work);</li>' +
      '<li>both depend on a third factor such as neural efficiency (training the task changes neither);</li>' +
      '<li>the span task and the reasoning task both simply require sustained controlled attention, so ' +
      'they correlate without either causing the other.</li>' +
    '</ul>' +
    '<p>The training failures are evidence against the first story. What improves with practice appears ' +
    'to be task-specific strategy rather than general capacity - you get better at n-back, and n-back ' +
    'is not reasoning. The full evidence is in ' +
    '<a href="/guides/can-you-improve-your-iq/">can you improve your IQ</a>.</p>',

  faq: [
    {
      q: 'Is working memory the same as IQ?',
      a: '<p>No. The measured correlation averages about 0.5 across studies - one of the strongest ' +
         'relationships in the field, but that still leaves three quarters of the variance unshared. ' +
         'They are treated as separate broad abilities in the standard hierarchical model.</p>'
    },
    {
      q: 'Is working memory the same as short-term memory?',
      a: '<p>No. Short-term memory is storage - repeating back a list of digits. Working memory is ' +
         'holding information available while actively doing something with it, under interference. ' +
         'Complex span tasks that combine storage with processing correlate with reasoning much better ' +
         'than simple span tasks do.</p>'
    },
    {
      q: 'Does a big working memory make matrix puzzles easier?',
      a: '<p>It helps considerably on hard ones. Difficulty in matrix items is driven mainly by how many ' +
         'rules run at once, and the bottleneck is holding partial conclusions in mind while deriving ' +
         'further ones. On one-rule items it matters very little.</p>'
    },
    {
      q: 'If they are so closely related, why does working-memory training not raise IQ?',
      a: '<p>Because a correlation does not identify the causal direction or rule out a common third ' +
         'cause. The training evidence suggests what improves is task-specific strategy rather than ' +
         'general capacity - people get better at the trained task and the gain does not spread.</p>'
    }
  ],

  related: [
    { href: '/guides/ravens-progressive-matrices/', title: "How Raven's Progressive Matrices work",
      text: 'What makes a matrix item hard, and why the answer is mostly about holding rules in mind.' },
    { href: '/guides/can-you-improve-your-iq/', title: 'Can you improve your IQ?',
      text: 'The training research in full, and the one intervention that reliably works.' }
  ]
});
