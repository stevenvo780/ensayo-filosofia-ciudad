import { useEffect, useRef } from "react";

interface Props {
  className?: string;
  opacity?: number;
  centers?: number;
}

/**
 * Fondo animado: una red viva de nodos a la deriva con TRES centros que laten.
 * Es la tesis hecha animación (D5: la métrica decide el centro). Canvas 2D + rAF,
 * respeta prefers-reduced-motion (dibuja un fotograma estático).
 */
export function NetworkCanvas({ className, opacity = 0.34, centers = 3 }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const parent = canvas?.parentElement;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !parent || !ctx) return;

    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ACCENT = "#5fc7d4";
    const AMBER = "#e8934f";
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const MAXD = 118;

    interface Node {
      x: number; y: number; vx: number; vy: number; r: number; center: boolean; phase: number;
    }
    let W = 0;
    let H = 0;
    let nodes: Node[] = [];

    const build = () => {
      const rect = parent.getBoundingClientRect();
      W = rect.width;
      H = rect.height;
      canvas.width = Math.max(1, Math.round(W * dpr));
      canvas.height = Math.max(1, Math.round(H * dpr));
      canvas.style.width = `${W}px`;
      canvas.style.height = `${H}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.round(Math.max(22, Math.min(84, (W * H) / 17000)));
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.2,
        vy: (Math.random() - 0.5) * 0.2,
        r: 1.4 + Math.random() * 1.1,
        center: false,
        phase: Math.random() * Math.PI * 2,
      }));
      for (let c = 0; c < centers && nodes.length; c++) {
        const n = nodes[Math.floor(((c + 0.5) / centers) * nodes.length)];
        n.center = true;
        n.r = 3.3;
      }
    };

    build();
    const ro = new ResizeObserver(build);
    ro.observe(parent);

    let raf = 0;
    let t = 0;
    const draw = () => {
      t += 0.016;
      ctx.clearRect(0, 0, W, H);
      if (!reduce) {
        for (const n of nodes) {
          n.x += n.vx;
          n.y += n.vy;
          if (n.x < 0 || n.x > W) n.vx *= -1;
          if (n.y < 0 || n.y > H) n.vy *= -1;
        }
      }
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i];
          const b = nodes[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < MAXD) {
            ctx.strokeStyle = ACCENT;
            ctx.globalAlpha = opacity * (1 - d / MAXD) * 0.5;
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }
      for (const n of nodes) {
        if (n.center) {
          const pulse = reduce ? 1 : 1 + Math.sin(t * 1.4 + n.phase) * 0.32;
          ctx.fillStyle = AMBER;
          ctx.globalAlpha = opacity;
          ctx.beginPath();
          ctx.arc(n.x, n.y, n.r * pulse, 0, Math.PI * 2);
          ctx.fill();
          ctx.globalAlpha = opacity * 0.22;
          ctx.beginPath();
          ctx.arc(n.x, n.y, n.r * pulse * 2.7, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillStyle = ACCENT;
          ctx.globalAlpha = opacity * 0.8;
          ctx.beginPath();
          ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      if (!reduce) raf = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [opacity, centers]);

  return <canvas ref={ref} className={className} aria-hidden="true" />;
}
