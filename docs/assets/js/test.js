/* CogniScale - the test runner.
 *
 * Everything here happens on the visitor's device. Items are generated locally
 * by the shared engine bundle, answers live in sessionStorage, and scoring runs
 * against the same IRT module the offline verifier uses. Nothing is uploaded,
 * which is a privacy property and also the reason no account is needed.
 */
(function () {
  'use strict';

  var CS = window.CS;
  if (!CS || !CS.bank || !CS.irt || !CS.render) return;

  var cfg = CS.config;
  var STORE_KEY = 'cs.test.v2';

  var items = CS.bank.build();
  var N = items.length;

  var state = {
    answers: new Array(N).fill(null),
    index: 0,
    startedAt: null,
    finished: false,
    blurEvents: 0
  };

  var el = {};
  var tick = null;

  // ------------------------------------------------------------- persistence

  function save() {
    try {
      sessionStorage.setItem(STORE_KEY, JSON.stringify({
        answers: state.answers, index: state.index,
        startedAt: state.startedAt, finished: state.finished, blurEvents: state.blurEvents
      }));
    } catch (e) { /* private mode, quota - progress just will not survive a refresh */ }
  }

  function load() {
    try {
      var raw = sessionStorage.getItem(STORE_KEY);
      if (!raw) return false;
      var s = JSON.parse(raw);
      if (!s || !Array.isArray(s.answers) || s.answers.length !== N) return false;
      state.answers = s.answers;
      state.index = Math.min(Math.max(s.index | 0, 0), N - 1);
      state.startedAt = s.startedAt || null;
      state.finished = !!s.finished;
      state.blurEvents = s.blurEvents | 0;
      return true;
    } catch (e) { return false; }
  }

  function clearSaved() {
    try { sessionStorage.removeItem(STORE_KEY); } catch (e) {}
  }

  // ------------------------------------------------------------------ screens

  function show(id) {
    ['screen-intro', 'screen-test', 'screen-results'].forEach(function (s) {
      var node = document.getElementById(s);
      if (node) node.classList.toggle('active', s === id);
    });
    window.scrollTo({ top: 0, behavior: 'auto' });
  }

  // -------------------------------------------------------------------- timer

  function remaining() {
    if (!state.startedAt) return cfg.timeLimitSeconds;
    var used = (Date.now() - state.startedAt) / 1000;
    return Math.max(0, cfg.timeLimitSeconds - used);
  }

  function fmt(sec) {
    var m = Math.floor(sec / 60), s = Math.floor(sec % 60);
    return m + ':' + (s < 10 ? '0' : '') + s;
  }

  function startTimer() {
    if (tick) clearInterval(tick);
    tick = setInterval(function () {
      var r = remaining();
      if (el.timer) {
        el.timer.textContent = fmt(r);
        el.timer.classList.toggle('low', r <= 120);
      }
      if (r <= 0) {
        clearInterval(tick);
        finish(true);
      }
    }, 500);
  }

  // ----------------------------------------------------------- rendering a Q

  function questionHtml(item, idx) {
    var stim = CS.render.stimulus(item);
    var optClass = item.type === 'verbal' ? 'opts-text'
      : (item.type === 'series' ? 'opts-term' : 'opts-fig');

    var opts = item.options.map(function (value, i) {
      var checked = state.answers[idx] === i ? ' checked' : '';
      return '<label class="opt">' +
        '<input type="radio" name="q' + idx + '" value="' + i + '"' + checked + '>' +
        '<span class="opt-key" aria-hidden="true">' + String.fromCharCode(65 + i) + '</span>' +
        '<span class="visually-hidden">Option ' + String.fromCharCode(65 + i) + ': </span>' +
        CS.render.option(item, value) +
        '</label>';
    }).join('');

    var stemBlock = item.type === 'verbal'
      ? '<p class="q-stem">' + CS.render.escapeHtml(item.stem) + '</p>'
      : '';

    var promptBlock = item.prompt
      ? '<p class="q-prompt">' + CS.render.escapeHtml(item.prompt) + '</p>' : '';

    var stimBlock = '';
    if (item.type === 'spatial') {
      stimBlock = '<div class="stim-wrap"><div class="spatial-stim">' + stim +
        '<span class="arrow" aria-hidden="true">&rarr;</span>' +
        '<span class="muted small">rotate this</span></div></div>';
    } else if (stim) {
      stimBlock = '<div class="stim-wrap">' + stim + '</div>';
    }

    return '<article class="q-card">' +
      '<div class="q-meta">' +
        '<span class="q-domain">' + CS.render.escapeHtml(item.domainName) + '</span>' +
        '<span class="small muted">Question ' + (idx + 1) + ' of ' + N + '</span>' +
      '</div>' +
      '<h2 class="visually-hidden" id="q-heading" tabindex="-1">Question ' + (idx + 1) + '</h2>' +
      stemBlock + promptBlock + stimBlock +
      '<fieldset class="options ' + optClass + '">' +
        '<legend class="visually-hidden">Choose one answer</legend>' + opts +
      '</fieldset>' +
      '</article>';
  }

  function renderQuestion() {
    var item = items[state.index];
    el.host.innerHTML = questionHtml(item, state.index);

    el.host.querySelectorAll('input[type=radio]').forEach(function (input) {
      input.addEventListener('change', function () {
        state.answers[state.index] = parseInt(input.value, 10);
        save();
        updateChrome();
      });
    });

    el.prev.disabled = state.index === 0;
    el.next.textContent = state.index === N - 1 ? 'Finish' : 'Next';
    updateChrome();

    var h = document.getElementById('q-heading');
    if (h) h.focus({ preventScroll: true });
  }

  function updateChrome() {
    var answered = state.answers.filter(function (a) { return a !== null; }).length;
    el.progressText.textContent = 'Question ' + (state.index + 1) + ' of ' + N;
    el.progressFill.style.width = ((state.index + 1) / N * 100).toFixed(1) + '%';
    el.progressBar.setAttribute('aria-valuenow', String(state.index + 1));
    el.answered.textContent = answered === N
      ? 'All ' + N + ' answered. You can review with Previous, or finish.'
      : answered + ' of ' + N + ' answered. Unanswered questions are scored as incorrect.';
  }

  function go(delta) {
    var next = state.index + delta;
    if (next < 0) return;
    if (next >= N) { finish(false); return; }
    state.index = next;
    save();
    renderQuestion();
  }

  // ------------------------------------------------------------------ scoring

  function scoreAll() {
    return items.map(function (it, i) {
      return { item: it, correct: state.answers[i] === it.answer };
    });
  }

  function domainReports(scored) {
    var out = [];
    ['MR', 'NL', 'VR', 'SR'].forEach(function (code) {
      var subset = scored.filter(function (s) { return s.item.domain === code; });
      if (!subset.length) return;
      var r = CS.irt.report(subset, { floor: 55, ceiling: 145 });
      out.push({
        code: code,
        name: CS.bank.DOMAINS[code].name,
        chc: CS.bank.DOMAINS[code].chc,
        report: r,
        n: subset.length,
        nCorrect: subset.filter(function (s) { return s.correct; }).length
      });
    });
    return out;
  }

  // ------------------------------------------------------------- bell curve

  function bellSvg(theta, ciLoTheta, ciHiTheta) {
    var W = 620, H = 190, pad = 30;
    var baseY = H - 34;
    var x = function (t) { return pad + ((t + 3.2) / 6.4) * (W - pad * 2); };
    var y = function (t) { return baseY - Math.exp(-t * t / 2) * (baseY - 22); };

    var pts = [];
    for (var t = -3.2; t <= 3.21; t += 0.05) pts.push(x(t).toFixed(1) + ',' + y(t).toFixed(1));
    var curve = 'M' + pts.join(' L');

    // shaded confidence band
    var band = [];
    for (var b = Math.max(-3.2, ciLoTheta); b <= Math.min(3.2, ciHiTheta); b += 0.04) {
      band.push(x(b).toFixed(1) + ',' + y(b).toFixed(1));
    }
    var bandPath = band.length
      ? 'M' + x(Math.max(-3.2, ciLoTheta)).toFixed(1) + ',' + baseY + ' L' + band.join(' L') +
        ' L' + x(Math.min(3.2, ciHiTheta)).toFixed(1) + ',' + baseY + ' Z'
      : '';

    var ticks = [-2, -1, 0, 1, 2].map(function (t) {
      return '<line x1="' + x(t) + '" y1="' + baseY + '" x2="' + x(t) + '" y2="' + (baseY + 5) + '" ' +
        'stroke="var(--line-2)" stroke-width="1"/>' +
        '<text class="bell-axis" x="' + x(t) + '" y="' + (baseY + 17) + '" text-anchor="middle">' +
        (100 + 15 * t) + '</text>';
    }).join('');

    var clamped = Math.max(-3.2, Math.min(3.2, theta));

    return '<svg class="bell" viewBox="0 0 ' + W + ' ' + H + '" role="img" ' +
      'aria-label="Normal distribution with your score marked">' +
      (bandPath ? '<path d="' + bandPath + '" fill="var(--brand)" opacity="0.17"/>' : '') +
      '<path d="' + curve + '" fill="none" stroke="var(--line-2)" stroke-width="2"/>' +
      '<line x1="' + pad + '" y1="' + baseY + '" x2="' + (W - pad) + '" y2="' + baseY + '" ' +
        'stroke="var(--line-2)" stroke-width="1.5"/>' +
      ticks +
      '<line x1="' + x(clamped) + '" y1="' + y(clamped) + '" x2="' + x(clamped) + '" y2="' + baseY + '" ' +
        'stroke="var(--brand)" stroke-width="2.5"/>' +
      '<circle cx="' + x(clamped) + '" cy="' + y(clamped) + '" r="5.5" fill="var(--brand)"/>' +
      '</svg>';
  }

  // -------------------------------------------------------------- results view

  function pct(p) {
    if (p >= 99.9) return '&gt;99.9';
    if (p <= 0.1) return '&lt;0.1';
    return (Math.round(p * 10) / 10).toString();
  }

  function rarityText(r) {
    if (!isFinite(r) || r > 100000) return 'rarer than 1 in 100,000';
    if (r < 2) return 'about 1 in 2';
    return 'about 1 in ' + Math.round(r).toLocaleString('en-GB');
  }

  function domainBar(d) {
    var r = d.report;
    var toPct = function (iq) { return Math.max(0, Math.min(100, ((iq - 55) / 90) * 100)); };
    var lo = toPct(r.ci95[0]), hi = toPct(r.ci95[1]), mid = toPct(r.iq);
    return '<div class="domain-bar">' +
      '<div class="domain-bar-head">' +
        '<span><b>' + CS.render.escapeHtml(d.name) + '</b> ' +
        '<span class="muted small">' + d.nCorrect + '/' + d.n + ' correct</span></span>' +
        '<b>' + r.iq + '</b>' +
      '</div>' +
      '<div class="domain-track" role="img" aria-label="' + CS.render.escapeHtml(d.name) +
        ' index ' + r.iq + ', 95% interval ' + r.ci95[0] + ' to ' + r.ci95[1] + '">' +
        '<span class="domain-mid"></span>' +
        '<span class="domain-ci" style="left:' + lo.toFixed(1) + '%;width:' + Math.max(1, hi - lo).toFixed(1) + '%"></span>' +
        '<span class="domain-pt" style="left:' + mid.toFixed(1) + '%"></span>' +
      '</div></div>';
  }

  function reviewItem(item, idx) {
    var given = state.answers[idx];
    var right = given === item.answer;
    var skipped = given === null;
    var mark = skipped ? 'sk' : (right ? 'ok' : 'no');
    var glyph = skipped ? '&ndash;' : (right ? '&#10003;' : '&#10007;');
    var label = skipped ? 'Not answered' : (right ? 'Correct' : 'Incorrect');

    var stim = CS.render.stimulus(item);
    var stimBlock = '';
    if (item.type === 'spatial') {
      stimBlock = '<div class="stim-wrap"><div class="spatial-stim">' + stim + '</div></div>';
    } else if (stim) {
      stimBlock = '<div class="stim-wrap">' + stim + '</div>';
    }

    var cols = '<div class="review-cols">' +
      '<div class="review-col correct"><div class="k">Correct answer</div>' +
        CS.render.option(item, item.options[item.answer]) + '</div>' +
      (!right && !skipped
        ? '<div class="review-col"><div class="k">Your answer</div>' +
          CS.render.option(item, item.options[given]) + '</div>'
        : '') +
      '</div>';

    return '<details class="review-item">' +
      '<summary><span class="review-mark ' + mark + '" aria-hidden="true">' + glyph + '</span>' +
      '<span><b>' + (idx + 1) + '.</b> ' + CS.render.escapeHtml(item.domainName) +
      ' <span class="muted">&middot; ' + label + '</span></span></summary>' +
      '<div class="review-body">' +
        (item.type === 'verbal' ? '<p class="q-stem">' + CS.render.escapeHtml(item.stem) + '</p>' : '') +
        stimBlock + cols +
        '<p><b>Why:</b> ' + CS.render.escapeHtml(item.rationale) + '</p>' +
      '</div></details>';
  }

  function renderResults() {
    var scored = scoreAll();
    var r = CS.irt.report(scored, { floor: cfg.reportFloor, ceiling: cfg.reportCeiling });
    var domains = domainReports(scored);

    var scoreDisplay = r.capped === 'high' ? cfg.reportCeiling + '+'
      : (r.capped === 'low' ? 'under ' + cfg.reportFloor : String(r.iq));

    var cappedNote = r.capped
      ? '<div class="note note-strong"><h4>Your score is at the edge of what this test can resolve</h4>' +
        '<p style="margin:0">A ' + N + '-item test does not carry enough information to separate people this ' +
        'far from the middle, so the score is reported as a bound rather than a number. ' +
        '<a href="/methodology/#precision">Why precision falls off at the tails.</a></p></div>'
      : '';

    var elapsed = state.startedAt ? Math.round((Date.now() - state.startedAt) / 1000) : 0;
    var unanswered = state.answers.filter(function (a) { return a === null; }).length;

    var integrityNote = '';
    if (unanswered > 0 || state.blurEvents > 3) {
      var bits = [];
      if (unanswered > 0) bits.push(unanswered + ' question' + (unanswered === 1 ? '' : 's') + ' left unanswered (scored as incorrect)');
      if (state.blurEvents > 3) bits.push('the tab lost focus ' + state.blurEvents + ' times');
      integrityNote = '<div class="note"><h4>Worth knowing when you read this</h4>' +
        '<p style="margin:0">During this attempt, ' + bits.join(' and ') + '. ' +
        'That does not invalidate the result, but it is the kind of thing that moves a score around.</p></div>';
    }

    var html =
      '<h1>Your result</h1>' +

      '<div class="score-card">' +
        '<div class="score-label">Estimated IQ</div>' +
        '<div class="score-num">' + scoreDisplay + '</div>' +
        (r.capped ? '' :
          '<p class="score-ci">95% confidence interval <b>' + r.ci95[0] + '&ndash;' + r.ci95[1] + '</b>' +
          '<br><span class="muted small">The evidence is consistent with any true score in that range.</span></p>') +
        bellSvg(r.theta, r.theta - 1.96 * r.sem, r.theta + 1.96 * r.sem) +
      '</div>' +

      cappedNote +

      '<div class="stat-row">' +
        stat(pct(r.percentile), 'Percentile') +
        stat(r.nCorrect + '/' + N, 'Correct') +
        stat(rarityText(r.rarity).replace('about ', ''),
             r.rarityDirection === 'below' ? 'Score this low' : 'Score this high') +
        stat(Math.floor(elapsed / 60) + 'm ' + (elapsed % 60) + 's', 'Time taken') +
      '</div>' +

      integrityNote +

      '<h2>Profile by domain</h2>' +
      '<p class="muted">Each of these rests on six to ten questions, so the intervals are wide. ' +
      'Read the <em>shape</em> - which is your strongest area - rather than the individual numbers. ' +
      'With so little evidence per domain, each estimate is pulled towards 100, so these four will ' +
      'always look flatter than your overall score and can even sit on the other side of it. ' +
      'That is the model being cautious, not a contradiction. ' +
      'The shaded band is the 95% interval; the vertical line in the middle of each track marks 100.</p>' +
      domains.map(domainBar).join('') +

      '<div class="btn-row" style="margin:30px 0">' +
        '<button class="btn btn-ghost no-print" type="button" id="btn-print">Save or print this report</button>' +
        '<a class="btn btn-ghost" href="/methodology/">How this was scored</a>' +
        '<button class="btn btn-ghost no-print" type="button" id="btn-restart">Clear and start over</button>' +
      '</div>' +

      resultsAdHtml() +

      '<h2>Every question, explained</h2>' +
      '<p class="muted">The reasoning behind each item. Working through the ones you missed is the most ' +
      'useful part of this page.</p>' +
      items.map(reviewItem).join('') +

      '<div class="note note-strong" style="margin-top:34px">' +
        '<h4>Read this before you take the number too seriously</h4>' +
        '<p>This is an unsupervised online test with provisional norms. It cannot diagnose anything and ' +
        'has no clinical or legal standing. The absolute number is the least reliable part of this report - ' +
        'the interval around it, and the shape of your domain profile, carry more meaning. ' +
        '<a href="/methodology/#limitations">The full list of limitations.</a></p>' +
        '<p style="margin:0">Retaking these same questions will inflate your score, because you have now ' +
        'seen them.</p>' +
      '</div>';

    document.getElementById('screen-results').innerHTML = html;
    show('screen-results');

    var p = document.getElementById('btn-print');
    if (p) p.addEventListener('click', function () { window.print(); });

    var rs = document.getElementById('btn-restart');
    if (rs) rs.addEventListener('click', function () {
      if (!confirm('Clear this result and start the test again from the beginning?')) return;
      clearSaved();
      location.reload();
    });

    if (window.CSAds && typeof window.CSAds.fill === 'function') window.CSAds.fill();
    document.title = 'Your IQ test result: ' + scoreDisplay + ' | ' + cfg.name;
  }

  function stat(v, k) {
    return '<div class="stat"><div class="v">' + v + '</div><div class="k">' + k + '</div></div>';
  }

  /* Markup for the single results-page ad, taken from the inert template the
   * page ships. Returns an empty string when no publisher id is configured. */
  function resultsAdHtml() {
    var tpl = document.getElementById('tpl-results-ad');
    return tpl ? tpl.innerHTML : '';
  }

  // ------------------------------------------------------------------- flow

  function begin() {
    state.startedAt = Date.now();
    state.index = 0;
    state.finished = false;
    save();
    show('screen-test');
    renderQuestion();
    startTimer();
  }

  function finish(auto) {
    if (state.finished) return;
    var unanswered = state.answers.filter(function (a) { return a === null; }).length;
    if (!auto && unanswered > 0) {
      if (!confirm(unanswered + ' question' + (unanswered === 1 ? ' is' : 's are') +
          ' still unanswered and will be scored as incorrect.\n\nFinish anyway?')) return;
    }
    state.finished = true;
    if (tick) clearInterval(tick);
    save();
    renderResults();
  }

  // --------------------------------------------------------------- listeners

  function bind() {
    el.host = document.getElementById('question-host');
    el.prev = document.getElementById('btn-prev');
    el.next = document.getElementById('btn-next');
    el.skip = document.getElementById('btn-skip');
    el.timer = document.getElementById('timer');
    el.progressText = document.getElementById('progress-text');
    el.progressFill = document.getElementById('progress-fill');
    el.progressBar = document.getElementById('progress-bar');
    el.answered = document.getElementById('answered-note');

    var beginBtn = document.getElementById('btn-begin');
    if (beginBtn) beginBtn.addEventListener('click', begin);

    el.prev.addEventListener('click', function () { go(-1); });
    el.next.addEventListener('click', function () { go(1); });
    el.skip.addEventListener('click', function () { go(1); });

    document.addEventListener('keydown', function (e) {
      var screen = document.getElementById('screen-test');
      if (!screen || !screen.classList.contains('active')) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      var target = e.target || {};
      var tag = (target.tagName || '').toLowerCase();
      var isRadio = tag === 'input' && target.type === 'radio';
      if (tag === 'input' && !isRadio) return;
      if (tag === 'textarea' || tag === 'select') return;

      var item = items[state.index];

      // Number keys pick an option directly.
      if (/^[1-9]$/.test(e.key)) {
        var i = parseInt(e.key, 10) - 1;
        if (i >= item.options.length) return;
        /* Tick the existing input rather than re-rendering the question: a
         * re-render would destroy the node the user is standing on and throw
         * focus back to the heading. */
        var input = el.host.querySelector('input[value="' + i + '"]');
        if (input) input.checked = true;
        state.answers[state.index] = i;
        save();
        updateChrome();
        e.preventDefault();
        return;
      }

      /* Arrow keys move between QUESTIONS - but only when focus is not inside
       * the option group. Within a radio group the arrow keys belong to the
       * group: they are how a keyboard or screen-reader user moves between
       * options, and hijacking them would break the standard control. */
      if (isRadio) return;
      if (e.key === 'ArrowRight') { go(1); e.preventDefault(); }
      else if (e.key === 'ArrowLeft') { go(-1); e.preventDefault(); }
    });

    /* Tab-switching is recorded but never used to block anyone - it is reported
     * back on the result page as context for reading the score. */
    window.addEventListener('blur', function () {
      if (state.startedAt && !state.finished) { state.blurEvents++; save(); }
    });

    window.addEventListener('beforeunload', function (e) {
      if (state.startedAt && !state.finished) {
        e.preventDefault();
        e.returnValue = '';
      }
    });
  }

  function init() {
    bind();
    var restored = load();
    if (restored && state.finished) {
      renderResults();
    } else if (restored && state.startedAt && remaining() > 0) {
      show('screen-test');
      renderQuestion();
      startTimer();
    } else if (restored && state.startedAt && remaining() <= 0) {
      finish(true);
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
