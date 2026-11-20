/* Nube de tormenta, marca de impacto en el suelo y rayo. */
import { proy, elipse } from '../base.js';

/** Rayo en zigzag con resplandor, de la nube al suelo. */
function rayo(c, o) {
  const { g } = c, pts = [];
  for (let i = 0; i <= 8; i++) { const y = o.y * (1 - i / 8), j = i === 0 || i === 8 ? 0 : Math.sin(o.semilla * 7 + i * 12.9) * 1.6; pts.push(proy(c, o.rx + j, y, o.z)); }
  g.lineJoin = 'round'; g.lineCap = 'round';
  for (const [ancho, color] of [[0.9, 'rgba(160,190,255,.3)'], [0.4, 'rgba(210,225,255,.7)'], [0.14, '#fff']]) {
    g.strokeStyle = color; g.lineWidth = Math.max(1.5, ancho * pts[8].s); g.beginPath();
    pts.forEach((q, i) => g[i ? 'lineTo' : 'moveTo'](q.x, q.y)); g.stroke();
  }
  const r = proy(c, o.rx + 2.6, o.y * 0.5, o.z), m = pts[4];                       // rama lateral
  g.lineWidth = Math.max(1, 0.1 * m.s); g.beginPath(); g.moveTo(m.x, m.y); g.lineTo(r.x, r.y); g.stroke();
  elipse(g, pts[8].x, pts[8].y, 1.6 * pts[8].s, 0.4 * pts[8].s, 'rgba(255,255,255,.55)');
}

/** Marca de impacto: sigue al cóndor mientras carga y se pone roja y fija un instante antes del rayo. */
function marca(c, o) {
  const { g } = c, x = o.estado === 'carga' ? o.mx : o.rx, i = proy(c, x - 2.2, 0, o.z), d = proy(c, x + 2.2, 0, o.z);
  const cerca = proy(c, x, 0, o.z - 2), lejos = proy(c, x, 0, o.z + 2), cx = (i.x + d.x) / 2, cy = (cerca.y + lejos.y) / 2, rx = (d.x - i.x) / 2, ry = Math.max(2, (cerca.y - lejos.y) / 2);
  if (o.estado === 'carga') { g.strokeStyle = 'rgba(255,230,160,.6)'; g.lineWidth = 2; g.setLineDash([6, 6]); g.beginPath(); g.ellipse(cx, cy, rx, ry, 0, 0, 6.2832); g.stroke(); g.setLineDash([]); return; }
  const parpadeo = Math.floor(c.t * 14) % 2 ? 0.55 : 0.3;
  g.fillStyle = `rgba(255,50,35,${parpadeo})`; g.beginPath(); g.ellipse(cx, cy, rx, ry, 0, 0, 6.2832); g.fill();
  g.strokeStyle = '#ff3b2a'; g.lineWidth = 4; g.beginPath(); g.ellipse(cx, cy, rx, ry, 0, 0, 6.2832); g.stroke();
  g.lineWidth = 3; g.beginPath(); g.moveTo(cx - rx * 0.6, cy); g.lineTo(cx + rx * 0.6, cy); g.moveTo(cx, cy - ry * 0.6); g.lineTo(cx, cy + ry * 0.6); g.stroke();   // mira
}

export function dibTormenta(c, o) {
  const dz = o.z - c.cam.z; if (dz < 3 || dz > 280) return;
  const { g } = c, q = proy(c, o.x, o.y, o.z), u = q.s, activa = o.estado === 'carga' || o.estado === 'fijo' || o.estado === 'rayo';
  if (activa) marca(c, o);
  g.globalAlpha = Math.min(1, (280 - dz) / 90);
  if (o.estado !== 'listo') {                                                      // cortina de lluvia bajo la nube
    g.strokeStyle = 'rgba(190,205,230,.25)'; g.lineWidth = Math.max(1, 0.07 * u);
    for (let k = 0; k < 12; k++) { const a = o.x + (k - 5.5) * o.r * 0.13, f = (c.t * 2 + k * 0.37) % 1, base = proy(c, a - 1.5, 0, o.z), top = proy(c, a, o.y - 2, o.z);
      g.beginPath(); g.moveTo(top.x, top.y + (base.y - top.y) * f * 0.2); g.lineTo(base.x, base.y); g.stroke(); }
  }
  for (const p of o.puffs) elipse(g, q.x + p.dx * u, q.y + (p.dy + p.r * 0.4) * u, p.r * u * 1.1, p.r * u * 0.55, '#1b1f30');
  for (const p of o.puffs) elipse(g, q.x + p.dx * u, q.y + p.dy * u, p.r * u, p.r * u * 0.62, 'rgba(56,61,86,.96)');
  for (const p of o.puffs) elipse(g, q.x + p.dx * u - p.r * u * 0.2, q.y + (p.dy - p.r * 0.22) * u, p.r * u * 0.6, p.r * u * 0.3, 'rgba(112,122,152,.6)');
  if ((o.estado === 'carga' || o.estado === 'fijo') && Math.sin(c.t * 38 + o.x) > 0.2) {   // destellos internos al cargarse
    elipse(g, q.x, q.y, o.r * u * 0.5, o.r * u * 0.3, 'rgba(190,210,255,.5)');
  }
  g.globalAlpha = 1;
  if (o.estado === 'rayo' && dz > 1.5) rayo(c, o);
}
