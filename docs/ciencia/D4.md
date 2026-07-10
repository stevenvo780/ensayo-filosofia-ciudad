# Segregación de Schelling — cómo emerge sin decreto

**¿Qué pregunta?** ¿Preferencias locales leves ("quiero un poco más de gente como yo") desembocan inexorablemente en segregación masiva?

**El algoritmo, paso a paso**
1. Crea una malla de **8000×8000 celdas** (64 millones de celdas, 58,9 millones de agentes: tipo A, tipo B, o vacío).
2. Llena aleatoriamente: 50% A, 50% B, 8% vacío — mezcla homogénea inicial (índice de segregación 0.50).
3. Define regla local: cada agente necesita que *al menos* una fracción mínima (tolerancia) de sus 8 vecinos sea del mismo tipo.
4. En cada paso: identifica agentes infelices, los mezcla aleatoriamente, traslada a un vacío (vectorizado con convolución).
5. Repite hasta que nadie sea infeliz o alcanza máximo de pasos. Mide segregación final.
6. Barre tolerancias: 0.20, 0.35, **0.50**, 0.65, 0.80.

**Qué halló**
A tolerancia 0.50 (leve preferencia): segregación emerge de 0.50 (aleatorio) a **0.872** (muy segregado). El patrón crece con la exigencia: tol 0.35 → 0.764; tol 0.65 → 0.922. Pero fenómeno real: con intolerancia extrema (0.80) el sistema *no* logra asentarse y segregación desciende a **0.55** (no-monotonía). Convergencia en **465 segundos** sobre 32 núcleos.

**Por qué importa**
La segregación emerge de reglas micros sin que nadie la decrete (eje de la técnica). Cada agente sigue lógica local egoísta, y el resultado agregado es un orden global indeseado. Pero el cómputo *simula* la emergencia sin *vivirla*: los agentes no sienten incomodidad ni negocian. Aquí el matiz honesto es crítico: el modelo *impone* la función objetivo ("fracción mínima de vecinos iguales") como regla previa — de modo que el programa no descubre la segregación sino que la genera a partir del supuesto ya inscrito.

**Matiz honesto**
La segregación emergente no es "espontánea": cada agente tiene inscrita una función objetivo de preferencia local. El modelo produce el patrón según esa regla, no lo descubre en datos reales. Además, la vida urbana real es vastamente más rica: precios, parentesco, étnica, economía informal, temporalidad. Lo robusto es el hallazgo cualitativo: preferencias leves engendran segregación global. Pero la verdad empírica de una ciudad segregada exige análisis situado de poder, no sólo simulación.

---

*Ver la figura y el encuadre completo en la [tesis de respaldo](/tesis#d4). Resumen canónico con todos los matices en `ciencia/RESULTADOS.md`; código en `ciencia/mega/D4_mega.py`.*
