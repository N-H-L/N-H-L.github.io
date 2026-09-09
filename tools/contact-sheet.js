#!/usr/bin/env node
/* CogniScale - renders every item to a single HTML page for visual review.
 * The verifier proves an item is logically sound; this proves it is legible.
 * Output: .preview/contact-sheet.html  (not part of the published site) */
'use strict';

var fs = require('fs');
var path = require('path');
var bank = require('../src/lib/bank.js');
var render = require('../src/lib/render.js');

var items = bank.build();
var outDir = path.join(__dirname, '..', '.preview');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

var cards = items.map(function (it, idx) {
  var stim = render.stimulus(it);
  var opts = it.options.map(function (v, i) {
    var mark = i === it.answer ? ' correct' : '';
    return '<div class="opt' + mark + '"><span class="tag">' + String.fromCharCode(65 + i) + '</span>' +
           render.option(it, v) + '</div>';
  }).join('');

  var stem = it.type === 'verbal'
    ? '<p class="stem">' + render.escapeHtml(it.stem).replace(/\n/g, '<br>') + '</p>'
    : '';

  return '<article class="card">' +
    '<header><b>' + (idx + 1) + '. ' + it.id + '</b> <span class="meta">' + it.domainName +
    ' &middot; a=' + it.a.toFixed(2) + ' b=' + it.b.toFixed(2) + ' c=' + it.c.toFixed(3) +
    ' &middot; ' + it.options.length + ' options &middot; key=' + String.fromCharCode(65 + it.answer) +
    '</span></header>' +
    stem +
    (it.prompt ? '<p class="prompt">' + render.escapeHtml(it.prompt) + '</p>' : '') +
    '<div class="stim">' + stim + '</div>' +
    '<div class="opts">' + opts + '</div>' +
    '<p class="rat"><b>Why:</b> ' + render.escapeHtml(it.rationale) + '</p>' +
    '</article>';
}).join('\n');

var html = '<!doctype html><html lang="en"><head><meta charset="utf-8">' +
  '<meta name="viewport" content="width=device-width,initial-scale=1">' +
  '<title>CogniScale item contact sheet</title><style>' +
  ':root{--fig-ink:#15171d;--fig-grid:#c9c6bf;color-scheme:light}' +
  'body{font:14px/1.55 ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif;background:#f6f5f2;color:#15171d;margin:0;padding:28px}' +
  'h1{font-size:20px;margin:0 0 4px}p.lede{color:#5b6070;margin:0 0 24px}' +
  '.card{background:#fff;border:1px solid #e3e0da;border-radius:12px;padding:18px;margin:0 0 18px;max-width:880px}' +
  'header{display:flex;flex-wrap:wrap;gap:10px;align-items:baseline;margin-bottom:10px}' +
  '.meta{color:#6b7080;font-size:12px;font-family:ui-monospace,SFMono-Regular,Menlo,monospace}' +
  '.stem{white-space:pre-wrap;background:#faf9f7;border-left:3px solid #d8d4cc;padding:8px 12px;margin:8px 0}' +
  '.prompt{color:#5b6070;font-style:italic;margin:6px 0}' +
  '.stim{margin:12px 0}.stim .cs-fig-matrix{width:260px}.stim .cs-fig-target{width:120px}' +
  '.opts{display:flex;flex-wrap:wrap;gap:10px;margin-top:10px}' +
  '.opt{border:1px solid #ddd9d2;border-radius:9px;padding:8px;min-width:74px;display:flex;flex-direction:column;align-items:center;gap:4px;background:#fdfdfc}' +
  '.opt.correct{border-color:#2e7d5b;background:#eaf5ef;box-shadow:inset 0 0 0 1px #2e7d5b}' +
  '.opt .tag{font:600 11px ui-monospace,monospace;color:#7a7f8c}' +
  '.opt.correct .tag{color:#2e7d5b}' +
  '.opt .cs-fig{width:62px;height:62px}' +
  '.cs-opt-term{font:600 16px ui-monospace,SFMono-Regular,Menlo,monospace}' +
  '.cs-opt-text{font-size:13px;max-width:230px;text-align:center}' +
  '.cs-series{display:flex;flex-wrap:wrap;align-items:center;gap:2px;font:600 20px ui-monospace,SFMono-Regular,Menlo,monospace}' +
  '.cs-term{padding:2px 7px}.cs-term-blank{color:#b0442e}.cs-comma{color:#9aa0ad;margin-right:4px}' +
  '.rat{color:#5b6070;font-size:13px;border-top:1px dashed #e3e0da;padding-top:9px;margin:12px 0 0}' +
  '</style></head><body>' +
  '<h1>CogniScale &mdash; item contact sheet</h1>' +
  '<p class="lede">' + items.length + ' items in presentation order. Correct option outlined in green. Internal review artefact, not published.</p>' +
  render.defs() + cards + '</body></html>';

var outFile = path.join(outDir, 'contact-sheet.html');
fs.writeFileSync(outFile, html, 'utf8');
console.log('wrote ' + path.relative(path.join(__dirname, '..'), outFile) + ' (' + items.length + ' items, ' + (html.length / 1024).toFixed(0) + ' KB)');
