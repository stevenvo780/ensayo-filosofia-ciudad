# Robustez: ¿estructura real o artefacto?

**¿Qué pregunta?** El hallazgo de D5 (un corredor prominente en Medellín) ¿es una característica real de cómo está trazada la ciudad, o es un artefacto — algo que aparecería en casi cualquier red con la misma densidad de nodos?

**El algoritmo, paso a paso**
1. Tomar la red real de Medellín del centro (D5: 7.598 nodos, 11.856 aristas).
2. Generar 60 **grafos nulos** que conservan exactamente el mismo número de conexiones por nodo (su «grado»), pero **destrozan la geometría**: son redes ficticias que tienen la misma «firma» topológica (cada cruce conecta al mismo número de calles) pero están conectadas de forma aleatoria. Técnica: double-edge-swap.
3. Calcular la prominencia (cuántas veces el corredor más importante supera la media) en la red real y en los 60 nulos.
4. Comparar: ¿la prominencia real es anómala?

**Qué halló**
- **Prominencia real: 9,76×** la media.
- **Prominencia en nulos: 2,73 ± 0,04×** (la media de los 60 nulos, con variabilidad muy baja).
- **z-score: ≈ 188** (es decir, **188 desviaciones estándar** por encima de lo esperado por azar).
- **Percentil: 1,0** (la red real está en el extremo del extremo).
- **Segunda conclusión (honesta)**: la divergencia entre métricas (que diferentes centralidades señalen nodos distintos) **es una propiedad general** de las redes. Jaccard real (0,226) vs. nulos (0,192 ± 0,023) — diferencia de solo ~1,5 desviaciones estándar. Es decir, que la métrica «decida el centro» no es idiosincrasia de Medellín.

**Por qué importa**
Esta demostración separa lo **real** de lo **circunstancial**. D5 decía: «la métrica decide quién es central». Eso es verdad, pero ¿era verdad de Medellín específicamente, o de cualquier red? D9 responde: cualquier red tiene divergencia entre métricas (propiedad general). Pero la **prominencia** de un corredor en Medellín **es real** — no aparecería en una red ficción con la misma conexión. Esto significa que Medellín tiene una **estructura genuina**, no aleatoria: el trazado histórico de sus calles creó un corredor cuya importancia no es accidental. Políticamente: existe una realidad urbana que precede a nuestra elección de métrica. La métrica elige **cuál de esas realidades revelar**, pero no las inventa. La autopoiesis aquí es: la ciudad se autoproduce con una estructura (real, medible, no aleatoria), pero ese orden es leído de múltiples formas según la pregunta que hagas (la métrica). Ninguna métrica es neutra, pero tampoco todas son igualmente reveladoras; la responsabilidad está en saber cuál pregunta haces.

**Matiz honesto**
Los 60 nulos preservan grados pero destruyen toda geometría; es un test conservador: si la red real fuera **completamente aleatoria sujeto a grados**, parecería igual a los nulos. Que sea tan diferente (z=188) es fuerte. Pero el recíproco no es obvio: ¿existe una única «estructura verdadera», o el trazado de Medellín es tan complejo que diferentes métricas revelan facetas legítimas? El z-score dice que algo es estructura, no ruido. La pregunta de qué significa esa estructura para la ciudad es filosofía, no estadística. D9 resuelve la pregunta técnica (¿es real?) pero deja abierta la política (¿qué significa?). Eso es lo honesto.

---

*Ver la figura y el encuadre completo en la [tesis de respaldo](/tesis#d9). Resumen canónico con todos los matices en `ciencia/RESULTADOS.md`; código en `ciencia/mega/D9_mega.py`.*
