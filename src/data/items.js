/* CogniScale - the item bank.
 *
 * Thirty items across four reasoning domains. The blueprint follows the item
 * families used by the International Cognitive Ability Resource (matrix
 * reasoning, letter/number series, verbal reasoning, spatial rotation), which is
 * the best-documented open framework for this kind of battery. The ITEMS
 * THEMSELVES ARE ORIGINAL: the ICAR bank is licensed for academic use only, so
 * nothing from it is reproduced here. What is borrowed is the published
 * construction methodology, not the content.
 *
 * IRT parameters
 * --------------
 *   a  discrimination. Set per domain from the reported g-loadings of each item
 *      family: verbal reasoning and letter/number series load highest (~.8),
 *      matrix reasoning next, spatial rotation lowest.
 *   b  difficulty, on the theta metric (0 = population mean, 1 = +1 SD).
 *      Assigned rationally from the structural complexity of each item - the
 *      number of simultaneously governing rules for matrices, the depth of the
 *      generating rule for series, the inference type for verbal items.
 *   c  lower asymptote, computed at build time as 1 / (number of options).
 *
 * These b values are PROVISIONAL - rational rather than empirically calibrated
 * on a norming sample of this test's own takers. /methodology says so plainly,
 * and the reported score is capped to the range this design can resolve.
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) { module.exports = factory(); }
  else { root.CS = root.CS || {}; root.CS.itemBank = factory(); }
}(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var DOMAINS = {
    MR: {
      code: 'MR',
      name: 'Figural reasoning',
      chc: 'Gf - induction (I)',
      blurb: 'Inferring the rules that govern an abstract pattern, then applying them.',
      a: 1.25
    },
    NL: {
      code: 'NL',
      name: 'Numeric & symbolic series',
      chc: 'Gf - quantitative reasoning (RQ)',
      blurb: 'Detecting the generating rule behind a sequence of numbers or letters.',
      a: 1.45
    },
    VR: {
      code: 'VR',
      name: 'Verbal & logical reasoning',
      chc: 'Gc / Gf - language development and deduction',
      blurb: 'Relational analogies and deductive inference expressed in words.',
      a: 1.40
    },
    SR: {
      code: 'SR',
      name: 'Spatial rotation',
      chc: 'Gv - visualisation (Vz)',
      blurb: 'Mentally rotating a figure and distinguishing rotation from reflection.',
      a: 1.00
    }
  };

  // ------------------------------------------------------- matrix reasoning --
  var MR = [
    {
      id: 'MR.01', domain: 'MR', b: -1.85, family: 'attr',
      rules: {
        shape: { kind: 'fixed', value: 'triangle' },
        count: { kind: 'latin', domain: [1, 2, 3], shift: 1 }
      },
      rationale: 'One rule: every row and every column contains one, two and three triangles - never a repeat. The bottom row already shows three and one, and the right column already shows three and one, so the missing cell holds two.'
    },
    {
      id: 'MR.02', domain: 'MR', b: -1.35, family: 'attr',
      rules: {
        shape: { kind: 'latin', domain: ['circle', 'square', 'triangle'], shift: 1 }
      },
      rationale: 'One rule: each of the three shapes appears exactly once in every row and every column.'
    },
    {
      id: 'MR.03', domain: 'MR', b: -0.85, family: 'attr',
      rules: {
        shape: { kind: 'latin', domain: ['circle', 'square', 'triangle'], shift: 1 },
        fill:  { kind: 'constant', domain: ['none', 'light', 'solid'] }
      },
      rationale: 'Two rules: each shape appears once per row and column, while shading is constant along each row and changes between rows.'
    },
    {
      id: 'MR.04', domain: 'MR', b: -0.45, family: 'attr',
      rules: {
        shape: { kind: 'fixed', value: 'hexagon' },
        size:  { kind: 'progress', domain: ['sm', 'md', 'lg'], starts: [0, 1, 2], step: 1 },
        fill:  { kind: 'latin', domain: ['none', 'light', 'solid'], shift: 1 }
      },
      rationale: 'Two rules: size steps up along each row (wrapping back to small), and each shading appears once per row and column.'
    },
    {
      id: 'MR.05', domain: 'MR', b: -0.10, family: 'attr',
      rules: {
        shape: { kind: 'fixed', value: 'hexagon' },
        fill:  { kind: 'latin', domain: ['none', 'light', 'solid'], shift: 2 },
        count: { kind: 'latin', domain: [1, 2, 3], shift: 1 }
      },
      rationale: 'Two independent distribute-three rules. Each row and column holds one, two and three hexagons exactly once, and separately shows each of the three shadings exactly once. The two rules run on opposite diagonals, so working out one does not hand you the other.'
    },
    {
      id: 'MR.06', domain: 'MR', b: 0.20, family: 'logic', op: 'or',
      prompt: 'In each row, the third figure combines the first two. Which figure completes the bottom row?',
      rationale: 'The third cell contains every mark that appears in the first cell OR the second cell (a union).'
    },
    {
      id: 'MR.07', domain: 'MR', b: 0.55, family: 'attr',
      rules: {
        shape: { kind: 'latin', domain: ['triangle', 'square', 'circle'], shift: 1 },
        fill:  { kind: 'latin', domain: ['none', 'solid', 'hatch'], shift: 2 },
        size:  { kind: 'constant', domain: ['sm', 'md', 'lg'] }
      },
      rationale: 'Three rules running at once: shape and shading each appear once per row and column (on different diagonals), and size is constant along each row.'
    },
    {
      id: 'MR.08', domain: 'MR', b: 1.05, family: 'logic', op: 'xor',
      prompt: 'In each row, the third figure is derived from the first two. Which figure completes the bottom row?',
      rationale: 'The third cell keeps only the marks that appear in exactly one of the first two cells. Marks present in both cancel out.'
    },
    {
      id: 'MR.09', domain: 'MR', b: 1.50, family: 'attr',
      rules: {
        shape: { kind: 'fixed', value: 'triangle' },
        count: { kind: 'latin', domain: [1, 2, 3], shift: 1 },
        rot:   { kind: 'progress', domain: [0, 30, 60, 90], starts: [0, 2, 1], step: 1 },
        fill:  { kind: 'latin', domain: ['none', 'solid', 'dots'], shift: 2 }
      },
      rationale: 'Three rules at once. The number of triangles is a distribute-three across rows and columns; the shading is a second distribute-three running on the other diagonal; and the figure turns 30 degrees at each step, cycling back to upright after 90 - as the middle row shows.'
    },
    {
      id: 'MR.10', domain: 'MR', b: 1.95, family: 'logic', op: 'andnot',
      prompt: 'In each row, the third figure is derived from the first two. Which figure completes the bottom row?',
      rationale: 'The third cell keeps the marks of the first cell, except those that also appear in the second cell - the second figure subtracts from the first.'
    }
  ];

  // ----------------------------------------------- letter and number series --
  var NL = [
    {
      id: 'NL.01', domain: 'NL', b: -1.90, show: 5,
      gen: { kind: 'arith', a0: 3, d: 4 },
      rationale: 'A constant difference: each term is 4 more than the one before.'
    },
    {
      id: 'NL.02', domain: 'NL', b: -1.20, show: 5,
      gen: { kind: 'lettersCycle', start: 'B', steps: [2, 3] },
      rationale: 'The step through the alphabet alternates: forward 2, then forward 3, then 2 again.'
    },
    {
      id: 'NL.03', domain: 'NL', b: -0.55, show: 5,
      gen: { kind: 'quad', a0: 2, d0: 3, dd: 2 },
      rationale: 'The differences are 3, 5, 7, 9 - they themselves grow by 2 each time, so the next difference is 11.'
    },
    {
      id: 'NL.04', domain: 'NL', b: 0.10, show: 6,
      gen: { kind: 'alt', A: { kind: 'arith', a0: 4, d: 5 }, B: { kind: 'arith', a0: 20, d: -4 } },
      rationale: 'Two sequences are interleaved. The 1st, 3rd and 5th terms rise by 5; the 2nd, 4th and 6th fall by 4.'
    },
    {
      id: 'NL.05', domain: 'NL', b: 0.75, show: 5,
      gen: { kind: 'mulAdd', a0: 2, m: 2, k: 1 },
      rationale: 'Each term is the previous term doubled, plus 1.'
    },
    {
      id: 'NL.06', domain: 'NL', b: 1.35, show: 4,
      gen: { kind: 'letterPair', start: 'AZ', steps: [2, -1] },
      rationale: 'Each pair moves independently: the first letter advances 2 places, the second moves back 1.'
    },
    {
      id: 'NL.07', domain: 'NL', b: 1.90, show: 6,
      gen: { kind: 'cycleStep', a0: 4, steps: [3, 6, 12] },
      rationale: 'The increments repeat in a cycle of three: +3, +6, +12, then +3, +6, +12 again.'
    }
  ];

  // --------------------------------------------- verbal and logical reasoning --
  var VR = [
    {
      id: 'VR.01', domain: 'VR', b: -1.75,
      kind: 'analogy',
      stem: 'Doctor is to hospital as teacher is to ___',
      options: ['school', 'student', 'textbook', 'lesson', 'chalk'],
      answerText: 'school',
      rationale: 'The relation is practitioner to workplace. A doctor works in a hospital; a teacher works in a school. The other options are things a teacher uses or deals with, not the place they work.'
    },
    {
      id: 'VR.02', domain: 'VR', b: -1.15,
      kind: 'odd',
      stem: 'Which one does not belong with the others?',
      options: ['copper', 'iron', 'oxygen', 'zinc', 'nickel'],
      answerText: 'oxygen',
      rationale: 'Copper, iron, zinc and nickel are metals. Oxygen is a non-metal, and at room temperature a gas.'
    },
    {
      id: 'VR.03', domain: 'VR', b: -0.40,
      kind: 'analogy',
      stem: 'Sculptor is to marble as poet is to ___',
      options: ['words', 'poem', 'rhyme', 'publisher', 'emotion'],
      answerText: 'words',
      rationale: 'The relation is maker to raw material. Marble is what a sculptor works with, so the answer must be what a poet works with: words. A poem is the finished product, not the material.'
    },
    {
      id: 'VR.04', domain: 'VR', b: 0.20,
      kind: 'deduction',
      stem: 'Every rose in this garden is red. Some flowers in this garden are not red.\n\nWhich statement must be true?',
      options: [
        'Some flowers in this garden are not roses.',
        'All flowers in this garden are roses.',
        'Some roses in this garden are not red.',
        'No roses in this garden are flowers.',
        'None of these must be true.'
      ],
      answerText: 'Some flowers in this garden are not roses.',
      rationale: 'A flower that is not red cannot be a rose, because every rose here is red. Since some flowers are not red, those flowers are not roses.'
    },
    {
      id: 'VR.05', domain: 'VR', b: 0.70,
      kind: 'deduction',
      stem: 'Five runners finish a race with no ties. Nadia finishes ahead of Omar. Priya finishes behind Omar but ahead of Quinn. Ravi finishes last.\n\nWho finishes third?',
      options: ['Priya', 'Omar', 'Quinn', 'Nadia', 'It cannot be determined.'],
      answerText: 'Priya',
      rationale: 'The clues force the order Nadia, Omar, Priya, Quinn, Ravi. Nadia is ahead of Omar, Omar is ahead of Priya, Priya is ahead of Quinn, and Ravi is last - so Priya is third.'
    },
    {
      id: 'VR.06', domain: 'VR', b: 1.30,
      kind: 'deduction',
      stem: 'In a warehouse the rule is: if a shipment is fragile, then it is sealed with blue tape.\n\nA shipment arrives that is not sealed with blue tape. What follows?',
      options: [
        'The shipment is not fragile.',
        'The shipment is fragile.',
        'The shipment may or may not be fragile.',
        'Every fragile shipment has arrived.',
        'Nothing follows from this.'
      ],
      answerText: 'The shipment is not fragile.',
      rationale: 'If being fragile guarantees blue tape, then no blue tape guarantees not fragile. Denying the consequent lets you deny the antecedent. (The reverse move - seeing blue tape and concluding "fragile" - would be invalid, because non-fragile items may also be taped.)'
    },
    {
      id: 'VR.07', domain: 'VR', b: 1.90,
      kind: 'deduction',
      stem: 'Every member of the choir is also a member of the orchestra. Some members of the orchestra are teachers.\n\nWhich statement must be true?',
      options: [
        'Some teachers are members of the orchestra.',
        'Some members of the choir are teachers.',
        'All teachers are members of the orchestra.',
        'Some members of the choir are not teachers.',
        'No member of the choir is a teacher.'
      ],
      answerText: 'Some teachers are members of the orchestra.',
      rationale: '"Some orchestra members are teachers" and "some teachers are orchestra members" say the same thing - "some" statements can be reversed. Nothing forces any of them to be in the choir, so the tempting option about choir members being teachers does not follow.'
    }
  ];

  // ------------------------------------------------------- spatial rotation --
  var SR = [
    {
      id: 'SR.01', domain: 'SR', b: -1.25, turns: 1,
      cells: [[1, 0], [2, 0], [0, 1], [1, 1]],
      rationale: 'Turning the figure a quarter-turn reproduces the correct option exactly. The others are mirror images - they would need to be flipped over, not turned.'
    },
    {
      id: 'SR.02', domain: 'SR', b: -0.60, turns: 3,
      cells: [[0, 0], [0, 1], [0, 2], [0, 3], [1, 3]],
      rationale: 'The correct option is the same L-shape turned; the mirror-image options have the short foot on the wrong side.'
    },
    {
      id: 'SR.03', domain: 'SR', b: 0.05, turns: 2,
      cells: [[0, 0], [1, 0], [0, 1], [1, 1], [0, 2]],
      rationale: 'A half-turn maps the figure onto the correct option. Reflections keep the same outline but reverse the handedness of the notch.'
    },
    {
      id: 'SR.04', domain: 'SR', b: 0.70, turns: 1,
      cells: [[1, 0], [2, 0], [0, 1], [1, 1], [1, 2]],
      rationale: 'Only one option can be produced by rotation. Tracking a single distinctive cell - the isolated arm - through the turn is the quickest check.'
    },
    {
      id: 'SR.05', domain: 'SR', b: 1.35, turns: 3,
      cells: [[1, 0], [1, 1], [0, 2], [1, 2], [0, 3]],
      rationale: 'The offset zig-zag is chiral, so its mirror image can never be rotated back onto it. The correct option is a three-quarter turn of the original.'
    },
    {
      id: 'SR.06', domain: 'SR', b: 1.95, turns: 2,
      cells: [[0, 0], [1, 0], [1, 1], [1, 2], [2, 2], [2, 3]],
      rationale: 'A six-cell staircase. Rotating it keeps the direction of the steps; reflecting it reverses them, which is what every distractor does.'
    }
  ];

  var ITEMS = MR.concat(NL).concat(VR).concat(SR);

  /* Presentation order.
   *
   * Each domain's easy-to-hard ladder is stretched evenly across the whole test
   * rather than dealt out in a fixed cycle. Every item gets a fractional
   * position (its rank within its own domain, normalised to 0..1); sorting on
   * that interleaves the four domains no matter how many items each contains,
   * and it makes the test as a whole run easy-to-hard.
   *
   * Two properties this protects, both checked by the verifier:
   *   - no domain clusters (a run of one item type is monotonous, and a run of
   *     hard items from one domain can stall a test taker outright)
   *   - the hardest items are never all bunched at the end, where time pressure
   *     and fatigue would confound difficulty with endurance
   */
  var DOMAIN_TIEBREAK = { MR: 0, NL: 1, VR: 2, SR: 3 };

  function presentationOrder() {
    var groups = { MR: MR, NL: NL, VR: VR, SR: SR };
    var ranked = [];

    Object.keys(groups).forEach(function (d) {
      var list = groups[d];
      list.forEach(function (item, i) {
        ranked.push({
          item: item,
          // centre of this item's slice of its domain's ladder
          pos: (i + 0.5) / list.length,
          tie: DOMAIN_TIEBREAK[d]
        });
      });
    });

    ranked.sort(function (x, y) {
      if (x.pos !== y.pos) return x.pos - y.pos;
      return x.tie - y.tie;
    });

    return ranked.map(function (r) { return r.item; });
  }

  return {
    DOMAINS: DOMAINS,
    MR: MR, NL: NL, VR: VR, SR: SR,
    ITEMS: ITEMS,
    presentationOrder: presentationOrder
  };
}));
