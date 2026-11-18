/* Cielo, volcán, colinas y suelo. */
import { elipse } from './base.js';

export function dibFondo(c) {
  const { g, W, H, HOR, cam } = c;
  const cielo = g.createLinearGradient(0, 0, 0, HOR);
  cielo.addColorStop(0, '#1c2f40'); cielo.addColorStop(1, '#e3b36a');
  g.fillStyle = cielo; g.fillRect(0, 0, W, HOR + 2);
  elipse(g, W * 0.22, HOR - H * 0.14, H * 0.06, H * 0.06, 'rgba(255,236,180,.9)');
  const cx = W * 0.68 - cam.x * 4;                                   // volcán
  g.fillStyle = '#4b5d6d'; g.beginPath(); g.moveTo(cx - W * 0.3, HOR); g.lineTo(cx, HOR - H * 0.3); g.lineTo(cx + W * 0.3, HOR); g.fill();
  g.fillStyle = '#eef2f4'; g.beginPath(); g.moveTo(cx - W * 0.085, HOR - H * 0.21); g.lineTo(cx, HOR - H * 0.3); g.lineTo(cx + W * 0.085, HOR - H * 0.21);
  g.lineTo(cx + W * 0.03, HOR - H * 0.19); g.lineTo(cx - W * 0.02, HOR - H * 0.2); g.fill();
  const colinas = (color, amp, k, f) => {
    g.fillStyle = color; g.beginPath(); g.moveTo(0, HOR + 2);
    for (let i = 0; i <= W; i += 16) g.lineTo(i, HOR - amp * H * (0.55 + 0.45 * Math.sin((i + cam.x * k) * f) * Math.cos((i + cam.x * k) * f * 0.37)));
    g.lineTo(W, HOR + 2); g.fill();
  };
  colinas('#3f5646', 0.07, 10, 0.006); colinas('#5a6b3c', 0.035, 22, 0.011);
}

export function dibSuelo(c) {
  const { g, W, H, F, HOR, cam } = c;
  g.fillStyle = '#6d7a3d'; g.fillRect(0, HOR, W, H - HOR);
  const paso = 14, z0 = Math.ceil(cam.z / paso) * paso;
  for (let k = 26; k >= 0; k--) {
    const z = z0 + k * paso, y = HOR + cam.y * F / (z - cam.z);
    g.fillStyle = Math.floor(z / paso) % 2 ? '#788640' : '#6b7939'; g.fillRect(0, y, W, H - y);
  }
  const bruma = g.createLinearGradient(0, HOR, 0, HOR + H * 0.18);
  bruma.addColorStop(0, 'rgba(227,179,106,.6)'); bruma.addColorStop(1, 'rgba(227,179,106,0)');
  g.fillStyle = bruma; g.fillRect(0, HOR, W, H * 0.18);
}
