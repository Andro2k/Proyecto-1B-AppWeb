/* Acceso a datos de puntajes: API Flask con respaldo en localStorage.
   Cada registro lleva un `id` único por partida y jugador: el servidor ignora los repetidos. */
const leerLocal = () => { try { const l = JSON.parse(localStorage.getItem('puntajes')); return Array.isArray(l) ? l : []; } catch { return []; } };

function guardarLocal(reg) {
  const lista = leerLocal();
  if (reg.id && lista.some(r => r.id === reg.id)) return;   // ya estaba guardado
  lista.push(reg); localStorage.setItem('puntajes', JSON.stringify(lista));
}

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
  } catch { guardarLocal(reg); }
}
