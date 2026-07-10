# Ley de escala Bettencourt–West — de verdad en los datos

**¿Qué pregunta?** Si la ciudad crece, ¿sus servicios crecen proporcionalmente o de modo más eficiente? La teoría predice economías de escala, pero ¿qué dicen los datos reales?

**El algoritmo, paso a paso**
1. Toma población real de cada ciudad (GeoNames): dato 1, N = población.
2. Descarga todos los puntos de interés (POI: tiendas, escuelas, hospitales, parques) mapeados en OpenStreetMap dentro de radio 2,5 km: dato 2, Y = cantidad de amenities.
3. Restringe a ciudades europeas (**26 ciudades**: Alemania, Francia, Países Bajos, Austria, Suiza, Bélgica, Rep. Checa, Dinamarca, Suecia, Polonia, Italia, España, Reino Unido, Portugal) donde el mapeo OSM es uniforme.
4. En escala log-log, traza población (eje x) vs amenities (eje y). Ajusta una recta: **β = pendiente**.
5. Si β = 1: proporcional. Si β < 1: economías de escala. Si β > 1: deseconomías.

**Qué halló**
**β = 0.90** (intervalo de confianza 95%: 0.70–1.10), **R² = 0.76**, sobre **26 ciudades**. El exponente se *estima del dato*, no se inyecta: a diferencia de trabajos previos que calibraban un indicador a β = 1.15, acá el algoritmo descubre β en los datos crudos. El intervalo incluye la linealidad (1.0) pero apunta hacia sub-linealidad leve (0.90): la ciudad grande es *algo* más económica. Robustez: estimador de pendiente robusto (Theil–Sen) da 0.82 (IC 0.60–1.00).

**Por qué importa**
La escala urbana es emergencia sin diseño central (eje ontológico). Si β = 0.90 en datos reales, sugiere que el sistema urbano ya *cultiva* economías de escala, pero parcialmente — la vida de la ciudad no es 100% optimizable. El cómputo identifica la regularidad pero no *produce* la decisión de dónde invertir servicios: esa es decisión política inmanente (§3).

**Matiz honesto**
La muestra es pequeña (n=26) y restringida a Europa; el radio fijo trunca a megaurbes; OSM sigue siendo proxy, no medida directa. El intervalo de confianza ancho (0.70–1.10) incluye desde sub-linealidad fuerte hasta linealidad. Lo importante es que existe una regularidad de escala real y *estimada* del dato, no fabricada.

---

*Ver la figura y el encuadre completo en la [tesis de respaldo](/tesis#d2). Resumen canónico con todos los matices en `ciencia/RESULTADOS.md`; código en `ciencia/mega/D2_mega.py`.*
