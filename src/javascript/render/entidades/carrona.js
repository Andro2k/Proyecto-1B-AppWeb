import { proy, elipse } from '../base.js';

export function dibCarrona(c, o) {
  if (o.hecho || o.z - c.cam.z < 1.5) return;
  const { g } = c, q = proy(c, o.x, 0, o.z);
  elipse(g, q.x, q.y, 1.1 * q.s, 0.3 * q.s, 'rgba(0,0,0,.25)');
  elipse(g, q.x, q.y - 0.25 * q.s, 0.9 * q.s, 0.35 * q.s, o.veneno ? '#6c5a35' : '#7a4a32');
  g.strokeStyle = 'rgba(240,230,210,.7)'; g.lineWidth = Math.max(1, 0.05 * q.s);
  for (let i = -2; i <= 2; i++) { g.beginPath(); g.moveTo(q.x + i * 0.22 * q.s, q.y - 0.5 * q.s); g.lineTo(q.x + i * 0.22 * q.s, q.y - 0.08 * q.s); g.stroke(); }
  if (o.veneno) return;                       // sin gallinazos = sospechoso
  for (let i = 0; i < 3; i++) {               // gallinazos sobre la comida
    const a = c.t * 1.5 + i * 2.1, bz = o.z + Math.sin(a) * 2.2;
    if (bz - c.cam.z < 2) continue;
    const b = proy(c, o.x + Math.cos(a) * 2.2, 6 + i * 1.2, bz), w = Math.max(4, 0.45 * b.s);
    g.strokeStyle = '#111'; g.lineWidth = Math.max(1.5, 0.07 * b.s);
    g.beginPath(); g.moveTo(b.x - w, b.y - w * 0.3); g.lineTo(b.x, b.y); g.lineTo(b.x + w, b.y - w * 0.3); g.stroke();
  }
}
