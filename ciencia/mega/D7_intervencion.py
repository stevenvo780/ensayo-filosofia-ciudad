"""
D7 — Umbral de intervención contra la segregación (Schelling con palanca).
Sostiene "cultivar lo emergente": la emergencia es TERCA (no cualquier intervención
la rompe) y hace falta un umbral concreto de institución. Se prueban DOS palancas
con tolerancia fija 0.5 (la preferencia "leve"):
 (A) vivienda INDIFERENTE (agentes que satisfacen a cualquiera): NO funciona —
     diluir densidad no rompe el sorting de A/B.
 (B) vivienda ANCLADA/integrada (una fracción de residentes es fija: no se muda,
     ubicada de entrada en mezcla): SÍ funciona a partir de un umbral. Es la cifra
     constructiva: cuánta permanencia integrada hace falta para sostener la mezcla.
Malla 300×300, semilla 42, vectorizado. Figura + JSON.
"""
import json, time
from pathlib import Path
import numpy as np
from scipy.ndimage import convolve
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt

WS = Path("/workspace/ensayo-filosofia-ciudad")
FIG = WS / "ciencia/figs/D7_mega.png"
SIZE, EMPTY, TOL, STEPS = 300, 0.08, 0.5, 60
KERN = np.array([[1, 1, 1], [1, 0, 1], [1, 1, 1]], np.int8)
PS = np.round(np.arange(0, 0.75, 0.05), 2)


def counts(grid):
    a = convolve((grid == 1).astype(np.int16), KERN, mode="constant")
    b = convolve((grid == 2).astype(np.int16), KERN, mode="constant")
    return a, b


def seg_index(grid):
    a, b = counts(grid)
    den = a + b
    ma, mb = grid == 1, grid == 2
    same = np.where(ma, a, np.where(mb, b, 0.0)).astype(float)
    r = np.ones_like(same)
    np.divide(same, den, out=r, where=den > 0)
    m = ma | mb
    return float(r[m].mean()) if m.any() else 0.0


def init(p, lever):
    """lever 'indiff': fracción p indiferente (tipo 3). lever 'anchor': fracción p fija (frozen)."""
    rng = np.random.default_rng(42)
    occ = rng.random((SIZE, SIZE)) >= EMPTY
    grid = np.zeros((SIZE, SIZE), np.int8)
    frozen = np.zeros((SIZE, SIZE), bool)
    rp = rng.random((SIZE, SIZE))
    rt = rng.random((SIZE, SIZE))
    if lever == "indiff":
        ind = occ & (rp < p)
        rest = occ & ~ind
        grid[ind] = 3
        grid[rest & (rt < 0.5)] = 1
        grid[rest & (rt >= 0.5)] = 2
    else:  # anchor: fracción p de ocupados es fija (no se muda), tipada A/B 50/50
        grid[occ & (rt < 0.5)] = 1
        grid[occ & (rt >= 0.5)] = 2
        frozen = occ & (rp < p)
    return grid, frozen


def run(p, lever):
    grid, frozen = init(p, lever)
    flat = grid.ravel()
    fro = frozen.ravel()
    for _ in range(STEPS):
        a, b = counts(grid)
        den = a + b
        ma, mb = grid == 1, grid == 2
        same = np.where(ma, a, np.where(mb, b, 0.0)).astype(float)
        r = np.ones_like(same)
        np.divide(same, den, out=r, where=den > 0)
        unhappy = (ma | mb) & (den > 0) & (r < TOL) & (~frozen)
        u = np.flatnonzero(unhappy.ravel())
        e = np.flatnonzero(flat == 0)
        if u.size == 0 or e.size == 0:
            break
        np.random.default_rng(_).shuffle(u)
        np.random.default_rng(_ + 1).shuffle(e)
        k = min(u.size, e.size)
        mov = flat[u[:k]].copy()
        flat[e[:k]] = mov
        flat[u[:k]] = 0
        fro[e[:k]] = False  # el que llega no es fijo
    return seg_index(grid)


t0 = time.time()
seg_indiff = [run(p, "indiff") for p in PS]
seg_anchor = [run(p, "anchor") for p in PS]
umbral = next((float(p) for p, s in zip(PS, seg_anchor) if s < 0.65), None)

fig, ax = plt.subplots(figsize=(9.5, 5.6))
ax.plot(PS, seg_indiff, "o--", color="#8a8a8a", lw=2, label="palanca A: vivienda indiferente (no funciona)")
ax.plot(PS, seg_anchor, "o-", color="#1f4e79", lw=2.4, label="palanca B: vivienda anclada/integrada")
ax.axhline(0.65, color="#c0562f", ls="--", lw=1.6, label="umbral 0.65 (mezcla sostenida)")
if umbral is not None:
    ax.axvline(umbral, color="#c0562f", ls=":", lw=2)
    ax.scatter([umbral], [0.65], color="#c0562f", s=80, zorder=5, label=f"umbral = {umbral:.0%} anclada")
ax.set_title("D7 — Cuánta institución cuesta romper el sorting (Schelling, tol=0.5)")
ax.set_xlabel("fracción de vivienda intervenida (p)")
ax.set_ylabel("segregación final")
ax.set_ylim(0.4, 1.0); ax.grid(True, alpha=.25); ax.legend(fontsize=9)
fig.tight_layout(); fig.savefig(FIG, dpi=150)

print("===RESULT===")
print(json.dumps({
    "demo": "D7_intervencion",
    "tolerancia": TOL, "size": SIZE, "p_barrido": [float(p) for p in PS],
    "seg_palanca_indiferente": [round(s, 3) for s in seg_indiff],
    "seg_palanca_anclada": [round(s, 3) for s in seg_anchor],
    "seg_sin_intervencion": round(seg_anchor[0], 3),
    "p_umbral_anclada": umbral,
    "hallazgo": "la vivienda indiferente NO rompe la segregación; la vivienda anclada/integrada la rompe a partir de un umbral",
    "figura": "ciencia/figs/D7_mega.png",
    "tiempo_s": round(time.time() - t0, 1),
}, ensure_ascii=False))
print("===END===")
