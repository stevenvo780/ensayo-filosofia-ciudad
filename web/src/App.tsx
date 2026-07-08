import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import EssayPage from "./pages/EssayPage";
import TesisPage from "./pages/TesisPage";
import { ErrorBoundary } from "./components/ErrorBoundary";

/**
 * Reintento de import con auto-recarga: si un chunk falla (típico tras un deploy,
 * cuando la pestaña tiene referencias a hashes viejos), recarga UNA vez para
 * traer el index nuevo, en vez de dejar la pantalla en blanco. Evita bucles con
 * una ventana de 10 s.
 */
function retryImport<T>(factory: () => Promise<T>): Promise<T> {
  return factory().catch((err) => {
    const last = Number(sessionStorage.getItem("chunkReloadAt") || 0);
    if (Date.now() - last > 10000) {
      sessionStorage.setItem("chunkReloadAt", String(Date.now()));
      window.location.reload();
      return new Promise<T>(() => {});
    }
    throw err;
  });
}

// El ensayo y la tesis se cargan de forma directa (sin chunk aparte) para que la
// navegación por router nunca dependa de un chunk que pueda faltar. Solo el deck
// —más pesado (framer-motion + canvases)— queda diferido, con auto-recarga.
const DeckPage = lazy(() => retryImport(() => import("./pages/DeckPage")));

export default function App() {
  return (
    <ErrorBoundary>
      <Suspense fallback={null}>
        <Routes>
          <Route path="/" element={<EssayPage />} />
          <Route path="/tesis" element={<TesisPage />} />
          <Route path="/presentacion" element={<DeckPage />} />
          <Route path="*" element={<EssayPage />} />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
}
