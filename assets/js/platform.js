/*
 * platform.js — DATA PLATFORM (dikendalikan platform, BUKAN diedit oleh tenant)
 * ---------------------------------------------------------------------------
 * Berisi hal yang sama untuk semua tenant: pemetaan URL, struktur navigasi,
 * (nanti) registri template, section, varian komponen, dan daftar font.
 * Pemetaan ke Laravel:
 *   routes -> routes/web.php        nav -> config/navigation.php
 */
window.PLATFORM = {

  /* ---------- Pemetaan URL: mockup -> Laravel ---------- */
  routes: {
    home:        { mockup: 'index.html',          laravel: '/' },
    services:    { mockup: 'services.html',       laravel: '/layanan' },
    service:     { mockup: 'service-detail.html', laravel: '/layanan/{slug}', hash: true },
    category:    { mockup: 'services.html',       laravel: '/layanan/kategori/{slug}', hash: true },
    pricing:     { mockup: 'pricing.html',        laravel: '/harga' },
    portfolio:   { mockup: 'portfolio.html',      laravel: '/portofolio' },
    about:       { mockup: 'about.html',          laravel: '/tentang-kami' },
    blog:        { mockup: 'blog.html',           laravel: '/artikel' },
    article:     { mockup: 'article-detail.html', laravel: '/artikel/{slug}', hash: true },
    contact:     { mockup: 'contact.html',        laravel: '/kontak' },
    faq:         { mockup: 'faq.html',            laravel: '/faq' }
  },

  /* ---------- Navigasi ---------- */
  nav: [
    { label: 'Beranda', route: 'home' },
    { label: 'Layanan', route: 'services', dropdown: 'categories' },
    { label: 'Harga', route: 'pricing' },
    { label: 'Portofolio', route: 'portfolio' },
    { label: 'Informasi', dropdown: [
        { label: 'Tentang Kami', route: 'about' },
        { label: 'Artikel', route: 'blog' },
        { label: 'FAQ', route: 'faq' }
    ] },
    { label: 'Kontak', route: 'contact' }
  ],

  /* ======================================================================
     REGISTRI PLATFORM (Model C: Shared Core + Standard Templates +
     Controlled Customization). Tenant HANYA boleh memilih dari daftar ini;
     nilai di luar daftar ditolak dan kembali ke default template.
     Laravel: config/platform.php (templates, sections, fonts, ...)
     ====================================================================== */

  /* ---------- Font yang boleh dipilih tenant (self-hosted: assets/css/fonts.css) ---------- */
  fontFallback: 'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  fonts: {
    'plus-jakarta-sans': { name: 'Plus Jakarta Sans' },
    'inter':             { name: 'Inter' },
    'poppins':           { name: 'Poppins' },
    'montserrat':        { name: 'Montserrat' },
    'roboto':            { name: 'Roboto' },
    'nunito':            { name: 'Nunito' },
    'raleway':           { name: 'Raleway' },
    'lato':              { name: 'Lato' },
    'open-sans':         { name: 'Open Sans' },
    'dm-sans':           { name: 'DM Sans' },
    'source-sans-3':     { name: 'Source Sans 3' },
    'work-sans':         { name: 'Work Sans' }
  },

  /* ---------- Opsi komponen global ---------- */
  headers:      ['standard', 'topbar'],               // varian header
  cardStyles:   ['elevated', 'outlined', 'flat'],     // gaya kartu
  buttonShapes: ['rounded', 'pill', 'square'],        // bentuk tombol

  /* ---------- Section beranda ----------
     locked : tidak bisa dimatikan tenant (hero tetap paling atas, CTA paling bawah)
     banded : ikut selang-seling latar putih / abu-abu otomatis
     variants[0] = varian default */
  sections: {
    hero:         { locked: true,  variants: ['split', 'centered', 'dark'] },
    trust:        {                variants: ['bar', 'cards'] },
    categories:   { banded: true,  variants: ['grid', 'compact'],      anchor: 'kategori' },
    services:     { banded: true,  variants: ['grid', 'slider'],       anchor: 'layanan' },
    about:        { banded: true,  variants: ['split', 'reverse'],     anchor: 'tentang' },
    why:          { banded: true,  variants: ['split', 'grid'],        anchor: 'keunggulan' },
    portfolio:    { banded: true,  variants: ['grid', 'slider'],       anchor: 'portofolio' },
    steps:        { banded: true,  variants: ['cards', 'timeline'],    anchor: 'cara-pesan' },
    testimonials: { banded: true,  variants: ['scroll', 'slider', 'grid'], anchor: 'testimoni' },
    faq:          { banded: true,  variants: ['list', 'columns'],      anchor: 'faq' },
    location:     { banded: true,  variants: ['split', 'stacked'],     anchor: 'lokasi' },
    cta:          { locked: true,  variants: ['gradient', 'solid'] }
  },

  /* ---------- Template standar ----------
     Tiap template = skin visual (assets/css/templates/<id>.css) + susunan beranda
     bawaan. Tenant mewarisi semuanya dan boleh menimpa sebagian lewat `site`
     pada data tenant (lihat tenants/sinar-copy.js). */
  templates: {
    classic: {
      name: 'Klasik',
      description: 'Rapi dan netral: hero dua kolom, kartu berbingkai, susunan yang familiar bagi pelanggan.',
      header: 'standard', cardStyle: 'elevated', buttonShape: 'rounded',
      fonts: { heading: 'plus-jakarta-sans', body: 'plus-jakarta-sans' },
      home: [
        { id: 'hero', variant: 'split' },
        { id: 'trust', variant: 'bar' },
        { id: 'categories', variant: 'grid' },
        { id: 'services', variant: 'grid', limit: 6 },
        { id: 'about', variant: 'split' },
        { id: 'why', variant: 'split' },
        { id: 'portfolio', variant: 'grid', limit: 6 },
        { id: 'steps', variant: 'cards' },
        { id: 'testimonials', variant: 'scroll' },
        { id: 'faq', variant: 'list' },
        { id: 'location', variant: 'split' },
        { id: 'cta', variant: 'gradient' }
      ]
    },
    modern: {
      name: 'Modern',
      description: 'Lapang dan ringan: hero terpusat, sudut membulat besar, layanan dan testimoni berbentuk slider.',
      header: 'standard', cardStyle: 'elevated', buttonShape: 'pill',
      fonts: { heading: 'poppins', body: 'inter' },
      home: [
        { id: 'hero', variant: 'centered' },
        { id: 'trust', variant: 'cards' },
        { id: 'services', variant: 'slider', limit: 8 },
        { id: 'categories', variant: 'compact' },
        { id: 'about', variant: 'reverse' },
        { id: 'why', variant: 'grid' },
        { id: 'steps', variant: 'timeline' },
        { id: 'portfolio', variant: 'grid', limit: 6 },
        { id: 'testimonials', variant: 'slider' },
        { id: 'faq', variant: 'columns' },
        { id: 'location', variant: 'stacked' },
        { id: 'cta', variant: 'solid' }
      ]
    },
    bold: {
      name: 'Bold',
      description: 'Tegas dan kontras tinggi: hero gelap, bingkai tebal, sudut tajam, cocok untuk kesan percetakan yang kuat.',
      header: 'topbar', cardStyle: 'outlined', buttonShape: 'square',
      fonts: { heading: 'montserrat', body: 'open-sans' },
      home: [
        { id: 'hero', variant: 'dark' },
        { id: 'trust', variant: 'bar' },
        { id: 'services', variant: 'grid', limit: 6 },
        { id: 'steps', variant: 'cards' },
        { id: 'about', variant: 'reverse' },
        { id: 'portfolio', variant: 'slider', limit: 8 },
        { id: 'why', variant: 'split' },
        { id: 'testimonials', variant: 'grid' },
        { id: 'categories', variant: 'compact' },
        { id: 'faq', variant: 'list' },
        { id: 'location', variant: 'split' },
        { id: 'cta', variant: 'gradient' }
      ]
    }
  }
};
