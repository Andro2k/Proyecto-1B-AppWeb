import { proy, elipse } from '../base.js';

export function dibCable(c, o) {
  if (o.z - c.cam.z < 1.5) return;
  const { g } = c, a = proy(c, -17, o.y, o.z), b = proy(c, 17, o.y, o.z), m = proy(c, 0, o.y - 1.5, o.z);
  g.strokeStyle = '#2a2f33'; g.lineWidth = Math.max(2, 0.5 * a.s);
  for (const x of [-17, 17]) { const s0 = proy(c, x, 0, o.z), s1 = proy(c, x, o.y + 2.5, o.z); g.beginPath(); g.moveTo(s0.x, s0.y); g.lineTo(s1.x, s1.y); g.stroke(); }
  g.strokeStyle = '#0d0d0d'; g.lineWidth = Math.max(1.5, 0.07 * a.s);
  g.beginPath(); g.moveTo(a.x, a.y); g.quadraticCurveTo(m.x, m.y, b.x, b.y); g.stroke();
  for (const x of [-6, 0, 6]) { const q = proy(c, x, o.y - 0.75, o.z); elipse(g, q.x, q.y, Math.max(2, 0.3 * q.s), Math.max(2, 0.3 * q.s), '#ff7a1a'); }
}
