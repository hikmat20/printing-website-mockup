/*
 * regions.js — TABEL TUJUAN PENGIRIMAN (DATA DUMMY milik platform, dipakai paket Full E-commerce)
 * ---------------------------------------------------------------------------
 * Hanya agar ongkir bisa dihitung di mockup. `group` menentukan tarif zona di tenant.shipping.groups.
 * Laravel: tabel `regions` (provinsi, kota/kabupaten, kecamatan) diisi dari API kurir; ongkir dihitung server memakai
 * RajaOngkir / Biteship dengan kode area tujuan (BUKAN tabel ini). Daftar ini tidak perlu dibawa ke Laravel.
 * Dimuat hanya di halaman keranjang dan checkout.
 */
window.PLATFORM_REGIONS = [
  { id: 'jakarta-timur',   province: 'DKI Jakarta',        city: 'Jakarta Timur',     group: 'jabodetabek' },
  { id: 'jakarta-selatan', province: 'DKI Jakarta',        city: 'Jakarta Selatan',   group: 'jabodetabek' },
  { id: 'jakarta-pusat',   province: 'DKI Jakarta',        city: 'Jakarta Pusat',     group: 'jabodetabek' },
  { id: 'jakarta-barat',   province: 'DKI Jakarta',        city: 'Jakarta Barat',     group: 'jabodetabek' },
  { id: 'jakarta-utara',   province: 'DKI Jakarta',        city: 'Jakarta Utara',     group: 'jabodetabek' },
  { id: 'bekasi',          province: 'Jawa Barat',         city: 'Kota Bekasi',       group: 'jabodetabek' },
  { id: 'depok',           province: 'Jawa Barat',         city: 'Kota Depok',        group: 'jabodetabek' },
  { id: 'bogor',           province: 'Jawa Barat',         city: 'Kota Bogor',        group: 'jabodetabek' },
  { id: 'tangerang',       province: 'Banten',             city: 'Kota Tangerang',    group: 'jabodetabek' },
  { id: 'tangsel',         province: 'Banten',             city: 'Tangerang Selatan', group: 'jabodetabek' },
  { id: 'bandung',         province: 'Jawa Barat',         city: 'Kota Bandung',      group: 'jawa' },
  { id: 'cirebon',         province: 'Jawa Barat',         city: 'Kota Cirebon',      group: 'jawa' },
  { id: 'semarang',        province: 'Jawa Tengah',        city: 'Kota Semarang',     group: 'jawa' },
  { id: 'yogyakarta',      province: 'DI Yogyakarta',      city: 'Kota Yogyakarta',   group: 'jawa' },
  { id: 'surabaya',        province: 'Jawa Timur',         city: 'Kota Surabaya',     group: 'jawa' },
  { id: 'malang',          province: 'Jawa Timur',         city: 'Kota Malang',       group: 'jawa' },
  { id: 'medan',           province: 'Sumatera Utara',     city: 'Kota Medan',        group: 'sumatera' },
  { id: 'padang',          province: 'Sumatera Barat',     city: 'Kota Padang',       group: 'sumatera' },
  { id: 'pekanbaru',       province: 'Riau',               city: 'Kota Pekanbaru',    group: 'sumatera' },
  { id: 'palembang',       province: 'Sumatera Selatan',   city: 'Kota Palembang',    group: 'sumatera' },
  { id: 'bandar-lampung',  province: 'Lampung',            city: 'Kota Bandar Lampung', group: 'sumatera' },
  { id: 'denpasar',        province: 'Bali',               city: 'Kota Denpasar',     group: 'bali-nusa' },
  { id: 'mataram',         province: 'Nusa Tenggara Barat', city: 'Kota Mataram',     group: 'bali-nusa' },
  { id: 'balikpapan',      province: 'Kalimantan Timur',   city: 'Kota Balikpapan',   group: 'kalimantan' },
  { id: 'pontianak',       province: 'Kalimantan Barat',   city: 'Kota Pontianak',    group: 'kalimantan' },
  { id: 'banjarmasin',     province: 'Kalimantan Selatan', city: 'Kota Banjarmasin',  group: 'kalimantan' },
  { id: 'makassar',        province: 'Sulawesi Selatan',   city: 'Kota Makassar',     group: 'sulawesi' },
  { id: 'manado',          province: 'Sulawesi Utara',     city: 'Kota Manado',       group: 'sulawesi' },
  { id: 'ambon',           province: 'Maluku',             city: 'Kota Ambon',        group: 'maluku-papua' },
  { id: 'jayapura',        province: 'Papua',              city: 'Kota Jayapura',     group: 'maluku-papua' }
];
