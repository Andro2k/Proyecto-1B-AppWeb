/* Cóndor andino visto desde atrás: alas con "dedos" de plumas primarias, parche blanco, collar y cabeza.
   Macho: más grande, con cresta y parche blanco amplio. Hembra: algo más pequeña, sin cresta y de plumaje más pardo. */
import { proy, elipse } from '../base.js';
import { clamp } from '../../util.js';

const PAL = {
  macho: { cuerpo: '#1b1b20', ala: '#14141a', parche: '#f0eee7', parcheDe: 0.3, parcheA: 0.8, cabeza: '#b24a3a', escala: 1 },
  hembra: { cuerpo: '#2b2427', ala: '#231d20', parche: '#d6cec2', parcheDe: 0.42, parcheA: 0.7, cabeza: '#a23c32', escala: 0.88 }
};

function ala(g, d, u, L, A, pal) {
  const y = k => -A * L * k;                                         // altura del ala a la fracción k de su envergadura
  g.fillStyle = pal.ala; g.beginPath();
  g.moveTo(d * 0.16 * u, -0.1 * u); g.lineTo(d * 0.55 * L, y(0.55) - 0.16 * u); g.lineTo(d * 0.98 * L, y(0.98) - 0.05 * u);
  for (let i = 0; i <= 5; i++) {                                     // borde posterior con dedos separados (plumas primarias)
    const k = 0.98 - 0.085 * i, base = (0.1 + 0.05 * i) * u;
    g.lineTo(d * L * k, y(k) + base); g.lineTo(d * L * (k - 0.045), y(k - 0.045) + base - 0.1 * u);
  }
  g.lineTo(d * 0.42 * L, y(0.42) + 0.33 * u); g.lineTo(d * 0.2 * u, 0.38 * u); g.closePath(); g.fill();
  g.fillStyle = pal.parche; g.beginPath();                           // parche blanco de las secundarias
  const a = pal.parcheDe, b = pal.parcheA;
  g.moveTo(d * a * L, y(a) + 0.1 * u); g.lineTo(d * b * L, y(b) + 0.03 * u); g.lineTo(d * (b + 0.02) * L, y(b) + 0.17 * u); g.lineTo(d * (a + 0.04) * L, y(a) + 0.27 * u); g.fill();
  g.strokeStyle = 'rgba(255,255,255,.12)'; g.lineWidth = Math.max(1, 0.012 * L);
  for (let i = 1; i <= 5; i++) { const k = 0.98 - 0.085 * i; g.beginPath(); g.moveTo(d * L * (k + 0.05), y(k + 0.05) + 0.02 * u); g.lineTo(d * L * (k - 0.02), y(k) + (0.12 + 0.05 * i) * u); g.stroke(); }
}

/** Dibuja un cóndor centrado en (x, y) con tamaño u (px por unidad). plegado = posado con las alas cerradas. */
export function dibujarCondor(g, x, y, u, { sexo = 'macho', A = 0.05, inclinacion = 0, plegado = false } = {}) {
  const pal = PAL[sexo]; u *= pal.escala;
  g.save(); g.translate(x, y); g.rotate(inclinacion);
  if (plegado) {
    elipse(g, 0, 0.18 * u, 0.34 * u, 0.5 * u, pal.cuerpo);
    for (const d of [-1, 1]) { elipse(g, d * 0.2 * u, 0.2 * u, 0.13 * u, 0.44 * u, pal.ala); elipse(g, d * 0.2 * u, 0.1 * u, 0.04 * u, 0.2 * u, pal.parche); }
  } else {
    const L = 1.45 * u;
    ala(g, -1, u, L, A, pal); ala(g, 1, u, L, A, pal);
    g.fillStyle = '#101014'; g.beginPath(); g.moveTo(-0.14 * u, 0.4 * u); g.lineTo(0.14 * u, 0.4 * u); g.lineTo(0.22 * u, 0.82 * u); g.lineTo(-0.22 * u, 0.82 * u); g.fill();   // cola
    elipse(g, 0, 0.1 * u, 0.22 * u, 0.4 * u, pal.cuerpo);
  }
  const cy = plegado ? -0.36 * u : -0.28 * u;
  elipse(g, 0, cy, 0.21 * u, 0.09 * u, '#f3f0e6'); elipse(g, 0, cy + 0.03 * u, 0.17 * u, 0.05 * u, '#fff');                // collar de plumas blancas
  elipse(g, 0, cy - 0.12 * u, 0.07 * u, 0.1 * u, pal.cabeza);                                                           // cuello pelado
  const r = sexo === 'macho' ? 0.115 : 0.095;
  elipse(g, 0, cy - 0.22 * u, r * u, r * u, pal.cabeza); elipse(g, -r * 0.3 * u, cy - 0.25 * u, r * 0.35 * u, r * 0.3 * u, 'rgba(255,255,255,.18)');
  if (sexo === 'macho') { elipse(g, 0, cy - 0.34 * u, 0.045 * u, 0.085 * u, '#6e2b27'); elipse(g, -0.012 * u, cy - 0.37 * u, 0.015 * u, 0.04 * u, '#a24a42'); }   // cresta: solo el macho
  g.restore();
}

export function dibCondor(c, p) {
  const { g } = c, q = proy(c, p.x, p.y, p.z), sh = proy(c, p.x, 0, p.z), tiempo = c.t;
  elipse(g, sh.x, sh.y, 1.3 * sh.s, 0.3 * sh.s, 'rgba(0,0,0,' + clamp(0.35 - p.y * 0.01, 0.1, 0.35) + ')');
  if (p.invul > 0 && Math.floor(tiempo * 12) % 2 === 0) return;
  const A = p.aleteo > 0 ? Math.sin(tiempo * 22) * 0.55 : (p.enTermica ? 0.12 : 0.04 + Math.sin(tiempo * 2) * 0.03);
  dibujarCondor(g, q.x, q.y, q.s, { sexo: p.sexo, A, inclinacion: clamp(p.vx * 0.035, -0.35, 0.35) });
}

/** Compañera: la cóndor hembra que vuela por delante en modo un jugador. */
export function dibCompa(c, o) {
  const dz = o.z - c.cam.z; if (dz < 2.5) return;
  const q = proy(c, o.x, o.y, o.z), sh = proy(c, o.x, 0, o.z);
  elipse(c.g, sh.x, sh.y, 1.1 * sh.s, 0.25 * sh.s, 'rgba(0,0,0,.2)');
  dibujarCondor(c.g, q.x, q.y, q.s, { sexo: 'hembra', A: 0.08 + Math.sin(c.t * 1.8) * 0.03, inclinacion: clamp(o.vx * 0.04, -0.3, 0.3) });
}
