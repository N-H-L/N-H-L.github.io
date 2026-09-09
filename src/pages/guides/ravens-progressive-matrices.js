/* Guide: Raven's Progressive Matrices. */
'use strict';

var guide = require('./_guide.js');
var P = require('../_parts.js');

var REFS = [
  { id: 'g9r1', text: 'Raven, J. (2000). The Raven Progressive Matrices: Change and stability over culture and time. Cognitive Psychology, 41(1), 1-48.', url: 'https://doi.org/10.1006/cogp.1999.0735', linkText: 'doi:10.1006/cogp.1999.0735' },
  { id: 'g9r2', text: 'Carpenter, P. A., Just, M. A., & Shell, P. (1990). What one intelligence test measures: A theoretical account of the processing in the Raven Progressive Matrices Test. Psychological Review, 97(3), 404-431.' },
  { id: 'g9r3', text: 'Spearman, C. (1904). General intelligence, objectively determined and measured. American Journal of Psychology, 15(2), 201-292.' },
  { id: 'g9r4', text: 'Cattell, R. B. (1963). Theory of fluid and crystallized intelligence: A critical experiment. Journal of Educational Psychology, 54(1), 1-22.' },
  { id: 'g9r5', text: 'Pietschnig, J., & Voracek, M. (2015). One century of global IQ gains: A formal meta-analysis of the Flynn effect (1909-2013). Perspectives on Psychological Science, 10(3), 282-306.', url: 'https://doi.org/10.1177/1745691615577701', linkText: 'doi:10.1177/1745691615577701' },
  { id: 'g9r6', text: 'Condon, D. M., & Revelle, W. (2014). The International Cognitive Ability Resource: Development and initial validation of a public-domain measure. Intelligence, 43, 52-64.', url: 'https://doi.org/10.1016/j.intell.2014.01.004', linkText: 'doi:10.1016/j.intell.2014.01.004' },
  { id: 'g9r7', text: 'Arendasy, M., Sommer, M., Gittler, G., & Hergovich, A. (2006). Automatic generation of quantitative reasoning items. Journal of Individual Differences, 27(1), 2-14.' },
  { id: 'g9r8', text: 'Verguts, T., & De Boeck, P. (2002). The induction of solution rules in Raven Progressive Matrices Test. European Journal of Cognitive Psychology, 14(4), 521-547.' }
];

module.exports = guide({
  slug: 'ravens-progressive-matrices',
  crumb: "Raven's Progressive Matrices",
  h1: "How Raven's Progressive Matrices work",
  title: "Raven's Progressive Matrices: How the Test Works | CogniScale",
  description: "The most widely used non-verbal reasoning test in research. What the items ask, what makes one harder than another, and why the format endures.",
  lede: 'If you have ever seen a three-by-three grid of shapes with the bottom-right cell missing, you have seen the design that has dominated non-verbal ability testing since 1938.',
  updated: '2026-09-09',
  published: '2026-09-09',
  toc: [
    { id: 'what-it-is', label: 'What the test is' },
    { id: 'why-matrices', label: 'Why a grid of shapes' },
    { id: 'difficulty', label: 'What makes an item hard' },
    { id: 'versions', label: 'The three versions' },
    { id: 'limits', label: 'What matrices miss' },
    { id: 'here', label: 'How this site uses the format' }
  ],
  refs: REFS,

  bodyTop:
    '<h2 id="what-it-is">What the test is</h2>' +
    '<p>John C. Raven published the Progressive Matrices in 1938. Each item shows a matrix of figures ' +
    'with one cell left blank, and asks you to choose the piece that completes it. The items are ' +
    '"progressive" in that they get harder as you go, and each one is meant to teach you a little of the ' +
    'logic needed for the next.</p>' +
    '<p>There are no words, no arithmetic and no facts to recall. Everything needed to answer is present ' +
    'in the figure. That property is why the test spread so widely: it can be administered across ' +
    'languages with only the instructions translated, and it has been used in more cross-cultural ' +
    'research than any other cognitive measure.' + P.ref(1, 'g9r1') + '</p>' +

    '<h2 id="why-matrices">Why a grid of shapes</h2>' +
    '<p>The design descends directly from Charles Spearman, who in 1904 observed that performance on ' +
    'wildly different mental tasks was positively correlated - people good at one tended to be good at ' +
    'the others - and proposed a general factor, <i>g</i>, underlying them all.' + P.ref(3, 'g9r3') + '</p>' +
    '<p>Raven wanted a task that loaded on that general factor as purely as possible, stripped of the ' +
    'vocabulary and schooling that contaminate verbal tests. He described the ability being tapped as ' +
    '<i>eductive</i> - the capacity to make sense of confusion, to generate high-level rules from ' +
    'apparently disorganised material.</p>' +
    '<p>That maps closely onto what Raymond Cattell would later call <b>fluid intelligence</b>: reasoning ' +
    'applied to novel problems, as distinct from crystallised knowledge you have accumulated.' +
    P.ref(4, 'g9r4') + ' Matrices remain the canonical measure of fluid reasoning, and when researchers ' +
    'need a single short index of general ability, matrices are usually what they reach for.</p>' +
    '<div class="note">' +
      '<p style="margin:0">A useful way to see the design: every item is a small experiment in whether ' +
      'you can infer an unstated rule from a handful of examples, then apply it to a case you have not ' +
      'seen. That is a decent working definition of reasoning, which is why the format has proved so ' +
      'durable.</p>' +
    '</div>',

  bodyBottom:
    '<h2 id="difficulty">What makes an item hard</h2>' +
    '<p>The most influential answer came from a 1990 analysis that built computer models capable of ' +
    'solving matrix items, then compared their behaviour with that of human test-takers.' +
    P.ref(2, 'g9r2') + '</p>' +
    '<p>Two things predicted difficulty:</p>' +
    '<ul>' +
      '<li><b>The number of rules operating at once.</b> An item governed by one rule is easy. An item ' +
      'where three or four independent rules run simultaneously is hard, because you must hold each ' +
      'partial conclusion in mind while working out the next.</li>' +
      '<li><b>The type of rule.</b> Some relations are much harder to spot than others, with rules ' +
      'requiring you to combine or cancel elements across cells being among the most difficult.</li>' +
    '</ul>' +
    '<p>The analysis identified a small taxonomy of rules that accounts for most items - constancy along ' +
    'a row, quantitative progression, distribution of three values across rows and columns, and figure ' +
    'addition or subtraction. Later work confirmed that difficulty is largely a function of how many of ' +
    'these must be induced and combined.' + P.ref(8, 'g9r8') + '</p>' +
    '<p>The practical upshot for anyone taking such a test: when an item defeats you, the problem is ' +
    'usually not that you cannot see <i>a</i> rule. It is that you have found one rule and stopped, ' +
    'while a second rule is also running.</p>' +

    '<h2 id="versions">The three versions</h2>' +
    '<div class="table-wrap"><table>' +
      '<thead><tr><th>Version</th><th>Intended for</th><th>Design note</th></tr></thead>' +
      '<tbody>' +
        '<tr><td><b>Coloured</b> (CPM)</td><td>Young children, older adults, people with impairments</td><td>Coloured backgrounds to hold attention; easier range</td></tr>' +
        '<tr><td><b>Standard</b> (SPM)</td><td>The general population</td><td>Five sets of twelve, rising in difficulty</td></tr>' +
        '<tr><td><b>Advanced</b> (APM)</td><td>High-ability adults</td><td>Built to spread out scores at the top, where the Standard version ceilings</td></tr>' +
      '</tbody>' +
    '</table></div>' +
    '<p>The existence of three versions makes a general point about measurement: <b>a test only ' +
    'discriminates well over the range it was built for</b>. Give the Standard version to a group of ' +
    'doctoral students and most will approach the ceiling, and the scores will say more about who made a ' +
    'careless slip than about who reasons best. This is the same reason a 30-item test cannot resolve ' +
    'scores at the extremes - a point we make on ' +
    '<a href="/guides/iq-score-ranges/">score ranges</a> and enforce by refusing to report beyond 65 to ' +
    '135.</p>' +

    '<h2 id="limits">What matrices miss</h2>' +
    '<p>Matrices are excellent at one thing, which is also their limitation.</p>' +
    '<ul>' +
      '<li><b>They measure fluid reasoning, not general intelligence in full.</b> A matrices score tells ' +
      'you little about verbal comprehension, acquired knowledge, or processing speed. A full clinical ' +
      'battery samples several domains for exactly this reason.</li>' +
      '<li><b>They are culture-reduced, not culture-free.</b> No vocabulary is required, but familiarity ' +
      'with grids, abstract puzzles and formal testing is - and that is a product of schooling. See ' +
      '<a href="/guides/are-iq-tests-biased/">are IQ tests biased</a>.</li>' +
      '<li><b>They show the largest Flynn effect.</b> Raw scores on fluid measures rose faster across ' +
      'the twentieth century than crystallised ones - roughly 0.41 points a year against 0.21.' +
      P.ref(5, 'g9r5') + ' A matrices score is therefore especially dependent on <i>when</i> the norms ' +
      'were collected.</li>' +
      '<li><b>The published versions are copyrighted and widely leaked.</b> Item security is a real ' +
      'problem for any fixed, famous item set.</li>' +
    '</ul>' +

    '<h2 id="here">How this site uses the format</h2>' +
    '<p>This test uses matrix items, but not Raven’s - those are copyrighted, and the widely ' +
    'circulated copies would compromise any test that used them.</p>' +
    '<p>Instead the items here are <b>generated from explicit rule specifications</b>. Each matrix ' +
    'declares which attributes vary and under which rule, and the completing cell is then derived by ' +
    'applying those rules rather than drawn by hand. This is the automatic item generation approach ' +
    'recommended for public-domain ability measures,' + P.ref(7, 'g9r7') + P.ref(6, 'g9r6') + ' and it ' +
    'buys two things:</p>' +
    '<ul>' +
      '<li>the keyed answer is correct <b>by construction</b>, and every distractor violates at least one ' +
      'stated rule - both machine-checked on every build;</li>' +
      '<li>difficulty is set by structure - how many rules run at once - which is the property the ' +
      'research says drives it.</li>' +
    '</ul>' +
    '<p>The <a href="/methodology/">methodology page</a> lists the rule taxonomy used, and there are ' +
    'worked examples with the reasoning spelled out in the ' +
    '<a href="/guides/iq-test-practice-questions/">practice questions</a>.</p>',

  faq: [
    {
      q: "Is Raven's Progressive Matrices an IQ test?",
      a: '<p>It measures fluid reasoning, which is the largest single component of general intelligence ' +
         'but not the whole of it. Scores are often converted to an IQ-type scale, and it correlates ' +
         'strongly with full-scale IQ, but it samples one domain rather than the several a clinical ' +
         'battery covers.</p>'
    },
    {
      q: 'What makes one matrix item harder than another?',
      a: '<p>Mainly the number of independent rules operating at the same time. One rule is easy; three ' +
         'or four simultaneously is hard, because each partial conclusion has to be held in working ' +
         'memory while the next is worked out. Rule type matters too - relations that combine or cancel ' +
         'elements across cells are harder to spot than simple progressions.</p>'
    },
    {
      q: 'Are the matrices on this site the real Raven items?',
      a: '<p>No. Raven items are copyrighted and widely leaked, which would compromise any test using ' +
         'them. The items here are generated from explicit rule specifications, so the answer is correct ' +
         'by construction and every distractor breaks at least one stated rule.</p>'
    },
    {
      q: 'Why do matrices work across different languages?',
      a: '<p>Because the item contains everything needed to solve it - no vocabulary, no arithmetic, no ' +
         'facts. Only the instructions need translating. That is why matrices dominate cross-cultural ' +
         'research, though "language-free" is not the same as "culture-free".</p>'
    }
  ],

  related: [
    { href: '/guides/fluid-vs-crystallised-intelligence/', title: 'Fluid vs crystallised intelligence',
      text: 'The distinction matrices were designed to isolate, and why the two diverge with age.' },
    { href: '/guides/iq-test-practice-questions/', title: 'Practice questions with worked answers',
      text: 'Six worked examples, including matrices, with the reasoning spelled out step by step.' }
  ],

  ctaHeading: 'Try ten generated matrix items',
  ctaSub: 'Part of a 30-question test, with every rule explained afterwards whether you got it right or not.'
});
