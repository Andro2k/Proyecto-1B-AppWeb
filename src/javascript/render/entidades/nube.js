import { proy, elipse } from '../base.js';

/** Nube en el cielo (cúmulo de esferas translúcidas con sombra inferior y luz arriba). */
export function dibNube(c, o) {
  const dz = o.z - c.cam.z; if (dz < 4 || dz > 280) return;
  const { g } = c, q = proy(c, o.x, o.y, o.z), u = q.s, rgb = c.pais.nube;
  g.globalAlpha = Math.min(1, (280 - dz) / 90);
  for (const p of o.puffs) elipse(g, q.x + p.dx * u, q.y + (p.dy + p.r * 0.35) * u, p.r * u * 1.1, p.r * u * 0.5, 'rgba(60,70,100,.28)');
  for (const p of o.puffs) elipse(g, q.x + p.dx * u, q.y + p.dy * u, p.r * u, p.r * u * 0.62, `rgba(${rgb},.8)`);
  for (const p of o.puffs) elipse(g, q.x + p.dx * u - p.r * u * 0.2, q.y + (p.dy - p.r * 0.2) * u, p.r * u * 0.6, p.r * u * 0.3, 'rgba(255,255,255,.5)');
  g.globalAlpha = 1;
}
