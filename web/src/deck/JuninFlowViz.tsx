import { useEffect, useRef } from "react";

/**
 * Animación ambiental de la escena (slide «Seis de la tarde en Junín»): un
 * corredor con un RÍO DE GENTE (footfall) que fluye bajo los alumbrados de
 * diciembre. El ventero —una carreta bajo el alero— es leído por la cámara del
 * poste como «obstrucción del flujo»: el reticulado la enmarca y la corriente se
 * parte a su alrededor, pero la vida sigue. El barrido del tablero recorre el
 * corredor sin poder decir qué se celebra. Canvas 2D + rAF; respeta
 * prefers-reduced-motion dibujando un fotograma estático ya poblado.
 */

const TEAL = "#5fc7d4";
const AMBER = "#e8934f";

function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function JuninFlowViz() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(2, window.devicePixelRatio || 1);

    interface Person {
      x: number;
      base: number;
      vx: number;
      r: number;
      warm: boolean;
    }
    interface Light {
      x: number;
      y: number;
      ph: number;
    }

    let W = 0;
    let H = 0;
    let people: Person[] = [];
    let lights: Light[] = [];
    const vent = { x: 0, y: 0, w: 0, h: 0 };

    const build = () => {
      // Medimos la caja CSS del propio canvas (no del contenedor): la altura la
      // fija el clamp de deck.css; aquí solo dimensionamos el búfer de dibujo.
      const rect = canvas.getBoundingClientRect();
      W = Math.max(1, rect.width);
      H = Math.max(1, rect.height);
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const rnd = mulberry32(7);
      const topC = H * 0.23;
      const botC = H * 0.93;
      const count = Math.round(Math.max(95, Math.min(270, W * 0.2)));
      people = Array.from({ length: count }, () => ({
        x: rnd() * (W + 40) - 20,
        base: topC + rnd() * (botC - topC),
        vx: 0.3 + rnd() * 1.05,
        r: 1.2 + rnd() * 1.45,
        warm: rnd() < 0.09,
      }));

      const nL = Math.max(7, Math.round(W / 78));
      lights = Array.from({ length: nL }, (_, i) => {
        const tt = i / (nL - 1);
        const sag = Math.sin(tt * Math.PI) * H * 0.055;
        return { x: 12 + tt * (W - 24), y: H * 0.06 + sag, ph: rnd() * Math.PI * 2 };
      });

      vent.w = Math.max(30, W * 0.03);
      vent.h = vent.w * 0.66;
      vent.x = W * 0.29;
      vent.y = topC + (botC - topC) * 0.13;
    };

    build();

    const vcx = () => vent.x + vent.w / 2;
    const vcy = () => vent.y + vent.h / 2;

    let raf = 0;
    let t = 0;

    const draw = () => {
      t += 0.016;
      ctx.clearRect(0, 0, W, H);
      const topC = H * 0.26;
      const botC = H * 0.92;
      const cx = vcx();
      const cy = vcy();
      const R = Math.max(58, vent.w * 2.5);

      // Bordes del corredor (los aleros / fachadas)
      ctx.strokeStyle = "#26333f";
      ctx.lineWidth = 1;
      for (const yy of [topC - 6, botC + 4]) {
        ctx.globalAlpha = 0.55;
        ctx.beginPath();
        ctx.moveTo(0, yy);
        ctx.lineTo(W, yy);
        ctx.stroke();
      }

      // Guirnalda de alumbrados (catenaria) + luces que titilan
      ctx.strokeStyle = AMBER;
      ctx.globalAlpha = 0.16;
      ctx.lineWidth = 1;
      ctx.beginPath();
      lights.forEach((l, i) => (i ? ctx.lineTo(l.x, l.y) : ctx.moveTo(l.x, l.y)));
      ctx.stroke();
      for (const l of lights) {
        const tw = reduce ? 0.8 : 0.55 + 0.45 * Math.sin(t * 2.1 + l.ph);
        ctx.fillStyle = AMBER;
        ctx.globalAlpha = 0.32 * tw;
        ctx.beginPath();
        ctx.arc(l.x, l.y, 5.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 0.9 * tw;
        ctx.beginPath();
        ctx.arc(l.x, l.y, 1.7, 0, Math.PI * 2);
        ctx.fill();
      }

      // Río de gente: fluye y se PARTE alrededor del ventero
      for (const p of people) {
        if (!reduce) {
          p.x += p.vx;
          if (p.x > W + 20) p.x = -20;
        }
        let y = p.base;
        const dxp = p.x - cx;
        if (Math.abs(dxp) < R) {
          const fall = 1 - Math.abs(dxp) / R; // 0..1 cerca del ventero
          const dir = p.base >= cy ? 1 : -1;
          const vertShare = 1 - Math.min(1, Math.abs(p.base - cy) / 96);
          y = p.base + dir * fall * fall * 30 * vertShare;
        }
        const col = p.warm ? AMBER : TEAL;
        // estela corta
        ctx.strokeStyle = col;
        ctx.globalAlpha = 0.13;
        ctx.lineWidth = p.r * 1.15;
        ctx.beginPath();
        ctx.moveTo(p.x - 4 - p.vx * 4, y);
        ctx.lineTo(p.x, y);
        ctx.stroke();
        // persona
        ctx.fillStyle = col;
        ctx.globalAlpha = p.warm ? 0.85 : 0.62;
        ctx.beginPath();
        ctx.arc(p.x, y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }

      // Barrido del tablero: recorre el corredor sin poder leer diciembre
      const period = 5200;
      const sx = reduce ? W * 0.62 : ((t * 1000) % period) / period * (W + 160) - 80;
      const grad = ctx.createLinearGradient(sx - 60, 0, sx + 12, 0);
      grad.addColorStop(0, "rgba(95,199,212,0)");
      grad.addColorStop(1, "rgba(95,199,212,0.16)");
      ctx.fillStyle = grad;
      ctx.fillRect(sx - 60, topC - 10, 72, botC - topC + 18);
      ctx.strokeStyle = TEAL;
      ctx.globalAlpha = 0.35;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(sx, topC - 10);
      ctx.lineTo(sx, botC + 8);
      ctx.stroke();

      // El ventero: carreta bajo el alero, con brillo cálido
      ctx.globalAlpha = 0.28;
      ctx.fillStyle = AMBER;
      ctx.beginPath();
      ctx.arc(cx, cy, vent.w * 1.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 0.95;
      ctx.fillStyle = AMBER;
      const rr = 3;
      const rx = vent.x;
      const ry = vent.y;
      ctx.beginPath();
      ctx.moveTo(rx + rr, ry);
      ctx.lineTo(rx + vent.w - rr, ry);
      ctx.arcTo(rx + vent.w, ry, rx + vent.w, ry + rr, rr);
      ctx.lineTo(rx + vent.w, ry + vent.h - rr);
      ctx.arcTo(rx + vent.w, ry + vent.h, rx + vent.w - rr, ry + vent.h, rr);
      ctx.lineTo(rx + rr, ry + vent.h);
      ctx.arcTo(rx, ry + vent.h, rx, ry + vent.h - rr, rr);
      ctx.lineTo(rx, ry + rr);
      ctx.arcTo(rx, ry, rx + rr, ry, rr);
      ctx.closePath();
      ctx.fill();

      // Reticolo de la cámara: enmarca al ventero como «obstrucción»
      const pulse = reduce ? 0.7 : 0.5 + 0.4 * Math.sin(t * 2.6);
      const bx = cx - R * 0.42;
      const by = cy - R * 0.4;
      const bw = R * 0.84;
      const bh = R * 0.8;
      const seg = Math.min(bw, bh) * 0.28;
      ctx.strokeStyle = TEAL;
      ctx.globalAlpha = 0.35 + 0.4 * pulse;
      ctx.lineWidth = 1.4;
      const corner = (ox: number, oy: number, sxi: number, syi: number) => {
        ctx.beginPath();
        ctx.moveTo(ox, oy + syi * seg);
        ctx.lineTo(ox, oy);
        ctx.lineTo(ox + sxi * seg, oy);
        ctx.stroke();
      };
      corner(bx, by, 1, 1);
      corner(bx + bw, by, -1, 1);
      corner(bx, by + bh, 1, -1);
      corner(bx + bw, by + bh, -1, -1);

      ctx.globalAlpha = 1;
      if (!reduce) raf = requestAnimationFrame(draw);
    };

    draw();

    // Al reconstruir el búfer se limpia el canvas; en modo reducido (un solo
    // fotograma) hay que volver a dibujar. En modo animado, el bucle rAF ya lo hace.
    const ro = new ResizeObserver(() => {
      build();
      if (reduce) draw();
    });
    ro.observe(canvas);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  return (
    <div className="juninviz">
      <canvas ref={ref} aria-hidden="true" />
      <p className="juninviz-cap">
        El corredor como <strong>río de gente</strong>; la cámara enmarca al ventero como{" "}
        <em>obstrucción</em> —y aun así diciembre queda ilegible para el tablero.
      </p>
    </div>
  );
}
