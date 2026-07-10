# D11 — Localización de Hotelling (comercio informal)

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

---

*Ver la figura y el encuadre completo en la [tesis de respaldo](/tesis#d11). Resumen canónico con todos los matices en `ciencia/RESULTADOS.md`; código en `ciencia/mega/D11_mega.py`.*
