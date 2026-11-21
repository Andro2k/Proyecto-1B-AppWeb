/* Primitivas de pixel-art compartidas por la escena del menú y los fondos de la novela visual.
   Todo se dibuja con fillRect sobre un canvas de baja resolución que luego se amplía sin suavizado. */
export const mulberry = a => () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };

export const rect = (g, x, y, w, h, c) => { g.fillStyle = c; g.fillRect(Math.round(x), Math.round(y), w, h); };
export function disco(g, cx, cy, rx, ry, c) {
  g.fillStyle = c;
  for (let y = -ry; y <= ry; y++) { const w = Math.round(rx * Math.sqrt(Math.max(0, 1 - (y * y) / (ry * ry)))); g.fillRect(Math.round(cx - w), Math.round(cy + y), 2 * w + 1, 1); }
}
export function linea(g, x0, y0, x1, y1, c, grosor = 1) {
  x0 = Math.round(x0); y0 = Math.round(y0); x1 = Math.round(x1); y1 = Math.round(y1);
  const dx = Math.abs(x1 - x0), dy = -Math.abs(y1 - y0), sx = x0 < x1 ? 1 : -1, sy = y0 < y1 ? 1 : -1; let e = dx + dy;
  g.fillStyle = c;
  for (;;) { g.fillRect(x0, y0, grosor, grosor); if (x0 === x1 && y0 === y1) break; const e2 = 2 * e; if (e2 >= dy) { e += dy; x0 += sx; } if (e2 <= dx) { e += dx; y0 += sy; } }
}

/* ---- Elementos ---- */
export function frailejon(g, x, y, h, rnd) {
  rect(g, x, y - h, 2, h, '#2a2518'); rect(g, x - 1, y - h * 0.8, 4, h * 0.6, '#3a3320');   // tronco con hojas secas
  const cy = y - h;
  for (let i = 0; i < 9; i++) {                                                           // roseta de hojas plateadas
    const a = -Math.PI + (i / 8) * Math.PI, l = 5 + (i % 2) * 2;
    linea(g, x + 1, cy, x + 1 + Math.cos(a) * l, cy + Math.sin(a) * l * 0.7, i % 3 ? '#4f8a6a' : '#a9d3a4');
  }
  rect(g, x, cy - 1, 3, 2, '#c9e6b8');
}
export function pajonal(g, x, y, rnd, c1, c2) {
  for (let i = 0; i < 5; i++) { const a = -1.2 + i * 0.6, l = 4 + rnd() * 5; linea(g, x, y, x + Math.sin(a) * l, y - Math.cos(a) * l, i % 2 ? c1 : c2); }
}
export function volcan(g, cx, base, w, h, rnd, pal = {}) {
  const ruido = []; for (let i = 0; i <= w * 2; i++) ruido.push((rnd() - 0.5) * 1.6);
  for (let dx = -w; dx <= w; dx++) {
    const t = 1 - Math.abs(dx) / w, top = base - h * Math.pow(t, 1.25) - (ruido[dx + w] || 0) * (t < 0.35 ? 2 : 1);
    const nieveY = base - h * 0.62 - ((ruido[dx + w] || 0) * 3);
    for (let y = Math.round(top); y < base; y++) {
      const lado = dx > 0 ? 0 : 1;                                       // luz desde la izquierda (sol)
      const P = { luz: '#3d4a86', sombra: '#2a3466', nieveLuz: '#e8eefb', nieveSombra: '#a8b9e0', bordeLuz: '#b7c5e8', bordeSombra: '#7f8fc4', ...pal };
      let c = lado ? P.luz : P.sombra;
      if (y < nieveY) c = lado ? P.nieveLuz : P.nieveSombra;
      else if (y < nieveY + 3 && ((y + dx) & 1)) c = lado ? P.bordeLuz : P.bordeSombra;
      g.fillStyle = c; g.fillRect(cx + dx, y, 1, 1);
    }
  }
}
export function cresta(g, W, base, amp, f, ph, c, rnd) {
  g.fillStyle = c;
  for (let x = 0; x < W; x++) { const h = amp * (0.55 + 0.3 * Math.sin(x * f + ph) + 0.15 * Math.sin(x * f * 2.7 + ph * 2)); g.fillRect(x, Math.round(base - h), 1, Math.ceil(h) + 40); }
}

/* Cóndor posado (de perfil, mirando a la izquierda). `hembra`: sin cresta y de ojo rojizo, algo más pequeña. */
export function condorPosado(g, x, y, hembra, ala = 0) {
  const s = hembra ? 0.86 : 1, E = (cx, cy, rx, ry, c) => disco(g, x + cx * s, y + cy * s, Math.max(1, rx * s), Math.max(1, ry * s), c);
  rect(g, x - 2 * s, y - 3, 2, 3, '#6b6a72'); rect(g, x + 2 * s, y - 3, 2, 3, '#6b6a72');                // patas
  E(3, -3, 3, 4, '#0d0e14');                                                                              // cola
  E(0, -11, 5, 9, '#10121c');                                                                             // cuerpo
  E(1, -10 + ala, 3, 7, '#1b1f33'); rect(g, x + 1 * s, y - 14 * s + ala, 1, 8 * s, hembra ? '#cfc9bd' : '#f1eee3');   // ala plegada con franja blanca
  E(-3, -19, 4, 2, '#f4f1e6');                                                                            // collar blanco
  E(-4, -22, 2, 3, '#b8553f');                                                                            // cuello pelado
  E(-5, -25, 3, 3, '#d9694e');                                                                            // cabeza
  if (!hembra) { E(-4, -29, 2, 2, '#7a2f2a'); rect(g, x - 5 * s, y - 30 * s, 2, 1, '#9c3d34'); }         // cresta del macho
  rect(g, x - 7 * s, y - 25 * s, 1, 1, hembra ? '#ff3b2e' : '#2a1410');                                  // ojo (rojo en la hembra)
  rect(g, x - 9 * s, y - 25 * s, 2, 1, '#e8e2c0'); rect(g, x - 9 * s, y - 24 * s, 1, 1, '#e8e2c0');      // pico
}
export function condorVolando(g, x, y, fase, c) {
  const a = Math.sin(fase) * 2;
  linea(g, x, y, x - 7, y - 2 + a, c); linea(g, x - 7, y - 2 + a, x - 13, y + 1 + a * 1.6, c);
  linea(g, x, y, x + 7, y - 2 + a, c); linea(g, x + 7, y - 2 + a, x + 13, y + 1 + a * 1.6, c);
  rect(g, x - 1, y, 2, 2, c);
}

