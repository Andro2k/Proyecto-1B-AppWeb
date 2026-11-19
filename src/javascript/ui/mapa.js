/* Mapa de Ecuador: cada nivel es un lugar real de los Andes; se desbloquean de norte a sur.
   Geografía en SVG (datos/geografia.js); los lugares son botones HTML encima, para que el texto sea legible. */
import { $ } from '../util.js';
import { NIVELES } from '../datos/niveles.js';
import { CONTORNO, ISLAS_COSTA, ISLAS, VECINOS } from '../datos/geografia.js';
import { sumar } from '../juego/progreso.js';

const K = 80, LON0 = -84, LON1 = -74.6, LAT0 = -5.5, LAT1 = 2.0;      // px por grado y ventana geográfica
const ANCHO = (LON1 - LON0) * K, ALTO = (LAT1 - LAT0) * K;
const pt = (lon, lat) => [(lon - LON0) * K, (LAT1 - lat) * K];
const ruta = (poly, dx = 0, dy = 0) => 'M' + poly.map(([lo, la]) => { const [x, y] = pt(lo, la); return (x + dx).toFixed(1) + ' ' + (y + dy).toFixed(1); }).join('L') + 'Z';
const PELIGROS = { cables: 'Cables', venenos: 'Veneno', cazadores: 'Cazadores', tormentas: 'Tormentas' };
const LADO = ['der', 'der', 'izq', 'der', 'izq', 'der'];                // lado de la etiqueta para que no se solapen

let run = null, seleccion = 0, alElegir = () => {};

function svgGeografia() {
  const lados = [];
  for (const k of Object.keys(VECINOS)) for (const p of VECINOS[k]) lados.push(`<path class="vecino" d="${ruta(p)}"/>`);
  const pts = NIVELES.map(n => pt(n.pos[1], n.pos[0]));
  const cordillera = pts.slice(0, -1).map((a, i) => { const b = pts[i + 1]; return `M${a[0].toFixed(1)} ${a[1].toFixed(1)}L${b[0].toFixed(1)} ${b[1].toFixed(1)}`; });
  // volcanes decorativos a lo largo de la cordillera
  const picos = [];
  for (let i = 0; i < pts.length - 1; i++) for (let j = 1; j <= 3; j++) {
    const t = j / 4, x = pts[i][0] + (pts[i + 1][0] - pts[i][0]) * t + (j % 2 ? -34 : 30), y = pts[i][1] + (pts[i + 1][1] - pts[i][1]) * t;
    picos.push(`<path class="pico" d="M${x - 9} ${y + 7}L${x} ${y - 9}L${x + 9} ${y + 7}Z"/><path class="nieve" d="M${x - 3.5} ${y - 2}L${x} ${y - 9}L${x + 3.5} ${y - 2}Z"/>`);
  }
  const gx = 18, gy = 18;       // recuadro de Galápagos (mismo tamaño de grado)
  const gal = ISLAS.map(p => `<path class="tierra" d="${ruta(p.map(([lo, la]) => [lo + 91.9 + LON0, la + 1.5 - 0.0]), gx, gy - 0)}"/>`).join('');
  return `<svg viewBox="0 0 ${ANCHO} ${ALTO}" aria-hidden="true">
    <rect width="${ANCHO}" height="${ALTO}" class="oceano"/>
    ${lados.join('')}
    <g class="tierra-g">${ISLAS_COSTA.map(p => `<path class="tierra" d="${ruta(p)}"/>`).join('')}<path class="tierra" d="${ruta(CONTORNO)}"/></g>
    ${picos.join('')}
    <g id="mapaRuta">${cordillera.map(d => `<path class="tramo" d="${d}"/>`).join('')}</g>
    <rect class="recuadro" x="${gx - 8}" y="${gy - 8}" width="236" height="170"/>${gal}
  </svg>`;
}

/** Construye el mapa una sola vez (la geografía no cambia). */
export function crearMapa(elegir) {
  alElegir = elegir;
  const lienzo = $('mapaLienzo');
  lienzo.style.aspectRatio = `${ANCHO} / ${ALTO}`;
  lienzo.innerHTML = svgGeografia() + `<span class="mapa-rotulo" style="left:3%;top:50%">Océano Pacífico</span><span class="mapa-rotulo" style="left:3%;top:31%">Islas Galápagos</span>
    <span class="mapa-rotulo" style="left:62%;top:2%">Colombia</span><span class="mapa-rotulo" style="left:70%;top:86%">Perú</span>`;
  const ol = document.createElement('div'); ol.className = 'mapa-nodos'; ol.setAttribute('role', 'group'); ol.setAttribute('aria-label', 'Niveles');
  NIVELES.forEach((n, i) => {
    const [x, y] = pt(n.pos[1], n.pos[0]), b = document.createElement('button');
    b.type = 'button'; b.className = 'nodo ' + LADO[i]; b.dataset.n = i;
    b.style.left = (x / ANCHO * 100) + '%'; b.style.top = (y / ALTO * 100) + '%';
    b.innerHTML = `<b>${i + 1}</b><span class="nodo-nombre">${n.lugar}</span>`;
    b.addEventListener('click', () => { seleccionar(i); alElegir(i); });
    b.addEventListener('focus', () => seleccionar(i)); b.addEventListener('mouseenter', () => seleccionar(i));
    ol.append(b);
  });
  lienzo.append(ol);
}

/** Muestra el estado del progreso en el mapa. */
export function actualizarMapa(r, elegido) {
  run = r; seleccion = elegido;
  document.querySelectorAll('.nodo').forEach((b, i) => {
    const libre = i < run.desbloqueado, hecho = run.completados[i];
    b.className = b.className.replace(/\b(libre|bloqueado|completo|siguiente)\b/g, '').trim() + ' ' + (hecho ? 'completo' : libre ? 'libre' : 'bloqueado') + (libre && !hecho && i === run.desbloqueado - 1 ? ' siguiente' : '');
    b.setAttribute('aria-label', `Nivel ${i + 1}: ${NIVELES[i].lugar}. ${hecho ? 'Completado' : libre ? 'Disponible' : 'Bloqueado'}`);
  });
  document.querySelectorAll('#mapaRuta .tramo').forEach((t, i) => t.classList.toggle('abierto', i + 1 < run.desbloqueado));
  seleccionar(elegido);
}

export const nodoSeleccionado = () => document.querySelector(`.nodo[data-n="${seleccion}"]`);

function seleccionar(i) {
  if (!run) return;
  seleccion = i; const n = NIVELES[i], libre = i < run.desbloqueado;
  $('mapaProvincia').textContent = n.provincia;
  $('mapaNombre').textContent = (i + 1) + '. ' + n.lugar;
  $('mapaTexto').textContent = libre ? n.descripcion : 'Bloqueado: completa antes «' + NIVELES[i - 1].lugar + '».';
  const pel = Object.entries(PELIGROS).filter(([k]) => n[k] > 0).map(([, t]) => `<li>${t}</li>`).join('');
  $('mapaPeligros').innerHTML = libre ? pel : '';
  $('mapaRecord').replaceChildren();
  if (libre) run.jug.forEach((j, k) => {
    const p = document.createElement('p'), est = j.estrellas[i];
    p.textContent = (run.nombres.length > 1 ? run.nombres[k] + ': ' : 'Récord: ') + (run.completados[i] ? j.puntos[i] + ' pts · ' + '★'.repeat(Math.min(3, est)) + '☆'.repeat(Math.max(0, 3 - est)) : 'sin completar');
    $('mapaRecord').append(p);
  });
  const total = run.jug.map(j => sumar(j.puntos));
  $('mapaTotal').textContent = run.nombres.length > 1 ? run.nombres.map((nm, k) => nm + ' ' + total[k]).join(' · ') : total[0] + ' puntos';
}
