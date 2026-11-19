/* Elementos del paisaje a los lados del carril. Una función por clase (tabla de despacho). */
import { proy, elipse } from '../base.js';

/** Elipse tendida sobre el suelo (laguna, mancha de terreno), con perspectiva correcta. */
function elipseSuelo(c, x, z, rx, rz) {
  if (z - rz - c.cam.z < 2) return null;
  const i = proy(c, x - rx, 0, z), d = proy(c, x + rx, 0, z), cerca = proy(c, x, 0, z - rz), lejos = proy(c, x, 0, z + rz);
  return { x: (i.x + d.x) / 2, y: (cerca.y + lejos.y) / 2, rx: (d.x - i.x) / 2, ry: (cerca.y - lejos.y) / 2 };
}

const CLASES = {
  frailejon(c, o, q) {
    const { g } = c, u = q.s * o.s, h = 1.9 * u;
    elipse(g, q.x, q.y, 0.7 * u, 0.15 * u, 'rgba(0,0,0,.2)');
    g.strokeStyle = '#6b5a3a'; g.lineWidth = Math.max(1, 0.3 * u); g.beginPath(); g.moveTo(q.x, q.y); g.lineTo(q.x, q.y - h); g.stroke();
    elipse(g, q.x, q.y - h * 0.55, 0.36 * u, h * 0.4, '#8a7a4c');                               // hojas secas del tallo
    elipse(g, q.x, q.y - h, 0.85 * u, 0.5 * u, '#7f9a72'); elipse(g, q.x, q.y - h - 0.1 * u, 0.6 * u, 0.35 * u, '#b9cc9a');
    elipse(g, q.x, q.y - h - 0.15 * u, 0.25 * u, 0.15 * u, '#e9f0c8');
  },
  pajonal(c, o, q) {
    const { g } = c, u = q.s * o.s; g.lineWidth = Math.max(1, 0.1 * u); g.lineCap = 'round';
    for (let i = -2; i <= 2; i++) {
      g.strokeStyle = ['#8a8f4a', '#b0a55a', '#6f7a3c'][(i + 2) % 3];
      g.beginPath(); g.moveTo(q.x + i * 0.12 * u, q.y); g.quadraticCurveTo(q.x + i * 0.22 * u, q.y - 0.45 * u, q.x + i * 0.38 * u, q.y - (0.7 + (i & 1 ? 0.22 : 0)) * u); g.stroke();
    }
  },
  roca(c, o, q) {
    const { g } = c, u = q.s * o.s * 0.9;
    elipse(g, q.x, q.y, 1.1 * u, 0.2 * u, 'rgba(0,0,0,.25)');
    const P = [[-1, 0], [-0.8, -0.7], [-0.2, -1], [0.6, -0.8], [1, 0]];
    g.fillStyle = '#6f6c68'; g.beginPath(); P.forEach(([a, b], i) => g[i ? 'lineTo' : 'moveTo'](q.x + a * u, q.y + b * u)); g.fill();
    g.fillStyle = '#928e86'; g.beginPath(); g.moveTo(q.x - u, q.y); g.lineTo(q.x - 0.8 * u, q.y - 0.7 * u); g.lineTo(q.x - 0.2 * u, q.y - u); g.lineTo(q.x - 0.1 * u, q.y - 0.3 * u); g.fill();
  },
  quenua(c, o, q) {                                              // queñua (Polylepis): tronco retorcido y copa baja
    const { g } = c, u = q.s * o.s;
    elipse(g, q.x, q.y, 1.1 * u, 0.2 * u, 'rgba(0,0,0,.22)');
    g.strokeStyle = '#7a4a33'; g.lineCap = 'round'; g.lineWidth = Math.max(1.5, 0.3 * u);
    g.beginPath(); g.moveTo(q.x, q.y); g.quadraticCurveTo(q.x - 0.3 * u, q.y - 1.2 * u, q.x + 0.1 * u, q.y - 2 * u); g.stroke();
    g.lineWidth = Math.max(1, 0.16 * u); g.beginPath(); g.moveTo(q.x - 0.1 * u, q.y - 1.2 * u); g.lineTo(q.x - 0.7 * u, q.y - 1.9 * u); g.stroke();
    elipse(g, q.x - 0.5 * u, q.y - 2.1 * u, 0.7 * u, 0.5 * u, '#3b5a30'); elipse(g, q.x + 0.4 * u, q.y - 2.4 * u, 0.85 * u, 0.55 * u, '#4d6b3a');
    elipse(g, q.x - 0.1 * u, q.y - 2.7 * u, 0.7 * u, 0.4 * u, '#6f8e4a');
  },
  arbol(c, o, q) {                                               // árbol del bosque nublado
    const { g } = c, u = q.s * o.s;
    elipse(g, q.x, q.y, 1.3 * u, 0.25 * u, 'rgba(0,0,0,.25)');
    g.strokeStyle = '#4a3a2a'; g.lineWidth = Math.max(1.5, 0.35 * u); g.beginPath(); g.moveTo(q.x, q.y); g.lineTo(q.x, q.y - 3.2 * u); g.stroke();
    elipse(g, q.x, q.y - 3.3 * u, 1.6 * u, 1.0 * u, '#2a5233'); elipse(g, q.x - 0.6 * u, q.y - 3.8 * u, 1.1 * u, 0.8 * u, '#357042');
    elipse(g, q.x + 0.6 * u, q.y - 3.7 * u, 1.0 * u, 0.7 * u, '#418a50'); elipse(g, q.x, q.y - 4.2 * u, 0.7 * u, 0.35 * u, 'rgba(210,235,215,.35)');
  },
  laguna(c, o) {
    const { g } = c, e = elipseSuelo(c, o.x, o.z, o.r, o.r * 0.9); if (!e) return;
    g.fillStyle = '#4f6e48'; g.beginPath(); g.ellipse(e.x, e.y, e.rx * 1.08, e.ry * 1.12, 0, 0, 6.2832); g.fill();    // orilla con juncos
    const gr = g.createLinearGradient(0, e.y - e.ry, 0, e.y + e.ry); gr.addColorStop(0, '#9cc9dc'); gr.addColorStop(1, '#2f6584');
    g.fillStyle = gr; g.beginPath(); g.ellipse(e.x, e.y, e.rx, e.ry, 0, 0, 6.2832); g.fill();
    elipse(g, e.x - e.rx * 0.3, e.y - e.ry * 0.3, e.rx * 0.35, e.ry * 0.12, 'rgba(255,255,255,.35)');
  },
  choza(c, o, q) {
    const { g } = c, u = q.s * o.s * 1.2;
    elipse(g, q.x, q.y, 1.7 * u, 0.3 * u, 'rgba(0,0,0,.25)');
    g.fillStyle = '#b99a6b'; g.fillRect(q.x - 1.1 * u, q.y - 1.3 * u, 2.2 * u, 1.3 * u);
    g.fillStyle = 'rgba(0,0,0,.14)'; g.fillRect(q.x + 0.4 * u, q.y - 1.3 * u, 0.7 * u, 1.3 * u);
    g.fillStyle = '#c9a64a'; g.beginPath(); g.moveTo(q.x - 1.6 * u, q.y - 1.2 * u); g.lineTo(q.x, q.y - 2.6 * u); g.lineTo(q.x + 1.6 * u, q.y - 1.2 * u); g.fill();
    g.fillStyle = '#9c7f33'; g.beginPath(); g.moveTo(q.x - 1.6 * u, q.y - 1.2 * u); g.lineTo(q.x + 1.6 * u, q.y - 1.2 * u); g.lineTo(q.x + 1.4 * u, q.y - 1.0 * u); g.lineTo(q.x - 1.4 * u, q.y - 1.0 * u); g.fill();
    g.fillStyle = '#3b2a1c'; g.fillRect(q.x - 0.25 * u, q.y - 0.9 * u, 0.5 * u, 0.9 * u);
  },
  llama(c, o, q) {                                               // llama, alpaca o vicuña según la variante
    const { g } = c, u = q.s * o.s * 0.9, d = o.dir, col = o.v < 0.33 ? '#e8dcc0' : o.v < 0.66 ? '#8a6a4a' : '#c9a06a';
    const baja = Math.sin(c.t * 0.6 + o.v * 9) > 0.3;                               // a ratos pasta con la cabeza baja
    elipse(g, q.x, q.y, 1.1 * u, 0.2 * u, 'rgba(0,0,0,.22)');
    g.strokeStyle = '#4a3a2c'; g.lineWidth = Math.max(1, 0.1 * u); g.lineCap = 'round';
    for (const dx of [-0.5, -0.3, 0.35, 0.55]) { g.beginPath(); g.moveTo(q.x + dx * u, q.y - 0.85 * u); g.lineTo(q.x + dx * u, q.y); g.stroke(); }
    elipse(g, q.x, q.y - 1.05 * u, 0.8 * u, 0.4 * u, col); elipse(g, q.x - d * 0.1 * u, q.y - 0.95 * u, 0.45 * u, 0.22 * u, 'rgba(255,255,255,.28)');
    const hx = q.x + d * 0.75 * u, hy = baja ? q.y - 0.7 * u : q.y - 2.2 * u;
    g.strokeStyle = col; g.lineWidth = Math.max(1.5, 0.24 * u); g.beginPath(); g.moveTo(q.x + d * 0.55 * u, q.y - 1.2 * u); g.lineTo(hx, hy); g.stroke();
    elipse(g, hx + d * 0.12 * u, hy, 0.2 * u, 0.14 * u, col);
    g.strokeStyle = '#4a3a2c'; g.lineWidth = Math.max(1, 0.06 * u); g.beginPath(); g.moveTo(hx, hy - 0.1 * u); g.lineTo(hx - d * 0.05 * u, hy - 0.32 * u); g.stroke();   // oreja
  },
  cultivo(c, o) {
    const { g } = c, w = o.s * 5, d = 7, cerca = o.z - d - c.cam.z; if (cerca < 2) return;
    const A = proy(c, o.x - w, 0, o.z - d), B = proy(c, o.x + w, 0, o.z - d), C = proy(c, o.x + w, 0, o.z + d), D = proy(c, o.x - w, 0, o.z + d);
    g.fillStyle = ['#7a9a3a', '#b0a24a', '#6e5236'][Math.floor(o.v * 3)]; g.beginPath(); g.moveTo(A.x, A.y); g.lineTo(B.x, B.y); g.lineTo(C.x, C.y); g.lineTo(D.x, D.y); g.fill();
    g.strokeStyle = 'rgba(0,0,0,.18)'; g.lineWidth = Math.max(1, 0.12 * A.s);
    for (let i = 1; i < 6; i++) { const t = i / 6, n = proy(c, o.x - w + 2 * w * t, 0, o.z - d), f = proy(c, o.x - w + 2 * w * t, 0, o.z + d); g.beginPath(); g.moveTo(n.x, n.y); g.lineTo(f.x, f.y); g.stroke(); }
  },
  ave(c, o) {
    const { g } = c, q = proy(c, o.x + Math.sin(c.t * 0.3 + o.v * 5) * 6, o.y + Math.sin(c.t * 0.8 + o.v * 7) * 1.2, o.z), w = Math.max(3, 0.8 * q.s), a = Math.sin(c.t * 5 + o.v * 9) * w * 0.3;
    g.strokeStyle = '#1b1b20'; g.lineWidth = Math.max(1.2, 0.12 * q.s); g.lineCap = 'round';
    g.beginPath(); g.moveTo(q.x - w, q.y - a); g.quadraticCurveTo(q.x - w * 0.4, q.y - w * 0.35, q.x, q.y); g.quadraticCurveTo(q.x + w * 0.4, q.y - w * 0.35, q.x + w, q.y - a); g.stroke();
  },
  mancha(c, o) {
    const e = elipseSuelo(c, o.x, o.z, 3 + o.s * 5, 4 + o.s * 6); if (!e) return;
    c.g.fillStyle = o.v < 0.5 ? 'rgba(0,0,0,.09)' : 'rgba(255,255,210,.07)'; c.g.beginPath(); c.g.ellipse(e.x, e.y, e.rx, e.ry, 0, 0, 6.2832); c.g.fill();
  }
};

export function dibDecor(c, o) {
  const dz = o.z - c.cam.z; if (dz < 2 || dz > 235) return;
  c.g.globalAlpha = dz > 140 ? Math.max(0.3, 1 - (dz - 140) / 110) : 1;       // se funde con la bruma a lo lejos
  CLASES[o.clase](c, o, proy(c, o.x, 0, o.z));
  c.g.globalAlpha = 1;
}
