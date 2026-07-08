import { useMemo } from "react";
import { ChevronRight, List } from "lucide-react";
import { sectionId } from "../lib/content";
import { useScrollSpy } from "../hooks/useScrollSpy";

/**
 * Índice del ensayo para el sidebar izquierdo: colapsable, sticky, con la
 * sección activa resaltada (scroll-spy). Al hacer clic abre la sección destino
 * (por si estaba plegada) y se desplaza.
 */
export function TableOfContents({ children }: { children: string }) {
  const items = useMemo(
    () =>
      children
        .split("\n")
        .filter((l) => l.startsWith("## "))
        .map((l) => l.replace(/^##\s*/, "").trim())
        .map((h) => ({ id: sectionId(h), label: h })),
    [children],
  );
  const ids = useMemo(() => items.map((i) => i.id), [items]);
  const active = useScrollSpy(ids);

  if (items.length === 0) return null;

  const go = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (!el) return;
    el.closest("details")?.setAttribute("open", "");
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    history.replaceState(null, "", `#${id}`);
  };

  return (
    <details className="toc" open>
      <summary className="toc-head">
        <List size={15} aria-hidden="true" />
        <span>Índice</span>
        <ChevronRight className="chev" size={16} aria-hidden="true" />
      </summary>
      <ol className="toc-list">
        {items.map((it) => (
          <li key={it.id}>
            <a
              href={`#${it.id}`}
              className={active === it.id ? "active" : ""}
              onClick={(e) => go(e, it.id)}
            >
              {it.label}
            </a>
          </li>
        ))}
      </ol>
    </details>
  );
}
