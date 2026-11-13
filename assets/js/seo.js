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
      priceRange: seo.priceRange,
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

  /* apply('home', { faqs: [...], title, description, ogDescription, path }) */
  function apply(pageKey, o) {
    o = o || {};
    var pg = (seo.pages && seo.pages[pageKey]) || {};
    var title = o.title || pg.title || T.name;
    var desc = o.description || pg.description || seo.defaultDescription;
    var route = PS.platform.routes[o.route || pageKey];
    var path = o.path || (route ? route.laravel : '/');
    var pageUrl = abs(path);

    document.title = title;
    meta('name', 'description', desc);
    meta('name', 'robots', 'index, follow');
    meta('name', 'theme-color', (PS.theme() || {}).primary);
    canonical(pageUrl);

    meta('property', 'og:type', 'website');
    meta('property', 'og:site_name', T.name);
    meta('property', 'og:locale', seo.locale || 'id_ID');
    meta('property', 'og:title', title);
    meta('property', 'og:description', o.ogDescription || pg.ogDescription || desc);
    meta('property', 'og:url', pageUrl);
    meta('property', 'og:image', abs(seo.ogImage));    /* produksi: ganti ke JPG/PNG 1200x630 (SVG tidak didukung semua platform) */
    meta('name', 'twitter:card', 'summary_large_image');

    jsonLd('business', localBusiness());
    if (o.faqs && o.faqs.length) jsonLd('faq', faqPage(o.faqs)); else {
      var old = head.querySelector('script[data-seo="faq"]');
      if (old) old.parentNode.removeChild(old);
    }
  }

  PS.seo = { apply: apply, localBusiness: localBusiness, faqPage: faqPage, abs: abs };

  /* Beranda: JSON-LD FAQ hanya bila section FAQ aktif (data tidak boleh menyatakan yang tidak tampil) */
  PS.use(function () {
    if (document.body.getAttribute('data-page') !== 'home') return;
    var faqOn = PS.site.home.some(function (s) { return s.id === 'faq'; });
    apply('home', { faqs: faqOn ? D.faqs.filter(function (f) { return f.featured; }) : [] });
  });
})();
