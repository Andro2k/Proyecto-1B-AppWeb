/* Acceso a datos de puntajes: API Flask con respaldo en localStorage. */
const leerLocal = () => { try { const l = JSON.parse(localStorage.getItem('puntajes')); return Array.isArray(l) ? l : []; } catch { return []; } };

export async function cargarPuntajes() {
  let lista;
  try { const r = await fetch('/api/puntajes'); if (!r.ok) throw new Error(); lista = await r.json(); }
  catch { lista = leerLocal(); }
  return lista.sort((a, b) => b.puntos - a.puntos).slice(0, 10);
}

export async function enviarPuntaje(reg) {
  try {
    const r = await fetch('/api/puntajes', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(reg) });
    if (!r.ok) throw new Error();
  } catch { const l = leerLocal(); l.push(reg); localStorage.setItem('puntajes', JSON.stringify(l)); }
}
