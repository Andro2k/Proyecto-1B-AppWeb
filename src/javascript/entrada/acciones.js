/* Despachador de acciones de hardware (Arduino u otro mando): en vuelo mueve al cóndor del jugador;
   en menús, mapas, diálogos y la novela los mismos botones navegan. Así el juego se maneja sin teclado ni ratón. */
import { navegar } from './navegacion.js';

/* Con 4 botones por jugador: izquierda/derecha recorren las opciones, aletear acepta y picada vuelve. */
const NAV_MENU = { izq: 'arriba', der: 'abajo', aleteo: 'aceptar', pica: 'atras' };

/** api = { estado(), mundos(), pausa() } → { accion(jugador, tipo, activa), pausa(activa) } */
export function crearDespachador(api) {
  return {
    accion(jugador, tipo, activa) {
      const m = api.mundos()[jugador];
      if (!activa) { if (m) m.entrada[tipo] = false; return; }                  // soltar siempre libera la acción (aunque cambie la pantalla)
      if (api.estado() === 'juego') { if (m) m.entrada[tipo] = true; return; }
      navegar(NAV_MENU[tipo]);
    },
    pausa(activa) {
      if (!activa) return;
      if (api.estado() === 'juego' || api.estado() === 'pausa') api.pausa(); else navegar('atras');
    }
  };
}
