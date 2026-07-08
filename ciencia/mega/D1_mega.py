"""
D1_mega — Ley de Zipf (rango-tamaño) del sistema urbano mundial y por país.

Análisis log-log de la población de ciudades del mundo (GeoNames cities15000):
ajuste de la ley rango-tamaño con regresión lineal en escala logarítmica
para estimar el exponente q de Zipf y la bondad de ajuste R². Compara el
ajuste global con cuatro países: Colombia (CO), Estados Unidos (US),
India (IN) y Brasil (BR).

Convenciones:
    log(pop) = intercept − q · log(rango)
    q > 0 (cercano a 1 → ley de Zipf pura)

Entradas:
    ciencia/data/cities15000.txt   TSV GeoNames (19 cols, sin header)
    Columnas 1-indexed: 2 nombre, 9 país, 15 población.

Salidas:
    ciencia/figs/D1_mega.png       Figura 3×2 (global grande + 4 países)
    Bloque JSON entre marcadores ===RESULT=== / ===END=== en stdout
"""
import os
import sys
import json
import warnings

import numpy as np
import pandas as pd
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from scipy import stats

warnings.filterwarnings("ignore")


# ---------------------------------------------------------------------------
# Configuración
# ---------------------------------------------------------------------------
RUTA_DATOS = "ciencia/data/cities15000.txt"
RUTA_FIG = "ciencia/figs/D1_mega.png"

PAISES = ["CO", "US", "IN", "BR"]
NOMBRES_PAIS = {
    "CO": "Colombia",
    "US": "Estados Unidos",
    "IN": "India",
    "BR": "Brasil",
}
COLORES = {
    "GLOBAL": "#1f4e79",   # azul oscuro
    "CO":     "#2ca02c",   # verde
    "US":     "#ff7f0e",   # naranja
    "IN":     "#d62728",   # rojo
    "BR":     "#e0a800",   # amarillo (mostaza, legible sobre blanco)
}
COLOR_REGRESION = "#c0392b"   # rojo para la línea de Zipf


# Fallback embebido (~55 ciudades). Se usa solo si el archivo no existe o
# no puede leerse. Cubre los cuatro países del análisis + un set global.
FALLBACK = [
    ("Tokyo",          "JP", 13960000), ("Delhi",          "IN", 16787941),
    ("Shanghai",       "CN", 24183300), ("São Paulo",      "BR", 11895893),
    ("Mexico City",    "MX",  9209944), ("Cairo",          "EG",  9540000),
    ("Mumbai",         "IN", 12442373), ("Beijing",        "CN", 19433000),
    ("Dhaka",          "BD",  8906039), ("Osaka",          "JP",  2691185),
    ("New York",       "US",  8337963), ("Karachi",        "PK", 14916456),
    ("Buenos Aires",   "AR",  3075646), ("Chongqing",      "CN", 31020000),
    ("Istanbul",       "TR", 15462452), ("Kolkata",        "IN",  4496694),
    ("Manila",         "PH",  1780148), ("Lagos",          "NG", 14862000),
    ("Rio de Janeiro", "BR",  6747815), ("Tianjin",        "CN", 13610000),
    ("Kinshasa",       "CD", 14560000), ("Guangzhou",      "CN", 14904000),
    ("Los Angeles",    "US",  3979576), ("Moscow",         "RU", 12506468),
    ("Shenzhen",       "CN", 12530000), ("Lahore",         "PK", 11135000),
    ("Bangalore",      "IN",  8443675), ("Paris",          "FR",  2161000),
    ("Bogotá",         "CO",  7181469), ("Jakarta",        "ID", 10770487),
    ("Chennai",        "IN",  7088000), ("Lima",           "PE",  8852000),
    ("Bangkok",        "TH",  8281000), ("Seoul",          "KR",  9776000),
    ("London",         "GB",  8982000), ("Tehran",         "IR",  8846000),
    ("Hong Kong",      "CN",  7392000), ("Hanoi",          "VN",  8054000),
    ("Sydney",         "AU",  5312163), ("Medellín",       "CO",  2529133),
    ("Cali",           "CO",  2227642), ("Barranquilla",   "CO",  1206319),
    ("Cartagena",      "CO",   973045), ("Cúcuta",         "CO",   711715),
    ("Bucaramanga",    "CO",   527451), ("Pereira",        "CO",   469612),
    ("Houston",        "US",  2304580), ("Chicago",        "US",  2696555),
    ("Phoenix",        "US",  1608139), ("Philadelphia",   "US",  1576251),
    ("San Antonio",    "US",  1451853), ("San Diego",      "US",  1381611),
    ("Dallas",         "US",  1304379), ("San Jose",       "US",  1013240),
    ("Austin",         "US",   962254), ("Jacksonville",   "US",   949611),
    ("Brasília",       "BR",  3015268), ("Salvador",       "BR",  2886698),
    ("Fortaleza",      "BR",  2686612), ("Belo Horizonte", "BR",  2512070),
    ("Manaus",         "BR",  2063689), ("Curitiba",       "BR",  1948626),
    ("Recife",         "BR",  1653464), ("Porto Alegre",   "BR",  1484941),
    ("Hyderabad",      "IN",  6993262), ("Ahmedabad",      "IN",  5570585),
    ("Pune",           "IN",  3124458), ("Surat",          "IN",  4462006),
    ("Jaipur",         "IN",  3046163), ("Lucknow",        "IN",  2815601),
]


# ---------------------------------------------------------------------------
# Carga de datos
# ---------------------------------------------------------------------------
def cargar_datos(ruta):
    """Lee el TSV de GeoNames. Devuelve DataFrame con columnas
    [name, country, pop]. Si el archivo falta o falla, usa el fallback."""
    if not os.path.exists(ruta):
        print(f"[aviso] No existe {ruta}; usando fallback ({len(FALLBACK)} ciudades).",
              file=sys.stderr)
        return pd.DataFrame(FALLBACK, columns=["name", "country", "pop"])

    try:
        # 0-indexed: 1 = nombre, 8 = país, 14 = población
        df = pd.read_csv(
            ruta,
            sep="\t",
            header=None,
            usecols=[1, 8, 14],
            names=["name", "country", "pop"],
            encoding="utf-8",
            on_bad_lines="skip",
            low_memory=False,
        )
        df["pop"] = pd.to_numeric(df["pop"], errors="coerce")
        df = df.dropna(subset=["pop"])
        df = df[df["pop"] > 0].copy()
        if df.empty:
            raise ValueError("dataset vacío tras filtrar pop > 0")
        return df
    except Exception as e:
        print(f"[aviso] Error leyendo {ruta}: {e}; usando fallback.", file=sys.stderr)
        return pd.DataFrame(FALLBACK, columns=["name", "country", "pop"])


# ---------------------------------------------------------------------------
# Ajuste Zipf
# ---------------------------------------------------------------------------
def ajustar_zipf(pop):
    """Recibe un array de poblaciones. Devuelve un dict con:
        q, R2, n, rank, log_rank, log_pop_pred
    donde log(pop) = intercept − q·log(rank)."""
    pop = np.asarray(pop, dtype=float)
    pop = pop[pop > 0]
    n = len(pop)
    if n < 3:
        return {"q": None, "R2": None, "n": n,
                "rank": None, "log_rank": None, "pred": None}

    pop_sorted = np.sort(pop)[::-1]
    rank = np.arange(1, n + 1, dtype=float)
    lr = np.log(rank)
    lp = np.log(pop_sorted)

    res = stats.linregress(lr, lp)
    q = float(-res.slope)
    r2 = float(res.rvalue ** 2)
    pred = res.intercept + res.slope * lr  # = intercept − q·lr

    return {"q": q, "R2": r2, "n": n,
            "rank": rank, "log_rank": lr, "pred": pred}


def ajustar_powerlaw(pop):
    """Ajuste opcional con la librería `powerlaw`. Devuelve alpha o None."""
    try:
        import powerlaw
    except Exception:
        return None
    try:
        data = np.asarray(pop, dtype=float)
        data = data[data > 0]
        if len(data) < 10:
            return None
        fit = powerlaw.Fit(data, discrete=False, verbose=False)
        return float(fit.alpha)
    except Exception as e:
        print(f"[aviso] powerlaw.Fit falló: {e}", file=sys.stderr)
        return None


# ---------------------------------------------------------------------------
# Dibujo
# ---------------------------------------------------------------------------
def panel_dibuja(ax, pop, color_puntos, titulo, tam_punto=8):
    """Dibuja scatter log-log + línea de regresión Zipf. Devuelve
    un dict con los resultados del ajuste (q, R2, n)."""
    res = ajustar_zipf(pop)
    if res["q"] is None:
        ax.text(0.5, 0.5, "Datos insuficientes (n < 3)",
                ha="center", va="center", transform=ax.transAxes, fontsize=10)
        ax.set_title(titulo, fontsize=11)
        return res

    pop_sorted = np.sort(np.asarray(pop, dtype=float))[::-1]
    rank = res["rank"]
    pred = res["pred"]

    ax.scatter(rank, pop_sorted, s=tam_punto, alpha=0.5,
               color=color_puntos, edgecolors="none", label="Ciudades")
    ax.plot(rank, np.exp(pred), color=COLOR_REGRESION, linewidth=2.0,
            label=f"Zipf: q={res['q']:.2f}, R²={res['R2']:.4f}, n={res['n']}")

    ax.set_xscale("log")
    ax.set_yscale("log")
    ax.set_xlabel("Rango (escala log)", fontsize=9)
    ax.set_ylabel("Población (escala log)", fontsize=9)
    ax.set_title(titulo, fontsize=11, fontweight="bold")
    ax.grid(True, which="both", ls=":", alpha=0.35)
    ax.legend(fontsize=8, loc="lower left", framealpha=0.9)
    return res


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------
def main():
    df = cargar_datos(RUTA_DATOS)
    n_global = len(df)
    print(f"[info] {n_global} ciudades cargadas para análisis global.", file=sys.stderr)

    # Crear carpeta de salida
    os.makedirs(os.path.dirname(RUTA_FIG), exist_ok=True)

    # Figura: 3 filas x 2 columnas. Fila 0 = global (ancho completo).
    fig = plt.figure(figsize=(13, 13))
    gs = fig.add_gridspec(
        3, 2,
        height_ratios=[2.0, 1.2, 1.2],
        hspace=0.45, wspace=0.28,
    )
    ax_g   = fig.add_subplot(gs[0, :])
    ax_co  = fig.add_subplot(gs[1, 0])
    ax_us  = fig.add_subplot(gs[1, 1])
    ax_in  = fig.add_subplot(gs[2, 0])
    ax_br  = fig.add_subplot(gs[2, 1])

    # Panel global
    res_g = panel_dibuja(
        ax_g, df["pop"].values, COLORES["GLOBAL"],
        "Ley de Zipf: Rango-Tamaño (Mundial)",
        tam_punto=6,
    )

    # Paneles por país
    res_pais = {}
    for codigo, ax, color in [
        ("CO", ax_co, COLORES["CO"]),
        ("US", ax_us, COLORES["US"]),
        ("IN", ax_in, COLORES["IN"]),
        ("BR", ax_br, COLORES["BR"]),
    ]:
        sub = df.loc[df["country"] == codigo, "pop"].values
        nombre = NOMBRES_PAIS[codigo]
        if len(sub) < 3:
            ax.text(0.5, 0.5,
                    f"Sin datos para {codigo} ({nombre})",
                    ha="center", va="center", transform=ax.transAxes, fontsize=10)
            ax.set_title(f"{nombre} ({codigo}) — sin datos", fontsize=11)
            res_pais[codigo] = None
            continue
        res_pais[codigo] = panel_dibuja(
            ax, sub, color, f"{nombre} ({codigo})"
        )

    fig.suptitle(
        "Ley de Zipf en sistemas urbanos — ajuste rango-tamaño log-log",
        fontsize=14, fontweight="bold", y=0.995,
    )

    fig.savefig(RUTA_FIG, dpi=150, bbox_inches="tight")
    plt.close(fig)
    print(f"[info] Figura guardada en {RUTA_FIG}", file=sys.stderr)

    # Powerlaw opcional (silencioso si no está disponible)
    alpha = ajustar_powerlaw(df["pop"].values)

    # ----- Salida JSON entre marcadores -----
    def _q_pais(cod):
        r = res_pais.get(cod)
        if r is None or r.get("q") is None:
            return None
        return round(r["q"], 4)

    def _r2_pais(cod):
        r = res_pais.get(cod)
        if r is None or r.get("R2") is None:
            return None
        return round(r["R2"], 4)

    salida = {
        "q_mundial":  round(res_g["q"], 4) if res_g["q"] is not None else None,
        "R2":         round(res_g["R2"], 4) if res_g["R2"] is not None else None,
        "n_ciudades": int(res_g["n"]),
        "q_por_pais": {p: _q_pais(p) for p in PAISES},
        "R2_por_pais": {p: _r2_pais(p) for p in PAISES},
        "n_por_pais":  {p: (int(res_pais[p]["n"]) if res_pais[p] is not None else None)
                        for p in PAISES},
    }
    if alpha is not None:
        salida["alpha_powerlaw_mundial"] = round(alpha, 4)
        salida["powerlaw_disponible"] = True
    else:
        salida["powerlaw_disponible"] = False
    salida["figura"] = RUTA_FIG
    salida["fuente_datos"] = (
        RUTA_DATOS if os.path.exists(RUTA_DATOS) else "fallback_embebido"
    )

    print("===RESULT===")
    print(json.dumps(salida, ensure_ascii=False, indent=2))
    print("===END===")


if __name__ == "__main__":
    main()
