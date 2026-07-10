import { useEffect, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { BookOpen, Download, FileText, Github, Play } from "lucide-react";
import { Nav } from "../components/Nav";
import { Hero } from "../components/Hero";
import { Footer } from "../components/Footer";

const REPO_URL = "https://github.com/stevenvo780/ensayo-filosofia-ciudad";
const TITLE = "El proyecto completo, abierto";

/** Un documento .md del espejo /materiales: se lee en la web y se descarga el crudo. */
interface DocItem {
  slug: string; // archivo servido en /materiales/<slug>.md → visor /lectura/<slug>
  title: string;
  desc: string;
}

/** Un enlace a otra parte del sitio o a un recurso externo (sin visor de lectura). */
interface LinkItem {
  to?: string; // ruta interna (react-router)
  href?: string; // recurso estático o externo
  external?: boolean;
  download?: boolean;
  icon: ReactNode;
  title: string;
  desc: string;
}

interface Section {
  id: string;
  kicker: string;
  title: string;
  lead: string;
  docs?: DocItem[];
  links?: LinkItem[];
}

const SECTIONS: Section[] = [
  {
    id: "ensayo",
    kicker: "01",
    title: "El ensayo",
    lead: "El trabajo final y sus formas de lectura: la versión web, el PDF de entrega, la tesis de respaldo y la presentación.",
    links: [
      {
        to: "/",
        icon: <BookOpen size={15} aria-hidden="true" />,
        title: "El ensayo (web)",
        desc: "«La ciudad bien asignada»: la versión de lectura con índice y figuras.",
      },
      {
        href: "/ensayo-la-ciudad-bien-asignada.pdf",
        download: true,
        icon: <Download size={15} aria-hidden="true" />,
        title: "Ensayo — PDF (entrega)",
        desc: "El entregable maquetado en formato APA 7, listo para imprimir o anotar.",
      },
      {
        to: "/tesis",
        icon: <BookOpen size={15} aria-hidden="true" />,
        title: "Tesis de respaldo",
        desc: "El documento extenso: nueve demostraciones, el experimento T1–T6 y el Banco Epistémico Urbano.",
      },
      {
        to: "/presentacion",
        icon: <Play size={15} aria-hidden="true" />,
        title: "Presentación",
        desc: "El deck animado de la introducción para la sustentación oral.",
      },
    ],
  },
  {
    id: "proceso",
    kicker: "02",
    title: "Crítica y proceso",
    lead: "Cómo se produjo y se auditó el ensayo: la consigna, las dos rondas de crítica adversarial y el guion de defensa. El proceso es parte del trabajo y es auditable de punta a punta.",
    docs: [
      {
        slug: "critica",
        title: "Crítica profunda",
        desc: "Teardown adversarial del ensayo: defectos P0/P1/P2, con las reparaciones aplicadas.",
      },
      {
        slug: "critica2",
        title: "Crítica II — frente a la consigna",
        desc: "Seis lentes independientes + verificación externa: 45/45 hallazgos validados.",
      },
      {
        slug: "critica3",
        title: "Crítica III — auditoría trimodelo",
        desc: "Nueve lentes en tres familias de modelos (Claude, GPT-5.5, Gemini): hallazgos, estado de aplicación y lo que no se aplicó, con su porqué.",
      },
      {
        slug: "metodologia",
        title: "Metodología",
        desc: "El método asistido por IA: regla de integridad autor/IA, compuertas duras y batería adversarial.",
      },
      {
        slug: "iteraciones",
        title: "Bitácora de iteraciones",
        desc: "La historia del ensayo por hitos numerados (0→7), con los commits como evidencia.",
      },
      {
        slug: "guion-defensa",
        title: "Guion de defensa",
        desc: "El guion hablado de la introducción y el kit de respuestas a las objeciones duras.",
      },
      {
        slug: "consigna",
        title: "Consigna del curso",
        desc: "El enunciado vigente del ensayo de cartografía crítica (40 % de la nota).",
      },
    ],
  },
  {
    id: "evidencia",
    kicker: "03",
    title: "Evidencia computacional",
    lead: "Los datos y el código que sostienen el ensayo: nueve demostraciones reproducibles con semilla fija, sobre datos reales de Medellín y del mundo.",
    docs: [
      {
        slug: "resultados",
        title: "Resultados computacionales",
        desc: "El resumen canónico de las nueve demostraciones (D1–D9) con sus matices honestos.",
      },
      {
        slug: "ciencia-readme",
        title: "Guía de reproducción",
        desc: "El detalle operativo: qué corre cada script, qué datos usa y qué produce.",
      },
    ],
    links: [
      {
        href: REPO_URL + "/tree/main/ciencia",
        external: true,
        icon: <Github size={15} aria-hidden="true" />,
        title: "Scripts y datos (GitHub)",
        desc: "La carpeta ciencia/ del repositorio: código, datos y figuras generadas.",
      },
    ],
  },
  {
    id: "repo",
    kicker: "04",
    title: "Repositorio",
    lead: "Todo el proyecto en abierto: código de la web, contenido, ciencia e historial de versiones.",
    docs: [
      {
        slug: "readme",
        title: "README del proyecto",
        desc: "Panorama general: la tesis, la estructura de carpetas y cómo se construye el sitio.",
      },
    ],
    links: [
      {
        href: REPO_URL,
        external: true,
        icon: <Github size={15} aria-hidden="true" />,
        title: "github.com/stevenvo780/ensayo-filosofia-ciudad",
        desc: "El repositorio completo, con licencia abierta y todo el historial de commits.",
      },
    ],
  },
];

function DocCard({ doc }: { doc: DocItem }) {
  return (
    <div className="mat-card">
      <span className="mat-card__badge">
        <FileText size={13} aria-hidden="true" /> .md
      </span>
      <span className="mat-card__body">
        <Link to={`/lectura/${doc.slug}`} className="mat-card__title mat-card__stretch">
          {doc.title}
        </Link>
        <span className="mat-card__desc">{doc.desc}</span>
      </span>
      <span className="mat-card__actions">
        <Link to={`/lectura/${doc.slug}`} className="mat-card__read">
          Leer →
        </Link>
        <a className="mat-card__dl" href={`/materiales/${doc.slug}.md`} download>
          .md ↓
        </a>
      </span>
    </div>
  );
}

function LinkCard({ item }: { item: LinkItem }) {
  const body = (
    <>
      <span className="mat-card__badge mat-card__badge--link">{item.icon}</span>
      <span className="mat-card__body">
        <span className="mat-card__title mat-card__stretch">{item.title}</span>
        <span className="mat-card__desc">{item.desc}</span>
      </span>
      <span className="mat-card__action" aria-hidden="true">
        {item.download ? "Descargar ↓" : item.external ? "Abrir ↗" : "Ir →"}
      </span>
    </>
  );

  if (item.to) {
    return (
      <Link to={item.to} className="mat-card mat-card--link">
        {body}
      </Link>
    );
  }
  return (
    <a
      className="mat-card mat-card--link"
      href={item.href}
      {...(item.download ? { download: true } : {})}
      {...(item.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {body}
    </a>
  );
}

export default function MaterialesPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Materiales — La ciudad bien asignada";
  }, []);

  return (
    <>
      <a className="skip-link" href="#inicio">
        Saltar al contenido
      </a>
      <Nav />
      <Hero
        kicker="Materiales · el proyecto abierto"
        title={TITLE}
        subtitle="Todo el proceso es auditable: fuentes, crítica, método y datos, en un solo lugar."
        meta={<Link to="/">← Volver al ensayo «La ciudad bien asignada»</Link>}
      />
      <main id="inicio" className="mat-wrap">
        {SECTIONS.map((s) => (
          <section key={s.id} id={s.id} className="mat-section">
            <header className="mat-section__head">
              <span className="mat-section__kicker">{s.kicker}</span>
              <div>
                <h2>{s.title}</h2>
                <p className="mat-section__lead">{s.lead}</p>
              </div>
            </header>
            <div className="mat-grid">
              {s.docs?.map((d) => (
                <DocCard key={d.slug} doc={d} />
              ))}
              {s.links?.map((l) => (
                <LinkCard key={l.to ?? l.href} item={l} />
              ))}
            </div>
          </section>
        ))}
      </main>
      <Footer title="La ciudad bien asignada" />
    </>
  );
}
