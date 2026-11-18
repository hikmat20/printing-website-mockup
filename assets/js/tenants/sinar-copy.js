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
    aboutPage: {
      vision: { title: 'Visi', text: 'Menjadi tempat cetak pertama yang diingat warga sekitar: cepat, rapi, dan jujur soal harga.' },
      missionTitle: 'Misi',
      mission: [
        'Mengerjakan setiap pesanan sesuai spesifikasi yang disepakati di awal.',
        'Menyebutkan harga dan estimasi selesai sebelum pekerjaan dimulai.',
        'Merawat mesin dan menjaga kualitas bahan agar hasil cetak konsisten.',
        'Membantu pelanggan memilih kertas, ukuran, dan finishing yang pas, tanpa memaksa.'
      ],
      milestones: [
        { year: '2012', title: 'Satu mesin fotocopy', text: 'Membuka layanan fotocopy dan print dokumen di depan kampus.' },
        { year: '2016', title: 'Jilid dan laminating', text: 'Menambah layanan jilid skripsi, laminating, dan cetak kartu nama.' },
        { year: '2020', title: 'Cetak digital', text: 'Mesin digital printing untuk brosur, undangan, dan sticker kemasan.' },
        { year: '2023', title: 'Large format', text: 'Mulai mencetak banner, spanduk, dan poster ukuran besar.' },
        { year: 'Kini', title: 'Pesan lewat WhatsApp', text: 'Pelanggan mengirim file dan kebutuhan dari mana saja, lalu mengambil pesanan di toko.' }
      ]
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
        },
        services: {
          title: 'Layanan Fotocopy, Print, Banner & Jilid | Sinar Copy & Printing',
          description: 'Daftar layanan percetakan di Jakarta Timur: fotocopy, print dokumen, cetak banner, jilid skripsi, laminating, brosur, dan undangan. Lihat harga lalu pesan lewat WhatsApp.'
        },
        portfolio: {
          title: 'Portofolio Hasil Cetak | Sinar Copy & Printing',
          description: 'Contoh hasil cetak Sinar Copy & Printing Jakarta Timur: banner, brosur, undangan, buku, sticker, dan kartu nama untuk berbagai pelanggan.'
        },
        about: {
          title: 'Tentang Kami - Percetakan & Fotocopy Jakarta Timur | Sinar Copy & Printing',
          description: 'Sinar Copy & Printing melayani pelajar, kantor, dan UMKM di Jakarta Timur sejak 2012. Kenali cerita, visi, dan cara kerja kami.'
        },
        contact: {
          title: 'Kontak & Lokasi Toko | Sinar Copy & Printing',
          description: 'Hubungi Sinar Copy & Printing lewat WhatsApp, telepon, atau datang ke toko di Pulogadung, Jakarta Timur. Lihat jam buka dan peta lokasi.'
        },
        pricing: {
          title: 'Daftar Harga Fotocopy, Print & Cetak | Sinar Copy & Printing',
          description: 'Daftar harga fotocopy, print A4/F4/A3, banner, jilid, laminating, dan cetak promosi di Sinar Copy & Printing Jakarta Timur. Harga jelas per satuan.'
        },
        blog: {
          title: 'Artikel & Tips Cetak, Kertas, Banner, dan Jilid | Sinar Copy & Printing',
          description: 'Tips hemat print, panduan memilih kertas, ukuran banner, menyiapkan file desain, dan jenis jilid dari Sinar Copy & Printing Jakarta Timur.'
        },
        faq: {
          title: 'FAQ: Pertanyaan Seputar Fotocopy, Print & Pemesanan | Sinar Copy & Printing',
          description: 'Jawaban atas pertanyaan yang sering diajukan: cara memesan, pembayaran, antar, waktu pengerjaan print, banner, jilid, laminating, dan undangan.'
        },
        /* Pola untuk halaman bertoken {name} {short} {price} {unit} {category} {site} {city}.
           Detail artikel: {name} = judul, {short} = ringkasan, {category} = kategori artikel. */
        article: {
          title: '{name} | {site}',
          description: '{short}'
        },
        service: {
          title: '{name} di {city} - Mulai {price}/{unit} | {site}',
          description: '{short} Mulai {price} per {unit}. Pesan mudah lewat WhatsApp di {site}, {city}.'
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
    accentDark: '#A8550C',
    whatsapp: '#25D366',
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

  /* ---------- Teks per paket (opsional) ----------
     Paket menentukan fungsi (harga, tombol pesan); teks yang menyebut fungsi itu ikut berbeda.
     Hanya bagian yang berbeda yang ditulis: objek digabung per kunci, array diganti utuh.
     Paket tanpa entri di sini memakai teks utama di atas. Laravel: tabel tenant_texts per paket. */
  packageText: {
    profile: {
      tenant: {
        hero: {
          subheadline: 'Melayani fotocopy, print dokumen, cetak ukuran besar, jilid buku, laminating, dan berbagai kebutuhan percetakan lainnya dengan hasil berkualitas dan pengerjaan rapi.',
          actions: { secondary: { label: 'Hubungi Kami', icon: 'message-circle', message: 'Halo, saya ingin berkonsultasi mengenai kebutuhan cetak. Mohon informasi lebih lanjut.' } },
          points: ['Hasil cetak tajam & rapi', 'Dikerjakan sesuai spesifikasi', 'Konsultasi cukup lewat WhatsApp'],
          chips: [
            { icon: 'timer', title: 'Selesai ± 30 menit', text: 'Print hingga 50 lembar' },
            { icon: 'badge-check', title: 'Sejak 2012', text: 'Melayani Jakarta Timur' }
          ]
        },
        cta: {
          title: 'Butuh Layanan Cetak? Hubungi Kami Sekarang',
          text: 'Ceritakan kebutuhan Anda. Kami balas dengan saran bahan, ukuran, dan estimasi pengerjaan, biasanya dalam hitungan menit.'
        },
        seo: {
          defaultDescription: 'Fotocopy, print dokumen, cetak banner, jilid, laminating, dan percetakan lengkap di Jakarta Timur. Hasil rapi, pengerjaan cepat.',
          pages: {
            home: {
              description: 'Fotocopy, print dokumen, cetak banner, jilid skripsi, laminating, dan percetakan lengkap di Jakarta Timur. Hasil rapi, pengerjaan cepat, konsultasi lewat WhatsApp.',
              ogDescription: 'Semua kebutuhan cetak Anda, satu tempat. Fotocopy, print, banner, jilid, dan laminating di Jakarta Timur.'
            },
            services: {
              description: 'Daftar layanan percetakan di Jakarta Timur: fotocopy, print dokumen, cetak banner, jilid skripsi, laminating, brosur, dan undangan. Hubungi kami untuk konsultasi.'
            },
            service: { title: '{name} di {city} | {site}', description: '{short} Hubungi {site}, {city}.' }
          }
        },
        about: { text: [
          'Sinar Copy & Printing berawal dari satu mesin fotocopy kecil di depan kampus. Kini kami melayani pelajar, kantor, dan pelaku UMKM dengan layanan cetak lengkap, dari lembar tugas sampai spanduk acara.',
          'Kami percaya hasil cetak yang baik dimulai dari komunikasi yang jelas: spesifikasi dikonfirmasi di awal, estimasi disebutkan sebelum dikerjakan, dan pesanan selesai sesuai janji.'
        ] },
        aboutPage: {
          vision: { text: 'Menjadi tempat cetak pertama yang diingat warga sekitar: cepat, rapi, dan jujur dalam setiap pesanan.' },
          mission: [
            'Mengerjakan setiap pesanan sesuai spesifikasi yang disepakati di awal.',
            'Menyebutkan estimasi selesai sebelum pekerjaan dimulai.',
            'Merawat mesin dan menjaga kualitas bahan agar hasil cetak konsisten.',
            'Membantu pelanggan memilih kertas, ukuran, dan finishing yang pas, tanpa memaksa.'
          ]
        }
      },
      pageText: {
        services: { lead: 'Fotocopy, print, large format, jilid, hingga cetak promosi. Pilih layanan, lalu hubungi kami untuk konsultasi.' },
        service: {
          orderTitle: 'Tanya layanan ini', orderHint: 'Ceritakan kebutuhan Anda. Kami bantu dengan saran bahan, ukuran, dan estimasi pengerjaan.', orderButton: 'Hubungi Kami'
        }
      },
      homeText: {
        services: { text: 'Pilih layanan yang Anda butuhkan, lalu hubungi kami untuk konsultasi.' },
        why: { title: 'Hasil Rapi, Pengerjaan Cepat, Layanan Ramah' },
        steps: { eyebrow: 'Cara Bekerja', title: 'Dari Konsultasi sampai Pesanan Jadi', text: 'Tidak perlu antre. Cukup ceritakan kebutuhan Anda lewat WhatsApp.' }
      },
      trust: [
        { icon: 'zap', title: 'Cepat & Tepat Waktu', text: 'Pesanan ringan selesai dalam hitungan jam.' },
        { icon: 'badge-check', title: 'Hasil Rapi & Tajam', text: 'Mesin digital terawat dengan kontrol kualitas.' },
        { icon: 'users', title: 'Layanan Ramah', text: 'Konsultasi bahan dan ukuran tanpa dipungut biaya.' },
        { icon: 'message-circle', title: 'Konsultasi via WhatsApp', text: 'Kirim file dan kebutuhan, kami balas dengan cepat.' }
      ]
    }
  },

  /* ---------- Teks halaman internal (milik tenant; struktur halaman dikunci platform) ---------- */
  pageText: {
    services: {
      title: 'Layanan Kami', lead: 'Fotocopy, print, large format, jilid, hingga cetak promosi. Pilih layanan, lihat harga, lalu pesan lewat WhatsApp.',
      listTitle: 'Daftar layanan', searchLabel: 'Cari layanan', searchPlaceholder: 'Cari layanan, mis. banner atau jilid',
      empty: { title: 'Layanan tidak ditemukan', text: 'Coba kata kunci lain, atau tanyakan langsung. Kami bisa mengerjakan banyak kebutuhan cetak di luar daftar ini.', button: 'Tanya lewat WhatsApp' }
    },
    service: {
      notFound: { title: 'Layanan tidak ditemukan', text: 'Alamat layanan yang Anda buka tidak ada atau sudah tidak tersedia.', button: 'Lihat semua layanan' },
      pricingTitle: 'Daftar harga', pricingNote: 'Harga dapat berubah untuk jumlah besar atau file yang perlu penyesuaian. Konfirmasi final lewat WhatsApp.',
      orderTitle: 'Pesan layanan ini', orderHint: 'Pilih kebutuhan Anda, lalu kirim lewat WhatsApp. Kami balas dengan rincian harga dan estimasi selesai.',
      orderButton: 'Pesan lewat WhatsApp', relatedTitle: 'Layanan terkait', faqTitle: 'Pertanyaan tentang layanan ini'
    },
    portfolio: {
      title: 'Portofolio', lead: 'Contoh pesanan yang sudah kami selesaikan untuk kafe, klinik, sekolah, dan keluarga di sekitar Jakarta Timur. Klik gambar untuk memperbesar.',
      listTitle: 'Daftar hasil pekerjaan', countNoun: 'karya', clientLabel: 'Klien',
      empty: { title: 'Belum ada karya di kategori ini', text: 'Pilih kategori lain, atau ceritakan kebutuhan Anda. Kami bisa mengerjakan yang serupa.', button: 'Tanya lewat WhatsApp' }
    },
    about: {
      title: 'Tentang Kami', lead: 'Kenali Sinar Copy & Printing: dari satu mesin fotocopy kecil menjadi mitra cetak warga Jakarta Timur.',
      visionTitle: 'Visi & Misi', milestonesTitle: 'Perjalanan Kami', milestonesText: 'Beberapa tonggak yang membentuk cara kami bekerja hari ini.'
    },
    contact: {
      title: 'Hubungi Kami', lead: 'Punya pertanyaan, butuh penawaran, atau ingin konsultasi bahan dan ukuran? Isi formulir ini atau datang langsung ke toko kami.',
      formTitle: 'Kirim pesan', formHint: 'Pesan Anda dikirim lewat WhatsApp supaya cepat dibalas. Semua kolom bertanda * wajib diisi.',
      fields: {
        name:    { label: 'Nama', placeholder: 'Nama lengkap', error: 'Isi nama Anda, minimal 2 huruf.' },
        phone:   { label: 'Nomor WhatsApp', placeholder: 'mis. 0812-3456-7890', error: 'Isi nomor WhatsApp yang valid, mis. 081234567890.' },
        service: { label: 'Layanan yang diminati', other: 'Lainnya / belum tahu' },
        message: { label: 'Pesan', placeholder: 'Ceritakan kebutuhan Anda: ukuran, jumlah, kertas, tenggat.', error: 'Tulis pesan minimal 10 karakter.' }
      },
      submit: 'Kirim lewat WhatsApp',
      success: { title: 'Pesan siap dikirim', text: 'WhatsApp akan terbuka dengan pesan Anda. Jika tidak terbuka, tekan tombol di bawah ini.', button: 'Buka WhatsApp' },
      infoTitle: 'Informasi toko'
    },
    blog: {
      title: 'Artikel & Tips Cetak', lead: 'Panduan singkat soal kertas, ukuran, file desain, dan jilid supaya hasil cetak Anda rapi dan biayanya terkontrol.',
      listTitle: 'Daftar artikel', searchLabel: 'Cari artikel', searchPlaceholder: 'Cari artikel, mis. kertas', countNoun: 'artikel',
      empty: { title: 'Artikel tidak ditemukan', text: 'Coba kata kunci lain, atau tanyakan langsung ke kami soal kebutuhan cetak Anda.', button: 'Tanya lewat WhatsApp' }
    },
    article: {
      notFound: { title: 'Artikel tidak ditemukan', text: 'Alamat artikel yang Anda buka tidak ada atau sudah dihapus.', button: 'Lihat semua artikel' },
      by: 'Ditulis oleh', readTime: 'menit baca', share: 'Bagikan lewat WhatsApp', shareText: 'Baca artikel ini: {title}',
      servicesTitle: 'Layanan terkait', relatedTitle: 'Artikel lainnya', back: 'Semua artikel'
    },
    faq: {
      title: 'Pertanyaan yang Sering Diajukan', lead: 'Jawaban singkat soal pemesanan, pembayaran, dan pengerjaan. Tidak menemukan jawabannya? Tanyakan langsung lewat WhatsApp.',
      searchLabel: 'Cari pertanyaan', searchPlaceholder: 'Cari pertanyaan, mis. banner', jumpLabel: 'Lompat ke kelompok', otherGroup: 'Lainnya', countNoun: 'pertanyaan',
      empty: { title: 'Pertanyaan tidak ditemukan', text: 'Coba kata kunci lain, atau tanyakan langsung. Admin kami siap membantu.', button: 'Tanya lewat WhatsApp' }
    },
    pricing: {
      title: 'Daftar Harga', lead: 'Harga per satuan untuk layanan yang paling sering dipesan. Harga jelas di awal, tanpa biaya tersembunyi.',
      note: 'Harga dapat berubah untuk jumlah besar, ukuran khusus, atau file yang perlu penyesuaian. Kirim kebutuhan Anda lewat WhatsApp untuk penawaran pasti.',
      jumpLabel: 'Lompat ke kategori', columns: { service: 'Layanan', spec: 'Spesifikasi', unit: 'Satuan', price: 'Harga', note: 'Catatan' }
    }
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
        { q: 'Apakah bisa fotocopy dua sisi?', a: 'Bisa. Pilih opsi dua sisi saat memesan. Harga dihitung per lembar kertas.', byPackage: { profile: { a: 'Bisa. Pilih opsi dua sisi saat memesan.' } } },
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
        { q: 'Apakah bisa print dua sisi (bolak-balik)?', a: 'Bisa. Harga dihitung per sisi, jadi cetak bolak-balik dihitung dua sisi.', byPackage: { profile: { a: 'Bisa. Cetak bolak-balik tersedia untuk dokumen panjang.' } } },
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
      faqs: [{ q: 'Minimal pesan berapa?', a: 'Minimal 1 lembar A3+. Semakin banyak, harga semakin ringan.', byPackage: { profile: { a: 'Minimal 1 lembar A3+. Untuk jumlah banyak, hubungi kami.' } } }],
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
      faqs: [{ q: 'Apakah bisa dibantu desain?', a: 'Bisa. Tim desain kami dapat membuatkan desain dengan biaya mulai Rp 75.000.', byPackage: { profile: { a: 'Bisa. Tim desain kami dapat membuatkan desain sesuai kebutuhan Anda. Hubungi kami untuk detailnya.' } } }],
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
      faqs: [{ q: 'Apakah bisa dicetak 1 eksemplar dulu?', a: 'Bisa untuk contoh (mock-up). Harga satuan lebih tinggi dari harga cetak massal.', byPackage: { profile: { a: 'Bisa untuk contoh (mock-up). Hubungi kami untuk mengatur jumlah dan jadwalnya.' } } }],
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
    { icon: 'receipt-text', title: 'Konfirmasi Harga', text: 'Kami kirim rincian harga dan estimasi waktu pengerjaan.', byPackage: { profile: { icon: 'clipboard-check', title: 'Konfirmasi Kebutuhan', text: 'Kami cek file dan spesifikasi, lalu kirim estimasi waktu pengerjaan.' } } },
    { icon: 'package-check', title: 'Ambil atau Antar', text: 'Ambil di toko, atau kami antar untuk area tertentu.' }
  ],

  /* ---------- Alasan memilih ---------- */
  why: [
    { icon: 'timer', title: 'Pengerjaan Cepat', text: 'Pesanan ringan selesai dalam hitungan jam, bukan hari.' },
    { icon: 'sparkles', title: 'Kualitas Terjaga', text: 'Setiap pesanan dicek sebelum diserahkan, jadi hasil rapi dan sesuai.' },
    { icon: 'tag', title: 'Harga Bersahabat', text: 'Harga grosir otomatis untuk jumlah banyak, tanpa biaya tersembunyi.', byPackage: { profile: { icon: 'layers', title: 'Jumlah Sedikit atau Banyak', text: 'Satu lembar sampai ribuan eksemplar dikerjakan dengan kerapian yang sama.' } } },
    { icon: 'headset', title: 'Konsultasi Gratis', text: 'Bingung memilih kertas atau ukuran? Kami bantu sarankan yang pas.' }
  ],

  /* ---------- Testimoni ---------- */
  testimonials: [
    { name: 'Rina Kusuma', role: 'Mahasiswa Akhir', rating: 5, text: 'Jilid skripsi selesai dalam sehari dan hasilnya rapi. Pas banget menjelang sidang, terima kasih banyak!' },
    { name: 'Bapak Hendra', role: 'Pemilik Kafe Senja', rating: 5, text: 'Banner pembukaan kafe tajam warnanya dan tepat waktu. Admin ramah dan responsif lewat WhatsApp.' },
    { name: 'Ibu Dewi Lestari', role: 'Guru SD', rating: 5, text: 'Langganan fotocopy dan laminating materi ajar. Harga bersahabat dan hasilnya selalu bersih.', byPackage: { profile: { text: 'Langganan fotocopy dan laminating materi ajar. Pelayanannya ramah dan hasilnya selalu bersih.' } } },
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
    { group: 'umum', featured: true, q: 'Bagaimana cara memesan?', a: 'Hubungi kami lewat WhatsApp, sebutkan jenis layanan, ukuran, dan jumlah, lalu kirim file Anda. Kami konfirmasi harga dan estimasi selesai sebelum dikerjakan.', byPackage: { profile: { a: 'Hubungi kami lewat WhatsApp, sebutkan jenis layanan, ukuran, dan jumlah, lalu kirim file Anda. Kami konfirmasi kebutuhan dan estimasi selesai sebelum dikerjakan.' } } },
    { group: 'umum', featured: true, q: 'Apakah bisa kirim file lewat WhatsApp atau email?', a: 'Bisa. Format yang kami terima antara lain PDF, DOCX, XLSX, JPG, PNG, CDR, dan AI. Untuk hasil terbaik, kirim dalam PDF.' },
    { group: 'umum', featured: true, q: 'Metode pembayaran apa saja yang tersedia?', a: 'Tunai, transfer bank, dan QRIS. Untuk pesanan besar kami meminta uang muka 50%.' },
    { group: 'umum', featured: false, q: 'Apakah tersedia layanan antar?', a: 'Tersedia untuk area Jakarta Timur dan sekitarnya dengan biaya sesuai jarak. Tanyakan ke admin untuk detailnya.' },
    { group: 'fotocopy-print', featured: true, q: 'Berapa lama print dokumen selesai?', a: 'Dokumen hingga 50 lembar biasanya selesai dalam 10–30 menit. Jumlah lebih banyak kami informasikan estimasinya.' },
    { group: 'fotocopy-print', featured: false, q: 'Apakah bisa print dari flashdisk?', a: 'Bisa. Bawa flashdisk Anda ke toko, atau kirim file lewat WhatsApp.' },
    { group: 'fotocopy-print', featured: false, q: 'Apakah ada harga khusus untuk jumlah banyak?', a: 'Ada. Fotocopy di atas 100 lembar mendapat harga grosir otomatis.', byPackage: { profile: { hidden: true } } },
    { group: 'large-format', featured: true, q: 'Berapa ukuran file banner yang disarankan?', a: 'Gunakan ukuran asli dengan resolusi minimal 100 dpi. Tim kami akan membantu mengecek file sebelum dicetak.' },
    { group: 'large-format', featured: false, q: 'Berapa lama cetak banner selesai?', a: 'Umumnya 1–2 hari kerja, tergantung antrean dan ukuran. Pesanan mendesak dapat ditanyakan ke admin.' },
    { group: 'finishing', featured: true, q: 'Jilid skripsi memakan waktu berapa lama?', a: 'Jilid lakban atau spiral bisa selesai dalam 1 jam. Hard cover membutuhkan 1–2 hari kerja.' },
    { group: 'finishing', featured: false, q: 'Apakah laminating cocok untuk ijazah?', a: 'Kami tidak menyarankan laminasi dokumen asli yang masih perlu dilegalisir. Gunakan fotocopy yang dilaminasi.' },
    { group: 'promosi-undangan', featured: false, q: 'Apakah bisa dibantu desain brosur atau undangan?', a: 'Bisa. Tim desain kami membuat desain berdasarkan referensi Anda dengan biaya mulai Rp 75.000.', byPackage: { profile: { a: 'Bisa. Tim desain kami membuat desain berdasarkan referensi Anda.' } } },
    { group: 'promosi-undangan', featured: false, q: 'Berapa minimal pesan undangan?', a: 'Minimal 100 pcs. Untuk jumlah lebih sedikit silakan tanyakan ke admin.' }
  ],

  /* ---------- Artikel ---------- */
  articles: [
    {
      slug: 'tips-hemat-print-dokumen', title: '7 Tips Hemat Print Dokumen untuk Mahasiswa dan Kantor', category: 'Tips Cetak', date: '2026-10-28', author: 'Tim Sinar Copy', readTime: 4, image: 'assets/images/articles/tips-hemat-print-dokumen.svg', imageAlt: 'Printer mencetak dokumen di atas meja', excerpt: 'Biaya print sering membengkak tanpa terasa. Berikut cara sederhana mengurangi biaya tanpa mengorbankan kualitas.',
      services: ['print-a4', 'fotocopy', 'jilid-buku'],
      body: [
        { type: 'p', text: 'Biaya print jarang terasa mahal per lembar, tetapi menumpuk saat tugas, laporan, dan arsip dicetak setiap minggu. Tujuh kebiasaan sederhana berikut bisa menurunkan biaya tanpa membuat hasil sulit dibaca.' },
        { type: 'h2', text: '1. Cetak bolak-balik' },
        { type: 'p', text: 'Pilih cetak dua sisi untuk dokumen panjang. Jumlah kertas turun separuh, dan dokumen lebih tipis saat dijilid. Harga print dihitung per sisi, jadi hemat utamanya ada pada kertas dan jilid, bukan pada tinta.', byPackage: { profile: { text: 'Pilih cetak dua sisi untuk dokumen panjang. Jumlah kertas turun separuh, dan dokumen lebih tipis saat dijilid. Hematnya ada pada kertas dan jilid, bukan pada tinta.' } } },
        { type: 'h2', text: '2. Muat beberapa halaman dalam satu lembar' },
        { type: 'p', text: 'Untuk bahan bacaan atau draf, gunakan pengaturan 2 atau 4 halaman per lembar. Hasilnya cukup terbaca untuk keperluan belajar atau koreksi.' },
        { type: 'h2', text: '3. Periksa tampilan sebelum mencetak' },
        { type: 'p', text: 'Buka pratinjau cetak dan cek halaman kosong, tabel yang terpotong, serta gambar yang bergeser. Satu kali cek menghemat cetak ulang.' },
        { type: 'h2', text: '4. Hitam putih untuk yang tidak perlu warna' },
        { type: 'p', text: 'Cetak warna hanya untuk halaman yang memang membutuhkannya, seperti grafik atau sampul. Pisahkan halaman berwarna agar bisa dicetak terpisah.' },
        { type: 'h2', text: '5. Atur margin dan ukuran huruf' },
        { type: 'p', text: 'Margin yang terlalu lebar dan huruf terlalu besar memperbanyak halaman. Ikuti ketentuan kampus atau kantor, lalu rapikan sisanya.' },
        { type: 'h2', text: '6. Kirim dalam PDF' },
        { type: 'p', text: 'File PDF menjaga susunan halaman. File Word kadang bergeser di komputer lain sehingga halaman bertambah atau tabel pindah tempat.' },
        { type: 'h2', text: '7. Gabungkan pesanan' },
        { type: 'p', text: 'Kumpulkan beberapa file menjadi satu pesanan. Pesanan dalam jumlah besar lebih mudah mendapat harga grosir dan lebih cepat diproses.', byPackage: { profile: { text: 'Kumpulkan beberapa file menjadi satu pesanan. Pesanan dalam jumlah besar lebih mudah diatur dan lebih cepat diproses.' } } },
        { type: 'note', text: 'Tidak yakin pengaturan mana yang cocok? Kirim file Anda lewat WhatsApp dan kami sarankan pengaturan yang paling hemat.' }
      ]
    },
    {
      slug: 'memilih-jenis-kertas', title: 'Panduan Memilih Jenis Kertas: HVS, Art Paper, hingga Art Carton', category: 'Panduan', date: '2026-10-14', author: 'Tim Sinar Copy', readTime: 5, image: 'assets/images/articles/memilih-jenis-kertas.svg', imageAlt: 'Tumpukan buku dengan berbagai jenis kertas', excerpt: 'Salah memilih kertas bisa membuat hasil cetak kurang maksimal. Kenali perbedaan gramasi dan permukaan kertas.',
      services: ['print-a4', 'cetak-brosur', 'kartu-nama'],
      body: [
        { type: 'p', text: 'Hasil cetak yang bagus dimulai dari kertas yang tepat. Dua hal yang paling menentukan adalah gramasi (ketebalan) dan jenis permukaan.' },
        { type: 'h2', text: 'Gramasi: seberapa tebal kertasnya' },
        { type: 'p', text: 'Gramasi dinyatakan dalam gsm (gram per meter persegi). Semakin besar angkanya, semakin tebal dan kaku kertasnya.' },
        { type: 'ul', items: ['70–80 gsm: kertas HVS untuk dokumen, tugas, dan fotocopy sehari-hari.', '100–120 gsm: HVS tebal atau art paper tipis untuk surat resmi dan lembar isi buku.', '120–150 gsm: art paper untuk brosur dan flyer.', '260–310 gsm: art carton untuk kartu nama, sampul, dan kartu undangan.'] },
        { type: 'h2', text: 'Jenis permukaan' },
        { type: 'ul', items: ['HVS: permukaan halus tanpa lapisan, mudah ditulis dan cocok untuk dokumen.', 'Art paper: berlapis, tersedia glossy (mengilap) dan matte (doff). Warna tampak lebih tajam.', 'Art carton: versi tebal dari art paper dengan permukaan berlapis, cocok untuk kartu nama dan sampul.', 'Kertas tekstur: untuk undangan atau sertifikat yang ingin tampil lebih berkelas.'] },
        { type: 'h2', text: 'Glossy atau matte' },
        { type: 'p', text: 'Glossy membuat foto dan warna terlihat hidup, tetapi memantulkan cahaya dan mudah berbekas sidik jari. Matte lebih nyaman dibaca dan terlihat lebih tenang, sehingga cocok untuk brosur yang banyak teks.' },
        { type: 'note', text: 'Bingung memilih? Sebutkan kegunaan cetakannya dan jumlahnya. Kami akan menyarankan kertas yang paling pas.' }
      ]
    },
    {
      slug: 'ukuran-banner-yang-tepat', title: 'Cara Menentukan Ukuran Banner yang Tepat untuk Usaha Anda', category: 'Panduan', date: '2026-09-30', author: 'Tim Sinar Copy', readTime: 4, image: 'assets/images/articles/ukuran-banner-yang-tepat.svg', imageAlt: 'Banner promosi terpasang di depan toko', excerpt: 'Banner terlalu kecil tidak terbaca, terlalu besar boros. Pelajari cara menghitung ukuran ideal.',
      services: ['cetak-banner', 'print-a0'],
      body: [
        { type: 'p', text: 'Banner yang terlalu kecil tidak terbaca dari jauh, sedangkan banner yang terlalu besar memboroskan biaya dan bisa tidak muat di tempat pemasangan. Ukur dulu sebelum memesan.' },
        { type: 'h2', text: 'Mulai dari jarak baca' },
        { type: 'p', text: 'Patokan sederhana: tinggi huruf sekitar 2,5 cm untuk setiap 3 meter jarak baca. Untuk teks utama yang harus terbaca dari 9 meter, tinggi hurufnya kira-kira 7,5 cm.' },
        { type: 'h2', text: 'Ukur tempat pemasangan' },
        { type: 'ul', items: ['Ukur lebar dan tinggi area yang tersedia, lalu sisakan ruang 5–10 cm agar tidak mepet.', 'Catat cara pemasangan: dipaku, dikaitkan ke rangka, atau digantung. Ini menentukan perlu tidaknya mata ayam (lubang pengait) dan lipatan pinggir.', 'Pastikan banner tidak menutup pintu, jendela, atau rambu.'] },
        { type: 'h2', text: 'Ukuran yang umum dipakai' },
        { type: 'ul', items: ['X-Banner 60 × 160 cm (lengkap dengan standing) untuk di dalam ruangan.', '100 × 200 cm untuk spanduk toko atau acara kecil.', '3 × 1 m untuk spanduk di depan usaha. Lebar bahan maksimal 3 m, jadi sisi lainnya menyesuaikan.'] },
        { type: 'h2', text: 'Siapkan desain sesuai ukuran akhir' },
        { type: 'p', text: 'Buat desain dengan rasio yang sama dengan ukuran cetak. Gunakan gambar beresolusi cukup dan sisakan area aman di tepi agar teks tidak terpotong saat finishing.' },
        { type: 'note', text: 'Kirim foto tempat pemasangan dan ukurannya lewat WhatsApp. Kami bantu hitung ukuran dan jenis bahan.' }
      ]
    },
    {
      slug: 'siapkan-file-sebelum-cetak', title: 'Checklist Menyiapkan File Desain Sebelum Dicetak', category: 'Tips Cetak', date: '2026-09-12', author: 'Tim Sinar Copy', readTime: 6, image: 'assets/images/articles/siapkan-file-sebelum-cetak.svg', imageAlt: 'Lingkaran warna CMYK pada lembar cetak', excerpt: 'Warna pudar, gambar pecah, atau tulisan terpotong biasanya berasal dari file. Ini daftar periksanya.',
      services: ['digital-printing', 'cetak-brosur', 'print-a4'],
      body: [
        { type: 'p', text: 'Sebagian besar masalah hasil cetak berasal dari file, bukan dari mesin. Gunakan daftar berikut sebelum mengirim file.' },
        { type: 'h2', text: 'Ukuran dan area aman' },
        { type: 'ul', items: ['Buat file sesuai ukuran akhir cetak, misalnya A5 untuk brosur A5.', 'Tambahkan bleed (area lebih) 3 mm di semua sisi jika desain memakai warna atau gambar sampai tepi.', 'Jauhkan teks penting minimal 5 mm dari tepi supaya tidak terpotong.'] },
        { type: 'h2', text: 'Warna' },
        { type: 'p', text: 'Layar memakai RGB, sedangkan mesin cetak memakai CMYK. Warna yang sangat cerah di layar, seperti biru neon atau hijau terang, bisa tampak lebih kusam saat dicetak. Jika memungkinkan, atur dokumen ke CMYK sejak awal agar hasilnya bisa diperkirakan.' },
        { type: 'h2', text: 'Gambar dan resolusi' },
        { type: 'ul', items: ['Gunakan resolusi 300 dpi pada ukuran cetak untuk brosur, kartu nama, dan undangan.', 'Untuk banner yang dilihat dari jauh, resolusi 100 dpi pada ukuran asli sudah cukup.', 'Hindari memperbesar gambar kecil, karena hasilnya pecah.'] },
        { type: 'h2', text: 'Huruf' },
        { type: 'p', text: 'Ubah teks menjadi kurva (outline) atau sertakan huruf saat mengekspor PDF. Jika tidak, huruf bisa berganti otomatis di komputer lain.' },
        { type: 'h2', text: 'Format file' },
        { type: 'p', text: 'PDF adalah format paling aman. Jika memakai CorelDRAW atau Illustrator, kirim file asli beserta PDF-nya.' },
        { type: 'note', text: 'Kami membantu mengecek file sebelum dicetak. Kirim lewat WhatsApp atau email dan kami kabari bila ada yang perlu diperbaiki.' }
      ]
    },
    {
      slug: 'jenis-jilid-untuk-skripsi', title: 'Jilid Lakban, Spiral, atau Hard Cover: Mana untuk Skripsi?', category: 'Panduan', date: '2026-08-25', author: 'Tim Sinar Copy', readTime: 3, image: 'assets/images/articles/jenis-jilid-untuk-skripsi.svg', imageAlt: 'Skripsi dengan jilid spiral dan sampul biru', excerpt: 'Setiap kampus punya ketentuan berbeda. Kenali perbedaan jenis jilid agar tidak salah saat bimbingan.',
      services: ['jilid-buku', 'laminating', 'print-a4'],
      body: [
        { type: 'p', text: 'Setiap kampus punya ketentuan jilid yang berbeda. Cek buku pedoman atau tanyakan ke bagian akademik sebelum menjilid agar tidak perlu mengulang.' },
        { type: 'h2', text: 'Jilid lakban' },
        { type: 'p', text: 'Punggung dilapisi lakban kain. Cepat, murah, dan umum dipakai untuk draf bimbingan karena mudah dibuka kembali. Kurang awet untuk dokumen tebal yang sering dibuka.' },
        { type: 'h2', text: 'Jilid spiral' },
        { type: 'p', text: 'Lembar dilubangi lalu diikat kawat atau plastik spiral. Halaman bisa dibuka rata, nyaman untuk dibaca, dan cocok untuk laporan atau modul. Jumlah halaman yang bisa dijilid dibatasi oleh ukuran spiral.' },
        { type: 'h2', text: 'Jilid hard cover' },
        { type: 'p', text: 'Sampul keras dengan punggung buku yang dilem dan dijahit. Hasilnya paling rapi dan awet, sehingga dipakai untuk skripsi akhir, tesis, dan arsip. Pengerjaannya lebih lama dibanding jilid lakban.' },
        { type: 'h2', text: 'Memilih berdasarkan tahap' },
        { type: 'ul', items: ['Bimbingan dan revisi: jilid lakban atau spiral.', 'Sidang: ikuti ketentuan kampus, biasanya lakban atau spiral dengan sampul sesuai warna fakultas.', 'Pengumpulan akhir ke perpustakaan: hard cover dengan tulisan emas pada sampul.'] },
        { type: 'note', text: 'Bawa atau kirim contoh ketentuan kampus Anda. Kami akan menyesuaikan warna sampul dan jenis jilidnya.' }
      ]
    },
    {
      slug: 'manfaat-laminating', title: 'Kapan Dokumen Perlu Dilaminasi? Ini Manfaat dan Batasannya', category: 'Edukasi', date: '2026-08-10', author: 'Tim Sinar Copy', readTime: 3, image: 'assets/images/articles/manfaat-laminating.svg', imageAlt: 'Dokumen berlapis plastik laminating', excerpt: 'Laminating melindungi dokumen dari air dan sobekan, tetapi tidak cocok untuk semua jenis berkas.',
      services: ['laminating', 'jilid-buku'],
      body: [
        { type: 'p', text: 'Laminating melapisi dokumen dengan plastik tipis sehingga lebih tahan air, noda, dan sobekan. Namun, tidak semua berkas cocok dilaminasi.' },
        { type: 'h2', text: 'Cocok dilaminasi' },
        { type: 'ul', items: ['Kartu identitas pengurus, kartu anggota, dan kartu nama khusus.', 'Daftar harga atau menu yang sering dipegang.', 'Poster, jadwal, dan SOP yang dipasang di dinding.', 'Materi belajar atau kartu hafalan yang dipakai berulang.'], byPackage: { profile: { items: ['Kartu identitas pengurus, kartu anggota, dan kartu nama khusus.', 'Menu atau katalog yang sering dipegang.', 'Poster, jadwal, dan SOP yang dipasang di dinding.', 'Materi belajar atau kartu hafalan yang dipakai berulang.'] } } },
        { type: 'h2', text: 'Sebaiknya tidak dilaminasi' },
        { type: 'ul', items: ['Dokumen asli seperti ijazah atau akta yang masih perlu dilegalisir. Laminasi membuatnya tidak bisa distempel atau ditandatangani lagi. Gunakan fotocopy-nya.', 'Kertas thermal seperti struk, karena panas dapat membuat kertasnya menghitam.', 'Foto atau dokumen yang masih akan ditulisi.'] },
        { type: 'h2', text: 'Glossy atau doff' },
        { type: 'p', text: 'Laminasi glossy membuat warna tampak tajam tetapi memantulkan cahaya. Laminasi doff lebih nyaman dibaca dan tidak silau, sehingga banyak dipilih untuk daftar harga dan kartu.', byPackage: { profile: { text: 'Laminasi glossy membuat warna tampak tajam tetapi memantulkan cahaya. Laminasi doff lebih nyaman dibaca dan tidak silau, sehingga banyak dipilih untuk menu dan kartu.' } } },
        { type: 'h2', text: 'Ketebalan' },
        { type: 'p', text: 'Plastik laminasi tersedia dalam beberapa ketebalan, sekitar 80–125 mikron. Pilih yang lebih tebal untuk kartu atau dokumen yang sering dipegang agar kaku dan awet. Yang lebih tipis sudah cukup untuk lembar yang ditempel di dinding.' },
        { type: 'note', text: 'Ragu apakah dokumen Anda boleh dilaminasi? Tanyakan dulu ke kami sebelum dikerjakan.' }
      ]
    }
  ]
};
