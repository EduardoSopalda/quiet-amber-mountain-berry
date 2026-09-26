"""Flat layers for the live KeyframeEffect stack. No new drawing."""
import json
import os

import numpy as np
from PIL import Image

import importlib.util

spec = importlib.util.spec_from_file_location("oa", "/workspace/talk/render/opening_anim.py")
m = importlib.util.module_from_spec(spec)
spec.loader.exec_module(m)

out_dir = "/workspace/talk/layers"
os.makedirs(out_dir, exist_ok=True)


def save(mask, rgb, name):
    h, w = mask.shape
    rgba = np.zeros((h, w, 4), np.uint8)
    if rgb.ndim == 1:
        rgba[..., 0] = rgb[0]
        rgba[..., 1] = rgb[1]
        rgba[..., 2] = rgb[2]
    else:
        rgba[..., :3] = np.clip(rgb, 0, 255).astype(np.uint8)
    rgba[..., 3] = np.where(mask, 255, 0).astype(np.uint8)
    Image.fromarray(rgba, "RGBA").save(os.path.join(out_dir, name))
    print(name, int(mask.sum()))


base = np.clip(m.frame_at(0), 0, 255).astype(np.uint8)
Image.fromarray(base, "RGB").save(os.path.join(out_dir, "base.png"))

save(m.search, m.copper_px, "search.png")
save(m.commit, m.copper_px, "commit.png")
save(m.outline, m.arr, "outline.png")
save(m.figure, m.arr, "figure.png")
save(m.grain, m.arr, "grain.png")
save(m.wash, m.arr, "field.png")

pts = [[round(float(x), 1), round(float(y), 1)] for x, y in m.proton_path[::2]]
d = " ".join(f"{'M' if i == 0 else 'L'}{x} {y}" for i, (x, y) in enumerate(pts))
json.dump({"d": d, "w": m.w, "h": m.h}, open(os.path.join(out_dir, "proton.json"), "w"))
print("proton", len(pts))
