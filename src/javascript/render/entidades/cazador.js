/* Cazador (figura sencilla, sin violencia explícita) y bala trazadora. */
import { proy, elipse } from '../base.js';

export function dibCazador(c, o) {
  const dz = o.z - c.cam.z; if (dz < 3 || dz > 200) return;
  const { g } = c, q = proy(c, o.x, 0, o.z), u = q.s * 1.35, x = q.x, y = q.y, p = c.m.p;
  g.globalAlpha = dz > 120 ? Math.max(0.3, 1 - (dz - 120) / 80) : 1;
  elipse(g, x, y, 0.7 * u, 0.15 * u, 'rgba(0,0,0,.28)');
  g.fillStyle = '#2c3a4a'; g.fillRect(x - 0.3 * u, y - 0.9 * u, 0.25 * u, 0.9 * u); g.fillRect(x + 0.05 * u, y - 0.9 * u, 0.25 * u, 0.9 * u);   // piernas
  g.fillStyle = '#3f5a3a'; g.fillRect(x - 0.38 * u, y - 1.55 * u, 0.76 * u, 0.7 * u);                                                         // chaqueta
  elipse(g, x, y - 1.75 * u, 0.2 * u, 0.22 * u, '#d9a47a');                                                                                    // cabeza
  elipse(g, x, y - 1.93 * u, 0.42 * u, 0.1 * u, '#4a3a24'); elipse(g, x, y - 2.02 * u, 0.24 * u, 0.16 * u, '#5a452b');                         // sombrero
  // Rifle: sube y apunta hacia el cóndor mientras apunta; en espera queda al hombro
  const apunta = o.estado === 'apunta', mira = proy(c, p.x, p.y, p.z), hx = x, hy = y - 1.25 * u;
  const ang = apunta ? Math.atan2(mira.y - hy, mira.x - hx) : -1.0 + (o.x > 0 ? 0.9 : 0);
  const fx = hx + Math.cos(ang) * 1.15 * u, fy = hy + Math.sin(ang) * 1.15 * u;
  g.lineCap = 'round'; g.strokeStyle = '#2a1d14'; g.lineWidth = Math.max(1.5, 0.14 * u); g.beginPath(); g.moveTo(hx - Math.cos(ang) * 0.3 * u, hy - Math.sin(ang) * 0.3 * u); g.lineTo(hx + Math.cos(ang) * 0.5 * u, hy + Math.sin(ang) * 0.5 * u); g.stroke();
  g.strokeStyle = '#111'; g.lineWidth = Math.max(1, 0.08 * u); g.beginPath(); g.moveTo(hx + Math.cos(ang) * 0.5 * u, hy + Math.sin(ang) * 0.5 * u); g.lineTo(fx, fy); g.stroke();
  if (apunta) {                                                                                   // línea de mira: amarilla mientras sigue, roja cuando se bloquea
    const bloqueada = o.t >= 0.5, objetivo = bloqueada ? proy(c, o.mx, o.my, p.z) : mira;
    g.strokeStyle = bloqueada ? (Math.floor(c.t * 16) % 2 ? '#ff2a1a' : '#ff8a7a') : 'rgba(255,225,120,.8)';
    g.lineWidth = bloqueada ? 3 : 2; g.setLineDash(bloqueada ? [] : [8, 6]); g.beginPath(); g.moveTo(fx, fy); g.lineTo(objetivo.x, objetivo.y); g.stroke(); g.setLineDash([]);
    g.fillStyle = bloqueada ? '#ff2a1a' : '#ffd24a'; g.beginPath(); g.moveTo(x, y - 2.9 * u); g.lineTo(x - 0.28 * u, y - 2.4 * u); g.lineTo(x + 0.28 * u, y - 2.4 * u); g.fill();   // señal de peligro
    g.fillStyle = '#111'; g.fillRect(x - 0.03 * u, y - 2.78 * u, 0.06 * u, 0.2 * u); g.fillRect(x - 0.03 * u, y - 2.52 * u, 0.06 * u, 0.06 * u);
  } else if (o.estado === 'recarga' && o.t < 0.15) {                                               // fogonazo
    elipse(g, fx, fy, 0.35 * u, 0.35 * u, 'rgba(255,230,140,.9)'); elipse(g, fx, fy, 0.15 * u, 0.15 * u, '#fff');
  }
  g.globalAlpha = 1;
}

export function dibBala(c, b) {
  if (b.z - c.cam.z < 1.2) return;
  const { g } = c, a = proy(c, b.x, b.y, b.z), z = proy(c, b.x - b.vx * 0.06, b.y - b.vy * 0.06, b.z - b.vz * 0.06);
  g.lineCap = 'round';
  for (const [ancho, color] of [[0.5, 'rgba(255,200,90,.35)'], [0.18, '#fff3b0']]) { g.strokeStyle = color; g.lineWidth = Math.max(2, ancho * a.s); g.beginPath(); g.moveTo(z.x, z.y); g.lineTo(a.x, a.y); g.stroke(); }
}
