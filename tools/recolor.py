#!/usr/bin/env python3
"""
Recolor: buat salinan ilustrasi SVG per palet template, tanpa mengubah aslinya.

Ilustrasi di assets/images/ memakai navy + oranye (palet tenant). Setiap template yang punya palet
(templates.<id>.palettes di assets/js/platform.js) memakai satu set per palet: assets/images-<imageSet>-<id-palet>/ (32 SVG).
Set dibuat otomatis dengan "ramp": setiap warna biru/oranye asli dipetakan menurut terang-gelapnya ke deret warna palet itu
(overlay, primaryDark, primary, ... putih; accentDark, accent, ... accentTint). Palet dibaca dari platform.js lewat node,
jadi satu sumber kebenaran. Warna CMYK (#00AEEF, #EC008C, #FFF200, #000), kertas/krem, netral abu, putih, dan hitam dibiarkan.
Aslinya tidak disentuh.

Pakai:  python3 tools/recolor.py            # semua template
        python3 tools/recolor.py modern     # satu template
"""
import colorsys, json, re, shutil, subprocess, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / 'assets' / 'images'

# warna yang dibiarkan (putih, hitam, kertas/krem, netral abu, kuning/magenta/cyan kecil pada ilustrasi)
KEEP = {'#FFF', '#FFFFFF', '#000', '#000000', '#222', '#C9D3DF', '#DBE4EE', '#D7DEE7', '#9AA9BB', '#8FA6C0',
        '#EAD6BB', '#F6ECDD', '#F4E7D4', '#FFF200', '#EC008C', '#00AEEF'}
HEX = re.compile(r'#[0-9a-fA-F]{6}\b|#[0-9a-fA-F]{3}\b')


def norm(h):
    h = h.upper()
    return '#' + ''.join(c * 2 for c in h[1:]) if len(h) == 4 else h


# --- set per palet (ramp) -------------------------------------------------------------------------------
BLUE_STOPS = [0.12, 0.18, 0.24, 0.32, 0.43, 0.73, 0.89, 0.95, 1.0]      # terang (HLS) warna biru asli
ORANGE_STOPS = [0.44, 0.55, 0.67, 0.78, 0.83, 0.90, 1.0]                # terang warna oranye asli


def mixhex(a, pct, b='#FFFFFF'):
    A, B = [int(a[i:i + 2], 16) for i in (1, 3, 5)], [int(b[i:i + 2], 16) for i in (1, 3, 5)]
    return '#%02X%02X%02X' % tuple(round(A[i] * pct / 100 + B[i] * (100 - pct) / 100) for i in range(3))


def lerp_ramp(l, stops, colors):
    if l <= stops[0]: return colors[0]
    for i in range(1, len(stops)):
        if l <= stops[i]:
            t = (l - stops[i - 1]) / (stops[i] - stops[i - 1])
            return mixhex(colors[i], t * 100, colors[i - 1]) if t < 1 else colors[i]
    return colors[-1]


def palette_cfg(pal):
    w = '#FFFFFF'
    return {
        'blue': (BLUE_STOPS, [pal['overlay'], pal['primaryDark'], pal['primary'], mixhex(pal['primary'], 85), mixhex(pal['primary'], 65),
                              mixhex(pal['primary'], 38), mixhex(pal['primary'], 16), mixhex(pal['primary'], 9), w]),
        'orange': (ORANGE_STOPS, [pal['accentDark'], pal['accent'], mixhex(pal['accent'], 65), mixhex(pal['accent'], 45),
                                  mixhex(pal['accent'], 35), pal['accentTint'], w]),
        'keep': KEEP,
    }


def convert_ramp(h, cfg):
    raw = h.upper()
    if raw in cfg['keep']: return h
    n = norm(raw)
    r, g, b = (int(n[i:i + 2], 16) / 255 for i in (1, 3, 5))
    hh, ll, ss = colorsys.rgb_to_hls(r, g, b)
    hh *= 360
    if ss > 0.2 and 195 <= hh <= 235: return lerp_ramp(ll, *cfg['blue'])
    if ss > 0.45 and 15 <= hh <= 45: return lerp_ramp(ll, *cfg['orange'])
    return h


def template_palettes():
    """{templateId: [palet,...]} dari platform.js (node)."""
    js = "global.window=global; require('./assets/js/platform.js'); var o={}; Object.keys(PLATFORM.templates).forEach(function(k){var t=PLATFORM.templates[k]; if(t.palettes) o[k]=t.palettes.map(function(p){return Object.assign({imageSet:t.imageSet},p)})}); console.log(JSON.stringify(o))"
    return json.loads(subprocess.check_output(['node', '-e', js], cwd=str(ROOT)))


def write_set(out, convert):
    if out.exists(): shutil.rmtree(out)
    n = 0
    for f in sorted(SRC.rglob('*.svg')):
        dst = out / f.relative_to(SRC)
        dst.parent.mkdir(parents=True, exist_ok=True)
        dst.write_text(HEX.sub(lambda m: convert(m.group(0)), f.read_text(encoding='utf-8')), encoding='utf-8'); n += 1
    return n


def main(only):
    for tpl, pals in template_palettes().items():
        if only and tpl not in only: continue
        for pal in pals:
            cfg = palette_cfg(pal)
            n = write_set(ROOT / 'assets' / ('images-%s-%s' % (pal['imageSet'], pal['id'])), lambda h, c=cfg: convert_ramp(h, c))
            print('%-8s %-16s %d berkas -> assets/images-%s-%s/' % (tpl, pal['id'], n, pal['imageSet'], pal['id']))


if __name__ == '__main__':
    main(set(sys.argv[1:]))
