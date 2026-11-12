# Printing Website Mockup — Multi-Purpose Printing Business Website

Mockup website UMKM percetakan & fotocopy (HTML5, CSS3, Bootstrap 5, Vanilla JS).
Dirancang agar mudah dikonversi menjadi aplikasi **Laravel multi-tenant** (Blade Components).

> Status: **Tahap 2 selesai (homepage)**. Halaman internal dikerjakan di Tahap 3.
> README ini akan dilengkapi di Tahap 5.

## Cara menjalankan

Tidak perlu backend atau build. Buka `index.html` langsung di browser.
Semua library (Bootstrap CSS, Lucide, font Plus Jakarta Sans) sudah disertakan lokal di `assets/`,
jadi mockup tetap tampil benar tanpa internet (kecuali embed Google Maps).

## Struktur

```
index.html                 Homepage (14 section)
assets/
  css/style.css            Design system + komponen global (satu file untuk semua halaman)
  js/data.js               "Database" tenant dummy (profil, tema, kategori, layanan, harga, dst.)
  js/main.js               Komponen (render dari data.js) + interaksi
  vendor/                  bootstrap.min.css, lucide.min.js
  fonts/                   Plus Jakarta Sans (woff2)
  images/                  logo/, services/, portfolio/, articles/, general/ (ilustrasi SVG orisinal)
```

## Mengganti tenant (multi-tenant)

Semua data bisnis ada di `assets/js/data.js`. Ganti isi objek `tenant`, `theme`, `categories`,
`services`, `portfolio`, `testimonials`, `faqs`, `articles` — tanpa mengubah HTML atau CSS.

| Yang diganti | Lokasi di data.js |
|---|---|
| Nama, tagline, logo, alamat, jam buka | `tenant` |
| Nomor WhatsApp (format `62…`, tanpa `+`) | `tenant.whatsapp` |
| Warna brand | `theme` (diterapkan ke CSS variable) |
| Kategori / layanan / harga | `categories`, `services` |

Tombol WhatsApp memakai `https://wa.me/<nomor>?text=<pesan>`; pesan otomatis dibuat dari nama layanan.

## Pemetaan ke Laravel

| Mockup | Laravel |
|---|---|
| `renderAll()` + fungsi `serviceCard`, `categoryCard`, … di `main.js` | Blade Components `<x-card.service>`, `<x-card.category>`, … |
| `[data-render]` / `[data-component]` | `@foreach` / `<x-… />` |
| `theme` di `data.js` | kolom branding pada tabel `tenants` → CSS variable di layout |
| `routes` di `data.js` | `routes/web.php` (`/layanan/{slug}`, `/portofolio`, `/artikel/{slug}`, …) |

## Catatan Tahap 2

- Header/footer dirender lewat JS dari satu sumber (tidak diulang di tiap file). Di Blade ini otomatis
  menjadi server-side render, sehingga aman untuk SEO.
- Meta SEO, Open Graph, dan JSON-LD (LocalBusiness, FAQPage) ditulis statis di `<head>` setiap halaman sebagai placeholder.
- Gambar adalah ilustrasi SVG buatan sendiri (tanpa masalah lisensi). Ganti dengan foto asli tenant pada versi produksi.
- `og:image` masih mengarah ke SVG; gunakan JPG/PNG 1200×630 pada produksi.
