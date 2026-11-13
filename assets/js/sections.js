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
    var h = T.hero, a = h.actions || {}, p1 = a.primary || {}, p2 = a.secondary || {};
    var copy = '<span class="hero-badge">' + ico('map-pin') + '<span>' + esc(h.eyebrow) + '</span></span>' +
      '<h1 id="hero-title">' + esc(h.headline) + '</h1>' +
      '<p class="hero-sub">' + esc(h.subheadline) + '</p>' +
      '<div class="hero-actions">' +
      '<a class="btn btn-brand btn-lg" href="' + url(p1.route || 'services') + '">' + ico(p1.icon || 'layout-grid') + ' ' + esc(p1.label) + '</a>' +
      '<a class="btn btn-wa btn-lg" data-wa data-wa-msg="' + esc(p2.message || PS.msgDefault()) + '">' + ico(p2.icon || 'message-circle') + ' ' + esc(p2.label) + '</a></div>' +
      '<ul class="hero-points">' + h.points.map(function (t) { return '<li>' + ico('circle-check') + '<span>' + esc(t) + '</span></li>'; }).join('') + '</ul>';
    var body;
    if (variant === 'centered') {
      body = '<div class="hero-copy">' + copy + '</div><div class="hero-visual hero-visual--wide">' + C.heroVisual() + '</div>';
    } else {
      body = '<div class="row align-items-center g-4 g-lg-5"><div class="col-lg-6">' + copy + '</div>' +
        '<div class="col-lg-6"><div class="hero-visual">' + C.heroVisual() + '</div></div></div>';
    }
    return '<section class="hero hero--' + variant + '" aria-labelledby="hero-title"><div class="container">' + body + '</div></section>';
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
    return wrap('categories', head('categories') +
      '<div class="row g-3 g-lg-4 cat-list cat-list--' + variant + '">' + cols(D.categories, 'col-12 col-sm-6 col-lg-4', C.categoryCard) + '</div>', o);
  };

  /* ------------------------------------------------------------ services */
  R.services = function (variant, o) {
    var list = D.services.filter(function (s) { return s.featured; });
    if (o.limit) list = list.slice(0, o.limit);
    var body = variant === 'slider'
      ? slider(list.map(C.serviceCard), tx('services').title)
      : '<div class="row g-3 g-lg-4">' + cols(list, 'col-12 col-md-6 col-lg-4', C.serviceCard) + '</div>';
    return wrap('services', head('services') + body + foot('services'), o);
  };

  /* --------------------------------------------------------------- about */
  R.about = function (variant, o) {
    var a = T.about, x = tx('about'), rev = variant === 'reverse';
    var media = '<div class="col-lg-6' + (rev ? ' order-lg-2' : '') + '"><div class="about-media">' +
      '<img src="' + esc(a.image) + '" alt="' + esc(a.imageAlt) + '" width="800" height="600" loading="lazy">' +
      '<div class="about-since"><strong>' + esc(T.since) + '</strong>Sejak</div></div></div>';
    var text = '<div class="col-lg-6' + (rev ? ' order-lg-1' : '') + '">' +
      (x.eyebrow ? '<span class="eyebrow">' + esc(x.eyebrow) + '</span>' : '') + '<h2 id="about-title">' + esc(a.title) + '</h2>' +
      a.text.map(function (p) { return '<p class="text-muted-x">' + esc(p) + '</p>'; }).join('') +
      '<ul class="check-list">' + a.highlights.map(function (t) { return '<li>' + ico('circle-check') + '<span>' + esc(t) + '</span></li>'; }).join('') + '</ul>' +
      (x.cta ? '<a class="btn btn-outline-brand" href="' + url(x.cta.route) + '">' + esc(x.cta.label) + ' ' + ico('arrow-right') + '</a>' : '') + '</div>';
    var stats = '<div class="stats">' + T.stats.map(function (s) { return '<div class="stat"><strong>' + esc(s.value) + '</strong><span>' + esc(s.label) + '</span></div>'; }).join('') + '</div>';
    return wrap('about', '<div class="row g-4 g-lg-5 align-items-center">' + media + text + '</div>' + stats, o);
  };

  /* ----------------------------------------------------------------- why */
  R.why = function (variant, o) {
    var items = D.why;
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

  /* ------------------------------------------------------------------ cta */
  R.cta = function (variant) {
    var c = T.cta;
    return '<section class="section pt-0" aria-label="Pesan lewat WhatsApp"><div class="container"><div class="cta-wa cta-wa--' + variant + '">' +
      '<div class="cta-copy"><h2>' + esc(c.title) + '</h2><p>' + esc(c.text) + '</p></div>' +
      '<div class="cta-actions"><a class="btn btn-wa btn-lg" data-wa>' + WA + ' ' + esc(c.button) + '</a>' +
      '<a class="btn btn-light-ghost btn-lg" href="' + url('pricing') + '">' + ico('receipt-text') + ' Lihat Daftar Harga</a></div></div></div></section>';
  };

  /* ------------------------------------------------- susun beranda dari data */
  PS.sections = R;
  PS.use(function () {
    var main = document.getElementById('main');
    if (!main || document.body.getAttribute('data-page') !== 'home') return;
    var band = 0;
    main.innerHTML = PS.site.home.map(function (s) {
      var reg = P.sections[s.id];
      var alt = false;
      if (reg.banded) alt = (band++ % 2) === 1;           /* putih, abu-abu, putih, ... otomatis, walau urutan/aktif berubah */
      return R[s.id](s.variant, { alt: alt, limit: s.limit });
    }).join('');
  });
})();
