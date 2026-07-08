"""
D9 — Robustez / significancia de D5. ¿La prominencia del corredor y la
divergencia entre métricas son estructura real o artefactos? Se comparan contra
un ensemble de grafos NULOS con la misma secuencia de grados (double-edge-swap,
que preserva grados pero destruye la geometría de calle). Métricas TOPOLÓGICAS
(sin peso) para que la comparación real-vs-nulo sea limpia. Datos reales (red D5).
"""
import json, time
from pathlib import Path
import numpy as np
import networkx as nx
import scipy.sparse as sp
from scipy.sparse.csgraph import dijkstra

WS = Path("/workspace/ensayo-filosofia-ciudad")
CENTER = (6.2476, -75.5658)
DIST = 2000
K_BET = 500
N_NULL = 60
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
G.add_edges_from((u, v) for u, v in Gu.edges())
G = G.subgraph(max(nx.connected_components(G), key=len)).copy()
G = nx.convert_node_labels_to_integers(G)
N = G.number_of_nodes()
print(f"[D9] red D5: {N} nodos, {G.number_of_edges()} aristas, {time.time()-t0:.1f}s", flush=True)


def closeness_scipy(H):
    n = H.number_of_nodes()
    A = nx.to_scipy_sparse_array(H, nodelist=range(n), format="csr", weight=None, dtype=float)
    D = dijkstra(A, directed=False)
    fin = np.isfinite(D)
    s = np.where(fin, D, 0).sum(axis=1)
    reach = fin.sum(axis=1) - 1
    return np.where(s > 0, reach / s, 0.0)


def metrics(H, seed):
    bet = nx.betweenness_centrality(H, k=min(K_BET, H.number_of_nodes()), seed=seed, normalized=True)
    bv = np.array([bet[i] for i in range(H.number_of_nodes())])
    cv = closeness_scipy(H)
    k = max(1, int(round(0.05 * len(bv))))
    tb = set(np.argsort(bv)[::-1][:k].tolist())
    tc = set(np.argsort(cv)[::-1][:k].tolist())
    prom = float(np.sort(bv)[::-1][:k].mean() / (bv.mean() + 1e-15))
    jac = len(tb & tc) / len(tb | tc) if (tb | tc) else 0.0
    return prom, jac


prom_real, jac_real = metrics(G, 42)
print(f"[D9] real: prominencia={prom_real:.2f}, jaccard(bet,clo)={jac_real:.3f}", flush=True)

proms, jacs = [], []
E = G.number_of_edges()
for i in range(N_NULL):
    H = G.copy()
    nx.double_edge_swap(H, nswap=E, max_tries=E * 20, seed=i)
    Hc = H.subgraph(max(nx.connected_components(H), key=len)).copy()
    Hc = nx.convert_node_labels_to_integers(Hc)
    p, j = metrics(Hc, 1000 + i)
    proms.append(p); jacs.append(j)
    if (i + 1) % 15 == 0:
        print(f"[D9] nulos {i+1}/{N_NULL}", flush=True)
proms = np.array(proms); jacs = np.array(jacs)


def z(x, arr):
    return float((x - arr.mean()) / (arr.std() + 1e-12))


def pct(x, arr):
    return float((arr < x).mean())

res = {
    "demo": "D9_robustez",
    "n_nodos": N, "n_nulos": N_NULL, "k_betweenness": K_BET,
    "prominencia_real": round(prom_real, 2),
    "prominencia_nulos_media": round(float(proms.mean()), 2),
    "prominencia_nulos_sd": round(float(proms.std()), 2),
    "prominencia_z": round(z(prom_real, proms), 1),
    "prominencia_percentil": round(pct(prom_real, proms), 3),
    "jaccard_real": round(jac_real, 3),
    "jaccard_nulos_media": round(float(jacs.mean()), 3),
    "jaccard_nulos_sd": round(float(jacs.std()), 3),
    "nota": "métricas topológicas (sin peso); el rewiring preserva grados y destruye la geometría de calle",
    "tiempo_s": round(time.time() - t0, 1),
}
print("===RESULT===")
print(json.dumps(res, ensure_ascii=False))
print("===END===")
