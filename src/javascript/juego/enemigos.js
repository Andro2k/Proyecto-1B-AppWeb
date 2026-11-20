/* Cazadores y sus disparos. Ciclo: espera → apunta (0,5 s siguiendo al cóndor + 0,5 s con la mira bloqueada)
   → dispara una bala hacia el punto bloqueado → recarga. Sin DOM: la lógica avisa mediante `ev`. */
import { descubrir, dano } from './eventos.js';

const ALCANCE_Y = 20;      // por encima de esta altura el cóndor está fuera de su alcance
const VISION = 46;         // distancia a la que empiezan a apuntar
const T_SIGUE = 0.5, T_APUNTA = 1.0, T_RECARGA = 2.6;
const VEL_BALA = 26;
const RADIO = { x: 1.3, y: 1.1, z: 1.5 };   // zona de impacto alrededor del cóndor

function disparar(m, o) {
  const p = m.p, vz = m.cfg.vel, boca = { x: o.x, y: 1.5, z: o.z };
  let t = 0.5, ty = o.my;
  for (let k = 0; k < 4; k++) {                                   // punto de encuentro si el cóndor sigue recto (anticipa la caída, no el giro)
    ty = Math.max(0.5, Math.min(30, o.my + o.mvy * (t + 0.5)));
    const d = Math.hypot(o.mx - boca.x, ty - boca.y, p.z + vz * t - boca.z); t = d / VEL_BALA;
  }
  const dx = o.mx - boca.x, dy = ty - boca.y, dz = p.z + vz * t - boca.z, d = Math.hypot(dx, dy, dz);
  m.balas.push({ tipo: 'bala', x: boca.x, y: boca.y, z: boca.z, vx: dx / d * VEL_BALA, vy: dy / d * VEL_BALA, vz: dz / d * VEL_BALA, vida: 2.2 });
}

export function actualizarEnemigos(m, dt, ev) {
  const p = m.p, antes = m.antes || (m.antes = { x: p.x, y: p.y, z: p.z });
  for (const o of m.cazadores) {
    const dz = o.z - p.z;
    if (dz < -6 || dz > VISION + 10) { o.estado = 'espera'; continue; }
    o.t += dt;
    if (o.estado === 'espera') {
      if (dz < VISION && dz > 6 && p.y < ALCANCE_Y) { o.estado = 'apunta'; o.t = 0; o.mx = p.x; o.my = p.y; o.mvy = p.vy; descubrir(m, 'caceria', ev); }
    } else if (o.estado === 'apunta') {
      if (p.y >= ALCANCE_Y + 0.5 || dz < 4) { o.estado = 'espera'; continue; }          // fuera de alcance: baja el rifle
      if (o.t < T_SIGUE) { o.mx = p.x; o.my = p.y; o.mvy = p.vy; }                                     // después de 0,5 s la mira queda bloqueada
      if (o.t >= T_APUNTA) { disparar(m, o); o.estado = 'recarga'; o.t = 0; }
    } else if (o.t >= T_RECARGA) { o.estado = 'espera'; o.t = 0; }
  }
  // Balas: se revisa el tramo recorrido en el fotograma (no solo el punto final) para que no atraviesen al cóndor.
  for (let i = m.balas.length - 1; i >= 0; i--) {
    const b = m.balas[i], r0 = { x: b.x - antes.x, y: b.y - antes.y, z: b.z - antes.z };
    b.x += b.vx * dt; b.y += b.vy * dt; b.z += b.vz * dt; b.vida -= dt;
    const r1 = { x: b.x - p.x, y: b.y - p.y, z: b.z - p.z }, d = { x: r1.x - r0.x, y: r1.y - r0.y, z: r1.z - r0.z };
    const dd = d.x * d.x + d.y * d.y + d.z * d.z || 1e-9, k = Math.max(0, Math.min(1, -(r0.x * d.x + r0.y * d.y + r0.z * d.z) / dd));
    const cx = r0.x + d.x * k, cy = r0.y + d.y * k, cz = r0.z + d.z * k;
    if (Math.abs(cx) < RADIO.x && Math.abs(cy) < RADIO.y && Math.abs(cz) < RADIO.z) { dano(m, '¡Un cazador te disparó! Los cóndores son una especie protegida.', ev); m.balas.splice(i, 1); }
    else if (b.vida <= 0 || b.y < 0 || b.z < p.z - 15) m.balas.splice(i, 1);
  }
  antes.x = p.x; antes.y = p.y; antes.z = p.z;
}
