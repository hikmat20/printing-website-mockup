#!/usr/bin/env python3
"""
Recolor: buat salinan ilustrasi SVG dengan palet template, tanpa mengubah aslinya.

Ilustrasi di assets/images/ memakai navy + oranye (palet tenant). Template yang punya palet sendiri (Modern, Bold)
(PLATFORM.templates.<id>.palette) memakai salinan di assets/images-<id>/, dipilih lewat templates.<id>.imageSet.
Aslinya tidak disentuh; template lain tetap memakai assets/images/.

Pakai:  python3 tools/recolor.py            # semua set di SETS
        python3 tools/recolor.py modern     # satu set
Warna dipetakan eksplisit; warna biru/oranye lain (nuansa antara) digeser lewat hue. Warna CMYK (#00AEEF, #EC008C,
#FFF200, #000), kertas/krem, netral abu, putih, dan hitam dibiarkan.
"""
import colorsys, re, shutil, sys
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


def main(only):
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
