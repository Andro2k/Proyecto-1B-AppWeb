/* Creación del mundo de un nivel. Un "mundo" es la sesión completa de un jugador:
   su cóndor, las entidades del nivel, su cámara, puntos y entrada. Sin dependencias del DOM. */
import { NIVELES } from '../datos/niveles.js';
import { VIDAS } from '../config.js';
import { rnd } from '../util.js';

export const crearEntrada = () => ({ izq: false, der: false, aleteo: false, pica: false, tx: null });

/** `herencia`: lo que pasa de un nivel al siguiente (vidas, puntos, datos descubiertos, entrada...). */
export function crearMundo(nivel, { vidas = VIDAS, descubiertos = new Set(), nombre = '', entrada = crearEntrada(), puntos = 0, estrellas = 0, comidas = 0, limpio = 0 } = {}) {
  const cfg = NIVELES[nivel];
  const p = { tipo: 'jugador', x: 0, y: 12, z: 0, vx: 0, vy: 0, energia: 100, vidas, invul: 0, cd: 0, aleteo: 0, suelo: false, enTermica: false };
  const ents = [], termicas = [];
  const reparto = (n, fn) => { const paso = (cfg.largo - 90) / n; for (let i = 0; i < n; i++) fn(50 + paso * (i + rnd(0.1, 0.9)), paso); };

  reparto(cfg.termicas, z => { const t = { tipo: 'termica', x: rnd(-9, 9), z, r: 3.4, len: 14 }; termicas.push(t); ents.push(t); });
  const fin = { tipo: 'termica', x: 0, z: cfg.largo - 50, r: 4, len: 45 };   // ayuda para subir al risco
  termicas.push(fin); ents.push(fin);
  reparto(cfg.carronas, z => ents.push({ tipo: 'carrona', x: rnd(-9, 9), z, veneno: false }));
  reparto(cfg.venenos, z => ents.push({ tipo: 'carrona', x: rnd(-9, 9), z: z + 11, veneno: true }));
  reparto(cfg.cables, z => ents.push({ tipo: 'cable', x: 0, z: z + 5, y: rnd(5, 12) }));
  for (let i = 0; i < 260; i++) {
    const lado = Math.random() < 0.5 ? -1 : 1;
    ents.push({ tipo: 'decor', x: lado * rnd(i < 60 ? 3 : 8, 48), z: rnd(0, cfg.largo + 40) });
  }
  ents.push({ tipo: 'nido', x: 0, z: cfg.largo });
  ents.sort((a, b) => a.z - b.z);   // orden por z: permite buscar y dibujar por ventana

  return { nivel, cfg, p, ents, termicas, cam: { x: 0, y: 4, z: 0 }, tiempo: 0,
    puntos, estrellas, comidas, limpio, descubiertos, entrada, nombre, terminado: false, fin: null };
}

/** Datos que se conservan al pasar al nivel siguiente. */
export const herencia = m => ({ vidas: m.p.vidas, descubiertos: m.descubiertos, nombre: m.nombre, entrada: m.entrada,
  puntos: m.puntos, estrellas: m.estrellas, comidas: m.comidas, limpio: m.limpio });
