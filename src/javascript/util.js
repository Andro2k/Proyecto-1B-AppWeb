/* Utilidades puras, sin dependencias del juego. */
export const $ = id => document.getElementById(id);
export const rnd = (a, b) => a + Math.random() * (b - a);
export const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

/** Identificador único (para partidas y puntajes). */
export function uuid() {
  if (globalThis.crypto?.randomUUID) return crypto.randomUUID();
  return 'id-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 10);
}

/** Primer índice i de `lista` (ordenada por z ascendente) con lista[i].z >= z. Búsqueda binaria O(log n). */
export function primerIndice(lista, z) {
  let a = 0, b = lista.length;
  while (a < b) { const m = (a + b) >> 1; if (lista[m].z < z) a = m + 1; else b = m; }
  return a;
}
