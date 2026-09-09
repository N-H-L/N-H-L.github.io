# CogniScale

A free, research-grounded online IQ test. Static site, no backend, no database,
no accounts. The test is generated and scored entirely in the visitor's browser.

**Live: https://cogniscale.vercel.app/**

```
npm run check     # verify items -> build -> audit -> smoke test
npm run dev       # build and serve at http://localhost:4173
npm run browser   # real headless Chrome: every page + sit the whole test
```

`npm run check` needs nothing running. `npm run browser` needs `npm run serve`
in another terminal; it loads all 14 pages at desktop and phone widths, fails on
any console error, failed request or sideways scroll, then actually sits the
30-question test and asserts a score, a confidence interval, four domain bars
and a per-question review all render.

Node 18+. No dependencies — everything (including the PNG encoder that makes the
social card) is built on Node's standard library.

---

## What makes this different from a typical free IQ test

| | Typical free test | This one |
|---|---|---|
| Scoring | count correct × a constant | 3PL item response model, EAP estimation |
| Result | a bare number | score **plus a 95% confidence interval** |
| Norms | undisclosed or absent | disclosed, and openly labelled provisional |
| Items | hand-drawn, unchecked | rule-generated, 657 machine assertions per build |
| Method | unpublished | `/methodology/`, 17 cited sources |
| Ads | between questions, paywalled results | never inside the test, never above the score |

The honest weakness — stated on the site itself, not buried here — is norming.
Item difficulties are *rational* (assigned from structural complexity, anchored
to published difficulty data for comparable item families), not *empirical*
(calibrated on a standardisation sample). See "Improving the norms" below.

---

## Layout

```
site.config.js            all site-wide settings — edit this, then rebuild
build.js                  static site generator

src/
  layout.js               the HTML shell: meta, Open Graph, JSON-LD, nav, footer
  pages/                  one module per page; each exports { slug, title, body, ... }
  data/items.js           THE ITEM BANK — 30 items, IRT parameters, rationales
  lib/
    prng.js               seeded RNG, so an item id always renders identically
    matrix.js             figural matrix engine (attribute rules + boolean logic)
    series.js             number/letter series engine (declarative generators)
    spatial.js            chiral polyomino rotation engine
    irt.js                3PL model, EAP estimation, reporting
    bank.js               assembles specs into runtime items
    render.js             SVG renderers (shared by browser and offline tools)

assets/
  css/main.css            inlined into every page at build time
  js/test.js              the test runner
  js/site.js              nav + consent banner
  js/ads.js               ad loading, with the "never during the test" rule

tools/
  verify-items.js         proves the item bank is sound          (npm run verify)
  independent-check.js    re-derives every answer from scratch   (npm run independent)
  series-ambiguity.js     hunts for a second defensible answer   (npm run ambiguity)
  dump-items.js           plain-text dump of the bank for review
  audit.js                SEO + link + a11y audit of dist/       (npm run audit)
  smoke.js                runs the shipped bundle end to end     (npm run smoke)
  contact-sheet.js        renders every item to one HTML page    (npm run preview)
  browser-check.js        drives real headless Chrome over CDP   (npm run browser)
  shots.js                legible viewport screenshots           (npm run shots)
  shot-results.js         screenshots a completed score report
  probe-overflow.js       names elements that break the viewport
  make-images.js          generates og-default.png, icons
  serve.js                static dev server with clean URLs

dist/                     build output — deploy this directory
```

`src/lib/*.js` are UMD modules. The **same files** run in the browser and in the
offline verifier, so the scoring you test is the scoring that ships. There is no
second implementation to drift.

---

## The checks

`npm run check` runs verify -> independent -> ambiguity -> build -> audit -> smoke.
Each exits non-zero on failure.

Two of these exist specifically because a verifier that shares code with the
generator will happily agree with its own bugs:

**`npm run independent`** re-derives all 30 keyed answers using a *separate*
implementation of the rule algebra, boolean operators and polyomino geometry.
It touches nothing in `src/lib` except the finished item objects it is auditing.
It also proves every spatial target is chiral (so mirrored distractors can never
be valid) and that no second boolean operator explains any logic matrix.

**`npm run ambiguity`** attacks the series items the way a sceptical test-taker
would: it fits seven rule families (constant difference, constant ratio, second
difference, affine recurrence, cyclic differences, interleaved runs, exact
polynomial) to the shown terms and reports every next-term any surviving rule
predicts. It fails if a rival rule fits all the shown terms *and* its prediction
is on the option list.

**`npm run verify` — is the item bank sound?**
657 assertions. Exactly one correct option per item; no two options that render
identically; a matrix answer genuinely determined by a row rule; rotation only
on shapes where rotation is visible; a boolean matrix explained by exactly one
operator; every series answer re-derived from its declared generator; every
spatial target actually chiral; no figure clipped by its box; no gap in the
difficulty ladder.

**`npm run audit` — will search engines and users be able to use it?**
Every internal link resolves; one `<h1>` per page; title and description within
length; self-referencing canonical; valid JSON-LD; Open Graph complete; sitemap
and robots consistent; no ad markup inside the test flow; images have alt text.

**`npm run smoke` — does the shipped bundle actually work?**
Evaluates `dist/assets/js/engine.js` in a V8 context, builds all 30 items,
renders every stimulus and option, checks scoring is monotonic and that both
score bounds are reachable, and verifies that **every element id the runner
looks up exists in the built `/test/` page**.

`npm run preview` writes `.preview/contact-sheet.html` — every item rendered on
one page with its answer marked. Open it in a browser before changing items.

---

## Configuration

Everything lives in `site.config.js`.

```js
origin: 'https://cogniscale.com'   // no trailing slash; drives canonicals + sitemap
contactEmail: '...'
ads: { publisherId: '', slots: {...} }
analyticsId: ''
test: { timeLimitSeconds, reportFloor, reportCeiling }
googleSiteVerification: ''
```

With `ads.publisherId` empty the site builds with ad containers **hidden** and no
ad code emitted — the correct state before AdSense approval. Layout is identical
either way, because the containers reserve their height regardless.

`reportFloor` / `reportCeiling` bound what the test can actually resolve.
`npm run smoke` asserts both bounds are *reachable*, which is a check worth
keeping: the ceiling was originally 140 while the maximum attainable estimate
was 138, so nothing was ever capped and the claim did nothing.

---

## Deploying

`dist/` is a plain static directory. Netlify, Cloudflare Pages, GitHub Pages,
S3 + CloudFront, or any web server.

```
Build command:      npm run build
Publish directory:  dist
```

Before going live:

1. Set `origin` in `site.config.js` to the real domain and rebuild. Canonicals,
   the sitemap and JSON-LD all derive from it; getting it wrong is the single
   most damaging configuration mistake available.
2. Serve over HTTPS and pick one canonical host (`www` or apex, not both) with a
   301 from the other.
3. Configure `404.html` as the error document.
4. Suggested caching: `/assets/*` immutable for a year; HTML `no-cache`.
   The build inlines CSS, so there is no separate stylesheet to cache.

---

## SEO: what was actually done

All of it is the documented, boring kind. There is **no cloaking, no doorway
pages, no keyword stuffing and no link scheme** — those are explicit Google spam
policy violations and the penalty is deindexing, which costs more traffic than
the tricks could win.

**Technical**
- Clean URLs, one `<h1>` per page, self-referencing canonicals
- CSS inlined (no render-blocking request), JS deferred, system fonts only
- Ad containers height-reserved so ads cannot cause layout shift (CLS)
- No web fonts, no framework, no third-party JS other than the ad tag
- `sitemap.xml`, `robots.txt`, `ads.txt`, web manifest, real PNG icons

**Structured data** — `WebSite` + `SearchAction`, `Organization`, `WebApplication`
for the test, `Article` with a full `citation` list on every guide and on the
methodology page, `BreadcrumbList`, `FAQPage`, `CollectionPage`, and `Quiz` in
Google's practice-problem shape on the practice questions page.

**Content / E-E-A-T.** This is the part that matters most for a subject like
this one, which Google treats as sensitive. The site publishes its method, cites
17 sources, states nine limitations, dates every page, names how it is funded,
and says plainly where it is weak. A page that admits its own error bars is
doing the thing the guidelines actually ask for.

**Targeted queries** — `free iq test`, `iq test`, `iq score ranges`,
`what is an average iq`, `are online iq tests accurate`, `iq test practice
questions`, `fluid vs crystallised intelligence`. Each has one page that is the
best answer to that specific question rather than five thin pages chasing
variants.

**After launch**
1. Verify in Google Search Console (paste the token into
   `googleSiteVerification`, or verify by DNS) and submit `sitemap.xml`.
2. Also submit to Bing Webmaster Tools.
3. Watch Core Web Vitals in Search Console; the site should pass comfortably.
4. Expect three to six months before ranking for competitive head terms. The
   guide pages will pick up long-tail traffic considerably sooner.

---

## Enabling AdSense

1. Apply at [google.com/adsense](https://www.google.com/adsense/). Approval
   needs real content, clear navigation, and privacy/terms/about/contact pages
   — all present.
2. On approval, put your `ca-pub-…` id into `ads.publisherId`, create three
   responsive display units, and paste their slot ids into `ads.slots`.
3. Rebuild. `ads.txt` is generated from the publisher id automatically.

**Consent — read this before taking European traffic.** `assets/js/site.js`
implements a lightweight preference banner that records a local choice and
requests non-personalised ads when the visitor declines. **It is not a certified
CMP.** Serving personalised ads to visitors in the EEA or the UK requires a
Google-certified Consent Management Platform. Install one and let it own consent
before enabling ads for that traffic.

**The ad rules are enforced in code, not by good intentions** (`assets/js/ads.js`):
no slot fills while a question is on screen; only containers already in the
document with reserved height; nothing before a consent decision; each slot
filled once. No sticky, interstitial, pop-up, auto-play or full-screen formats
anywhere — all Better Ads Standards violations, and Chrome filters sites that
use them. `npm run audit` fails the build if an ad slot appears inside the test.

---

## Changing the test

Edit `src/data/items.js`, then **always** run `npm run check`.

Adding an item: give it an `id`, a `domain` (`MR`/`NL`/`VR`/`SR`), a difficulty
`b` on the theta scale (0 = average, 1 = +1 SD), and a `rationale` that explains
the reasoning — it is shown to the test taker after scoring. Matrix items take a
`rules` object; series items a `gen` generator spec; spatial items a `cells`
polyomino; verbal items `options` plus `answerText`.

The verifier will reject an item that is ambiguous, has duplicate-rendering
options, or leaves a hole in the difficulty ladder. Then open
`npm run preview` and look at it, because "logically sound" and "legible" are
different properties.

Difficulty `b` drives everything downstream — the score, the precision table on
`/methodology/`, and the blueprint table. Both of those tables are computed from
the live bank at build time, so they cannot silently go stale.

---

## Improving the norms

The clear next step, and the one that would most improve the product.

The site currently collects nothing, which is a real privacy feature and the
reason the norms are provisional. To calibrate empirically you would need to
collect anonymous response patterns — which means a backend, a privacy policy
change, and a consent flow that is honest about the swap. Roughly:

1. Add an explicit, opt-in "help improve this test" step, defaulting to off.
2. Collect only the response vector (30 booleans) plus coarse metadata. No
   identifiers.
3. At a few thousand complete responses, estimate 2PL/3PL parameters (`mirt` in
   R, or `girth` in Python) and replace the rational `b` values.
4. Report the empirical reliability on `/methodology/` and rewrite section 6.

Until then, the site says the number is the least trustworthy part of the
report — and it should keep saying so.

---

## Known limitations

- **Norms are provisional.** See above, and `/methodology/#norms`.
- **Not age-normed.** The battery leans on fluid reasoning, which declines with
  age, so older test takers are scored slightly harshly relative to a properly
  age-normed instrument.
- **Item exposure.** Thirty fixed items. A popular test eventually leaks. The
  generators can produce effectively unlimited alternates — moving to a randomly
  drawn form per session is the fix, and it needs per-item calibration first.
- **English only.** The verbal items assume fluent English.
- **Requires JavaScript.** Unavoidable given that scoring happens client-side;
  the `/test/` page says so, and the rest of the site works without it.

---

## Deploying

Production is **Vercel**: https://cogniscale.vercel.app/

```
npm run check          # never ship a red build - this gates the item bank
vercel deploy --prod   # builds from vercel.json and aliases cogniscale.vercel.app
git add -A && git commit -m "..." && git push
```

`vercel.json` runs the same build as `npm run build`, publishes `docs/`, and
sets cache headers. HTML must revalidate; `assets/` gets a short cache with
background revalidation, because asset filenames are **not** content-hashed -
caching them immutably would pin an old test engine in people's browsers.

### The old GitHub Pages URL

The repository is `N-H-L/N-H-L.github.io`, so GitHub serves a copy at
https://n-h-l.github.io/ as well. GitHub does not allow a `user.github.io`
site to be switched off, so that copy handles itself two ways:

- every page carries `rel="canonical"` pointing at `origin`, which is what
  search engines consolidate on; and
- `legacyHosts` in `site.config.js` makes those pages redirect a real visitor
  to the same path on the canonical host.

`build.js` also writes `docs/.nojekyll`, without which Pages renders README.md
as the site index and skips any path beginning with an underscore.

### Moving to a custom domain

Change `origin` in `site.config.js` and rebuild **before** deploying - `origin`
is what canonical tags, the sitemap, `robots.txt` and the Open Graph tags are
built from. A canonical pointing at a domain you do not own will get the site
dropped from search results. Then `vercel domains add <domain>` and follow the
DNS instructions. Add the old Vercel host to `legacyHosts` at the same time.

---

## Turning ads on

Ads are fully wired but emit **nothing** until a publisher id is set. Until
then the slots are inert placeholders and no Google script is loaded at all.

1. **Get a custom domain first.** AdSense reviews a live site, and in practice
   it does not approve free platform subdomains - `*.vercel.app`, `*.github.io`,
   `*.netlify.app` are all reported as rejected, usually behind a generic
   "content" reason rather than an explicit one. A domain you own is the only
   reliable route.
2. Apply at adsense.google.com and wait for approval (days to weeks).
3. Paste the publisher id into `site.config.js`:

   ```js
   ads: {
     publisherId: 'ca-pub-XXXXXXXXXXXXXXXX',
     slots: { homeBelowFold: '', articleInline: '', resultsBelow: '' }
   }
   ```

   Slot ids are optional. Left blank, the units run as responsive auto ads.
   Fill them in later from the AdSense dashboard for per-unit reporting.
4. `npm run check && git add -A && git commit && git push`.

The build then emits, automatically:

- the `adsbygoogle.js` loader plus a `preconnect` to Google's ad host
- one `<ins class="adsbygoogle">` per slot
- `ads.txt` at the site root, containing your publisher line

### The placement rules, and why

These are enforced in code, not left to discipline:

| Rule | Where | Why |
|---|---|---|
| No ads during the test | `assets/js/ads.js` checks `#screen-test` is not active, and the results unit lives inside a `<template>` until the test ends | An ad beside a timed reasoning item is both a misclick trap and a confound on the score |
| Never above the score | the results unit renders below the score card | Burying the result under an ad is what makes free IQ sites untrustworthy |
| No sticky, interstitial, pop-up or auto-play units | only in-flow responsive units are generated | These are the formats the Coalition for Better Ads found correlate most with ad-blocker adoption |
| Space reserved before load | `.ad-slot[data-reserved]` sets a min-height | Stops ads shifting the page, which protects Cumulative Layout Shift |
| Consent first | `assets/js/site.js` gates on `CSConsent`; declining serves non-personalised ads via `requestNonPersonalizedAds` | The banner is a minimal stand-in. For real EU traffic, install a Google-certified CMP and let it own consent. |

### Getting found

Search Console needs your Google account, so it is a manual step:

1. Add `https://cogniscale.vercel.app/` as a property at
   search.google.com/search-console (verify with the HTML tag - paste it into
   `googleSiteVerification` in `site.config.js` and rebuild).
2. Submit `https://cogniscale.vercel.app/sitemap.xml`.

Ranking for a query like "iq test" is a long game against established sites.
The honest levers here are the ones already built in: fast static pages, real
cited content, correct structured data, and a methodology page that earns links.
