/*
 * main.js — komponen & interaksi global (Vanilla JS, tanpa framework)
 * ------------------------------------------------------------------
 * Alur:
 *   1. applyTheme()    -> warna brand dari data.js ke CSS variable
 *   2. renderAll()     -> komponen global ([data-component]) & daftar ([data-render])
 *   3. bind()          -> teks sederhana dari data ([data-bind="tenant.name"])
 *   4. init*()         -> interaksi (menu, dropdown, accordion, lightbox, dll)
 *
 * Setiap fungsi di bagian "KOMPONEN" setara satu Blade Component di Laravel
 * (mis. serviceCard -> <x-card.service :service="$service" />).
 */
(function () {
  'use strict';

  var D = window.SITE_DATA;
  if (!D) { console.error('[main.js] data.js belum dimuat.'); return; }
  var T = D.tenant;

  /* ---------------------------------------------------------------- util */
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var ESC = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return ESC[c]; }); };
  var rupiah = function (n) { return 'Rp ' + new Intl.NumberFormat('id-ID').format(n); };
  var get = function (obj, path) { return path.split('.').reduce(function (o, k) { return o == null ? o : o[k]; }, obj); };
  var ico = function (name, cls) { return '<i data-lucide="' + name + '" class="i ' + (cls || '') + '" aria-hidden="true"></i>'; };
  var findBy = function (list, key, val) { return list.filter(function (x) { return x[key] === val; })[0]; };
  var fmtDate = function (iso) {
    return new Date(iso + 'T00:00:00').toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  /* Logo WhatsApp (Lucide tidak menyediakan ikon merek ini) */
  var WA_ICON = '<svg class="i" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>';

  /* ---------------------------------------------------------------- URL */
  /* Mockup memakai file .html + hash sebagai slug. Di Laravel, ganti dengan route(). */
  var url = function (name, slug) {
    var r = D.routes[name];
    return r.hash && slug ? r.mockup + '#' + slug : r.mockup;
  };

  /* ------------------------------------------------------------ WhatsApp */
  var waLink = function (msg) { return 'https://wa.me/' + T.whatsapp + '?text=' + encodeURIComponent(msg); };
  var msgService = function (s) { return 'Halo, saya ingin bertanya mengenai layanan ' + s.name + '. Mohon informasi harga dan ketentuannya.'; };
  var msgDefault = function () { return 'Halo ' + T.name + ', saya ingin memesan layanan cetak. Mohon informasi lebih lanjut.'; };

  /* Elemen <a data-wa> (+ data-wa-service="slug" atau data-wa-msg="...") diberi tautan wa.me */
  function applyWa(root) {
    $$('[data-wa]', root).forEach(function (el) {
      var msg = el.getAttribute('data-wa-msg');
      var slug = el.getAttribute('data-wa-service');
      if (!msg && slug) {
        var s = findBy(D.services, 'slug', slug);
        msg = s ? msgService(s) : msgDefault();
      }
      el.href = waLink(msg || msgDefault());
      el.target = '_blank';
      el.rel = 'noopener noreferrer';
    });
  }

  /* --------------------------------------------------------------- tema */
  function applyTheme() {
    var map = {
      primary: '--c-primary', primaryDark: '--c-primary-dark', primaryLight: '--c-primary-light',
      accent: '--c-accent', accentDark: '--c-accent-dark', whatsapp: '--c-wa', whatsappDark: '--c-wa-dark',
      surface: '--c-surface', text: '--c-text', muted: '--c-muted'
    };
    var root = document.documentElement;
    Object.keys(map).forEach(function (k) { if (D.theme[k]) root.style.setProperty(map[k], D.theme[k]); });
  }

  /* ============================================================
     KOMPONEN (setara Blade Components)
     ============================================================ */

  /* --- ui/stars ---------------------------------------------------- */
  function stars(n) {
    var out = '';
    for (var i = 1; i <= 5; i++) out += ico('star', i > n ? 'is-off' : '');
    return '<div class="stars" role="img" aria-label="Rating ' + n + ' dari 5">' + out + '</div>';
  }

  /* --- card/service ------------------------------------------------ */
  function serviceCard(s) {
    var cat = findBy(D.categories, 'slug', s.category);
    return '<article class="card-x service-card" data-name="' + esc(s.name.toLowerCase()) + '" data-category="' + esc(s.category) + '">' +
      '<div class="card-media"><img src="' + esc(s.image) + '" alt="' + esc(s.imageAlt) + '" width="800" height="600" loading="lazy">' +
      (cat ? '<span class="tag">' + esc(cat.name) + '</span>' : '') + '</div>' +
      '<div class="card-body-x">' +
      '<h3><a href="' + url('service', s.slug) + '">' + esc(s.name) + '</a></h3>' +
      '<p>' + esc(s.short) + '</p>' +
      '<div class="price-from">Mulai dari<strong>' + rupiah(s.priceFrom) + ' <small class="fw-medium text-muted-x">/ ' + esc(s.unit) + '</small></strong></div>' +
      '<div class="card-actions">' +
      '<a class="btn btn-outline-brand btn-sm" href="' + url('service', s.slug) + '" aria-label="Lihat detail ' + esc(s.name) + '">Lihat Detail</a>' +
      '<a class="btn btn-wa btn-sm btn-icon" data-wa data-wa-service="' + esc(s.slug) + '" aria-label="Tanya ' + esc(s.name) + ' lewat WhatsApp">' + WA_ICON + '</a>' +
      '</div></div></article>';
  }

  /* --- card/category ----------------------------------------------- */
  function categoryCard(c) {
    var count = D.services.filter(function (s) { return s.category === c.slug; }).length;
    return '<article class="card-x cat-card">' +
      '<span class="ico">' + ico(c.icon, 'i-lg') + '</span>' +
      '<h3><a href="' + url('category', c.slug) + '">' + esc(c.name) + '</a></h3>' +
      '<p>' + esc(c.description) + '</p>' +
      '<span class="link-arrow">' + count + ' layanan ' + ico('arrow-right') + '</span></article>';
  }

  /* --- card/portfolio ---------------------------------------------- */
  function portfolioCard(p, i) {
    var cat = findBy(D.categories, 'slug', p.category);
    return '<button type="button" class="pf-card" data-lightbox="' + i + '" aria-label="Perbesar gambar: ' + esc(p.title) + '">' +
      '<span class="card-media"><img src="' + esc(p.image) + '" alt="' + esc(p.imageAlt) + '" width="800" height="600" loading="lazy"></span>' +
      '<span class="pf-zoom">' + ico('zoom-in') + '</span>' +
      '<span class="pf-cap"><strong>' + esc(p.title) + '</strong><span>' + esc(cat ? cat.name : '') + '</span></span>' +
      '<span class="visually-hidden" data-lb-desc>' + esc(p.description) + '</span></button>';
  }

  /* --- card/testimonial -------------------------------------------- */
  function testimonialCard(t) {
    var initials = t.name.replace(/^(Bapak|Ibu)\s+/i, '').split(/\s+/).slice(0, 2).map(function (w) { return w.charAt(0); }).join('').toUpperCase();
    return '<figure class="card-x testi-card m-0">' + stars(t.rating) +
      '<blockquote>' + esc(t.text) + '</blockquote>' +
      '<figcaption class="testi-person"><span class="avatar" aria-hidden="true">' + esc(initials) + '</span>' +
      '<span><strong>' + esc(t.name) + '</strong><span>' + esc(t.role) + '</span></span></figcaption></figure>';
  }

  /* --- card/article (dipakai di blog.html) ------------------------- */
  function articleCard(a) {
    return '<article class="card-x article-card">' +
      '<div class="card-media"><img src="' + esc(a.image) + '" alt="' + esc(a.imageAlt) + '" width="800" height="600" loading="lazy">' +
      '<span class="tag">' + esc(a.category) + '</span></div>' +
      '<div class="card-body-x"><div class="meta-row"><time datetime="' + esc(a.date) + '">' + fmtDate(a.date) + '</time><span>•</span><span>' + a.readTime + ' menit baca</span></div>' +
      '<h3><a href="' + url('article', a.slug) + '">' + esc(a.title) + '</a></h3>' +
      '<p>' + esc(a.excerpt) + '</p>' +
      '<span class="link-arrow mt-auto">Baca selengkapnya ' + ico('arrow-right') + '</span></div></article>';
  }

  /* --- ui/faq-accordion -------------------------------------------- */
  var faqSeq = 0;
  function faqItem(f) {
    var id = 'faq-' + (++faqSeq);
    return '<div class="faq-item">' +
      '<h3 class="m-0"><button type="button" class="faq-q" aria-expanded="false" aria-controls="' + id + '-a" id="' + id + '-q">' +
      '<span>' + esc(f.q) + '</span>' + ico('plus') + '</button></h3>' +
      '<div class="faq-a" id="' + id + '-a" role="region" aria-labelledby="' + id + '-q"><div><p>' + esc(f.a) + '</p></div></div></div>';
  }

  /* --- layout/header ----------------------------------------------- */
  var PAGE_GROUP = { service: 'services', article: 'blog' };
  function activePage() {
    var p = document.body.getAttribute('data-page') || 'home';
    return PAGE_GROUP[p] || p;
  }

  function navDesktop(item, page) {
    if (item.dropdown) {
      var links, active;
      if (item.dropdown === 'categories') {
        active = page === 'services';
        links = D.categories.map(function (c) { return '<a href="' + url('category', c.slug) + '">' + ico(c.icon) + esc(c.name) + '</a>'; }).join('') +
          '<a class="dropdown-all" href="' + url('services') + '">Lihat semua layanan ' + ico('arrow-right') + '</a>';
      } else {
        active = item.dropdown.some(function (c) { return c.route === page; });
        links = item.dropdown.map(function (c) { return '<a href="' + url(c.route) + '">' + esc(c.label) + '</a>'; }).join('');
      }
      var id = 'dd-' + item.label.toLowerCase().replace(/\W+/g, '');
      return '<li class="has-dropdown"><button type="button" class="nav-toggle' + (active ? ' is-active' : '') + '" aria-expanded="false" aria-controls="' + id + '">' +
        esc(item.label) + ico('chevron-down') + '</button><div class="dropdown-panel" id="' + id + '">' + links + '</div></li>';
    }
    var is = item.route === page;
    return '<li><a class="nav-link-item' + (is ? ' is-active' : '') + '"' + (is ? ' aria-current="page"' : '') + ' href="' + url(item.route) + '">' + esc(item.label) + '</a></li>';
  }

  function header() {
    var page = activePage();
    return '<div class="container"><div class="header-inner">' +
      '<a class="brand" href="' + url('home') + '" aria-label="' + esc(T.name) + ' — Beranda">' +
      '<img src="' + esc(T.logo) + '" alt="" width="42" height="42"><span class="brand-text"><span>' + esc(T.name) + '</span><small>' + esc(T.tagline) + '</small></span></a>' +
      '<nav class="nav-desktop" aria-label="Navigasi utama"><ul>' + D.nav.map(function (n) { return navDesktop(n, page); }).join('') + '</ul></nav>' +
      '<a class="btn btn-wa btn-sm header-cta" data-wa>' + WA_ICON + ' Pesan via WhatsApp</a>' +
      '<button type="button" class="menu-btn" id="menu-open" aria-label="Buka menu" aria-expanded="false" aria-controls="mobile-menu">' + ico('menu', 'i-lg') + '</button>' +
      '</div></div>';
  }

  /* --- layout/mobile-menu ------------------------------------------ */
  function mobileMenu() {
    var page = activePage();
    var items = D.nav.map(function (item) {
      if (item.dropdown) {
        var subs = item.dropdown === 'categories'
          ? D.categories.map(function (c) { return '<a href="' + url('category', c.slug) + '">' + esc(c.name) + '</a>'; }).join('') + '<a href="' + url('services') + '"><strong>Lihat semua layanan</strong></a>'
          : item.dropdown.map(function (c) { return '<a href="' + url(c.route) + '">' + esc(c.label) + '</a>'; }).join('');
        var active = item.dropdown === 'categories' ? page === 'services' : item.dropdown.some(function (c) { return c.route === page; });
        var id = 'm-sub-' + item.label.toLowerCase().replace(/\W+/g, '');
        return '<li><button type="button" class="m-link m-toggle' + (active ? ' is-active' : '') + '" aria-expanded="false" aria-controls="' + id + '">' + esc(item.label) + ico('chevron-down') + '</button>' +
          '<div class="m-sub" id="' + id + '">' + subs + '</div></li>';
      }
      var is = item.route === page;
      return '<li><a class="m-link' + (is ? ' is-active' : '') + '"' + (is ? ' aria-current="page"' : '') + ' href="' + url(item.route) + '">' + esc(item.label) + '</a></li>';
    }).join('');
    return '<div class="mobile-menu-head"><span class="brand"><img src="' + esc(T.logo) + '" alt="" width="42" height="42"><span class="brand-text"><span>' + esc(T.shortName) + '</span></span></span>' +
      '<button type="button" class="menu-btn" id="menu-close" style="margin-left:0" aria-label="Tutup menu">' + ico('x', 'i-lg') + '</button></div>' +
      '<div class="mobile-menu-body"><ul>' + items + '</ul></div>' +
      '<div class="mobile-menu-foot"><a class="btn btn-wa w-100" data-wa>' + WA_ICON + ' Pesan via WhatsApp</a>' +
      '<p class="form-note text-center mt-2 mb-0">Buka ' + esc(T.hoursSummary) + ' • ' + esc(T.city) + '</p></div>';
  }

  /* --- layout/footer ----------------------------------------------- */
  function footer() {
    var year = new Date().getFullYear();
    var svc = D.services.filter(function (s) { return s.featured; }).slice(0, 6)
      .map(function (s) { return '<li><a href="' + url('service', s.slug) + '">' + esc(s.name) + '</a></li>'; }).join('');
    var social = T.social.map(function (s) {
      return '<a href="' + esc(s.href) + '" aria-label="' + esc(s.label) + '" target="_blank" rel="noopener noreferrer">' + ico(s.icon) + '</a>';
    }).join('');
    var company = [['home', 'Beranda'], ['about', 'Tentang Kami'], ['pricing', 'Daftar Harga'], ['portfolio', 'Portofolio'], ['blog', 'Artikel'], ['faq', 'FAQ'], ['contact', 'Kontak']]
      .map(function (r) { return '<li><a href="' + url(r[0]) + '">' + r[1] + '</a></li>'; }).join('');
    return '<div class="container"><div class="row g-4 g-lg-5">' +
      '<div class="col-lg-4"><a class="brand mb-3" href="' + url('home') + '"><img src="' + esc(T.logoLight) + '" alt="" width="42" height="42"><span class="brand-text"><span>' + esc(T.name) + '</span><small>' + esc(T.tagline) + '</small></span></a>' +
      '<p class="mt-3 mb-0">' + esc(T.seo.defaultDescription) + '</p><div class="social">' + social + '</div></div>' +
      '<div class="col-6 col-lg-2"><h2>Layanan</h2><ul class="footer-links">' + svc + '</ul></div>' +
      '<div class="col-6 col-lg-2"><h2>Perusahaan</h2><ul class="footer-links">' + company + '</ul></div>' +
      '<div class="col-lg-4"><h2>Hubungi Kami</h2><ul class="footer-contact">' +
      '<li>' + ico('map-pin') + '<span>' + esc(T.address) + '</span></li>' +
      '<li>' + ico('clock') + '<span>' + T.hours.map(function (h) { return esc(h.day) + ': ' + esc(h.time); }).join('<br>') + '</span></li>' +
      '<li>' + ico('phone') + '<a href="tel:+' + esc(T.phone) + '">' + esc(T.phoneDisplay) + '</a></li>' +
      '<li>' + ico('mail') + '<a href="mailto:' + esc(T.email) + '">' + esc(T.email) + '</a></li></ul></div></div>' +
      '<div class="footer-bottom"><span>&copy; ' + year + ' ' + esc(T.name) + '. Semua hak dilindungi.</span><span>Mockup website percetakan</span></div></div>';
  }

  /* --- ui/hero-visual ---------------------------------------------- */
  function heroVisual() {
    var h = T.hero;
    var chips = (h.chips || []).map(function (c, i) {
      return '<div class="hero-chip ' + (i === 0 ? 'is-a' : 'is-b') + '"><span class="chip-icon">' + ico(c.icon) + '</span><span><strong>' + esc(c.title) + '</strong>' + esc(c.text) + '</span></div>';
    }).join('');
    return '<img src="' + esc(h.image) + '" alt="' + esc(h.imageAlt) + '" width="800" height="640" fetchpriority="high">' + chips;
  }

  /* --- section/about-brief ----------------------------------------- */
  function aboutBrief() {
    var a = T.about;
    return '<div class="row g-4 g-lg-5 align-items-center">' +
      '<div class="col-lg-6"><div class="about-media"><img src="' + esc(a.image) + '" alt="' + esc(a.imageAlt) + '" width="800" height="600" loading="lazy">' +
      '<div class="about-since"><strong>' + T.since + '</strong>Sejak</div></div></div>' +
      '<div class="col-lg-6"><span class="eyebrow">Tentang Kami</span><h2>' + esc(a.title) + '</h2>' +
      a.text.map(function (p) { return '<p class="text-muted-x">' + esc(p) + '</p>'; }).join('') +
      '<ul class="check-list">' + a.highlights.map(function (h) { return '<li>' + ico('circle-check') + '<span>' + esc(h) + '</span></li>'; }).join('') + '</ul>' +
      '<a class="btn btn-outline-brand" href="' + url('about') + '">Selengkapnya ' + ico('arrow-right') + '</a></div></div>';
  }

  /* --- section/location -------------------------------------------- */
  function location() {
    var hours = '<table class="hours-table"><tbody>' + T.hours.map(function (h) { return '<tr><td>' + esc(h.day) + '</td><td>' + esc(h.time) + '</td></tr>'; }).join('') + '</tbody></table>';
    return '<div class="row g-4 align-items-stretch"><div class="col-lg-5"><div class="loc-card">' +
      '<div class="info-row"><span class="ico">' + ico('map-pin') + '</span><div><small>Alamat</small><address class="mb-0">' + esc(T.address) + '</address></div></div>' +
      '<div class="info-row"><span class="ico">' + ico('clock') + '</span><div class="flex-fill"><small>Jam operasional</small>' + hours + '</div></div>' +
      '<div class="info-row"><span class="ico">' + ico('phone') + '</span><div><small>Telepon</small><a href="tel:+' + esc(T.phone) + '"><strong>' + esc(T.phoneDisplay) + '</strong></a></div></div>' +
      '<div class="info-row"><span class="ico">' + ico('mail') + '</span><div><small>Email</small><a href="mailto:' + esc(T.email) + '"><strong>' + esc(T.email) + '</strong></a></div></div>' +
      '<div class="d-flex flex-wrap gap-2 mt-3"><a class="btn btn-brand flex-fill" href="' + esc(T.mapLink) + '" target="_blank" rel="noopener noreferrer">' + ico('navigation') + ' Petunjuk Arah</a>' +
      '<a class="btn btn-wa flex-fill" data-wa>' + WA_ICON + ' Chat WhatsApp</a></div></div></div>' +
      '<div class="col-lg-7"><div class="map-frame"><iframe title="Peta lokasi ' + esc(T.name) + '" src="' + esc(T.mapEmbed) + '" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe></div></div></div>';
  }

  /* --- section/cta-wa ---------------------------------------------- */
  function ctaWa() {
    var c = T.cta;
    return '<div class="cta-wa"><h2>' + esc(c.title) + '</h2><p>' + esc(c.text) + '</p>' +
      '<div class="cta-actions"><a class="btn btn-wa btn-lg" data-wa>' + WA_ICON + ' ' + esc(c.button) + '</a>' +
      '<a class="btn btn-light-ghost btn-lg" href="' + url('pricing') + '">' + ico('receipt-text') + ' Lihat Daftar Harga</a></div></div>';
  }

  /* ============================================================
     RENDER: [data-component] dan [data-render]
     ============================================================ */
  var COMPONENTS = { 'hero-visual': heroVisual, 'about-brief': aboutBrief, location: location, 'cta-wa': ctaWa };

  var LISTS = {
    categories: function (el) {
      return D.categories.map(function (c) { return '<div class="col-12 col-sm-6 col-lg-4">' + categoryCard(c) + '</div>'; }).join('');
    },
    services: function (el) {
      var list = D.services.slice();
      if (el.hasAttribute('data-featured')) list = list.filter(function (s) { return s.featured; });
      var cat = el.getAttribute('data-category');
      if (cat) list = list.filter(function (s) { return s.category === cat; });
      var lim = parseInt(el.getAttribute('data-limit'), 10);
      if (lim) list = list.slice(0, lim);
      return list.map(function (s) { return '<div class="col-12 col-md-6 col-lg-4">' + serviceCard(s) + '</div>'; }).join('');
    },
    portfolio: function (el) {
      var lim = parseInt(el.getAttribute('data-limit'), 10) || D.portfolio.length;
      return D.portfolio.slice(0, lim).map(function (p, i) { return '<div class="col-6 col-lg-4">' + portfolioCard(p, i) + '</div>'; }).join('');
    },
    'hero-points': function () {
      return T.hero.points.map(function (p) { return '<li>' + ico('circle-check') + '<span>' + esc(p) + '</span></li>'; }).join('');
    },
    testimonials: function () { return D.testimonials.map(testimonialCard).join(''); },
    steps: function () {
      return D.steps.map(function (s) {
        return '<li class="step"><span class="ico">' + ico(s.icon, 'i-lg') + '</span><h3>' + esc(s.title) + '</h3><p>' + esc(s.text) + '</p></li>';
      }).join('');
    },
    why: function () {
      return D.why.map(function (w) {
        return '<div class="why-item"><span class="ico">' + ico(w.icon, 'i-lg') + '</span><div><h3>' + esc(w.title) + '</h3><p>' + esc(w.text) + '</p></div></div>';
      }).join('');
    },
    trust: function () {
      return D.trust.map(function (t) {
        return '<div class="trust-item"><span class="ico">' + ico(t.icon, 'i-lg') + '</span><div><h3>' + esc(t.title) + '</h3><p>' + esc(t.text) + '</p></div></div>';
      }).join('');
    },
    stats: function () {
      return T.stats.map(function (s) { return '<div class="stat"><strong>' + esc(s.value) + '</strong><span>' + esc(s.label) + '</span></div>'; }).join('');
    },
    faq: function (el) {
      var list = D.faqs.slice();
      if (el.hasAttribute('data-featured')) list = list.filter(function (f) { return f.featured; });
      var g = el.getAttribute('data-group');
      if (g) list = list.filter(function (f) { return f.group === g; });
      return list.map(faqItem).join('');
    }
  };

  function renderAll() {
    var h = $('[data-component="header"]');
    if (h) h.innerHTML = header();

    var f = $('[data-component="footer"]');
    if (f) f.innerHTML = footer();

    $$('[data-component]').forEach(function (el) {
      var fn = COMPONENTS[el.getAttribute('data-component')];
      if (fn) el.innerHTML = fn(el);
    });
    $$('[data-render]').forEach(function (el) {
      var fn = LISTS[el.getAttribute('data-render')];
      if (fn) el.innerHTML = fn(el);
      else console.warn('[main.js] renderer tidak dikenal:', el.getAttribute('data-render'));
    });

    /* Elemen global yang dipasang di <body> (di luar header: backdrop-filter membuat fixed-child ter-scope) */
    var overlay = document.createElement('div');
    overlay.className = 'mobile-overlay'; overlay.id = 'mobile-overlay';
    var menu = document.createElement('div');
    menu.className = 'mobile-menu'; menu.id = 'mobile-menu';
    menu.setAttribute('role', 'dialog'); menu.setAttribute('aria-modal', 'true'); menu.setAttribute('aria-label', 'Menu navigasi');
    menu.innerHTML = mobileMenu();
    var wa = document.createElement('a');
    wa.className = 'wa-float'; wa.setAttribute('data-wa', ''); wa.setAttribute('aria-label', 'Chat WhatsApp');
    wa.innerHTML = WA_ICON + '<span>Chat WhatsApp</span>';
    var top = document.createElement('button');
    top.type = 'button'; top.className = 'to-top'; top.id = 'to-top'; top.setAttribute('aria-label', 'Kembali ke atas');
    top.innerHTML = ico('arrow-up');
    [overlay, menu, wa, top].forEach(function (n) { document.body.appendChild(n); });

    /* Bind teks sederhana: data-bind="tenant.name", data-bind-src / data-bind-alt */
    $$('[data-bind]').forEach(function (el) { var v = get(D, el.getAttribute('data-bind')); if (v != null) el.textContent = v; });
    $$('[data-bind-src]').forEach(function (el) { var v = get(D, el.getAttribute('data-bind-src')); if (v) el.src = v; });
    $$('[data-bind-alt]').forEach(function (el) { var v = get(D, el.getAttribute('data-bind-alt')); if (v) el.alt = v; });

    applyWa(document);
    if (window.lucide && window.lucide.createIcons) window.lucide.createIcons();
  }

  /* ============================================================
     INTERAKSI
     ============================================================ */

  /* Sticky header + back to top */
  function initScroll() {
    var hd = $('.site-header'), tt = $('#to-top'), ticking = false;
    function update() {
      var y = window.pageYOffset || document.documentElement.scrollTop;
      if (hd) hd.classList.toggle('is-scrolled', y > 8);
      if (tt) tt.classList.toggle('is-shown', y > 600);
      ticking = false;
    }
    window.addEventListener('scroll', function () { if (!ticking) { ticking = true; window.requestAnimationFrame(update); } }, { passive: true });
    if (tt) tt.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });
    update();
  }

  /* Mobile menu (hamburger) */
  function initMobileMenu() {
    var openBtn = $('#menu-open'), closeBtn = $('#menu-close'), menu = $('#mobile-menu'), overlay = $('#mobile-overlay');
    if (!openBtn || !menu) return;
    var lastFocus = null;

    function open() {
      lastFocus = document.activeElement;
      menu.classList.add('is-open'); overlay.classList.add('is-open');
      document.body.classList.add('is-locked');
      openBtn.setAttribute('aria-expanded', 'true');
      closeBtn.focus();
    }
    function close() {
      menu.classList.remove('is-open'); overlay.classList.remove('is-open');
      document.body.classList.remove('is-locked');
      openBtn.setAttribute('aria-expanded', 'false');
      if (lastFocus) lastFocus.focus();
    }
    openBtn.addEventListener('click', open);
    closeBtn.addEventListener('click', close);
    overlay.addEventListener('click', close);
    menu.addEventListener('click', function (e) { if (e.target.closest('a')) close(); });
    document.addEventListener('keydown', function (e) {
      if (!menu.classList.contains('is-open')) return;
      if (e.key === 'Escape') { close(); return; }
      if (e.key === 'Tab') { /* fokus tidak keluar dari menu */
        var f = $$('a[href], button', menu).filter(function (n) { return n.offsetParent !== null; });
        if (!f.length) return;
        var first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
    window.addEventListener('resize', function () { if (window.innerWidth >= 992 && menu.classList.contains('is-open')) close(); });

    /* Sub-menu accordion di mobile */
    $$('.m-toggle', menu).forEach(function (btn) {
      btn.addEventListener('click', function () {
        var sub = document.getElementById(btn.getAttribute('aria-controls'));
        var isOpen = btn.getAttribute('aria-expanded') === 'true';
        btn.setAttribute('aria-expanded', String(!isOpen));
        sub.classList.toggle('is-open', !isOpen);
      });
    });
  }

  /* Dropdown navigasi desktop */
  function initDropdowns() {
    var items = $$('.has-dropdown');
    if (!items.length) return;
    var canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    var timers = new WeakMap();

    function set(li, open) {
      li.classList.toggle('is-open', open);
      $('.nav-toggle', li).setAttribute('aria-expanded', String(open));
    }
    function closeAll(except) { items.forEach(function (li) { if (li !== except) set(li, false); }); }

    items.forEach(function (li) {
      var btn = $('.nav-toggle', li);
      btn.addEventListener('click', function () { var o = !li.classList.contains('is-open'); closeAll(li); set(li, o); });
      if (canHover) {
        li.addEventListener('mouseenter', function () { clearTimeout(timers.get(li)); closeAll(li); set(li, true); });
        li.addEventListener('mouseleave', function () { timers.set(li, setTimeout(function () { set(li, false); }, 140)); });
      }
      li.addEventListener('focusout', function (e) { if (!li.contains(e.relatedTarget)) set(li, false); });
    });
    document.addEventListener('click', function (e) { if (!e.target.closest('.has-dropdown')) closeAll(); });
    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape') return;
      items.forEach(function (li) { if (li.classList.contains('is-open')) { set(li, false); $('.nav-toggle', li).focus(); } });
    });
  }

  /* FAQ accordion (satu terbuka per daftar) */
  function initAccordion() {
    document.addEventListener('click', function (e) {
      var q = e.target.closest('.faq-q');
      if (!q) return;
      var item = q.closest('.faq-item'), list = q.closest('.faq-list');
      var open = !item.classList.contains('is-open');
      if (open && list) $$('.faq-item.is-open', list).forEach(function (o) { o.classList.remove('is-open'); $('.faq-q', o).setAttribute('aria-expanded', 'false'); });
      item.classList.toggle('is-open', open);
      q.setAttribute('aria-expanded', String(open));
    });
  }

  /* Lightbox portofolio */
  function initLightbox() {
    var groups = $$('[data-lightbox-group]');
    if (!groups.length) return;

    var box = document.createElement('div');
    box.className = 'lightbox'; box.setAttribute('role', 'dialog'); box.setAttribute('aria-modal', 'true'); box.setAttribute('aria-label', 'Pratinjau gambar');
    box.innerHTML = '<button type="button" class="lb-btn lb-close" aria-label="Tutup">' + ico('x', 'i-lg') + '</button>' +
      '<button type="button" class="lb-btn lb-prev" aria-label="Gambar sebelumnya">' + ico('chevron-left', 'i-lg') + '</button>' +
      '<figure><img alt="" src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"><figcaption></figcaption></figure>' +
      '<button type="button" class="lb-btn lb-next" aria-label="Gambar berikutnya">' + ico('chevron-right', 'i-lg') + '</button>';
    document.body.appendChild(box);
    if (window.lucide) window.lucide.createIcons();

    var img = $('img', box), cap = $('figcaption', box);
    var items = [], idx = 0, lastFocus = null;

    function show(i) {
      idx = (i + items.length) % items.length;
      var b = items[idx], src = $('img', b);
      img.src = src.getAttribute('src'); img.alt = src.getAttribute('alt');
      var title = $('.pf-cap strong', b), desc = $('[data-lb-desc]', b);
      cap.innerHTML = '<strong>' + esc(title ? title.textContent : '') + '</strong>' + esc(desc ? desc.textContent : '');
    }
    function open(group, btn) {
      items = $$('.pf-card', group);
      lastFocus = btn;
      show(items.indexOf(btn));
      box.classList.add('is-open'); document.body.classList.add('is-locked');
      $('.lb-close', box).focus();
    }
    function close() {
      box.classList.remove('is-open'); document.body.classList.remove('is-locked');
      if (lastFocus) lastFocus.focus();
    }
    groups.forEach(function (g) {
      g.addEventListener('click', function (e) { var b = e.target.closest('.pf-card'); if (b) open(g, b); });
    });
    $('.lb-close', box).addEventListener('click', close);
    $('.lb-prev', box).addEventListener('click', function () { show(idx - 1); });
    $('.lb-next', box).addEventListener('click', function () { show(idx + 1); });
    box.addEventListener('click', function (e) { if (e.target === box) close(); });
    document.addEventListener('keydown', function (e) {
      if (!box.classList.contains('is-open')) return;
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowLeft') show(idx - 1);
      else if (e.key === 'ArrowRight') show(idx + 1);
    });
    var x0 = null; /* geser jari untuk berpindah gambar */
    box.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; }, { passive: true });
    box.addEventListener('touchend', function (e) {
      if (x0 == null) return;
      var dx = e.changedTouches[0].clientX - x0;
      if (Math.abs(dx) > 50) show(idx + (dx < 0 ? 1 : -1));
      x0 = null;
    });
  }

  /* ------------------------------------------------------------- boot */
  function boot() {
    applyTheme();
    renderAll();
    initScroll();
    initMobileMenu();
    initDropdowns();
    initAccordion();
    initLightbox();
    document.documentElement.classList.add('js-ready');
  }

  /* API kecil untuk halaman lain (services.html, service-detail.html, dll.) */
  window.PrintSite = {
    data: D, esc: esc, rupiah: rupiah, url: url, waLink: waLink, msgService: msgService, msgDefault: msgDefault,
    ico: ico, WA_ICON: WA_ICON, applyWa: applyWa, fmtDate: fmtDate,
    components: { serviceCard: serviceCard, categoryCard: categoryCard, portfolioCard: portfolioCard, testimonialCard: testimonialCard, articleCard: articleCard, faqItem: faqItem, stars: stars }
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
