# Crítica profunda — Ensayo Final «Filosofía de la Ciudad»

> ✅ **ESTADO: CORREGIDO (6-jul-2026).** Todos los defectos P0/P1 y la mayoría de los P2 de esta
> crítica fueron aplicados a `ensayo/00_ensayo.md`, y las cinco simulaciones se elevaron y
> volvieron reproducibles con datos reales donde era posible (D2 dejó de ser circular; D5 usa la
> red real de Medellín con tres métricas exactas). Este documento se conserva como **registro
> histórico** de la evaluación, no como estado actual del ensayo. Detalle de los cambios al final.

> **Documento evaluado:** `ensayo/00_ensayo.md` (versión de trabajo, sin commitear; 257 inserciones sobre el último commit).
> **Extensión medida:** 7.919 palabras totales · 7.139 de cuerpo (sin bibliografía ni apéndice).
> **Rúbrica de referencia:** `CONSIGNA.md` (40 % = 4 bloques de 10 %: cohesión + ideas propias · eje ontológico · eje técnica · eje poder). Entrega: **10-jul-2026**.
> **Método de esta crítica:** 6 lentes de lectura independientes (un experto por eje de la rúbrica + auditoría forense de consistencia + auditoría de extensión/formato), seguidas de **verificación adversarial** de cada defecto crítico/mayor por un panel de 3 evaluadores (Opus + Gemini + MiniMax) que primero construían la *mejor defensa posible* del ensayo antes de dictaminar. **Las 36 debilidades crítico/mayor que se listan aquí sobrevivieron esa verificación (36/36).**

---

## 1. Veredicto ejecutivo

El ensayo es, en el fondo, **un trabajo de nivel alto**: tiene una tesis rectora nítida y sostenida (*la IA procesa información urbana pero no produce conocimiento de la ciudad; el límite es categorial, no de potencia*), ideas genuinamente propias (el experimento T1–T6, el Banco Epistémico Urbano, la «ironía performativa») y un manejo competente de tres tradiciones (fenomenología, filosofía de la técnica, filosofía política del espacio). Está por encima del promedio de un ensayo de pregrado.

Pero está **lastrado por un defecto de ensamblaje que, tal como se entregaría hoy, un profesor atento detecta en la primera lectura de corrido y penaliza con dureza**: el documento se contradice a sí mismo en *todas* sus cifras científicas titulares. El cuerpo (§1 ontológico, §3 poder) usa una versión de los resultados y la síntesis + conclusiones + apéndice usan otra, incompatible, para las mismas cinco demostraciones. Es un «cerebro escindido» (*split-brain*) producto de un refactor a medio terminar: la última edición actualizó los ejes a los datos nuevos («mega») pero **no propagó el cambio a §4, §5 ni al apéndice**, que siguen con los datos viejos («chico»).

**Diagnóstico de una frase:** el contenido merece ~8/10; el *estado de entrega* lo baja a ~7/10 por defectos de consistencia y proofreading que son **triviales de corregir pero descalificantes si se dejan**. La buena noticia: casi todo lo grave es mecánico, no conceptual. Con medio día de trabajo dirigido (§6 de esta crítica), el ensayo sube a ~9/10.

### Nota estimada por bloque de la rúbrica

| Bloque (10 % c/u) | Como está hoy | Techo alcanzable tras corregir | Qué lo frena |
|---|---|---|---|
| **Cohesión + hilo + ideas propias** | ~6.5–7 / 10 | ~9 / 10 | La contradicción numérica golpea de lleno «cohesión **total**»; citas flotantes y bibliografía descuadrada bajan «manejo de autores». |
| **Eje ontológico** | **8.0 / 10** | ~9 / 10 | Autopoiesis afirmada pero nunca «cobrada»; respuesta al gradualismo por reafirmación; contradicción numérica en su columna empírica. |
| **Eje técnica** | **7.5 / 10** | ~9 / 10 | Circularidad del experimento; «sorpresa» Opus<Sonnet que es ruido elevado a tesis; un error factual; transición final rota. |
| **Eje poder** | **7.2 / 10** | ~8.5 / 10 | Caso Junín decorativo; aparato M₃/matriz de colapso sin definir; economía política de una frase por autor; base empírica prestada. |
| **Global estimado** | **≈ 29–30 / 40 (7.3–7.5)** | **≈ 35–36 / 40 (8.7–9)** | |

*(Notas mías, no de la profesora; sirven para priorizar el arreglo, no para predecir la calificación real.)*

---

## 2. Cumplimiento del criterio de LONGITUD (análisis dedicado)

**Conclusión: la extensión es adecuada y defendible; el problema no es el cuánto, sino el acabado.** Detalle:

### 2.1. No hay una extensión oficial fijada — y eso es un riesgo a cerrar
`CONSIGNA.md` **no especifica número de páginas ni de palabras**; el `README.md` registra la extensión como *«duda abierta a confirmar con la profesora»*. Esto es en sí mismo un punto a resolver **antes** del 10-jul: conviene un correo breve a Carolina confirmando extensión y formato esperados. Un ensayo puede estar excelente y perder puntos por no ajustarse a un límite no escrito.

### 2.2. Medición objetiva

| Sección | Palabras | % del cuerpo |
|---|---:|---:|
| Preámbulo (tesis + hilo + nota metodológica) | 241 | 3.4 % |
| §0 Introducción | 1.133 | 15.9 % |
| §1 Eje ontológico | 1.381 | 19.3 % |
| §2 Eje técnica | 1.449 | 20.3 % |
| §3 Eje poder | 1.431 | 20.0 % |
| §4 Síntesis (Banco) | 1.256 | 17.6 % |
| §5 Conclusiones | 248 | 3.5 % |
| **Cuerpo (subtotal)** | **7.139** | **100 %** |
| Apéndice | 163 | — |
| Bibliografía | 617 | — |
| **Total documento** | **7.919** | — |

Equivalencias: **7.139 palabras de cuerpo ≈ 26 páginas a doble espacio** (~275 palabras/pág.) o **≈ 13 páginas a espacio simple** (~550/pág.). Para un ensayo final que vale el 40 % y que sintetiza un semestre, es una extensión **sustancial y razonable** (rango típico 5.000–8.000 palabras): **ni corta ni inflada**. El aparato empírico propio justifica el volumen.

### 2.3. Balance interno entre ejes: **sobresaliente**
Los tres ejes que la rúbrica pesa por igual (10 % c/u) están casi perfectamente equilibrados: **1.381 / 1.449 / 1.431** palabras (dispersión < 6 %). Ningún eje canibaliza a otro; el reparto honra literalmente la rúbrica. Este es uno de los aciertos silenciosos del ensayo.

### 2.4. Dónde la longitud sí falla (defectos de distribución, no de cantidad)
- **Introducción sobredimensionada y duplicativa (~16 % del cuerpo).** §0 no introduce: *pre-ejecuta* el ensayo entero con subtítulos que calcan el cuerpo («Tres ejes», «Idea propia», «Caso de estudio») y recicla citas *verbatim*. **Atenuante real:** la consigna (correo 17-jun) exige presentar oralmente **la introducción sola** en ≤10 min, lo que justifica un §0 autocontenido de ~1.100 palabras (se lee en ~8–9 min). Pero eso **no** justifica el reciclaje literal de citas ni anticipar el caso Junín y la idea propia con tanto detalle que luego se repiten.
- **Conclusiones cortas y solapadas (§5 = 248 palabras).** No es que queden «cortas» por flojas: es que **§4 ya cierra el ensayo** (termina en «Aplicar antes que escalar. Fragmentar antes que optimizar.») y **§5 repite el mismo eslogan y los mismos tres ejes**. Hay **doble cierre**. Conviene fundir §4+§5 o diferenciarlos netamente (§4 = propuesta del Banco; §5 = recapitulación breve que aporte algo nuevo).
- **Repetición de citas-ancla.** «La eficiencia funcional de un corredor… no garantiza… su habitabilidad fenomenológica» aparece **4 veces** (l. 58, 75, 137, 166); «La ciudad no es solamente una estructura física…» **3 veces** (l. 34, 69, 127). Cada cita-ancla debería usarse **una vez** con fuerza y aludirse después sin repetirla.

### 2.5. Formato y convenciones (penalizable en una entrega universitaria)
- **Numeración de subsecciones rota:** el eje ontológico se titula «## 1.» pero sus subsecciones son **2.1, 2.2, 2.3, 2.4** (residuo de cuando era §2 en las fuentes modulares). Además es asimétrica: solo el ontológico tiene subsecciones numeradas.
- **Figuras como marcadores de texto crudo** («[Figura: ciencia/figs/D1_mega.png]») en el cuerpo, sin numeración («Figura 1…5»), sin pies ni fuente, y solo renderizadas en el apéndice (con la versión *chica*). Rutas relativas `../ciencia/figs/` que pueden no resolver al exportar a PDF/Word.
- **Faltan elementos formales** de entrega: portada, índice y (opcional) resumen/abstract con palabras clave. Los metadatos de autor/curso/fecha sí están (crédito parcial).
- **Bibliografía no alfabetizada** dentro de cada bloque temático.

---

## 3. Defectos CRÍTICOS (bloquean la nota tal como está)

### C1 — El ensayo se contradice a sí mismo en TODAS sus cifras científicas titulares (*split-brain* mega/chico)
**Este es el problema #1 y el más urgente.** Las mismas cinco demostraciones aparecen con **dos juegos numéricos incompatibles**, partidos limpiamente por la línea cuerpo↔cierre:

| Demostración | Cuerpo (§1, §3) — «mega» | Síntesis/Conclusiones/Apéndice (§4, §5) — «chico» |
|---|---|---|
| **D1 Zipf** | q = 1.006 sobre **33.933 ciudades** (GeoNames, R²=0.984); Colombia q=1.063/319 | q = 0.993 sobre **35 ciudades** colombianas (R²=0.956) |
| **D2 Escala** | β ≈ **1.11** (IC 1.01–1.22) | β = **1.173** (R²=0.989) |
| **D3 Fractal** | D = **1.903** (R²=0.999), percolación 2048² | D = **1.514** (R²=0.998), DLA |
| **D4 Schelling** | malla **2000²**, 3.68 M agentes, 0.50→0.87 | malla 50², 0.49→0.86, «incertidumbre 0.0002» |
| **D5 Red** | red **REAL** de La Candelaria, 5.375 nodos/8.540 aristas | «eje Junín **1.49×** la centralidad media» |
| **Figuras** | cita `D1_mega.png … D5_mega.png` | inserta `D1_zipf.png … D5_red.png` |

Peor aún: la **Nota metodológica** promete que «las figuras se recogen en el Apéndice» — y ese apéndice entrega justo las cifras que **desmienten** al cuerpo, y su puntero de fuentes (`ciencia/RESULTADOS.md`, l. 200) apunta a la versión *chica*. El lector que siga el itinerario obtiene números opuestos.

- **Ubicación:** §1 l. 73 y §3 l. 133-137 (mega) vs. §4 l. 152/158/164, §5 l. 180-181 y Apéndice l. 205-218 (chico).
- **Causa raíz (confirmada por el diff):** la edición reciente subió los ejes a «mega» pero dejó §4/§5/apéndice en «chico». Las fuentes modulares muestran la misma fractura: `02_eje_ontologico.md` y `04_eje_poder.md` ya son mega; `05_sintesis_banco.md` sigue chico.
- **Corrección (P0):** elegir **una** versión —recomendado **«mega»**, por robustez (33.933 ciudades reales, red real de 5.375 nodos)— y **propagarla a las cinco apariciones**, incluidas rutas de figura (`*_mega.png` en todo el documento) y el puntero del apéndice a `RESULTADOS_mega.md`. Verificar Schelling (0.50→0.87) y **eliminar el «1.49×»** (viene del grafo estilizado descartado; ver C2/D-poder) y el «0.0002» (no está en ninguna fuente).

### C2 — El «1.49×» del eje poder proviene de un grafo que el propio ensayo descartó
No es solo inconsistencia de versión: la cifra política estrella del eje del poder (**«el eje Junín concentra 1.49× la betweenness media»**, §4 l. 164 y Apéndice l. 217) **no sale de la red real** que el cuerpo presenta (§3 l. 137: 5.375 nodos reales de OSM, que no reporta ningún múltiplo). El «1.49×» solo existe en `RESULTADOS.md`, calculado sobre un **grafo estilizado sintético** de la retícula — y esa misma ficha **advierte que la retícula reparte la centralidad *más* uniformemente** (share top-20 %: 0.39 vs 0.49) y que «lo que emerge es la prominencia del eje, **no** una concentración extrema». La versión real (`RESULTADOS_mega.md`) ni siquiera da «1.49×»: reporta «betweenness máx 0.116».

En otras palabras: **el número que sostiene la conclusión política está tomado de un modelo que la fuente advierte que *subestima* el fenómeno, y se mezcla con el conteo de nodos de una red distinta.** Un evaluador que revise las fuentes lo verá.
- **Corrección (P0):** usar solo la red real y su métrica real; retirar «1.49×» o etiquetarlo inequívocamente como sintético/ilustrativo.

### C3 — El experimento T1–T6 es circular: presupone en su diseño la tesis categorial que dice probar
El protocolo priva a los modelos de herramientas (`uso_herramientas: false`). Un LLM sin calculadora que estima multiplicaciones de 12 dígitos es un resultado **conocido y garantizado por el propio diseño** (la metodología fuente lo admite: «un sistema acoplado a Python… acertaría siempre»). De ahí el ensayo infiere una tesis **ontológica** («no cruza umbral categorial», «procesar no es producir», diferencia de «naturaleza»). Ese salto es un *non sequitur*: la falibilidad aritmética *sin* herramientas no evidencia un límite categorial sobre «comprender la ciudad».
- Se agrava porque **contradice el propio mapeo del ensayo**: T1–T5 son tareas de **juicio determinante** (aplicar la regla de multiplicar), justo el registro que §1.2 le concede a la IA como propio — y la IA las falla. La partición limpia «buena en determinante, mala en reflexionante» queda tensionada por sus propios datos.
- **Ubicación:** §2 l. 106-108.
- **Corrección (P1):** separar explícitamente el **enunciado empírico** («sin herramientas, la IA estadística no ejecuta algoritmos exactos con fiabilidad») del **enunciado ontológico** («procesar ≠ producir»), y no presentar el primero como prueba del segundo. La tesis categorial hay que ganarla **filosóficamente** (vía relevancia/mundo, Dreyfus), no derivarla de un test aritmético cuyo resultado el diseño garantiza.

### C4 — La transición final del eje técnica anuncia el eje equivocado
El cierre de §2 dice que abre «la puerta de entrada a la **pregunta ontológica que el siguiente eje desplegará**» (l. 120). Pero el eje ontológico **ya fue §1**; el que sigue a §2 es **§3, el del poder**. Es un residuo del orden del material fuente (donde la ontología iba tras la técnica) que el ensamblaje no reconcilió. Rompe el hilo conductor justo en la costura entre ejes.
- **Corrección (P0):** reescribir la transición hacia el poder (p. ej. «…quién fija los fines para los que se computa la ciudad —la pregunta política que el siguiente eje despliega»).

---

## 4. Defectos MAYORES por eje

### 4.1. Eje ontológico
- **La autopoiesis se erige como categoría rectora pero nunca se demuestra ni se «cobra».** La tesis afirma en seco «la ciudad **es** un sistema autopoiético» (l. 7-8), pero el desarrollo solo exhibe **auto-organización/emergencia** y luego se repliega a «lectura plausible y productiva». Nunca se muestra que la ciudad cumpla los **dos** criterios de Maturana–Varela (clausura operacional + autoproducción de componentes). Falta el puente canónico: **Luhmann** (autopoiesis de sistemas sociales), ausente de la bibliografía. *Fix:* o argumentar la clausura/autoproducción (vía Luhmann), o **degradar la tesis** de «es autopoiética» a «se auto-organiza / admite lectura autopoiética», para que el título no prometa más de lo que el eje entrega.
- **La respuesta al «realismo computacional» (gradualismo) se asevera, no se gana.** El eje plantea bien la objeción más fuerte —«la comprensión *es* procesamiento sofisticado, la diferencia es de grado» (l. 89)— pero la refuta por **reafirmación** («la línea no se franquea acumulando más de lo mismo»). Y de este punto pende la tesis central del ensayo. *Fix:* dar un argumento independiente del salto categorial (por qué el juicio reflexionante no es límite de ninguna serie de subsunciones determinantes; apoyarse en Dreyfus como argumento **de principio**, no en T1–T6, que solo toca aritmética).
- **Desajuste de nivel ontológico.** D1 (Zipf) y D2 (escala) son regularidades del **sistema inter-urbano** (la distribución de tamaños de *muchas* ciudades), **no** evidencia de que *una* ciudad «se autoproduzca». El eje desliza entre «la ciudad se auto-organiza» y «el sistema de ciudades se auto-organiza» sin marcar el cambio de nivel, justo cuando el resto del eje habla del cuerpo que camina y del corredor singular. *Fix:* explicitar que Zipf/Bettencourt evidencian auto-organización del **sistema** (explanandum legítimo, pero distinto) y reservar D3/D4/D5 para el nivel intra-urbano.
- **D2 es sintético/circular pero se dice que «revela».** El indicador se construye inyectando β=1.15 + ruido y la regresión «recupera» β≈1.11 — no revela nada empírico (las dos «recuperaciones», 1.11 y 1.173, caen a lados opuestos del 1.15 inyectado: firma de ruido). *Fix:* bajarlo a «ilustración de método» en **todas** las secciones (incluido el apéndice, que hoy borra el caveat), o rehacerlo con dato real de OSM/PIB.
- **Fusión demasiado lisa Husserl–Merleau-Ponty–Heidegger.** «La intencionalidad corporal del **Dasein**» (l. 34) y «la experiencia urbana es **vivencia** del Dasein» (l. 75) amalgaman conceptos que se excluyen: el Dasein heideggeriano **no** es corporal (Heidegger es célebre por descuidar el *Leib*) ni es *Erlebnis* (término que Heidegger critica). *Fix:* separar registros — intencionalidad corporal = Merleau-Ponty (*Leib*); ser-en-el-mundo/horizonte = Heidegger, sin cargarlo de corporalidad ni «vivencia».

### 4.2. Eje técnica
- **La «sorpresa» Opus 70 % < Sonnet 90 % es casi con certeza ruido, y se eleva a tesis rectora.** Sobre n=10 celdas la diferencia es de **dos celdas** (7/10 vs 9/10); un test exacto de Fisher da **p ≈ 0.58** (no significativo). Decisivo: **en la muestra mayor (banco de 39) el orden se invierte** (Opus 92.3 % > Sonnet 89.7 %). El material fuente registra la inversión con honestidad, pero `00_ensayo` la borra y promueve el «70<90» a titular en la tesis rectora, la intro y las conclusiones. Es *cherry-picking*. *Fix:* degradar a «en el bloque aritmético (n=10) Opus quedó por debajo, diferencia dentro del ruido y que se invierte en el banco de 39»; añadir el p-valor.
- **Error factual visible:** «logra 70 % de fiabilidad (**en el mejor caso de API**)» (l. 114). Falso: 70 % es Opus, el **peor** de los dos API; el mejor es Sonnet, **90 %**. El error infla el argumento de sobredimensionamiento. *Fix:* «90 % en el mejor caso de API (Sonnet), 70 % en el mayor (Opus), 40 % en el mejor local».
- **El argumento de «sobredimensionamiento» se apoya en un *strawman*.** Compara un LLM **privado de calculadora** contra un algoritmo exacto; pero ningún sistema desplegado usa un LLM sin herramientas para multiplicar (con intérprete «acertaría siempre»). *Fix:* acotar a «usar un LLM para lo que un algoritmo exacto resuelve es un mal uso de recursos» (verdadero y suficiente), o trasladar el blanco al plano donde sí aplica (la promesa de «salto epistémico» en tareas no formalizables).
- **Claim de escala no-monótona confundido.** «El de 20 B superó al de 32 B (40 % vs 20 %)» compara **familias distintas** (gpt-oss vs qwen) — la escala no es la variable controlada — y el 20 % de qwen3:32b está **censurado por timeouts** (la metodología fuente lo advierte). *Fix:* comparar solo dentro de la familia qwen (3b/14b/32b) y declarar la salvedad de timeouts.

### 4.3. Eje poder
- **El caso Junín–San Antonio es ilustrativo/decorativo, no analizado.** Se invoca como emblema pero no hay historia del corredor, ni políticas reales de «renovación», ni actores nombrados, ni datos de comercio informal/desalojos, **ni una sola fuente de estudios urbanos sobre Medellín**. Los atributos políticos («espacio disputado… clase, género y raza») se **afirman sin evidencia**. El único «análisis» es correr betweenness. Justo el eje que la rúbrica premia por «desarrollo», y el desarrollo sustantivo es el que falta. *Fix:* incorporar trayectoria histórica del eje Junín/La Playa/San Antonio, políticas municipales concretas, actores (Alcaldía/EPM/comerciantes/vendedores informales) y ≥1 fuente académica sobre gentrificación/vigilancia en el centro de Medellín; que el número dialogue con esa realidad, no que la sustituya.
- **Referencia colgante:** «capa M₃», «matriz de colapso fenomenológico», «perfiles», «Gini de decisión peatonal» (l. 139) descansan en un **modelo/aplicación que el ensayo nunca describe**. El esquema M₁/M₂/M₃ solo recibe una glosa de paso en la intro (l. 54), con orden extraño (M₁→M₃→M₂) y una pseudofórmula «M₁ + M₃ − M₂» sin definir. Un lector que solo tenga este ensayo queda perdido. *Fix:* introducir explícitamente el modelo (definir capas, perfiles, matriz) **antes** de invocarlo, o traducir esos pasajes a prosa conceptual sin la jerga de *spec*.
- **La «economía política» es gesto, no análisis.** El párrafo que anuncia que «la economía política… se vuelve decisiva» (l. 135) la resuelve con **una frase por autor** (Harvey, Lefebvre, Sassen) + una «soberanía de cómputo» meramente asertada. La l. 141 **declara** la síntesis pero no la ejecuta. Es exactamente el «encadenar citas sin síntesis» que la rúbrica penaliza. *Fix:* poner **un** autor a trabajar en profundidad sobre el caso (Harvey/gentrificación en la renovación de Junín, o Sassen/expulsiones sobre el desplazamiento del comercio informal) en vez de rozar a cuatro.
- **La base empírica del poder es prestada e inconsistente.** El párrafo «empírico» (l. 133) recicla resultados **ontológicos** (D1–D4), de los cuales D2 es «modelado» y D3 «simulado»; el único propio del poder (D5) tiene la procedencia contradictoria de C2. *Fix:* teniendo la red real en la mano, **computar de hecho closeness/eigenvector** sobre la misma red y **mostrar** el desplazamiento de centralidad que hoy solo se afirma en condicional («podría desplazarse», l. 137). Era trivial de producir y cumpliría el mandato de «más ciencia» justo donde más falta hace.

### 4.4. Cohesión y manejo de autores (transversal, Bloque 1)
- **Citas flotantes y autocitas disfrazadas de fuente.** Frases del propio marco del autor se entrecomillan como si fueran voz externa: «La ciudad no es solamente una estructura física…» se atribuye vagamente al «marco teórico de esta investigación» (l. 34). Las citas a autores reales tampoco llevan página: **Hui** («disponemos de herramientas epistémicas sobredimensionadas…», l. 42; «Las limitaciones decisivas…», l. 44/141) y **Deleuze** («Los controles constituyen una modulación…», l. 127) van entre comillas sin obra ni página. *Fix:* distinguir tipográficamente lo propio (sin comillas) de lo ajeno (con comillas + obra/página); verificar que las citas de Hui sean textuales (o convertirlas en paráfrasis atribuida «en la línea de Hui…», por riesgo de **cita apócrifa**).
- **Bibliografía descuadrada.** **9 entradas nunca se citan** en el cuerpo (Simmel, Bonabeau, Epstein, Helbing & Molnár, Shannon, Kullback & Leibler, Badiou, Sutton & Barto, Mnih et al.) → relleno. A la inversa, **Alonso** se cita (l. 50, 112) pero **falta** en la bibliografía. Y **«Hui (2020)»** (l. 129) es un año fantasma: solo hay Hui 2016 y 2019. *Fix:* podar lo no citado o integrarlo de verdad; añadir Alonso (1964, *Location and Land Use*); corregir «Hui (2020)».

---

## 5. Defectos MENORES (pulido)
- *Leib/Körper* y «punto cero de la orientación» son de **Husserl** (*Ideas II*), no de Merleau-Ponty (que los hereda y radicaliza). Matizar la atribución.
- Deriva terminológica: «clausura **operacional**» (§1 l. 71) vs «clausura **organizacional**» (§4 l. 152) para el mismo criterio. Fijar un solo término.
- D4 (Schelling) se usa para «la computabilidad se **impone**» (l. 112), pero Schelling demuestra lo contrario (emergencia **sin** diseñador); además sus agentes **sí** tienen función objetivo local, lo que tensiona el «sin función objetivo global». Usar Schelling solo para «simula sin vivir»; sostener «la computabilidad se impone» con la elección de métrica (D5).
- Brecha de reproducibilidad: el experimento T1–T6 se declara «reproducible» y cita cifras exactísimas, pero **los JSON de respaldo no están en el repo** (a diferencia de D1–D5, que sí traen código en `ciencia/`). Incluir los datos crudos del banco.
- Inflación retórica: «refuta» (una prueba de 6 sujetos sin tools no refuta leyes de escala), «colapso relativo» para 75–83 % (que es aprobar la mayoría), framing de «duelo» donde el cómputo puro es el **árbitro**, no un competidor.
- «El modelo mayor fue menos fiable que el menor» generaliza: en las 27 preguntas de forma cerrada **Opus supera a Sonnet** (100 % vs 92.6 %). Acotar el titular a los bloques donde se cumple.

---

## 6. Plan de corrección priorizado (para llegar al 10-jul)

**P0 — Bloqueantes, ~1–2 h, puro proofread (haz esto sí o sí):**
1. **Unificar los resultados a una sola versión** (recomendado «mega») en §4, §5 y Apéndice, incluidas rutas de figura (`*_mega.png`) y el puntero del apéndice → `RESULTADOS_mega.md`. [C1]
2. **Eliminar «1.49×»** (grafo estilizado descartado) y «0.0002»; sustituir por la métrica de la red real. [C2]
3. **Reescribir la transición de cierre de §2** para que apunte al eje del poder. [C4]
4. **Renumerar** las subsecciones del ontológico 2.1–2.4 → **1.1–1.4**. [§2.5]

**P1 — Sube la nota, ~2–4 h, conceptual ligero:**
5. **Separar el enunciado empírico del ontológico** en el experimento (evitar la circularidad C3) y **degradar la «sorpresa» Opus<Sonnet** a lo que es (ruido, se invierte en n=39); corregir el error «mejor caso de API = 70 %» → 90 %. [C3, §4.2]
6. **Decidir la tesis autopoiética:** o Luhmann + argumento de clausura, o degradar «es autopoiética» → «admite lectura autopoiética». [§4.1]
7. **Podar/alinear la bibliografía** (quitar las 9 no citadas, añadir Alonso, arreglar «Hui 2020»); **atribuir o desentrecomillar** las citas flotantes. [§4.4]
8. **Fundir/diferenciar §4 y §5** y **aligerar la intro** (quitar reciclaje literal de citas). [§2.4]

**P2 — Si hay tiempo, eleva de 8.5 a 9:**
9. **Computar closeness/eigenvector** sobre la red real y **mostrar** el desplazamiento de centralidad (cumple «más ciencia» en el eje poder). [§4.3]
10. **Aterrizar el caso Junín** con ≥1 fuente de estudios urbanos de Medellín y actores concretos. [§4.3]
11. **Introducir o retirar** el aparato M₁/M₂/M₃ + matriz de colapso. [§4.3]
12. Numerar figuras con pies; añadir portada/índice; confirmar extensión/formato con la profesora. [§2.5]

---

## 7. Lo que funciona (no tocar)
- **Tesis rectora fuerte** («procesar ≠ producir», límite categorial no de potencia) que **realmente** atraviesa los tres ejes y se cierra sobre sí misma.
- **Guardarraíl epistémico honesto y sostenido**: «cara empírica *consistente con*, no prueba de» la autopoiesis — se aplica con una consistencia admirable (responde de frente a la objeción lógica más obvia).
- **Ideas propias reales**, no adornos: el esquema de **cuatro rasgos del modo de ser de la máquina** (Bergson/Wiener-Simondon/Kant-Hui/Heidegger-Dreyfus) y la **«relevancia sin unicidad»** (§1); la partición **forma-cerrada vs. emergente** (27 vs. 12 preguntas) del banco, que es el hallazgo más sólido del eje técnica; la **«ironía performativa»** como aporte reflexivo genuino.
- **Uso preciso** de Kant/Hui (juicio determinante vs. reflexionante), Dreyfus (regreso al infinito), Foucault→Deleuze (la smart city como dispositivo de control que **modula** en vez de encerrar), Kitchin y Haraway (dato que oculta sus decisiones; parcialidad situada como condición ética).
- **Balance de extensión entre ejes casi perfecto** (< 6 % de dispersión) y **diseño metodológico fino en T6** (declarar la tarea NO-computable y usar esa ausencia como hallazgo).

---

## 8. Nota metodológica de esta crítica
Producida orquestando 6 lentes de lectura independientes + verificación adversarial de 3 evaluadores por defecto (Opus + Gemini + MiniMax), cada uno obligado a construir primero la mejor defensa del ensayo antes de dictaminar. **114 agentes, 36/36 debilidades crítico/mayor confirmadas.** El material de respaldo (por-eje, con cita y ubicación de cada defecto) está en el resultado del workflow. *(Ironía no perdida: esta crítica se produjo, como el propio ensayo, orquestando IA bajo decisión humana — evidencia performativa, otra vez, de que la máquina procesa y el humano decide qué importa.)*
