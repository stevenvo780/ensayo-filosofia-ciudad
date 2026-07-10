#!/usr/bin/env bash
# Genera el PDF del ensayo (entregable académico) desde ensayo/00_ensayo.md.
# Pipeline: pandoc (md -> HTML autocontenido, figuras embebidas) -> Chrome (print-to-PDF).
# Uso:  bash scripts/build-pdf.sh
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT="$ROOT/web/public/ensayo-la-ciudad-bien-asignada.pdf"
HEAD="$(mktemp --suffix=.html)"
AFTER="$(mktemp --suffix=.html)"
HTML="$(mktemp --suffix=.html)"
CHROME="${CHROME:-/opt/google/chrome/chrome}"

cat > "$HEAD" <<'CSS'
<style>
@page { size: Letter; margin: 2.54cm; }  /* APA 7: 1 pulgada en los cuatro lados */
* { box-sizing: border-box; }
/* anula el max-width que pandoc impone por defecto (causaba márgenes laterales enormes) */
html, body { max-width: none !important; width: auto !important; margin: 0 !important; padding: 0 !important; }
/* el título del documento lo pone el propio markdown (# ...); ocultamos el bloque que pandoc duplica */
#title-block-header { display: none; }
body { font-family: Georgia, "Times New Roman", serif; font-size: 11.7pt; line-height: 1.5;
  color: #1b1b1b; text-align: justify; hyphens: auto; -webkit-hyphens: auto; }
h1 { text-align: center; font-size: 21pt; font-weight: 700; line-height: 1.12; letter-spacing: -.01em; margin: 0 0 3pt; }
h1 + h2 { text-align: center; font-weight: 400; font-style: italic; font-size: 13pt; color: #444; border: 0; margin: 2pt 0 11pt; }
h1 + h2 + p { text-align: center; font-size: 9.3pt; color: #555; margin: 0 0 13pt; }
h1 + h2 + p strong { font-weight: 400; }
blockquote { margin: 0 0 4pt; padding: 5pt 13pt; border-left: 2pt solid #b25a24; font-size: 9.6pt; color: #555; }
blockquote p { margin: 0; text-align: left; font-style: italic; }
hr { border: 0; border-top: .5pt solid #ccc; margin: 13pt 0 15pt; }
h2 { font-family: Georgia, serif; font-size: 13.5pt; font-weight: 700; text-align: left;
  margin: 17pt 0 4pt; line-height: 1.2; page-break-after: avoid; }
h3 { font-size: 11.4pt; font-weight: 700; margin: 12pt 0 2pt; }
p { margin: 0 0 8pt; orphans: 2; widows: 2; }
strong { font-weight: 700; }
em { font-style: italic; }
p:has(> img) { text-align: center; font-size: 8.7pt; line-height: 1.4; color: #555;
  margin: 16pt auto; page-break-inside: avoid; }
p:has(> img) img { display: block; margin: 0 auto 6pt; max-width: 80%; height: auto; }
p:has(> img) em { font-style: italic; }
ul { font-size: 10pt; padding-left: 18pt; }
li { margin: 2pt 0; }
.colophon { margin-top: 14pt; padding: 10pt 13pt; border: .5pt solid #ddd; border-left: 2.5pt solid #b25a24;
  background: #faf7f1; font-size: 8.9pt; line-height: 1.5; color: #444; text-align: left; page-break-inside: avoid; }
.colophon .colo-title { font-weight: 700; font-size: 8.6pt; color: #b25a24; text-transform: uppercase; letter-spacing: .07em; margin: 0 0 5pt; }
.colophon p { margin: 3pt 0; }
.colophon a { color: #b25a24; text-decoration: none; font-weight: 700; }
</style>
CSS

cat > "$AFTER" <<'HTML'
<div class="colophon">
  <p class="colo-title">Recursos y reproducibilidad</p>
  <p><strong>Versión interactiva</strong>, con animaciones que explican las demostraciones (la métrica que decide el centro, Schelling en vivo, la tríada computa/cultiva/delibera): <a href="https://autopoesis.stevenvallejo.com">autopoesis.stevenvallejo.com</a></p>
  <p><strong>Código, datos reales de Medellín (OpenStreetMap, SRTM, GeoNames) y tesis de respaldo</strong> — todo abierto y reproducible: <a href="https://github.com/stevenvo780/ensayo-filosofia-ciudad">github.com/stevenvo780/ensayo-filosofia-ciudad</a></p>
  <p><strong>Tesis de respaldo</strong> (aparato empírico completo, trece demostraciones): <a href="https://autopoesis.stevenvallejo.com/tesis">autopoesis.stevenvallejo.com/tesis</a> &nbsp;·&nbsp; <strong>Presentación</strong>: <a href="https://autopoesis.stevenvallejo.com/presentacion">autopoesis.stevenvallejo.com/presentacion</a></p>
  <p style="margin-top:6pt;color:#777;">Steven Vallejo Ortiz · Filosofía de la Ciudad · Universidad de Antioquia · 2026</p>
</div>
HTML

cd "$ROOT/ensayo"
pandoc 00_ensayo.md -f markdown-implicit_figures -t html5 --standalone --embed-resources --mathml \
  --include-in-header="$HEAD" --include-after-body="$AFTER" \
  -M title="La ciudad bien asignada — cartografía crítica de una Medellín posible" \
  -o "$HTML"
"$CHROME" --headless=new --no-sandbox --disable-gpu --no-pdf-header-footer \
  --print-to-pdf="$OUT" "file://$HTML" 2>/dev/null
rm -f "$HEAD" "$AFTER" "$HTML"
echo "PDF generado: $OUT ($(wc -c < "$OUT") bytes)"
