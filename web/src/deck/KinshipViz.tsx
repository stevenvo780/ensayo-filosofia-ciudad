import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

/**
 * Diagrama de originalidad (slide «Tiene parientes; se distingue por el
 * fundamento»): los cuatro parientes —Scott, Ostrom, Healey, Jasanoff— se
 * conectan a un NÚCLEO común. Cada uno asigna por su propio criterio (prudencia,
 * jurisdicción, escala…); este trabajo asigna por un LÍMITE CATEGORIAL —computa /
 * cultiva / delibera—, mostrado como el núcleo triádico al que todos convergen.
 * SVG + framer-motion; respeta prefers-reduced-motion (estado final estático).
 */

const VW = 940;
const VH = 250;
const CX = 470;
const CY = 122;
const R = 37;

const TEAL = "#5fc7d4";
const GREEN = "#6fcf97";
const AMBER = "#e8934f";

interface Kin {
  name: string;
  lens: string;
  by: string; // por qué asigna ELLOS (lo que este trabajo NO usa)
  x: number;
  y: number;
  side: 1 | -1; // -1 izquierda (ancla a la derecha), 1 derecha (ancla a la izquierda)
}

const HALF_W = 104;
const HALF_H = 25;

const KIN: readonly Kin[] = [
  { name: "Scott", lens: "métis", by: "prudencia ante fracasos", x: 128, y: 56, side: -1 },
  { name: "Ostrom", lens: "policentría", by: "jurisdicción", x: 128, y: 188, side: -1 },
  { name: "Healey", lens: "deliberación", by: "procedimiento", x: 812, y: 56, side: 1 },
  { name: "Jasanoff", lens: "subsidiariedad", by: "escala", x: 812, y: 188, side: 1 },
];

function pt(cx: number, cy: number, r: number, deg: number) {
  const a = ((deg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
}

function arc(cx: number, cy: number, r: number, a1: number, a2: number) {
  const s = pt(cx, cy, r, a1);
  const e = pt(cx, cy, r, a2);
  const large = a2 - a1 > 180 ? 1 : 0;
  return `M ${s.x.toFixed(2)} ${s.y.toFixed(2)} A ${r} ${r} 0 ${large} 1 ${e.x.toFixed(2)} ${e.y.toFixed(2)}`;
}

const SEGMENTS = [
  { label: "computa", color: TEAL, a1: 6, a2: 114 },
  { label: "cultiva", color: GREEN, a1: 126, a2: 234 },
  { label: "delibera", color: AMBER, a1: 246, a2: 354 },
];

export function KinshipViz() {
  const reduce = useReducedMotion();
  const [on, setOn] = useState(reduce);

  useEffect(() => {
    if (reduce) {
      setOn(true);
      return;
    }
    setOn(false);
    const id = window.setTimeout(() => setOn(true), 80);
    return () => window.clearTimeout(id);
  }, [reduce]);

  return (
    <div className="metricviz kinviz">
      <svg viewBox={`0 0 ${VW} ${VH}`} role="img" aria-label="Cuatro parientes convergen a un núcleo: el límite categorial (computa, cultiva, delibera)">
        {/* Conectores parientes → núcleo */}
        {KIN.map((k, i) => {
          const ax = k.x - k.side * HALF_W;
          const ay = k.y;
          const dir = { x: CX - ax, y: CY - ay };
          const len = Math.hypot(dir.x, dir.y) || 1;
          const ex = CX - (dir.x / len) * (R + 11);
          const ey = CY - (dir.y / len) * (R + 11);
          const mx = (ax + ex) / 2;
          const my = (ay + ey) / 2 - 16;
          return (
            <g key={k.name}>
              <motion.path
                d={`M ${ax} ${ay} Q ${mx} ${my} ${ex} ${ey}`}
                fill="none"
                stroke={TEAL}
                strokeWidth={1.5}
                strokeDasharray="1 5"
                strokeLinecap="round"
                initial={reduce ? false : { pathLength: 0, opacity: 0 }}
                animate={on ? { pathLength: 1, opacity: 0.6 } : { pathLength: 0, opacity: 0 }}
                transition={{ duration: 0.7, delay: 0.35 + i * 0.12, ease: "easeInOut" }}
              />
              {!reduce && (
                <motion.circle
                  r={2.6}
                  fill={TEAL}
                  initial={{ opacity: 0 }}
                  animate={{
                    cx: [ax, ex],
                    cy: [ay, ey],
                    opacity: [0, 0.9, 0.9, 0],
                  }}
                  transition={{
                    duration: 2.2,
                    delay: 0.9 + i * 0.12,
                    repeat: Infinity,
                    repeatDelay: 1.1,
                    ease: "easeIn",
                  }}
                />
              )}
            </g>
          );
        })}

        {/* Núcleo triádico */}
        <motion.g
          initial={reduce ? false : { scale: 0.6, opacity: 0 }}
          animate={on ? { scale: 1, opacity: 1 } : { scale: 0.6, opacity: 0 }}
          transition={{ duration: 0.55, ease: [0.2, 0.75, 0.25, 1] }}
          style={{ transformOrigin: `${CX}px ${CY}px` }}
        >
          <circle cx={CX} cy={CY} r={R + 7} fill="#0d1620" stroke="#26333f" strokeWidth={1} />
          {SEGMENTS.map((s) => (
            <path key={s.label} d={arc(CX, CY, R, s.a1, s.a2)} fill="none" stroke={s.color} strokeWidth={9} strokeLinecap="round" />
          ))}
          <text x={CX} y={CY - 3} textAnchor="middle" fill="#eaf1f5" fontSize={14} fontWeight={800}>
            límite
          </text>
          <text x={CX} y={CY + 14} textAnchor="middle" fill="#eaf1f5" fontSize={14} fontWeight={800}>
            categorial
          </text>
        </motion.g>
        <text x={CX} y={CY + R + 30} textAnchor="middle" fill="#9db0bd" fontSize={12.5}>
          <tspan fill={TEAL}>computa</tspan> · <tspan fill={GREEN}>cultiva</tspan> ·{" "}
          <tspan fill={AMBER}>delibera</tspan>
        </text>
        <text x={CX} y={CY + R + 47} textAnchor="middle" fill="#eaf1f5" fontSize={12} fontWeight={700} letterSpacing="0.14em">
          ESTE TRABAJO
        </text>

        {/* Parientes */}
        {KIN.map((k, i) => (
          <motion.g
            key={k.name}
            initial={reduce ? false : { opacity: 0, y: 8 }}
            animate={on ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
            transition={{ duration: 0.45, delay: i * 0.1, ease: "easeOut" }}
          >
            <rect
              x={k.x - HALF_W}
              y={k.y - HALF_H}
              width={HALF_W * 2}
              height={HALF_H * 2}
              rx={11}
              fill="#16212c"
              stroke="#2b3d4a"
              strokeWidth={1}
            />
            <text x={k.x} y={k.y - 4} textAnchor="middle" fill="#eaf1f5" fontSize={16} fontWeight={800}>
              {k.name}
            </text>
            <text x={k.x} y={k.y + 13} textAnchor="middle" fill={TEAL} fontSize={12.5}>
              {k.lens}
            </text>
            <text x={k.x} y={k.y + HALF_H + 15} textAnchor="middle" fill="#7c8f9c" fontSize={11}>
              asigna por {k.by}
            </text>
          </motion.g>
        ))}
      </svg>
      <div className="metricviz-caption">
        Mismos vecindarios, <strong>distinto fundamento</strong>: no asigna por prudencia ni por
        jurisdicción, sino por un límite <em>categorial</em> —mostrable desde el oficio—.
      </div>
    </div>
  );
}
