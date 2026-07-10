# 7 · Precisión modal + auditabilidad

El último paso tuvo dos frentes. El primero, de escritura: afinar la **precisión modal** para que
cada afirmación use el verbo que le corresponde —*demuestra* lo que los datos prueban, *ilustra* lo
que sólo muestra un caso, *concede* lo que la evidencia no alcanza a sostener—. Es la corrección que
convierte un texto persuasivo en un texto auditable: cada frase queda a la altura exacta de su
evidencia.

El segundo frente fue construir el **andamiaje que hace el trabajo verificable de punta a punta**.
Dos compuertas duras en el [`Makefile`](../../Makefile): `make verify`, que contrasta las cifras
empíricas del texto contra [`ciencia/RESULTADOS.md`](../../ciencia/RESULTADOS.md), y `make
wordcount`, que exige el rango de 2.000–2.500 palabras del cuerpo. A eso se suma el espejo público
[`/materiales`](../../web/src/pages/MaterialesPage.tsx) —que expone todo el proceso legible y
descargable—, la [`METODOLOGIA.md`](../METODOLOGIA.md) y esta misma
[bitácora de iteraciones](../ITERACIONES.md).

Con ello el proyecto se entrega como **evidencia abierta y reproducible**: cualquiera puede
re-ejecutar las nueve demostraciones, obtener las mismas cifras y recorrer el proceso hito por hito.
Los ajustes finales quedaron en el commit `1956e00` —*«CRITICA3 trimodelo aplicada + auditabilidad
al estándar Gorgias»*—.
