# Resultados computacionales — evidencia empírica de la emergencia/auto-organización urbana

> **Guardarraíl epistémico (leer antes de citar).** Estas demostraciones evidencian
> **emergencia, auto-organización e invariancia de escala** — la *cara empírica* de una
> lectura **autopoiética** de la ciudad. **No** son una prueba literal de la autopoiesis en
> sentido estricto de Maturana–Varela (clausura operacional + autoproducción de los
> componentes): eso es una tesis filosófica, no un exponente. En el ensayo se citan como
> *evidencia consistente con* la lectura autopoiética, nunca como su demostración.
> Estas demostraciones son evidencia de patrones de auto-organización; el matiz filosóficamente
> decisivo —si esa autoproducción queda **abierta** (los componentes reingresan y disputan la
> distinción que los genera) o se **cierra** sobre una sola métrica que subsume el resto— es una
> lectura normativa del ensayo, no algo que el cómputo decida por sí solo.
>
> **Versión única y canónica.** Este archivo reemplaza cualquier versión previa («chica»/«mega»):
> hay **un solo** conjunto de resultados. Hardware: 32 núcleos, 125 GB RAM. Ejecución local
> reproducible, semilla fija `42`. Scripts en `ciencia/mega/D*_mega.py`; figuras en
> `ciencia/figs/D*_mega.png`.

| # | Demostración | Resultado clave | Escala / fuente | Naturaleza | Figura |
|---|---|---|---|---|---|
| D1 | Ley de Zipf (rango-tamaño) | **q = 1.006**, R² = 0.984 (MLE α = 2.05) | **33.933 ciudades reales** del mundo (GeoNames) | dato real | `figs/D1_mega.png` |
| D2 | Ley de escala (Bettencourt–West) | **β = 0.90** (IC 0.70–1.10), R² = 0.76 | **26 ciudades europeas reales**: población GeoNames + amenities OSM | **dato real (no circular)** | `figs/D2_mega.png` |
| D3 | Dimensión fractal (percolación 2D) | **D = 1.910**, R² = 0.9996 | 8192² = **67,1 M celdas**; cúmulo percolante 22,8 M | sintética (compute-bound) | `figs/D3_mega.png` |
| D4 | Segregación de Schelling | seg **0.50 → 0.872** (tol 0.5), hasta 0.922; no-monotonía a 0.55 (tol 0.8) | 8000² = **64 M celdas / 58,9 M agentes**, 465 s | sintética (compute-bound) | `figs/D4_mega.png` |
| D5 | Centralidad de red (3 métricas exactas) | betweenness_máx **0.104**; prominencia del eje **6.1×** la media; top-5 % casi disjuntos entre métricas (Jaccard 0.10 / 0.04 / 0.00) | **red REAL de Medellín** (La Candelaria, OSM peatonal): 7.598 nodos, 11.856 aristas | dato real | `figs/D5_mega.png` |
| D6 | «Métrica del cuerpo»: cercanía por esfuerzo de pendiente | desnivel real **306 m**; el «centro del cuerpo» dista **229 m** del «centro del flujo»; Jaccard cuerpo/plano **0.53** | **red REAL de Medellín + SRTM 30 m** (elevación real; función de Tobler) | dato real | `figs/D6_mega.png` |
| D7 | Umbral de intervención anti-segregación (Schelling con palanca) | vivienda **indiferente NO** rompe el sorting (0.87→0.95); vivienda **anclada/integrada** sí, umbral **~55 %** para bajar de 0.65 | Schelling 300² (tol 0.5), 2 palancas | sintética (compute-bound) | `figs/D7_mega.png` |
| D8 | Escala CIUDAD (radio 4 km): D5+D6 sobre red real mayor | **22.863 nodos**; desnivel **962 m**; prominencia **7.6×**; Jaccard métrica-decide-centro **0.08**; centro del cuerpo a **710 m** del flujo | **red REAL de Medellín (4 km) + SRTM** | dato real | `figs/D8_mega.png` |
| D9 | Robustez / significancia de D5 vs grafos nulos | prominencia real **9.76** vs nulos 2.73 → **z = 188** (estructura real, no artefacto); divergencia de métricas ≈ nulos (propiedad general) | red REAL D5 + 60 nulos degree-preserving | dato real | — |
| D10 | Juego de congestión (Wardrop/Braess) sobre la red vial real | **PoA = 1.03**; una **arista-Braess robusta** (cerrarla mejora el tiempo agregado **+1.37 %**; el resto 0.1–0.26 %, piso de ruido de Frank-Wolfe, gap 0.009) | **red REAL de Medellín (4 km): 22.863 nodos, 33.988 aristas**; demanda O-D **sintética** (300 zonas); BPR α=0.15 β=4 | sintético-sobre-red-real (demanda O-D sintética) | `figs/D10_mega.png` |
| D11 | Juego de localización de Hotelling (comercio informal) | el comercio informal **se aglomera**: aglomeración **2.3×** vs azar y **2.6×** vs el óptimo social (N=40); robusto en el barrido N=10–60 (2.1–3.9× vs óptimo); cobertura 41–63 % peor | **red REAL de Medellín: 7.598 nodos**; demanda ∝ densidad local | dato real (de red) | `figs/D11_mega.png` |
| D12 | Difusión / esparcimiento sobre el grafo real | footfall = campo **difuso** (top 1 % concentra 2.4 %; Spearman vs grado 0.47; vs elevación −0.04); isócronas de 15 min encogen **16 %** en el centro plano y **24 %** en la ladera | **red REAL de Medellín (22.863 nodos) + SRTM 30 m** | dato real (de red) | `figs/D12_mega.png` |
| D13 | Teoría de la decisión (minimax-regret) sobre la red real | las 4 centralidades rankean nodos casi disjuntos (**Jaccard medio 0.03**); el minimax-regret formal elige eigenvector por **patología** (0.965 en 200 nodos) → sin esa métrica, top_betweenness robusto (precio 0.12) y el portafolio mixto casi empata (0.13): **margen irreducible** | **red REAL de Medellín (22.863 nodos)**; 4 centralidades | dato real (de red) | `figs/D13_mega.png` |

---

## D1 — Zipf sobre 33.933 ciudades reales del mundo (eje ONTOLÓGICO)
Datos reales de **GeoNames** (todas las ciudades del mundo > 15.000 hab). El ajuste rango-tamaño
log-log da **q = 1.006** (≈1, ley de Zipf casi exacta), **R² = 0.984**; la estimación por máxima
verosimilitud (paquete `powerlaw`) da **α = 2.05**, consistente con q ≈ 1. Por país: **Colombia
q = 1.063** (319 ciudades, R² = 0.997), EE.UU. 0.79, India 0.94, Brasil 0.90. La jerarquía de
tamaños del sistema urbano emerge sin planificador central — a escala planetaria y por país.
**Nota de nivel:** Zipf es una regularidad del *sistema de ciudades* (ensemble inter-urbano), no
de una ciudad singular; evidencia auto-organización del sistema urbano, no la autoproducción de
una ciudad concreta.

## D2 — Ley de escala urbana sobre datos reales (eje ONTOLÓGICO) — NO circular
Indicador socioeconómico **real y medido**, no modelado: el número de **amenities** (POI)
mapeados en **OpenStreetMap** (`node[amenity]`, radio 2,5 km) de cada ciudad, regresado contra la
**población real** (GeoNames). Para controlar el sesgo de completitud de mapeo —muy desigual entre
países— la muestra se restringe a **ciudades europeas** (DE, FR, NL, AT, CH, BE, CZ, DK, SE, PL,
IT, ES, GB, PT), donde OSM es homogéneamente denso y el conteo es un proxy justo de la actividad.
La regresión log-log estima **β = 0.90** (IC 95 % 0.70–1.10; Theil–Sen robusto 0.82 (IC 0.60–1.00)),
**R² = 0.76**, sobre **26 ciudades**. El exponente se **estima del dato**, no se inyecta:
por eso la demostración **no es circular** (a diferencia de un indicador calibrado a β = 1.15). 
El exponente ≈0.90 corresponde al **régimen material/sublineal** de Bettencourt–West (economías de escala: la dotación de equipamientos crece algo menos que proporcionalmente a la población), si bien el IC incluye la linealidad; contrasta con la superlinealidad socioeconómica (β≈1.1–1.2 en PIB o patentes), que exige indicadores más ricos que un conteo de POI. Lo esencial: es un power-law **medido, no inyectado** —arreglada la circularidad de versiones
previas—: una regularidad de escala real que enlaza tamaño y dotación urbana sin planificador
central. Descarga secuencial y educada con caché en disco `ciencia/data/d2_osm_cache.json`
(reproducible sin volver a golpear la API); el ajuste sobre esa caché real está en
`ciencia/mega/D2_fit_from_cache.py`.

## D3 — Dimensión fractal de la forma urbana (eje ONTOLÓGICO)
Huella urbana **sintética** de **8192×8192 (67,1 M celdas)**: campo gaussiano correlacionado
umbralizado en su mediana (~50 % de ocupación; inspirado en la percolación correlacionada de
Makse–Havlin–Stanley, *Nature* 1995); mayor cúmulo: 22,8 M celdas. El box-counting sobre ~2,5
décadas de escala da **D = 1.910**, R² = 0.9996: dimensión **no-entera**, propia de una forma con
borde rugoso auto-similar. *Encuadre honesto (corregido 7-jul):* el umbral en la mediana deja al
sistema **por encima** del punto crítico de percolación, de modo que el cúmulo es denso y no
«incipiente»; el D medido queda entre el del cúmulo crítico 2D (91/48 ≈ 1.896) y el plano compacto
(2), y **no** debe citarse como verificación de universalidad crítica. Además las ciudades reales
miden D ≈ 1.7 y este es un modelo de conectividad, no una ciudad concreta: la demostración vale
como ilustración cualitativa de forma sin escala característica, nada más. **No se usa en el
ensayo**; queda aquí como material de la tesis de respaldo.

## D4 — Emergencia desde micro-reglas: Schelling a escala megaciudad (eje TÉCNICA)
Malla **8000×8000 = 64 millones de celdas (58,9 M agentes)**, vectorizada con convolución
(`scipy.ndimage`); el barrido de 5 tolerancias corrió en **465 s** (32 núcleos). Partiendo de una
mezcla aleatoria (índice 0.50), una preferencia local **leve** produce segregación global que
crece con la exigencia: tol 0.35 → 0.764; **tol 0.50 → 0.872**; tol 0.65 → 0.922. Fenómeno real de
**no-monotonía**: con intolerancia extrema (tol 0.80) el sistema no logra asentarse y la
segregación **baja a 0.55**. **Nadie diseñó la segregación**: emerge de reglas locales. Lectura
para el eje técnica: el cómputo **simula** la emergencia —produce el patrón— pero no la **vive**;
además, cada agente opera con una **función objetivo local** (fracción mínima de vecinos iguales),
lo que ilustra que el modelo *impone* la regla que luego "descubre". `procesar ≠ producir`.

## D5 — Red de calles REAL de Medellín: la métrica decide el centro (eje PODER)
Red peatonal **real** del centro de Medellín (La Candelaria) descargada de OpenStreetMap vía
osmnx: **7.598 nodos, 11.856 aristas**. Se calculan **tres** medidas de centralidad **exactas**
(sin muestreo): intermediación (**betweenness**), cercanía (**closeness**) y de vector propio
(**eigenvector**). Resultados:
- La betweenness concentra: el **5 % superior de nodos tiene 6,1×** la betweenness media
  (prominencia estructural emergente del eje); betweenness máx = 0.104.
- **La elección de la métrica decide quién es "central":** los conjuntos del 5 % más central son
  **casi disjuntos** entre métricas — Jaccard betweenness∩closeness = **0.10**,
  betweenness∩eigenvector = 0.04, closeness∩eigenvector = **0.00**— y el **nodo #1 más central es
  distinto en cada métrica** (tres ubicaciones diferentes del centro).
Lectura para el eje poder: computar la centralidad la **revela** pero no la **produce** —la vida
del corredor la hacen los cuerpos que lo caminan— y **quién elige la métrica decide** qué cuenta
como central. Ya no es una afirmación condicional: se **demuestra** con la misma red real bajo tres
métricas. Reemplaza el múltiplo «1.49×» de versiones previas, que provenía de un grafo estilizado
sintético (descartado).

## D6 — La «métrica del cuerpo»: la pendiente desplaza el centro (eje PODER / ONTOLÓGICO)
Extiende D5 con una métrica **encarnada**. Sobre la MISMA red peatonal real del centro de Medellín
(7.598 nodos), se descargó la **elevación real** de cada nodo (SRTM 30 m vía opentopodata; rango de
**306 m**: de 1.441 a 1.747 m s.n.m. — las laderas del centro) y se ponderó cada arista por el
**costo metabólico de caminar en pendiente** (función de Tobler, sobre grafo dirigido: subir cuesta
distinto que bajar). La cercanía (*closeness*) recalculada con ese costo define el «centro para el
cuerpo que sube», que **se aparta ~229 m** del «centro del flujo» (cercanía plana), y el 5 % de
nodos más centrales sólo coincide en un **53 %** (Jaccard 0.53) entre ambas métricas. Lectura: la
**fatiga fenomenológica** (el *Leib* que sube) reescribe la centralidad que la métrica topológica
declara neutral — y explica por qué Medellín inventó el **Metrocable**. Ya no es sólo que «la
métrica decide el centro» entre métricas de flujo (D5): al meter el cuerpo real, el centro se mueve.
Datos reales (OSM + SRTM); código `ciencia/mega/D6_pendiente.py`, caché `ciencia/data/d6_elev_cache.json`.

## D7 — Cuánta institución cuesta romper el sorting (eje TÉCNICA / PODER)
Extiende D4 con una **palanca de política** para responder empíricamente qué significa «cultivar lo
emergente». Malla 300², tolerancia fija 0.5 (la preferencia «leve»); se comparan dos intervenciones:
- **Vivienda indiferente** (agentes que satisfacen a cualquiera, tipo 3): **NO funciona** — la
  segregación no baja, incluso sube (0.873 → 0.945). Diluir densidad no rompe el sorting de A/B.
- **Vivienda anclada/integrada** (una fracción de residentes es fija y no se muda): **sí funciona**,
  de forma monótona (0.873 → 0.596), cruzando el umbral de mezcla (0.65) recién en **p ≈ 0.55**.
Lección honesta y sobria: la emergencia segregante es **terca**. No cualquier intervención la rompe
(refuta el «basta con mezclar»), y romperla exige un **compromiso estructural grande** (~55 % de
vivienda permanente-integrada) — lo que **refuta el laissez-faire hayekiano** (la mano invisible no
integra) sin caer en el voluntarismo. Cultivar = fijar condiciones fuertes + monitorear + intervenir
con umbral. Código `ciencia/mega/D7_intervencion.py`.

## D8 — Escala CIUDAD: la métrica y el cuerpo desplazan el centro en la Medellín real (eje PODER / ONTOLÓGICO)
D5 y D6 cubrían solo el centro histórico (radio 2 km, 7.598 nodos). D8 los repite sobre la red
peatonal real de **radio 4 km (22.863 nodos, 33.988 aristas)** — centro + primer anillo hacia las
laderas. Closeness exacta con `scipy.sparse.csgraph` (rápida); betweenness muestreada (k = 1500);
elevación real SRTM (caché `ciencia/data/d8_elev_cache.json`). Resultados:
- **Desnivel real 962 m** (vs 306 m del centro chico): a esta escala aparecen las laderas de verdad.
- **Prominencia del corredor 7.6×** la media (aún más marcada que el 6.1× del centro): el eje
  estructural es un rasgo robusto, no un artefacto del recorte.
- **La métrica decide el centro se sostiene a escala ciudad**: Jaccard betweenness∩closeness = **0.08**.
- **La métrica del cuerpo pesa MÁS lejos del centro plano**: el «centro del cuerpo» (esfuerzo/Tobler)
  dista **710 m** del «centro del flujo» (vs 229 m en el centro): a más pendiente, más se aparta la
  centralidad encarnada de la topológica. Es el fundamento cuantitativo del Metrocable. Código
  `ciencia/mega/D8_ciudad.py`.

## D9 — Robustez: ¿estructura real o artefacto? (significancia de D5)
Se compara la red real D5 contra un ensemble de **60 grafos nulos** con la misma secuencia de grados
(double-edge-swap, que preserva grados y **destruye** la geometría de calle); métricas topológicas
(sin peso) para una comparación limpia. Dos hallazgos, ambos honestos:
- **La prominencia del corredor es estructura real, no artefacto**: prominencia real **9.76** vs
  nulos **2.73 ± 0.04** → **z ≈ 188**, percentil 1.0. El eje emergente del centro es una propiedad
  del trazado real, no una consecuencia genérica de la distribución de grados.
- **La divergencia entre métricas es una propiedad GENERAL de las redes** (no un truco de Medellín):
  Jaccard(betweenness, closeness) real **0.226** vs nulos **0.192 ± 0.023** (~1.5 σ, prácticamente
  indistinguible). Consistente con citar D5 como *verificación local de un resultado conocido*
  (Crucitti et al., 2006): que la métrica decide el centro es robusto y general. Código
  `ciencia/mega/D9_robustez.py`.

## D10 — Juego de congestión (Wardrop/Braess) sobre la red vial real (eje TÉCNICA / PODER)
Sobre la red peatonal real de Medellín de radio 4 km (**22.863 nodos, 33.988 aristas**, la misma de
D8) usada como topología vial, se resuelve el **equilibrio de usuario** (cada viaje minimiza su
propio tiempo, Wardrop) y el **óptimo social** por **Frank-Wolfe**, con costo **BPR**
`t(f) = t0·(1 + α·(f/cap)^β)`, α = 0.15, β = 4 (valores estándar FHWA) y demanda O-D **sintética**
uniforme entre **300 zonas**. El **precio de la anarquía es PoA = 1.03**: el egoísmo de ruta cuesta
sólo ~3 % de tiempo agregado sobre el óptimo. El escaneo de la **paradoja de Braess** sobre las 30
aristas más cargadas encuentra **una arista-Braess robusta**: cerrarla mejora el tiempo total
agregado **+1.37 %** (arista en ~[6.2688, −75.5430]); las demás dan 0.1–0.26 %, que es el **piso de
ruido** de Frank-Wolfe (gap relativo 0.009). HONESTIDAD: la demanda es sintética, la red peatonal se
usa como topología vial y la capacidad es constante, de modo que las magnitudes son modestas; lo
**robusto** es el hallazgo cualitativo —existe efecto Braess: cerrar una calle puede mejorar el flujo
agregado—, no la cifra fina. Encuadre autopoiético: el óptimo del **todo** no es la suma de los
óptimos egoístas de las **partes** (Braess = **autonomía del todo sobre las partes**). Código
`ciencia/mega/D10_congestion.py`.

## D11 — Juego de localización de Hotelling: el comercio informal se aglomera (eje PODER / ONTOLÓGICO)
N vendedores informales eligen cada uno un nodo de la **red peatonal real** del centro de Medellín
(**7.598 nodos**, la de D5), con demanda proporcional a la **densidad local**; se comparan el
equilibrio de mejor-respuesta, el reparto **al azar** y el **óptimo social** de cobertura (p-mediana
greedy). Resultado: el comercio informal **se aglomera** —índice de aglomeración **2.3×** respecto
del azar y **2.6×** respecto del óptimo social (para N = 40)—, patrón **robusto** en todo el barrido
N = 10–60 (aglomeración vs óptimo entre **2.1× y 3.9×**); el precio es una cobertura **41–63 % peor**
que la óptima. HONESTIDAD: la mejor-respuesta **cicla** (no hay Nash puro; se fotografía una
oscilación estable), la demanda es un proxy de densidad y el modelo no incluye precios, arriendo ni
control policial. Encuadre autopoiético: el foco comercial es un orden que **se auto-organiza** desde
decisiones locales —**auto-organización**—, no un desorden que corregir (el apiñamiento de Junín como
equilibrio emergente). Código `ciencia/mega/D11_hotelling.py`.

## D12 — Difusión y esparcimiento sobre el grafo real (eje ONTOLÓGICO)
Sobre la red real de radio 4 km (**22.863 nodos**) + elevación SRTM 30 m se calcula el **footfall**
(distribución estacionaria de una caminata ponderada por el esfuerzo de Tobler) y las **isócronas de
15 min** (frente de difusión por Dijkstra en tiempo). El footfall sale como un **campo DIFUSO**, no
como hotspots: el top 1 % de nodos concentra apenas **2.4 %** de la masa, correlación de Spearman con
el grado **0.47** y **desacoplado** de la elevación (−0.04). La pendiente sí **encoge el alcance**: la
isócrona de 15 min pasa de 3.63 a 3.05 km² en el **centro plano** (**−16 %**) y de 1.45 a 1.10 km² en
la **ladera** (**−24 %**). HONESTIDAD: el footfall salió **difuso** (no dramático) y se reporta tal
cual; el hallazgo con filo es la **asimetría del alcance** por pendiente. Encuadre autopoiético: el
footfall es un **campo relacional** cerrado sobre la propia red —la ciudad como circulación que se
sostiene a sí misma, **clausura operacional**— y el terreno reescribe su alcance (acoplamiento con el
medio). Código `ciencia/mega/D12_difusion.py`.

## D13 — Teoría de la decisión (minimax-regret): el margen que ningún optimizador fija (eje PODER)
Sobre la misma red real (**22.863 nodos**) se toman **cuatro** medidas de centralidad (betweenness,
closeness, eigenvector, grado) y se pregunta, con **teoría de la decisión** formal, si existe un
portafolio de intervención **robusto** a la incertidumbre sobre cuál métrica importa. Las cuatro
rankean nodos **casi disjuntos** (**Jaccard medio 0.03**; eigenvector comparte 0 con las otras tres).
El **minimax-regret** formal elige eigenvector, pero **por una patología**: es hiper-localizada
(concentra 0.965 de su masa en 200 nodos), de modo que sobre las cuatro métricas **no** hay una
decisión robusta buena. Excluyendo esa métrica degenerada, **top_betweenness** es la robusta (precio
del regret 0.12) y el **portafolio mixto** casi empata (0.13). Lectura: hay un **margen irreducible**
que ningún optimizador fija —**decidir qué métrica importa es exterior a la optimización**—.
HONESTIDAD: el resultado formal «gana eigenvector» es un artefacto de la degeneración de esa métrica,
y así se reporta; lo sólido es el margen, no el ganador nominal. Encuadre autopoiético: ese resto no
optimizable es el **margen inmanente** donde la ciudad decide sobre sí misma, no un dato que la
técnica resuelva. Código `ciencia/mega/D13_decision.py`.
