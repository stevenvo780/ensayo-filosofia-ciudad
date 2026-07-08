export interface Doc {
  title: string;
  subtitle: string;
  body: string;
}

/** Separa el bloque de portada (título, subtítulo) del cuerpo markdown. */
export function parseDoc(md: string): Doc {
  const lines = md.split("\n");
  const title = (lines[0] ?? "").replace(/^#+\s*/, "").trim();
  const subtitle = (lines.slice(1, 6).find((l) => l.startsWith("## ")) ?? "")
    .replace(/^#+\s*/, "")
    .trim();
  const idx = md.indexOf("\n---\n");
  const body = idx !== -1 ? md.slice(idx + 5) : md;
  return { title, subtitle, body };
}

const SECTION_IDS: Array<[string, string]> = [
  ["Ontología", "ontologia"],
  ["Poder", "poder"],
  ["Técnica", "tecnica"],
  ["Cierre", "cierre"],
  ["Bibliografía", "bibliografia"],
];

/** id estable y legible para un encabezado, a partir de su texto. */
export function sectionId(text: string): string {
  for (const [key, id] of SECTION_IDS) if (text.includes(key)) return id;
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export const ESSAY_SECTIONS = [
  { id: "ontologia", label: "Ontología" },
  { id: "poder", label: "Poder" },
  { id: "tecnica", label: "Técnica" },
  { id: "cierre", label: "Cierre" },
];
