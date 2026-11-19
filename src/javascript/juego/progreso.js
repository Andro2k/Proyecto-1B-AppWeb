/* Progreso de la partida en curso (para «Continuar»). Persistencia en localStorage, sin tocar el DOM.
   run = { id, modo, nombres[], desbloqueado, completados[], jug: [{ puntos[], estrellas[] }], datos[] } */
import { uuid } from '../util.js';
import { NIVELES } from '../datos/niveles.js';

const CLAVE = 'condor-progreso-v1';
const N = NIVELES.length;

export function crearRun(modo, nombres) {
  const jugadores = modo === 'duo' ? 2 : 1;
  return { id: uuid(), modo, nombres: nombres.slice(0, jugadores), desbloqueado: 1, completados: Array(N).fill(false),
    jug: Array.from({ length: jugadores }, () => ({ puntos: Array(N).fill(0), estrellas: Array(N).fill(0) })), datos: [] };
}

const valido = r => r && typeof r.id === 'string' && (r.modo === 'solo' || r.modo === 'duo') && Number.isInteger(r.desbloqueado)
  && r.desbloqueado >= 1 && r.desbloqueado <= N && Array.isArray(r.jug) && r.jug.length === r.nombres?.length
  && r.jug.every(j => j.puntos?.length === N && j.estrellas?.length === N);

export function cargarProgreso() {
  try { const r = JSON.parse(localStorage.getItem(CLAVE)); return valido(r) ? r : null; } catch { return null; }
}
export const guardarProgreso = run => { try { localStorage.setItem(CLAVE, JSON.stringify(run)); } catch { /* sin almacenamiento */ } };
export const borrarProgreso = () => { try { localStorage.removeItem(CLAVE); } catch { /* sin almacenamiento */ } };

/** Puntos / estrellas acumulados de un jugador. `sin` excluye un nivel (para los puntos base al repetirlo). */
export const sumar = (lista, sin = -1) => lista.reduce((a, v, i) => a + (i === sin ? 0 : v), 0);
