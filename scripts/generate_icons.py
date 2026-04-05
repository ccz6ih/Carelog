"""
Generate placeholder CareLog icon assets for Expo build.
Run: python scripts/generate_icons.py
Optional: pip install Pillow (for nicer text rendering)

Design system:
  Background: #0B1622 (dark navy)
  Primary:    #00BFA6 (teal)
  App name:   CareLog
"""
import os
import sys
import struct
import zlib

base = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
img_dir = os.path.join(base, 'assets', 'images')
os.makedirs(img_dir, exist_ok=True)

DARK = (11, 22, 34)      # #0B1622
TEAL = (0, 191, 166)     # #00BFA6
WHITE = (255, 255, 255)

# ---------------------------------------------------------------------------
# Try Pillow first for nice text rendering
# ---------------------------------------------------------------------------
try:
    from PIL import Image, ImageDraw, ImageFont

    def get_font(size):
        """Try to load a nice font, fall back to default."""
        for name in ["segoeui.ttf", "arial.ttf", "DejaVuSans.ttf"]:
            try:
                return ImageFont.truetype(name, size)
            except (IOError, OSError):
                continue
        # Last resort: Pillow's built-in default (tiny but works)
        return ImageFont.load_default()

    def make_icon(width, height, text, path):
        """Create an icon with dark background and teal centered text."""
        img = Image.new('RGB', (width, height), DARK)
        draw = ImageDraw.Draw(img)

        # Scale font to ~40% of the smaller dimension for short text, ~12% for long
        min_dim = min(width, height)
        if len(text) <= 3:
            font_size = int(min_dim * 0.45)
        else:
            font_size = int(min_dim * 0.12)
        font_size = max(font_size, 10)
        font = get_font(font_size)

        # Center text
        bbox = draw.textbbox((0, 0), text, font=font)
        tw = bbox[2] - bbox[0]
        th = bbox[3] - bbox[1]
        x = (width - tw) // 2 - bbox[0]
        y = (height - th) // 2 - bbox[1]
        draw.text((x, y), text, fill=TEAL, font=font)

        img.save(path, "PNG")
        print(f"  Created: {os.path.basename(path)} ({width}x{height})")

    print("Using Pillow for asset generation...")

    make_icon(1024, 1024, "CL",      os.path.join(img_dir, 'icon.png'))
    make_icon(1024, 1024, "CL",      os.path.join(img_dir, 'adaptive-icon.png'))
    make_icon(1284, 2778, "CareLog", os.path.join(img_dir, 'splash.png'))
    make_icon(48,   48,   "CL",      os.path.join(img_dir, 'favicon.png'))

    print("\nAll assets generated with Pillow!")
    sys.exit(0)

except ImportError:
    pass

# ---------------------------------------------------------------------------
# Fallback: pure-Python minimal PNG generator (no dependencies)
# Generates solid dark-navy PNGs at the correct dimensions.
# Full-size 1024x1024 raw bitmaps are large, so we use a chunked approach.
# ---------------------------------------------------------------------------
print("Pillow not available. Generating minimal solid-color PNGs...")

def create_png(path, width, height, rgb):
    """Create a solid-color PNG at the exact dimensions using raw zlib."""
    r, g, b = rgb

    # Build raw scanlines: filter-byte (0) + RGB pixels per row
    row = b'\x00' + bytes([r, g, b]) * width
    # For very large images, build data in chunks to avoid huge memory spike
    compressor = zlib.compressobj()
    compressed = b''
    for _ in range(height):
        compressed += compressor.compress(row)
    compressed += compressor.flush()

    # PNG signature
    sig = b'\x89PNG\r\n\x1a\n'

    def chunk(chunk_type, data):
        c = chunk_type + data
        crc = zlib.crc32(c) & 0xFFFFFFFF
        return struct.pack('>I', len(data)) + c + struct.pack('>I', crc)

    # IHDR: width, height, bit-depth=8, color-type=2 (RGB), compression=0, filter=0, interlace=0
    ihdr_data = struct.pack('>IIBBBBB', width, height, 8, 2, 0, 0, 0)

    with open(path, 'wb') as f:
        f.write(sig)
        f.write(chunk(b'IHDR', ihdr_data))
        f.write(chunk(b'IDAT', compressed))
        f.write(chunk(b'IEND', b''))

    print(f"  Created: {os.path.basename(path)} ({width}x{height})")

create_png(os.path.join(img_dir, 'icon.png'),          1024, 1024, DARK)
create_png(os.path.join(img_dir, 'adaptive-icon.png'),  1024, 1024, DARK)
create_png(os.path.join(img_dir, 'splash.png'),          1284, 2778, DARK)
create_png(os.path.join(img_dir, 'favicon.png'),           48,   48, DARK)

print("\nSolid-color placeholder assets created.")
print("Install Pillow and re-run for branded text: pip install Pillow")
