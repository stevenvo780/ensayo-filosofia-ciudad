import { useCallback, useEffect, useRef, useState } from "react";
import { Play, Pause, RotateCcw } from "lucide-react";

/**
 * Widget explicativo: el autómata de Schelling corriendo EN VIVO. Con una
 * preferencia local leve (slider de tolerancia), la segregación global EMERGE
 * sin que nadie la diseñe. Muestra "cultivar lo emergente": el orden brota de
 * reglas locales, y la intervención (tolerancia) cambia el resultado.
 */
const N = 46;
const EMPTY = 0;
const A = 1;
const B = 2;

function seed(): Int8Array {
  const g = new Int8Array(N * N);
  for (let i = 0; i < g.length; i++) {
    const r = Math.random();
    g[i] = r < 0.08 ? EMPTY : r < 0.54 ? A : B;
  }
  return g;
}

function sameFraction(g: Int8Array, i: number): number {
  const r = Math.floor(i / N);
  const c = i % N;
  const self = g[i];
  let same = 0;
  let tot = 0;
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      if (dr === 0 && dc === 0) continue;
      const rr = r + dr;
      const cc = c + dc;
      if (rr < 0 || rr >= N || cc < 0 || cc >= N) continue;
      const v = g[rr * N + cc];
      if (v !== EMPTY) {
        tot++;
        if (v === self) same++;
      }
    }
  }
  return tot === 0 ? 1 : same / tot;
}

function step(g: Int8Array, tol: number): Int8Array {
  const unhappy: number[] = [];
  const empties: number[] = [];
  for (let i = 0; i < g.length; i++) {
    if (g[i] === EMPTY) empties.push(i);
    else if (sameFraction(g, i) < tol) unhappy.push(i);
  }
  for (let i = empties.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [empties[i], empties[j]] = [empties[j], empties[i]];
  }
  const k = Math.min(unhappy.length, empties.length);
  for (let i = 0; i < k; i++) {
    g[empties[i]] = g[unhappy[i]];
    g[unhappy[i]] = EMPTY;
  }
  return g;
}

function segregation(g: Int8Array): number {
  let sum = 0;
  let cnt = 0;
  for (let i = 0; i < g.length; i++) if (g[i] !== EMPTY) {
    sum += sameFraction(g, i);
    cnt++;
  }
  return cnt ? sum / cnt : 0;
}

export function SchellingViz() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gridRef = useRef<Int8Array>(seed());
  const [running, setRunning] = useState(true);
  const [tol, setTol] = useState(0.5);
  const [seg, setSeg] = useState(() => segregation(gridRef.current));
  const tolRef = useRef(tol);
  tolRef.current = tol;

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const px = canvas.width / N;
    const g = gridRef.current;
    ctx.fillStyle = "#0e141b";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < g.length; i++) {
      if (g[i] === EMPTY) continue;
      ctx.fillStyle = g[i] === A ? "#5fc7d4" : "#e8934f";
      ctx.fillRect((i % N) * px, Math.floor(i / N) * px, px + 0.6, px + 0.6);
    }
  }, []);

  useEffect(draw, [draw]);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      step(gridRef.current, tolRef.current);
      setSeg(segregation(gridRef.current));
      draw();
    }, 140);
    return () => clearInterval(id);
  }, [running, draw]);

  const reset = () => {
    gridRef.current = seed();
    setSeg(segregation(gridRef.current));
    draw();
  };

  return (
    <div className="schelling">
      <canvas ref={canvasRef} width={276} height={276} aria-label="Simulación de Schelling en vivo" />
      <div className="schelling-panel">
        <div className="schelling-seg">
          Segregación <strong>{seg.toFixed(2)}</strong>
          <span className="schelling-bar">
            <span style={{ width: `${seg * 100}%` }} />
          </span>
        </div>
        <label className="schelling-tol">
          Tolerancia: exige ≥ {(tol * 100).toFixed(0)}% de vecinos iguales
          <input
            type="range"
            min={0}
            max={0.9}
            step={0.05}
            value={tol}
            onClick={(e) => e.stopPropagation()}
            onChange={(e) => setTol(parseFloat(e.target.value))}
          />
        </label>
        <div className="schelling-btns">
          <button type="button" onClick={(e) => { e.stopPropagation(); setRunning((v) => !v); }}>
            {running ? <Pause size={14} /> : <Play size={14} />} {running ? "Pausar" : "Correr"}
          </button>
          <button type="button" onClick={(e) => { e.stopPropagation(); reset(); }}>
            <RotateCcw size={14} /> Reiniciar
          </button>
        </div>
        <p className="schelling-note">Nadie la diseñó: emerge de reglas locales.</p>
      </div>
    </div>
  );
}
