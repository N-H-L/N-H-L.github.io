/* CogniScale - about page. Carries the E-E-A-T load: who made this, on what
 * basis, funded how, and what its stated conflicts are. */
'use strict';

var P = require('./_parts.js');
var cfg = require('../../site.config.js');

module.exports = {
  slug: 'about',
  title: 'About CogniScale: Who Built This and How It Is Funded',
  ogTitle: 'About CogniScale',
  description: 'Who built this free IQ test, what it is based on, how it is funded, and the editorial rules it holds itself to - including exactly where ads appear.',
  updated: '2026-09-06',
  breadcrumbs: [{ slug: '', name: 'Home' }, { slug: 'about', name: 'About' }],
  jsonld: [{
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: 'About CogniScale',
    inLanguage: 'en',
    mainEntity: { '@id': cfg.origin + '/#org' }
  }],

  body:
    '<div class="wrap"><div class="page-head prose">' +
      '<h1>About</h1>' +
      '<p class="lede">What this site is, what it is not, and how it pays for itself.</p>' +
    '</div></div>' +

    '<div class="wrap prose">' +
      P.updatedLine('2026-09-06') +

      '<h2>What this is</h2>' +
      '<p>CogniScale is a free, 30-question cognitive ability test that runs entirely in your browser, ' +
      'together with a set of sourced guides on what such scores mean. It was built because most free IQ ' +
      'tests share two problems: they do not explain how they arrive at a number, and they present that ' +
      'number as far more precise than any short test can be.</p>' +
      '<p>The response to both is the same: publish everything. ' +
      '<a href="/methodology/">The methodology page</a> describes the construct, the item construction ' +
      'rules, the scoring model, the measured precision and nine specific limitations. Every score comes ' +
      'with a confidence interval attached.</p>' +

      '<h2>What this is not</h2>' +
      '<div class="note note-strong">' +
        '<p style="margin:0">This is not a clinical assessment and carries no diagnostic, educational or ' +
        'legal standing. It cannot diagnose a learning disability, support an application for accommodations ' +
        'or gifted programmes, or substitute for an assessment by a qualified psychologist. If you need a ' +
        'score that carries weight somewhere, a supervised battery administered by a licensed practitioner ' +
        'is the only route.</p>' +
      '</div>' +

      '<h2>What it is based on</h2>' +
      '<p>The test blueprint follows the item families used by the International Cognitive Ability ' +
      'Resource, a public research project set up to build validated cognitive measures outside the ' +
      'commercial test publishers. Its initial validation drew on nearly 97,000 participants, and a later ' +
      'study found its 16-item short form correlated r&nbsp;=&nbsp;.81 with WAIS-IV Full Scale IQ in a ' +
      'sample of 97 students.</p>' +
      '<p>The ICAR item bank itself is licensed for academic use only, so <b>no ICAR item appears on this ' +
      'site</b>. What is borrowed is the published methodology. Every question here is original, generated ' +
      'from explicit construction rules and machine-verified before release. ' +
      '<a href="/methodology/#construction">The details are here.</a></p>' +

      '<h2>Editorial standards</h2>' +
      '<ul>' +
        '<li><b>Claims are sourced.</b> Factual statements cite a named paper or textbook, or describe ' +
        'how this site itself works. No "studies show" without the study.</li>' +
        '<li><b>Uncertainty is stated, not smoothed over.</b> Where the evidence is contested, the pages ' +
        'say so. Where this test is weak - and its norms are genuinely its weak point - that is written ' +
        'plainly rather than buried.</li>' +
        '<li><b>No score inflation.</b> Reported scores are capped at ' + cfg.test.reportCeiling + ' ' +
        'because a 30-item test cannot resolve beyond that. A flattering number would be better for ' +
        'sharing and worse as a measurement.</li>' +
        '<li><b>Corrections are made and dated.</b> If something here is wrong, ' +
        '<a href="/contact/">report it</a> and it gets fixed on the page with the date changed.</li>' +
      '</ul>' +

      '<h2 id="ads">How this is funded</h2>' +
      '<p>Display advertising through Google AdSense. That is the entire business model: there is no paid ' +
      'tier, no upsell, no report to purchase, no email list and no data sold. The test cannot be paywalled ' +
      'because there is nothing behind a wall &mdash; scoring happens on your device.</p>' +
      '<p>Advertising creates an obvious incentive to maximise page views, and the way that usually plays ' +
      'out on quiz sites is ads wedged between questions, a score held back behind a "continue" that loads ' +
      'another unit, or a result split across five pages. None of that happens here. The rules, which are ' +
      'enforced in code rather than left to good intentions:</p>' +
      '<div class="table-wrap"><table>' +
        '<thead><tr><th>Where</th><th>Ads?</th></tr></thead>' +
        '<tbody>' +
          '<tr><td>During the test, on any question</td><td><b>Never.</b> The ad loader refuses to fill any slot while a question is on screen</td></tr>' +
          '<tr><td>Between questions</td><td><b>Never.</b> There is no interstitial of any kind</td></tr>' +
          '<tr><td>Above your score on the result page</td><td><b>Never.</b> The score card comes first</td></tr>' +
          '<tr><td>Below your score, once you have it</td><td>One unit</td></tr>' +
          '<tr><td>Home page, below the fold</td><td>One unit</td></tr>' +
          '<tr><td>Within a guide, at a paragraph break</td><td>One unit</td></tr>' +
        '</tbody>' +
      '</table></div>' +
      '<p>Additionally, and permanently: no pop-ups, no pop-unders, no sticky or floating units, no ' +
      'auto-playing video, no full-screen scroll-over, and no countdown before content. Those formats are ' +
      'Better Ads Standards violations, and sites using them get filtered by Chrome &mdash; but the more ' +
      'immediate reason is that they would make the test worse. Every ad container also reserves its ' +
      'height in advance, so a slow-loading ad can never shove the page around under your cursor.</p>' +
      '<p>Your test answers are never collected, shared or sold, because they never leave your browser in ' +
      'the first place. <a href="/privacy/">The privacy policy has the specifics</a>, including what ' +
      'Google may set independently of us.</p>' +

      '<h2>Who made it</h2>' +
      '<p>CogniScale is an independent project, not affiliated with any test publisher, university or ' +
      'professional body. It is not endorsed by Pearson, Riverside, the ICAR project or any of the authors ' +
      'cited on the methodology page. Where their work is described, it is described from the published ' +
      'sources, which are all listed and linked.</p>' +
      '<p>Trademarks referenced &mdash; WAIS, Wechsler, Stanford-Binet, Raven\'s Progressive Matrices ' +
      '&mdash; belong to their respective owners and are used here only to describe those instruments.</p>' +

      '<h2>Contact</h2>' +
      '<p>Errors, ambiguous questions, broken pages, or a claim you think overstates the evidence: ' +
      '<a href="/contact/">get in touch</a>. Reports about specific test questions are especially ' +
      'welcome, since an item that reads as ambiguous to a careful reader is a real defect regardless of ' +
      'what the verifier says.</p>' +
    '</div>' +

    P.cta('Take the test', 'Thirty questions. One score, with the uncertainty attached.')
};
