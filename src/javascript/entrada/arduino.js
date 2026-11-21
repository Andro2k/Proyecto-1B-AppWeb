/* Adaptador Web Serial para el Arduino (Chrome/Edge, en https o localhost).
   Lee líneas del puerto serie, las interpreta (protocolo.js) y llama al despachador. No conoce las reglas del juego. */
import { interpretarLinea } from './protocolo.js';

export const soportaSerie = () => 'serial' in navigator;

/** despachador = { accion, pausa };  alEstado(texto, conectado) avisa a la interfaz. */
export function crearArduino(despachador, alEstado) {
  let puerto = null, lector = null;

  function procesar(linea) {
    const e = interpretarLinea(linea);
    if (!e) return;
    if (e.pausa) despachador.pausa(e.activa); else despachador.accion(e.jugador, e.tipo, e.activa);
  }

  async function leer() {
    const decodificador = new TextDecoderStream(), cierre = puerto.readable.pipeTo(decodificador.writable).catch(() => {});
    lector = decodificador.readable.getReader(); let resto = '';
    try {
      for (;;) {
        const { value, done } = await lector.read(); if (done) break;
        resto += value; const lineas = resto.split(/\r?\n/); resto = lineas.pop();
        lineas.forEach(procesar);
      }
    } catch { /* puerto desconectado */ }
    await cierre; desconectarEstado();
  }

  function desconectarEstado() { lector = null; puerto = null; alEstado('Arduino desconectado', false); }

  async function abrir(p) {
    puerto = p;
    await puerto.open({ baudRate: 115200 });
    alEstado('Arduino conectado', true);
    leer();
  }

  return {
    soportado: soportaSerie(),
    /** Pide al usuario elegir el puerto (necesita un clic). */
    async conectar() {
      if (!soportaSerie()) { alEstado('Este navegador no permite Arduino: usa Chrome o Edge', false); return; }
      try { await abrir(await navigator.serial.requestPort()); } catch (e) { alEstado(e?.name === 'NotFoundError' ? 'No se eligió ningún puerto' : 'No se pudo conectar', false); }
    },
    /** Reconecta solo con un puerto ya autorizado antes (útil en el quiosco). */
    async autoconectar() {
      if (!soportaSerie()) return;
      try { const [p] = await navigator.serial.getPorts(); if (p) await abrir(p); } catch { /* sin puerto previo */ }
    },
    async desconectar() { try { await lector?.cancel(); await puerto?.close(); } catch { /* ya cerrado */ } }
  };
}
