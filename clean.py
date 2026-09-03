from PIL import Image, ImageFilter
import colorsys

def clean_character_cutout(in_path, out_path, is_maveli=False):
    img = Image.open(in_path).convert('RGBA')
    pixels = img.load()
    w, h = img.size

    # First pass: Green screen transparency
    for y in range(h):
        for x in range(w):
            r, g, b, a = pixels[x, y]
            h_val, s_val, v_val = colorsys.rgb_to_hsv(r/255.0, g/255.0, b/255.0)
            h_deg = h_val * 360.0

            # Green wall detection
            if 70 <= h_deg <= 170 and s_val >= 0.12 and v_val > 0.08:
                dist = abs(h_deg - 120)
                factor = max(0.0, min(1.0, (dist - 20) / 22.0))
                pixels[x, y] = (r, g, b, int(a * factor))
            
            # Chalk text / isolated chalk lines removal
            # In Ponjikkara: top-left chalk loop
            if not is_maveli:
                if x < 70 and y < 200:
                    # Chalk strokes are light greenish white
                    if r > 180 and g > 190 and b > 170:
                        pixels[x, y] = (r, g, b, 0)
                # Far right chalk
                if x > w - 25:
                    if r > 160 and g > 180:
                        pixels[x, y] = (r, g, b, 0)
            else:
                # In Maveli: bulb cord at top right
                if x > w - 100 and y < 80:
                    # Bulb cord/bulb
                    pixels[x, y] = (r, g, b, 0)
                # Chalk loops at top
                if y < 80 and x > 180:
                    pixels[x, y] = (r, g, b, 0)

    # Second pass: remove isolated pixel noise (pixels with few opaque neighbors)
    clean_img = img.copy()
    c_pixels = clean_img.load()
    for y in range(1, h - 1):
        for x in range(1, w - 1):
            if pixels[x, y][3] > 30:
                # Check 8-neighbors
                opaque_neighbors = sum(1 for dy in (-1, 0, 1) for dx in (-1, 0, 1) if pixels[x + dx, y + dy][3] > 40)
                if opaque_neighbors <= 2:
                    c_pixels[x, y] = (0, 0, 0, 0)

    clean_img.save(out_path, 'PNG')
    print(f"Cleaned {out_path}")

clean_character_cutout(r'assets\ponjikkara.png', r'assets\ponjikkara_clean.png', is_maveli=False)
clean_character_cutout(r'assets\maveli.png', r'assets\maveli_clean.png', is_maveli=True)
