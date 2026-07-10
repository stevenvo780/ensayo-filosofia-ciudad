# Ciencia de redes — centralidad y difusión sobre el grafo real

La ciudad como **red**: nodos (esquinas) y aristas (calles). Dos experimentos miden cómo la métrica elegida decide qué es «central» y cómo el cuerpo —la pendiente— reescribe el alcance de lo caminable.


## Centralidad: la métrica decide el centro

**¿Qué pregunta?** La ciudad tiene un "corazón" físico — calles que conectan todo. Pero si tres formas de medir centralidad señalan nodos casi disjuntos, ¿cuál es el centro verdadero? ¿O la métrica lo *construye* en lugar de descubrirlo?

**El algoritmo, paso a paso**
1. Descarga la red peatonal real del centro histórico de Medellín (La Candelaria) desde OpenStreetMap: **7.598 nodos, 11.856 aristas**. Cada nodo es una intersección; cada arista es un tramo peatonal.
2. Calcula **tres medidas de centralidad exactas** (sin muestreo):
   - **Betweenness**: ¿cuántos caminos mínimos pasan por este nodo? (intermediación: flujo agregado).
   - **Closeness**: ¿cuán próximo está este nodo en promedio a todos los demás? (accesibilidad: distancia media).
   - **Eigenvector**: ¿está conectado a otros nodos centrales? (importancia recursiva).
3. Para cada métrica, identifica el top 5% de nodos más centrales (~380 nodos).
4. Calcula Jaccard (solapamiento): cuántos nodos del top 5% en betweenness también están en closeness, etc. (Jaccard = intersección / unión, rango 0–1).
5. Identifica el nodo #1 bajo cada métrica: ¿es el mismo nodo o tres ubicaciones distintas?

**Qué halló**
El **5% superior por betweenness concentra 6,1 veces la betweenness media** (prominencia: un eje peatonal destaca claramente). Pero los tres tops son casi disjuntos:
- Jaccard betweenness ∩ closeness = **0.10** (90% distintos).
- Jaccard betweenness ∩ eigenvector = **0.04** (96% distintos).
- Jaccard closeness ∩ eigenvector = **0.00** (100% disjuntos).

Más aún, el **nodo #1 más central es uno distinto bajo cada métrica** — tres ubicaciones del "centro" en la misma red. Betweenness máx = **0.104**.

**Por qué importa**
Este hallazgo toca el corazón de la relación entre poder y métrica (eje del poder, §3). La centralidad no es una propiedad que el cómputo descubra: es una propiedad que *construye* al elegir cómo medirla. El corredor Junín–San Antonio puede ser "central" (muchos pasan por ahí, betweenness) o "periférico" (gente en promedio lejos, closeness) — ambas son verdaderas formalmente. Pero la elección del planificador de cuál métrica usar redefine dónde invierte, controla, vigila. Quién elige la métrica decide qué cuenta como central, y esa decisión es política, no técnica. El cómputo revela cómo funciona la métrica, pero no produce la decisión de qué importa: eso permanece en manos de quien habita y disputa la ciudad.

**Matiz honesto**
La divergencia entre métricas es una propiedad general de las redes (Crucitti et al., 2006), no un truco de Medellín. Pero que sea general no la hace neutral: confirma que el poder de nombrar el centro está inscrito en la métrica, sea cual sea la red.

## D12 — Difusión / footfall e isócronas con pendiente

**¿Qué pregunta?** ¿Cómo se esparce el tránsito peatonal por la ciudad real —en focos concentrados o como un campo difuso— y cuánto encoge el terreno en pendiente el radio que un cuerpo puede caminar en 15 minutos?

**El algoritmo, paso a paso**
1. Se toma la red peatonal real de Medellín (radio 4 km, 22.863 nodos) con la elevación real de cada nodo (SRTM 30 m).
2. Cada arista recibe un tiempo según el esfuerzo de caminar en pendiente (función de Tobler, dirigida: subir cuesta más que bajar).
3. Footfall: se simula una caminata que prefiere las aristas más baratas en tiempo y se calcula su distribución estacionaria (tipo PageRank, α=0,85); eso predice el tránsito relativo por nodo. Se contrasta con el footfall trivial (proporcional al grado del nodo).
4. Isócronas: desde una semilla en el centro plano y otra en la ladera, se propaga un frente de Dijkstra en tiempo hasta los 900 s (15 min), una vez ignorando la pendiente (velocidad constante) y otra con la pendiente real de Tobler.
5. Se mide qué área alcanza cada frente y cuánto la encoge la pendiente.

**Qué halló** El footfall sale como un campo difuso, no en hotspots: el top 1% de nodos concentra apenas 2,4% de la masa, correlación de Spearman con el grado 0,47 y desacoplado de la elevación (−0,04). La pendiente sí encoge el alcance: la isócrona de 15 min pasa de 3,63 a 3,05 km² en el centro plano (−16%) y de 1,45 a 1,10 km² en la ladera (−24%).

**Por qué importa** (puente autopoiético) El footfall es un campo relacional cerrado sobre la propia red: la ciudad como circulación que se sostiene a sí misma —clausura operacional—, y el terreno reescribe su alcance (acoplamiento estructural con el medio). La métrica plana daba por neutral un radio que el cuerpo que sube no tiene: la ladera de Medellín pierde casi un cuarto de su alcance a pie, y eso —no una optimización abstracta— es el fundamento fenomenológico del Metrocable. El cómputo describe el campo; la fatiga del cuerpo que lo habita es lo que ninguna caminata simulada vive.

**Matiz honesto** El footfall salió difuso, no dramático, y se reporta tal cual: no hay un mapa de focos espectaculares. El hallazgo con filo es la asimetría del alcance por pendiente, no la concentración del tránsito.
