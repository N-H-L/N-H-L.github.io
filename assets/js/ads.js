/* CogniScale - ad loading.
 *
 * The rules this file enforces, so that "unobtrusive" is a property of the code
 * rather than a promise in the copy:
 *
 *   1. NEVER inside the test. If the page is showing a question, no slot fills.
 *      Interrupting someone mid-item would corrupt the measurement as well as
 *      annoy them.
 *   2. Only slots that are already in the document, with their height reserved
 *      by CSS. Nothing is injected into the flow at run time, so ads cannot
 *      cause layout shift.
 *   3. Nothing until a consent decision exists, and non-personalised requests
 *      when the visitor declined.
 *   4. Every slot filled at most once.
 *   5. No sticky, interstitial, pop-up, auto-play or full-screen formats
 *      anywhere in this file or the stylesheet. Those are Better Ads Standards
 *      violations; sites that use them get filtered by Chrome.
 */
(function () {
  'use strict';

  var cfg = (window.CS && window.CS.config) || {};
  var filled = new WeakSet();

  function testInProgress() {
    var t = document.getElementById('screen-test');
    return !!(t && t.classList.contains('active'));
  }

  function fill() {
    if (!cfg.publisherId) return;
    if (testInProgress()) return;

    var consent = window.CSConsent;
    if (!consent || !consent.decided) return;

    if (!consent.personalised) {
      // Ask Google for non-personalised ads before the first push.
      (window.adsbygoogle = window.adsbygoogle || []).requestNonPersonalizedAds = 1;
    }

    document.querySelectorAll('.ad-slot:not(.is-empty)').forEach(function (slot) {
      if (slot.closest('#screen-test')) return;          // belt and braces
      var ins = slot.querySelector('ins.adsbygoogle');
      if (!ins || filled.has(ins)) return;
      if (ins.getAttribute('data-adsbygoogle-status')) return;
      if (!ins.offsetParent && slot.offsetParent === null) return;   // not visible yet
      filled.add(ins);
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (e) {
        filled.delete(ins);
      }
    });
  }

  window.CSAds = { fill: fill };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fill);
  } else {
    fill();
  }
})();
