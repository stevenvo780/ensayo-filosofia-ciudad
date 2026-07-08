import { useEffect } from "react";
import { AnimatePresence, MotionConfig, motion, type Variants } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { slides } from "../deck/slides";
import { useDeck } from "../hooks/useDeck";
import { NetworkCanvas } from "../components/NetworkCanvas";
import { Stagger } from "../components/Stagger";
import "../styles/deck.css";

const slideVariants: Variants = {
  enter: (d: number) => ({ x: d > 0 ? 70 : -70, opacity: 0 }),
  center: { x: 0, opacity: 1, transition: { duration: 0.42, ease: [0.2, 0.7, 0.2, 1] } },
  exit: (d: number) => ({ x: d > 0 ? -70 : 70, opacity: 0, transition: { duration: 0.28, ease: [0.4, 0, 1, 1] } }),
};

export default function DeckPage() {
  const { index, direction, total, next, prev, notesOn } = useDeck(slides.length);
  const slide = slides[index];

  useEffect(() => {
    document.body.classList.add("deck-mode");
    const previous = document.title;
    document.title = "Presentación — La ciudad bien asignada";
    return () => {
      document.body.classList.remove("deck-mode");
      document.title = previous;
    };
  }, []);

  return (
    <MotionConfig reducedMotion="user">
      <div className="deck">
        <NetworkCanvas className="deck-net" opacity={0.32} />

        <div className="bar-track">
          <motion.div
            className="bar"
            animate={{ width: `${((index + 1) / total) * 100}%` }}
            transition={{ type: "spring", stiffness: 120, damping: 22 }}
          />
        </div>

        <AnimatePresence mode="wait" custom={direction}>
          <motion.section
            key={index}
            className={"slide" + (slide.title ? " title" : "")}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            onClick={next}
            aria-live="polite"
          >
            <Stagger className="wrap">{slide.content}</Stagger>
          </motion.section>
        </AnimatePresence>

        <AnimatePresence>
          {notesOn && (
            <motion.aside
              className="note"
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 40, opacity: 0 }}
              transition={{ duration: 0.28 }}
            >
              {slide.note}
            </motion.aside>
          )}
        </AnimatePresence>

        <div className="hud">
          <span>
            <b>{index + 1}</b> / {total}
          </span>
          <span className="mid">← → avanzar · N notas · F pantalla completa</span>
          <span className="arrows">
            <motion.button
              type="button"
              aria-label="Anterior"
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              onClick={(e) => {
                e.stopPropagation();
                prev();
              }}
            >
              <ChevronLeft size={18} aria-hidden="true" />
            </motion.button>
            <motion.button
              type="button"
              aria-label="Siguiente"
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              onClick={(e) => {
                e.stopPropagation();
                next();
              }}
            >
              <ChevronRight size={18} aria-hidden="true" />
            </motion.button>
          </span>
        </div>
      </div>
    </MotionConfig>
  );
}
