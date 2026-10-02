/* CogniScale - privacy policy.
 *
 * NOTE FOR THE OPERATOR: this is a truthful description of how the code in this
 * repository behaves. It is not legal advice, and it must be reviewed before
 * launch - particularly the advertising section, which changes the moment a
 * publisher id is configured. See README.md. */
'use strict';

var P = require('./_parts.js');
var cfg = require('../../site.config.js');

module.exports = {
  slug: 'privacy',
  title: 'Privacy Policy | CogniScale',
  description: 'What CogniScale does and does not collect. Test answers and scores are processed entirely in your browser and never transmitted. Advertising details.',
  updated: '2026-09-06',
  breadcrumbs: [{ slug: '', name: 'Home' }, { slug: 'privacy', name: 'Privacy' }],

  body:
    '<div class="wrap"><div class="page-head prose">' +
      '<h1>Privacy policy</h1>' +
      '<p class="lede">The short version: your test answers and your score never leave your device. ' +
      'Advertising is the only third party involved.</p>' +
    '</div></div>' +

    '<div class="wrap prose">' +
      P.updatedLine('2026-09-06') +

      '<h2>Your test data</h2>' +
      '<p>The test runs entirely in your browser. Questions are generated on your device, your answers ' +
      'are held in your browser\'s own <code>sessionStorage</code> so that refreshing the page does not ' +
      'lose your progress, and your score is calculated locally by JavaScript running on your machine.</p>' +
      '<p><b>None of this is transmitted to us.</b> There is no server-side component that receives ' +
      'answers or scores, and no account system. Closing the tab discards the data. We could not produce ' +
      'your results if asked, because we never had them.</p>' +
      '<p>One consequence worth knowing: if you clear your browser data, use private browsing, or open the ' +
      'test on a different device, your progress and result will not be there. There is nothing to ' +
      'recover.</p>' +

      '<h2>What is stored on your device</h2>' +
      '<div class="table-wrap"><table>' +
        '<thead><tr><th>Name</th><th>Type</th><th>Purpose</th><th>Lifetime</th></tr></thead>' +
        '<tbody>' +
          '<tr><td><code>cs.test.v2</code></td><td>sessionStorage</td>' +
            '<td>Your in-progress answers, current question and timer start, so a refresh does not lose them</td>' +
            '<td>Until the tab is closed</td></tr>' +
        '</tbody>' +
      '</table></div>' +
      '<p>That is not a cookie, it is never transmitted to us, and it contains nothing identifying. '+
      'Google&rsquo;s consent tool and its advertising partners set their own cookies, which are '+
      'described below and are controlled through the consent dialog rather than through us.</p>' +

      '<h2>Advertising</h2>' +
      (cfg.ads.publisherId
        ? '<p>This site displays advertising through Google AdSense. Google is an independent controller ' +
          'of the data it collects and may set cookies or read device identifiers to serve and measure ads, ' +
          'including personalised advertising where you have permitted it.</p>'
        : '<p>This site is designed to display advertising through Google AdSense. <b>No advertising is ' +
          'currently enabled</b> &mdash; no publisher account is configured, so no ad code is loaded and no ' +
          'advertising cookies are set. The section below describes what will apply once it is enabled, and ' +
          'this page will be re-dated at that point.</p>') +
      '<ul>' +
        '<li>Google and its partners may use cookies and similar technologies to serve ads based on your ' +
        'prior visits to this and other websites.</li>' +
        '<li>You can opt out of personalised advertising by Google at ' +
        '<a href="https://adssettings.google.com" rel="nofollow noopener" target="_blank">Google Ads Settings</a>, ' +
        'and from many other vendors at ' +
        '<a href="https://optout.aboutads.info" rel="nofollow noopener" target="_blank">optout.aboutads.info</a> ' +
        'or <a href="https://youronlinechoices.eu" rel="nofollow noopener" target="_blank">youronlinechoices.eu</a>.</li>' +
        '<li>Advertising consent is handled by Google&rsquo;s certified Consent Management Platform. ' +
        'Where the law requires it, you are asked before any personalised advertising cookie is set, and ' +
        'you can reopen that dialog at any time to change your answer. Declining personalisation still ' +
        'permits non-personalised ads, which use limited data such as approximate location and page ' +
        'content for frequency capping, reporting and fraud prevention.</li>' +
        '<li>Your test answers and your score are never shared with any advertiser or ad network. They are ' +
        'not available to share.</li>' +
      '</ul>' +
      '<p>Google\'s own handling of this data is described in its ' +
      '<a href="https://policies.google.com/technologies/partner-sites" rel="nofollow noopener" target="_blank">' +
      'partner sites policy</a>.</p>' +

      '<h2>Analytics</h2>' +
      (cfg.analyticsId
        ? '<p>This site uses Google Analytics with IP anonymisation enabled to understand aggregate traffic ' +
          'patterns. No test answers or scores are sent to it.</p>'
        : '<p>No analytics service is currently enabled on this site. If one is added, this page will be ' +
          'updated and re-dated before it goes live.</p>') +

      '<h2>Server logs</h2>' +
      '<p>This site is a set of static files. Whichever host serves them will keep standard access logs ' +
      '&mdash; typically IP address, timestamp, requested URL, referrer and user agent &mdash; for ' +
      'security and operational purposes. We do not combine those logs with anything else, and cannot ' +
      'link them to test activity, since test activity is never sent to a server.</p>' +

      '<h2>Children</h2>' +
      '<p>This site is not directed at children under 13, and no account or personal information is ' +
      'collected from anyone. Reasoning tests of this kind are not designed or normed for children, and a ' +
      'score obtained by a child would not be interpretable.</p>' +

      '<h2>Your rights</h2>' +
      '<p>Depending on where you live, you may have rights to access, correct, delete or restrict ' +
      'processing of personal data held about you. Because this site holds no personal data about ' +
      'visitors, there is nothing for us to produce or erase. For data held by Google in connection with ' +
      'advertising, exercise those rights through Google directly using the links above.</p>' +

      '<h2>Changes</h2>' +
      '<p>Material changes will be reflected in the review date at the top of this page. The most likely ' +
      'change is advertising being switched on.</p>' +

      '<h2>Contact</h2>' +
      '<p>Questions about this policy: <a href="/contact/">get in touch</a>' +
      (cfg.contactEmail ? ' or email <a href="mailto:' + P.esc(cfg.contactEmail) + '">' + P.esc(cfg.contactEmail) + '</a>' : '') +
      '.</p>' +
    '</div>'
};
