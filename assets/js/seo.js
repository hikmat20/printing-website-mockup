/*
 * seo.js — SEO <head> dirender dari data (title, meta, canonical, Open Graph, JSON-LD)
 * ---------------------------------------------------------------------------
 * Sumber data: tenant.seo (judul/deskripsi per halaman), tenant (nama, alamat,
 * jam buka, sosial media), faqs. Tidak ada teks bisnis yang ditulis di HTML.
 *
 * PENTING untuk produksi: di Laravel ini dirender SERVER-SIDE lewat Blade
 * (@section('title'), <x-seo.json-ld />) supaya terbaca crawler tanpa JavaScript.
 * Versi JS ini hanya untuk mockup, dan fungsi-fungsinya memetakan 1:1 ke komponen Blade.
 */
(function () {
  'use strict';

  var PS = window.PrintSite;
  if (!PS) return;

  var D = PS.data, T = D.tenant, seo = T.seo || {};
  var head = document.head;

  /* URL absolut dari path relatif ke domain tenant */
  function abs(path) {
    if (/^https?:\/\//.test(path)) return path;
    return T.domain.replace(/\/$/, '') + '/' + String(path).replace(/^\//, '');
  }

  function meta(attr, key, content) {
    if (content == null || content === '') return;
    var el = head.querySelector('meta[' + attr + '="' + key + '"]');
    if (!el) { el = document.createElement('meta'); el.setAttribute(attr, key); head.appendChild(el); }
    el.setAttribute('content', content);
  }

  function canonical(href) {
    var el = head.querySelector('link[rel="canonical"]');
    if (!el) { el = document.createElement('link'); el.setAttribute('rel', 'canonical'); head.appendChild(el); }
    el.setAttribute('href', href);
  }

  function jsonLd(id, obj) {
    var old = head.querySelector('script[data-seo="' + id + '"]');
    if (old) old.parentNode.removeChild(old);
    var s = document.createElement('script');
    s.type = 'application/ld+json'; s.setAttribute('data-seo', id);
    s.textContent = JSON.stringify(obj, null, 2);
    head.appendChild(s);
  }

  /* --- schema.org/LocalBusiness dari profil tenant ---------------------- */
  function localBusiness() {
    var a = T.addressParts || {};
    return {
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      name: T.name,
      description: seo.defaultDescription,
      url: abs('/'),
      image: abs(seo.ogImage),
      logo: abs(T.logo),
      telephone: '+' + T.phone,
      email: T.email,
      priceRange: PS.modules.prices ? seo.priceRange : undefined,
      address: { '@type': 'PostalAddress', streetAddress: a.street, addressLocality: a.locality, addressRegion: a.region, postalCode: a.postalCode, addressCountry: a.country },
      geo: { '@type': 'GeoCoordinates', latitude: T.geo.lat, longitude: T.geo.lng },
      openingHoursSpecification: T.hours.map(function (h) {
        return { '@type': 'OpeningHoursSpecification', dayOfWeek: h.days.length === 1 ? h.days[0] : h.days, opens: h.opens, closes: h.closes };
      }),
      sameAs: T.social.map(function (s) { return s.href; })
    };
  }

  /* --- schema.org/FAQPage: hanya pertanyaan yang benar-benar tampil ------ */
  function faqPage(list) {
    return {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: list.map(function (f) {
        return { '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } };
      })
    };
  }

  /* schema.org/BreadcrumbList dari jejak halaman (PS.pageMeta.crumbs) */
  function breadcrumbList(crumbs) {
    return {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: crumbs.map(function (c, i) {
        var item = { '@type': 'ListItem', position: i + 1, name: c.name };
        if (c.route) item.item = abs(pathFor(c.route, c.slug));
        return item;
      })
    };
  }

  /* schema.org/Service untuk halaman detail layanan */
  function servicePage(s, cat, pageUrl) {
    return {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: s.name,
      description: s.description,
      serviceType: cat ? cat.name : undefined,
      image: abs(s.image),
      url: pageUrl,
      areaServed: { '@type': 'City', name: T.city },
      provider: { '@type': 'LocalBusiness', name: T.name, url: abs('/'), telephone: '+' + T.phone },
      offers: PS.modules.prices ? { '@type': 'Offer', priceCurrency: 'IDR', price: String(s.priceFrom), url: pageUrl,
        priceSpecification: { '@type': 'UnitPriceSpecification', priceCurrency: 'IDR', price: String(s.priceFrom), unitText: s.unit } } : undefined
    };
  }

  /* '/layanan/{slug}' + slug -> '/layanan/fotocopy' */
  function pathFor(routeName, slug) {
    var r = PS.platform.routes[routeName];
    var p = r ? r.laravel.replace('{slug}', slug || '') : '/';
    return p.length > 1 ? p.replace(/\/$/, '') : p;
  }

  function clearLd(id) {
    var old = head.querySelector('script[data-seo="' + id + '"]');
    if (old) old.parentNode.removeChild(old);
  }

  /* apply('home', { faqs: [...], title, description, ogDescription, path, slug, route, robots }) */
  function apply(pageKey, o) {
    o = o || {};
    var pg = (seo.pages && seo.pages[pageKey]) || {};
    var title = o.title || pg.title || T.name;
    var desc = o.description || pg.description || seo.defaultDescription;
    var path = o.path || pathFor(o.route || pageKey, o.slug);
    var pageUrl = abs(path);

    document.title = title;
    meta('name', 'description', desc);
    meta('name', 'robots', o.robots || 'index, follow');
    meta('name', 'theme-color', (PS.theme() || {}).primary);
    canonical(pageUrl);

    meta('property', 'og:type', o.ogType || 'website');
    meta('property', 'og:site_name', T.name);
    meta('property', 'og:locale', seo.locale || 'id_ID');
    meta('property', 'og:title', title);
    meta('property', 'og:description', o.ogDescription || pg.ogDescription || desc);
    meta('property', 'og:url', pageUrl);
    meta('property', 'og:image', abs(o.image || seo.ogImage));    /* produksi: ganti ke JPG/PNG 1200x630 (SVG tidak didukung semua platform) */
    meta('name', 'twitter:card', 'summary_large_image');
    if (o.published) meta('property', 'article:published_time', o.published);
    else { var pt = head.querySelector('meta[property="article:published_time"]'); if (pt) pt.parentNode.removeChild(pt); }

    jsonLd('business', localBusiness());
    if (o.faqs && o.faqs.length) jsonLd('faq', faqPage(o.faqs)); else clearLd('faq');
    if (o.breadcrumbs && o.breadcrumbs.length > 1) jsonLd('breadcrumb', breadcrumbList(o.breadcrumbs)); else clearLd('breadcrumb');
    if (o.service) jsonLd('service', servicePage(o.service, o.category, pageUrl)); else clearLd('service');
    clearLd('page');
    if (o.pageLd) jsonLd('page', o.pageLd(pageUrl));          /* JSON-LD khusus halaman (CollectionPage, AboutPage, ContactPage) */
  }

  /* Halaman internal: PS.pageMeta ditulis oleh pages.js; dipanggil ulang saat hash (slug) berganti */
  function applyPage() {
    var m = PS.pageMeta;
    if (!m) return;
    var o = { route: m.route, breadcrumbs: m.crumbs, faqs: m.faqs, pageLd: m.pageLd };
    if (m.notFound) {
      o.title = 'Halaman tidak ditemukan | ' + T.name; o.description = seo.defaultDescription; o.robots = 'noindex, follow'; o.path = pathFor(m.route || 'service', '');
    } else if (m.key === 'service') {
      var s = m.service, pat = (seo.pages && seo.pages.service) || {};
      /* Paket tanpa harga: pola tenant yang masih memuat {price} diganti pola bawaan paket supaya harga tidak bocor ke judul/deskripsi */
      var fb = PS.platform.packages[PS.site.package].seo.service;
      if (!PS.modules.prices && fb && /\{price\}/.test(String(pat.title) + String(pat.description))) pat = fb;
      var vars = { name: s.name, short: s.short, price: PS.rupiah(s.priceFrom).replace(/\u00a0/g, ' '), unit: s.unit, category: m.category ? m.category.name : '', site: T.name, city: T.city };
      o.title = fill(pat.title, vars); o.description = fill(pat.description, vars);
      o.slug = s.slug; o.service = s; o.category = m.category;
    } else if (m.key === 'article') {
      var a = m.article, ap = (seo.pages && seo.pages.article) || {};
      var av = { name: a.title, short: a.excerpt, category: a.category, site: T.name, city: T.city };
      o.title = fill(ap.title, av); o.description = fill(ap.description, av);
      o.slug = a.slug; o.ogType = 'article'; o.image = a.image; o.published = a.date;
    }
    apply(m.key, o);
  }
  function fill(tpl, vars) { return String(tpl || '').replace(/\{(\w+)\}/g, function (x, k) { return vars[k] != null ? vars[k] : x; }); }

  PS.seo = { apply: apply, applyPage: applyPage, localBusiness: localBusiness, faqPage: faqPage, breadcrumbList: breadcrumbList, servicePage: servicePage, abs: abs, pathFor: pathFor };

  /* Beranda: JSON-LD FAQ hanya bila section FAQ aktif (data tidak boleh menyatakan yang tidak tampil) */
  PS.use(function () {
    if (document.body.getAttribute('data-page') !== 'home') { applyPage(); return; }
    var faqOn = PS.site.home.some(function (s) { return s.id === 'faq'; });
    apply('home', { faqs: faqOn ? D.faqs.filter(function (f) { return f.featured; }) : [] });
  });
})();
