// Sincroniza el contenido desde la FUENTE ÚNICA hacia el proyecto web.
// El ensayo y la tesis viven en ../ensayo y ../tesis; las figuras en ../ciencia/figs.
// Este script los copia a src/content y public/figs para que el bundle sea autocontenido.
// Es tolerante: si la fuente no existe (p. ej. build en la nube), conserva las copias.
import { mkdirSync, copyFileSync, existsSync, writeFileSync, readdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const WEB = resolve(HERE, "..");
const REPO = resolve(WEB, "..");

const ensureDir = (p) => mkdirSync(p, { recursive: true });
ensureDir(resolve(WEB, "src/content"));
ensureDir(resolve(WEB, "public/figs"));
ensureDir(resolve(WEB, "public/materiales"));

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
for (const d of ["D1", "D2", "D3", "D4", "D5", "D6", "D7", "D8", "D10", "D11", "D12", "D13"]) {
  copy(`ciencia/figs/${d}_mega.png`, `public/figs/${d}_mega.png`, `figs/${d}_mega.png`);
}

// Diagramas conceptuales (SVG) → public/figs/diagramas/ — sirven a web Y PDF desde la misma fuente.
const diagDir = resolve(REPO, "ciencia/figs/diagramas");
if (existsSync(diagDir)) {
  ensureDir(resolve(WEB, "public/figs/diagramas"));
  for (const f of readdirSync(diagDir)) {
    if (f.toLowerCase().endsWith(".svg")) {
      copy(`ciencia/figs/diagramas/${f}`, `public/figs/diagramas/${f}`, `figs/diagramas/${f}`);
    }
  }
}

// Espejo de materiales: TODOS los .md del proyecto legibles y descargables en la
// web (/materiales/<archivo>), con nombres legibles. Tolerante: si falta alguno,
// se salta sin romper el build.
const MATERIALES = [
  ["CONSIGNA.md", "consigna.md"],
  ["README.md", "readme.md"],
  ["GUION-DEFENSA.md", "guion-defensa.md"],
  ["CRITICA.md", "critica.md"],
  ["CRITICA2.md", "critica2.md"],
  ["CRITICA3.md", "critica3.md"],
  ["ciencia/RESULTADOS.md", "resultados.md"],
  ["ciencia/README.md", "ciencia-readme.md"],
];
for (const [from, name] of MATERIALES) {
  copy(from, `public/materiales/${name}`, `materiales/${name}`);
}

// docs/*.md si existe la carpeta (tolerante si no existe ninguna).
const docsDir = resolve(REPO, "docs");
if (existsSync(docsDir)) {
  for (const f of readdirSync(docsDir)) {
    if (f.toLowerCase().endsWith(".md")) {
      copy(`docs/${f}`, `public/materiales/${f.toLowerCase()}`, `materiales/${f.toLowerCase()}`);
    }
  }
}

// docs/iteraciones/*.md → materiales/iter-<basename>.md (SLUG PLANO, sin barras,
// para que /lectura/iter-<slug> funcione). Tolerante si la carpeta no existe.
const iterDir = resolve(REPO, "docs/iteraciones");
if (existsSync(iterDir)) {
  for (const f of readdirSync(iterDir)) {
    if (f.toLowerCase().endsWith(".md")) {
      const name = `iter-${f.toLowerCase()}`;
      copy(`docs/iteraciones/${f}`, `public/materiales/${name}`, `materiales/${name}`);
    }
  }
}

// docs/ciencia/*.md → materiales/ciencia-<basename>.md — explicadores por demostración
// (la ciencia densa, explicada en lenguaje llano). Tolerante si la carpeta no existe.
const cienciaDir = resolve(REPO, "docs/ciencia");
if (existsSync(cienciaDir)) {
  for (const f of readdirSync(cienciaDir)) {
    if (f.toLowerCase().endsWith(".md")) {
      const name = `ciencia-${f.toLowerCase()}`;
      copy(`docs/ciencia/${f}`, `public/materiales/${name}`, `materiales/${name}`);
    }
  }
}

// marcador para asegurar que la carpeta content nunca quede vacía en el árbol
const gk = resolve(WEB, "src/content/.gitkeep");
if (!existsSync(gk)) writeFileSync(gk, "");
console.log("Contenido sincronizado.");
