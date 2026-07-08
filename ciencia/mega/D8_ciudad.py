"""
D8 — Escala CIUDAD: D5 (la métrica decide el centro) y D6 (métrica del cuerpo)
sobre una red peatonal REAL mucho mayor (radio 4 km desde el centro: centro
histórico + primer anillo, ~23k nodos), no solo La Candelaria. El argumento
político es sobre la ciudad, no sobre el centro; y la pendiente importa más
lejos del centro plano. Closeness exacta vía scipy.sparse.csgraph (rápida);
betweenness muestreada. Elevación real SRTM. Datos reales.
"""
import json, math, time, urllib.parse, urllib.request
from pathlib import Path
import numpy as np
import networkx as nx
import scipy.sparse as sp
from scipy.sparse.csgraph import dijkstra
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt

WS = Path("/workspace/ensayo-filosofia-ciudad")
ELEV_CACHE = WS / "ciencia/data/d8_elev_cache.json"
FIG = WS / "ciencia/figs/D8_mega.png"
CENTER = (6.2476, -75.5658)
DIST = 4000
K_BET = 1500
t0 = time.time()

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
print(f"[D8] red real (radio {DIST} m): {N} nodos, {G.number_of_edges()} aristas, {time.time()-t0:.1f}s", flush=True)

# --- elevación SRTM (opentopodata, batch, caché) ---
cache = json.loads(ELEV_CACHE.read_text()) if ELEV_CACHE.exists() else {}
kf = lambda lat, lon: f"{lat:.5f},{lon:.5f}"
todo = [(n, float(G.nodes[n]["y"]), float(G.nodes[n]["x"])) for n in nodes if kf(G.nodes[n]["y"], G.nodes[n]["x"]) not in cache]
print(f"[D8] elevaciones a pedir: {len(todo)} (caché {N-len(todo)})", flush=True)
i = 0
while i < len(todo):
    batch = todo[i:i + 100]
    locs = "|".join(f"{la:.6f},{lo:.6f}" for _, la, lo in batch)
    url = "https://api.opentopodata.org/v1/srtm30m?locations=" + urllib.parse.quote(locs, safe="|,.-")
    ok = False
    for att in range(6):
        try:
            with urllib.request.urlopen(url, timeout=40) as r:
                data = json.loads(r.read().decode("utf-8"))
            if data.get("status") == "OK":
                for (_, la, lo), res in zip(batch, data["results"]):
                    e = res.get("elevation")
                    cache[kf(la, lo)] = float(e) if e is not None else None
                ok = True
                break
        except Exception as exc:
            print(f"[D8] batch {i} intento {att}: {type(exc).__name__}", flush=True)
        time.sleep(8)
    if not ok:
        raise SystemExit("opentopodata no respondió")
    ELEV_CACHE.write_text(json.dumps(cache))
    i += 100
    if i % 1000 == 0:
        print(f"[D8] elevaciones {i}/{len(todo)}", flush=True)
    time.sleep(1.1)
for n in nodes:
    G.nodes[n]["elev"] = cache.get(kf(G.nodes[n]["y"], G.nodes[n]["x"]))
elevs = np.array([G.nodes[n]["elev"] for n in nodes if G.nodes[n]["elev"] is not None], float)
print(f"[D8] elevación: {elevs.min():.0f}–{elevs.max():.0f} m (rango {elevs.max()-elevs.min():.0f} m)", flush=True)

# --- matrices dispersas: longitud (no dirigida) y tiempo-Tobler (dirigida) ---
def tobler(g):
    return 6.0 * math.exp(-3.5 * abs(g + 0.05))  # km/h
rl, cl, wl = [], [], []
rt, ct, wt = [], [], []
for u, v, d in G.edges(data=True):
    a, b = idx[u], idx[v]
    L = float(d["length"])
    eu, ev = G.nodes[u]["elev"], G.nodes[v]["elev"]
    if L <= 0:
        continue
    rl += [a, b]; cl += [b, a]; wl += [L, L]
    if eu is not None and ev is not None:
        g = (ev - eu) / L
        tuv = L / (tobler(g) * 1000 / 3600)
        tvu = L / (tobler(-g) * 1000 / 3600)
        rt += [a, b]; ct += [b, a]; wt += [tuv, tvu]
A_len = sp.csr_matrix((wl, (rl, cl)), shape=(N, N))
A_time = sp.csr_matrix((wt, (rt, ct)), shape=(N, N))

# --- closeness plano (no dirigida) y del cuerpo (incoming, dirigida) ---
t1 = time.time()
Dl = dijkstra(A_len, directed=False)
finite = np.isfinite(Dl)
sl = np.where(finite, Dl, 0).sum(axis=1)
reach = finite.sum(axis=1) - 1
clo_flat = np.where(sl > 0, reach / sl, 0.0)
del Dl
Dt = dijkstra(A_time, directed=True)              # Dt[s,t] = tiempo s->t
finite_t = np.isfinite(Dt)
st = np.where(finite_t, Dt, 0).sum(axis=0)         # columna = llegar a t
reach_t = finite_t.sum(axis=0) - 1
clo_body = np.where(st > 0, reach_t / st, 0.0)
del Dt
print(f"[D8] closeness (plano+cuerpo) en {time.time()-t1:.1f}s", flush=True)

# --- betweenness muestreada ---
t2 = time.time()
bet = nx.betweenness_centrality(G, k=min(K_BET, N), weight="length", seed=42, normalized=True)
betv = np.array([bet[n] for n in nodes])
print(f"[D8] betweenness (k={K_BET}) en {time.time()-t2:.1f}s", flush=True)

def top(vals, frac=0.05):
    k = max(1, int(round(frac * len(vals))))
    return set(np.argsort(vals)[::-1][:k].tolist())
def jac(a, b):
    return len(a & b) / len(a | b) if (a | b) else 0.0
tb, tf, tbody = top(betv), top(clo_flat), top(clo_body)
c_flat = int(np.argmax(clo_flat)); c_body = int(np.argmax(clo_body))
def hav(i, j):
    R = 6371000
    la1, lo1 = math.radians(G.nodes[nodes[i]]["y"]), math.radians(G.nodes[nodes[i]]["x"])
    la2, lo2 = math.radians(G.nodes[nodes[j]]["y"]), math.radians(G.nodes[nodes[j]]["x"])
    h = math.sin((la2-la1)/2)**2 + math.cos(la1)*math.cos(la2)*math.sin((lo2-lo1)/2)**2
    return 2*R*math.asin(math.sqrt(h))
prom_bet = float(np.sort(betv)[::-1][:max(1, int(0.05*N))].mean() / (betv.mean() + 1e-15))
desp = hav(c_flat, c_body)

xs = np.array([G.nodes[n]["x"] for n in nodes]); ys = np.array([G.nodes[n]["y"] for n in nodes])
ev = np.array([G.nodes[n]["elev"] if G.nodes[n]["elev"] is not None else np.nan for n in nodes], float)
fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(15, 7))
for ax in (ax1, ax2):
    ax.set_aspect("equal"); ax.axis("off")
s1 = ax1.scatter(xs, ys, c=ev, cmap="terrain", s=3)
ax1.set_title(f"Elevación real (SRTM) — radio 4 km\nrango {np.nanmax(ev)-np.nanmin(ev):.0f} m")
plt.colorbar(s1, ax=ax1, shrink=0.6, label="m s.n.m.")
s2 = ax2.scatter(xs, ys, c=clo_body, cmap="viridis", s=3)
ax2.scatter([xs[c_body]], [ys[c_body]], s=220, facecolors="none", edgecolors="#e8934f", linewidths=2.6, label="centro del CUERPO")
ax2.scatter([xs[c_flat]], [ys[c_flat]], s=220, facecolors="none", edgecolors="#1f77b4", linewidths=2.6, label="centro del FLUJO")
ax2.set_title(f"Cercanía por esfuerzo (Tobler)\nlos centros distan {desp:.0f} m")
ax2.legend(loc="lower left", fontsize=9)
fig.suptitle("D8 — Escala ciudad (radio 4 km, red real de Medellín): la métrica y el cuerpo desplazan el centro", fontweight="bold")
fig.tight_layout()
fig.savefig(FIG, dpi=150)

print("===RESULT===")
print(json.dumps({
    "demo": "D8_ciudad",
    "radio_m": DIST, "n_nodos": N, "n_aristas": G.number_of_edges(),
    "elev_rango_m": round(float(elevs.max() - elevs.min()), 0),
    "prominencia_betweenness_top5": round(prom_bet, 2),
    "jaccard_bet_vs_closeness_flat_top5": round(jac(tb, tf), 3),
    "jaccard_cuerpo_vs_flujo_top5": round(jac(tbody, tf), 3),
    "desplazamiento_centro_cuerpo_vs_flujo_m": round(desp, 0),
    "k_betweenness": K_BET,
    "figura": "ciencia/figs/D8_mega.png",
    "tiempo_s": round(time.time() - t0, 1),
}, ensure_ascii=False))
print("===END===")
