# Metodología: un ensayo asistido por IA, auditable de punta a punta

> Este documento explica **cómo se hizo** «La ciudad bien asignada» y, sobre todo, **cómo
> verificarlo**. No pide que se confíe en nada: cada afirmación empírica del ensayo tiene un
> script que la produce, una cifra canónica contra la que se coteja y una compuerta automática
> que falla si el texto y la evidencia se separan.

---

## Principio rector

Un trabajo asistido por IA no se juzga por su **procedencia** sino por si **resiste una batería de
verificación más dura** que la de un texto artesanal. La pregunta correcta no es «¿lo escribió una
máquina?», sino «¿esto se sostiene cuando se lo somete a pruebas reproducibles que un texto hecho a
mano nunca enfrenta?».

La asistencia, bien usada, **sube el estándar** en lugar de bajarlo: expone el trabajo a cotejos
automáticos de cada cifra, a crítica adversarial de varios modelos de familias distintas y a una
cadena de reproducción que cualquiera puede volver a correr. Un ensayo artesanal se lee y se cree;
este se lee y **se comprueba**. Todo lo que sigue existe para hacer esa comprobación fácil,
mecánica y pública.

---

## Regla de integridad autor/IA

Lo que es del autor, y no se delega:

- La **tesis** —la ciudad posible es la ciudad *bien asignada*: **computa** lo computable,
  **cultiva** lo emergente, **delibera** lo relevante—.
- El **giro** de género: de un diagnóstico de los límites de la IA urbana a una «cartografía
  crítica de una Medellín posible» (proyectiva, no diagnóstica).
- Las **decisiones filosóficas** (qué autores, qué encuadre, qué se concede y qué se defiende) y la
  **voz** del texto.

Lo que hizo la IA, siempre **orquestada** y con registro:

- **(a) Crítica adversarial multi-modelo** —modelos de tres familias buscando el punto débil del
  trabajo, no confirmándolo—.
- **(b) Ejecución y verificación del aparato computacional** —correr los experimentos, cotejar sus
  cifras, señalar sobre-alcances—.
- **(c) Ediciones quirúrgicas declaradas** tras cada crítica —cambios acotados, motivados por un
  hallazgo concreto—.
- **(d) Construcción del sitio y del PDF** de entrega.

Cada iteración quedó en **git** y en los documentos [`CRITICA.md`](../CRITICA.md) y
[`CRITICA2.md`](../CRITICA2.md). La trazabilidad no es una promesa: es el historial.

---

## El proceso, de punta a punta

1. **Fuente canónica única.** El entregable es [`ensayo/00_ensayo.md`](../ensayo/00_ensayo.md).
   El PDF ([`scripts/build-pdf.sh`](../scripts/build-pdf.sh)), la web (`web/`) y el espejo público
   [`/materiales`](../web/src/pages/MaterialesPage.tsx) se **generan** desde ahí. Nada se edita en
   dos lugares: no hay «versión web» y «versión papel» que puedan divergir.

2. **Evidencia computacional local y reproducible.** Nueve demostraciones (D1–D9) en
   [`ciencia/mega/`](../ciencia/mega/), con **semilla fija `42`** y ejecución local (32 núcleos).
   Donde hay datos reales —OpenStreetMap, SRTM, GeoNames— las respuestas crudas quedan **cacheadas**
   (`cache/`, [`ciencia/data/`](../ciencia/data/)), lo que **fija las cifras**: D5, D6, D8 y D9
   reproducen la misma red y los mismos números sin volver a golpear ninguna API.

3. **Compuertas duras.** Dos verificaciones automáticas custodian el texto:
   - `make verify` —toda cifra titular del ensayo y la tesis se coteja **automáticamente** contra
     [`ciencia/RESULTADOS.md`](../ciencia/RESULTADOS.md) (script `scripts/verify_cifras.py`)—. Es el
     análogo, para las cifras, del verificador de citas *Stephanus* del repo hermano: donde aquél
     comprueba que cada referencia a Platón apunta al pasaje correcto, éste comprueba que cada número
     del ensayo coincide con el resultado que lo produjo. Si el texto dice una cosa y el experimento
     otra, la compuerta **falla**.
   - `make wordcount` —el cuerpo debe caer en el rango **2000–2500** palabras exigido por la
     consigna, con el método de conteo declarado (se cuenta el cuerpo, sin bibliografía ni notas)—.

4. **Crítica adversarial por iteraciones.** No una revisión final, sino varias rondas registradas:
   [`CRITICA.md`](../CRITICA.md) (contra la tesis extensa, 36/36 hallazgos crítico/mayor
   sobrevivieron la verificación); [`CRITICA2.md`](../CRITICA2.md) (contra la consigna real,
   **45/45** validados por modelos externos); y `CRITICA3.md` (auditoría trimodelo final, en curso).
   Cada ronda dejó correcciones concretas, no elogios.

5. **Honestidad modal.** El guardarraíl está escrito al comienzo de
   [`ciencia/RESULTADOS.md`](../ciencia/RESULTADOS.md): lo **sintético se declara sintético** (D3 y
   D4 ilustran mecanismos, no son Medellín; D1 es una regularidad del *sistema* de ciudades), y
   *«consistente con»* nunca se vende como *«prueba de»*. Las correcciones de sobre-alcance quedan
   **registradas**, no borradas: D2 dejó de ser circular (el exponente se estima del dato, no se
   inyecta), D3 se reencuadró (no verifica universalidad crítica), D5 corrigió el tratamiento del
   eigenvector. Registrar el error es parte de la evidencia.

6. **Trazabilidad.** Historial de git con mensajes descriptivos y esta bitácora,
   [`docs/ITERACIONES.md`](ITERACIONES.md), que enlaza cada hito con el documento o el commit que lo
   evidencia.

---

## La batería adversarial

Las lentes con las que se auditó el trabajo (adaptadas del repo hermano), en orden:

1. **Cumplimiento de la consigna** — ¿responde el género y las tres preguntas guía que se pidieron?
2. **Validez lógica** — ¿los pasos se siguen, o hay saltos?
3. **Fidelidad de cifras (AUTOMATIZADA)** — cotejo de cada número contra `RESULTADOS.md` vía
   `scripts/verify_cifras.py`; es la única lente que no depende de criterio humano.
4. **Carga de la prueba** — para cada afirmación fuerte: ¿*demuestra*, *ilustra*, *reinterpreta* o
   *concede*? Cada verbo tiene un peso distinto y se usa el que corresponde.
5. **Autoconsistencia** — ¿el ensayo, la tesis, la web y el PDF dicen lo mismo? (la contradicción
   numérica entre secciones fue justamente el hallazgo mayor de `CRITICA.md`).
6. **Adversario experto** — un lector hostil de cada tradición (fenomenología, técnica, poder).
7. **Economía** — ¿sobra algo? ¿hay aparato decorativo que no carga peso argumental?
8. **Legibilidad de lectora externa** — ¿se entiende sin el contexto del autor? (lente ejecutada en
   **Gemini**, de familia distinta).
9. **Crítica técnico-empírica externa** — ¿los experimentos aguantan a un revisor cuantitativo?
   (lente ejecutada en **GPT-5.5**, de familia distinta).

Las lentes **1–7 corrieron en Claude Opus**; las **8–9 en modelos de otra familia**, a propósito,
para no auditar el trabajo con el mismo modelo que ayudó a producirlo y evitar el sesgo de
auto-complacencia. Es una **auditoría trimodelo**: Claude, OpenAI y Google mirando el mismo texto
desde tres sesgos distintos, y un hallazgo cuenta como serio sólo si sobrevive a los tres.

---

## Política de delegación multi-modelo

- **Orquestación y síntesis final:** Claude (Fable orquesta, Opus ejecuta). No se delega la decisión
  de qué corregir ni cómo integrar las críticas.
- **Crítica trimodelo:** Opus + GPT-5.5 (Codex) + Gemini, cada uno construyendo primero la mejor
  defensa posible del ensayo antes de dictaminar, para que la crítica sea justa y no un espantapájaros.
- **Cómputo:** **siempre local**, en Python, sobre 32 núcleos. **Nunca** se delega un experimento a
  la nube: los números que sostienen el ensayo se generan en la máquina del autor y quedan cacheados,
  no salen de un servicio que no se puede reproducir.
- **Redacción del ensayo:** autor, más ediciones quirúrgicas declaradas tras cada crítica.

---

## Cómo auditar este trabajo

Para la evaluadora —o para cualquiera—, en pasos concretos:

1. **Verificar las cifras:** `make verify`. Coteja automáticamente cada número del ensayo y la tesis
   contra [`ciencia/RESULTADOS.md`](../ciencia/RESULTADOS.md). Si algo no cuadra, lo dice.
2. **Verificar la extensión:** `make wordcount`. Confirma que el cuerpo está en 2000–2500 palabras.
3. **Re-ejecutar la evidencia:** correr cualquier demostración, p. ej.
   `.venv/bin/python ciencia/mega/D5_mega.py` (la métrica decide el centro) o
   `ciencia/mega/D8_ciudad.py` (escala ciudad). Gracias a las cachés, dan **exactamente** las mismas
   cifras.
4. **Leer el proceso:** [`docs/ITERACIONES.md`](ITERACIONES.md) para la historia, y
   [`CRITICA.md`](../CRITICA.md) / [`CRITICA2.md`](../CRITICA2.md) para las auditorías y sus
   correcciones.
5. **Leerlo todo legible:** la web expone el proyecto completo en
   [`/materiales`](../web/src/pages/MaterialesPage.tsx) —ensayo, tesis, resultados y críticas— sin
   nada oculto.

Si algún paso falla, el trabajo falla la auditoría. Ese es el punto: el documento no proclama que es
riguroso, **da los medios para desmentirlo**.
