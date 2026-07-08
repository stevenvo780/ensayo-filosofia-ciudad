import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

type Lane = "computa" | "cultiva" | "delibera";
type Task = {
  id: string;
  label: string;
  lane: Lane;
  reason: string;
};
type LaneMeta = {
  lane: Lane;
  title: string;
};

const TASKS: readonly Task[] = [
  { id: "ruta-minima-bus", label: "Ruta mínima del bus", lane: "computa", reason: "tiene solución exacta y verdad de referencia" },
  { id: "caudal-acueducto", label: "Caudal del acueducto", lane: "computa", reason: "física conocida, algoritmo exacto" },
  { id: "horarios-metrocable", label: "Horarios del Metrocable", lane: "computa", reason: "optimización con restricciones claras" },
  { id: "donde-surge-mercado", label: "Dónde surge un mercado", lane: "cultiva", reason: "emerge de miles de decisiones locales" },
  { id: "mezcla-usos-barrio", label: "Mezcla de usos del barrio", lane: "cultiva", reason: "se habilita, no se decreta" },
  { id: "vida-acera", label: "La vida de la acera", lane: "cultiva", reason: "condiciones generadoras (Jacobs), no diseño" },
  { id: "metrica-prioriza-centro", label: "Qué métrica prioriza el centro", lane: "delibera", reason: "es decisión política, no técnica" },
  { id: "vigilancia", label: "Qué se vigila y qué no", lane: "delibera", reason: "fija quién mira; se decide en común" },
  { id: "segregacion-intolerable", label: "Qué segregación es intolerable", lane: "delibera", reason: "umbral normativo, no dato" },
];

const LANES: readonly LaneMeta[] = [
  { lane: "computa", title: "Computar" },
  { lane: "cultiva", title: "Cultivar" },
  { lane: "delibera", title: "Deliberar" },
];

function Chip({
  task,
  active,
  onActivate,
}: {
  task: Task;
  active: boolean;
  onActivate: (id: string) => void;
}) {
  return (
    <motion.button
      layout
      layoutId={task.id}
      type="button"
      className={`triad-chip${active ? " on" : ""}`}
      aria-label={`${task.label}: ${task.reason}`}
      onClick={(event) => {
        event.stopPropagation();
        onActivate(task.id);
      }}
      onPointerEnter={() => onActivate(task.id)}
      onFocus={() => onActivate(task.id)}
      transition={{ type: "spring", stiffness: 420, damping: 34 }}
    >
      {task.label}
    </motion.button>
  );
}

export function TriadViz() {
  const reduceMotion = useReducedMotion();
  const [placedCount, setPlacedCount] = useState(() => (reduceMotion ? TASKS.length : 0));
  const [activeId, setActiveId] = useState<string>(TASKS[0].id);

  useEffect(() => {
    if (reduceMotion) {
      setPlacedCount(TASKS.length);
      return;
    }
    setPlacedCount(0);
    const interval = window.setInterval(() => {
      setPlacedCount((count) => {
        const nextCount = Math.min(count + 1, TASKS.length);
        const nextTask = TASKS[nextCount - 1];
        if (nextTask) setActiveId(nextTask.id);
        if (nextCount === TASKS.length) window.clearInterval(interval);
        return nextCount;
      });
    }, 700);
    return () => window.clearInterval(interval);
  }, [reduceMotion]);

  const placedTasks = useMemo(() => TASKS.slice(0, placedCount), [placedCount]);
  const poolTasks = useMemo(() => TASKS.slice(placedCount), [placedCount]);
  const activeTask = TASKS.find((task) => task.id === activeId) ?? TASKS[0];
  const isComplete = placedCount === TASKS.length;

  return (
    <section className="triad" role="group" aria-label="Asignación triádica de asuntos urbanos">
      <motion.div className="triad-col" layout role="group" aria-label="Tareas por asignar">
        <div className="triad-col-h">Por asignar</div>
        <AnimatePresence initial={false}>
          {poolTasks.map((task) => (
            <Chip key={task.id} task={task} active={task.id === activeId} onActivate={setActiveId} />
          ))}
        </AnimatePresence>
      </motion.div>

      <div className="triad-cols">
        {LANES.map(({ lane, title }) => (
          <motion.div key={lane} className={`triad-col lane-${lane}`} layout role="group" aria-label={title}>
            <div className="triad-col-h">{title}</div>
            <AnimatePresence initial={false}>
              {placedTasks
                .filter((task) => task.lane === lane)
                .map((task) => (
                  <Chip key={task.id} task={task} active={task.id === activeId} onActivate={setActiveId} />
                ))}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      <div className="triad-reason" aria-live="polite">
        {activeTask.label}: {activeTask.reason}
      </div>

      {isComplete ? (
        <motion.div
          className="triad-punch"
          initial={reduceMotion ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          El funcionalismo computó lo emergente; la smart city computa lo relevante — el mismo error
          de asignación.
        </motion.div>
      ) : null}
    </section>
  );
}
