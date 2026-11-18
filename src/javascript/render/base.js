/* Primitivas de dibujo y proyección en perspectiva.
   El contexto de dibujo `c` = { g, W, H, F, HOR, cam, t } (F = foco, HOR = línea del horizonte). */
export function proy(c, x, y, z) {
  const s = c.F / (z - c.cam.z);
  return { x: c.W / 2 + (x - c.cam.x) * s, y: c.HOR + (c.cam.y - y) * s, s };
}
export function elipse(g, x, y, rx, ry, color) {
  g.fillStyle = color; g.beginPath(); g.ellipse(x, y, Math.max(0.1, rx), Math.max(0.1, ry), 0, 0, 6.2832); g.fill();
}
