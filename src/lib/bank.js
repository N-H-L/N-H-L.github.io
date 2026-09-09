/* CogniScale - assembles item specs into runtime items.
 *
 * Every runtime item carries: the rendered payload, its option list, the index
 * of the correct option, and its 3PL parameters. The guessing parameter c is
 * derived from the actual number of options rather than assumed, so a five-
 * option item is never scored as though it had six.
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory(
      require('./prng.js'), require('./matrix.js'), require('./series.js'),
      require('./spatial.js'), require('../data/items.js')
    );
  } else {
    root.CS = root.CS || {};
    root.CS.bank = factory(root.CS.prng, root.CS.matrix, root.CS.series, root.CS.spatial, root.CS.itemBank);
  }
}(typeof self !== 'undefined' ? self : this, function (prng, matrix, series, spatial, itemBank) {
  'use strict';

  function buildVerbal(spec) {
    var rnd = prng.make(spec.id);
    var options = rnd.shuffle(spec.options);
    var answer = options.indexOf(spec.answerText);
    if (answer === -1) {
      throw new Error('bank: ' + spec.id + ' answerText is not among its options');
    }
    return {
      id: spec.id, type: 'verbal', kind: spec.kind,
      stem: spec.stem, options: options, answer: answer,
      prompt: spec.prompt || null, rationale: spec.rationale
    };
  }

  function buildOne(spec) {
    var built;
    if (spec.domain === 'MR') {
      built = matrix.build(spec);
      built.type = 'matrix';
    } else if (spec.domain === 'NL') {
      built = series.build(spec);
      built.type = 'series';
    } else if (spec.domain === 'SR') {
      built = spatial.build(spec);
      built.type = 'spatial';
    } else if (spec.domain === 'VR') {
      built = buildVerbal(spec);
    } else {
      throw new Error('bank: unknown domain "' + spec.domain + '" for ' + spec.id);
    }

    var domain = itemBank.DOMAINS[spec.domain];
    built.domain = spec.domain;
    built.domainName = domain.name;
    built.a = spec.a != null ? spec.a : domain.a;
    built.b = spec.b;
    built.c = 1 / built.options.length;
    if (!built.rationale) built.rationale = spec.rationale;
    return built;
  }

  /* All items, in the order they are presented. */
  function build() {
    return itemBank.presentationOrder().map(buildOne);
  }

  /* Just the 3PL parameters - enough to score, without the payloads. */
  function params(items) {
    return items.map(function (it) {
      return { id: it.id, domain: it.domain, a: it.a, b: it.b, c: it.c };
    });
  }

  return { build: build, buildOne: buildOne, buildVerbal: buildVerbal, params: params, DOMAINS: itemBank.DOMAINS };
}));
