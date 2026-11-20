/*
 * demo.js — Halaman demo platform (KHUSUS MOCKUP / materi penjualan)
 * ---------------------------------------------------------------------------
 * Membaca registri PLATFORM (packages, templates, routes, demos) dan memperlihatkan website contoh
 * dalam iframe: paket x template x halaman x perangkat. Pilihan disimpan di URL demo.html
 * (?package=&template=&page=&device=) supaya tautan bisa dibagikan ke calon client.
 * Semua nilai divalidasi terhadap registri; nilai tak dikenal jatuh ke bawaan.
 * Laravel: rute /demo di aplikasi marketing, membaca registri yang sama.
 */
(function () {
  'use strict';

  var P = window.PLATFORM, TN = (window.TENANTS || {})['sinar-copy'];
  if (!P || !P.packages || !P.templates || !TN) { var m = document.getElementById('demo-main'); if (m) m.insertAdjacentHTML('afterbegin', '<p class="demo-noscript">Registri platform tidak termuat.</p>'); return; }

  var $ = function (id) { return document.getElementById(id); };
  var esc = function (v) { return String(v == null ? '' : v).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var arr = function (v) { return Array.isArray(v) ? v : []; };

  var pkgIds = Object.keys(P.packages).filter(function (id) { return P.packages[id].available; });
  var tplIds = Object.keys(P.templates);
  var DEVICES = { desktop: { label: 'Desktop', width: '100%', height: 800 }, tablet: { label: 'Tablet', width: '820px', height: 760 }, mobile: { label: 'Ponsel', width: '390px', height: 760 } };
  var PAGE_LABEL = { home: 'Beranda', services: 'Layanan', service: 'Detail layanan', pricing: 'Harga', portfolio: 'Portofolio', about: 'Tentang', blog: 'Artikel', article: 'Detail artikel', contact: 'Kontak', faq: 'FAQ', cart: 'Keranjang', orderStatus: 'Lacak pesanan' };
  var PAGE_ORDER = ['home', 'services', 'service', 'pricing', 'portfolio', 'about', 'blog', 'article', 'contact', 'faq', 'cart', 'orderStatus'];
  var ORDER_TEXT = { contact: 'Tombol "Hubungi Kami" ke halaman Kontak', whatsapp: 'WhatsApp per layanan', inquiry: 'Daftar tanya, satu pesan WhatsApp', cart: 'Keranjang dan checkout ke WhatsApp' };
  var HEADER_TEXT = { standard: 'Header standar', topbar: 'Bilah atas', megamenu: 'Mega menu', store: 'Header toko' };
  var CARD_TEXT = { elevated: 'Kartu berbayang', outlined: 'Kartu berbingkai' };
  var BTN_TEXT = { rounded: 'Tombol membulat', pill: 'Tombol pil', square: 'Tombol tegas' };

  var firstSlug = function (list) { var f = arr(list).filter(function (x) { return x && typeof x.slug === 'string'; })[0]; return f ? f.slug : ''; };

  function pagesFor(pkg) {
    var mod = P.packages[pkg].modules || {};
    return PAGE_ORDER.filter(function (r) {
      var rt = P.routes[r]; if (!rt) return false;
      if (rt.module === 'pricing') return !!mod.pricingPage;
      if (rt.module === 'cart') return mod.order === 'cart';
      return true;
    });
  }
  function pageFile(pkg, tpl, page) {
    var rt = P.routes[page], hash = '';
    if (page === 'service') hash = firstSlug(TN.services);
    if (page === 'article') hash = firstSlug(TN.articles);
    return rt.mockup + '?package=' + encodeURIComponent(pkg) + '&template=' + encodeURIComponent(tpl) + (hash ? '#' + encodeURIComponent(hash) : '');
  }

  /* ----------------------------------------------------------------- keadaan */
  var q = new URLSearchParams(window.location.search);
  var pick = function (v, list, d) { return list.indexOf(v) >= 0 ? v : d; };
  var firstDemo = arr(P.demos)[0] || {};
  var state = {
    package: pick(q.get('package'), pkgIds, pick(firstDemo.package, pkgIds, pkgIds[0])),
    template: pick(q.get('template'), tplIds, pick(firstDemo.template, tplIds, tplIds[0])),
    page: 'home', device: pick(q.get('device'), Object.keys(DEVICES), 'desktop')
  };
  state.page = pick(q.get('page'), pagesFor(state.package), 'home');

  /* ------------------------------------------------------------- bagian statis */
  function radios(host, name, items, current) {
    host.innerHTML = items.map(function (it) {
      var id = 'ctl-' + name + '-' + it.id;
      return '<div class="ctl-opt"><input type="radio" name="' + name + '" id="' + id + '" value="' + esc(it.id) + '"' + (it.id === current ? ' checked' : '') + '><label for="' + id + '"><strong>' + esc(it.name) + '</strong>' + (it.hint ? '<span>' + esc(it.hint) + '</span>' : '') + '</label></div>';
    }).join('');
  }
  radios($('ctl-package'), 'package', pkgIds.map(function (id) { return { id: id, name: P.packages[id].name }; }), state.package);
  radios($('ctl-template'), 'template', tplIds.map(function (id) { return { id: id, name: P.templates[id].name }; }), state.template);
  $('ctl-device').innerHTML = Object.keys(DEVICES).map(function (d) {
    return '<input type="radio" name="device" id="dev-' + d + '" value="' + d + '"' + (d === state.device ? ' checked' : '') + '><label for="dev-' + d + '">' + esc(DEVICES[d].label) + '</label>';
  }).join('');

  $('demo-presets').innerHTML = arr(P.demos).filter(function (d) { return pkgIds.indexOf(d.package) >= 0 && P.templates[d.template]; }).map(function (d, i) {
    return '<button type="button" class="preset" data-preset="' + i + '" aria-pressed="false"><span class="preset-title">' + esc(d.title) + '</span><span class="preset-meta">' + esc(P.packages[d.package].name) + ' + ' + esc(P.templates[d.template].name) + '</span></button>';
  }).join('');
  var presets = arr(P.demos).filter(function (d) { return pkgIds.indexOf(d.package) >= 0 && P.templates[d.template]; });

  /* Tabel paket */
  var rows = [
    ['Harga tampil di situs', function (id) { return P.packages[id].modules.prices ? 'Ya' : 'Tidak'; }],
    ['Halaman Harga', function (id) { return P.packages[id].modules.pricingPage ? 'Ya' : 'Tidak ada'; }],
    ['Cara pelanggan memesan', function (id) { return ORDER_TEXT[P.packages[id].modules.order] || '-'; }],
    ['Cocok untuk', function (id) { var d = presets.filter(function (x) { return x.package === id; })[0]; return d ? d.audience : P.packages[id].description; }]
  ];
  $('pk-table').insertAdjacentHTML('beforeend',
    '<thead><tr><th scope="col"><span class="visually-hidden">Fitur</span></th>' + pkgIds.map(function (id) {
      return '<th scope="col"><div class="pk-name">' + esc(P.packages[id].name) + '</div><p>' + esc(P.packages[id].description) + '</p><button type="button" class="btn btn-sm btn-demo-outline" data-try-package="' + esc(id) + '">Lihat paket ini</button></th>';
    }).join('') + '</tr></thead><tbody>' + rows.map(function (r) {
      return '<tr><th scope="row">' + esc(r[0]) + '</th>' + pkgIds.map(function (id) { return '<td>' + esc(r[1](id)) + '</td>'; }).join('') + '</tr>';
    }).join('') + '</tbody>');

  /* Kartu template */
  $('tp-grid').innerHTML = tplIds.map(function (id) {
    var t = P.templates[id];
    return '<div class="col-12 col-md-6 col-xl-4"><article class="tp-card"><h3>' + esc(t.name) + '</h3><p>' + esc(t.description) + '</p><ul class="tp-chips"><li>' + esc(HEADER_TEXT[t.header] || t.header) + '</li><li>' + esc(CARD_TEXT[t.cardStyle] || t.cardStyle) + '</li><li>' + esc(BTN_TEXT[t.buttonShape] || t.buttonShape) + '</li></ul>' +
      '<button type="button" class="btn btn-sm btn-demo-outline" data-try-template="' + esc(id) + '">Lihat template ini</button></article></div>';
  }).join('');

  /* --------------------------------------------------------------- pembaruan */
  var frame = $('frame'), wrap = $('frame-wrap');
  function render(reload) {
    var pages = pagesFor(state.package);
    if (pages.indexOf(state.page) < 0) state.page = 'home';
    $('ctl-page').innerHTML = pages.map(function (r) { return '<option value="' + r + '"' + (r === state.page ? ' selected' : '') + '>' + esc(PAGE_LABEL[r] || r) + '</option>'; }).join('');
    var file = pageFile(state.package, state.template, state.page), dev = DEVICES[state.device];
    if (reload !== false && frame.getAttribute('data-src') !== file) { frame.setAttribute('data-src', file); frame.src = file; }
    wrap.style.maxWidth = dev.width; frame.style.height = dev.height + 'px';
    fit();
    wrap.setAttribute('data-device', state.device);
    $('ctl-open').setAttribute('href', file);
    $('bench-caption').textContent = P.packages[state.package].name + ' + ' + P.templates[state.template].name + ' · ' + (PAGE_LABEL[state.page] || state.page) + ' · ' + dev.label;
    $('ctl-note').textContent = P.packages[state.package].description;
    Array.prototype.forEach.call(document.querySelectorAll('.preset'), function (b) {
      var d = presets[parseInt(b.getAttribute('data-preset'), 10)];
      b.setAttribute('aria-pressed', String(d.package === state.package && d.template === state.template));
    });
    Array.prototype.forEach.call(document.querySelectorAll('input[name=package]'), function (r) { r.checked = r.value === state.package; });
    Array.prototype.forEach.call(document.querySelectorAll('input[name=template]'), function (r) { r.checked = r.value === state.template; });
    Array.prototype.forEach.call(document.querySelectorAll('input[name=device]'), function (r) { r.checked = r.value === state.device; });
    try { window.history.replaceState(null, '', 'demo.html?package=' + state.package + '&template=' + state.template + '&page=' + state.page + '&device=' + state.device); } catch (e) { /* file:// tertentu menolak: abaikan */ }
  }
  /* Desktop: halaman dirender selebar 1280px lalu diperkecil agar pas di panggung, supaya titik patah desktop (992px+) tampil benar. */
  var DESKTOP_W = 1280;
  function fit() {
    var dev = DEVICES[state.device], stage = wrap.parentElement.clientWidth;
    if (state.device === 'desktop' && stage > 0 && stage < DESKTOP_W) {
      var k = stage / DESKTOP_W;
      frame.style.width = DESKTOP_W + 'px'; frame.style.transform = 'scale(' + k + ')'; frame.style.transformOrigin = '0 0';
      wrap.style.height = Math.round(dev.height * k) + 2 + 'px';
    } else { frame.style.width = '100%'; frame.style.transform = ''; wrap.style.height = ''; }
  }
  window.addEventListener('resize', fit);
  function scrollToBench() { var b = $('bench'); if (b && b.scrollIntoView) b.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' }); }

  document.addEventListener('change', function (e) {
    var t = e.target;
    if (t.name === 'package') state.package = pick(t.value, pkgIds, state.package);
    else if (t.name === 'template') state.template = pick(t.value, tplIds, state.template);
    else if (t.name === 'device') state.device = pick(t.value, Object.keys(DEVICES), state.device);
    else if (t.id === 'ctl-page') state.page = pick(t.value, pagesFor(state.package), 'home');
    else return;
    render();
  });
  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-preset],[data-try-package],[data-try-template]'); if (!b) return;
    if (b.hasAttribute('data-preset')) { var d = presets[parseInt(b.getAttribute('data-preset'), 10)]; if (!d) return; state.package = d.package; state.template = d.template; state.page = 'home'; }
    else if (b.hasAttribute('data-try-package')) state.package = pick(b.getAttribute('data-try-package'), pkgIds, state.package);
    else state.template = pick(b.getAttribute('data-try-template'), tplIds, state.template);
    render(); scrollToBench();
  });

  render();
})();
