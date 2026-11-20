/* Eventos de juego compartidos por las reglas de vuelo, el clima y los enemigos (sin DOM).
   `ev` = { aviso(titulo, texto, fuente?), dato(id) } lo aporta el controlador de la partida. */

/** Primera vez que el jugador descubre un dato: suma 10 puntos y lo notifica. */
export function descubrir(m, id, ev) {
  if (m.descubiertos.has(id)) return;
  m.descubiertos.add(id); m.puntos += 10;
  ev.dato(id);
}

/** Quita una vida (con 1,8 s de invulnerabilidad). Si era la última, el mundo termina con 'muerte'. */
export function dano(m, texto, ev) {
  const p = m.p;
  if (p.invul > 0 || m.fin) return;
  p.vidas--; p.invul = 1.8; p.vy = 3;
  ev.aviso('¡Ay!', texto);
  if (p.vidas <= 0) m.fin = 'muerte';
}
