/* Fondos de la novela visual. Cada fábrica devuelve { ajustar(aspecto), dibujar(t) } sobre un canvas de baja resolución.
   'nido' reutiliza la escena del menú (la pareja de cóndores en el risco). */
import { crearEscenaMenu } from './escena_menu.js';
import { mulberry, rect, disco, volcan, cresta, frailejon, pajonal } from './pixel.js';

const ALTO = 180;
const bandas = (g, W, hor, colores) => colores.forEach((c, i) => rect(g, 0, Math.round(i * hor / colores.length), W, Math.ceil(hor / colores.length) + 1, c));

/** Esqueleto común: canvas estático + dinámica por fotograma. */
function fabrica(lienzo, construir, animar) {
  let W = 0, estatico;
  return {
    ajustar(aspecto) {
      const n = Math.max(160, Math.round(ALTO * aspecto)); if (n === W) return;
      W = n; lienzo.width = W; lienzo.height = ALTO; estatico = document.createElement('canvas'); estatico.width = W; estatico.height = ALTO;
      construir(estatico.getContext('2d'), W, mulberry(11));
    },
    dibujar(t) { const g = lienzo.getContext('2d'); g.drawImage(estatico, 0, 0); animar?.(g, W, t); }
  };
}

function valle(lienzo) {
  const nubes = [];
  return fabrica(lienzo, (s, W, r) => {
    const hor = Math.round(ALTO * 0.6);
    bandas(s, W, hor, ['#3d86d6', '#4f98e0', '#6aaee8', '#86c0ee', '#a4d2f2', '#c3e0f4', '#e0eef4']);
    disco(s, Math.round(W * 0.16), 26, 12, 12, '#fff3c4'); disco(s, Math.round(W * 0.16), 26, 8, 8, '#fffbe0');
    volcan(s, Math.round(W * 0.7), hor + 4, Math.round(W * 0.28), Math.round(ALTO * 0.46), r,
      { luz: '#6f86b8', sombra: '#566ca0', nieveLuz: '#ffffff', nieveSombra: '#cfd9ee', bordeLuz: '#dbe4f4', bordeSombra: '#a9b8d8' });
    cresta(s, W, hor + 4, 16, 0.04, 2, '#6d8f9a', r); cresta(s, W, hor + 14, 14, 0.06, 5, '#4f7a58', r); cresta(s, W, hor + 24, 10, 0.08, 1, '#3f6d3f', r);
    for (let i = 0; i < W / 3; i++) pajonal(s, Math.floor(r() * W), Math.round(ALTO * 0.78 + r() * ALTO * 0.2), r, '#2f6a3a', '#4c8a45');
    for (let i = 0; i < 5; i++) frailejon(s, Math.floor(r() * W), Math.round(ALTO * 0.76 + r() * 8), 7 + Math.floor(r() * 4), r);
    rect(s, 0, Math.round(ALTO * 0.88), W, ALTO, '#4a7d3a'); cresta(s, W, ALTO * 0.88, 3, 0.08, 3, '#5a9244', r);
    for (let y = Math.round(ALTO * 0.8); y < ALTO; y++) rect(s, Math.round(W * 0.5 - (y - ALTO * 0.8) * 0.5 - 4), y, 9 + Math.round((y - ALTO * 0.8) * 1.0), 1, '#c9a874');   // camino de tierra
    const cx = Math.round(W * 0.14), cy = Math.round(ALTO * 0.86);                                        // casa de adobe con techo de paja
    rect(s, cx - 24, cy - 24, 48, 24, '#c9a06a'); rect(s, cx + 6, cy - 24, 18, 24, '#b08850'); rect(s, cx - 6, cy - 14, 10, 14, '#4a3220'); rect(s, cx - 16, cy - 18, 8, 7, '#6f5a3a');
    for (let k = 0; k < 14; k++) rect(s, cx - 30 + k, cy - 24 - k, 60 - 2 * k, 1, k % 2 ? '#d9b94c' : '#c9a63e');
    for (let i = 0; i < 9; i++) { rect(s, cx + 40 + i * 9, cy - 8, 2, 10, '#6f5a3a'); }                  // cerca del corral
    rect(s, cx + 40, cy - 7, 82, 1, '#8a7248'); rect(s, cx + 40, cy - 3, 82, 1, '#8a7248');
    for (let i = 0; i < 4; i++) { disco(s, cx + 52 + i * 18, cy - 3, 5, 3, '#f2efe6'); rect(s, cx + 55 + i * 18, cy - 5, 3, 3, '#3a3a3a'); }   // ovejas
    for (let i = 0; i < 40; i++) rect(s, Math.floor(r() * W), Math.round(ALTO * 0.9 + r() * ALTO * 0.1), 1, 1, '#e8d86a');   // florecillas
    for (let i = 0; i < 4; i++) nubes.push({ x: r() * W, y: 10 + r() * hor * 0.45, w: 24 + r() * 26, v: 1 + r() * 2 });
  }, (g, W, t) => {
    for (const n of nubes) { const x = ((n.x + t * n.v) % (W + n.w * 2)) - n.w; disco(g, x, n.y, n.w / 2, 4, '#ffffff'); disco(g, x + n.w * 0.2, n.y - 3, n.w / 3, 4, '#f3f8fc'); rect(g, x - n.w / 2, n.y + 3, n.w, 1, '#cfdcea'); }
  });
}

function noche(lienzo) {
  const estrellas = [];
  return fabrica(lienzo, (s, W, r) => {
    const hor = Math.round(ALTO * 0.62);
    bandas(s, W, hor, ['#050818', '#080d26', '#0c1434', '#111b44', '#182552', '#20305f']);
    const mx = Math.round(W * 0.28);
    disco(s, mx, 36, 20, 20, 'rgba(220,230,255,.12)'); disco(s, mx, 36, 14, 14, '#eef2ff'); disco(s, mx - 4, 33, 3, 3, '#cfd7ee'); disco(s, mx + 5, 40, 2, 2, '#cfd7ee'); disco(s, mx + 3, 30, 2, 2, '#d9e0f3');   // luna con cráteres
    volcan(s, Math.round(W * 0.68), hor + 4, Math.round(W * 0.28), Math.round(ALTO * 0.44), r,
      { luz: '#26346a', sombra: '#1a2450', nieveLuz: '#b8c6ee', nieveSombra: '#7f90c8', bordeLuz: '#8fa0d8', bordeSombra: '#5b6aa8' });
    cresta(s, W, hor + 6, 16, 0.04, 2, '#141c44', r); cresta(s, W, hor + 18, 14, 0.06, 5, '#0f1636', r); cresta(s, W, hor + 28, 10, 0.08, 1, '#0a1028', r);
    for (let i = 0; i < W / 3; i++) pajonal(s, Math.floor(r() * W), Math.round(ALTO * 0.8 + r() * ALTO * 0.18), r, '#0b1d2a', '#12303a');
    for (let i = 0; i < 7; i++) frailejon(s, Math.floor(r() * W), Math.round(ALTO * 0.8 + r() * 10), 8 + Math.floor(r() * 6), r);
    const rx = Math.round(W * 0.74), ry = Math.round(ALTO * 0.84);                                        // risco del nido
    for (let dx = -26; dx <= 28; dx++) { const t = 1 - Math.abs(dx) / 28, top = ry - 30 * Math.pow(t, 0.55); for (let y = Math.round(top); y < ALTO; y++) rect(s, rx + dx, y, 1, 1, dx < 0 ? '#2a3050' : '#171c36'); }
    rect(s, rx - 10, ry - 32, 20, 2, '#5a4a30'); rect(s, rx - 8, ry - 34, 16, 2, '#6f5a3a'); disco(s, rx, ry - 36, 3, 4, '#f5f1e6');   // nido y huevo
    for (let i = 0; i < 70; i++) estrellas.push({ x: Math.floor(r() * W), y: Math.floor(r() * hor * 0.8), f: r() * 6 });
  }, (g, W, t) => { for (const e of estrellas) if (Math.sin(t * 1.4 + e.f) > -0.3) rect(g, e.x, e.y, 1, 1, '#e8eeff'); });
}

export function crearFondo(id, lienzo) {
  const FABRICAS = { nido: lienzo => ({ ...crearEscenaMenu(lienzo) }), valle, noche };
  return FABRICAS[id](lienzo);
}
