/* Motor de la novela visual: texto con efecto de escritura, nombre del personaje, elecciones y moraleja.
   Solo presentación: el guion (datos/historia.js) y la escena (render/escena_novela.js) se inyectan. */
import { $ } from '../util.js';
import { NOMBRES } from '../render/retratos.js';
import { focoInicial } from '../entrada/navegacion.js';

const MS_POR_LETRA = 28;
const sinMovimiento = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

/** { escena, guion } → { iniciar(alTerminar) } */
export function crearNovela({ escena, guion }) {
  let cola = [], i = 0, escribiendo = false, timer = 0, alTerminar = () => {}, vista = {}, terminada = true;

  function escribir(texto) {
    clearInterval(timer); $('vnTexto').textContent = ''; $('vnFlecha').hidden = true;
    if (sinMovimiento()) { $('vnTexto').textContent = texto; escribiendo = false; $('vnFlecha').hidden = false; return; }
    escribiendo = true; let n = 0;
    timer = setInterval(() => {
      n++; $('vnTexto').textContent = texto.slice(0, n);
      if (n >= texto.length) { clearInterval(timer); escribiendo = false; $('vnFlecha').hidden = false; if (cola[i]?.eleccion) mostrarOpciones(cola[i].eleccion); }
    }, MS_POR_LETRA);
  }
  const completar = () => {
    clearInterval(timer); const l = cola[i]; $('vnTexto').textContent = l.eleccion ? l.eleccion.pregunta : l.texto;
    escribiendo = false; $('vnFlecha').hidden = false; if (l.eleccion) mostrarOpciones(l.eleccion);
  };

  function mostrarOpciones(eleccion) {
    const cont = $('vnOpciones'); cont.replaceChildren(); cont.hidden = false; $('vnCaja').disabled = true;
    eleccion.opciones.forEach(o => {
      const b = document.createElement('button'); b.type = 'button'; b.textContent = o.texto;
      b.addEventListener('click', () => { cont.hidden = true; $('vnCaja').disabled = false; cola.splice(i + 1, 0, ...o.respuesta); avanzar(); });
      cont.append(b);
    });
    focoInicial(cont);
  }

  function mostrarLinea() {
    const l = cola[i];
    if (!l) { terminar(); return; }
    vista = { ...vista, ...l, habla: l.habla };                      // las líneas heredan fondo y personajes de la anterior
    escena.mostrar(vista);
    $('vnOpciones').hidden = true;
    if (l.moraleja) {
      $('vnCaja').hidden = true; $('vnMoralejaTexto').textContent = l.moraleja; $('vnMoraleja').hidden = false; focoInicial($('vnMoraleja')); return;
    }
    $('vnCaja').hidden = false;
    const quien = l.quien === 'Narrador' || !l.quien ? '' : l.quien;
    $('vnNombre').textContent = quien; $('vnNombre').hidden = !quien; $('vnCaja').classList.toggle('narrador', !quien);
    escribir(l.eleccion ? l.eleccion.pregunta : l.texto);
    focoInicial($('novela'));
  }

  function avanzar() {
    if (terminada) return;
    if (escribiendo) { completar(); return; }
    if (cola[i]?.eleccion && !$('vnOpciones').hidden) return;       // hay que elegir
    i++; mostrarLinea();
  }

  function terminar() {
    if (terminada) return; terminada = true; clearInterval(timer);
    $('vnMoraleja').hidden = true; $('vnOpciones').hidden = true; alTerminar();
  }

  $('vnCaja').addEventListener('click', avanzar);
  $('novelaLienzo').addEventListener('click', avanzar);
  $('btnSaltarNovela').addEventListener('click', terminar);
  $('btnVnFin').addEventListener('click', terminar);

  return {
    iniciar(fin) {
      alTerminar = fin; cola = [...guion]; i = 0; vista = {}; terminada = false;
      escena.ajustar();                                           // la pantalla estaba oculta: hay que medir el canvas ahora
      $('vnMoraleja').hidden = true; $('vnCaja').disabled = false; mostrarLinea();
    },
    nombre: id => NOMBRES[id]
  };
}
