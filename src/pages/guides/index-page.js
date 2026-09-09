/* CogniScale - guides index. */
'use strict';

var P = require('../_parts.js');
var cfg = require('../../../site.config.js');

var GUIDES = [
  {
    href: '/guides/iq-score-ranges/',
    title: 'IQ score ranges and percentiles',
    text: 'A full table from 55 to 145 with percentiles and rarity, what the classification labels mean, ' +
      'why rarity accelerates at the tails, and the measurement error most tables leave out.',
    mins: 7
  },
  {
    href: '/guides/average-iq/',
    title: 'What is an average IQ?',
    text: 'Why the average is exactly 100 by construction rather than by measurement, how renorming and ' +
      'the Flynn effect work, how scores change with age, and why national IQ tables are unreliable.',
    mins: 8
  },
  {
    href: '/guides/are-online-iq-tests-accurate/',
    title: 'Are online IQ tests accurate?',
    text: 'Reliability, validity and norming - the three properties that separate a defensible online test ' +
      'from a number generator. Includes an eight-point checklist and this site marked against it.',
    mins: 9
  },
  {
    href: '/guides/fluid-vs-crystallised-intelligence/',
    title: 'Fluid vs crystallised intelligence',
    text: 'The distinction Cattell drew in 1963, how each ability is measured, why they move in opposite ' +
      'directions across a lifetime, and whether fluid reasoning can be trained.',
    mins: 8
  },
  {
    href: '/guides/iq-test-practice-questions/',
    title: 'IQ test practice questions, with worked answers',
    text: 'Six worked examples covering every question type on this site - matrices, boolean figure logic, ' +
      'number and letter series, spatial rotation and verbal analogies - with the reasoning spelled out.',
    mins: 10
  }
];

module.exports = {
  slug: 'guides',
  title: 'Guides to IQ Scores and Testing | CogniScale',
  ogTitle: 'Guides to IQ scores and cognitive testing',
  description: 'Sourced explainers on IQ score ranges, average IQ, how accurate online tests are, fluid vs crystallised intelligence, and practice questions.',
  updated: '2026-09-06',
  breadcrumbs: [{ slug: '', name: 'Home' }, { slug: 'guides', name: 'Guides' }],
  jsonld: [{
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Guides to IQ scores and cognitive testing',
    description: 'Sourced explainers on cognitive ability testing.',
    inLanguage: 'en',
    isPartOf: { '@id': cfg.origin + '/#website' },
    hasPart: GUIDES.map(function (g) {
      return { '@type': 'Article', headline: g.title, url: cfg.origin + g.href, description: g.text };
    })
  }],

  body:
    '<div class="wrap"><div class="page-head prose">' +
      '<h1>Guides</h1>' +
      '<p class="lede">Short, sourced explainers on what IQ scores are, how they are built, and how much ' +
      'weight any single number deserves. Every claim links to the research behind it.</p>' +
    '</div></div>' +

    '<div class="wrap" style="padding-bottom:20px">' +
      '<div class="grid grid-2">' +
        GUIDES.map(function (g) {
          return '<a class="card card-link" href="' + g.href + '">' +
            '<h3 style="margin-top:0">' + P.esc(g.title) + '</h3>' +
            '<p class="muted" style="font-size:.95rem">' + P.esc(g.text) + '</p>' +
            '<span class="more">Read &rarr; <span class="muted">' + g.mins + ' min</span></span></a>';
        }).join('') +
      '</div>' +
    '</div>' +

    P.adSlot('leaderboard', 'articleInline') +

    '<div class="wrap prose">' +
      '<h2>How these are written</h2>' +
      '<p>Every factual claim on these pages is either sourced to a named paper or textbook, or is a ' +
      'statement about how this site itself works. Where the research is contested - and in this field a ' +
      'good deal of it is - the guides say so rather than picking the tidier answer.</p>' +
      '<p>Where a claim concerns this test specifically, it links to ' +
      '<a href="/methodology/">the methodology page</a>, which describes the actual shipped ' +
      'implementation rather than an idealised version of it.</p>' +
      '<p>Found something wrong? <a href="/contact/">Tell us</a> &mdash; corrections are made and dated.</p>' +
    '</div>' +

    P.cta('Take the test', 'Thirty questions, about 30 minutes, and a score with the uncertainty attached.')
};
