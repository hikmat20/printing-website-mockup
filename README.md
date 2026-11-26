# Demo Template Website Percetakan

Kumpulan **demo statis** template website UMKM percetakan, fotocopy, dan digital printing, untuk ditunjukkan ke
calon klien. Tidak ada backend dan tidak ada build: buka `index.html` di browser. Data usaha hanyalah contoh
(**Sinar Copy & Printing**, Jakarta Timur).

Laravel **tidak** dipakai di repo ini. Untuk klien sungguhan, Laravel dibangun khusus dari template yang dipilih.

## Isi repo

```
index.html          Galeri pilihan template (dihasilkan tools/gallery.py)
classic/ modern/ bold/ katalog/ toko/ grafika/ compro/ etalase/
                    Satu folder per template: HTML statis, semua fitur paketnya bisa dicoba
assets/             Gambar, font, Bootstrap, Lucide, CSS, dan JS interaksi (dipakai bersama)
tools/              Pembuat folder template (bake.py), pembuat galeri (gallery.py), cangkang halaman (shells/)
docs/               engine-reference.md: referensi mesin render (sebagian usang)
```

## Template dan paketnya (terkunci, satu template satu paket)

| Template | Karakter | Paket |
|---|---|---|
| `classic` Klasik | Rapi, profesional | Showcase + WhatsApp |
| `modern` Modern | Lapang, sudut membulat, slider | Company Profile |
| `bold` Bold | Tegas, kontras tinggi | Showcase + WhatsApp |
| `katalog` Katalog B2B | Padat informasi, mega menu, filter samping, daftar tanya | Katalog |
| `toko` Toko | Etalase online, keranjang + checkout ke WhatsApp | Semi e-commerce |
| `grafika` Grafika | Marketplace cetak, produk bertab, konfigurator opsi berharga | Semi e-commerce |
| `compro` Compro | Profil perusahaan editorial, menu samping tetap | Company Profile |
| `etalase` Etalase | Butik online: laci keranjang, ongkir, pembayaran, lacak resi | Full E-commerce |

Paket menentukan halaman dan fitur: Profile (tanpa harga), Showcase (harga + pesan WhatsApp), Katalog (daftar tanya
jadi satu pesan WhatsApp), Semi e-commerce (keranjang, checkout, status pesanan), Full E-commerce (ongkos kirim per
kurir, VA/QRIS/e-wallet dengan hitung mundur, mode demo, status sampai nomor resi).

Tiap folder berisi: beranda, layanan, satu halaman per layanan (`layanan-<slug>.html`), harga (kecuali Profile),
portofolio, tentang, blog, satu halaman per artikel (`artikel-<slug>.html`), kontak, FAQ; plus `keranjang.html`,
`status-pesanan.html` (paket keranjang) dan `checkout.html` (Full E-commerce).

## Perilaku demo

- Setiap halaman punya tombol **"Pilih template lain"** (kiri bawah) kembali ke galeri, dan `noindex`.
- Halaman sudah berisi judul, meta, JSON-LD, header, footer, dan isi di HTML. JS hanya memasang interaksi (menu,
  slider, filter, lightbox, keranjang, checkout). Keranjang, checkout, dan status pesanan dirender saat dibuka
  karena isinya milik pengunjung.
- Keranjang, daftar tanya, dan pesanan disimpan di `localStorage` **per template** (mis. `ps-cart:sinar-copy:toko`),
  jadi tidak saling bocor antar template.
- Pembayaran dan ongkos kirim di Full E-commerce adalah simulasi (tanpa gateway atau API kurir).

## Mengubah demo

Folder template **dihasilkan**; jangan diedit tangan. Ubah sumbernya, lalu bake ulang:

| Mau mengubah | Sumber |
|---|---|
| Isi usaha, layanan, harga, teks | `assets/js/tenants/sinar-copy.js` |
| Tampilan template | `assets/css/templates/<id>.css`, `assets/css/variants.css`, `assets/css/style.css` |
| Susunan beranda, header, paket per template | `assets/js/platform.js` (`templates`, `packages`) |
| Perilaku halaman dan section | `assets/js/pages.js`, `sections.js`, `main.js`, `shop.js`, `checkout.js`, `inquiry.js` |
| Pemetaan template -> paket | `TEMPLATES` di `tools/bake.py` dan `tools/gallery.py` |

```
python3 tools/bake.py            # semua template (atau: python3 tools/bake.py etalase)
python3 tools/gallery.py         # galeri root + tangkapan layar
```

Perlu Python 3, Playwright (Chromium), dan Node. `bake.py` membuka tiap cangkang di `tools/shells/` dengan
`window.PS_STATIC = { template, package, bake: true }`, menyimpan DOM hasil render, lalu menulis
`<template>/<halaman>.html` dengan path `../assets/` dan hanya CSS template itu. Hasilnya deterministik: bake ulang
tanpa perubahan sumber tidak mengubah berkas.

**Menambah template:** buat `assets/css/templates/<id>.css` (aturan di bawah `[data-template="<id>"]`), daftarkan di
`PLATFORM.templates` (`platform.js`), tambahkan ke `TEMPLATES` di kedua skrip `tools/`, tautkan CSS-nya di
`tools/shells/*.html`, lalu bake. Rincian mesin ada di `docs/engine-reference.md`.

## Catatan

- Judul, meta, dan JSON-LD di HTML hasil bake berasal dari data contoh; di aplikasi klien dirender server-side.
- Gambar adalah ilustrasi SVG buatan sendiri; ganti dengan foto klien.
- Ongkos kirim, biaya pembayaran, dan alur status di Full E-commerce adalah model contoh; angka sebenarnya dari
  kurir dan penyedia pembayaran klien.
