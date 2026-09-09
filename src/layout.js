/* CogniScale - the HTML shell every page is rendered into.
 *
 * SEO notes, since that is half the point of this file:
 *  - one <h1> per page, supplied by the page module
 *  - a self-referencing <link rel=canonical> on every URL
 *  - Open Graph + Twitter cards so shared links render properly
 *  - JSON-LD: WebSite (+ SearchAction) and Organization site-wide, plus a
 *    page-specific block (Article / FAQPage / WebApplication / BreadcrumbList)
 *  - CSS inlined, JS deferred, ad slots height-reserved: LCP and CLS are
 *    ranking inputs, and a quiz page that jumps around while ads load is both a
 *    worse experience and a worse ranking.
 *
 * Everything here is the boring, documented kind of SEO. There is no cloaking,
 * no doorway pages, no keyword stuffing and no link scheme - those are explicit
 * Google spam-policy violations and the penalty is deindexing, which would cost
 * far more traffic than the tricks could ever win.
 */
'use strict';

var cfg = require('../site.config.js');

function esc(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function url(slug) {
  if (!slug) return cfg.origin + '/';
  return cfg.origin + '/' + String(slug).replace(/^\/+|\/+$/g, '') + '/';
}

var NAV = [
  { slug: 'test', label: 'Take the test' },
  { slug: 'methodology', label: 'How it works' },
  { slug: 'guides', label: 'Guides' },
  { slug: 'about', label: 'About' }
];

var BRAND_MARK =
  '<svg class="brand-mark" viewBox="0 0 32 32" aria-hidden="true" focusable="false">' +
  '<rect width="32" height="32" rx="8" fill="var(--brand)"/>' +
  '<path d="M4.5 24.5C9.5 24.5 10 7.5 16 7.5s6.5 17 11.5 17" fill="none" stroke="var(--brand-ink)" ' +
  'stroke-width="2.5" stroke-linecap="round"/>' +
  '<circle cx="16" cy="7.5" r="2.4" fill="var(--brand-ink)"/></svg>';

/* ------------------------------------------------------------- structured data */

function siteJsonLd() {
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      '@id': cfg.origin + '/#website',
      name: cfg.name,
      url: cfg.origin + '/',
      description: 'A free, research-grounded IQ test scored with item response theory.',
      inLanguage: cfg.lang,
      publisher: { '@id': cfg.origin + '/#org' },
      potentialAction: {
        '@type': 'SearchAction',
        target: { '@type': 'EntryPoint', urlTemplate: cfg.origin + '/guides/?q={search_term_string}' },
        'query-input': 'required name=search_term_string'
      }
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      '@id': cfg.origin + '/#org',
      name: cfg.name,
      url: cfg.origin + '/',
      logo: cfg.origin + '/assets/img/logo.svg',
      description: 'Publisher of a free online cognitive ability test scored with item response theory.',
      email: cfg.contactEmail
    }
  ];
}

function breadcrumbJsonLd(crumbs) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map(function (c, i) {
      return { '@type': 'ListItem', position: i + 1, name: c.name, item: url(c.slug) };
    })
  };
}

/* ---------------------------------------------------------------- fragments */

function header(active) {
  var links = NAV.map(function (n) {
    var isActive = active === n.slug || (active && active.indexOf(n.slug + '/') === 0);
    var cls = n.slug === 'test' ? ' class="btn"' : '';
    return '<a href="' + url(n.slug).replace(cfg.origin, '') + '"' + cls +
      (isActive ? ' aria-current="page"' : '') + '>' + esc(n.label) + '</a>';
  }).join('');

  return '<header class="site-header"><div class="wrap">' +
    '<a class="brand" href="/">' + BRAND_MARK + '<span>' + esc(cfg.name) + '</span></a>' +
    '<button class="nav-toggle" type="button" aria-expanded="false" aria-controls="site-nav">Menu</button>' +
    '<nav class="nav" id="site-nav" aria-label="Main">' + links + '</nav>' +
    '</div></header>';
}

function footer() {
  var year = new Date().getFullYear();
  return '<footer class="site-footer"><div class="wrap">' +
    '<div class="footer-grid">' +
      '<div>' +
        '<a class="brand" href="/">' + BRAND_MARK + '<span>' + esc(cfg.name) + '</span></a>' +
        '<p class="muted small" style="margin-top:12px;max-width:34ch">' +
          'A free cognitive ability test, scored with item response theory and documented in full. ' +
          'Not a clinical instrument.</p>' +
      '</div>' +
      '<div><h4>Test</h4><ul>' +
        '<li><a href="/test/">Take the test</a></li>' +
        '<li><a href="/methodology/">How it works</a></li>' +
        '<li><a href="/methodology/#limitations">Limitations</a></li>' +
      '</ul></div>' +
      '<div><h4>Guides</h4><ul>' +
        '<li><a href="/guides/iq-score-ranges/">IQ score ranges</a></li>' +
        '<li><a href="/guides/average-iq/">What is average IQ?</a></li>' +
        '<li><a href="/guides/are-online-iq-tests-accurate/">Are online tests accurate?</a></li>' +
        '<li><a href="/guides/fluid-vs-crystallised-intelligence/">Fluid vs crystallised</a></li>' +
        '<li><a href="/guides/iq-test-practice-questions/">Practice questions</a></li>' +
      '</ul></div>' +
      '<div><h4>Site</h4><ul>' +
        '<li><a href="/about/">About</a></li>' +
        '<li><a href="/contact/">Contact</a></li>' +
        '<li><a href="/privacy/">Privacy</a></li>' +
        '<li><a href="/terms/">Terms</a></li>' +
      '</ul></div>' +
    '</div>' +
    '<div class="footer-bottom">' +
      '<span>&copy; ' + year + ' ' + esc(cfg.name) + '</span>' +
      '<span>Scores are estimates with a stated margin of error, not diagnoses.</span>' +
    '</div>' +
    '</div></footer>';
}

function breadcrumbHtml(crumbs) {
  if (!crumbs || crumbs.length < 2) return '';
  var parts = crumbs.map(function (c, i) {
    var last = i === crumbs.length - 1;
    var href = url(c.slug).replace(cfg.origin, '');
    return last
      ? '<span aria-current="page">' + esc(c.name) + '</span>'
      : '<a href="' + href + '">' + esc(c.name) + '</a>';
  });
  return '<div class="wrap"><nav class="breadcrumb" aria-label="Breadcrumb">' +
    parts.join('<span aria-hidden="true">/</span>') + '</nav></div>';
}

/* -------------------------------------------------------------------- shell */

function render(page, css) {
  var canonical = url(page.slug);
  var desc = page.description || '';
  var ogImage = cfg.origin + '/assets/img/og-default.png';

  var jsonld = [];
  if (!page.slug) jsonld = jsonld.concat(siteJsonLd());
  if (page.breadcrumbs && page.breadcrumbs.length > 1) jsonld.push(breadcrumbJsonLd(page.breadcrumbs));
  if (page.jsonld) jsonld = jsonld.concat(page.jsonld);

  var ldTags = jsonld.map(function (o) {
    return '<script type="application/ld+json">' +
      JSON.stringify(o).replace(/</g, '\\u003c') + '</script>';
  }).join('');

  var scripts = (page.scripts || []).map(function (s) {
    return '<script src="' + s + '" defer></script>';
  }).join('');

  var head = [
    '<!doctype html>',
    '<html lang="' + cfg.lang + '">',
    '<head>',
    '<meta charset="utf-8">',
    '<meta name="viewport" content="width=device-width,initial-scale=1">',
    '<title>' + esc(page.title) + '</title>',
    '<meta name="description" content="' + esc(desc) + '">',
    '<link rel="canonical" href="' + canonical + '">',
    page.noindex
      ? '<meta name="robots" content="noindex,follow">'
      : '<meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1">',
    cfg.googleSiteVerification
      ? '<meta name="google-site-verification" content="' + esc(cfg.googleSiteVerification) + '">' : '',
    '<meta name="theme-color" content="#1f4470" media="(prefers-color-scheme: light)">',
    '<meta name="theme-color" content="#14161b" media="(prefers-color-scheme: dark)">',
    '<meta name="color-scheme" content="light dark">',
    // Open Graph
    '<meta property="og:type" content="' + (page.ogType || 'website') + '">',
    '<meta property="og:site_name" content="' + esc(cfg.name) + '">',
    '<meta property="og:title" content="' + esc(page.ogTitle || page.title) + '">',
    '<meta property="og:description" content="' + esc(desc) + '">',
    '<meta property="og:url" content="' + canonical + '">',
    '<meta property="og:locale" content="' + cfg.locale + '">',
    '<meta property="og:image" content="' + ogImage + '">',
    '<meta property="og:image:width" content="1200">',
    '<meta property="og:image:height" content="630">',
    '<meta name="twitter:card" content="summary_large_image">',
    '<meta name="twitter:title" content="' + esc(page.ogTitle || page.title) + '">',
    '<meta name="twitter:description" content="' + esc(desc) + '">',
    '<meta name="twitter:image" content="' + ogImage + '">',
    // icons
    '<link rel="icon" href="/favicon.svg" type="image/svg+xml">',
    '<link rel="apple-touch-icon" href="/assets/img/apple-touch-icon.png">',
    '<link rel="manifest" href="/site.webmanifest">',
    // ads / analytics origins
    cfg.ads.publisherId ? '<link rel="preconnect" href="https://pagead2.googlesyndication.com" crossorigin>' : '',
    page.head || '',
    '<style>' + css + '</style>',
    ldTags,
    '</head>',
    '<body' + (page.bodyClass ? ' class="' + page.bodyClass + '"' : '') + '>'
  ].filter(Boolean).join('\n');

  var adsScript = cfg.ads.publisherId
    ? '<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=' +
      esc(cfg.ads.publisherId) + '" crossorigin="anonymous"></script>'
    : '';

  var analytics = cfg.analyticsId
    ? '<script async src="https://www.googletagmanager.com/gtag/js?id=' + esc(cfg.analyticsId) + '"></script>' +
      '<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}' +
      'gtag("js",new Date());gtag("config","' + esc(cfg.analyticsId) + '",{anonymize_ip:true});</script>'
    : '';

  return head +
    '<a class="skip-link" href="#main">Skip to content</a>' +
    header(page.slug) +
    breadcrumbHtml(page.breadcrumbs) +
    '<main id="main">' + page.body + '</main>' +
    footer() +
    '<script src="/assets/js/site.js" defer></script>' +
    '<script src="/assets/js/ads.js" defer></script>' +
    scripts +
    adsScript +
    analytics +
    '</body></html>';
}

module.exports = { render: render, esc: esc, url: url, NAV: NAV, BRAND_MARK: BRAND_MARK, cfg: cfg };
