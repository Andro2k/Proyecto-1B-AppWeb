/* Controlador de la partida: máquina de estados (menu → nivel → juego → pregunta → fin), turnos y modo dos jugadores.
   Orquesta la lógica pura (mundo/reglas) con la presentación (ui/*). */
import { NIVELES } from '../datos/niveles.js';
import { PREGUNTAS } from '../datos/preguntas.js';
import { DATOS } from '../datos/datos.js';
import { crearMundo, crearEntrada, herencia } from './mundo.js';
import { actualizar, descubrir } from './reglas.js';
import { cargarPuntajes, enviarPuntaje } from './puntajes.js';
import * as ui from '../ui/pantallas.js';
import { dibujarPuntajes } from '../ui/dialogos.js';
import { uuid } from '../util.js';

const S = { est: 'menu', modo: 'solo', nombres: ['Jugador 1', 'Jugador 2'], mundos: [], resultados: [],
  partidaId: '', guardado: false, guardando: null, respondida: false };
export const estado = () => S.est;
export const modo = () => S.modo;
export const mundos = () => S.mundos;
export const mundoPrincipal = () => S.mundos[0];

const ev = {
  aviso: (t, x, f) => ui.aviso(t, x, f),
  dato: id => { const d = DATOS[id]; ui.aviso('¿Sabías que…? ' + d.titulo, d.texto, d.fuente); }
};

export function iniciar() { S.mundos = [crearMundo(0)]; ui.hud(S.mundos[0]); ui.mostrar('menu'); }

/* ---------- Inicio de partida y niveles ---------- */
export function nuevoJuego(nuevoModo = 'solo') {
  S.modo = nuevoModo; S.nombres = ui.leerNombres(); S.resultados = [];
  S.partidaId = uuid(); S.guardado = false; S.guardando = null;   // cada partida se guarda una sola vez
  ui.configurarModo(S.modo, S.nombres);
  if (S.modo === 'solo') { iniciarNivel(0, { nombre: S.nombres[0] }); return; }
  S.mundos = [0, 1].map(i => crearMundo(0, { nombre: S.nombres[i], entrada: crearEntrada() }));
  S.est = 'juego'; ui.mostrar(null); ui.marcadorDuo(S.mundos);
}

function iniciarNivel(n, previo) {
  S.mundos = [crearMundo(n, previo)];
  S.est = 'nivel'; ui.nivelIntro(n); ui.hud(S.mundos[0]);
}
export function volar() { if (S.est !== 'nivel') return; S.est = 'juego'; ui.mostrar(null); }

/* ---------- Bucle ---------- */
export function tick(dt) {
  if (S.est === 'juego') {
    for (let i = 0; i < S.mundos.length; i++) {
      const m = S.mundos[i];
      if (m.terminado) continue;
      actualizar(m, dt, ev);
      procesarFin(m, i);
      if (S.est !== 'juego') break;
    }
    if (S.modo === 'duo') ui.marcadorDuo(S.mundos); else ui.hud(S.mundos[0]);
  } else if (S.est === 'menu') S.mundos[0].tiempo += dt;
}

function procesarFin(m, i) {
  if (!m.fin) return;
  const fin = m.fin; m.fin = null;
  if (fin === 'nido') terminarNivel(m, i); else finJuego(m, i, false);
}

/* ---------- Fin de nivel y preguntas ---------- */
function terminarNivel(m, i) {
  m.puntos += 300; descubrir(m, 'nido', ev);
  if (m.nivel === 0) descubrir(m, 'recorrido', ev);
  if (m.nivel === 1) descubrir(m, 'reproduccion', ev);
  if (S.modo === 'duo') {
    if (m.nivel === NIVELES.length - 1) finJuego(m, i, true);
    else S.mundos[i] = crearMundo(m.nivel + 1, herencia(m));
    return;
  }
  S.est = 'pregunta'; S.respondida = false;
  ui.pregunta(PREGUNTAS[m.nivel], responder);
}

function responder(elegida) {
  if (S.est !== 'pregunta' || S.respondida) return;   // una sola respuesta por pregunta
  S.respondida = true;
  const m = S.mundos[0], q = PREGUNTAS[m.nivel], ok = elegida === q.ok;
  const e = 1 + (m.p.vidas >= 2 ? 1 : 0) + (ok ? 1 : 0);
  m.estrellas += e; if (ok) m.puntos += 200;
  ui.respuesta(q, elegida, ok, e); ui.hud(m);
}

export function siguiente() {
  if (S.est !== 'pregunta' || !S.respondida) return;   // evita el doble clic en «Continuar»
  const m = S.mundos[0];
  if (m.nivel < NIVELES.length - 1) iniciarNivel(m.nivel + 1, herencia(m)); else finJuego(m, 0, true);
}

/* ---------- Fin de la partida y puntajes ---------- */
function finJuego(m, i, gano) {
  if (m.terminado) return;   // idempotente: un mundo se cierra una sola vez
  m.terminado = true;
  if (S.modo === 'duo') {
    S.resultados[i] = { id: `${S.partidaId}-${i}`, nombre: S.nombres[i], puntos: Math.round(m.puntos), estrellas: m.estrellas, datos: m.descubiertos.size, gano };
    if (S.mundos.every(x => x.terminado)) finalizarDuo();
    return;
  }
  S.est = 'fin';
  if (gano) { descubrir(m, 'poblacion', ev); descubrir(m, 'simbolo', ev); } else descubrir(m, 'longevidad', ev);
  const r = { id: `${S.partidaId}-0`, nombre: S.nombres[0], puntos: Math.round(m.puntos), estrellas: m.estrellas, datos: m.descubiertos.size, gano };
  S.resultados[0] = r;
  ui.pantallaFin({
    titulo: gano ? '¡Los cóndores te lo agradecen!' : 'Fin del juego',
    subtitulo: r.nombre + ' consiguió ' + r.puntos + ' puntos.',
    puntos: Math.round(m.puntos), estrellas: m.estrellas, datos: m.descubiertos.size + '/' + Object.keys(DATOS).length,
    mensaje: DATOS.poblacion.texto + ' Cada cóndor cuenta.', botonReiniciar: 'Jugar otra partida'
  });
  mostrarPuntajes(); guardarPuntaje();
}

function finalizarDuo() {
  S.est = 'fin'; const [a, b] = S.resultados;
  ui.pantallaFin({
    titulo: a.puntos === b.puntos ? '¡Empate!' : (a.puntos > b.puntos ? a.nombre : b.nombre) + ' gana la partida',
    subtitulo: a.nombre + ': ' + a.puntos + ' puntos · ' + b.nombre + ': ' + b.puntos + ' puntos',
    puntos: a.puntos + ' / ' + b.puntos, estrellas: a.estrellas + ' / ' + b.estrellas, datos: a.datos + ' / ' + b.datos,
    mensaje: 'Cada jugador completó su propio recorrido. ¡Jueguen otra partida para desempatar!', botonReiniciar: 'Volver a jugar'
  });
  guardarPuntaje();
}

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
  if (S.est === 'juego') { S.est = 'pausa'; ui.pausa('Turno de ' + S.nombres[0]); }
  else if (S.est === 'pausa') { S.est = 'juego'; ui.mostrar(null); }
}
export function salirAlMenu() {
  S.est = 'menu'; S.modo = 'solo';
  const e = S.mundos[0].entrada; e.izq = e.der = e.aleteo = e.pica = false; e.tx = null;
  ui.restablecerMenu();
}
