/* Escena pixel-art del menú de inicio: páramo andino al amanecer, volcán nevado, frailejones,
   una pareja de cóndores en el risco y luciérnagas. Se dibuja a baja resolución (alto fijo de 180 px)
   y se amplía con `image-rendering: pixelated`, así cada "píxel" mide lo mismo en cualquier pantalla. */
import { mulberry, rect, disco, linea, frailejon, pajonal, volcan, cresta, condorPosado, condorVolando } from './pixel.js';
export { condorPosado };

const ALTO = 180;
const CIELO = ['#0a1030', '#10194a', '#1a2160', '#2b2a6e', '#463478', '#6e4682', '#a35a86', '#d66f80', '#f08f6e', '#fbb872', '#ffdc9a'];
/* ---- Composición ---- */
export function crearEscenaMenu(lienzo) {
  const g = lienzo.getContext('2d'); let W = 0, estatico, luces = [], estrellas = [], nubes = [];
  const g2 = () => estatico.getContext('2d');

  function construir() {
    estatico = document.createElement('canvas'); estatico.width = W; estatico.height = ALTO;
    const s = g2(), r = mulberry(7), hor = Math.round(ALTO * 0.62);
    // cielo en bandas
    const bandas = CIELO.length; for (let i = 0; i < bandas; i++) rect(s, 0, i * hor / bandas, W, Math.ceil(hor / bandas) + 1, CIELO[i]);
    for (let i = 0; i < bandas - 1; i++) for (let x = (i & 1); x < W; x += 2) rect(s, x, Math.round((i + 1) * hor / bandas) - 1, 1, 1, CIELO[i + 1]);   // tramado entre bandas
    estrellas = Array.from({ length: Math.round(W / 5) }, () => ({ x: Math.floor(r() * W), y: Math.floor(r() * hor * 0.5), f: r() * 6 }));
    // sol
    const sx = Math.round(W * 0.3);
    disco(s, sx, hor - 2, 22, 22, 'rgba(255,200,140,.18)'); disco(s, sx, hor - 2, 15, 15, 'rgba(255,215,150,.3)'); disco(s, sx, hor - 2, 9, 9, '#ffe9b0');
    volcan(s, Math.round(W * 0.64), hor + 6, Math.round(W * 0.3), Math.round(ALTO * 0.5), r);
    cresta(s, W, hor + 2, 20, 0.035, 1, '#2a2a63', r); cresta(s, W, hor + 14, 17, 0.05, 4, '#1c2250', r); cresta(s, W, hor + 24, 14, 0.07, 2, '#141c40', r);
    // páramo medio
    cresta(s, W, ALTO * 0.78, 10, 0.045, 5, '#0f2a36', r);
    for (let i = 0; i < W / 3; i++) pajonal(s, Math.floor(r() * W), Math.round(ALTO * 0.78 + r() * 18), r, '#1f5a52', '#2f7b62');
    for (let i = 0; i < 9; i++) frailejon(s, Math.floor(r() * W * 0.55), Math.round(ALTO * 0.76 + r() * 10), 7 + Math.floor(r() * 5), r);
    // risco con la pareja de cóndores (derecha)
    const rx = Math.round(W * 0.76), ry = Math.round(ALTO * 0.8);
    for (let dx = -28; dx <= 30; dx++) {
      const t = 1 - Math.abs(dx) / 30, top = ry - 34 * Math.pow(t, 0.55) + ((dx * 7) % 3);
      for (let y = Math.round(top); y < ALTO; y++) { const c = dx < -4 ? '#3c3f5a' : (dx < 12 ? '#2a2c44' : '#1b1d33'); rect(s, rx + dx, y, 1, 1, ((y + dx) % 7 === 0) ? '#4d5272' : c); }
    }
    for (let dx = -14; dx <= 10; dx++) rect(s, rx + dx, ry - 33 + ((dx * 5) % 2), 1, 2, '#4a7b4e');            // musgo
    rect(s, rx - 10, ry - 35, 20, 2, '#6f5a3a'); rect(s, rx - 8, ry - 37, 16, 2, '#8a7248');                 // nido de palitos
    condorPosado(s, rx + 8, ry - 35, true); condorPosado(s, rx - 4, ry - 36, false);
    // primer plano oscuro
    cresta(s, W, ALTO * 0.9, 9, 0.06, 8, '#09161e', r);
    for (let i = 0; i < 6; i++) frailejon(s, Math.floor(r() * W), Math.round(ALTO * 0.93 + r() * 6), 12 + Math.floor(r() * 8), r);
    for (let i = 0; i < W / 4; i++) pajonal(s, Math.floor(r() * W), ALTO - Math.floor(r() * 12), r, '#0e2a2e', '#17404a');
    luces = Array.from({ length: 34 }, () => ({ x: r() * W, y: ALTO * 0.55 + r() * ALTO * 0.42, f: r() * 6, v: 0.4 + r() * 0.9 }));
    nubes = Array.from({ length: 5 }, (_, i) => ({ x: r() * W, y: 8 + r() * hor * 0.5, w: 24 + r() * 30, v: 1.5 + r() * 2 }));
  }

  /** `aspecto` (ancho/alto) permite usar la escena en un canvas fuera de pantalla. */
  function ajustar(aspecto) {
    const r = lienzo.getBoundingClientRect(), nuevo = Math.max(160, Math.round(ALTO * (aspecto || (r.width || 1280) / (r.height || 720))));
    if (nuevo === W) return; W = nuevo; lienzo.width = W; lienzo.height = ALTO; construir();
  }

  function dibujar(t) {
    if (!lienzo.width) return;
    g.drawImage(estatico, 0, 0);
    for (const e of estrellas) if (Math.sin(t * 1.5 + e.f) > -0.2) rect(g, e.x, e.y, 1, 1, '#dfe8ff');
    for (const n of nubes) {                                                                              // nubes que derivan
      const x = ((n.x + t * n.v) % (W + n.w * 2)) - n.w;
      disco(g, x, n.y, n.w / 2, 3, '#7b5a8c'); disco(g, x + n.w * 0.2, n.y - 2, n.w / 3, 3, '#a56e8e'); rect(g, x - n.w / 2, n.y + 2, n.w, 1, '#e08a72');
    }
    for (let i = 0; i < 2; i++) {                                                                         // cóndores lejanos planeando
      const x = ((t * (5 + i * 2) + i * 140) % (W + 60)) - 30, y = 30 + i * 22 + Math.sin(t * 0.6 + i) * 4;
      condorVolando(g, x, y, t * (i ? 1.6 : 2.2) + i, '#0c0f24');
    }
    rect(g, 0, Math.round(ALTO * 0.66), W, 3, 'rgba(255,190,140,.12)');                                   // bruma
    for (const l of luces) {                                                                              // luciérnagas
      const a = (Math.sin(t * l.v * 2 + l.f) + 1) / 2, x = l.x + Math.sin(t * 0.5 * l.v + l.f) * 6, y = l.y + Math.cos(t * 0.4 * l.v + l.f) * 4;
      if (a > 0.35) { rect(g, x, y, 1, 1, '#ffe98a'); if (a > 0.8) { rect(g, x - 1, y, 3, 1, 'rgba(255,233,138,.35)'); rect(g, x, y - 1, 1, 3, 'rgba(255,233,138,.35)'); } }
    }
  }
  return { ajustar, dibujar };
}
