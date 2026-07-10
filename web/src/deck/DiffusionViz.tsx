import { useEffect, useMemo, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

/**
 * Widget explicativo (D12): difusión / footfall sobre la red real. Una caminata
 * de 15 min se ESPARCE desde un origen y colorea la red por tiempo de llegada
 * (isócrona). En la ladera, el esfuerzo de la pendiente ENCOGE el alcance
 * (−24 % vs −16 % en el plano). El footfall es un campo relacional cerrado sobre
 * la propia red —clausura operacional— que el terreno reescribe.
 */

const W = 440;
const H = 300;
const COLS = 16;
const ROWS = 11;

interface Graph {
  x: number[];
  y: number[];
  elev: number[]; // 0 (plano) .. 1 (ladera alta)
  adj: number[][];
  src: number;
}

function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function buildGraph(): Graph {
  const rnd = mulberry32(11);
  const x: number[] = [];
  const y: number[] = [];
  const elev: number[] = [];
  const idx = (r: number, c: number) => r * COLS + c;
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      x.push(24 + (c / (COLS - 1)) * (W - 48) + (rnd() - 0.5) * 14);
      y.push(20 + (r / (ROWS - 1)) * (H - 40) + (rnd() - 0.5) * 14);
      // la ladera sube hacia la derecha (col alta) con algo de textura
      const e = c / (COLS - 1);
      elev.push(Math.min(1, Math.max(0, e * 0.9 + (rnd() - 0.5) * 0.12)));
    }
  }
  const n = ROWS * COLS;
  const adj: number[][] = Array.from({ length: n }, () => []);
  const link = (a: number, b: number) => {
    if (!adj[a].includes(b)) {
      adj[a].push(b);
      adj[b].push(a);
    }
  };
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (c < COLS - 1 && rnd() < 0.9) link(idx(r, c), idx(r, c + 1));
      if (r < ROWS - 1 && rnd() < 0.9) link(idx(r, c), idx(r + 1, c));
    }
  }
  for (let i = 0; i < n; i++) {
    if (adj[i].length === 0) {
      const c = i % COLS;
      const r = Math.floor(i / COLS);
      if (c < COLS - 1) link(i, i + 1);
      else if (r < ROWS - 1) link(i, i + COLS);
    }
  }
  const src = idx(Math.floor(ROWS / 2), 2); // origen a la izquierda (base plana)
  return { x, y, elev, adj, src };
}

/** Dijkstra ponderado por esfuerzo de pendiente (Tobler-lite). */
function times(g: Graph, slope: number): { dist: number[]; max: number } {
  const n = g.adj.length;
  const dist = new Array(n).fill(Infinity);
  dist[g.src] = 0;
  const seen = new Array(n).fill(false);
  for (let it = 0; it < n; it++) {
    let u = -1;
    let best = Infinity;
    for (let i = 0; i < n; i++) if (!seen[i] && dist[i] < best) {
      best = dist[i];
      u = i;
    }
    if (u < 0) break;
    seen[u] = true;
    for (const v of g.adj[u]) {
      const base = Math.hypot(g.x[u] - g.x[v], g.y[u] - g.y[v]);
      // subir cuesta más; el factor "slope" intensifica la penalización de pendiente
      const up = Math.max(0, g.elev[v] - g.elev[u]);
      const cost = base * (1 + slope * up * 9);
      if (dist[u] + cost < dist[v]) dist[v] = dist[u] + cost;
    }
  }
  let max = 0;
  for (let i = 0; i < n; i++) if (dist[i] < Infinity && dist[i] > max) max = dist[i];
  return { dist, max };
}

const MODES = [
  { key: "plano", label: "Centro plano", slope: 0, note: "isócrona 15 min · −16 %" },
  { key: "ladera", label: "Ladera", slope: 1, note: "isócrona 15 min · −24 %" },
] as const;

export function DiffusionViz() {
  const reduce = useReducedMotion();
  const g = useMemo(buildGraph, []);
  const [mode, setMode] = useState(0);
  // el frente "15 min" es un presupuesto ABSOLUTO fijo (medido sobre el plano):
  // en la ladera, el mayor esfuerzo alcanza MENOS nodos con el mismo tiempo.
  const flat = useMemo(() => times(g, 0), [g]);
  const { dist } = useMemo(() => times(g, MODES[mode].slope), [g, mode]);
  const ref15 = flat.max * 0.94;
  const [t, setT] = useState(reduce ? 1 : 0);
  const raf = useRef<number>(0);

  // frente de difusión que crece y reinicia
  useEffect(() => {
    if (reduce) {
      setT(1);
      return;
    }
    setT(0);
    let start = 0;
    const dur = 2600;
    const hold = 900;
    const tick = (now: number) => {
      if (!start) start = now;
      const e = (now - start) % (dur + hold);
      setT(e < dur ? e / dur : 1);
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [mode, reduce]);

  const front = t * ref15;
  // alcance: nodos dentro de la isócrona actual (mismo presupuesto para ambos)
  const reached = dist.filter((d) => d <= front).length;
  const pct = Math.round((reached / dist.length) * 100);

  return (
    <div className="metricviz diffuseviz">
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Difusión de una caminata de 15 min sobre la red; la pendiente encoge el alcance">
        {g.adj.map((nbrs, i) =>
          nbrs.map((j) => {
            if (j <= i) return null;
            const on = dist[i] <= front && dist[j] <= front;
            return (
              <line
                key={`${i}-${j}`}
                x1={g.x[i]}
                y1={g.y[i]}
                x2={g.x[j]}
                y2={g.y[j]}
                stroke={on ? "#5fc7d4" : "#2b3d4a"}
                strokeWidth={on ? 1.4 : 0.7}
                opacity={on ? 0.7 : 0.5}
              />
            );
          }),
        )}
        {g.x.map((_, i) => {
          const reachedNode = dist[i] <= front;
          const frac = dist[i] === Infinity ? 1 : dist[i] / (flat.max || 1);
          return (
            <circle
              key={i}
              cx={g.x[i]}
              cy={g.y[i]}
              r={reachedNode ? 3.4 : 2}
              fill={reachedNode ? "#5fc7d4" : "#2f4351"}
              opacity={reachedNode ? 1 - frac * 0.45 : 0.5}
            />
          );
        })}
        {/* origen */}
        <circle cx={g.x[g.src]} cy={g.y[g.src]} r={6} fill="#e8934f" />
        <circle cx={g.x[g.src]} cy={g.y[g.src]} r={9} fill="none" stroke="#e8934f" strokeWidth={1.4} opacity={0.5} />
      </svg>
      <div className="metricviz-controls" role="group" aria-label="Terreno">
        {MODES.map((mm, i) => (
          <button
            key={mm.key}
            type="button"
            className={i === mode ? "on" : ""}
            onClick={(e) => {
              e.stopPropagation();
              setMode(i);
            }}
          >
            {mm.label}
          </button>
        ))}
      </div>
      <div className="metricviz-caption">
        <strong>{MODES[mode].note}</strong> · alcanza {pct}% de la red. El terreno reescribe el
        alcance del cuerpo que camina.
      </div>
    </div>
  );
}
