/*
 * preview.js — Panel pratinjau kustomisasi (KHUSUS MOCKUP, tidak ikut ke Laravel)
 * ---------------------------------------------------------------------------
 * Aktif hanya bila URL memuat ?customize, mis. index.html?customize
 * Memperlihatkan Model C: satu aplikasi, banyak tampilan, dibatasi registri platform.
 * Setiap perubahan menulis parameter URL (?template=&font=&hfont=&primary=&accent=
 * &header=&cards=&buttons=) lalu memuat ulang; main.js memvalidasinya terhadap
 * PLATFORM sebelum dipakai.
 */
(function () {
  'use strict';

  var PS = window.PrintSite;
  if (!PS || !PS.query.has('customize')) return;

  var P = PS.platform, S = PS.site, esc = PS.esc;

  function option(list, current, label) {
    return list.map(function (v) {
      return '<option value="' + esc(v) + '"' + (v === current ? ' selected' : '') + '>' + esc(label ? label(v) : v) + '</option>';
    }).join('');
  }
  var fontIds = Object.keys(P.fonts);
  var fontLabel = function (id) { return P.fonts[id].name; };
  var tplIds = Object.keys(P.templates);
  var theme = PS.theme() || {};
  var hex = function (v, d) { return /^#[0-9a-f]{6}$/i.test(v || '') ? v : d; };

  var css = document.createElement('style');
  css.textContent =
    '.pv{position:fixed;left:12px;bottom:12px;z-index:3000;font:13px/1.4 system-ui,sans-serif;color:#1d2530}' +
    '.pv-toggle{display:inline-flex;align-items:center;gap:.4rem;padding:.55rem .85rem;border:0;border-radius:999px;background:#1d2530;color:#fff;font:600 13px system-ui,sans-serif;cursor:pointer;box-shadow:0 6px 20px rgba(0,0,0,.3)}' +
    '.pv-panel{display:none;width:min(300px,calc(100vw - 24px));max-height:calc(100vh - 80px);overflow:auto;margin-bottom:8px;padding:14px;background:#fff;border:1px solid #d5dbe3;border-radius:14px;box-shadow:0 16px 40px rgba(0,0,0,.25)}' +
    '.pv.is-open .pv-panel{display:block}' +
    '.pv h2{margin:0 0 2px;font:700 14px system-ui,sans-serif;color:#1d2530;letter-spacing:0}' +
    '.pv p{margin:0 0 10px;color:#5b6675;font-size:12px}' +
    '.pv label{display:block;margin:10px 0 3px;font-weight:600;font-size:12px}' +
    '.pv select,.pv input[type=color]{width:100%;height:34px;border:1px solid #c5ccd6;border-radius:8px;background:#fff;font:13px system-ui,sans-serif;padding:0 6px}' +
    '.pv input[type=color]{padding:2px;cursor:pointer}' +
    '.pv-tpl{display:grid;grid-template-columns:repeat(3,1fr);gap:6px}' +
    '.pv-tpl button{padding:.5rem .25rem;border:1.5px solid #c5ccd6;border-radius:8px;background:#fff;font:600 12px system-ui,sans-serif;cursor:pointer}' +
    '.pv-tpl button[aria-pressed=true]{background:#1d2530;border-color:#1d2530;color:#fff}' +
    '.pv-row{display:grid;grid-template-columns:1fr 1fr;gap:8px}' +
    '.pv-reset{margin-top:12px;width:100%;padding:.5rem;border:1.5px solid #c5ccd6;border-radius:8px;background:#f5f7fa;font:600 12px system-ui,sans-serif;cursor:pointer}';
  document.head.appendChild(css);

  var box = document.createElement('div');
  box.className = 'pv';
  box.innerHTML =
    '<div class="pv-panel" id="pv-panel" role="group" aria-label="Pratinjau kustomisasi">' +
      '<h2>Pratinjau kustomisasi</h2><p>Hanya di mockup. Pilihan dibatasi registri platform (platform.js).</p>' +
      '<label>Template</label><div class="pv-tpl">' + tplIds.map(function (id) {
        return '<button type="button" data-k="template" data-v="' + id + '" aria-pressed="' + (id === S.template) + '" title="' + esc(P.templates[id].description) + '">' + esc(P.templates[id].name) + '</button>';
      }).join('') + '</div>' +
      '<div class="pv-row"><div><label for="pv-hfont">Font judul</label><select id="pv-hfont" data-k="hfont">' + option(fontIds, S.fontHeading, fontLabel) + '</select></div>' +
      '<div><label for="pv-font">Font isi</label><select id="pv-font" data-k="font">' + option(fontIds, S.fontBody, fontLabel) + '</select></div></div>' +
      '<div class="pv-row"><div><label for="pv-primary">Warna utama</label><input id="pv-primary" type="color" data-k="primary" value="' + hex(theme.primary, '#173b63') + '"></div>' +
      '<div><label for="pv-accent">Warna aksen</label><input id="pv-accent" type="color" data-k="accent" value="' + hex(theme.accent, '#f28c28') + '"></div></div>' +
      '<div class="pv-row"><div><label for="pv-header">Header</label><select id="pv-header" data-k="header">' + option(P.headers, S.header) + '</select></div>' +
      '<div><label for="pv-cards">Kartu</label><select id="pv-cards" data-k="cards">' + option(P.cardStyles, S.cardStyle) + '</select></div></div>' +
      '<label for="pv-buttons">Bentuk tombol</label><select id="pv-buttons" data-k="buttons">' + option(P.buttonShapes, S.buttonShape) + '</select>' +
      '<button type="button" class="pv-reset" data-reset>Kembalikan ke pengaturan tenant</button>' +
    '</div>' +
    '<button type="button" class="pv-toggle" aria-expanded="false" aria-controls="pv-panel">Kustomisasi</button>';
  document.body.appendChild(box);

  var toggle = box.querySelector('.pv-toggle');
  function setOpen(o) { box.classList.toggle('is-open', o); toggle.setAttribute('aria-expanded', String(o)); }
  toggle.addEventListener('click', function () { setOpen(!box.classList.contains('is-open')); });
  try { if (sessionStorage.getItem('pv-open') === '1') setOpen(true); } catch (e) { /* penyimpanan bisa diblokir */ }

  function go(mutate) {
    var q = new URLSearchParams(window.location.search);
    q.set('customize', '1');
    mutate(q);
    try { sessionStorage.setItem('pv-open', box.classList.contains('is-open') ? '1' : '0'); } catch (e) { /* abaikan */ }
    window.location.search = q.toString();
  }
  box.addEventListener('click', function (e) {
    var b = e.target.closest('[data-k="template"]');
    if (b) go(function (q) { q.set('template', b.getAttribute('data-v')); });
    if (e.target.closest('[data-reset]')) go(function (q) { ['template', 'font', 'hfont', 'primary', 'accent', 'header', 'cards', 'buttons'].forEach(function (k) { q.delete(k); }); });
  });
  box.addEventListener('change', function (e) {
    var el = e.target.closest('select[data-k], input[data-k]');
    if (el) go(function (q) { q.set(el.getAttribute('data-k'), el.value); });
  });
})();
