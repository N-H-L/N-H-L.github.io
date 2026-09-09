/* CogniScale - contact page.
 *
 * Deliberately a mailto rather than a form: a form needs a backend, and the
 * whole privacy claim of this site rests on there not being one. */
'use strict';

var P = require('./_parts.js');
var cfg = require('../../site.config.js');

var mail = cfg.contactEmail;

module.exports = {
  slug: 'contact',
  title: 'Contact | CogniScale',
  description: 'Report an error, an ambiguous test question, or a broken page. Corrections are made and dated on the page concerned.',
  updated: '2026-09-06',
  breadcrumbs: [{ slug: '', name: 'Home' }, { slug: 'contact', name: 'Contact' }],
  jsonld: [{
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: 'Contact CogniScale',
    inLanguage: 'en',
    mainEntity: { '@id': cfg.origin + '/#org' }
  }],

  body:
    '<div class="wrap"><div class="page-head prose">' +
      '<h1>Contact</h1>' +
      '<p class="lede">Corrections are the most useful thing you can send.</p>' +
    '</div></div>' +

    '<div class="wrap prose">' +
      '<div class="card" style="margin-bottom:2em">' +
        '<h2 style="margin-top:0;font-size:1.15rem">Email</h2>' +
        (mail
          ? '<p style="margin-bottom:.5em"><a class="btn" href="mailto:' + P.esc(mail) + '">' + P.esc(mail) + '</a></p>' +
            '<p class="small muted" style="margin:0">Replies are not guaranteed, but every report is read.</p>'
          : '<p class="muted" style="margin:0">No contact address is configured yet. Set ' +
            '<code>contactEmail</code> in <code>site.config.js</code> and rebuild.</p>') +
      '</div>' +

      '<h2>What is worth reporting</h2>' +
      '<ul>' +
        '<li><b>An ambiguous test question.</b> The most valuable report of all. Every item is machine-' +
        'checked for having exactly one defensible answer, but a verifier only proves the properties it ' +
        'was told to look for. If an item reads as having two reasonable answers, that is a real defect. ' +
        'Please say which question number and what your reading was.</li>' +
        '<li><b>A factual error in a guide.</b> Ideally with the source that contradicts it.</li>' +
        '<li><b>A claim that overstates the evidence.</b> This site is meant to be careful about ' +
        'uncertainty. Where it is not, that is a bug.</li>' +
        '<li><b>Anything broken.</b> A figure that will not render, a score that looks impossible, a ' +
        'layout that breaks on your device. Your browser and device help.</li>' +
        '<li><b>Accessibility problems.</b> Particularly with a screen reader or keyboard-only ' +
        'navigation.</li>' +
      '</ul>' +

      '<h2>What cannot be answered</h2>' +
      '<ul>' +
        '<li><b>"What does my score mean for me?"</b> A score from an unsupervised online test cannot ' +
        'support individual interpretation. <a href="/guides/iq-score-ranges/">The score ranges guide</a> ' +
        'covers what the numbers correspond to in general.</li>' +
        '<li><b>Requests to recover a lost result.</b> Results are never sent to us and are not stored ' +
        'anywhere we can reach. If it is gone from your browser, it is gone.</li>' +
        '<li><b>Requests for a certificate or verified score.</b> This site issues none, because a score ' +
        'from it should not be relied on by any third party.</li>' +
        '<li><b>Clinical or diagnostic questions.</b> Please speak to a qualified professional. ' +
        '<a href="/terms/">See the terms.</a></li>' +
      '</ul>' +

      '<h2>Reporting an item you think is wrong</h2>' +
      '<p>The most useful format:</p>' +
      '<div class="note">' +
        '<p class="small" style="margin:0;font-family:var(--mono)">' +
        'Question number: 14 of 30<br>' +
        'Type: figural matrix<br>' +
        'I answered: C<br>' +
        'Marked correct: E<br>' +
        'Why I think C also works: the shading rule can be read as running down the columns, ' +
        'which makes C consistent too.' +
        '</p>' +
      '</div>' +
      '<p>That last line is the part that matters. Knowing <em>why</em> an alternative reading is ' +
      'available is what makes an item fixable.</p>' +
    '</div>'
};
