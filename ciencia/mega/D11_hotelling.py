"""
D11 — Juego de localización de Hotelling en la red REAL de Medellín:
      ¿dónde se aglomera el comercio informal?

N vendedores (venteros informales) eligen cada uno un NODO de la red peatonal real
del centro de Medellín (corredor Junín–San Antonio, radio 2 km, ~7.6k nodos, OSM).
Cada peatón/cliente acude al vendedor MÁS CERCANO en distancia de RED (no euclidiana):
partición de Voronoi del grafo por dijkstra multi-fuente. Cada vendedor maximiza la
demanda que captura. Se simula DINÁMICA DE MEJOR-RESPUESTA ITERADA: por rondas, cada
vendedor (en orden aleatorio, semilla fija) se reubica al nodo que maximiza su captura
dado el resto; se itera hasta punto fijo (equilibrio de Nash aproximado) o 40 rondas.

Pregunta central: ¿emerge el "principio de diferenciación mínima" de Hotelling
(los vendedores se apiñan) también en una red urbana real, o la red los dispersa?
Y si se apiñan, ¿cuánto cuesta socialmente (cobertura peor que el óptimo)?

Supuesto de DEMANDA (documentado): la demanda de cada nodo es un proxy de "footfall"
= densidad local del tejido de calles = nº de nodos de la red a <= R_DEM metros por
red. Calles más densas/entrelazadas => más peatones. Es un proxy, no un aforo real.

Honestidad: se reporta lo que sale. Si NO se aglomeran, se dice. La aglomeración
"real" (efecto Hotelling) se separa de la mera "concentración por seguir a la demanda"
comparando el equilibrio contra DOS nulos: (a) colocación aleatoria uniforme y
(b) el ÓPTIMO SOCIAL de cobertura (p-mediana greedy), que también persigue la demanda
pero la DISPERSA para cubrirla. Si el equilibrio está más apiñado que el óptimo, ese
exceso ES la diferenciación mínima estratégica.

Semilla 42, reproducible. Datos reales (OSM en caché). Sólo numpy/scipy/networkx.
"""
import json, time
import numpy as np
import networkx as nx
import scipy.sparse as sp
from scipy.sparse.csgraph import dijkstra
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt

# ----------------------------- parámetros -----------------------------
CENTER = (6.2476, -75.5658)     # Parque Berrío, centro de Medellín
DIST = 2000                     # radio en m (red de D5: ~7.6k nodos)
R_DEM = 200.0                   # radio (m, red) para el proxy de demanda/footfall
CLUSTER_R = 250.0               # dos vendedores en el mismo "foco" si distan < esto (m, red)
MAX_ROUNDS_MAIN = 40
MAX_ROUNDS_SWEEP = 30
N_MAIN = 40                     # N del run detallado (figura + Voronoi)
N_SWEEP = [10, 20, 30, 40, 60]  # barrido de N
SEEDS_SWEEP = [42, 43, 44]      # condiciones iniciales (robustez)
N_RANDOM_MC = 400               # réplicas del nulo aleatorio uniforme
K_CAND_SWEEP = 2500             # submuestra de nodos-estrategia en el barrido (por tractabilidad)
EPS_REL = 1e-3                  # umbral de mejora relativa (a la cuota justa) para reubicarse
SEED = 42
FIG = "ciencia/figs/D11_mega.png"

t0 = time.time()
rng_global = np.random.default_rng(SEED)

# ----------------------------- red real (patrón D5) -----------------------------
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
M = len(nodes)
xs = np.array([G.nodes[n]["x"] for n in nodes], float)
ys = np.array([G.nodes[n]["y"] for n in nodes], float)
print(f"[D11] red real: {M} nodos, {G.number_of_edges()} aristas, {time.time()-t0:.1f}s", flush=True)

# matriz de longitudes (no dirigida) y APSP completa
r, c, w = [], [], []
for u, v, d in G.edges(data=True):
    a, b = idx[u], idx[v]
    L = float(d["length"])
    if L <= 0:
        continue
    r += [a, b]; c += [b, a]; w += [L, L]
A = sp.csr_matrix((w, (r, c)), shape=(M, M))
t1 = time.time()
D = dijkstra(A, directed=False).astype(np.float32)   # M x M, distancias de red (m)
D[~np.isfinite(D)] = np.float32(1e9)                  # una sola componente => no debería haber inf
print(f"[D11] APSP {D.shape} en {time.time()-t1:.1f}s ({D.nbytes/1e6:.0f} MB)", flush=True)

# ----------------------------- demanda (footfall proxy) -----------------------------
# w_dem[c] = nº de nodos a <= R_DEM m por red (densidad local del tejido).
w_dem = (D <= R_DEM).sum(axis=1).astype(np.float64)
w_dem_f = w_dem.astype(np.float32)
W_TOT = float(w_dem.sum())
print(f"[D11] demanda: total {W_TOT:.0f}, por nodo {w_dem.min():.0f}-{w_dem.max():.0f} "
      f"(mediana {np.median(w_dem):.0f})", flush=True)

# ----------------------------- utilidades del juego -----------------------------
def dist_to_nearest(vendors):
    """Distancia de cada cliente al vendedor más cercano (vendors = índices de nodo)."""
    return D[np.asarray(vendors)].min(axis=0)

def welfare_cost(vendors):
    """Costo social = demanda * distancia al vendedor más cercano (p-mediana objetivo)."""
    return float((w_dem * dist_to_nearest(vendors)).sum())

def best_response_dynamics(N, seed, max_rounds, cand=None):
    """Mejor respuesta iterada. Devuelve (vendors, rondas, historial_captura, convergio).

    cand: array opcional de nodos-estrategia (submuestra); si None, todos los nodos.
    Se exige una mejora > umbral (fracción de la cuota justa W_TOT/N) para reubicarse:
    suprime el 'chatter' de intercambios marginales y favorece el punto fijo.
    """
    rng = np.random.default_rng(seed)
    C = np.arange(M) if cand is None else np.asarray(cand)
    DC = D if cand is None else D[C]          # filas = nodos-estrategia candidatos
    pos_of = {int(n): k for k, n in enumerate(C)}   # nodo -> fila en DC
    thr = EPS_REL * W_TOT / N                  # mejora mínima para moverse
    vendors = rng.choice(C, size=N, replace=False).tolist()
    seen = set()
    hist = []
    converged = False
    for rnd in range(max_rounds):
        moved = False
        order = rng.permutation(N)
        for i in order:
            others = vendors[:i] + vendors[i+1:]
            d_other = D[np.asarray(others)].min(axis=0)         # más cercano SIN el vendedor i
            # captura(q) para cada nodo candidato = demanda estrictamente más cerca de q
            cap = (DC < d_other[None, :]).astype(np.float32) @ w_dem_f
            for o in others:                                     # no ocupar el nodo de otro
                if o in pos_of:
                    cap[pos_of[o]] = -1.0
            cur_cap = float(((D[vendors[i]] < d_other).astype(np.float32) * w_dem_f).sum())
            best = int(np.argmax(cap))
            if cap[best] > cur_cap + thr:
                vendors[i] = int(C[best])
                moved = True
        hist.append(welfare_cost(vendors))
        key = tuple(sorted(vendors))
        if not moved:
            converged = True
            break
        if key in seen:            # ciclo detectado: cortar
            break
        seen.add(key)
    return vendors, rnd + 1, hist, converged

def greedy_pmedian(N):
    """Óptimo social aproximado: p-mediana greedy (minimiza demanda*distancia)."""
    chosen = []
    cur = np.full(M, np.float32(1e9))
    for _ in range(N):
        # nuevo costo si se añade q: sum_c w[c]*min(cur[c], D[q,c])
        newcost = (np.minimum(D, cur[None, :]) * w_dem[None, :]).sum(axis=1)
        q = int(np.argmin(newcost))
        chosen.append(q)
        cur = np.minimum(cur, D[q])
    return chosen

def mean_nn_vendor(vendors):
    """Distancia media (de red) de cada vendedor a su vendedor más cercano."""
    v = np.asarray(vendors)
    sub = D[np.ix_(v, v)].copy()
    np.fill_diagonal(sub, np.inf)
    return float(sub.min(axis=1).mean())

def n_clusters(vendors, radius=CLUSTER_R):
    """Nº de focos: componentes conexas del grafo de vendedores unidos si distan < radius."""
    v = np.asarray(vendors)
    sub = D[np.ix_(v, v)]
    Ncl = len(v)
    H = nx.Graph(); H.add_nodes_from(range(Ncl))
    for a in range(Ncl):
        for b in range(a + 1, Ncl):
            if sub[a, b] < radius:
                H.add_edge(a, b)
    return nx.number_connected_components(H)

def random_baseline_meannn(N, reps, rng):
    """Media de la distancia NN-vendedor bajo colocación aleatoria uniforme."""
    vals = np.empty(reps)
    for k in range(reps):
        vv = rng.choice(M, size=N, replace=False)
        vals[k] = mean_nn_vendor(vv.tolist())
    return float(vals.mean()), float(vals.std())

# ----------------------------- RUN principal (N_MAIN) -----------------------------
print(f"[D11] equilibrio principal N={N_MAIN} ...", flush=True)
tm = time.time()
eq_main, rounds_main, hist_main, conv_main = best_response_dynamics(N_MAIN, SEED, MAX_ROUNDS_MAIN)
opt_main = greedy_pmedian(N_MAIN)
W_eq_main = welfare_cost(eq_main)
W_opt_main = welfare_cost(opt_main)
inef_main = W_eq_main / W_opt_main
mnn_eq = mean_nn_vendor(eq_main)
mnn_opt = mean_nn_vendor(opt_main)
rand_mnn, rand_sd = random_baseline_meannn(N_MAIN, N_RANDOM_MC, np.random.default_rng(SEED))
idx_aglo_main = rand_mnn / mnn_eq          # >1 => más apiñado que el azar
aglo_vs_opt_main = mnn_opt / mnn_eq        # >1 => más apiñado que el óptimo social
ncl_eq = n_clusters(eq_main)
ncl_opt = n_clusters(opt_main)
print(f"[D11] N={N_MAIN}: rondas={rounds_main} conv={conv_main} clusters_eq={ncl_eq} "
      f"idx_aglo={idx_aglo_main:.2f} aglo_vs_opt={aglo_vs_opt_main:.2f} inef={inef_main:.3f} "
      f"({time.time()-tm:.1f}s)", flush=True)

# submuestra de nodos-estrategia para el barrido (por tractabilidad): mezcla de
# nodos de alta demanda + malla espacial uniforme, para cubrir toda la ciudad.
_rs = np.random.default_rng(SEED)
_hi = np.argsort(w_dem)[::-1][:K_CAND_SWEEP // 2]                     # mitad: alta demanda
_rest = np.setdiff1d(np.arange(M), _hi)
_grid = _rs.choice(_rest, size=min(K_CAND_SWEEP - len(_hi), len(_rest)), replace=False)
CAND_SWEEP = np.unique(np.concatenate([_hi, _grid]))
print(f"[D11] submuestra de estrategias para el barrido: {len(CAND_SWEEP)} nodos", flush=True)

# ----------------------------- BARRIDO de N y semillas -----------------------------
sweep = {}
for N in N_SWEEP:
    opt_N = greedy_pmedian(N)
    mnn_opt_N = mean_nn_vendor(opt_N)
    W_opt_N = welfare_cost(opt_N)
    ncl_opt_N = n_clusters(opt_N)
    rand_mnn_N, _ = random_baseline_meannn(N, N_RANDOM_MC, np.random.default_rng(1000 + N))
    idxs, avo, inefs, ncls, convs = [], [], [], [], []
    for sd in SEEDS_SWEEP:
        eqv, rnds, _, cv = best_response_dynamics(N, sd, MAX_ROUNDS_SWEEP, cand=CAND_SWEEP)
        mnn = mean_nn_vendor(eqv)
        idxs.append(rand_mnn_N / mnn)
        avo.append(mnn_opt_N / mnn)
        inefs.append(welfare_cost(eqv) / W_opt_N)
        ncls.append(n_clusters(eqv))
        convs.append(cv)
    sweep[N] = {
        "idx_aglo_mean": float(np.mean(idxs)), "idx_aglo_std": float(np.std(idxs)),
        "aglo_vs_opt_mean": float(np.mean(avo)), "aglo_vs_opt_std": float(np.std(avo)),
        "inef_mean": float(np.mean(inefs)), "inef_std": float(np.std(inefs)),
        "n_clusters_mean": float(np.mean(ncls)), "n_clusters_opt": ncl_opt_N,
        "frac_convergio": float(np.mean(convs)),
    }
    print(f"[D11] barrido N={N}: idx_aglo={sweep[N]['idx_aglo_mean']:.2f}±{sweep[N]['idx_aglo_std']:.2f} "
          f"aglo_vs_opt={sweep[N]['aglo_vs_opt_mean']:.2f} clusters={sweep[N]['n_clusters_mean']:.1f}/{N} "
          f"inef={sweep[N]['inef_mean']:.3f} conv={sweep[N]['frac_convergio']:.0%}", flush=True)

# ----------------------------- FIGURA -----------------------------
fig, (axA, axB) = plt.subplots(1, 2, figsize=(16, 7.2))

# Panel A: geografía del equilibrio (Voronoi de red + posiciones)
assign = D[np.asarray(eq_main)].argmin(axis=0)     # celda de Voronoi de cada nodo
cmap = plt.cm.tab20
cols = cmap(assign % 20 / 19.0)
for u, v in G.edges():
    axA.plot([G.nodes[u]["x"], G.nodes[v]["x"]], [G.nodes[u]["y"], G.nodes[v]["y"]],
             color="#d8d4cc", lw=0.3, alpha=0.5, zorder=1)
axA.scatter(xs, ys, c=cols, s=5, zorder=2, edgecolors="none")
axA.scatter(xs[eq_main], ys[eq_main], s=190, marker="*", c="black", zorder=4,
            edgecolors="white", linewidths=0.8, label=f"{N_MAIN} vendedores (equilibrio)")
axA.set_title(f"Equilibrio de mejor-respuesta (N={N_MAIN})\n"
              f"celdas de Voronoi de red · {ncl_eq} focos (r<{CLUSTER_R:.0f} m) · "
              f"{'converge' if conv_main else 'ciclo/tope'} en {rounds_main} rondas")
axA.set_aspect("equal"); axA.axis("off")
axA.legend(loc="lower left", fontsize=9, framealpha=0.9)

# Panel B: índices vs N
Ns = np.array(N_SWEEP, float)
ia = np.array([sweep[N]["idx_aglo_mean"] for N in N_SWEEP])
ia_sd = np.array([sweep[N]["idx_aglo_std"] for N in N_SWEEP])
av = np.array([sweep[N]["aglo_vs_opt_mean"] for N in N_SWEEP])
inf = np.array([sweep[N]["inef_mean"] for N in N_SWEEP])
inf_sd = np.array([sweep[N]["inef_std"] for N in N_SWEEP])
axB.axhline(1.0, color="#999", lw=1, ls=":", zorder=1)
axB.errorbar(Ns, ia, yerr=ia_sd, marker="o", color="#c0392b", capsize=3,
             label="índice de aglomeración\n(equilibrio vs azar uniforme)")
axB.plot(Ns, av, marker="s", color="#e67e22",
         label="aglomeración vs óptimo social\n(>1 = más apiñado que la cobertura)")
axB.set_xlabel("N (nº de vendedores)")
axB.set_ylabel("índice de aglomeración  (NN azar / NN equilibrio)")
axB.set_title("Robustez del patrón vs N y semillas")
axB2 = axB.twinx()
axB2.errorbar(Ns, inf, yerr=inf_sd, marker="^", color="#2980b9", capsize=3, alpha=0.85,
              label="ineficiencia (costo eq / óptimo)")
axB2.set_ylabel("ineficiencia social  (W_eq / W_óptimo)", color="#2980b9")
axB2.tick_params(axis="y", labelcolor="#2980b9")
h1, l1 = axB.get_legend_handles_labels()
h2, l2 = axB2.get_legend_handles_labels()
axB.legend(h1 + h2, l1 + l2, loc="upper right", fontsize=8, framealpha=0.9)

fig.suptitle("D11 — Hotelling en red real de Medellín: ¿se aglomera el comercio informal?",
             fontsize=13, fontweight="bold")
fig.tight_layout()
fig.savefig(FIG, dpi=150)
print(f"[D11] figura -> {FIG}", flush=True)

# ----------------------------- interpretación honesta -----------------------------
aglo_media = float(np.mean([sweep[N]["aglo_vs_opt_mean"] for N in N_SWEEP]))
if aglo_vs_opt_main > 1.15 and aglo_media > 1.1:
    veredicto = "APINAMIENTO: el equilibrio se apiña MAS que el optimo social (efecto Hotelling)."
elif aglo_vs_opt_main < 0.9:
    veredicto = "DISPERSION: el equilibrio esta MAS disperso que el optimo (la red dispersa)."
else:
    veredicto = "MIXTO: el equilibrio sigue a la demanda sin exceso claro de apinamiento."

result = {
    "demo": "D11_hotelling_red",
    "ciudad": "Medellín (centro, corredor Junín–San Antonio), red peatonal real OSM",
    "es_real": True,
    "n_nodos": M,
    "n_aristas": G.number_of_edges(),
    "radio_m": DIST,
    "N_vendedores": N_MAIN,
    "n_clusters_equilibrio": int(ncl_eq),
    "n_clusters_optimo_social": int(ncl_opt),
    "cluster_radio_m": CLUSTER_R,
    "indice_aglomeracion": round(idx_aglo_main, 3),            # eq vs azar uniforme
    "aglomeracion_vs_optimo_social": round(aglo_vs_opt_main, 3),  # eq vs p-mediana (Hotelling neto)
    "mean_nn_equilibrio_m": round(mnn_eq, 1),
    "mean_nn_optimo_m": round(mnn_opt, 1),
    "mean_nn_azar_m": round(rand_mnn, 1),
    "ineficiencia_vs_optimo_social": round(inef_main, 3),      # W_eq / W_optimo (cobertura)
    "rondas_hasta_equilibrio": int(rounds_main),
    "convergio_a_punto_fijo": bool(conv_main),
    "barrido_N": {str(N): {k: round(v, 3) for k, v in sweep[N].items()} for N in N_SWEEP},
    "veredicto": veredicto,
    "supuestos": {
        "demanda": f"footfall proxy = nº de nodos de la red a <= {R_DEM:.0f} m por red (densidad local del tejido)",
        "clientes": "todos los nodos de la red generan demanda ponderada",
        "estrategia_vendedor": "cualquier nodo NO ocupado por otro; captura = demanda estrictamente más cercana",
        "dinamica": (f"mejor-respuesta iterada, orden aleatorio por ronda, hasta {MAX_ROUNDS_MAIN} rondas o punto fijo; "
                     f"se reubica sólo si mejora > {EPS_REL:.0e}*cuota_justa (suprime chatter)"),
        "run_detallado": "espacio de estrategias = red completa (todos los nodos)",
        "barrido": f"espacio de estrategias submuestreado a {K_CAND_SWEEP} nodos (alta demanda + malla) por tractabilidad",
        "optimo_social": "p-mediana greedy (minimiza demanda*distancia); aproximación, no óptimo exacto",
        "aglomeracion": "índice = NN-medio(azar uniforme) / NN-medio(equilibrio); >1 = apiñado",
    },
    "figura": FIG,
    "tiempo_s": round(time.time() - t0, 1),
}
print("===RESULT===")
print(json.dumps(result, ensure_ascii=False))
print("===END===")
