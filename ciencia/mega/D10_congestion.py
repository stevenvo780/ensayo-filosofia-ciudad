"""
D10 — Juego de congestión sobre la red vial REAL de Medellín:
equilibrio de Wardrop (UE), óptimo social (SO), precio de la anarquía (PoA)
y escaneo de la paradoja de Braess.

Idea. Cada conductor elige egoístamente su ruta más rápida dada la congestión
de los demás (equilibrio de usuario, Wardrop). Ese equilibrio NO minimiza el
tiempo agregado de la ciudad: el óptimo social lo haría, pero exige que algunos
sacrifiquen su ruta. La razón entre ambos tiempos es el PRECIO DE LA ANARQUÍA.
La paradoja de Braess dice, además, que a veces CERRAR una calle mejora el flujo
total: la buscamos removiendo aristas y midiendo si el tiempo agregado baja.

Red REAL: se reutiliza la red peatonal de Medellín ya cacheada en `cache/`
(radio 4 km desde Parque Berrío, ~22.9k nodos / ~34k aristas; misma que D8).
La modelamos como la topología vial de la ciudad: es una SIMPLIFICACIÓN
(incluye segmentos solo-peatonales y no distingue jerarquía de vías), declarada
como límite. El método (Wardrop/PoA/Braess) es el objeto del experimento.

Supuestos (sintéticos pero documentados):
- t0 (tiempo a flujo libre) = longitud real de la arista (velocidad libre
  constante ⇒ t0 ∝ longitud; el PoA es adimensional).
- Capacidad CONSTANTE por arista (no hay clase de vía en la red peatonal): es el
  supuesto más fuerte y se reporta como limitación.
- Costo BPR:  t(f) = t0 · (1 + α·(f/cap)^β),  α=0.15, β=4 (valores estándar FHWA).
- Demanda O-D: N_ZONES nodos-zona (aleatorios, semilla 42) como orígenes Y
  destinos; demanda UNIFORME q por par (o,d), o≠d. Sintética, documentada.
- UE (Wardrop): Frank-Wolfe con búsqueda de línea exacta minimizando la integral
  de Beckmann. All-or-nothing por Dijkstra multi-origen (scipy.sparse.csgraph).
- SO: mismo Frank-Wolfe pero enrutando con el COSTO MARGINAL
  t0·(1 + α·(β+1)·(f/cap)^β) (el marginal internaliza la externalidad).
- PoA = TSTT(UE) / TSTT(SO), con TSTT = Σ f·t(f) evaluado con el costo BPR real.

Honestidad sobre Braess. Frank-Wolfe converge sublinealmente: el UE base queda
con un gap relativo ~1 %, y ese es el PISO DE RUIDO de cualquier comparación de
tiempos. Por eso NO basta con "TSTT baja al remover": una bajada de 0.1–0.2 %
es indistinguible del ruido numérico. Para separar señal de ruido se corren
REMOCIONES DE CONTROL (aristas poco cargadas, cuya remoción no debería ayudar):
su distribución de "mejoras" mide el ruido, y solo se cuentan como aristas-Braess
las remociones cuya mejora supera media+3σ de los controles. Es un test honesto.

Reproducible (semilla 42). Comentarios sobrios en español.
"""
import json, time, math
from pathlib import Path
import numpy as np
import networkx as nx
import scipy.sparse as sp
from scipy.sparse.csgraph import dijkstra
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib.collections import LineCollection

# ----------------------------- configuración --------------------------------
WS = Path("/workspace/ensayo-filosofia-ciudad")
FIG = WS / "ciencia/figs/D10_mega.png"
CENTER = (6.2476, -75.5658)   # Parque Berrío
DIST = 4000                    # radio en metros (red de D8, cacheada)
SEED = 42
N_ZONES = 300                  # orígenes = destinos = nodos-zona
DEMAND_PER_OD = 1.0            # demanda uniforme por par O-D
ALPHA, BETA = 0.15, 4.0
CAP = 400.0                    # capacidad constante por arista (supuesto)
FW_ITERS_UE = 55               # iteraciones Frank-Wolfe para UE
FW_ITERS_SO = 80               # SO converge más lento (costo marginal)
FW_ITERS_BRAESS = 12           # iteraciones (con arranque en caliente) por remoción
N_BRAESS = 20                  # aristas candidatas (las más cargadas en UE)
N_CONTROL = 15                 # remociones de control (calibran el piso de ruido)
t_start = time.time()

# ----------------------------- carga de red ---------------------------------
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
xs = np.array([G.nodes[n]["x"] for n in nodes])
ys = np.array([G.nodes[n]["y"] for n in nodes])
print(f"[D10] red real (radio {DIST} m): {N} nodos, {G.number_of_edges()} aristas, "
      f"{time.time()-t_start:.1f}s", flush=True)

# ----------------------------- arcos dirigidos ------------------------------
# Cada arista física k -> arcos 2k (a->b) y 2k+1 (b->a); flujos independientes.
ph_a, ph_b, ph_len = [], [], []
for u, v, d in G.edges(data=True):
    a, b = idx[u], idx[v]
    L = float(d["length"])
    if L <= 0:
        L = 1.0
    ph_a.append(a); ph_b.append(b); ph_len.append(L)
ph_a = np.array(ph_a); ph_b = np.array(ph_b); ph_len = np.array(ph_len, float)
E = len(ph_a)                                    # aristas físicas
tails = np.empty(2 * E, dtype=np.int64)
heads = np.empty(2 * E, dtype=np.int64)
t0arc = np.empty(2 * E, dtype=float)
tails[0::2] = ph_a; heads[0::2] = ph_b
tails[1::2] = ph_b; heads[1::2] = ph_a
t0arc[0::2] = ph_len; t0arc[1::2] = ph_len
A = 2 * E
cap = np.full(A, CAP)
# lookup de arco (tail,head) -> índice, vía searchsorted
arc_key = tails * N + heads
sort_ix = np.argsort(arc_key); arc_key_s = arc_key[sort_ix]
def arc_lookup(tt, hh):
    pos = np.searchsorted(arc_key_s, tt.astype(np.int64) * N + hh.astype(np.int64))
    return sort_ix[pos]

# ----------------------------- demanda O-D ----------------------------------
rng = np.random.default_rng(SEED)
zones = np.sort(rng.choice(N, size=N_ZONES, replace=False))
origins = zones
dest = zones
q = DEMAND_PER_OD
n_OD = N_ZONES * (N_ZONES - 1)
demanda_total = q * n_OD
print(f"[D10] {N_ZONES} zonas, {n_OD} pares O-D, demanda total {demanda_total:.0f}", flush=True)

# ----------------------------- costos BPR -----------------------------------
def bpr(f):
    return t0arc * (1.0 + ALPHA * (f / cap) ** BETA)
def marginal(f):
    return t0arc * (1.0 + ALPHA * (BETA + 1.0) * (f / cap) ** BETA)
def tstt(f):                       # tiempo total del sistema (costo real BPR)
    return float(np.sum(f * bpr(f)))
def beckmann(f):                   # integral de Beckmann (objetivo del UE)
    return float(np.sum(t0arc * f + t0arc * ALPHA / (BETA + 1.0) * f * (f / cap) ** BETA))

# ----------------------------- all-or-nothing -------------------------------
vnodes = np.arange(N)
def all_or_nothing(cost_arc, mask=None):
    """Asigna toda la demanda a rutas de mínimo costo. Devuelve (flujo y,
    tiempo de rutas más cortas SPTT, todos_los_OD_alcanzables)."""
    if mask is None:
        tt, hh, cc = tails, heads, cost_arc
    else:
        tt, hh, cc = tails[mask], heads[mask], cost_arc[mask]
    M = sp.csr_matrix((cc, (tt, hh)), shape=(N, N))
    dist, pred = dijkstra(M, directed=True, indices=origins, return_predecessors=True)
    sub = dist[:, dest]
    reachable = np.isfinite(sub)
    sptt = float(q * np.where(reachable, sub, 0.0).sum())   # diagonal o->o aporta 0
    all_ok = bool(reachable.all())
    # carga por olas (sube la carga un salto por ola sobre el árbol de rutas)
    y = np.zeros(A)
    for oi, o in enumerate(origins):
        pr = pred[oi]; has_p = pr >= 0
        arc_pos = np.zeros(N, dtype=np.int64)
        vv = vnodes[has_p]; arc_pos[vv] = arc_lookup(pr[vv], vv)
        load = np.zeros(N); load[dest] += q; load[o] = 0.0
        while True:
            active = (load > 1e-12) & has_p
            if not active.any():
                break
            av = vnodes[active]; w = load[av]
            np.add.at(y, arc_pos[av], w)
            load = np.bincount(pr[av], weights=w, minlength=N)
            load[o] = 0.0
    return y, sptt, all_ok

# ----------------------------- Frank-Wolfe ----------------------------------
def line_search(x, y, social):
    """λ* en [0,1] que minimiza el objetivo sobre x+λ(y-x) (bisección sobre
    la derivada, monótona porque el costo crece con el flujo)."""
    d = y - x
    cost_fn = marginal if social else bpr
    def g(lam):
        return float(np.sum(d * cost_fn(x + lam * d)))
    g0, g1 = g(0.0), g(1.0)
    if g0 >= 0:
        return 0.0
    if g1 <= 0:
        return 1.0
    lo, hi = 0.0, 1.0
    for _ in range(40):
        mid = 0.5 * (lo + hi)
        if g(mid) > 0:
            hi = mid
        else:
            lo = mid
    return 0.5 * (lo + hi)

def frank_wolfe(iters, social=False, mask=None, x0=None, verbose=False, tag=""):
    """Asignación de tráfico por Frank-Wolfe con búsqueda de línea exacta.
    social=False -> UE (costo BPR);  social=True -> SO (costo marginal)."""
    cost_fn = marginal if social else bpr
    if x0 is None:
        y, sptt, ok = all_or_nothing(t0arc, mask)   # inicio: todo a flujo libre
        x = y.copy()
    else:
        x = x0.copy()
    gap = np.nan
    for it in range(iters):
        c = cost_fn(x)
        y, sptt, ok = all_or_nothing(c, mask)
        num = float(np.sum((x - y) * c))
        den = float(np.sum(x * c)) + 1e-12
        gap = num / den                              # gap relativo de Wardrop
        lam = line_search(x, y, social)
        x = x + lam * (y - x)
        if verbose and (it % 10 == 0 or it == iters - 1):
            print(f"    [{tag}] it {it:2d}  gap={gap:.2e}  lam={lam:.4f}  "
                  f"TSTT={tstt(x):.3e}", flush=True)
    return x, gap

# ----------------------------- UE y SO --------------------------------------
print("[D10] resolviendo equilibrio de usuario (UE, Wardrop)...", flush=True)
t_ue = time.time()
x_ue, gap_ue = frank_wolfe(FW_ITERS_UE, social=False, verbose=True, tag="UE")
tstt_ue = tstt(x_ue)
print(f"[D10] UE listo en {time.time()-t_ue:.1f}s  gap={gap_ue:.2e}  TSTT={tstt_ue:.4e}", flush=True)

print("[D10] resolviendo óptimo social (SO, costo marginal)...", flush=True)
t_so = time.time()
x_so, gap_so = frank_wolfe(FW_ITERS_SO, social=True, verbose=True, tag="SO")
tstt_so = tstt(x_so)                       # se evalúa con el costo BPR real
print(f"[D10] SO listo en {time.time()-t_so:.1f}s  gap={gap_so:.2e}  TSTT={tstt_so:.4e}", flush=True)

PoA = tstt_ue / tstt_so
print(f"[D10] PRECIO DE LA ANARQUÍA = {PoA:.4f} (cota inferior: SO sub-converge)", flush=True)

# congestión: V/C por arista física (suma de ambos sentidos) en UE
ph_flow_ue = x_ue[0::2] + x_ue[1::2]
vc = ph_flow_ue / CAP
print(f"[D10] V/C físico (UE): mediana {np.median(vc):.2f}  p90 {np.percentile(vc,90):.2f}  "
      f"máx {vc.max():.2f}  aristas con V/C>1: {(vc>1).sum()} ({100*(vc>1).mean():.1f}%)", flush=True)

# ----------------------------- escaneo de Braess ----------------------------
# Se remueve cada arista (ambos arcos), se recomputa el UE (arranque en caliente
# desde el UE base) y se compara el tiempo total. Candidatas = las más cargadas.
# Controles = aristas poco/medio cargadas (su remoción NO debería ayudar): miden
# el ruido numérico. Braess robusta = mejora > media+3σ de los controles.
full_mask = np.ones(A, dtype=bool)
def evaluar_remocion(k):
    mask = full_mask.copy(); mask[2 * k] = False; mask[2 * k + 1] = False
    x0 = x_ue.copy(); x0[2 * k] = 0.0; x0[2 * k + 1] = 0.0
    x_rm, _ = frank_wolfe(FW_ITERS_BRAESS, social=False, mask=mask, x0=x0)
    _, _, ok = all_or_nothing(bpr(x_rm), mask)
    mejora = (tstt_ue - tstt(x_rm)) / tstt_ue * 100.0   # % de bajada del tiempo total
    return mejora, ok

print(f"[D10] escaneo de Braess: {N_BRAESS} aristas más cargadas + "
      f"{N_CONTROL} controles...", flush=True)
t_br = time.time()
cand = np.argsort(ph_flow_ue)[::-1][:N_BRAESS]           # aristas físicas más cargadas
# controles: percentil 40–75 de flujo, elegidos con semilla aparte
rng_c = np.random.default_rng(SEED + 1)
lo_hi = np.where((ph_flow_ue > np.percentile(ph_flow_ue, 40)) &
                 (ph_flow_ue < np.percentile(ph_flow_ue, 75)))[0]
control = rng_c.choice(lo_hi, size=min(N_CONTROL, len(lo_hi)), replace=False)

mej_cand, ok_cand = [], []
for j, k in enumerate(cand):
    m, ok = evaluar_remocion(int(k))
    mej_cand.append(m if ok else np.nan); ok_cand.append(ok)
    if j % 5 == 0 or j == len(cand) - 1:
        print(f"    cand {j+1}/{len(cand)}  k={k}  ok={ok}  mejora={m:+.3f}%", flush=True)
mej_ctrl = []
for j, k in enumerate(control):
    m, ok = evaluar_remocion(int(k))
    mej_ctrl.append(m if ok else np.nan)
    if j % 5 == 0 or j == len(control) - 1:
        print(f"    control {j+1}/{len(control)}  k={k}  mejora={m:+.3f}%", flush=True)
mej_cand = np.array(mej_cand, float); mej_ctrl = np.array(mej_ctrl, float)

# piso de ruido a partir de los controles
cf = mej_ctrl[np.isfinite(mej_ctrl)]
ctrl_media = float(np.mean(cf)) if cf.size else 0.0
ctrl_std = float(np.std(cf)) if cf.size else 0.0
noise_floor = max(ctrl_media + 3.0 * ctrl_std, 0.30)     # umbral honesto (mín. 0.30 %)
print(f"[D10] controles: media {ctrl_media:+.3f}%  σ {ctrl_std:.3f}%  "
      f"-> piso de ruido {noise_floor:.3f}%", flush=True)

braess_edges = []
for k, m, ok in zip(cand, mej_cand, ok_cand):
    if ok and np.isfinite(m) and m > noise_floor:
        a, b = ph_a[k], ph_b[k]
        braess_edges.append({
            "arista_fisica": int(k),
            "mejora_pct": round(float(m), 4),
            "coord_u": [round(float(ys[a]), 6), round(float(xs[a]), 6)],
            "coord_v": [round(float(ys[b]), 6), round(float(xs[b]), 6)],
            "flujo_ue": round(float(ph_flow_ue[k]), 1),
        })
braess_edges.sort(key=lambda d: -d["mejora_pct"])
n_braess = len(braess_edges)
mejora_max = float(np.nanmax(mej_cand)) if np.isfinite(mej_cand).any() else 0.0
print(f"[D10] Braess robustas: {n_braess} de {N_BRAESS} candidatas superan el piso "
      f"({noise_floor:.2f}%)  mejora máx {mejora_max:+.3f}%  en {time.time()-t_br:.1f}s", flush=True)

# ----------------------------- figura ---------------------------------------
fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(16, 8))
# panel 1: red coloreada por flujo de equilibrio (UE), aristas-Braess marcadas
segs = np.stack([np.column_stack([xs[ph_a], ys[ph_a]]),
                 np.column_stack([xs[ph_b], ys[ph_b]])], axis=1)
fl = ph_flow_ue.copy()
norm = np.clip(fl / (np.percentile(fl, 99) + 1e-9), 0, 1)
lw = 0.2 + 2.8 * norm
lc = LineCollection(segs, array=np.maximum(fl, 1.0), cmap="magma",
                    norm=plt.matplotlib.colors.LogNorm(vmin=max(fl[fl > 0].min(), 1),
                                                        vmax=fl.max() + 1),
                    linewidths=lw, alpha=0.9)
ax1.add_collection(lc)
ax1.set_xlim(xs.min(), xs.max()); ax1.set_ylim(ys.min(), ys.max())
ax1.set_aspect("equal"); ax1.axis("off")
if braess_edges:
    for be in braess_edges:
        k = be["arista_fisica"]
        ax1.plot([xs[ph_a[k]], xs[ph_b[k]]], [ys[ph_a[k]], ys[ph_b[k]]],
                 color="#12d0e0", lw=4.0, zorder=5)
    ax1.plot([], [], color="#12d0e0", lw=4.0,
             label=f"arista(s)-Braess robusta(s): {n_braess}")
    ax1.legend(loc="lower left", fontsize=10)
plt.colorbar(lc, ax=ax1, shrink=0.6, label="flujo de equilibrio (UE)")
ax1.set_title(f"Flujo de equilibrio de Wardrop\n{N} nodos · {E} aristas · PoA ≈ {PoA:.3f}")
# panel 2: mejoras de candidatas vs controles + piso de ruido
ax2.axvline(0, color="#888", lw=1)
bins = np.linspace(min(np.nanmin(mej_cand), np.nanmin(mej_ctrl)) - 0.05,
                   np.nanmax(mej_cand) + 0.05, 24)
ax2.hist(mej_ctrl[np.isfinite(mej_ctrl)], bins=bins, color="#8aa0b8",
         edgecolor="#33465a", alpha=0.85, label=f"controles (ruido, n={cf.size})")
ax2.hist(mej_cand[np.isfinite(mej_cand)], bins=bins, color="#e8934f",
         edgecolor="#5a3a20", alpha=0.85, label=f"candidatas cargadas (n={N_BRAESS})")
ax2.axvline(noise_floor, color="#c0392b", lw=2, ls="--",
            label=f"piso de ruido {noise_floor:.2f}% (media+3σ)")
ax2.set_xlabel("cambio del tiempo total al remover la arista (%)\n(>0 = mejora = Braess)")
ax2.set_ylabel("nº de aristas")
ax2.legend(fontsize=9)
ax2.set_title(f"Escaneo de Braess con control de ruido\n"
              f"{n_braess} arista(s) superan el piso (mejora máx {mejora_max:+.2f}%)")
fig.suptitle("D10 — Congestión en la red vial real de Medellín: equilibrio de Wardrop, "
             "precio de la anarquía y paradoja de Braess", fontweight="bold", fontsize=13)
fig.tight_layout()
fig.savefig(FIG, dpi=150)
print(f"[D10] figura -> {FIG}", flush=True)

# ----------------------------- resultado ------------------------------------
result = {
    "demo": "D10_congestion",
    "red": "Medellín, radio 4 km (red peatonal OSM usada como topología vial; simplificación)",
    "n_nodos": N,
    "n_aristas": E,
    "n_arcos_dirigidos": A,
    "n_OD": n_OD,
    "n_zonas": N_ZONES,
    "demanda_total": round(demanda_total, 1),
    "capacidad_por_arista": CAP,
    "demanda_por_OD": DEMAND_PER_OD,
    "alpha_BPR": ALPHA, "beta_BPR": BETA,
    "fw_iters_UE": FW_ITERS_UE, "fw_iters_SO": FW_ITERS_SO,
    "gap_relativo_UE": float(f"{gap_ue:.3e}"),
    "gap_relativo_SO": float(f"{gap_so:.3e}"),
    "TSTT_UE": float(f"{tstt_ue:.5e}"),
    "TSTT_SO": float(f"{tstt_so:.5e}"),
    "PoA": round(PoA, 4),
    "PoA_nota": "cota inferior: SO sub-converge (gap SO > gap UE); el PoA real es algo mayor",
    "vc_mediana_UE": round(float(np.median(vc)), 3),
    "vc_p90_UE": round(float(np.percentile(vc, 90)), 3),
    "vc_max_UE": round(float(vc.max()), 3),
    "frac_aristas_congestionadas_UE": round(float((vc > 1).mean()), 4),
    "braess_n_candidatas": int(N_BRAESS),
    "braess_n_controles": int(cf.size),
    "braess_ruido_media_pct": round(ctrl_media, 4),
    "braess_ruido_sigma_pct": round(ctrl_std, 4),
    "braess_piso_ruido_pct": round(noise_floor, 4),
    "n_aristas_braess": n_braess,                 # robustas (sobre el piso de ruido)
    "mejora_max_pct": round(mejora_max, 4),
    "aristas_braess": braess_edges,
    "tiempo_s": round(time.time() - t_start, 1),
    "figura": "ciencia/figs/D10_mega.png",
    "supuestos": {
        "capacidad": "constante por arista (la red peatonal no trae clase de vía)",
        "t0": "= longitud real (velocidad libre constante)",
        "demanda": "uniforme por par O-D entre 300 nodos-zona aleatorios (semilla 42)",
        "red": "peatonal OSM tratada como topología vial (incluye segmentos solo-peatonales)",
        "braess": "detección con piso de ruido por controles; efectos < piso son indistinguibles de 0",
    },
}
print("===RESULT===")
print(json.dumps(result, ensure_ascii=False))
print("===END===")
