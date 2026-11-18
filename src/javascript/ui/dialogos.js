/* Diálogos modales: enciclopedia, logros, puntajes y ajustes. */
import { $ } from '../util.js';
import { DATOS } from '../datos/datos.js';

export const abrir = id => $(id).showModal();

export function dibujarEnciclopedia(descubiertos) {
  const ul = $('listaEnc'); ul.replaceChildren();
  for (const [id, d] of Object.entries(DATOS)) {
    const li = document.createElement('li');
    if (descubiertos.has(id)) {
      li.innerHTML = '<strong></strong> <span></span><small></small>';
      li.querySelector('strong').textContent = d.titulo;
      li.querySelector('span').textContent = d.texto;
      li.querySelector('small').textContent = 'Fuente: ' + d.fuente;
    } else { li.className = 'bloqueado'; li.textContent = '??? Sigue jugando para descubrir este dato.'; }
    ul.append(li);
  }
}

export function dibujarLogros(descubiertos) {
  const logros = [
    ['Explorador', 'Descubre datos sobre el cóndor.', descubiertos.size > 0],
    ['A las alturas', 'Encuentra una corriente térmica.', descubiertos.has('vuelo')],
    ['Buen vuelo', 'Llega al nido al final del recorrido.', descubiertos.has('nido')],
    ['Cóndor experto', 'Descubre todos los datos de la enciclopedia.', descubiertos.size === Object.keys(DATOS).length]
  ];
  const ul = $('listaLogros'); ul.replaceChildren();
  for (const [titulo, detalle, logrado] of logros) {
    const li = document.createElement('li'); li.className = logrado ? 'logro logrado' : 'logro';
    li.innerHTML = '<strong></strong><span></span><small></small>';
    li.querySelector('strong').textContent = (logrado ? '🏅 ' : '🔒 ') + titulo;
    li.querySelector('span').textContent = detalle;
    li.querySelector('small').textContent = logrado ? 'Conseguido' : 'Por conseguir'; ul.append(li);
  }
}

export function dibujarPuntajes(lista) {
  for (const id of ['listaPuntajes', 'puntajesGlobales']) {
    const ol = $(id); ol.replaceChildren();
    for (const r of lista) { const li = document.createElement('li'); li.textContent = r.nombre + ' — ' + r.puntos; ol.append(li); }
  }
}

/* Ajustes de accesibilidad (se recuerdan en este dispositivo). */
export function iniciarAjustes() {
  const aplicar = () => {
    document.body.classList.toggle('alto-contraste', $('ajusteContraste').checked);
    document.body.classList.toggle('texto-grande', $('ajusteTexto').checked);
    localStorage.setItem('ajustes-condor', JSON.stringify({ contraste: $('ajusteContraste').checked, texto: $('ajusteTexto').checked }));
  };
  $('ajusteContraste').addEventListener('change', aplicar); $('ajusteTexto').addEventListener('change', aplicar);
  try { const a = JSON.parse(localStorage.getItem('ajustes-condor') || '{}'); $('ajusteContraste').checked = !!a.contraste; $('ajusteTexto').checked = !!a.texto; aplicar(); } catch { /* sin ajustes guardados */ }
}
