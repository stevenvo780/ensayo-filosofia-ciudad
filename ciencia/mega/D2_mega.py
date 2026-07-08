#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
D2 (real) — Ley de escala urbana de Bettencourt–West sobre DATOS REALES.

Mide un indicador socioeconómico real de cada ciudad —el número de amenities
(POI) mapeados en OpenStreetMap dentro de un radio fijo— y lo regresa contra la
población real (GeoNames). El exponente β de la ley de escala Y ∝ N^β se ESTIMA
del dato, no se inyecta: β>1 ⇒ superlinealidad (la actividad socioeconómica crece
más rápido que la población, propiedad emergente del colectivo).

NO circular: el indicador Y es una medición externa (OSM), no un modelo calibrado.
Robustez: muestra estratificada por décadas de población, descarga secuencial y
educada con backoff ante 429, caché en disco (reproducible sin volver a golpear la
API), y dos estimadores de pendiente (OLS y Theil–Sen robusto).

Salidas: ciencia/figs/D2_mega.png  +  bloque JSON ===RESULT===/===END===
"""
import io
import json
import logging
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path

import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
from scipy import stats

WORKSPACE = Path("/workspace/ensayo-filosofia-ciudad")
DATA_PATH = WORKSPACE / "ciencia/data/cities15000.txt"
CACHE_PATH = WORKSPACE / "ciencia/data/d2_osm_cache.json"
FIG_PATH = WORKSPACE / "ciencia/figs/D2_mega.png"

RNG_SEED = 42
RADIUS_M = 2500              # radio menor => queries ligeras y fiables en Overpass
POP_MIN = 50_000
POP_MAX = 4_000_000          # incluye Berlín/París/Roma; excluye megaurbes que timeoutean
N_TARGET = 130               # tamaño objetivo de la muestra estratificada
# Solo países con mapeo OSM homogéneo y de alta completitud (Europa central/occidental):
# controla el sesgo de "completitud de mapeo" para que el conteo de amenities sea
# un proxy JUSTO de la actividad socioeconómica y la ley de escala no lo confunda.
COUNTRIES = {"DE", "FR", "NL", "AT", "CH", "BE", "CZ", "DK", "SE", "PL", "IT", "ES", "GB", "PT"}
POLITE_DELAY_S = 5.0         # más educado => evita 429 en overpass-api.de
BACKOFF_429_S = 30.0
MAX_RETRIES = 5
MIN_VALID = 30               # mínimo de ciudades con Y>0 para aceptar como real
TARGET_VALID = 50            # parada temprana: suficiente para un ajuste robusto

ENDPOINTS = [
    "https://overpass-api.de/api/interpreter",
    "https://overpass.private.coffee/api/interpreter",
    "https://overpass.kumi.systems/api/interpreter",
    "https://maps.mail.ru/osm/tools/overpass/api/interpreter",
]
GEONAMES_COLS = [
    "geonameid", "name", "asciiname", "alternatenames", "latitude",
    "longitude", "feature_class", "feature_code", "country_code", "cc2",
    "admin1_code", "admin2_code", "admin3_code", "admin4_code",
    "population", "elevation", "dem", "timezone", "modification_date",
]


def log_setup():
    logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s",
                        stream=sys.stderr)
    return logging.getLogger("D2")


def load_sample(logger):
    df = pd.read_csv(
        DATA_PATH, sep="\t", header=None, names=GEONAMES_COLS,
        usecols=["geonameid", "name", "asciiname", "latitude", "longitude",
                 "country_code", "population"],
        dtype={"name": "string", "asciiname": "string", "country_code": "string"},
        na_values=[""], on_bad_lines="skip", low_memory=False,
    )
    for c in ("latitude", "longitude", "population", "geonameid"):
        df[c] = pd.to_numeric(df[c], errors="coerce")
    df = df.dropna(subset=["name", "latitude", "longitude", "population", "geonameid"])
    df = df[(df["population"] >= POP_MIN) & (df["population"] <= POP_MAX)].copy()
    df = df[df["country_code"].isin(COUNTRIES)].copy()   # solo mapeo OSM homogéneo
    # dedupe por coordenadas redondeadas (evita ciudades coincidentes)
    df["coord_key"] = (df["latitude"].round(1).astype(str) + "," +
                       df["longitude"].round(1).astype(str))
    df = df.sort_values("population", ascending=False).drop_duplicates("coord_key")
    # muestreo estratificado por bins de log10(poblacion) para cubrir el rango
    logpop = np.log10(df["population"].to_numpy())
    n_bins = 10
    bins = np.linspace(logpop.min(), logpop.max(), n_bins + 1)
    df["bin"] = np.digitize(logpop, bins[1:-1])
    per_bin = max(1, N_TARGET // n_bins)
    rng = np.random.default_rng(RNG_SEED)
    parts = []
    for b, g in df.groupby("bin"):
        take = min(len(g), per_bin)
        parts.append(g.sample(n=take, random_state=int(rng.integers(1e9))))
    # barajar (no ordenar) para que una parada temprana cubra todo el rango de población
    sample = pd.concat(parts).sample(frac=1, random_state=RNG_SEED).reset_index(drop=True)
    logger.info("Muestra estratificada: %d ciudades, pob %d–%d",
                len(sample), int(sample["population"].min()), int(sample["population"].max()))
    return sample


def load_cache():
    if CACHE_PATH.exists():
        try:
            return json.loads(CACHE_PATH.read_text(encoding="utf-8"))
        except Exception:
            return {}
    return {}


def save_cache(cache):
    CACHE_PATH.write_text(json.dumps(cache, ensure_ascii=False), encoding="utf-8")


def overpass_query(lat, lon, r):
    return f'[out:json][timeout:40];(node["amenity"](around:{r},{lat:.6f},{lon:.6f}););out count;'


def parse_count(payload):
    for e in payload.get("elements", []):
        if e.get("type") == "count":
            t = e.get("tags", {})
            return int(t.get("total", t.get("nodes", 0)))
    return 0


def fetch_count(lat, lon, logger):
    data = urllib.parse.urlencode({"data": overpass_query(lat, lon, RADIUS_M)}).encode()
    for attempt in range(MAX_RETRIES):
        ep = ENDPOINTS[attempt % len(ENDPOINTS)]
        req = urllib.request.Request(
            ep, data=data, method="POST",
            headers={"User-Agent": "urban-scaling-research/1.0 (academic)",
                     "Accept": "application/json"})
        try:
            with urllib.request.urlopen(req, timeout=48) as resp:
                payload = json.loads(resp.read().decode("utf-8", "replace"))
            return parse_count(payload)
        except urllib.error.HTTPError as exc:
            if exc.code == 429:
                logger.warning("429 en %s; backoff %.0fs", ep, BACKOFF_429_S)
                time.sleep(BACKOFF_429_S)
            else:
                logger.warning("HTTP %s en %s", exc.code, ep)
                time.sleep(3)
        except Exception as exc:
            logger.warning("%s en %s", type(exc).__name__, ep)
            time.sleep(3)
    return None


def collect(sample, logger):
    cache = load_cache()
    rows = []
    for i, row in sample.iterrows():
        gid = f"{int(row['geonameid'])}_{RADIUS_M}"
        if gid in cache and cache[gid]:
            y = cache[gid]
        else:
            y = fetch_count(float(row["latitude"]), float(row["longitude"]), logger)
            if y and y > 0:                 # NO cachear fallos: así reintentan en reruns
                cache[gid] = y
                save_cache(cache)
            time.sleep(POLITE_DELAY_S)
        if y and y > 0:
            rows.append({"name": str(row["name"]), "cc": str(row["country_code"]),
                         "pop": float(row["population"]), "Y": float(y)})
            logger.info("OK %-22s pop=%9d amenities=%6d  [%d]", str(row["name"])[:22],
                        int(row["population"]), int(y), len(rows))
            if len(rows) >= TARGET_VALID:
                logger.info("Alcanzado TARGET_VALID=%d; parada temprana.", TARGET_VALID)
                break
        else:
            logger.warning("sin datos: %s", str(row["name"])[:22])
    return pd.DataFrame(rows)


def theil_sen(x, y):
    res = stats.theilslopes(y, x)
    return float(res[0]), float(res[2]), float(res[3])  # slope, lo, hi


def main():
    logger = log_setup()
    np.random.seed(RNG_SEED)
    sample = load_sample(logger)
    df = collect(sample, logger)
    if len(df) < MIN_VALID:
        logger.error("Solo %d ciudades con dato real (<%d). Aborta sin fabricar dato.",
                     len(df), MIN_VALID)
        print(f"===RESULT==={json.dumps({'error':'datos_reales_insuficientes','n':len(df)})}===END===")
        return

    x = np.log(df["pop"].to_numpy())
    y = np.log(df["Y"].to_numpy())
    reg = stats.linregress(x, y)
    beta, intercept, r, _, se = reg[:5]
    beta = float(beta); r2 = float(r ** 2); se = float(se)
    ci_lo, ci_hi = beta - 1.96 * se, beta + 1.96 * se
    ts_slope, ts_lo, ts_hi = theil_sen(x, y)

    # figura
    FIG_PATH.parent.mkdir(parents=True, exist_ok=True)
    xv = df["pop"].to_numpy(); yv = df["Y"].to_numpy()
    xl = np.logspace(np.log10(xv.min() * 0.85), np.log10(xv.max() * 1.15), 100)
    yl = np.exp(intercept) * xl ** beta
    lin_int = np.mean(np.log(yv)) - 1.0 * np.mean(np.log(xv))
    y_lin = np.exp(lin_int) * xl
    fig, ax = plt.subplots(figsize=(8.5, 5.6))
    ax.scatter(xv, yv, s=42, color="#153b66", edgecolor="white", linewidth=0.5,
               alpha=0.9, label=f"Ciudades reales (n={len(df)})")
    ax.plot(xl, yl, color="#d62728", lw=2.3,
            label=rf"Ajuste OLS: $\hat\beta$={beta:.3f} (IC {ci_lo:.2f}–{ci_hi:.2f}), $R^2$={r2:.3f}")
    ax.plot(xl, y_lin, color="#888888", ls="--", lw=1.5, label=r"Referencia lineal $\beta=1$")
    ax.set_xscale("log"); ax.set_yscale("log")
    ax.set_xlabel("Población N (GeoNames)")
    ax.set_ylabel("Amenities OSM en radio 2,5 km (indicador socioeconómico)")
    ax.set_title("Ley de escala urbana de Bettencourt–West sobre datos reales (OSM)")
    ax.grid(True, which="both", ls=":", lw=0.7, alpha=0.6)
    ax.legend(frameon=True, fontsize=9)
    fig.tight_layout(); fig.savefig(FIG_PATH, dpi=150, bbox_inches="tight"); plt.close(fig)

    result = {
        "demo": "D2_escala_real",
        "beta_ols": round(beta, 3),
        "IC95_lower": round(ci_lo, 3),
        "IC95_upper": round(ci_hi, 3),
        "beta_theil_sen": round(ts_slope, 3),
        "theil_sen_IC": [round(ts_lo, 3), round(ts_hi, 3)],
        "R2": round(r2, 4),
        "n": int(len(df)),
        "radio_m": RADIUS_M,
        "indicador": "conteo de amenities OSM (node[amenity]) en radio 2,5 km",
        "fuente_datos": "GeoNames cities15000 (población) + OpenStreetMap/Overpass (amenities)",
        "es_real": True,
        "superlineal": bool(ci_lo > 1.0),
        "figura": "ciencia/figs/D2_mega.png",
    }
    print(f"===RESULT==={json.dumps(result, ensure_ascii=False)}===END===")


if __name__ == "__main__":
    main()
