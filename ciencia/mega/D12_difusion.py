"""
D12 — Difusión / esparcimiento sobre el grafo REAL de Medellín (movilidad
predictiva). Mismo tejido que D8: red peatonal real (radio 4 km desde el centro,
~22.9k nodos), elevación SRTM real cacheada, y matriz de tiempo-Tobler DIRIGIDA
(A_time) que encarna el esfuerzo de la pendiente. Tres lecturas:

 (a) CAMPO DE FOOTFALL — distribución estacionaria de una caminata aleatoria
     sobre la red. El caminante prefiere las aristas MÁS BARATAS en tiempo-Tobler
     (P[i,j] ∝ 1/t_ij, dirigido y asimétrico: bajar es más fácil que subir), con
     amortiguación tipo PageRank (α=0.85) para unicidad. π predice el flujo
     peatonal RELATIVO por nodo. Se compara con el footfall trivial (∝ grado) para
     ver cuánto lo reesculpe el cuerpo.
 (b) ISÓCRONAS DE 15 min — frente de difusión por dijkstra ponderado en TIEMPO
     desde dos semillas (centro plano y una ladera). PLANA (velocidad constante,
     sin pendiente) vs PENDIENTE (Tobler, ya en A_time). Cuánta área/nodos alcanza
     cada una: la pendiente encoge el alcance en la ladera.
 (c) CUELLOS DE BOTELLA DINÁMICOS — aristas con mayor flujo esperado de la
     caminata estacionaria (corriente π[i]·P[i,j] + π[j]·P[j,i]); top-N.

Datos reales, offline desde caché OSM+SRTM. Semilla 42. Reproducible.
"""
import json, math, time
from pathlib import Path
import numpy as np
import networkx as nx
import scipy.sparse as sp
from scipy.sparse.csgraph import dijkstra
from scipy.spatial import ConvexHull
from scipy.stats import spearmanr
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt

np.random.seed(42)
WS = Path("/workspace/ensayo-filosofia-ciudad")
ELEV_CACHE = WS / "ciencia/data/d8_elev_cache.json"
FIG = WS / "ciencia/figs/D12_mega.png"
CENTER = (6.2476, -75.5658)
DIST = 4000
T_ISO = 900.0          # 15 minutos en segundos
TOP_EDGES = 12
t0 = time.time()

# ------------------------------------------------------------------ red real
import osmnx as ox
ox.settings.log_console = False
ox.settings.use_cache = True
Gd = ox.graph_from_point(CENTER, dist=DIST, network_type="walk", simplify=True)
try:
    Gu = ox.convert.to_undirected(Gd)
except Exception:
    Gu = Gd.to_undirected()
G = nx.Graph()
for n, d in Gu.nodes(data=True):
    G.add_node(n, x=d.get("x"), y=d.get("y"))
for u, v, d in Gu.edges(data=True):
    L = d.get("length", 1.0)
    if not G.has_edge(u, v):
        G.add_edge(u, v, length=float(L))
G = G.subgraph(max(nx.connected_components(G), key=len)).copy()
nodes = list(G.nodes())
idx = {n: i for i, n in enumerate(nodes)}
N = len(nodes)
print(f"[D12] red real (radio {DIST} m): {N} nodos, {G.number_of_edges()} aristas, {time.time()-t0:.1f}s", flush=True)

# ------------------------------------------------------ elevación SRTM (caché)
cache = json.loads(ELEV_CACHE.read_text()) if ELEV_CACHE.exists() else {}
kf = lambda lat, lon: f"{lat:.5f},{lon:.5f}"
miss = [n for n in nodes if cache.get(kf(G.nodes[n]["y"], G.nodes[n]["x"])) is None]
if miss:
    raise SystemExit(f"[D12] faltan {len(miss)} elevaciones en caché; corré D8 primero.")
for n in nodes:
    G.nodes[n]["elev"] = cache[kf(G.nodes[n]["y"], G.nodes[n]["x"])]
elevs = np.array([G.nodes[n]["elev"] for n in nodes], float)
print(f"[D12] elevación: {elevs.min():.0f}–{elevs.max():.0f} m (rango {elevs.max()-elevs.min():.0f} m)", flush=True)

# ----------------------------- matrices: longitud (no dirig.) y tiempo-Tobler
def tobler(g):
    return 6.0 * math.exp(-3.5 * abs(g + 0.05))          # km/h
V_FLAT = tobler(0.0) * 1000.0 / 3600.0                    # m/s en terreno plano
rl, cl, wl = [], [], []                                   # longitud (simétrica)
rt, ct, wt = [], [], []                                   # tiempo-Tobler (dirigida)
for u, v, d in G.edges(data=True):
    a, b = idx[u], idx[v]
    L = float(d["length"])
    if L <= 0:
        continue
    eu, ev = G.nodes[u]["elev"], G.nodes[v]["elev"]
    rl += [a, b]; cl += [b, a]; wl += [L, L]
    g = (ev - eu) / L
    tuv = L / (tobler(g) * 1000 / 3600)
    tvu = L / (tobler(-g) * 1000 / 3600)
    rt += [a, b]; ct += [b, a]; wt += [tuv, tvu]
A_len = sp.csr_matrix((wl, (rl, cl)), shape=(N, N))
A_time = sp.csr_matrix((wt, (rt, ct)), shape=(N, N))       # A_time[i,j] = t(i->j)
A_flat = A_len * (1.0 / V_FLAT)                            # tiempo plano (simétrico)

# ================================================================ (a) FOOTFALL
# Caminata que prefiere aristas baratas en tiempo: peso W[i,j] = 1/t(i->j).
W = A_time.copy()
W.data = 1.0 / W.data
r = np.asarray(W.sum(axis=1)).ravel()                      # normalizador por fila
r[r == 0] = 1.0
WT = W.T.tocsr()                                           # para π·P vía P^T·π
alpha = 0.85
pi = np.full(N, 1.0 / N)
for it in range(2000):
    y = WT.dot(pi / r)                                     # (P^T π)_j = Σ_i W[i,j] π_i / r_i
    nxt = alpha * y + (1.0 - alpha) / N
    nxt /= nxt.sum()
    if np.abs(nxt - pi).sum() < 1e-12:
        pi = nxt; break
    pi = nxt
footfall = pi
# Footfall trivial (caminata uniforme no dirigida): π ∝ grado topológico.
deg = np.array([G.degree(n) for n in nodes], float)
foot_deg = deg / deg.sum()
rho_deg = float(spearmanr(footfall, foot_deg).statistic)
rho_elev = float(spearmanr(footfall, elevs).statistic)   # ¿el footfall se acumula abajo?
top_ff = np.argsort(footfall)[::-1][:10]
print(f"[D12] footfall estacionario en {it} iters; Spearman(footfall, grado)={rho_deg:.3f}, "
      f"Spearman(footfall, elev)={rho_elev:.3f}", flush=True)

# =============================================================== (b) ISÓCRONAS
def nearest_node(lat, lon):
    R = 6371000.0
    la = np.radians(np.array([G.nodes[n]["y"] for n in nodes]))
    lo = np.radians(np.array([G.nodes[n]["x"] for n in nodes]))
    la0, lo0 = math.radians(lat), math.radians(lon)
    h = np.sin((la - la0) / 2) ** 2 + np.cos(la0) * np.cos(la) * np.sin((lo - lo0) / 2) ** 2
    return int(np.argmin(2 * R * np.arcsin(np.sqrt(h))))

# equirectangular local -> metros (para áreas)
lat0 = math.radians(CENTER[0])
mx = np.array([(math.radians(G.nodes[n]["x"]) - math.radians(CENTER[1])) * 6371000.0 * math.cos(lat0) for n in nodes])
my = np.array([(math.radians(G.nodes[n]["y"]) - math.radians(CENTER[0])) * 6371000.0 for n in nodes])
dist_center = np.hypot(mx, my)

seed_centro = nearest_node(*CENTER)
# ladera: nodo más alto DENTRO de 2 km del centro (evita truncar la isócrona en el borde)
inner = dist_center <= 2000.0
seed_ladera = int(np.where(inner, elevs, -np.inf).argmax())
seeds = {"centro": seed_centro, "ladera": seed_ladera}

def hull_area_km2(mask):
    pts = np.column_stack([mx[mask], my[mask]])
    if pts.shape[0] < 3:
        return 0.0
    try:
        return float(ConvexHull(pts).volume) / 1e6      # 'volume' en 2D = área (m²)->km²
    except Exception:
        return 0.0

iso = {}
for name, s in seeds.items():
    d_flat = dijkstra(A_flat, directed=False, indices=[s])[0]      # simétrico
    d_slope = dijkstra(A_time, directed=True, indices=[s])[0]      # saliente, con pendiente
    m_flat = d_flat <= T_ISO
    m_slope = d_slope <= T_ISO
    iso[name] = dict(
        d_flat=d_flat, d_slope=d_slope, m_flat=m_flat, m_slope=m_slope,
        n_flat=int(m_flat.sum()), n_slope=int(m_slope.sum()),
        area_flat=hull_area_km2(m_flat), area_slope=hull_area_km2(m_slope),
        elev_seed=float(elevs[s]),
    )
    r_n = iso[name]["n_slope"] / max(1, iso[name]["n_flat"])
    print(f"[D12] iso {name} (elev {elevs[s]:.0f} m): plana {iso[name]['n_flat']} nodos / "
          f"pendiente {iso[name]['n_slope']} nodos (ratio {r_n:.2f}); "
          f"área {iso[name]['area_flat']:.2f}→{iso[name]['area_slope']:.2f} km²", flush=True)

# =================================================== (c) CUELLOS DE BOTELLA
# corriente por arista no dirigida = π_i·P[i,j] + π_j·P[j,i]
edge_flow = []
for u, v in G.edges():
    a, b = idx[u], idx[v]
    tab = A_time[a, b]; tba = A_time[b, a]
    fab = footfall[a] * (1.0 / tab) / r[a] if tab > 0 else 0.0
    fba = footfall[b] * (1.0 / tba) / r[b] if tba > 0 else 0.0
    edge_flow.append((fab + fba, a, b))
edge_flow.sort(reverse=True)
bottlenecks = []
for f, a, b in edge_flow[:TOP_EDGES]:
    bottlenecks.append({
        "flujo": float(f),
        "lat": round((G.nodes[nodes[a]]["y"] + G.nodes[nodes[b]]["y"]) / 2, 5),
        "lon": round((G.nodes[nodes[a]]["x"] + G.nodes[nodes[b]]["x"]) / 2, 5),
    })

# ===================================================================== figura
xs = np.array([G.nodes[n]["x"] for n in nodes]); ys = np.array([G.nodes[n]["y"] for n in nodes])
fig, axes = plt.subplots(1, 3, figsize=(21, 7))
for ax in axes:
    ax.set_aspect("equal"); ax.axis("off")

# panel 1: footfall + cuellos de botella
lf = np.log10(footfall + 1e-12)
s1 = axes[0].scatter(xs, ys, c=lf, cmap="magma", s=3)
for f, a, b in edge_flow[:TOP_EDGES]:
    axes[0].plot([xs[a], xs[b]], [ys[a], ys[b]], color="#25d0d0", lw=4.0, alpha=0.95, zorder=4)
    axes[0].scatter([(xs[a]+xs[b])/2], [(ys[a]+ys[b])/2], s=55, facecolors="none",
                    edgecolors="#25d0d0", linewidths=1.8, zorder=5)
axes[0].set_title("(a) Campo de footfall (caminata Tobler)\n+ cuellos de botella dinámicos (cian)")
plt.colorbar(s1, ax=axes[0], shrink=0.6, label="log₁₀ footfall estacionario")

# paneles 2 y 3: isócronas plana vs pendiente
for ax, name in zip(axes[1:], ("centro", "ladera")):
    r_ = iso[name]
    ax.scatter(xs, ys, c="#e9e6df", s=2, zorder=1)
    ax.scatter(xs[r_["m_flat"]], ys[r_["m_flat"]], c="#1f77b4", s=5, zorder=2, label=f"plana ({r_['n_flat']})")
    ax.scatter(xs[r_["m_slope"]], ys[r_["m_slope"]], c="#e8934f", s=5, zorder=3, label=f"pendiente ({r_['n_slope']})")
    s = seeds[name]
    ax.scatter([xs[s]], [ys[s]], s=160, marker="*", color="#c0392b", edgecolors="k", linewidths=0.6, zorder=5)
    ax.set_title(f"(b) Isócrona 15 min — {name} ({r_['elev_seed']:.0f} m)\n"
                 f"área plana {r_['area_flat']:.2f} vs pendiente {r_['area_slope']:.2f} km²")
    ax.legend(loc="lower left", fontsize=9)

fig.suptitle("D12 — Difusión sobre la red real de Medellín: footfall predictivo e isócronas de 15 min (plana vs pendiente)",
             fontsize=14, fontweight="bold", y=1.02)
fig.tight_layout(rect=[0, 0, 1, 0.96])
fig.savefig(FIG, dpi=150, bbox_inches="tight")

# ==================================================================== salida
res = {
    "demo": "D12_difusion",
    "radio_m": DIST, "n_nodos": N, "n_aristas": G.number_of_edges(),
    "elev_rango_m": round(float(elevs.max() - elevs.min()), 0),
    "footfall": {
        "iteraciones": it,
        "spearman_vs_grado": round(rho_deg, 3),
        "spearman_vs_elevacion": round(rho_elev, 3),
        "top10_footfall_coords": [[round(G.nodes[nodes[i]]["y"], 5), round(G.nodes[nodes[i]]["x"], 5)] for i in top_ff],
        "concentracion_top1pct": round(float(np.sort(footfall)[::-1][:max(1, N // 100)].sum()), 3),
    },
    "isocronas_15min": {
        name: {
            "elev_semilla_m": round(r_["elev_seed"], 0),
            "coord_semilla": [round(G.nodes[nodes[seeds[name]]]["y"], 5), round(G.nodes[nodes[seeds[name]]]["x"], 5)],
            "nodos_plano": r_["n_flat"], "nodos_pendiente": r_["n_slope"],
            "ratio_pendiente_plana": round(r_["n_slope"] / max(1, r_["n_flat"]), 3),
            "area_plana_km2": round(r_["area_flat"], 3), "area_pendiente_km2": round(r_["area_slope"], 3),
            "area_perdida_pct": round(100 * (1 - r_["area_slope"] / max(1e-9, r_["area_flat"])), 1),
        } for name, r_ in iso.items()
    },
    "v_flat_kmh": round(V_FLAT * 3.6, 2),
    "cuellos_de_botella_top": bottlenecks,
    "figura": "ciencia/figs/D12_mega.png",
    "tiempo_s": round(time.time() - t0, 1),
}
print("===RESULT===")
print(json.dumps(res, ensure_ascii=False))
print("===END===")
