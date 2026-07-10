import {
  Children,
  cloneElement,
  isValidElement,
  type ReactElement,
  type ReactNode,
} from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { sectionId } from "../lib/content";
import { REF_BY_TOKEN, createRefMatcher } from "../data/refs";
import { RefTooltip } from "./RefTooltip";

/** Texto plano de un árbol de nodos React (para derivar ids de encabezado). */
function toText(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(toText).join("");
  if (isValidElement(node)) return toText((node.props as { children?: ReactNode }).children);
  return "";
}

/**
 * ¿Es una imagen? react-markdown sustituye `img` por nuestro componente, así que
 * el `type` NO es la cadena "img"; detectamos por la prop `src` (robusto a la
 * minificación de producción).
 */
function isImg(node: ReactNode): boolean {
  return isValidElement(node) && typeof (node.props as { src?: unknown }).src === "string";
}

/** Deriva `d{N}` del caption «Figura N (D{N})» (para que /tesis#d{N} caiga aquí). */
function figureId(caption: ReactNode): string | undefined {
  const m = toText(caption).match(/Figura\s+\d+\s*\(D(\d+)\)/i);
  return m ? `d${m[1]}` : undefined;
}

// ─── Enriquecimiento de referencias (solo el ensayo) ────────────────────────

/** No enriquecer dentro de estos elementos (enlaces, código, fórmulas KaTeX). */
function isOpaque(el: ReactElement): boolean {
  const t = el.type;
  if (t === "a" || t === "code" || t === "pre") return true;
  if (typeof t === "function") return true; // otros componentes (incl. RefTooltip)
  const cls = (el.props as { className?: string }).className ?? "";
  return /\bkatex\b|\bmath\b/.test(cls);
}

/** Parte una cadena en texto + <RefTooltip> para los tokens del registro. */
function enrichString(text: string, used: Set<string>, keyBase: string): ReactNode[] {
  const re = createRefMatcher();
  const out: ReactNode[] = [];
  let last = 0;
  let k = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    const raw = m[0];
    const entry = REF_BY_TOKEN.get(raw.toLowerCase());
    // Máximo una marca por entrada dentro de este bloque: las repeticiones
    // quedan como texto plano (evita saturar).
    if (!entry || used.has(entry.id)) continue;
    used.add(entry.id);
    if (m.index > last) out.push(text.slice(last, m.index));
    out.push(
      <RefTooltip key={`${keyBase}-r${k++}`} entry={entry}>
        {raw}
      </RefTooltip>,
    );
    last = re.lastIndex;
  }
  if (last === 0) return [text]; // sin marcas: la cadena intacta
  if (last < text.length) out.push(text.slice(last));
  return out;
}

/** Recorre el árbol enriqueciendo solo nodos de texto (fuera de zonas opacas). */
function enrichNode(node: ReactNode, used: Set<string>, keyBase: string): ReactNode {
  if (typeof node === "string") {
    const parts = enrichString(node, used, keyBase);
    return parts.length === 1 ? parts[0] : parts;
  }
  if (Array.isArray(node)) {
    return node.map((child, i) => enrichNode(child, used, `${keyBase}-${i}`));
  }
  if (isValidElement(node)) {
    const el = node as ReactElement<{ children?: ReactNode }>;
    if (isOpaque(el) || el.props.children == null) return node;
    return cloneElement(el, undefined, enrichNode(el.props.children, used, keyBase));
  }
  return node;
}

/**
 * Enriquece los hijos de un bloque. El `Set` de deduplicado se crea POR LLAMADA
 * (no compartido entre renders): así el resultado es idéntico en cada pasada de
 * React —StrictMode reinvoca los renderers— y las marcas nunca «desaparecen» al
 * commitear una segunda pasada.
 */
function enrichBlock(children: ReactNode, keyBase: string): ReactNode {
  return enrichNode(children, new Set<string>(), keyBase);
}

// ─── Renderers ──────────────────────────────────────────────────────────────

function buildComponents(enrich: boolean): Components {
  return {
    h2({ children }) {
      // Encabezados: nunca se enriquecen.
      return (
        <h2 id={sectionId(toText(children))} className="reveal">
          {children}
        </h2>
      );
    },
    img({ src, alt }) {
      const url = typeof src === "string" ? src.replace("../ciencia/figs/", "/figs/") : src;
      return <img src={url} alt={alt ?? ""} loading="lazy" />;
    },
    // Párrafo con imagen + leyenda → <figure> (id d{N} desde el caption).
    p({ children }) {
      const kids = Children.toArray(children);
      if (kids.some(isImg)) {
        const image = kids.find(isImg);
        const caption = kids.filter((c) => !isImg(c));
        const id = figureId(caption);
        return (
          <figure id={id} className="fig reveal">
            {image}
            <figcaption>{caption}</figcaption>
          </figure>
        );
      }
      return <p>{enrich ? enrichBlock(children, "p") : children}</p>;
    },
    li({ children }) {
      return <li>{enrich ? enrichBlock(children, "li") : children}</li>;
    },
  };
}

export function Markdown({ children, enrichRefs }: { children: string; enrichRefs?: boolean }) {
  // La capa de referencialidad viva es SOLO del ensayo. El ensayo se renderiza en
  // la raíz («/») vía CollapsibleArticle → Markdown; se activa por ruta cuando no
  // se pasa la prop explícita (así no hace falta tocar EssayPage). La prop permite
  // forzarla o desactivarla desde cualquier consumidor.
  const enrich =
    enrichRefs ??
    (typeof window !== "undefined" &&
      (window.location.pathname === "/" || window.location.pathname === ""));
  const components = buildComponents(enrich);
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm, remarkMath]}
      rehypePlugins={[rehypeKatex]}
      components={components}
    >
      {children}
    </ReactMarkdown>
  );
}
