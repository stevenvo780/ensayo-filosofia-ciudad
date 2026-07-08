import { useEffect } from "react";
import { Link } from "react-router-dom";
import ensayoMd from "../content/ensayo.md?raw";
import { parseDoc } from "../lib/content";
import { Nav } from "../components/Nav";
import { Hero } from "../components/Hero";
import { Footer } from "../components/Footer";
import { CollapsibleArticle } from "../components/CollapsibleArticle";
import { TableOfContents } from "../components/TableOfContents";
import { useRevealObserver } from "../hooks/useRevealObserver";

export default function EssayPage() {
  const { title, subtitle, body } = parseDoc(ensayoMd);
  useRevealObserver(body);

  useEffect(() => {
    document.title = "La ciudad bien asignada — cartografía crítica de una Medellín posible";
  }, []);

  return (
    <>
      <a className="skip-link" href="#inicio">
        Saltar al contenido
      </a>
      <Nav />
      <Hero
        kicker="Cartografía crítica · Filosofía de la Ciudad"
        title={title}
        subtitle={subtitle}
        meta="Steven Vallejo Ortiz · Universidad de Antioquia · 10 de julio de 2026"
      />
      <main id="inicio" className="prose">
        <TableOfContents>{body}</TableOfContents>
        <CollapsibleArticle>{body}</CollapsibleArticle>
        <div className="readmore">
          Este ensayo se apoya en una <strong>tesis de respaldo</strong> con nueve demostraciones
          computacionales reproducibles, el experimento T1–T6 y la propuesta del Banco Epistémico
          Urbano. <Link to="/tesis">Leer la tesis ↗</Link> ·{" "}
          <Link to="/presentacion">Ver la presentación ↗</Link>
        </div>
      </main>
      <Footer title={title} />
    </>
  );
}
