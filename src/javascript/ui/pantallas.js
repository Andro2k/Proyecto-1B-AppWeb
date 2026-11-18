/* Presentación: pantallas, HUD y avisos. Solo toca el DOM; no contiene reglas del juego. */
import { $, clamp } from '../util.js';
import { DATOS } from '../datos/datos.js';
import { NIVELES } from '../datos/niveles.js';

const PANTALLAS = ['menu', 'nivelIntro', 'pausa', 'pregunta', 'fin'];
export const mostrar = id => { for (const s of PANTALLAS) $(s).hidden = s !== id; };

let avisoT = 0;
export function aviso(titulo, texto, fuente = '') {
  $('avisoTitulo').textContent = titulo; $('avisoTexto').textContent = texto;
  $('avisoFuente').textContent = fuente ? 'Fuente: ' + fuente : '';
  $('aviso').hidden = false; clearTimeout(avisoT);
  avisoT = setTimeout(() => { $('aviso').hidden = true; }, 8000);
}

export function hud(m) {
  const { p, cfg } = m;
  $('barEnergia').style.width = p.energia + '%';
  $('barEnergia').classList.toggle('baja', p.energia < 25);
  $('vidas').textContent = '♥'.repeat(Math.max(0, p.vidas)) + '♡'.repeat(Math.max(0, 3 - p.vidas));
  $('puntos').textContent = Math.round(m.puntos);
  $('nivel').textContent = (m.nivel + 1) + '/' + NIVELES.length;
  $('altitud').textContent = Math.round(3800 + p.y * 40) + ' m';
  $('datos').textContent = m.descubiertos.size + '/' + Object.keys(DATOS).length;
  $('barProgreso').style.width = clamp(p.z / cfg.largo * 100, 0, 100) + '%';
}

export function nivelIntro(n) {
  $('nivelNumero').textContent = 'Nivel ' + (n + 1) + ' de ' + NIVELES.length;
  $('tNivel').textContent = NIVELES[n].nombre;
  $('nivelConsejo').textContent = NIVELES[n].consejo;
  mostrar('nivelIntro');
}

export function pregunta(q, alResponder) {
  const c = $('opciones');
  $('pregTexto').textContent = q.q; c.replaceChildren();
  $('explicacion').hidden = true; $('btnSigue').hidden = true;
  q.ops.forEach((t, i) => {
    const b = document.createElement('button'); b.type = 'button'; b.textContent = t;
    b.addEventListener('click', () => alResponder(i)); c.append(b);
  });
  mostrar('pregunta');
}

export function respuesta(q, elegida, ok, estrellas) {
  [...$('opciones').children].forEach((b, j) => { b.disabled = true; b.className = j === q.ok ? 'ok' : (j === elegida ? 'mal' : ''); });
  $('explicacion').textContent = (ok ? '¡Correcto! ' : 'No exactamente. ') + q.expl + ' · ' + '★'.repeat(estrellas) + '☆'.repeat(3 - estrellas);
  $('explicacion').hidden = false; $('btnSigue').hidden = false;
}

export function pausa(texto) { $('turnoPausa').textContent = texto; mostrar('pausa'); }

export function leerNombres() { return [$('nombreJ1').value.trim() || 'Jugador 1', $('nombreJ2').value.trim() || 'Jugador 2']; }

export function configurarModo(modo, nombres) {
  $('campoJugador2').hidden = modo === 'solo';
  $('btnSolo').classList.toggle('primario', modo === 'solo'); $('btnDuo').classList.toggle('primario', modo === 'duo');
  $('btnSolo').setAttribute('aria-pressed', String(modo === 'solo')); $('btnDuo').setAttribute('aria-pressed', String(modo === 'duo'));
  $('duoHud').hidden = modo !== 'duo'; $('btnPica').hidden = modo === 'duo';
  $('juego').classList.toggle('modo-duo', modo === 'duo');
  $('duoNombre1').textContent = nombres[0]; $('duoNombre2').textContent = nombres[1];
}

export function marcadorDuo(mundos) {
  $('duoPuntos1').textContent = Math.round(mundos[0]?.puntos || 0) + ' pts';
  $('duoPuntos2').textContent = Math.round(mundos[1]?.puntos || 0) + ' pts';
}

export function pantallaFin({ titulo, subtitulo, puntos, estrellas, datos, mensaje, botonReiniciar }) {
  $('finTitulo').textContent = titulo; $('finSubtitulo').textContent = subtitulo;
  $('finPuntos').textContent = puntos; $('finEstrellas').textContent = estrellas; $('finDatos').textContent = datos;
  $('finMensaje').textContent = mensaje; $('btnReiniciar').textContent = botonReiniciar;
  mostrar('fin');
}

export function restablecerMenu() {
  $('juego').classList.remove('modo-duo'); $('duoHud').hidden = true; $('campoJugador2').hidden = false; $('btnPica').hidden = false;
  mostrar('menu');
}
