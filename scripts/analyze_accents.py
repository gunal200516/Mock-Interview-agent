"""Find accent (non-grayscale) colors in the dashboard screenshot."""
from PIL import Image
from collections import Counter

img = Image.open('/home/z/my-project/scripts/dashboard_full.png').convert('RGB')
w, h = img.size

def is_grayscale(p, tol=15):
    r, g, b = p
    return abs(r-g) < tol and abs(g-b) < tol and abs(r-b) < tol

# Full image scan for accent colors
small = img.resize((400, 400))
pixels = list(small.getdata())
accent_counter = Counter()
for p in pixels:
    if not is_grayscale(p) and not (p[0] > 240 and p[1] > 240 and p[2] > 240):
        # Quantize to nearest 16 to group similar colors
        q = (p[0]//16*16, p[1]//16*16, p[2]//16*16)
        accent_counter[q] += 1

print("--- Top 30 accent (non-grayscale) colors ---")
for color, count in accent_counter.most_common(30):
    hex_c = '#{:02x}{:02x}{:02x}'.format(*color)
    print(f"  {hex_c}  rgb{color}  count={count}")

# Now scan specific regions where we expect accent colors
# Right side of stat cards — there should be small colored badges
# Stat card region
print("\n--- Stat cards area (260..900, 100..300) accent colors ---")
stat = img.crop((260, 100, 900, 300))
stat_small = stat.resize((300, 100))
sp = list(stat_small.getdata())
sc = Counter()
for p in sp:
    if not is_grayscale(p):
        q = (p[0]//16*16, p[1]//16*16, p[2]//16*16)
        sc[q] += 1
for color, count in sc.most_common(15):
    hex_c = '#{:02x}{:02x}{:02x}'.format(*color)
    print(f"  {hex_c}  rgb{color}  count={count}")

# Status pills in the table — column 3 of the table
# Table is at y ~ 600-770 in the full image
print("\n--- Table status pills region (550..850, 580..780) accent colors ---")
table = img.crop((550, 580, 850, 780))
table_small = table.resize((300, 200))
tp = list(table_small.getdata())
tc = Counter()
for p in tp:
    if not is_grayscale(p):
        q = (p[0]//16*16, p[1]//16*16, p[2]//16*16)
        tc[q] += 1
for color, count in tc.most_common(15):
    hex_c = '#{:02x}{:02x}{:02x}'.format(*color)
    print(f"  {hex_c}  rgb{color}  count={count}")

# Chart bars area — should have visible colored bars
print("\n--- Weekly Activity chart area (260..660, 320..560) accent colors ---")
chart = img.crop((260, 320, 660, 560))
chart_small = chart.resize((300, 200))
cp = list(chart_small.getdata())
cc = Counter()
for p in cp:
    if not is_grayscale(p):
        q = (p[0]//16*16, p[1]//16*16, p[2]//16*16)
        cc[q] += 1
for color, count in cc.most_common(15):
    hex_c = '#{:02x}{:02x}{:02x}'.format(*color)
    print(f"  {hex_c}  rgb{color}  count={count}")

# Avatar / brand mark area
print("\n--- Brand mark area (10..60, 10..60) ---")
brand = img.crop((10, 10, 80, 80))
brand_small = brand.resize((50, 50))
bp = list(brand_small.getdata())
bc = Counter()
for p in bp:
    q = (p[0]//16*16, p[1]//16*16, p[2]//16*16)
    bc[q] += 1
for color, count in bc.most_common(10):
    hex_c = '#{:02x}{:02x}{:02x}'.format(*color)
    print(f"  {hex_c}  rgb{color}  count={count}")

# Interviews list area (right side, top right) - looking for MS, KKR, EVR avatar circles
print("\n--- Interviews list area (660..1280, 320..560) accent colors ---")
iv = img.crop((660, 320, 1280, 560))
iv_small = iv.resize((300, 200))
ip = list(iv_small.getdata())
ic = Counter()
for p in ip:
    if not is_grayscale(p):
        q = (p[0]//16*16, p[1]//16*16, p[2]//16*16)
        ic[q] += 1
for color, count in ic.most_common(15):
    hex_c = '#{:02x}{:02x}{:02x}'.format(*color)
    print(f"  {hex_c}  rgb{color}  count={count}")

# Sidebar active nav item — likely has a warm accent color
print("\n--- Sidebar full (0..260, 0..577) accent colors ---")
sb = img.crop((0, 0, 260, 577))
sb_small = sb.resize((100, 200))
sbp = list(sb_small.getdata())
sbc = Counter()
for p in sbp:
    if not is_grayscale(p):
        q = (p[0]//16*16, p[1]//16*16, p[2]//16*16)
        sbc[q] += 1
for color, count in sbc.most_common(15):
    hex_c = '#{:02x}{:02x}{:02x}'.format(*color)
    print(f"  {hex_c}  rgb{color}  count={count}")
