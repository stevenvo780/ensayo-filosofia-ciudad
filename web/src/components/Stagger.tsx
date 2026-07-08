import { Children, type ReactNode } from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.14 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.2, 0.75, 0.25, 1] } },
};

/** Anima los hijos directos en cascada; sin movimiento si el usuario lo pide. */
export function Stagger({ children, className }: { children: ReactNode; className?: string }) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div className={className} variants={container} initial="hidden" animate="show">
      {Children.map(children, (child, i) => (
        <motion.div variants={item} key={i}>
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
}
