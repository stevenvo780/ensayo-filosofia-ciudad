import { Children, isValidElement, type ReactNode } from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { sectionId } from "../lib/content";

/** Texto plano de un árbol de nodos React (para derivar ids de encabezado). */
function toText(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(toText).join("");
  if (isValidElement(node)) return toText((node.props as { children?: ReactNode }).children);
  return "";
}

function isImg(node: ReactNode): boolean {
  return isValidElement(node) && node.type === "img";
}

const components: Components = {
  h2({ children }) {
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
  // Un párrafo que contiene una imagen + su leyenda en cursiva se convierte en <figure>.
  p({ children }) {
    const kids = Children.toArray(children);
    if (kids.some(isImg)) {
      const image = kids.find(isImg);
      const caption = kids.filter((k) => !isImg(k));
      return (
        <figure className="fig reveal">
          {image}
          <figcaption>{caption}</figcaption>
        </figure>
      );
    }
    return <p>{children}</p>;
  },
};

export function Markdown({ children }: { children: string }) {
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
