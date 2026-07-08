import { ChevronRight } from "lucide-react";
import { Markdown } from "./Markdown";
import { sectionId } from "../lib/content";

/**
 * Cuerpo del ensayo con cada sección (`## …`) en un <details> colapsable.
 * El encabezado se parte en un epígrafe mono (número · tema) y un título serif;
 * la introducción lleva letra capital. Abiertas por defecto; bibliografía plegada.
 */
export function CollapsibleArticle({ children }: { children: string }) {
  const parts = children.split(/\n(?=## )/g);
  const intro = parts[0].startsWith("## ") ? "" : parts.shift() ?? "";

  return (
    <>
      {intro.trim() && (
        <div className="intro">
          <Markdown>{intro}</Markdown>
        </div>
      )}
      {parts.map((section, i) => {
        const nl = section.indexOf("\n");
        const heading = (nl === -1 ? section : section.slice(0, nl)).replace(/^##\s*/, "").trim();
        const bodyMd = nl === -1 ? "" : section.slice(nl + 1);
        const id = sectionId(heading);
        const colon = heading.indexOf(":");
        const eyebrow = colon > 0 ? heading.slice(0, colon).trim() : "";
        const title = colon > 0 ? heading.slice(colon + 1).trim() : heading;
        return (
          <details key={id || i} className="section reveal" open={id !== "bibliografia"}>
            <summary className="section-head">
              <span className="section-head-text">
                {eyebrow && <span className="sec-eyebrow">{eyebrow}</span>}
                <h2 id={id}>{title}</h2>
              </span>
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
