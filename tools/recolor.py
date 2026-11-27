#!/usr/bin/env python3
"""
Recolor: buat salinan ilustrasi SVG dengan palet template, tanpa mengubah aslinya.

Ilustrasi di assets/images/ memakai navy + oranye (palet tenant). Template yang punya palet sendiri (Modern, Bold)
(PLATFORM.templates.<id>.palette) memakai salinan di assets/images-<id>/, dipilih lewat templates.<id>.imageSet.
Aslinya tidak disentuh; template lain tetap memakai assets/images/.

Pakai:  python3 tools/recolor.py            # semua set di SETS
        python3 tools/recolor.py modern     # satu set
Set per palet (templates.<id>.palettes, mis. Grafika, 10 palet) dibuat otomatis dengan "ramp": setiap warna biru/oranye asli dipetakan
menurut terang-gelapnya ke deret warna palet itu (overlay, primaryDark, primary, ... putih; accentDark, accent, ... accentTint).
Palet dibaca dari assets/js/platform.js lewat node, jadi satu sumber kebenaran.
Warna dipetakan eksplisit; warna biru/oranye lain (nuansa antara) digeser lewat hue. Warna CMYK (#00AEEF, #EC008C,
#FFF200, #000), kertas/krem, netral abu, putih, dan hitam dibiarkan.
"""
import colorsys, json, re, shutil, subprocess, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / 'assets' / 'images'

SETS = {
    'modern': {
        'explicit': {   # palet Modern: cyan #0877C4 + magenta #DB0076
            '#173B63': '#0877C4', '#0F2B49': '#065E9C', '#0B1F38': '#052E4F', '#2F6AA8': '#2A9AE0', '#1F4F82': '#0B66AD',
            '#9DB6D3': '#9CCBEB', '#9FBDDC': '#9CCBEB', '#A9CDF3': '#A6D4F2', '#B9D3EE': '#B6DCF3', '#BCD0E6': '#B8D9EE',
            '#CFE0F2': '#CBE6F8', '#C9D9EC': '#C6E0F4', '#D8ECFF': '#D6EEFC', '#D9E2EC': '#D8EAF6', '#E3EFFB': '#E0F2FC', '#EAF1F9': '#E1F2FC',
            '#F28C28': '#DB0076', '#C8791C': '#A8005E', '#FFE9CF': '#FFE3F1', '#FFC98F': '#FFB8DA', '#FFD9A8': '#FFC9E3', '#F6B36A': '#EE5AA5',
        },
        'keep': {'#FFF', '#FFFFFF', '#000', '#000000', '#222', '#C9D3DF', '#DBE4EE', '#D7DEE7', '#9AA9BB', '#8FA6C0',
                 '#EAD6BB', '#F6ECDD', '#F4E7D4', '#FFF200', '#EC008C', '#00AEEF'},
        'blue_hue': 203, 'accent_hue': 325,
    },
    'bold': {
        'explicit': {   # palet Bold: biru royal #2243D6 + lime #C6F432
            '#173B63': '#2243D6', '#0F2B49': '#16309E', '#0B1F38': '#0A1240', '#2F6AA8': '#4D6BE8', '#1F4F82': '#1B38B5',
            '#9DB6D3': '#A9B6F0', '#9FBDDC': '#A9B6F0', '#A9CDF3': '#B5C2F5', '#B9D3EE': '#C0CBF6', '#BCD0E6': '#C2CCF2',
            '#CFE0F2': '#D5DCFA', '#C9D9EC': '#D0D8F8', '#D8ECFF': '#DEE4FD', '#D9E2EC': '#DCE2F8', '#E3EFFB': '#E8ECFD', '#EAF1F9': '#E8ECFD',
            '#F28C28': '#C6F432', '#C8791C': '#7FA000', '#FFE9CF': '#F2FDC9', '#FFC98F': '#E3F99A', '#FFD9A8': '#EBFBB0', '#F6B36A': '#B4E021',
        },
        'keep': {'#FFF', '#FFFFFF', '#000', '#000000', '#222', '#C9D3DF', '#DBE4EE', '#D7DEE7', '#9AA9BB', '#8FA6C0',
                 '#EAD6BB', '#F6ECDD', '#F4E7D4', '#FFF200', '#EC008C', '#00AEEF'},
        'blue_hue': 228, 'accent_hue': 72,
    },
}
HEX = re.compile(r'#[0-9a-fA-F]{6}\b|#[0-9a-fA-F]{3}\b')


def norm(h):
    h = h.upper()
    return '#' + ''.join(c * 2 for c in h[1:]) if len(h) == 4 else h


def shift(h, hue):
    r, g, b = (int(h[i:i + 2], 16) / 255 for i in (1, 3, 5))
    _, l, s = colorsys.rgb_to_hls(r, g, b)
    r, g, b = colorsys.hls_to_rgb(hue / 360, l, min(1, s * 1.1))
    return '#%02X%02X%02X' % tuple(round(v * 255) for v in (r, g, b))


def convert(h, cfg):
    raw = h.upper()
    if raw in cfg['keep']: return h
    n = norm(raw)
    if n in cfg['explicit']: return cfg['explicit'][n]
    r, g, b = (int(n[i:i + 2], 16) / 255 for i in (1, 3, 5))
    hh, _, ss = colorsys.rgb_to_hls(r, g, b)
    hh *= 360
    if ss > 0.2 and 195 <= hh <= 235: return shift(n, cfg['blue_hue'])
    if ss > 0.45 and 15 <= hh <= 45: return shift(n, cfg['accent_hue'])
    return h


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
        'keep': SETS['modern']['keep'],
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
    for name, cfg in SETS.items():
        if only and name not in only: continue
        out = ROOT / 'assets' / ('images-' + name)
        if out.exists(): shutil.rmtree(out)
        n = 0
        for f in sorted(SRC.rglob('*.svg')):
            dst = out / f.relative_to(SRC)
            dst.parent.mkdir(parents=True, exist_ok=True)
            dst.write_text(HEX.sub(lambda m: convert(m.group(0), cfg), f.read_text(encoding='utf-8')), encoding='utf-8'); n += 1
        print('%-8s %d berkas -> assets/images-%s/' % (name, n, name))


if __name__ == '__main__':
    main(set(sys.argv[1:]))
