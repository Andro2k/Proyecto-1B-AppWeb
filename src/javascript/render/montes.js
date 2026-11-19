/* Montañas del horizonte. Una función por forma (tabla de despacho); paralaje horizontal con la cámara. */
import { elipse } from './base.js';

function pico(g, cx, base, ancho, alto, cuerpo, nieve) {
  g.fillStyle = cuerpo; g.beginPath(); g.moveTo(cx - ancho, base); g.lineTo(cx, base - alto); g.lineTo(cx + ancho, base); g.fill();
  g.fillStyle = nieve; g.beginPath(); g.moveTo(cx - ancho * 0.28, base - alto * 0.7); g.lineTo(cx, base - alto);
  g.lineTo(cx + ancho * 0.28, base - alto * 0.7); g.lineTo(cx + ancho * 0.1, base - alto * 0.63); g.lineTo(cx - ancho * 0.07, base - alto * 0.67); g.fill();
}

const MONTES = {
  cordillera({ g, W, H, HOR }, m, cx) {
    pico(g, cx - W * 0.3, HOR, W * 0.2, H * 0.19, m.cuerpo, m.nieve);
    pico(g, cx, HOR, W * 0.3, H * 0.3, m.cuerpo, m.nieve);
  },
  cono({ g, W, H, HOR, t }, m, cx) {
    const h = H * 0.34, w = W * 0.27;
    g.fillStyle = m.cuerpo; g.beginPath(); g.moveTo(cx - w, HOR); g.quadraticCurveTo(cx - w * 0.25, HOR - h * 0.45, cx - w * 0.06, HOR - h);
    g.lineTo(cx + w * 0.06, HOR - h); g.quadraticCurveTo(cx + w * 0.25, HOR - h * 0.45, cx + w, HOR); g.fill();
    g.fillStyle = m.nieve; g.beginPath(); g.moveTo(cx - w * 0.2, HOR - h * 0.6); g.lineTo(cx - w * 0.06, HOR - h); g.lineTo(cx + w * 0.06, HOR - h);
    g.lineTo(cx + w * 0.2, HOR - h * 0.6); g.lineTo(cx + w * 0.1, HOR - h * 0.66); g.lineTo(cx, HOR - h * 0.58); g.lineTo(cx - w * 0.1, HOR - h * 0.65); g.fill();
    if (m.humo) for (let i = 0; i < 5; i++) {                                   // columna de vapor
      const k = (t * 0.07 + i * 0.2) % 1;
      elipse(g, cx + k * w * 0.35 + Math.sin(i) * 6, HOR - h - k * H * 0.12, 10 + k * 28, 7 + k * 18, `rgba(235,235,240,${0.38 * (1 - k)})`);
    }
  },
  domo({ g, W, H, HOR }, m, cx) {
    const h = H * 0.27, w = W * 0.42, gr = g.createLinearGradient(0, HOR - h, 0, HOR);
    gr.addColorStop(0, m.nieve); gr.addColorStop(0.5, m.nieve); gr.addColorStop(0.62, m.cuerpo); gr.addColorStop(1, m.cuerpo);
    g.fillStyle = gr; g.beginPath(); g.moveTo(cx - w, HOR); g.bezierCurveTo(cx - w * 0.55, HOR - h * 0.2, cx - w * 0.4, HOR - h, cx, HOR - h);
    g.bezierCurveTo(cx + w * 0.4, HOR - h, cx + w * 0.55, HOR - h * 0.2, cx + w, HOR); g.fill();
  },
  colinas({ g, W, H, HOR }, m, cx) {
    for (const [dx, r, c] of [[-0.3, 0.26, m.cuerpo], [0.05, 0.34, '#76898f'], [0.34, 0.24, m.cuerpo]]) elipse(g, cx + W * dx, HOR + H * 0.02, W * r, H * 0.2 * (r / 0.3), c);
  },
  selva({ g, W, H, HOR }, m, cx) {
    g.fillStyle = m.cuerpo; g.beginPath(); g.moveTo(cx - W * 0.45, HOR);
    for (let i = 0; i <= 40; i++) { const x = cx - W * 0.45 + (i / 40) * W * 0.9, k = Math.sin((i / 40) * Math.PI); g.lineTo(x, HOR - H * 0.26 * Math.pow(k, 0.8) - (i % 2 ? 5 : 0)); }
    g.lineTo(cx + W * 0.45, HOR); g.fill();
    g.fillStyle = m.nieve; g.globalAlpha = 0.35; for (let i = 0; i < 3; i++) g.fillRect(cx - W * 0.3 + i * W * 0.22, HOR - H * (0.14 + 0.03 * i), W * 0.3, H * 0.015); g.globalAlpha = 1;  // niebla entre árboles
  }
};

export function dibMonte(c) { const m = c.pais.monte; MONTES[m.forma](c, m, c.W * m.x - c.cam.x * 4); }
