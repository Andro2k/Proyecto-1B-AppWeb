/* Creación del mundo de un nivel. Un "mundo" es la sesión completa de un jugador:
   su cóndor, las entidades del nivel, su cámara, puntos y entrada. Sin dependencias del DOM. */
import { NIVELES } from '../datos/niveles.js';
import { VIDAS } from '../config.js';
import { PAISAJES } from '../datos/paisajes.js';
import { rnd } from '../util.js';

/** Elige una clase según su peso: [[clase, peso], …]. */
function ponderado(tabla) {
  let r = Math.random() * tabla.reduce((a, [, w]) => a + w, 0);
  for (const [clase, w] of tabla) { if ((r -= w) < 0) return clase; }
  return tabla[0][0];
}

export const crearEntrada = () => ({ izq: false, der: false, aleteo: false, pica: false, tx: null });

/** `herencia`: lo que pasa de un nivel al siguiente (vidas, puntos, datos descubiertos, entrada...). */
export function crearMundo(nivel, { vidas = VIDAS, descubiertos = new Set(), nombre = '', entrada = crearEntrada(), puntos = 0, estrellas = 0, comidas = 0, limpio = 0, sexo = 'macho', compa = false } = {}) {
  const cfg = NIVELES[nivel];
  const p = { tipo: 'jugador', sexo, x: 0, y: 12, z: 0, vx: 0, vy: 0, energia: 100, vidas, invul: 0, cd: 0, aleteo: 0, suelo: false, enTermica: false };
  const ents = [], termicas = [];
  const reparto = (n, fn) => { const paso = (cfg.largo - 90) / n; for (let i = 0; i < n; i++) fn(50 + paso * (i + rnd(0.1, 0.9)), paso); };

  reparto(cfg.termicas, z => { const t = { tipo: 'termica', x: rnd(-9, 9), z, r: 3.4, len: 14 }; termicas.push(t); ents.push(t); });
  const fin = { tipo: 'termica', x: 0, z: cfg.largo - 50, r: 4, len: 45 };   // ayuda para subir al risco
  termicas.push(fin); ents.push(fin);
  reparto(cfg.carronas, z => ents.push({ tipo: 'carrona', x: rnd(-9, 9), z, veneno: false, v: Math.random() }));
  reparto(cfg.venenos, z => ents.push({ tipo: 'carrona', x: rnd(-9, 9), z: z + 11, veneno: true, v: Math.random() }));
  reparto(cfg.cables, z => ents.push({ tipo: 'cable', x: 0, z: z + 5, y: rnd(5, 12) }));
  // Paisaje: elementos a los lados del carril, lugares especiales y nubes
  const pais = PAISAJES[cfg.id], lado = () => (Math.random() < 0.5 ? -1 : 1), largo = cfg.largo + 40;
  const decor = (clase, extra = {}) => ents.push({ tipo: 'decor', clase, s: rnd(0.8, 1.35), v: Math.random(), dir: lado(), ...extra });
  for (let i = 0; i < Math.round(largo * 0.55); i++) decor(ponderado(pais.decor), { x: lado() * rnd(i < 70 ? 3 : 8, 52), z: rnd(0, largo) });
  for (const [clase, n] of pais.lugares) for (let i = 0; i < Math.round(n * cfg.largo / 500); i++) {
    const extra = { z: rnd(20, largo), x: lado() * rnd(clase === 'ave' ? 0 : 9, clase === 'laguna' ? 34 : 40) };
    if (clase === 'laguna') { extra.r = rnd(5, 10); extra.x = lado() * rnd(extra.r + 6, 40); }
    if (clase === 'ave') extra.y = rnd(7, 22);
    decor(clase, extra);
  }
  for (let i = 0; i < Math.round(pais.nubes * cfg.largo / 400); i++) {      // nubes en el cielo, a distintas alturas
    const r = rnd(7, 15);
    ents.push({ tipo: 'nube', x: rnd(-75, 75), y: rnd(26, 46), z: rnd(40, largo), r, v: Math.random(),
      puffs: Array.from({ length: 6 }, (_, k) => ({ dx: (k - 2.5) * r * 0.32 + rnd(-1, 1), dy: rnd(-0.18, 0.2) * r, r: r * rnd(0.3, 0.5) })) });
  }
  ents.push({ tipo: 'nido', x: 0, z: cfg.largo });
  ents.sort((a, b) => a.z - b.z);   // orden por z: permite buscar y dibujar por ventana

  // Compañera (cóndor hembra) que guía hacia las térmicas; solo en modo un jugador
  const acompanante = compa ? { tipo: 'compa', x: 3, y: 14, z: 18, vx: 0 } : null;
  return { nivel, cfg, p, ents, compa: acompanante, termicas, cam: { x: 0, y: 4, z: 0 }, tiempo: 0,
    puntos, estrellas, comidas, limpio, descubiertos, entrada, nombre, terminado: false, fin: null };
}

/** Datos que se conservan al pasar al nivel siguiente. */
export const herencia = m => ({ vidas: m.p.vidas, descubiertos: m.descubiertos, nombre: m.nombre, entrada: m.entrada,
  puntos: m.puntos, estrellas: m.estrellas, comidas: m.comidas, limpio: m.limpio });
