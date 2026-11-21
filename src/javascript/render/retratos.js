/* Retratos de la novela visual: se dibujan con formas vectoriales a la altura pedida (x, y = base centrada; h = alto).
   Expresiones: normal | feliz | triste | preocupada | serio | sonrie. Cada personaje usa solo las que necesita. */
const E = (g, x, y, rx, ry, c) => { g.fillStyle = c; g.beginPath(); g.ellipse(x, y, Math.max(0.5, rx), Math.max(0.5, ry), 0, 0, 6.2832); g.fill(); };
const P = (g, pts, c) => { g.fillStyle = c; g.beginPath(); pts.forEach(([a, b], i) => g[i ? 'lineTo' : 'moveTo'](a, b)); g.closePath(); g.fill(); };
const T = (g, x0, y0, x1, y1, c, w) => { g.strokeStyle = c; g.lineWidth = w; g.lineCap = 'round'; g.beginPath(); g.moveTo(x0, y0); g.lineTo(x1, y1); g.stroke(); };

/** Cóndor de frente: macho con cresta y ojos pardos; hembra sin cresta y de ojos rojizos. */
function condor(g, x, y, h, expr, hembra) {
  const k = hembra ? 0.93 : 1, u = h * k, cuerpo = hembra ? '#2b2427' : '#1b1b20', ala = hembra ? '#231d20' : '#14141a';
  E(g, x, y - 0.18 * u, 0.42 * u, 0.3 * u, cuerpo);                                          // pecho
  E(g, x - 0.34 * u, y - 0.36 * u, 0.17 * u, 0.34 * u, ala); E(g, x + 0.34 * u, y - 0.36 * u, 0.17 * u, 0.34 * u, ala);   // alas plegadas
  for (const d of [-1, 1]) T(g, x + d * 0.36 * u, y - 0.55 * u, x + d * 0.34 * u, y - 0.2 * u, hembra ? '#d6cec2' : '#f0eee7', 0.05 * u);
  for (let i = 0; i < 11; i++) { const a = Math.PI * (0.05 + i * 0.09); E(g, x + Math.cos(a) * 0.27 * u * (i < 5 ? -1 : 1) * 0 + (i - 5) * 0.045 * u, y - 0.6 * u + Math.abs(i - 5) * 0.012 * u, 0.1 * u, 0.075 * u, i % 2 ? '#f3f0e6' : '#ffffff'); }   // collar de plumas blancas
  E(g, x, y - 0.69 * u, 0.12 * u, 0.12 * u, '#c25a46');                                      // cuello pelado
  E(g, x, y - 0.84 * u, hembra ? 0.135 * u : 0.15 * u, 0.155 * u, hembra ? '#c8604c' : '#d0654f');   // cabeza
  if (!hembra) { E(g, x, y - 1.0 * u, 0.055 * u, 0.09 * u, '#7a2f2a'); E(g, x - 0.012 * u, y - 1.03 * u, 0.018 * u, 0.04 * u, '#b0544a'); }   // cresta
  for (const d of [-1, 1]) T(g, x + d * 0.07 * u, y - 0.93 * u, x + d * 0.1 * u, y - 0.8 * u, 'rgba(90,25,20,.35)', 0.012 * u);                 // arrugas
  const ojo = hembra ? '#c8332a' : '#5a3418';
  for (const d of [-1, 1]) {
    const ex = x + d * 0.075 * u, ey = y - 0.86 * u;
    if (expr === 'feliz') { g.strokeStyle = '#2a1410'; g.lineWidth = 0.014 * u; g.beginPath(); g.arc(ex, ey + 0.008 * u, 0.026 * u, Math.PI * 1.1, Math.PI * 1.9); g.stroke(); }
    else { E(g, ex, ey, 0.03 * u, 0.026 * u, '#f6efe0'); E(g, ex, ey, 0.021 * u, 0.021 * u, ojo); E(g, ex, ey, 0.01 * u, 0.01 * u, '#120a08'); E(g, ex - 0.006 * u, ey - 0.007 * u, 0.004 * u, 0.004 * u, '#fff'); }
    if (expr === 'triste') T(g, ex - d * 0.035 * u, ey - 0.038 * u + (d < 0 ? 0 : 0.0), ex + d * 0.03 * u, ey - 0.02 * u, '#7a2f2a', 0.014 * u);
  }
  P(g, [[x - 0.045 * u, y - 0.84 * u], [x + 0.045 * u, y - 0.84 * u], [x + 0.04 * u, y - 0.76 * u], [x, y - 0.7 * u], [x - 0.01 * u, y - 0.75 * u]], '#e8e1bd');   // pico ganchudo
  T(g, x - 0.045 * u, y - 0.8 * u, x, y - 0.775 * u, '#b9b08a', 0.01 * u);
  if (expr === 'feliz') { g.strokeStyle = '#7a2f2a'; g.lineWidth = 0.012 * u; g.beginPath(); g.arc(x, y - 0.775 * u, 0.04 * u, 0.15 * Math.PI, 0.85 * Math.PI); g.stroke(); }
}

/** Niña Sami (8 años): suéter de colores, trenzas con cintas rojas. */
function sami(g, x, y, h, expr) {
  E(g, x, y - 0.14 * h, 0.28 * h, 0.2 * h, '#e0702f');                                       // suéter
  for (const [dy, c] of [[0.12, '#f2c14e'], [0.17, '#2e9aa0'], [0.22, '#f2c14e']]) { g.fillStyle = c; g.fillRect(x - 0.26 * h, y - dy * h, 0.52 * h, 0.02 * h); }
  E(g, x - 0.28 * h, y - 0.12 * h, 0.07 * h, 0.14 * h, '#e0702f'); E(g, x + 0.28 * h, y - 0.12 * h, 0.07 * h, 0.14 * h, '#e0702f');
  g.fillStyle = '#c98f63'; g.fillRect(x - 0.05 * h, y - 0.36 * h, 0.1 * h, 0.1 * h);        // cuello
  for (const d of [-1, 1]) { E(g, x + d * 0.2 * h, y - 0.46 * h, 0.06 * h, 0.2 * h, '#14100e'); E(g, x + d * 0.2 * h, y - 0.27 * h, 0.035 * h, 0.04 * h, '#d83a2d'); }   // trenzas + cintas
  E(g, x, y - 0.58 * h, 0.21 * h, 0.23 * h, '#14100e'); E(g, x, y - 0.55 * h, 0.17 * h, 0.2 * h, '#c98f63');   // pelo y cara
  P(g, [[x - 0.18 * h, y - 0.62 * h], [x, y - 0.74 * h], [x + 0.18 * h, y - 0.62 * h], [x + 0.1 * h, y - 0.66 * h], [x - 0.1 * h, y - 0.66 * h]], '#14100e');   // flequillo
  E(g, x - 0.09 * h, y - 0.52 * h, 0.03 * h, 0.032 * h, '#e8957a'); E(g, x + 0.09 * h, y - 0.52 * h, 0.03 * h, 0.032 * h, '#e8957a');   // mejillas
  const inc = { preocupada: 0.025, triste: 0.03 }[expr] || 0;
  for (const d of [-1, 1]) {
    const ex = x + d * 0.075 * h, ey = y - 0.57 * h;
    E(g, ex, ey, 0.028 * h, 0.036 * h, '#fff'); E(g, ex, ey + 0.004 * h, 0.02 * h, 0.028 * h, '#2a1810'); E(g, ex - 0.007 * h, ey - 0.006 * h, 0.007 * h, 0.007 * h, '#fff');
    T(g, ex - d * 0.03 * h, ey - 0.05 * h - (d < 0 ? inc : -inc) * 0 + inc * 0.0, ex + d * 0.03 * h, ey - 0.05 * h - inc * 0.6 * (d < 0 ? -1 : 1) * 0 - inc, '#14100e', 0.012 * h);
  }
  g.strokeStyle = '#7a3a2a'; g.lineWidth = 0.012 * h; g.beginPath();
  if (expr === 'feliz') { g.arc(x, y - 0.5 * h, 0.05 * h, 0.1 * Math.PI, 0.9 * Math.PI); }
  else if (expr === 'triste' || expr === 'preocupada') { g.arc(x, y - 0.455 * h, 0.035 * h, 1.15 * Math.PI, 1.85 * Math.PI); }
  else { g.arc(x, y - 0.5 * h, 0.035 * h, 0.15 * Math.PI, 0.85 * Math.PI); }
  g.stroke();
}

/** Don Luis, guardaparque: uniforme verde, sombrero y bigote. */
function luis(g, x, y, h, expr) {
  P(g, [[x - 0.34 * h, y], [x - 0.3 * h, y - 0.3 * h], [x - 0.1 * h, y - 0.38 * h], [x + 0.1 * h, y - 0.38 * h], [x + 0.3 * h, y - 0.3 * h], [x + 0.34 * h, y]], '#4b6b3a');   // uniforme
  P(g, [[x - 0.1 * h, y - 0.38 * h], [x, y - 0.28 * h], [x + 0.1 * h, y - 0.38 * h], [x + 0.06 * h, y - 0.4 * h], [x, y - 0.33 * h], [x - 0.06 * h, y - 0.4 * h]], '#e7e2cf');   // cuello
  E(g, x + 0.2 * h, y - 0.24 * h, 0.04 * h, 0.04 * h, '#f2c14e'); E(g, x + 0.2 * h, y - 0.24 * h, 0.022 * h, 0.022 * h, '#2e5a2a');   // insignia
  g.fillStyle = '#d1a07a'; g.fillRect(x - 0.06 * h, y - 0.44 * h, 0.12 * h, 0.08 * h);
  E(g, x, y - 0.58 * h, 0.15 * h, 0.17 * h, '#d1a07a');                                       // cara
  E(g, x - 0.15 * h, y - 0.58 * h, 0.025 * h, 0.04 * h, '#c28f6a'); E(g, x + 0.15 * h, y - 0.58 * h, 0.025 * h, 0.04 * h, '#c28f6a');
  E(g, x, y - 0.72 * h, 0.27 * h, 0.04 * h, '#3d4a2c'); E(g, x, y - 0.77 * h, 0.15 * h, 0.07 * h, '#4a5a36'); g.fillStyle = '#2a3320'; g.fillRect(x - 0.15 * h, y - 0.73 * h, 0.3 * h, 0.02 * h);   // sombrero
  E(g, x, y - 0.775 * h, 0.03 * h, 0.03 * h, '#f2c14e');
  const frunce = expr === 'serio' ? 0.018 : 0;
  for (const d of [-1, 1]) {
    const ex = x + d * 0.065 * h, ey = y - 0.6 * h;
    if (expr === 'sonrie') { g.strokeStyle = '#2a1810'; g.lineWidth = 0.012 * h; g.beginPath(); g.arc(ex, ey + 0.006 * h, 0.022 * h, Math.PI * 1.1, Math.PI * 1.9); g.stroke(); }
    else { E(g, ex, ey, 0.024 * h, 0.02 * h, '#fff'); E(g, ex, ey, 0.014 * h, 0.014 * h, '#2a1810'); }
    T(g, ex - d * 0.03 * h, ey - 0.035 * h - (d < 0 ? 0 : 0) + frunce * h * (d < 0 ? -1 : 1) * -1, ex + d * 0.03 * h, ey - 0.04 * h + frunce * h, '#2a1a10', 0.014 * h);
  }
  E(g, x, y - 0.545 * h, 0.07 * h, 0.022 * h, '#2a1a10');                                     // bigote
  g.strokeStyle = '#6a3a2a'; g.lineWidth = 0.011 * h; g.beginPath();
  if (expr === 'sonrie') g.arc(x, y - 0.51 * h, 0.04 * h, 0.15 * Math.PI, 0.85 * Math.PI); else g.arc(x, y - 0.5 * h, 0.025 * h, 0.2 * Math.PI, 0.8 * Math.PI);
  g.stroke();
}

export const RETRATOS = {
  kuntur: (g, x, y, h, e) => condor(g, x, y, h, e, false),
  killa: (g, x, y, h, e) => condor(g, x, y, h, e, true),
  sami, luis
};
export const NOMBRES = { kuntur: 'Kuntur', killa: 'Killa', sami: 'Sami', luis: 'Don Luis' };
