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
index.html?template=modern                 template: classic | modern | bold
index.html?template=bold&font=roboto&hfont=montserrat
index.html?primary=%230a7d4f&accent=%23e0a100
index.html?header=topbar&cards=outlined&buttons=pill
```

Parameter URL hanya untuk pratinjau. Di produksi pengaturan ini disimpan di database tenant.

## Struktur

```
index.html                    Cangkang beranda: <main id="main"> diisi dari data
assets/
  js/
    platform.js               DATA PLATFORM: rute, navigasi, registri (font, header, kartu,
                              tombol, section, template)
    tenants/sinar-copy.js     DATA TENANT: profil, tema, isi, teks section, pengaturan `site`
    main.js                   Inti: validasi konfigurasi, tema, header/footer, interaksi, hook modul
    sections.js               Renderer 12 section beranda + varian
    seo.js                    <title>, meta, canonical, Open Graph, JSON-LD dari data
    preview.js                Panel ?customize (khusus mockup)
    data.js                   LAMA, tidak dipakai lagi (lihat "Catatan")
  css/
    fonts.css                 @font-face 12 font (woff2 lokal)
    style.css                 Design system + komponen; semua warna lewat token
    variants.css              CSS struktural untuk opsi global dan varian komponen
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

Atribut pada `<html>` yang ditulis `main.js`: `data-template`, `data-header`, `data-card`, `data-buttons`.

## Kustomisasi tenant (`site` di data tenant)

```js
site: {
  template: 'classic',                       // wajib: salah satu template di registri
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
| `platform.js` (`fonts`, `templates`, `sections`, ...) | `config/platform.php` atau tabel referensi (registri) |
| `tenants/<id>.js` → `tenant`, `theme`, `site` | tabel `tenants` + `tenant_settings` (JSON); `site` divalidasi terhadap registri |
| `tenants/<id>.js` → `services`, `portfolio`, `faqs`, ... | tabel konten per tenant (`tenant_id`) |
| `homeText` | konten section per tenant |
| `resolveSite()` di `main.js` | `SiteConfigResolver` (class PHP), validasi sama |
| `sections.js` (`R.<id>`) | Blade Components `<x-section.services variant="slider" />` |
| `templates/<id>.css` | aset per template, dimuat sesuai `tenant.template` |
| `seo.js` | `<x-seo.head />` dan `<x-seo.json-ld />`, **server-side** |
| `[data-template]` di `<html>` | atribut di layout Blade |
| `preview.js` | tidak dibawa; diganti halaman pengaturan tampilan di panel tenant |

## Catatan

- **SEO di mockup ini dirender JS.** Di produksi wajib server-side (Blade) agar terbaca crawler tanpa JavaScript.
- **Kontras warna tidak dijaga otomatis.** Warna utama yang sangat terang membuat teks putih sulit dibaca.
  Platform perlu memvalidasi kontras saat tenant menyimpan warna.
- **`assets/js/data.js` adalah berkas lama** (sebelum data dipisah menjadi platform dan tenant). Tidak dimuat
  oleh halaman mana pun; disimpan sementara sebagai rujukan.
- **Kontras beberapa warna bawaan Sinar Copy di bawah 4,5:1** (diukur oleh pemeriksa terpisah): teks eyebrow
  oranye `#D9741A` di atas putih (3,25:1), serta teks putih pada keadaan hover tombol aksen dan WhatsApp
  (3,1–3,25:1). Belum diubah supaya tampilan Klasik tetap sama; perlu keputusan desain.
- Beberapa label UI masih tertulis di kode, bukan di data tenant (mis. "Petunjuk Arah", "Chat WhatsApp",
  "Lihat Daftar Harga", teks footer). Pada produksi pindahkan ke berkas bahasa Laravel (`lang/id`).
- `--header-h: 68px` tidak berada pada kelipatan 8px yang dipakai bagian lain.
- Gambar adalah ilustrasi SVG buatan sendiri. Ganti dengan foto tenant di produksi;
  `og:image` sebaiknya JPG/PNG 1200×630.
- Halaman internal (layanan, detail layanan, harga, portofolio, tentang, artikel, detail artikel,
  kontak, FAQ) belum ada di repo ini. Pemetaan rutenya sudah ada di `PLATFORM.routes`.
