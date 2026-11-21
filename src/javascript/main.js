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
import { crearEscenaMenu } from './render/escena_menu.js';
import * as ui from './ui/pantallas.js';
import { crearMapa } from './ui/mapa.js';
import { crearEscenaNovela } from './render/escena_novela.js';
import { crearNovela } from './ui/novela.js';
import { HISTORIA } from './datos/historia.js';

const lienzo = $('lienzo'), g = lienzo.getContext('2d');
const menu = crearEscenaMenu($('escenaMenu'));
const escenaNovela = crearEscenaNovela($('novelaLienzo'));
partida.usarNovela(crearNovela({ escena: escenaNovela, guion: HISTORIA }));
const vista = { W: 1, H: 1, HOR: 1 };   // tamaño en píxeles y horizonte (el foco se calcula por vista)

function ajustar() {
  const r = lienzo.getBoundingClientRect(), d = window.devicePixelRatio || 1;
  lienzo.width = Math.max(1, r.width * d); lienzo.height = Math.max(1, r.height * d);
  vista.W = lienzo.width; vista.H = lienzo.height; vista.HOR = vista.H * 0.36;
  menu.ajustar(); escenaNovela.ajustar();
}
window.addEventListener('resize', ajustar);

/* ---------- Entrada ---------- */
instalarTeclado({ modo: partida.modo, estado: partida.estado, mundos: partida.mundos, pausa: partida.alternarPausa });
instalarTactil(lienzo, $('btnPica'), { mundo: partida.mundoPrincipal });

/* ---------- Botones ---------- */
const clic = (id, f) => $(id).addEventListener('click', f);
const abrirEnciclopedia = () => {
  if (partida.estado() === 'juego') partida.alternarPausa();
  dibujarEnciclopedia(partida.descubiertos()); abrir('enciclopedia');
};
const abrirPuntajes = async () => { await partida.mostrarPuntajes(); abrir('panelPuntajes'); };
const abrirLogros = () => { dibujarLogros(partida.descubiertos()); abrir('panelLogros'); };

/* Menú de inicio: Nuevo juego → número de jugadores → nombres → vuelo */
let modoElegido = 'solo';
clic('btnNuevo', () => ui.submenu('menuModo'));
clic('btnContinuar', partida.continuar);
crearMapa(partida.elegirNivel);
clic('btnMapaAtras', partida.salirAlMenu);
clic('btnReintentar', partida.reintentar); clic('btnDerrotaMapa', partida.derrotaAlMapa); clic('btnTerminar', partida.terminarPartida);
clic('btnVolverModo', () => ui.submenu('menuPrincipal'));
clic('btnUn', () => { modoElegido = 'solo'; ui.pedirNombres(false); });
clic('btnDos', () => { modoElegido = 'duo'; ui.pedirNombres(true); });
clic('btnEmpezar', () => partida.nuevoJuego(modoElegido));
clic('btnVolverNombres', () => { ui.mostrar('menu'); ui.submenu('menuModo'); });
clic('btnAjustesMenu', () => abrir('panelAjustes'));
clic('btnSalir', () => { if (document.fullscreenElement) document.exitFullscreen(); window.close(); ui.mostrar('despedida'); });
clic('btnRegresar', () => { ui.mostrar('menu'); ui.submenu('menuPrincipal'); });
clic('btnPantallaCompleta', () => (document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen()));
$('nombres').addEventListener('keydown', e => { if (e.key === 'Enter' && e.target.localName === 'input') $('btnEmpezar').click(); });
clic('btnEncicloPausa', abrirEnciclopedia);
clic('btnVolar', partida.volar);
clic('btnReanudar', partida.alternarPausa); clic('btnPausa', partida.alternarPausa);
clic('btnSigue', partida.siguiente);
clic('btnReiniciar', () => partida.nuevoJuego(partida.modo()));
clic('btnPuntajesMenu', abrirPuntajes); clic('btnPuntajesPausa', abrirPuntajes);
clic('btnLogrosPausa', abrirLogros);
clic('btnAjustes', () => abrir('panelAjustes'));
clic('btnMenuPausa', partida.salirAlMenu);
iniciarAjustes();

/* ---------- Bucle ---------- */
let ultimo = 0;
function bucle(t) {
  const dt = Math.min(0.05, (t - ultimo) / 1000 || 0); ultimo = t;
  partida.tick(dt);
  const est = partida.estado();
  if (est === 'menu') menu.dibujar(t / 1000);
  else if (est === 'novela') escenaNovela.dibujar(t / 1000);
  else if (est === 'juego' && partida.modo() === 'duo') dibujarDuo(g, partida.mundos(), vista);
  else dibujarMundo(g, partida.mundoPrincipal(), vista);
  requestAnimationFrame(bucle);
}
ajustar(); partida.iniciar(); requestAnimationFrame(bucle);
