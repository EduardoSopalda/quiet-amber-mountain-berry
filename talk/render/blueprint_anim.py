"""The sketch draws itself. No hand.

The blueprint is its elements, not one smear.
One block. A second block. Then the roads, like veins.
The rest follows because it cannot stop: hatches, blocks,
trees, nodes, water, the mast, the compass, the grid.
"""
import os
import subprocess
import sys

import numpy as np
from PIL import Image
from scipy import ndimage

SRC = "/workspace/public/talk/drawing.jpg"
MASKS = "/workspace/talk/render/elements.npz"
LUCIO_DIR = "/tmp/lucioframes"
OUT = "/workspace/public/talk/opening.mp4"

src = np.asarray(Image.open(SRC).convert("RGB")).astype(np.float32)
sh, sw, _ = src.shape
r, g, b = src[:, :, 0], src[:, :, 1], src[:, :, 2]
lum = 0.2126 * r + 0.7152 * g + 0.0722 * b
paper = np.median(src[8:40, 8:80].reshape(-1, 3), axis=0)
paper_lum = float(np.dot(paper, [0.2126, 0.7152, 0.0722]))
paper_br = float(paper[2] - paper[0])
dd = np.clip((paper_lum - lum) / (paper_lum - 38.0), 0, 1)
excess = (b - r) - paper_br * (1.0 - dd)
blue_w = np.clip((excess - 6.0) / 16.0, 0, 1)
ink = dd > 0.12
sketch0 = ink & (blue_w < 0.35) & (np.arange(sw)[None, :] < 830)

z = np.load(MASKS)
roads0 = z["roads"] > 0
blocks0 = z["blocks"] > 0
trees0 = z["trees"] > 0
nodes0 = z["nodes"] > 0
hatch0 = z["hatch"] > 0
inner0 = z["inner"] > 0
outer0 = z["outer"] > 0
mast0 = z["mast"] > 0
compass0 = z["compass"] > 0
spine0 = z["spine"] > 0
grid0 = z["grid"] > 0
b1_0 = z["block1"] > 0
b2_0 = z["block2"] > 0
wake0 = z["wake"] > 0

def spread_points(mask, n, rng):
    ys, xs = np.where(mask)
    if len(ys) == 0:
        return []
    sample = rng.choice(len(ys), size=min(3500, len(ys)), replace=False)
    sy, sx = ys[sample].astype(np.int32), xs[sample].astype(np.int32)
    chosen = [(int(sy[0]), int(sx[0]))]
    for _ in range(n - 1):
        dmin = np.full(len(sy), 1e9, np.float32)
        for cy, cx in chosen:
            dmin = np.minimum(dmin, (sy - cy) ** 2 + (sx - cx) ** 2)
        j = int(np.argmax(dmin))
        chosen.append((int(sy[j]), int(sx[j])))
    return chosen


def grow(mask, points, limit=760, bridge_px=2):
    """Distance from several origins at once. Each origin grows in every direction."""
    bridge = ndimage.binary_dilation(mask, iterations=bridge_px) if bridge_px else mask
    small = bridge[::2, ::2]
    dist = np.full(small.shape, np.int16(9999))
    max_delay = 0
    for y, x, delay in points:
        yy, xx = int(y) // 2, int(x) // 2
        yy = int(np.clip(yy, 0, small.shape[0] - 1))
        xx = int(np.clip(xx, 0, small.shape[1] - 1))
        if not small[yy, xx]:
            y0, y1 = max(0, yy - 24), min(small.shape[0], yy + 24)
            x0, x1 = max(0, xx - 24), min(small.shape[1], xx + 24)
            hit = np.argwhere(small[y0:y1, x0:x1])
            if len(hit) == 0:
                continue
            k = int(np.argmin((hit[:, 0] - (yy - y0)) ** 2 + (hit[:, 1] - (xx - x0)) ** 2))
            yy, xx = int(hit[k, 0] + y0), int(hit[k, 1] + x0)
        delay = int(delay)
        if delay < int(dist[yy, xx]):
            dist[yy, xx] = delay
        max_delay = max(max_delay, delay)
    for step in range(limit):
        frontier = dist == step
        if not frontier.any():
            if step > max_delay and not np.any((dist > step) & (dist < 9000)):
                break
            continue
        newly = ndimage.binary_dilation(frontier) & small & (dist > step + 1)
        dist[newly] = np.int16(step + 1)
        if step >= max_delay and not newly.any() and not np.any((dist > step) & (dist < 9000)):
            break
    full = np.repeat(np.repeat(dist.astype(np.float32), 2, 0), 2, 1)[: mask.shape[0], : mask.shape[1]]
    reached = mask & (full < 9000)
    vmax = float(np.percentile(full[reached], 97)) if reached.any() else 1.0
    out = np.ones(mask.shape, np.float32)
    out[reached] = np.clip(full[reached] / max(vmax, 1.0), 0, 1)
    return out


body = np.zeros((sh, sw), bool)
for key in ("roads", "blocks", "trees", "nodes", "hatch", "inner", "outer",
            "mast", "spine", "wake", "block1", "block2"):
    body |= z[key] > 0

rng_pts = np.random.default_rng(4)


def centroid(mask):
    ys, xs = np.where(mask)
    return int(ys.mean()), int(xs.mean())


plan_pts = []
for m in (b1_0, b2_0):
    if m.any():
        plan_pts.append((*centroid(m), 0))
# Origins scattered over the sheet. Their delays are not ordered by x,
# so the city does not travel in one direction.
delays = [0, 8, 0, 14, 4, 10, 0, 18]
for (y, x), delay in zip(spread_points(body, len(delays), rng_pts), delays):
    plan_pts.append((y, x, delay))
print("origins", len(plan_pts), flush=True)
vein = grow(body, plan_pts)

sketch_pts = []
for (y, x), delay in zip(spread_points(sketch0, 6, rng_pts), (0, 0, 0, 6, 0, 8)):
    sketch_pts.append((y, x, delay))
sketch_when0 = grow(sketch0, sketch_pts, limit=520, bridge_px=1)

# A soft noise, so branches lead and trail instead of arriving on a line.
def soft_noise(scale, seed):
    rng_n = np.random.default_rng(seed)
    gh, gw = sh // scale + 2, sw // scale + 2
    grid_n = rng_n.random((gh, gw)).astype(np.float32)
    big = np.asarray(
        Image.fromarray((grid_n * 255).astype(np.uint8)).resize((sw, sh), Image.Resampling.BILINEAR)
    ).astype(np.float32) / 255.0
    return big * 2.0 - 1.0


def cell_when(mask, shift, jitter, seed):
    lab, _ = ndimage.label(mask)
    when = np.ones((sh, sw), np.float32)
    rng_n = np.random.default_rng(seed)
    for i, sli in enumerate(ndimage.find_objects(lab), 1):
        if sli is None:
            continue
        m = lab[sli] == i
        if int(m.sum()) < 4:
            continue
        med = float(np.median(vein[sli][m]))
        when[sli][m] = np.clip(med + shift + float(rng_n.normal(0, jitter)), 0, 1)
    return when


road_when = np.clip(vein + soft_noise(16, 3) * 0.06, 0, 1)
hatch_when = np.clip(vein + soft_noise(12, 7) * 0.045 + 0.03, 0, 1)
wake_when = np.clip(vein + soft_noise(20, 9) * 0.05 + 0.055, 0, 1)
block_when = cell_when(blocks0, 0.045, 0.028, 5)
tree_when = cell_when(trees0, 0.09, 0.055, 8)
node_when = cell_when(nodes0, 0.03, 0.02, 4)
road_vein = np.where(roads0, vein, 1.0).astype(np.float32)
near_road = ndimage.minimum_filter(road_vein, size=27)
thick_w = ndimage.distance_transform_edt(inner0 | outer0).astype(np.float32)
inner_when = np.clip(near_road + np.clip(thick_w / 16.0, 0, 1) * 0.10, 0, 1)
outer_when = np.clip(near_road + 0.04 + np.clip(thick_w / 22.0, 0, 1) * 0.12, 0, 1)
spine_when = np.clip(vein + 0.02, 0, 1)
mast_base = float(np.median(vein[mast0])) if mast0.any() else 0.72

SCALE = 0.74
H, W = sh, sw
nh, nw = int(round(sh * SCALE)), int(round(sw * SCALE))
OX = (W - nw) // 2


def lift_b(mask):
    small = np.asarray(
        Image.fromarray((mask.astype(np.uint8) * 255)).resize((nw, nh), Image.Resampling.NEAREST)
    ) > 127
    out = np.zeros((H, W), dtype=bool)
    out[:nh, OX:OX + nw] = small
    return out


def lift_f(field):
    small = np.asarray(
        Image.fromarray(np.clip(field * 255, 0, 255).astype(np.uint8)).resize(
            (nw, nh), Image.Resampling.NEAREST
        )
    ).astype(np.float32) / 255.0
    out = np.ones((H, W), np.float32)
    out[:nh, OX:OX + nw] = small
    return out


def lift_time(field, fill=99.0):
    ys = np.clip((np.arange(nh) / SCALE).astype(np.int32), 0, sh - 1)
    xs = np.clip((np.arange(nw) / SCALE).astype(np.int32), 0, sw - 1)
    out = np.full((H, W), fill, np.float32)
    out[:nh, OX:OX + nw] = field[ys][:, xs]
    return out


mast_order = np.zeros((sh, sw), np.float32)
if mast0.any():
    ys = np.where(mast0.any(1))[0]
    foot, head_y = int(ys.max()), int(ys.min())
    span = max(1, foot - head_y)
    mast_order = np.clip((foot - np.arange(sh)[:, None]) / span, 0, 1).astype(np.float32)

plate = np.asarray(
    Image.fromarray(src.astype(np.uint8)).resize((nw, nh), Image.Resampling.LANCZOS)
).astype(np.float32)
sketch_s = np.asarray(
    Image.fromarray(sketch0.astype(np.uint8) * 255).resize((nw, nh), Image.Resampling.NEAREST)
) > 127
arr = np.tile(paper, (H, W, 1)).astype(np.float32)
arr[:nh, OX:OX + nw] = plate
sketch = np.zeros((H, W), dtype=bool)
sketch[:nh, OX:OX + nw] = sketch_s

M = {
    k: lift_b(v)
    for k, v in {
        "roads": roads0, "blocks": blocks0, "trees": trees0, "nodes": nodes0,
        "hatch": hatch0, "inner": inner0, "outer": outer0, "mast": mast0,
        "compass": compass0, "spine": spine0, "grid": grid0,
        "b1": b1_0, "b2": b2_0, "wake": wake0,
    }.items()
}
ROAD_WHEN = lift_f(road_when)
HATCH_WHEN = lift_f(hatch_when)
WAKE_WHEN = lift_f(wake_when)
BLOCK_WHEN = lift_f(block_when)
TREE_WHEN = lift_f(tree_when)
NODE_WHEN = lift_f(node_when)
INNER_WHEN = lift_f(inner_when)
OUTER_WHEN = lift_f(outer_when)
SPINE_WHEN = lift_f(spine_when)
MAST_ORDER = lift_f(mast_order)

sheet = arr.copy()
any_plan = np.zeros((H, W), dtype=bool)
for m in M.values():
    any_plan |= m
sheet[sketch | any_plan] = paper


def draw_order(mask):
    if not mask.any():
        return np.zeros((H, W), np.float32)
    inner = ndimage.distance_transform_edt(mask)
    order = 1.0 - inner / (float(inner[mask].max()) + 1.0)
    order = order.astype(np.float32)
    order[~mask] = 0
    return order


order1 = draw_order(M["b1"])
order2 = draw_order(M["b2"])

rng = np.random.default_rng(7)
hand = lift_f(sketch_when0)

AXIS_X = int(round(738 * SCALE + OX))
TIP_Y = int(round(568 * SCALE))

# Anything the masks missed was sitting on the paper from the first frame.
delta = np.abs(arr - paper).sum(axis=2)
ink_all = delta > 26
sheet[ink_all] = paper
stray = ink_all & ~sketch & ~any_plan
xs = np.arange(W)[None, :]
sketch[stray & (xs < AXIS_X + 24)] = True
M["wake"][stray & (xs >= AXIS_X + 24)] = True


def load_lucio():
    names = sorted(n for n in os.listdir(LUCIO_DIR) if n.endswith(".png"))
    sample = np.asarray(Image.open(os.path.join(LUCIO_DIR, names[0])).convert("RGB")).astype(np.float32)
    fl = 0.2126 * sample[:, :, 0] + 0.7152 * sample[:, :, 1] + 0.0722 * sample[:, :, 2]
    alpha = np.clip((152.0 - fl) / 24.0, 0, 1)
    alpha[:28, :] = 0
    alpha[:, 940:] = 0
    alpha[:, :250] = 0
    yy, xx = np.where(alpha > 0.2)
    y0, y1 = int(yy.min()), int(yy.max()) + 1
    xa, xb = int(xx.min()), int(xx.max()) + 1
    th = 136
    frames = []
    for name in names:
        fr = np.asarray(Image.open(os.path.join(LUCIO_DIR, name)).convert("RGB")).astype(np.float32)
        fl = 0.2126 * fr[:, :, 0] + 0.7152 * fr[:, :, 1] + 0.0722 * fr[:, :, 2]
        al = np.clip((152.0 - fl) / 24.0, 0, 1)
        al[:28, :] = 0
        al[:, 940:] = 0
        al[:, :250] = 0
        crop = np.dstack([fr[y0:y1, xa:xb], al[y0:y1, xa:xb] * 255.0])
        sprite = Image.fromarray(crop.astype(np.uint8), "RGBA").resize(
            (max(1, int((xb - xa) * th / (y1 - y0))), th), Image.Resampling.LANCZOS
        )
        frames.append(np.asarray(sprite).astype(np.float32))
    stack = np.stack(frames, 0)
    return stack, AXIS_X - int(stack.shape[2] * 0.80), TIP_Y + 96


LUCIO, LUCIO_X, LUCIO_Y = load_lucio()
FEET_Y = LUCIO_Y + LUCIO.shape[1] - 8

FPS = 24
DURATION = 26.0
N = int(FPS * DURATION)
SKETCH_A, SKETCH_B = 1.15, 9.6
HALF = SKETCH_A + 0.5 * (SKETCH_B - SKETCH_A)


def fade(t, t0, t1):
    if t <= t0:
        return 0.0
    if t >= t1:
        return 1.0
    u = (t - t0) / (t1 - t0)
    return u * u * (3.0 - 2.0 * u)


def paint(out, mask):
    out[mask] = arr[mask]


def sap(t):
    """Growth, not a clock. It germinates, hesitates, then it cannot stop."""
    t0, t1 = 8.15, 20.2
    if t <= t0:
        return 0.0
    if t >= t1:
        return 1.0
    u = (t - t0) / (t1 - t0)
    a = np.clip(u / 0.30, 0, 1)
    b = np.clip((u - 0.18) / 0.36, 0, 1)
    c = np.clip((u - 0.48) / 0.52, 0, 1)
    a = a * a * (3 - 2 * a)
    b = b * b * (3 - 2 * b)
    c = c * c * (3 - 2 * c)
    v = 0.12 * a + 0.30 * b + 0.58 * c
    v += 0.016 * np.sin(u * 15.0) * (1.0 - u) ** 1.5
    return float(np.clip(v, 0.0, 1.0))


def pen(out, mask, when, head, width=0.055):
    amount = np.clip((head - when) / width, 0.0, 1.0)
    m = mask & (amount > 0)
    if not np.any(m):
        return
    aa = amount[m][:, None]
    depth = 0.84 + 0.16 * aa
    out[m] = sheet[m] * (1.0 - aa) + arr[m] * depth * aa


def note(out, mask, t0, t, dur):
    u = np.clip((t - t0) / dur, 0.0, 1.0)
    u = u * u * (3.0 - 2.0 * u)
    m = mask & (u > 0)
    if not np.any(m):
        return
    aa = u[m][:, None]
    out[m] = sheet[m] * (1.0 - aa) + arr[m] * aa


def wash(out, mask, t, t0, dur):
    u = fade(t, t0, t0 + dur)
    if u <= 0 or not mask.any():
        return
    out[mask] = sheet[mask] * (1.0 - u) + arr[mask] * u


def frame_at(t):
    out = sheet.copy()
    u_hand = fade(t, SKETCH_A, SKETCH_B)
    if u_hand > 0:
        edge = np.clip((u_hand - hand) / 0.045, 0.0, 1.0)
        m = sketch & (edge > 0)
        aa = edge[m][:, None]
        out[m] = sheet[m] * (1.0 - aa) + arr[m] * aa

    # Two blocks, then the city grows. Branches lead and trail. Nothing is on a beat.
    u1 = fade(t, HALF, HALF + 1.25)
    if u1 > 0:
        paint(out, M["b1"] & (order1 >= 1.0 - u1))
    u2 = fade(t, HALF + 1.7, HALF + 2.95)
    if u2 > 0:
        paint(out, M["b2"] & (order2 >= 1.0 - u2))

    head = sap(t)
    if head > 0:
        pen(out, M["roads"], ROAD_WHEN, head, 0.07)
        pen(out, M["hatch"], HATCH_WHEN, head, 0.08)
        pen(out, M["blocks"], BLOCK_WHEN, head, 0.06)
        pen(out, M["nodes"], NODE_WHEN, head, 0.07)
        pen(out, M["trees"], TREE_WHEN, head, 0.09)
        pen(out, M["wake"], WAKE_WHEN, head, 0.08)
        pen(out, M["inner"], INNER_WHEN, head, 0.09)
        pen(out, M["outer"], OUTER_WHEN, head, 0.10)
        pen(out, M["spine"], SPINE_WHEN, head, 0.08)
        if head > mast_base - 0.02:
            risen = np.clip((head - mast_base) / 0.16, 0, 1)
            pen(out, M["mast"], MAST_ORDER, risen, 0.2)
        if head > 0.84:
            u_late = fade(t, 18.8, 23.6)
            if u_late > 0:
                out[M["grid"]] = sheet[M["grid"]] * (1 - u_late) + arr[M["grid"]] * u_late
                out[M["compass"]] = sheet[M["compass"]] * (1 - u_late) + arr[M["compass"]] * u_late

    # He is already there. The page is empty, and he starts it.
    y = FEET_Y
    if 0 <= y < H:
        xa, xb = max(0, AXIS_X - 72), min(W, AXIS_X + 72)
        ink_line = np.array([42.0, 34.0, 28.0], np.float32)
        out[y:y + 2, xa:xb] = ink_line
    idx = int(min(t * FPS, LUCIO.shape[0] - 1))
    sprite = LUCIO[idx]
    shh, sww, _ = sprite.shape
    y0, x0b = LUCIO_Y, LUCIO_X
    y1, x1b = min(H, y0 + shh), min(W, x0b + sww)
    sy, sx = y1 - y0, x1b - x0b
    if sy > 0 and sx > 0:
        rgb = sprite[:sy, :sx, :3]
        al = sprite[:sy, :sx, 3:4] / 255.0
        patch = out[y0:y1, x0b:x1b]
        out[y0:y1, x0b:x1b] = patch * (1 - al) + rgb * al
    return out


def save_preview():
    os.makedirs("/workspace/screenshots", exist_ok=True)
    for t in (0.0, 1.0, 14.5, 24.0):
        img = Image.fromarray(np.clip(frame_at(t), 0, 255).astype(np.uint8))
        path = f"/workspace/screenshots/el-t{int(t*10):03d}.jpg"
        img.save(path, quality=86)
        print("wrote", path, flush=True)


def render():
    cmd = [
        "ffmpeg", "-y", "-f", "rawvideo", "-pix_fmt", "rgb24",
        "-s", f"{W}x{H}", "-r", str(FPS), "-i", "-",
        "-vf", "pad=1500:846:0:0:color=0xEBD6BB",
        "-c:v", "libx264", "-pix_fmt", "yuv420p", "-crf", "17",
        "-movflags", "+faststart", OUT,
    ]
    proc = subprocess.Popen(cmd, stdin=subprocess.PIPE)
    assert proc.stdin is not None
    for i in range(N):
        proc.stdin.write(np.clip(frame_at(i / FPS), 0, 255).astype(np.uint8).tobytes())
        if i % 48 == 0:
            print(f"t={i / FPS:.1f}s", flush=True)
    proc.stdin.close()
    print("ffmpeg", proc.wait(), OUT)


if __name__ == "__main__":
    print("half", round(HALF, 2))
    if len(sys.argv) > 1 and sys.argv[1] == "preview":
        save_preview()
    else:
        render()
