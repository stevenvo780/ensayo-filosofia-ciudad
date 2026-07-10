# Evidencia computacional — guía de reproducción

Nueve demostraciones (D1–D9) que sostienen el ensayo. Ejecución **local**, reproducible, semilla fija
`42`. El resumen canónico con los matices honestos de cada resultado está en
[`RESULTADOS.md`](RESULTADOS.md). Aquí va el detalle operativo: qué corre cada script, qué datos usa y
qué produce.

## Preparación

```bash
# desde la raíz del repo
python -m venv .venv
.venv/bin/pip install -r requirements.txt
.venv/bin/python ciencia/mega/D5_mega.py   # ejemplo
```

Cada script imprime un JSON entre `===RESULT===` y `===END===` y escribe su figura en `figs/`.

## Los scripts

| Script | Entrada (datos) | Salida | Real / sintético |
|---|---|---|---|
| `mega/D1_mega.py` | `data/cities15000.txt` (GeoNames) | `figs/D1_mega.png` | real (sistema de ciudades) |
| `mega/D2_mega.py` | OSM amenities + GeoNames → `data/d2_osm_cache.json` | `figs/D2_mega.png` | real |
| `mega/D2_fit_from_cache.py` | `data/d2_osm_cache.json` | ajuste β desde caché | real |
| `mega/D3_mega.py` | — (campo gaussiano generado) | `figs/D3_mega.png` | sintético |
| `mega/D4_mega.py` | — (autómata de Schelling) | `figs/D4_mega.png` | sintético |
| `mega/D5_mega.py` | red peatonal OSM de Medellín (vía `cache/`) | `figs/D5_mega.png` | **real** |
| `mega/D6_pendiente.py` | red real + SRTM → `data/d6_elev_cache.json` | `figs/D6_mega.png` | **real** |
| `mega/D7_intervencion.py` | — (Schelling con palanca) | `figs/D7_mega.png` | sintético |
| `mega/D8_ciudad.py` | red real radio 4 km + SRTM → `data/d8_elev_cache.json` | `figs/D8_mega.png` | **real** |
| `mega/D9_robustez.py` | red D5 + 60 grafos nulos | (JSON; sin figura) | **real** |

## Datos (`data/`) — procedencia

- **`cities15000.txt`** — GeoNames, todas las ciudades del mundo > 15.000 hab.
  Descarga original: <https://download.geonames.org/export/dump/cities15000.zip>.
- **`d2_osm_cache.json`** — conteo de *amenities* (POI) de OpenStreetMap por ciudad (D2).
- **`d6_elev_cache.json`, `d8_elev_cache.json`** — elevación SRTM 30 m por nodo, obtenida de la API
  pública `opentopodata.org` (sin clave). Fija la elevación usada → reproducibilidad exacta.

## Cachés de red (`../cache/`)

`osmnx` guarda ahí las respuestas crudas de la API Overpass de OpenStreetMap. Conservarlas **fija la
red exacta** de calles usada en D5/D6/D8/D9, de modo que los resultados reproducen idénticamente
aunque OSM cambie con el tiempo. Si se borran, los scripts vuelven a descargar la red actual (que
puede diferir levemente).

## Notas de honestidad (resumen)

- **D3, D4, D7** son sintéticos: ilustran mecanismos (fractalidad, emergencia segregante, umbrales de
  intervención), **no** son mediciones de Medellín.
- **D1** es una regularidad del *sistema* de ciudades (ensemble), no de una ciudad singular.
- **D5, D6, D8, D9** son datos **reales** de Medellín (OSM + SRTM).
- Todo se cita como *evidencia consistente con* la lectura autopoiética, nunca como prueba literal.
  El detalle completo está en [`RESULTADOS.md`](RESULTADOS.md).
