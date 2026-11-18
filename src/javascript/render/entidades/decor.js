import { proy, elipse } from '../base.js';

export function dibDecor(c, o) {
  const dz = o.z - c.cam.z; if (dz < 2 || dz > 230) return;
  const { g } = c, q = proy(c, o.x, 0, o.z);
  g.strokeStyle = '#8a7a4a'; g.lineWidth = Math.max(1, 0.12 * q.s); g.beginPath(); g.moveTo(q.x, q.y); g.lineTo(q.x, q.y - 1.5 * q.s); g.stroke();
  elipse(g, q.x, q.y - 1.7 * q.s, 0.4 * q.s, 0.3 * q.s, '#cfc983');
}
