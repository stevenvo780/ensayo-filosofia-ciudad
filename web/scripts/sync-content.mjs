// Sincroniza el contenido desde la FUENTE ÚNICA hacia el proyecto web.
// El ensayo y la tesis viven en ../ensayo y ../tesis; las figuras en ../ciencia/figs.
// Este script los copia a src/content y public/figs para que el bundle sea autocontenido.
// Es tolerante: si la fuente no existe (p. ej. build en la nube), conserva las copias.
import { mkdirSync, copyFileSync, existsSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const WEB = resolve(HERE, "..");
const REPO = resolve(WEB, "..");

const ensureDir = (p) => mkdirSync(p, { recursive: true });
ensureDir(resolve(WEB, "src/content"));
ensureDir(resolve(WEB, "public/figs"));

function copy(from, to, label) {
  const src = resolve(REPO, from);
  const dst = resolve(WEB, to);
  if (existsSync(src)) {
    copyFileSync(src, dst);
    console.log(`  sync  ${label}`);
  } else if (existsSync(dst)) {
    console.log(`  keep  ${label} (fuente ausente; se usa la copia)`);
  } else {
    console.warn(`  MISS  ${label} — no existe fuente ni copia`);
  }
}

copy("ensayo/00_ensayo.md", "src/content/ensayo.md", "ensayo");
copy("tesis/00_tesis.md", "src/content/tesis.md", "tesis");
for (const d of ["D1", "D2", "D3", "D4", "D5", "D6", "D7", "D8"]) {
  copy(`ciencia/figs/${d}_mega.png`, `public/figs/${d}_mega.png`, `figs/${d}_mega.png`);
}

// marcador para asegurar que la carpeta content nunca quede vacía en el árbol
const gk = resolve(WEB, "src/content/.gitkeep");
if (!existsSync(gk)) writeFileSync(gk, "");
console.log("Contenido sincronizado.");
