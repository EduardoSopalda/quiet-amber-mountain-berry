"""Reveal-only animation of the supplied title slide. No new pixels."""
import os
import numpy as np
from PIL import Image, ImageFilter

SRC = "/workspace/attachments/D2B4B5C9-9C6E-4075-9649-508E91147432.jpg"
OUT = "/workspace/talk/render/frames"
os.makedirs(OUT, exist_ok=True)

im = Image.open(SRC).convert("RGB")
arr = np.asarray(im).astype(np.float32)
h, w, _ = arr.shape

r, g, b = arr[:, :, 0], arr[:, :, 1], arr[:, :, 2]
lum = 0.2126 * r + 0.7152 * g + 0.0722 * b
paper_ref = np.array([241.0, 220.5, 193.3], dtype=np.float32)
dist = np.linalg.norm(arr - paper_ref, axis=2)

# Text stays fully visible, original colour, from frame 0.
text = np.zeros((h, w), dtype=bool)
boxes = [
    (250, 8, 1260, 178),    # title + subtitle
    (18, 28, 280, 210),     # Act I
    (1210, 28, 1485, 220),  # Act II
    (18, 720, 460, 838),    # name + logo
    (470, 735, 1080, 838),  # People Planet Progress
    (1085, 700, 1490, 838), # event
]
for x0, y0, x1, y1 in boxes:
    text[y0:y1, x0:x1] = True

xs = np.arange(w, dtype=np.float32)
split = 735.0

# Warm sheet only. The pale blue field is a ground, not paper and not a line.
warm_paper = (dist < 42.0) & ((r - b) > 22.0)
wash = (
    (xs[None, :] >= split - 8)
    & (~text)
    & ((b - r) > -4.0)
    & (lum >= 182.0)
    & (lum <= 236.0)
)
line_ink = (~warm_paper) & (~wash) & (~text)
left_paper = warm_paper & (xs[None, :] < split) & (~text)

# Blank sheet: hide lines and the blue field. Fill them from warm paper only.
filled = arr.copy()
known = warm_paper | text
for _ in range(110):
    if known.all():
        break
    updated = False
    for dy, dx in ((0, 1), (0, -1), (1, 0), (-1, 0)):
        shifted = np.roll(filled, (dy, dx), (0, 1))
        sk = np.roll(known, (dy, dx), (0, 1))
        if dy == 1:
            sk[0, :] = False
        elif dy == -1:
            sk[-1, :] = False
        if dx == 1:
            sk[:, 0] = False
        elif dx == -1:
            sk[:, -1] = False
        upd = (~known) & sk
        if not upd.any():
            continue
        filled[upd] = shifted[upd]
        known[upd] = True
        updated = True
    if not updated:
        break
if (~known).any():
    filled[~known] = paper_ref

# One even sheet. The grain under the drawing was the old ground, not the paper.
tone = np.median(arr[warm_paper], axis=0).astype(np.float32)
filled[:] = tone
glyph = text & (lum < 185.0) & ((r - b) > 0.0)
filled[glyph] = arr[glyph]

ink = line_ink
left = ink & (xs[None, :] < split)
right = ink & (xs[None, :] >= split)

# Burned copper. Pressure kept. Not orange, not gold.
paper_lum = float(np.dot(paper_ref, np.array([0.2126, 0.7152, 0.0722])))
dark = np.clip((paper_lum - lum) / paper_lum, 0, 1)
copper_light = np.array([176.0, 96.0, 58.0], dtype=np.float32)
copper_deep = np.array([104.0, 46.0, 26.0], dtype=np.float32)
copper_ink = copper_light * (1 - dark[..., None]) + copper_deep * dark[..., None]
copper_px = paper_ref * (1 - dark[..., None]) + copper_ink * dark[..., None]
copper_px = np.clip(copper_px, 0, 255)
# Hotter only for the heartbeat, still inside the copper, never neon.
copper_hot = np.clip(
    copper_px * 0.35 + np.array([214.0, 118.0, 62.0], dtype=np.float32) * 0.65,
    0,
    255,
)

# Thickness of the plan, so heavy structure can lead the fine marks.
alive = ink.copy()
width = np.zeros((h, w), np.uint8)
for k in range(1, 9):
    eroded = alive.copy()
    for dy, dx in ((0, 1), (0, -1), (1, 0), (-1, 0)):
        shifted = np.roll(alive, (dy, dx), (0, 1))
        if dy == 1:
            shifted[0, :] = False
        elif dy == -1:
            shifted[-1, :] = False
        if dx == 1:
            shifted[:, 0] = False
        elif dx == -1:
            shifted[:, -1] = False
        eroded &= shifted
    width[alive & ~eroded] = k
    alive = eroded
width[alive] = 9

y = np.arange(h, dtype=np.float32)[:, None]
jitter = 0.06 * np.sin(y * 0.07)
left_x0 = 40.0
lx = np.clip((xs[None, :] - left_x0) / (split - left_x0) + jitter, 0, 1)
rx = np.clip((xs[None, :] - split) / (w - 80 - split) + jitter * 0.5, 0, 1)

light_cut = float(np.quantile(dark[left], 0.58)) if left.any() else 0.5
search = left & (dark <= light_cut)
commit = left & (dark > light_cut)

# One path along the copper, starting on the wing, not on a stray mark.
cols = np.where(left.sum(axis=0) >= 6)[0]
ridge = []
py = None
for x in cols:
    ys = np.flatnonzero(left[:, x])
    if ys.size == 0:
        continue
    if py is None:
        y = float(np.median(ys))
    else:
        near = ys[np.abs(ys.astype(np.float32) - py) <= 36]
        pool = near if near.size else ys
        y = float(np.median(pool))
    py = y if py is None else 0.7 * py + 0.3 * y
    ridge.append((float(x), float(py)))
ridge = np.array(ridge, dtype=np.float32) if ridge else np.zeros((0, 2), np.float32)
if len(ridge) > 5:
    step = np.hypot(np.diff(ridge[:, 0]), np.diff(ridge[:, 1]))
    dist_along = np.concatenate([[0], np.cumsum(step)])
    samples = np.arange(0, dist_along[-1], 3.0)
    proton_path = np.stack(
        [
            np.interp(samples, dist_along, ridge[:, 0]),
            np.interp(samples, dist_along, ridge[:, 1]),
        ],
        axis=1,
    )
else:
    proton_path = ridge

# A small gold proton. Bright core, soft halo. Precomputed once.
_n = 91
_yy, _xx = np.mgrid[-_n // 2 : _n // 2, -_n // 2 : _n // 2]
_rad = np.hypot(_xx, _yy)
_core = np.exp(-(_rad ** 2) / (2 * 3.2 ** 2))
_mid = np.exp(-(_rad ** 2) / (2 * 11.0 ** 2))
_halo_g = np.exp(-(_rad ** 2) / (2 * 26.0 ** 2))
proton_alpha = np.clip(_core * 1.0 + _mid * 0.72 + _halo_g * 0.42, 0, 1).astype(np.float32)
proton_rgb = (
    np.array([255.0, 228.0, 140.0]) * _core[..., None]
    + np.array([236.0, 168.0, 38.0]) * (1.0 - _core[..., None])
).astype(np.float32)

# Contour of the plan, then its body, then the loose marks.
# A thin pixel touching a mass is an edge being traced. A thin pixel alone is grain.
thick = right & (width >= 4)
near_thick = thick.copy()
for _ in range(3):
    grown = near_thick.copy()
    for dy, dx in ((0, 1), (0, -1), (1, 0), (-1, 0)):
        shifted = np.roll(near_thick, (dy, dx), (0, 1))
        if dy == 1:
            shifted[0, :] = False
        elif dy == -1:
            shifted[-1, :] = False
        if dx == 1:
            shifted[:, 0] = False
        elif dx == -1:
            shifted[:, -1] = False
        grown |= shifted
    near_thick = grown
outline = right & (width <= 2) & near_thick
figure = right & (width >= 3)
grain = right & ~outline & ~figure
print("plan layers", "outline", int(outline.sum()), "figure", int(figure.sum()), "grain", int(grain.sum()))

# Halo lives only on the committed copper, blurred a hair.
commit_layer = np.zeros_like(arr)
commit_layer[commit] = copper_hot[commit]
halo = np.asarray(
    Image.fromarray(commit_layer.astype(np.uint8)).filter(ImageFilter.GaussianBlur(radius=2.2))
).astype(np.float32)
halo_strength = np.clip(halo.max(axis=2) / 255.0, 0, 1)
halo_zone = (xs[None, :] < split + 12) & (~text)

# Contact shadow. Light from the upper left, shade falling two pixels down-right.
# Warm umber, never a black drop-shadow. Type is excluded.
ink_alpha = Image.fromarray((ink.astype(np.uint8) * 255))
shadow_map = np.asarray(ink_alpha.filter(ImageFilter.GaussianBlur(radius=2.6))).astype(np.float32) / 255.0
shadow_map = np.roll(shadow_map, (3, 2), (0, 1))
shadow_map[:3, :] = 0
shadow_map[:, :2] = 0
shadow_color = np.array([88.0, 64.0, 46.0], dtype=np.float32)

FPS = 24
DURATION = 29.0
N = int(FPS * DURATION)

def fade(t, t0, t1):
    if t <= t0:
        return 0.0
    if t >= t1:
        return 1.0
    u = (t - t0) / (t1 - t0)
    return u * u * (3.0 - 2.0 * u)

def outline_front(t):
    return fade(t, 9.2, 15.4)

def beat(t):
    """Lub-dub. Starts when the committed stroke exists. Still before the read."""
    if t < 5.6 or t >= 23.5:
        return 0.0
    cycle = 1.7
    p = ((t - 5.6) % cycle) / cycle
    def pulse(center, width, amp):
        d = abs(p - center)
        if d > width:
            return 0.0
        u = 1.0 - d / width
        return amp * u * u
    return pulse(0.05, 0.09, 1.0) + pulse(0.20, 0.06, 0.42)

def frame_at(t):
    # Paper stays paper. The blue field is the last, faintest arrival.
    out = filled.copy()
    field = fade(t, 23.2, 27.2)
    if field > 0 and wash.any():
        out[wash] = filled[wash] * (1.0 - field) + arr[wash] * field

    if t >= 5.6:
        show_search = search
    elif t > 0.8:
        show_search = search & (lx <= (t - 0.8) / 4.8)
    else:
        show_search = np.zeros_like(search)
    if t >= 8.6:
        show_commit = commit
    elif t > 5.6:
        show_commit = commit & (lx <= (t - 5.6) / 3.0)
    else:
        show_commit = np.zeros_like(commit)

    uo = outline_front(t)
    # The contour is traced. A little drift so the edge is not a ruler.
    outline_key = np.clip((xs[None, :] - 760.0) / (1460.0 - 760.0) + jitter * 0.55, 0, 1)
    show_outline = outline & (outline_key <= uo) if uo > 0 else np.zeros_like(outline)
    fig = fade(t, 15.2, 19.2)
    grain_u = fade(t, 19.0, 24.0)

    shown = show_search | show_commit | show_outline
    if fig > 0.35:
        shown = shown | figure
    if grain_u > 0.35:
        shown = shown | grain
    if shown.any():
        near = np.asarray(
            Image.fromarray((shown.astype(np.uint8) * 255)).filter(ImageFilter.GaussianBlur(radius=2.2))
        ).astype(np.float32) / 255.0
        shade = shadow_map * near * 0.28
        shade[text] = 0
        shade[wash] = 0
        a = shade[..., None]
        out = out * (1.0 - a) + shadow_color * a

    out[show_search] = copper_px[show_search]
    out[show_commit] = copper_px[show_commit]
    if show_outline.any():
        out[show_outline] = arr[show_outline]
    if fig > 0 and figure.any():
        out[figure] = filled[figure] * (1.0 - fig) + arr[figure] * fig
    if grain_u > 0 and grain.any():
        out[grain] = filled[grain] * (1.0 - grain_u) + arr[grain] * grain_u

    b = beat(t)
    if b > 0.01 and show_commit.any():
        veil = halo_zone & (halo_strength > 0.04) & show_commit
        # a soft rim, only beside strokes already drawn
        rim = halo_zone & (halo_strength > 0.08)
        a = (b * 0.55 * halo_strength)[..., None]
        out = out * (1 - a) + halo * a
        hot = b * 0.72
        out[show_commit] = copper_px[show_commit] * (1 - hot) + copper_hot[show_commit] * hot
        out[show_search] = copper_px[show_search]
        if show_outline.any():
            out[show_outline] = arr[show_outline]
        if fig > 0 and figure.any():
            out[figure] = filled[figure] * (1.0 - fig) + arr[figure] * fig
        if grain_u > 0 and grain.any():
            out[grain] = filled[grain] * (1.0 - grain_u) + arr[grain] * grain_u
        del veil, rim
    # Gold proton. One point, traveling the copper after the sketch exists.
    if len(proton_path) > 1 and 9.0 <= t <= 26.5:
        u = (t - 9.0) / 14.0
        u = min(1.0, max(0.0, u))
        u = u * u * (3.0 - 2.0 * u)
        idx = u * (len(proton_path) - 1)
        i0 = int(idx)
        i1 = min(i0 + 1, len(proton_path) - 1)
        f = idx - i0
        px = float(proton_path[i0, 0] * (1 - f) + proton_path[i1, 0] * f)
        py_ = float(proton_path[i0, 1] * (1 - f) + proton_path[i1, 1] * f)
        n = proton_alpha.shape[0]
        half = n // 2
        x0 = int(round(px)) - half
        y0 = int(round(py_)) - half
        x1, y1 = x0 + n, y0 + n
        sx0, sy0 = max(0, -x0), max(0, -y0)
        sx1 = n - max(0, x1 - w)
        sy1 = n - max(0, y1 - h)
        dx0, dy0 = max(0, x0), max(0, y0)
        dx1, dy1 = min(w, x1), min(h, y1)
        if dx1 > dx0 and dy1 > dy0:
            a = proton_alpha[sy0:sy1, sx0:sx1][..., None]
            rgb = proton_rgb[sy0:sy1, sx0:sx1]
            out[dy0:dy1, dx0:dx1] = out[dy0:dy1, dx0:dx1] * (1.0 - a) + rgb * a
    out[glyph] = arr[glyph]
    return out

def save_frame(i, t):
    img = Image.fromarray(np.clip(frame_at(t), 0, 255).astype(np.uint8))
    img.save(os.path.join(OUT, f"f{i:04d}.jpg"), quality=92, subsampling=0)

if __name__ == "__main__":
    import subprocess
    import sys

    if len(sys.argv) > 1 and sys.argv[1] == "preview":
        for t in (0, 3, 6, 8, 12, 16, 24):
            img = Image.fromarray(np.clip(frame_at(t), 0, 255).astype(np.uint8))
            path = f"/workspace/screenshots/anim-t{int(t):02d}.jpg"
            img.save(path, quality=90)
            print("wrote", path)
    else:
        out_path = "/workspace/public/talk/opening.mp4"
        cmd = [
            "ffmpeg", "-y",
            "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{w}x{h}", "-r", str(FPS),
            "-i", "-",
            "-vf", "pad=1500:846:0:0:color=0xF1DCC1",
            "-c:v", "libx264", "-pix_fmt", "yuv420p", "-crf", "16",
            "-movflags", "+faststart",
            out_path,
        ]
        proc = subprocess.Popen(cmd, stdin=subprocess.PIPE)
        assert proc.stdin is not None
        for i in range(N):
            frame = np.clip(frame_at(i / FPS), 0, 255).astype(np.uint8)
            proc.stdin.write(frame.tobytes())
            if i % 24 == 0:
                print(f"t={i / FPS:.0f}s", flush=True)
        proc.stdin.close()
        code = proc.wait()
        print("ffmpeg", code, out_path)
