/* CogniScale - shared page fragments. */
'use strict';

var cfg = require('../../site.config.js');

function esc(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

/* An ad slot.
 *
 * Rules this site holds itself to, all of them enforced here rather than left to
 * good intentions (see /about#ads):
 *   - the container reserves its height up front, so a late-loading ad cannot
 *     shove the page around (Cumulative Layout Shift is both a ranking signal
 *     and the single most irritating thing a page can do)
 *   - never adjacent to a control a reader is about to click
 *   - never inside the test itself
 *   - no sticky, interstitial, pop-up, auto-play or full-screen formats - every
 *     one of those is a Better Ads Standards violation and gets a site filtered
 *     by Chrome's ad filter
 *   - labelled "Advertisement", because unlabelled ad blocks next to real
 *     content are deceptive
 * With no publisher id configured the container renders hidden, so layout is
 * identical before and after AdSense approval.
 */
function adSlot(reserve, slotKey) {
  var slotId = cfg.ads.slots[slotKey] || '';
  /* BOTH ids are required. A display unit with a client but no slot id can
   * never fill, so emitting one would reserve space for a box that stays
   * permanently blank. Until the slot ids arrive from the AdSense dashboard
   * the container stays hidden, exactly as it is before approval. The loader
   * script in <head> is emitted on the publisher id alone, which is what
   * Google's crawler needs to see during review. */
  var enabled = !!cfg.ads.publisherId && !!slotId;

  var inner = '';
  if (enabled) {
    inner =
      '<span class="ad-label">Advertisement</span>' +
      '<ins class="adsbygoogle" style="display:block"' +
      ' data-ad-client="' + esc(cfg.ads.publisherId) + '"' +
      ' data-ad-slot="' + esc(slotId) + '"' +
      ' data-ad-format="auto" data-full-width-responsive="true"></ins>';
  }

  return '<aside class="ad-slot' + (enabled ? '' : ' is-empty') + '"' +
    ' data-reserved="' + reserve + '" data-slot="' + esc(slotKey) + '"' +
    ' role="complementary" aria-label="Advertisement">' + inner + '</aside>';
}

/* FAQ block. Returns the markup and the matching FAQPage JSON-LD.
 * Note: Google restricted FAQ rich results to a narrow set of site types, so
 * this is not a rich-result play. It is still worth emitting - it is how the
 * page states its Q&A structure to every other consumer of structured data. */
function faq(entries) {
  var html = '<div class="faq">' + entries.map(function (e) {
    return '<details><summary>' + esc(e.q) + '</summary><div>' + e.a + '</div></details>';
  }).join('') + '</div>';

  var jsonld = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: entries.map(function (e) {
      return {
        '@type': 'Question',
        name: e.q,
        acceptedAnswer: { '@type': 'Answer', text: e.a.replace(/<[^>]+>/g, '').trim() }
      };
    })
  };

  return { html: html, jsonld: jsonld };
}

function cta(heading, sub) {
  return '<section class="section"><div class="wrap"><div class="card center" style="max-width:640px;margin:0 auto">' +
    '<h2 style="margin-top:0">' + esc(heading) + '</h2>' +
    '<p class="muted">' + esc(sub) + '</p>' +
    '<a class="btn btn-lg" href="/test/">Start the test</a>' +
    '<p class="small muted" style="margin:16px 0 0">30 questions &middot; about 30 minutes &middot; no sign-up</p>' +
    '</div></div></section>';
}

function refs(list) {
  return '<ol class="refs">' + list.map(function (r) {
    var cite = esc(r.text);
    return '<li id="' + esc(r.id) + '">' + cite +
      (r.url ? ' <a href="' + esc(r.url) + '" rel="nofollow noopener" target="_blank">' + esc(r.linkText || 'Link') + '</a>' : '') +
      '</li>';
  }).join('') + '</ol>';
}

/* Superscript reference marker linking down to the reference list. */
function ref(n, id) {
  return '<sup><a href="#' + id + '" aria-label="Reference ' + n + '">' + n + '</a></sup>';
}

function updatedLine(dateIso, reviewer) {
  var d = new Date(dateIso + 'T00:00:00Z');
  var s = d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
  return '<p class="byline">Last reviewed ' + esc(s) + (reviewer ? ' &middot; ' + esc(reviewer) : '') + '</p>';
}

module.exports = { esc: esc, adSlot: adSlot, faq: faq, cta: cta, refs: refs, ref: ref, updatedLine: updatedLine, cfg: cfg };
