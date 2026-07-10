# Makefile — compuertas de calidad del ensayo «La ciudad bien asignada».
# Estilo del repo hermano (ensayo-platon-gorgias): targets cortos, PHONY, tabs.
PY     := .venv/bin/python
ENSAYO := ensayo/00_ensayo.md
PDF    := web/public/ensayo-la-ciudad-bien-asignada.pdf

.DEFAULT_GOAL := help
.PHONY: help verify wordcount pdf pages web all

help:  ## Lista los targets disponibles
	@echo "Targets del proyecto:"
	@echo "  make verify     valida las cifras empíricas del ensayo y la tesis"
	@echo "                  contra ciencia/RESULTADOS.md (compuerta dura, exit 1)"
	@echo "  make wordcount  cuenta las palabras del cuerpo del ensayo y falla"
	@echo "                  si sale del rango 2000-2500"
	@echo "  make pdf        genera el PDF entregable (scripts/build-pdf.sh)"
	@echo "  make pages      muestra el número de páginas del PDF"
	@echo "  make web        compila el sitio (cd web && npm run build)"
	@echo "  make all        verify + wordcount + pdf"
	@echo "  make help       esta ayuda (target por defecto)"

verify:  ## Verifica las cifras empíricas vs RESULTADOS.md (compuerta dura)
	@$(PY) scripts/verify_cifras.py

wordcount:  ## Cuenta las palabras del cuerpo y exige el rango 2000-2500
	@$(PY) -c "import re,sys; t=open('$(ENSAYO)',encoding='utf-8').read(); seg=t.split(chr(35)*2+' Bibliografía')[0].split(chr(10)+'---'+chr(10))[1]; lines=[l for l in seg.split(chr(10)) if not l.lstrip().startswith(('![','*Figura',chr(35)))]; w=len(re.findall(r'\S+',chr(10).join(lines))); ok=2000<=w<=2500; print('cuerpo: %d palabras  (rango 2000-2500)  ->  %s'%(w,'OK' if ok else 'FUERA DE RANGO')); sys.exit(0 if ok else 1)"

pdf:  ## Genera el PDF entregable desde ensayo/00_ensayo.md
	@bash scripts/build-pdf.sh

pages:  ## Muestra las páginas del PDF entregable
	@test -f $(PDF) || { echo "PDF no encontrado: $(PDF) — corré 'make pdf'"; exit 1; }
	@echo "$(PDF):"
	@pdfinfo $(PDF) | grep -E '^Pages:'

web:  ## Compila el sitio web
	@cd web && npm run build

all: verify wordcount pdf  ## Corre verify + wordcount + pdf
	@echo "OK: verify + wordcount + pdf"
