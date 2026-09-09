/* CogniScale - the test page.
 *
 * The intro screen is real, static HTML: it is what a crawler sees, and it is
 * what renders if JavaScript is slow or blocked. Questions and results are
 * built at run time by assets/js/test.js from the shared engine bundle. */
'use strict';

var P = require('./_parts.js');
var render = require('../lib/render.js');
var itemBank = require('../data/items.js');
var cfg = require('../../site.config.js');

var minutes = Math.round(cfg.test.timeLimitSeconds / 60);
var nItems = itemBank.ITEMS.length;

var domainList = ['MR', 'NL', 'VR', 'SR'].map(function (code) {
  var d = itemBank.DOMAINS[code];
  return '<li><b>' + P.esc(d.name) + '</b> (' + itemBank[code].length + ') &mdash; ' + P.esc(d.blurb) + '</li>';
}).join('');

module.exports = {
  slug: 'test',
  title: 'Take the Free IQ Test - ' + nItems + ' Questions | CogniScale',
  ogTitle: 'Take the free IQ test - ' + nItems + ' questions, ' + minutes + ' minutes',
  description: 'Start the free ' + nItems + '-question IQ test. Figural, numeric, verbal and spatial reasoning with a ' +
    minutes + '-minute limit. Instant score, no sign-up, no email.',
  updated: '2026-09-06',
  breadcrumbs: [{ slug: '', name: 'Home' }, { slug: 'test', name: 'Take the test' }],
  scripts: ['/assets/js/engine.js', '/assets/js/test.js'],
  jsonld: [{
    '@context': 'https://schema.org',
    '@type': 'Quiz',
    name: 'CogniScale cognitive ability test',
    about: { '@type': 'Thing', name: 'General cognitive ability' },
    educationalLevel: 'Adult',
    inLanguage: 'en',
    isAccessibleForFree: true,
    numberOfQuestions: nItems,
    timeRequired: 'PT' + minutes + 'M',
    provider: { '@id': cfg.origin + '/#org' }
  }],

  body: render.defs() +
    '<div class="test-shell">' +

      // ---------------------------------------------------------- intro screen
      '<section class="screen active" id="screen-intro">' +
        '<h1 style="margin-bottom:.35em">Free IQ test</h1>' +
        '<p class="lede">' + nItems + ' questions. ' + minutes + ' minutes. A score with the margin of ' +
        'error attached, plus an explanation of every question you missed.</p>' +

        '<div class="card" style="margin:28px 0">' +
          '<h2 style="margin-top:0;font-size:1.15rem">Before you start</h2>' +
          '<ul class="rules-list">' +
            rule('1', 'Give yourself ' + minutes + ' uninterrupted minutes.',
              'A single timer runs for the whole test. It starts when you press begin and does not pause.') +
            rule('2', 'Answer everything, even when unsure.',
              'Unanswered questions count as wrong. There is no penalty for a wrong answer, so a considered ' +
              'guess is always better than leaving a question blank.') +
            rule('3', 'You can move back and forth.',
              'Use the previous and next buttons to revisit anything while time remains. Your progress ' +
              'survives an accidental refresh.') +
            rule('4', 'Work alone, without help.',
              'No calculator, no search engine, no second opinion. The score only means anything if the ' +
              'conditions match the assumptions behind it.') +
          '</ul>' +

          '<h3 style="font-size:1rem">What you will be asked</h3>' +
          '<ul class="small" style="color:var(--ink-2)">' + domainList + '</ul>' +

          '<div class="btn-row" style="margin-top:26px">' +
            '<button class="btn btn-lg" type="button" id="btn-begin">Begin the test</button>' +
            '<a class="btn btn-ghost" href="/methodology/">How it is scored</a>' +
          '</div>' +
          '<p class="small muted" style="margin:16px 0 0">Nothing you do here is uploaded. ' +
          'There are no ads inside the test.</p>' +
        '</div>' +

        '<noscript>' +
          '<div class="err" style="display:block">' +
            '<b>This test needs JavaScript.</b> The questions are generated and scored entirely in your ' +
            'browser, which is also why none of your answers are sent anywhere. Please enable JavaScript ' +
            'and reload. In the meantime, the <a href="/methodology/">methodology</a> and the ' +
            '<a href="/guides/">guides</a> are all readable without it.' +
          '</div>' +
        '</noscript>' +
      '</section>' +

      // ------------------------------------------------------------ questions
      '<section class="screen" id="screen-test" aria-live="polite">' +
        '<div class="test-bar">' +
          '<div class="test-bar-inner">' +
            '<span class="progress-text" id="progress-text">Question 1 of ' + nItems + '</span>' +
            '<div class="progress-track" role="progressbar" aria-label="Test progress" ' +
              'aria-valuemin="0" aria-valuemax="' + nItems + '" aria-valuenow="1" id="progress-bar">' +
              '<div class="progress-fill" id="progress-fill"></div>' +
            '</div>' +
            '<span class="timer" id="timer" role="timer" aria-label="Time remaining">--:--</span>' +
          '</div>' +
        '</div>' +
        '<div id="question-host"></div>' +
        '<div class="test-nav">' +
          '<button class="btn btn-ghost" type="button" id="btn-prev">Previous</button>' +
          '<span class="spacer"></span>' +
          '<button class="btn btn-ghost" type="button" id="btn-skip">Skip</button>' +
          '<button class="btn" type="button" id="btn-next">Next</button>' +
        '</div>' +
        '<p class="small muted" style="margin-top:18px" id="answered-note"></p>' +
      '</section>' +

      // -------------------------------------------------------------- results
      '<section class="screen" id="screen-results"></section>' +

      /* The results-page ad lives here as an inert template so that its markup is
       * produced by the same adSlot() helper as every other slot on the site.
       * The runner clones it in below the score card - never inside the test. */
      '<template id="tpl-results-ad">' + P.adSlot('rect', 'resultsBelow') + '</template>' +

    '</div>'
};

function rule(n, heading, text) {
  return '<li><span class="n">' + n + '</span><span><b>' + P.esc(heading) + '</b><br>' +
    '<span class="muted small">' + P.esc(text) + '</span></span></li>';
}
