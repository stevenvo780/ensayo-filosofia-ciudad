import { useEffect } from "react";
import { Link } from "react-router-dom";
import tesisMd from "../content/tesis.md?raw";
import { parseDoc } from "../lib/content";
import { Nav } from "../components/Nav";
import { Hero } from "../components/Hero";
import { Footer } from "../components/Footer";
import { Markdown } from "../components/Markdown";
import { useRevealObserver } from "../hooks/useRevealObserver";

export default function TesisPage() {
  const { title, subtitle, body } = parseDoc(tesisMd);
  useRevealObserver(body);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Tesis de respaldo — " + title;
  }, [title]);

  return (
    <>
      <a className="skip-link" href="#inicio">
        Saltar al contenido
      </a>
      <Nav />
      <Hero
        kicker="Tesis de respaldo · documento extenso"
        title={title}
        subtitle={subtitle}
        meta={<Link to="/">← Volver al ensayo «La ciudad bien asignada»</Link>}
      />
      <main id="inicio" className="prose">
        <Markdown>{body}</Markdown>
      </main>
      <Footer title={title} />
    </>
  );
}
