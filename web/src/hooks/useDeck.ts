import { useCallback, useEffect, useState } from "react";

/** Estado y controles de la presentación: teclado, swipe, notas, pantalla completa, hash. */
export function useDeck(total: number) {
  const [index, setIndex] = useState(() => {
    const h = parseInt((location.hash || "").replace("#", ""), 10);
    return isNaN(h) ? 0 : Math.min(total - 1, Math.max(0, h - 1));
  });
  const [direction, setDirection] = useState(1);
  const [notesOn, setNotesOn] = useState(false);

  const go = useCallback(
    (n: number, dir: 1 | -1) => {
      setDirection(dir);
      setIndex(Math.max(0, Math.min(total - 1, n)));
    },
    [total],
  );
  const next = useCallback(() => {
    setDirection(1);
    setIndex((i) => Math.min(total - 1, i + 1));
  }, [total]);
  const prev = useCallback(() => {
    setDirection(-1);
    setIndex((i) => Math.max(0, i - 1));
  }, []);
  const toggleNotes = useCallback(() => setNotesOn((v) => !v), []);
  const fullscreen = useCallback(() => {
    const d = document;
    if (!d.fullscreenElement) void d.documentElement.requestFullscreen?.();
    else void d.exitFullscreen?.();
  }, []);

  useEffect(() => {
    history.replaceState(null, "", "#" + (index + 1));
  }, [index]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (["ArrowRight", "ArrowDown", " ", "PageDown"].includes(e.key)) {
        e.preventDefault();
        next();
      } else if (["ArrowLeft", "ArrowUp", "PageUp"].includes(e.key)) {
        e.preventDefault();
        prev();
      } else if (e.key === "Home") go(0, -1);
      else if (e.key === "End") go(total - 1, 1);
      else if (e.key.toLowerCase() === "n") toggleNotes();
      else if (e.key.toLowerCase() === "f") fullscreen();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev, go, toggleNotes, fullscreen, total]);

  useEffect(() => {
    let x0: number | null = null;
    let y0: number | null = null;
    const start = (e: TouchEvent) => {
      x0 = e.touches[0].clientX;
      y0 = e.touches[0].clientY;
    };
    const end = (e: TouchEvent) => {
      if (x0 === null || y0 === null) return;
      const dx = e.changedTouches[0].clientX - x0;
      const dy = e.changedTouches[0].clientY - y0;
      if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.4) {
        if (dx < 0) next();
        else prev();
      }
      x0 = null;
      y0 = null;
    };
    window.addEventListener("touchstart", start, { passive: true });
    window.addEventListener("touchend", end, { passive: true });
    return () => {
      window.removeEventListener("touchstart", start);
      window.removeEventListener("touchend", end);
    };
  }, [next, prev]);

  return { index, direction, total, go, next, prev, notesOn, toggleNotes, fullscreen };
}
