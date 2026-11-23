/*
 * checkout.js — CHECKOUT, ONGKIR, PEMBAYARAN, dan STATUS PESANAN BERBAYAR (paket Full E-commerce, modules.checkout = 'onsite')
 * ---------------------------------------------------------------------------
 * Alur mockup (SEMUA SIMULASI, tanpa server dan tanpa uang sungguhan):
 *   /keranjang  -> pilih kota tujuan, ongkir per kurir langsung terlihat -> "Lanjut ke Checkout"
 *   /checkout   -> 1 Alamat  2 Pengiriman (ongkir otomatis, pilih kurir)  3 Pembayaran (VA / QRIS / e-wallet, biaya terlihat)
 *               -> buat pesanan -> halaman instruksi bayar di alamat yang sama (#KODE): hitung mundur batas bayar,
 *                  nomor VA atau QR contoh, cara bayar, dan tombol demo "Simulasikan pembayaran berhasil / kedaluwarsa"
 *   /status-pesanan -> tahap Menunggu pembayaran > Dibayar > Diproses > Dikirim (nomor resi) > Selesai; tombol demo memajukan tahap
 * Paket lain: /checkout menampilkan "Halaman tidak tersedia" (noindex); berkas ini tidak membuat apa pun.
 *
 * Keranjang, penyimpanan lokal, dan pengait berasal dari shop.js (PS.shop). Data: tenant.shipping (kurir + tarif dummy),
 * tenant.payment (metode + biaya), window.PLATFORM_REGIONS (tujuan dummy, regions.js), tenant.orderStatus.onsite.
 *
 * PEMETAAN LARAVEL (angka di sini hanya tampilan; SERVER menghitung ulang semuanya):
 *   - POST /checkout: validasi (FormRequest), hitung ulang subtotal dari harga di database, hitung ongkir lewat API kurir
 *     (RajaOngkir / Biteship) dengan area asal toko dan tujuan + berat, hitung biaya pembayaran, lalu buat baris
 *     orders + order_items + shipments + payments dalam satu transaksi. Jangan pernah memakai total atau ongkir dari browser.
 *   - Pembayaran: Midtrans (Snap/Core API) atau Xendit (invoice/VA) membuat VA/QR/e-wallet charge; halaman instruksi membaca
 *     payments.expires_at dan payments.payload. Status HANYA berubah lewat webhook yang diverifikasi (signature key),
 *     idempoten (external_id + status), dan memicu event OrderPaid. Tugas terjadwal membatalkan order yang kedaluwarsa.
 *   - Status pesanan: GET /status-pesanan?kode= membaca orders.status + shipments.resi; admin memajukan tahap dan mengisi resi.
 */
(function () {
  'use strict';

  var PS = window.PrintSite;
  if (!PS || !PS.shop) return;
  var SHOP = PS.shop, R = PS.pages;
  if (!SHOP.onsite) { if (R) R.checkout = function () { return SHOP.unavailable('checkout'); }; return; }

  var D = PS.data, esc = PS.esc, ico = PS.ico, url = PS.url, rupiah = PS.rupiah, K = PS.pageKit;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var obj = function (v) { return v && typeof v === 'object' && !Array.isArray(v) ? v : {}; };
  var arr = function (v) { return Array.isArray(v) ? v : []; };
  var num = function (v, d) { v = Number(v); return isFinite(v) ? v : d; };
  var warn = function (m) { if (window.console) console.warn('[checkout.js] ' + m); };
  var PHONE_RE = SHOP.PHONE_RE, EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/, CODE_RE = /^[A-Z0-9\-]{4,30}$/;
  var tenantId = SHOP.tenantId, FORM_KEY = 'ps-ship:' + tenantId;

  /* ------------------------------------------------------------------ teks */
  var X = Object.assign({
    title: 'Checkout', lead: 'Isi alamat, pilih pengiriman, lalu bayar. Ongkos kirim dihitung otomatis.',
    steps: ['Alamat', 'Pengiriman', 'Pembayaran'], stepperLabel: 'Langkah checkout',
    s1: 'Data pemesan dan alamat', s2: 'Pilih pengiriman', s3: 'Pilih pembayaran',
    name: 'Nama penerima', namePh: 'Nama lengkap', nameErr: 'Isi nama penerima, minimal 2 huruf.',
    phone: 'Nomor WhatsApp', phonePh: 'mis. 0812-3456-7890', phoneErr: 'Isi nomor WhatsApp yang valid, mis. 081234567890.',
    email: 'Email', emailPh: 'nama@email.com', emailErr: 'Isi alamat email yang valid, mis. nama@email.com.',
    delivery: 'Cara menerima', ship: 'Kirim ke alamat', pickup: 'Ambil di toko',
    region: 'Kota tujuan', regionPh: 'Pilih kota tujuan', regionErr: 'Pilih kota tujuan.',
    address: 'Alamat lengkap', addressPh: 'Jalan, nomor, RT/RW, kecamatan', addressErr: 'Isi alamat lengkap, minimal 10 karakter.',
    postal: 'Kode pos', postalErr: 'Isi kode pos 5 angka.', note: 'Catatan (opsional)', notePh: 'Tenggat, patokan alamat, atau permintaan khusus.',
    next1: 'Lanjut ke Pengiriman', next2: 'Lanjut ke Pembayaran', back: 'Kembali', change: 'Ubah',
    weightLine: 'Berat {kg} kg (dibulatkan menjadi {bill} kg), dikirim dari {origin} ke {dest}.',
    courierErr: 'Pilih salah satu layanan pengiriman.', noCourier: 'Belum ada layanan pengiriman ke kota ini. Pilih kota lain atau ambil di toko.',
    pickupTitle: 'Ambil di toko', pickupFree: 'Gratis', methodErr: 'Pilih salah satu metode pembayaran.', feeLabel: 'Biaya pembayaran', free: 'Gratis',
    pay: 'Buat Pesanan & Bayar', sumTitle: 'Ringkasan pesanan', subtotal: 'Subtotal barang', shipping: 'Ongkos kirim', fee: 'Biaya pembayaran', total: 'Total bayar',
    shipPending: 'Dihitung setelah memilih kurir', feePending: 'Dihitung setelah memilih metode', secure: 'Simulasi: tidak ada uang sungguhan yang diproses.',
    estLabel: 'Cek ongkos kirim ke', estPh: 'Pilih kota tujuan', estNone: 'Belum ada layanan pengiriman ke kota ini.', estPick: 'Pilih kota tujuan',
    estCheapest: 'termurah', estTotal: 'Estimasi total', estGo: 'Lanjut ke Checkout', estWeight: 'Berat total {kg} kg, ditagih {bill} kg.',
    payTitle: 'Selesaikan pembayaran', payDue: 'Bayar sebelum', payLeft: 'Sisa waktu', payAmount: 'Total tagihan', payVa: 'Nomor Virtual Account', payQr: 'Pindai kode QR',
    payQrNote: 'Contoh tampilan, bukan kode QR sungguhan.', payAccount: 'a.n.', copy: 'Salin', copied: 'Disalin', copyFail: 'Tidak bisa menyalin otomatis. Salin manual.',
    payHow: 'Cara membayar', openApp: 'Buka {name}', openAppNote: 'Contoh: di perangkat sebenarnya aplikasi {name} akan terbuka.',
    demoTitle: 'Mode demo', demoLead: 'Di sistem sebenarnya status berubah otomatis lewat notifikasi dari penyedia pembayaran. Di sini Anda bisa mensimulasikannya.',
    demoPay: 'Simulasikan pembayaran berhasil', demoExpire: 'Simulasikan kedaluwarsa',
    paidTitle: 'Pembayaran diterima', paidText: 'Terima kasih! Pesanan Anda masuk antrean produksi. Pantau tahapannya di halaman lacak pesanan.',
    expiredTitle: 'Waktu pembayaran habis', expiredText: 'Pesanan dibatalkan otomatis karena belum dibayar sampai batas waktu. Barang di pesanan ini bisa dimasukkan kembali ke keranjang.',
    reorder: 'Masukkan ke keranjang lagi', track: 'Lacak pesanan', keepShopping: 'Lanjut belanja', code: 'Kode pesanan', paidAt: 'Dibayar pada',
    orderDetail: 'Rincian pesanan', via: 'Metode', toLabel: 'Tujuan',
    statusPay: 'Pembayaran', statusPayPending: 'Menunggu pembayaran', statusPayPaid: 'Sudah dibayar', statusPayExpired: 'Kedaluwarsa', payNow: 'Bayar sekarang',
    courier: 'Kurir', resi: 'Nomor resi', resiNone: 'Belum ada (diisi saat pesanan dikirim)', pickupInfo: 'Ambil di toko',
    demoAdvance: 'Demo: majukan ke tahap berikutnya', demoNote: 'Tombol demo hanya untuk pesanan di perangkat ini.'
  }, obj(obj(D.pageText).checkout));

  /* ----------------------------------------------------------- data dari tenant */
  var REG = arr(window.PLATFORM_REGIONS).filter(function (r) { return r && typeof r.id === 'string' && typeof r.city === 'string' && typeof r.province === 'string' && typeof r.group === 'string'; });
  var SH = obj(D.shipping), PY = obj(D.payment);
  if (!Object.keys(SH).length) warn('tenant.shipping tidak ada: ongkir tidak tersedia, hanya ambil di toko.');
  var GROUPS = obj(SH.groups);
  var COURIERS = arr(SH.couriers).filter(function (c) { return c && typeof c.id === 'string' && typeof c.name === 'string'; }).map(function (c) {
    return { id: c.id, name: c.name, services: arr(c.services).filter(function (s) { return s && typeof s.id === 'string' && isFinite(Number(s.base)) && isFinite(Number(s.perKg)); }).map(function (s) {
      return { id: s.id, name: String(s.name || s.id), note: typeof s.note === 'string' ? s.note : '', etaDays: arr(s.etaDays).length === 2 ? [num(s.etaDays[0], 1), num(s.etaDays[1], 2)] : [2, 3], etaText: typeof s.etaText === 'string' ? s.etaText : '',
        base: Math.max(0, Number(s.base)), perKg: Math.max(0, Number(s.perKg)), groups: arr(s.groups).length ? s.groups : null, maxKg: num(s.maxKg, 0) };
    }) };
  });
  var PICKUP = obj(SH.pickup).enabled === false ? null : Object.assign({ label: X.pickupTitle, note: '' }, obj(SH.pickup));
  var GROUP_LABEL = Object.assign({ va: 'Virtual Account', qris: 'QRIS', ewallet: 'E-Wallet' }, obj(PY.groups));
  var METHODS = arr(PY.methods).filter(function (m) { return m && /^[a-z0-9\-]{2,20}$/.test(m.id || '') && typeof m.name === 'string' && typeof m.group === 'string'; }).map(function (m) {
    return { id: m.id, group: m.group, name: m.name, prefix: /^\d{3,8}$/.test(m.prefix || '') ? m.prefix : '', fee: { flat: Math.max(0, num(obj(m.fee).flat, 0)), percent: Math.max(0, num(obj(m.fee).percent, 0)) },
      steps: arr(m.steps).filter(function (t) { return typeof t === 'string'; }) };
  });
  if (!METHODS.length) warn('tenant.payment.methods kosong: pembayaran tidak tersedia.');
  var EXPIRY_MS = Math.max(1, num(PY.expiryMinutes, 1440)) * 60000;
  var ONS = obj(obj(D.orderStatus).onsite);
  var STEPS = arr(ONS.steps).filter(function (s) { return s && s.title; });
  if (STEPS.length !== 5) STEPS = [
    { title: 'Menunggu pembayaran', text: 'Selesaikan pembayaran sebelum batas waktu.' }, { title: 'Pembayaran diterima', text: 'Pembayaran terverifikasi.' },
    { title: 'Sedang diproses', text: 'Pesanan sedang dikerjakan.' }, { title: 'Dikirim', pickupTitle: 'Siap diambil', text: 'Pesanan diserahkan ke kurir.', pickupText: 'Pesanan siap diambil di toko.' },
    { title: 'Selesai', text: 'Pesanan sudah diterima.' }];
  var EXAMPLES = arr(ONS.examples).filter(function (e) { return e && typeof e.code === 'string' && typeof e.step === 'number'; });

  var region = function (id) { return REG.filter(function (r) { return r.id === id; })[0]; };
  var method = function (id) { return METHODS.filter(function (m) { return m.id === id; })[0]; };
  var regionText = function (r) { return r ? r.city + ', ' + r.province : ''; };
  var fmt = function (t, v) { return String(t).replace(/\{(\w+)\}/g, function (_, k) { return v[k] != null ? v[k] : ''; }); };
  var kgText = function (kg) { return (Math.round(kg * 100) / 100).toLocaleString('id-ID'); };
  var date = function (ts) { try { return new Date(ts).toLocaleString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }); } catch (e) { return ''; } };

  /* --------------------------------------------------------- ongkir dan biaya */
  var round500 = function (n) { return Math.ceil(n / 500 - 1e-9) * 500; };
  function weight() {                                                       /* berat total keranjang */
    var g = 0, wt = obj(SH.weightGram), def = num(SH.defaultWeightGram, 100);
    SHOP.cart().forEach(function (it) { var w = Number(wt[it.slug]); g += (isFinite(w) && w > 0 ? w : def) * it.qty; });
    var kg = g / 1000;
    return { kg: kg, bill: Math.max(1, Math.ceil(kg - 1e-9)) };
  }
  function etaText(d, add) { var a = d[0] + add, b = d[1] + add; return a === 0 && b === 0 ? 'Hari ini' : (a === b ? a : a + '–' + b) + ' hari'; }
  function quotes(regionId, bill) {                                         /* daftar layanan + ongkir ke tujuan, termurah dulu */
    var rg = region(regionId), gp = rg ? obj(GROUPS[rg.group]) : null, out = [];
    if (!rg || !gp || !isFinite(Number(gp.factor))) return out;
    COURIERS.forEach(function (c) { c.services.forEach(function (s) {
      if (s.groups && s.groups.indexOf(rg.group) < 0) return;
      if (s.maxKg && bill > s.maxKg) return;
      out.push({ id: c.id + ':' + s.id, label: c.name + ' ' + s.name, note: s.note, eta: s.etaText || etaText(s.etaDays, num(gp.etaAdd, 0)), cost: round500((s.base + s.perKg * bill) * Number(gp.factor)) });
    }); });
    return out.sort(function (a, b) { return a.cost - b.cost || a.label.localeCompare(b.label); });
  }
  function feeOf(m, base) { return m ? Math.round(m.fee.flat + base * m.fee.percent / 100) : 0; }
  function feeText(m, base) { return feeOf(m, base) ? rupiah(feeOf(m, base)) : X.free; }

  /* -------------------------------------------------------- data formulir (lokal) */
  function cleanForm(raw) {
    var o = obj(raw), s = function (v, n) { return typeof v === 'string' ? v.slice(0, n) : ''; };
    return { name: s(o.name, 80), phone: s(o.phone, 20), email: s(o.email, 120), delivery: o.delivery === 'pickup' ? 'pickup' : 'ship', region: region(o.region) ? o.region : '',
      address: s(o.address, 300), postal: /^\d{5}$/.test(o.postal) ? o.postal : '', note: s(o.note, 600) };
  }
  var loadForm = function () { return SHOP.read(FORM_KEY, cleanForm); };
  var saveForm = function (f) { SHOP.write(FORM_KEY, f); };

  function regionOptions(sel) {
    var groups = [], by = {};
    REG.forEach(function (r) { if (!by[r.province]) { by[r.province] = []; groups.push(r.province); } by[r.province].push(r); });
    return groups.map(function (p) {
      return '<optgroup label="' + esc(p) + '">' + by[p].map(function (r) { return '<option value="' + esc(r.id) + '"' + (r.id === sel ? ' selected' : '') + '>' + esc(r.city) + '</option>'; }).join('') + '</optgroup>';
    }).join('');
  }

  /* ============================================================ KERANJANG: cek ongkir */
  var warnedRegions = false;
  function needRegions() { if (!REG.length && !warnedRegions) { warnedRegions = true; warn('window.PLATFORM_REGIONS kosong atau tidak dimuat (assets/js/regions.js): kota tujuan tidak tersedia.'); } }
  SHOP.cartAside = function () {
    needRegions();
    var CT = SHOP.CT, f = loadForm();
    return '<aside class="cart-summary" aria-labelledby="cart-sum-title"><h2 id="cart-sum-title" class="h5">' + esc(CT.summaryTitle) + '</h2>' +
      '<dl class="sum-rows"><div><dt>' + esc(X.subtotal) + '</dt><dd id="cart-subtotal"></dd></div><div><dt>' + esc(X.shipping) + '</dt><dd id="ship-est"></dd></div></dl>' +
      '<div class="est-box"><label class="form-label" for="est-region">' + esc(X.estLabel) + '</label>' +
      '<select class="form-select" id="est-region"><option value="">' + esc(X.estPh) + '</option>' + regionOptions(f.region) + '</select>' +
      '<ul class="est-list" id="est-list" aria-live="polite"></ul><p class="form-note" id="est-weight"></p></div>' +
      '<p class="cart-total"><span>' + esc(X.estTotal) + '</span><strong id="cart-total"></strong></p><p class="form-note">' + esc(CT.totalNote) + '</p>' +
      '<a class="btn btn-brand btn-lg w-100" id="est-go" href="' + esc(url('checkout')) + '">' + ico('arrow-right') + ' ' + esc(X.estGo) + '</a></aside>';
  };
  SHOP.onTotals = function () {
    var sel = $('#est-region'); if (!sel) return;
    var sub = SHOP.total(), w = weight(), q = sel.value ? quotes(sel.value, w.bill) : [];
    $('#cart-subtotal').textContent = rupiah(sub);
    var cheap = q[0];
    $('#ship-est').textContent = !sel.value ? X.estPick : cheap ? rupiah(cheap.cost) + ' (' + X.estCheapest + ')' : '–';
    $('#cart-total').textContent = rupiah(sub + (cheap ? cheap.cost : 0));
    $('#est-list').innerHTML = !sel.value ? '' : q.length ? q.map(function (x) {
      return '<li><span><strong>' + esc(x.label) + '</strong><small>' + esc(x.eta) + (x.note ? ' • ' + esc(x.note) : '') + '</small></span><b>' + rupiah(x.cost) + '</b></li>';
    }).join('') : '<li class="est-none">' + esc(X.estNone) + '</li>';
    $('#est-weight').textContent = fmt(X.estWeight, { kg: kgText(w.kg), bill: w.bill });
  };
  SHOP.afterCart = function (root) {
    var sel = $('#est-region', root);
    sel.addEventListener('change', function () { var f = loadForm(); f.region = sel.value; saveForm(f); SHOP.onTotals(); });
    SHOP.onTotals();
  };

  /* ================================================================== CHECKOUT */
  var S = { step: 1, max: 1, data: cleanForm(null), courier: '', method: '' };
  var timer = null;
  var stopTimer = function () { if (timer) { window.clearInterval(timer); timer = null; } };

  function totals() {
    var sub = SHOP.total(), w = weight(), q = S.data.delivery === 'ship' && S.data.region ? quotes(S.data.region, w.bill).filter(function (x) { return x.id === S.courier; })[0] : null;
    var ship = q ? q.cost : 0, m = method(S.method), fee = feeOf(m, sub + ship);
    return { sub: sub, w: w, quote: q, ship: ship, method: m, fee: fee, total: sub + ship + fee };
  }
  function field(id, label, input, err, cls) {
    return '<div class="mb-3' + (cls ? ' ' + cls : '') + '" data-field="' + id + '"><label class="form-label" for="co-' + id + '">' + esc(label) + '</label>' + input +
      (err ? '<div class="invalid-msg" id="co-' + id + '-err" hidden>' + esc(err) + '</div>' : '') + '</div>';
  }
  function stepper() {
    return '<ol class="co-stepper" aria-label="' + esc(X.stepperLabel) + '">' + X.steps.map(function (t, i) {
      var n = i + 1, st = n < S.step ? 'done' : n === S.step ? 'current' : 'todo', can = n <= S.max && n !== S.step;
      var inner = '<span class="n" aria-hidden="true">' + (n < S.step ? ico('check') : n) + '</span><span class="t">' + esc(t) + '</span>';
      return '<li class="is-' + st + '"' + (n === S.step ? ' aria-current="step"' : '') + '>' + (can ? '<button type="button" data-co-go="' + n + '">' + inner + '</button>' : '<span class="co-stepper-item">' + inner + '</span>') + '</li>';
    }).join('') + '</ol>';
  }
  function panel1() {
    var d = S.data, shipOn = d.delivery === 'ship';
    return '<section class="co-step" data-step="1" aria-labelledby="co-h1"><h2 class="h5" id="co-h1" tabindex="-1">' + esc(X.s1) + '</h2>' +
      field('name', X.name + ' *', '<input class="form-control" id="co-name" name="name" maxlength="80" autocomplete="name" placeholder="' + esc(X.namePh) + '" value="' + esc(d.name) + '" required aria-describedby="co-name-err">', X.nameErr) +
      '<div class="row g-3"><div class="col-md-6">' + field('phone', X.phone + ' *', '<input class="form-control" id="co-phone" name="phone" type="tel" inputmode="tel" maxlength="20" autocomplete="tel" placeholder="' + esc(X.phonePh) + '" value="' + esc(d.phone) + '" required aria-describedby="co-phone-err">', X.phoneErr) + '</div>' +
      '<div class="col-md-6">' + field('email', X.email + ' *', '<input class="form-control" id="co-email" name="email" type="email" maxlength="120" autocomplete="email" placeholder="' + esc(X.emailPh) + '" value="' + esc(d.email) + '" required aria-describedby="co-email-err">', X.emailErr) + '</div></div>' +
      (PICKUP ? '<fieldset class="mb-3 co-delivery"><legend class="form-label">' + esc(X.delivery) + '</legend>' +
        '<label class="co-radio"><input type="radio" name="delivery" value="ship"' + (shipOn ? ' checked' : '') + '> <span>' + esc(X.ship) + '</span></label>' +
        '<label class="co-radio"><input type="radio" name="delivery" value="pickup"' + (shipOn ? '' : ' checked') + '> <span>' + esc(X.pickup) + '</span></label></fieldset>' : '') +
      '<div id="co-ship-fields"' + (shipOn ? '' : ' hidden') + '>' +
      field('region', X.region + ' *', '<select class="form-select" id="co-region" name="region" required aria-describedby="co-region-err"><option value="">' + esc(X.regionPh) + '</option>' + regionOptions(d.region) + '</select>', X.regionErr) +
      field('address', X.address + ' *', '<textarea class="form-control" id="co-address" name="address" rows="3" maxlength="300" autocomplete="street-address" placeholder="' + esc(X.addressPh) + '" aria-describedby="co-address-err">' + esc(d.address) + '</textarea>', X.addressErr) +
      field('postal', X.postal + ' *', '<input class="form-control" id="co-postal" name="postal" inputmode="numeric" maxlength="5" autocomplete="postal-code" value="' + esc(d.postal) + '" aria-describedby="co-postal-err">', X.postalErr, 'co-postal') + '</div>' +
      field('note', X.note, '<textarea class="form-control" id="co-note" name="note" rows="2" maxlength="600" placeholder="' + esc(X.notePh) + '">' + esc(d.note) + '</textarea>') +
      '<div class="visually-hidden" aria-hidden="true"><label>Jangan diisi <input type="text" name="website" tabindex="-1" autocomplete="off"></label></div>' +
      '<div class="co-actions"><a class="btn btn-outline-brand" href="' + esc(url('cart')) + '">' + esc(X.back) + '</a><button type="button" class="btn btn-brand" data-co-next="1">' + esc(X.next1) + '</button></div></section>';
  }
  function panel2() {
    var d = S.data, w = weight(), body;
    if (d.delivery === 'pickup') {
      body = '<div class="co-pickup">' + ico('store', 'i-lg') + '<div><strong>' + esc(PICKUP ? PICKUP.label : X.pickupTitle) + ' — ' + esc(X.pickupFree) + '</strong><p>' + esc((PICKUP && PICKUP.note) || '') + '</p><p class="mb-0">' + esc(D.tenant.address || '') + '</p></div></div>';
    } else {
      var q = quotes(d.region, w.bill), rg = region(d.region);
      if (!q.some(function (x) { return x.id === S.courier; })) S.courier = q[0] ? q[0].id : '';
      body = '<p class="form-note mt-0">' + esc(fmt(X.weightLine, { kg: kgText(w.kg), bill: w.bill, origin: SH.originLabel || D.tenant.city || '', dest: regionText(rg) })) + '</p>' +
        (q.length ? '<fieldset class="co-opts" aria-describedby="co-courier-err"><legend class="visually-hidden">' + esc(X.s2) + '</legend>' + q.map(function (x) {
          return '<label class="co-opt"><input type="radio" name="courier" value="' + esc(x.id) + '"' + (x.id === S.courier ? ' checked' : '') + '><span class="co-opt-main"><strong>' + esc(x.label) + '</strong><small>' + esc(x.note ? x.note + ' • ' : '') + 'estimasi ' + esc(x.eta) + '</small></span><span class="co-opt-price">' + rupiah(x.cost) + '</span></label>';
        }).join('') + '</fieldset>' : '<div class="status-empty" role="alert">' + ico('truck') + '<p>' + esc(X.noCourier) + '</p></div>') +
        '<div class="invalid-msg" id="co-courier-err" hidden>' + esc(X.courierErr) + '</div>';
    }
    return '<section class="co-step" data-step="2" aria-labelledby="co-h2" hidden><h2 class="h5" id="co-h2" tabindex="-1">' + esc(X.s2) + '</h2>' + body +
      '<div class="co-actions"><button type="button" class="btn btn-outline-brand" data-co-go="1">' + esc(X.back) + '</button><button type="button" class="btn btn-brand" data-co-next="2">' + esc(X.next2) + '</button></div></section>';
  }
  function panel3() {
    var base = SHOP.total() + totals().ship, groups = [], by = {};
    METHODS.forEach(function (m) { if (!by[m.group]) { by[m.group] = []; groups.push(m.group); } by[m.group].push(m); });
    var list = groups.map(function (g) {
      return '<fieldset class="co-opts"><legend class="co-group">' + esc(GROUP_LABEL[g] || g) + '</legend>' + by[g].map(function (m) {
        return '<label class="co-opt"><input type="radio" name="method" value="' + esc(m.id) + '"' + (m.id === S.method ? ' checked' : '') + '><span class="co-opt-main"><strong>' + esc(m.name) + '</strong></span><span class="co-opt-price co-opt-fee">' + esc(X.feeLabel) + ' ' + esc(feeText(m, base)) + '</span></label>';
      }).join('') + '</fieldset>';
    }).join('');
    return '<section class="co-step" data-step="3" aria-labelledby="co-h3" hidden><h2 class="h5" id="co-h3" tabindex="-1">' + esc(X.s3) + '</h2>' +
      (list || '<div class="status-empty" role="alert">' + ico('credit-card') + '<p>Belum ada metode pembayaran.</p></div>') +
      '<div class="invalid-msg" id="co-method-err" hidden>' + esc(X.methodErr) + '</div>' +
      '<div class="co-actions"><button type="button" class="btn btn-outline-brand" data-co-go="2">' + esc(X.back) + '</button><button type="submit" class="btn btn-brand btn-lg" id="co-pay">' + esc(X.pay) + '</button></div>' +
      '<p class="form-note mt-3">' + ico('shield-check') + ' ' + esc(X.secure) + '</p></section>';
  }
  function summaryHtml(t) {
    var items = SHOP.cart().map(function (it) { var s = SHOP.svc(it.slug), o = SHOP.optText(it);
      return '<li><span>' + esc(s.name) + (o ? '<small>' + esc(o) + '</small>' : '') + '<small>' + it.qty + ' ' + esc(s.unit) + '</small></span><b>' + rupiah(SHOP.lineTotal(it)) + '</b></li>'; }).join('');
    return '<ul class="sum-items">' + items + '</ul><dl class="sum-rows"><div><dt>' + esc(X.subtotal) + '</dt><dd>' + rupiah(t.sub) + '</dd></div>' +
      '<div><dt>' + esc(X.shipping) + (t.quote ? ' <small>' + esc(t.quote.label) + '</small>' : '') + '</dt><dd>' + (S.data.delivery === 'pickup' ? esc(X.pickupFree) : t.quote ? rupiah(t.ship) : '<small>' + esc(X.shipPending) + '</small>') + '</dd></div>' +
      '<div><dt>' + esc(X.fee) + (t.method ? ' <small>' + esc(t.method.name) + '</small>' : '') + '</dt><dd>' + (t.method ? esc(t.fee ? rupiah(t.fee) : X.free) : '<small>' + esc(X.feePending) + '</small>') + '</dd></div></dl>' +
      '<p class="cart-total"><span>' + esc(X.total) + '</span><strong>' + rupiah(t.total) + '</strong></p>';
  }
  var renderSummary = function () { var b = $('#co-sum-body'); if (b) b.innerHTML = summaryHtml(totals()); icons(b); };
  function icons(el) { SHOP.icons(el || document); }

  function showStep(n, focus) {
    S.step = n; S.max = Math.max(S.max, n);
    $$('.co-step').forEach(function (p) { p.hidden = parseInt(p.getAttribute('data-step'), 10) !== n; });
    $('#co-stepper').innerHTML = stepper(); icons($('#co-stepper')); renderSummary();
    if (focus) { var h = $('#co-h' + n); if (h) h.focus(); }
  }

  var isShip = function (f) { return !f.elements.delivery || f.elements.delivery.value !== 'pickup'; };      /* tanpa pilihan ambil di toko: selalu kirim */
  var rules = {
    name: function (v) { return v.trim().length >= 2; }, phone: function (v) { return PHONE_RE.test(v.replace(/[\s.\-()]/g, '')); }, email: function (v) { return EMAIL_RE.test(v.trim()); },
    region: function (v, f) { return !isShip(f) || !!region(v); }, address: function (v, f) { return !isShip(f) || v.trim().length >= 10; },
    postal: function (v, f) { return !isShip(f) || /^\d{5}$/.test(v.trim()); }
  };
  function setErr(f, id, bad) {
    var input = f.elements[id], msg = $('#co-' + id + '-err'); if (!input || !msg) return;
    input.classList.toggle('is-invalid', bad); input.setAttribute('aria-invalid', String(bad)); msg.hidden = !bad;
  }
  function collect(f) {
    var d = S.data;
    ['name', 'phone', 'email', 'region', 'address', 'postal', 'note'].forEach(function (k) { if (f.elements[k]) d[k] = f.elements[k].value; });
    d.delivery = isShip(f) ? 'ship' : 'pickup';
    return d;
  }
  function validate1(f) {
    var first = null;
    ['name', 'phone', 'email', 'region', 'address', 'postal'].forEach(function (id) { var bad = !rules[id](f.elements[id].value, f); setErr(f, id, bad); if (bad && !first) first = f.elements[id]; });
    return first;
  }
  function renderSteps() {
    var root = $('#co-root'); stopTimer(); needRegions();
    S.data = loadForm();
    root.innerHTML = '<div class="co-layout"><div class="co-main"><div id="co-stepper"></div><form id="co-form" novalidate aria-label="' + esc(X.title) + '">' + panel1() + '<div id="co-p2"></div><div id="co-p3"></div></form></div>' +
      '<aside class="cart-summary co-summary" aria-labelledby="co-sum-title"><h2 id="co-sum-title" class="h5">' + esc(X.sumTitle) + '</h2><div id="co-sum-body"></div></aside></div>';
    var f = $('#co-form');
    S.step = 1; S.max = 1; S.courier = ''; S.method = '';
    showStep(1, false);
    f.addEventListener('input', function (e) {
      var t = e.target;
      if (t.name && rules[t.name] && t.classList.contains('is-invalid') && rules[t.name](t.value, f)) setErr(f, t.name, false);
    });
    f.addEventListener('blur', function (e) { var t = e.target; if (t.name && rules[t.name]) setErr(f, t.name, !rules[t.name](t.value, f)); }, true);
    f.addEventListener('change', function (e) {
      var t = e.target;
      if (t.name === 'delivery') { var ship = t.value === 'ship'; $('#co-ship-fields').hidden = !ship; if (!ship) ['region', 'address', 'postal'].forEach(function (id) { setErr(f, id, false); }); S.data.delivery = ship ? 'ship' : 'pickup'; renderSummary(); }
      else if (t.name === 'courier') { S.courier = t.value; $('#co-courier-err').hidden = true; renderSummary(); }
      else if (t.name === 'method') { S.method = t.value; $('#co-method-err').hidden = true; renderSummary(); }
    });
    $('.co-main').addEventListener('click', function (e) {                /* stepper ada di luar form: delegasi di pembungkus */
      var go = e.target.closest('[data-co-go]'), nx = e.target.closest('[data-co-next]');
      if (go) { goStep(parseInt(go.getAttribute('data-co-go'), 10), f); return; }
      if (nx) { next(parseInt(nx.getAttribute('data-co-next'), 10), f); }
    });
    f.addEventListener('submit', function (e) { e.preventDefault(); if (f.elements.website.value) return; submit(f); });
  }
  function enter(n) {                                                      /* panel 2 dan 3 dibuat saat dimasuki: ongkir dan biaya mengikuti pilihan terbaru */
    if (n === 2) $('#co-p2').innerHTML = panel2();
    if (n === 3) $('#co-p3').innerHTML = panel3();
    if (n === 2 || n === 3) icons($('#co-form'));
  }
  function goStep(n, f) {
    if (n > S.step) { next(S.step, f); return; }                          /* maju lewat tombol langkah: periksa langkah sekarang dulu */
    collect(f); enter(n); showStep(n, true);
  }
  function next(n, f) {
    if (n === 1) {
      var bad = validate1(f); if (bad) { bad.focus(); return; }
      collect(f); saveForm(S.data); enter(2); showStep(2, true); return;
    }
    if (n === 2) {
      if (S.data.delivery === 'ship' && !quotes(S.data.region, weight().bill).some(function (x) { return x.id === S.courier; })) { $('#co-courier-err').hidden = false; return; }
      enter(3); showStep(3, true);
    }
  }
  function refFor(m, code) {
    if (!m.prefix) return '';
    var digits = ''; for (var i = 0; i < code.length; i++) digits += String(code.charCodeAt(i) * (i + 3) % 10);
    return m.prefix + (digits + '0000000000').slice(0, 11);
  }
  function submit(f) {
    var cart = SHOP.cart(); if (!cart.length) return;
    if (!S.method || !method(S.method)) { $('#co-method-err').hidden = false; return; }
    var t = totals();
    if (S.data.delivery === 'ship' && !t.quote) { goStep(2, f); $('#co-courier-err').hidden = false; return; }
    var m = t.method, code = SHOP.orderCode(), now = Date.now(), rg = region(S.data.region), ship = S.data.delivery === 'ship';
    var order = { kind: 'onsite', code: code, ts: now, step: 0, delivery: ship ? 'ship' : 'pickup', subtotal: t.sub, shippingCost: t.ship, fee: t.fee, total: t.total,
      items: cart.map(function (it) { var s = SHOP.svc(it.slug); return { name: s.name, qty: it.qty, unit: s.unit, slug: it.slug, opts: it.opts }; }),
      customer: { name: S.data.name.trim(), phone: S.data.phone.trim(), email: S.data.email.trim(), address: ship ? S.data.address.trim() : '', postal: ship ? S.data.postal.trim() : '', note: S.data.note.trim(), regionLabel: ship ? regionText(rg) : '' },
      shipping: { label: ship ? t.quote.label : '', eta: ship ? t.quote.eta : '', kg: t.w.bill, resi: '' },
      payment: { method: m.id, name: m.name, group: m.group, status: 'pending', amount: t.total, ref: refFor(m, code), expiresAt: now + EXPIRY_MS, paidAt: 0 } };
    SHOP.setOrders([order].concat(SHOP.orders()).slice(0, 10));
    SHOP.clearCart();
    try { window.history.replaceState(null, '', '#' + code); } catch (e) { window.location.hash = code; }
    render();
  }

  /* ============================================================ INSTRUKSI BAYAR */
  function expireCheck(o) {
    if (o.payment.status === 'pending' && o.payment.expiresAt && Date.now() >= o.payment.expiresAt) { o.payment.status = 'expired'; SHOP.saveOrders(); return true; }
    return false;
  }
  var findOrder = function (code) { return SHOP.orders().filter(function (o) { return o.kind === 'onsite' && o.code === code; })[0]; };
  function qrSvg(seed) {                                                    /* pola acak dari kode pesanan: HANYA hiasan contoh */
    var h = 2166136261; for (var i = 0; i < seed.length; i++) { h ^= seed.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; }
    var rnd = function () { h = (Math.imul(h, 1664525) + 1013904223) >>> 0; return h / 4294967296; };
    var N = 25, path = '';
    var finder = function (x, y) { var corner = [[0, 0], [N - 7, 0], [0, N - 7]]; for (var c = 0; c < 3; c++) {
      var dx = x - corner[c][0], dy = y - corner[c][1];
      if (dx >= -1 && dx <= 7 && dy >= -1 && dy <= 7) return dx < 0 || dy < 0 || dx > 6 || dy > 6 ? 0 : (dx === 0 || dy === 0 || dx === 6 || dy === 6 || (dx >= 2 && dx <= 4 && dy >= 2 && dy <= 4)) ? 1 : 0; } return -1; };
    for (var y = 0; y < N; y++) for (var x = 0; x < N; x++) { var fv = finder(x, y), on = fv === -1 ? rnd() > 0.52 : fv === 1; if (on) path += 'M' + x + ' ' + y + 'h1v1h-1z'; }
    return '<svg class="pay-qr" viewBox="-2 -2 ' + (N + 4) + ' ' + (N + 4) + '" role="img" aria-label="' + esc(X.payQr + ' (contoh)') + '" shape-rendering="crispEdges"><rect x="-2" y="-2" width="' + (N + 4) + '" height="' + (N + 4) + '" fill="#fff"/><path d="' + path + '" fill="#111"/></svg>';
  }
  var groupVa = function (v) { return String(v).replace(/(.{4})/g, '$1 ').trim(); };
  function copyBtn(text, label) { return '<button type="button" class="btn btn-sm btn-outline-brand" data-copy="' + esc(text) + '" aria-label="' + esc(X.copy + ' ' + label) + '">' + ico('copy') + ' ' + esc(X.copy) + '</button>'; }
  function orderSummary(o) {
    return '<ul class="sum-items">' + o.items.map(function (i) { return '<li><span>' + esc(i.name) + '<small>' + i.qty + ' ' + esc(i.unit) + '</small></span></li>'; }).join('') + '</ul>' +
      '<dl class="sum-rows"><div><dt>' + esc(X.subtotal) + '</dt><dd>' + rupiah(o.subtotal) + '</dd></div>' +
      '<div><dt>' + esc(X.shipping) + (o.shipping.label ? ' <small>' + esc(o.shipping.label) + '</small>' : '') + '</dt><dd>' + (o.delivery === 'pickup' ? esc(X.pickupFree) : rupiah(o.shippingCost)) + '</dd></div>' +
      '<div><dt>' + esc(X.fee) + '</dt><dd>' + (o.fee ? rupiah(o.fee) : esc(X.free)) + '</dd></div></dl><p class="cart-total"><span>' + esc(X.total) + '</span><strong>' + rupiah(o.total) + '</strong></p>' +
      '<p class="co-dest">' + ico(o.delivery === 'pickup' ? 'store' : 'map-pin') + '<span>' + (o.delivery === 'pickup' ? esc(X.pickupInfo) : '<strong>' + esc(o.customer.name) + '</strong><br>' + esc(o.customer.address) + '<br>' + esc(o.customer.regionLabel) + ' ' + esc(o.customer.postal)) + '</span></p>';
  }
  function payView(o) {
    var root = $('#co-root'), p = o.payment, m = method(p.method) || { name: p.name, steps: [], group: p.group }, st = p.status, main;
    if (st === 'paid') {
      main = '<section class="pay-card pay-card--paid" role="status" tabindex="-1" id="pay-main">' + ico('circle-check', 'i-lg') + '<h2>' + esc(X.paidTitle) + '</h2><p>' + esc(X.paidText) + '</p>' +
        '<p class="order-code"><span>' + esc(X.code) + '</span><strong>' + esc(o.code) + '</strong></p><p class="form-note">' + esc(X.paidAt) + ' ' + esc(date(p.paidAt)) + ' • ' + esc(p.name) + '</p>' +
        '<div class="d-flex flex-wrap gap-2 justify-content-center"><a class="btn btn-brand" href="' + esc(url('orderStatus') + '#' + o.code) + '">' + esc(X.track) + '</a><a class="btn btn-outline-brand" href="' + esc(url('services')) + '">' + esc(X.keepShopping) + '</a></div></section>';
    } else if (st === 'expired') {
      main = '<section class="pay-card pay-card--expired" role="alert" tabindex="-1" id="pay-main">' + ico('clock-alert', 'i-lg') + '<h2>' + esc(X.expiredTitle) + '</h2><p>' + esc(X.expiredText) + '</p>' +
        '<p class="order-code"><span>' + esc(X.code) + '</span><strong>' + esc(o.code) + '</strong></p><div class="d-flex flex-wrap gap-2 justify-content-center"><button type="button" class="btn btn-brand" data-pay-reorder="' + esc(o.code) + '">' + esc(X.reorder) + '</button></div></section>';
    } else {
      var how = m.steps && m.steps.length ? '<details class="pay-how" open><summary>' + esc(X.payHow) + '</summary><ol>' + m.steps.map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') + '</ol></details>' : '';
      var channel = p.ref
        ? '<div class="pay-field"><span>' + esc(m.name) + ' — ' + esc(X.payVa) + '</span><strong class="pay-va">' + esc(groupVa(p.ref)) + '</strong>' + copyBtn(p.ref, X.payVa) + '<small>' + esc(X.payAccount) + ' ' + esc(PY.accountName || D.tenant.name) + '</small></div>'
        : p.group === 'qris' ? '<div class="pay-field pay-field--qr"><span>' + esc(X.payQr) + '</span>' + qrSvg(o.code) + '<small>' + esc(X.payQrNote) + '</small></div>'
        : '<div class="pay-field"><span>' + esc(m.name) + '</span><button type="button" class="btn btn-brand" data-open-app="' + esc(m.name) + '">' + ico('smartphone') + ' ' + esc(fmt(X.openApp, { name: m.name })) + '</button></div>';
      main = '<section class="pay-card" aria-labelledby="pay-title"><p class="pay-chip">' + esc(X.statusPayPending) + '</p><h2 id="pay-title" tabindex="-1">' + esc(X.payTitle) + '</h2>' +
        '<div class="pay-timer" role="timer" aria-label="' + esc(X.payLeft) + '"><span>' + esc(X.payLeft) + '</span><strong data-expiry>--:--:--</strong><small>' + esc(X.payDue) + ' ' + esc(date(p.expiresAt)) + '</small></div>' +
        '<div class="pay-field pay-field--amount"><span>' + esc(X.payAmount) + '</span><strong>' + rupiah(p.amount) + '</strong>' + copyBtn(String(p.amount), X.payAmount) + '</div>' + channel + how +
        '<div class="pay-demo"><strong>' + ico('flask-conical') + ' ' + esc(X.demoTitle) + '</strong><p>' + esc(X.demoLead) + '</p><div class="d-flex flex-wrap gap-2">' +
        '<button type="button" class="btn btn-sm btn-brand" data-pay-sim="' + esc(o.code) + '">' + esc(X.demoPay) + '</button><button type="button" class="btn btn-sm btn-outline-brand" data-pay-expire="' + esc(o.code) + '">' + esc(X.demoExpire) + '</button></div></div></section>';
    }
    root.innerHTML = '<div class="co-layout co-layout--pay">' + main + '<aside class="cart-summary co-summary" aria-labelledby="co-sum-title"><h2 id="co-sum-title" class="h5">' + esc(X.orderDetail) + '</h2>' +
      '<p class="order-code order-code--sm"><span>' + esc(X.code) + '</span><strong>' + esc(o.code) + '</strong></p>' + orderSummary(o) + '</aside></div>';
    icons(root);
    var mainEl = $('#pay-main') || $('#pay-title'); if (mainEl && st !== 'pending') mainEl.focus();
    stopTimer();
    if (st === 'pending') {
      var tick = function () {
        var el = $('[data-expiry]'); if (!el) { stopTimer(); return; }
        var left = Math.max(0, p.expiresAt - Date.now());
        if (!left) { stopTimer(); expireCheck(o); payView(o); return; }
        var s = Math.floor(left / 1000), pad = function (n) { return (n < 10 ? '0' : '') + n; };
        el.textContent = pad(Math.floor(s / 3600)) + ':' + pad(Math.floor(s % 3600 / 60)) + ':' + pad(s % 60);
      };
      tick(); timer = window.setInterval(tick, 1000);
    }
  }

  /* -------------------------------------------------------------------- render */
  function render() {
    var root = $('#co-root'); if (!root) return;
    var code = SHOP.hashText().toUpperCase(), o = CODE_RE.test(code) ? findOrder(code) : null;
    if (o) { expireCheck(o); payView(o); return; }
    stopTimer();
    if (!SHOP.cart().length) { root.innerHTML = SHOP.emptyCart(); icons(root); return; }
    renderSteps();
  }

  if (R && K) R.checkout = function () {
    var cr = [{ label: 'Beranda', route: 'home' }, { label: 'Keranjang', route: 'cart' }, { label: X.title }];
    return {
      html: K.crumbs(cr) + K.pageHead(X.title, X.lead) + '<section class="section pt-4" aria-label="' + esc(X.title) + '"><div class="container"><div id="co-root"></div></div></section>',
      meta: { key: 'checkout', route: 'checkout', crumbs: K.crumbMeta(cr), robots: 'noindex, follow' },
      after: function () { render(); window.addEventListener('hashchange', render); }
    };
  };

  /* ===================================================== STATUS PESANAN BERBAYAR */
  function viewOf(code) {
    var o = findOrder(code);
    if (o) { expireCheck(o); return { local: true, o: o, code: o.code, step: o.step, items: o.items.map(function (i) { return i.name + ' (' + i.qty + ' ' + i.unit + ')'; }), total: o.total, courier: o.shipping.label, resi: o.shipping.resi,
      delivery: o.delivery, method: o.payment.name, pay: o.payment.status, expiresAt: o.payment.expiresAt, paidAt: o.payment.paidAt }; }
    var ex = EXAMPLES.filter(function (e) { return e.code.toUpperCase() === code; })[0];
    if (!ex) return null;
    var step = Math.max(0, Math.min(4, Math.round(ex.step)));
    return { local: false, code: ex.code, step: step, items: arr(ex.items).filter(function (i) { return typeof i === 'string'; }), total: num(ex.total, 0), courier: String(ex.courier || ''), resi: String(ex.resi || ''),
      delivery: ex.courier ? 'ship' : 'pickup', method: String(ex.method || ''), pay: step >= 1 ? 'paid' : 'pending', expiresAt: 0, paidAt: 0 };
  }
  SHOP.statusView = function (code) {
    var out = $('#status-result'); if (!out) return;
    var v = CODE_RE.test(code) ? viewOf(code) : null;
    if (!v) { out.innerHTML = '<div class="status-empty" role="alert">' + ico('search-x') + '<p>' + esc((D.pageText && obj(D.pageText.orderStatus).notFound) || 'Kode tidak ditemukan. Periksa kembali kode pesanan Anda, atau hubungi admin lewat WhatsApp.') + '</p></div>'; SHOP.icons(out); return; }
    var pickup = v.delivery === 'pickup', expired = v.pay === 'expired';
    var title = function (s, i) { return i === 3 && pickup && s.pickupTitle ? s.pickupTitle : s.title; };
    var text = function (s, i) { return i === 3 && pickup && s.pickupText ? s.pickupText : s.text; };
    var lis = STEPS.map(function (s, i) {
      var st = i < v.step ? 'done' : i === v.step ? 'current' : 'todo';
      return '<li class="status-step is-' + st + '"' + (st === 'current' ? ' aria-current="step"' : '') + '><span class="status-dot" aria-hidden="true">' + (st === 'done' ? ico('check') : String(i + 1)) + '</span>' +
        '<div><strong>' + esc(title(s, i)) + '</strong><span class="visually-hidden"> — ' + esc(st === 'done' ? 'Selesai' : st === 'current' ? 'Sedang berjalan' : 'Belum') + '</span>' + (text(s, i) ? '<p>' + esc(text(s, i)) + '</p>' : '') + '</div></li>';
    }).join('');
    var payTxt = v.pay === 'paid' ? X.statusPayPaid : expired ? X.statusPayExpired : X.statusPayPending;
    var info = '<dl class="status-info"><div><dt>' + esc(X.statusPay) + '</dt><dd><span class="pay-chip pay-chip--' + v.pay + '">' + esc(payTxt) + '</span>' + (v.method ? ' ' + esc(v.method) : '') +
      (v.local && v.pay === 'pending' ? '<br><a class="btn btn-sm btn-brand mt-2" href="' + esc(url('checkout') + '#' + v.code) + '">' + esc(X.payNow) + '</a>' : '') + '</dd></div>' +
      '<div><dt>' + esc(pickup ? X.pickupInfo : X.courier) + '</dt><dd>' + esc(pickup ? (PICKUP ? PICKUP.label : X.pickupTitle) : v.courier || '-') + '</dd></div>' +
      (pickup ? '' : '<div><dt>' + esc(X.resi) + '</dt><dd>' + (v.resi ? '<strong class="pay-va pay-va--sm">' + esc(v.resi) + '</strong>' : '<small>' + esc(X.resiNone) + '</small>') + '</dd></div>') + '</dl>';
    var adv = v.local && v.pay === 'paid' && v.step < 4 ? '<div class="pay-demo"><p>' + esc(X.demoNote) + '</p><button type="button" class="btn btn-sm btn-outline-brand" data-status-adv="' + esc(v.code) + '">' + esc(X.demoAdvance) + '</button></div>' : '';
    out.innerHTML = '<div class="card-x status-card"><div class="status-head"><div><small>' + esc((D.pageText && obj(D.pageText.orderStatus).label) || 'Kode pesanan') + '</small><h2 class="h4">' + esc(v.code) + '</h2></div>' +
      '<span class="tag-opt">' + esc(expired ? X.statusPayExpired : title(STEPS[v.step], v.step)) + '</span></div>' +
      (v.items.length ? '<p class="status-items"><strong>Isi pesanan:</strong> ' + esc(v.items.join(', ')) + '</p>' : '') + (v.total ? '<p class="status-items"><strong>' + esc(X.total) + ':</strong> ' + rupiah(v.total) + '</p>' : '') + info +
      (expired ? '<div class="status-empty" role="alert">' + ico('clock-alert') + '<p>' + esc(X.expiredText) + '</p>' + (v.local ? '<button type="button" class="btn btn-sm btn-brand" data-pay-reorder="' + esc(v.code) + '">' + esc(X.reorder) + '</button>' : '') + '</div>' : '<ol class="status-steps">' + lis + '</ol>') + adv + '</div>';
    SHOP.icons(out);
  };

  /* ------------------------------------------------------------ aksi (delegasi) */
  function copy(text) {
    var ok = function () { SHOP.say(X.copied); }, fail = function () { SHOP.say(X.copyFail); };
    try { if (navigator.clipboard && navigator.clipboard.writeText) { navigator.clipboard.writeText(text).then(ok, fail); return; } } catch (e) { /* jatuh ke pesan gagal */ }
    fail();
  }
  PS.ready(function () {
    document.addEventListener('click', function (e) {
      var b;
      if ((b = e.target.closest('[data-copy]'))) { copy(b.getAttribute('data-copy')); return; }
      if ((b = e.target.closest('[data-open-app]'))) { SHOP.say(fmt(X.openAppNote, { name: b.getAttribute('data-open-app') })); return; }
      if ((b = e.target.closest('[data-pay-sim]'))) {
        var o = findOrder(b.getAttribute('data-pay-sim')); if (!o || o.payment.status !== 'pending') return;
        o.payment.status = 'paid'; o.payment.paidAt = Date.now(); o.step = Math.max(o.step, 1); SHOP.saveOrders(); payView(o); return;
      }
      if ((b = e.target.closest('[data-pay-expire]'))) {
        var x = findOrder(b.getAttribute('data-pay-expire')); if (!x || x.payment.status !== 'pending') return;
        x.payment.expiresAt = Date.now() - 1; expireCheck(x); payView(x); return;
      }
      if ((b = e.target.closest('[data-pay-reorder]'))) {
        var r = findOrder(b.getAttribute('data-pay-reorder')); if (!r) return;
        SHOP.addLines(r.items.filter(function (i) { return i.slug; })); window.location.href = url('cart'); return;
      }
      if ((b = e.target.closest('[data-status-adv]'))) {
        var a = findOrder(b.getAttribute('data-status-adv')); if (!a || a.payment.status !== 'paid' || a.step >= 4) return;
        a.step += 1;
        if (a.step === 3 && a.delivery === 'ship' && !a.shipping.resi) a.shipping.resi = 'JP' + String(Math.floor(1e9 + Math.random() * 9e9));
        SHOP.saveOrders(); SHOP.statusView(a.code);
      }
    });
  });
})();
