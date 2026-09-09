/* CogniScale - 404. Served from /404.html; noindex, but linked so a lost
 * visitor lands somewhere useful rather than bouncing. */
'use strict';

var P = require('./_parts.js');

module.exports = {
  slug: '404',
  noindex: true,
  title: 'Page not found | CogniScale',
  description: 'That page does not exist. Links to the test, the methodology and the guides.',

  body:
    '<div class="wrap"><div class="page-head prose">' +
      '<h1>Page not found</h1>' +
      '<p class="lede">That URL does not exist here. It may have moved, or the link may be wrong.</p>' +
      '<div class="btn-row" style="margin:1.6em 0 2.4em">' +
        '<a class="btn btn-lg" href="/test/">Take the test</a>' +
        '<a class="btn btn-ghost" href="/">Go to the home page</a>' +
      '</div>' +
    '</div></div>' +

    '<div class="wrap">' +
      '<div class="grid grid-2" style="margin-bottom:40px">' +
        card('/methodology/', 'How the test works', 'Item construction, the scoring model, precision and limitations.') +
        card('/guides/iq-score-ranges/', 'IQ score ranges', 'What each score corresponds to in percentile terms.') +
        card('/guides/are-online-iq-tests-accurate/', 'Are online IQ tests accurate?', 'Reliability, validity and norming - and a checklist.') +
        card('/guides/', 'All guides', 'Sourced explainers on scores, testing and intelligence research.') +
      '</div>' +
    '</div>'
};

function card(href, title, text) {
  return '<a class="card card-link" href="' + href + '">' +
    '<h3 style="margin-top:0;font-size:1.02rem">' + P.esc(title) + '</h3>' +
    '<p class="muted small" style="margin:0">' + P.esc(text) + '</p></a>';
}
