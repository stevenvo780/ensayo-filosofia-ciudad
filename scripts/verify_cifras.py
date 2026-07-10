#!/usr/bin/env python3
"""verify_cifras.py — guardián de las CIFRAS EMPÍRICAS del proyecto.

Análogo al verificador de citas Stephanus del repo hermano (ensayo-platon-gorgias),
pero aquí la compuerta valida los NÚMEROS: cada cifra empírica con contexto en
`ensayo/00_ensayo.md` y `tesis/00_tesis.md` debe coincidir con el registro
canónico extraído de `ciencia/RESULTADOS.md` (más las cifras institucionales del
ensayo y las del experimento T1–T6 de la tesis).

Modelo de verificación (dos niveles):
  1) REGISTRO CANÓNICO — detectores agrupados por contexto (unidad o marcador:
     nodos, aristas, metros, %, Jaccard, z, β, q, ×, …). Cada detector lleva el
     conjunto de valores canónicos admitidos para ese contexto. Toda cifra hallada
     en ese contexto debe caer (dentro de la tolerancia declarada) en ese conjunto:
        - coincide  -> OK      (se lista con -v)
        - no coincide -> ERROR (archivo:línea + cifra hallada + lo esperado)
  2) BARRIDO DE COMPLETITUD — se buscan cifras con pinta empírica (número + unidad
     o marcador) que NINGÚN detector del registro reclamó -> WARNING, para que el
     registro se mantenga completo (no rompe la compuerta).

Compuerta dura: exit code 1 si hay algún ERROR (los WARNING no fallan el build).
Tolerancias declaradas: redondeos del texto (p. ej. 229 m -> «unos 230» en el
ensayo; 0.872 -> «0,87»; 0.945 -> «0,95») y formato es-CO (coma decimal, punto de
millares). Sin dependencias fuera de la biblioteca estándar.

Uso:  verify_cifras.py [-v]
"""

import bisect
import os
import re
import sys

# Raíz del repo = carpeta padre de scripts/.
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ENSAYO = os.path.join(ROOT, "ensayo", "00_ensayo.md")
TESIS = os.path.join(ROOT, "tesis", "00_tesis.md")

# Token numérico genérico: empieza y termina en dígito (no captura la coma o el
# punto final de una cláusula, p. ej. «R² = 0.76,» -> «0.76»).
NUM = r"\d[\d.,]*\d|\d"


# --------------------------------------------------------------------------- #
#  Parseo de números es-CO / en-US (mezclados en el mismo documento)          #
# --------------------------------------------------------------------------- #
def num_candidates(s):
    """Devuelve las interpretaciones numéricas plausibles de una cifra escrita.

    El corpus mezcla convenciones: «7.598 nodos» (punto = millares) convive con
    «q = 1.006» (punto = decimal) y con «0,10» / «6,1×» (coma = decimal). Como
    cada cifra se compara contra un valor canónico conocido, devolvemos TODAS las
    lecturas razonables y aceptamos si alguna coincide.
    """
    s = s.strip().replace(" ", "")
    cands = set()
    try:
        if "." in s and "," in s:
            # La ÚLTIMA aparición marca el separador decimal.
            if s.rfind(".") > s.rfind(","):
                cands.add(float(s.replace(",", "")))              # 1,234.56
            else:
                cands.add(float(s.replace(".", "").replace(",", ".")))  # 1.234,56
        elif "," in s:
            cands.add(float(s.replace(",", ".")))   # coma decimal: 0,10 -> 0.10
            cands.add(float(s.replace(",", "")))    # coma millares (raro aquí)
        elif "." in s:
            cands.add(float(s))                     # punto decimal: 1.006
            if re.fullmatch(r"\d{1,3}(\.\d{3})+", s):
                cands.add(float(s.replace(".", "")))  # punto millares: 7.598 -> 7598
        else:
            cands.add(float(s))
    except ValueError:
        pass
    return cands


def match_value(numstr, values, tol):
    """Si alguna lectura de `numstr` cae a <= tol de algún valor canónico, lo
    devuelve; si no, None."""
    for cand in num_candidates(numstr):
        for v in values:
            if abs(cand - v) <= tol + 1e-9:
                return v
    return None


# --------------------------------------------------------------------------- #
#  REGISTRO CANÓNICO                                                           #
#                                                                             #
#  Cada entrada agrupa un contexto (unidad/marcador) con el conjunto de        #
#  valores canónicos admitidos. `patterns` captura la(s) cifra(s) desde el     #
#  texto real; TODO grupo capturado debe caer en `values` (± `tol`).           #
#  `kind='window'` recorre `window` caracteres tras `anchor` y valida cada     #
#  token `token` (se usa para racimos como los índices de Jaccard).            #
#                                                                             #
#  src: D1..D9 = ciencia/RESULTADOS.md ; POL = hecho institucional del ensayo; #
#       EXP = experimento T1–T6 de la tesis ; HW = hardware de ejecución.      #
# --------------------------------------------------------------------------- #
def D(id, desc, src, values, tol, patterns=None, **extra):
    e = {"id": id, "desc": desc, "src": src, "values": list(values),
         "tol": tol, "patterns": patterns or [], "kind": "match"}
    e.update(extra)
    return e


CANON = [
    # ---- D1 · Ley de Zipf (sistema urbano mundial) ----
    D("zipf_q", "exponente Zipf q", "D1", {1.006, 1.063}, 0.0,
      [r"q\s*=\s*(" + NUM + r")"]),
    D("zipf_q_aprox", "exponente Zipf redondeado (q ≈ 1)", "D1", {1.0}, 0.02,
      [r"q\s*≈\s*(\d)\b"]),
    D("zipf_alpha", "MLE α de Zipf", "D1", {2.05}, 0.0,
      [r"α\s*=\s*(" + NUM + r")"]),
    D("ciudades", "tamaño de muestra (ciudades)", "D1/D2", {33933, 319, 26}, 0.0,
      [r"(" + NUM + r")\s+ciudades"]),

    # ---- D2 · Ley de escala (Bettencourt–West) ----
    D("beta", "exponente de escala β", "D2", {0.90}, 0.0,
      [r"β\s*=\s*(" + NUM + r")"]),
    D("ic_bounds", "límites del IC de β", "D2", {0.70, 1.10}, 0.0,
      [r"(\d[.,]\d0)\s*[–-]\s*(1[.,]10)"]),
    D("ic95", "nivel de confianza (IC 95 %)", "D2", {95}, 0.0,
      [r"IC\s*(\d{2})\s*%"]),
    D("n_muestra", "n de la regresión de escala", "D2", {26}, 0.0,
      [r"\bn\s*=\s*(\d+)"]),
    D("km", "radio de descarga / escala (km)", "D2/D8", {2.5, 4}, 0.0,
      [r"(" + NUM + r")\s*km"]),

    # ---- R² (varias demostraciones) ----
    D("r2", "bondad de ajuste R²", "D1/D2/D3", {0.984, 0.997, 0.76, 0.9996}, 0.0,
      [r"R²\s*=\s*(" + NUM + r")"]),

    # ---- D3 · Dimensión fractal ----
    D("d_fractal", "dimensión fractal D", "D3", {1.910}, 0.0,
      [r"\bD\s*=\s*(" + NUM + r")"]),
    D("d_real", "D de ciudades reales (referencia)", "D3", {1.7}, 0.0,
      [r"\bD\s*≈\s*(" + NUM + r")"]),
    D("grid_cuadrado", "malla NxN (lado)", "D3/D4", {8192, 8000}, 0.0,
      [r"(\d{3,4})\s*[²×]"]),
    D("millones", "millones de celdas / agentes", "D3/D4", {64, 58.9}, 0.0,
      [r"(" + NUM + r")\s*(?:millones|M)\b"]),
    D("schelling_s", "tiempo de cómputo Schelling (s)", "D4", {465}, 0.0,
      [r"(\d+)\s+s\b(?!\w)"]),

    # ---- D4 · Segregación de Schelling (índices y tolerancias) ----
    D("segregacion", "índice de segregación de Schelling", "D4/D7",
      {0.50, 0.872, 0.922, 0.55, 0.596, 0.945, 0.65, 0.80}, 0.02,
      [r"índice\s+(\d[.,]\d{2})",
       r"(\d[.,]\d{2})\s*\(aleatorio\)",
       r"de\s+(\d[.,]\d{2})\s+a\s+(\d[.,]\d{2})",
       r"(\d[.,]\d{2})\s+con\s+tolerancia\s+\d",
       r"(\d[.,]\d{2})\s+\(tolerancia",
       r"hasta\s+(\d[.,]\d{2})",
       r"(?:desciende|baja|no-monotonía)\s+a\s+(\d[.,]\d{2})",
       r"extrema\s*\((\d[.,]\d)\)",
       r"(\d[.,]\d{2})\s*→\s*(\d[.,]\d{2})",
       r"umbral\s+(\d[.,]\d{2})"]),
    D("tolerancia", "tolerancia (fracción mínima de vecinos iguales)", "D4/D7",
      {0.5, 0.8}, 0.0,
      [r"(?:tolerancia|\btol)\s+(\d[.,]\d)\b"]),

    # ---- D5 · Red real del centro de Medellín ----
    D("nodos", "nodos de la red peatonal real", "D5/D8", {7598, 22863}, 0.0,
      [r"(" + NUM + r")\s+nodos"]),
    D("aristas", "aristas de la red peatonal real", "D5/D10", {11856, 33988}, 0.0,
      [r"(" + NUM + r")\s+aristas"]),
    D("prominencia_x", "prominencia / aglomeración (× la media o el óptimo)",
      "D5/D8/D11", {6.1, 7.6, 8000, 8192, 2.1, 2.3, 2.6, 3.9}, 0.0,
      [r"(" + NUM + r")\s*×", r"(\d[.,]\d)\s+veces"]),
    D("jaccard", "solapamiento de Jaccard entre métricas", "D5/D6/D8/D9/D13",
      {0.00, 0.03, 0.04, 0.08, 0.10, 0.53, 0.226, 0.192, 0.023}, 0.0,
      kind="window", anchor=r"Jaccard", window=80, token=r"0[.,]\d{2,3}\b"),

    # ---- D6 / D8 · Métrica del cuerpo (pendiente) y escala ciudad ----
    D("distancias_m", "distancias y desniveles (m)", "D6/D8",
      {30, 306, 229, 710, 962}, 2.0,
      [r"(" + NUM + r")\s+m\b", r"(\d+)\s+metros", r"(\d{3})\s+a\s+escala"]),

    # ---- D9 · Robustez frente a grafos nulos ----
    D("grafos_nulos", "número de grafos nulos", "D9", {60}, 0.0,
      [r"(\d+)\s+grafos"]),
    D("prominencia_nula", "prominencia real vs nulos (sin peso)", "D9",
      {9.76, 2.73}, 0.0,
      [r"prominencia\s+\((9[.,]76)\)",
       r"real\s+\*{0,2}(9[.,]76)\*{0,2}\s+vs\s+nulos\s+(2[.,]73)"]),
    D("desv_est", "desviación estándar de los nulos (±)", "D9", {0.04, 0.023}, 0.0,
      [r"±\s*(\d[.,]\d{2,3})"]),
    D("z_score", "z-score de significancia", "D9", {188}, 0.0,
      [r"z\s*[≈=]\s*(\d+)"]),
    D("percentil", "percentil de la prominencia real", "D9", {1.0}, 0.0,
      [r"percentil\s+(\d[.,]\d)"]),
    D("sigma", "desviaciones σ de la divergencia de métricas", "D9", {1.5}, 0.0,
      [r"(\d[.,]\d)\s*σ"]),
    D("k_muestreo", "muestreo de betweenness (k)", "D8", {1500}, 0.0,
      [r"k\s*=\s*(\d+)"]),

    # ---- D10–D13 · nuevos experimentos (congestión, Hotelling, difusión, decisión) ----
    D("poa", "precio de la anarquía (PoA)", "D10", {1.03}, 0.0,
      [r"anarquía[^0-9\n]{0,15}(" + NUM + r")"]),
    D("zonas", "zonas O-D de la demanda sintética", "D10", {300}, 0.0,
      [r"(\d+)\s+zonas"]),
    D("vendedores", "vendedores informales (Hotelling)", "D11", {40}, 0.0,
      [r"(\d+)\s+vendedores"]),
    D("minutos", "ventana de la isócrona (min)", "D12", {15}, 0.0,
      [r"(\d+)\s*min(?:utos)?\b"]),

    # ---- Experimento T1–T6 (solo en la tesis) ----
    D("porcentaje", "porcentajes empíricos e institucionales", "EXP/POL/D10/D11/D12",
      {1, 1.37, 2.4, 5, 16, 20, 24, 53, 55, 70, 75, 83, 90, 92, 93, 95, 100}, 0.0,
      [r"(" + NUM + r")\s*%"]),
    D("aciertos_10", "aciertos sobre 10 celdas (T1–T6)", "EXP", {7, 9}, 0.0,
      [r"\b([0-9])/10\b"]),
    D("banco_tipos", "preguntas por tipo del banco (forma cerrada / emergentes)",
      "EXP", {27, 12}, 0.0,
      [r"(\d+)\s+de\s+forma\s+cerrada", r"(\d+)\s+emergentes"]),
    D("preguntas", "tamaño del banco de preguntas", "EXP", {39}, 0.0,
      [r"(\d+)\s+preguntas"]),
    D("p_valor", "valor p (Fisher / umbral de política)", "EXP/D7", {0.58, 0.55}, 0.0,
      [r"p\s*≈\s*(\d[.,]\d{2})"]),

    # ---- Hechos institucionales (ensayo) ----
    D("acuerdo_pp", "Acuerdo 028 de 2017 (modifica el Acuerdo 43 de 2007)", "POL",
      {28, 2017, 43, 2007}, 0.0,
      [r"Acuerdo\s+0*(\d{2,3})\s+de\s+(\d{4})"]),
    D("ley_veedurias", "Ley 850 de 2003 (veedurías)", "POL", {850, 2003}, 0.0,
      [r"\bLey\s+(\d{3})\s+de\s+(\d{4})"]),
    D("epm_anio", "EPM patrimonio del municipio desde 1955", "POL", {1955}, 0.0,
      [r"desde\s+(1955)\b"]),
    D("plan_piloto", "Plan Piloto de Wiener y Sert (1948–1952)", "POL",
      {1948, 1952}, 0.0,
      [r"\((\d{4})\s*[–-]\s*(\d{4})\)"]),

    # ---- Hardware de ejecución ----
    D("nucleos", "núcleos de cómputo", "HW", {32}, 0.0,
      [r"(\d+)\s+núcleos"]),
    D("ram_gb", "memoria RAM (GB)", "HW", {125}, 0.0,
      [r"(\d+)\s+GB"]),
]


# --------------------------------------------------------------------------- #
#  BARRIDO DE COMPLETITUD (Tier 2)                                             #
#  Detecta cifras con pinta empírica (número + unidad o marcador). Lo que      #
#  ningún detector del registro reclamó -> WARNING.                            #
# --------------------------------------------------------------------------- #
GEN_UNIT = re.compile(
    r"(" + NUM + r")\s{0,2}"
    r"(?:%|×|nodos|aristas|celdas|agentes|núcleos|ciudades|preguntas|grafos"
    r"|veces|km|metros|m\b|s\b|M\b|σ|GB)")
GEN_MARK = re.compile(
    r"(?:Jaccard|q\s*[=≈]|β\s*=|α\s*=|R²\s*=|z\s*[=≈]|\bD\s*[=≈]|desnivel"
    r"|prominencia|percentil|radio|umbral|índice|IC|\bn\s*=|\btol\b|tolerancia"
    r"|p\s*[=≈]|Acuerdo|\bLey\b)[^0-9\n]{0,8}(" + NUM + r")")


# --------------------------------------------------------------------------- #
#  Motor                                                                       #
# --------------------------------------------------------------------------- #
def line_of(offsets, pos):
    """Número de línea (1-based) para un offset de carácter."""
    return bisect.bisect_right(offsets, pos)


def claimed(spans, a, b):
    """¿El tramo [a,b) solapa algún tramo ya reclamado por el registro?"""
    for s, e in spans:
        if a < e and s < b:
            return True
    return False


def verify_file(path):
    """Verifica un archivo; devuelve (oks, errors, warnings) como listas de
    tuplas (línea, texto)."""
    text = open(path, encoding="utf-8").read()
    # Offsets de inicio de línea para mapear posición -> línea.
    line_starts = [0]
    for m in re.finditer(r"\n", text):
        line_starts.append(m.end())
    rel = os.path.relpath(path, ROOT)

    oks, errors = [], []
    spans = []  # tramos reclamados por el registro (para el barrido de completitud)

    for entry in CANON:
        if entry["kind"] == "window":
            anchor = re.compile(entry["anchor"])
            token = re.compile(entry["token"])
            for a in anchor.finditer(text):
                seg = text[a.end():a.end() + entry["window"]]
                for tm in token.finditer(seg):
                    g = tm.group(0)
                    start = a.end() + tm.start()
                    ln = line_of(line_starts, start)
                    spans.append((start, a.end() + tm.end()))
                    if match_value(g, entry["values"], entry["tol"]) is not None:
                        oks.append((ln, f"[{entry['src']}] {entry['desc']}: {g}"))
                    else:
                        errors.append((ln, f"{rel}:{ln}  [{entry['src']}] "
                                       f"{entry['desc']}: hallado «{g}» — "
                                       f"esperado {sorted(entry['values'])}"))
            continue

        for pat in entry["patterns"]:
            for m in re.compile(pat).finditer(text):
                ln = line_of(line_starts, m.start())
                spans.append((m.start(), m.end()))
                groups = [g for g in m.groups() if g is not None]
                bad = [g for g in groups
                       if match_value(g, entry["values"], entry["tol"]) is None]
                shown = ", ".join(groups)
                if not bad:
                    oks.append((ln, f"[{entry['src']}] {entry['desc']}: {shown}"))
                else:
                    errors.append((ln, f"{rel}:{ln}  [{entry['src']}] "
                                   f"{entry['desc']}: hallado «{', '.join(bad)}» — "
                                   f"esperado {sorted(entry['values'])}"))

    # Barrido de completitud: cifras empíricas no reclamadas por el registro.
    warnings = []
    seen = set()
    for rx in (GEN_UNIT, GEN_MARK):
        for m in rx.finditer(text):
            a, b = m.start(1), m.end(1)
            if claimed(spans, a, b) or (a, b) in seen:
                continue
            seen.add((a, b))
            ln = line_of(line_starts, a)
            snippet = text[m.start():m.end()].strip()
            warnings.append((ln, f"{rel}:{ln}  cifra no catalogada: «{snippet}» "
                             f"(añádela al registro de verify_cifras.py)"))

    return oks, errors, warnings


def main():
    verbose = "-v" in sys.argv or "--verbose" in sys.argv
    all_ok, all_err, all_warn = [], [], []

    for path in (ENSAYO, TESIS):
        if not os.path.exists(path):
            print(f"ERROR: no existe {path}", file=sys.stderr)
            sys.exit(2)
        oks, errors, warnings = verify_file(path)
        all_ok += oks
        all_err += errors
        all_warn += warnings

    print("== Verificación de cifras empíricas (ensayo + tesis vs RESULTADOS.md) ==")
    if verbose:
        for _, msg in sorted(set(all_ok)):
            print(f"  OK    {msg}")
    for _, msg in sorted(set(w for w in all_warn)):
        print(f"  WARN  {msg}")
    for _, msg in sorted(set(e for e in all_err)):
        print(f"  ERROR {msg}")

    n_ok = len(all_ok)
    n_err = len(set(all_err))
    n_warn = len(set(all_warn))
    print(f"\nResultado: {n_ok} cifras verificadas, "
          f"{n_err} error(es), {n_warn} advertencia(s).")
    sys.exit(1 if n_err else 0)


if __name__ == "__main__":
    main()
