/* CogniScale - terms of use. Plain-language, and honest about what the score is
 * not. Review with a lawyer before launch; this is not legal advice. */
'use strict';

var P = require('./_parts.js');
var cfg = require('../../site.config.js');

module.exports = {
  slug: 'terms',
  title: 'Terms of Use | CogniScale',
  description: 'Terms of use for CogniScale, including what the test score is and is not, acceptable use, intellectual property, and disclaimers.',
  updated: '2026-09-06',
  breadcrumbs: [{ slug: '', name: 'Home' }, { slug: 'terms', name: 'Terms' }],

  body:
    '<div class="wrap"><div class="page-head prose">' +
      '<h1>Terms of use</h1>' +
      '<p class="lede">By using this site you accept the terms below. The important one is the first.</p>' +
    '</div></div>' +

    '<div class="wrap prose">' +
      P.updatedLine('2026-09-06') +

      '<h2>1. The score is not a professional assessment</h2>' +
      '<div class="note note-strong">' +
        '<p>The test on this site is provided for interest and education only. It is <b>not</b> a ' +
        'psychological, psychiatric, medical or educational assessment, and it produces no diagnosis of ' +
        'any kind.</p>' +
        '<p style="margin:0">A score from this site must not be relied on for any decision about ' +
        'education, employment, clinical care, eligibility for services or accommodations, or legal ' +
        'proceedings. Where such a decision is being made, a supervised assessment by an appropriately ' +
        'qualified professional is the only appropriate basis.</p>' +
      '</div>' +
      '<p>The test is unsupervised, its norms are provisional rather than derived from a standardisation ' +
      'sample, and it reports a confidence interval precisely because a single number would overstate its ' +
      'precision. <a href="/methodology/#limitations">The full limitations are published.</a></p>' +

      '<h2>2. No professional relationship</h2>' +
      '<p>Using this site does not create a clinician-patient, practitioner-client or professional ' +
      'relationship of any kind. If you have concerns about your cognitive functioning, consult a ' +
      'qualified professional. Nothing on this site should delay you in doing so.</p>' +

      '<h2>3. Acceptable use</h2>' +
      '<p>You may use this site for your own personal, non-commercial purposes. You may not:</p>' +
      '<ul>' +
        '<li>present results from this site as a professional or clinical assessment, or as evidence of ' +
        'cognitive ability to any third party that requires a validated instrument;</li>' +
        '<li>administer the test to others in any setting where the result affects them &mdash; ' +
        'selection, admission, employment or clinical contexts included;</li>' +
        '<li>republish the test items, the item generation code or the guides as your own work;</li>' +
        '<li>scrape, mirror or bulk-download the site, or attempt to interfere with its operation;</li>' +
        '<li>interfere with or attempt to circumvent the advertising that funds the site, in ways that ' +
        'generate invalid activity (automated clicks, click exchanges or similar).</li>' +
      '</ul>' +

      '<h2>4. Accuracy of content</h2>' +
      '<p>The guides and methodology pages are written from the published literature and cite their ' +
      'sources. Research moves, sources can be misread, and errors happen. Nothing here is guaranteed to ' +
      'be complete or current, and it is not a substitute for the primary sources, which are linked so ' +
      'you can check them. Corrections are welcome and are made with the review date updated.</p>' +

      '<h2>5. Intellectual property</h2>' +
      '<p>The test items, item generation code, written guides, design and branding on this site are the ' +
      'property of ' + P.esc(cfg.name) + ' unless stated otherwise. Cited works belong to their authors ' +
      'and publishers.</p>' +
      '<p>Third-party trademarks referenced on this site &mdash; including WAIS, Wechsler, Stanford-Binet ' +
      'and Raven\'s Progressive Matrices &mdash; belong to their respective owners and are used only to ' +
      'identify and describe those instruments. This site is not affiliated with, endorsed by or connected ' +
      'to any of them, nor to the ICAR project. No ICAR item is reproduced here.</p>' +

      '<h2>6. Availability</h2>' +
      '<p>The site is provided as-is and as-available. It may be changed, interrupted or withdrawn at any ' +
      'time without notice. Because results are stored only in your own browser, an interruption may lose ' +
      'an in-progress attempt, and there is no way to recover it.</p>' +

      '<h2>7. Disclaimer and liability</h2>' +
      '<p>To the fullest extent permitted by law, this site is provided without warranties of any kind, ' +
      'express or implied, including any warranty of accuracy, fitness for a particular purpose or ' +
      'uninterrupted availability.</p>' +
      '<p>To the fullest extent permitted by law, ' + P.esc(cfg.name) + ' will not be liable for any ' +
      'indirect or consequential loss, or for any decision taken in reliance on a score produced by this ' +
      'site. Nothing in these terms limits liability that cannot lawfully be limited, and nothing here ' +
      'affects your statutory rights as a consumer.</p>' +

      '<h2>8. Third-party links and advertising</h2>' +
      '<p>This site links to external sources and displays third-party advertising. We do not control ' +
      'and are not responsible for the content, accuracy or practices of any external site or ' +
      'advertiser. <a href="/privacy/">See the privacy policy</a> for how advertising handles data.</p>' +

      '<h2>9. Changes to these terms</h2>' +
      '<p>These terms may be updated. The review date at the top of the page shows when they last ' +
      'changed, and continued use after a change means you accept it.</p>' +

      '<h2>10. Contact</h2>' +
      '<p>Questions about these terms: <a href="/contact/">get in touch</a>' +
      (cfg.contactEmail ? ' or email <a href="mailto:' + P.esc(cfg.contactEmail) + '">' + P.esc(cfg.contactEmail) + '</a>' : '') +
      '.</p>' +
    '</div>'
};
