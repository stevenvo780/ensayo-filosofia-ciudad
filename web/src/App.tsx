import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import EssayPage from "./pages/EssayPage";

// Rutas secundarias con carga diferida (code-splitting).
const TesisPage = lazy(() => import("./pages/TesisPage"));
const DeckPage = lazy(() => import("./pages/DeckPage"));

export default function App() {
  return (
    <Suspense fallback={null}>
      <Routes>
        <Route path="/" element={<EssayPage />} />
        <Route path="/tesis" element={<TesisPage />} />
        <Route path="/presentacion" element={<DeckPage />} />
        <Route path="*" element={<EssayPage />} />
      </Routes>
    </Suspense>
  );
}
