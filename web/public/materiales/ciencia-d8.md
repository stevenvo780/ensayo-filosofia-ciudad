# Escala ciudad: la métrica y el cuerpo desplazan el centro a 4 km

**¿Qué pregunta?** ¿Valen los hallazgos del centro histórico (D5, D6) cuando tomas la ciudad entera? ¿Se intensifican o desaparecen?

**El algoritmo, paso a paso**
1. Tomar la red peatonal real de Medellín, pero ahora radio 4 km (no 2): **22.863 nodos, 33.988 aristas**. Incluye el centro + el primer anillo hacia las laderas de verdad.
2. Calcular la **betweenness muestreada** (porque con 22 mil nodos es computacionalmente pesada; k = 1500 muestras) y la **closeness exacta** (es más rápida con `scipy.sparse`).
3. Descargar la elevación real (SRTM) para toda la zona: ahora el rango es **962 metros** (mucho más que los 306 del centro).
4. Recalcular las centralidades, igual que en D6, con la función de Tobler.
5. Comparar: ¿qué cambió respecto al centro histórico?

**Qué halló**
- **Desnivel real: 962 metros** (vs. 306 en el centro chico). Las laderas ahora son imposibles de ignorar.
- **Prominencia del corredor: 7,6×** la media (vs. 6,1× en el centro). La estructura es **más** centralizada a escala ciudad.
- **La métrica sigue decidiendo el centro**: Jaccard(betweenness, closeness) = **0,08** (vs. 0,10 en el centro). Incluso con más datos, la diversidad de métricas persiste.
- **El «centro del cuerpo» dista 710 metros del «centro del flujo»** (vs. 229 en el centro chico). El desplazamiento se **multiplica por tres**.
- **Datos reales**: OSM (22.863 nodos confirmados) + SRTM (elevación verificable).

**Por qué importa**
Esta es la prueba de que el hallazgo del centro histórico no era un artefacto del recorte. A escala ciudad, la pendiente pesa aún más. El «centro» geográfico declarado por la métrica plana se aleja cada vez más del «centro» vivido. Y es por eso que la ciudad inventó infraestructuras como el Metrocable: porque reconoció —sin necesidad de cómputo— que el territorio real hablaba en laderas, no en conectividad de peatones. La autopoiesis de la ciudad **incorpora el terreno**: no es una red abstracta, es una red **encarnada** donde la gravedad y la fatiga reescriben el «centro» cada vez que subís la escala. La computación, si ignora eso, produce un mapa que es falso no porque los datos sean malos, sino porque oculta la experiencia humana en la que el mapa debe funcionar.

**Matiz honesto**
La betweenness es muestreada (k=1500), no exacta; la elevación tiene resolución 30 m; y el alcance de 4 km es arbitrario (¿por qué no 2 o 6?). Pero el mensaje es claro: conforme crece la escala, la asimetría entre métrica plana y métrica encarnada no desaparece, se agudiza. Y eso es lo que importa: la ignorancia de la pendiente no es un error marginal, es un error estructural que crece.

---

*Ver la figura y el encuadre completo en la [tesis de respaldo](/tesis#d8). Resumen canónico con todos los matices en `ciencia/RESULTADOS.md`; código en `ciencia/mega/D8_mega.py`.*
