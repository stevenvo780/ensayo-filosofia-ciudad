# La métrica del cuerpo: la pendiente desplaza el centro

**¿Qué pregunta?** ¿Cambia quién es «central» en la ciudad cuando medimos no solo distancia de calles, sino el esfuerzo real de caminar en pendiente?

**El algoritmo, paso a paso**
1. Tomar la red peatonal real del centro de Medellín (los mismos 7.598 nodos del análisis anterior).
2. Descargar la elevación real de cada cruce de calle (SRTM, mapas de terreno de satélite, resolución 30 metros).
3. Para cada arista (calle), calcular el costo de caminarla no en metros, sino en **esfuerzo fisiológico**. Usar la función de Tobler: la velocidad de marcha depende de si vas subiendo o bajando. Subir es más lento que bajar, y caminar plano es lo óptimo.
4. Recalcular la centralidad de cercanía (*closeness*) —el inverso de la distancia promedio— pero usando **tiempo/esfuerzo** en lugar de metros rectos.
5. Comparar: ¿quiénes son los **5 % más centrales** en el gráfico plano vs. en el gráfico del esfuerzo? ¿Se desplazan los centros?

**Qué halló**
- El desnivel real del centro es **306 metros**: desde 1.441 a 1.747 m sobre el nivel del mar.
- El «centro del cuerpo» (donde se llega más fácil, considerando fatiga) dista **229 metros** del «centro del flujo» (donde llega la métrica plana).
- Los 5 % de nodos más centrales sólo coinciden en un **53 %** entre ambas métricas (Jaccard 0,53): la mitad de las cruces centrales en un mundo son secundarias en el otro.
- **Datos reales**: OSM + SRTM (elevación verificable por satélite).

**Por qué importa**
Esta es la denuncia silenciosa de Medellín. La métrica plana declara un corredor central porque conecta muchas rutas; pero quien sube ese corredor cada día sabe que el corazón de la ciudad se mueve. El «centro del cuerpo» no es un capricho: es la vivencia de quien habita. Aquí se funde lo autopoiético con lo encarnado: la ciudad se autoproduce (el patrón de centralidad) pero esa autoproducción es vivida por cuerpos que sufren, por lo que no es **abierta** si la métrica que la mide ignora la fatiga. La pendiente es la razón por la que Medellín inventó el **Metrocable**: reconocer que el «centro» administrativo no era el centro experimentado. La computación revela la estructura; la fenomenología muestra que esa estructura no es neutra para quien la camina.

**Matiz honesto**
La función de Tobler es un modelo aproximado de marcha (no todos los cuerpos la sienten igual; la edad, la salud, el peso del equipaje cambian los exponentes). La elevación se estima a 30 metros, no es medida en cada paso. Y el «centro del cuerpo» es una agregación: pone peso en cercanía, no en confort, densidad o significado. Pero eso no invalida el hallazgo: la métrica plana **elige ignorar** la fatiga, una ignorancia que no es técnica sino política. La honestidad está en reconocerlo.

---

*Ver la figura y el encuadre completo en la [tesis de respaldo](/tesis#d6). Resumen canónico con todos los matices en `ciencia/RESULTADOS.md`; código en `ciencia/mega/D6_mega.py`.*
