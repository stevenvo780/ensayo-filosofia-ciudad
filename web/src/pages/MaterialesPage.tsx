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
        desc: "El documento extenso: trece demostraciones, el experimento T1–T6 y el Banco Epistémico Urbano.",
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
        slug: "guion-presentacion",
        title: "Guion de la presentación",
        desc: "El discurso hablado, diapositiva por diapositiva, en prosa continua para leer en voz alta y practicar (14 slides, ~10 min).",
      },
      {
        slug: "guion-defensa",
        title: "Guion de defensa",
        desc: "El kit de respuestas a las objeciones duras de la ronda de preguntas (companion del guion de la presentación).",
      },
      {
        slug: "consigna",
        title: "Consigna del curso",
        desc: "El enunciado vigente del ensayo de cartografía crítica (40 % de la nota).",
      },
    ],
  },
  {
    id: "iteraciones",
    kicker: "03",
    title: "Iteraciones del ensayo",
    lead: "El arco completo del trabajo, hito por hito.",
    docs: [
      {
        slug: "iteraciones",
        title: "Índice — el arco completo",
        desc: "La bitácora: los nueve hitos (0→8) en una sola página, con los commits como evidencia.",
      },
      {
        slug: "iter-0-consigna",
        title: "0 · Consigna y materia prima",
        desc: "Las dos exposiciones previas y la consigna real del 7-jul que fija el entregable.",
      },
      {
        slug: "iter-1-tesis",
        title: "1 · Tesis extensa diagnóstica",
        desc: "El primer texto largo y su aparato empírico inicial (D1–D5).",
      },
      {
        slug: "iter-2-critica-1",
        title: "2 · Crítica I — auditoría de la tesis",
        desc: "Seis lentes + verificación adversarial (36/36); el aparato sube a datos reales.",
      },
      {
        slug: "iter-3-giro",
        title: "3 · El giro a cartografía crítica",
        desc: "Llega la consigna real: de texto diagnóstico a proyectivo; la tesis pasa a respaldo.",
      },
      {
        slug: "iter-4-critica-2",
        title: "4 · Crítica II — frente a la consigna",
        desc: "Seis lentes + verificación externa (45/45) y la división en dos textos.",
      },
      {
        slug: "iter-5-ensayo-final",
        title: "5 · Ensayo final + web + PDF + D6–D9",
        desc: "«La ciudad bien asignada», la web interactiva, el PDF y cuatro demostraciones nuevas.",
      },
      {
        slug: "iter-6-critica-3",
        title: "6 · Crítica III — auditoría trimodelo",
        desc: "Nueve lentes en tres familias de modelos; el patrón convergente, corregido.",
      },
      {
        slug: "iter-7-auditabilidad",
        title: "7 · Precisión modal + auditabilidad",
        desc: "El verbo exacto de cada afirmación y las compuertas que hacen el trabajo verificable.",
      },
      {
        slug: "iter-8-autopoiesis",
        title: "8 · Giro autopoiético + 4 experimentos",
        desc: "El lente vira a autopoiesis (abierta/cerrada, agencia inmanente) y se suman D10–D13.",
      },
    ],
  },
  {
    id: "evidencia",
    kicker: "04",
    title: "Evidencia computacional",
    lead: "Los datos y el código que sostienen el ensayo: trece demostraciones reproducibles con semilla fija, sobre datos reales de Medellín (y del mundo, cuando aplica). Y, para la ciencia densa, un explicador en lenguaje llano de cada una: qué pregunta, el algoritmo paso a paso, qué halló y su matiz honesto.",
    docs: [
      {
        slug: "resultados",
        title: "Resultados computacionales",
        desc: "El resumen canónico de las trece demostraciones (D1–D13) con sus matices honestos.",
      },
      {
        slug: "ciencia-readme",
        title: "Guía de reproducción",
        desc: "El detalle operativo: qué corre cada script, qué datos usa y qué produce.",
      },
      {
        slug: "ciencia-juegos",
        title: "Explicador · Teoría de juegos",
        desc: "Síntesis llana: congestión (Braess) y localización (Hotelling) sobre la red real.",
      },
      {
        slug: "ciencia-redes",
        title: "Explicador · Ciencia de redes",
        desc: "Síntesis llana: centralidad (la métrica decide el centro) y difusión con pendiente.",
      },
      {
        slug: "ciencia-decision",
        title: "Explicador · Teoría de la decisión",
        desc: "Síntesis llana: el margen irreducible que ningún optimizador fija (minimax-regret).",
      },
      {
        slug: "ciencia-d1",
        title: "D1 · Ley de Zipf",
        desc: "Por qué el tamaño de las ciudades sigue un patrón casi perfecto (q≈1) sin planificador.",
      },
      {
        slug: "ciencia-d2",
        title: "D2 · Ley de escala",
        desc: "Cómo crecen los servicios con la población (Bettencourt–West, β≈0,90), medido en datos reales.",
      },
      {
        slug: "ciencia-d3",
        title: "D3 · Dimensión fractal",
        desc: "La forma sin escala característica de una huella urbana (conteo de cajas).",
      },
      {
        slug: "ciencia-d4",
        title: "D4 · Segregación de Schelling",
        desc: "Cómo una preferencia local leve produce segregación global que nadie diseñó.",
      },
      {
        slug: "ciencia-d5",
        title: "D5 · La métrica decide el centro",
        desc: "Tres centralidades exactas señalan centros casi disjuntos: el centro no se descubre, se decide.",
      },
      {
        slug: "ciencia-d6",
        title: "D6 · La métrica del cuerpo",
        desc: "La pendiente (función de Tobler) desplaza el centro: la fatiga reescribe la geografía.",
      },
      {
        slug: "ciencia-d7",
        title: "D7 · Umbral de intervención",
        desc: "Cuánta institución cuesta romper la segregación (anclar, ~55 %; diluir no basta).",
      },
      {
        slug: "ciencia-d8",
        title: "D8 · Escala ciudad",
        desc: "Los mismos hallazgos a radio 4 km, con desnivel real de 962 m.",
      },
      {
        slug: "ciencia-d9",
        title: "D9 · Robustez (modelos nulos)",
        desc: "¿Estructura real o artefacto? La prominencia del corredor vs 60 redes nulas (z≈188).",
      },
      {
        slug: "ciencia-d10",
        title: "D10 · Congestión y Braess",
        desc: "Precio de la anarquía (1,03) y por qué cerrar una calle puede mejorar el flujo de todos.",
      },
      {
        slug: "ciencia-d11",
        title: "D11 · Localización de Hotelling",
        desc: "Por qué el comercio informal se aglomera (2,6× vs el óptimo social).",
      },
      {
        slug: "ciencia-d12",
        title: "D12 · Difusión y alcance",
        desc: "Cómo se esparce el footfall y cómo la pendiente encoge lo caminable (−16 % / −24 %).",
      },
      {
        slug: "ciencia-d13",
        title: "D13 · Teoría de la decisión",
        desc: "¿Hay una métrica «correcta» del centro? El minimax-regret dice que no.",
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
    kicker: "05",
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
