/* Gallinazo (buitre negro) planeando: cuerpo, cabeza y alas con aleteo. */
import { elipse } from '../base.js';

export function dibGallinazo(g, x, y, w, fase) {
  const a = Math.sin(fase * 4) * w * 0.22;
  g.fillStyle = '#121214';
  for (const d of [-1, 1]) {
    g.beginPath(); g.moveTo(x, y);
    g.quadraticCurveTo(x + d * w * 0.55, y - w * 0.42 + a, x + d * w * 1.25, y - w * 0.05 + a * 1.5);
    g.quadraticCurveTo(x + d * w * 0.7, y + w * 0.1, x, y + w * 0.22); g.fill();
  }
  elipse(g, x, y + w * 0.08, w * 0.17, w * 0.24, '#0b0b0d'); elipse(g, x, y - w * 0.12, w * 0.08, w * 0.08, '#4a3a38');
}
