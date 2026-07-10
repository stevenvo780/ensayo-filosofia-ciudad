# D13 — Teoría de la decisión (minimax-regret)

**¿Qué pregunta?** Si hay que priorizar qué esquinas intervenir pero no sabemos cuál medida de centralidad es 'la correcta', ¿existe una decisión robusta a esa incertidumbre, o decidir qué métrica importa queda irremediablemente fuera del cálculo?

**El algoritmo, paso a paso**
1. Sobre la misma red real de Medellín (22.863 nodos) se calculan cuatro medidas de centralidad: intermediación (betweenness), cercanía plana, vector propio (eigenvector) y cercanía encarnada por esfuerzo de Tobler.
2. Cada métrica define un ranking; se arman cinco portafolios de 200 nodos: el top-200 de cada métrica más un portafolio mixto (promedio normalizado de las cuatro).
3. Se trata cada métrica como un 'estado del mundo' posible (incertidumbre profunda: sin probabilidades) y se mide cuánta masa de cada métrica captura cada portafolio, normalizada contra el mejor posible para esa métrica.
4. El arrepentimiento (regret) de una decisión bajo una métrica es cuánto pierde frente al portafolio óptimo para esa métrica. Se resuelve el minimax-regret: elegir el portafolio cuyo peor arrepentimiento posible sea el menor.
5. Se diagnostica si alguna métrica es degenerada (colapsada en pocos nodos) y se repite el cálculo excluyéndola.

**Qué halló** Las cuatro métricas rankean nodos casi disjuntos (Jaccard medio 0,03; el eigenvector comparte 0 con las otras tres). El minimax-regret formal elige eigenvector, pero por una patología: es hiper-localizado (concentra 0,965 de su masa en 200 nodos). Sin esa métrica degenerada, top_betweenness es la robusta (precio del regret 0,12) y el portafolio mixto casi empata (0,13): queda un margen irreducible.

**Por qué importa** (puente autopoiético) Ese resto no optimizable es el margen inmanente donde la ciudad decide sobre sí misma: decidir qué métrica importa —medir intermediación y no cuidado, flujo y no arraigo— es exterior a la optimización, un acto político anterior al cálculo. Ningún criterio formal de robustez zanja la elección sin recaer en una patología, de modo que no hay un portafolio 'objetivamente correcto'. Cerrar la ciudad sobre una sola métrica es la autopoiesis cerrada del solucionismo; mantenerla abierta es devolver ese juicio de relevancia a quienes la habitan.

**Matiz honesto** El resultado formal 'gana eigenvector' es un artefacto de la degeneración de esa métrica, y así se reporta: lo sólido es el margen irreducible, no el ganador nominal. Con solo cuatro métricas y un presupuesto de 200 nodos, la demostración ilustra el argumento; no pretende ser un catálogo exhaustivo de centralidades.

---

*Ver la figura y el encuadre completo en la [tesis de respaldo](/tesis#d13). Resumen canónico con todos los matices en `ciencia/RESULTADOS.md`; código en `ciencia/mega/D13_mega.py`.*
