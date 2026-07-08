import { Logo } from "./Logo";

export function Footer({ title }: { title: string }) {
  return (
    <footer className="site-footer">
      <Logo size={20} />
      <span>
        <strong>{title}</strong>
        <br />
        Steven Vallejo Ortiz · Filosofía de la Ciudad · Universidad de Antioquia · 2026-1. Datos y
        código reproducibles: GeoNames · OpenStreetMap · red real de Medellín. Semilla fija,
        ejecución local.
      </span>
    </footer>
  );
}
