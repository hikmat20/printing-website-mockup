/*
 * inquiry.js — DAFTAR TANYA (paket Katalog, modules.order = 'inquiry')
 * ---------------------------------------------------------------------------
 * Pelanggan menambahkan beberapa layanan ke satu daftar, mengisi nama dan nomor WhatsApp,
 * lalu seluruh daftar dikirim SEKALI sebagai satu pesan WhatsApp. Tidak ada login dan
 * tidak ada pembayaran. Paket lain tidak memuat apa pun dari file ini (keluar di baris pertama).
 *
 * Elemen yang dikenali (ditulis main.js / pages.js):
 *   [data-inq-add="slug"]         tombol tambah (kartu layanan; di detail layanan + [data-inq-form])
 *   [data-inq-open]               tombol pembuka laci (header, menu mobile, section inquiry)
 *   [data-inq-count]              lencana jumlah item
 * Teks laci: tenant.pageText.inquiry (opsional); bila kosong dipakai teks bawaan di bawah.
 *
 * Pemetaan Laravel: daftar disimpan di session/cookie atau tabel inquiry_items; pengiriman
 * menjadi POST /daftar-tanya (validasi + antispam di server) yang mengembalikan tautan WhatsApp,
 * dan/atau menyimpan lead ke tabel `inquiries` agar tenant punya riwayat.
 */
(function () {
  'use strict';

  var PS = window.PrintSite;
  if (!PS || !PS.modules || PS.modules.order !== 'inquiry') return;

  var D = PS.data, T = D.tenant, esc = PS.esc, ico = PS.ico, WA = PS.WA_ICON;
  var PHONE_RE = /^(\+?62|0)8\d{8,11}$/;      /* ponsel Indonesia: 10-13 digit (sama dengan formulir Kontak) */
  var MAX_ITEMS = 20;
  var KEY = 'ps-inquiry:' + (document.body.getAttribute('data-tenant') || 'tenant');

  var TXT = Object.assign({
    title: 'Daftar Tanya', empty: 'Belum ada layanan di daftar. Tekan tombol + pada layanan yang Anda butuhkan.', emptyButton: 'Lihat katalog',
    hint: 'Isi data singkat, lalu seluruh daftar dikirim sekali lewat WhatsApp. Tim kami membalas dengan penawaran.',
    qtyLabel: 'Jumlah', remove: 'Hapus', clear: 'Kosongkan daftar',
    name: 'Nama', namePh: 'Nama lengkap', nameErr: 'Isi nama Anda, minimal 2 huruf.',
    phone: 'Nomor WhatsApp', phonePh: 'mis. 0812-3456-7890', phoneErr: 'Isi nomor WhatsApp yang valid, mis. 081234567890.',
    company: 'Perusahaan / instansi (opsional)', companyPh: 'mis. PT Maju Bersama',
    note: 'Catatan (opsional)', notePh: 'Tenggat, lokasi pengiriman, atau kebutuhan khusus.',
    submit: 'Kirim daftar lewat WhatsApp',
    successTitle: 'Daftar siap dikirim', successText: 'WhatsApp akan terbuka dengan seluruh daftar Anda. Jika tidak terbuka, tekan tombol di bawah ini.', successButton: 'Buka WhatsApp',
    added: 'ditambahkan ke daftar tanya', exists: 'sudah ada di daftar tanya', updated: 'diperbarui di daftar tanya', full: 'Daftar penuh (maksimal ' + MAX_ITEMS + ' layanan). Kirim dulu, lalu buat daftar baru.',
    intro: 'Saya ingin meminta penawaran untuk:'
  }, (D.pageText && D.pageText.inquiry && typeof D.pageText.inquiry === 'object') ? D.pageText.inquiry : {});

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var svc = function (slug) { return D.services.filter(function (s) { return s.slug === slug; })[0]; };

  /* ------------------------------------------------------------- penyimpanan */
  var items = [];                                         /* [{ slug, opts: { label: nilai }, qty: '' | angka }] */
  function sanitize(raw) {                                /* data dari penyimpanan tidak dipercaya */
    if (!Array.isArray(raw)) return [];
    var seen = {};
    return raw.filter(function (x) { return x && typeof x === 'object' && typeof x.slug === 'string' && svc(x.slug) && !seen[x.slug] && (seen[x.slug] = 1); })
      .slice(0, MAX_ITEMS).map(function (x) {
        var opts = {};
        if (x.opts && typeof x.opts === 'object') Object.keys(x.opts).forEach(function (k) { if (typeof x.opts[k] === 'string') opts[k] = x.opts[k]; });
        var q = parseInt(x.qty, 10);
        return { slug: x.slug, opts: opts, qty: q > 0 ? Math.min(q, 99999999) : '' };
      });
  }
  function load() { try { items = sanitize(JSON.parse(window.localStorage.getItem(KEY))); } catch (e) { /* penyimpanan bisa diblokir / rusak */ } }
  function save() { try { window.localStorage.setItem(KEY, JSON.stringify(items)); } catch (e) { /* tetap jalan di memori */ } }

  /* ------------------------------------------------------------------ tampilan */
  var drawer, overlay, body, form, toast, toastTimer, lastFocus = null;

  function optText(it) { return Object.keys(it.opts).map(function (k) { return k + ': ' + it.opts[k]; }).join(', '); }

  function renderBody() {
    if (!items.length) {
      body.innerHTML = '<div class="inq-empty"><span class="ico">' + ico('clipboard-list', 'i-lg') + '</span><p>' + esc(TXT.empty) + '</p>' +
        '<a class="btn btn-brand" href="' + esc(PS.url('services')) + '">' + esc(TXT.emptyButton) + '</a></div>';
      form.hidden = true;
    } else {
      body.innerHTML = '<ul class="inq-list">' + items.map(function (it, i) {
        var s = svc(it.slug), o = optText(it);
        return '<li class="inq-item" data-i="' + i + '"><div class="inq-item-main"><a href="' + esc(PS.url('service', s.slug)) + '">' + esc(s.name) + '</a>' +
          (o ? '<small>' + esc(o) + '</small>' : '') + '</div>' +
          '<label class="visually-hidden" for="inq-qty-' + i + '">' + esc(TXT.qtyLabel) + ' ' + esc(s.name) + ' (' + esc(s.unit) + ')</label>' +
          '<input class="form-control inq-qty" id="inq-qty-' + i + '" type="number" min="1" inputmode="numeric" placeholder="' + esc(s.unit) + '" value="' + esc(it.qty) + '" data-inq-qty>' +
          '<button type="button" class="inq-remove" data-inq-remove aria-label="' + esc(TXT.remove) + ' ' + esc(s.name) + '">' + ico('trash-2') + '</button></li>';
      }).join('') + '</ul><button type="button" class="link-arrow inq-clear" data-inq-clear>' + esc(TXT.clear) + '</button>';
      form.hidden = false;
    }
    if (window.lucide && window.lucide.createIcons) window.lucide.createIcons();
  }

  function refresh() {
    $$('[data-inq-count]').forEach(function (b) { b.textContent = String(items.length); b.hidden = !items.length; });
    $$('[data-inq-open]').forEach(function (b) { b.setAttribute('aria-label', 'Buka daftar tanya, ' + items.length + ' layanan'); });
    $$('[data-inq-add]').forEach(function (b) { b.classList.toggle('is-added', items.some(function (it) { return it.slug === b.getAttribute('data-inq-add'); })); });
    if (drawer) renderBody();
  }

  function say(msg) {
    toast.textContent = ''; toast.classList.add('is-shown');
    window.setTimeout(function () { toast.textContent = msg; }, 30);     /* ubah teks setelah kosong supaya pembaca layar selalu membacakan */
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(function () { toast.classList.remove('is-shown'); }, 2800);
  }

  /* -------------------------------------------------------------------- aksi */
  function add(slug, opts, qty) {
    var s = svc(slug); if (!s) return;
    var q = /^\d{1,8}$/.test(String(qty).trim()) ? parseInt(qty, 10) : 0, cur = items.filter(function (it) { return it.slug === slug; })[0];
    if (cur) {
      var changed = (opts && JSON.stringify(opts) !== JSON.stringify(cur.opts)) || (q > 0 && q !== cur.qty);
      if (opts) cur.opts = opts;
      if (q > 0) cur.qty = q;
      say(s.name + ' ' + (changed ? TXT.updated : TXT.exists));
    } else {
      if (items.length >= MAX_ITEMS) { say(TXT.full); return; }
      items.push({ slug: slug, opts: opts || {}, qty: q > 0 ? q : '' });
      say(s.name + ' ' + TXT.added);
    }
    save(); refresh();
  }

  function readForm(root) {                                /* pilihan + jumlah dari kartu pemesanan di halaman detail */
    var opts = {};
    $$('[data-opt]', root).forEach(function (sel) { opts[sel.getAttribute('data-opt')] = sel.value; });
    var qty = $('[data-qty]', root);
    return { opts: opts, qty: qty ? qty.value : '' };
  }

  function open() {
    var menu = $('#mobile-menu');
    if (menu && menu.classList.contains('is-open')) { var c = $('#menu-close'); if (c) c.click(); }   /* tutup menu mobile dulu */
    lastFocus = document.activeElement;
    var ok = $('#inq-success'); if (ok) ok.classList.remove('is-shown');
    renderBody();
    drawer.classList.add('is-open'); overlay.classList.add('is-open'); document.body.classList.add('is-locked');
    $$('[data-inq-open]').forEach(function (b) { b.setAttribute('aria-expanded', 'true'); });
    drawer.focus();
  }
  function close() {
    if (!drawer.classList.contains('is-open')) return;
    drawer.classList.remove('is-open'); overlay.classList.remove('is-open'); document.body.classList.remove('is-locked');
    $$('[data-inq-open]').forEach(function (b) { b.setAttribute('aria-expanded', 'false'); });
    if (lastFocus && document.contains(lastFocus)) lastFocus.focus();
  }

  /* ---------------------------------------------------------------- pesan WhatsApp */
  function message(f) {
    var lines = items.map(function (it, i) {
      var s = svc(it.slug), parts = [];
      Object.keys(it.opts).forEach(function (k) { parts.push(k + ': ' + it.opts[k]); });
      if (it.qty) parts.push('Jumlah: ' + it.qty + ' ' + s.unit);
      return (i + 1) + '. ' + s.name + (parts.length ? ' — ' + parts.join('; ') : '');
    });
    var company = f.company.trim();
    return 'Halo ' + T.shortName + ', saya ' + f.name.trim() + (company ? ' (' + company + ')' : '') + ' (WA ' + f.phone.trim() + '). ' + TXT.intro + '\n' + lines.join('\n') +
      (f.note.trim() ? '\n\nCatatan: ' + f.note.trim() : '');
  }

  var rules = {
    name: function (v) { return v.trim().length >= 2; },
    phone: function (v) { return PHONE_RE.test(v.replace(/[\s.\-()]/g, '')); }
  };
  function setErr(id, bad) {
    var input = form.elements[id], msg = $('#inq-' + id + '-err');
    input.classList.toggle('is-invalid', bad); input.setAttribute('aria-invalid', String(bad)); msg.hidden = !bad;
  }

  function submit(e) {
    e.preventDefault();
    if (form.elements.website.value) return;                 /* honeypot terisi: kemungkinan bot */
    if (!items.length) return;
    var firstBad = null;
    Object.keys(rules).forEach(function (id) { var bad = !rules[id](form.elements[id].value); setErr(id, bad); if (bad && !firstBad) firstBad = form.elements[id]; });
    if (firstBad) { firstBad.focus(); return; }
    var msg = message({ name: form.elements.name.value, phone: form.elements.phone.value, company: form.elements.company.value, note: form.elements.note.value });
    var enc; try { enc = encodeURIComponent(msg); } catch (err) { enc = encodeURIComponent(msg.replace(/[\uD800-\uDFFF]/g, '')); }   /* karakter surrogat tunggal */
    var link = 'https://wa.me/' + T.whatsapp + '?text=' + enc;
    var ok = $('#inq-success'), a = $('#inq-wa');
    a.href = link; ok.classList.add('is-shown'); ok.focus();
    window.open(link, '_blank', 'noopener');
  }

  /* ----------------------------------------------------------------- pasang */
  function build() {
    var field = function (id, label, input, err) {
      return '<div class="mb-3" data-field="' + id + '"><label class="form-label" for="inq-' + id + '">' + label + '</label>' + input +
        (err ? '<div class="invalid-msg" id="inq-' + id + '-err" hidden>' + esc(err) + '</div>' : '') + '</div>';
    };
    overlay = document.createElement('div'); overlay.className = 'inq-overlay'; overlay.id = 'inq-overlay';
    drawer = document.createElement('div'); drawer.className = 'inq-drawer'; drawer.id = 'inq-drawer'; drawer.tabIndex = -1;
    drawer.setAttribute('role', 'dialog'); drawer.setAttribute('aria-modal', 'true'); drawer.setAttribute('aria-labelledby', 'inq-title');
    drawer.innerHTML = '<div class="inq-head"><h2 id="inq-title">' + esc(TXT.title) + '</h2>' +
      '<button type="button" class="inq-close" data-inq-close aria-label="Tutup daftar tanya">' + ico('x', 'i-lg') + '</button></div>' +
      '<div class="inq-scroll"><div id="inq-body"></div>' +
      '<form class="inq-form" id="inq-form" novalidate hidden aria-label="Data pengirim"><p class="form-note">' + esc(TXT.hint) + '</p>' +
      field('name', esc(TXT.name) + ' *', '<input class="form-control" id="inq-name" name="name" maxlength="80" autocomplete="name" placeholder="' + esc(TXT.namePh) + '" required aria-describedby="inq-name-err">', TXT.nameErr) +
      field('phone', esc(TXT.phone) + ' *', '<input class="form-control" id="inq-phone" name="phone" type="tel" inputmode="tel" maxlength="20" autocomplete="tel" placeholder="' + esc(TXT.phonePh) + '" required aria-describedby="inq-phone-err">', TXT.phoneErr) +
      field('company', esc(TXT.company), '<input class="form-control" id="inq-company" name="company" maxlength="80" autocomplete="organization" placeholder="' + esc(TXT.companyPh) + '">') +
      field('note', esc(TXT.note), '<textarea class="form-control" id="inq-note" name="note" rows="3" maxlength="600" placeholder="' + esc(TXT.notePh) + '"></textarea>') +
      '<div class="visually-hidden" aria-hidden="true"><label>Jangan diisi <input type="text" name="website" tabindex="-1" autocomplete="off"></label></div>' +
      '<button type="submit" class="btn btn-wa btn-lg w-100">' + WA + ' ' + esc(TXT.submit) + '</button>' +
      '<div class="form-success" id="inq-success" role="status" tabindex="-1">' + ico('circle-check') + '<div><strong>' + esc(TXT.successTitle) + '</strong><p class="mb-2">' + esc(TXT.successText) + '</p>' +
      '<a class="btn btn-wa btn-sm" id="inq-wa" target="_blank" rel="noopener noreferrer">' + WA + ' ' + esc(TXT.successButton) + '</a></div></div></form></div>';
    toast = document.createElement('div'); toast.className = 'inq-toast'; toast.setAttribute('role', 'status'); toast.setAttribute('aria-live', 'polite');
    [overlay, drawer, toast].forEach(function (n) { document.body.appendChild(n); });
    body = $('#inq-body', drawer); form = $('#inq-form', drawer);

    form.addEventListener('submit', submit);
    Object.keys(rules).forEach(function (id) {
      var input = form.elements[id];
      input.addEventListener('blur', function () { setErr(id, !rules[id](input.value)); });
      input.addEventListener('input', function () { if (input.classList.contains('is-invalid') && rules[id](input.value)) setErr(id, false); });
    });
    drawer.addEventListener('input', function (e) {         /* jumlah per baris */
      var q = e.target.closest('[data-inq-qty]'); if (!q) return;
      var it = items[parseInt(q.closest('.inq-item').getAttribute('data-i'), 10)], n = parseInt(q.value, 10);
      if (it) { it.qty = n > 0 ? Math.min(n, 99999999) : ''; save(); }
    });
    overlay.addEventListener('click', close);
    document.addEventListener('keydown', function (e) {
      if (!drawer.classList.contains('is-open')) return;
      if (e.key === 'Escape') { close(); return; }
      if (e.key === 'Tab') {                                 /* fokus tetap di dalam laci */
        var f = $$('a[href], button, input, textarea, select', drawer).filter(function (n) { return n.offsetParent !== null && !n.disabled; });
        if (!f.length) return;
        var first = f[0], last = f[f.length - 1];
        if (!drawer.contains(document.activeElement)) { e.preventDefault(); first.focus(); }
        else if (e.shiftKey && (document.activeElement === first || document.activeElement === drawer)) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
  }

  PS.ready(function () {
    load(); build();
    document.addEventListener('click', function (e) {
      var a = e.target.closest('[data-inq-add]');
      if (a) {
        var slug = a.getAttribute('data-inq-add');
        if (a.hasAttribute('data-inq-form')) { var r = readForm(a.closest('.order-card') || document); add(slug, r.opts, r.qty); } else add(slug);
        return;
      }
      if (e.target.closest('[data-inq-open]')) { open(); return; }
      if (e.target.closest('[data-inq-close]')) { close(); return; }
      var rm = e.target.closest('[data-inq-remove]');
      if (rm) {
        var i = parseInt(rm.closest('.inq-item').getAttribute('data-i'), 10);
        items.splice(i, 1); save(); refresh();
        var nx = $('[data-inq-remove]', drawer); (nx || $('[data-inq-close]', drawer)).focus();   /* fokus jangan hilang bersama baris yang dihapus */
        return;
      }
      if (e.target.closest('[data-inq-clear]')) { items = []; save(); refresh(); $('[data-inq-close]', drawer).focus(); }
    });
    window.addEventListener('storage', function (e) { if (e.key === KEY) { load(); refresh(); } });   /* tab lain mengubah daftar */
    window.addEventListener('hashchange', function () { window.setTimeout(refresh, 0); });             /* detail layanan dirender ulang saat slug berganti */
    refresh();
  });
})();
