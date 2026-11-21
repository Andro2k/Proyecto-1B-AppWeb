# Walkthrough · Guardianes del Cóndor

Aplicar los parches (sobre `master`, que estaba al día tras `git pull`):

```bash
git pull
git am patches/00*.patch          # 12 parches, en orden
pip install -r requirements.txt
python app.py                     # http://127.0.0.1:5000
python -m unittest discover -s tests
node --test tests/protocolo.test.mjs
```

| # | Parche | Qué resuelve |
|---|---|---|
| 1 | refactor(estructura) | Separa JS en módulos ES (`juego/` lógica pura, `render/`, `entrada/`, `ui/`, `datos/`) y CSS en archivos temáticos. Sin cambio de comportamiento. |
| 2 | fix(puntajes) | Puntaje duplicado: cierre de partida idempotente, guardado único por partida, id por resultado y servidor idempotente. Con pruebas. |
| 3 | feat(ui) | Juego a ventana completa; tipografía escalada para 1 m en un 19"; fuentes locales. |
| 4 | feat(menu) | Menú pixel-art: Nuevo juego / Puntajes / Salir; navegación por foco. |
| 5 | feat(mapa) | Mapa de Ecuador, 6 niveles reales que se desbloquean, «Continuar», derrota con reintento. |
| 6 | feat(paisaje) | Paisaje propio por nivel, más elementos (nubes, lagunas, llamas, chozas…), carroña realista. |
| 7 | feat(personajes) | Cóndor hembra (compañera guía; jugador 2 en dúo) y cóndor más realista. |
| 8 | feat(clima) | Tormentas eléctricas con lluvia y rayos que quitan una vida. |
| 9 | feat(enemigos) | Cazadores que apuntan y disparan. |
| 10 | feat(novela) | Novela visual final con elección y moraleja. |
| 11 | feat(entrada) | Control por Arduino (Web Serial) + sketch + docs. |
| 12 | docs | README. |

## Cosas que conviene saber
- **Servidor obligatorio:** al usar módulos ES ya no basta con abrir `index.html` como archivo; se necesita `python app.py` (o cualquier servidor estático).
- **Bug de puntajes:** no pude reproducir una causa única con el código original (un doble clic simple guardaba una sola vez). Cerré todas las rutas posibles de doble guardado; si sigues viendo duplicados, dime los pasos exactos.
- **Arduino:** probado con un puerto serie simulado, no con una placa real. Cableado y protocolo en `docs/arduino.md`.
- **Datos «Por confirmar»** en `datos/datos.js` (páramo, clima de montaña, cazadores): verifica la fuente antes de citarlos.
- **Tipografía a 1 m:** dimensionada y revisada con capturas a 1280×1024 y 1366×768; conviene comprobarla en el monitor real.
