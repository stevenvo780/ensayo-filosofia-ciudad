# Bitácora: historia del ensayo por iteraciones

> Historia real del trabajo, hito por hito. Cada uno enlaza al documento que lo contiene y, cuando un
> commit lo evidencia, a ese commit. Buena parte de la escritura y la crítica ocurrió en el árbol de
> trabajo antes de commitear (así lo registran las propias `CRITICA*`); por eso algunos hitos se
> apoyan en documentos y no en un commit dedicado.

---

**0. Consigna y materia prima del semestre.** El curso dejó dos exposiciones previas —fenomenología
de la ciudad y Yuk Hui / cosmotécnica— consolidadas en [`material/`](../material/). La consigna real
llega el 7-jul y reemplaza la genérica del 14-jun: [`CONSIGNA.md`](../CONSIGNA.md) pide un ensayo de
**cartografía crítica de la ciudad posible** (2000–2500 palabras, 40 %).
_Commit: `8b4f738` — consolidación de material (fenomenología + Yuk Hui) y esqueleto de síntesis._

**1. Tesis extensa diagnóstica.** Primer texto largo: *«La herramienta sobredimensionada y la
aplicación faltante»* (hoy [`tesis/00_tesis.md`](../tesis/00_tesis.md)), un diagnóstico de los
límites del conocimiento computacional de la ciudad, con las demostraciones **D1–D5** iniciales.

**2. `CRITICA.md` — primera auditoría adversarial.** Se critica la tesis extensa con seis lentes +
verificación adversarial (36/36 hallazgos crítico/mayor sobrevivieron). Consecuencia: se **eleva el
aparato** —de simulaciones estilizadas a datos reales— (D2 deja de ser circular; D5 usa la red
peatonal real de Medellín con tres métricas exactas). Ver [`CRITICA.md`](../CRITICA.md).

**3. Llega la consigna real y el ensayo gira.** La consigna del 7-jul pide un texto **proyectivo**
(«teorizar una ciudad posible»), no diagnóstico. El trabajo gira: el ensayo se reescribe como
cartografía de una Medellín posible y la tesis diagnóstica pasa a ser **respaldo**. Ver
[`CONSIGNA.md`](../CONSIGNA.md).

**4. `CRITICA2.md` — crítica contra la consigna real.** Seis lentes sobre el repo completo +
verificación externa: **45/45** hallazgos validados por modelos de otra familia (Codex, MiniMax,
Gemini). Consecuencias: correcciones de honestidad (D2 no circular, D3 reencuadrada, D5 eigenvector)
y **división en dos textos** —ensayo breve + tesis de respaldo—. Ver [`CRITICA2.md`](../CRITICA2.md).

**5. Ensayo final, web, PDF y D6–D9.** Se escribe [`ensayo/00_ensayo.md`](../ensayo/00_ensayo.md)
—«La ciudad bien asignada», tres ejes: ontológico, poder, técnica—; se construye la **web
interactiva** (widgets que calculan centralidades y corren un Schelling en vivo) y el **PDF de
entrega**; y se añaden cuatro demostraciones nuevas: **D6** (métrica del cuerpo/pendiente), **D7**
(umbral de intervención anti-segregación), **D8** (escala ciudad), **D9** (null models). Resumen
canónico en [`ciencia/RESULTADOS.md`](../ciencia/RESULTADOS.md).
_Commits: `c914799` — repo como evidencia abierta y reproducible (9 demostraciones); `5706110`…`77e03dd` — web, PDF y botón de descarga._

**6. `CRITICA3.md` — auditoría trimodelo (en curso).** Ronda final con las nueve lentes: 1–7 en
Claude Opus, 8 (legibilidad externa) en Gemini y 9 (crítica técnico-empírica) en GPT-5.5, para no
auditar el trabajo sólo con el modelo que ayudó a producirlo. En curso al momento de escribir esta
bitácora; quedará como `CRITICA3.md`.

**7. Correcciones finales e infraestructura de auditabilidad.** Últimos ajustes de **precisión
modal** (que cada afirmación use el verbo que le corresponde: demuestra / ilustra / concede) y el
andamiaje que hace el trabajo auditable: compuertas `make verify` y `make wordcount`, el espejo
público [`/materiales`](../web/src/pages/MaterialesPage.tsx), la
[`METODOLOGIA.md`](METODOLOGIA.md) y esta bitácora.

**8. Giro autopoiético y cuatro experimentos predictivos.** El lente vira de «asignación soberana» a
**autopoiesis** (abierta/cerrada, con agencia **inmanente** por acoplamiento estructural): la ciudad
se autoproduce y el peligro es que esa autoproducción **se cierre**; funcionalismo y *smart city*
son la misma clausura. Se cierra el hueco predictivo con cuatro demostraciones nuevas sobre la red
real —**D10** congestión/Braess, **D11** localización de Hotelling, **D12** difusión con pendiente,
**D13** minimax-regret— y el conteo pasa de **nueve a trece** (D1–D13). La propagación del lente a
todo el repo se hizo con un **workflow multi-modelo** (seis agentes en paralelo + guardián
adversarial) y correcciones del orquestador re-verificadas contra
[`ciencia/RESULTADOS.md`](../ciencia/RESULTADOS.md). Detalle en
[`iteraciones/8-autopoiesis.md`](iteraciones/8-autopoiesis.md).
