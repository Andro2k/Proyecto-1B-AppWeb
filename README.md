# Guardianes del Cóndor · Grupo 02

Prototipo semi 3D (perspectiva pseudo-3D en `<canvas>`) del juego educativo sobre el cóndor andino.
Integrantes: Jose Luis Andino, Richard Tipantiza, Rommel Rivera, Sebastian Chicaiza.

## Cómo jugarlo
- Sin servidor: abrir `src/index.html` (los puntajes se guardan en el navegador).
- Con Flask: `pip install -r requirements.txt` y luego `python app.py` → http://127.0.0.1:5000

## Controles
Flechas o A/D: girar · Espacio o ↑: aletear (gasta energía) · ↓ o S: picada · P o Esc: pausa.
Celular: arrastrar para girar, tocar para aletear, botón «Picada».

## Modos de juego
- Elige un jugador o dos jugadores en el menú e ingresa sus nombres.
- En modo de dos jugadores, ambos vuelan al mismo tiempo en pantalla dividida y recorren sus propios niveles. Jugador 1 usa A/D/W/S; jugador 2 usa las flechas, Espacio y ↓.
- Al terminar ambos recorridos, gana el puntaje más alto; los dos resultados se agregan a la tabla.
- En pausa puedes consultar puntajes, logros, ajustes de contraste y tamaño de texto, enciclopedia o volver al menú.
- La interfaz se adapta al tamaño de ventana y conserva formato panorámico 16:9, pensado para mostrarse a pantalla completa en un monitor grande.

## Estructura
`app.py` (API `GET/POST /api/puntajes`) · `src/index.html` · `src/css/styles.css` · `src/javascript/datos.js` (datos con fuente, niveles, preguntas) · `src/javascript/main.js` (lógica y dibujo).

## Créditos
Gráficos dibujados por código (sin imágenes externas). Fuentes de los datos: ver `datos.js`.

## Acceso desde otras redes
- **Misma red (Wi-Fi/LAN):** `python app.py` ya escucha en `0.0.0.0:5000`; abrir `http://IP-DE-TU-PC:5000` (ver IP con `ip a`). Puede hacer falta abrir el puerto 5000 en el firewall.
- **Otras redes, rápido (temporal):** con el servidor corriendo, `cloudflared tunnel --url http://localhost:5000` o `ngrok http 5000` entregan un enlace público.
- **Publicarlo (Render, Railway, etc.):** Build `pip install -r requirements.txt`, Start `gunicorn app:app`. En el plan gratuito el disco es temporal: los puntajes del servidor se pierden al reiniciar (variable `DATA_DIR` para apuntar a un disco persistente).
- `FLASK_DEBUG=1 python app.py` solo para desarrollo (activa el depurador y limita el servidor a localhost).
