/**
 * Registro de referencialidad viva del ENSAYO.
 *
 * Mapa `token → { id, label, kind, tooltip, figura?, anchor }` que enriquece el
 * render web del ensayo (nunca el markdown fuente). Cada entrada declara los
 * `tokens` de texto que la disparan; el enriquecedor de `Markdown.tsx` los
 * reemplaza por `<RefTooltip>`.
 *
 * Cobertura:
 *  - D1–D13 (miniatura de su figura + explicación llana → `/tesis#d{N}`).
 *  - Secciones de la tesis (`Vallejo, 2026, §2` → §2, `§4` / Banco → §4).
 *  - `fig. 1` / `fig. 2` (figuras del propio ensayo: D5 / D4).
 *  - ~18 conceptos/autores clave.
 *
 * Los anchors de las demos son `d{N}`; los de conceptos y secciones son el
 * `sectionId` (slug) del encabezado real de `/tesis` — derivado con la misma
 * lógica de `lib/content.ts#sectionId`.
 */

export type RefKind = "demo" | "seccion" | "concepto";

export interface RefEntry {
  /** id estable de la entrada. */
  id: string;
  /** título humano de la tarjeta del popover. */
  label: string;
  kind: RefKind;
  /** explicación llana (1–2 líneas) que muestra el popover. */
  tooltip: string;
  /** ruta pública de la miniatura (solo demos con figura). */
  figura?: string;
  /** destino en `/tesis` (id del elemento; sin `#`). */
  anchor: string;
  /** cadenas de texto que disparan la marca en el ensayo. */
  tokens: string[];
}

// Anchors de sección de /tesis (slug de los encabezados reales).
const A_ONT = "1-eje-ontologico-el-modo-de-ser-de-la-ciudad-y-el-de-la-maquina";
const A_TEC = "2-eje-de-la-tecnica-procesar-no-es-producir";
const A_POD = "3-eje-del-poder-quien-computa-la-ciudad-y-con-que-efectos";
const A_SIN = "4-sintesis-el-banco-epistemico-urbano";

const fig = (n: number) => `/figs/D${n}_mega.png`;

export const REFS: RefEntry[] = [
  // ─── Demostraciones D1–D13 ────────────────────────────────────────────────
  {
    id: "d1",
    label: "D1 — Ley de Zipf, rango-tamaño urbano",
    kind: "demo",
    tooltip:
      "¿Por qué el tamaño de las ciudades sigue un patrón matemático casi perfecto? Sin planificador central, el mundo urbano se ordena: la más grande es unas 2 veces la segunda.",
    figura: fig(1),
    anchor: "d1",
    tokens: ["D1"],
  },
  {
    id: "d2",
    label: "D2 — Ley de escala Bettencourt–West",
    kind: "demo",
    tooltip:
      "¿Las ciudades grandes ofrecen más cosas que lo que su tamaño diría? Medida en datos reales sin inyectar supuestos.",
    figura: fig(2),
    anchor: "d2",
    tokens: ["D2"],
  },
  {
    id: "d3",
    label: "D3 — Dimensión fractal",
    kind: "demo",
    tooltip:
      "¿La forma urbana tiene un patrón repetido en todas las escalas (fractal), o existe un tamaño natural de manzana?",
    figura: fig(3),
    anchor: "d3",
    tokens: ["D3"],
  },
  {
    id: "d4",
    label: "D4 — Segregación de Schelling",
    kind: "demo",
    tooltip:
      "Si cada habitante prefiere vivir rodeado de gente como él/ella, ¿emerge la segregación masiva sin que nadie lo ordene?",
    figura: fig(4),
    anchor: "d4",
    tokens: ["D4"],
  },
  {
    id: "d5",
    label: "D5 — Centralidad: la métrica decide el centro",
    kind: "demo",
    tooltip:
      "En una red real de calles, ¿existe un único centro objetivo? O ¿la decisión de qué es central depende de cómo lo midas?",
    figura: fig(5),
    anchor: "d5",
    tokens: ["D5"],
  },
  {
    id: "d6",
    label: "D6 — La métrica del cuerpo: la pendiente desplaza el centro",
    kind: "demo",
    tooltip:
      "El cuerpo que sube por una ladera experimenta una centralidad distinta que la topología plana mide. La fatiga reescribe la geografía.",
    figura: fig(6),
    anchor: "d6",
    tokens: ["D6"],
  },
  {
    id: "d7",
    label: "D7 — Umbral de intervención anti-segregación",
    kind: "demo",
    tooltip:
      "¿Funciona meter vivienda «buena» en una zona segregada para integrarla? Sí, pero exige un compromiso tan fuerte que refuta el laissez-faire.",
    figura: fig(7),
    anchor: "d7",
    tokens: ["D7"],
  },
  {
    id: "d8",
    label: "D8 — Escala ciudad: métrica y cuerpo desplazan el centro",
    kind: "demo",
    tooltip:
      "Al ampliar la escala al territorio real de una ciudad (4 km, 22 mil nodos, laderas de verdad), el desplazamiento entre «flujo» y «cuerpo» se multiplica por tres.",
    figura: fig(8),
    anchor: "d8",
    tokens: ["D8"],
  },
  {
    id: "d9",
    label: "D9 — Robustez: ¿estructura real o artefacto?",
    kind: "demo",
    tooltip:
      "¿Es la prominencia del corredor (D5) una verdadera propiedad del trazado de Medellín, o solo consecuencia de cómo están conectados los nodos? Se comprueba contra 60 redes ficticias.",
    anchor: "d5", // D9 no tiene figura propia; aterriza en la figura D5 que valida (su párrafo de robustez va justo debajo)
    tokens: ["D9"],
  },
  {
    id: "d10",
    label: "D10 — Juego de congestión (Wardrop/Braess)",
    kind: "demo",
    tooltip:
      "Miles de conductores egoístas sobre la red real de Medellín: su equilibrio cuesta solo 3% más que el óptimo (PoA=1,03), y cerrar una calle puede mejorar el flujo de todos (+1,37%).",
    figura: fig(10),
    anchor: "d10",
    tokens: ["D10"],
  },
  {
    id: "d11",
    label: "D11 — Localización de Hotelling (comercio informal)",
    kind: "demo",
    tooltip:
      "Vendedores informales que eligen dónde ubicarse en la red real del centro de Medellín se aglomeran 2,6× más que el óptimo de cobertura: el apiñamiento de Junín es un equilibrio emergente, no un desorden.",
    figura: fig(11),
    anchor: "d11",
    tokens: ["D11"],
  },
  {
    id: "d12",
    label: "D12 — Difusión / footfall e isócronas con pendiente",
    kind: "demo",
    tooltip:
      "El flujo peatonal simulado sale como un campo difuso (el top 1% de nodos concentra solo 2,4%), pero la pendiente encoge el alcance caminable de 15 min: −16% en el centro plano y −24% en la ladera.",
    figura: fig(12),
    anchor: "d12",
    tokens: ["D12"],
  },
  {
    id: "d13",
    label: "D13 — Teoría de la decisión (minimax-regret)",
    kind: "demo",
    tooltip:
      "Cuatro medidas de centralidad rankean nodos casi disjuntos (Jaccard medio 0,03): ningún criterio formal elige «la» métrica correcta sin caer en una patología. Queda un margen que ningún optimizador fija.",
    figura: fig(13),
    anchor: "d13",
    tokens: ["D13"],
  },

  // ─── Figuras del propio ensayo ────────────────────────────────────────────
  {
    id: "fig1",
    label: "Figura 1 — Tres métricas, tres centros (D5)",
    kind: "demo",
    tooltip:
      "La misma red real del centro de Medellín bajo tres centralidades exactas: los «centros» apenas se solapan. El centro no se descubre: se decide.",
    figura: fig(5),
    anchor: "d5",
    tokens: ["fig. 1"],
  },
  {
    id: "fig2",
    label: "Figura 2 — Segregación emergente (D4)",
    kind: "demo",
    tooltip:
      "Segregación emergiendo de preferencias locales leves (Schelling): la ciudad ni la decreta ni la deja al azar; cultiva condiciones y delibera la intervención.",
    figura: fig(4),
    anchor: "d4",
    tokens: ["fig. 2"],
  },

  // ─── Secciones de la tesis ────────────────────────────────────────────────
  {
    id: "sec-tecnica",
    label: "Tesis §2 — Eje de la técnica",
    kind: "seccion",
    tooltip:
      "Sección 2 de la tesis de respaldo: «procesar no es producir». Aloja el experimento propio (T1–T6) que mide el límite de lo computable.",
    anchor: A_TEC,
    tokens: ["Vallejo, 2026, §2", "§2"],
  },
  {
    id: "sec-sintesis",
    label: "Tesis §4 — El Banco Epistémico Urbano",
    kind: "seccion",
    tooltip:
      "Sección 4 de la tesis: la síntesis aplicada. Un banco público de modelos, datos y contra-métricas que la ciudadanía audita y disputa.",
    anchor: A_SIN,
    tokens: ["Vallejo, 2026, §4", "§4"],
  },

  // ─── Conceptos / autores clave ────────────────────────────────────────────
  {
    id: "autopoiesis",
    label: "Autopoiesis (abierta/cerrada)",
    kind: "concepto",
    tooltip:
      "Un sistema autopoiético produce los componentes que a su vez lo producen: la ciudad se hace a sí misma. Abierta, deja disputar sus propias distinciones desde dentro; cerrada, repite siempre las mismas —la retícula del plano, la métrica del mercado— y descarta el resto como ruido.",
    anchor: A_ONT,
    tokens: ["autopoiesis"],
  },
  {
    id: "acoplamiento-estructural",
    label: "Acoplamiento estructural",
    kind: "concepto",
    tooltip:
      "Manera en que un sistema y su entorno se afectan sin que uno programe al otro: la perturbación externa gatilla un cambio, pero es la estructura interna la que decide cuál. Funda la agencia inmanente: quien habita no diseña la ciudad desde afuera, la perturba desde dentro.",
    anchor: A_POD,
    tokens: ["acoplamiento estructural"],
  },
  {
    id: "braess",
    label: "Paradoja de Braess",
    kind: "concepto",
    tooltip:
      "Añadir una vía a una red congestionada puede empeorar el tiempo de todos; y a la inversa, cerrar una calle puede mejorarlo. El óptimo del conjunto no es la suma de las decisiones egoístas individuales.",
    figura: fig(10),
    anchor: "d10",
    tokens: ["paradoja de Braess", "Braess"],
  },
  {
    id: "hotelling",
    label: "Juego de Hotelling",
    kind: "concepto",
    tooltip:
      "Modelo donde vendedores que compiten tienden a agruparse en el mismo punto en vez de repartirse el territorio. Explica por qué el comercio informal se apiña en un foco y no se distribuye para cubrir a todos.",
    figura: fig(11),
    anchor: "d11",
    tokens: ["Hotelling", "juego de localización"],
  },
  {
    id: "wardrop-anarquia",
    label: "Wardrop / precio de la anarquía",
    kind: "concepto",
    tooltip:
      "El equilibrio de Wardrop describe cómo se reparte el tráfico cuando cada quien elige su ruta más rápida. El precio de la anarquía mide cuánto peor es ese reparto egoísta frente al óptimo coordinado: 1,0 significa que coinciden.",
    figura: fig(10),
    anchor: "d10",
    tokens: ["precio de la anarquía", "Wardrop"],
  },
  {
    id: "zipf",
    label: "Ley de Zipf",
    kind: "concepto",
    tooltip:
      "Regularidad estadística: al ordenar las ciudades por tamaño, la segunda es aproximadamente la mitad de la primera, la tercera un tercio, y así (rango × tamaño ≈ constante). Nadie la decreta; emerge del sistema de ciudades.",
    figura: fig(1),
    anchor: "d1",
    tokens: ["ley de Zipf", "Zipf"],
  },
  {
    id: "schelling",
    label: "Modelo de Schelling",
    kind: "concepto",
    tooltip:
      "Autómata donde cada agente solo pide que una fracción mínima de sus vecinos se le parezca. Aun con esa preferencia local leve, emerge una segregación global fuerte que nadie diseñó.",
    figura: fig(4),
    anchor: "d4",
    tokens: ["Schelling"],
  },
  {
    id: "minimax-regret",
    label: "Minimax-regret",
    kind: "concepto",
    tooltip:
      "Criterio de decisión bajo incertidumbre: elige la opción cuyo peor arrepentimiento posible sea el menor. Se usa para probar si algún criterio formal puede elegir «la» métrica correcta —y muestra que no lo hay sin caer en una patología.",
    figura: fig(13),
    anchor: "d13",
    tokens: ["minimax-regret", "minimax regret"],
  },
  {
    id: "symploke",
    label: "Symploké (Bueno)",
    kind: "concepto",
    tooltip:
      "Idea de Gustavo Bueno (de raíz platónica): la realidad no está ni toda conectada ni toda desconectada, sino entrelazada por partes. Algunas cosas se tocan y otras —por fortuna— no, lo que impide tanto el holismo total como el aislamiento total.",
    anchor: A_ONT,
    tokens: ["symploké", "symploke"],
  },
  {
    id: "funcion-estatus",
    label: "Función de estatus (Searle)",
    kind: "concepto",
    tooltip:
      "Concepto de Searle: «X cuenta como Y en el contexto C». Un trozo de papel cuenta como dinero; un nodo cuenta como «central». No son etiquetas inertes: cargan derechos y deberes que la colectividad hace cumplir.",
    anchor: A_POD,
    tokens: ["función de estatus"],
  },
  {
    id: "cosmotecnica",
    label: "Cosmotécnica (Hui)",
    kind: "concepto",
    tooltip:
      "Idea de Yuk Hui: no existe una técnica universal única, sino técnicas ligadas a la cosmovisión del lugar que las produce. Frente al modelo global homogéneo, apuesta por una tecnodiversidad arraigada.",
    anchor: A_TEC,
    tokens: ["cosmotecnia", "cosmotécnica"],
  },
  {
    id: "no-lugar",
    label: "No-lugar (Augé)",
    kind: "concepto",
    tooltip:
      "Marc Augé llama no-lugares a los espacios genéricos e intercambiables —aeropuertos, autopistas, cadenas— sin identidad, relación ni historia. La optimización algorítmica tiende a producirlos: el mismo «centro» eficiente en cualquier ciudad.",
    anchor: A_ONT,
    tokens: ["no-lugar"],
  },
  {
    id: "utopia-experimental",
    label: "Utopía experimental (Lefebvre)",
    kind: "concepto",
    tooltip:
      "Para Lefebvre no es soñar un lugar imposible, sino explorar lo posible ya implicado en lo real. La ciudad posible no exige tecnología inexistente ni un habitante nuevo: recombina lo que Medellín ya tiene.",
    anchor: A_POD,
    tokens: ["utopía experimental"],
  },
  {
    id: "metis",
    label: "Métis (Scott)",
    kind: "concepto",
    tooltip:
      "James Scott recupera la métis griega: el saber práctico, local y situado que no cabe en los esquemas del Estado. La «legibilidad» estatal que ignora esa métis produce fracasos de planificación.",
    anchor: A_POD,
    tokens: ["métis"],
  },
  {
    id: "policentria",
    label: "Policentría (Ostrom)",
    kind: "concepto",
    tooltip:
      "Elinor Ostrom mostró que los bienes comunes pueden gobernarse bien con muchos centros de decisión superpuestos, sin un único poder central ni privatización. Muchas reglas locales anidadas en vez de un plan único.",
    anchor: A_SIN,
    tokens: ["policentría"],
  },
  {
    id: "subsidiariedad-epistemica",
    label: "Subsidiariedad epistémica (Jasanoff)",
    kind: "concepto",
    tooltip:
      "Sheila Jasanoff propone que las decisiones sobre qué cuenta como conocimiento válido se tomen al nivel más local posible, respetando las culturas epistémicas de cada comunidad, en vez de imponer un saber experto único.",
    anchor: A_SIN,
    tokens: ["subsidiariedad epistémica"],
  },
  {
    id: "sociedades-control",
    label: "Sociedades de control (Deleuze)",
    kind: "concepto",
    tooltip:
      "Deleuze describe el paso de las sociedades disciplinarias (encierro: escuela, fábrica, prisión) a las de control, que no encierran sino que modulan sin cesar: «un molde autodeformante que cambia constantemente». La smart city es su forma urbana.",
    anchor: A_POD,
    tokens: ["sociedades de control"],
  },
  {
    id: "banco-epistemico",
    label: "Banco Epistémico Urbano",
    kind: "concepto",
    tooltip:
      "La propuesta aplicada de la tesis: un banco público de modelos, datos y contra-métricas donde la ciudadanía audita y disputa los algoritmos oficiales. Fragmenta en vez de escalar, explora en vez de optimizar, y devuelve al humano la decisión sobre qué es relevante.",
    anchor: A_SIN,
    tokens: ["Banco Epistémico Urbano"],
  },
];

/** Mapa token(minúsculas) → entrada, para resolver la coincidencia. */
export const REF_BY_TOKEN: Map<string, RefEntry> = (() => {
  const m = new Map<string, RefEntry>();
  for (const entry of REFS) {
    for (const tk of entry.tokens) {
      const key = tk.toLowerCase();
      if (!m.has(key)) m.set(key, entry);
    }
  }
  return m;
})();

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Fuente del patrón combinado: alternativas ordenadas por longitud desc. */
export const REF_PATTERN_SOURCE: string = (() => {
  const tokens = Array.from(
    new Set(REFS.flatMap((e) => e.tokens)),
  ).sort((a, b) => b.length - a.length);
  const alts = tokens.map(escapeRegExp).join("|");
  // Límite de palabra unicode: el token no puede ir pegado a letra/dígito/_.
  return `(?<![\\p{L}\\p{N}_])(?:${alts})(?![\\p{L}\\p{N}_])`;
})();

/** Nuevo matcher global (lastIndex reiniciado en cada llamada). */
export function createRefMatcher(): RegExp {
  return new RegExp(REF_PATTERN_SOURCE, "giu");
}
