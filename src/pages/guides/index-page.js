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
    href: '/guides/what-iq-predicts/',
    title: 'What IQ actually predicts',
    text: 'School results, job performance, income and lifespan - with the correlations stated plainly, ' +
      'including the 2022 revision that cut the job-performance estimate from 0.51 to 0.31.',
    mins: 9
  },
  {
    href: '/guides/can-you-improve-your-iq/',
    title: 'Can you improve your IQ?',
    text: 'Brain training barely transfers; education reliably adds one to five points a year. The honest ' +
      'evidence on raising a score versus raising the ability underneath it.',
    mins: 9
  },
  {
    href: '/guides/iq-and-age/',
    title: 'How IQ changes with age',
    text: 'Fluid reasoning declines while vocabulary keeps rising into the sixties - and age norming is ' +
      'why your score can stay flat through all of it.',
    mins: 8
  },
  {
    href: '/guides/fluid-vs-crystallised-intelligence/',
    title: 'Fluid vs crystallised intelligence',
    text: 'The distinction Cattell drew in 1963, how each ability is measured, why they move in opposite ' +
      'directions across a lifetime, and whether fluid reasoning can be trained.',
    mins: 8
  },
  {
    href: '/guides/working-memory-and-intelligence/',
    title: 'Working memory and intelligence',
    text: 'One of the strongest correlates of reasoning ability, why matrix items lean on it so heavily, ' +
      'and why training it still fails to raise IQ.',
    mins: 8
  },
  {
    href: '/guides/iq-vs-eq/',
    title: 'IQ vs EQ',
    text: 'Emotional intelligence is real but smaller than the popular claim. Ability EI, trait EI, the ' +
      'personality overlap, and where "matters more than IQ" came from.',
    mins: 8
  },
  {
    href: '/guides/are-iq-tests-biased/',
    title: 'Are IQ tests biased?',
    text: 'Bias has three distinct technical meanings and none of them is "a score gap". What the evidence ' +
      'settles, what it cannot, and where this test is weakest.',
    mins: 9
  },
  {
    href: '/guides/are-online-iq-tests-accurate/',
    title: 'Are online IQ tests accurate?',
    text: 'Reliability, validity and norming - the three properties that separate a defensible online test ' +
      'from a number generator. Includes an eight-point checklist and this site marked against it.',
    mins: 9
  },
  {
    href: '/guides/how-iq-tests-are-made/',
    title: 'How IQ tests are built and normed',
    text: 'Blueprint, item piloting, item statistics, standardisation sample, reliability and validity - ' +
      'and which stage cheap tests quietly skip.',
    mins: 9
  },
  {
    href: '/guides/types-of-iq-tests/',
    title: 'The main types of IQ test',
    text: 'Clinical batteries, non-verbal matrices, group tests and online tests compared on what they ' +
      'sample, who may administer them, and what their scores support.',
    mins: 8
  },
  {
    href: '/guides/ravens-progressive-matrices/',
    title: "How Raven's Progressive Matrices work",
    text: 'The design that has dominated non-verbal testing since 1938, what makes one item harder than ' +
      'another, and why this site generates its own rather than using the originals.',
    mins: 8
  },
  {
    href: '/guides/mensa-and-high-iq-societies/',
    title: 'Mensa and high-IQ societies',
    text: 'The 98th percentile criterion, why it converts to 130, 132 or 148 depending on the scale, and ' +
      'why no unsupervised online score can ever qualify you.',
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
  description: 'Fifteen sourced explainers on IQ scores, what they predict, how tests are built and normed, whether they are biased, and how much weight a single number deserves.',
  updated: '2026-09-09',
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
