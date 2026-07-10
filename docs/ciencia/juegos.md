# Teoría de juegos en la ciudad — congestión y localización

Dos experimentos aplican **teoría de juegos** a la red real de Medellín: qué pasa cuando muchos agentes egoístas (conductores, venteros) deciden a la vez. El resultado colectivo no es la suma de sus decisiones —el todo es autónomo de sus partes—.


## D10 — Juego de congestión (Wardrop/Braess)

**¿Qué pregunta?** Cuando cada viajero elige egoístamente su ruta más rápida, ¿el tráfico que resulta es tan bueno como el que un planificador coordinaría, y puede cerrar una calle mejorar el flujo de todos?

**El algoritmo, paso a paso**
1. Se toma la red vial real de Medellín (radio 4 km: 22.863 nodos, 33.988 aristas) y se reparte una demanda sintética de viajes entre 300 zonas de origen y destino.
2. Cada tramo tarda más cuanto más lleno está (fórmula BPR estándar: tiempo libre × (1 + 0,15·(flujo/capacidad)⁴)).
3. Se busca el equilibrio de usuario (Wardrop) —cada quien elige su ruta mínima dada la congestión ajena— con el método de Frank-Wolfe, que va reasignando viajes hasta que nadie puede mejorar cambiando de ruta.
4. Se calcula aparte el óptimo social: la asignación que minimiza el tiempo total de la ciudad (se rutea por el costo marginal, que obliga a cada viaje a 'pagar' la molestia que causa a los demás).
5. Se divide un tiempo total por el otro: eso es el precio de la anarquía. Luego se cierra, una por una, las 30 calles más cargadas y se mide si el tiempo agregado baja, separando la señal del ruido numérico con cierres de control.

**Qué halló** El precio de la anarquía es PoA = 1,03: el egoísmo de ruta cuesta apenas ~3% de tiempo agregado sobre el óptimo coordinado. Y aparece una arista-Braess robusta: cerrarla mejora el tiempo total agregado en +1,37% (las demás dan 0,1–0,26%, el piso de ruido del solver, con gap relativo 0,009).

**Por qué importa** (puente autopoiético) El óptimo del todo no es la suma de los óptimos egoístas de las partes: cerrar una calle mejora el conjunto porque la ciudad tiene una autonomía del todo sobre las partes que ningún viajero controla ni computa. El planificador que trata su plano como una instrucción a ejecutar cierra el sistema sobre su propia métrica; dejar la autoproducción abierta es reconocer que la red devuelve resultados que su computador no gobierna. El cómputo revela ese efecto, no lo produce ni lo decide.

**Matiz honesto** La demanda origen-destino es sintética, la red peatonal se usa como topología vial y la capacidad es constante, así que las magnitudes son modestas. Lo sólido es cualitativo —existe efecto Braess: cerrar una calle puede mejorar el flujo agregado—, no la cifra exacta.

## D11 — Localización de Hotelling (comercio informal)

**¿Qué pregunta?** Si cada vendedor informal elige dónde pararse para captar más clientes, ¿la red urbana los dispersa para cubrir el territorio, o se apiñan unos junto a otros como predice el 'principio de diferenciación mínima' de Hotelling?

**El algoritmo, paso a paso**
1. Se toma la red peatonal real del centro de Medellín (corredor Junín–San Antonio: 7.598 nodos, OpenStreetMap).
2. Cada nodo genera demanda proporcional a la densidad local de calles (proxy de footfall: cuántos nodos hay a menos de 200 m por la red).
3. Cada cliente acude al vendedor más cercano por distancia de red (no en línea recta): esto parte la ciudad en 'celdas de Voronoi' de clientela.
4. Se corre una dinámica de mejor-respuesta: por rondas, cada vendedor se reubica al nodo que le captura más demanda dado dónde están los demás, hasta llegar a un punto fijo o detectar un ciclo.
5. Se compara ese equilibrio contra dos referencias: colocación al azar y el óptimo social de cobertura (p-mediana greedy, que dispersa para cubrir a todos). El exceso de apiñamiento sobre el óptimo es el efecto Hotelling neto.

**Qué halló** El comercio informal se aglomera: índice de aglomeración 2,3× respecto del azar y 2,6× respecto del óptimo social (con N = 40 vendedores). El patrón es robusto en todo el barrido N = 10–60 (2,1× a 3,9× vs óptimo). El precio es una cobertura 41–63% peor que la óptima.

**Por qué importa** (puente autopoiético) El foco comercial de Junín es un orden que se auto-organiza desde decisiones locales, no un desorden que la autoridad deba corregir: es auto-organización, equilibrio emergente. La mirada funcionalista que ve solo 'aceras saturadas' y quiere dispersar el comercio trata como ruido lo que es una forma de vida urbana que se produce a sí misma. El cómputo hace legible esa aglomeración, pero quién la lee como problema o como tejido vivo es una decisión que no está en el grafo.

**Matiz honesto** La mejor-respuesta cicla —no hay un equilibrio de Nash puro, se fotografía una oscilación estable—, la demanda es un proxy de densidad de calles (no un aforo real) y el modelo omite precios, arriendo y control policial.
