import { useEffect, useState } from "react";
import { animate, useReducedMotion } from "framer-motion";

interface Props {
  to: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
}

/** Número que cuenta desde 0 al montarse (respeta reduced-motion). */
export function CountUp({ to, decimals = 0, prefix = "", suffix = "", duration = 1.1 }: Props) {
  const [val, setVal] = useState(0);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce) {
      setVal(to);
      return;
    }
    const controls = animate(0, to, {
      duration,
      ease: [0.2, 0.7, 0.2, 1],
      onUpdate: (v) => setVal(v),
    });
    return () => controls.stop();
  }, [to, duration, reduce]);

  const text = val.toLocaleString("es-CO", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  return (
    <span>
      {prefix}
      {text}
      {suffix}
    </span>
  );
}
