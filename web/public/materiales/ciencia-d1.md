# Ley de Zipf — rango-tamaño urbano

**¿Qué pregunta?** Si nadie diseña el sistema urbano, ¿emerge un orden en los tamaños de las ciudades del mundo, o es caos?

**El algoritmo, paso a paso**
1. Descarga todas las ciudades del mundo > 15.000 hab (GeoNames): **33.933 ciudades**.
2. Ordena por tamaño: la más grande en rango 1, la segunda en rango 2, etc.
3. En escala logarítmica, traza rango (eje x) vs población (eje y): log(rango) × log(población).
4. Ajusta una recta: la pendiente da el exponente Zipf (q). Una recta perfecta = ley exacta.
5. Comprueba por país: Colombia (319 ciudades), EE.UU., India, Brasil — ¿la ley se sostiene localmente?

**Qué halló**
El ajuste mundial da **q = 1.006** (casi exactamente 1, que es la ley de Zipf pura), **R² = 0.984** (bondad de ajuste muy alta). Estimación por máxima verosimilitud: α = 2.05. En Colombia particularmente: **q = 1.063** (**R² = 0.997** — ajuste aún más perfecto sobre 319 ciudades). La jerarquía de tamaños es robusto a escala mundial y nacional: ningún gobernador decretó que Bogotá fuera 2.5 veces más grande que Medellín; el sistema urbano lo emergió.

**Por qué importa**
Zipf es la cara empírica de una ciudad que se *autoproduce* sin comando central (eje ontológico). Si cada ciudad creciera al azar o por planificación independiente, los tamaños serían caóticos; en cambio, el patrón ordena el sistema urbano completo. Pero cuidado: la computadora lo mide e identifica el exponente, pero no *vivencia* por qué una ciudad elige crecer. El cómputo procesa el patrón; la decisión de dónde vivir es irreductiblemente encarnada. La ciudad es abierta: ciudades nuevas nacen, otras mueren — Zipf no agota esa dinámica, sólo su régimen estable.

**Matiz honesto**
Zipf y la escala son regularidades del *sistema de ciudades* (el ensemble inter-urbano), no de una ciudad singular. Además, el exponente varía por país (US 0.79, India 0.94, Brasil 0.90) y períodos históricos: Zipf describe una tendencia, no una ley de naturaleza inmutable.

---

*Ver la figura y el encuadre completo en la [tesis de respaldo](/tesis#d1). Resumen canónico con todos los matices en `ciencia/RESULTADOS.md`; código en `ciencia/mega/D1_mega.py`.*
