"""
D4 (megaescala) — Segregación de Schelling a escala MEGACIUDAD.
Malla 2000x2000 = 4.000.000 de celdas (~3.6M agentes). Vectorizado con convolución
(scipy.ndimage) para contar vecinos sin bucles por agente; reubicación vectorizada.
Explota CPU/RAM. Barre la tolerancia y mide segregación emergente + tiempo de cómputo.
"""
import json, time
import numpy as np
from scipy.ndimage import convolve
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt

np.random.seed(42)

SIZE = 8000            # 64,000,000 celdas (16x la versión previa) — explota RAM/CPU
EMPTY_FRAC = 0.08
MAX_STEPS = 60
KERNEL = np.array([[1, 1, 1], [1, 0, 1], [1, 1, 1]], dtype=np.float32)
TOLERANCES = [0.20, 0.35, 0.50, 0.65, 0.80]

def init_grid(size):
    n = size * size
    n_empty = int(EMPTY_FRAC * n)
    half = (n - n_empty) // 2
    flat = np.empty(n, dtype=np.int8)
    flat[:n_empty] = 0
    flat[n_empty:n_empty + half] = 1
    flat[n_empty + half:] = 2
    np.random.shuffle(flat)
    return flat.reshape(size, size)

def neighbor_counts(grid):
    n1 = convolve((grid == 1).astype(np.float32), KERNEL, mode="constant", cval=0.0)
    n2 = convolve((grid == 2).astype(np.float32), KERNEL, mode="constant", cval=0.0)
    return n1, n2

def segregation_index(grid):
    n1, n2 = neighbor_counts(grid)
    total = n1 + n2
    same = np.where(grid == 1, n1, np.where(grid == 2, n2, 0.0))
    occ = (grid != 0) & (total > 0)
    return float(np.mean(same[occ] / total[occ]))

def run(tolerance, size=SIZE, max_steps=MAX_STEPS):
    grid = init_grid(size)
    flat = grid.ravel()
    steps = 0
    for step in range(max_steps):
        steps = step + 1
        n1, n2 = neighbor_counts(grid)
        total = n1 + n2
        same = np.where(grid == 1, n1, np.where(grid == 2, n2, 0.0))
        frac = np.where(total > 0, same / np.maximum(total, 1), 1.0)
        unhappy = (grid != 0) & (total > 0) & (frac < tolerance)
        u_idx = np.flatnonzero(unhappy.ravel())
        if u_idx.size == 0:
            break
        e_idx = np.flatnonzero(flat == 0)
        np.random.shuffle(u_idx)
        np.random.shuffle(e_idx)
        k = min(u_idx.size, e_idx.size)
        u, e = u_idx[:k], e_idx[:k]
        moving = flat[u].copy()
        flat[e] = moving          # ocupar vacíos
        flat[u] = 0               # vaciar origen (disjunto de e)
    return grid, steps

results = []
seg0 = segregation_index(init_grid(SIZE))
t_start = time.time()
final_grid_mid = None
for tol in TOLERANCES:
    t0 = time.time()
    g, steps = run(tol)
    s = segregation_index(g)
    dt = time.time() - t0
    results.append((tol, s, steps, dt))
    if abs(tol - 0.50) < 1e-9:
        final_grid_mid = g
    print(f"[tol={tol}] segregacion={s:.3f} steps={steps} {dt:.1f}s", flush=True)
total_time = time.time() - t_start

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(13, 5.5))
cmap = matplotlib.colors.ListedColormap(["#f0efe9", "#1f4e79", "#c0562f"])
zoom = final_grid_mid[:400, :400]
ax1.imshow(zoom, cmap=cmap, interpolation="nearest")
ax1.set_title(f"Segregacion emergente (zoom 400x400 de {SIZE}x{SIZE})")
ax1.axis("off")
tols = [r[0] for r in results]; segs = [r[1] for r in results]
ax2.axhline(seg0, ls="--", color="#7f8c8d", label=f"mezcla aleatoria inicial ({seg0:.2f})")
ax2.plot(tols, segs, "o-", color="#c0562f", lw=2, label="segregacion final")
ax2.set_xlabel("Umbral de tolerancia (fraccion minima de vecinos iguales)")
ax2.set_ylabel("Indice de segregacion")
ax2.set_ylim(0, 1); ax2.grid(True, ls=":", alpha=0.4); ax2.legend()
ax2.set_title("Orden macro desde micro-reglas - 4M agentes")
fig.tight_layout()
fig.savefig("ciencia/figs/D4_mega.png", dpi=150)

n_agents = int((1 - EMPTY_FRAC) * SIZE * SIZE)
print("===RESULT===")
print(json.dumps({
    "demo": "D4_mega_schelling",
    "tamano_grilla": f"{SIZE}x{SIZE}",
    "n_celdas": SIZE * SIZE,
    "n_agentes": n_agents,
    "segregacion_inicial": round(seg0, 3),
    "tolerancias": tols,
    "segregacion_final": [round(s, 3) for s in segs],
    "tiempo_total_s": round(total_time, 1),
    "figura": "ciencia/figs/D4_mega.png",
}, ensure_ascii=False))
print("===END===")
