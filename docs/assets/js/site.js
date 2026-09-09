/* CogniScale - site chrome: mobile navigation and the consent banner. */
(function () {
  'use strict';

  // ---------------------------------------------------------------- nav toggle
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('site-nav');

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });

    document.addEventListener('click', function (e) {
      if (!nav.classList.contains('open')) return;
      if (nav.contains(e.target) || toggle.contains(e.target)) return;
      nav.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('open')) {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.focus();
      }
    });
  }

  // ------------------------------------------------------------------ consent
  /* A lightweight preference banner.
   *
   * IMPORTANT, and stated here so it is not forgotten at launch: serving
   * personalised ads to users in the EEA or the UK requires a Google-certified
   * Consent Management Platform. This banner is NOT one. It records a local
   * preference and downgrades requests to non-personalised ads when the visitor
   * declines, which is the right default behaviour - but before taking European
   * traffic with ads enabled, install a certified CMP and let it own consent.
   * See README.md. */
  var KEY = 'cs.consent.v1';
  var stored = null;
  try { stored = localStorage.getItem(KEY); } catch (e) {}

  window.CSConsent = {
    value: stored,
    personalised: stored === 'all',
    decided: stored === 'all' || stored === 'essential'
  };

  if (!window.CSConsent.decided && document.querySelector('.ad-slot:not(.is-empty)')) {
    buildBanner();
  }

  function decide(value) {
    try { localStorage.setItem(KEY, value); } catch (e) {}
    window.CSConsent.value = value;
    window.CSConsent.personalised = value === 'all';
    window.CSConsent.decided = true;
    var b = document.getElementById('consent-banner');
    if (b) b.remove();
    if (window.CSAds && window.CSAds.fill) window.CSAds.fill();
  }

  function buildBanner() {
    var el = document.createElement('div');
    el.className = 'consent';
    el.id = 'consent-banner';
    el.setAttribute('role', 'dialog');
    el.setAttribute('aria-label', 'Cookie and advertising preferences');
    el.innerHTML =
      '<div class="wrap consent-inner">' +
        '<p>This site shows a small number of ads to stay free. Ads can use cookies to personalise what ' +
        'you see. Your test answers are never collected or shared either way &mdash; they never leave ' +
        'your browser. <a href="/privacy/">Privacy policy</a>.</p>' +
        '<div class="btn-row">' +
          '<button class="btn btn-ghost" type="button" id="consent-essential">Non-personalised only</button>' +
          '<button class="btn" type="button" id="consent-all">Accept</button>' +
        '</div>' +
      '</div>';
    document.body.appendChild(el);
    document.getElementById('consent-all').addEventListener('click', function () { decide('all'); });
    document.getElementById('consent-essential').addEventListener('click', function () { decide('essential'); });
  }
})();
