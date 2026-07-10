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
    document.title = "Tesis de respaldo — " + title;
    const hash = decodeURIComponent(window.location.hash.replace(/^#/, ""));
    if (!hash) {
      window.scrollTo(0, 0);
      return;
    }
    // Deep-link desde el ensayo (/tesis#d11, #d5, secciones…): esperar a que el
    // markdown y las figuras estén en el DOM y desplazar al ancla, con offset por
    // la navbar fija. Reintenta unos frames porque el contenido monta async.
    let tries = 0;
    let raf = 0;
    const tryScroll = () => {
      const el = document.getElementById(hash);
      if (el) {
        const y = el.getBoundingClientRect().top + window.scrollY - 90;
        window.scrollTo({ top: Math.max(0, y), behavior: "auto" });
      } else if (tries++ < 40) {
        raf = requestAnimationFrame(tryScroll);
      }
    };
    raf = requestAnimationFrame(tryScroll);
    return () => cancelAnimationFrame(raf);
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
