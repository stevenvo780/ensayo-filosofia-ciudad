# La ciudad bien asignada

**Cartografía crítica de una Medellín posible** — ensayo final del curso *Filosofía de la Ciudad*
(2026-1, Universidad de Antioquia · Prof. Carolina Álvarez-Valencia · 40 % de la nota · entrega
10-jul-2026). Autor: **Steven Vallejo Ortiz**.

🌐 **Sitio en vivo:** <https://autopoesis.stevenvallejo.com> — el ensayo, la tesis de respaldo y una
presentación con animaciones explicativas interactivas. (Espejo: `filosofia-de-la-ciudad.vercel.app`.)

Este repositorio se publica como **evidencia abierta y reproducible**: todo el aparato empírico que
sostiene el ensayo —código, datos reales y figuras— está aquí, sin nada oculto. Cualquiera puede
re-ejecutar las trece demostraciones y obtener las mismas cifras.

---

## La tesis en una frase

La ciudad posible no es la más vigilada ni la más “inteligente”: es la **bien asignada** — la que
manda cada asunto urbano al registro capaz de resolverlo. **Computa** lo computable (rutas,
acueductos: algoritmos exactos y auditables), **cultiva** lo emergente (fija condiciones, no decreta
resultados) y **delibera** lo relevante (toda métrica pública es un acto político revisable). El
funcionalismo fracasó por *computar lo emergente*; la *smart city* fracasa por *computar lo
relevante*: el mismo error de asignación con el signo invertido.

Ese diagnóstico se lee bajo un lente **autopoiético**: la ciudad se autoproduce en la medida en que
sus componentes reingresan y disputan las distinciones del sistema —autopoiesis **abierta**—; el
funcionalismo y la *smart city* subsumen todo bajo una distinción fija y clausuran esa reentrada
—autopoiesis **cerrada**—. Es el lente que organiza este repositorio, no un teorema demostrado.

---

## Los dos textos

| Texto | Archivo | Qué es |
|---|---|---|
| **Ensayo** (entregable) | [`ensayo/00_ensayo.md`](ensayo/00_ensayo.md) | «La ciudad bien asignada», ~2.400 palabras (dentro del rango 2000–2500). Cartografía crítica en tres ejes: ontológico, poder, técnica. Autosuficiente. |
| **Tesis de respaldo** | [`tesis/00_tesis.md`](tesis/00_tesis.md) | Documento extenso que fundamenta el ensayo: el aparato empírico completo (figuras D1–D13), el Banco Epistémico Urbano y las críticas técnicas. El ensayo se auto-referencia a ella. |

---

## La evidencia computacional (D1–D13)

Trece demostraciones, ejecutadas **localmente** (32 núcleos, semilla fija `42`). El resumen canónico
—con los guardarraíles epistémicos honestos de cada una— está en
[`ciencia/RESULTADOS.md`](ciencia/RESULTADOS.md). Scripts en `ciencia/mega/`, figuras en `ciencia/figs/`.

| # | Demostración | Resultado clave | Datos | Script |
|---|---|---|---|---|
| **D1** | Ley de Zipf (rango-tamaño) | q = 1.006, R² = 0.984 | 33.933 ciudades reales (GeoNames) | `D1_mega.py` |
| **D2** | Ley de escala (Bettencourt–West) | β = 0.90, medido no inyectado | 26 ciudades europeas (GeoNames + OSM) | `D2_mega.py`, `D2_fit_from_cache.py` |
| **D3** | Dimensión fractal (percolación) | D = 1.910 | 67 M celdas (sintético) | `D3_mega.py` |
| **D4** | Segregación de Schelling | 0.50 → 0.87 desde reglas locales | 64 M celdas / 59 M agentes (sintético) | `D4_mega.py` |
| **D5** | Centralidad: la métrica decide el centro | 3 métricas → centros casi disjuntos (Jaccard 0.10/0.04/0.00) | **red peatonal REAL de Medellín** (7.598 nodos, OSM) | `D5_mega.py` |
| **D6** | La «métrica del cuerpo» (pendiente) | el centro del cuerpo dista 229 m del centro del flujo | red real + **elevación real SRTM 30 m** | `D6_pendiente.py` |
| **D7** | Umbral de intervención anti-segregación | diluir NO sirve; anclar sí, umbral ~55 % | Schelling con palanca de política | `D7_intervencion.py` |
| **D8** | Escala CIUDAD (radio 4 km) | desnivel 962 m; centro del cuerpo a 710 m del flujo; prominencia 7.6× | red real de 22.863 nodos + SRTM | `D8_ciudad.py` |
| **D9** | Robustez / significancia (null models) | prominencia real vs nulos → z ≈ 188 (estructura real) | red D5 + 60 grafos degree-preserving | `D9_robustez.py` |
| **D10** | Juego de congestión (Wardrop/Braess) | PoA = 1.03; una arista-Braess robusta mejora +1.37 % al cerrarla | red real de 22.863 nodos + demanda O-D sintética | `D10_congestion.py` |
| **D11** | Juego de localización de Hotelling | comercio informal se aglomera 2.6× vs el óptimo social | red real de Medellín (7.598 nodos) | `D11_hotelling.py` |
| **D12** | Difusión / esparcimiento | footfall difuso; pendiente encoge alcance de 15 min 24 % en ladera vs 16 % en el centro | red real de 22.863 nodos + SRTM | `D12_difusion.py` |
| **D13** | Minimax-regret sobre 4 centralidades | rankings casi disjuntos (Jaccard medio 0.03); no hay portafolio robusto neutral | red real de 22.863 nodos | `D13_decision.py` |

**Honestidad (importante):** D3, D4 y D7 son sintéticas (ilustran mecanismos, no son Medellín). D1 es
una regularidad del *sistema* de ciudades, no de una ciudad singular. D10 corre sobre la red real de
Medellín, pero con demanda O-D **sintética**. D5, D6, D8, D9, D11, D12 y D13 son datos **reales** de
Medellín. Estos resultados se citan como *evidencia consistente con* una lectura autopoiética de la
ciudad, **nunca** como su prueba literal. Cada matiz está escrito en `ciencia/RESULTADOS.md`.

### Procedencia de los datos (nada inventado)
- **GeoNames** `cities15000` (ciudades del mundo > 15.000 hab) → `ciencia/data/cities15000.txt` (D1).
  Fuente: <https://download.geonames.org/export/dump/>.
- **OpenStreetMap** vía `osmnx` → redes peatonales reales (D5/D6/D8) y conteo de *amenities* (D2). Las
  respuestas crudas de la API Overpass quedan cacheadas en `cache/`, lo que **fija la red exacta** usada
  y hace que D5/D6/D8/D9 reproduzcan idénticamente.
- **SRTM 30 m** (elevación real) vía la API pública `opentopodata.org` → `ciencia/data/d6_elev_cache.json`
  y `d8_elev_cache.json` (D6/D8).

---

## Reproducir la evidencia

```bash
# 1. Entorno Python (3.12)
python -m venv .venv
.venv/bin/pip install -r requirements.txt

# 2. Correr cualquier demostración (desde la raíz del repo)
.venv/bin/python ciencia/mega/D5_mega.py     # la métrica decide el centro
.venv/bin/python ciencia/mega/D8_ciudad.py   # escala ciudad (usa cache/ + SRTM)
.venv/bin/python ciencia/mega/D9_robustez.py # null models
```

Cada script imprime su resultado en JSON entre `===RESULT===` y `===END===`, y guarda su figura en
`ciencia/figs/`. Gracias a las cachés (`cache/`, `ciencia/data/*.json`) los experimentos con datos
reales corren sin volver a golpear las APIs y dan **exactamente** las mismas cifras.

---

## Método y auditoría (trabajo asistido por IA, declarado)

Este ensayo se produjo con asistencia de IA **orquestada y declarada**: la tesis, las decisiones
filosóficas y la voz son del autor; la IA ejecutó la crítica adversarial multi-modelo, el aparato
computacional y las ediciones quirúrgicas registradas. El principio rector: un trabajo asistido no
se juzga por su procedencia sino por si **resiste una verificación más dura** que la de un texto
artesanal. Esa verificación es reproducible:

| Compuerta | Comando | Qué garantiza |
|---|---|---|
| Cifras | `make verify` | toda cifra empírica del ensayo y la tesis coincide con `ciencia/RESULTADOS.md` (148 verificadas) |
| Extensión | `make wordcount` | cuerpo del ensayo dentro de 2.000–2.500 palabras, con método de conteo declarado |
| Entregable | `make pdf` / `make pages` | el PDF se regenera desde la fuente canónica |

- **[`docs/METODOLOGIA.md`](docs/METODOLOGIA.md)** — el método completo: regla de integridad
  autor/IA, compuertas y batería adversarial de nueve lentes.
- **[`docs/ITERACIONES.md`](docs/ITERACIONES.md)** — la historia del ensayo por hitos (0→7).
- **[`CRITICA.md`](CRITICA.md) → [`CRITICA2.md`](CRITICA2.md) → [`CRITICA3.md`](CRITICA3.md)** —
  las tres rondas de crítica adversarial; la última, **trimodelo** (Claude, GPT-5.5 y Gemini), con
  el estado de aplicación de cada hallazgo.

---

## El sitio web (`web/`)

SPA en **React 18 + Vite 5 + TypeScript** con animaciones explicativas hechas en código
(framer-motion + canvas): un diagrama que calcula centralidades en vivo y muestra el centro saltando
de nodo, un Schelling corriendo con slider de tolerancia, y la tríada computa/cultiva/delibera. El
contenido se sincroniza automáticamente desde `ensayo/`, `tesis/` y `ciencia/figs/`.

```bash
cd web
npm install
npm run dev        # desarrollo (http://localhost:5173)
npm run build      # sincroniza contenido + compila a web/dist
```

Rutas: `/` (ensayo) · `/tesis` (respaldo) · `/presentacion` (deck animado) · `/materiales` (el
proyecto completo, abierto: consigna, críticas, resultados, metodología — legible y descargable).
Despliegue en
Vercel (`vercel build --prod && vercel deploy --prebuilt --prod`).

---

## Estructura del repositorio

```
ensayo/00_ensayo.md        El entregable: «La ciudad bien asignada»
tesis/00_tesis.md          Tesis de respaldo (aparato empírico + Banco Epistémico Urbano)
ciencia/
  RESULTADOS.md            Resultados canónicos D1–D13 con guardarraíles honestos
  mega/D*.py               Los 14 scripts de las demostraciones (evidencia ejecutable)
  figs/D1–D13_mega.png     Figuras generadas por los scripts (excepto D9, sin figura)
  data/                    Datos reales: GeoNames + cachés de OSM y SRTM
  README.md                Guía de reproducción de la evidencia
cache/                     Respuestas crudas de OpenStreetMap (fija la red usada)
docs/
  METODOLOGIA.md           El método asistido por IA y su batería de verificación
  ITERACIONES.md           Bitácora: la historia del ensayo por hitos numerados
web/                       Sitio React/Vite (ensayo + tesis + presentación + /materiales)
Makefile                   Compuertas: verify · wordcount · pdf · pages · web
scripts/                   build-pdf.sh + verify_cifras.py (el verificador de cifras)
GUION-DEFENSA.md           Guion de la exposición oral + kit anti-objeciones
CONSIGNA.md                La consigna del curso
CRITICA{,2,3}.md           Las tres rondas de crítica adversarial (evidencia de rigor)
fuentes/                   Bibliografía en texto (los PDFs con copyright NO se versionan)
material/                  Materia prima de las dos exposiciones previas del semestre
requirements.txt           Dependencias Python con versiones exactas
```

---

## Fuentes y copyright

La bibliografía académica está citada en el ensayo y en `fuentes/fenomenologia-bib/referencias-academicas.md`.
Los **PDFs de libros con copyright** (Foucault, Husserl, Merleau-Ponty, Simmel, Deleuze, Haraway…)
**no se redistribuyen** en este repositorio: quedan solo en la copia local del autor y están excluidos
por `.gitignore`. Los datos empíricos (GeoNames, OpenStreetMap, SRTM) son de fuentes abiertas y sí se
incluyen como evidencia.

---

*Repositorio mantenido como evidencia abierta del trabajo. El código y los datos empíricos se publican
para verificación y reproducción; el texto del ensayo es obra del autor para evaluación académica.*
