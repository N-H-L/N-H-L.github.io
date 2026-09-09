# Launch checklist

Getting from "live on a free subdomain" to "earning from ads". Steps are in
dependency order — each one genuinely blocks the next, so doing them out of
order mostly means waiting twice.

**Where things stand**

| | |
|---|---|
| Live at | https://cogniscale.org/ |
| Host | Vercel (project `cogniscale`, scope `delighted-projects`) |
| Repo | https://github.com/N-H-L/N-H-L.github.io |
| Ads | wired, tested, and emitting **nothing** until a publisher id is set |
| Blocking monetisation | nothing outstanding - awaiting indexing, then apply |

Legend: **[you]** needs your account, your money, or your identity — I can't do
it. **[me]** I can do it; just say go.

---

## 0. Check you're eligible — 2 minutes **[you]**

AdSense requires the account holder to be **18 or over**. If you're not, this
isn't a blocker on the site, but the account has to be held by a parent or
guardian in their own name, and **payments go to them**. Worth settling before
you spend anything, because it changes whose name everything is in.

You'll also need a bank account or payment method in the account holder's name
and country for payouts, and an address Google can post a PIN verification card
to once earnings pass the threshold.

---

## 1. Buy a domain — 5 minutes, ~$8.49 **[you]**

This is the real blocker. `*.vercel.app` is rejected by AdSense the same way
`*.github.io` is, because you don't own the top-level domain — Vercel does.
Nothing else on this list matters until this is done.

Checked and available as of this writing:

| Domain | First year | Renewal |
|---|---|---|
| **`cogniscale.org`** ← recommended | $8.49 | $10.99/yr |
| `cogniscale.app` / `.dev` | | |
| `cogniscaleiq.com`, `getcogniscale.com`, `cogniscalehq.com` | | |

`cogniscale.com`, `.net`, `.io` and `.co` are all taken.

**Why `.org`:** exact brand match with no prefix hack, and the TLD reinforces
the research-led positioning the whole site is built on. AdSense has no TLD
restriction. I'd avoid `.app`/`.dev` — they're Google's developer TLDs and read
as technical to someone who just wants to take an IQ test — and avoid the
`get-`/`-hq` variants, which dilute the brand.

Buy it either way:

```
vercel domains buy cogniscale.org      # simplest: DNS is configured for you
```

or from any registrar (Cloudflare and Porkbun are usually cheaper at renewal)
and point the nameservers at Vercel. AdSense does not care which you choose.

**Turn auto-renew on.** A lapsed domain after you've built ranking is a
genuinely expensive mistake.

---

## 2. Attach the domain — 5 minutes **[me]**

Tell me the domain and I'll do all of this in one pass:

1. `vercel domains add <domain> cogniscale`
2. Set `origin` in `site.config.js` to the new domain — this is what canonical
   tags, `sitemap.xml`, `robots.txt` and the Open Graph tags are generated
   from. Getting it wrong is how sites get dropped from search entirely.
3. Add `cogniscale.vercel.app` to `legacyHosts` so the current URL redirects to
   the new one instead of competing with it for the same rankings.
4. Rebuild, redeploy, and re-run the full verification against the live domain.

Don't skip step 3 by hand-editing later — two live copies of the same site
split your ranking signals, which is the opposite of what you're trying to do.

---

## 3. Content ~ DONE

AdSense's 2026 site review looks for roughly 15-20 articles that answer real
questions and show genuine expertise. As of 9 September 2026:

| | Count | Words |
|---|---|---|
| Guides | 15 | ~1,300-1,800 each |
| Methodology | 1 | 2,767 |
| **Total substantial pieces** | **16** | **~25,800** |

Every guide carries numbered citations to named papers, a table of contents,
an FAQ block with matching structured data, and cross-links to related guides.

Remaining topics, if more depth is ever wanted: the Flynn effect as a
standalone piece, IQ and creativity, twin studies and heritability, the history
of intelligence testing, and IQ in education policy.

---

## 4. Get indexed — 10 minutes, then wait days **[you]**

AdSense will not approve a site Google hasn't indexed. Do this the day the
domain goes live, because the waiting happens in parallel with step 3.

1. Go to [Google Search Console](https://search.google.com/search-console) and
   add `https://<your-domain>/` as a **URL prefix** property.
2. Choose **HTML tag** verification. Copy the `content="..."` value, tell me,
   and I'll put it in `site.config.js` and redeploy. (Or verify by DNS at your
   registrar, which survives redeploys — slightly better if you're comfortable.)
3. Once verified, go to **Sitemaps** and submit `sitemap.xml`.
4. Use **URL Inspection** on the homepage and click **Request Indexing**.

Then wait. First indexing typically takes a few days to a couple of weeks. You
can check progress with `site:yourdomain.org` in Google.

---

## 5. Apply to AdSense — 15 minutes, then 1–3 weeks **[you]**

Only once the domain is live **and** the site shows up in Google.

1. Sign up at [adsense.google.com](https://adsense.google.com) with the account
   holder's Google account.
2. Add your site and copy the publisher id — it looks like
   `ca-pub-1234567890123456`.
3. **Send it to me before you finish the setup.** I'll put it in
   `site.config.js` and redeploy, which makes the build emit both the
   verification snippet and `ads.txt` with your publisher line. Having
   `ads.txt` in place at the moment you apply removes one variable that
   commonly stalls review.
4. Submit for review and wait. Typically 1–3 weeks. A rejection is not fatal —
   it's usually a content-volume signal, which is what step 3 is for.

The trust pages reviewers check for are already built and linked in the footer:
About, Contact, Privacy and Terms.

---

## 6. Switch ads on — 2 minutes **[me]**

On approval, the publisher id from step 5 goes in and I redeploy. The build then
emits, automatically:

- the `adsbygoogle.js` loader and a `preconnect` to Google's ad host
- one `<ins class="adsbygoogle">` per configured slot
- `ads.txt` at the site root with your publisher line

Slot ids are optional. Left blank, the units run as responsive auto ads; fill
them in later from the AdSense dashboard if you want per-unit reporting.

### What stays off, permanently

These are enforced in code, not left to discipline. They cost some revenue per
visit, and they are the reason the site can claim to be trustworthy at all:

| Rule | Enforced by |
|---|---|
| No ads at any point during the test | `assets/js/ads.js` checks `#screen-test` isn't active; the results unit sits inside a `<template>` until the test ends |
| Never above the score | the results unit renders below the score card |
| No sticky, interstitial, pop-up or auto-play formats | only in-flow responsive units are generated |
| Space reserved before load | `.ad-slot[data-reserved]` min-heights, so ads can't shift the page |
| Consent first | `assets/js/site.js` gates on `CSConsent`; declining serves non-personalised ads |

The consent banner is a minimal stand-in. **If you get meaningful EU traffic,
replace it with a Google-certified CMP** and let that own consent — the current
one is honest but not a compliance product.

---

## Expectations worth setting

**Ranking for "iq test" is brutal.** It's a high-commercial-intent query owned
by sites with years of backlinks. The technical SEO here is done properly and
the content is genuinely differentiated, but realistic first traffic comes from
long-tail queries — "what does an IQ of 115 mean", "are online IQ tests
accurate" — which is exactly what the guides target. Think months.

**Early earnings will be small.** Display ads on a new site with modest traffic
earn on the order of dollars per thousand visits. The domain costs ~$11/yr; that
is the honest bar to clear first.

**The site's real asset is that it doesn't lie.** It publishes its method, shows
a confidence interval instead of a bare number, explains every wrong answer, and
says plainly that its norms are provisional. That's what earns links and repeat
visits, and it's worth more than any ad placement you could add.

---

## Deploy loop

```
npm run check          # 661 + 207 + 633 assertions; never ship a red build
vercel deploy --prod
git add -A && git commit -m "..." && git push
```
