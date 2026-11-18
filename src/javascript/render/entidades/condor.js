import { proy, elipse } from '../base.js';
import { clamp } from '../../util.js';

export function dibCondor(c, p) {
  const { g } = c, q = proy(c, p.x, p.y, p.z), sh = proy(c, p.x, 0, p.z), u = q.s, tiempo = c.t;
  elipse(g, sh.x, sh.y, 1.3 * sh.s, 0.3 * sh.s, 'rgba(0,0,0,' + clamp(0.35 - p.y * 0.01, 0.1, 0.35) + ')');
  if (p.invul > 0 && Math.floor(tiempo * 12) % 2 === 0) return;
  const A = p.aleteo > 0 ? Math.sin(tiempo * 22) * 0.55 : (p.enTermica ? 0.12 : 0.04 + Math.sin(tiempo * 2) * 0.03), ala = 1.4 * u;
  g.save(); g.translate(q.x, q.y); g.rotate(clamp(p.vx * 0.035, -0.35, 0.35));
  for (const d of [-1, 1]) {
    g.fillStyle = '#17171c'; g.beginPath();
    g.moveTo(d * 0.18 * u, -0.12 * u); g.lineTo(d * ala, -A * ala - 0.08 * u);
    g.lineTo(d * ala * 0.85, -A * ala * 0.85 + 0.28 * u); g.lineTo(d * 0.2 * u, 0.35 * u); g.fill();
    g.strokeStyle = '#e8e4dc'; g.lineWidth = 0.08 * u; g.beginPath();
    g.moveTo(d * ala * 0.45, -A * ala * 0.45 + 0.2 * u); g.lineTo(d * ala * 0.8, -A * ala * 0.8 + 0.12 * u); g.stroke();
  }
  g.fillStyle = '#111'; g.beginPath(); g.moveTo(-0.14 * u, 0.4 * u); g.lineTo(0.14 * u, 0.4 * u); g.lineTo(0.2 * u, 0.8 * u); g.lineTo(-0.2 * u, 0.8 * u); g.fill();
  elipse(g, 0, 0.1 * u, 0.22 * u, 0.38 * u, '#1b1b20'); elipse(g, 0, -0.28 * u, 0.2 * u, 0.08 * u, '#f1ede2'); elipse(g, 0, -0.42 * u, 0.1 * u, 0.1 * u, '#b24a3a');
  g.restore();
}
