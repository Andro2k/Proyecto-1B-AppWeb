/* Escena de la novela visual: fondo pixel-art + dos personajes con entrada suave y resalte de quien habla. */
import { crearFondo } from './novela_fondos.js';
import { RETRATOS } from './retratos.js';

export function crearEscenaNovela(lienzo) {
  const g = lienzo.getContext('2d'), baja = document.createElement('canvas');
  const fondos = new Map(); let fondoId = null, aspecto = 1.6;
  const lado = { izq: { id: null, expr: 'normal', alfa: 0 }, der: { id: null, expr: 'normal', alfa: 0 } };
  let habla = null, ultimo = 0;

  function ajustar() {
    const r = lienzo.getBoundingClientRect(), d = window.devicePixelRatio || 1;
    lienzo.width = Math.max(1, r.width * d); lienzo.height = Math.max(1, r.height * d); aspecto = lienzo.width / lienzo.height;
    for (const f of fondos.values()) f.ajustar(aspecto);
  }
  const fondo = id => {
    if (!fondos.has(id)) { const f = crearFondo(id, baja); fondos.set(id, f); f.ajustar(aspecto); }
    return fondos.get(id);
  };

  /** Cambia lo que se ve. izq/der: 'personaje' o 'personaje:expresión'. */
  function mostrar({ fondo: f, izq, der, habla: quien }) {
    if (f !== fondoId) { fondoId = f; const fb = fondo(f); fb.ajustar(aspecto); }
    for (const [clave, valor] of [['izq', izq], ['der', der]]) {
      const [id, expr = 'normal'] = (valor || '').split(':'), l = lado[clave];
      if (id !== l.id) { l.alfa = 0; l.id = id || null; }
      l.expr = expr;
    }
    habla = quien || null;
  }

  function dibujar(t) {
    const W = lienzo.width, H = lienzo.height, dt = Math.min(0.1, t - ultimo); ultimo = t;
    if (!fondoId) return;
    const fb = fondo(fondoId); fb.ajustar(aspecto); fb.dibujar(t);
    g.imageSmoothingEnabled = false; g.drawImage(baja, 0, 0, W, H);
    const h = Math.min(H * 0.64, W * 0.34), base = H * 0.78;   // proporcional al lado menor: cabe en 5:4, 16:9 y 16:10
    for (const [clave, cx] of [['izq', W * 0.27], ['der', W * 0.73]]) {
      const l = lado[clave]; if (!l.id) continue;
      l.alfa = Math.min(1, l.alfa + dt * 4);
      const activo = habla === clave || !habla, sube = habla === clave ? -H * 0.012 + Math.sin(t * 6) * H * 0.002 : 0;
      g.save(); g.globalAlpha = l.alfa; g.filter = activo ? 'none' : 'brightness(.62)';   // quien no habla se oscurece (sin volverse transparente)
      g.translate(0, sube + (1 - l.alfa) * H * 0.03);
      g.fillStyle = 'rgba(0,0,0,.25)'; g.beginPath(); g.ellipse(cx, base + 4, h * 0.3, h * 0.04, 0, 0, 6.2832); g.fill();
      RETRATOS[l.id](g, cx, base, h, l.expr);
      g.restore();
    }
  }
  return { ajustar, mostrar, dibujar };
}
