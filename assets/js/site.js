/* CogniScale - site chrome: mobile navigation.
 * Advertising consent is handled by Google's certified CMP (Privacy &
 * messaging in AdSense), which ships with the adsbygoogle loader. A
 * home-made banner is not a certified CMP and cannot lawfully take its
 * place for EEA or UK traffic, so this file no longer renders one. */
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

})();
