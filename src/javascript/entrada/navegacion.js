/* Navegación por foco en menús y diálogos. Es independiente de la fuente de entrada:
   teclado, ratón, pantalla táctil o botones del Arduino llaman a navegar('arriba' | 'abajo' | 'aceptar' | 'atras'). */
const PASO = { arriba: -1, izquierda: -1, abajo: 1, derecha: 1 };

const pantallaActiva = () => document.querySelector('dialog[open]') || document.querySelector('.pantalla:not([hidden])');
const enfocables = raiz => [...raiz.querySelectorAll('button, input')].filter(el => !el.disabled && el.offsetParent !== null);

/** Da foco al primer elemento útil de una pantalla (o al marcado con data-foco). */
export function focoInicial(raiz) {
  if (!raiz) return;
  const el = raiz.querySelector('[data-foco]:not([disabled])') || enfocables(raiz)[0];
  el?.focus({ preventScroll: true });
}

export function navegar(accion) {
  const raiz = pantallaActiva(); if (!raiz) return;
  if (accion === 'atras') {
    if (raiz.localName === 'dialog') raiz.close(); else raiz.querySelector('[data-atras]')?.click();
    return;
  }
  const items = enfocables(raiz); if (!items.length) return;
  const i = items.indexOf(document.activeElement);
  if (accion === 'aceptar') { (i >= 0 ? items[i] : items[0]).click(); return; }
  const paso = PASO[accion]; if (!paso) return;
  items[(i + paso + items.length) % items.length].focus();
}
