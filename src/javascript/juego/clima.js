/* Tormentas eléctricas. Cada nube sigue un ciclo: espera → carga (la marca sigue al cóndor)
   → fijo (la marca se bloquea: hay que moverse) → rayo (daña si el cóndor sigue en esa columna) → listo. */
import { descubrir, dano } from './eventos.js';

const ALCANCE = 48;      // distancia a la que la nube empieza a cargarse
const BLOQUEO = 14;      // distancia a la que la marca se fija
const T_FIJO = 0.6;      // segundos entre fijar la marca y el rayo
const T_RAYO = 0.45;     // duración del rayo
const ANCHO_RAYO = 2.2;  // semiancho de la columna peligrosa

export function actualizarTormentas(m, dt, ev) {
  const p = m.p;
  m.flash = Math.max(0, (m.flash || 0) - dt);
  for (const o of m.tormentas) {
    const dz = o.z - p.z;
    if (o.estado === 'listo' || dz > ALCANCE || dz < -8) continue;
    o.t += dt;
    if (o.estado === 'espera') { o.estado = 'carga'; o.t = 0; o.mx = p.x; descubrir(m, 'tormenta', ev); }
    else if (o.estado === 'carga') {
      o.mx += (p.x - o.mx) * Math.min(1, 2.4 * dt);                 // la marca persigue al cóndor
      if (dz <= BLOQUEO) { o.estado = 'fijo'; o.t = 0; o.rx = o.mx; }
    } else if (o.estado === 'fijo') {
      if (o.t >= T_FIJO) { o.estado = 'rayo'; o.t = 0; o.semilla = Math.random() * 100; m.flash = 0.3; }
    } else if (o.estado === 'rayo') {
      if (Math.abs(p.x - o.rx) < ANCHO_RAYO && Math.abs(dz) < 6 && p.y < o.y + 1.5) dano(m, '¡Te alcanzó un rayo de la tormenta!', ev);
      if (o.t >= T_RAYO) o.estado = 'listo';
    }
  }
}
