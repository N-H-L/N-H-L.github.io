/* Human-readable dump of the whole bank, for eyeball review. */
'use strict';
var bank = require('../src/data/items.js');
var build = require('../src/lib/bank.js');

var items = build.build(bank.presentationOrder ? bank.presentationOrder() : bank.ITEMS);

items.forEach(function (it, n) {
  console.log('---------------------------------------------------------------');
  console.log('#' + (n + 1) + '  ' + it.id + '   [' + it.domain + ']  b=' + it.b + '  a=' + it.a);
  if (it.stem) console.log('STEM: ' + it.stem);
  if (it.shown) console.log('SHOWN: ' + it.shown.join(', ') + ', ?');
  if (it.prompt) console.log('PROMPT: ' + it.prompt);
  var opts = it.options.map(function (o, i) {
    var mark = i === it.answer ? ' <== KEY' : '';
    var txt = (typeof o === 'object') ? JSON.stringify(o) : String(o);
    return '   ' + String.fromCharCode(65 + i) + ') ' + txt + mark;
  });
  console.log('OPTIONS:');
  console.log(opts.join('\n'));
  if (it.rationale) console.log('WHY: ' + it.rationale);
  console.log('');
});
console.log('total items: ' + items.length);
