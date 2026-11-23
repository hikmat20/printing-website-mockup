# Printing Website Mockup — Platform Website UMKM Percetakan

Mockup website UMKM percetakan, fotocopy, dan digital printing (HTML5, CSS3, grid/reset Bootstrap 5,
JavaScript murni). Mockup ini adalah dasar untuk **platform Laravel multi-tenant**: satu aplikasi
melayani banyak klien, tiap klien memilih template dan menyesuaikan tampilannya.

Tenant contoh (dummy): **Sinar Copy & Printing**, Jakarta Timur.

## Arsitektur: Model C

**Platform inti bersama + template standar + kustomisasi terkendali.**

| Dikendalikan platform (tidak diedit tenant) | Dipilih/diisi tenant |
|---|---|
| Struktur halaman, fitur inti, rute, navigasi | Template (Klasik, Modern, Bold) |
| Header, footer, hero, CTA WhatsApp (terkunci) | Warna utama dan aksen, font judul dan isi |
| Daftar font, varian, gaya kartu, bentuk tombol yang boleh | Bentuk tombol, gaya kartu, varian header |
| Registri section dan template | Section mana yang tampil, urutannya, varian komponennya |
| | Seluruh isi: profil, layanan, harga, teks, gambar |

Tenant hanya bisa memilih nilai yang ada di registri platform. Nilai di luar registri (atau bertipe salah,
mis. `order` bukan array, `limit` negatif, warna bukan `#rrggbb`) ditolak dengan `console.warn` lalu kembali
ke bawaan template. Parameter URL pratinjau yang tidak valid juga memberi peringatan.

## Cara menjalankan

Tanpa backend dan tanpa build. Buka `index.html` di browser. Semua aset (Bootstrap, Lucide, 12 font)
ada lokal di `assets/`, jadi tampil benar tanpa internet (kecuali embed Google Maps).

Pratinjau template tanpa mengubah kode: tambahkan parameter URL.

```
index.html?customize                       panel pratinjau (pilih template, font, warna, dll.)
index.html?template=modern                 template: classic | modern | bold | katalog
index.html?package=profile                 paket: profile | showcase | catalog (shop menyusul)
index.html?template=bold&font=roboto&hfont=montserrat
index.html?primary=%230a7d4f&accent=%23e0a100
index.html?header=topbar&cards=outlined&buttons=pill
```

Parameter URL hanya untuk pratinjau. Di produksi pengaturan ini disimpan di database tenant.

## Struktur

```
index.html                    Cangkang beranda: <main id="main"> diisi dari data
services.html service-detail.html pricing.html portfolio.html about.html contact.html blog.html article-detail.html faq.html
                              Cangkang halaman internal (9 halaman)
demo.html                      Halaman demo/penjualan platform: pilih paket x template x halaman x perangkat (assets/js/demo.js, assets/css/demo.css)
keranjang.html status-pesanan.html
                              Cangkang paket Semi e-commerce (di paket lain: keadaan "tidak tersedia", noindex)
assets/
  js/
    platform.js               DATA PLATFORM: rute, navigasi, registri (font, header, kartu,
                              tombol, section, template)
    tenants/sinar-copy.js     DATA TENANT: profil, tema, isi, teks section, pengaturan `site`
    main.js                   Inti: validasi konfigurasi, tema, header/footer, interaksi, hook modul
    sections.js               Renderer 12 section beranda + varian
    pages.js                  Halaman internal (struktur tetap): layanan, detail layanan, harga, portofolio, tentang, kontak, artikel, detail artikel, FAQ
    seo.js                    <title>, meta, canonical, Open Graph, JSON-LD dari data (beranda + halaman internal)
    preview.js                Panel ?customize (khusus mockup)
  css/
    fonts.css                 @font-face 12 font (woff2 lokal)
    style.css                 Design system + komponen; semua warna lewat token
    variants.css              CSS struktural untuk opsi global dan varian komponen
    pages.css                 CSS halaman internal
    (variants.css juga memuat mega menu, section B2B, dan laci daftar tanya: tampil di semua halaman)
    templates/<id>.css        Skin visual per template, dibatasi [data-template="<id>"]
  fonts/  vendor/  images/
```

## Template

Template = **skin visual** (`templates/<id>.css`) + **susunan beranda bawaan** (di `platform.js`).

| Template | Karakter | Header | Kartu | Tombol | Font bawaan |
|---|---|---|---|---|---|
| `classic` | Rapi, profesional, tampilan asli Sinar Copy | standard | elevated | rounded | Plus Jakarta Sans |
| `modern` | Lapang, sudut membulat, bayangan lembut, slider | standard | elevated | pill | Poppins / Inter |
| `bold` | Tegas, kontras tinggi, bayangan keras, huruf kapital | topbar | outlined | square | Montserrat / Open Sans |
| `katalog` | Katalog B2B: padat informasi, mega menu per kategori, filter di samping, section klien/solusi/industri/jangkauan | megamenu | outlined | square | DM Sans / Inter |
| `toko` | Etalase online (referensi anugerahprint.com): bilah promo, kotak cari + keranjang di header, ubin promo, kartu produk dengan tombol keranjang | store | elevated | rounded | Poppins / Inter |
| `grafika` | Marketplace cetak (referensi primagraphia.co.id): banner promo bergeser, mosaik kategori bergambar, produk bertab (Terlaris / Baru / Semua), jelajah per kategori, deret merek berjalan, artikel terbaru; header dua baris dengan pencarian pil dan total keranjang | market | elevated | pill | Montserrat / Inter |

Atribut pada `<html>` yang ditulis `main.js`: `data-template`, `data-header`, `data-card`, `data-buttons`.

## Halaman internal

Struktur tiap halaman **dikunci platform**; hanya beranda yang section-nya bisa diatur tenant.
Tenant hanya memilih template, warna, font, gaya kartu/tombol, dan varian daftar yang diizinkan
`PLATFORM.pages` (`site.pages.<halaman>.variant`): `services` = `grid`\|`list`\|`catalog`\|`market`, `service` = `standard`\|`configurator`, `blog` = `grid`\|`list`\|`magazine`, `faq` = `accordion`\|`help`. Bawaan per template; Grafika memakai `market`, `configurator`, `magazine`, `help` (lihat *Halaman dalam Grafika*).

| Halaman | Berkas | Laravel | Status |
|---|---|---|---|
| Layanan (filter kategori + cari) | `services.html` | `/layanan` | selesai |
| Detail layanan (slug = hash `#slug`) | `service-detail.html` | `/layanan/{slug}` | selesai |
| Harga | `pricing.html` | `/harga` | selesai |
| Portofolio (filter kategori + lightbox) | `portfolio.html` | `/portofolio` | selesai |
| Tentang (profil, visi/misi, perjalanan, keunggulan) | `about.html` | `/tentang-kami` | selesai |
| Kontak (form kirim via WhatsApp, info, peta) | `contact.html` | `/kontak` | selesai |
| Artikel (filter kategori + cari; varian `grid`\|`list`\|`magazine`) | `blog.html` | `/artikel` | selesai |
| Detail artikel (slug = hash `#slug`) | `article-detail.html` | `/artikel/{slug}` | selesai |
| FAQ (per kelompok + pencarian) | `faq.html` | `/faq` | selesai |

Teks halaman ada di `tenant.pageText`; pola SEO (judul/deskripsi bertoken `{name} {price} {unit} {city} {site}`)
di `tenant.seo.pages`. SEO per halaman: BreadcrumbList di semua halaman, Service + FAQPage di detail layanan,
CollectionPage (portofolio), AboutPage (tentang), ContactPage (kontak), Blog (artikel),
Article (detail artikel, og:type article), FAQPage (FAQ).
Isi artikel = daftar blok data `{ type: 'h2'|'p'|'ul'|'ol'|'note', text | items }` di `articles[].body`; tidak ada HTML dari data.
Di Laravel: tabel `articles` + `article_blocks` (atau JSON), halaman `/artikel/{slug}`.
Form kontak memvalidasi di sisi klien (nama, ponsel Indonesia 10-13 digit, pesan) lalu membuka `wa.me` dengan teks ter-encode;
pada produksi validasi dan antispam wajib diulang di server (POST `/kontak`). Kolom honeypot hanya penghalang bot sederhana.
Parameter pratinjau (`?template=`, `?package=`, dst.) ikut terbawa saat berpindah halaman di mockup.

## Paket (fungsi yang dijual)

Paket adalah **sumbu terpisah dari template**: template = tampilan, paket = modul yang aktif.
Registri: `PLATFORM.packages`; tenant memilih lewat `site.package` (kosong = `showcase`).

| Paket | Status | Harga tampil | Halaman Harga | Tombol pesan |
|---|---|---|---|---|
| `profile` Company Profile | siap | tidak | tidak ada | "Hubungi Kami" ke halaman Kontak |
| `showcase` Showcase + WA | siap (perilaku mockup sebelumnya) | ya | ya | WhatsApp per layanan |
| `catalog` Katalog | siap | ya | ya | tombol + per layanan ke **daftar tanya**; seluruh daftar dikirim sekali ke WhatsApp |
| `shop` Semi e-commerce | siap | ya | ya | tombol keranjang per layanan; checkout satu pesan WhatsApp; halaman lacak pesanan contoh |

Paket yang belum tersedia (`available: false`) atau tidak dikenal ditolak dengan `console.warn` dan jatuh ke `showcase`.

### Paket Katalog: daftar tanya (`assets/js/inquiry.js`)

Hanya dimuat efektif bila `modules.order === 'inquiry'` (paket lain keluar di baris pertama). Pelanggan menekan `+`
pada kartu layanan (atau "Tambah ke Daftar Tanya" di detail layanan, lengkap dengan opsi dan jumlah), membuka laci
Daftar Tanya dari header, mengisi nama + WhatsApp (+ perusahaan dan catatan), lalu **satu pesan WhatsApp** berisi
seluruh daftar dibuka. Tanpa login dan tanpa pembayaran. Daftar disimpan di `localStorage` (kunci per tenant,
divalidasi saat dibaca, tetap jalan di memori bila penyimpanan diblokir). Teks laci boleh ditimpa lewat
`pageText.inquiry`. Laravel: daftar di session, kirim = `POST /daftar-tanya` (validasi + antispam di server,
simpan lead ke tabel `inquiries`).

### Paket Semi e-commerce: keranjang, checkout, lacak pesanan (`assets/js/shop.js`)

Aktif hanya bila `modules.order === 'cart'`. Tombol keranjang ada di kartu layanan; di detail layanan tersedia pilihan
opsi, jumlah, "Tambah ke Keranjang", dan "Beli Sekarang". Halaman `keranjang.html`: daftar item (ubah jumlah 1-99999,
hapus, kosongkan), **estimasi total** (harga "mulai dari" x jumlah; harga final dan ongkir dikonfirmasi admin),
form pemesan (nama, WhatsApp, ambil di toko / antar ke alamat, catatan, honeypot), lalu **satu pesan WhatsApp** berisi
kode pesanan (`<singkatan>-YYYYMMDD-NNNN`), butir bernomor dengan opsi, jumlah x harga = subtotal, estimasi total,
pengambilan/alamat, dan catatan. Setelah itu keranjang dikosongkan, pesanan disimpan di perangkat, dan muncul panel
sukses dengan tautan WhatsApp cadangan serta tautan lacak. `status-pesanan.html`: masukkan kode, lihat tahapan
(`tenant.orderStatus.steps`; kode contoh `DEMO-001..003` dari `orderStatus.examples`, plus pesanan yang dibuat di
perangkat ini = tahap awal). Keranjang dan status bernoindex. **Tidak ada pembayaran, akun, atau login di mockup.**
Data `localStorage` (`ps-cart:<tenant>`, `ps-orders:<tenant>`) tidak dipercaya: divalidasi dan dinormalkan saat dibaca.
Di paket lain `/keranjang` dan `/status-pesanan` menampilkan "Halaman tidak tersedia" dan tidak ada elemen keranjang yang dibuat.
Laravel: keranjang = session (tamu) atau tabel `carts`; checkout = `POST /keranjang/checkout` (validasi + antispam di server)
membuat `orders` + `order_items` dengan kode unik, lalu mengarahkan ke WhatsApp atau gateway pembayaran; status =
`GET /status-pesanan?kode=` dari tabel `orders` (status diubah admin). Pembayaran dan login hanya ada di Laravel.

### Header `store`, section `promo`, pencarian

- Header `store` (bawaan template Toko, bisa dipilih lewat `?header=store`): baris promo (`tenant.promoBar`, bisa per paket
  lewat `packageText.<paket>.tenant`), logo, kotak cari (kirim `?q=` ke halaman Layanan yang mengisi kolom pencarian),
  keranjang (hanya bila paket punya keranjang), dan menu pada baris sendiri (desktop). Di mobile menu masuk ke menu hamburger.
- Section `promo` (varian `tiles`): ubin pintasan dari `tenant.promos` `[{ icon, title, text, badge?, route, slug? }]`.
  Rute tidak dikenal dibuang; daftar kosong membuat section dilewati dengan `console.warn`.

### Section dan header baru (Gelombang B)

- Header `megamenu`: menu Layanan berupa panel lebar per kategori (maks. 4 layanan tiap kategori). Pilihan header,
  terpisah dari template dan paket (`?header=megamenu`).
- Section B2B: `clients`, `problems`, `industries`, `coverage` (data: `tenant.clients/problems/industries/coverage`,
  teks: `homeText.<id>`), dan `inquiry` (hanya bila paket memiliki modul daftar tanya: `sections.inquiry.requires`).
  Data kosong atau salah tipe membuat section dilewati dengan `console.warn`, bukan error.
- Varian halaman layanan `catalog` (`pages.services.variants`): filter kategori di kiri (sticky di desktop) + kartu di kanan.

### Template Grafika: header `market` dan section baru (Gelombang E)

- Header `market` (bawaan template Grafika, `?header=market`): seperti `store` tanpa baris promo. Baris atas: logo, pencarian
  berbentuk pil (tombol panah), keranjang dengan **total berjalan** (`[data-cart-total]`, diisi `shop.js`, hanya bila paket
  punya keranjang), dan Chat Admin. Baris bawah: tombol **Kategori** (dropdown kategori) lalu menu berikon
  (`PLATFORM.nav[].icon`); menu Layanan menjadi tautan "Semua Produk" (`nav[].marketLabel`). **Strip kepercayaan di footer**
  (`tenant.trust`) ikut aktif bersama header ini; di Laravel jadikan partial footer yang dipanggil bila `header === 'market'`.
- Hero `banner`: slider dari `tenant.banners` `[{ eyebrow?, title, text?, image, imageAlt, cta: { label, route, slug? } }]`
  (satu `<h1>` tersembunyi dari `hero.headline`, tombol sebelumnya/berikutnya + titik). Banner tidak valid dilewati; tanpa
  banner hero kembali ke `split` dengan `console.warn`. Teks banner jangan memuat harga (aman untuk paket Company Profile).
- Kategori `mosaic`: dua ubin besar lalu ubin kecil, gambar = gambar layanan pertama kategori.
- Layanan `tabs`: Terlaris (`featured`), Baru (`service.tags` memuat `'baru'`, juga memunculkan lencana "Baru" di template
  Grafika), Semua; label dari `homeText.services.tabs`. Tab kosong dibuang; satu tab saja = tanpa bilah tab.
- Section `catshow` ("Jelajahi per kategori": chip kategori + banner samping + kartu produk) dan `articles` (3 artikel
  terbaru); teks dari `homeText.catshow` / `homeText.articles`. Klien `marquee` (dengan tombol jeda; statis bila pengguna
  memilih gerak dikurangi) dan CTA `card`.
- Tab memakai pola ARIA (`tablist`/`tab`/`tabpanel`, panah, Home, End). Pendamping Laravel: `banners` (urutan, aktif, jadwal),
  `services.tags` (pivot tag) dan komponen `<x-section.catshow />`, `<x-section.articles />`.

Teks tenant yang berbeda per paket (mis. kalimat yang menyebut harga) ditulis di `packageText.<paket>`
pada data tenant: `{ tenant, pageText, homeText, trust }`. Objek digabung per kunci, array diganti utuh.
Paket tanpa entri memakai teks utama. Paket tanpa harga memakai pola SEO bawaan paket
(`packages.<id>.seo.service`) bila pola tenant masih memuat `{price}`, supaya harga tidak bocor ke judul.
Alamat `/harga` di paket tanpa halaman harga menampilkan keadaan "tidak tersedia" (noindex).

### Halaman dalam Grafika (Gelombang F)

- **Daftar layanan `market`**: chip kategori berhitung (`.chip-n`) satu baris yang bisa digeser, kotak cari, dan *Urutkan*
  (Rekomendasi, Nama A–Z, Harga terendah/tertinggi; dua pilihan harga hanya bila paket menampilkan harga). Pilihan ikut `?sort=`
  (nilai tak dikenal diabaikan) dan bekerja bersama filter kategori `#slug` dan pencarian. Dua kolom rapat di HP.
  Teks urut opsional di `pageText.services.sort`. Laravel: `GET /layanan?kategori=&q=&urut=`, diurutkan dan dipaginasi di server.
- **Konfigurator `configurator`** (detail layanan; hanya paket dengan tombol pesan: Showcase, Katalog, Semi e-commerce; Company Profile
  tetap kartu kontak): langkah 1 *Spesifikasi* (tiap opsi = `fieldset` + radio berbentuk chip, pilihan pertama terpilih),
  2 *Jumlah* (stepper 1–99999, nilai tak sah dibersihkan), 3 *Kirim desain* (di mockup lewat WhatsApp; unggah berkas = Laravel).
  Ringkasan harga satuan, jumlah, dan total (`aria-live`) hanya bila paket menampilkan harga.
  **Harga opsi**: `service.options[].prices = { '<pilihan>': tambahan per satuan }`; harga satuan = `priceFrom` + tambahan semua pilihan
  (`PrintSite.optionPrice` / `unitPrice`; angka negatif, teks, atau di atas Rp 100 juta dibatasi). Keranjang memakai harga yang sama
  (`lineTotal`, tampilan keranjang, dan pesan checkout), sehingga baris lama tanpa opsi tetap memakai `priceFrom`. Pesan WhatsApp memuat
  "Estimasi harga di situs". Teks di `pageText.service.config`. Laravel: `option_values.price_delta`; **harga wajib dihitung ulang di server**.
- **FAQ `help`**: pencarian besar di kepala, *Populer* (maks 6, dari `faqs[].featured`), kartu topik berhitung per kelompok
  (`faqGroups[].icon`, cadangan `circle-help`; tidak tampil bila kelompok < 2), lalu jawaban per kelompok. Teks di `pageText.faq.helpCenter`.
- **Blog `magazine`**: artikel terbaru besar (hanya tanpa filter/pencarian), chip kategori berhitung, kartu, dan penomoran halaman
  (`PLATFORM.pages.blog.pageSize`, bawaan 3 karena data mockup sedikit). Laravel: penomoran di server (`?halaman=`).

## Halaman demo (`demo.html`)

Materi penjualan untuk ditunjukkan ke calon client; **bukan halaman tenant** (tidak memakai header/footer tenant, noindex).
Membaca registri `PLATFORM`: empat kartu "Contoh siap lihat" (`PLATFORM.demos`: kombinasi paket + template yang direkomendasikan,
beserta untuk siapa), pemilih paket, template, halaman (hanya halaman yang aktif di paket itu), dan perangkat (desktop dipratinjau
selebar 1280px lalu diperkecil, tablet 820px, ponsel 390px) dalam iframe, tabel perbandingan paket, dan kartu template.
Pilihan tersimpan di URL (`demo.html?package=&template=&page=&device=`) sehingga tautan bisa dibagikan; nilai tak dikenal jatuh ke bawaan.
Paket dan template tetap bebas dipadukan; `demos` hanya rekomendasi. Laravel: rute `/demo` di aplikasi marketing, membaca registri yang sama.

## Kustomisasi tenant (`site` di data tenant)

```js
site: {
  template: 'classic',                       // wajib: salah satu template di registri
  package: 'showcase',                       // profile | showcase (catalog dan shop belum tersedia)
  // semua di bawah ini opsional; kosong = ikut bawaan template
  header: 'topbar',                          // standard | topbar
  cardStyle: 'outlined',                     // elevated | outlined | flat
  buttonShape: 'pill',                       // rounded | pill | square
  order: ['services', 'categories', 'about'],// urutan section yang tidak terkunci
  sections: { faq: { enabled: false }, services: { variant: 'slider', limit: 8 } }
}
```

Font dipilih di `theme` (bukan `site`): `theme: { primary, accent, fontHeading: 'poppins', fontBody: 'inter' }`.
Isi font = salah satu dari 12 font di registri; kosong = ikut template.

Urutan prioritas: **parameter URL (pratinjau) > `site` tenant > bawaan template**.

**Section terkunci:** `hero` (selalu pertama) dan `cta` (selalu terakhir) tidak bisa dimatikan dan
tidak bisa dipindah. Header, footer, tombol WhatsApp, dan navigasi platform juga terkunci.
Section lain boleh dimatikan, diurutkan ulang, dan diganti varian.
Latar belang (putih / abu) dihitung otomatis dari urutan section yang tampil.

### Varian section

| Section | Varian (yang pertama = bawaan) |
|---|---|
| hero | split, centered, dark |
| trust | bar, cards |
| categories | grid, compact |
| services | grid, slider |
| about | split, reverse |
| why | split, grid |
| portfolio | grid, slider |
| steps | cards, timeline |
| testimonials | scroll, slider, grid |
| faq | list, columns |
| location | split, stacked |
| cta | gradient, solid |

### Tombol WhatsApp mengambang (tautan kustom)

Tombol hijau di pojok (HP/tablet) membuka WhatsApp dengan pesan bawaan. Tenant boleh mengubahnya lewat `tenant.floatingCta`
`{ label?, message?, href?, route? }`: `label` (maks 30 huruf, di-escape), `message` (pesan awal WhatsApp), `href` (tautan `https://`
saja, tanpa spasi, maks 500 karakter, mis. tautan pesan `wa.me/message/KODE` atau katalog), atau `route` (rute statis platform,
mis. `contact`, tab yang sama). Prioritas: `href` > `route` > pesan WhatsApp. Nilai tak sah dibuang dengan peringatan dan tombol memakai bawaan.
Per paket: `packageText.<paket>.tenant.floatingCta` (mis. Company Profile mengarah ke Kontak). Laravel: kolom JSON `floating_cta` pada `tenant_settings`,
divalidasi sama (skema `https` saja; tolak `javascript:` dan `http:`).

### Font

Plus Jakarta Sans, Inter, Poppins, Montserrat, Roboto, Nunito, Raleway, Lato, Open Sans, DM Sans,
Source Sans 3, Work Sans. Di-host sendiri (`@fontsource`, woff2 latin, bobot 400–800).
Font judul dan font isi dipilih terpisah.

### Warna

Tenant mengisi `theme.primary` dan `theme.accent` (format `#rrggbb`; nilai lain dibuang dengan peringatan).
Hijau WhatsApp adalah warna merek pihak ketiga dan bagian CTA terkunci, jadi tidak bisa diganti tenant. Turunannya (versi gelap, terang, tint, bayangan)
dihitung dengan `color-mix()` dari dua warna itu. Kunci tema eksplisit (`primaryDark`, `primaryTint`,
`onDarkSoft`, `overlay`, …) bersifat opsional dan **menimpa** hasil hitungan. Data Sinar Copy mengisinya
agar tampilan aslinya persis sama, jadi bila hanya `theme.primary` diganti di data tenant, footer dan CTA
tetap biru tua. Hapus kunci turunan itu untuk tenant baru. Parameter URL `?primary=` membuangnya otomatis.

## Cara menambah

**Template baru:** (1) buat `assets/css/templates/<id>.css`, semua aturan di bawah
`[data-template="<id>"]`; (2) tautkan di `index.html`; (3) daftarkan di `PLATFORM.templates` beserta
bawaan header/kartu/tombol/font dan susunan `home`.

**Font baru:** (1) taruh woff2 di `assets/fonts/`; (2) tambah `@font-face` di `fonts.css`;
(3) daftarkan di `PLATFORM.fonts`.

**Section baru:** (1) tambah renderer di `sections.js`; (2) daftarkan di `PLATFORM.sections`
(`variants`, `locked`, `banded`); (3) tambah CSS variannya di `variants.css`.

**Tenant baru:** salin `tenants/sinar-copy.js`, ganti isinya, muat di `index.html`.
(`data-tenant` pada `<body>` memilih `window.TENANTS[<id>]`.)

## Pemetaan ke Laravel

| Mockup | Laravel |
|---|---|
| `platform.js` (`routes`, `nav`) | `routes/web.php`, `config/navigation.php` |
| `platform.js` (`fonts`, `templates`, `sections`, `packages`, ...) | `config/platform.php` atau tabel referensi (registri); `packages` juga menjadi bendera `modules` per tenant |
| `packageText` | teks tenant per paket (`tenant_texts` dengan kolom paket) |
| `tenants/<id>.js` → `tenant`, `theme`, `site` | tabel `tenants` + `tenant_settings` (JSON); `site` divalidasi terhadap registri |
| `tenants/<id>.js` → `services`, `portfolio`, `faqs`, ... | tabel konten per tenant (`tenant_id`) |
| `homeText` | konten section per tenant |
| `clients`, `problems`, `industries`, `coverage` | tabel konten section B2B per tenant (`tenant_id`) |
| `inquiry.js` (daftar tanya) | session + `POST /daftar-tanya`; lead disimpan di tabel `inquiries` |
| `shop.js` (keranjang, checkout, lacak) | session/`carts` + `POST /keranjang/checkout` → `orders`, `order_items`; `GET /status-pesanan` dari `orders` |
| `promos`, `orderStatus` | tabel promo per tenant; status pesanan = kolom/tabel status di `orders` |
| `banners`, `services[].tags` | tabel `banners` (urutan, aktif, jadwal tayang) dan tag layanan per tenant |
| `services[].options[].prices`, `faqs[].featured`, `faqGroups[].icon` | `option_values.price_delta`; kolom `featured` pada FAQ; kolom ikon pada kelompok FAQ |
| `resolveSite()` di `main.js` | `SiteConfigResolver` (class PHP), validasi sama |
| `sections.js` (`R.<id>`) | Blade Components `<x-section.services variant="slider" />` |
| `templates/<id>.css` | aset per template, dimuat sesuai `tenant.template` |
| `seo.js` | `<x-seo.head />` dan `<x-seo.json-ld />`, **server-side** |
| `[data-template]` di `<html>` | atribut di layout Blade |
| `preview.js` | tidak dibawa; diganti halaman pengaturan tampilan di panel tenant |

## Catatan

- **SEO di mockup ini dirender JS.** Di produksi wajib server-side (Blade) agar terbaca crawler tanpa JavaScript.
- **Kontras warna tenant belum dijaga otomatis.** Turunan gelap oranye dan hijau WhatsApp sudah dibuat
  cukup gelap (>= 4,5:1 untuk teks pada putih), tetapi warna utama/aksen yang sangat terang tetap perlu
  divalidasi platform saat tenant menyimpannya.
- Beberapa label UI masih tertulis di kode, bukan di data tenant (mis. "Petunjuk Arah", "Chat WhatsApp",
  "Lihat Daftar Harga", teks footer). Pada produksi pindahkan ke berkas bahasa Laravel (`lang/id`).
- `--header-h: 68px` tidak berada pada kelipatan 8px yang dipakai bagian lain.
- Gambar adalah ilustrasi SVG buatan sendiri. Ganti dengan foto tenant di produksi;
  `og:image` sebaiknya JPG/PNG 1200×630.
- Semua 9 halaman internal sudah ada. Slug detail layanan dan detail artikel memakai hash hanya di mockup;
  di Laravel memakai rute `/layanan/{slug}` dan `/artikel/{slug}`.
