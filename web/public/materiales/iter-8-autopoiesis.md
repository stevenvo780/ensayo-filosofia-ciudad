# 8 · Giro autopoiético + cuatro experimentos predictivos

El ensayo estaba bien armado, pero el **lente** cojeaba. «La ciudad bien asignada» concedía
demasiada **agencia soberana** al habitante: sonaba a un sujeto que, desde afuera, reparte los
asuntos urbanos a su registro. Esa no es la ciudad que el resto del texto describe. El giro:
releer todo bajo **autopoiesis** (Maturana-Varela, y Luhmann para los sistemas sociales). La ciudad
**se autoproduce** —genera los componentes (tejido, instituciones, ciudadanos) que a su vez la
generan—; el peligro no es que una máquina la gobierne *desde afuera*, sino que su autoproducción
**se cierre** sobre una sola distinción —la retícula del planificador, la métrica del mercado— y
subsuma el resto. Funcionalismo y *smart city* pasan a ser la **misma clausura** con signo
invertido. Y la agencia humana deja de ser soberana para ser **inmanente**: quien habita no
programa la ciudad, la **perturba** desde dentro (acoplamiento estructural: la perturbación gatilla
el cambio, no lo especifica); esa re-perturbación es lo político. «Bien asignada» sobrevive, pero
ya no como orden que un soberano impone: como la **constitución que mantiene la autoproducción
abierta**. Se conservó el guardarraíl de siempre —autopoiesis es **lente de lectura, no teorema**;
las demostraciones son *evidencia consistente con*, no prueba de—.

El giro pedía **cerrar un hueco predictivo**: faltaban los algoritmos que anticipan comportamiento.
Se añadieron cuatro experimentos, ejecutados localmente sobre la red real de Medellín:
**D10** —juego de congestión de Wardrop, con **paradoja de Braess** (PoA 1,03; cerrar una arista
mejora el tiempo agregado +1,37 %, sobre el piso de ruido): el todo es autónomo de sus partes—;
**D11** —juego de localización de **Hotelling**: el comercio informal se aglomera 2,6× vs el óptimo
de cobertura, orden que nadie diseñó—; **D12** —**difusión** con pendiente (Tobler): el terreno
encoge el alcance caminable de 15 min un 24 % en la ladera vs 16 % en el centro—; y **D13**
—**minimax-regret** sobre cuatro centralidades (Jaccard 0,03): no hay portafolio robusto neutral, la
decisión es irreductiblemente política—. Cada uno con su cautela honesta (D10 usa demanda O-D
sintética; D11 la mejor-respuesta cicla; D12 el footfall salió difuso; D13 el «gana eigenvector» es
patología). El conteo pasó de **nueve a trece** demostraciones (D1–D13), siete sobre datos reales
de Medellín.

Propagar el nuevo lente a **todo el repositorio** —ensayo, tesis, deck, guion, READMEs, web,
metodología— era la parte con más riesgo de error, así que se hizo con un **workflow multi-modelo**:
seis agentes en paralelo alineando un archivo cada uno (Opus para los textos densos; Codex y MiniMax
para READMEs y copy web), seguidos de un **guardián adversarial** que barrió el repo entero en busca
de inconsistencias supervivientes —conteos viejos, cifras de D10 desalineadas, copias web sin
regenerar—. El orquestador corrigió lo que el guardián marcó y re-verificó las cifras contra
`ciencia/RESULTADOS.md`. Las bitácoras 0–7 se dejaron **intactas**: describen con exactitud su
momento (cuando había nueve demostraciones y el lente era otro); reescribirlas sería falsear la
historia. Este hito es la constancia de que el giro ocurrió.
