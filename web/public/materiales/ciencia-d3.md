# Dimensión fractal — la forma sin escala característica

**¿Qué pregunta?** ¿La forma de una ciudad mantiene patrones similares cuando aumentas zoom, o existe una escala característica que define la trama?

**El algoritmo, paso a paso**
1. Genera una huella urbana sintética de **8192×8192 píxeles** (67,1 millones de celdas) usando ruido gaussiano correlacionado (suavizado) — emula el crecimiento urbano.
2. Umbraliza el ruido en su mediana (~50% ocupado) — emula la densidad urbana típica.
3. Identifica el mayor componente conexo (celdas contiguas ocupadas): **22,8 millones de celdas**.
4. Box-counting: divide la forma en cajas de tamaño s = 4, 8, 16, 32, 64, 128, 256, 512, 1024 píxeles. Para cada tamaño, cuenta cuántas cajas contienen al menos una celda urbana.
5. En escala log-log, ajusta una recta. La pendiente en valor absoluto es la **dimensión fractal D**.

**Qué halló**
**D = 1.910** (**R² = 0.9996** — ajuste prácticamente perfecto). Número no-entero: la forma es más complicada que una línea (D=1) pero menos densa que un plano (D=2). Comparación: cúmulo crítico 2D teórico ≈ 1.896; ciudades reales miden D ≈ 1.7.

**Por qué importa**
Una forma fractal no tiene escala característica: si aumentas zoom en una manzana, ves estructuras similares. Esto es la cara ontológica de una ciudad que crece sin blueprint central (eje ontológico). El cómputo mide esa auto-semejanza pero no *experimenta* la incomodidad del peatón ante manzanas grandes o pequeñas. Nuevamente, el proceso es abierto: ciudades reales miden D ≈ 1.7, no 1.91 — intervenciones políticas quiebran la auto-similitud.

**Matiz honesto**
El umbral se fija en la mediana, de modo que el cúmulo es *denso* y no "incipiente". Las ciudades reales miden D ≈ 1.7: esta demostración vale como ilustración cualitativa, no como verificación de universalidad crítica. No se usa en el ensayo principal; queda como material de respaldo de la tesis.

---

*Ver la figura y el encuadre completo en la [tesis de respaldo](/tesis#d3). Resumen canónico con todos los matices en `ciencia/RESULTADOS.md`; código en `ciencia/mega/D3_mega.py`.*
