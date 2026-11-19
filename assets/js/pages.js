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
 *   R.portfolio -> pages/portfolio.blade.php  (filter kategori via ?kategori=)
 *   R.about    -> pages/about.blade.php
 *   R.contact  -> pages/contact.blade.php     (POST /kontak: validasi + antispam di server)
 *   R.blog     -> pages/blog.blade.php        (/artikel; varian grid|list dari site.pages.blog.variant)
 *   R.article  -> pages/article.blade.php     (/artikel/{slug}; di mockup slug = hash)
 *   R.faq      -> pages/faq.blade.php         (/faq; JSON-LD FAQPage dari semua pertanyaan)
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
  /* Hash yang menunjuk elemen halaman (mis. #main dari tautan lompat ke konten) bukan slug: abaikan */
  var isAnchor = function () { var h = window.location.hash.slice(1); return !!h && !!document.getElementById(h); };
  var list = function (v) { return Array.isArray(v) ? v : []; };   /* data tenant yang salah tipe jangan merusak halaman */
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
    var catalog = variant === 'catalog';           /* filter di sisi kiri + kartu di kanan (template Katalog B2B) */
    if (catalog) chips = '<button type="button" class="chip" data-cat="all" aria-pressed="' + (active === 'all') + '">Semua <span class="chip-n">' + D.services.length + '</span></button>' +
      D.categories.map(function (c) {
        var n = D.services.filter(function (s) { return s.category === c.slug; }).length;
        return '<button type="button" class="chip" data-cat="' + esc(c.slug) + '" aria-pressed="' + (active === c.slug) + '">' + esc(c.name) + ' <span class="chip-n">' + n + '</span></button>';
      }).join('');
    var colCls = variant === 'list' ? 'col-12' : catalog ? 'col-12 col-md-6 col-xl-4' : 'col-12 col-md-6 col-lg-4';
    var items = D.services.map(function (s) {
      var cat = byKey(D.categories, 'slug', s.category);
      var q = (s.name + ' ' + s.short + ' ' + (cat ? cat.name : '')).toLowerCase();
      return '<div class="' + colCls + '" data-item data-category="' + esc(s.category) + '" data-q="' + esc(q) + '">' + C.serviceCard(s) + '</div>';
    }).join('');
    var empty = x.empty || {};
    var search = '<div class="search-input"><label class="visually-hidden" for="svc-search">' + esc(x.searchLabel || 'Cari layanan') + '</label>' + ico('search') +
        '<input id="svc-search" type="search" class="form-control" placeholder="' + esc(x.searchPlaceholder || '') + '" autocomplete="off"></div>';
    var listHtml = '<p class="result-count" id="svc-count" role="status" aria-live="polite"></p>' +
      '<div class="row g-3 g-lg-4 svc-list svc-list--' + variant + '" id="svc-list">' + items + '</div>' +
      '<div class="empty-state" id="svc-empty" hidden><span class="ico">' + ico('search-x', 'i-lg') + '</span><h2>' + esc(empty.title) + '</h2><p>' + esc(empty.text) + '</p>' +
      '<a class="btn btn-wa" data-wa>' + WA + ' ' + esc(empty.button) + '</a></div>';
    var help = x.help || {};
    var body = catalog
      ? '<div class="catalog-layout"><aside class="catalog-side" aria-label="' + esc(x.filterLabel || 'Filter katalog') + '">' + search +
          '<h3 class="catalog-side-title">' + esc(x.categoryLabel || 'Kategori') + '</h3><div class="chips chips--stack" role="group" aria-label="Filter kategori">' + chips + '</div>' +
          (help.title ? '<div class="catalog-help"><strong>' + esc(help.title) + '</strong><p>' + esc(help.text) + '</p><a class="btn btn-wa btn-sm w-100" data-wa>' + WA + ' ' + esc(help.button) + '</a></div>' : '') +
        '</aside><div class="catalog-main">' + listHtml + '</div></div>'
      : '<div class="filter-bar">' + search + '<div class="chips" role="group" aria-label="Filter kategori">' + chips + '</div></div>' + listHtml;
    var cr = [{ label: 'Beranda', route: 'home' }, { label: x.title }];
    return {
      html: crumbs(cr) + pageHead(x.title, x.lead) + '<section class="section pt-4" aria-labelledby="svc-list-title"><div class="container"><h2 class="visually-hidden" id="svc-list-title">' + esc(x.listTitle || x.title) + '</h2>' + body + '</div></section>' + ctaBand(),
      meta: { key: 'services', route: 'services', crumbs: crumbMeta(cr) },
      after: initServicesFilter
    };
  };

  /* Filter kategori (+ pencarian opsional) untuk daftar layanan dan portofolio.
     cfg: { list, search?, count, empty, noun } -> id elemen. Setiap item: [data-item][data-category][data-q]. */
  function initFilter(cfg) {
    var list = document.getElementById(cfg.list), search = cfg.search ? document.getElementById(cfg.search) : null;
    var count = document.getElementById(cfg.count), empty = document.getElementById(cfg.empty);
    if (!list) return;
    var cols = Array.prototype.slice.call(list.querySelectorAll('[data-item]'));
    var chips = Array.prototype.slice.call(document.querySelectorAll('.chip[data-cat]'));
    function current() { var c = chips.filter(function (b) { return b.getAttribute('aria-pressed') === 'true'; })[0]; return c ? c.getAttribute('data-cat') : 'all'; }
    function apply() {
      var cat = current(), q = search ? search.value.trim().toLowerCase() : '', n = 0;
      cols.forEach(function (c) {
        var show = (cat === 'all' || c.getAttribute('data-category') === cat) && (!q || c.getAttribute('data-q').indexOf(q) > -1);
        c.classList.toggle('hidden-by-filter', !show);
        if (show) n++;
      });
      var cobj = cat !== 'all' ? byKey(cfg.cats || D.categories, 'slug', cat) : null;
      count.textContent = n + ' ' + cfg.noun + (cobj ? ' dalam kategori ' + cobj.name : '') + (q ? ' untuk "' + search.value.trim() + '"' : '');
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
    if (search) search.addEventListener('input', apply);
    window.addEventListener('hashchange', function () { if (isAnchor()) return; var s = hashSlug(); select(chips.some(function (b) { return b.getAttribute('data-cat') === s; }) ? s : 'all', false); });
    apply();
  }
  function initServicesFilter() { initFilter({ list: 'svc-list', search: 'svc-search', count: 'svc-count', empty: 'svc-empty', noun: 'layanan' }); }

  /* ------------------------------------------------------ /layanan/{slug} */
  function msgOrder(s, root) {
    var ask = PS.modules.order === 'inquiry';
    var parts = [];
    Array.prototype.slice.call(root.querySelectorAll('[data-opt]')).forEach(function (sel) { parts.push(sel.getAttribute('data-opt') + ': ' + sel.value); });
    var qty = root.querySelector('[data-qty]');
    if (qty && qty.value) parts.push('Jumlah: ' + qty.value + ' ' + s.unit);
    return 'Halo ' + T.shortName + ', saya ingin ' + (ask ? 'bertanya mengenai ' : 'memesan ') + s.name + (parts.length ? ' dengan pilihan: ' + parts.join(', ') : '') + '. Mohon informasi harga dan estimasi selesai.';
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

    var sp = list(s.specs), op = list(s.options), pr = list(s.pricing), fq = list(s.faqs);
    var specs = !sp.length ? '' : '<h2 class="h4 mt-4">Spesifikasi</h2><dl class="spec-list">' + sp.map(function (p) { return '<div><dt>' + esc(p.label) + '</dt><dd>' + esc(p.value) + '</dd></div>'; }).join('') + '</dl>';
    var optsInfo = op.length ? '<ul class="opt-list">' + op.map(function (o) {
      return '<li><strong>' + esc(o.label) + '</strong>' + o.choices.map(function (c) { return '<span class="tag-opt">' + esc(c) + '</span>'; }).join('') + '</li>';
    }).join('') + '</ul>' : '';
    var showPrices = PS.modules.prices;
    var prices = !pr.length || !showPrices ? '' : '<h2 class="h4 mt-5" id="pricing-title">' + esc(x.pricingTitle) + '</h2><table class="price-table"><caption class="visually-hidden">Daftar harga ' + esc(s.name) + '</caption><thead><tr>' +
      '<th scope="col">Spesifikasi</th><th scope="col">Satuan</th><th scope="col">Harga</th><th scope="col">Catatan</th></tr></thead><tbody>' +
      pr.map(function (r) {
        return '<tr><td data-label="Spesifikasi">' + esc(r.spec) + '</td><td data-label="Satuan">' + esc(r.unit) + '</td><td class="price" data-label="Harga">' + rupiah(r.price) + '</td><td data-label="Catatan">' + esc(r.note || '-') + '</td></tr>';
      }).join('') + '</tbody></table><p class="form-note mt-2">' + esc(x.pricingNote) + '</p>';
    var faqs = fq.length ? '<h2 class="h4 mt-5">' + esc(x.faqTitle) + '</h2><div class="faq-list mt-3">' + fq.map(C.faqItem).join('') + '</div>' : '';

    var selects = op.map(function (o, i) {
      return '<div class="mb-3"><label class="form-label" for="opt-' + i + '">' + esc(o.label) + '</label><select class="form-select" id="opt-' + i + '" data-opt="' + esc(o.label) + '">' +
        o.choices.map(function (c) { return '<option>' + esc(c) + '</option>'; }).join('') + '</select></div>';
    }).join('');
    var contactOnly = PS.modules.order === 'contact';       /* paket Company Profile: tanpa pilihan dan tombol pesan per layanan */
    var order = '<aside class="order-card" aria-labelledby="order-title"><h2 id="order-title" class="h5">' + esc(x.orderTitle) + '</h2>' +
      (showPrices ? '<div class="price-from">Mulai dari<strong>' + rupiah(s.priceFrom) + ' <small class="fw-medium text-muted-x">/ ' + esc(s.unit) + '</small></strong></div>' : '') +
      '<p class="eta">' + ico('clock') + '<span>' + esc(s.eta) + '</span></p>' +
      '<p class="form-note">' + esc(x.orderHint) + '</p>' +
      (contactOnly
        ? '<a class="btn btn-brand btn-lg w-100" href="' + url('contact') + '">' + ico('message-square') + ' ' + esc(x.orderButton) + '</a></aside>'
        : PS.modules.order === 'inquiry'
          ? selects +
            '<div class="mb-3"><label class="form-label" for="opt-qty">Jumlah (' + esc(s.unit) + ')</label><input class="form-control" id="opt-qty" type="number" min="1" inputmode="numeric" placeholder="Opsional" data-qty></div>' +
            '<button type="button" class="btn btn-brand btn-lg w-100" data-inq-add="' + esc(s.slug) + '" data-inq-form>' + ico('plus') + ' ' + esc(x.orderButton) + '</button>' +
            '<a class="btn btn-outline-wa w-100 mt-2" id="order-wa" data-wa data-wa-msg="' + esc(msgOrder(s, document.createElement('div'))) + '">' + WA + ' ' + esc(x.orderAlt || 'Tanya langsung via WhatsApp') + '</a></aside>'
          : selects +
          '<div class="mb-3"><label class="form-label" for="opt-qty">Jumlah (' + esc(s.unit) + ')</label><input class="form-control" id="opt-qty" type="number" min="1" inputmode="numeric" placeholder="Opsional" data-qty></div>' +
          '<a class="btn btn-wa btn-lg w-100" id="order-wa" data-wa data-wa-msg="' + esc(msgOrder(s, document.createElement('div'))) + '">' + WA + ' ' + esc(x.orderButton) + '</a></aside>');

    var related = list(s.related).map(function (sl) { return byKey(D.services, 'slug', sl); }).filter(Boolean);
    var relatedHtml = related.length ? '<section class="section section-alt" aria-labelledby="related-title"><div class="container"><h2 id="related-title" class="h3 mb-4">' + esc(x.relatedTitle) + '</h2>' +
      '<div class="row g-3 g-lg-4">' + related.map(function (r) { return '<div class="col-12 col-md-6 col-lg-4">' + C.serviceCard(r) + '</div>'; }).join('') + '</div></div></section>' : '';

    var head = '<section class="page-head page-head--service" aria-labelledby="page-title"><div class="container">' +
      '<div class="d-flex flex-wrap gap-2 mb-3">' + (cat ? '<a class="tag-pill" href="' + url('category', cat.slug) + '">' + esc(cat.name) + '</a>' : '') + '</div>' +
      '<h1 id="page-title">' + esc(s.name) + '</h1><p class="page-lead">' + esc(s.short) + '</p></div></section>';

    var main = '<section class="section pt-4"><div class="container"><div class="row g-4 g-lg-5">' +
      '<div class="col-lg-8"><figure class="detail-media"><img src="' + esc(s.image) + '" alt="' + esc(s.imageAlt) + '" width="800" height="600"></figure>' +
      '<h2 class="h4">Tentang layanan ini</h2><p class="text-muted-x">' + esc(s.description) + '</p>' +
      specs + (optsInfo ? '<h2 class="h4 mt-4">Pilihan tersedia</h2>' + optsInfo : '') + prices + faqs + '</div>' +
      '<div class="col-lg-4">' + order + '</div></div></div></section>';

    return {
      html: crumbs(cr) + head + main + relatedHtml + ctaBand(),
      meta: { key: 'service', route: 'service', service: s, category: cat, crumbs: crumbMeta(cr), faqs: fq },
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
    if (!PS.modules.pricingPage) {                       /* paket tanpa halaman harga: alamat langsung tidak boleh menampilkan harga */
      var na = x.unavailable || { title: 'Halaman tidak tersedia', text: 'Informasi harga tidak ditampilkan di situs ini. Hubungi kami untuk penawaran sesuai kebutuhan Anda.', button: 'Hubungi Kami' };
      return {
        html: crumbs([{ label: 'Beranda', route: 'home' }, { label: na.title }]) +
          '<section class="section"><div class="container"><div class="empty-state"><span class="ico">' + ico('file-question', 'i-lg') + '</span>' +
          '<h1 id="page-title">' + esc(na.title) + '</h1><p>' + esc(na.text) + '</p><a class="btn btn-brand" href="' + url('contact') + '">' + esc(na.button) + '</a></div></div></section>',
        meta: { key: 'pricing', route: 'pricing', notFound: true }
      };
    }
    var groups = D.categories.map(function (c) {
      var inCat = D.services.filter(function (s) { return s.category === c.slug && Array.isArray(s.pricing) && s.pricing.length; });
      return inCat.length ? { cat: c, list: inCat } : null;
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

  /* ---------------------------------------------------------- /portofolio */
  R.portfolio = function () {
    var x = PT.portfolio || {};
    var cats = D.categories.filter(function (c) { return D.portfolio.some(function (p) { return p.category === c.slug; }); });
    var active = byKey(cats, 'slug', hashSlug()) ? hashSlug() : 'all';   /* hash kategori tanpa karya -> Semua */
    var chips = '<button type="button" class="chip" data-cat="all" aria-pressed="' + (active === 'all') + '">Semua</button>' + cats.map(function (c) {
      return '<button type="button" class="chip" data-cat="' + esc(c.slug) + '" aria-pressed="' + (active === c.slug) + '">' + esc(c.name) + '</button>';
    }).join('');
    var items = D.portfolio.map(function (p, i) {
      return '<div class="col-6 col-lg-4" data-item data-category="' + esc(p.category) + '">' + C.portfolioCard(p, i) + '</div>';
    }).join('');
    var empty = x.empty || {};
    var body = '<div class="filter-bar"><div class="chips" role="group" aria-label="Filter kategori">' + chips + '</div></div>' +
      '<p class="result-count" id="pf-count" role="status" aria-live="polite"></p>' +
      '<div class="row g-3 g-lg-4" id="pf-list" data-lightbox-group>' + items + '</div>' +
      '<div class="empty-state" id="pf-empty" hidden><span class="ico">' + ico('image-off', 'i-lg') + '</span><h2>' + esc(empty.title) + '</h2><p>' + esc(empty.text) + '</p>' +
      '<a class="btn btn-wa" data-wa>' + WA + ' ' + esc(empty.button) + '</a></div>';
    var cr = [{ label: 'Beranda', route: 'home' }, { label: x.title }];
    return {
      html: crumbs(cr) + pageHead(x.title, x.lead) + '<section class="section pt-4" aria-labelledby="pf-title"><div class="container"><h2 class="visually-hidden" id="pf-title">' + esc(x.listTitle || x.title) + '</h2>' + body + '</div></section>' + ctaBand(),
      meta: {
        key: 'portfolio', route: 'portfolio', crumbs: crumbMeta(cr),
        pageLd: function (pageUrl) {
          return { '@context': 'https://schema.org', '@type': 'CollectionPage', name: x.title, url: pageUrl,
            hasPart: D.portfolio.map(function (p) { return { '@type': 'ImageObject', name: p.title, description: p.description, contentUrl: PS.seo.abs(p.image) }; }) };
        }
      },
      after: function () { initFilter({ list: 'pf-list', count: 'pf-count', empty: 'pf-empty', noun: x.countNoun || 'karya' }); }
    };
  };

  /* ------------------------------------------------------------- /tentang-kami */
  R.about = function () {
    var x = PT.about || {}, a = (T.aboutPage && typeof T.aboutPage === 'object') ? T.aboutPage : {};
    var mission = list(a.mission).filter(function (m) { return typeof m === 'string' && m; });
    var ms = list(a.milestones).filter(function (m) { return m && typeof m === 'object' && (m.title || m.text); });
    var vis = (a.vision && typeof a.vision === 'object' && (a.vision.title || a.vision.text)) ? a.vision : null;
    var vm = (vis || mission.length) ? '<section class="section section-alt" aria-labelledby="vm-title"><div class="container"><div class="section-head"><h2 id="vm-title">' + esc(x.visionTitle) + '</h2></div>' +
      '<div class="row g-3 g-lg-4">' +
      (vis ? '<div class="col-lg-5"><div class="card-x vm-card"><span class="ico">' + ico('eye') + '</span><h3>' + esc(vis.title) + '</h3><p>' + esc(vis.text) + '</p></div></div>' : '') +
      (mission.length ? '<div class="col-lg-7"><div class="card-x vm-card"><span class="ico">' + ico('target') + '</span><h3>' + esc(a.missionTitle) + '</h3><ul class="check-list">' +
        mission.map(function (m) { return '<li>' + ico('circle-check') + '<span>' + esc(m) + '</span></li>'; }).join('') + '</ul></div></div>' : '') +
      '</div></div></section>' : '';
    var timeline = ms.length ? '<section class="section" aria-labelledby="ms-title"><div class="container"><div class="section-head"><h2 id="ms-title">' + esc(x.milestonesTitle) + '</h2>' +
      (x.milestonesText ? '<p>' + esc(x.milestonesText) + '</p>' : '') + '</div><ol class="milestones">' +
      ms.map(function (m) { return '<li class="milestone"><span class="milestone-year">' + esc(m.year) + '</span><div><h3>' + esc(m.title) + '</h3><p>' + esc(m.text) + '</p></div></li>'; }).join('') +
      '</ol></div></section>' : '';
    var cr = [{ label: 'Beranda', route: 'home' }, { label: x.title }];
    return {
      html: crumbs(cr) + pageHead(x.title, x.lead) + PS.sections.about('split', { alt: false, noCta: true }) + vm + timeline + PS.sections.why('grid', { alt: true }) + ctaBand(),
      meta: {
        key: 'about', route: 'about', crumbs: crumbMeta(cr),
        pageLd: function (pageUrl) {
          var biz = { '@type': 'LocalBusiness', name: T.name, url: PS.seo.abs('/') };
          if (T.since) biz.foundingDate = String(T.since);
          return { '@context': 'https://schema.org', '@type': 'AboutPage', name: x.title, url: pageUrl, about: biz };
        }
      }
    };
  };

  /* ------------------------------------------------------------------ /kontak */
  var PHONE_RE = /^(\+?62|0)8\d{8,11}$/;      /* ponsel Indonesia: 10-13 digit */
  R.contact = function () {
    var x = PT.contact || {}, f = x.fields || {};
    var svcOpts = '<option value="">' + esc((f.service || {}).other) + '</option>' + D.services.map(function (s) { return '<option>' + esc(s.name) + '</option>'; }).join('');
    function field(id, inner, hint) { return '<div class="mb-3" data-field="' + id + '">' + inner + '<div class="invalid-msg" id="c-' + id + '-err" hidden>' + esc(hint || '') + '</div></div>'; }
    var form = '<form class="contact-form card-x" id="contact-form" novalidate aria-labelledby="form-title">' +
      '<h2 class="h4" id="form-title">' + esc(x.formTitle) + '</h2><p class="form-note">' + esc(x.formHint) + '</p>' +
      field('name', '<label class="form-label" for="c-name">' + esc(f.name.label) + ' *</label><input class="form-control" id="c-name" name="name" maxlength="80" autocomplete="name" placeholder="' + esc(f.name.placeholder) + '" required aria-describedby="c-name-err">', f.name.error) +
      field('phone', '<label class="form-label" for="c-phone">' + esc(f.phone.label) + ' *</label><input class="form-control" id="c-phone" name="phone" type="tel" inputmode="tel" maxlength="20" autocomplete="tel" placeholder="' + esc(f.phone.placeholder) + '" required aria-describedby="c-phone-err">', f.phone.error) +
      '<div class="mb-3"><label class="form-label" for="c-service">' + esc(f.service.label) + '</label><select class="form-select" id="c-service" name="service">' + svcOpts + '</select></div>' +
      field('message', '<label class="form-label" for="c-message">' + esc(f.message.label) + ' *</label><textarea class="form-control" id="c-message" name="message" rows="5" maxlength="1000" placeholder="' + esc(f.message.placeholder) + '" required aria-describedby="c-message-err"></textarea>', f.message.error) +
      '<div class="visually-hidden" aria-hidden="true"><label>Jangan diisi <input type="text" name="website" tabindex="-1" autocomplete="off"></label></div>' +   /* honeypot spam; Laravel: validasi sisi server */
      '<button type="submit" class="btn btn-wa btn-lg w-100">' + WA + ' ' + esc(x.submit) + '</button>' +
      '<div class="form-success" id="contact-success" role="status" tabindex="-1">' + ico('circle-check') + '<div><strong>' + esc((x.success || {}).title) + '</strong><p class="mb-2">' + esc((x.success || {}).text) + '</p>' +
      '<a class="btn btn-wa btn-sm" id="contact-wa" target="_blank" rel="noopener noreferrer">' + WA + ' ' + esc((x.success || {}).button) + '</a></div></div></form>';
    var info = '<div class="loc-card loc-card--page"><h2 class="h4">' + esc(x.infoTitle) + '</h2>' + PS.sections.parts.infoRows() + '</div>';
    var cr = [{ label: 'Beranda', route: 'home' }, { label: x.title }];
    return {
      html: crumbs(cr) + pageHead(x.title, x.lead) + '<section class="section pt-4" aria-label="Formulir dan informasi kontak"><div class="container"><div class="row g-4 g-lg-5">' +
        '<div class="col-lg-7">' + form + '</div><div class="col-lg-5">' + info + '</div>' +
        '<div class="col-12">' + PS.sections.parts.mapFrame() + '</div></div></div></section>',
      meta: {
        key: 'contact', route: 'contact', crumbs: crumbMeta(cr),
        pageLd: function (pageUrl) { return { '@context': 'https://schema.org', '@type': 'ContactPage', name: x.title, url: pageUrl, about: { '@type': 'LocalBusiness', name: T.name, telephone: '+' + T.phone, email: T.email } }; }
      },
      after: initContactForm
    };
  };

  function initContactForm() {
    var form = document.getElementById('contact-form');
    if (!form) return;
    var x = PT.contact || {};
    var rules = {
      name: function (v) { return v.trim().length >= 2; },
      phone: function (v) { return PHONE_RE.test(v.replace(/[\s.\-()]/g, '')); },
      message: function (v) { return v.trim().length >= 10; }
    };
    function setErr(id, bad) {
      var input = form.querySelector('[name="' + id + '"]'), msg = document.getElementById('c-' + id + '-err');
      input.classList.toggle('is-invalid', bad); input.setAttribute('aria-invalid', String(bad)); msg.hidden = !bad;
    }
    Object.keys(rules).forEach(function (id) {
      var input = form.querySelector('[name="' + id + '"]');
      input.addEventListener('blur', function () { setErr(id, !rules[id](input.value)); });
      input.addEventListener('input', function () { if (input.classList.contains('is-invalid') && rules[id](input.value)) setErr(id, false); });
    });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (form.website.value) return;                                  /* honeypot terisi: kemungkinan bot */
      var firstBad = null;
      Object.keys(rules).forEach(function (id) { var bad = !rules[id](form[id].value); setErr(id, bad); if (bad && !firstBad) firstBad = form[id]; });
      if (firstBad) { firstBad.focus(); return; }
      var svc = form.service.value;
      var msg = 'Halo ' + T.shortName + ', saya ' + form.name.value.trim() + ' (WA ' + form.phone.value.trim() + ').' +
        (svc ? ' Saya tertarik dengan layanan ' + svc + '.' : '') + '\n\n' + form.message.value.trim();
      var enc; try { enc = encodeURIComponent(msg); } catch (err) { enc = encodeURIComponent(msg.replace(/[\uD800-\uDFFF]/g, '')); }   /* karakter surrogat tunggal (tempel/IME) */
      var link = 'https://wa.me/' + T.whatsapp + '?text=' + enc;
      var ok = document.getElementById('contact-success'), a = document.getElementById('contact-wa');
      a.href = link; ok.classList.add('is-shown'); ok.focus();
      window.open(link, '_blank', 'noopener');
    });
  }

  /* ------------------------------------------------- pasang ke <main> */
  /* ------------------------------------------------------------ /artikel */
  var slugify = function (v) { return String(v || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''); };
  var articles = function () {                       /* terbaru dulu; abaikan data yang bukan objek / tanpa slug */
    return list(D.articles).filter(function (a) { return a && typeof a === 'object' && a.slug && a.title; })
      .slice().sort(function (a, b) { return String(b.date || '').localeCompare(String(a.date || '')); });
  };
  var articleCats = function (arts) {
    var seen = {}, out = [];
    arts.forEach(function (a) { var sl = slugify(a.category); if (sl && !seen[sl]) { seen[sl] = 1; out.push({ slug: sl, name: a.category }); } });
    return out;
  };

  R.blog = function () {
    var x = PT.blog || {}; x = { title: x.title || 'Artikel', lead: x.lead, listTitle: x.listTitle, searchLabel: x.searchLabel, searchPlaceholder: x.searchPlaceholder, countNoun: x.countNoun, empty: x.empty }; var variant = PS.site.pages.blog.variant, arts = articles(), cats = articleCats(arts);
    var active = byKey(cats, 'slug', hashSlug()) ? hashSlug() : 'all';
    var chips = '<button type="button" class="chip" data-cat="all" aria-pressed="' + (active === 'all') + '">Semua</button>' + cats.map(function (c) {
      return '<button type="button" class="chip" data-cat="' + esc(c.slug) + '" aria-pressed="' + (active === c.slug) + '">' + esc(c.name) + '</button>';
    }).join('');
    var colCls = variant === 'list' ? 'col-12' : 'col-12 col-md-6 col-lg-4';
    var items = arts.map(function (a) {
      var q = (a.title + ' ' + (a.excerpt || '') + ' ' + (a.category || '')).toLowerCase();
      return '<div class="' + colCls + '" data-item data-category="' + esc(slugify(a.category)) + '" data-q="' + esc(q) + '">' + C.articleCard(a) + '</div>';
    }).join('');
    var empty = x.empty || {};
    var body =
      '<div class="filter-bar">' +
        '<div class="search-input"><label class="visually-hidden" for="art-search">' + esc(x.searchLabel || 'Cari artikel') + '</label>' + ico('search') +
        '<input id="art-search" type="search" class="form-control" placeholder="' + esc(x.searchPlaceholder || '') + '" autocomplete="off"></div>' +
        '<div class="chips" role="group" aria-label="Filter kategori">' + chips + '</div></div>' +
      '<p class="result-count" id="art-count" role="status" aria-live="polite"></p>' +
      '<div class="row g-3 g-lg-4 art-list art-list--' + variant + '" id="art-list">' + items + '</div>' +
      '<div class="empty-state" id="art-empty" hidden><span class="ico">' + ico('search-x', 'i-lg') + '</span><h2>' + esc(empty.title) + '</h2><p>' + esc(empty.text) + '</p>' +
      '<a class="btn btn-wa" data-wa>' + WA + ' ' + esc(empty.button) + '</a></div>';
    var cr = [{ label: 'Beranda', route: 'home' }, { label: x.title }];
    return {
      html: crumbs(cr) + pageHead(x.title, x.lead) + '<section class="section pt-4" aria-labelledby="art-list-title"><div class="container"><h2 class="visually-hidden" id="art-list-title">' + esc(x.listTitle || x.title) + '</h2>' + body + '</div></section>' + ctaBand(),
      meta: {
        key: 'blog', route: 'blog', crumbs: crumbMeta(cr),
        pageLd: function (pageUrl) {
          return { '@context': 'https://schema.org', '@type': 'Blog', name: x.title, url: pageUrl, inLanguage: 'id-ID',
            publisher: { '@type': 'LocalBusiness', name: T.name, url: PS.seo.abs('/') },
            blogPost: arts.map(function (a) {
              return { '@type': 'BlogPosting', headline: a.title, datePublished: a.date, image: a.image ? PS.seo.abs(a.image) : undefined, url: PS.seo.abs(PS.seo.pathFor('article', a.slug)) };
            }) };
        }
      },
      after: function () { initFilter({ list: 'art-list', search: 'art-search', count: 'art-count', empty: 'art-empty', noun: x.countNoun || 'artikel', cats: cats }); }
    };
  };

  /* ------------------------------------------------------ /artikel/{slug} */
  /* Isi artikel = daftar blok data: { type: 'h2'|'p'|'ul'|'ol'|'note', text | items }. Tidak ada HTML dari data. */
  function articleBlock(b) {
    if (!b || typeof b !== 'object') return '';
    var strs = function (v) { return list(v).filter(function (t) { return typeof t === 'string' && t; }); };
    switch (b.type) {
      case 'h2': return b.text ? '<h2>' + esc(b.text) + '</h2>' : '';
      case 'p': return b.text ? '<p>' + esc(b.text) + '</p>' : '';
      case 'ul': case 'ol': var it = strs(b.items); return it.length ? '<' + b.type + '>' + it.map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') + '</' + b.type + '>' : '';
      case 'note': return b.text ? '<div class="note-box">' + ico('lightbulb') + '<p>' + esc(b.text) + '</p></div>' : '';
      default: return '';
    }
  }

  R.article = function () {
    var x = PT.article || {}, arts = articles(), a = byKey(arts, 'slug', hashSlug());
    if (!a) {
      var nf = x.notFound || {};
      return {
        html: crumbs([{ label: 'Beranda', route: 'home' }, { label: 'Artikel', route: 'blog' }, { label: nf.title }]) +
          '<section class="section"><div class="container"><div class="empty-state"><span class="ico">' + ico('file-question', 'i-lg') + '</span>' +
          '<h1 id="page-title">' + esc(nf.title) + '</h1><p>' + esc(nf.text) + '</p><a class="btn btn-brand" href="' + url('blog') + '">' + esc(nf.button) + '</a></div></div></section>',
        meta: { key: 'article', route: 'article', notFound: true }
      };
    }
    var cr = [{ label: 'Beranda', route: 'home' }, { label: (PT.blog && PT.blog.title) || 'Artikel', route: 'blog' }, { label: a.title }];
    var pageUrl = PS.seo.abs(PS.seo.pathFor('article', a.slug));
    var svcs = list(a.services).map(function (sl) { return byKey(D.services, 'slug', sl); }).filter(Boolean);
    var others = arts.filter(function (o) { return o.slug !== a.slug; });
    var related = others.filter(function (o) { return o.category === a.category; }).concat(others.filter(function (o) { return o.category !== a.category; })).slice(0, 3);
    var share = 'https://wa.me/?text=' + encodeURIComponent(fill(x.shareText, { title: a.title }) + ' ' + pageUrl);

    var head = '<header class="article-head"><div class="container"><div class="article-wrap">' +
      '<span class="tag">' + esc(a.category) + '</span>' +
      '<h1 id="page-title">' + esc(a.title) + '</h1>' +
      '<div class="meta-row">' + PS.metaParts(a, x.readTime, x.by).join('') + '</div>' +
      '</div></div></header>';
    var hero = !a.image ? '' : '<div class="container"><div class="article-wrap article-wrap--wide"><figure class="article-hero"><img src="' + esc(a.image) + '" alt="' + esc(a.imageAlt) + '" width="800" height="600" fetchpriority="high"></figure></div></div>';
    var content = '<div class="container"><div class="article-wrap"><div class="article-body">' + list(a.body).map(articleBlock).join('') + '</div>' +
      '<div class="article-share"><a class="btn btn-outline-brand" href="' + esc(share) + '" target="_blank" rel="noopener noreferrer">' + WA + ' ' + esc(x.share) + '</a>' +
      '<a class="link-arrow" href="' + url('blog') + '">' + ico('arrow-left') + ' ' + esc(x.back) + '</a></div></div></div>';
    var rs = !svcs.length ? '' : '<section class="section section-alt" aria-labelledby="art-svc-title"><div class="container"><div class="section-head"><h2 id="art-svc-title">' + esc(x.servicesTitle) + '</h2></div><div class="row g-3 g-lg-4 justify-content-center">' +
      svcs.map(function (s) { return '<div class="col-12 col-md-6 col-lg-4">' + C.serviceCard(s) + '</div>'; }).join('') + '</div></div></section>';
    var ra = !related.length ? '' : '<section class="section" aria-labelledby="art-rel-title"><div class="container"><div class="section-head"><h2 id="art-rel-title">' + esc(x.relatedTitle) + '</h2></div><div class="row g-3 g-lg-4">' +
      related.map(function (o) { return '<div class="col-12 col-md-6 col-lg-4">' + C.articleCard(o) + '</div>'; }).join('') + '</div></div></section>';
    return {
      html: crumbs(cr) + '<article class="article-page">' + head + hero + content + '</article>' + rs + ra + ctaBand(),
      meta: {
        key: 'article', route: 'article', article: a, crumbs: crumbMeta(cr),
        pageLd: function (u) {
          return { '@context': 'https://schema.org', '@type': 'Article', headline: a.title, description: a.excerpt, image: a.image ? [PS.seo.abs(a.image)] : undefined,
            datePublished: a.date, dateModified: a.date, articleSection: a.category, inLanguage: 'id-ID',
            author: { '@type': 'Organization', name: a.author || T.name },
            publisher: { '@type': 'Organization', name: T.name, url: PS.seo.abs('/') },
            mainEntityOfPage: { '@type': 'WebPage', '@id': u } };
        }
      }
    };
  };

  /* ------------------------------------------------------------ /faq */
  R.faq = function () {
    var x = PT.faq || {}; if (!x.title) x = Object.assign({}, x, { title: 'Pertanyaan Umum' }); var all = list(D.faqs).filter(function (f) { return f && typeof f === 'object' && f.q && f.a; });
    var seenG = {};
    var groups = list(D.faqGroups).filter(function (g) { if (!g || !g.slug || seenG[g.slug]) return false; seenG[g.slug] = 1; return true; }).map(function (g) {
      return { slug: g.slug, name: g.name, items: all.filter(function (f) { return f.group === g.slug; }) };
    });
    var rest = all.filter(function (f) { return !byKey(groups, 'slug', f.group); });        /* pertanyaan tanpa kelompok valid tetap tampil */
    if (rest.length) groups.push({ slug: 'lainnya', name: x.otherGroup || 'Lainnya', items: rest });
    groups = groups.filter(function (g) { return g.items.length; });
    var empty = x.empty || {};
    var jump = !groups.length ? '' : '<nav class="faq-jump" aria-label="' + esc(x.jumpLabel || 'Lompat ke kelompok') + '"><ul class="chips">' + groups.map(function (g) {
      return '<li data-jump="' + esc(g.slug) + '"><a class="chip" href="#faq-g-' + esc(g.slug) + '">' + esc(g.name) + '</a></li>'; }).join('') + '</ul></nav>';
    var sections = groups.map(function (g) {
      return '<section class="faq-group" id="faq-g-' + esc(g.slug) + '" aria-labelledby="faq-g-' + esc(g.slug) + '-title" data-group>' +
        '<h2 class="h4" id="faq-g-' + esc(g.slug) + '-title">' + esc(g.name) + '</h2><div class="faq-list">' +
        g.items.map(function (f) { return C.faqItem(f).replace('<div class="faq-item">', '<div class="faq-item" data-item data-q="' + esc((f.q + ' ' + f.a).toLowerCase()) + '">'); }).join('') +
        '</div></section>';
    }).join('');
    var body = '<div class="filter-bar"><div class="search-input"><label class="visually-hidden" for="faq-search">' + esc(x.searchLabel || 'Cari pertanyaan') + '</label>' + ico('search') +
      '<input id="faq-search" type="search" class="form-control" placeholder="' + esc(x.searchPlaceholder || '') + '" autocomplete="off"></div>' + jump + '</div>' +
      '<p class="result-count" id="faq-count" role="status" aria-live="polite"></p>' +
      '<div class="faq-groups">' + sections + '</div>' +
      '<div class="empty-state" id="faq-empty" hidden><span class="ico">' + ico('search-x', 'i-lg') + '</span><h2>' + esc(empty.title) + '</h2><p>' + esc(empty.text) + '</p>' +
      '<a class="btn btn-wa" data-wa>' + WA + ' ' + esc(empty.button) + '</a></div>';
    var cr = [{ label: 'Beranda', route: 'home' }, { label: x.title }];
    return {
      html: crumbs(cr) + pageHead(x.title, x.lead) + '<section class="section pt-4" aria-label="' + esc(x.title) + '"><div class="container"><div class="faq-page">' + body + '</div></div></section>' + ctaBand(),
      meta: { key: 'faq', route: 'faq', crumbs: crumbMeta(cr), faqs: all },
      after: function () { initFaqSearch(x.countNoun || 'pertanyaan'); }
    };
  };

  /* Pencarian FAQ: sembunyikan pertanyaan yang tidak cocok dan kelompok yang jadi kosong. */
  function initFaqSearch(noun) {
    var input = document.getElementById('faq-search'), count = document.getElementById('faq-count'), empty = document.getElementById('faq-empty');
    if (!input) return;
    var items = Array.prototype.slice.call(document.querySelectorAll('#main [data-item]'));
    var groups = Array.prototype.slice.call(document.querySelectorAll('#main [data-group]'));
    function apply() {
      var q = input.value.trim().toLowerCase(), n = 0;
      items.forEach(function (it) { var show = !q || it.getAttribute('data-q').indexOf(q) > -1; it.classList.toggle('hidden-by-filter', !show); if (show) n++; });
      groups.forEach(function (g) {
        var hide = !g.querySelector('[data-item]:not(.hidden-by-filter)'), li = document.querySelector('[data-jump="' + g.id.replace('faq-g-', '') + '"]');
        g.classList.toggle('hidden-by-filter', hide);
        if (li) li.hidden = hide;                                   /* tautan ke kelompok yang tersembunyi ikut disembunyikan */
      });
      count.textContent = n + ' ' + noun + (q ? ' untuk "' + input.value.trim() + '"' : '');
      empty.hidden = n !== 0;
    }
    input.addEventListener('input', apply);
    apply();
  }

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
    /* Detail layanan/artikel memakai hash sebagai slug (di Laravel: /layanan/{slug}, /artikel/{slug}); ganti hash = ganti isi */
    if (pageKey === 'service' || pageKey === 'article') window.addEventListener('hashchange', function () {
      if (isAnchor()) return;
      render();
      if (PS.seo) PS.seo.applyPage();
      window.scrollTo(0, 0);
      var h1 = document.querySelector('h1'); if (h1) { h1.setAttribute('tabindex', '-1'); h1.focus({ preventScroll: true }); }   /* fokus keyboard pindah ke judul baru */
    });
  });
})();
