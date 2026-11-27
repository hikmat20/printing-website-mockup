#!/usr/bin/env python3
"""
Bake: ubah mesin render (JS) menjadi HTML statis per template.

Cara kerja
  1. Tiap halaman cangkang (home.html, services.html, ...) dibuka di Chromium dengan window.PS_STATIC
     = { template, package, bake: true, slug? }. Mesin merender penuh lalu berhenti sebelum interaksi dipasang.
  2. DOM hasil render disimpan sebagai HTML (head SEO + JSON-LD, header, footer, isi halaman).
  3. Di folder template, JS hanya memasang interaksi (menu, slider, filter, keranjang, dsb.), tidak merender ulang.
     Halaman berstatus (keranjang, checkout, status pesanan) tetap dirender saat dibuka karena isinya milik pengunjung.

Pakai:  python3 tools/bake.py            # semua template
        python3 tools/bake.py etalase    # satu template
Perlu: python3 + playwright (Chromium).
"""
import json, os, re, shutil, sys
from pathlib import Path
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parent.parent
SHELLS = ROOT / 'tools' / 'shells'      # cangkang halaman mesin (sumber bake); path ../../assets dinormalkan saat menulis

# Satu template = satu paket fitur (terkunci). Sumber: PLATFORM.demos (kombinasi yang direkomendasikan).
TEMPLATES = {
    'classic': 'showcase',
    'modern':  'profile',
    'bold':    'showcase',
    'katalog': 'catalog',
    'toko':    'shop',
    'grafika': 'shop',
    'compro':  'profile',
    'etalase': 'ecommerce',
}
IMAGE_SETS = {'modern': 'modern', 'bold': 'bold', 'grafika': 'grafika-biru-langit', 'katalog': 'katalog-navy-oranye', 'classic': 'classic-navy-oranye', 'toko': 'toko-navy-oranye', 'compro': 'compro-navy-oranye', 'etalase': 'etalase-navy-oranye'}     # template dengan ilustrasi berpalet sendiri (sama dengan templates.<id>.imageSet; dibuat tools/recolor.py)
PALETTE_TPLS = {'grafika', 'katalog', 'classic', 'toko', 'compro', 'etalase'}      # template dengan pengalih palet (templates.<id>.palettes): platform.js + palette.js dimuat di <head>
PACKAGES = {   # salinan modul dari PLATFORM.packages (dipakai memilih halaman & skrip)
    'profile':   dict(pricing=False, order='contact', checkout=False),
    'showcase':  dict(pricing=True,  order='whatsapp', checkout=False),
    'catalog':   dict(pricing=True,  order='inquiry', checkout=False),
    'shop':      dict(pricing=True,  order='cart', checkout=False),
    'ecommerce': dict(pricing=True,  order='cart', checkout=True),
}

# (cangkang sumber, nama file hasil)
BAKED_PAGES = [('home.html', 'index.html'), ('services.html', 'services.html'), ('portfolio.html', 'portfolio.html'),
               ('about.html', 'about.html'), ('blog.html', 'blog.html'), ('contact.html', 'contact.html'), ('faq.html', 'faq.html')]

SCRIPT_RE = re.compile(r'\s*<script\b(?![^>]*application/ld\+json)[^>]*>.*?</script>', re.S)   # JSON-LD dipertahankan
TPL_LINK_RE = re.compile(r'\s*<link rel="stylesheet" href="assets/css/templates/([a-z]+)\.css">')
ASSET_RE = re.compile(r'(?<![\w./-])assets/')


def scripts_for(pkg, baked, tpl=None):
    m = PACKAGES[pkg]
    js = ['assets/vendor/lucide.min.js'] + ([] if tpl in PALETTE_TPLS else ['assets/js/platform.js'])
    if m['checkout'] and not baked: js.append('assets/js/regions.js')
    js += ['assets/js/tenants/sinar-copy.js', 'assets/js/main.js', 'assets/js/sections.js', 'assets/js/pages.js']
    if m['order'] == 'inquiry': js.append('assets/js/inquiry.js')
    if m['order'] == 'cart': js.append('assets/js/shop.js')
    if m['checkout'] and not baked: js.append('assets/js/checkout.js')
    js.append('assets/js/seo.js')      # halaman hidup mengisi judul/meta saat dibuka; halaman baked memakai PS.seo (mode baked tidak menulis ulang head)
    return js


def finish(html, tpl, pkg, baked, slug=None, extra_body=''):
    """Pasang path ../assets, hanya CSS template ini, skrip interaksi, tombol kembali, dan noindex."""
    html = html.replace('../../assets/', 'assets/')          # cangkang berada di tools/shells
    html = SCRIPT_RE.sub('', html).replace(' data-bake-done=""', '')
    html = TPL_LINK_RE.sub(lambda m: m.group(0) if m.group(1) == tpl else '', html)
    html = ASSET_RE.sub('../assets/', html)
    if tpl in IMAGE_SETS: html = html.replace('../assets/images/', '../assets/images-%s/' % IMAGE_SETS[tpl])   # favicon dari cangkang
    st = {'template': tpl, 'package': pkg, 'baked': baked}
    head = ('\n  <meta name="robots" content="noindex, nofollow">\n  <link rel="stylesheet" href="../assets/css/gallery.css">\n'
            '  <script>window.PS_STATIC=' + json.dumps(st) + ';</script>\n')
    if tpl in PALETTE_TPLS:     # pengalih palet demo: palet tersimpan dipasang sebelum halaman digambar (tanpa kedip)
        head += '  <script src="../assets/js/platform.js"></script>\n  <script src="../assets/js/palette.js"></script>\n'
    html = html.replace('</head>', head + '</head>', 1)
    if slug:
        html = re.sub(r'<body\b', '<body data-slug="%s"' % slug, html, count=1)
    back = ('<a class="demo-back" href="../index.html"><span aria-hidden="true">&larr;</span> Pilih template lain</a>\n')
    tags = ''.join('  <script src="../%s" defer></script>\n' % s for s in scripts_for(pkg, baked, tpl))
    html = html.replace('</body>', back + tags + '</body>', 1)
    return html


def main(only):
    names = [t for t in TEMPLATES if not only or t in only]
    report = []
    with sync_playwright() as pw:
        br = pw.chromium.launch(executable_path='/usr/bin/google-chrome' if os.path.exists('/usr/bin/google-chrome') else None,
                                args=['--no-sandbox'])
        ctx = br.new_context(viewport={'width': 1280, 'height': 900})

        def render(src, tpl, pkg, slug=None):
            pg = ctx.new_page()
            errs = []
            pg.on('pageerror', lambda e: errs.append(str(e)))
            # gambar gagal dimuat saat bake itu wajar (cangkang di root, path ../assets); tautan rusak diperiksa tes statis
            pg.on('console', lambda m: errs.append(m.text) if m.type in ('error', 'warning') and 'Failed to load resource' not in m.text else None)
            st = {'template': tpl, 'package': pkg, 'bake': True}
            if slug: st['slug'] = slug
            pg.add_init_script('window.PS_STATIC=' + json.dumps(st) + ';')
            pg.goto((SHELLS / src).as_uri())
            pg.wait_for_selector('html[data-bake-done]', state='attached', timeout=15000)
            html = '<!DOCTYPE html>\n' + pg.evaluate('document.documentElement.outerHTML')
            pg.close()
            return html, errs

        # daftar slug diambil dari data tenant
        pg = ctx.new_page()
        pg.add_init_script('window.PS_STATIC=' + json.dumps({'template': 'classic', 'package': 'showcase', 'bake': True}) + ';')
        pg.goto((SHELLS / 'home.html').as_uri()); pg.wait_for_selector('html[data-bake-done]', state='attached')
        services = pg.evaluate('PrintSite.data.services.map(function(s){return s.slug})')
        articles = pg.evaluate('PrintSite.data.articles.map(function(s){return s.slug})')
        pg.close()

        for tpl in names:
            pkg = TEMPLATES[tpl]; m = PACKAGES[pkg]
            out = ROOT / tpl
            if out.exists(): shutil.rmtree(out)
            out.mkdir()
            n = 0
            todo = [(shell, dst, None) for shell, dst in BAKED_PAGES]
            if m['pricing']: todo.append(('pricing.html', 'pricing.html', None))
            for s in services: todo.append(('service-detail.html', 'layanan-%s.html' % s, s))
            for a in articles: todo.append(('article-detail.html', 'artikel-%s.html' % a, a))
            for shell, dst, slug in todo:
                html, errs = render(shell, tpl, pkg, slug)
                if errs: report.append((tpl, dst, errs))
                (out / dst).write_text(finish(html, tpl, pkg, True, slug), encoding='utf-8'); n += 1
            live = []
            if m['order'] == 'cart': live += ['keranjang.html', 'status-pesanan.html']
            if m['checkout']: live += ['checkout.html']
            for f in live:
                raw = (SHELLS / f).read_text(encoding='utf-8').replace('../../assets/', 'assets/')
                (out / f).write_text(finish(raw, tpl, pkg, False), encoding='utf-8'); n += 1
            print('%-8s %-10s %d halaman' % (tpl, pkg, n))
        br.close()
    for tpl, dst, errs in report:
        print('PERINGATAN', tpl, dst, errs[:3])
    return 0 if not report else 1


if __name__ == '__main__':
    sys.exit(main(set(sys.argv[1:])))
