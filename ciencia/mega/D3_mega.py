"""
D3 (megaescala) — Dimensión fractal de la forma urbana de una MEGACIUDAD.
Genera una huella urbana a alta resolución (2048x2048 ~ 4.2M celdas) con un modelo de
PERCOLACIÓN CORRELACIONada (ruido suavizado umbralizado, canónico para conectividad urbana:
Makse, Havlin & Stanley, Nature 1995), toma el mayor componente conexo y mide la dimensión
fractal por box-counting. Vectorizado (FFT/ndimage) — explota CPU/RAM.
"""
import json, time
import numpy as np
from scipy import ndimage
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt

rng = np.random.default_rng(42)
N = 8192                                  # 67.1M celdas (16x la versión previa) — explota RAM
t0 = time.time()

# Campo de ruido correlacionado (suavizado gaussiano => parches urbanos orgánicos)
field = rng.standard_normal((N, N)).astype(np.float32)
field = ndimage.gaussian_filter(field, sigma=1.7)

# Umbral JUSTO en el punto de percolación => cúmulo percolante incipiente, ramificado
# y auto-similar (universalidad de percolación 2D: D teórico = 91/48 ≈ 1.896).
thr = np.quantile(field, 0.50)          # ocupa ~34%: cluster que apenas atraviesa, fractal
occ = field > thr

# Mayor componente conexo (vecindad 8)
structure = np.ones((3, 3), dtype=int)
lbl, num = ndimage.label(occ, structure=structure)
counts = np.bincount(lbl.ravel())
counts[0] = 0
largest_label = counts.argmax()
city = (lbl == largest_label)
n_occ = int(city.sum())

# Box-counting sobre ~2.5 décadas de escala (se omiten las cajas más pequeñas,
# del orden de la longitud de suavizado, que sesgan la pendiente)
sizes = [4, 8, 16, 32, 64, 128, 256, 512, 1024]
counts_box = []
for s in sizes:
    m = N // s
    sub = city[:m * s, :m * s].reshape(m, s, m, s)
    occupied_boxes = sub.any(axis=(1, 3)).sum()
    counts_box.append(int(occupied_boxes))

logs = np.log(np.array(sizes, dtype=float))
logc = np.log(np.array(counts_box, dtype=float))
slope, b = np.polyfit(logs, logc, 1)
D = -slope
pred = b + slope * logs
ss_res = np.sum((logc - pred) ** 2)
ss_tot = np.sum((logc - logc.mean()) ** 2)
r2 = 1 - ss_res / ss_tot
elapsed = time.time() - t0

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(13, 6))
ax1.imshow(city, cmap="binary", interpolation="nearest")
ax1.set_title(f"Huella urbana (mayor cluster, {n_occ:,} celdas de {N}x{N})")
ax1.axis("off")
ax2.loglog(sizes, counts_box, "o", color="#1f4e79", ms=9, label="conteo de cajas")
ax2.loglog(sizes, np.exp(pred), "-", color="#c0562f", lw=2, label=f"D = {D:.3f}  (R2 = {r2:.3f})")
ax2.set_xlabel("Tamano de caja (log)")
ax2.set_ylabel("N cajas ocupadas (log)")
ax2.set_title("Box-counting")
ax2.grid(True, which="both", ls=":", alpha=0.4)
ax2.legend()
fig.tight_layout()
fig.savefig("ciencia/figs/D3_mega.png", dpi=150)

print("===RESULT===")
print(json.dumps({
    "demo": "D3_mega_fractal",
    "resolucion": f"{N}x{N}",
    "n_celdas_totales": N * N,
    "n_celdas_ocupadas": n_occ,
    "dimension_fractal_D": round(float(D), 3),
    "R2": round(float(r2), 4),
    "tiempo_s": round(elapsed, 1),
    "figura": "ciencia/figs/D3_mega.png",
}, ensure_ascii=False))
print("===END===")
