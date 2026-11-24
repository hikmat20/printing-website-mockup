/*
 * sections.js — SECTION BERANDA (registri renderer, tiap varian = satu fungsi)
 * ---------------------------------------------------------------------------
 * Daftar section, varian yang diizinkan, urutan, dan teks berasal dari data:
 *   PLATFORM.sections / PLATFORM.templates (platform.js) -> apa yang tersedia
 *   tenant.site / tenant.homeText (data tenant)           -> pilihan & teks tenant
 * File ini hanya tahu CARA MENGGAMBAR tiap section. Pemetaan Laravel:
 *   render(id, variant)  ->  <x-section.{id} variant="{variant}" /> (Blade Component)
 *
 * Section bisa dipakai ulang di halaman lain lewat PrintSite.sections.<id>(variant, opsi).
 */
(function () {
  'use strict';

  var PS = window.PrintSite;
  if (!PS) { console.error('[sections.js] main.js belum dimuat.'); return; }

  var D = PS.data, T = D.tenant, P = PS.platform;
  var esc = PS.esc, ico = PS.ico, url = PS.url, WA = PS.WA_ICON, C = PS.components;
  var X = D.homeText || {};
  var tx = function (id) { return X[id] || {}; };

  /* ------------------------------------------------------------ pembantu */
  function head(id, left) {
    var x = tx(id);
    return '<div class="section-head' + (left ? ' is-left mb-2' : '') + '">' +
      (x.eyebrow ? '<span class="eyebrow">' + esc(x.eyebrow) + '</span>' : '') +
      '<h2 id="' + id + '-title">' + esc(x.title) + '</h2>' +
      (x.text ? '<p>' + esc(x.text) + '</p>' : '') + '</div>';
  }

  function foot(id, kind) {
    var c = tx(id).cta;
    if (!c) return '';
    var a = kind === 'link'
      ? '<a class="link-arrow" href="' + url(c.route) + '">' + esc(c.label) + ' ' + ico('arrow-right') + '</a>'
      : '<a class="btn btn-outline-brand btn-lg" href="' + url(c.route) + '">' + esc(c.label) + ' ' + ico('arrow-right') + '</a>';
    return '<div class="section-foot">' + a + '</div>';
  }

  /* Pembungkus <section>; selang-seling latar (o.alt) dihitung otomatis oleh renderHome */
  function wrap(id, inner, o) {
    var reg = P.sections[id];
    return '<section class="section' + (o.alt ? ' section-alt' : '') + ' section--' + id + '" id="' + reg.anchor + '" aria-labelledby="' + id + '-title">' +
      '<div class="container">' + inner + '</div></section>';
  }

  function cols(list, cls, fn) {
    return list.map(function (x, i) { return '<div class="' + cls + '">' + fn(x, i) + '</div>'; }).join('');
  }

  /* Slider generik (interaksi di main.js: initSliders). Tiap slide dibungkus .slide. */
  function slider(slides, label, lightbox) {
    return '<div class="slider" data-slider>' +
      '<div class="slider-track"' + (lightbox ? ' data-lightbox-group' : '') + ' tabindex="0" role="region" aria-label="' + esc(label) + '">' +
      slides.map(function (h) { return '<div class="slide">' + h + '</div>'; }).join('') + '</div>' +
      '<div class="slider-nav">' +
      '<button type="button" class="slider-btn" data-slider-prev aria-label="Sebelumnya">' + ico('chevron-left') + '</button>' +
      '<button type="button" class="slider-btn" data-slider-next aria-label="Berikutnya">' + ico('chevron-right') + '</button></div></div>';
  }

  var R = {};   /* registri renderer: R[id](variant, opsi) -> HTML */

  /* ---------------------------------------------------------------- hero */
  R.hero = function (variant) {
    if (variant === 'fullbleed') return heroFullbleed();
    if (variant === 'banner') { var bh = bannerHero(); if (bh) return bh; variant = 'split'; }   /* banner kosong/tidak valid: kembali ke split */
    var h = T.hero, a = h.actions || {}, p1 = a.primary || {}, p2 = a.secondary || {};
    var copy = '<span class="hero-badge">' + ico('map-pin') + '<span>' + esc(h.eyebrow) + '</span></span>' +
      '<h1 id="hero-title">' + esc(h.headline) + '</h1>' +
      '<p class="hero-sub">' + esc(h.subheadline) + '</p>' +
      '<div class="hero-actions">' +
      '<a class="btn btn-brand btn-lg" href="' + url(p1.route || 'services') + '">' + ico(p1.icon || 'layout-grid') + ' ' + esc(p1.label) + '</a>' +
      '<a class="btn btn-wa btn-lg" data-wa data-wa-msg="' + esc(p2.message || PS.msgDefault()) + '">' + ico(p2.icon || 'message-circle') + ' ' + esc(p2.label) + '</a></div>' +
      '<ul class="hero-points">' + h.points.map(function (t) { return '<li>' + ico('circle-check') + '<span>' + esc(t) + '</span></li>'; }).join('') + '</ul>';
    var body;
    if (variant === 'tiles') {
      body = heroTiles(copy);
    } else if (variant === 'centered') {
      body = '<div class="hero-copy">' + copy + '</div><div class="hero-visual hero-visual--wide">' + C.heroVisual() + '</div>';
    } else {
      body = '<div class="row align-items-center g-4 g-lg-5"><div class="col-lg-6">' + copy + '</div>' +
        '<div class="col-lg-6"><div class="hero-visual">' + C.heroVisual() + '</div></div></div>';
    }
    return '<section class="hero hero--' + variant + '" aria-labelledby="hero-title"><div class="container">' + body + '</div></section>';
  };

  /* Hero berubin (template Etalase): teks di kiri; di kanan satu ubin tinggi (gambar hero) dan dua ubin layanan unggulan
     (gambar, nama, harga bila paket menampilkannya). Tanpa layanan unggulan berbentuk gambar, ubin kecil dilewati. */
  function heroTiles(copy) {
    var h = T.hero, prices = PS.modules.prices;
    var feat = D.services.filter(function (s) { return s.featured && s.image; }).slice(0, 2);
    var tiles = feat.map(function (s) {
      return '<a class="hero-tile" href="' + esc(url('service', s.slug)) + '"><img src="' + esc(s.image) + '" alt="" width="400" height="300" loading="lazy">' +
        '<span class="hero-tile-cap"><strong>' + esc(s.name) + '</strong>' + (prices ? '<span>Mulai ' + PS.rupiah(s.priceFrom) + '</span>' : '<span>' + esc(s.eta) + '</span>') + '</span></a>';
    }).join('');
    return '<div class="tiles-grid' + (feat.length ? '' : ' is-solo') + '"><div class="tiles-copy">' + copy + '</div>' +
      '<div class="tiles-art"><figure class="hero-tile hero-tile--main"><img src="' + esc(h.image) + '" alt="' + esc(h.imageAlt) + '" width="800" height="640" fetchpriority="high"></figure>' + tiles + '</div></div>';
  }

  /* Hero layar penuh (template Compro): gambar sebagai latar, judul raksasa, dua ajakan, tiga poin singkat. */
  function heroFullbleed() {
    var h = T.hero, a = h.actions || {}, p1 = a.primary || {}, p2 = a.secondary || {};
    var contact = PS.modules.order === 'contact';
    var second = contact
      ? '<a class="btn btn-light-ghost btn-lg" href="' + url('contact') + '">' + ico(p2.icon || 'message-square') + ' ' + esc(p2.label || 'Hubungi Kami') + '</a>'
      : '<a class="btn btn-light-ghost btn-lg" data-wa data-wa-msg="' + esc(p2.message || PS.msgDefault()) + '">' + ico(p2.icon || 'message-circle') + ' ' + esc(p2.label) + '</a>';
    return '<section class="hero hero--fullbleed" aria-labelledby="hero-title"><div class="hero-fb-bg" aria-hidden="true"><img src="' + esc(h.image) + '" alt="" width="800" height="640" fetchpriority="high"></div>' +
      '<div class="container hero-fb-in"><span class="hero-kicker">' + esc(h.eyebrow) + '</span><h1 id="hero-title">' + esc(h.headline) + '</h1>' +
      '<p class="hero-sub">' + esc(h.subheadline) + '</p><div class="hero-actions">' +
      '<a class="btn btn-brand btn-lg" href="' + url(p1.route || 'services') + '">' + ico(p1.icon || 'layout-grid') + ' ' + esc(p1.label) + '</a>' + second + '</div></div>' +
      '<div class="container"><ul class="hero-fb-points">' + (h.points || []).slice(0, 3).map(function (t, i) { return '<li><span aria-hidden="true">' + String(i + 1).padStart(2, '0') + '</span>' + esc(t) + '</li>'; }).join('') + '</ul></div></section>';
  }

  /* Angka besar satu baris (data: tenant.stats); tanpa data section dilewati */
  R.stats = function () {
    var list = Array.isArray(T.stats) ? T.stats.filter(function (s) { return s && s.value && s.label; }) : [];
    if (!list.length) return '';
    return '<section class="stats-band" id="angka" aria-label="' + esc(tx('stats').title || 'Angka perusahaan') + '"><div class="container"><dl class="stats-big">' +
      list.map(function (s) { return '<div><dt>' + esc(s.label) + '</dt><dd>' + esc(s.value) + '</dd></div>'; }).join('') + '</dl></div></section>';
  };

  /* --------------------------------------------------------------- trust */
  R.trust = function (variant) {
    var items = D.trust.map(function (t) {
      return '<div class="trust-item"><span class="ico">' + ico(t.icon, 'i-lg') + '</span><div><h3>' + esc(t.title) + '</h3><p>' + esc(t.text) + '</p></div></div>';
    }).join('');
    return '<section class="trust trust--' + variant + '" aria-labelledby="trust-title"><h2 id="trust-title" class="visually-hidden">' + esc(tx('trust').title || '') + '</h2>' +
      '<div class="container"><div class="trust-grid">' + items + '</div></div></section>';
  };

  /* ---------------------------------------------------------- categories */
  R.categories = function (variant, o) {
    if (variant === 'mosaic') return mosaic(o);
    if (variant === 'circles') return circles(o);
    if (variant === 'rows') {
      return wrap('categories', head('categories') + '<div class="cat-rows">' + D.categories.map(function (c, i) {
        var n = D.services.filter(function (s) { return s.category === c.slug; }).length;
        return '<a class="svc-row" href="' + url('category', c.slug) + '"><span class="svc-n" aria-hidden="true">' + String(i + 1).padStart(2, '0') + '</span><span class="svc-t"><strong>' + esc(c.name) + '</strong><span>' + esc(c.description) + '</span></span>' +
          '<span class="svc-p">' + n + ' layanan</span><span class="svc-go" aria-hidden="true">' + ico('arrow-right') + '</span></a>';
      }).join('') + '</div>', o);
    }
    return wrap('categories', head('categories') +
      '<div class="row g-3 g-lg-4 cat-list cat-list--' + variant + '">' + cols(D.categories, 'col-12 col-sm-6 col-lg-4', C.categoryCard) + '</div>', o);
  };

  /* ------------------------------------------------------------ services */
  R.services = function (variant, o) {
    if (variant === 'tabs') return serviceTabs(o);
    var list = D.services.filter(function (s) { return s.featured; });
    if (o.limit) list = list.slice(0, o.limit);
    if (variant === 'rows') return wrap('services', head('services') + '<div class="svc-rows">' + list.map(C.serviceRow).join('') + '</div>' + foot('services', 'link'), o);
    var body = variant === 'slider'
      ? slider(list.map(C.serviceCard), tx('services').title)
      : '<div class="row g-3 g-lg-4">' + cols(list, 'col-12 col-md-6 col-lg-4', C.serviceCard) + '</div>';
    return wrap('services', head('services') + body + foot('services'), o);
  };

  /* --------------------------------------------------------------- about */
  R.about = function (variant, o) {
    var a = T.about, x = tx('about'), rev = variant === 'reverse';
    if (variant === 'story') {           /* editorial: label dan tahun di kiri, cerita besar di kanan, gambar lebar di bawah */
      return wrap('about', '<div class="story-grid"><div class="story-label">' + (x.eyebrow ? '<span class="eyebrow">' + esc(x.eyebrow) + '</span>' : '') +
        '<strong class="story-since">' + esc(T.since) + '</strong><span>Sejak</span></div>' +
        '<div class="story-body"><h2 id="about-title">' + esc(a.title) + '</h2>' + a.text.map(function (p, i) { return '<p class="' + (i === 0 ? 'story-lead' : 'text-muted-x') + '">' + esc(p) + '</p>'; }).join('') +
        '<ul class="story-points">' + a.highlights.map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') + '</ul>' +
        (x.cta && !o.noCta ? '<a class="link-arrow" href="' + url(x.cta.route) + '">' + esc(x.cta.label) + ' ' + ico('arrow-right') + '</a>' : '') + '</div></div>' +
        '<figure class="story-media"><img src="' + esc(a.image) + '" alt="' + esc(a.imageAlt) + '" width="800" height="600" loading="lazy"></figure>', o);
    }
    var media = '<div class="col-lg-6' + (rev ? ' order-lg-2' : '') + '"><div class="about-media">' +
      '<img src="' + esc(a.image) + '" alt="' + esc(a.imageAlt) + '" width="800" height="600" loading="lazy">' +
      '<div class="about-since"><strong>' + esc(T.since) + '</strong>Sejak</div></div></div>';
    var text = '<div class="col-lg-6' + (rev ? ' order-lg-1' : '') + '">' +
      (x.eyebrow ? '<span class="eyebrow">' + esc(x.eyebrow) + '</span>' : '') + '<h2 id="about-title">' + esc(a.title) + '</h2>' +
      a.text.map(function (p) { return '<p class="text-muted-x">' + esc(p) + '</p>'; }).join('') +
      '<ul class="check-list">' + a.highlights.map(function (t) { return '<li>' + ico('circle-check') + '<span>' + esc(t) + '</span></li>'; }).join('') + '</ul>' +
      (x.cta && !o.noCta ? '<a class="btn btn-outline-brand" href="' + url(x.cta.route) + '">' + esc(x.cta.label) + ' ' + ico('arrow-right') + '</a>' : '') + '</div>';
    var stats = '<div class="stats">' + T.stats.map(function (s) { return '<div class="stat"><strong>' + esc(s.value) + '</strong><span>' + esc(s.label) + '</span></div>'; }).join('') + '</div>';
    return wrap('about', '<div class="row g-4 g-lg-5 align-items-center">' + media + text + '</div>' + stats, o);
  };

  /* ----------------------------------------------------------------- why */
  R.why = function (variant, o) {
    var items = D.why;
    if (variant === 'numbered') {
      return wrap('why', head('why') + '<div class="why-nums">' + items.map(function (w, i) {
        return '<div class="why-num"><span class="n" aria-hidden="true">' + String(i + 1).padStart(2, '0') + '</span><h3>' + esc(w.title) + '</h3><p>' + esc(w.text) + '</p></div>';
      }).join('') + '</div>', o);
    }
    if (variant === 'grid') {
      return wrap('why', head('why') + '<div class="row g-3 g-lg-4">' + cols(items, 'col-12 col-md-6 col-lg-3', function (w) {
        return '<div class="card-x why-card"><span class="ico">' + ico(w.icon, 'i-lg') + '</span><h3>' + esc(w.title) + '</h3><p>' + esc(w.text) + '</p></div>';
      }) + '</div>', o);
    }
    var list = items.map(function (w) {
      return '<div class="why-item"><span class="ico">' + ico(w.icon, 'i-lg') + '</span><div><h3>' + esc(w.title) + '</h3><p>' + esc(w.text) + '</p></div></div>';
    }).join('');
    return wrap('why', '<div class="row g-4 g-lg-5 align-items-center">' +
      '<div class="col-lg-6 order-lg-2"><div class="why-media"><img src="' + esc(T.whyMedia.image) + '" alt="' + esc(T.whyMedia.alt) + '" width="800" height="600" loading="lazy"></div></div>' +
      '<div class="col-lg-6 order-lg-1">' + head('why', true) + '<div>' + list + '</div></div></div>', o);
  };

  /* ----------------------------------------------------------- portfolio */
  R.portfolio = function (variant, o) {
    var list = D.portfolio.slice(0, o.limit || D.portfolio.length);
    var body = variant === 'slider'
      ? slider(list.map(C.portfolioCard), tx('portfolio').title, true)
      : '<div class="row g-3 g-lg-4" data-lightbox-group>' + cols(list, 'col-6 col-lg-4', C.portfolioCard) + '</div>';
    return wrap('portfolio', head('portfolio') + body + foot('portfolio'), o);
  };

  /* --------------------------------------------------------------- steps */
  R.steps = function (variant, o) {
    var items = D.steps.map(function (s) {
      return '<li class="step"><span class="ico">' + ico(s.icon, 'i-lg') + '</span><h3>' + esc(s.title) + '</h3><p>' + esc(s.text) + '</p></li>';
    }).join('');
    return wrap('steps', head('steps') + '<ol class="steps steps--' + variant + ' pt-2">' + items + '</ol>', o);
  };

  /* -------------------------------------------------------- testimonials */
  R.testimonials = function (variant, o) {
    var label = 'Daftar testimoni, geser untuk melihat lainnya', body;
    if (variant === 'slider') body = slider(D.testimonials.map(C.testimonialCard), label);
    else if (variant === 'grid') body = '<div class="row g-3 g-lg-4">' + cols(D.testimonials, 'col-12 col-md-6 col-lg-4', C.testimonialCard) + '</div>';
    else body = '<div class="testi-scroll" tabindex="0" aria-label="' + label + '">' + D.testimonials.map(C.testimonialCard).join('') + '</div>';
    return wrap('testimonials', head('testimonials') + body, o);
  };

  /* ----------------------------------------------------------------- faq */
  R.faq = function (variant, o) {
    var items = D.faqs.filter(function (f) { return f.featured; }).map(C.faqItem).join('');
    var body = variant === 'columns'
      ? '<div class="faq-list faq-list--columns">' + items + '</div>' + foot('faq', 'link')
      : '<div class="row justify-content-center"><div class="col-lg-8"><div class="faq-list">' + items + '</div>' + foot('faq', 'link') + '</div></div>';
    return wrap('faq', head('faq') + body, o);
  };

  /* ------------------------------------------------------------ location */
  function infoRows() {
    var hours = '<table class="hours-table"><tbody>' + T.hours.map(function (h) { return '<tr><td>' + esc(h.day) + '</td><td>' + esc(h.time) + '</td></tr>'; }).join('') + '</tbody></table>';
    return '<div class="info-row"><span class="ico">' + ico('map-pin') + '</span><div><small>Alamat</small><address class="mb-0">' + esc(T.address) + '</address></div></div>' +
      '<div class="info-row"><span class="ico">' + ico('clock') + '</span><div class="flex-fill"><small>Jam operasional</small>' + hours + '</div></div>' +
      '<div class="info-row"><span class="ico">' + ico('phone') + '</span><div><small>Telepon</small><a href="tel:+' + esc(T.phone) + '"><strong>' + esc(T.phoneDisplay) + '</strong></a></div></div>' +
      '<div class="info-row"><span class="ico">' + ico('mail') + '</span><div><small>Email</small><a href="mailto:' + esc(T.email) + '"><strong>' + esc(T.email) + '</strong></a></div></div>' +
      '<div class="loc-actions d-flex flex-wrap gap-2 mt-3"><a class="btn btn-brand flex-fill" href="' + esc(T.mapLink) + '" target="_blank" rel="noopener noreferrer">' + ico('navigation') + ' Petunjuk Arah</a>' +
      '<a class="btn btn-wa flex-fill" data-wa>' + WA + ' Chat WhatsApp</a></div>';
  }
  function mapFrame() {
    return '<div class="map-frame"><iframe title="Peta lokasi ' + esc(T.name) + '" src="' + esc(T.mapEmbed) + '" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe></div>';
  }
  R.location = function (variant, o) {
    var body = variant === 'stacked'
      ? '<div class="row g-4"><div class="col-12"><div class="loc-card loc-card--wide">' + infoRows() + '</div></div><div class="col-12">' + mapFrame() + '</div></div>'
      : '<div class="row g-4 align-items-stretch"><div class="col-lg-5"><div class="loc-card">' + infoRows() + '</div></div><div class="col-lg-7">' + mapFrame() + '</div></div>';
    return wrap('location', head('location') + body, o);
  };


  /* ------------------------------------------- section B2B (template Katalog)
     Data dari tenant: clients, problems, industries, coverage. Data kosong / salah tipe -> section
     dilewati (peringatan di console), tidak pernah menulis "undefined". */
  var arr = function (v) { return Array.isArray(v) ? v.filter(function (x) { return x && typeof x === 'object'; }) : []; };
  function missing(id) { console.warn('[sections.js] section "' + id + '" dilewati: tenant.' + id + ' kosong atau bukan array/objek yang benar.'); return ''; }
  var initials = function (name) { return String(name || '').replace(/^(PT|CV|UD|Toko|Klinik|SMA|SMK|SD|SMP|Koperasi)\s+/i, '').split(/\s+/).slice(0, 2).map(function (w) { return w.charAt(0); }).join('').toUpperCase(); };

  R.clients = function (variant, o) {
    var list = arr(D.clients).filter(function (c) { return typeof c.name === 'string' && c.name; });
    if (!list.length) return missing('clients');
    var chip = function (c) {
      return '<li class="client"><span class="client-mark" aria-hidden="true">' + esc(initials(c.name)) + '</span><span class="client-name">' + esc(c.name) + (c.type ? '<small>' + esc(c.type) + '</small>' : '') + '</span></li>';
    };
    if (variant === 'marquee') {   /* dua deret identik berjalan bersambung; deret kedua disembunyikan dari pembaca layar */
      var row = list.map(chip).join('');
      return wrap('clients', head('clients') + '<div class="marquee"><ul class="marquee-track">' + row + '</ul><ul class="marquee-track" aria-hidden="true">' + row + '</ul></div><button type="button" class="marquee-toggle" data-marquee-toggle aria-pressed="false">Jeda gerakan</button>' + (tx('clients').note ? '<p class="clients-note">' + esc(tx('clients').note) + '</p>' : ''), o);
    }
    return wrap('clients', head('clients') + '<ul class="clients clients--' + variant + '">' + list.map(chip).join('') + '</ul>' + (tx('clients').note ? '<p class="clients-note">' + esc(tx('clients').note) + '</p>' : ''), o);
  };

  R.problems = function (variant, o) {
    var list = arr(D.problems).filter(function (p) { return p.problem && p.solution; });
    if (!list.length) return missing('problems');
    var x = tx('problems');
    return wrap('problems', head('problems') + '<div class="row g-3 g-lg-4">' + cols(list, 'col-12 col-md-6 col-lg-3', function (p) {
      return '<div class="card-x problem-card"><span class="ico">' + ico(p.icon || 'circle-help', 'i-lg') + '</span>' +
        '<small class="problem-label">' + esc(x.problemLabel || 'Masalah') + '</small><h3>' + esc(p.problem) + '</h3>' +
        '<small class="problem-label is-solution">' + esc(x.solutionLabel || 'Solusi kami') + '</small><p>' + esc(p.solution) + '</p></div>';
    }) + '</div>', o);
  };

  R.industries = function (variant, o) {
    var list = arr(D.industries).filter(function (i) { return typeof i.name === 'string' && i.name; });
    if (!list.length) return missing('industries');
    var cat = function (slug) { return D.categories.filter(function (c) { return c.slug === slug; })[0]; };
    return wrap('industries', head('industries') + '<div class="row g-3 g-lg-4 industries industries--' + variant + '">' + cols(list, variant === 'compact' ? 'col-6 col-md-4 col-lg-2' : 'col-12 col-md-6 col-lg-4', function (i) {
      var c = cat(i.category);
      return '<div class="card-x industry-card"><span class="ico">' + ico(i.icon || 'building-2', 'i-lg') + '</span><div><h3>' + esc(i.name) + '</h3>' +
        (variant === 'compact' || !i.text ? '' : '<p>' + esc(i.text) + '</p>') +
        (c && variant !== 'compact' ? '<a class="link-arrow" href="' + url('category', c.slug) + '">' + esc(c.name) + ' ' + ico('arrow-right') + '</a>' : '') + '</div></div>';
    }) + '</div>', o);
  };

  /* promo: ubin pintasan ke kategori/layanan (template Toko). Tautan tidak valid dilewati. */
  R.promo = function (variant, o) {
    var list = arr(D.promos).filter(function (p) { return typeof p.title === 'string' && p.title && typeof p.route === 'string' && D.routes[p.route]; });
    if (!list.length) return missing('promos');
    return wrap('promo', head('promo') + '<div class="row g-3 g-lg-4 promo-tiles">' + cols(list, 'col-12 col-md-4', function (p) {
      return '<a class="promo-tile" href="' + esc(url(p.route, p.slug)) + '"><span class="ico">' + ico(p.icon || 'tag', 'i-lg') + '</span><span class="promo-body">' +
        (p.badge ? '<span class="promo-badge">' + esc(p.badge) + '</span>' : '') + '<strong>' + esc(p.title) + '</strong>' + (p.text ? '<span>' + esc(p.text) + '</span>' : '') + '</span>' + ico('arrow-right', 'promo-go') + '</a>';
    }) + '</div>', o);
  };

  R.coverage = function (variant, o) {
    var cv = D.coverage && typeof D.coverage === 'object' && !Array.isArray(D.coverage) ? D.coverage : null;
    var areas = cv ? arr(cv.areas).filter(function (a) { return a.name; }) : [];
    if (!areas.length) return missing('coverage');
    var delivery = arr(cv.delivery).filter(function (d) { return d.title; });
    var left = '<ul class="coverage-list">' + areas.map(function (a) {
      return '<li><span class="ico">' + ico('map-pin') + '</span><div><strong>' + esc(a.name) + '</strong>' + (a.text ? '<span>' + esc(a.text) + '</span>' : '') + '</div>' + (a.eta ? '<span class="tag-opt">' + esc(a.eta) + '</span>' : '') + '</li>';
    }).join('') + '</ul>';
    var right = '<div class="card-x coverage-card"><h3>' + esc(tx('coverage').deliveryTitle || 'Cara pengiriman') + '</h3>' + delivery.map(function (d) {
      return '<div class="why-item"><span class="ico">' + ico(d.icon || 'truck', 'i-lg') + '</span><div><h4>' + esc(d.title) + '</h4><p>' + esc(d.text) + '</p></div></div>';
    }).join('') + (cv.note ? '<p class="form-note mb-0">' + esc(cv.note) + '</p>' : '') + '</div>';
    return wrap('coverage', head('coverage') + '<div class="row g-4 align-items-start"><div class="col-lg-6">' + left + '</div><div class="col-lg-6">' + right + '</div></div>', o);
  };

  /* Ajakan membuka daftar tanya (hanya paket Katalog: PLATFORM.sections.inquiry.requires) */
  R.inquiry = function (variant, o) {
    var x = tx('inquiry'), sec = x.secondary || {};
    return wrap('inquiry', '<div class="cta-wa cta-wa--solid inquiry-band">' +
      '<div class="cta-copy"><h2 id="inquiry-title">' + esc(x.title) + '</h2><p>' + esc(x.text) + '</p></div>' +
      '<div class="cta-actions"><button type="button" class="btn btn-wa btn-lg" data-inq-open aria-haspopup="dialog">' + ico('clipboard-list') + ' ' + esc(x.button) + '</button>' +
      (sec.route && P.routes[sec.route] ? '<a class="btn btn-light-ghost btn-lg" href="' + url(sec.route) + '">' + ico('layout-grid') + ' ' + esc(sec.label) + '</a>' : '') + '</div></div>', o);
  };

  /* ------------------------------------------------ section template Grafika
     Hero banner (tenant.banners), mosaik kategori, produk bertab (service.tags), jelajah per kategori, artikel terbaru.
     Semua tahan data kosong: banner kosong -> hero split; tab kosong dibuang; kategori tanpa layanan dilewati. */
  function tabList(id, tabs) {
    return '<div class="tab-list" role="tablist" aria-label="' + esc(tx(id).title || id) + '">' + tabs.map(function (t, i) {
      return '<button type="button" class="tab-btn" role="tab" id="' + id + '-tab-' + i + '" aria-controls="' + id + '-panel-' + i + '" aria-selected="' + (i === 0) + '" tabindex="' + (i === 0 ? '0' : '-1') + '">' +
        esc(t.label) + (t.count != null ? ' <span class="tab-count">' + t.count + '</span>' : '') + '</button>';
    }).join('') + '</div>';
  }
  function tabPanels(id, htmls) {
    return htmls.map(function (h, i) {
      return '<div class="tab-panel" role="tabpanel" id="' + id + '-panel-' + i + '" aria-labelledby="' + id + '-tab-' + i + '"' + (i ? ' hidden' : '') + '>' + h + '</div>';
    }).join('');
  }

  function bannerHero() {
    var list = arr(D.banners).filter(function (b) {
      return typeof b.title === 'string' && b.title && typeof b.image === 'string' && b.image && b.cta && typeof b.cta.label === 'string' && b.cta.label && typeof b.cta.route === 'string' && D.routes[b.cta.route];
    });
    if (!list.length) { console.warn('[sections.js] hero "banner" dilewati: tenant.banners kosong atau tidak valid; dipakai varian "split".'); return ''; }
    var slides = list.map(function (b, i) {
      return '<div class="slide banner-slide banner-tone-' + (i % 3) + '" role="group" aria-roledescription="slide" aria-label="Banner ' + (i + 1) + ' dari ' + list.length + '">' +
        '<div class="banner-copy">' + (b.eyebrow ? '<span class="banner-eyebrow">' + esc(b.eyebrow) + '</span>' : '') + '<h2>' + esc(b.title) + '</h2>' + (b.text ? '<p>' + esc(b.text) + '</p>' : '') +
        '<a class="btn btn-brand btn-lg" href="' + esc(url(b.cta.route, b.cta.slug)) + '">' + esc(b.cta.label) + ' ' + ico('arrow-right') + '</a></div>' +
        '<div class="banner-art"><img src="' + esc(b.image) + '" alt="' + esc(b.imageAlt || '') + '" width="800" height="600"' + (i ? ' loading="lazy"' : ' fetchpriority="high"') + '></div></div>';
    }).join('');
    var dots = list.map(function (b, i) { return '<button type="button" class="banner-dot" data-banner-go="' + i + '" aria-label="Banner ' + (i + 1) + '" aria-current="' + (i === 0) + '"></button>'; }).join('');
    return '<section class="hero hero--banner" aria-labelledby="hero-title"><div class="container">' +
      '<h1 id="hero-title" class="visually-hidden">' + esc(T.hero.headline) + '</h1>' +
      '<div class="slider banner" data-slider data-banner><div class="slider-track" tabindex="0" role="region" aria-roledescription="carousel" aria-label="Banner promosi, geser untuk melihat lainnya">' + slides + '</div>' +
      (list.length > 1
        ? '<div class="slider-nav banner-nav"><button type="button" class="slider-btn" data-slider-prev aria-label="Banner sebelumnya">' + ico('chevron-left') + '</button>' +
          '<div class="banner-dots" role="group" aria-label="Pilih banner">' + dots + '</div>' +
          '<button type="button" class="slider-btn" data-slider-next aria-label="Banner berikutnya">' + ico('chevron-right') + '</button></div>'
        : '') + '</div></div></section>';
  }

  /* Kategori bulat (template Etalase): lingkaran bergambar sebaris. Gambar = gambar layanan pertama kategori (dekoratif); tanpa gambar, ikon kategori. */
  function circles(o) {
    var items = D.categories.map(function (c) {
      var list = D.services.filter(function (s) { return s.category === c.slug; }), first = list[0];
      return '<li><a class="circ" href="' + esc(url('category', c.slug)) + '"><span class="circ-img">' +
        (first && first.image ? '<img src="' + esc(first.image) + '" alt="" width="200" height="200" loading="lazy">' : ico(c.icon || 'layers', 'i-lg')) + '</span>' +
        '<strong>' + esc(c.name) + '</strong><small>' + list.length + ' layanan</small></a></li>';
    }).join('');
    return wrap('categories', head('categories') + '<ul class="cat-circles">' + items + '</ul>', o);
  }

  /* Mosaik kategori: dua ubin besar, lalu ubin kecil. Gambar = gambar layanan pertama kategori (dekoratif). */
  function mosaic(o) {
    var tiles = D.categories.map(function (c, i) {
      var first = D.services.filter(function (s) { return s.category === c.slug; })[0];
      var n = D.services.filter(function (s) { return s.category === c.slug; }).length;
      return '<a class="mosaic-tile' + (i < 2 ? ' is-lg' : '') + '" href="' + esc(url('category', c.slug)) + '">' +
        (first ? '<img class="mosaic-img" src="' + esc(first.image) + '" alt="" width="800" height="600" loading="lazy">' : '') +
        '<span class="mosaic-ico">' + ico(c.icon, 'i-lg') + '</span>' +
        '<span class="mosaic-body"><strong>' + esc(c.name) + '</strong><span>' + n + ' layanan</span></span>' + ico('arrow-right', 'mosaic-go') + '</a>';
    }).join('');
    return wrap('categories', head('categories') + '<div class="mosaic">' + tiles + '</div>', o);
  }

  /* Produk bertab: Terlaris (featured), Baru (tags), Semua. Tab tanpa isi dibuang; satu tab saja = tanpa bilah tab. */
  function serviceTabs(o) {
    var x = tx('services'), names = x.tabs || {}, pool = D.services, lim = function (l) { return o.limit ? l.slice(0, o.limit) : l; };
    var defs = [
      { label: names.featured || 'Terlaris', list: pool.filter(function (s) { return s.featured; }) },
      { label: names['new'] || 'Baru', list: pool.filter(PS.isNew) },
      { label: names.all || 'Semua', list: pool }
    ].filter(function (d) { return d.list.length; });
    if (!defs.length) return missing('services');
    var grid = function (l) { return '<div class="row g-3 g-lg-4">' + cols(lim(l), 'col-12 col-sm-6 col-lg-3', C.serviceCard) + '</div>'; };
    var bar = defs.length > 1 ? tabList('services', defs) : '';
    return wrap('services', '<div data-tabs><div class="sec-row">' + head('services', true) + bar + '</div>' +
      tabPanels('services', defs.map(function (d) { return grid(d.list); })) + '</div>' + foot('services', 'link'), o);
  }

  /* Jelajah per kategori: chip kategori, banner samping, kartu produk kategori terpilih. */
  R.catshow = function (variant, o) {
    var cats = D.categories.map(function (c) { return { c: c, list: D.services.filter(function (s) { return s.category === c.slug; }) }; }).filter(function (e) { return e.list.length; });
    if (!cats.length) return missing('catshow');
    var panel = function (e) {
      return '<div class="row g-3 g-lg-4"><div class="col-lg-3"><a class="catshow-banner" href="' + esc(url('category', e.c.slug)) + '">' +
        '<span class="ico">' + ico(e.c.icon, 'i-lg') + '</span><strong>' + esc(e.c.name) + '</strong><span class="catshow-desc">' + esc(e.c.description || '') + '</span>' +
        '<span class="link-arrow">Lihat semua (' + e.list.length + ') ' + ico('arrow-right') + '</span></a></div>' +
        '<div class="col-lg-9"><div class="row g-3 g-lg-4">' + cols(e.list.slice(0, 6), 'col-12 col-sm-6 col-lg-4', C.serviceCard) + '</div></div></div>';
    };
    return wrap('catshow', '<div data-tabs><div class="sec-row">' + head('catshow', true) + '</div>' +
      tabList('catshow', cats.map(function (e) { return { label: e.c.name, count: e.list.length }; })) +
      tabPanels('catshow', cats.map(panel)) + '</div>' + foot('catshow', 'link'), o);
  };

  /* Artikel terbaru: tanggal terbaru dulu, 3 secara bawaan. */
  R.articles = function (variant, o) {
    var list = arr(D.articles).filter(function (a) { return a.slug && a.title; }).sort(function (a, b) { return String(b.date || '').localeCompare(String(a.date || '')); });
    if (!list.length) return missing('articles');
    return wrap('articles', head('articles') + '<div class="row g-3 g-lg-4">' + cols(list.slice(0, o.limit || 3), 'col-12 col-md-6 col-lg-4', C.articleCard) + '</div>' + foot('articles', 'link'), o);
  };

  /* Interaksi: tab (klik + panah/Home/End) dan titik penanda banner. Delegasi di dokumen; hanya ada di beranda. */
  function selectTab(b, focus) {
    var root = b.closest('[data-tabs]'); if (!root) return;
    Array.prototype.forEach.call(root.querySelectorAll('[role="tab"]'), function (t) { var on = t === b; t.setAttribute('aria-selected', String(on)); t.setAttribute('tabindex', on ? '0' : '-1'); });
    Array.prototype.forEach.call(root.querySelectorAll('[role="tabpanel"]'), function (p) { p.hidden = p.id !== b.getAttribute('aria-controls'); });
    if (focus) b.focus();
  }
  document.addEventListener('click', function (e) { var b = e.target.closest && e.target.closest('[data-tabs] [role="tab"]'); if (b) selectTab(b, false); });
  document.addEventListener('click', function (e) {      /* jeda gerakan deret klien (WCAG 2.2.2) */
    var t = e.target.closest && e.target.closest('[data-marquee-toggle]'); if (!t) return;
    var m = t.previousElementSibling, on = t.getAttribute('aria-pressed') !== 'true';
    if (m) m.classList.toggle('is-paused', on);
    t.setAttribute('aria-pressed', String(on)); t.textContent = on ? 'Putar gerakan' : 'Jeda gerakan';
  });
  document.addEventListener('keydown', function (e) {
    var b = e.target.closest && e.target.closest('[data-tabs] [role="tab"]'); if (!b) return;
    var tabs = Array.prototype.slice.call(b.parentNode.querySelectorAll('[role="tab"]')), i = tabs.indexOf(b), n;
    if (e.key === 'ArrowRight') n = (i + 1) % tabs.length; else if (e.key === 'ArrowLeft') n = (i - 1 + tabs.length) % tabs.length;
    else if (e.key === 'Home') n = 0; else if (e.key === 'End') n = tabs.length - 1; else return;
    e.preventDefault(); selectTab(tabs[n], true);
  });
  PS.ready(function () {
    Array.prototype.forEach.call(document.querySelectorAll('[data-banner]'), function (sl) {
      var track = sl.querySelector('.slider-track'), dots = Array.prototype.slice.call(sl.querySelectorAll('[data-banner-go]')), ticking = false;
      if (!track) return;
      function stride() { var f = track.children[0]; return f ? f.getBoundingClientRect().width + (parseFloat(window.getComputedStyle(track).columnGap) || 0) : track.clientWidth; }
      function mark() { var i = Math.round(track.scrollLeft / (stride() || 1)); dots.forEach(function (d, k) { d.setAttribute('aria-current', String(k === i)); }); ticking = false; }
      track.addEventListener('scroll', function () { if (!ticking) { ticking = true; window.requestAnimationFrame(mark); } }, { passive: true });
      dots.forEach(function (d) { d.addEventListener('click', function () { track.scrollTo({ left: parseInt(d.getAttribute('data-banner-go'), 10) * stride(), behavior: 'smooth' }); }); });
      mark();
    });
  });

  /* ------------------------------------------------------------------ cta */
  R.cta = function (variant) {
    var c = T.cta;
    if (variant === 'strip') {            /* satu baris besar dengan garis atas dan bawah, tanpa kartu */
      var contact = PS.modules.order === 'contact';
      return '<section class="cta-strip" aria-label="Hubungi kami"><div class="container"><h2>' + esc(c.title) + '</h2><div class="cta-actions">' +
        (contact ? '<a class="btn btn-brand btn-lg" href="' + url('contact') + '">' + ico('message-square') + ' Hubungi Kami</a>' : '<a class="btn btn-wa btn-lg" data-wa>' + WA + ' ' + esc(c.button) + '</a>') + '</div></div></section>';
    }
    return '<section class="section pt-0" aria-label="Pesan lewat WhatsApp"><div class="container"><div class="cta-wa cta-wa--' + variant + '">' +
      '<div class="cta-copy"><h2>' + esc(c.title) + '</h2><p>' + esc(c.text) + '</p></div>' +
      '<div class="cta-actions"><a class="btn btn-wa btn-lg" data-wa>' + WA + ' ' + esc(c.button) + '</a>' +
      (PS.modules.pricingPage
        ? '<a class="btn btn-light-ghost btn-lg" href="' + url('pricing') + '">' + ico('receipt-text') + ' Lihat Daftar Harga</a>'
        : '<a class="btn btn-light-ghost btn-lg" href="' + url('services') + '">' + ico('layout-grid') + ' Lihat Layanan Kami</a>') +
      '</div></div></div></section>';
  };

  /* ------------------------------------------------- susun beranda dari data */
  PS.sections = R;
  R.parts = { infoRows: infoRows, mapFrame: mapFrame };      /* dipakai halaman Kontak */
  PS.use(function () {
    var main = document.getElementById('main');
    if (!main || document.body.getAttribute('data-page') !== 'home') return;
    var band = 0;
    main.innerHTML = PS.site.home.map(function (s) {
      var reg = P.sections[s.id];
      var alt = reg.banded && (band % 2) === 1;           /* putih, abu-abu, putih, ... otomatis, walau urutan/aktif berubah */
      var html = R[s.id](s.variant, { alt: alt, limit: s.limit });
      if (reg.banded && html) band++;                     /* section yang dilewati (data kosong) tidak menggeser selang-seling */
      return html;
    }).join('');
  });
})();
