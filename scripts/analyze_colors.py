"""Extract dominant colors from the dashboard screenshot to inform design tokens."""
from PIL import Image
from collections import Counter
import json

img = Image.open('/home/z/my-project/scripts/dashboard_full.png').convert('RGB')
w, h = img.size
print(f"Image size: {w}x{h}")

# Sample colors at known regions
# Sidebar is on the left ~240px wide
# Top header strip
# Stat cards area
# etc.
samples = {
    "sidebar_bg": (50, 200),       # left sidebar area
    "sidebar_brand_text": (60, 30),
    "main_bg": (800, 100),         # main content area bg
    "header_strip": (800, 50),
    "stat_card_bg": (400, 250),
    "stat_card_value_text": (400, 280),
    "chart_area_bg": (400, 450),
    "interviews_area": (1000, 450),
    "table_header_bg": (400, 650),
    "table_row_bg": (400, 700),
    "status_interview_pill": (650, 700),
    "status_offer_pill": (650, 780),
    "avatar_circle": (1300, 60),
}
print("\n--- Point samples ---")
for name, (x, y) in samples.items():
    if x < w and y < h:
        print(f"{name}: {img.getpixel((x, y))}")

# Now do a full dominant-color analysis on the whole image (downsampled)
small = img.resize((200, 200))
pixels = list(small.getdata())
# Filter out pure white and near-white backgrounds to find accent colors
non_white = [p for p in pixels if not (p[0] > 240 and p[1] > 240 and p[2] > 240)]
counter = Counter(non_white)
print("\n--- Top 25 non-white colors (RGB) ---")
for color, count in counter.most_common(25):
    hex_c = '#{:02x}{:02x}{:02x}'.format(*color)
    print(f"  {hex_c}  rgb{color}  count={count}")

# Look at the left sidebar region specifically
sidebar = img.crop((0, 0, min(260, w), h))
sidebar_small = sidebar.resize((100, 200))
sb_pixels = list(sidebar_small.getdata())
sb_counter = Counter(sb_pixels)
print("\n--- Sidebar top 15 colors ---")
for color, count in sb_counter.most_common(15):
    hex_c = '#{:02x}{:02x}{:02x}'.format(*color)
    print(f"  {hex_c}  rgb{color}  count={count}")

# Top header area
header = img.crop((260, 0, w, 80))
header_small = header.resize((200, 30))
h_pixels = list(header_small.getdata())
h_counter = Counter(h_pixels)
print("\n--- Top header strip top 10 colors ---")
for color, count in h_counter.most_common(10):
    hex_c = '#{:02x}{:02x}{:02x}'.format(*color)
    print(f"  {hex_c}  rgb{color}  count={count}")

# Stat cards area — top-left of main content
stats = img.crop((260, 100, 900, 300))
stats_small = stats.resize((200, 60))
st_pixels = list(stats_small.getdata())
st_counter = Counter(st_pixels)
print("\n--- Stat cards area top 12 colors ---")
for color, count in st_counter.most_common(12):
    hex_c = '#{:02x}{:02x}{:02x}'.format(*color)
    print(f"  {hex_c}  rgb{color}  count={count}")
