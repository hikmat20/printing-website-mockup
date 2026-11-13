/*
 * tenants/sinar-copy.js — DATA TENANT (diedit/dimiliki satu client)
 * ---------------------------------------------------------------------------
 * Berisi profil bisnis, branding (tema), pilihan template, dan seluruh konten
 * milik satu tenant. Mengganti file ini = mengganti tenant.
 * Pemetaan ke Laravel (saran):
 *   tenant        -> tabel tenants (+ tenant_settings)
 *   theme         -> kolom/JSON branding pada tenants
 *   categories    -> service_categories
 *   services      -> services (+ service_options, service_prices, service_faqs)
 *   portfolio     -> portfolio_items
 *   testimonials  -> testimonials
 *   faqs          -> faqs (group = faq_groups)
 *   articles      -> articles (+ article_categories)
 */
window.TENANTS = window.TENANTS || {};
window.TENANTS['sinar-copy'] = {

  /* ---------- Profil bisnis ---------- */
  tenant: {
    name: 'Sinar Copy & Printing',
    shortName: 'Sinar Copy',
    tagline: 'Solusi Lengkap Kebutuhan Cetak Anda',
    domain: 'https://www.sinarcopy.example',
    logo: 'assets/images/logo/logo-mark.svg',
    logoLight: 'assets/images/logo/logo-mark-white.svg',
    phone: '6281234567890',
    phoneDisplay: '0812-3456-7890',
    whatsapp: '6281234567890',          // format internasional tanpa "+" (untuk wa.me)
    email: 'info@example.com',
    address: 'Jl. Raya Bekasi Km 18 No. 27, Pulogadung, Jakarta Timur 13920',
    addressParts: { street: 'Jl. Raya Bekasi Km 18 No. 27, Pulogadung', locality: 'Jakarta Timur', region: 'DKI Jakarta', postalCode: '13920', country: 'ID' },
    city: 'Jakarta Timur',
    geo: { lat: -6.1844, lng: 106.9097 },
    hoursSummary: '08.00–21.00',
    hours: [
      { day: 'Senin – Sabtu', time: '08.00 – 21.00', days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'], opens: '08:00', closes: '21:00' },
      { day: 'Minggu', time: '09.00 – 17.00', days: ['Sunday'], opens: '09:00', closes: '17:00' }
    ],
    mapEmbed: 'https://www.google.com/maps?q=Pulogadung,+Jakarta+Timur&output=embed',
    mapLink: 'https://www.google.com/maps/search/?api=1&query=Pulogadung+Jakarta+Timur',
    since: 2012,
    social: [
      { icon: 'instagram', label: 'Instagram', href: 'https://instagram.com/' },
      { icon: 'facebook', label: 'Facebook', href: 'https://facebook.com/' },
      { icon: 'youtube', label: 'YouTube', href: 'https://youtube.com/' }
    ],
    hero: {
      eyebrow: 'Percetakan & Fotocopy Terpercaya di Jakarta Timur',
      headline: 'Semua Kebutuhan Cetak Anda, Satu Tempat.',
      subheadline: 'Melayani fotocopy, print dokumen, cetak ukuran besar, jilid buku, laminating, dan berbagai kebutuhan percetakan lainnya dengan hasil berkualitas dan harga bersahabat.',
      actions: {
        primary:   { label: 'Lihat Layanan', route: 'services', icon: 'layout-grid' },
        secondary: { label: 'Pesan Sekarang', icon: 'message-circle', message: 'Halo, saya ingin memesan layanan cetak. Mohon informasi lebih lanjut.' }
      },
      image: 'assets/images/general/hero.svg',
      imageAlt: 'Ilustrasi mesin cetak dengan dokumen, kartu nama, dan brosur hasil cetak',
      points: ['Hasil cetak tajam & rapi', 'Harga jelas, tanpa biaya tersembunyi', 'Pesan cukup lewat WhatsApp'],
      chips: [
        { icon: 'timer', title: 'Selesai ± 30 menit', text: 'Print hingga 50 lembar' },
        { icon: 'tag', title: 'Mulai Rp 250', text: 'Fotocopy per lembar' }
      ]
    },
    cta: {
      title: 'Siap Mencetak? Pesan Lewat WhatsApp Sekarang',
      text: 'Kirim file dan kebutuhan Anda. Kami balas dengan rincian harga dan estimasi selesai, biasanya dalam hitungan menit.',
      button: 'Chat WhatsApp Sekarang'
    },
    about: {
      title: 'Mitra Cetak Warga Jakarta Timur Sejak 2012',
      text: [
        'Sinar Copy & Printing berawal dari satu mesin fotocopy kecil di depan kampus. Kini kami melayani pelajar, kantor, dan pelaku UMKM dengan layanan cetak lengkap, dari lembar tugas sampai spanduk acara.',
        'Kami percaya hasil cetak yang baik dimulai dari komunikasi yang jelas: spesifikasi dikonfirmasi di awal, harga disebutkan sebelum dikerjakan, dan pesanan selesai sesuai janji.'
      ],
      image: 'assets/images/general/tempat-usaha.svg',
      imageAlt: 'Tampak depan toko Sinar Copy & Printing',
      highlights: ['Berpengalaman lebih dari 13 tahun', 'Mesin cetak digital terawat', 'Tim desain siap membantu']
    },
    whyMedia: {
      image: 'assets/images/general/ruang-produksi.svg',
      alt: 'Dua mesin cetak digital di ruang produksi'
    },
    stats: [
      { value: '13+', label: 'Tahun melayani' },
      { value: '25rb+', label: 'Pesanan selesai' },
      { value: '4,9/5', label: 'Rating pelanggan' },
      { value: '1 jam', label: 'Pesanan kilat tersedia' }
    ],
    seo: {
      defaultTitleSuffix: 'Sinar Copy & Printing Jakarta Timur',
      defaultDescription: 'Fotocopy, print dokumen, cetak banner, jilid, laminating, dan percetakan lengkap di Jakarta Timur. Harga jelas, pesan lewat WhatsApp.',
      ogImage: 'assets/images/general/hero.svg',
      locale: 'id_ID',
      priceRange: 'Rp',
      /* Judul & deskripsi per halaman (Laravel: tabel seo_metadata per tenant + halaman) */
      pages: {
        home: {
          title: 'Fotocopy, Print & Percetakan Jakarta Timur | Sinar Copy & Printing',
          description: 'Fotocopy, print dokumen, cetak banner, jilid skripsi, laminating, dan percetakan lengkap di Jakarta Timur. Harga jelas, hasil rapi, pesan mudah lewat WhatsApp.',
          ogDescription: 'Semua kebutuhan cetak Anda, satu tempat. Fotocopy, print, banner, jilid, dan laminating dengan harga bersahabat.'
        }
      }
    }
  },

  /* ---------- Tema (branding per tenant) ---------- */
  theme: {
    primary: '#173B63',
    primaryDark: '#0F2B49',
    primaryLight: '#E8EEF5',
    accent: '#F28C28',
    accentDark: '#D9741A',
    whatsapp: '#25D366',
    whatsappDark: '#1DA851',
    surface: '#F5F7FA',
    text: '#252B35',
    muted: '#5B6675',
    /* Turunan warna — opsional. Bila dikosongkan, dihitung otomatis dari primary/accent. */
    primaryTint: '#F3F7FC',
    accentTint: '#FFF1E0',
    onDarkSoft: '#D6E2F0',
    onDarkMuted: '#B9CBE0',
    onDarkFaint: '#9DB4CF',
    overlay: '#0A1C30'
    /* Opsional (harus ada di PLATFORM.fonts): fontHeading, fontBody — bila kosong ikut template.
       Kunci turunan di atas (primaryDark … overlay) menimpa hasil hitungan otomatis: hapus untuk tenant baru agar ikut primary/accent. */
  },

  /* ---------- Pengaturan tampilan tenant (Controlled Customization) ----------
     Semua opsional. Yang tidak diisi mengikuti template standar.
     Nilai harus ada di registri platform (PLATFORM.templates/sections/headers/...),
     jika tidak, otomatis kembali ke default template.
     Laravel: kolom JSON `settings` pada tabel tenants.
     Contoh penyesuaian:
       header: 'topbar', cardStyle: 'outlined', buttonShape: 'pill',
       order: ['services', 'categories', 'about'],             // urutan section yang tidak terkunci
       sections: { faq: { enabled: false }, services: { variant: 'slider', limit: 8 } } */
  site: {
    template: 'classic'
  },

  /* ---------- Teks section beranda (milik tenant) ---------- */
  homeText: {
    trust:        { title: 'Keunggulan kami' },
    categories:   { eyebrow: 'Kategori Layanan', title: 'Cari Layanan Sesuai Kebutuhan', text: 'Dari lembar tugas sampai spanduk acara, pilih kategori yang Anda butuhkan.' },
    services:     { eyebrow: 'Layanan Unggulan', title: 'Layanan yang Paling Sering Dipesan', text: 'Harga jelas dan bisa dipesan langsung lewat WhatsApp.', cta: { label: 'Lihat Semua Layanan', route: 'services' } },
    about:        { eyebrow: 'Tentang Kami', cta: { label: 'Selengkapnya', route: 'about' } },
    why:          { eyebrow: 'Mengapa Memilih Kami', title: 'Hasil Rapi, Harga Jelas, Pengerjaan Cepat' },
    portfolio:    { eyebrow: 'Portofolio', title: 'Hasil Pekerjaan Kami', text: 'Beberapa pesanan yang sudah kami selesaikan. Klik gambar untuk memperbesar.', cta: { label: 'Lihat Semua Portofolio', route: 'portfolio' } },
    steps:        { eyebrow: 'Cara Pemesanan', title: 'Pesan Cetak dalam 4 Langkah Mudah', text: 'Tidak perlu antre. Cukup kirim kebutuhan Anda lewat WhatsApp.' },
    testimonials: { eyebrow: 'Testimoni', title: 'Kata Pelanggan Kami', text: 'Pelajar, guru, kantor, dan pelaku UMKM sudah mempercayakan kebutuhan cetak mereka kepada kami.' },
    faq:          { eyebrow: 'FAQ', title: 'Pertanyaan yang Sering Diajukan', cta: { label: 'Lihat semua pertanyaan', route: 'faq' } },
    location:     { eyebrow: 'Lokasi', title: 'Kunjungi Toko Kami', text: 'Datang langsung untuk konsultasi, cek contoh kertas, atau ambil pesanan.' }
  },

  /* ---------- Keunggulan singkat (trust bar) ---------- */
  trust: [
    { icon: 'zap', title: 'Cepat & Tepat Waktu', text: 'Pesanan ringan selesai dalam hitungan jam.' },
    { icon: 'badge-check', title: 'Hasil Rapi & Tajam', text: 'Mesin digital terawat dengan kontrol kualitas.' },
    { icon: 'wallet', title: 'Harga Jelas', text: 'Daftar harga terbuka, tanpa biaya tersembunyi.' },
    { icon: 'message-circle', title: 'Pesan via WhatsApp', text: 'Kirim file, konfirmasi harga, langsung dikerjakan.' }
  ],

  /* ---------- Kategori layanan ---------- */
  categories: [
    { slug: 'fotocopy-print', name: 'Fotocopy & Print Dokumen', icon: 'files', description: 'Fotocopy, print A4, F4, dan A3 untuk tugas, laporan, dan berkas kantor.' },
    { slug: 'large-format',   name: 'Large Format',            icon: 'ruler', description: 'Cetak ukuran besar A2, A1, A0, plus banner dan spanduk.' },
    { slug: 'finishing',      name: 'Jilid & Laminating',      icon: 'book-open-check', description: 'Jilid skripsi, laporan, dan laminating dokumen penting.' },
    { slug: 'digital-printing', name: 'Digital Printing',      icon: 'palette', description: 'Cetak full color untuk sticker, poster, dan materi visual.' },
    { slug: 'media-promosi',  name: 'Brosur & Kartu Nama',     icon: 'megaphone', description: 'Materi promosi untuk usaha: brosur, flyer, dan kartu nama.' },
    { slug: 'buku-undangan',  name: 'Buku & Undangan',         icon: 'book-marked', description: 'Cetak buku, buku acara, dan undangan dengan berbagai pilihan kertas.' }
  ],

  /* ---------- Layanan ---------- */
  services: [
    {
      slug: 'fotocopy', name: 'Fotocopy', category: 'fotocopy-print', featured: true,
      image: 'assets/images/services/fotocopy.svg', imageAlt: 'Mesin fotocopy dengan tumpukan kertas hasil salinan',
      short: 'Fotocopy hitam putih dan berwarna, ukuran A4, F4, dan A3. Cepat dan bersih.',
      description: 'Layanan fotocopy hitam putih dan berwarna untuk dokumen, buku, dan berkas penting. Mesin kami dirawat rutin sehingga hasil salinan bersih tanpa garis, dengan pilihan perbesar atau perkecil sesuai kebutuhan.',
      priceFrom: 250, unit: 'lembar', eta: 'Langsung jadi (≤ 100 lembar)',
      specs: [{ label: 'Ukuran kertas', value: 'A4, F4, A3' }, { label: 'Warna', value: 'Hitam putih & berwarna' }, { label: 'Kertas standar', value: 'HVS 70 gsm' }, { label: 'Fitur', value: 'Perbesar/perkecil, 2 sisi' }],
      options: [
        { label: 'Ukuran', choices: ['A4', 'F4', 'A3'] },
        { label: 'Warna', choices: ['Hitam putih', 'Berwarna'] },
        { label: 'Sisi', choices: ['Satu sisi', 'Dua sisi'] }
      ],
      pricing: [
        { spec: 'A4 hitam putih, 1–100 lembar', unit: 'lembar', price: 250, note: '' },
        { spec: 'A4 hitam putih, di atas 100 lembar', unit: 'lembar', price: 200, note: 'Harga grosir' },
        { spec: 'F4 hitam putih', unit: 'lembar', price: 300, note: '' },
        { spec: 'A3 hitam putih', unit: 'lembar', price: 1000, note: '' },
        { spec: 'A4 berwarna', unit: 'lembar', price: 1500, note: 'Warna penuh' }
      ],
      faqs: [
        { q: 'Apakah bisa fotocopy dua sisi?', a: 'Bisa. Pilih opsi dua sisi saat memesan. Harga dihitung per lembar kertas.' },
        { q: 'Apakah bisa memperbesar atau memperkecil?', a: 'Bisa. Sebutkan persentase atau ukuran tujuan, misalnya A4 ke A3.' }
      ],
      related: ['print-a4', 'jilid-buku', 'laminating']
    },
    {
      slug: 'print-a4', name: 'Print Dokumen A4', category: 'fotocopy-print', featured: true,
      image: 'assets/images/services/print-a4.svg', imageAlt: 'Printer mencetak dokumen A4',
      short: 'Print dokumen, tugas, dan laporan A4/F4 dari file. Kirim lewat WhatsApp atau email.',
      description: 'Print dokumen A4 dan F4 dari file PDF, Word, atau Excel. Cocok untuk tugas sekolah, skripsi, laporan kantor, dan berkas administrasi. Kami cek tata letak sebelum dicetak supaya tidak ada halaman yang terpotong.',
      priceFrom: 500, unit: 'lembar', eta: '10–30 menit (≤ 50 lembar)',
      specs: [{ label: 'Ukuran kertas', value: 'A4, F4' }, { label: 'Format file', value: 'PDF, DOCX, XLSX, JPG' }, { label: 'Jenis kertas', value: 'HVS 70/80 gsm' }, { label: 'Warna', value: 'Hitam putih & berwarna' }],
      options: [
        { label: 'Ukuran', choices: ['A4', 'F4'] },
        { label: 'Warna', choices: ['Hitam putih', 'Berwarna'] },
        { label: 'Sisi', choices: ['Satu sisi', 'Dua sisi'] },
        { label: 'Kertas', choices: ['HVS 70 gsm', 'HVS 80 gsm'] }
      ],
      pricing: [
        { spec: 'A4 hitam putih (teks)', unit: 'lembar', price: 500, note: 'HVS 70 gsm' },
        { spec: 'A4 hitam putih (gambar padat)', unit: 'lembar', price: 800, note: '' },
        { spec: 'A4 berwarna (teks & grafik)', unit: 'lembar', price: 1500, note: '' },
        { spec: 'A4 berwarna (foto/penuh)', unit: 'lembar', price: 2500, note: '' },
        { spec: 'F4 hitam putih', unit: 'lembar', price: 600, note: '' }
      ],
      faqs: [
        { q: 'Bagaimana cara mengirim file?', a: 'Kirim lewat WhatsApp atau email. Sebutkan jumlah halaman, ukuran, dan warna yang diinginkan.' },
        { q: 'Apakah bisa print dua sisi (bolak-balik)?', a: 'Bisa. Harga dihitung per sisi, jadi cetak bolak-balik dihitung dua sisi.' },
        { q: 'Berapa lama pengerjaan?', a: 'Untuk 50 lembar atau kurang, biasanya selesai dalam 10–30 menit.' }
      ],
      related: ['fotocopy', 'print-a3', 'jilid-buku', 'laminating']
    },
    {
      slug: 'print-a3', name: 'Print Dokumen A3', category: 'fotocopy-print', featured: false,
      image: 'assets/images/services/print-a3.svg', imageAlt: 'Mesin print yang mencetak dokumen ukuran A3',
      short: 'Print A3 untuk gambar teknik, poster kecil, denah, dan presentasi.',
      description: 'Print ukuran A3 untuk gambar teknik, poster kelas, denah, dan materi presentasi. Warna konsisten dan garis tipis tetap tajam.',
      priceFrom: 3000, unit: 'lembar', eta: '15–45 menit',
      specs: [{ label: 'Ukuran kertas', value: 'A3, A3+' }, { label: 'Warna', value: 'Hitam putih & berwarna' }, { label: 'Kertas', value: 'HVS 80 gsm, Art Paper 120 gsm' }],
      options: [
        { label: 'Warna', choices: ['Hitam putih', 'Berwarna'] },
        { label: 'Kertas', choices: ['HVS 80 gsm', 'Art Paper 120 gsm'] }
      ],
      pricing: [
        { spec: 'A3 hitam putih', unit: 'lembar', price: 3000, note: '' },
        { spec: 'A3 berwarna', unit: 'lembar', price: 6000, note: 'HVS 80 gsm' },
        { spec: 'A3 berwarna Art Paper 120 gsm', unit: 'lembar', price: 9000, note: '' }
      ],
      faqs: [{ q: 'Apakah garis tipis gambar teknik tetap tampil?', a: 'Ya. Kirim file dalam PDF agar ketebalan garis terjaga.' }],
      related: ['print-a4', 'print-a0', 'digital-printing']
    },
    {
      slug: 'print-a0', name: 'Print Large Format A2–A0', category: 'large-format', featured: true,
      image: 'assets/images/services/print-a0.svg', imageAlt: 'Plotter yang mencetak gambar teknik ukuran besar',
      short: 'Cetak ukuran besar A2, A1, dan A0 untuk gambar teknik, poster, dan peta.',
      description: 'Cetak ukuran besar menggunakan plotter, cocok untuk gambar arsitektur, denah, poster ilmiah, dan peta. Tersedia kertas plotter dan photo paper dengan garis yang presisi.',
      priceFrom: 15000, unit: 'lembar', eta: '1 hari kerja',
      specs: [{ label: 'Ukuran', value: 'A2, A1, A0' }, { label: 'Kertas', value: 'Plotter 80 gsm, Photo Paper' }, { label: 'Format file', value: 'PDF, DWG (diekspor ke PDF), JPG' }, { label: 'Warna', value: 'Hitam putih & berwarna' }],
      options: [
        { label: 'Ukuran', choices: ['A2', 'A1', 'A0'] },
        { label: 'Warna', choices: ['Hitam putih', 'Berwarna'] },
        { label: 'Bahan', choices: ['Kertas plotter', 'Photo paper'] }
      ],
      pricing: [
        { spec: 'A2 hitam putih, kertas plotter', unit: 'lembar', price: 15000, note: '' },
        { spec: 'A1 hitam putih, kertas plotter', unit: 'lembar', price: 25000, note: '' },
        { spec: 'A0 hitam putih, kertas plotter', unit: 'lembar', price: 45000, note: '' },
        { spec: 'A1 berwarna, photo paper', unit: 'lembar', price: 95000, note: '' },
        { spec: 'A0 berwarna, photo paper', unit: 'lembar', price: 165000, note: '' }
      ],
      faqs: [
        { q: 'Apakah bisa mencetak file AutoCAD langsung?', a: 'Kami menyarankan ekspor ke PDF dengan skala yang benar agar hasil sesuai ukuran.' },
        { q: 'Bagaimana dengan finishing gulungan?', a: 'Hasil dapat digulung dan dimasukkan ke tabung, tersedia dengan biaya tambahan.' }
      ],
      related: ['cetak-banner', 'print-a3', 'laminating']
    },
    {
      slug: 'cetak-banner', name: 'Cetak Banner & Spanduk', category: 'large-format', featured: true,
      image: 'assets/images/services/cetak-banner.svg', imageAlt: 'Banner promosi berwarna dengan mata ayam di sudut',
      short: 'Cetak banner, spanduk, dan backdrop untuk usaha, acara, dan sekolah.',
      description: 'Cetak banner dan spanduk dengan tinta tahan cuaca, siap pasang lengkap dengan mata ayam dan finishing sudut. Tersedia flexi 280 gsm, 340 gsm, dan bahan indoor.',
      priceFrom: 25000, unit: 'm²', eta: '1–2 hari kerja',
      specs: [{ label: 'Bahan', value: 'Flexi 280 / 340 gsm, Albatros, Indoor' }, { label: 'Ukuran', value: 'Bebas, lebar maksimal 3 m' }, { label: 'Finishing', value: 'Mata ayam, lipat jahit' }, { label: 'Format file', value: 'PDF, CDR, AI, JPG resolusi tinggi' }],
      options: [
        { label: 'Bahan', choices: ['Flexi 280 gsm', 'Flexi 340 gsm', 'Albatros', 'Indoor'] },
        { label: 'Finishing', choices: ['Mata ayam', 'Lipat jahit', 'Tanpa finishing'] }
      ],
      pricing: [
        { spec: 'Flexi 280 gsm', unit: 'm²', price: 25000, note: 'Minimal pesan 1 m²' },
        { spec: 'Flexi 340 gsm', unit: 'm²', price: 35000, note: '' },
        { spec: 'Albatros (indoor, tajam)', unit: 'm²', price: 60000, note: '' },
        { spec: 'X-Banner 60×160 cm (lengkap standing)', unit: 'set', price: 85000, note: '' }
      ],
      faqs: [{ q: 'Berapa ukuran file yang dibutuhkan?', a: 'Gunakan resolusi minimal 100 dpi pada ukuran asli. Kami bantu cek sebelum cetak.' }],
      related: ['print-a0', 'cetak-sticker', 'digital-printing']
    },
    {
      slug: 'jilid-buku', name: 'Jilid Buku & Skripsi', category: 'finishing', featured: true,
      image: 'assets/images/services/jilid-buku.svg', imageAlt: 'Buku hasil jilid dengan sampul biru dan spiral',
      short: 'Jilid lakban, spiral, dan hard cover untuk skripsi, laporan, dan buku.',
      description: 'Jilid rapi untuk skripsi, tesis, laporan, dan buku. Pilih jilid lakban, spiral kawat, atau hard cover emas dengan tulisan timbul. Pengerjaan cepat bahkan di musim sidang.',
      priceFrom: 7000, unit: 'buku', eta: 'Jilid lakban/spiral 1 jam; hard cover 1–2 hari',
      specs: [{ label: 'Jenis jilid', value: 'Lakban, spiral, hard cover' }, { label: 'Ukuran', value: 'A4, F4, A5' }, { label: 'Sampul', value: 'Karton, BC, kulit sintetis' }, { label: 'Tambahan', value: 'Cetak judul emas' }],
      options: [
        { label: 'Jenis jilid', choices: ['Lakban', 'Spiral', 'Hard cover'] },
        { label: 'Sampul', choices: ['Karton', 'Kulit sintetis'] }
      ],
      pricing: [
        { spec: 'Jilid lakban A4', unit: 'buku', price: 7000, note: '' },
        { spec: 'Jilid spiral (maks 200 halaman)', unit: 'buku', price: 12000, note: '' },
        { spec: 'Hard cover skripsi (emas)', unit: 'buku', price: 55000, note: 'Termasuk cetak judul' },
        { spec: 'Cetak judul emas tambahan', unit: 'baris', price: 5000, note: '' }
      ],
      faqs: [{ q: 'Bisa sekalian print dan jilid?', a: 'Bisa. Kirim file, kami cetak lalu jilid sesuai pilihan Anda dalam satu paket.' }],
      related: ['print-a4', 'laminating', 'cetak-buku']
    },
    {
      slug: 'laminating', name: 'Laminating', category: 'finishing', featured: true,
      image: 'assets/images/services/laminating.svg', imageAlt: 'Dokumen dilapisi plastik laminating mengkilap',
      short: 'Laminating dokumen, sertifikat, dan kartu agar awet dan tahan air.',
      description: 'Lapisi dokumen, sertifikat, foto, dan kartu dengan plastik laminating doff atau glossy. Melindungi dari air, lipatan, dan noda sehingga awet bertahun-tahun.',
      priceFrom: 3000, unit: 'lembar', eta: 'Langsung jadi',
      specs: [{ label: 'Ukuran', value: 'Kartu, A5, A4, A3' }, { label: 'Finishing', value: 'Glossy / Doff' }, { label: 'Tebal plastik', value: '80–125 micron' }],
      options: [
        { label: 'Ukuran', choices: ['Kartu', 'A4', 'A3'] },
        { label: 'Finishing', choices: ['Glossy', 'Doff'] }
      ],
      pricing: [
        { spec: 'Laminating kartu (KTP/ID)', unit: 'lembar', price: 3000, note: '' },
        { spec: 'Laminating A4', unit: 'lembar', price: 5000, note: '' },
        { spec: 'Laminating A3', unit: 'lembar', price: 9000, note: '' }
      ],
      faqs: [{ q: 'Apakah laminating bisa dilepas?', a: 'Tidak. Laminating bersifat permanen untuk melindungi dokumen.' }],
      related: ['fotocopy', 'jilid-buku', 'kartu-nama']
    },
    {
      slug: 'cetak-sticker', name: 'Cetak Sticker', category: 'digital-printing', featured: true,
      image: 'assets/images/services/cetak-sticker.svg', imageAlt: 'Lembar sticker berbagai bentuk dan warna',
      short: 'Sticker label, kemasan, dan branding dengan potong custom (kiss cut).',
      description: 'Sticker untuk label produk, kemasan, dan branding. Bahan vinyl tahan air atau chromo, potong bentuk mengikuti desain (die cut atau kiss cut). Cocok untuk pelaku UMKM.',
      priceFrom: 15000, unit: 'lembar A3+', eta: '1–2 hari kerja',
      specs: [{ label: 'Bahan', value: 'Chromo, Vinyl, Transparan' }, { label: 'Ukuran lembar', value: 'A3+ (32×48 cm)' }, { label: 'Finishing', value: 'Laminasi glossy/doff, potong bentuk' }],
      options: [
        { label: 'Bahan', choices: ['Chromo', 'Vinyl', 'Transparan'] },
        { label: 'Laminasi', choices: ['Glossy', 'Doff', 'Tanpa'] },
        { label: 'Potong', choices: ['Kiss cut', 'Die cut', 'Tanpa potong'] }
      ],
      pricing: [
        { spec: 'Chromo A3+ + laminasi', unit: 'lembar', price: 15000, note: '' },
        { spec: 'Vinyl A3+ + laminasi', unit: 'lembar', price: 25000, note: 'Tahan air' },
        { spec: 'Potong bentuk (kiss cut)', unit: 'lembar', price: 10000, note: 'Tambahan' }
      ],
      faqs: [{ q: 'Minimal pesan berapa?', a: 'Minimal 1 lembar A3+. Semakin banyak, harga semakin ringan.' }],
      related: ['digital-printing', 'cetak-brosur', 'cetak-banner']
    },
    {
      slug: 'digital-printing', name: 'Digital Printing Full Color', category: 'digital-printing', featured: false,
      image: 'assets/images/services/digital-printing.svg', imageAlt: 'Lembar cetak dengan lingkaran warna cyan, magenta, dan kuning',
      short: 'Cetak full color kualitas tinggi di Art Paper, Art Carton, dan Photo Paper.',
      description: 'Cetak digital full color dengan warna konsisten untuk poster, flyer, dan materi presentasi. Pilih Art Paper, Art Carton, atau Photo Paper sesuai kebutuhan.',
      priceFrom: 6000, unit: 'lembar A3+', eta: '1 hari kerja',
      specs: [{ label: 'Kertas', value: 'Art Paper 120–260 gsm, Art Carton 260–310 gsm, Photo Paper' }, { label: 'Ukuran', value: 'Hingga A3+' }, { label: 'Resolusi', value: '1200 dpi' }],
      options: [
        { label: 'Kertas', choices: ['Art Paper 150 gsm', 'Art Carton 260 gsm', 'Photo Paper'] },
        { label: 'Sisi', choices: ['Satu sisi', 'Dua sisi'] }
      ],
      pricing: [
        { spec: 'Art Paper 150 gsm, satu sisi', unit: 'lembar A3+', price: 6000, note: '' },
        { spec: 'Art Carton 260 gsm, satu sisi', unit: 'lembar A3+', price: 9000, note: '' },
        { spec: 'Photo Paper glossy', unit: 'lembar A3+', price: 18000, note: '' }
      ],
      faqs: [{ q: 'Apakah warna di layar sama dengan hasil cetak?', a: 'Hampir sama. Gunakan mode warna CMYK untuk hasil yang lebih akurat.' }],
      related: ['cetak-sticker', 'cetak-brosur', 'kartu-nama']
    },
    {
      slug: 'cetak-brosur', name: 'Cetak Brosur & Flyer', category: 'media-promosi', featured: true,
      image: 'assets/images/services/cetak-brosur.svg', imageAlt: 'Brosur lipat tiga dengan desain biru dan oranye',
      short: 'Brosur, flyer, dan leaflet promosi dengan berbagai pilihan kertas dan lipatan.',
      description: 'Cetak brosur lipat dua, lipat tiga, dan flyer satu lembar. Kami membantu penyesuaian ukuran file dan menyarankan kertas terbaik untuk anggaran Anda.',
      priceFrom: 1200, unit: 'lembar', eta: '2–3 hari kerja',
      specs: [{ label: 'Ukuran', value: 'A4, A5, A6, DL' }, { label: 'Kertas', value: 'Art Paper 120/150 gsm' }, { label: 'Finishing', value: 'Lipat 2 / lipat 3, laminasi' }],
      options: [
        { label: 'Ukuran', choices: ['A4', 'A5', 'A6'] },
        { label: 'Kertas', choices: ['Art Paper 120 gsm', 'Art Paper 150 gsm'] },
        { label: 'Lipat', choices: ['Tanpa lipat', 'Lipat 2', 'Lipat 3'] }
      ],
      pricing: [
        { spec: 'Flyer A5 Art Paper 120 gsm (min. 100)', unit: 'lembar', price: 1200, note: 'Dua sisi' },
        { spec: 'Flyer A4 Art Paper 120 gsm (min. 100)', unit: 'lembar', price: 2200, note: 'Dua sisi' },
        { spec: 'Brosur lipat 3 A4 Art Paper 150 gsm (min. 100)', unit: 'lembar', price: 3500, note: 'Sudah dilipat' }
      ],
      faqs: [{ q: 'Apakah bisa dibantu desain?', a: 'Bisa. Tim desain kami dapat membuatkan desain dengan biaya mulai Rp 75.000.' }],
      related: ['kartu-nama', 'cetak-sticker', 'digital-printing']
    },
    {
      slug: 'kartu-nama', name: 'Kartu Nama', category: 'media-promosi', featured: false,
      image: 'assets/images/services/kartu-nama.svg', imageAlt: 'Tiga kartu nama berwarna dengan logo dan teks',
      short: 'Kartu nama profesional untuk usaha dan perusahaan, satu atau dua sisi.',
      description: 'Kartu nama dengan pilihan Art Carton 260 gsm, laminasi doff atau glossy, dan sudut tumpul. Satu box berisi 100 kartu.',
      priceFrom: 35000, unit: 'box (100 pcs)', eta: '1–2 hari kerja',
      specs: [{ label: 'Ukuran', value: '9 × 5,5 cm' }, { label: 'Kertas', value: 'Art Carton 260 gsm' }, { label: 'Finishing', value: 'Laminasi doff/glossy, sudut tumpul' }],
      options: [
        { label: 'Sisi', choices: ['Satu sisi', 'Dua sisi'] },
        { label: 'Laminasi', choices: ['Doff', 'Glossy'] }
      ],
      pricing: [
        { spec: 'Satu sisi, laminasi (100 pcs)', unit: 'box', price: 35000, note: '' },
        { spec: 'Dua sisi, laminasi (100 pcs)', unit: 'box', price: 50000, note: '' },
        { spec: 'Dua sisi, laminasi (200 pcs)', unit: 'box', price: 85000, note: '' }
      ],
      faqs: [{ q: 'Apa yang perlu disiapkan?', a: 'Siapkan nama, jabatan, kontak, dan logo. Atau gunakan layanan desain kami.' }],
      related: ['cetak-brosur', 'laminating', 'cetak-undangan']
    },
    {
      slug: 'cetak-undangan', name: 'Cetak Undangan', category: 'buku-undangan', featured: false,
      image: 'assets/images/services/cetak-undangan.svg', imageAlt: 'Undangan dalam amplop krem dengan segel biru',
      short: 'Undangan pernikahan, ulang tahun, dan acara dengan pilihan kertas dan amplop.',
      description: 'Cetak undangan pernikahan, khitanan, ulang tahun, dan acara kantor. Pilihan kertas mulai dari Art Carton hingga kertas tekstur, lengkap dengan amplop.',
      priceFrom: 2500, unit: 'pcs', eta: '3–5 hari kerja',
      specs: [{ label: 'Kertas', value: 'Art Carton, Linen, Concorde' }, { label: 'Ukuran', value: 'A5, 14×21 cm, kustom' }, { label: 'Tambahan', value: 'Amplop, hot print, emboss' }],
      options: [
        { label: 'Kertas', choices: ['Art Carton 260 gsm', 'Linen', 'Concorde'] },
        { label: 'Tambahan', choices: ['Tanpa', 'Amplop', 'Hot print emas'] }
      ],
      pricing: [
        { spec: 'Undangan Art Carton A5 (min. 100)', unit: 'pcs', price: 2500, note: 'Belum termasuk amplop' },
        { spec: 'Undangan Linen A5 (min. 100)', unit: 'pcs', price: 4500, note: '' },
        { spec: 'Amplop undangan', unit: 'pcs', price: 600, note: '' }
      ],
      faqs: [{ q: 'Bisa dibuatkan desainnya?', a: 'Bisa. Tersedia beberapa template, atau kirim referensi desain Anda.' }],
      related: ['cetak-buku', 'kartu-nama', 'digital-printing']
    },
    {
      slug: 'cetak-buku', name: 'Cetak Buku', category: 'buku-undangan', featured: false,
      image: 'assets/images/services/cetak-buku.svg', imageAlt: 'Tumpukan buku dengan sampul berwarna',
      short: 'Cetak buku, buku acara, modul, dan yasin dengan jumlah fleksibel.',
      description: 'Cetak buku dalam jumlah kecil maupun besar: modul, buku yasin, buku acara, dan buku kenangan. Jilid perfect binding atau jahit benang.',
      priceFrom: 15000, unit: 'eksemplar', eta: '4–7 hari kerja',
      specs: [{ label: 'Ukuran', value: 'A5, B5, A4' }, { label: 'Kertas isi', value: 'HVS 70 gsm, Bookpaper' }, { label: 'Sampul', value: 'Art Carton 260 gsm + laminasi' }, { label: 'Jilid', value: 'Perfect binding, jahit benang' }],
      options: [
        { label: 'Ukuran', choices: ['A5', 'B5', 'A4'] },
        { label: 'Jilid', choices: ['Perfect binding', 'Jahit benang'] }
      ],
      pricing: [
        { spec: 'Buku A5, 100 halaman, isi hitam putih (min. 50 eks)', unit: 'eksemplar', price: 15000, note: '' },
        { spec: 'Buku A5, 200 halaman, isi hitam putih (min. 50 eks)', unit: 'eksemplar', price: 26000, note: '' },
        { spec: 'Buku yasin 64 halaman (min. 100 eks)', unit: 'eksemplar', price: 9000, note: '' }
      ],
      faqs: [{ q: 'Apakah bisa dicetak 1 eksemplar dulu?', a: 'Bisa untuk contoh (mock-up). Harga satuan lebih tinggi dari harga cetak massal.' }],
      related: ['jilid-buku', 'cetak-undangan', 'print-a4']
    }
  ],

  /* ---------- Portofolio ---------- */
  portfolio: [
    { slug: 'banner-grand-opening', title: 'Banner Grand Opening Kafe', category: 'large-format', image: 'assets/images/portfolio/banner-grand-opening.svg', imageAlt: 'Banner grand opening ukuran besar', description: 'Banner flexi 340 gsm 3×1 m untuk pembukaan kafe di Pulogadung, dengan mata ayam dan jahit tepi.', client: 'Kafe Senja' },
    { slug: 'brosur-klinik', title: 'Brosur Lipat 3 Klinik Gigi', category: 'media-promosi', image: 'assets/images/portfolio/brosur-klinik.svg', imageAlt: 'Brosur lipat tiga klinik gigi', description: 'Brosur lipat 3 A4 Art Paper 150 gsm dua sisi, 1.000 lembar, dengan desain bersih dan informatif.', client: 'Klinik Senyum Sehat' },
    { slug: 'undangan-pernikahan', title: 'Undangan Pernikahan Linen', category: 'buku-undangan', image: 'assets/images/portfolio/undangan-pernikahan.svg', imageAlt: 'Undangan pernikahan dalam amplop', description: 'Undangan A5 kertas linen dengan hot print emas dan amplop senada, 300 set.', client: 'Keluarga Rahmat' },
    { slug: 'buku-yasin', title: 'Buku Yasin & Tahlil', category: 'buku-undangan', image: 'assets/images/portfolio/buku-yasin.svg', imageAlt: 'Tumpukan buku yasin dengan sampul biru', description: 'Buku saku 64 halaman, sampul laminasi doff, 500 eksemplar untuk acara pengajian.', client: 'DKM Al-Ikhlas' },
    { slug: 'sticker-kemasan', title: 'Sticker Label Kemasan Makanan', category: 'digital-printing', image: 'assets/images/portfolio/sticker-kemasan.svg', imageAlt: 'Lembar sticker label kemasan', description: 'Sticker vinyl tahan air dengan kiss cut berbagai bentuk untuk kemasan produk UMKM.', client: 'Dapur Ibu Rina' },
    { slug: 'kartu-nama-korporat', title: 'Kartu Nama Korporat', category: 'media-promosi', image: 'assets/images/portfolio/kartu-nama-korporat.svg', imageAlt: 'Set kartu nama korporat berwarna', description: 'Kartu nama Art Carton 260 gsm laminasi doff, sudut tumpul, untuk 25 karyawan.', client: 'PT Mitra Logistik' },
    { slug: 'poster-denah-a0', title: 'Cetak Denah Gedung A0', category: 'large-format', image: 'assets/images/portfolio/poster-denah-a0.svg', imageAlt: 'Cetak denah gedung ukuran A0', description: 'Cetak denah arsitektur A0 hitam putih dan berwarna untuk presentasi proyek.', client: 'CV Karya Bangun' },
    { slug: 'jilid-skripsi', title: 'Jilid Hard Cover Skripsi', category: 'finishing', image: 'assets/images/portfolio/jilid-skripsi.svg', imageAlt: 'Skripsi dengan jilid hard cover', description: 'Jilid hard cover emas dengan cetak judul timbul untuk kebutuhan sidang akhir mahasiswa.', client: 'Mahasiswa UNJ' }
  ],

  /* ---------- Cara pemesanan ---------- */
  steps: [
    { icon: 'message-circle', title: 'Hubungi Kami', text: 'Chat lewat WhatsApp dan sebutkan kebutuhan cetak Anda.' },
    { icon: 'file-up', title: 'Kirim File', text: 'Kirim file desain atau dokumen, kami cek kelengkapannya.' },
    { icon: 'receipt-text', title: 'Konfirmasi Harga', text: 'Kami kirim rincian harga dan estimasi waktu pengerjaan.' },
    { icon: 'package-check', title: 'Ambil atau Antar', text: 'Ambil di toko, atau kami antar untuk area tertentu.' }
  ],

  /* ---------- Alasan memilih ---------- */
  why: [
    { icon: 'timer', title: 'Pengerjaan Cepat', text: 'Pesanan ringan selesai dalam hitungan jam, bukan hari.' },
    { icon: 'sparkles', title: 'Kualitas Terjaga', text: 'Setiap pesanan dicek sebelum diserahkan, jadi hasil rapi dan sesuai.' },
    { icon: 'tag', title: 'Harga Bersahabat', text: 'Harga grosir otomatis untuk jumlah banyak, tanpa biaya tersembunyi.' },
    { icon: 'headset', title: 'Konsultasi Gratis', text: 'Bingung memilih kertas atau ukuran? Kami bantu sarankan yang pas.' }
  ],

  /* ---------- Testimoni ---------- */
  testimonials: [
    { name: 'Rina Kusuma', role: 'Mahasiswa Akhir', rating: 5, text: 'Jilid skripsi selesai dalam sehari dan hasilnya rapi. Pas banget menjelang sidang, terima kasih banyak!' },
    { name: 'Bapak Hendra', role: 'Pemilik Kafe Senja', rating: 5, text: 'Banner pembukaan kafe tajam warnanya dan tepat waktu. Admin ramah dan responsif lewat WhatsApp.' },
    { name: 'Ibu Dewi Lestari', role: 'Guru SD', rating: 5, text: 'Langganan fotocopy dan laminating materi ajar. Harga bersahabat dan hasilnya selalu bersih.' },
    { name: 'Andi Pratama', role: 'Admin Kantor', rating: 4, text: 'Cetak kartu nama untuk satu kantor, hasilnya profesional. Dibantu cek file sebelum dicetak.' },
    { name: 'Siti Nurhaliza', role: 'Pemilik Usaha Makanan', rating: 5, text: 'Sticker label produk saya dibuat dengan potong bentuk yang rapi. Kemasan jadi terlihat premium.' }
  ],

  /* ---------- FAQ (group = kelompok, featured = tampil di beranda) ---------- */
  faqGroups: [
    { slug: 'umum', name: 'Umum & Pemesanan' },
    { slug: 'fotocopy-print', name: 'Fotocopy & Print' },
    { slug: 'large-format', name: 'Large Format & Banner' },
    { slug: 'finishing', name: 'Jilid & Laminating' },
    { slug: 'promosi-undangan', name: 'Brosur, Kartu Nama & Undangan' }
  ],
  faqs: [
    { group: 'umum', featured: true, q: 'Bagaimana cara memesan?', a: 'Hubungi kami lewat WhatsApp, sebutkan jenis layanan, ukuran, dan jumlah, lalu kirim file Anda. Kami konfirmasi harga dan estimasi selesai sebelum dikerjakan.' },
    { group: 'umum', featured: true, q: 'Apakah bisa kirim file lewat WhatsApp atau email?', a: 'Bisa. Format yang kami terima antara lain PDF, DOCX, XLSX, JPG, PNG, CDR, dan AI. Untuk hasil terbaik, kirim dalam PDF.' },
    { group: 'umum', featured: true, q: 'Metode pembayaran apa saja yang tersedia?', a: 'Tunai, transfer bank, dan QRIS. Untuk pesanan besar kami meminta uang muka 50%.' },
    { group: 'umum', featured: false, q: 'Apakah tersedia layanan antar?', a: 'Tersedia untuk area Jakarta Timur dan sekitarnya dengan biaya sesuai jarak. Tanyakan ke admin untuk detailnya.' },
    { group: 'fotocopy-print', featured: true, q: 'Berapa lama print dokumen selesai?', a: 'Dokumen hingga 50 lembar biasanya selesai dalam 10–30 menit. Jumlah lebih banyak kami informasikan estimasinya.' },
    { group: 'fotocopy-print', featured: false, q: 'Apakah bisa print dari flashdisk?', a: 'Bisa. Bawa flashdisk Anda ke toko, atau kirim file lewat WhatsApp.' },
    { group: 'fotocopy-print', featured: false, q: 'Apakah ada harga khusus untuk jumlah banyak?', a: 'Ada. Fotocopy di atas 100 lembar mendapat harga grosir otomatis.' },
    { group: 'large-format', featured: true, q: 'Berapa ukuran file banner yang disarankan?', a: 'Gunakan ukuran asli dengan resolusi minimal 100 dpi. Tim kami akan membantu mengecek file sebelum dicetak.' },
    { group: 'large-format', featured: false, q: 'Berapa lama cetak banner selesai?', a: 'Umumnya 1–2 hari kerja, tergantung antrean dan ukuran. Pesanan mendesak dapat ditanyakan ke admin.' },
    { group: 'finishing', featured: true, q: 'Jilid skripsi memakan waktu berapa lama?', a: 'Jilid lakban atau spiral bisa selesai dalam 1 jam. Hard cover membutuhkan 1–2 hari kerja.' },
    { group: 'finishing', featured: false, q: 'Apakah laminating cocok untuk ijazah?', a: 'Kami tidak menyarankan laminasi dokumen asli yang masih perlu dilegalisir. Gunakan fotokopi yang dilaminasi.' },
    { group: 'promosi-undangan', featured: false, q: 'Apakah bisa dibantu desain brosur atau undangan?', a: 'Bisa. Tim desain kami membuat desain berdasarkan referensi Anda dengan biaya mulai Rp 75.000.' },
    { group: 'promosi-undangan', featured: false, q: 'Berapa minimal pesan undangan?', a: 'Minimal 100 pcs. Untuk jumlah lebih sedikit silakan tanyakan ke admin.' }
  ],

  /* ---------- Artikel ---------- */
  articles: [
    { slug: 'tips-hemat-print-dokumen', title: '7 Tips Hemat Print Dokumen untuk Mahasiswa dan Kantor', category: 'Tips Cetak', date: '2026-10-28', author: 'Tim Sinar Copy', readTime: 4, image: 'assets/images/articles/tips-hemat-print-dokumen.svg', imageAlt: 'Printer mencetak dokumen di atas meja', excerpt: 'Biaya print sering membengkak tanpa terasa. Berikut cara sederhana mengurangi biaya tanpa mengorbankan kualitas.' },
    { slug: 'memilih-jenis-kertas', title: 'Panduan Memilih Jenis Kertas: HVS, Art Paper, hingga Art Carton', category: 'Panduan', date: '2026-10-14', author: 'Tim Sinar Copy', readTime: 5, image: 'assets/images/articles/memilih-jenis-kertas.svg', imageAlt: 'Tumpukan buku dengan berbagai jenis kertas', excerpt: 'Salah memilih kertas bisa membuat hasil cetak kurang maksimal. Kenali perbedaan gramasi dan permukaan kertas.' },
    { slug: 'ukuran-banner-yang-tepat', title: 'Cara Menentukan Ukuran Banner yang Tepat untuk Usaha Anda', category: 'Panduan', date: '2026-09-30', author: 'Tim Sinar Copy', readTime: 4, image: 'assets/images/articles/ukuran-banner-yang-tepat.svg', imageAlt: 'Banner promosi terpasang di depan toko', excerpt: 'Banner terlalu kecil tidak terbaca, terlalu besar boros. Pelajari cara menghitung ukuran ideal.' },
    { slug: 'siapkan-file-sebelum-cetak', title: 'Checklist Menyiapkan File Desain Sebelum Dicetak', category: 'Tips Cetak', date: '2026-09-12', author: 'Tim Sinar Copy', readTime: 6, image: 'assets/images/articles/siapkan-file-sebelum-cetak.svg', imageAlt: 'Lingkaran warna CMYK pada lembar cetak', excerpt: 'Warna pudar, gambar pecah, atau tulisan terpotong biasanya berasal dari file. Ini daftar periksanya.' },
    { slug: 'jenis-jilid-untuk-skripsi', title: 'Jilid Lakban, Spiral, atau Hard Cover: Mana untuk Skripsi?', category: 'Panduan', date: '2026-08-25', author: 'Tim Sinar Copy', readTime: 3, image: 'assets/images/articles/jenis-jilid-untuk-skripsi.svg', imageAlt: 'Skripsi dengan jilid spiral dan sampul biru', excerpt: 'Setiap kampus punya ketentuan berbeda. Kenali perbedaan jenis jilid agar tidak salah saat bimbingan.' },
    { slug: 'manfaat-laminating', title: 'Kapan Dokumen Perlu Dilaminating? Ini Manfaat dan Batasannya', category: 'Edukasi', date: '2026-08-10', author: 'Tim Sinar Copy', readTime: 3, image: 'assets/images/articles/manfaat-laminating.svg', imageAlt: 'Dokumen berlapis plastik laminating', excerpt: 'Laminating melindungi dokumen dari air dan sobekan, tetapi tidak cocok untuk semua jenis berkas.' }
  ]
};
