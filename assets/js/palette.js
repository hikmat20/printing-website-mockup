/* Pengalih palet warna — KHUSUS DEMO (folder template statis yang punya templates.<id>.palettes di platform.js, mis. Grafika).
   Tidak ikut ke Laravel: di sana warna & palet datang dari pengaturan tenant, bukan dari tombol ini.

   Dimuat di <head> (sinkron) tepat setelah platform.js, supaya:
   1. palet pilihan pengunjung (localStorage 'ps-palette:<template>') sudah terpasang sebelum halaman digambar -> tanpa kedip warna;
   2. gambar ilustrasi (assets/images-<set>-<palet>/) diganti sejak elemennya dibuat (MutationObserver), lalu mengikuti tiap pilihan baru.
   Warna: sama dengan main.js applyTheme() (CSS variable di <html>); selebihnya diturunkan CSS lewat color-mix. */
(function () {
  'use strict';
  var ST = window.PS_STATIC, P = window.PLATFORM && ST && window.PLATFORM.templates[ST.template];
  if (!P || !P.palettes || !P.imageSet || !window.PS_PALETTE_FOR) return;

  var TPL = ST.template, KEY = 'ps-palette:' + TPL, root = document.documentElement;
  var MAP = {
    primary: '--c-primary', primaryDark: '--c-primary-dark', primaryLight: '--c-primary-light',
    accent: '--c-accent', accentDark: '--c-accent-dark', onAccent: '--c-on-accent',
    surface: '--c-surface', primaryTint: '--c-primary-tint', accentTint: '--c-accent-tint',
    onDarkSoft: '--c-on-dark-soft', onDarkMuted: '--c-on-dark-muted', onDarkFaint: '--c-on-dark-faint', overlay: '--c-overlay'
  };
  var ids = P.palettes.map(function (p) { return p.id; });
  var SET_RE = new RegExp('assets/images-' + P.imageSet + '-(?:' + ids.join('|') + ')/', 'g');
  var current = window.PS_PALETTE_FOR(TPL);

  function imgBase(p) { return 'assets/images-' + P.imageSet + '-' + p.id + '/'; }

  /* ---------- warna ---------- */
  function applyColors(p) {
    Object.keys(MAP).forEach(function (k) { if (p[k]) root.style.setProperty(MAP[k], p[k]); });
    root.setAttribute('data-palette', p.id);
    var th = root.__theme; if (th) Object.keys(MAP).forEach(function (k) { if (p[k]) th[k] = p[k]; });
    var meta = document.querySelector('meta[name="theme-color"]'); if (meta) meta.setAttribute('content', p.primary);
  }

  /* ---------- gambar ---------- */
  var ATTRS = ['src', 'srcset', 'href', 'style', 'data-src', 'data-bg'];
  function fixNode(el) {
    if (!el || el.nodeType !== 1) return;
    var to = imgBase(current);
    for (var i = 0; i < ATTRS.length; i++) {
      var v = el.getAttribute(ATTRS[i]);
      if (v && v.indexOf('images-' + P.imageSet + '-') > -1) {
        var n = v.replace(SET_RE, to);
        if (n !== v) el.setAttribute(ATTRS[i], n);
      }
    }
  }
  function fixTree(node) {
    fixNode(node);
    if (node.querySelectorAll) {
      var all = node.querySelectorAll('[src],[srcset],[href],[style],[data-src],[data-bg]');
      for (var i = 0; i < all.length; i++) fixNode(all[i]);
    }
  }
  var obs = new MutationObserver(function (list) {
    list.forEach(function (m) {
      if (m.type === 'attributes') fixNode(m.target);
      else for (var i = 0; i < m.addedNodes.length; i++) fixTree(m.addedNodes[i]);
    });
  });
  obs.observe(root, { childList: true, subtree: true, attributes: true, attributeFilter: ATTRS });

  applyColors(current);

  /* ---------- pilihan ---------- */
  function select(id) {
    var found = P.palettes.filter(function (p) { return p.id === id; })[0];
    if (!found) return;
    try { localStorage.setItem(KEY, id); } catch (e) {}
    if (found.id === current.id) return;
    current = found;
    applyColors(current);
    fixTree(root);
    document.dispatchEvent(new CustomEvent('ps:palette', { detail: { id: id, palette: found } }));
    refresh();
  }
  window.PS_PALETTE = { list: P.palettes, current: function () { return current; }, set: select };

  /* ---------- antarmuka ---------- */
  var btn, panel, list;
  function el(tag, cls, attrs) {
    var n = document.createElement(tag); if (cls) n.className = cls;
    if (attrs) Object.keys(attrs).forEach(function (k) { n.setAttribute(k, attrs[k]); });
    return n;
  }
  function chip(p) {
    var s = el('span', 'pal-chip', { 'aria-hidden': 'true' });
    [p.primary, p.primaryDark, p.accent].forEach(function (c) { var i = el('i'); i.style.background = c; s.appendChild(i); });
    return s;
  }
  function refresh() {
    if (!btn) return;
    btn.querySelector('.pal-dot').style.background = 'linear-gradient(135deg,' + current.primary + ' 50%,' + current.accent + ' 50%)';
    btn.setAttribute('aria-label', 'Ganti palet warna (sekarang: ' + current.name + ')');
    [].forEach.call(list.querySelectorAll('button'), function (b) {
      var on = b.getAttribute('data-id') === current.id;
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    var cur = panel.querySelector('.pal-current'); if (cur) cur.textContent = current.name;
  }
  function open() {
    panel.hidden = false; btn.setAttribute('aria-expanded', 'true'); root.classList.add('pal-open');
    var on = list.querySelector('[aria-pressed="true"]') || list.querySelector('button'); if (on) on.focus();
  }
  function close(back) {
    if (panel.hidden) return;
    panel.hidden = true; btn.setAttribute('aria-expanded', 'false'); root.classList.remove('pal-open');
    if (back) btn.focus();
  }
  function build() {
    btn = el('button', 'pal-fab', { type: 'button', 'aria-haspopup': 'dialog', 'aria-expanded': 'false', 'aria-controls': 'pal-panel' });
    btn.appendChild(el('span', 'pal-dot', { 'aria-hidden': 'true' }));
    var t = el('span', 'pal-fab-t'); t.textContent = 'Palet'; btn.appendChild(t);

    panel = el('div', 'pal-panel', { id: 'pal-panel', role: 'dialog', 'aria-label': 'Pilih palet warna' }); panel.hidden = true;
    var head = el('div', 'pal-head');
    var h = el('p', 'pal-title'); h.textContent = 'Palet warna'; head.appendChild(h);
    var x = el('button', 'pal-x', { type: 'button', 'aria-label': 'Tutup pilihan palet' }); x.textContent = '×'; head.appendChild(x);
    panel.appendChild(head);
    var sub = el('p', 'pal-sub'); sub.innerHTML = 'Sekarang: <b class="pal-current"></b>. Warna dan ilustrasi ikut berganti.'; panel.appendChild(sub);

    list = el('div', 'pal-list');
    var groups = []; P.palettes.forEach(function (p) { if (groups.indexOf(p.group) < 0) groups.push(p.group); });
    groups.forEach(function (g) {
      var gh = el('p', 'pal-group'); gh.textContent = g; list.appendChild(gh);
      var ul = el('ul', 'pal-ul');
      P.palettes.filter(function (p) { return p.group === g; }).forEach(function (p) {
        var li = el('li'), b = el('button', 'pal-opt', { type: 'button', 'data-id': p.id, 'aria-pressed': 'false' });
        b.appendChild(chip(p));
        var n = el('span', 'pal-name'); n.textContent = p.name;
        if (p.hint) { var hn = el('small', 'pal-hint'); hn.textContent = p.hint; n.appendChild(hn); }
        b.appendChild(n);
        var ck = el('span', 'pal-ck', { 'aria-hidden': 'true' }); ck.textContent = '✓'; b.appendChild(ck);
        li.appendChild(b); ul.appendChild(li);
      });
      list.appendChild(ul);
    });
    panel.appendChild(list);
    var note = el('p', 'pal-note'); note.textContent = 'Pengalih ini hanya ada di demo. Pilihan tersimpan di peramban ini.'; panel.appendChild(note);

    document.body.appendChild(btn); document.body.appendChild(panel);
    btn.addEventListener('click', function () { panel.hidden ? open() : close(true); });
    x.addEventListener('click', function () { close(true); });
    list.addEventListener('click', function (e) { var b = e.target.closest && e.target.closest('.pal-opt'); if (b) select(b.getAttribute('data-id')); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(true); });
    document.addEventListener('click', function (e) { if (!panel.hidden && !panel.contains(e.target) && !btn.contains(e.target)) close(false); });
    refresh();
  }
  function ready() { fixTree(root); build(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', ready); else ready();
})();
