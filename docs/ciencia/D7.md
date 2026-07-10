# Umbral de intervención: cuánta institución cuesta romper la segregación

**¿Qué pregunta?** ¿Qué nivel de intervención urbana necesita realmente una ciudad para frenar la segregación emergente? ¿Alcanza con «mezclar» un poco, o hay un umbral real que cruzar?

**El algoritmo, paso a paso**
1. Partir del autómata de Schelling: una malla 300×300 donde cada agente A o B prefiere un mínimo de vecinos iguales (tolerancia: 50 % deben ser como yo).
2. Comenzar con una mezcla aleatoria (segregación = 0,873).
3. Probar una primera **palanca**: añadir agentes de «tipo 3» (indiferentes, satisfechos con cualquiera). Los llama el ensayo «vivienda indiferente». ¿Baja la segregación?
   - Resultado: **NO**. Sube a 0,945. Diluir no funciona.
4. Probar una segunda **palanca**: fijar una fracción p de residentes que no se mudan (anclan la zona, crean una masa que resiste el sorting). Los llama «vivienda anclada/integrada». ¿Baja?
   - Resultado: **SÍ, monótonamente**. Pero ¿cuándo cruza bajo 0,65 (umbral de mezcla)? **En p ≈ 55 %**.

**Qué halló**
- La segregación sin intervención: **0,873** (con tolerancia 0,5; es decir, «leve» preferencia).
- Con vivienda indiferente: **0,945** (peor, no mejor).
- Con vivienda anclada/integrada:
  - **p = 30 %**: 0,746 (aún muy segregado)
  - **p = 55 %**: 0,65 (cruza el umbral)
  - **p = 70 %**: 0,596 (bien integrado)
- La relación es **monótona**: más habitantes fijos = menos segregación, sin contradicciones.

**Por qué importa**
Esta cifra (55 %) es el argumento contra dos posiciones seductoras. Contra el laissez-faire hayekiano («la mano invisible integra»): la emergencia segregante es terca, y la «mano invisible» no la desagrega; hace falta un compromiso institucional explícito. Contra el voluntarismo («basta con querer»): no cualquier intervención funciona (diluir, de hecho, empeora); funciona solo cuando la **estructura es fuerte**: ~55 % de residentes permanentes que no pueden huir. La autopoiesis aquí es **abierta** cuando el sistema incorpora perturbaciones que regresan (los residentes fijos perturban a los móviles, y esos móviles a su vez crean fricción que evita el equilibrio segregante). Es el modelo de «cultivar lo emergente»: no imponer desde afuera, sino fijar condiciones que permitan un reequilibrio.

**Matiz honesto**
El modelo de Schelling es simple: dos tipos, una sola variable (tolerancia). Las ciudades reales tienen N tipos, con precios, arriendo, acceso al empleo, redes de familia. La «vivienda anclada» es un proxy: lo que mide es si fijar una fracción del sistema (que no se adapta) basta para romper el sorting. En ciudades reales, eso corresponde a vivienda pública, propiedad comunitaria, o arriendo regulado: instituciones **irreductibles a las transacciones de mercado**. El 55 % es la cifra del modelo; la verdad urbana es más compleja. Pero el hallazgo es robusto: la segregación **necesita** una intervención estructural, no marginal.

---

*Ver la figura y el encuadre completo en la [tesis de respaldo](/tesis#d7). Resumen canónico con todos los matices en `ciencia/RESULTADOS.md`; código en `ciencia/mega/D7_mega.py`.*
