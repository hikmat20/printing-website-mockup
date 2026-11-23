/*
 * shop.js — KERANJANG, CHECKOUT KE WHATSAPP, dan STATUS PESANAN (paket Semi e-commerce, modules.order = 'cart')
 * ---------------------------------------------------------------------------
 * Alur mockup: tambah layanan ke keranjang -> /keranjang (ubah jumlah, isi data pemesan, pilih ambil/antar)
 * -> satu pesan WhatsApp berisi kode pesanan, rincian, dan estimasi total -> /status-pesanan (contoh pelacakan).
 * TIDAK ADA pembayaran, akun, atau login di paket Semi e-commerce: itu bagian Laravel (lihat README).
 * Paket Full E-commerce (modules.checkout = 'onsite') memakai keranjang yang sama, tetapi checkout, ongkir, dan pembayaran
 * dikerjakan di website oleh checkout.js (simulasi); berkas ini hanya menyediakan keranjang, penyimpanan, dan pengait (PS.shop).
 * Harga di keranjang = ESTIMASI (harga "mulai dari" x jumlah); harga final dikonfirmasi admin lewat WhatsApp.
 *
 * Paket lain: halaman /keranjang dan /status-pesanan menampilkan "Halaman tidak tersedia" (noindex);
 * tidak ada elemen keranjang yang dibuat.
 *
 * Pemetaan Laravel: keranjang = session (tamu) atau tabel carts; checkout = POST /keranjang/checkout (validasi +
 * antispam di server) membuat baris `orders` + `order_items`, lalu mengarahkan ke WhatsApp atau gateway pembayaran;
 * status pesanan = GET /status-pesanan?kode= membaca tabel orders (status diperbarui admin).
 */
(function () {
  'use strict';

  var PS = window.PrintSite;
  if (!PS) return;

  var D = PS.data, T = D.tenant, esc = PS.esc, ico = PS.ico, url = PS.url, rupiah = PS.rupiah, WA = PS.WA_ICON;
  var K = PS.pageKit, R = PS.pages || {}, ON = PS.modules.order === 'cart', ONSITE = ON && PS.modules.checkout === 'onsite';
  var PT = D.pageText || {};
  var tenantId = document.body.getAttribute('data-tenant') || 'tenant';
  var CART_KEY = 'ps-cart:' + tenantId, ORDERS_KEY = 'ps-orders:' + tenantId;
  var PHONE_RE = /^(\+?62|0)8\d{8,11}$/;
  var MAX_LINES = 30, MAX_QTY = 99999;

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var svc = function (slug) { return D.services.filter(function (s) { return s.slug === slug; })[0]; };
  var obj = function (v) { return v && typeof v === 'object' && !Array.isArray(v) ? v : {}; };
  var arr = function (v) { return Array.isArray(v) ? v : []; };
  var hashText = function () { try { return decodeURIComponent(window.location.hash.slice(1)); } catch (e) { return ''; } };

  var CT = Object.assign({
    title: 'Keranjang', lead: 'Periksa pesanan Anda, isi data singkat, lalu kirim lewat WhatsApp. Pembayaran dikonfirmasi oleh admin.',
    emptyTitle: 'Keranjang masih kosong', emptyText: 'Pilih layanan yang Anda butuhkan, lalu tekan tombol keranjang.', emptyButton: 'Lihat Layanan',
    itemsTitle: 'Pesanan Anda', summaryTitle: 'Ringkasan', total: 'Estimasi total', totalNote: 'Estimasi dari harga "mulai dari" x jumlah. Harga final dan ongkos kirim dikonfirmasi admin lewat WhatsApp.',
    clear: 'Kosongkan keranjang', remove: 'Hapus', qty: 'Jumlah',
    name: 'Nama', namePh: 'Nama lengkap', nameErr: 'Isi nama Anda, minimal 2 huruf.',
    phone: 'Nomor WhatsApp', phonePh: 'mis. 0812-3456-7890', phoneErr: 'Isi nomor WhatsApp yang valid, mis. 081234567890.',
    delivery: 'Pengambilan', pickup: 'Ambil di toko', ship: 'Antar ke alamat', address: 'Alamat pengiriman', addressPh: 'Jalan, nomor, kecamatan, kota', addressErr: 'Isi alamat lengkap, minimal 10 karakter.',
    note: 'Catatan (opsional)', notePh: 'Tenggat, file yang akan dikirim, atau permintaan khusus.',
    submit: 'Pesan via WhatsApp', successTitle: 'Pesanan siap dikirim', successText: 'WhatsApp akan terbuka dengan rincian pesanan. Jika tidak terbuka, tekan tombol di bawah ini. Simpan kode pesanan untuk melacak status.',
    successButton: 'Buka WhatsApp', trackButton: 'Lacak pesanan', codeLabel: 'Kode pesanan', added: 'ditambahkan ke keranjang', full: 'Keranjang penuh (maksimal ' + MAX_LINES + ' baris). Selesaikan pesanan dulu.',
    intro: 'ingin memesan:', outro: 'Mohon konfirmasi harga final, ongkos kirim, dan estimasi selesai.'
  }, obj(PT.cart));
  var ST = Object.assign({
    title: 'Lacak Pesanan', lead: 'Masukkan kode pesanan yang Anda terima saat checkout untuk melihat tahapannya.',
    label: 'Kode pesanan', placeholder: 'mis. SC-20261120-1234', button: 'Cek Status',
    notFound: 'Kode tidak ditemukan. Periksa kembali kode pesanan Anda, atau hubungi admin lewat WhatsApp.', yours: 'Pesanan di perangkat ini', demo: 'Coba kode contoh',
    sample: 'Halaman contoh: di Laravel, status dibaca dari database dan diperbarui oleh admin setiap tahap selesai.',
    done: 'Selesai', current: 'Sedang berjalan', todo: 'Belum', items: 'Isi pesanan', total: 'Estimasi total', placed: 'Dipesan'
  }, obj(PT.orderStatus));
  var STEPS = arr(D.orderStatus && D.orderStatus.steps).filter(function (s) { return s && s.title; });
  if (!STEPS.length) STEPS = [{ title: 'Pesanan diterima', text: 'Kami menerima pesanan Anda.' }, { title: 'Dikonfirmasi admin', text: 'Harga final dan jadwal dikonfirmasi.' }, { title: 'Diproses', text: 'Pesanan dikerjakan.' }, { title: 'Siap diambil / dikirim', text: 'Pesanan selesai.' }];
  var EXAMPLES = arr(D.orderStatus && (ONSITE ? obj(D.orderStatus.onsite).examples : D.orderStatus.examples)).filter(function (e) { return e && typeof e.code === 'string' && typeof e.step === 'number'; });

  /* ---------------------------------------------------------------- penyimpanan */
  var cart = [], orders = [];
  function sanitizeCart(raw) {                                  /* data dari penyimpanan tidak dipercaya */
    if (!Array.isArray(raw)) return [];
    var seen = {};
    return raw.filter(function (x) {
      if (!x || typeof x !== 'object' || typeof x.slug !== 'string' || !svc(x.slug)) return false;
      var id = lineId(x.slug, x.opts); if (seen[id]) return false; seen[id] = 1; return true;
    }).slice(0, MAX_LINES).map(function (x) {
      var opts = cleanOpts(x.opts), q = /^\d{1,6}$/.test(String(x.qty)) ? parseInt(x.qty, 10) : 0;   /* hanya bilangan bulat: "9e9", "-3", 2.5 -> 1 */
      return { slug: x.slug, opts: opts, qty: q > 0 ? Math.min(q, MAX_QTY) : 1 };
    });
  }
  function cleanOpts(o) { var r = {}; if (o && typeof o === 'object') Object.keys(o).forEach(function (k) { if (typeof o[k] === 'string') r[k] = o[k]; }); return r; }
  function lineId(slug, opts) { var o = cleanOpts(opts); return slug + '|' + Object.keys(o).sort().map(function (k) { return k + '=' + o[k]; }).join(';'); }
  /* Pesanan paket Full E-commerce (kind: 'onsite'): semua angka dan teks dari penyimpanan dibersihkan; total dihitung ulang oleh pemakainya */
  function sanitizeOnsite(o) {
    var num = function (v, max) { v = Number(v); return isFinite(v) && v >= 0 ? Math.min(Math.round(v), max || 1e10) : 0; };   /* uang <= 10 miliar; waktu (ms) <= 1e14 */
    var str = function (v, n) { return typeof v === 'string' ? v.slice(0, n || 200) : ''; };
    var pay = obj(o.payment), sh = obj(o.shipping), cu = obj(o.customer);
    var st = ['pending', 'paid', 'expired'].indexOf(pay.status) >= 0 ? pay.status : 'pending';
    return { kind: 'onsite', code: o.code, ts: num(o.ts, 1e14), step: Math.min(4, num(o.step)), delivery: o.delivery === 'ship' ? 'ship' : 'pickup',
      subtotal: num(o.subtotal), shippingCost: num(o.shippingCost), fee: num(o.fee), total: num(o.total),
      items: o.items.filter(function (i) { return i && typeof i.name === 'string'; }).slice(0, MAX_LINES).map(function (i) {
        return { name: str(i.name, 120), qty: parseInt(i.qty, 10) > 0 ? Math.min(parseInt(i.qty, 10), MAX_QTY) : 1, unit: str(i.unit, 30), slug: str(i.slug, 80), opts: cleanOpts(i.opts) };
      }),
      customer: { name: str(cu.name, 80), phone: str(cu.phone, 20), email: str(cu.email, 120), address: str(cu.address, 300), postal: str(cu.postal, 5), note: str(cu.note, 600), regionLabel: str(cu.regionLabel, 120) },
      shipping: { label: str(sh.label, 60), eta: str(sh.eta, 40), kg: num(sh.kg), resi: str(sh.resi, 40) },
      payment: { method: str(pay.method, 20), name: str(pay.name, 60), group: str(pay.group, 20), status: st, amount: num(pay.amount), ref: str(pay.ref, 40), expiresAt: num(pay.expiresAt, 1e14), paidAt: num(pay.paidAt, 1e14) } };
  }
  function sanitizeOrders(raw) {
    if (!Array.isArray(raw)) return [];
    return raw.filter(function (o) { return o && typeof o === 'object' && typeof o.code === 'string' && /^[A-Z0-9\-]{4,30}$/.test(o.code) && Array.isArray(o.items); }).slice(0, 10).map(function (o) {
      if (o.kind === 'onsite') return sanitizeOnsite(o);
      return { code: o.code, ts: typeof o.ts === 'number' ? o.ts : 0, total: typeof o.total === 'number' ? o.total : 0, delivery: o.delivery === 'ship' ? 'ship' : 'pickup',
        items: o.items.filter(function (i) { return i && typeof i.name === 'string'; }).slice(0, MAX_LINES).map(function (i) { return { name: i.name, qty: parseInt(i.qty, 10) > 0 ? parseInt(i.qty, 10) : 1, unit: typeof i.unit === 'string' ? i.unit : '' }; }) };
    });
  }
  function read(key, fn) { try { return fn(JSON.parse(window.localStorage.getItem(key))); } catch (e) { return fn(null); } }
  function write(key, v) { try { window.localStorage.setItem(key, JSON.stringify(v)); } catch (e) { /* tetap jalan di memori */ } }
  function load() { cart = read(CART_KEY, sanitizeCart); orders = read(ORDERS_KEY, sanitizeOrders); }
  var saveCart = function () { write(CART_KEY, cart); };
  var saveOrders = function () { write(ORDERS_KEY, orders); };

  var lineTotal = function (it) { return PS.unitPrice(svc(it.slug), it.opts) * it.qty; };        /* harga satuan sudah memuat tambahan opsi */
  var total = function () { return cart.reduce(function (a, it) { return a + lineTotal(it); }, 0); };
  var optText = function (it) { return Object.keys(it.opts).map(function (k) { return k + ': ' + it.opts[k]; }).join(', '); };

  /* ------------------------------------------------------------------ pembantu UI */
  var toast, toastTimer;
  function say(msg) {
    if (!toast) { toast = document.createElement('div'); toast.className = 'inq-toast'; toast.setAttribute('role', 'status'); toast.setAttribute('aria-live', 'polite'); document.body.appendChild(toast); }
    toast.textContent = ''; toast.classList.add('is-shown');
    window.setTimeout(function () { toast.textContent = msg; }, 30);
    window.clearTimeout(toastTimer); toastTimer = window.setTimeout(function () { toast.classList.remove('is-shown'); }, 2800);
  }
  function badge() {
    $$('[data-cart-count]').forEach(function (b) { b.textContent = String(cart.length); b.hidden = !cart.length; });
    $$('.header-cart').forEach(function (a) { a.setAttribute('aria-label', 'Keranjang, ' + cart.length + ' item' + (cart.length ? ', total ' + rupiah(total()) : '')); });
    $$('[data-cart-total]').forEach(function (b) { b.textContent = rupiah(total()); });    /* total berjalan di header "market" */
  }
  function icons(root) { if (window.lucide && window.lucide.createIcons && $('[data-lucide]', root)) window.lucide.createIcons(); }

  /* ----------------------------------------------------------------- tambah */
  function add(slug, opts, qty, go) {
    var s = svc(slug); if (!s) return;
    var q = /^\d{1,5}$/.test(String(qty).trim()) ? Math.max(1, parseInt(qty, 10)) : 1, id = lineId(slug, opts);
    var cur = cart.filter(function (it) { return lineId(it.slug, it.opts) === id; })[0];
    if (cur) cur.qty = Math.min(cur.qty + q, MAX_QTY);
    else {
      if (cart.length >= MAX_LINES) { say(CT.full); return; }
      cart.push({ slug: slug, opts: cleanOpts(opts), qty: q });
    }
    saveCart(); badge();
    if (go) { window.location.href = url('cart'); return; }
    say(s.name + ' ' + CT.added);
  }
  function readForm(root) {
    var opts = {};
    $$('[data-opt]', root).forEach(function (sel) { if (sel.type === 'radio' && !sel.checked) return; opts[sel.getAttribute('data-opt')] = sel.value; });   /* select atau radio terpilih */
    var q = $('[data-qty]', root);
    return { opts: opts, qty: q ? q.value : '1' };
  }

  /* ------------------------------------------------------------------ halaman */
  function unavailable(key, title) {
    var na = { title: 'Halaman tidak tersedia', text: key === 'checkout' ? 'Checkout dan pembayaran di website tidak aktif di paket ini. Hubungi kami untuk memesan.' : 'Fitur keranjang tidak aktif di situs ini. Hubungi kami untuk memesan.', button: 'Hubungi Kami' };
    return {
      html: K.crumbs([{ label: 'Beranda', route: 'home' }, { label: na.title }]) +
        '<section class="section"><div class="container"><div class="empty-state"><span class="ico">' + ico('file-question', 'i-lg') + '</span>' +
        '<h1 id="page-title">' + esc(na.title) + '</h1><p>' + esc(na.text) + '</p><a class="btn btn-brand" href="' + url('contact') + '">' + esc(na.button) + '</a></div></div></section>',
      meta: { key: key, route: key, notFound: true }
    };
  }

  function emptyCart() {
    return '<div class="empty-state"><span class="ico">' + ico('shopping-cart', 'i-lg') + '</span><h2>' + esc(CT.emptyTitle) + '</h2><p>' + esc(CT.emptyText) + '</p>' +
      '<a class="btn btn-brand" href="' + url('services') + '">' + esc(CT.emptyButton) + '</a></div>';
  }

  function itemRow(it, i) {
    var s = svc(it.slug), o = optText(it);
    return '<li class="cart-item" data-i="' + i + '"><a class="cart-thumb" href="' + esc(url('service', s.slug)) + '" tabindex="-1" aria-hidden="true"><img src="' + esc(s.image) + '" alt="" width="72" height="72" loading="lazy"></a>' +
      '<div class="cart-info"><a class="cart-name" href="' + esc(url('service', s.slug)) + '">' + esc(s.name) + '</a>' + (o ? '<small>' + esc(o) + '</small>' : '') +
      '<span class="cart-unit">' + rupiah(PS.unitPrice(s, it.opts)) + ' / ' + esc(s.unit) + '</span></div>' +
      '<div class="qty" role="group" aria-label="' + esc(CT.qty) + ' ' + esc(s.name) + '">' +
        '<button type="button" data-cart-dec aria-label="Kurangi jumlah ' + esc(s.name) + '">' + ico('minus') + '</button>' +
        '<input type="number" class="form-control qty-input" min="1" max="' + MAX_QTY + '" inputmode="numeric" value="' + it.qty + '" data-cart-qty aria-label="' + esc(CT.qty) + ' ' + esc(s.name) + ' (' + esc(s.unit) + ')">' +
        '<button type="button" data-cart-inc aria-label="Tambah jumlah ' + esc(s.name) + '">' + ico('plus') + '</button></div>' +
      '<strong class="cart-line" data-line>' + rupiah(lineTotal(it)) + '</strong>' +
      '<button type="button" class="inq-remove" data-cart-remove aria-label="' + esc(CT.remove) + ' ' + esc(s.name) + '">' + ico('trash-2') + '</button></li>';
  }

  function field(id, label, input, err) {
    return '<div class="mb-3" data-field="' + id + '"><label class="form-label" for="co-' + id + '">' + label + '</label>' + input +
      (err ? '<div class="invalid-msg" id="co-' + id + '-err" hidden>' + esc(err) + '</div>' : '') + '</div>';
  }

  function cartBody() {
    return '<div class="cart-layout"><section aria-labelledby="cart-items-title"><h2 id="cart-items-title" class="h5 mb-3">' + esc(CT.itemsTitle) + '</h2>' +
      '<ul class="cart-list">' + cart.map(itemRow).join('') + '</ul><button type="button" class="inq-clear" data-cart-clear>' + esc(CT.clear) + '</button></section>' +
      (ONSITE && PS.shop.cartAside ? PS.shop.cartAside() : '<aside class="cart-summary" aria-labelledby="cart-sum-title"><h2 id="cart-sum-title" class="h5">' + esc(CT.summaryTitle) + '</h2>' +
      '<p class="cart-total"><span>' + esc(CT.total) + '</span><strong id="cart-total">' + rupiah(total()) + '</strong></p><p class="form-note">' + esc(CT.totalNote) + '</p>' +
      '<form id="co-form" novalidate aria-label="Data pemesan">' +
      field('name', esc(CT.name) + ' *', '<input class="form-control" id="co-name" name="name" maxlength="80" autocomplete="name" placeholder="' + esc(CT.namePh) + '" required aria-describedby="co-name-err">', CT.nameErr) +
      field('phone', esc(CT.phone) + ' *', '<input class="form-control" id="co-phone" name="phone" type="tel" inputmode="tel" maxlength="20" autocomplete="tel" placeholder="' + esc(CT.phonePh) + '" required aria-describedby="co-phone-err">', CT.phoneErr) +
      '<fieldset class="mb-3 co-delivery"><legend class="form-label">' + esc(CT.delivery) + '</legend>' +
        '<label class="co-radio"><input type="radio" name="delivery" value="pickup" checked> <span>' + esc(CT.pickup) + '</span></label>' +
        '<label class="co-radio"><input type="radio" name="delivery" value="ship"> <span>' + esc(CT.ship) + '</span></label></fieldset>' +
      '<div id="co-address-wrap" hidden>' + field('address', esc(CT.address) + ' *', '<textarea class="form-control" id="co-address" name="address" rows="3" maxlength="300" autocomplete="street-address" placeholder="' + esc(CT.addressPh) + '" aria-describedby="co-address-err"></textarea>', CT.addressErr) + '</div>' +
      field('note', esc(CT.note), '<textarea class="form-control" id="co-note" name="note" rows="2" maxlength="600" placeholder="' + esc(CT.notePh) + '"></textarea>') +
      '<div class="visually-hidden" aria-hidden="true"><label>Jangan diisi <input type="text" name="website" tabindex="-1" autocomplete="off"></label></div>' +
      '<button type="submit" class="btn btn-wa btn-lg w-100">' + WA + ' ' + esc(CT.submit) + '</button></form></aside>') + '</div>';
  }

  var root = null;
  function renderCart() {
    root = $('#cart-root'); if (!root) return;
    root.innerHTML = cart.length ? cartBody() : emptyCart();
    icons(root);
    var f = $('#co-form', root);
    if (f && !ONSITE) wireForm(f);
    if (ONSITE && cart.length && PS.shop.afterCart) PS.shop.afterCart(root);
  }

  function refreshTotals() {
    var t = $('#cart-total'); if (t) t.textContent = rupiah(total());
    $$('.cart-item', root).forEach(function (li) { var it = cart[parseInt(li.getAttribute('data-i'), 10)]; if (it) $('[data-line]', li).textContent = rupiah(lineTotal(it)); });
    badge();                                           /* total berjalan di header ikut berubah saat jumlah diubah */
    if (ONSITE && PS.shop.onTotals) PS.shop.onTotals();   /* ongkir dan total estimasi ikut berubah */
  }

  /* ------------------------------------------------------------ pesan + checkout */
  var rules = {
    name: function (v) { return v.trim().length >= 2; },
    phone: function (v) { return PHONE_RE.test(v.replace(/[\s.\-()]/g, '')); },
    address: function (v, f) { return f.elements.delivery.value !== 'ship' || v.trim().length >= 10; }
  };
  function setErr(f, id, bad) {
    var input = f.elements[id], msg = $('#co-' + id + '-err'); if (!input || !msg) return;
    input.classList.toggle('is-invalid', bad); input.setAttribute('aria-invalid', String(bad)); msg.hidden = !bad;
  }
  function orderCode() {
    var d = new Date(), p = function (n) { return (n < 10 ? '0' : '') + n; };
    var prefix = String(T.shortName || 'ORD').split(/\s+/).map(function (w) { return w.charAt(0); }).join('').toUpperCase().replace(/[^A-Z0-9]/g, '') || 'ORD';
    var code;
    do { code = prefix + '-' + d.getFullYear() + p(d.getMonth() + 1) + p(d.getDate()) + '-' + (1000 + Math.floor(Math.random() * 9000)); } while (orders.some(function (o) { return o.code === code; }));
    return code;
  }
  function message(code, v) {
    var lines = cart.map(function (it, i) {
      var s = svc(it.slug), o = optText(it);
      return (i + 1) + '. ' + s.name + (o ? ' (' + o + ')' : '') + ' — ' + it.qty + ' ' + s.unit + ' x ' + rupiah(PS.unitPrice(s, it.opts)).replace(/ /g, ' ') + ' = ' + rupiah(lineTotal(it)).replace(/ /g, ' ');
    });
    var ship = v.delivery === 'ship';
    return 'Halo ' + T.shortName + ', saya ' + v.name.trim() + ' (WA ' + v.phone.trim() + ') ' + CT.intro + '\nKode pesanan: ' + code + '\n' + lines.join('\n') +
      '\nEstimasi total: ' + rupiah(total()).replace(/ /g, ' ') + '\n' + CT.delivery + ': ' + (ship ? CT.ship + ' — ' + v.address.trim() : CT.pickup) +
      (v.note.trim() ? '\nCatatan: ' + v.note.trim() : '') + '\n\n' + CT.outro;
  }

  function wireForm(f) {
    var wrap = $('#co-address-wrap');
    $$('input[name=delivery]', f).forEach(function (r) {
      r.addEventListener('change', function () { var ship = f.elements.delivery.value === 'ship'; wrap.hidden = !ship; if (!ship) setErr(f, 'address', false); });
    });
    ['name', 'phone', 'address'].forEach(function (id) {
      var input = f.elements[id];
      input.addEventListener('blur', function () { setErr(f, id, !rules[id](input.value, f)); });
      input.addEventListener('input', function () { if (input.classList.contains('is-invalid') && rules[id](input.value, f)) setErr(f, id, false); });
    });
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      if (f.elements.website.value || !cart.length) return;           /* honeypot terisi / keranjang kosong */
      var firstBad = null;
      ['name', 'phone', 'address'].forEach(function (id) { var bad = !rules[id](f.elements[id].value, f); setErr(f, id, bad); if (bad && !firstBad) firstBad = f.elements[id]; });
      if (firstBad) { firstBad.focus(); return; }
      var v = { name: f.elements.name.value, phone: f.elements.phone.value, delivery: f.elements.delivery.value, address: f.elements.address.value, note: f.elements.note.value };
      var code = orderCode(), msg = message(code, v), enc;
      try { enc = encodeURIComponent(msg); } catch (err) { enc = encodeURIComponent(msg.replace(/[\uD800-\uDFFF]/g, '')); }   /* karakter surrogat tunggal */
      var link = 'https://wa.me/' + T.whatsapp + '?text=' + enc;
      orders.unshift({ code: code, ts: Date.now(), total: total(), delivery: v.delivery === 'ship' ? 'ship' : 'pickup',
        items: cart.map(function (it) { var s = svc(it.slug); return { name: s.name, qty: it.qty, unit: s.unit }; }) });
      orders = orders.slice(0, 10); saveOrders();
      var summary = cart.map(function (it) { return '<li>' + esc(svc(it.slug).name) + ' <span>' + it.qty + ' ' + esc(svc(it.slug).unit) + '</span></li>'; }).join('');
      cart = []; saveCart(); badge();
      root.innerHTML = '<div class="cart-success" role="status" tabindex="-1" id="cart-success">' + ico('circle-check', 'i-lg') + '<h2>' + esc(CT.successTitle) + '</h2>' +
        '<p>' + esc(CT.successText) + '</p><p class="order-code"><span>' + esc(CT.codeLabel) + '</span><strong>' + esc(code) + '</strong></p><ul class="order-lines">' + summary + '</ul>' +
        '<div class="d-flex flex-wrap gap-2 justify-content-center"><a class="btn btn-wa" id="co-wa" target="_blank" rel="noopener noreferrer" href="' + esc(link) + '">' + WA + ' ' + esc(CT.successButton) + '</a>' +
        '<a class="btn btn-outline-brand" href="' + esc(url('orderStatus') + '#' + code) + '">' + esc(CT.trackButton) + '</a></div></div>';
      icons(root);
      var ok = $('#cart-success'); if (ok) ok.focus();
      window.open(link, '_blank', 'noopener');
    });
  }

  var HAS_PAGES = !!(PS.pages && K);     /* pages.js hanya dimuat di halaman internal; beranda hanya butuh tombol keranjang */
  if (HAS_PAGES) R.cart = function () {
    if (!ON) return unavailable('cart');
    var cr = [{ label: 'Beranda', route: 'home' }, { label: CT.title }];
    return {
      html: K.crumbs(cr) + K.pageHead(CT.title, CT.lead) + '<section class="section pt-4" aria-label="' + esc(CT.title) + '"><div class="container"><div id="cart-root"></div></div></section>',
      meta: { key: 'cart', route: 'cart', crumbs: K.crumbMeta(cr), robots: 'noindex, follow' },     /* keranjang tidak untuk diindeks */
      after: function () { renderCart(); }
    };
  };

  /* -------------------------------------------------------------- status pesanan */
  function statusView(code) {
    var c = String(code || '').trim().toUpperCase();
    if (ONSITE && PS.shop.statusView) { PS.shop.statusView(c); return; }          /* tahap bayar dan kirim: checkout.js */
    var local = orders.filter(function (o) { return o.code === c && o.kind !== 'onsite'; })[0];
    var ex = EXAMPLES.filter(function (e) { return e.code.toUpperCase() === c; })[0];
    var out = $('#status-result'); if (!out) return;
    if (!local && !ex) { out.innerHTML = '<div class="status-empty" role="alert">' + ico('search-x') + '<p>' + esc(ST.notFound) + '</p></div>'; icons(out); return; }
    var step = local ? 0 : Math.max(0, Math.min(STEPS.length - 1, Math.round(ex.step)));
    var items = local ? local.items.map(function (i) { return i.name + ' (' + i.qty + ' ' + i.unit + ')'; }) : arr(ex.items).filter(function (i) { return typeof i === 'string'; });
    var tot = local ? local.total : (typeof ex.total === 'number' ? ex.total : 0);
    var lis = STEPS.map(function (s, i) {
      var st = i < step ? 'done' : i === step ? 'current' : 'todo';
      return '<li class="status-step is-' + st + '"' + (st === 'current' ? ' aria-current="step"' : '') + '><span class="status-dot" aria-hidden="true">' + (st === 'done' ? ico('check') : String(i + 1)) + '</span>' +
        '<div><strong>' + esc(s.title) + '</strong><span class="visually-hidden"> — ' + esc(st === 'done' ? ST.done : st === 'current' ? ST.current : ST.todo) + '</span>' + (s.text ? '<p>' + esc(s.text) + '</p>' : '') + '</div></li>';
    }).join('');
    out.innerHTML = '<div class="card-x status-card"><div class="status-head"><div><small>' + esc(ST.label) + '</small><h2 class="h4">' + esc(c) + '</h2></div>' +
      '<span class="tag-opt">' + esc(STEPS[step].title) + '</span></div>' +
      (items.length ? '<p class="status-items"><strong>' + esc(ST.items) + ':</strong> ' + esc(items.join(', ')) + '</p>' : '') +
      (tot ? '<p class="status-items"><strong>' + esc(ST.total) + ':</strong> ' + rupiah(tot) + '</p>' : '') +
      '<ol class="status-steps">' + lis + '</ol></div>';
    icons(out);
  }

  if (HAS_PAGES) R.orderStatus = function () {
    if (!ON) return unavailable('orderStatus');
    var cr = [{ label: 'Beranda', route: 'home' }, { label: ST.title }];
    var ownOrders = orders.filter(function (o) { return ONSITE ? o.kind === 'onsite' : o.kind !== 'onsite'; }).map(function (o) { return '<button type="button" class="chip" data-status-code="' + esc(o.code) + '">' + esc(o.code) + '</button>'; }).join('');
    var demos = EXAMPLES.map(function (e) { return '<button type="button" class="chip" data-status-code="' + esc(e.code) + '">' + esc(e.code) + '</button>'; }).join('');
    return {
      html: K.crumbs(cr) + K.pageHead(ST.title, ST.lead) + '<section class="section pt-4" aria-label="' + esc(ST.title) + '"><div class="container"><div class="status-layout">' +
        '<form id="status-form" class="status-form" novalidate><label class="form-label" for="status-code">' + esc(ST.label) + '</label><div class="status-input">' +
        '<input class="form-control" id="status-code" name="code" maxlength="30" autocomplete="off" placeholder="' + esc(ST.placeholder) + '" aria-describedby="status-note">' +
        '<button type="submit" class="btn btn-brand">' + esc(ST.button) + '</button></div>' +
        (ownOrders ? '<p class="catalog-side-title">' + esc(ST.yours) + '</p><div class="chips">' + ownOrders + '</div>' : '') +
        (demos ? '<p class="catalog-side-title">' + esc(ST.demo) + '</p><div class="chips">' + demos + '</div>' : '') +
        '<p class="form-note mt-3" id="status-note">' + esc(ST.sample) + '</p></form>' +
        '<div id="status-result" role="status" aria-live="polite"></div></div></div></section>',
      meta: { key: 'orderStatus', route: 'orderStatus', crumbs: K.crumbMeta(cr), robots: 'noindex, follow' },
      after: function () {
        var f = $('#status-form'), input = $('#status-code');
        f.addEventListener('submit', function (e) { e.preventDefault(); statusView(input.value); });
        f.addEventListener('click', function (e) { var b = e.target.closest('[data-status-code]'); if (b) { input.value = b.getAttribute('data-status-code'); statusView(input.value); } });
        var h = hashText(); if (h && /^[A-Za-z0-9\-]{4,30}$/.test(h)) { input.value = h.toUpperCase(); statusView(h); }
      }
    };
  };

  /* ------------------------------------------------- pengait untuk checkout.js */
  PS.shop = {
    on: ON, onsite: ONSITE, tenantId: tenantId, CT: CT,
    cart: function () { return cart; }, orders: function () { return orders; },
    setOrders: function (o) { orders = o; saveOrders(); }, saveOrders: saveOrders, saveCart: saveCart, clearCart: function () { cart = []; saveCart(); badge(); },
    addLines: function (lines) { lines.forEach(function (l) { if (svc(l.slug)) add(l.slug, l.opts, l.qty, false); }); },
    svc: svc, lineTotal: lineTotal, total: total, optText: optText, orderCode: orderCode, badge: badge, say: say, icons: icons,
    unavailable: unavailable, emptyCart: emptyCart, hashText: hashText, read: read, write: write, root: function () { return root; },
    MAX_QTY: MAX_QTY, PHONE_RE: PHONE_RE
  };

  /* ----------------------------------------------------------------- pasang */
  if (!ON) return;                     /* paket lain: hanya dua halaman di atas (keadaan "tidak tersedia") */
  load();                              /* dimuat sekarang: halaman keranjang dirender sebelum header selesai */
  PS.ready(function () {
    badge();
    document.addEventListener('click', function (e) {
      var a = e.target.closest('[data-cart-add]');
      if (a) {
        var slug = a.getAttribute('data-cart-add');
        if (a.hasAttribute('data-cart-form')) { var r = readForm(a.closest('.order-card') || document); add(slug, r.opts, r.qty, a.hasAttribute('data-cart-go')); }
        else add(slug, {}, 1, false);
        return;
      }
      var li = e.target.closest('.cart-item');
      if (!li || !root || !root.contains(li)) {
        if (e.target.closest('[data-cart-clear]')) { cart = []; saveCart(); badge(); renderCart(); var h = $('#cart-root h2'); if (h) { h.setAttribute('tabindex', '-1'); h.focus(); } }
        return;
      }
      var i = parseInt(li.getAttribute('data-i'), 10), it = cart[i], inp = $('[data-cart-qty]', li);
      if (!it) return;
      if (e.target.closest('[data-cart-inc]')) { it.qty = Math.min(it.qty + 1, MAX_QTY); inp.value = it.qty; saveCart(); refreshTotals(); }
      else if (e.target.closest('[data-cart-dec]')) { it.qty = Math.max(1, it.qty - 1); inp.value = it.qty; saveCart(); refreshTotals(); }
      else if (e.target.closest('[data-cart-remove]')) {
        cart.splice(i, 1); saveCart(); badge(); renderCart();
        var nx = $('[data-cart-remove]', root); var tgt = nx || $('#cart-root h2'); if (tgt) { if (!nx) tgt.setAttribute('tabindex', '-1'); tgt.focus(); }   /* fokus jangan hilang bersama baris yang dihapus */
      }
    });
    document.addEventListener('input', function (e) {
      var q = e.target.closest('[data-cart-qty]'); if (!q) return;
      var it = cart[parseInt(q.closest('.cart-item').getAttribute('data-i'), 10)], n = parseInt(q.value, 10);
      if (it && n > 0) { it.qty = Math.min(n, MAX_QTY); saveCart(); refreshTotals(); }
    });
    document.addEventListener('change', function (e) {                /* jumlah dikosongkan/nol: kembalikan ke nilai tersimpan */
      var q = e.target.closest('[data-cart-qty]'); if (!q) return;
      var it = cart[parseInt(q.closest('.cart-item').getAttribute('data-i'), 10)]; if (it) q.value = it.qty;
    });
    window.addEventListener('storage', function (e) {
      if (e.key !== CART_KEY && e.key !== ORDERS_KEY) return;
      load(); badge();
      if (root && document.contains(root) && !root.contains(document.activeElement) && !$('#cart-success')) renderCart();
    });
  });
})();
