# Diseño — usabilidad: tooltips + explicadores + deck para la defensa

**Fecha:** 2026-07-10 · **Defensa:** MAÑANA (11-jul). El deck es lo más urgente.
Tres frentes en paralelo, archivos independientes (sin conflicto):

## WS1 — Referencialidad viva en el ENSAYO (web; markdown INTACTO)

El markdown de `ensayo/00_ensayo.md` NO se toca (PDF y `make wordcount` intactos). Se añade una
**capa de enriquecimiento** en el render web.

- **Registro** `web/src/data/refs.ts`: mapa `token → { id, label, kind: 'demo'|'seccion'|'concepto',
  tooltip (1–2 líneas llanas), figura? (ruta), anchor (destino en /tesis) }`. Cubre:
  - D1–D13 (con miniatura de su figura + explicación llana + `/tesis#d{N}`).
  - Secciones/refs: `tesis, D…`, `Vallejo, 2026, §2`→`/tesis#…`, `§4`, `Banco Epistémico Urbano`→§4.
  - `fig. 1`/`fig. 2` (figuras del propio ensayo, D5/D4).
  - ~15–20 conceptos/autores clave: autopoiesis (abierta/cerrada), acoplamiento estructural, Braess,
    Hotelling, Wardrop/PoA, Zipf, Schelling, minimax-regret, symploké (Bueno), función de estatus
    (Searle), cosmotécnica (Hui), no-lugar (Augé), utopía experimental (Lefebvre), métis (Scott),
    policentría (Ostrom), subsidiariedad epistémica (Jasanoff), sociedades de control (Deleuze).
- **Componente** `web/src/components/RefTooltip.tsx`: inline `<a>`/`<span>` con subrayado **punteado
  ámbar** sutil; hover/focus → popover **animado (framer-motion)**: tarjeta con label, explicación
  llana, miniatura (si demo) y enlace «ver en la tesis →»; click en el término = navega a
  `/tesis#anchor`. En móvil: tap abre el popover. Accesible (focusable, `aria`, Esc cierra).
- **Estilos**: archivo NUEVO `web/src/styles/reftooltip.css` (importado en `main.tsx`). NO tocar
  `global.css` ni `deck.css`.
- **Enriquecedor** en `web/src/components/Markdown.tsx`: procesa nodos de texto SOLO cuando renderiza
  el ensayo (prop `enrichRefs`), reemplaza tokens del registro por `<RefTooltip>`. Precisión: usar
  límites de palabra; no re-marcar dentro de headings/figuras; máximo una marca por token repetido si
  satura. Además, el renderer de figuras (`figure`) deriva `id="d{N}"` del caption «Figura N (D{N})»
  para que `/tesis#d10` caiga en esa figura (aplica en tesis).
- **Regla**: no romper el build TS; no tocar el contenido del ensayo/tesis .md.

## WS2 — Explicadores de la ciencia densa (uno por demostración) en /materiales

Nivel: **profesora de filosofía** (intuición primero, mínima fórmula). Un doc corto por pieza en
`docs/ciencia/`: `D1.md … D13.md` + `juegos.md` (Wardrop/Braess + Hotelling) + `decision.md`
(minimax-regret) + `redes.md` (centralidad + difusión). Cada doc, misma plantilla:

1. **¿Qué pregunta?** (una frase).
2. **El algoritmo, paso a paso** (lista numerada, en lenguaje llano — «qué hace el programa»).
3. **Qué halló** (la cifra clave, con su unidad).
4. **Por qué importa** (el puente al argumento autopoiético: computa/cultiva/delibera, abierto/cerrado).
5. **Matiz honesto** (la cautela: sintético vs real, proxy, cota, etc.).

- Registrar los nuevos docs en `web/src/pages/MaterialesPage.tsx` (sección «Evidencia computacional»,
  como tarjetas con visor `/lectura/<slug>`).
- Actualizar `web/scripts/sync-content.mjs` para copiar `docs/ciencia/*.md` →
  `web/public/materiales/ciencia-<basename>.md` (slug plano, sin barras).
- Fuente de verdad de las cifras: `ciencia/RESULTADOS.md` (no inventar). El contenido llano se comparte
  con los tooltips de WS1 (mismo texto, versión corta en el registro).

## WS3 — Deck de la defensa (lo más crítico; para MAÑANA)

`web/src/deck/slides.tsx` (+ viz nuevas en `web/src/deck/`, + `web/src/styles/deck.css`). Objetivos:

- **Más texto, mejor explicado, alineado a tesis y ensayo**: cada slide debe *sostener* la exposición
  (no solo titulares). Beats fieles a la estructura: escena → tesis (autoproducción abierta/cerrada) →
  originalidad → 3 ejes (ontológico/poder/técnica) con su evidencia → viabilidad → cierre. Leé
  `ensayo/00_ensayo.md`, `tesis/00_tesis.md` y `GUION-DEFENSA.md` para el contenido.
- **Animaciones bonitas desde los 13 experimentos**: además de las existentes (TriadViz, SchellingViz=D4,
  MetricCenterViz=D5), añadir **≥1–2 viz nuevas**. Recomendadas por impacto visual: **D12 difusión/
  footfall** (caminata que se esparce sobre la red — la más vistosa) y **D1 Zipf** (rango-tamaño que se
  asienta). Sobrias, on-brand, performantes (framer-motion/canvas/SVG).
- **NO desperdiciar espacio + CABER EN 1080p**: REGLA DURA — cada slide debe caber COMPLETA en
  **1920×1080 sin scroll**. Cambiar `.deck .slide { overflow-y: auto }` a que el contenido quepa
  (contenido presupuestado + `clamp()` afinado); nada de barras de scroll. La `.wrap` puede subir de
  1080px si el contenido lo pide, pero SIEMPRE dentro de 1080px de alto.
- **AUTOVALIDACIÓN 1080p (obligatoria)**: tras editar, `npm run build`, servir `web/dist` con
  `npx serve -s web/dist -l 4178` en background, y para CADA slide N: Chrome headless
  `--window-size=1920,1080 --screenshot` de `http://localhost:4178/presentacion#N`; LEER el PNG y
  confirmar que el contenido cabe (nada cortado, sin scroll). Iterar hasta que TODAS quepan. Reportar
  el veredicto por slide.

## Guardarraíles (los re-corre el orquestador al final)

- `npm run build` compila (TS estricto). `make verify` 0 errores · `make wordcount` OK (ensayo intacto).
- **E2E 1080p**: el orquestador re-valida cada slide del deck a 1920×1080 contra el deploy en vivo
  (`/presentacion#N`) y arregla cualquier overflow.
- Tooltips: hover muestra popover, click navega a `/tesis#anchor` correcto.
- Deploy + **commit y push** (regla del autor).

## Propiedad de archivos (sin colisiones entre agentes)

- WS1: `web/src/data/refs.ts`, `web/src/components/RefTooltip.tsx`, `web/src/components/Markdown.tsx`,
  `web/src/styles/reftooltip.css`, `web/src/main.tsx` (solo el import del css).
- WS2: `docs/ciencia/*.md`, `web/src/pages/MaterialesPage.tsx`, `web/scripts/sync-content.mjs`.
- WS3: `web/src/deck/slides.tsx`, `web/src/deck/*Viz.tsx` (nuevas), `web/src/styles/deck.css`.
- `main.tsx` lo toca solo WS1 (una línea de import). WS2 y WS3 no lo tocan.
