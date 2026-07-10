# CRÍTICA 3 — Auditoría trimodelo del ensayo final

> **Qué se auditó:** `ensayo/00_ensayo.md` (el entregable), su relación con `tesis/00_tesis.md`,
> `ciencia/RESULTADOS.md` (cifras canónicas) y la infraestructura de auditabilidad del repositorio.
> **Quién auditó:** nueve lentes independientes — cuatro lentes adversariales en Claude Opus
> (consigna, rigor filosófico, suficiencia empírica, auditabilidad), una crítica técnico-empírica en
> GPT-5.5 (OpenAI) y una lectura de coherencia global en Gemini Pro (Google). Tres familias de
> modelos distintas para evitar la auto-complacencia de una sola.
> **Formato:** cada hallazgo con evidencia verificable (archivo:línea o cita textual), reparación
> propuesta y **estado de aplicación**. Las correcciones se aplicaron como ediciones quirúrgicas
> el 10-jul-2026 (este mismo commit); el cuerpo del ensayo quedó en **2.487 palabras** (compuerta
> `make wordcount`: 2.000–2.500).
> **Documento previo:** [CRITICA2.md](CRITICA2.md) (45/45 hallazgos verificados, ya aplicados).

## Veredicto global

El ensayo cumple la consigna en lo formal y estructural (rango de palabras, tres preguntas guía con
respuesta localizable, posible ≠ utópico con blindaje de viabilidad, apropiación real de autores) y
su aparato empírico es **suficiente y honesto** para el género. El patrón de riesgo detectado por
los tres modelos fue **uno y el mismo**: el verbo fuerte («demostré», «medido», «por eso») estirado
sobre pasos que los datos no alcanzan — el salto de nivel Zipf→Medellín, la causal histórica del
Metrocable, el estatus del experimento LLM, y el segundo corte de la tríada (cultivar/deliberar)
presentado como medido cuando es argumentado. Todos esos hallazgos convergentes se corrigieron.
Con ellos aplicados, la tesis pierde **cero** fuerza retórica y gana inmunidad ante el lector
adversarial: cada afirmación quedó en su estatus modal exacto (demuestra / ilustra / sostiene).

## A. Hallazgos convergentes (2+ críticos independientes) — todos aplicados

| # | Sev. | Críticos | Hallazgo | Reparación aplicada |
|---|------|----------|----------|---------------------|
| A1 | alta | Codex + Gemini + (la propia tesis) | «La ciudad se autoproduce» desde Zipf: D1 es del *sistema* de ciudades, no de Medellín singular | «El sistema de ciudades se auto-organiza… **Eso no prueba que Medellín se autoproduzca**; funciona como restricción de realismo» |
| A2 | alta | Codex + Opus-empiria | «por eso Medellín inventó el Metrocable»: D6/D8 no prueban causalidad histórica | «— y **vuelve legible la racionalidad** del Metrocable» (la causal queda solo en Brand & Dávila) |
| A3 | alta | Codex + Opus-filosofía | «el centro no se descubre; se decide» ignora que D9 muestra estructura real que constriñe | «— **se decide la métrica, no la materia**: el trazado real constriñe (su corredor prominente no es artefacto; tesis, D9), pero nada *en el grafo* dice qué métrica debe importar» |
| A4 | media | Opus-consigna + Opus-empiria | «siete de cada diez» sin cita y con valencia invertida (la encuesta lo registra como problema) | Cita añadida (Medellín Cómo Vamos & Invamer, 2024) + valencia declarada: «la encuesta la registra como problema — leerla como tejido es la disputa de este ensayo» |
| A5 | media | Codex + Opus-filosofía + Opus-empiria | «Lo demostré desde el oficio» sobre el experimento LLM, que la tesis declara ilustrativo (n=10, no monótono en escala) | «Lo **ilustré** desde el oficio, en un experimento propio —ilustrativo, no estadístico—…»; se eliminó la insinuación de tendencia por escala |
| A6 | media | Opus-consigna + Opus-empiria + Codex | Cifras EPM / presupuesto participativo sin fuente; «su presupuesto» ambiguo | «del presupuesto municipal (EPM, 2026)»; bibliografía: EPM, Concejo de Medellín (Acuerdo 028 de 2017, que además reconcilia el Acuerdo 43 de 2007 de CRITICA2) |
| A7 | media | Gemini + Codex + (la propia tesis) | Schelling presentado como si mostrara la ciudad; el modelo produce la regla inyectada | «basta **inyectar en un modelo** una preferencia leve… — **prueba de principio, no retrato de la vivienda real**» |

## B. Hallazgos de un solo crítico que sobreviven verificación — aplicados

| # | Sev. | Crítico | Hallazgo | Reparación aplicada |
|---|------|---------|----------|---------------------|
| B1 | media | Opus-consigna | Heidegger ausente pese a ser la cita guía del eje técnica en la consigna | Apropiación en §3: «encadenados a la técnica» incluso al negarla, «del peor modo cuando la creemos neutral» → ni tecnofilia ni tecnofobia: asignación. + bibliografía |
| B2 | media | Opus-filosofía | «límite categorial demostrable… lo he medido»: solo el corte computable/no-computable está medido; cultivar/deliberar es distinción argumentada | Desdoblado: «el límite de lo computable… lo he medido; las otras dos fronteras… las sostengo como **distinción argumentada, no medida**» |
| B3 | media | Opus-filosofía | «exterior al cómputo» equivoca optimizador con cómputo (contra su propia concesión *arguendo*) | «exterior a la **optimización**; y donde esa métrica es pública y disputada, la decisión es política» |
| B4 | media | Opus-filosofía | La partición por *asuntos* no es exhaustiva (asuntos híbridos disparan varios marcadores) | Cierre: «La asignación es **por aspecto, no por asunto**: un semáforo tiene núcleo computable, métrica disputable y efectos emergentes a la vez» |
| B5 | media | Codex | D7 (la palanca que sí funciona) ausente del cuerpo pese a ser el mejor apoyo de cultivar ≠ laissez-faire | «diluir la densidad no rompe la segregación; solo el anclaje estructural la revierte (tesis, D7)» |
| B6 | alta | Gemini | Banco Epistémico Urbano como caja negra (concepto clave sin glosa) | «…donde la ciudadanía audita y disputa los algoritmos oficiales» |
| B7 | alta | Gemini | Jerga sin traducir (Jaccard, nombres de centralidades) | Glosas mínimas: intermediación (el paso obligado), cercanía (a menos pasos de todo), vector propio (conectado con los mejor conectados); «comparten a lo sumo una esquina de cada diez, a veces ninguna» |
| B8 | baja | Opus-consigna | «zonas fuera de registro» sin blindar la objeción de seguridad | «acotadas, reversibles y decididas en común (no puntos ciegos decretados)» |
| B9 | baja | Gemini | «La consigna obliga a decidir» rompe la cuarta pared | Eliminado; la disyuntiva se plantea directa |
| B10 | baja | Opus-filosofía | «el mismo error con el signo invertido»: no hay inversión (ambos sobre-computan) | «el mismo error de asignación, **esta vez contra el otro registro**» |
| B11 | baja | Opus-filosofía | Universalización del pluralismo métrico alcanza métricas de propósito técnico fijo | «ninguna cartografía pública **de asuntos en disputa** —seguridad, renovación, priorización…—» |

## C. Hallazgos NO aplicados — con su porqué (decisión del autor)

| # | Crítico | Hallazgo | Por qué no se aplica |
|---|---------|----------|----------------------|
| C1 | Gemini | Títulos «mecánicos» → hacerlos más ensayísticos | El propio crítico reconoce que son estratégicos para la rúbrica («te aseguran la nota»). Se mantienen: la evaluadora debe poder subrayar las respuestas a las preguntas guía. |
| C2 | Codex | Experimento social barato (taller de contra-métrica con una veeduría; mini-deliberativo de métricas con 15–30 participantes) | Excede el género y el calendario de un ensayo de curso (trabajo de campo con sujetos). Queda declarado como **trabajo futuro** — y es, de hecho, el «piloto de cien días» que el ensayo propone. |
| C3 | Codex | «Retórica de cómputo residual» en las cifras de escala (33.933; 64 M) | Aplicado parcialmente: se recortó «reales» redundante en Zipf. Las magnitudes restantes cumplen función de identificación del dato (no de autoridad), y la lente empírica de Opus verificó que el ensayo ya reconvierte la escala en argumento anti-hiperescala (el nodo de 32 núcleos). |
| C4 | Gemini | Alternar «función objetivo» con sinónimos | El término es un concepto técnico definido en la tesis y usado consistentemente; alternarlo introduciría equivocación — el defecto que la lente 4 de filosofía pide evitar. |

## D. ¿El aparato empírico es suficiente? (respuesta directa)

**Sí, para lo que el ensayo afirma tras estas correcciones.** El dictamen convergente:
- **Fidelidad**: la lente empírica verificó cifra por cifra ensayo/tesis contra `ciencia/RESULTADOS.md`
  — limpia (y ahora automatizada con `make verify`).
- **Núcleo fuerte**: D5–D6–D8–D9 sostienen con fuerza el pluralismo métrico y la centralidad
  encarnada (Codex: «sí sostienen con fuerza la tesis limitada»); D4–D7 sostienen que emergencia ≠
  bondad espontánea y que la palanca importa.
- **Lo sintético está declarado** (D3/D4/D7) y D3 **no se usa** en el ensayo ni debe usarse en la
  defensa oral (Codex C: concentrar la defensa en D5–D9).
- **Más escala no añade fundamento** — escalar por escalar contradiría la propia tesis del ensayo;
  el hardware se aprovechó en cobertura (D8), robustez (D9) y realismo (datos OSM/SRTM/GeoNames),
  que es donde rinde epistémicamente.
- Los faltantes señalados (experimentos deliberativos con personas) son **de otro género** de
  evidencia, quedan como trabajo futuro declarado (C2).

## E. Auditabilidad — brechas cerradas en esta iteración

1. **`docs/METODOLOGIA.md`** — el método asistido por IA, la regla de integridad autor/IA y la
   batería de lentes, en la puerta de entrada del repo (antes sepultado en la tesis).
2. **`Makefile` + `scripts/verify_cifras.py`** — compuertas duras: `make verify` (toda cifra del
   ensayo/tesis cotejada automáticamente contra RESULTADOS.md) y `make wordcount` (2.000–2.500 con
   método de conteo declarado).
3. **Ruta web `/materiales`** — el proyecto completo, abierto: consigna, críticas, resultados,
   defensa y metodología legibles en la web y descargables.
4. **`docs/ITERACIONES.md`** — bitácora numerada del ensayo (0→7) con commits como evidencia.

---

*Auditoría ejecutada el 10-jul-2026. Correcciones aplicadas como ediciones quirúrgicas en el mismo
commit que este documento; verificables con `git show` y con las compuertas `make verify` y
`make wordcount`.*
