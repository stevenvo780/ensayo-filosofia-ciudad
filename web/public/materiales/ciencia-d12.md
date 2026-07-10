# D12 — Difusión / footfall e isócronas con pendiente

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

---

*Ver la figura y el encuadre completo en la [tesis de respaldo](/tesis#d12). Resumen canónico con todos los matices en `ciencia/RESULTADOS.md`; código en `ciencia/mega/D12_mega.py`.*
