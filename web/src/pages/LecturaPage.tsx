import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Download } from "lucide-react";
import { Nav } from "../components/Nav";
import { Footer } from "../components/Footer";
import { Markdown } from "../components/Markdown";

type Status = "loading" | "ready" | "error";

/** Título legible derivado del slug, como respaldo mientras carga o si falla. */
function prettySlug(slug: string): string {
  return slug
    .split("/")
    .pop()!
    .replace(/[_-]+/g, " ")
    .trim();
}

/**
 * LecturaPage — visor de un documento del espejo /materiales.
 * Hace fetch de /materiales/<slug>.md en runtime y lo renderiza con el
 * componente Markdown existente. Estados de carga y error sobrios.
 */
export default function LecturaPage() {
  const { slug = "" } = useParams();
  const [status, setStatus] = useState<Status>("loading");
  const [markdown, setMarkdown] = useState("");

  const fileUrl = `/materiales/${slug}.md`;

  useEffect(() => {
    let cancelled = false;
    setStatus("loading");
    setMarkdown("");

    if (!slug) {
      setStatus("error");
      return;
    }

    fetch(fileUrl)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const ct = res.headers.get("content-type") ?? "";
        // En una SPA, una ruta inexistente devuelve el index.html (200);
        // lo filtramos para no renderizar HTML como markdown.
        if (ct.includes("text/html")) throw new Error("not-markdown");
        return res.text();
      })
      .then((text) => {
        if (cancelled) return;
        if (/^\s*<!doctype html/i.test(text) || /^\s*<html/i.test(text)) {
          throw new Error("not-markdown");
        }
        setMarkdown(text);
        setStatus("ready");
      })
      .catch(() => {
        if (!cancelled) setStatus("error");
      });

    return () => {
      cancelled = true;
    };
  }, [fileUrl, slug]);

  useEffect(() => {
    if (status === "ready") {
      window.scrollTo(0, 0);
      document.title = `${prettySlug(slug)} — Materiales`;
    }
  }, [status, slug]);

  return (
    <>
      <a className="skip-link" href="#inicio">
        Saltar al contenido
      </a>
      <Nav />
      <div className="lec-bar">
        <Link to="/materiales" className="lec-bar__back">
          <ArrowLeft size={14} aria-hidden="true" /> Materiales
        </Link>
        {status === "ready" && (
          <a className="lec-bar__dl" href={fileUrl} download>
            <Download size={13} aria-hidden="true" /> Descargar .md
          </a>
        )}
      </div>

      <main id="inicio" className="prose">
        {status === "loading" && (
          <p className="lec-state" role="status" aria-live="polite">
            Cargando lectura…
          </p>
        )}

        {status === "error" && (
          <div className="lec-state lec-state--error" role="alert">
            <p>
              No se pudo abrir <code>{slug || "—"}.md</code>. Puede que el enlace esté mal escrito o
              que el documento no exista.
            </p>
            <p>
              <Link to="/materiales">← Volver a Materiales</Link>
            </p>
          </div>
        )}

        {status === "ready" && <Markdown>{markdown}</Markdown>}
      </main>

      <Footer title="La ciudad bien asignada" />
    </>
  );
}
