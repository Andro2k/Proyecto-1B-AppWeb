// Pruebas del protocolo del Arduino. Ejecutar: node --test tests/
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { interpretarLinea } from '../src/javascript/entrada/protocolo.js';

test('botones de jugador', () => {
  assert.deepEqual(interpretarLinea('1A1'), { jugador: 0, tipo: 'aleteo', activa: true });
  assert.deepEqual(interpretarLinea('2I0'), { jugador: 1, tipo: 'izq', activa: false });
  assert.deepEqual(interpretarLinea('1D1'), { jugador: 0, tipo: 'der', activa: true });
  assert.deepEqual(interpretarLinea('2P1'), { jugador: 1, tipo: 'pica', activa: true });
});
test('pausa', () => {
  assert.deepEqual(interpretarLinea('S1'), { pausa: true, activa: true });
  assert.deepEqual(interpretarLinea('S0'), { pausa: true, activa: false });
});
test('tolera espacios, minúsculas y fin de línea', () => {
  assert.deepEqual(interpretarLinea(' 1a1\r\n'), { jugador: 0, tipo: 'aleteo', activa: true });
});
test('ignora líneas inválidas (ruido del puerto)', () => {
  for (const l of ['', 'hola', '3A1', '1X1', '1A2', '1A', 'S', null, undefined]) assert.equal(interpretarLinea(l), null);
});
