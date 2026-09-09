/* CogniScale - guide page factory.
 *
 * Every guide gets the same shape: breadcrumbs, a dated byline, a table of
 * contents, one in-article ad placed at a paragraph break well below the fold,
 * a references list, and a link back to the test. Article structured data is
 * emitted with the citation list, which is the part that tells a search engine
 * this page is sourced rather than invented. */
'use strict';

var P = require('../_parts.js');
var cfg = require('../../../site.config.js');

module.exports = function guide(opts) {
  var slug = 'guides/' + opts.slug;

  var toc = opts.toc && opts.toc.length
    ? '<div class="toc"><h4>On this page</h4><ol>' +
      opts.toc.map(function (t) {
        return '<li><a href="#' + t.id + '">' + P.esc(t.label) + '</a></li>';
      }).join('') + '</ol></div>'
    : '';

  var related = opts.related && opts.related.length
    ? '<h2>Related reading</h2><div class="grid grid-2" style="margin-bottom:8px">' +
      opts.related.map(function (r) {
        return '<a class="card card-link" href="' + r.href + '">' +
          '<h3 style="margin-top:0;font-size:1.02rem">' + P.esc(r.title) + '</h3>' +
          '<p class="muted small" style="margin:0">' + P.esc(r.text) + '</p></a>';
      }).join('') + '</div>'
    : '';

  var refsBlock = opts.refs && opts.refs.length
    ? '<h2 id="references">References</h2>' + P.refs(opts.refs)
    : '';

  var faqBlock = '';
  var faqJsonLd = null;
  if (opts.faq && opts.faq.length) {
    var f = P.faq(opts.faq);
    faqBlock = '<h2 id="faq">' + P.esc(opts.faqHeading || 'Common questions') + '</h2>' + f.html;
    faqJsonLd = f.jsonld;
  }

  var jsonld = [{
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: opts.h1,
    description: opts.description,
    inLanguage: 'en',
    datePublished: opts.published || opts.updated,
    dateModified: opts.updated,
    author: { '@type': 'Organization', name: cfg.name, url: cfg.origin + '/' },
    publisher: { '@id': cfg.origin + '/#org' },
    mainEntityOfPage: { '@type': 'WebPage', '@id': cfg.origin + '/' + slug + '/' },
    citation: (opts.refs || []).map(function (r) { return r.text; })
  }];
  if (faqJsonLd) jsonld.push(faqJsonLd);

  return {
    slug: slug,
    title: opts.title,
    ogTitle: opts.ogTitle || opts.h1,
    description: opts.description,
    updated: opts.updated,
    ogType: 'article',
    breadcrumbs: [
      { slug: '', name: 'Home' },
      { slug: 'guides', name: 'Guides' },
      { slug: slug, name: opts.crumb || opts.h1 }
    ],
    jsonld: jsonld,
    body:
      (opts.head || '') +
      '<div class="wrap"><div class="page-head prose">' +
        '<h1>' + P.esc(opts.h1) + '</h1>' +
        '<p class="lede">' + opts.lede + '</p>' +
      '</div></div>' +
      '<div class="wrap prose">' +
        P.updatedLine(opts.updated) +
        toc +
        opts.bodyTop +
        P.adSlot('leaderboard', 'articleInline') +
        opts.bodyBottom +
        faqBlock +
        refsBlock +
        related +
      '</div>' +
      P.cta(opts.ctaHeading || 'Find out where you land',
        opts.ctaSub || 'Thirty questions, about 30 minutes, and a score with the uncertainty attached.')
  };
};
