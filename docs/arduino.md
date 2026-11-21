# Mando con Arduino

El juego se maneja con botones físicos: **cuatro por jugador** y **uno de pausa**. El Arduino solo envía eventos por USB (puerto serie); el navegador los lee con la [Web Serial API](https://developer.mozilla.org/docs/Web/API/Web_Serial_API).

## Requisitos
- Chrome o Edge (Firefox y Safari no incluyen Web Serial).
- Abrir el juego desde `http://localhost:5000` (con `python app.py`) o por `https`.
- Cargar `arduino/controles/controles.ino` en la placa (Uno, Nano, Mega…).

## Cableado
Cada botón une su pin con **GND** (el sketch usa `INPUT_PULLUP`: no hace falta resistencia).

| Pin | Botón | Pin | Botón |
|---|---|---|---|
| 2 | Jugador 1 · izquierda | 6 | Jugador 2 · izquierda |
| 3 | Jugador 1 · derecha | 7 | Jugador 2 · derecha |
| 4 | Jugador 1 · aletear | 8 | Jugador 2 · aletear |
| 5 | Jugador 1 · picada | 9 | Jugador 2 · picada |
| 10 | Pausa | | |

Para un solo jugador basta con los pines 2–5 (y 10 si se quiere pausa).

## Qué hace cada botón
| Botón | En vuelo | En menús, mapa, diálogos y novela |
|---|---|---|
| Izquierda | gira a la izquierda | opción anterior |
| Derecha | gira a la derecha | opción siguiente |
| Aletear | aletea / despega | **aceptar** |
| Picada | desciende rápido | volver |
| Pausa | pausa / reanuda | volver |

La tabla de navegación está en `src/javascript/entrada/acciones.js` (`NAV_MENU`).

## Conectar
1. Abre **Ajustes** (icono de engranaje en el menú) y pulsa **Conectar Arduino**; elige el puerto.
2. En Chrome/Edge el permiso queda guardado: la próxima vez el juego se reconecta solo al abrirse.
3. El estado aparece en Ajustes («Arduino conectado»).

## Protocolo serie (115200 baudios)
Una línea por evento, terminada en `\n`: `<jugador><botón><estado>`.

- `jugador`: `1` o `2` · `botón`: `I` izquierda, `D` derecha, `A` aletear, `P` picada · `estado`: `1` pulsado, `0` soltado.
- Pausa: `S1` / `S0`.
- Ejemplos: `1A1` (jugador 1 pulsa aletear), `2I0` (jugador 2 suelta izquierda).

Se puede probar sin juego abriendo el Monitor Serie del IDE de Arduino. La interpretación del protocolo está en `src/javascript/entrada/protocolo.js` y tiene pruebas: `node --test tests/protocolo.test.mjs`.

## Si más adelante se usa otra placa o un mando analógico
Cualquier dispositivo que envíe estas líneas funciona sin tocar el juego. Para otro protocolo (por ejemplo un joystick analógico) solo hay que cambiar `protocolo.js`; el adaptador (`arduino.js`) y el despachador (`acciones.js`) no conocen las reglas del juego.

## Sin Arduino
El teclado y la pantalla táctil siguen funcionando: Jugador 1 con flechas o WASD + Espacio; en modo dos jugadores, el jugador 1 usa WASD y el jugador 2 las flechas y Espacio.
