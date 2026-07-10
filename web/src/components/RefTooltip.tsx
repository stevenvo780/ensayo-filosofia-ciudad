import { useCallback, useEffect, useId, useRef, useState, type ReactNode } from "react";
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
            id={popId}
            role="dialog"
            aria-label={entry.label}
            className="refpop"
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
