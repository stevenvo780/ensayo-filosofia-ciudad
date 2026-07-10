"""
D13 — Teoría de la decisión: intervención ROBUSTA bajo incertidumbre PROFUNDA de
la métrica (minimax-regret). Mismo tejido real que D8/D12 (red peatonal de
Medellín, radio 4 km, ~22.9k nodos; elevación SRTM real; tiempo-Tobler dirigido).

Problema: hay que priorizar K nodos (esquinas) para intervenir, pero NO sabemos
cuál centralidad es «la correcta». Cuatro candidatas, cada una define un ranking:
  1. betweenness (intermediación, muestreada k=1500, ponderada por longitud)
  2. closeness PLANA (cercanía topológica exacta, sin pendiente)
  3. eigenvector (conectividad recursiva del tejido)
  4. closeness-Tobler ENCARNADA (cercanía por esfuerzo, entrante, dirigida)

- ESTADOS = las 4 métricas (incertidumbre profunda: no hay probabilidades).
- DECISIONES = 5 portafolios de K nodos: el top-K de cada métrica + un MIXTO
  (top-K por score normalizado promedio de las cuatro).
- valor[d,s] = masa de la métrica s capturada por el portafolio d, normalizada por
  la masa del portafolio óptimo para s (top-K de s) ∈ (0,1]; 1.0 = óptimo para s.
- REGRET[d,s] = 1 − valor[d,s]. Se resuelve MINIMAX-REGRET (min_d max_s regret) y
  MAXIMIN (max_d min_s valor). Se reporta el portafolio «sin arrepentimiento», qué
  nodos incluye (coords) y el «precio de la incertidumbre métrica» (su regret).

Datos reales, offline desde caché OSM+SRTM. Semilla 42. Reproducible.
"""
import json, math, time
from pathlib import Path
import numpy as np
import networkx as nx
import scipy.sparse as sp
from scipy.sparse.csgraph import dijkstra
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt

np.random.seed(42)
WS = Path("/workspace/ensayo-filosofia-ciudad")
ELEV_CACHE = WS / "ciencia/data/d8_elev_cache.json"
FIG = WS / "ciencia/figs/D13_mega.png"
CENTER = (6.2476, -75.5658)
DIST = 4000
K_BET = 1500                 # muestras para betweenness (idéntico a D8)
K_PORT = 200                 # presupuesto de intervención: priorizar 200 esquinas
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
print(f"[D13] red real (radio {DIST} m): {N} nodos, {G.number_of_edges()} aristas, {time.time()-t0:.1f}s", flush=True)

# ------------------------------------------------------ elevación SRTM (caché)
cache = json.loads(ELEV_CACHE.read_text()) if ELEV_CACHE.exists() else {}
kf = lambda lat, lon: f"{lat:.5f},{lon:.5f}"
miss = [n for n in nodes if cache.get(kf(G.nodes[n]["y"], G.nodes[n]["x"])) is None]
if miss:
    raise SystemExit(f"[D13] faltan {len(miss)} elevaciones en caché; corré D8 primero.")
for n in nodes:
    G.nodes[n]["elev"] = cache[kf(G.nodes[n]["y"], G.nodes[n]["x"])]
elevs = np.array([G.nodes[n]["elev"] for n in nodes], float)

# ----------------------------- matrices: longitud (no dirig.) y tiempo-Tobler
def tobler(g):
    return 6.0 * math.exp(-3.5 * abs(g + 0.05))
rl, cl, wl = [], [], []
rt, ct, wt = [], [], []
for u, v, d in G.edges(data=True):
    a, b = idx[u], idx[v]
    L = float(d["length"])
    if L <= 0:
        continue
    eu, ev = G.nodes[u]["elev"], G.nodes[v]["elev"]
    rl += [a, b]; cl += [b, a]; wl += [L, L]
    g = (ev - eu) / L
    rt += [a, b]; ct += [b, a]; wt += [L / (tobler(g) * 1000 / 3600), L / (tobler(-g) * 1000 / 3600)]
A_len = sp.csr_matrix((wl, (rl, cl)), shape=(N, N))
A_time = sp.csr_matrix((wt, (rt, ct)), shape=(N, N))

# ================================================== las 4 centralidades
# (cacheadas: el orden de nodos es determinista desde la caché OSM, así que las
#  centralidades se guardan y se reutilizan; recomputar cuesta ~5 min)
CENT_CACHE = WS / "ciencia/data/d13_cent_cache.npz"
cached = None
if CENT_CACHE.exists():
    z = np.load(CENT_CACHE)
    if int(z["N"]) == N and int(z["k_bet"]) == K_BET:
        cached = z
if cached is not None:
    clo_flat = cached["clo_flat"]; clo_body = cached["clo_body"]
    betv = cached["betv"]; eigv = cached["eigv"]
    print(f"[D13] centralidades desde caché ({CENT_CACHE.name})", flush=True)
else:
    # La componente es (fuertemente) conexa => todas las distancias son finitas;
    # sumamos directo sin copiar la matriz NxN (evita el pico de memoria de np.where).
    t1 = time.time()
    Dl = dijkstra(A_len, directed=False)                    # todos-los-pares (plano)
    sl = Dl.sum(axis=1)
    clo_flat = np.where(sl > 0, (N - 1) / sl, 0.0)
    del Dl
    print(f"[D13] closeness plana en {time.time()-t1:.1f}s", flush=True)

    t1 = time.time()
    Dt = dijkstra(A_time, directed=True)                    # Dt[s,t] = tiempo s->t
    st = Dt.sum(axis=0)                                     # columna t = llegar A t
    clo_body = np.where(st > 0, (N - 1) / st, 0.0)
    del Dt
    print(f"[D13] closeness-Tobler (cuerpo) en {time.time()-t1:.1f}s", flush=True)

    t1 = time.time()
    bet = nx.betweenness_centrality(G, k=min(K_BET, N), weight="length", seed=42, normalized=True)
    betv = np.array([bet[n] for n in nodes])
    print(f"[D13] betweenness (k={K_BET}) en {time.time()-t1:.1f}s", flush=True)

    t1 = time.time()
    try:
        eigd = nx.eigenvector_centrality_numpy(G, weight=None)
    except Exception:
        eigd = nx.eigenvector_centrality(G, max_iter=2000, weight=None)
    eigv = np.abs(np.array([eigd[n] for n in nodes]))       # signo del autovector es arbitrario
    print(f"[D13] eigenvector en {time.time()-t1:.1f}s", flush=True)
    np.savez(CENT_CACHE, N=N, k_bet=K_BET, clo_flat=clo_flat, clo_body=clo_body, betv=betv, eigv=eigv)

metrics = {
    "betweenness": betv,
    "closeness_plana": clo_flat,
    "eigenvector": eigv,
    "closeness_tobler": clo_body,
}
mnames = list(metrics.keys())

# ================================================== portafolios (decisiones)
def topk(v, k=K_PORT):
    return set(np.argsort(v)[::-1][:k].tolist())

# score mixto: promedio de las 4 métricas min-max normalizadas
def mm(v):
    lo, hi = v.min(), v.max()
    return (v - lo) / (hi - lo + 1e-15)
mix_score = np.mean([mm(metrics[m]) for m in mnames], axis=0)

decisions = {f"top_{m}": topk(metrics[m]) for m in mnames}
decisions["mixto"] = topk(mix_score)
dnames = list(decisions.keys())

# ================================================== valor, regret, minimax
opt_mass = {m: float(np.sort(metrics[m])[::-1][:K_PORT].sum()) for m in mnames}
value = np.zeros((len(dnames), len(mnames)))
for i, dn in enumerate(dnames):
    port = np.fromiter(decisions[dn], dtype=int)
    for j, m in enumerate(mnames):
        value[i, j] = metrics[m][port].sum() / (opt_mass[m] + 1e-15)
regret = value.max(axis=0, keepdims=True) - value        # max_d por estado - valor
# (el óptimo de cada estado es su top-K, que es una decisión => max col = 1.0)

max_regret = regret.max(axis=1)                          # peor caso por decisión
min_value = value.min(axis=1)                            # garantía por decisión
i_mmr = int(np.argmin(max_regret))                       # minimax-regret
i_mxm = int(np.argmax(min_value))                        # maximin
robust = dnames[i_mmr]
precio = float(max_regret[i_mmr])

# solapamiento entre los top-K de las 4 métricas (¿rankings casi-disjuntos?)
def jac(a, b):
    return len(a & b) / len(a | b) if (a | b) else 0.0
pair_jac = {}
for a in range(len(mnames)):
    for b in range(a + 1, len(mnames)):
        pair_jac[f"{mnames[a]}∩{mnames[b]}"] = round(jac(decisions['top_'+mnames[a]], decisions['top_'+mnames[b]]), 3)

# nodos del portafolio robusto (coords), ordenados por su relevancia interna
rob_port = decisions[robust]
order_key = mix_score if robust == "mixto" else metrics[robust.replace("top_", "")]
rob_sorted = sorted(rob_port, key=lambda i: order_key[i], reverse=True)
rob_coords = [[round(G.nodes[nodes[i]]["y"], 5), round(G.nodes[nodes[i]]["x"], 5)] for i in rob_sorted[:15]]

# --- diagnóstico: ¿alguna métrica colapsa a un punto? (radio geográfico del top-K) ---
lat0 = math.radians(CENTER[0])
mx = np.array([(math.radians(G.nodes[n]["x"]) - math.radians(CENTER[1])) * 6371000.0 * math.cos(lat0) for n in nodes])
my = np.array([(math.radians(G.nodes[n]["y"]) - math.radians(CENTER[0])) * 6371000.0 for n in nodes])
def spread_m(sset):
    ii = np.fromiter(sset, dtype=int)
    return float(np.hypot(mx[ii].std(), my[ii].std()))       # dispersión RMS en metros
spread = {m: round(spread_m(decisions["top_" + m]), 0) for m in mnames}
# concentración L1 del eigenvector: fracción de la masa total en el top-K (localización)
ev_conc = float(np.sort(eigv)[::-1][:K_PORT].sum() / (eigv.sum() + 1e-15))

# --- lectura secundaria HONESTA: minimax-regret SIN la métrica degenerada (eigenvector) ---
sp_idx = [j for j, m in enumerate(mnames) if m != "eigenvector"]
max_regret_sp = regret[:, sp_idx].max(axis=1)
i_sp = int(np.argmin(max_regret_sp))
robust_sp = dnames[i_sp]; precio_sp = float(max_regret_sp[i_sp])

print(f"[D13] minimax-regret => '{robust}' (precio {precio:.3f}); maximin => '{dnames[i_mxm]}'", flush=True)
print(f"[D13] radio top-K por métrica (m): {spread}; eigenvector concentra {ev_conc:.2f} de su masa en {K_PORT} nodos", flush=True)
print(f"[D13] SIN eigenvector: minimax-regret => '{robust_sp}' (precio {precio_sp:.3f})", flush=True)

# ===================================================================== figura
xs = np.array([G.nodes[n]["x"] for n in nodes]); ys = np.array([G.nodes[n]["y"] for n in nodes])
cols = {"betweenness": "#d62728", "closeness_plana": "#1f77b4",
        "eigenvector": "#2ca02c", "closeness_tobler": "#e8934f"}
fig, axes = plt.subplots(2, 3, figsize=(19, 12))
def draw_set(ax, s, color, title):
    ax.scatter(xs, ys, c="#e9e6df", s=1.5, zorder=1)
    m = np.fromiter(s, dtype=int)
    ax.scatter(xs[m], ys[m], c=color, s=12, zorder=2)
    ax.set_title(title, fontsize=11); ax.set_aspect("equal"); ax.axis("off")
for ax, m in zip(axes[0], mnames[:3]):
    draw_set(ax, decisions["top_" + m], cols[m], f"top-{K_PORT} · {m}\n(radio {spread[m]:.0f} m)")
m3 = mnames[3]
draw_set(axes[1, 0], decisions["top_" + m3], cols[m3], f"top-{K_PORT} · {m3}\n(radio {spread[m3]:.0f} m)")
# robusto resaltado
axes[1, 1].scatter(xs, ys, c="#e9e6df", s=1.5, zorder=1)
mrob = np.fromiter(rob_port, dtype=int)
axes[1, 1].scatter(xs[mrob], ys[mrob], c="#111111", s=16, zorder=3, marker="o", label=f"robusto: {robust}")
axes[1, 1].set_title(f"CONJUNTO ROBUSTO (minimax-regret)\n'{robust}' · precio={precio:.2f} | sin eigenvector → '{robust_sp}' ({precio_sp:.2f})", fontsize=10)
axes[1, 1].set_aspect("equal"); axes[1, 1].axis("off"); axes[1, 1].legend(loc="lower left", fontsize=9)
# heatmap de regret
axh = axes[1, 2]
im = axh.imshow(regret, cmap="magma_r", aspect="auto", vmin=0, vmax=1)
axh.set_xticks(range(len(mnames))); axh.set_xticklabels(mnames, rotation=35, ha="right", fontsize=8)
axh.set_yticks(range(len(dnames))); axh.set_yticklabels(dnames, fontsize=8)
for i in range(len(dnames)):
    for j in range(len(mnames)):
        axh.text(j, i, f"{regret[i,j]:.2f}", ha="center", va="center",
                 color="white" if regret[i, j] > 0.5 else "black", fontsize=8)
axh.add_patch(plt.Rectangle((-0.5, i_mmr - 0.5), len(mnames), 1, fill=False, edgecolor="#25d0d0", lw=3))
axh.set_title("REGRET decisión×estado\n(recuadro = robusto)", fontsize=11)
plt.colorbar(im, ax=axh, shrink=0.7, label="regret = 1 − valor")
fig.suptitle("D13 — Rankings casi-disjuntos y el conjunto sin arrepentimiento (minimax-regret) sobre la red real de Medellín",
             fontsize=14, fontweight="bold")
fig.tight_layout()
fig.savefig(FIG, dpi=150)

# ==================================================================== salida
res = {
    "demo": "D13_decision",
    "radio_m": DIST, "n_nodos": N, "n_aristas": G.number_of_edges(),
    "K_portafolio": K_PORT, "k_betweenness": K_BET,
    "estados_metricas": mnames,
    "decisiones": dnames,
    "matriz_valor": {dnames[i]: {mnames[j]: round(float(value[i, j]), 3) for j in range(len(mnames))} for i in range(len(dnames))},
    "matriz_regret": {dnames[i]: {mnames[j]: round(float(regret[i, j]), 3) for j in range(len(mnames))} for i in range(len(dnames))},
    "solapamiento_jaccard_topK_entre_metricas": pair_jac,
    "jaccard_medio_entre_metricas": round(float(np.mean(list(pair_jac.values()))), 3),
    "radio_geografico_topK_m": spread,
    "eigenvector_concentracion_masa_topK": round(ev_conc, 3),
    "minimax_regret_portafolio": robust,
    "precio_incertidumbre_metrica": round(precio, 3),
    "maximin_portafolio": dnames[i_mxm],
    "maximin_valor_garantizado": round(float(min_value[i_mxm]), 3),
    "regret_peor_caso_por_decision": {dnames[i]: round(float(max_regret[i]), 3) for i in range(len(dnames))},
    "sin_eigenvector": {
        "minimax_regret_portafolio": robust_sp,
        "precio_incertidumbre_metrica": round(precio_sp, 3),
        "nota": "quitando la métrica degenerada (eigenvector localizado), existe un robusto útil",
    },
    "portafolio_robusto_n_nodos": len(rob_port),
    "portafolio_robusto_top15_coords": rob_coords,
    "figura": "ciencia/figs/D13_mega.png",
    "tiempo_s": round(time.time() - t0, 1),
}
print("===RESULT===")
print(json.dumps(res, ensure_ascii=False))
print("===END===")
