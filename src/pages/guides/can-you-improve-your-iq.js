/* Guide: can you improve your IQ. */
'use strict';

var guide = require('./_guide.js');
var P = require('../_parts.js');

var REFS = [
  { id: 'g6r1', text: 'Jaeggi, S. M., Buschkuehl, M., Jonides, J., & Perrig, W. J. (2008). Improving fluid intelligence with training on working memory. PNAS, 105(19), 6829-6833.', url: 'https://doi.org/10.1073/pnas.0801268105', linkText: 'doi:10.1073/pnas.0801268105' },
  { id: 'g6r2', text: 'Melby-Lervag, M., Redick, T. S., & Hulme, C. (2016). Working memory training does not improve performance on measures of intelligence or other measures of far transfer. Perspectives on Psychological Science, 11(4), 512-534.', url: 'https://doi.org/10.1177/1745691616635612', linkText: 'doi:10.1177/1745691616635612' },
  { id: 'g6r3', text: 'Simons, D. J., Boot, W. R., Charness, N., Gathercole, S. E., Chabris, C. F., Hambrick, D. Z., & Stine-Morrow, E. A. L. (2016). Do brain-training programs work? Psychological Science in the Public Interest, 17(3), 103-186.', url: 'https://doi.org/10.1177/1529100616661983', linkText: 'doi:10.1177/1529100616661983' },
  { id: 'g6r4', text: 'Ritchie, S. J., & Tucker-Drob, E. M. (2018). How much does education improve intelligence? A meta-analysis. Psychological Science, 29(8), 1358-1369.', url: 'https://doi.org/10.1177/0956797618774253', linkText: 'doi:10.1177/0956797618774253' },
  { id: 'g6r5', text: 'Protzko, J. (2015). The environment in raising early intelligence: A meta-analysis of the fadeout effect. Intelligence, 53, 202-210.', url: 'https://doi.org/10.1016/j.intell.2015.10.006', linkText: 'doi:10.1016/j.intell.2015.10.006' },
  { id: 'g6r6', text: 'Au, J., Sheehan, E., Tsai, N., Duncan, G. J., Buschkuehl, M., & Jaeggi, S. M. (2015). Improving fluid intelligence with training on working memory: A meta-analysis. Psychonomic Bulletin & Review, 22(2), 366-377.', url: 'https://doi.org/10.3758/s13423-014-0699-x', linkText: 'doi:10.3758/s13423-014-0699-x' },
  { id: 'g6r7', text: 'Hayes, T. R., Petrov, A. A., & Sederberg, P. B. (2015). Do we really become smarter when our fluid-intelligence test scores improve? Intelligence, 48, 1-14.', url: 'https://doi.org/10.1016/j.intell.2014.10.005', linkText: 'doi:10.1016/j.intell.2014.10.005' },
  { id: 'g6r8', text: 'Pietschnig, J., & Voracek, M. (2015). One century of global IQ gains: A formal meta-analysis of the Flynn effect (1909-2013). Perspectives on Psychological Science, 10(3), 282-306.', url: 'https://doi.org/10.1177/1745691615577701', linkText: 'doi:10.1177/1745691615577701' },
  { id: 'g6r9', text: 'Duckworth, A. L., Quinn, P. D., Lynam, D. R., Loeber, R., & Stouthamer-Loeber, M. (2011). Role of test motivation in intelligence testing. PNAS, 108(19), 7716-7720.', url: 'https://doi.org/10.1073/pnas.1018601108', linkText: 'doi:10.1073/pnas.1018601108' }
];

module.exports = guide({
  slug: 'can-you-improve-your-iq',
  crumb: 'Can you improve your IQ?',
  h1: 'Can you improve your IQ?',
  title: 'Can You Improve Your IQ? The Evidence | CogniScale',
  description: 'Brain training barely transfers. Education reliably adds points. The honest evidence on whether IQ can be raised, and what the number is actually tracking.',
  lede: 'You can almost certainly raise your <em>score</em>. Whether you can raise the <em>ability</em> the score is trying to measure is a much harder question, and the honest answer separates the two.',
  updated: '2026-09-09',
  published: '2026-09-09',
  toc: [
    { id: 'two-questions', label: 'Two questions hiding inside one' },
    { id: 'brain-training', label: 'Brain training: the rise and fall' },
    { id: 'education', label: 'Education: the one thing that works' },
    { id: 'fadeout', label: 'Why early gains fade' },
    { id: 'flynn', label: 'The population-level clue' },
    { id: 'what-to-do', label: 'What actually helps' }
  ],
  refs: REFS,

  bodyTop:
    '<h2 id="two-questions">Two questions hiding inside one</h2>' +
    '<p>"Can I improve my IQ?" is really two questions, and most of the confusion in this area comes ' +
    'from answering the easy one while appearing to answer the hard one.</p>' +
    '<p><b>Can you raise your score on an IQ test?</b> Yes, straightforwardly. Sit the same test twice ' +
    'and you will do better the second time. Learn what a matrix item is asking before you meet one and ' +
    'you will solve more of them. Sleep properly, and try harder. Test motivation alone is worth real ' +
    'points: a meta-analysis of studies offering material incentives found score increases averaging ' +
    'around 0.64 standard deviations, and the effect was largest among people scoring lowest.' +
    P.ref(9, 'g6r9') + ' That is not a small technicality. It means a chunk of what a test measures on ' +
    'any given day is how much the person cared.</p>' +
    '<p><b>Can you raise the underlying ability?</b> Much less clearly, much less far, and by far fewer ' +
    'routes than the brain-training industry implies.</p>' +
    '<div class="note">' +
      '<p style="margin:0">The distinction matters because a score is evidence <i>about</i> an ability, ' +
      'not the ability itself. Getting better at the evidence-gathering procedure - through practice, ' +
      'familiarity or effort - moves the number without necessarily moving the thing. This is exactly ' +
      'why retaking this test will inflate your result, and why we say so on the results page.</p>' +
    '</div>' +

    '<h2 id="brain-training">Brain training: the rise and fall</h2>' +
    '<p>In 2008 a study reported something startling: training on a demanding working-memory task called ' +
    'dual n-back improved fluid intelligence, and improved it more the longer people trained.' +
    P.ref(1, 'g6r1') + ' A dose-response relationship is powerful evidence in principle, and the finding ' +
    'launched an industry.</p>' +
    '<p>Then people tried to replicate it.</p>' +
    '<p>The clearest verdict comes from a meta-analysis of 87 studies of working-memory training. Trained ' +
    'tasks improved, and closely related tasks improved somewhat. But on measures of nonverbal ability, ' +
    'verbal ability, word decoding, arithmetic and attention - the outcomes anyone would actually care ' +
    'about - the effects were close to zero once the comparison group was properly active.' +
    P.ref(2, 'g6r2') + '</p>' +
    '<p>That last clause is the crux. If your control group does nothing while your training group does ' +
    'something engaging, any difference could be expectation, motivation or simple familiarity with being ' +
    'tested. A different meta-analysis, by researchers sympathetic to the original finding, did report a ' +
    'small positive effect on fluid reasoning - but the effect shrank as control groups got better.' +
    P.ref(6, 'g6r6') + ' When the size of your result depends that heavily on how the comparison was ' +
    'run, the honest reading is that the underlying effect is small or absent.</p>' +
    '<p>There is a deeper problem too. Analyses of what training actually changes suggest improvement is ' +
    'concentrated in task-specific strategy rather than in general capacity - people learn the task, not ' +
    'the ability.' + P.ref(7, 'g6r7') + '</p>' +
    '<p>The most thorough review of the field, a 150-page assessment commissioned as a public-interest ' +
    'report, concluded that the evidence for commercial brain-training improving everyday cognitive ' +
    'performance is weak, and that advertising in the sector routinely outruns the science.' +
    P.ref(3, 'g6r3') + '</p>',

  bodyBottom:
    '<h2 id="education">Education: the one thing that works</h2>' +
    '<p>Set brain training aside and the picture changes completely.</p>' +
    '<p>A meta-analysis pooling 142 effect sizes from over 600,000 participants used three research ' +
    'designs that each get around the obvious confound - that brighter people stay in school longer. ' +
    'Studies exploiting changes in compulsory-schooling laws, studies controlling for baseline ability, ' +
    'and studies comparing people of the same age in different school years all converged on the same ' +
    'conclusion: <b>an additional year of education is worth roughly one to five IQ points</b>, and the ' +
    'gains appeared durable across the lifespan.' + P.ref(4, 'g6r4') + '</p>' +
    '<p>Three things are worth drawing out of that.</p>' +
    '<ul>' +
      '<li>The effect is <b>causal</b>, not merely correlational. Compulsory-schooling reforms are ' +
      'natural experiments: they change how long people stay in school for reasons unrelated to how ' +
      'clever they are.</li>' +
      '<li>The effect is <b>modest per year but cumulative</b>. Several extra years of education can ' +
      'move a score meaningfully.</li>' +
      '<li>The effect showed up on a broad range of measures, not only on the school-like ones you might ' +
      'expect education to drill.</li>' +
    '</ul>' +
    '<p>This is the strongest, best-identified evidence in the whole field for raising measured ' +
    'intelligence. It is also the least marketable, which may be why it gets less attention than n-back ' +
    'apps.</p>' +

    '<h2 id="fadeout">Why early gains fade</h2>' +
    '<p>Early-childhood interventions frequently produce impressive short-term IQ gains that shrink after ' +
    'the programme ends. A meta-analysis of this fadeout pattern found the gains dissipate over a few ' +
    'years unless the environmental change that produced them persists.' + P.ref(5, 'g6r5') + '</p>' +
    '<p>The natural reading is not that the gains were fake. It is that measured ability tracks the ' +
    'environment you are currently in more than it records a permanent upgrade. Remove the enriched ' +
    'environment and the score drifts back. Education works partly because it is not a six-week ' +
    'intervention - it is years of sustained cognitive demand.</p>' +

    '<h2 id="flynn">The population-level clue</h2>' +
    '<p>There is one enormous piece of evidence that measured intelligence is movable: across the ' +
    'twentieth century it moved, everywhere, by a lot.</p>' +
    '<p>Pooling 271 samples covering nearly four million people across 31 countries, raw performance rose ' +
    'at roughly <b>0.28 IQ points per year</b> - around three points a decade - with fluid reasoning ' +
    'gaining faster than crystallised knowledge.' + P.ref(8, 'g6r8') + ' Genetics cannot move that fast. ' +
    'Something environmental did it: nutrition, health, schooling, smaller families, and a world that ' +
    'increasingly demands abstract, rule-based thinking of the sort IQ tests happen to sample.</p>' +
    '<p>So the ceiling on environmental influence is clearly not zero. But note what produced those ' +
    'gains: decades of broad social change, not an app.</p>' +

    '<h2 id="what-to-do">What actually helps</h2>' +
    '<p>Ranked honestly by evidence quality:</p>' +
    '<div class="table-wrap"><table>' +
      '<thead><tr><th>Intervention</th><th>Evidence</th><th>Realistic effect</th></tr></thead>' +
      '<tbody>' +
        '<tr><td>Staying in education longer</td><td>Strong, causal, replicated</td><td>~1-5 points per year</td></tr>' +
        '<tr><td>Removing deprivation (nutrition, health, lead exposure)</td><td>Strong where deprivation exists</td><td>Large for those affected; nil for those already unaffected</td></tr>' +
        '<tr><td>Sleep, effort, not being ill on the day</td><td>Strong for scores</td><td>Moves the score, not the ability</td></tr>' +
        '<tr><td>Familiarity with the test format</td><td>Strong for scores</td><td>Moves the score, not the ability</td></tr>' +
        '<tr><td>Commercial brain training</td><td>Weak; fails to transfer</td><td>Near zero beyond the trained task</td></tr>' +
      '</tbody>' +
    '</table></div>' +
    '<p>The uncomfortable summary: the interventions that reliably raise measured intelligence are the ' +
    'slow structural ones, and the ones marketed as shortcuts mostly teach you the shortcut.</p>' +
    '<p>That said, "your IQ is roughly fixed" is not the discouraging conclusion it sounds like. IQ ' +
    'predicts outcomes at the level of populations far better than it predicts any individual life, and ' +
    'the things that are trainable - specific knowledge, skills, judgement, persistence - are exactly the ' +
    'things that determine what you do with whatever you have. See ' +
    '<a href="/guides/what-iq-predicts/">what IQ actually predicts</a> for how loose those links really are.</p>',

  faq: [
    {
      q: 'Does dual n-back training raise IQ?',
      a: '<p>The original 2008 study reported that it did, with a dose-response relationship. Subsequent ' +
         'replication attempts have largely failed. A meta-analysis of 87 working-memory training studies ' +
         'found effects close to zero on measures of intelligence once active control groups were used. ' +
         'You get better at n-back; that improvement does not appear to spread.</p>'
    },
    {
      q: 'Will practising IQ tests raise my score?',
      a: '<p>Yes, and that is precisely the problem. Practice and familiarity inflate the score without ' +
         'changing the ability the score is meant to estimate. It is why a retake of the same test is ' +
         'not a valid second measurement, and why we tell you so on the results page rather than ' +
         'encouraging you to try again for a better number.</p>'
    },
    {
      q: 'Does education really cause higher IQ, or do brighter people just stay in school?',
      a: '<p>Both are true, but the causal arrow has been isolated. Studies exploiting changes in ' +
         'compulsory-schooling laws create situations where people stay in school longer for reasons ' +
         'unrelated to their ability. Those studies still find gains of roughly one to five IQ points ' +
         'per additional year, which is strong evidence that education itself does some of the work.</p>'
    },
    {
      q: 'If the Flynn effect raised scores three points a decade, why can I not train my way up?',
      a: '<p>Because the Flynn effect was produced by decades of broad change in nutrition, health, ' +
         'schooling and the cognitive demands of daily life - not by a cognitive exercise. It shows the ' +
         'environmental ceiling is not zero. It does not show that any particular short intervention ' +
         'reaches it.</p>'
    }
  ],

  related: [
    { href: '/guides/fluid-vs-crystallised-intelligence/', title: 'Fluid vs crystallised intelligence',
      text: 'Which kind of ability training is supposed to target, and why the distinction matters here.' },
    { href: '/guides/what-iq-predicts/', title: 'What IQ actually predicts',
      text: 'How much the number really constrains school, work and life outcomes.' }
  ],

  ctaHeading: 'Get a baseline first',
  ctaSub: 'Thirty questions, a score with the uncertainty attached, and an explanation of everything you missed.'
});
