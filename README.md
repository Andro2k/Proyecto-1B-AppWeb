# Guardianes del Cóndor · Grupo 02

Prototipo semi 3D (perspectiva pseudo-3D en `<canvas>`) del juego educativo sobre el cóndor andino.
Integrantes: Jose Luis Andino, Richard Tipantiza, Rommel Rivera, Sebastian Chicaiza.

## Cómo jugarlo
1. `pip install -r requirements.txt`
2. `python app.py` → http://127.0.0.1:5000

El código JavaScript usa módulos ES, que el navegador solo carga por HTTP: ya no basta con abrir `src/index.html` como archivo. Si no quieres Flask: `python -m http.server -d src 8000` (los puntajes se guardan entonces en el navegador).

## El juego
Eres Kuntur, un cóndor andino que vuela de norte a sur por los Andes de Ecuador hasta llegar a su nido.

1. **Mapa de Ecuador:** cada nivel es un lugar real —Cayambe, Antisana, Cotopaxi, Chimborazo, El Cajas y Podocarpus— y se desbloquea al completar el anterior. Se pueden repetir y se conserva el mejor puntaje.
2. **Peligros:** cables eléctricos, carroña envenenada, **tormentas eléctricas** (Chimborazo y Podocarpus) y **cazadores** (Cotopaxi, El Cajas y Podocarpus).
3. **Cóndor hembra:** en modo un jugador, Killa vuela por delante y guía hacia las térmicas; en dos jugadores, el jugador 2 es la hembra (sin cresta, algo más pequeña).
4. **Final:** al completar los 6 niveles se muestra una novela visual, «El nido de Kuntur», con una moraleja sobre cuidar a los cóndores (pensada para mayores de 7 años).
5. **Continuar:** la partida en curso se guarda al terminar cada nivel; el menú ofrece «Continuar».

## Controles
| | Jugador 1 | Jugador 2 (modo dos jugadores) |
|---|---|---|
| Girar | ← → o A / D | ← → |
| Aletear | Espacio, ↑ o W | Espacio o ↑ |
| Picada | ↓ o S | ↓ |

P o Esc: pausa. En menús: flechas para moverse, Enter para aceptar, Esc para volver. Pantalla táctil: arrastrar para girar, tocar para aletear. En modo dos jugadores el jugador 1 usa A/D/W/S.

**Arduino:** también se puede jugar con botones físicos (4 por jugador + pausa) → ver [docs/arduino.md](docs/arduino.md).

### Rayos y cazadores
- Una nube de tormenta marca en el suelo dónde caerá el rayo: el círculo sigue al cóndor y luego se fija en rojo. Hay que moverse de lado antes de que caiga.
- Un cazador te apunta con una línea amarilla; cuando se pone roja la mira está bloqueada y dispara: hay que moverse de lado. Por encima de 20 de altura no te alcanzan.

## Pantalla de 19" y quiosco
- El juego ocupa toda la ventana del navegador y se adapta a 5:4 (1280×1024), 16:10 y 16:9.
- Texto escalado con la ventana (≈ 25 px en 1366×768, ≈ 36 px en 1280×1024) y fuentes Atkinson Hyperlegible y Pixelify Sans incluidas en `src/fonts` (funciona sin internet). Ajustes: alto contraste y texto grande.
- Modo quiosco sugerido: `chrome --kiosk --app=http://localhost:5000` (o F11 / «Pantalla completa» en Ajustes).

## Estructura
```
app.py                    API Flask  GET/POST /api/puntajes  (idempotente por id)
src/index.html
src/css/                  base · pantallas · menu · mapa · novela · dialogos · hud · responsive
src/fonts/                fuentes locales (licencia OFL)
src/javascript/
  main.js                 conecta módulos y ejecuta el bucle
  config.js · util.js
  datos/                  datos curiosos · niveles · paisajes · preguntas · historia · geografía del mapa
  juego/                  lógica pura (sin DOM): mundo · reglas · clima · enemigos · eventos · progreso · puntajes
                          y partida.js (controlador / máquina de estados)
  render/                 escena, fondo, montes, clima, menú pixel-art, novela y una función por entidad
  entrada/                teclado · táctil · arduino · protocolo · acciones · navegación
  ui/                     pantallas, HUD, mapa, novela y diálogos (solo DOM)
arduino/controles/        sketch del mando
docs/arduino.md           cableado y protocolo
scripts/generar_mapa.py   regenera datos/geografia.js desde Natural Earth
tests/                    API de puntajes (unittest) y protocolo del Arduino (node --test)
```

## Pruebas
```
python -m unittest discover -s tests
node --test tests/protocolo.test.mjs
```

## Datos y fuentes
Los datos curiosos están en `src/javascript/datos/datos.js`, cada uno con su fuente. Los marcados «Por confirmar» (páramo, clima de montaña, cazadores y disparos) deben verificarse antes de citarlos en el informe (APA 7).

## Créditos
Integrantes: Jose Luis Andino, Richard Tipantiza, Rommel Rivera, Sebastian Chicaiza.
Gráficos dibujados por código (sin imágenes externas). Mapa: Natural Earth (dominio público), simplificado. Fuentes tipográficas: Atkinson Hyperlegible y Pixelify Sans (SIL Open Font License, ver `src/fonts`).

## Acceso desde otras redes
- **Misma red (Wi-Fi/LAN):** `python app.py` ya escucha en `0.0.0.0:5000`; abrir `http://IP-DE-TU-PC:5000` (ver IP con `ip a`). Puede hacer falta abrir el puerto 5000 en el firewall.
- **Otras redes, rápido (temporal):** con el servidor corriendo, `cloudflared tunnel --url http://localhost:5000` o `ngrok http 5000` entregan un enlace público.
- **Publicarlo (Render, Railway, etc.):** Build `pip install -r requirements.txt`, Start `gunicorn app:app`. En el plan gratuito el disco es temporal: los puntajes del servidor se pierden al reiniciar (variable `DATA_DIR` para apuntar a un disco persistente).
- `FLASK_DEBUG=1 python app.py` solo para desarrollo (activa el depurador y limita el servidor a localhost).
