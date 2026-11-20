/* Controlador de la partida. Máquina de estados:
   menu → mapa → nivel (intro) → juego ⇄ pausa → pregunta | derrota → mapa … → fin.
   Orquesta la lógica pura (mundo/reglas), el progreso persistente y la presentación (ui/*). */
import { NIVELES } from '../datos/niveles.js';
import { PREGUNTAS } from '../datos/preguntas.js';
import { DATOS } from '../datos/datos.js';
import { crearMundo, crearEntrada } from './mundo.js';
import { actualizar } from './reglas.js';
import { descubrir } from './eventos.js';
import { cargarPuntajes, enviarPuntaje } from './puntajes.js';
import { crearRun, cargarProgreso, guardarProgreso, borrarProgreso, sumar } from './progreso.js';
import * as ui from '../ui/pantallas.js';
import { actualizarMapa, nodoSeleccionado } from '../ui/mapa.js';
import { dibujarPuntajes } from '../ui/dialogos.js';

const S = { est: 'menu', modo: 'solo', run: null, mundos: [], resultados: [], nivel: 0, base: [],
  guardado: false, guardando: null, respondida: false };
export const estado = () => S.est;
export const modo = () => S.modo;
export const mundos = () => S.mundos;
export const mundoPrincipal = () => S.mundos[0];
export const descubiertos = () => S.mundos[0].descubiertos;

const ev = {
  aviso: (t, x, f) => ui.aviso(t, x, f),
  dato: id => { const d = DATOS[id]; ui.aviso('¿Sabías que…? ' + d.titulo, d.texto, d.fuente); }
};

export function iniciar() { S.mundos = [crearMundo(0)]; ui.hud(S.mundos[0]); ui.restablecerMenu(!!cargarProgreso()); }

/* ---------- Inicio de partida y mapa ---------- */
export function nuevoJuego(nuevoModo = 'solo') {
  S.modo = nuevoModo; S.guardado = false; S.guardando = null; S.resultados = [];
  S.run = crearRun(nuevoModo, ui.leerNombres()); guardarProgreso(S.run);
  ui.configurarModo(S.modo, S.run.nombres);
  abrirMapa();
}

export function continuar() {
  const run = cargarProgreso(); if (!run) return;
  S.run = run; S.modo = run.modo; S.guardado = false; S.guardando = null; S.resultados = [];
  ui.configurarModo(S.modo, run.nombres);
  abrirMapa();
}

export function abrirMapa(seleccion) {
  S.est = 'mapa';
  actualizarMapa(S.run, seleccion ?? Math.min(S.run.desbloqueado - 1, NIVELES.length - 1));
  ui.mostrar('mapa'); nodoSeleccionado()?.focus();
}

/* ---------- Niveles ---------- */
export function elegirNivel(n) { if (S.est === 'mapa' && n < S.run.desbloqueado) iniciarNivel(n); }

function iniciarNivel(n) {
  const { run } = S, datos = new Set(run.datos);       // los datos descubiertos se comparten entre jugadores
  S.nivel = n;
  S.base = run.jug.map(j => ({ puntos: sumar(j.puntos, n), estrellas: sumar(j.estrellas, n) }));
  S.mundos = run.jug.map((_, i) => crearMundo(n, { nombre: run.nombres[i], descubiertos: datos, entrada: crearEntrada(),
    puntos: S.base[i].puntos, estrellas: S.base[i].estrellas,
    sexo: i === 0 ? 'macho' : 'hembra', compa: run.modo === 'solo' }));          // en dos jugadores, el jugador 2 es la hembra
  S.est = 'nivel'; ui.nivelIntro(n); ui.hud(S.mundos[0]);
  if (S.modo === 'duo') ui.marcadorDuo(S.mundos);
}
export function volar() { if (S.est !== 'nivel') return; S.est = 'juego'; ui.mostrar(null); }
export const reintentar = () => { if (S.est === 'derrota') iniciarNivel(S.nivel); };

/* ---------- Bucle ---------- */
export function tick(dt) {
  if (S.est === 'juego') {
    for (let i = 0; i < S.mundos.length && S.est === 'juego'; i++) {
      const m = S.mundos[i];
      if (m.terminado) continue;
      actualizar(m, dt, ev);
      if (m.fin) procesarFin(m, i);
    }
    if (S.modo === 'duo') ui.marcadorDuo(S.mundos); else ui.hud(S.mundos[0]);
  } else if (S.est === 'menu') S.mundos[0].tiempo += dt;
}

function procesarFin(m, i) {
  const fin = m.fin; m.fin = null;
  if (m.terminado) return;                                  // cada mundo se cierra una sola vez
  m.terminado = true; m.llego = fin === 'nido';
  if (m.llego) {
    m.puntos += 300; descubrir(m, 'nido', ev);
    if (m.nivel === 0) descubrir(m, 'recorrido', ev);
    if (m.nivel === 1) descubrir(m, 'reproduccion', ev);
  } else descubrir(m, 'longevidad', ev);
  if (S.modo === 'solo') { if (m.llego) preguntar(m); else derrota(); return; }
  if (S.mundos.every(x => x.terminado)) cerrarNivel();
}

/* ---------- Preguntas ---------- */
function preguntar(m) {
  S.est = 'pregunta'; S.respondida = false;
  ui.pregunta(PREGUNTAS[m.nivel], elegida => responder(m, elegida));
}
function responder(m, elegida) {
  if (S.est !== 'pregunta' || S.respondida) return;         // una sola respuesta por pregunta
  S.respondida = true;
  const q = PREGUNTAS[m.nivel], ok = elegida === q.ok, e = 1 + (m.p.vidas >= 2 ? 1 : 0) + (ok ? 1 : 0);
  m.estrellas += e; if (ok) m.puntos += 200;
  ui.respuesta(q, elegida, ok, e); ui.hud(m);
}
export function siguiente() {
  if (S.est !== 'pregunta' || !S.respondida) return;        // evita el doble clic en «Continuar»
  cerrarNivel();
}

/* ---------- Cierre de nivel, derrota y fin ---------- */
function cerrarNivel() {
  const { run } = S, n = S.nivel, llegaron = S.mundos.filter(m => m.llego);
  S.mundos.forEach((m, i) => {
    const j = run.jug[i];
    if (!m.llego) return;
    j.puntos[n] = Math.max(j.puntos[n], Math.round(m.puntos - S.base[i].puntos));
    j.estrellas[n] = Math.max(j.estrellas[n], m.estrellas - S.base[i].estrellas);
  });
  run.datos = [...S.mundos[0].descubiertos];
  if (!llegaron.length) { guardarProgreso(run); derrota(); return; }
  run.completados[n] = true; run.desbloqueado = Math.max(run.desbloqueado, Math.min(NIVELES.length, n + 2));
  guardarProgreso(run);
  if (n === NIVELES.length - 1) finalizarRun(true); else abrirMapa(n + 1);
}

function derrota() {
  S.est = 'derrota';
  ui.derrota(S.modo === 'duo' ? 'Ninguno llegó al nido. ¡Inténtenlo otra vez!' : 'Perdiste todas tus vidas. Aprende de lo que pasó e inténtalo otra vez.');
}
export function terminarPartida() { if (S.est === 'derrota') { S.run.datos = [...S.mundos[0].descubiertos]; finalizarRun(false); } }
export function derrotaAlMapa() { if (S.est === 'derrota') { S.run.datos = [...S.mundos[0].descubiertos]; guardarProgreso(S.run); abrirMapa(S.nivel); } }

function finalizarRun(gano) {
  if (S.est === 'fin') return;                              // idempotente
  S.est = 'fin';
  const { run } = S, extra = gano ? ['poblacion', 'simbolo'] : [];
  const datos = new Set([...run.datos, ...extra]);
  S.resultados = run.jug.map((j, i) => ({ id: `${run.id}-${i}`, nombre: run.nombres[i], puntos: sumar(j.puntos), estrellas: sumar(j.estrellas), datos: datos.size, gano }));
  borrarProgreso();
  const [a, b] = S.resultados, total = Object.keys(DATOS).length;
  ui.pantallaFin(S.modo === 'duo' ? {
    titulo: a.puntos === b.puntos ? '¡Empate!' : (a.puntos > b.puntos ? a.nombre : b.nombre) + ' gana la partida',
    subtitulo: a.nombre + ': ' + a.puntos + ' puntos · ' + b.nombre + ': ' + b.puntos + ' puntos',
    puntos: a.puntos + ' / ' + b.puntos, estrellas: a.estrellas + ' / ' + b.estrellas, datos: datos.size + '/' + total,
    mensaje: 'Cada jugador sumó sus propios puntos. ¡Jueguen otra partida para desempatar!', botonReiniciar: 'Volver a jugar'
  } : {
    titulo: gano ? '¡Los cóndores te lo agradecen!' : 'Fin del juego',
    subtitulo: a.nombre + ' consiguió ' + a.puntos + ' puntos.',
    puntos: a.puntos, estrellas: a.estrellas, datos: datos.size + '/' + total,
    mensaje: DATOS.poblacion.texto + ' Cada cóndor cuenta.', botonReiniciar: 'Jugar otra partida'
  });
  mostrarPuntajes(); guardarPuntaje();
}

/* ---------- Puntajes ---------- */
export async function mostrarPuntajes() { dibujarPuntajes(await cargarPuntajes()); }
/** Guarda los resultados de la partida UNA sola vez: llamadas repetidas devuelven la misma promesa. */
export function guardarPuntaje() {
  if (S.guardado) return S.guardando;
  S.guardado = true;
  S.guardando = (async () => {
    for (const r of S.resultados) if (r) await enviarPuntaje({ id: r.id, nombre: r.nombre, puntos: r.puntos });
    await mostrarPuntajes();
  })();
  return S.guardando;
}

/* ---------- Pausa y salida ---------- */
export function alternarPausa() {
  if (S.est === 'juego') { S.est = 'pausa'; ui.pausa(NIVELES[S.nivel].lugar + ' · nivel ' + (S.nivel + 1) + ' de ' + NIVELES.length); }
  else if (S.est === 'pausa') { S.est = 'juego'; ui.mostrar(null); }
}
export function salirAlMenu() {
  S.est = 'menu'; S.modo = 'solo';
  const e = S.mundos[0].entrada; e.izq = e.der = e.aleteo = e.pica = false; e.tx = null;
  S.mundos = [S.mundos[0]];
  ui.restablecerMenu(!!cargarProgreso());
}
