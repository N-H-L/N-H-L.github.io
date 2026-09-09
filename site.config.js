/* ---------------------------------------------------------------------------
 * CogniScale - single source of truth for site-wide settings.
 * Edit this file, then run `npm run build`.
 * ------------------------------------------------------------------------- */
module.exports = {
  // ---- Identity -----------------------------------------------------------
  name: 'CogniScale',
  tagline: 'Free IQ Test',
  // No trailing slash. Used for canonical URLs, sitemap, Open Graph and JSON-LD.
  origin: 'https://n-h-l.github.io',
  // Build output directory. GitHub Pages serves a user site from either the
  // repository root or /docs on the default branch; /docs keeps the source and
  // the published site together on one branch.
  outDir: 'docs',

  locale: 'en_US',
  lang: 'en',
  contactEmail: 'hello@cogniscale.com',

  // ---- Google AdSense -----------------------------------------------------
  // Leave `publisherId` empty to build the site with ad slots reserved but no
  // ad code emitted (useful before AdSense approval, and for local testing).
  // Once approved, paste your ca-pub-XXXXXXXXXXXXXXXX id and the slot ids.
  ads: {
    publisherId: '',          // e.g. 'ca-pub-1234567890123456'
    slots: {
      homeBelowFold: '',      // responsive in-feed unit, home page, below the fold
      articleInline: '',      // responsive in-article unit, mid-article
      resultsBelow: ''        // responsive display unit, BELOW the score card
    },
    // Hard rules enforced by assets/js/ads.js - see /methodology + /about.
    // No ads during the test. No sticky, interstitial, pop-up or auto-play units.
    enabledOnTest: false
  },

  // ---- Analytics (optional) ----------------------------------------------
  // Paste a GA4 measurement id (G-XXXXXXX) or leave blank for no analytics.
  analyticsId: '',

  // ---- Test configuration -------------------------------------------------
  // reportFloor / reportCeiling bound the range this test can actually resolve.
  // With 30 items the attainable estimates run from about 62 (everything wrong)
  // to about 138 (everything right), so the band is set INSIDE that: beyond it
  // the standard error exceeds ~6 IQ points and a point estimate would be
  // false precision. Scores past a bound are reported as "135+" / "under 65"
  // rather than as a number. `npm run smoke` asserts both bounds are reachable,
  // so this can never silently become a claim that does nothing.
  test: {
    timeLimitSeconds: 30 * 60,
    reportFloor: 65,
    reportCeiling: 135
  },

  // ---- Search Console ------------------------------------------------------
  // Paste the content value of the google-site-verification meta tag, if you
  // choose to verify by HTML tag rather than by DNS.
  googleSiteVerification: ''
};
