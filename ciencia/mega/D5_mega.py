"""
D5 (real) — Red de calles REAL del centro de Medellín (corredor Junín–San Antonio).

Descarga la red peatonal real vía OpenStreetMap (osmnx) y calcula TRES medidas de
centralidad EXACTAS: intermediación (betweenness), cercanía (closeness) y de vector
propio (eigenvector). El punto político: la elección de la métrica DECIDE qué nodos
aparecen como "centrales" — se cuantifica con el solapamiento (Jaccard) entre los
top-k de cada métrica y con el nodo #1 de cada una. La "prominencia del eje" se mide
como la razón entre la centralidad media del 5% superior y la media de la red.
Datos reales; centralidad exacta (sin muestreo). Reemplaza el múltiplo del grafo
estilizado sintético de versiones previas.
"""
import json, time
import numpy as np
import networkx as nx
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt

t0 = time.time()
CENTER = (6.2476, -75.5658)   # Parque Berrío, centro de Medellín
DIST = 2000
es_real = False
G = None
try:
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
        length = d.get("length", 1.0)
        if not G.has_edge(u, v):
            G.add_edge(u, v, length=length)
    comp = max(nx.connected_components(G), key=len)
    G = G.subgraph(comp).copy()
    es_real = True
    ciudad = "Medellín (La Candelaria), red peatonal real OSM"
except Exception as exc:
    print("osmnx/descarga falló:", exc, flush=True)
    raise SystemExit("D5 requiere la red real; abortando en lugar de fabricar dato.")

n_nodes = G.number_of_nodes()
n_edges = G.number_of_edges()
print(f"[D5] red real: {n_nodes} nodos, {n_edges} aristas, {time.time()-t0:.1f}s", flush=True)

# --- Centralidades EXACTAS (sin muestreo) ---
t1 = time.time()
bet = nx.betweenness_centrality(G, weight="length", normalized=True)          # exacta
print(f"[D5] betweenness exacta en {time.time()-t1:.1f}s", flush=True)
t1 = time.time()
clo = nx.closeness_centrality(G, distance="length")                            # exacta
print(f"[D5] closeness exacta en {time.time()-t1:.1f}s", flush=True)
# Eigenvector TOPOLÓGICA (weight=None): en networkx el peso es fuerza de acoplamiento,
# no distancia — ponderar por "length" invertiría la semántica (calle más larga = conexión
# más fuerte). Sin peso, mide la conectividad recursiva del tejido, bien definida.
try:
    eig = nx.eigenvector_centrality_numpy(G, weight=None)
except Exception:
    eig = nx.eigenvector_centrality(G, max_iter=1000, weight=None)

def top_set(cent, frac=0.05):
    k = max(1, int(round(frac * len(cent))))
    return set(sorted(cent, key=cent.get, reverse=True)[:k])

def prominence(cent, frac=0.05):
    vals = np.array(list(cent.values()), float)
    k = max(1, int(round(frac * len(vals))))
    top_mean = np.sort(vals)[::-1][:k].mean()
    return float(top_mean / (vals.mean() + 1e-15))

tb, tc, te = top_set(bet), top_set(clo), top_set(eig)
def jac(a, b): return len(a & b) / len(a | b) if (a | b) else 0.0

metrics = {"betweenness": bet, "closeness": clo, "eigenvector": eig}
top1 = {name: max(c, key=c.get) for name, c in metrics.items()}
top1_coords = {name: (round(G.nodes[nid]["y"], 5), round(G.nodes[nid]["x"], 5))
               for name, nid in top1.items()}

result = {
    "demo": "D5_mega_red",
    "ciudad": ciudad,
    "es_real": es_real,
    "n_nodos": n_nodes,
    "n_aristas": n_edges,
    "betweenness_max": round(float(max(bet.values())), 4),
    "betweenness_media": round(float(np.mean(list(bet.values()))), 5),
    "prominencia_eje_betweenness": round(prominence(bet), 2),   # top5% / media (emergente)
    "prominencia_eje_closeness": round(prominence(clo), 2),
    "jaccard_top5pct": {
        "betweenness_vs_closeness": round(jac(tb, tc), 3),
        "betweenness_vs_eigenvector": round(jac(tb, te), 3),
        "closeness_vs_eigenvector": round(jac(tc, te), 3),
    },
    "nodo1_distinto_por_metrica": len(set(top1.values())) > 1,
    "top1_coords": top1_coords,
    "centralidad_exacta": True,
    "tiempo_s": round(time.time() - t0, 1),
    "figura": "ciencia/figs/D5_mega.png",
}

# --- Figura: 3 paneles, una por métrica, mismo grafo ---
xs = np.array([G.nodes[n]["x"] for n in G.nodes()])
ys = np.array([G.nodes[n]["y"] for n in G.nodes()])
fig, axes = plt.subplots(1, 3, figsize=(18, 6.2))
for ax, (name, cent) in zip(axes, metrics.items()):
    cv = np.array([cent[n] for n in G.nodes()], float)
    for u, v in G.edges():
        ax.plot([G.nodes[u]["x"], G.nodes[v]["x"]], [G.nodes[u]["y"], G.nodes[v]["y"]],
                color="#c9c4b8", lw=0.4, alpha=0.55, zorder=1)
    sc = ax.scatter(xs, ys, c=cv, s=6 + 240 * (cv / (cv.max() + 1e-12)),
                    cmap="inferno", zorder=2, edgecolors="none")
    # marcar el nodo #1 de esta métrica
    nid = top1[name]
    ax.scatter([G.nodes[nid]["x"]], [G.nodes[nid]["y"]], s=180, facecolors="none",
               edgecolors="#0a7", linewidths=2.2, zorder=3)
    ax.set_title(f"Centralidad: {name}\n(nodo #1 marcado)")
    ax.set_aspect("equal"); ax.axis("off")
    plt.colorbar(sc, ax=ax, shrink=0.55)
fig.suptitle(f"Misma red real ({n_nodes} nodos · {n_edges} aristas) — la MÉTRICA decide el centro",
             fontsize=13, fontweight="bold")
fig.tight_layout()
fig.savefig("ciencia/figs/D5_mega.png", dpi=150)

print("===RESULT===")
print(json.dumps(result, ensure_ascii=False))
print("===END===")
