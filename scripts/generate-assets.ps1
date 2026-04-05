# CareLog Asset Generator
# Run this to create placeholder icons for Expo
# Usage: python scripts/generate_icons.py

Write-Host "Generating CareLog placeholder assets..." -ForegroundColor Cyan

$imgDir = "$PSScriptRoot\..\assets\images"
New-Item -ItemType Directory -Force -Path $imgDir | Out-Null

# Use Python to generate minimal PNGs
python -c @"
import struct, zlib, os
def make_png(w, h, r, g, b, path):
    raw = b''
    for y in range(h):
        raw += b'\x00'
        for x in range(w):
            raw += bytes([r, g, b])
    comp = zlib.compress(raw)
    sig = b'\x89PNG\r\n\x1a\n'
    def chunk(ct, d):
        c = ct + d
        return struct.pack('>I', len(d)) + c + struct.pack('>I', zlib.crc32(c) & 0xffffffff)
    ihdr = struct.pack('>IIBBBBB', w, h, 8, 2, 0, 0, 0)
    with open(path, 'wb') as f:
        f.write(sig + chunk(b'IHDR', ihdr) + chunk(b'IDAT', comp) + chunk(b'IEND', b''))
    print(f'  Created: {os.path.basename(path)} ({w}x{h})')

d = r'$imgDir'
make_png(64, 64, 0, 212, 170, d + r'\icon.png')
make_png(64, 64, 0, 212, 170, d + r'\adaptive-icon.png')
make_png(64, 128, 11, 22, 34, d + r'\splash.png')
make_png(32, 32, 0, 212, 170, d + r'\favicon.png')
"@

Write-Host "`nPlaceholder assets created!" -ForegroundColor Green
Write-Host "Replace with real designs from your pitch deck branding." -ForegroundColor Yellow
