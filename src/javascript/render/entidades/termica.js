import { proy, elipse } from '../base.js';
import { TECHO } from '../../config.js';

export function dibTermica(c, t) {
  const { g } = c, zc = t.z + t.len / 2; if (zc - c.cam.z < 2) return;
  const a = proy(c, t.x - t.r, 0, zc), b = proy(c, t.x + t.r, 0, zc), cc = proy(c, t.x - t.r * 0.8, TECHO, zc), d = proy(c, t.x + t.r * 0.8, TECHO, zc);
  const gr = g.createLinearGradient(0, a.y, 0, cc.y); gr.addColorStop(0, 'rgba(255,214,130,.38)'); gr.addColorStop(1, 'rgba(255,214,130,0)');
  g.fillStyle = gr; g.beginPath(); g.moveTo(a.x, a.y); g.lineTo(b.x, b.y); g.lineTo(d.x, d.y); g.lineTo(cc.x, cc.y); g.fill();
  const m = proy(c, t.x, 0, zc);
  g.strokeStyle = 'rgba(255,226,150,.85)'; g.lineWidth = 2; g.beginPath(); g.ellipse(m.x, m.y, t.r * m.s, t.r * m.s * 0.28, 0, 0, 6.2832); g.stroke();
  for (let i = 0; i < 6; i++) {
    const yy = (c.t * 4 + i * 5) % TECHO, q = proy(c, t.x + Math.sin(i * 2.1 + yy) * t.r * 0.6, yy, zc);
    elipse(g, q.x, q.y, Math.max(1, 0.12 * q.s), Math.max(1, 0.12 * q.s), 'rgba(255,238,175,.85)');
  }
}
