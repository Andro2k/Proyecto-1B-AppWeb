import { proy, elipse } from '../base.js';
import { NIDO_ALTO } from '../../config.js';

export function dibNido(c, o) {
  if (o.z - c.cam.z < 1.5) return;
  const { g } = c, a = proy(c, -30, 0, o.z), b = proy(c, 30, 0, o.z), cc = proy(c, 30, 40, o.z), d = proy(c, -30, 40, o.z);
  g.fillStyle = '#5b5048'; g.beginPath(); g.moveTo(a.x, a.y); g.lineTo(b.x, b.y); g.lineTo(cc.x, cc.y); g.lineTo(d.x, d.y); g.fill();
  const r1 = proy(c, -6, NIDO_ALTO - 1, o.z), r2 = proy(c, 6, NIDO_ALTO - 1, o.z);
  g.fillStyle = '#8a7358'; g.fillRect(r1.x, r1.y, r2.x - r1.x, Math.max(4, 0.7 * r1.s));
  const n = proy(c, 0, NIDO_ALTO + 0.4, o.z);
  elipse(g, n.x, n.y, 2.2 * n.s, 0.7 * n.s, '#a58b5a'); elipse(g, n.x, n.y - 0.2 * n.s, 0.25 * n.s, 0.35 * n.s, '#f5f1e6');
}
