/* Composición de la escena de un mundo: cámara, fondo y entidades de lejos a cerca. */
import { CAM_ATRAS } from '../config.js';
import { primerIndice } from '../util.js';
import { dibFondo, dibSuelo } from './fondo.js';
import { dibTermica } from './entidades/termica.js';
import { dibCarrona } from './entidades/carrona.js';
import { dibCable } from './entidades/cable.js';
import { dibNido } from './entidades/nido.js';
import { dibDecor } from './entidades/decor.js';
import { dibCondor } from './entidades/condor.js';

/* Tabla de despacho: tipo de entidad → función de dibujo. */
const DIBUJO = { decor: dibDecor, termica: dibTermica, carrona: dibCarrona, cable: dibCable, nido: dibNido, jugador: dibCondor };

function actualizarCamara(m) {
  const { cam, p } = m;
  cam.z = p.z - CAM_ATRAS; cam.x += (p.x * 0.75 - cam.x) * 0.08; cam.y += (p.y * 0.85 + 3 - cam.y) * 0.1;
}

/** Dibuja un mundo en la vista { W, H, F, HOR }. */
export function dibujarMundo(g, m, vista) {
  actualizarCamara(m);
  const c = { g, ...vista, cam: m.cam, t: m.tiempo };
  dibFondo(c); dibSuelo(c);
  // Solo las entidades en pantalla (lista ordenada por z), de lejos a cerca; las dinámicas se intercalan por profundidad.
  const lo = primerIndice(m.ents, m.cam.z - 25), hi = primerIndice(m.ents, m.cam.z + 235);
  const dinamicas = [m.p].sort((a, b) => b.z - a.z);
  for (let i = hi - 1; i >= lo; i--) {
    const o = m.ents[i];
    while (dinamicas.length && dinamicas[0].z >= o.z) { const d = dinamicas.shift(); DIBUJO[d.tipo](c, d); }
    DIBUJO[o.tipo](c, o);
  }
  for (const d of dinamicas) DIBUJO[d.tipo](c, d);
  if (m.p.invul > 1.4) { g.fillStyle = 'rgba(217,83,79,.25)'; g.fillRect(0, 0, c.W, c.H); }
}

/** Pantalla dividida para dos jugadores. */
export function dibujarDuo(g, mundos, vista) {
  const mitad = vista.W / 2;
  mundos.forEach((m, i) => {
    g.save(); g.beginPath(); g.rect(i * mitad, 0, mitad, vista.H); g.clip(); g.translate(i * mitad, 0);
    dibujarMundo(g, m, { ...vista, W: mitad });
    g.restore();
  });
  g.fillStyle = 'rgba(243,239,227,.72)'; g.fillRect(mitad - 1, 0, 2, vista.H);
}
