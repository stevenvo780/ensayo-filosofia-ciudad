import { useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

/**
 * Widget explicativo (D1): la ley de Zipf rango-tamaño. Sobre un sistema de
 * ciudades, el tamaño cae como 1/rango^q con q≈1 — jerarquía que NADIE decreta.
 * Los puntos "se asientan" sobre la recta log-log y el ajuste se dibuja solo.
 * Botones: el mismo patrón se sostiene por país (evidencia de auto-organización).
 */

const N = 46;
const W = 440;
const H = 300;
const ML = 46;
const MB = 40;
const MT = 16;
const MR = 16;
const PW = W - ML - MR;
const PH = H - MT - MB;

interface System {
  key: string;
  label: string;
  q: number;
  r2: string;
  n: string;
  scatter: number;
}

const SYSTEMS: readonly System[] = [
  { key: "mundo", label: "Mundo", q: 1.006, r2: "0.984", n: "33.933 ciudades", scatter: 0.1 },
  { key: "colombia", label: "Colombia", q: 1.063, r2: "0.997", n: "319 ciudades", scatter: 0.06 },
  { key: "eeuu", label: "EE. UU.", q: 0.79, r2: "0.95", n: "≈3.100 ciudades", scatter: 0.14 },
];

function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Puntos rango-tamaño en coordenadas log-log, con dispersión realista. */
function buildPoints(q: number, scatter: number) {
  const rnd = mulberry32(97);
  const logRmax = Math.log(N);
  const pts: { x: number; y: number; r: number; noisy: number }[] = [];
  // tamaño ideal = 1/r^q ; log-tamaño = -q·log r. Normalizamos a [0,1].
  const yTop = 0; // log-size en r=1 (mayor)
  const yBot = -q * logRmax; // log-size en r=N (menor)
  for (let r = 1; r <= N; r++) {
    const logR = Math.log(r);
    const ideal = -q * logR;
    const noisy = ideal + (rnd() - 0.5) * scatter * logRmax;
    const x = ML + (logR / logRmax) * PW;
    const yNorm = (noisy - yBot) / (yTop - yBot); // 0..1
    const y = MT + (1 - yNorm) * PH;
    pts.push({ x, y, r, noisy });
  }
  // recta de ajuste (ideal, sin ruido): de r=1 a r=N
  return pts;
}

export function ZipfViz() {
  const reduce = useReducedMotion();
  const [sys, setSys] = useState(0);
  const [settled, setSettled] = useState(reduce);
  const s = SYSTEMS[sys];
  const pts = useMemo(() => buildPoints(s.q, s.scatter), [s]);

  // "asentar" al montar / cambiar de sistema
  useEffect(() => {
    if (reduce) {
      setSettled(true);
      return;
    }
    setSettled(false);
    const t = window.setTimeout(() => setSettled(true), 60);
    return () => window.clearTimeout(t);
  }, [sys, reduce]);

  const jitter = useMemo(() => {
    const rnd = mulberry32(3);
    return pts.map(() => MT + rnd() * PH);
  }, [pts]);

  const x1 = ML;
  const y1 = MT;
  const x2 = ML + PW;
  const y2 = MT + PH;

  return (
    <div className="metricviz zipfviz">
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Ley de Zipf rango-tamaño: el tamaño cae como 1/rango, q≈1">
        {/* ejes */}
        <line x1={ML} y1={MT} x2={ML} y2={y2} stroke="#3a5566" strokeWidth={1} />
        <line x1={ML} y1={y2} x2={x2} y2={y2} stroke="#3a5566" strokeWidth={1} />
        <text x={ML - 8} y={MT + 6} fill="#9db0bd" fontSize={11} textAnchor="end">
          tamaño
        </text>
        <text x={x2} y={y2 + 26} fill="#9db0bd" fontSize={11} textAnchor="end">
          rango →
        </text>
        {/* recta de ajuste Zipf (se dibuja al asentar) */}
        <motion.line
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke="#e8934f"
          strokeWidth={2.2}
          strokeDasharray="6 5"
          initial={reduce ? false : { pathLength: 0, opacity: 0 }}
          animate={settled ? { pathLength: 1, opacity: 0.9 } : { pathLength: 0, opacity: 0 }}
          transition={{ duration: 0.9, delay: 0.5, ease: "easeInOut" }}
        />
        {/* puntos ciudad: se asientan sobre la recta */}
        {pts.map((p, i) => (
          <motion.circle
            key={`${s.key}-${i}`}
            cx={p.x}
            fill="#5fc7d4"
            r={2.6}
            initial={reduce ? false : { cy: jitter[i], opacity: 0.15 }}
            animate={settled ? { cy: p.y, opacity: 0.85 } : { cy: jitter[i], opacity: 0.15 }}
            transition={{ duration: 0.7, delay: reduce ? 0 : 0.02 * i, ease: [0.2, 0.75, 0.25, 1] }}
          />
        ))}
      </svg>
      <div className="metricviz-controls" role="group" aria-label="Sistema urbano">
        {SYSTEMS.map((mm, i) => (
          <button
            key={mm.key}
            type="button"
            className={i === sys ? "on" : ""}
            onClick={(e) => {
              e.stopPropagation();
              setSys(i);
            }}
          >
            {mm.label}
          </button>
        ))}
      </div>
      <div className="metricviz-caption">
        <strong>q = {s.q.toFixed(3)}</strong> · R² = {s.r2} · {s.n}. La jerarquía de tamaños emerge
        sin planificador central.
      </div>
    </div>
  );
}
