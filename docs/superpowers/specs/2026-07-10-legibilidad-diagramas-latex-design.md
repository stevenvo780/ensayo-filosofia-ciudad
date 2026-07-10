# Diseño — legibilidad: figuras intercaladas + diagramas + LaTeX

**Fecha:** 2026-07-10 · **Autor:** Steven Vallejo Ortiz (orquestado, asistido por IA)
**Objetivo:** subir la legibilidad del ensayo y la tesis sin tocar el argumento ni las cifras:
(1) intercalar las demostraciones dentro del texto, (2) añadir 6 diagramas conceptuales que hagan
digerible la teoría densa, (3) introducir notación LaTeX real, (4) que todo se vea cuidado.

## Restricción rectora: fuente única, dos destinos

El markdown de `ensayo/00_ensayo.md` y `tesis/00_tesis.md` es la **fuente única**. De ahí salen la
web (React/Vite) y el PDF (solo el ensayo). Nada se edita en dos lugares.

- **Math:** se escribe LaTeX inline `$…$` o display `$$…$$` en el markdown.
  - Web lo renderiza con **KaTeX** (`remark-math` + `rehype-katex`, ya cableado en
    `web/src/components/Markdown.tsx`; CSS en `web/src/main.tsx`).
  - El PDF con **MathML nativo** (`pandoc --mathml`, ya añadido en `scripts/build-pdf.sh`;
    Chrome 149 lo pinta sin CDN → PDF autocontenido). **Verificado**: `q≈1` y la BPR renderizan
    perfecto en el PDF.
- **Diagramas:** archivos **SVG** en `ciencia/figs/diagramas/`, referenciados desde el markdown como
  `![alt](../ciencia/figs/diagramas/NOMBRE.svg)`. `sync-content.mjs` ya los copia a
  `web/public/figs/diagramas/`; pandoc los incrusta como data-URI. **Verificado** end-to-end.

## Contrato de estilo SVG (OBLIGATORIO — para que los 6 diagramas sean uno solo)

Referencia canónica ya construida: **`ciencia/figs/diagramas/abierta-cerrada.svg`**. Todo diagrama
nuevo copia EXACTAMENTE estos tokens (abrir ese archivo y calcarlo):

- **Lienzo:** `viewBox="0 0 820 H"` (H≈420–470 según contenido, apaisado). Tarjeta de fondo:
  `<rect x="1.5" y="1.5" width="817" height="H-3" rx="18" fill="#faf7f2" stroke="#e7ddcf" stroke-width="1.5"/>`.
- **Paleta:** ámbar primario `#b25a24`; ámbar-línea `#c98a5c`; carbón (labels) `#3a352f`;
  apagado (sublabels) `#8a8178`; flecha-gris `#a99f92`; inactivo/ruido `#ded5c7`; caption
  `#6b6459`/`#514b43`; divisores `#e6dccc`/`#ece3d5`. **Nunca** otros colores.
- **Tipografías** (system-safe, se ven igual en web y PDF): títulos y captions
  `Georgia, 'Times New Roman', serif`; etiquetas/labels
  `ui-monospace, 'SF Mono', Menlo, Consolas, monospace`.
- **Tamaños:** título de panel 17 bold ámbar (letter-spacing .04em); sublabel mono 9.5 `#8a8178`;
  labels de nodo mono 10.5 `#3a352f`; captions en Georgia italic 11 `#6b6459`; caption inferior
  Georgia 11.5 `#514b43`.
- **Nodos:** círculos r 4.5–6 `fill #b25a24`; "compuertas"/cajas rounded-rect rx 8–9 `fill #b25a24`
  con texto `#fdf7f0`.
- **Flechas:** dos markers (gris `#a99f92`, ámbar `#b25a24`) como en la referencia; stroke-width 1.3–1.6.
- **Aire generoso, composición balanceada, CERO saturación.** Incluir `role="img"` y `aria-label`.
- **Autoverificación:** cada agente renderiza su SVG a PNG con Chrome headless
  (`--headless=new --no-sandbox --screenshot=out.png --force-device-scale-factor=2 --window-size=820,H file://…`)
  y LO LEE (Read del PNG) para confirmar que se ve bien y on-brand antes de terminar. Si algo se
  ve amateur o desalineado, corregir y volver a renderizar.

## Los 6 diagramas

| Archivo | Concepto | Composición (resumen) | Dónde se usa |
|---|---|---|---|
| `abierta-cerrada.svg` ✅ HECHO | Autopoiesis cerrada vs abierta | izq: entradas→1 distinción→"orden", resto=ruido; der: triángulo de distinciones + bucle "reingreso" | ensayo §tesis · tesis §0/§1 |
| `triada.svg` | Computa · Cultiva · Delibera | 3 tarjetas/columnas: cada registro con su criterio y su ejemplo (computa: algoritmo exacto/verdad de referencia → rutas, acueductos; cultiva: fija condiciones, no decreta → suelo, usos; delibera: relevancia que ningún optimizador se fija → qué se mide) | ensayo §tesis · tesis §2 |
| `acoplamiento.svg` | Agencia inmanente / acoplamiento estructural | "quien habita" perturba desde dentro → la perturbación GATILLA (chispa) pero la ESTRUCTURA determina el cambio viable (no lo especifica); contraste tachado con "soberano: programa desde afuera" | ensayo §técnica (agencia) · tesis §1/§3 |
| `tres-ejes.svg` | Mapa de los 3 ejes | 3 columnas: Ontológico («¿de qué está hecha?»), Poder («¿quién mide/decide?»), Técnica («¿superar el funcionalismo sin repetirlo?») con una línea-guía cada uno | tesis §0 (mapa) · ensayo opcional |
| `corte-modal.svg` | El corte por aspecto, no por asunto | un semáforo descompuesto en 3 aspectos: núcleo computable (timing), métrica disputable (a quién se prioriza), efectos emergentes (cómo se apropia la gente) → "por aspecto, no por asunto" | ensayo §cierre · tesis §síntesis |
| `banco-epistemico.svg` | Banco Epistémico Urbano | izq: 1 modelo gigante opaco («escala»); der: banco público fragmentado (modelos+datos+contra-métricas; juntas/veedurías computan la contraria) («fragmenta») | tesis §4 |

**Asignación de modelos** (paralelo, sin conflicto — cada uno escribe su propio archivo):
`triada`→Codex · `tres-ejes`→Codex · `acoplamiento`→Opus · `corte-modal`→Opus · `banco-epistemico`→Gemini.

## Inventario de ecuaciones LaTeX (las produce y ubica el agente "math", Codex)

Se insertan donde el argumento ya las nombra (tesis: todas; ensayo: 1–2 ligeras). El agente devuelve
para cada una: el LaTeX exacto, el documento, la sección y la frase-ancla tras la cual va. Candidatas:
Zipf rango-tamaño `$\text{rango} \times \text{tamaño}^{q} \approx \text{cte},\ q\approx 1$`; escala
Bettencourt–West `$Y \propto N^{\beta},\ \beta\approx 0{,}90$`; coste BPR
`$t_a(x)=t_a^{0}\!\left(1+0{,}15\left(\tfrac{x}{c_a}\right)^{4}\right)$`; PoA
`$\mathrm{PoA}=\mathrm{TSTT}_{\text{UE}}/\mathrm{TSTT}_{\text{SO}}\approx 1{,}03$`; Jaccard
`$J(A,B)=\dfrac{|A\cap B|}{|A\cup B|}$`; Tobler `$v(s)=6\,e^{-3{,}5\left|s+0{,}05\right|}$`;
minimax-regret `$\arg\min_{a}\max_{\theta}\big(R(a,\theta)\big)$`. **Regla dura:** el LaTeX no debe
introducir cifras que rompan `make verify` — usar exactamente los valores canónicos de
`ciencia/RESULTADOS.md` (PoA 1,03; β 0,90; etc.) y preferir símbolos donde se pueda.

## Reestructura de la TESIS (agente Opus, edita solo `tesis/00_tesis.md`)

- **Matar el Apéndice-vertedero:** mover cada bloque `**Figura N (Dx) — …** … ![…](…)` del
  `## Apéndice` (líneas ~153–193) a la sección donde su demostración se argumenta (leer la prosa y
  ubicar: D1/D2/D3→§1 ontológico; D4/D7/D10/D12→§2 técnica; D5/D6/D8/D11→§1/§3; D13→§3 poder).
- **PRESERVAR cada caption VERBATIM** (cargan cifras que audita `make verify`). Es un MOVE, no un
  reescribir. No cambiar ni un dígito.
- Actualizar referencias en prosa "Figura N": preferir citar por `Dx` (estable); si una referencia
  por número queda descolocada, corregirla.
- Intercalar los 6 diagramas y las ecuaciones en sus anclas. Tras vaciar el Apéndice, dejar solo un
  puntero corto a `ciencia/RESULTADOS.md` (o eliminarlo).

## Plan del ENSAYO (agente Opus, edita solo `ensayo/00_ensayo.md`, ≤2500 palabras)

- Añadir **2–3 diagramas**: `abierta-cerrada` tras el párrafo "La tesis"; `triada` cerca de
  computa/cultiva/delibera; `acoplamiento` junto al párrafo de agencia (§3).
- Math **ligera**: máximo 1–2 ecuaciones elegantes (p.ej. Zipf y/o Jaccard) donde ya se nombran.
- **REGLA DE CONTEO:** toda caption de figura/diagrama DEBE empezar con `*Figura N —` (así
  `make wordcount` la excluye, igual que las imágenes y encabezados). Correr `make wordcount` y
  confirmar `OK` (≤2500). Las ecuaciones inline suman palabras despreciables pero verificar.

## Guardarraíles (los re-corre el orquestador al final)

- `make verify` = 0 errores (cifras intactas). `make wordcount` = OK (ensayo ≤2500).
- `npm run build` compila (KaTeX+SVG). `make pdf` renderiza math+SVG (ya verificado con smoke test).
- Consistencia visual de los 6 SVG (pase de armonización Opus + revisión del orquestador).
- Deploy a producción + **commit y push** (regla del autor: a cada cambio).

## Fuera de alcance (YAGNI)

- No pipeline XeLaTeX (se descartó: divergiría web/PDF). No TikZ. No animaciones nuevas.
- No reescribir el argumento (eso fue la ronda autopoiética previa; la crítica de densidad de Gemini
  se atiende con los diagramas, no reescribiendo el texto salvo micro-anclas para las figuras).
