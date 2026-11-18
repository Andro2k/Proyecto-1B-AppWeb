/* Entrada táctil / ratón: arrastrar para girar, tocar para aletear, botón de picada. */
import { ANCHO } from '../config.js';

/** api = { mundo() } → mundo del jugador 1. */
export function instalarTactil(lienzo, botonPica, api) {
  const posX = e => { const r = lienzo.getBoundingClientRect(); return ((e.clientX - r.left) / r.width - 0.5) * 2 * ANCHO; };
  const ent = () => api.mundo().entrada;
  lienzo.addEventListener('pointerdown', e => { ent().tx = posX(e); ent().aleteo = true; });
  lienzo.addEventListener('pointermove', e => { if (ent().tx !== null) ent().tx = posX(e); });
  for (const ev of ['pointerup', 'pointercancel', 'pointerleave']) lienzo.addEventListener(ev, () => { ent().tx = null; ent().aleteo = false; });
  botonPica.addEventListener('pointerdown', () => { ent().pica = true; });
  for (const ev of ['pointerup', 'pointerleave']) botonPica.addEventListener(ev, () => { ent().pica = false; });
}
