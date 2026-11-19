/* Cielo, sol, montañas, colinas, nubes lejanas y suelo. Los colores salen de datos/paisajes.js. */
import { elipse } from './base.js';
import { dibMonte } from './montes.js';

export function dibFondo(c) {
  const { g, W, H, HOR, cam, pais, t } = c;
  const cielo = g.createLinearGradient(0, 0, 0, HOR);
  for (const [p, col] of pais.cielo) cielo.addColorStop(p, col);
  g.fillStyle = cielo; g.fillRect(0, 0, W, HOR + 2);
  const sol = pais.sol; elipse(g, W * sol.x, HOR - H * sol.y, H * sol.r, H * sol.r, sol.color);
  dibMonte(c);
  const colinas = (color, amp, k, f) => {
    g.fillStyle = color; g.beginPath(); g.moveTo(0, HOR + 2);
    for (let i = 0; i <= W; i += 16) g.lineTo(i, HOR - amp * H * (0.55 + 0.45 * Math.sin((i + cam.x * k) * f) * Math.cos((i + cam.x * k) * f * 0.37)));
    g.lineTo(W, HOR + 2); g.fill();
  };
  colinas(pais.colinas[0], 0.07, 10, 0.006); colinas(pais.colinas[1], 0.035, 22, 0.011);
  // nubes lejanas que derivan despacio
  const n = Math.min(7, pais.nubes), ancho = W * 1.5;
  for (let i = 0; i < n; i++) {
    const f = (i * 0.618) % 1, x = ((i * 0.37 * ancho + t * (2 + i) - cam.x * 3) % ancho + ancho) % ancho - W * 0.25, y = HOR * (0.1 + 0.5 * f), w = W * (0.06 + 0.05 * ((i * 0.37) % 1));
    elipse(g, x, y + w * 0.12, w, w * 0.2, `rgba(${pais.nube},.22)`); elipse(g, x, y, w * 0.9, w * 0.18, `rgba(${pais.nube},.5)`); elipse(g, x - w * 0.25, y - w * 0.1, w * 0.5, w * 0.13, `rgba(${pais.nube},.6)`);
  }
}

export function dibSuelo(c) {
  const { g, W, H, F, HOR, cam, pais } = c, [base, claro, oscuro] = pais.suelo;
  g.fillStyle = base; g.fillRect(0, HOR, W, H - HOR);
  const paso = 14, z0 = Math.ceil(cam.z / paso) * paso;
  for (let k = 26; k >= 0; k--) {
    const z = z0 + k * paso, y = HOR + cam.y * F / (z - cam.z);
    g.fillStyle = Math.floor(z / paso) % 2 ? claro : oscuro; g.fillRect(0, y, W, H - y);
  }
  const bruma = g.createLinearGradient(0, HOR, 0, HOR + H * 0.18);
  bruma.addColorStop(0, pais.bruma); bruma.addColorStop(1, pais.bruma.replace(/[\d.]+\)$/, '0)'));
  g.fillStyle = bruma; g.fillRect(0, HOR, W, H * 0.18);
}
