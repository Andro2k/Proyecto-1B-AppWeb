'use strict';
/* Guardianes del Cóndor · punto de entrada: conecta módulos, eventos y bucle principal.
   El mundo tiene x (lado), y (altura) y z (avance); se proyecta al canvas 2D en perspectiva. */
import { $ } from './util.js';
import { DATOS } from './datos/datos.js';
import * as partida from './juego/partida.js';
import { dibujarMundo, dibujarDuo } from './render/escena.js';
import { instalarTeclado } from './entrada/teclado.js';
import { instalarTactil } from './entrada/tactil.js';
import { abrir, dibujarEnciclopedia, dibujarLogros, iniciarAjustes } from './ui/dialogos.js';

const lienzo = $('lienzo'), g = lienzo.getContext('2d');
const vista = { W: 1, H: 1, F: 1, HOR: 1 };   // tamaño en píxeles, foco y horizonte

function ajustar() {
  const r = lienzo.getBoundingClientRect(), d = window.devicePixelRatio || 1;
  lienzo.width = Math.max(1, r.width * d); lienzo.height = Math.max(1, r.height * d);
  vista.W = lienzo.width; vista.H = lienzo.height; vista.F = vista.H * 0.9; vista.HOR = vista.H * 0.36;
}
window.addEventListener('resize', ajustar);

/* ---------- Entrada ---------- */
instalarTeclado({ modo: partida.modo, estado: partida.estado, mundos: partida.mundos, pausa: partida.alternarPausa });
instalarTactil(lienzo, $('btnPica'), { mundo: partida.mundoPrincipal });

/* ---------- Botones ---------- */
const clic = (id, f) => $(id).addEventListener('click', f);
const abrirEnciclopedia = () => {
  if (partida.estado() === 'juego') partida.alternarPausa();
  dibujarEnciclopedia(partida.mundoPrincipal().descubiertos); abrir('enciclopedia');
};
const abrirPuntajes = async () => { await partida.mostrarPuntajes(); abrir('panelPuntajes'); };
const abrirLogros = () => { dibujarLogros(partida.mundoPrincipal().descubiertos); abrir('panelLogros'); };

clic('btnSolo', () => partida.nuevoJuego('solo')); clic('btnDuo', () => partida.nuevoJuego('duo'));
clic('btnEnciclo', abrirEnciclopedia); clic('btnEncicloPausa', abrirEnciclopedia);
clic('btnVolar', partida.volar);
clic('btnReanudar', partida.alternarPausa); clic('btnPausa', partida.alternarPausa);
clic('btnSigue', partida.siguiente);
clic('btnGuardar', partida.guardarPuntaje);
clic('btnReiniciar', () => partida.nuevoJuego(partida.modo()));
clic('btnPuntajesMenu', abrirPuntajes); clic('btnPuntajesPausa', abrirPuntajes);
clic('btnLogrosMenu', abrirLogros); clic('btnLogrosPausa', abrirLogros);
clic('btnAjustes', () => abrir('panelAjustes'));
clic('btnMenuPausa', partida.salirAlMenu);
iniciarAjustes();

/* ---------- Bucle ---------- */
let ultimo = 0;
function bucle(t) {
  const dt = Math.min(0.05, (t - ultimo) / 1000 || 0); ultimo = t;
  partida.tick(dt);
  if (partida.estado() === 'juego' && partida.modo() === 'duo') dibujarDuo(g, partida.mundos(), vista);
  else dibujarMundo(g, partida.mundoPrincipal(), vista);
  requestAnimationFrame(bucle);
}
ajustar(); partida.iniciar(); requestAnimationFrame(bucle);
