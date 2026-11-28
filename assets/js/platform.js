/*
 * platform.js — DATA PLATFORM (dikendalikan platform, BUKAN diedit oleh tenant)
 * ---------------------------------------------------------------------------
 * Berisi hal yang sama untuk semua tenant: pemetaan URL, struktur navigasi,
 * (nanti) registri template, section, varian komponen, dan daftar font.
 * Pemetaan ke Laravel:
 *   routes -> routes/web.php        nav -> config/navigation.php
 */
/*
 * Palet template: empat warna dasar per palet (primary, primaryDark, accent, accentDark); sisanya diturunkan di sini.
 * Rumus yang sama dipakai tools/recolor.py (lewat node) dan tes kontras, jadi satu sumber kebenaran.
 * Kontras yang dijaga: putih di atas primary dan primaryDark, teks gelap (#14110A) di atas accent, accentDark di atas putih dan accentTint,
 * teks terang (onDark*) di atas primaryDark.
 */
(function () {
  function rgb(h) { return [1, 3, 5].map(function (i) { return parseInt(h.slice(i, i + 2), 16); }); }
  function hex(t) { return '#' + t.map(function (v) { return ('0' + Math.round(v).toString(16)).slice(-2); }).join('').toUpperCase(); }
  function mix(a, pct, b) { var A = rgb(a), B = rgb(b); return hex(A.map(function (v, i) { return v * pct / 100 + B[i] * (100 - pct) / 100; })); }
  window.PS_MIX = mix;
  window.PS_PALETTE_BUILD = function (id, name, group, c, hint, onAccent) {
    var W = '#FFFFFF';
    return {
      id: id, name: name, group: group, hint: hint || '',
      primary: c[0], primaryDark: c[1], accent: c[2], accentDark: c[3],
      primaryLight: mix(c[0], 10, W), primaryTint: mix(c[0], 2, W), surface: mix(c[0], 2, W),
      accentTint: mix(c[2], 18, W), onAccent: onAccent || '#14110A',
      onDarkSoft: mix(c[0], 6, W), onDarkMuted: mix(c[0], 16, W), onDarkFaint: mix(c[0], 26, W),
      overlay: mix(c[1], 55, '#000000')
    };
  };
  /* Palet aktif template: tersimpan di perangkat (demo) atau bawaan. Bake selalu memakai bawaan agar hasilnya deterministik. */
  window.PS_PALETTE_FOR = function (tplId) {
    var t = window.PLATFORM && window.PLATFORM.templates[tplId];
    if (!t || !t.palettes) return null;
    var id = t.defaultPalette, st = window.PS_STATIC;
    if (st && !st.bake) { try { var v = localStorage.getItem('ps-palette:' + tplId); if (v) id = v; } catch (e) {} }
    var found = null;
    t.palettes.forEach(function (p) { if (p.id === id) found = p; });
    return found || t.palettes.filter(function (p) { return p.id === t.defaultPalette; })[0];
  };
})();

window.PLATFORM = {

  /* ---------- Pemetaan URL: mockup -> Laravel ---------- */
  routes: {
    home:        { mockup: 'home.html',           laravel: '/' },
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
    orderStatus: { mockup: 'status-pesanan.html', laravel: '/status-pesanan',  module: 'cart' },
    checkout:    { mockup: 'checkout.html',       laravel: '/checkout',        module: 'checkout' }   // hanya paket dengan modules.checkout = 'onsite'
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
  headers:      ['standard', 'topbar', 'megamenu', 'store', 'market', 'rail', 'boutique'],   // varian header (megamenu: panel lebar per kategori; store: pencarian + keranjang, menu di baris kedua; market: seperti store tanpa baris promo, tombol Kategori, menu berikon, total keranjang, dan strip kepercayaan di footer; rail: bilah samping tetap (Compro); boutique: merek di tengah, pencarian di kiri, keranjang di kanan yang membuka laci keranjang (Etalase))
  cardStyles:   ['elevated', 'outlined', 'flat'],     // gaya kartu
  buttonShapes: ['rounded', 'pill', 'square'],        // bentuk tombol

  /* ---------- Section beranda ----------
     locked : tidak bisa dimatikan tenant (hero tetap paling atas, CTA paling bawah)
     banded : ikut selang-seling latar putih / abu-abu otomatis
     requires: modul paket yang harus aktif agar section tampil (mis. inquiry hanya untuk paket Katalog);
               bila tidak terpenuhi section dilewati diam-diam (bukan kesalahan tenant)
     variants[0] = varian default */
  sections: {
    hero:         { locked: true,  variants: ['split', 'centered', 'dark', 'banner', 'fullbleed', 'tiles'] },     /* banner: slider spanduk dari tenant.banners; fullbleed: layar penuh dengan judul raksasa (Compro); tiles: teks di kiri, tiga ubin gambar di kanan (Etalase) */
    trust:        {                variants: ['bar', 'cards'] },
    categories:   { banded: true,  variants: ['grid', 'compact', 'mosaic', 'rows', 'circles'], anchor: 'kategori' },   /* mosaic: ubin bergambar, dua besar lalu kecil; circles: lingkaran bergambar sebaris (Etalase) */
    services:     { banded: true,  variants: ['grid', 'slider', 'tabs', 'rows'], anchor: 'layanan' },    /* tabs: Terlaris / Baru / Semua (service.tags) */
    about:        { banded: true,  variants: ['split', 'reverse', 'story'], anchor: 'tentang' },
    why:          { banded: true,  variants: ['split', 'grid', 'numbered'], anchor: 'keunggulan' },
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
    /* Section template Compro (data: tenant.stats) */
    stats:        {                variants: ['band'],                 anchor: 'angka' },         /* angka besar satu baris */
    cta:          { locked: true,  variants: ['gradient', 'solid', 'card', 'strip'] }
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
    },
    ecommerce: {
      name: 'Full E-commerce', available: true,
      description: 'Belanja sampai bayar di website: keranjang, ongkos kirim otomatis per kurir, metode pembayaran, dan lacak pesanan sampai resi.',
      modules: { prices: true, pricingPage: true, order: 'cart', checkout: 'onsite' },
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
    { package: 'shop',     template: 'grafika', title: 'Toko cetak ala marketplace',       audience: 'Percetakan dengan banyak produk: banner promo, kategori bergambar, pencarian, dan keranjang.' },
    { package: 'ecommerce', template: 'etalase', title: 'Toko online dengan ongkir dan bayar',  audience: 'Percetakan yang ingin pelanggan membayar langsung di website: laci keranjang, ongkir otomatis, VA, QRIS, e-wallet, dan lacak resi.' },
    { package: 'profile',  template: 'compro',  title: 'Profil perusahaan editorial',      audience: 'Usaha yang ingin tampil seperti perusahaan: menu samping tetap, hero layar penuh, layanan sebagai daftar bernomor.' }
  ],

  /* ---------- Template standar ----------
     Tiap template = skin visual (assets/css/templates/<id>.css) + susunan beranda
     bawaan. Tenant mewarisi semuanya dan boleh menimpa sebagian lewat `site`
     pada data tenant (lihat tenants/sinar-copy.js). */
  /* Halaman internal: STRUKTUR TETAP (dikunci platform). Tenant hanya boleh memilih varian daftar di bawah ini,
     lewat site.pages.<halaman>.variant. Bawaan tiap template ada di templates.<id>.pages. */
  pages: {
    services: { variants: ['grid', 'list', 'catalog', 'market', 'rows'] },   // catalog: filter kategori di sisi kiri + kartu di kanan; market: chip kategori berhitung + urutkan
    service:  { variants: ['standard', 'configurator', 'gallery'] },            // configurator: opsi berharga per pilihan, langkah Spesifikasi > Jumlah > Desain, total langsung (hanya paket dengan harga); gallery: galeri gambar besar di kiri + kotak beli menempel di kanan, deskripsi di bawahnya (Etalase)
    blog:     { variants: ['grid', 'list', 'magazine'], pageSize: 3 }, // magazine: artikel utama + kartu + chip kategori berhitung + halaman (pageSize kecil karena data mockup sedikit)
    faq:      { variants: ['accordion', 'help'] },                     // help: pusat bantuan: pencarian besar, pertanyaan populer, kartu topik berhitung
    checkout: { variants: ['standard', 'focus'] }                      // focus: header dan footer diringkas (merek + pembayaran aman) agar pembeli fokus menyelesaikan bayar; hanya paket dengan checkout di website
  },

  templates: {
    classic: {
      name: 'Klasik',
      description: 'Rapi dan netral: hero dua kolom, kartu berbingkai, susunan yang familiar bagi pelanggan.',
      header: 'standard', cardStyle: 'elevated', buttonShape: 'rounded',
      fonts: { heading: 'plus-jakarta-sans', body: 'plus-jakarta-sans' },
      /* Delapan palet menurut segmen klien (pengalih palet demo, assets/js/palette.js). Ilustrasi mengikuti palet: assets/images-classic-<id>/ (tools/recolor.py). */
      imageSet: 'classic',
      defaultPalette: 'navy-oranye',
      palettes: [
        window.PS_PALETTE_BUILD('navy-oranye', 'Navy & Oranye', 'Cetak umum & kantoran', ['#173B63', '#0F2B49', '#F28C28', '#A8550C'], 'Fotocopy, print, dan jilid serba ada'),
        window.PS_PALETTE_BUILD('biru-kuning', 'Biru & Kuning', 'Cetak umum & kantoran', ['#1D5FBF', '#14459A', '#FFC21A', '#7D5600'], 'Rental komputer, ATK, fotocopy kampus'),
        window.PS_PALETTE_BUILD('hijau-oranye', 'Hijau & Oranye', 'Cetak umum & kantoran', ['#17794A', '#0F5A36', '#FF9F1C', '#9A5600'], 'Percetakan buku dan sekolah'),
        window.PS_PALETTE_BUILD('merah-emas', 'Merah & Emas', 'Cetak umum & kantoran', ['#B3261E', '#8A1B15', '#F2B134', '#7A5200'], 'Spanduk, baliho, advertising'),
        window.PS_PALETTE_BUILD('ungu-kuning', 'Ungu & Kuning', 'Kreatif & khusus', ['#5B3FB5', '#43298F', '#FFC21A', '#7A5600'], 'Undangan dan wedding'),
        window.PS_PALETTE_BUILD('teal-koral', 'Teal & Koral', 'Kreatif & khusus', ['#0B7079', '#085960', '#FF7A59', '#B33A1C'], 'Kartu nama dan stationery'),
        window.PS_PALETTE_BUILD('cokelat-emas', 'Cokelat & Emas', 'Kreatif & khusus', ['#6B3F1D', '#4A2A11', '#E8B04B', '#7A5206'], 'Kemasan dan kertas premium'),
        window.PS_PALETTE_BUILD('arang-oranye', 'Arang & Oranye', 'Kreatif & khusus', ['#2F353D', '#1E2329', '#FF8A1F', '#9A4A00'], 'Sablon dan merchandise')
      ],
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
      /* Palet bawaan: Cyan & Magenta (cyan + magenta, warna khas cetak; teks putih di atas accent). Kontras tiap palet dihitung. */
      /* Sepuluh palet (pengalih palet demo, assets/js/palette.js). Palet bawaan = pilihan awal template; ilustrasi mengikuti palet: assets/images-modern-<id>/ (tools/recolor.py).
         Laravel: palet = warna di settings; pengalih ini hanya demo. */
      imageSet: 'modern',
      defaultPalette: 'cyan-magenta',
      palettes: [
        window.PS_PALETTE_BUILD('cyan-magenta', 'Cyan & Magenta', 'Cerah & segar', ['#0877C4', '#065E9C', '#DB0076', '#B3005F'], 'Perusahaan kreatif dan ramah', '#FFFFFF'),
        window.PS_PALETTE_BUILD('biru-oranye', 'Biru & Oranye', 'Cerah & segar', ['#0877C4', '#065E9C', '#FF8A1F', '#9A4A00'], 'Jasa umum, hangat dan terpercaya'),
        window.PS_PALETTE_BUILD('tosca-pink', 'Tosca & Pink', 'Cerah & segar', ['#088084', '#066266', '#FF5C9E', '#B3125C'], 'Studio, kafe, gaya hidup'),
        window.PS_PALETTE_BUILD('ungu-kuning', 'Ungu & Kuning', 'Cerah & segar', ['#6D3BE0', '#5226B8', '#FFC21A', '#7D5600'], 'Agensi, event, kreatif'),
        window.PS_PALETTE_BUILD('hijau-koral', 'Hijau & Koral', 'Cerah & segar', ['#0B7F45', '#07602F', '#FF6F59', '#B8341F'], 'Organik, makanan, ramah lingkungan'),
        window.PS_PALETTE_BUILD('indigo-mint', 'Indigo & Mint', 'Cerah & segar', ['#3B4FE0', '#2A39B3', '#2EE6A6', '#066B4A'], 'Teknologi dan startup'),
        window.PS_PALETTE_BUILD('koral-teal', 'Koral & Teal', 'Lembut & elegan', ['#D13A23', '#A32A18', '#14C8B0', '#07705F'], 'Kuliner dan perhotelan'),
        window.PS_PALETTE_BUILD('magenta-cyan', 'Magenta & Cyan', 'Lembut & elegan', ['#C2185B', '#8E1146', '#22B8E8', '#0B6485'], 'Fashion dan kecantikan'),
        window.PS_PALETTE_BUILD('biru-lime', 'Biru Langit & Lime', 'Lembut & elegan', ['#0A74C9', '#075A9C', '#B8E62E', '#4F6B00'], 'Olahraga dan komunitas'),
        window.PS_PALETTE_BUILD('teal-oranye', 'Teal & Oranye', 'Lembut & elegan', ['#0C7C86', '#085C64', '#FF9F1C', '#9A5600'], 'Kesehatan dan pendidikan')
      ],
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
      /* Sepuluh palet (pengalih palet demo, assets/js/palette.js). Palet bawaan = pilihan awal template; ilustrasi mengikuti palet: assets/images-bold-<id>/ (tools/recolor.py).
         Laravel: palet = warna di settings; pengalih ini hanya demo. */
      imageSet: 'bold',
      defaultPalette: 'biru-lime',
      palettes: [
        window.PS_PALETTE_BUILD('biru-lime', 'Biru Royal & Lime', 'Tegas & klasik', ['#2243D6', '#16309E', '#C6F432', '#4F6B00'], 'Percetakan yang kuat dan modern'),
        window.PS_PALETTE_BUILD('hitam-kuning', 'Hitam & Kuning', 'Tegas & klasik', ['#1F2328', '#101317', '#FFD60A', '#6B5600'], 'Industri, konstruksi, otomotif'),
        window.PS_PALETTE_BUILD('merah-kuning', 'Merah & Kuning', 'Tegas & klasik', ['#D00F2B', '#9E0A20', '#FFD23F', '#7A5A00'], 'Promo, spanduk, advertising'),
        window.PS_PALETTE_BUILD('oranye-kuning', 'Oranye Tua & Kuning', 'Tegas & klasik', ['#BA4A08', '#933A05', '#FFD23F', '#7A5A00'], 'Sablon, kaos, merchandise'),
        window.PS_PALETTE_BUILD('hijau-neon', 'Hijau & Neon', 'Tegas & klasik', ['#0B7A3E', '#07592D', '#B6FF3B', '#3F6B00'], 'Olahraga dan energi'),
        window.PS_PALETTE_BUILD('ungu-pink', 'Ungu & Pink Neon', 'Neon & energik', ['#5B21B6', '#3F1580', '#FF3DA1', '#B30C66'], 'Musik, event, anak muda'),
        window.PS_PALETTE_BUILD('navy-cyan', 'Navy & Cyan', 'Neon & energik', ['#0B3D91', '#072A66', '#22E0F0', '#006B78'], 'Teknologi dan digital'),
        window.PS_PALETTE_BUILD('magenta-kuning', 'Magenta & Kuning', 'Neon & energik', ['#B0136B', '#850C50', '#FFE14D', '#7A6200'], 'Fashion dan hiburan'),
        window.PS_PALETTE_BUILD('teal-oranye', 'Teal & Oranye', 'Neon & energik', ['#0A7F7A', '#065A56', '#FF7A1A', '#9A4000'], 'Kuliner dan wisata'),
        window.PS_PALETTE_BUILD('abu-merah', 'Abu Arang & Merah', 'Neon & energik', ['#2B2F36', '#171A1F', '#FF3B3B', '#B3121A'], 'Otomotif dan gaming')
      ],
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
      /* Delapan palet untuk segmen calon klien B2B (pengalih palet demo, assets/js/palette.js). Ilustrasi mengikuti palet:
         assets/images-katalog-<id>/ (tools/recolor.py). Laravel: palet = warna di settings; pengalih ini hanya demo. */
      imageSet: 'katalog',
      defaultPalette: 'navy-oranye',
      palettes: [
        window.PS_PALETTE_BUILD('navy-oranye',   'Navy & Oranye',       'Korporat & instansi',     ['#173B63', '#0F2B49', '#F28C28', '#A8550C'], 'Perusahaan umum, distributor, kontraktor'),
        window.PS_PALETTE_BUILD('biru-cyan',     'Biru Royal & Cyan',   'Korporat & instansi',     ['#0B4FA8', '#073A7D', '#22B8E8', '#0B6485'], 'Teknologi, telekomunikasi, startup'),
        window.PS_PALETTE_BUILD('maroon-emas',   'Maroon & Emas',       'Korporat & instansi',     ['#8A1C2B', '#651320', '#E8B04B', '#7A5206'], 'Kampus, yayasan, instansi, hukum'),
        window.PS_PALETTE_BUILD('slate-teal',    'Slate & Teal',        'Korporat & instansi',     ['#2C4A5E', '#1D3443', '#2EC4B6', '#0B6B63'], 'Konsultan, perbankan, jasa profesional'),
        window.PS_PALETTE_BUILD('arang-kuning',  'Arang & Kuning',      'Industri, niaga & jasa',  ['#2B3138', '#1B2025', '#FFC400', '#6B5200'], 'Manufaktur, logistik, pabrik, kemasan'),
        window.PS_PALETTE_BUILD('hijau-emas',    'Hijau Hutan & Emas',  'Industri, niaga & jasa',  ['#1B5E43', '#124530', '#E3B23C', '#7A5A08'], 'Properti, perkebunan, koperasi'),
        window.PS_PALETTE_BUILD('teal-koral',    'Teal & Koral',        'Industri, niaga & jasa',  ['#0E6B72', '#094E54', '#FF7A59', '#B33A1C'], 'Rumah sakit, klinik, farmasi'),
        window.PS_PALETTE_BUILD('indigo-oranye', 'Indigo & Oranye',     'Industri, niaga & jasa',  ['#3F2A7D', '#2D1D5C', '#FF9A3D', '#9A4E00'], 'Event organizer, agensi, sekolah swasta')
      ],
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
      /* Delapan palet menurut segmen klien (pengalih palet demo, assets/js/palette.js). Ilustrasi mengikuti palet: assets/images-toko-<id>/ (tools/recolor.py). */
      imageSet: 'toko',
      defaultPalette: 'navy-oranye',
      palettes: [
        window.PS_PALETTE_BUILD('navy-oranye', 'Navy & Oranye', 'Toko umum & kantor', ['#173B63', '#0F2B49', '#F28C28', '#A8550C'], 'Toko cetak serba ada'),
        window.PS_PALETTE_BUILD('biru-kuning', 'Biru & Kuning', 'Toko umum & kantor', ['#1456C9', '#0F3F96', '#FFC21A', '#7D5600'], 'Cetak online cepat'),
        window.PS_PALETTE_BUILD('hijau-oranye', 'Hijau & Oranye', 'Toko umum & kantor', ['#0F7A44', '#0C5F37', '#FF8A1F', '#9A4A00'], 'ATK dan perlengkapan kantor'),
        window.PS_PALETTE_BUILD('merah-kuning', 'Merah & Kuning', 'Toko umum & kantor', ['#C62828', '#9B1C1C', '#FFC21A', '#7D5600'], 'Promo, diskon, cetak kilat'),
        window.PS_PALETTE_BUILD('magenta-emas', 'Magenta & Emas', 'Kreatif & hadiah', ['#C2185B', '#8E1146', '#FFB300', '#7A5200'], 'Souvenir dan kado'),
        window.PS_PALETTE_BUILD('ungu-oranye', 'Ungu & Oranye', 'Kreatif & hadiah', ['#5E35B1', '#45258A', '#FF9F1C', '#9A5600'], 'Merchandise dan cetak kustom'),
        window.PS_PALETTE_BUILD('teal-koral', 'Teal & Koral', 'Kreatif & hadiah', ['#0B7079', '#085960', '#FF7A59', '#B33A1C'], 'Stiker dan label'),
        window.PS_PALETTE_BUILD('arang-kuning', 'Arang & Kuning', 'Kreatif & hadiah', ['#2B3138', '#1B2025', '#FFC400', '#6B5200'], 'Sablon dan kaos')
      ],
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
      /* Sepuluh palet yang bisa dicoba di demo lewat pengalih palet (assets/js/palette.js). Ilustrasi mengikuti palet:
         assets/images-grafika-<id>/ (tools/recolor.py). Laravel: palet = warna di settings; pengalih ini hanya demo. */
      imageSet: 'grafika',
      defaultPalette: 'biru-langit',
      palettes: [
        window.PS_PALETTE_BUILD('biru-langit',   'Biru Langit & Kuning',    'Biru cerah', ['#1A6FEB', '#1252B3', '#FFC21A', '#7D5600']),
        window.PS_PALETTE_BUILD('biru-elektrik', 'Biru Elektrik & Oranye',  'Biru cerah', ['#0B5FFF', '#0840B8', '#FF8A1F', '#9A4A00']),
        window.PS_PALETTE_BUILD('biru-koral',    'Biru Cerah & Koral',      'Biru cerah', ['#1B74D8', '#1357A6', '#FF6F59', '#B8341F']),
        window.PS_PALETTE_BUILD('biru-mint',     'Biru Es & Mint',          'Biru cerah', ['#0F6FDE', '#0B52A8', '#2EE6A6', '#066B4A']),
        window.PS_PALETTE_BUILD('biru-pink',     'Biru Cerah & Pink',       'Biru cerah', ['#1D6BF0', '#1450B6', '#FF5C9E', '#B3125C']),
        window.PS_PALETTE_BUILD('jingga-kuning', 'Jingga Pasar & Kuning',   'Warna lain', ['#D5351B', '#A82813', '#FFC21A', '#7D5600']),
        window.PS_PALETTE_BUILD('hijau-kuning',  'Hijau Segar & Kuning',    'Warna lain', ['#09843F', '#066633', '#FFB300', '#7A5200']),
        window.PS_PALETTE_BUILD('tosca-koral',   'Tosca & Koral',           'Warna lain', ['#087F7F', '#056060', '#FF6F59', '#B8341F']),
        window.PS_PALETTE_BUILD('violet-oranye', 'Violet & Oranye',         'Warna lain', ['#7A3FE4', '#5A27B5', '#FF9F1C', '#9A5600']),
        window.PS_PALETTE_BUILD('raspberry-tosca', 'Raspberry & Tosca',     'Warna lain', ['#D01B5E', '#A01048', '#14C8B0', '#07705F'])
      ],
      pages: { services: 'market', service: 'configurator', blog: 'magazine', faq: 'help' },
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
    },
    compro: {
      name: 'Compro',
      description: 'Profil perusahaan editorial: menu samping tetap, hero layar penuh, angka besar, layanan sebagai daftar bernomor, tanpa kartu.',
      header: 'rail', cardStyle: 'flat', buttonShape: 'square',
      fonts: { heading: 'raleway', body: 'source-sans-3' },
      /* Delapan palet menurut segmen klien (pengalih palet demo, assets/js/palette.js). Ilustrasi mengikuti palet: assets/images-compro-<id>/ (tools/recolor.py). */
      imageSet: 'compro',
      defaultPalette: 'navy-oranye',
      palettes: [
        window.PS_PALETTE_BUILD('navy-oranye', 'Navy & Oranye', 'Perusahaan & jasa', ['#173B63', '#0F2B49', '#F28C28', '#A8550C'], 'Perusahaan umum dan kontraktor'),
        window.PS_PALETTE_BUILD('biru-cyan', 'Biru Royal & Cyan', 'Perusahaan & jasa', ['#0B4FA8', '#073A7D', '#22B8E8', '#0B6485'], 'Teknologi dan telekomunikasi'),
        window.PS_PALETTE_BUILD('slate-teal', 'Slate & Teal', 'Perusahaan & jasa', ['#2C4A5E', '#1D3443', '#2EC4B6', '#0B6B63'], 'Konsultan dan jasa profesional'),
        window.PS_PALETTE_BUILD('indigo-oranye', 'Indigo & Oranye', 'Perusahaan & jasa', ['#3F2A7D', '#2D1D5C', '#FF9A3D', '#9A4E00'], 'Agensi dan media'),
        window.PS_PALETTE_BUILD('hijau-emas', 'Hijau Hutan & Emas', 'Industri & institusi', ['#1B5E43', '#124530', '#E3B23C', '#7A5A08'], 'Agribisnis, properti, lingkungan'),
        window.PS_PALETTE_BUILD('maroon-emas', 'Maroon & Emas', 'Industri & institusi', ['#8A1C2B', '#651320', '#E8B04B', '#7A5206'], 'Yayasan, kampus, hukum'),
        window.PS_PALETTE_BUILD('arang-kuning', 'Arang & Kuning', 'Industri & institusi', ['#2B3138', '#1B2025', '#FFC400', '#6B5200'], 'Manufaktur dan konstruksi'),
        window.PS_PALETTE_BUILD('cokelat-emas', 'Cokelat & Emas', 'Industri & institusi', ['#6B3F1D', '#4A2A11', '#E8B04B', '#7A5206'], 'Perhotelan, furnitur, kriya')
      ],
      pages: { services: 'rows' },
      home: [
        { id: 'hero', variant: 'fullbleed' },
        { id: 'stats', variant: 'band' },
        { id: 'about', variant: 'story' },
        { id: 'services', variant: 'rows', limit: 6 },
        { id: 'why', variant: 'numbered' },
        { id: 'steps', variant: 'timeline' },
        { id: 'portfolio', variant: 'grid', limit: 6 },
        { id: 'testimonials', variant: 'slider' },
        { id: 'faq', variant: 'columns' },
        { id: 'location', variant: 'split' },
        { id: 'cta', variant: 'strip' }
      ]
    },
    etalase: {
      name: 'Etalase',
      description: 'Butik online: merek di tengah, laci keranjang geser, hero berubin, kategori bulat bergambar, galeri produk dengan kotak beli menempel, dan checkout fokus.',
      header: 'boutique', cardStyle: 'outlined', buttonShape: 'pill',
      fonts: { heading: 'work-sans', body: 'nunito' },
      /* Delapan palet menurut segmen klien (pengalih palet demo, assets/js/palette.js). Ilustrasi mengikuti palet: assets/images-etalase-<id>/ (tools/recolor.py). */
      imageSet: 'etalase',
      defaultPalette: 'navy-oranye',
      palettes: [
        window.PS_PALETTE_BUILD('navy-oranye', 'Navy & Oranye', 'Butik umum', ['#173B63', '#0F2B49', '#F28C28', '#A8550C'], 'Butik cetak serba ada'),
        window.PS_PALETTE_BUILD('mawar-peach', 'Mawar & Peach', 'Butik umum', ['#9B2C4A', '#741F37', '#F2B6A0', '#8A3B1F'], 'Undangan, wedding, hadiah'),
        window.PS_PALETTE_BUILD('sage-emas', 'Sage & Emas', 'Butik umum', ['#2F6B57', '#1F4D3E', '#E9C46A', '#7A5A08'], 'Kemasan ramah lingkungan'),
        window.PS_PALETTE_BUILD('terakota-emas', 'Terakota & Emas', 'Butik umum', ['#B5482A', '#8C3418', '#F4C95D', '#7A5206'], 'Kerajinan, kopi, UMKM lokal'),
        window.PS_PALETTE_BUILD('lilac-pink', 'Lilac & Pink', 'Gaya khusus', ['#6A3FB5', '#4E2A8C', '#F5A3C7', '#A3185F'], 'Fashion, kado, merchandise'),
        window.PS_PALETTE_BUILD('biru-koral', 'Biru Es & Koral', 'Gaya khusus', ['#1F6FB5', '#16508A', '#FF8A7A', '#B33A2B'], 'Stationery modern'),
        window.PS_PALETTE_BUILD('hitam-emas', 'Hitam & Emas', 'Gaya khusus', ['#1F2328', '#12151A', '#D4A93A', '#7A5A08'], 'Premium dan eksklusif'),
        window.PS_PALETTE_BUILD('teal-mint', 'Teal & Mint', 'Gaya khusus', ['#0F766E', '#0A5650', '#7EE0C3', '#0A6B50'], 'Kesehatan dan organik')
      ],
      pages: { services: 'market', service: 'gallery', checkout: 'focus', blog: 'grid' },
      home: [
        { id: 'hero', variant: 'tiles' },
        { id: 'trust', variant: 'bar' },
        { id: 'categories', variant: 'circles' },
        { id: 'services', variant: 'grid', limit: 8 },
        { id: 'promo', variant: 'tiles' },
        { id: 'why', variant: 'grid' },
        { id: 'steps', variant: 'cards' },
        { id: 'testimonials', variant: 'slider' },
        { id: 'faq', variant: 'columns' },
        { id: 'cta', variant: 'card' }
      ]
    }
  }
};
