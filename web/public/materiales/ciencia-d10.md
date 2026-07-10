# D10 — Juego de congestión (Wardrop/Braess)

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

---

*Ver la figura y el encuadre completo en la [tesis de respaldo](/tesis#d10). Resumen canónico con todos los matices en `ciencia/RESULTADOS.md`; código en `ciencia/mega/D10_mega.py`.*
