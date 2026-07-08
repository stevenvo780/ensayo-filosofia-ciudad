import { useMemo } from "react";
import { Link, NavLink } from "react-router-dom";
import { Contrast, Play, Github, Download } from "lucide-react";
import { Logo } from "./Logo";
import { useTheme } from "../hooks/useTheme";
import { useScrollSpy } from "../hooks/useScrollSpy";

interface Section {
  id: string;
  label: string;
}

/**
 * Barra superior context-aware: marca + secciones (scroll-spy, solo en el ensayo)
 * + enlaces Ensayo / Tesis / Presentación con la página actual resaltada + tema.
 */
export function Nav({ sections = [] }: { sections?: Section[] }) {
  const { toggle } = useTheme();
  const ids = useMemo(() => sections.map((s) => s.id), [sections]);
  const active = useScrollSpy(ids);
  const cta = ({ isActive }: { isActive: boolean }) => "cta" + (isActive ? " active" : "");

  return (
    <nav className="nav" aria-label="Navegación principal">
      <div className="wrap">
        <Link className="brand" to="/" aria-label="Inicio — La ciudad bien asignada">
          <Logo size={24} />
          <span>La ciudad bien asignada</span>
        </Link>

        {sections.map((s) => (
          <a
            key={s.id}
            className={"hideSm section-link" + (active === s.id ? " active" : "")}
            href={`#${s.id}`}
          >
            {s.label}
          </a>
        ))}

        <span className="nav-pages">
          <NavLink to="/" end className={cta}>
            Ensayo
          </NavLink>
          <NavLink to="/tesis" className={cta}>
            Tesis
          </NavLink>
          <NavLink to="/presentacion" className={cta}>
            <Play size={13} aria-hidden="true" /> Presentación
          </NavLink>
        </span>

        <a
          className="cta pdf-link"
          href="/ensayo-la-ciudad-bien-asignada.pdf"
          download
          aria-label="Descargar el ensayo en PDF"
          title="Descargar el ensayo (PDF, 2000–2500 palabras)"
        >
          <Download size={13} aria-hidden="true" /> PDF
        </a>

        <a
          className="themeBtn gh"
          href="https://github.com/stevenvo780/ensayo-filosofia-ciudad"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Código fuente y datos en GitHub"
          title="Código fuente y datos (repositorio)"
        >
          <Github size={16} aria-hidden="true" />
        </a>

        <button
          className="themeBtn"
          type="button"
          onClick={toggle}
          aria-label="Cambiar tema (claro / oscuro)"
        >
          <Contrast size={16} aria-hidden="true" />
        </button>
      </div>
    </nav>
  );
}
