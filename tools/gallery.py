#!/usr/bin/env python3
"""Buat galeri template di root: index.html + tangkapan layar tiap template (assets/images/gallery/<id>.jpg).
Data diambil dari assets/js/platform.js. Jalankan setelah tools/bake.py:  python3 tools/gallery.py"""
import html, json, os, subprocess
from pathlib import Path
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parent.parent
TEMPLATES = {'classic': 'showcase', 'modern': 'profile', 'bold': 'showcase', 'katalog': 'catalog',
             'toko': 'shop', 'grafika': 'shop', 'compro': 'profile', 'etalase': 'ecommerce'}
ORDER = ['classic', 'modern', 'bold', 'katalog', 'toko', 'grafika', 'compro', 'etalase']
FEATURES = {
    'profile':   ['Profil usaha, layanan, portofolio, artikel, FAQ', 'Tanpa harga; pengunjung menghubungi lewat halaman Kontak'],
    'showcase':  ['Daftar layanan dengan harga dan halaman Harga', 'Pesan lewat WhatsApp dari setiap layanan'],
    'catalog':   ['Katalog dengan filter kategori', 'Daftar tanya: pilih beberapa layanan, kirim sekali lewat WhatsApp'],
    'shop':      ['Keranjang dan checkout', 'Pesanan dikirim ke WhatsApp; cek status pesanan'],
    'ecommerce': ['Keranjang, ongkos kirim otomatis per kurir, metode pembayaran', 'Konfirmasi bayar dan lacak pesanan sampai nomor resi'],
}
js = subprocess.check_output(['node', '-e', "global.window={};require('%s');const P=window.PLATFORM;console.log(JSON.stringify({t:P.templates,p:P.packages,d:P.demos}))" % (ROOT / 'assets/js/platform.js')])
P = json.loads(js)
esc = html.escape

def main():
    shots = ROOT / 'assets/images/gallery'; shots.mkdir(parents=True, exist_ok=True)
    with sync_playwright() as pw:
        br = pw.chromium.launch(executable_path='/usr/bin/google-chrome' if os.path.exists('/usr/bin/google-chrome') else None, args=['--no-sandbox'])
        pg = br.new_page(viewport={'width': 1280, 'height': 800})
        for t in ORDER:
            pg.goto((ROOT / t / 'index.html').as_uri()); pg.wait_for_timeout(700)
            pg.add_style_tag(content='.demo-back{display:none!important}')
            pg.screenshot(path=str(shots / (t + '.jpg')), type='jpeg', quality=72, clip={'x': 0, 'y': 0, 'width': 1280, 'height': 800})
        br.close()
    cards = []
    for t in ORDER:
        tp = P['t'][t]; pk = P['p'][TEMPLATES[t]]
        demo = next((d for d in P['d'] if d['template'] == t), None)
        aud = demo['audience'] if demo else None
        feats = ''.join('<li>%s</li>' % esc(f) for f in FEATURES[TEMPLATES[t]])
        cards.append(
            '<li class="gal-card"><a class="gal-shot" href="%s/index.html" tabindex="-1" aria-hidden="true"><img src="assets/images/gallery/%s.jpg" alt="" loading="lazy" width="640" height="400"></a>'
            '<div class="gal-body"><h2>%s</h2><span class="gal-pkg">Paket: %s</span><p>%s</p><ul class="gal-feat">%s</ul>'
            '%s'
            '<div class="gal-actions"><a class="gal-btn" href="%s/index.html">Coba demo %s</a></div></div></li>'
            % (t, t, esc(tp['name']), esc(pk['name']), esc(tp['description']), feats, ('<p><small>Cocok untuk: %s</small></p>' % esc(aud)) if aud else '', t, esc(tp['name'])))
    page = '''<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="robots" content="noindex, nofollow">
  <title>Pilih Template Website Percetakan | Demo</title>
  <meta name="description" content="Demo template website percetakan dan fotocopy. Pilih satu template, lalu coba semua fiturnya.">
  <link rel="icon" type="image/svg+xml" href="assets/images/logo/logo-mark.svg">
  <link rel="stylesheet" href="assets/vendor/bootstrap.min.css">
  <link rel="stylesheet" href="assets/css/fonts.css">
  <link rel="stylesheet" href="assets/css/gallery.css">
</head>
<body class="gallery">
  <a class="gal-skip" href="#template">Lewati ke daftar template</a>
  <header class="gal-head"><div class="container">
    <div class="gal-brand">Demo template</div>
    <h1>Pilih template website percetakan</h1>
    <p>Setiap template punya tampilan dan paket fitur sendiri. Buka salah satu, lalu coba semua halamannya seperti pengunjung sungguhan. Data usaha di demo ini hanya contoh (Sinar Copy &amp; Printing).</p>
  </div></header>
  <main id="template"><div class="container">
    <ul class="gal-grid">
      %s
    </ul>
  </div></main>
  <footer class="gal-foot"><div class="container">Halaman demo statis: tanpa server dan tanpa database. Keranjang dan pesanan disimpan di browser ini saja, terpisah untuk tiap template.</div></footer>
</body>
</html>
''' % '\n      '.join(cards)
    (ROOT / 'index.html').write_text(page, encoding='utf-8')
    print('galeri: %d template' % len(ORDER))

main()
