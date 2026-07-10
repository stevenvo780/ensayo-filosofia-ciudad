# Centralidad: la métrica decide el centro

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

---

*Ver la figura y el encuadre completo en la [tesis de respaldo](/tesis#d5). Resumen canónico con todos los matices en `ciencia/RESULTADOS.md`; código en `ciencia/mega/D5_mega.py`.*
