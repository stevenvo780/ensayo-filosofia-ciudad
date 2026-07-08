import { Component, type ReactNode } from "react";

/** Evita la pantalla en blanco si una ruta falla al renderizar o cargar su chunk. */
export class ErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: unknown) {
    console.error("Error de ruta:", error);
  }

  render() {
    if (this.state.failed) {
      return (
        <div style={{ padding: "clamp(60px,12vw,120px) 20px", textAlign: "center", maxWidth: 520, margin: "0 auto" }}>
          <p style={{ fontFamily: "var(--font-serif)", fontSize: "1.15rem", color: "var(--ink)" }}>
            No se pudo cargar esta página.
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            style={{
              marginTop: 16, padding: "10px 22px", borderRadius: 40, cursor: "pointer",
              fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: ".1em", fontSize: 12,
              background: "var(--accent)", color: "#fff", border: 0,
            }}
          >
            Recargar
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
