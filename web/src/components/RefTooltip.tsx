import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { Link, useNavigate } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { RefEntry } from "../data/refs";

const KIND_LABEL: Record<RefEntry["kind"], string> = {
  demo: "Demostración",
  seccion: "Sección de la tesis",
  concepto: "Concepto",
};

/**
 * Término enriquecido: subrayado punteado ámbar. Hover/focus abre un popover
 * animado (framer-motion) con label, explicación llana, miniatura (si es demo)
 * y enlace «ver en la tesis →». Click en el término navega a `/tesis#anchor`.
 * En móvil (puntero grueso) el primer tap abre el popover; el enlace navega.
 * Accesible: focusable, `aria-expanded`, `Esc` cierra.
 */
export function RefTooltip({ entry, children }: { entry: RefEntry; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const reduce = useReducedMotion();
  const wrapRef = useRef<HTMLSpanElement>(null);
  const coarse = useRef(false);
  const popId = useId();
  const dest = `/tesis#${entry.anchor}`;
  const popRef = useRef<HTMLSpanElement>(null);
  const [pos, setPos] = useState<{ left: number; up: boolean; arrowLeft: number } | null>(null);

  // Reposiciona el popover para que NUNCA se salga de la pantalla: lo desliza en
  // horizontal hasta caber y lo voltea hacia arriba si abajo no hay sitio; la
  // flecha sigue apuntando al término. (Antes se recortaba cerca de los bordes.)
  useLayoutEffect(() => {
    if (!open) {
      setPos(null);
      return;
    }
    const term = wrapRef.current;
    const pop = popRef.current;
    if (!term || !pop) return;
    const M = 10;
    const r = term.getBoundingClientRect();
    const popW = pop.offsetWidth;
    const popH = pop.offsetHeight;
    const vw = document.documentElement.clientWidth;
    const vh = window.innerHeight;
    const leftVp = Math.min(Math.max(r.left, M), Math.max(M, vw - popW - M));
    const arrowLeft = Math.min(Math.max(r.left + r.width / 2 - leftVp, 14), popW - 14);
    const up = r.bottom + M + popH > vh && r.top - M - popH > M;
    setPos({ left: leftVp - r.left, up, arrowLeft });
  }, [open]);

  useEffect(() => {
    coarse.current =
      typeof window !== "undefined" && !!window.matchMedia?.("(hover: none)").matches;
  }, []);

  // Esc cierra el popover mientras esté abierto (también con hover de ratón).
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const go = useCallback(() => navigate(dest), [navigate, dest]);

  const onClick = useCallback(() => {
    // En puntero grueso el primer tap solo abre el popover; el enlace navega.
    if (coarse.current && !open) {
      setOpen(true);
      return;
    }
    go();
  }, [open, go]);

  const onBlur = useCallback((e: React.FocusEvent<HTMLSpanElement>) => {
    if (!wrapRef.current?.contains(e.relatedTarget as Node | null)) setOpen(false);
  }, []);

  return (
    <span
      ref={wrapRef}
      className="refwrap"
      onMouseEnter={() => {
        if (!coarse.current) setOpen(true);
      }}
      onMouseLeave={() => {
        if (!coarse.current) setOpen(false);
      }}
      onBlur={onBlur}
    >
      <button
        type="button"
        className={`refterm refterm--${entry.kind}`}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-describedby={open ? popId : undefined}
        onFocus={() => setOpen(true)}
        onClick={onClick}
      >
        {children}
      </button>
      <AnimatePresence>
        {open && (
          <motion.span
            ref={popRef}
            id={popId}
            role="dialog"
            aria-label={entry.label}
            className="refpop"
            data-up={pos?.up ? "" : undefined}
            style={
              (pos
                ? {
                    left: pos.left,
                    ...(pos.up ? { top: "auto", bottom: "calc(100% + 8px)" } : {}),
                    "--arrow-left": `${pos.arrowLeft}px`,
                  }
                : { visibility: "hidden" }) as CSSProperties
            }
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 6, scale: 0.97 }}
            animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: 4, scale: 0.98 }}
            transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => {
              if (!coarse.current) setOpen(false);
            }}
          >
            <span className="refpop__kind">{KIND_LABEL[entry.kind]}</span>
            <span className="refpop__title">{entry.label}</span>
            {entry.kind === "demo" && entry.figura && (
              <img className="refpop__fig" src={entry.figura} alt="" loading="lazy" />
            )}
            <span className="refpop__body">{entry.tooltip}</span>
            <Link className="refpop__link" to={dest} onClick={() => setOpen(false)}>
              ver en la tesis →
            </Link>
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}
