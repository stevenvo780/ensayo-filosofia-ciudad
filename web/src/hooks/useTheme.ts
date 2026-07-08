import { useCallback, useEffect, useState } from "react";

type Theme = "light" | "dark";

/** Tema claro/oscuro: respeta el sistema por defecto y persiste la elección. */
export function useTheme() {
  const [theme, setTheme] = useState<Theme | null>(() => {
    try {
      return (localStorage.getItem("tema") as Theme) || null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme) {
      root.setAttribute("data-theme", theme);
      try {
        localStorage.setItem("tema", theme);
      } catch {
        /* almacenamiento no disponible */
      }
    } else {
      root.removeAttribute("data-theme");
    }
  }, [theme]);

  const toggle = useCallback(() => {
    setTheme((prev) => {
      const current = prev ?? (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
      return current === "dark" ? "light" : "dark";
    });
  }, []);

  return { theme, toggle };
}
