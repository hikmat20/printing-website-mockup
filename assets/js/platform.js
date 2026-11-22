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
    pricing:     { mockup: 'pricing.html',        laravel: '/harga', module: 'pricing' },
    portfolio:   { mockup: 'portfolio.html',      laravel: '/portofolio' },
    about:       { mockup: 'about.html',          laravel: '/tentang-kami' },
    blog:        { mockup: 'blog.html',           laravel: '/artikel' },
    article:     { mockup: 'article-detail.html', laravel: '/artikel/{slug}', hash: true },
    contact:     { mockup: 'contact.html',        laravel: '/kontak' },
    faq:         { mockup: 'faq.html',            laravel: '/faq' },
    cart:        { mockup: 'keranjang.html',      laravel: '/keranjang',       module: 'cart' },
    orderStatus: { mockup: 'status-pesanan.html', laravel: '/status-pesanan',  module: 'cart' }
  },

  /* ---------- Navigasi ---------- */
  /* icon: dipakai varian header "market" (ikon di depan menu); marketLabel: nama menu di header market */
  nav: [
    { label: 'Beranda', route: 'home', icon: 'house' },
    { label: 'Layanan', route: 'services', dropdown: 'categories', icon: 'layout-grid', marketLabel: 'Semua Produk' },
    { label: 'Harga', route: 'pricing', module: 'pricing', icon: 'receipt-text' },
    { label: 'Portofolio', route: 'portfolio', icon: 'images' },
    { label: 'Informasi', icon: 'info', dropdown: [
        { label: 'Tentang Kami', route: 'about' },
        { label: 'Artikel', route: 'blog' },
        { label: 'FAQ', route: 'faq' },
        { label: 'Lacak Pesanan', route: 'orderStatus', module: 'cart' }
    ] },
    { label: 'Kontak', route: 'contact', icon: 'phone' }
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
  headers:      ['standard', 'topbar', 'megamenu', 'store', 'market'],   // varian header (megamenu: panel lebar per kategori; store: pencarian + keranjang, menu di baris kedua; market: seperti store tanpa baris promo, tombol Kategori, menu berikon, total keranjang, dan strip kepercayaan di footer)
  cardStyles:   ['elevated', 'outlined', 'flat'],     // gaya kartu
  buttonShapes: ['rounded', 'pill', 'square'],        // bentuk tombol

  /* ---------- Section beranda ----------
     locked : tidak bisa dimatikan tenant (hero tetap paling atas, CTA paling bawah)
     banded : ikut selang-seling latar putih / abu-abu otomatis
     requires: modul paket yang harus aktif agar section tampil (mis. inquiry hanya untuk paket Katalog);
               bila tidak terpenuhi section dilewati diam-diam (bukan kesalahan tenant)
     variants[0] = varian default */
  sections: {
    hero:         { locked: true,  variants: ['split', 'centered', 'dark', 'banner'] },     /* banner: slider spanduk dari tenant.banners */
    trust:        {                variants: ['bar', 'cards'] },
    categories:   { banded: true,  variants: ['grid', 'compact', 'mosaic'], anchor: 'kategori' },   /* mosaic: ubin bergambar, dua besar lalu kecil */
    services:     { banded: true,  variants: ['grid', 'slider', 'tabs'], anchor: 'layanan' },    /* tabs: Terlaris / Baru / Semua (service.tags) */
    about:        { banded: true,  variants: ['split', 'reverse'],     anchor: 'tentang' },
    why:          { banded: true,  variants: ['split', 'grid'],        anchor: 'keunggulan' },
    portfolio:    { banded: true,  variants: ['grid', 'slider'],       anchor: 'portofolio' },
    steps:        { banded: true,  variants: ['cards', 'timeline'],    anchor: 'cara-pesan' },
    testimonials: { banded: true,  variants: ['scroll', 'slider', 'grid'], anchor: 'testimoni' },
    faq:          { banded: true,  variants: ['list', 'columns'],      anchor: 'faq' },
    location:     { banded: true,  variants: ['split', 'stacked'],     anchor: 'lokasi' },
    /* Section untuk penjualan B2B (template Katalog); datanya: tenant.clients / problems / industries / coverage */
    clients:      { banded: true,  variants: ['strip', 'grid', 'marquee'], anchor: 'klien' },    /* marquee: deret merek berjalan (diam bila gerak dikurangi) */
    problems:     { banded: true,  variants: ['cards'],                anchor: 'solusi' },
    industries:   { banded: true,  variants: ['grid', 'compact'],      anchor: 'industri' },
    coverage:     { banded: true,  variants: ['split'],                anchor: 'jangkauan' },
    promo:        { banded: true,  variants: ['tiles'],              anchor: 'promo' },        /* toko: kotak promo; data tenant.promos */
    inquiry:      { banded: true,  variants: ['band'],                 anchor: 'daftar-tanya', requires: { order: 'inquiry' } },
    /* Section template Grafika (data: tenant.banners, service.tags, tenant.articles) */
    catshow:      { banded: true,  variants: ['chips'],                anchor: 'jelajah' },       /* jelajahi per kategori: chip + banner samping + kartu produk */
    articles:     { banded: true,  variants: ['cards'],                anchor: 'artikel-terbaru' },   /* artikel terbaru (limit bawaan 3) */
    cta:          { locked: true,  variants: ['gradient', 'solid', 'card'] }
  },

  /* ---------- Paket (fungsi yang dijual) ----------
     SUMBU TERPISAH dari template: template = tampilan, paket = modul yang aktif.
     Tenant memilih lewat site.package. Paket yang available:false belum dikerjakan
     dan tidak bisa dipilih: nilainya jatuh ke defaultPackage.
     modules.prices      : harga tampil di kartu, detail layanan, dan data terstruktur
     modules.pricingPage : halaman /harga ada (menu, footer, tombol CTA mengikuti)
     modules.order       : contact (arahkan ke halaman Kontak) | whatsapp (per item)
                           | inquiry (daftar tanya: beberapa layanan, satu pesan WhatsApp) | cart (keranjang + checkout berujung pesan WhatsApp)
     seo.service         : pola judul/deskripsi detail layanan bila harga tidak tampil
                           dan pola tenant masih memakai token {price}
     Laravel: config/platform.php (packages) + bendera modules per tenant. */
  defaultPackage: 'showcase',
  packages: {
    profile: {
      name: 'Company Profile', available: true,
      description: 'Memperkenalkan usaha: layanan, portofolio, artikel, dan kontak. Tanpa harga dan tanpa tombol pesan per item.',
      modules: { prices: false, pricingPage: false, order: 'contact' },
      seo: { service: { title: '{name} di {city} | {site}', description: '{short} Hubungi {site}, {city}.' } }
    },
    showcase: {
      name: 'Showcase + WA', available: true,
      description: 'Etalase layanan dengan harga; pelanggan memesan lewat WhatsApp dari tiap layanan.',
      modules: { prices: true, pricingPage: true, order: 'whatsapp' },
      seo: {}
    },
    catalog: {
      name: 'Katalog', available: true,
      description: 'Katalog produk dengan filter dan daftar tanya yang dikirim sekali lewat WhatsApp.',
      modules: { prices: true, pricingPage: true, order: 'inquiry' },
      seo: {}
    },
    shop: {
      name: 'Semi e-commerce', available: true,
      description: 'Keranjang dan checkout yang berujung pesan WhatsApp; pembayaran dan akun dibuat di Laravel.',
      modules: { prices: true, pricingPage: true, order: 'cart' },
      seo: {}
    }
  },

  /* ---------- Contoh siap lihat (demo.html) ----------
     Kombinasi paket x template yang direkomendasikan untuk ditunjukkan ke calon client.
     Paket dan template tetap sumbu terpisah: kombinasi lain tetap bisa dipilih di demo.html. */
  demos: [
    { package: 'profile',  template: 'modern',  title: 'Profil usaha yang rapi',         audience: 'Percetakan yang ingin tampil profesional dan dihubungi lewat halaman Kontak.' },
    { package: 'showcase', template: 'classic', title: 'Etalase dengan harga + WhatsApp', audience: 'Toko fotocopy dan percetakan lokal yang menerima pesanan lewat WhatsApp.' },
    { package: 'catalog',  template: 'katalog', title: 'Katalog untuk pelanggan korporat', audience: 'Percetakan B2B: banyak produk, minta penawaran lewat daftar tanya.' },
    { package: 'shop',     template: 'toko',    title: 'Toko dengan keranjang',           audience: 'Digital printing yang ingin pelanggan memilih, memasukkan keranjang, lalu checkout.' },
    { package: 'shop',     template: 'grafika', title: 'Toko cetak ala marketplace',       audience: 'Percetakan dengan banyak produk: banner promo, kategori bergambar, pencarian, dan keranjang.' }
  ],

  /* ---------- Template standar ----------
     Tiap template = skin visual (assets/css/templates/<id>.css) + susunan beranda
     bawaan. Tenant mewarisi semuanya dan boleh menimpa sebagian lewat `site`
     pada data tenant (lihat tenants/sinar-copy.js). */
  /* Halaman internal: STRUKTUR TETAP (dikunci platform). Tenant hanya boleh memilih varian daftar di bawah ini,
     lewat site.pages.<halaman>.variant. Bawaan tiap template ada di templates.<id>.pages. */
  pages: {
    services: { variants: ['grid', 'list', 'catalog'] },   // catalog: filter kategori di sisi kiri + kartu di kanan
    blog:     { variants: ['grid', 'list'] }
  },

  templates: {
    classic: {
      name: 'Klasik',
      description: 'Rapi dan netral: hero dua kolom, kartu berbingkai, susunan yang familiar bagi pelanggan.',
      header: 'standard', cardStyle: 'elevated', buttonShape: 'rounded',
      fonts: { heading: 'plus-jakarta-sans', body: 'plus-jakarta-sans' },
      pages: { services: 'grid', blog: 'grid' },
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
      pages: { services: 'grid', blog: 'grid' },
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
      pages: { services: 'list', blog: 'list' },
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
    },
    katalog: {
      name: 'Katalog B2B',
      description: 'Katalog untuk penjualan ke perusahaan, sekolah, dan instansi: menu besar per kategori, filter di samping, klien, solusi, dan daftar tanya.',
      header: 'megamenu', cardStyle: 'outlined', buttonShape: 'square',
      fonts: { heading: 'dm-sans', body: 'inter' },
      pages: { services: 'catalog', blog: 'grid' },
      home: [
        { id: 'hero', variant: 'split' },
        { id: 'trust', variant: 'bar' },
        { id: 'categories', variant: 'grid' },
        { id: 'services', variant: 'grid', limit: 8 },
        { id: 'clients', variant: 'strip' },
        { id: 'problems', variant: 'cards' },
        { id: 'industries', variant: 'grid' },
        { id: 'why', variant: 'grid' },
        { id: 'portfolio', variant: 'grid', limit: 6 },
        { id: 'steps', variant: 'cards' },
        { id: 'testimonials', variant: 'grid' },
        { id: 'coverage', variant: 'split' },
        { id: 'inquiry', variant: 'band' },
        { id: 'faq', variant: 'columns' },
        { id: 'cta', variant: 'solid' }
      ]
    },
    toko: {
      name: 'Toko',
      description: 'Etalase toko online: pencarian dan keranjang di header, kotak promo, produk terlaris dengan harga menonjol.',
      header: 'store', cardStyle: 'elevated', buttonShape: 'rounded',
      fonts: { heading: 'poppins', body: 'inter' },
      pages: { services: 'grid', blog: 'grid' },
      home: [
        { id: 'hero', variant: 'split' },
        { id: 'trust', variant: 'bar' },
        { id: 'categories', variant: 'compact' },
        { id: 'promo', variant: 'tiles' },
        { id: 'services', variant: 'grid', limit: 8 },
        { id: 'why', variant: 'grid' },
        { id: 'steps', variant: 'cards' },
        { id: 'testimonials', variant: 'slider' },
        { id: 'faq', variant: 'columns' },
        { id: 'cta', variant: 'solid' }
      ]
    },
    grafika: {
      name: 'Grafika',
      description: 'Marketplace cetak: banner promo bergeser, kategori bergambar, produk bertab, pencarian pil dan total keranjang di header.',
      header: 'market', cardStyle: 'elevated', buttonShape: 'pill',
      fonts: { heading: 'montserrat', body: 'inter' },
      pages: { services: 'grid', blog: 'grid' },
      home: [
        { id: 'hero', variant: 'banner' },
        { id: 'trust', variant: 'bar' },
        { id: 'categories', variant: 'mosaic' },
        { id: 'services', variant: 'tabs', limit: 8 },
        { id: 'catshow', variant: 'chips' },
        { id: 'steps', variant: 'cards' },
        { id: 'clients', variant: 'marquee' },
        { id: 'testimonials', variant: 'slider' },
        { id: 'articles', variant: 'cards', limit: 3 },
        { id: 'cta', variant: 'card' }
      ]
    }
  }
};
