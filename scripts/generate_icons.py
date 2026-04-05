"""
Generate placeholder CareLog icon assets.
Run: python scripts/generate_icons.py
Requires: pip install Pillow
"""
import os
import sys

try:
    from PIL import Image, ImageDraw, ImageFont
except ImportError:
    print("Pillow not installed. Creating minimal placeholders...")
    # Create minimal 1x1 PNG files as placeholders
    import struct, zlib

    def create_minimal_png(path, width=100, height=100, r=11, g=22, b=34):
        """Create a solid color PNG without Pillow"""

        def create_png(w, h, r, g, b):
            raw_data = b''
            for y in range(h):
                raw_data += b'\x00'  # filter byte
                for x in range(w):
                    raw_data += bytes([r, g, b])
            compressed = zlib.compress(raw_data)

            # PNG signature
            sig = b'\x89PNG\r\n\x1a\n'

            def chunk(chunk_type, data):
                c = chunk_type + data
                crc = zlib.crc32(c) & 0xffffffff
                return struct.pack('>I', len(data)) + c + struct.pack('>I', crc)

            ihdr_data = struct.pack('>IIBBBBB', w, h, 8, 2, 0, 0, 0)
            return sig + chunk(b'IHDR', ihdr_data) + chunk(b'IDAT', compressed) + chunk(b'IEND', b'')

        os.makedirs(os.path.dirname(path), exist_ok=True)
        with open(path, 'wb') as f:
            f.write(create_png(width, height, r, g, b))
        print(f"  Created: {path} ({width}x{height})")

    base = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    img_dir = os.path.join(base, 'assets', 'images')
    os.makedirs(img_dir, exist_ok=True)

    # Teal brand color: #00D4AA = (0, 212, 170)
    # Dark background: #0B1622 = (11, 22, 34)
    create_minimal_png(os.path.join(img_dir, 'icon.png'), 100, 100, 0, 212, 170)
    create_minimal_png(os.path.join(img_dir, 'adaptive-icon.png'), 100, 100, 0, 212, 170)
    create_minimal_png(os.path.join(img_dir, 'splash.png'), 100, 200, 11, 22, 34)
    create_minimal_png(os.path.join(img_dir, 'favicon.png'), 48, 48, 0, 212, 170)
    print("\nPlaceholder assets created! Replace with real designs.")
    sys.exit(0)

# If Pillow IS available — generate nicer icons
base = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
img_dir = os.path.join(base, 'assets', 'images')
os.makedirs(img_dir, exist_ok=True)

TEAL = (0, 212, 170)
DARK = (11, 22, 34)
WHITE = (255, 255, 255)

def make_icon(size, path):
    img = Image.new('RGB', (size, size), TEAL)
    draw = ImageDraw.Draw(img)
    try:
        font = ImageFont.truetype("arial.ttf", size // 3)
    except (IOError, OSError):
        font = ImageFont.load_default()
    text = "CL"
    bbox = draw.textbbox((0, 0), text, font=font)
    tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
    x = (size - tw) // 2
    y = (size - th) // 2
    draw.text((x, y), text, fill=WHITE, font=font)
    img.save(path)
    print(f"  Created: {path} ({size}x{size})")

make_icon(1024, os.path.join(img_dir, 'icon.png'))
make_icon(1024, os.path.join(img_dir, 'adaptive-icon.png'))
make_icon(48, os.path.join(img_dir, 'favicon.png'))

# Splash screen
splash = Image.new('RGB', (1284, 2778), DARK)
draw = ImageDraw.Draw(splash)
try:
    font_large = ImageFont.truetype("arial.ttf", 120)
    font_small = ImageFont.truetype("arial.ttf", 40)
except (IOError, OSError):
    font_large = ImageFont.load_default()
    font_small = ImageFont.load_default()

# Logo mark
logo_size = 200
logo_x = (1284 - logo_size) // 2
logo_y = 1000
draw.rounded_rectangle(
    [logo_x, logo_y, logo_x + logo_size, logo_y + logo_size],
    radius=40,
    fill=TEAL,
)
bbox = draw.textbbox((0, 0), "CL", font=font_large)
tw = bbox[2] - bbox[0]
draw.text((logo_x + (logo_size - tw) // 2, logo_y + 30), "CL", fill=WHITE, font=font_large)

# Tagline
tagline = "Get Paid. Stay Compliant. Feel Seen."
bbox2 = draw.textbbox((0, 0), tagline, font=font_small)
tw2 = bbox2[2] - bbox2[0]
draw.text(((1284 - tw2) // 2, logo_y + logo_size + 60), tagline, fill=TEAL, font=font_small)

splash.save(os.path.join(img_dir, 'splash.png'))
print(f"  Created: splash.png (1284x2778)")
print("\nAll assets generated!")
