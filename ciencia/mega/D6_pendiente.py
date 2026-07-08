"""
D6 (real) — La "métrica del cuerpo": centralidad de cercanía ponderada por el
ESFUERZO de caminar en pendiente, sobre la red peatonal REAL de Medellín.

Medellín es ciudad de laderas. D5 mostró que la métrica elegida decide el centro
usando métricas topológicas de flujo. D6 añade una métrica encarnada: el costo
metabólico de caminar (función de Tobler) usando elevación real (SRTM 30 m). El
"centro para el cuerpo que sube" se desplaza respecto del "centro del flujo",
conectando la fatiga fenomenológica (Leib) con la topografía — y explicando por
qué existe el Metrocable. Datos reales (OSM + SRTM). Ejecución local.
"""
import json, math, time, urllib.parse, urllib.request
from pathlib import Path
import numpy as np
import networkx as nx
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt

WS = Path("/workspace/ensayo-filosofia-ciudad")
ELEV_CACHE = WS / "ciencia/data/d6_elev_cache.json"
FIG = WS / "ciencia/figs/D6_mega.png"
CENTER = (6.2476, -75.5658)
DIST = 2000
t0 = time.time()

# --- red real (igual que D5) ---
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
        G.add_edge(u, v, length=L)
G = G.subgraph(max(nx.connected_components(G), key=len)).copy()
nodes = list(G.nodes())
print(f"[D6] red real: {G.number_of_nodes()} nodos, {G.number_of_edges()} aristas, {time.time()-t0:.1f}s", flush=True)

# --- elevación SRTM 30 m (opentopodata, batch, con caché) ---
cache = json.loads(ELEV_CACHE.read_text()) if ELEV_CACHE.exists() else {}
def key(lat, lon):
    return f"{lat:.5f},{lon:.5f}"
todo = [(n, float(G.nodes[n]["y"]), float(G.nodes[n]["x"])) for n in nodes if key(G.nodes[n]["y"], G.nodes[n]["x"]) not in cache]
print(f"[D6] elevaciones a pedir: {len(todo)} (en caché: {len(nodes)-len(todo)})", flush=True)
i = 0
while i < len(todo):
    batch = todo[i:i + 100]
    locs = "|".join(f"{lat:.6f},{lon:.6f}" for _, lat, lon in batch)
    url = "https://api.opentopodata.org/v1/srtm30m?locations=" + urllib.parse.quote(locs, safe="|,.-")
    ok = False
    for attempt in range(5):
        try:
            with urllib.request.urlopen(url, timeout=40) as r:
                data = json.loads(r.read().decode("utf-8"))
            if data.get("status") == "OK":
                for (_, lat, lon), res in zip(batch, data["results"]):
                    e = res.get("elevation")
                    cache[key(lat, lon)] = float(e) if e is not None else None
                ok = True
                break
        except Exception as exc:
            print(f"[D6] batch {i} intento {attempt}: {type(exc).__name__}", flush=True)
        time.sleep(6)
    if not ok:
        raise SystemExit("opentopodata no respondió; abortando (no fabrico elevación)")
    ELEV_CACHE.write_text(json.dumps(cache))
    i += 100
    time.sleep(1.1)
for n in nodes:
    G.nodes[n]["elev"] = cache.get(key(G.nodes[n]["y"], G.nodes[n]["x"]))
elevs = np.array([G.nodes[n]["elev"] for n in nodes if G.nodes[n]["elev"] is not None], float)
print(f"[D6] elevación: min {elevs.min():.0f} m, max {elevs.max():.0f} m, rango {elevs.max()-elevs.min():.0f} m", flush=True)

# --- costo por esfuerzo (Tobler) sobre grafo DIRIGIDO ---
def tobler_speed(grade):  # km/h; pico ~6 km/h en leve bajada (-0.05)
    return 6.0 * math.exp(-3.5 * abs(grade + 0.05))
D = nx.DiGraph()
D.add_nodes_from((n, G.nodes[n]) for n in nodes)
for u, v, d in G.edges(data=True):
    L = float(d["length"])
    eu, ev = G.nodes[u]["elev"], G.nodes[v]["elev"]
    if eu is None or ev is None or L <= 0:
        continue
    guv = (ev - eu) / L
    D.add_edge(u, v, time=L / (tobler_speed(guv) * 1000 / 3600))   # segundos
    D.add_edge(v, u, time=L / (tobler_speed(-guv) * 1000 / 3600))
    G.edges[u, v]["grade"] = abs(guv)

# --- cercanía: por esfuerzo (cuerpo) vs por longitud (plano/flujo) ---
t1 = time.time()
clo_body = nx.closeness_centrality(D, distance="time")
clo_flat = nx.closeness_centrality(G, distance="length")
print(f"[D6] closeness (cuerpo + plano) en {time.time()-t1:.1f}s", flush=True)

def top_set(c, frac=0.05):
    k = max(1, int(round(frac * len(c))))
    return set(sorted(c, key=c.get, reverse=True)[:k])
tb, tf = top_set(clo_body), top_set(clo_flat)
jac = len(tb & tf) / len(tb | tf)
c_body = max(clo_body, key=clo_body.get)
c_flat = max(clo_flat, key=clo_flat.get)
def haversine(a, b):
    R = 6371000
    la1, lo1 = math.radians(G.nodes[a]["y"]), math.radians(G.nodes[a]["x"])
    la2, lo2 = math.radians(G.nodes[b]["y"]), math.radians(G.nodes[b]["x"])
    h = math.sin((la2-la1)/2)**2 + math.cos(la1)*math.cos(la2)*math.sin((lo2-lo1)/2)**2
    return 2*R*math.asin(math.sqrt(h))
desplazamiento = haversine(c_body, c_flat)

# --- figura: elevación (laderas) + centro-cuerpo vs centro-plano ---
xs = np.array([G.nodes[n]["x"] for n in nodes]); ys = np.array([G.nodes[n]["y"] for n in nodes])
ev = np.array([G.nodes[n]["elev"] if G.nodes[n]["elev"] is not None else np.nan for n in nodes], float)
cb = np.array([clo_body[n] for n in nodes]); cf = np.array([clo_flat[n] for n in nodes])
fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(15, 6.4))
for ax in (ax1, ax2):
    for u, v in G.edges():
        ax.plot([G.nodes[u]["x"], G.nodes[v]["x"]], [G.nodes[u]["y"], G.nodes[v]["y"]], color="#cfcabe", lw=0.35, alpha=0.5, zorder=1)
    ax.set_aspect("equal"); ax.axis("off")
s1 = ax1.scatter(xs, ys, c=ev, cmap="terrain", s=10, zorder=2)
ax1.set_title(f"Elevación real (SRTM): laderas del centro\nrango {np.nanmax(ev)-np.nanmin(ev):.0f} m")
plt.colorbar(s1, ax=ax1, shrink=0.6, label="m s.n.m.")
s2 = ax2.scatter(xs, ys, c=cb, cmap="viridis", s=10, zorder=2)
ax2.scatter([G.nodes[c_body]["x"]], [G.nodes[c_body]["y"]], s=200, facecolors="none", edgecolors="#e8934f", linewidths=2.6, zorder=3, label="centro del CUERPO (esfuerzo)")
ax2.scatter([G.nodes[c_flat]["x"]], [G.nodes[c_flat]["y"]], s=200, facecolors="none", edgecolors="#1f77b4", linewidths=2.6, zorder=3, label="centro del FLUJO (plano)")
ax2.set_title(f"Cercanía por esfuerzo (Tobler)\nlos centros distan {desplazamiento:.0f} m")
ax2.legend(loc="lower left", fontsize=9)
fig.suptitle("D6 — La métrica del cuerpo: la pendiente desplaza el centro (red real de Medellín)", fontweight="bold")
fig.tight_layout()
fig.savefig(FIG, dpi=150)

result = {
    "demo": "D6_metrica_cuerpo",
    "ciudad": "Medellín (La Candelaria), red peatonal real OSM + SRTM 30 m",
    "es_real": True,
    "n_nodos": G.number_of_nodes(),
    "elev_min_m": round(float(elevs.min()), 0),
    "elev_max_m": round(float(elevs.max()), 0),
    "elev_rango_m": round(float(elevs.max() - elevs.min()), 0),
    "desplazamiento_centros_m": round(desplazamiento, 0),
    "jaccard_cuerpo_vs_plano_top5": round(jac, 3),
    "modelo_esfuerzo": "función de Tobler sobre grafo dirigido (subir cuesta distinto que bajar)",
    "figura": "ciencia/figs/D6_mega.png",
    "tiempo_s": round(time.time() - t0, 1),
}
print("===RESULT===")
print(json.dumps(result, ensure_ascii=False))
print("===END===")
