/*
 * pages.js — HALAMAN INTERNAL (struktur tetap, dikunci platform)
 * ---------------------------------------------------------------------------
 * Beda dengan beranda (sections.js, urutannya bisa diatur tenant), tiap halaman di sini
 * punya susunan tetap. Tenant hanya mengatur: template, warna, font, gaya kartu/tombol,
 * dan varian daftar yang diizinkan registri (PLATFORM.pages, site.pages.<halaman>.variant).
 * Teks halaman milik tenant (tenant.pageText), isi dari data tenant.
 *
 * Pemetaan Laravel:
 *   R.services -> resources/views/pages/services.blade.php  (+ filter via query ?kategori=)
 *   R.service  -> pages/service.blade.php   (route /layanan/{slug})
 *   R.pricing  -> pages/pricing.blade.php
 * Pada produksi halaman dirender server-side; filter/pencarian di sini hanya sisi klien.
 */
(function () {
  'use strict';

  var PS = window.PrintSite;
  if (!PS) { console.error('[pages.js] main.js belum dimuat.'); return; }

  var D = PS.data, T = D.tenant, esc = PS.esc, ico = PS.ico, url = PS.url, rupiah = PS.rupiah, C = PS.components, WA = PS.WA_ICON;
  var PT = D.pageText || {};
  var pageKey = document.body.getAttribute('data-page');
  var R = {};            /* R[halaman]() -> { html, meta } */
  PS.pages = R;

  /* ------------------------------------------------------------ pembantu */
  var byKey = function (list, key, val) { return list.filter(function (x) { return x[key] === val; })[0]; };
  var fill = function (tpl, vars) {
    return String(tpl || '').replace(/\{(\w+)\}/g, function (m, k) { return vars[k] != null ? vars[k] : m; });
  };
  var hashSlug = function () { try { return decodeURIComponent(window.location.hash.slice(1)); } catch (e) { return ''; } };

  /* layout/breadcrumb: items = [{ label, route?, slug? }]; item terakhir = halaman aktif */
  function crumbs(items) {
    var lis = items.map(function (c, i) {
      var last = i === items.length - 1;
      return last
        ? '<li class="breadcrumb-item active" aria-current="page">' + esc(c.label) + '</li>'
        : '<li class="breadcrumb-item"><a href="' + url(c.route, c.slug) + '">' + esc(c.label) + '</a></li>';
    }).join('');
    return '<div class="breadcrumb-wrap"><div class="container"><nav aria-label="Breadcrumb"><ol class="breadcrumb">' + lis + '</ol></nav></div></div>';
  }

  /* layout/page-head: judul halaman (satu-satunya h1) */
  function pageHead(title, lead, extra) {
    return '<section class="page-head" aria-labelledby="page-title"><div class="container">' +
      '<h1 id="page-title">' + esc(title) + '</h1>' + (lead ? '<p class="page-lead">' + esc(lead) + '</p>' : '') + (extra || '') + '</div></section>';
  }

  function ctaBand() {
    var cta = PS.site.home.filter(function (s) { return s.id === 'cta'; })[0];
    return PS.sections.cta(cta ? cta.variant : 'gradient');
  }

  function crumbMeta(items) {
    return items.map(function (c) { return { name: c.label, route: c.route, slug: c.slug }; });
  }

  /* ------------------------------------------------------------ /layanan */
  R.services = function () {
    var x = PT.services || {}, variant = PS.site.pages.services.variant;
    var active = byKey(D.categories, 'slug', hashSlug()) ? hashSlug() : 'all';
    var chips = '<button type="button" class="chip" data-cat="all" aria-pressed="' + (active === 'all') + '">Semua</button>' +
      D.categories.map(function (c) {
        return '<button type="button" class="chip" data-cat="' + esc(c.slug) + '" aria-pressed="' + (active === c.slug) + '">' + esc(c.name) + '</button>';
      }).join('');
    var colCls = variant === 'list' ? 'col-12' : 'col-12 col-md-6 col-lg-4';
    var items = D.services.map(function (s) {
      var cat = byKey(D.categories, 'slug', s.category);
      var q = (s.name + ' ' + s.short + ' ' + (cat ? cat.name : '')).toLowerCase();
      return '<div class="' + colCls + '" data-item data-category="' + esc(s.category) + '" data-q="' + esc(q) + '">' + C.serviceCard(s) + '</div>';
    }).join('');
    var empty = x.empty || {};
    var body =
      '<div class="filter-bar">' +
        '<div class="search-input"><label class="visually-hidden" for="svc-search">' + esc(x.searchLabel || 'Cari layanan') + '</label>' + ico('search') +
        '<input id="svc-search" type="search" class="form-control" placeholder="' + esc(x.searchPlaceholder || '') + '" autocomplete="off"></div>' +
        '<div class="chips" role="group" aria-label="Filter kategori">' + chips + '</div></div>' +
      '<p class="result-count" id="svc-count" role="status" aria-live="polite"></p>' +
      '<div class="row g-3 g-lg-4 svc-list svc-list--' + variant + '" id="svc-list">' + items + '</div>' +
      '<div class="empty-state" id="svc-empty" hidden><span class="ico">' + ico('search-x', 'i-lg') + '</span><h2>' + esc(empty.title) + '</h2><p>' + esc(empty.text) + '</p>' +
      '<a class="btn btn-wa" data-wa>' + WA + ' ' + esc(empty.button) + '</a></div>';
    var cr = [{ label: 'Beranda', route: 'home' }, { label: x.title }];
    return {
      html: crumbs(cr) + pageHead(x.title, x.lead) + '<section class="section pt-4" aria-label="Daftar layanan"><div class="container">' + body + '</div></section>' + ctaBand(),
      meta: { key: 'services', route: 'services', crumbs: crumbMeta(cr) },
      after: initServicesFilter
    };
  };

  function initServicesFilter() {
    var list = document.getElementById('svc-list'), search = document.getElementById('svc-search'), count = document.getElementById('svc-count'), empty = document.getElementById('svc-empty');
    if (!list) return;
    var cols = Array.prototype.slice.call(list.querySelectorAll('[data-item]'));
    var chips = Array.prototype.slice.call(document.querySelectorAll('.chip[data-cat]'));
    function current() { var c = chips.filter(function (b) { return b.getAttribute('aria-pressed') === 'true'; })[0]; return c ? c.getAttribute('data-cat') : 'all'; }
    function apply() {
      var cat = current(), q = search.value.trim().toLowerCase(), n = 0;
      cols.forEach(function (c) {
        var show = (cat === 'all' || c.getAttribute('data-category') === cat) && (!q || c.getAttribute('data-q').indexOf(q) > -1);
        c.classList.toggle('hidden-by-filter', !show);
        if (show) n++;
      });
      count.textContent = n + ' layanan' + (cat !== 'all' ? ' dalam kategori ' + byKey(D.categories, 'slug', cat).name : '') + (q ? ' untuk "' + search.value.trim() + '"' : '');
      empty.hidden = n !== 0;
    }
    function select(cat, pushHash) {
      chips.forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-cat') === cat)); });
      if (pushHash) {                                   /* tautan kategori dari beranda/menu tetap bisa dibagikan */
        var h = cat === 'all' ? window.location.pathname + window.location.search : '#' + cat;
        window.history.replaceState(null, '', h);
      }
      apply();
    }
    chips.forEach(function (b) { b.addEventListener('click', function () { select(b.getAttribute('data-cat'), true); }); });
    search.addEventListener('input', apply);
    window.addEventListener('hashchange', function () { var s = hashSlug(); select(byKey(D.categories, 'slug', s) ? s : 'all', false); });
    apply();
  }

  /* ------------------------------------------------------ /layanan/{slug} */
  function msgOrder(s, root) {
    var parts = [];
    Array.prototype.slice.call(root.querySelectorAll('[data-opt]')).forEach(function (sel) { parts.push(sel.getAttribute('data-opt') + ': ' + sel.value); });
    var qty = root.querySelector('[data-qty]');
    if (qty && qty.value) parts.push('Jumlah: ' + qty.value + ' ' + s.unit);
    return 'Halo ' + T.shortName + ', saya ingin memesan ' + s.name + (parts.length ? ' dengan pilihan: ' + parts.join(', ') : '') + '. Mohon informasi harga dan estimasi selesai.';
  }

  R.service = function () {
    var x = PT.service || {}, s = byKey(D.services, 'slug', hashSlug());
    if (!s) {
      var nf = x.notFound || {};
      return {
        html: crumbs([{ label: 'Beranda', route: 'home' }, { label: 'Layanan', route: 'services' }, { label: nf.title }]) +
          '<section class="section"><div class="container"><div class="empty-state"><span class="ico">' + ico('file-question', 'i-lg') + '</span>' +
          '<h1 id="page-title">' + esc(nf.title) + '</h1><p>' + esc(nf.text) + '</p><a class="btn btn-brand" href="' + url('services') + '">' + esc(nf.button) + '</a></div></div></section>',
        meta: { key: 'service', notFound: true }
      };
    }
    var cat = byKey(D.categories, 'slug', s.category);
    var cr = [{ label: 'Beranda', route: 'home' }, { label: 'Layanan', route: 'services' }];
    if (cat) cr.push({ label: cat.name, route: 'category', slug: cat.slug });
    cr.push({ label: s.name });

    var specs = '<dl class="spec-list">' + s.specs.map(function (p) { return '<div><dt>' + esc(p.label) + '</dt><dd>' + esc(p.value) + '</dd></div>'; }).join('') + '</dl>';
    var optsInfo = s.options.length ? '<ul class="opt-list">' + s.options.map(function (o) {
      return '<li><strong>' + esc(o.label) + '</strong>' + o.choices.map(function (c) { return '<span class="tag-opt">' + esc(c) + '</span>'; }).join('') + '</li>';
    }).join('') + '</ul>' : '';
    var prices = '<table class="price-table"><caption class="visually-hidden">Daftar harga ' + esc(s.name) + '</caption><thead><tr>' +
      '<th scope="col">Spesifikasi</th><th scope="col">Satuan</th><th scope="col">Harga</th><th scope="col">Catatan</th></tr></thead><tbody>' +
      s.pricing.map(function (r) {
        return '<tr><td data-label="Spesifikasi">' + esc(r.spec) + '</td><td data-label="Satuan">' + esc(r.unit) + '</td><td class="price" data-label="Harga">' + rupiah(r.price) + '</td><td data-label="Catatan">' + esc(r.note || '-') + '</td></tr>';
      }).join('') + '</tbody></table>';
    var faqs = (s.faqs && s.faqs.length) ? '<h2 class="h4 mt-5">' + esc(x.faqTitle) + '</h2><div class="faq-list mt-3">' + s.faqs.map(C.faqItem).join('') + '</div>' : '';

    var selects = s.options.map(function (o, i) {
      return '<div class="mb-3"><label class="form-label" for="opt-' + i + '">' + esc(o.label) + '</label><select class="form-select" id="opt-' + i + '" data-opt="' + esc(o.label) + '">' +
        o.choices.map(function (c) { return '<option>' + esc(c) + '</option>'; }).join('') + '</select></div>';
    }).join('');
    var order = '<aside class="order-card" aria-labelledby="order-title"><h2 id="order-title" class="h5">' + esc(x.orderTitle) + '</h2>' +
      '<div class="price-from">Mulai dari<strong>' + rupiah(s.priceFrom) + ' <small class="fw-medium text-muted-x">/ ' + esc(s.unit) + '</small></strong></div>' +
      '<p class="eta">' + ico('clock') + '<span>' + esc(s.eta) + '</span></p>' +
      '<p class="form-note">' + esc(x.orderHint) + '</p>' + selects +
      '<div class="mb-3"><label class="form-label" for="opt-qty">Jumlah (' + esc(s.unit) + ')</label><input class="form-control" id="opt-qty" type="number" min="1" inputmode="numeric" placeholder="Opsional" data-qty></div>' +
      '<a class="btn btn-wa btn-lg w-100" id="order-wa" data-wa data-wa-msg="' + esc(msgOrder(s, document.createElement('div'))) + '">' + WA + ' ' + esc(x.orderButton) + '</a></aside>';

    var related = (s.related || []).map(function (sl) { return byKey(D.services, 'slug', sl); }).filter(Boolean);
    var relatedHtml = related.length ? '<section class="section section-alt" aria-labelledby="related-title"><div class="container"><h2 id="related-title" class="h3 mb-4">' + esc(x.relatedTitle) + '</h2>' +
      '<div class="row g-3 g-lg-4">' + related.map(function (r) { return '<div class="col-12 col-md-6 col-lg-4">' + C.serviceCard(r) + '</div>'; }).join('') + '</div></div></section>' : '';

    var head = '<section class="page-head page-head--service" aria-labelledby="page-title"><div class="container">' +
      '<div class="d-flex flex-wrap gap-2 mb-3">' + (cat ? '<a class="tag-pill" href="' + url('category', cat.slug) + '">' + esc(cat.name) + '</a>' : '') + '</div>' +
      '<h1 id="page-title">' + esc(s.name) + '</h1><p class="page-lead">' + esc(s.short) + '</p></div></section>';

    var main = '<section class="section pt-4"><div class="container"><div class="row g-4 g-lg-5 align-items-start">' +
      '<div class="col-lg-8"><figure class="detail-media"><img src="' + esc(s.image) + '" alt="' + esc(s.imageAlt) + '" width="800" height="600"></figure>' +
      '<h2 class="h4">Tentang layanan ini</h2><p class="text-muted-x">' + esc(s.description) + '</p>' +
      '<h2 class="h4 mt-4">Spesifikasi</h2>' + specs + (optsInfo ? '<h2 class="h4 mt-4">Pilihan tersedia</h2>' + optsInfo : '') +
      '<h2 class="h4 mt-5" id="pricing-title">' + esc(x.pricingTitle) + '</h2>' + prices + '<p class="form-note mt-2">' + esc(x.pricingNote) + '</p>' + faqs + '</div>' +
      '<div class="col-lg-4">' + order + '</div></div></div></section>';

    return {
      html: crumbs(cr) + head + main + relatedHtml + ctaBand(),
      meta: { key: 'service', route: 'service', service: s, category: cat, crumbs: crumbMeta(cr), faqs: s.faqs || [] },
      after: function () {
        var card = document.querySelector('.order-card'), wa = document.getElementById('order-wa');
        if (!card || !wa) return;
        var upd = function () { wa.setAttribute('data-wa-msg', msgOrder(s, card)); PS.applyWa(card); };
        card.addEventListener('change', upd); card.addEventListener('input', upd);
        upd();
      }
    };
  };

  /* --------------------------------------------------------------- /harga */
  R.pricing = function () {
    var x = PT.pricing || {}, col = x.columns || {};
    var groups = D.categories.map(function (c) {
      var list = D.services.filter(function (s) { return s.category === c.slug && s.pricing && s.pricing.length; });
      return list.length ? { cat: c, list: list } : null;
    }).filter(Boolean);
    var jump = '<nav class="chips mt-4" aria-label="' + esc(x.jumpLabel) + '">' + groups.map(function (g) {
      return '<a class="chip" href="#harga-' + esc(g.cat.slug) + '">' + esc(g.cat.name) + '</a>';
    }).join('') + '</nav>';
    var body = groups.map(function (g) {
      var tables = g.list.map(function (s) {
        return '<div class="price-block"><div class="price-block-head"><h3 class="h5"><a href="' + url('service', s.slug) + '">' + esc(s.name) + '</a></h3>' +
          '<a class="link-arrow" href="' + url('service', s.slug) + '">Lihat detail ' + ico('arrow-right') + '</a></div>' +
          '<table class="price-table"><caption class="visually-hidden">Harga ' + esc(s.name) + '</caption><thead><tr>' +
          '<th scope="col">' + esc(col.spec) + '</th><th scope="col">' + esc(col.unit) + '</th><th scope="col">' + esc(col.price) + '</th><th scope="col">' + esc(col.note) + '</th></tr></thead><tbody>' +
          s.pricing.map(function (r) {
            return '<tr><td data-label="' + esc(col.spec) + '">' + esc(r.spec) + '</td><td data-label="' + esc(col.unit) + '">' + esc(r.unit) + '</td>' +
              '<td class="price" data-label="' + esc(col.price) + '">' + rupiah(r.price) + '</td><td data-label="' + esc(col.note) + '">' + esc(r.note || '-') + '</td></tr>';
          }).join('') + '</tbody></table></div>';
      }).join('');
      return '<section class="price-group" id="harga-' + esc(g.cat.slug) + '" aria-labelledby="pg-' + esc(g.cat.slug) + '">' +
        '<div class="price-group-head"><span class="ico">' + ico(g.cat.icon, 'i-lg') + '</span><div><h2 class="h3" id="pg-' + esc(g.cat.slug) + '">' + esc(g.cat.name) + '</h2><p>' + esc(g.cat.description) + '</p></div></div>' + tables + '</section>';
    }).join('');
    var cr = [{ label: 'Beranda', route: 'home' }, { label: x.title }];
    return {
      html: crumbs(cr) + pageHead(x.title, x.lead, jump) +
        '<section class="section pt-4" aria-label="Daftar harga"><div class="container">' + body +
        '<div class="note-box">' + ico('info') + '<p>' + esc(x.note) + '</p></div></div></section>' + ctaBand(),
      meta: { key: 'pricing', route: 'pricing', crumbs: crumbMeta(cr) }
    };
  };

  /* ------------------------------------------------- pasang ke <main> */
  function render() {
    var main = document.getElementById('main');
    if (!main || !R[pageKey]) return;
    var out = R[pageKey]();
    main.innerHTML = out.html;
    PS.pageMeta = out.meta;
    PS.pageAfter = out.after || null;
    if (window.lucide && window.lucide.createIcons && main.querySelector('[data-lucide]') && document.documentElement.classList.contains('js-ready')) window.lucide.createIcons();
    PS.applyWa(main);
    if (out.after) out.after();
  }

  PS.use(function () {
    if (!R[pageKey]) return;
    render();
    /* Detail layanan memakai hash sebagai slug (di Laravel: /layanan/{slug}); ganti hash = ganti layanan */
    if (pageKey === 'service') window.addEventListener('hashchange', function () {
      render();
      if (PS.seo) PS.seo.applyPage();
      window.scrollTo(0, 0);
    });
  });
})();
