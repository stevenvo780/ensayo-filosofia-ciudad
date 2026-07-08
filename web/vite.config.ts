import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Build estático (SPA). El contenido markdown se sincroniza desde la fuente
// única (../../ensayo, ../../tesis, ../../ciencia/figs) vía scripts/sync-content.mjs
// en el paso `prebuild`, de modo que el bundle es autocontenido y funciona sin red.
export default defineConfig({
  plugins: [react()],
  base: "/",
  build: {
    outDir: "dist",
    assetsInlineLimit: 0,
    sourcemap: false,
    chunkSizeWarningLimit: 700,
    rollupOptions: {
      output: {
        manualChunks: {
          react: ["react", "react-dom", "react-router-dom"],
          motion: ["framer-motion"],
          markdown: ["react-markdown", "remark-gfm"],
          icons: ["lucide-react"],
        },
      },
    },
  },
});
