/* CogniScale - home page. */
'use strict';

var P = require('./_parts.js');
var matrix = require('../lib/matrix.js');
var render = require('../lib/render.js');
var itemBank = require('../data/items.js');

/* A worked example, built by the same engine as the real items but with an id
 * that is not in the scored bank - so showing the answer here gives nothing
 * away. Rendered at build time, so it is static HTML with no JS cost. */
var demo = matrix.build({
  id: 'DEMO.HOME.1',
  family: 'attr',
  rules: {
    shape: { kind: 'latin', domain: ['circle', 'square', 'triangle'], shift: 1 },
    fill: { kind: 'constant', domain: ['none', 'light', 'solid'] }
  }
});

/* A second generated item used as the hero's visual anchor. The answer is not
 * shown here - it is only there to make the page's subject obvious at a glance. */
var heroDemo = matrix.build({
  id: 'DEMO.HERO.1',
  family: 'attr',
  rules: {
    shape: { kind: 'latin', domain: ['circle', 'square', 'triangle'], shift: 2 },
    count: { kind: 'progress', domain: [1, 2, 3], starts: [0, 1, 2], step: 1 }
  }
});

var demoOptions = demo.options.map(function (cell, i) {
  var correct = i === demo.answer;
  return '<div class="opt" style="cursor:default' + (correct ? ';border-color:var(--good);box-shadow:inset 0 0 0 1px var(--good)' : '') + '">' +
    '<span class="opt-key"' + (correct ? ' style="background:var(--good);color:#fff;border-color:var(--good)"' : '') + '>' +
    String.fromCharCode(65 + i) + '</span>' +
    render.matrixOption(demo, cell) + '</div>';
}).join('');

var domains = ['MR', 'NL', 'VR', 'SR'].map(function (code) {
  var d = itemBank.DOMAINS[code];
  var n = itemBank[code].length;
  return '<div class="card domain-card">' +
    '<span class="domain-tag">' + P.esc(d.chc) + '</span>' +
    '<h3>' + P.esc(d.name) + '</h3>' +
    '<p class="muted" style="margin-bottom:.6em">' + P.esc(d.blurb) + '</p>' +
    '<p class="small muted" style="margin:0"><b>' + n + '</b> questions</p>' +
    '</div>';
}).join('');

var faqData = P.faq([
  {
    q: 'Is this IQ test really free?',
    a: '<p>Yes. All 30 questions, the full score report and the per-question explanations are free, with no account, no email address and no payment at any point. The site is funded by a small number of display ads placed outside the test itself.</p>'
  },
  {
    q: 'How long does the test take?',
    a: '<p>About 30 minutes. There is a 30-minute limit for the whole test, which works out at roughly one minute per question. Most people finish with time to spare.</p>'
  },
  {
    q: 'How accurate is an online IQ test?',
    a: '<p>A well-built one is useful but not clinical. This test reports a 95% confidence interval of roughly &plusmn;9 points near the middle of the range, widening at the extremes. A supervised test such as the WAIS-IV is considerably more precise, and only a qualified psychologist can produce a score with clinical standing. <a href="/guides/are-online-iq-tests-accurate/">The full comparison is here.</a></p>'
  },
  {
    q: 'What is a good IQ score?',
    a: '<p>By construction the average is 100 and about two thirds of people score between 85 and 115. A score near 130 is around the 98th percentile. Because scores are defined relative to other people rather than against an absolute standard, "good" only means "compared with the norm group". <a href="/guides/iq-score-ranges/">See the full range table.</a></p>'
  },
  {
    q: 'Do you store my answers or my score?',
    a: '<p>No. The test runs entirely in your browser. Your answers are held in your own browser\'s session storage so you can refresh without losing progress, and they are discarded when you close the tab. Nothing is uploaded to us, because there is no server to upload it to.</p>'
  },
  {
    q: 'Can I retake the test?',
    a: '<p>You can, but a second attempt on the same questions will overestimate you: you have already seen the items and worked out some of the rules. This is called a practice effect, and it is why real test batteries keep alternate forms and recommended retest intervals.</p>'
  }
]);

module.exports = {
  slug: '',
  title: 'Free IQ Test: 30 Questions, Instant Score | CogniScale',
  ogTitle: 'Free IQ Test - 30 questions, instant score, no sign-up',
  description: 'Take a free IQ test scored with item response theory. 30 questions, about 30 minutes, and an instant result with a stated margin of error. No sign-up, no email.',
  updated: '2026-09-06',
  head: '<link rel="preload" href="/assets/js/engine.js" as="script">',
  jsonld: [
    faqData.jsonld,
    {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: 'CogniScale IQ Test',
      url: P.cfg.origin + '/test/',
      applicationCategory: 'EducationalApplication',
      operatingSystem: 'Any modern web browser',
      browserRequirements: 'Requires JavaScript',
      inLanguage: 'en',
      isAccessibleForFree: true,
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      description: 'A 30-item cognitive ability test covering figural, numeric, verbal and spatial reasoning, scored with a three-parameter logistic item response model.',
      featureList: [
        '30 items across four reasoning domains',
        'Item response theory scoring with a reported confidence interval',
        'Per-question explanations after scoring',
        'No account required'
      ]
    }
  ],
  body: render.defs() +

    // ------------------------------------------------------------------ hero
    '<section class="hero"><div class="wrap"><div class="hero-grid">' +
      '<div class="hero-copy">' +
        '<span class="eyebrow">Free &middot; No sign-up &middot; Instant result</span>' +
        '<h1>Free IQ test</h1>' +
        '<p class="lede">Thirty questions covering figural, numeric, verbal and spatial reasoning. ' +
        'You get a score, the margin of error around it, a breakdown by domain, and a written explanation ' +
        'of every question you got wrong.</p>' +
        '<div class="btn-row">' +
          '<a class="btn btn-lg" href="/test/">Start the test</a>' +
          '<a class="btn btn-lg btn-ghost" href="/methodology/">Read the methodology</a>' +
        '</div>' +
        '<ul class="chips">' +
          chip('30 questions, about 30 minutes') +
          chip('No account, no email address') +
          chip('Answers never leave your browser') +
          chip('Scoring method published in full') +
        '</ul>' +
      '</div>' +
      '<aside class="hero-panel" aria-label="Example of a question">' +
        '<div class="hero-panel-head">' +
          '<span class="domain-tag">Figural reasoning</span>' +
          '<span class="small muted">Example</span>' +
        '</div>' +
        '<p class="hero-panel-q">Which figure completes the matrix?</p>' +
        '<div class="stim-wrap">' + render.matrixStimulus(heroDemo) + '</div>' +
      '</aside>' +
    '</div></div></section>' +

    // ------------------------------------------------------- what it measures
    '<section class="section section-alt"><div class="wrap">' +
      '<div class="section-head">' +
        '<h2>What the test measures</h2>' +
        '<p>The four question types are the ones that load most heavily on general reasoning ability in ' +
        'the published literature, and they map onto four broad abilities in the Cattell&ndash;Horn&ndash;Carroll ' +
        'model of cognitive ability. Each is scored separately as well as together.</p>' +
      '</div>' +
      '<div class="grid grid-4">' + domains + '</div>' +
      '<p class="section-foot"><a href="/methodology/#item-types">Why these four, and how each item was built &rarr;</a></p>' +
    '</div></section>' +

    // ---------------------------------------------------------- sample question
    '<section class="section"><div class="wrap">' +
      '<div class="section-head">' +
        '<h2>A question, worked through</h2>' +
        '<p>Every figural item is generated from an explicit set of rules rather than drawn by hand, ' +
        'which is what lets each one be checked by machine for a single unambiguous answer. ' +
        'Here is an easy one with the answer shown.</p>' +
      '</div>' +
      '<div class="card sample-card">' +
        '<p class="q-prompt">Which figure completes the matrix?</p>' +
        '<div class="stim-wrap">' + render.matrixStimulus(demo) + '</div>' +
        '<div class="options opts-fig" style="margin-bottom:18px">' + demoOptions + '</div>' +
        '<div class="note note-strong" style="margin-bottom:0">' +
          '<h4>Two rules are running at once</h4>' +
          '<p style="margin:0">Each of the three shapes appears exactly once in every row and every column. ' +
          'Separately, shading is constant along each row and changes between rows. ' +
          'The missing cell has to satisfy both at the same time.</p>' +
        '</div>' +
      '</div>' +
      '<p class="small muted section-foot">This example is not one of the 30 scored questions.</p>' +
    '</div></section>' +

    // ---------------------------------------------------------------- scoring
    '<section class="section section-alt"><div class="wrap">' +
      '<div class="section-head">' +
        '<h2>How the score is worked out</h2>' +
        '<p>Counting correct answers and multiplying by a constant would treat an easy question and a ' +
        'hard question as equal evidence. They are not, so this test does something more careful.</p>' +
      '</div>' +
      '<div class="grid grid-3">' +
        step('1', 'Every question has a difficulty',
          'Each item carries a difficulty and a discrimination value, set from how structurally complex it is - ' +
          'how many rules govern a matrix, how deep the generating rule of a series runs, what kind of inference a ' +
          'verbal item demands.') +
        step('2', 'Your answers are fitted to a model',
          'A three-parameter logistic model asks which ability level makes your particular pattern of right and ' +
          'wrong answers most probable, allowing for the fact that a lucky guess on a hard item is always possible.') +
        step('3', 'The result comes with error bars',
          'The model returns a range, not just a number. Near the middle of the scale that range is about ' +
          '&plusmn;9 points at 95% confidence. Any test that reports a bare number without one is overstating what it knows.') +
      '</div>' +
      '<p class="section-foot"><a href="/methodology/">The full method, including its limitations &rarr;</a></p>' +
    '</div></section>' +

    P.adSlot('leaderboard', 'homeBelowFold') +

    // --------------------------------------------------------------- honesty
    '<section class="section"><div class="wrap prose">' +
      '<h2>What a score like this does and does not tell you</h2>' +
      '<p>An IQ score is a rank, not a measurement of a substance. It says where your performance on ' +
      '<em>these particular questions, on this particular day</em> sits relative to a reference distribution. ' +
      'That is a genuinely useful thing to know, and it is a much narrower thing than "how intelligent you are".</p>' +
      '<p>Scores of this kind predict school and job performance moderately well on average across large groups, ' +
      'and predict very little about any single person. They say nothing about creativity, judgement, ' +
      'diligence, or whether someone is good company. They move with sleep, illness, stress, practice and ' +
      'motivation. And the number itself is anchored to a norm group that shifts across generations.</p>' +
      '<div class="note note-strong">' +
        '<h4>This is not a clinical assessment</h4>' +
        '<p style="margin:0">A score from this site cannot diagnose anything, cannot support an application ' +
        'for accommodations, and is not equivalent to a supervised test administered by a qualified psychologist. ' +
        'If you need a score that carries weight somewhere, that is the route.</p>' +
      '</div>' +
      '<p><a href="/methodology/#limitations">The limitations are listed in full on the methodology page &rarr;</a></p>' +
    '</div></section>' +

    // -------------------------------------------------------------------- FAQ
    '<section class="section section-alt"><div class="wrap prose">' +
      '<h2 style="margin-top:0">Common questions</h2>' +
      faqData.html +
    '</div></section>' +

    // ------------------------------------------------------------------ guides
    '<section class="section"><div class="wrap">' +
      '<div class="section-head"><h2>Background reading</h2>' +
      '<p>Short, sourced explainers on how these scores are built and what they mean.</p></div>' +
      '<div class="grid grid-2">' +
        guideCard('/guides/iq-score-ranges/', 'IQ score ranges and percentiles',
          'What 85, 100, 115 and 130 correspond to in percentile terms, and why rarity climbs so steeply at the tails.') +
        guideCard('/guides/average-iq/', 'What is an average IQ?',
          'Why the average is exactly 100 by construction, what that does and does not imply, and how renorming works.') +
        guideCard('/guides/are-online-iq-tests-accurate/', 'Are online IQ tests accurate?',
          'What separates a defensible online test from a number generator, with the reliability figures for each.') +
        guideCard('/guides/fluid-vs-crystallised-intelligence/', 'Fluid vs crystallised intelligence',
          'The distinction Cattell drew in 1963, why it survived, and how the two diverge across a lifetime.') +
      '</div>' +
    '</div></section>' +

    P.cta('Ready to start?', 'Thirty questions. One score, with the uncertainty attached.')
};

function chip(text) {
  return '<li class="chip">' +
    '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2.4" ' +
    'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 10.5l4 4 8-9"/></svg>' +
    P.esc(text) + '</li>';
}

function step(n, heading, text) {
  return '<div class="card">' +
    '<div style="display:flex;gap:11px;align-items:center;margin-bottom:10px">' +
      '<span style="flex:none;width:26px;height:26px;border-radius:50%;background:var(--brand);color:var(--brand-ink);' +
      'display:grid;place-items:center;font-size:.8rem;font-weight:700">' + n + '</span>' +
      '<h3 style="margin:0;font-size:1.04rem">' + P.esc(heading) + '</h3>' +
    '</div>' +
    '<p class="muted" style="margin:0;font-size:.95rem">' + text + '</p></div>';
}

function guideCard(href, title, text) {
  return '<a class="card card-link" href="' + href + '">' +
    '<h3 style="margin-top:0">' + P.esc(title) + '</h3>' +
    '<p class="muted" style="font-size:.95rem">' + P.esc(text) + '</p>' +
    '<span class="more">Read &rarr;</span></a>';
}
