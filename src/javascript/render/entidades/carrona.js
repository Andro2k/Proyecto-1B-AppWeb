/* Carroña: res o llama caída con piel, carne expuesta, costillas, moscas y gallinazos.
   La envenenada se ve igual de apetitosa, pero sin aves ni moscas: la pista que el jugador debe aprender. */
import { proy, elipse } from '../base.js';
import { dibGallinazo } from './gallinazo.js';

const PIELES = [['#6a4a35', '#4a3223'], ['#3a2e28', '#241c18'], ['#8b6a4a', '#5e442d'], ['#c9bfa6', '#968c76']];

export function dibCarrona(c, o) {
  if (o.hecho || o.z - c.cam.z < 1.5) return;
  const { g } = c, q = proy(c, o.x, 0, o.z), u = q.s, x = q.x, y = q.y, [piel, sombra] = PIELES[Math.floor((o.v || 0) * PIELES.length) % PIELES.length];
  const carne = o.veneno ? ['#6e3b32', '#8c5a48', '#a77c62'] : ['#6f1a1a', '#a02b2a', '#cf564d'];
  elipse(g, x, y, 1.65 * u, 0.4 * u, 'rgba(0,0,0,.3)');
  g.strokeStyle = '#d9d0b8'; g.lineCap = 'round';                                              // patas rígidas hacia arriba
  for (const [dx, dy, ex, ey] of [[0.55, 0.45, 0.85, 1.2], [0.85, 0.42, 1.25, 1.05], [-0.7, 0.45, -1.05, 1.15]]) {
    g.lineWidth = Math.max(1, 0.09 * u); g.beginPath(); g.moveTo(x + dx * u, y - dy * u); g.lineTo(x + ex * u, y - ey * u); g.stroke();
    elipse(g, x + ex * u, y - ey * u, 0.07 * u, 0.06 * u, '#2a2118');
  }
  const poli = (pts, color, dx = 0, dy = 0, k = 1) => {                                      // polígono en unidades u
    g.fillStyle = color; g.beginPath();
    pts.forEach(([a, b], n) => g[n ? 'lineTo' : 'moveTo'](x + (dx + a * k) * u, y + (dy + b * k) * u)); g.closePath(); g.fill();
  };
  poli([[-1.35, -0.18], [-1.15, -0.8], [-0.5, -1.02], [0.3, -1.0], [1.1, -0.85], [1.4, -0.35], [1.2, -0.1], [-0.2, -0.05]], sombra);   // costado en sombra
  poli([[-1.3, -0.3], [-1.1, -0.85], [-0.45, -1.06], [0.35, -1.04], [1.05, -0.9], [1.32, -0.4], [0.9, -0.22], [-0.3, -0.2]], piel);    // lomo con piel
  poli([[0.78, -0.5], [1.05, -0.72], [1.25, -0.42], [1.0, -0.3]], '#dcc2a6');                                                          // cuero doblado
  elipse(g, x - 1.42 * u, y - 0.42 * u, 0.38 * u, 0.25 * u, piel); elipse(g, x - 1.65 * u, y - 0.64 * u, 0.1 * u, 0.15 * u, sombra);   // cabeza y oreja
  elipse(g, x - 1.62 * u, y - 0.44 * u, 0.05 * u, 0.05 * u, '#1a1210');
  const hueco = [[-0.8, -0.68], [-0.62, -0.93], [-0.15, -1.0], [0.42, -0.96], [0.82, -0.78], [0.7, -0.55], [0.2, -0.47], [-0.4, -0.5]];
  poli(hueco, carne[0], 0, 0); poli(hueco, carne[1], 0, -0.02, 0.82); poli(hueco, carne[2], -0.12, -0.06, 0.5);   // carne expuesta en capas
  g.strokeStyle = o.veneno ? 'rgba(200,170,150,.35)' : 'rgba(255,170,160,.45)'; g.lineWidth = Math.max(1, 0.03 * u);
  for (const [a, b] of [[-0.4, -0.86], [0, -0.9], [0.4, -0.84], [0.1, -0.72]]) { g.beginPath(); g.moveTo(x + a * u, y + b * u); g.quadraticCurveTo(x + (a + 0.15) * u, y + (b - 0.05) * u, x + (a + 0.3) * u, y + (b + 0.04) * u); g.stroke(); }   // fibras
  for (const [dx, dy] of [[0.5, -0.9], [0.7, -0.74], [-0.6, -0.9]]) elipse(g, x + dx * u, y + dy * u, 0.1 * u, 0.035 * u, '#eadcb6');   // grasa
  for (let i = 0; i < 5; i++) {                                                                // costillas con huecos oscuros entre ellas
    const rx = -0.55 + i * 0.3;
    g.strokeStyle = 'rgba(70,15,15,.8)'; g.lineWidth = Math.max(1, 0.1 * u);
    g.beginPath(); g.moveTo(x + (rx + 0.04) * u, y - 0.5 * u); g.quadraticCurveTo(x + (rx + 0.18) * u, y - 1.28 * u, x + (rx + 0.36) * u, y - 0.58 * u); g.stroke();
    g.strokeStyle = '#f1e8cf'; g.lineWidth = Math.max(1, 0.075 * u);
    g.beginPath(); g.moveTo(x + rx * u, y - 0.52 * u); g.quadraticCurveTo(x + (rx + 0.14) * u, y - 1.26 * u, x + (rx + 0.32) * u, y - 0.6 * u); g.stroke();
  }
  if (!o.veneno) elipse(g, x - 0.45 * u, y - 0.8 * u, 0.2 * u, 0.04 * u, 'rgba(255,215,205,.6)');   // brillo húmedo
  if (o.veneno) return;
  for (let i = 0; i < 6; i++) {                                                                // moscas
    const a = c.t * 6 + i * 1.1, r = Math.max(0.8, 0.028 * u);
    elipse(g, x + Math.cos(a) * 0.95 * u, y - 1.0 * u + Math.sin(a * 1.3) * 0.3 * u, r, r, '#111');
  }
  for (let i = 0; i < 3; i++) {                                                                // gallinazos sobre la comida
    const a = c.t * 1.5 + i * 2.1, bz = o.z + Math.sin(a) * 2.2;
    if (bz - c.cam.z < 2) continue;
    const b = proy(c, o.x + Math.cos(a) * 2.2, 6 + i * 1.2, bz);
    dibGallinazo(g, b.x, b.y, Math.max(4, 0.5 * b.s), c.t + i);
  }
}
