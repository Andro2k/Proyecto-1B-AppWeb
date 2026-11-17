# Guardianes del Cóndor · Grupo 02

Prototipo semi 3D (perspectiva pseudo-3D en `<canvas>`) del juego educativo sobre el cóndor andino.
Integrantes: Jose Luis Andino, Richard Tipantiza, Rommel Rivera, Sebastian Chicaiza.

## Cómo jugarlo
- Sin servidor: abrir `src/index.html` (los puntajes se guardan en el navegador).
- Con Flask: `pip install -r requirements.txt` y luego `python app.py` → http://127.0.0.1:5000

## Controles
Flechas o A/D: girar · Espacio o ↑: aletear (gasta energía) · ↓ o S: picada · P o Esc: pausa.
Celular: arrastrar para girar, tocar para aletear, botón «Picada».

## Estructura
`app.py` (API `GET/POST /api/puntajes`) · `src/index.html` · `src/css/styles.css` · `src/javascript/datos.js` (datos con fuente, niveles, preguntas) · `src/javascript/main.js` (lógica y dibujo).

## Créditos
Gráficos dibujados por código (sin imágenes externas). Fuentes de los datos: ver `datos.js`.
