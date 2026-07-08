import { ChevronRight } from "lucide-react";
import { Markdown } from "./Markdown";
import { sectionId } from "../lib/content";

/**
 * Renderiza el cuerpo del ensayo con cada sección (`## …`) dentro de un
 * <details> colapsable, para una lectura más amigable: se puede plegar lo ya
 * leído. Abiertas por defecto (nada oculto al cargar); la bibliografía, plegada.
 * El <h2> conserva su id para el scroll-spy y los anclajes de la barra.
 */
export function CollapsibleArticle({ children }: { children: string }) {
  const parts = children.split(/\n(?=## )/g);
  const intro = parts[0].startsWith("## ") ? "" : parts.shift() ?? "";

  return (
    <>
      {intro.trim() && <Markdown>{intro}</Markdown>}
      {parts.map((section, i) => {
        const nl = section.indexOf("\n");
        const heading = (nl === -1 ? section : section.slice(0, nl)).replace(/^##\s*/, "").trim();
        const bodyMd = nl === -1 ? "" : section.slice(nl + 1);
        const id = sectionId(heading);
        return (
          <details
            key={id || i}
            className="section reveal"
            open={id !== "bibliografia"}
          >
            <summary className="section-head">
              <h2 id={id}>{heading}</h2>
              <ChevronRight className="chev" size={22} aria-hidden="true" />
            </summary>
            <div className="section-body">
              <Markdown>{bodyMd}</Markdown>
            </div>
          </details>
        );
      })}
    </>
  );
}
