/* Reglas del vuelo. Lógica pura: no toca el DOM; avisa de lo ocurrido mediante `ev`.
   ev = { aviso(titulo, texto, fuente?), dato(id) }.  Al terminar, deja m.fin = 'nido' | 'muerte'. */
import { ANCHO, TECHO, NIDO_ALTO } from '../config.js';
import { clamp, primerIndice } from '../util.js';
import { descubrir, dano } from './eventos.js';
import { actualizarTormentas } from './clima.js';
import { actualizarEnemigos } from './enemigos.js';

function aletear(m, ev) {
  const p = m.p, despega = p.suelo, costo = despega ? 18 : 6;
  if (p.energia < costo) return;
  p.energia -= costo; p.vy = despega ? 7 : 6; p.suelo = false; if (despega) p.y = 0.2;
  p.cd = 0.38; p.aleteo = 0.3;
  if (despega) descubrir(m, 'despegue', ev);
}

/* Interacciones por tipo de entidad (tabla de despacho en lugar de if/else). */
const INTERACCION = {
  carrona(m, o, ev) {
    const p = m.p;
    if (Math.abs(o.x - p.x) >= 2.2 || p.y >= 2) return;
    o.hecho = true;
    if (o.veneno) { p.energia = Math.max(0, p.energia - 30); descubrir(m, 'veneno', ev); dano(m, '¡Carroña envenenada! Sigue a los gallinazos.', ev); }
    else {
      p.energia = Math.min(100, p.energia + 35); m.puntos += 100; m.limpio++; m.comidas++;
      descubrir(m, m.comidas > 1 ? 'patas' : 'alimentacion', ev); descubrir(m, 'alimentacion', ev);
    }
  },
  cable(m, o, ev) {
    o.hecho = true;
    if (Math.abs(m.p.y - o.y) < 1.3) { descubrir(m, 'cables', ev); dano(m, '¡Chocaste con un cable eléctrico!', ev); }
    else m.puntos += 25;
  }
};

/** La compañera vuela por delante, se desvía hacia la siguiente térmica y se detiene en el nido. */
function actualizarCompa(m, dt) {
  const c = m.compa, p = m.p; if (!c) return;
  const t = m.termicas.find(q => q.z + q.len > p.z + 4 && q.z < p.z + 70);
  const objX = t ? t.x : Math.sin(m.tiempo * 0.5) * 6, antes = c.x;
  c.z += (Math.min(p.z + 18, m.cfg.largo - 8) - c.z) * Math.min(1, 3 * dt);
  c.x += (objX - c.x) * Math.min(1, 1.2 * dt); c.vx = (c.x - antes) / Math.max(dt, 0.001);
  c.y += ((t ? 15 : 12) + Math.sin(m.tiempo) * 1.5 - c.y) * Math.min(1, 1.5 * dt);
}

export function actualizar(m, dt, ev) {
  const { p, cfg, entrada } = m, z0 = p.z;
  m.tiempo += dt;
  const dir = (entrada.der ? 1 : 0) - (entrada.izq ? 1 : 0);
  const obj = entrada.tx !== null ? clamp((entrada.tx - p.x) * 3, -9, 9) : dir * 9;
  p.vx += (obj - p.vx) * Math.min(1, 6 * dt);
  p.x = clamp(p.x + p.vx * dt, -ANCHO, ANCHO);

  p.cd -= dt; p.aleteo = Math.max(0, p.aleteo - dt); p.invul = Math.max(0, p.invul - dt);
  if (entrada.aleteo && p.cd <= 0) aletear(m, ev);

  const t = m.termicas.find(q => Math.abs(q.x - p.x) < q.r && p.z > q.z - 2 && p.z < q.z + q.len);
  p.enTermica = !!t;
  if (t) { p.vy += (4.5 - p.vy) * Math.min(1, 3 * dt); descubrir(m, 'vuelo', ev); }
  else {
    p.vy -= 7 * dt;
    const piso = entrada.pica ? -9 : -2.2;
    if (p.vy < piso) p.vy += (piso - p.vy) * Math.min(1, 5 * dt);
  }
  p.y += p.vy * dt;
  if (p.y >= TECHO) { p.y = TECHO; p.vy = Math.min(p.vy, 0); }
  p.suelo = p.y <= 0;
  if (p.suelo) { p.y = 0; p.vy = Math.max(p.vy, 0); }

  let v = cfg.vel * (entrada.pica && !p.suelo ? 1.4 : 1);
  if (p.suelo) v *= 0.35;                        // en el suelo camina despacio
  p.z += v * dt;
  if (!t && !p.suelo) p.energia -= 0.9 * dt;     // planear gasta poco
  p.energia = clamp(p.energia, 0, 100);
  if (p.suelo && p.energia < 1) { p.energia = 40; dano(m, 'Sin energía en el suelo. ¡Busca térmicas y carroña!', ev); }
  if (m.tiempo > 4) descubrir(m, 'tamano', ev);
  if (m.tiempo > 6) descubrir(m, 'hembra', ev);
  actualizarCompa(m, dt);
  actualizarTormentas(m, dt, ev);
  actualizarEnemigos(m, dt, ev);

  // Solo se revisan las entidades cercanas (lista ordenada por z + búsqueda binaria).
  const desde = primerIndice(m.ents, z0 - 0.4);
  for (let i = desde; i < m.ents.length && !m.fin; i++) {
    const o = m.ents[i];
    if (o.z > p.z + 28) break;
    if (o.hecho) continue;
    if (o.tipo === 'carrona' && !o.veneno && !o.vista && o.z > p.z) { o.vista = true; descubrir(m, 'busqueda', ev); }
    if (o.clase === 'frailejon' && !o.vista && o.z > p.z && Math.abs(o.x - p.x) < 16) { o.vista = true; descubrir(m, 'paramo', ev); }
    if (o.z <= p.z + 0.4) INTERACCION[o.tipo]?.(m, o, ev);
  }
  if (m.fin) return;
  if (p.z >= cfg.largo) {
    if (p.y >= NIDO_ALTO - 1 && p.y <= NIDO_ALTO + 9) m.fin = 'nido';
    else {
      p.z = cfg.largo - 40; p.energia = Math.max(5, p.energia - 10);
      ev.aviso('Ajusta tu altura', p.y < NIDO_ALTO ? 'Sube: el nido está en la repisa del risco.' : 'Baja un poco: la repisa del nido está más abajo.');
    }
  }
}
