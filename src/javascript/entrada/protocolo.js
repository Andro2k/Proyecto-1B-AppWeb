/* Protocolo serie del Arduino (115200 baudios, una línea por evento, terminada en \n).
   Formato: <jugador><botón><estado>   →   "1A1" = jugador 1, botón Aletear, pulsado;  "1A0" = soltado.
     jugador: 1 | 2        botón: I izquierda · D derecha · A aletear · P picada        estado: 1 pulsado · 0 soltado
   Botón de pausa (único, sin jugador): "S1" / "S0".
   Función pura (sin DOM ni Web Serial): fácil de probar y de cambiar si se modifica el protocolo. */
const BOTONES = { I: 'izq', D: 'der', A: 'aleteo', P: 'pica' };

/** → { jugador: 0 | 1, tipo, activa } | { pausa: true, activa } | null si la línea no es válida. */
export function interpretarLinea(linea) {
  const t = String(linea).trim().toUpperCase();
  const pausa = /^S([01])$/.exec(t);
  if (pausa) return { pausa: true, activa: pausa[1] === '1' };
  const m = /^([12])([IDAP])([01])$/.exec(t);
  return m ? { jugador: Number(m[1]) - 1, tipo: BOTONES[m[2]], activa: m[3] === '1' } : null;
}
