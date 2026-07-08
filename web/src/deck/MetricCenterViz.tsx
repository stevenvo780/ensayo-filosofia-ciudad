import { useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

/**
 * Widget explicativo: sobre una MISMA red, calcula en vivo tres medidas de
 * centralidad (betweenness, closeness, eigenvector) y muestra cómo el "centro"
 * SALTA a otro nodo según la métrica. Es la tesis D5 hecha interactiva:
 * el centro no se descubre, se decide.
 */

interface Graph {
  x: number[];
  y: number[];
  adj: number[][];
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

/** Red tipo retícula irregular (aire de calle) con jitter y calles faltantes. */
function buildGraph(): Graph {
  const rnd = mulberry32(7);
  const cols = 8;
  const rows = 6;
  const W = 400;
  const H = 300;
  const x: number[] = [];
  const y: number[] = [];
  const idx = (r: number, c: number) => r * cols + c;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      x.push(28 + (c / (cols - 1)) * (W - 56) + (rnd() - 0.5) * 22);
      y.push(26 + (r / (rows - 1)) * (H - 52) + (rnd() - 0.5) * 22);
    }
  }
  const n = rows * cols;
  const adj: number[][] = Array.from({ length: n }, () => []);
  const link = (a: number, b: number) => {
    if (!adj[a].includes(b)) {
      adj[a].push(b);
      adj[b].push(a);
    }
  };
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (c < cols - 1 && rnd() < 0.86) link(idx(r, c), idx(r, c + 1));
      if (r < rows - 1 && rnd() < 0.86) link(idx(r, c), idx(r + 1, c));
      if (r < rows - 1 && c < cols - 1 && rnd() < 0.12) link(idx(r, c), idx(r + 1, c + 1));
    }
  }
  // garantizar conexión mínima: une cada nodo aislado a un vecino de retícula
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (adj[idx(r, c)].length === 0) {
        if (c < cols - 1) link(idx(r, c), idx(r, c + 1));
        else if (r < rows - 1) link(idx(r, c), idx(r + 1, c));
      }
    }
  }
  return { x, y, adj };
}

function bfsDist(adj: number[][], s: number): number[] {
  const dist = new Array(adj.length).fill(-1);
  dist[s] = 0;
  const q = [s];
  for (let h = 0; h < q.length; h++) {
    const v = q[h];
    for (const w of adj[v]) if (dist[w] < 0) {
      dist[w] = dist[v] + 1;
      q.push(w);
    }
  }
  return dist;
}

function betweenness(g: Graph): number[] {
  const n = g.adj.length;
  const bc = new Array(n).fill(0);
  for (let s = 0; s < n; s++) {
    const stack: number[] = [];
    const pred: number[][] = Array.from({ length: n }, () => []);
    const sigma = new Array(n).fill(0);
    const dist = new Array(n).fill(-1);
    sigma[s] = 1;
    dist[s] = 0;
    const q = [s];
    for (let h = 0; h < q.length; h++) {
      const v = q[h];
      stack.push(v);
      for (const w of g.adj[v]) {
        if (dist[w] < 0) {
          dist[w] = dist[v] + 1;
          q.push(w);
        }
        if (dist[w] === dist[v] + 1) {
          sigma[w] += sigma[v];
          pred[w].push(v);
        }
      }
    }
    const delta = new Array(n).fill(0);
    while (stack.length) {
      const w = stack.pop()!;
      for (const v of pred[w]) delta[v] += (sigma[v] / sigma[w]) * (1 + delta[w]);
      if (w !== s) bc[w] += delta[w];
    }
  }
  return bc;
}

function closeness(g: Graph): number[] {
  const n = g.adj.length;
  return g.x.map((_, s) => {
    const d = bfsDist(g.adj, s);
    let sum = 0;
    let reach = 0;
    for (let i = 0; i < n; i++) if (d[i] > 0) {
      sum += d[i];
      reach++;
    }
    return sum > 0 ? reach / sum : 0;
  });
}

function eigenvector(g: Graph): number[] {
  const n = g.adj.length;
  let v = new Array(n).fill(1 / Math.sqrt(n));
  for (let it = 0; it < 120; it++) {
    const nv = new Array(n).fill(0);
    for (let i = 0; i < n; i++) for (const j of g.adj[i]) nv[i] += v[j];
    const norm = Math.hypot(...nv) || 1;
    v = nv.map((z) => z / norm);
  }
  return v.map((z) => Math.abs(z));
}

const normalize = (a: number[]) => {
  const m = Math.max(...a) || 1;
  return a.map((z) => z / m);
};

const METRICS = [
  { key: "betweenness", label: "Betweenness", gloss: "intermediación (cruces de paso)" },
  { key: "closeness", label: "Closeness", gloss: "cercanía (accesibilidad media)" },
  { key: "eigenvector", label: "Eigenvector", gloss: "conectividad recursiva" },
] as const;

export function MetricCenterViz() {
  const reduce = useReducedMotion();
  const g = useMemo(buildGraph, []);
  const values = useMemo(
    () => [normalize(betweenness(g)), normalize(closeness(g)), normalize(eigenvector(g))],
    [g],
  );
  const [m, setM] = useState(0);

  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => setM((i) => (i + 1) % 3), 3000);
    return () => clearInterval(id);
  }, [reduce]);

  const val = values[m];
  const center = val.indexOf(Math.max(...val));

  return (
    <div className="metricviz">
      <svg viewBox="0 0 400 300" role="img" aria-label="La métrica decide el centro">
        {g.adj.map((nbrs, i) =>
          nbrs.map((j) =>
            j > i ? (
              <line
                key={`${i}-${j}`}
                x1={g.x[i]}
                y1={g.y[i]}
                x2={g.x[j]}
                y2={g.y[j]}
                stroke="#3a5566"
                strokeWidth={0.8}
                opacity={0.6}
              />
            ) : null,
          ),
        )}
        {g.x.map((_, i) => (
          <motion.circle
            key={i}
            cx={g.x[i]}
            cy={g.y[i]}
            fill="#5fc7d4"
            animate={{ r: 2.5 + val[i] * 8, opacity: 0.35 + val[i] * 0.6 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
        ))}
        {/* halo del centro: se desliza al nuevo nodo cuando cambia la métrica */}
        <motion.circle
          fill="none"
          stroke="#e8934f"
          strokeWidth={2.4}
          animate={{ cx: g.x[center], cy: g.y[center], r: [16, 13] }}
          transition={{ cx: { duration: 0.7 }, cy: { duration: 0.7 }, r: { repeat: Infinity, duration: 1.4, repeatType: "reverse" } }}
        />
        <motion.circle
          fill="#e8934f"
          animate={{ cx: g.x[center], cy: g.y[center] }}
          transition={{ duration: 0.7 }}
          r={4.5}
        />
      </svg>
      <div className="metricviz-controls" role="group" aria-label="Métrica">
        {METRICS.map((mm, i) => (
          <button
            key={mm.key}
            type="button"
            className={i === m ? "on" : ""}
            onClick={(e) => {
              e.stopPropagation();
              setM(i);
            }}
          >
            {mm.label}
          </button>
        ))}
      </div>
      <div className="metricviz-caption">
        Centro por <strong>{METRICS[m].label}</strong> — {METRICS[m].gloss}. La misma red, otro
        centro.
      </div>
    </div>
  );
}
