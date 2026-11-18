/* Entrada por teclado. Traduce teclas a acciones de vuelo de cada jugador (tablas, no if/else). */
const A = (accion) => [0, accion];
const SOLO = {
  ArrowLeft: A('izq'), a: A('izq'), A: A('izq'), ArrowRight: A('der'), d: A('der'), D: A('der'),
  ArrowUp: A('aleteo'), w: A('aleteo'), W: A('aleteo'), ' ': A('aleteo'), ArrowDown: A('pica'), s: A('pica'), S: A('pica')
};
const DUO = {
  a: [0, 'izq'], A: [0, 'izq'], d: [0, 'der'], D: [0, 'der'], w: [0, 'aleteo'], W: [0, 'aleteo'], s: [0, 'pica'], S: [0, 'pica'],
  ArrowLeft: [1, 'izq'], ArrowRight: [1, 'der'], ArrowUp: [1, 'aleteo'], ' ': [1, 'aleteo'], ArrowDown: [1, 'pica']
};
const TECLAS = { solo: SOLO, duo: DUO };
const PAUSA = new Set(['Escape', 'p', 'P']);

/** api = { modo(), estado(), mundos(), pausa() } */
export function instalarTeclado(api) {
  const aplicar = (e, activa) => {
    const destino = TECLAS[api.modo()][e.key]; if (!destino) return;
    const m = api.mundos()[destino[0]]; if (!m) return;
    m.entrada[destino[1]] = activa;
    if (activa && api.estado() === 'juego') e.preventDefault();
  };
  window.addEventListener('keydown', e => { if (PAUSA.has(e.key)) api.pausa(); else aplicar(e, true); });
  window.addEventListener('keyup', e => aplicar(e, false));
}
