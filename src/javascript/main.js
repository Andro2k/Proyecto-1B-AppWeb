'use strict';
/* Guardianes del Cóndor · prototipo semi 3D (pseudo-3D con proyección en perspectiva).
   El mundo tiene x (lado), y (altura) y z (avance); se proyecta al canvas 2D. */

const $ = id => document.getElementById(id);
const lienzo = $('lienzo');
const g = lienzo.getContext('2d');
const rnd = (a, b) => a + Math.random() * (b - a);
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

const ANCHO = 14, TECHO = 30, NIDO_ALTO = 8, CAM_ATRAS = 9;
let W = 1, H = 1, F = 1, HOR = 1;           // tamaño, foco y horizonte
let est = 'menu', nv = 0, puntos = 0, estrellas = 0, tiempo = 0, ultimo = 0, comidas = 0, limpio = 0, avisoT = 0;
let p, ents = [], termicas = [], descubiertos = new Set();
let jugadores = [], turno = 0, resultados = [], modo = 'solo', sesiones = [], sesionActual = 0, anchoCanvas = 1;
const cam = { x: 0, y: 4, z: 0 };
let entrada = { izq: false, der: false, aleteo: false, pica: false, tx: null };

/* ---------- Pantalla ---------- */
function ajustar() {
  const r = lienzo.getBoundingClientRect(), d = window.devicePixelRatio || 1;
  lienzo.width = Math.max(1, r.width * d); lienzo.height = Math.max(1, r.height * d);
  anchoCanvas = lienzo.width; W = lienzo.width; H = lienzo.height; F = H * 0.9; HOR = H * 0.36;
}
window.addEventListener('resize', ajustar);

function mostrar(id) {
  for (const s of ['menu', 'nivelIntro', 'pausa', 'pregunta', 'fin']) $(s).hidden = s !== id;
}
function aviso(titulo, texto, fuente = '') {
  $('avisoTitulo').textContent = titulo; $('avisoTexto').textContent = texto;
  $('avisoFuente').textContent = fuente ? 'Fuente: ' + fuente : '';
  $('aviso').hidden = false; clearTimeout(avisoT);
  avisoT = setTimeout(() => { $('aviso').hidden = true; }, 8000);
}
function descubrir(id) {
  if (descubiertos.has(id)) return;
  descubiertos.add(id); puntos += 10;
  const d = DATOS[id];
  aviso('¿Sabías que…? ' + d.titulo, d.texto, d.fuente);
}
function dibujarEnciclopedia() {
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
function abrirEnciclopedia() {
  if (est === 'juego') alternarPausa();
  dibujarEnciclopedia(); $('enciclopedia').showModal();
}
function abrirDialogo(id) { $(id).showModal(); }
function dibujarLogros() {
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
function actualizarHud() {
  const L = NIVELES[nv];
  $('barEnergia').style.width = p.energia + '%';
  $('barEnergia').classList.toggle('baja', p.energia < 25);
  $('vidas').textContent = '♥'.repeat(Math.max(0, p.vidas)) + '♡'.repeat(Math.max(0, 3 - p.vidas));
  $('puntos').textContent = Math.round(puntos);
  $('nivel').textContent = (nv + 1) + '/' + NIVELES.length;
  $('altitud').textContent = Math.round(3800 + p.y * 40) + ' m';
  $('datos').textContent = descubiertos.size + '/' + Object.keys(DATOS).length;
  $('barProgreso').style.width = clamp(p.z / L.largo * 100, 0, 100) + '%';
}

/* ---------- Mundo ---------- */
function crearMundo(vidas) {
  const L = NIVELES[nv];
  p = { tipo: 'jugador', x: 0, y: 12, z: 0, vx: 0, vy: 0, energia: 100, vidas, invul: 0, cd: 0, aleteo: 0, suelo: false, enTermica: false };
  ents = [p]; termicas = [];
  const reparto = (n, fn) => { const paso = (L.largo - 90) / n; for (let i = 0; i < n; i++) fn(50 + paso * (i + rnd(0.1, 0.9)), paso); };
  reparto(L.termicas, z => { const t = { tipo: 'termica', x: rnd(-9, 9), z, r: 3.4, len: 14 }; termicas.push(t); ents.push(t); });
  const fin = { tipo: 'termica', x: 0, z: L.largo - 50, r: 4, len: 45 };   // ayuda para subir al risco
  termicas.push(fin); ents.push(fin);
  reparto(L.carronas, z => ents.push({ tipo: 'carrona', x: rnd(-9, 9), z, veneno: false }));
  reparto(L.venenos, z => ents.push({ tipo: 'carrona', x: rnd(-9, 9), z: z + 11, veneno: true }));
  reparto(L.cables, z => ents.push({ tipo: 'cable', x: 0, z: z + 5, y: rnd(5, 12) }));
  for (let i = 0; i < 260; i++) {
    const lado = Math.random() < 0.5 ? -1 : 1;
    ents.push({ tipo: 'decor', x: lado * rnd(i < 60 ? 3 : 8, 48), z: rnd(0, L.largo + 40) });
  }
  ents.push({ tipo: 'nido', x: 0, z: L.largo });
}
function iniciarNivel(n, vidas) {
  nv = n; crearMundo(vidas);
  $('nivelNumero').textContent = 'Nivel ' + (n + 1) + ' de ' + NIVELES.length;
  $('tNivel').textContent = NIVELES[n].nombre;
  $('nivelConsejo').textContent = NIVELES[n].consejo;
  est = 'nivel'; mostrar('nivelIntro'); actualizarHud();
}
function nuevoJuego(nuevoModo = 'solo') {
  modo = nuevoModo;
  jugadores = [$('nombreJ1').value.trim() || 'Jugador 1', $('nombreJ2').value.trim() || 'Jugador 2'];
  turno = 0; resultados = []; sesiones = [];
  $('campoJugador2').hidden = modo === 'solo';
  $('btnSolo').classList.toggle('primario', modo === 'solo'); $('btnDuo').classList.toggle('primario', modo === 'duo');
  $('btnSolo').setAttribute('aria-pressed', String(modo === 'solo')); $('btnDuo').setAttribute('aria-pressed', String(modo === 'duo'));
  $('duoHud').hidden = modo !== 'duo'; $('btnPica').hidden = modo === 'duo';
  $('juego').classList.toggle('modo-duo', modo === 'duo');
  if (modo === 'solo') { comenzarTurno(); return; }
  for (let i = 0; i < 2; i++) {
    sesionActual = i; entrada = crearEntrada(); iniciarNivel(0, 3); sesiones[i] = guardarSesion();
  }
  sesionActual = 0; cargarSesion(sesiones[0]); est = 'juego'; mostrar(null);
  $('duoNombre1').textContent = jugadores[0]; $('duoNombre2').textContent = jugadores[1]; actualizarMarcadorDuo();
}
function crearEntrada() { return { izq: false, der: false, aleteo: false, pica: false, tx: null }; }
function guardarSesion() {
  return { p, ents, termicas, descubiertos, nv, puntos, estrellas, comidas, limpio,
    cam: { x: cam.x, y: cam.y, z: cam.z }, entrada, nombre: jugadores[sesionActual], terminado: sesiones[sesionActual]?.terminado || false };
}
function cargarSesion(s) {
  p = s.p; ents = s.ents; termicas = s.termicas; descubiertos = s.descubiertos; nv = s.nv;
  puntos = s.puntos; estrellas = s.estrellas; comidas = s.comidas; limpio = s.limpio; entrada = s.entrada;
  cam.x = s.cam.x; cam.y = s.cam.y; cam.z = s.cam.z;
}
function actualizarMarcadorDuo() {
  $('duoPuntos1').textContent = (sesiones[0]?.puntos || 0) + ' pts';
  $('duoPuntos2').textContent = (sesiones[1]?.puntos || 0) + ' pts';
}
function comenzarTurno() {
  puntos = 0; estrellas = 0; comidas = 0; limpio = 0; tiempo = 0; descubiertos = new Set();
  $('turnoPausa').textContent = 'Turno de ' + jugadores[turno];
  iniciarNivel(0, 3);
}

/* ---------- Reglas del vuelo ---------- */
function aletear() {
  const despega = p.suelo, costo = despega ? 18 : 6;
  if (p.energia < costo) return;
  p.energia -= costo; p.vy = despega ? 7 : 6; p.suelo = false; if (despega) p.y = 0.2;
  p.cd = 0.38; p.aleteo = 0.3;
  if (despega) descubrir('despegue');
}
function dano(texto) {
  if (p.invul > 0) return;
  p.vidas--; p.invul = 1.8; p.vy = 3;
  aviso('¡Ay!', texto);
  if (p.vidas <= 0) finJuego(false);
}
function actualizar(dt) {
  const L = NIVELES[nv], z0 = p.z;
  tiempo += dt;
  const dir = (entrada.der ? 1 : 0) - (entrada.izq ? 1 : 0);
  const obj = entrada.tx !== null ? clamp((entrada.tx - p.x) * 3, -9, 9) : dir * 9;
  p.vx += (obj - p.vx) * Math.min(1, 6 * dt);
  p.x = clamp(p.x + p.vx * dt, -ANCHO, ANCHO);

  p.cd -= dt; p.aleteo = Math.max(0, p.aleteo - dt); p.invul = Math.max(0, p.invul - dt);
  if (entrada.aleteo && p.cd <= 0) aletear();

  const t = termicas.find(q => Math.abs(q.x - p.x) < q.r && p.z > q.z - 2 && p.z < q.z + q.len);
  p.enTermica = !!t;
  if (t) { p.vy += (4.5 - p.vy) * Math.min(1, 3 * dt); descubrir('vuelo'); }
  else {
    p.vy -= 7 * dt;
    const piso = entrada.pica ? -9 : -2.2;
    if (p.vy < piso) p.vy += (piso - p.vy) * Math.min(1, 5 * dt);
  }
  p.y += p.vy * dt;
  if (p.y >= TECHO) { p.y = TECHO; p.vy = Math.min(p.vy, 0); }
  p.suelo = p.y <= 0;
  if (p.suelo) { p.y = 0; p.vy = Math.max(p.vy, 0); }

  let v = L.vel * (entrada.pica && !p.suelo ? 1.4 : 1);
  if (p.suelo) v *= 0.35;                        // en el suelo camina despacio
  p.z += v * dt;
  if (!t && !p.suelo) p.energia -= 0.9 * dt;     // planear gasta poco
  p.energia = clamp(p.energia, 0, 100);
  if (p.suelo && p.energia < 1) { p.energia = 40; dano('Sin energía en el suelo. ¡Busca térmicas y carroña!'); }
  if (tiempo > 4) descubrir('tamano');

  for (const o of ents) {
    if (o.hecho || o.tipo === 'decor' || o === p) continue;
    if (o.tipo === 'carrona' && !o.veneno && !o.vista && o.z > p.z && o.z - p.z < 28) { o.vista = true; descubrir('busqueda'); }
    if (!(o.z >= z0 - 0.4 && o.z <= p.z + 0.4)) continue;
    if (o.tipo === 'carrona' && Math.abs(o.x - p.x) < 2.2 && p.y < 2) {
      o.hecho = true;
      if (o.veneno) { p.energia = Math.max(0, p.energia - 30); descubrir('veneno'); dano('¡Carroña envenenada! Sigue a los gallinazos.'); }
      else { p.energia = Math.min(100, p.energia + 35); puntos += 100; limpio++; comidas++; descubrir(comidas > 1 ? 'patas' : 'alimentacion'); descubrir('alimentacion'); }
    } else if (o.tipo === 'cable') {
      o.hecho = true;
      if (Math.abs(p.y - o.y) < 1.3) { descubrir('cables'); dano('¡Chocaste con un cable eléctrico!'); }
      else puntos += 25;
    }
  }
  if (p.z >= L.largo) {
    if (p.y >= NIDO_ALTO - 1 && p.y <= NIDO_ALTO + 9) terminarNivel();
    else { p.z = L.largo - 40; p.energia = Math.max(5, p.energia - 10);
      aviso('Ajusta tu altura', p.y < NIDO_ALTO ? 'Sube: el nido está en la repisa del risco.' : 'Baja un poco: la repisa del nido está más abajo.'); }
  }
  actualizarHud();
}

/* ---------- Fin de nivel, preguntas y puntajes ---------- */
function terminarNivel() {
  if (modo === 'duo') {
    puntos += 300; descubrir('nido'); if (nv === 0) descubrir('recorrido'); if (nv === 1) descubrir('reproduccion');
    if (nv === NIVELES.length - 1) { finJuego(true); return; }
    const vidas = p.vidas; nv++; crearMundo(vidas); actualizarHud(); return;
  }
  est = 'pregunta'; puntos += 300; descubrir('nido');
  if (nv === 0) descubrir('recorrido'); if (nv === 1) descubrir('reproduccion');
  const q = PREGUNTAS[nv], c = $('opciones');
  $('pregTexto').textContent = q.q; c.replaceChildren();
  $('explicacion').hidden = true; $('btnSigue').hidden = true;
  q.ops.forEach((t, i) => {
    const b = document.createElement('button'); b.type = 'button'; b.textContent = t;
    b.addEventListener('click', () => responder(i)); c.append(b);
  });
  mostrar('pregunta');
}
function responder(i) {
  const q = PREGUNTAS[nv], ok = i === q.ok;
  [...$('opciones').children].forEach((b, j) => { b.disabled = true; b.className = j === q.ok ? 'ok' : (j === i ? 'mal' : ''); });
  const e = 1 + (p.vidas >= 2 ? 1 : 0) + (ok ? 1 : 0);
  estrellas += e; if (ok) puntos += 200;
  $('explicacion').textContent = (ok ? '¡Correcto! ' : 'No exactamente. ') + q.expl + ' · ' + '★'.repeat(e) + '☆'.repeat(3 - e);
  $('explicacion').hidden = false; $('btnSigue').hidden = false; actualizarHud();
}
function leerLocal() {
  try { const l = JSON.parse(localStorage.getItem('puntajes')); return Array.isArray(l) ? l : []; } catch { return []; }
}
async function cargarPuntajes() {
  try { const r = await fetch('/api/puntajes'); if (!r.ok) throw new Error(); return await r.json(); }
  catch { return leerLocal(); }
}
async function guardarPuntaje() {
  for (const resultado of resultados) {
    const reg = { nombre: resultado.nombre, puntos: resultado.puntos };
    try {
      const r = await fetch('/api/puntajes', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(reg) });
      if (!r.ok) throw new Error();
    } catch { const l = leerLocal(); l.push(reg); localStorage.setItem('puntajes', JSON.stringify(l)); }
  }
  $('btnGuardar').disabled = true; mostrarPuntajes();
}
async function mostrarPuntajes() {
  const lista = (await cargarPuntajes()).sort((a, b) => b.puntos - a.puntos).slice(0, 10);
  for (const id of ['listaPuntajes', 'puntajesGlobales']) {
    const ol = $(id); ol.replaceChildren();
    for (const r of lista) { const li = document.createElement('li'); li.textContent = r.nombre + ' — ' + r.puntos; ol.append(li); }
  }
}
function finJuego(gano) {
  if (modo === 'duo') {
    const s = sesiones[sesionActual]; s.terminado = true;
    resultados[sesionActual] = { nombre: jugadores[sesionActual], puntos: Math.round(puntos), estrellas, datos: descubiertos.size, gano };
    if (sesiones.every(x => x.terminado)) finalizarDuo();
    return;
  }
  est = 'fin';
  if (gano) { descubrir('poblacion'); descubrir('simbolo'); } else descubrir('longevidad');
  const resultado = { nombre: jugadores[turno], puntos: Math.round(puntos), estrellas, datos: descubiertos.size, gano };
  resultados[turno] = resultado;
  $('finTitulo').textContent = gano ? '¡Los cóndores te lo agradecen!' : 'Fin del juego';
  $('finSubtitulo').textContent = jugadores[turno] + ' consiguió ' + resultado.puntos + ' puntos.';
  $('finPuntos').textContent = Math.round(puntos); $('finEstrellas').textContent = estrellas;
  $('finDatos').textContent = descubiertos.size + '/' + Object.keys(DATOS).length;
  $('finMensaje').textContent = DATOS.poblacion.texto + ' Cada cóndor cuenta.';
  $('btnReiniciar').textContent = 'Jugar otra partida';
  $('btnGuardar').hidden = true; $('btnGuardar').disabled = false;
  mostrar('fin'); mostrarPuntajes();
  guardarPuntaje();
}
function finalizarDuo() {
  est = 'fin'; const a = resultados[0], b = resultados[1];
  $('finTitulo').textContent = a.puntos === b.puntos ? '¡Empate!' : (a.puntos > b.puntos ? a.nombre : b.nombre) + ' gana la partida';
  $('finSubtitulo').textContent = a.nombre + ': ' + a.puntos + ' puntos · ' + b.nombre + ': ' + b.puntos + ' puntos';
  $('finPuntos').textContent = a.puntos + ' / ' + b.puntos; $('finEstrellas').textContent = a.estrellas + ' / ' + b.estrellas;
  $('finDatos').textContent = a.datos + ' / ' + b.datos; $('finMensaje').textContent = 'Cada jugador completó su propio recorrido. ¡Jueguen otra partida para desempatar!';
  $('btnReiniciar').textContent = 'Volver a jugar'; $('btnGuardar').hidden = true;
  mostrar('fin'); guardarPuntaje();
}
function alternarPausa() {
  if (est === 'juego') { est = 'pausa'; $('turnoPausa').textContent = 'Turno de ' + jugadores[turno]; mostrar('pausa'); }
  else if (est === 'pausa') { est = 'juego'; mostrar(null); }
}
function salirAlMenu() { est = 'menu'; modo = 'solo'; $('juego').classList.remove('modo-duo'); $('duoHud').hidden = true; $('campoJugador2').hidden = false; $('btnPica').hidden = false; mostrar('menu'); entrada.izq = entrada.der = entrada.aleteo = entrada.pica = false; entrada.tx = null; }

/* ---------- Dibujo en perspectiva ---------- */
function proy(x, y, z) { const s = F / (z - cam.z); return { x: W / 2 + (x - cam.x) * s, y: HOR + (cam.y - y) * s, s }; }
function elipse(x, y, rx, ry, color) { g.fillStyle = color; g.beginPath(); g.ellipse(x, y, Math.max(0.1, rx), Math.max(0.1, ry), 0, 0, 6.2832); g.fill(); }

function dibFondo() {
  const cielo = g.createLinearGradient(0, 0, 0, HOR);
  cielo.addColorStop(0, '#1c2f40'); cielo.addColorStop(1, '#e3b36a');
  g.fillStyle = cielo; g.fillRect(0, 0, W, HOR + 2);
  elipse(W * 0.22, HOR - H * 0.14, H * 0.06, H * 0.06, 'rgba(255,236,180,.9)');
  const cx = W * 0.68 - cam.x * 4;                                   // volcán
  g.fillStyle = '#4b5d6d'; g.beginPath(); g.moveTo(cx - W * 0.3, HOR); g.lineTo(cx, HOR - H * 0.3); g.lineTo(cx + W * 0.3, HOR); g.fill();
  g.fillStyle = '#eef2f4'; g.beginPath(); g.moveTo(cx - W * 0.085, HOR - H * 0.21); g.lineTo(cx, HOR - H * 0.3); g.lineTo(cx + W * 0.085, HOR - H * 0.21);
  g.lineTo(cx + W * 0.03, HOR - H * 0.19); g.lineTo(cx - W * 0.02, HOR - H * 0.2); g.fill();
  const colinas = (color, amp, k, f) => {
    g.fillStyle = color; g.beginPath(); g.moveTo(0, HOR + 2);
    for (let i = 0; i <= W; i += 16) g.lineTo(i, HOR - amp * H * (0.55 + 0.45 * Math.sin((i + cam.x * k) * f) * Math.cos((i + cam.x * k) * f * 0.37)));
    g.lineTo(W, HOR + 2); g.fill();
  };
  colinas('#3f5646', 0.07, 10, 0.006); colinas('#5a6b3c', 0.035, 22, 0.011);
}
function dibSuelo() {
  g.fillStyle = '#6d7a3d'; g.fillRect(0, HOR, W, H - HOR);
  const paso = 14, z0 = Math.ceil(cam.z / paso) * paso;
  for (let k = 26; k >= 0; k--) {
    const z = z0 + k * paso, y = HOR + cam.y * F / (z - cam.z);
    g.fillStyle = Math.floor(z / paso) % 2 ? '#788640' : '#6b7939'; g.fillRect(0, y, W, H - y);
  }
  const bruma = g.createLinearGradient(0, HOR, 0, HOR + H * 0.18);
  bruma.addColorStop(0, 'rgba(227,179,106,.6)'); bruma.addColorStop(1, 'rgba(227,179,106,0)');
  g.fillStyle = bruma; g.fillRect(0, HOR, W, H * 0.18);
}
function dibTermica(t) {
  const zc = t.z + t.len / 2; if (zc - cam.z < 2) return;
  const a = proy(t.x - t.r, 0, zc), b = proy(t.x + t.r, 0, zc), c = proy(t.x - t.r * 0.8, TECHO, zc), d = proy(t.x + t.r * 0.8, TECHO, zc);
  const gr = g.createLinearGradient(0, a.y, 0, c.y); gr.addColorStop(0, 'rgba(255,214,130,.38)'); gr.addColorStop(1, 'rgba(255,214,130,0)');
  g.fillStyle = gr; g.beginPath(); g.moveTo(a.x, a.y); g.lineTo(b.x, b.y); g.lineTo(d.x, d.y); g.lineTo(c.x, c.y); g.fill();
  const m = proy(t.x, 0, zc);
  g.strokeStyle = 'rgba(255,226,150,.85)'; g.lineWidth = 2; g.beginPath(); g.ellipse(m.x, m.y, t.r * m.s, t.r * m.s * 0.28, 0, 0, 6.2832); g.stroke();
  for (let i = 0; i < 6; i++) {
    const yy = (tiempo * 4 + i * 5) % TECHO, q = proy(t.x + Math.sin(i * 2.1 + yy) * t.r * 0.6, yy, zc);
    elipse(q.x, q.y, Math.max(1, 0.12 * q.s), Math.max(1, 0.12 * q.s), 'rgba(255,238,175,.85)');
  }
}
function dibCarrona(o) {
  if (o.z - cam.z < 1.5) return;
  const q = proy(o.x, 0, o.z);
  elipse(q.x, q.y, 1.1 * q.s, 0.3 * q.s, 'rgba(0,0,0,.25)');
  elipse(q.x, q.y - 0.25 * q.s, 0.9 * q.s, 0.35 * q.s, o.veneno ? '#6c5a35' : '#7a4a32');
  g.strokeStyle = 'rgba(240,230,210,.7)'; g.lineWidth = Math.max(1, 0.05 * q.s);
  for (let i = -2; i <= 2; i++) { g.beginPath(); g.moveTo(q.x + i * 0.22 * q.s, q.y - 0.5 * q.s); g.lineTo(q.x + i * 0.22 * q.s, q.y - 0.08 * q.s); g.stroke(); }
  if (o.veneno) return;                       // sin gallinazos = sospechoso
  for (let i = 0; i < 3; i++) {               // gallinazos sobre la comida
    const a = tiempo * 1.5 + i * 2.1, bz = o.z + Math.sin(a) * 2.2;
    if (bz - cam.z < 2) continue;
    const b = proy(o.x + Math.cos(a) * 2.2, 6 + i * 1.2, bz), w = Math.max(4, 0.45 * b.s);
    g.strokeStyle = '#111'; g.lineWidth = Math.max(1.5, 0.07 * b.s);
    g.beginPath(); g.moveTo(b.x - w, b.y - w * 0.3); g.lineTo(b.x, b.y); g.lineTo(b.x + w, b.y - w * 0.3); g.stroke();
  }
}
function dibCable(o) {
  if (o.z - cam.z < 1.5) return;
  const a = proy(-17, o.y, o.z), b = proy(17, o.y, o.z), m = proy(0, o.y - 1.5, o.z);
  g.strokeStyle = '#2a2f33'; g.lineWidth = Math.max(2, 0.5 * a.s);
  for (const x of [-17, 17]) { const s0 = proy(x, 0, o.z), s1 = proy(x, o.y + 2.5, o.z); g.beginPath(); g.moveTo(s0.x, s0.y); g.lineTo(s1.x, s1.y); g.stroke(); }
  g.strokeStyle = '#0d0d0d'; g.lineWidth = Math.max(1.5, 0.07 * a.s);
  g.beginPath(); g.moveTo(a.x, a.y); g.quadraticCurveTo(m.x, m.y, b.x, b.y); g.stroke();
  for (const x of [-6, 0, 6]) { const q = proy(x, o.y - 0.75, o.z); elipse(q.x, q.y, Math.max(2, 0.3 * q.s), Math.max(2, 0.3 * q.s), '#ff7a1a'); }
}
function dibNido(o) {
  if (o.z - cam.z < 1.5) return;
  const a = proy(-30, 0, o.z), b = proy(30, 0, o.z), c = proy(30, 40, o.z), d = proy(-30, 40, o.z);
  g.fillStyle = '#5b5048'; g.beginPath(); g.moveTo(a.x, a.y); g.lineTo(b.x, b.y); g.lineTo(c.x, c.y); g.lineTo(d.x, d.y); g.fill();
  const r1 = proy(-6, NIDO_ALTO - 1, o.z), r2 = proy(6, NIDO_ALTO - 1, o.z);
  g.fillStyle = '#8a7358'; g.fillRect(r1.x, r1.y, r2.x - r1.x, Math.max(4, 0.7 * r1.s));
  const n = proy(0, NIDO_ALTO + 0.4, o.z);
  elipse(n.x, n.y, 2.2 * n.s, 0.7 * n.s, '#a58b5a'); elipse(n.x, n.y - 0.2 * n.s, 0.25 * n.s, 0.35 * n.s, '#f5f1e6');
}
function dibDecor(o) {
  const dz = o.z - cam.z; if (dz < 2 || dz > 230) return;
  const q = proy(o.x, 0, o.z);
  g.strokeStyle = '#8a7a4a'; g.lineWidth = Math.max(1, 0.12 * q.s); g.beginPath(); g.moveTo(q.x, q.y); g.lineTo(q.x, q.y - 1.5 * q.s); g.stroke();
  elipse(q.x, q.y - 1.7 * q.s, 0.4 * q.s, 0.3 * q.s, '#cfc983');
}
function dibJugador() {
  const q = proy(p.x, p.y, p.z), sh = proy(p.x, 0, p.z), u = q.s;
  elipse(sh.x, sh.y, 1.3 * sh.s, 0.3 * sh.s, 'rgba(0,0,0,' + clamp(0.35 - p.y * 0.01, 0.1, 0.35) + ')');
  if (p.invul > 0 && Math.floor(tiempo * 12) % 2 === 0) return;
  const A = p.aleteo > 0 ? Math.sin(tiempo * 22) * 0.55 : (p.enTermica ? 0.12 : 0.04 + Math.sin(tiempo * 2) * 0.03), ala = 1.4 * u;
  g.save(); g.translate(q.x, q.y); g.rotate(clamp(p.vx * 0.035, -0.35, 0.35));
  for (const d of [-1, 1]) {
    g.fillStyle = '#17171c'; g.beginPath();
    g.moveTo(d * 0.18 * u, -0.12 * u); g.lineTo(d * ala, -A * ala - 0.08 * u);
    g.lineTo(d * ala * 0.85, -A * ala * 0.85 + 0.28 * u); g.lineTo(d * 0.2 * u, 0.35 * u); g.fill();
    g.strokeStyle = '#e8e4dc'; g.lineWidth = 0.08 * u; g.beginPath();
    g.moveTo(d * ala * 0.45, -A * ala * 0.45 + 0.2 * u); g.lineTo(d * ala * 0.8, -A * ala * 0.8 + 0.12 * u); g.stroke();
  }
  g.fillStyle = '#111'; g.beginPath(); g.moveTo(-0.14 * u, 0.4 * u); g.lineTo(0.14 * u, 0.4 * u); g.lineTo(0.2 * u, 0.8 * u); g.lineTo(-0.2 * u, 0.8 * u); g.fill();
  elipse(0, 0.1 * u, 0.22 * u, 0.38 * u, '#1b1b20'); elipse(0, -0.28 * u, 0.2 * u, 0.08 * u, '#f1ede2'); elipse(0, -0.42 * u, 0.1 * u, 0.1 * u, '#b24a3a');
  g.restore();
}
function dibujar() {
  cam.z = p.z - CAM_ATRAS; cam.x += (p.x * 0.75 - cam.x) * 0.08; cam.y += (p.y * 0.85 + 3 - cam.y) * 0.1;
  dibFondo(); dibSuelo();
  const orden = ents.slice().sort((a, b) => b.z - a.z);
  for (const o of orden) {
    if (o.tipo === 'decor') dibDecor(o); else if (o.tipo === 'termica') dibTermica(o); else if (o.tipo === 'carrona') { if (!o.hecho) dibCarrona(o); }
    else if (o.tipo === 'cable') dibCable(o); else if (o.tipo === 'nido') dibNido(o); else dibJugador();
  }
  if (p.invul > 1.4) { g.fillStyle = 'rgba(217,83,79,.25)'; g.fillRect(0, 0, W, H); }
}
function dibujarDuo() {
  const mitad = anchoCanvas / 2, anchoPrevio = W;
  for (let i = 0; i < 2; i++) {
    g.save(); g.beginPath(); g.rect(i * mitad, 0, mitad, H); g.clip(); g.translate(i * mitad, 0);
    W = mitad; sesionActual = i; cargarSesion(sesiones[i]); dibujar(); sesiones[i] = guardarSesion();
    g.restore();
  }
  W = anchoPrevio; sesionActual = 0; cargarSesion(sesiones[0]);
  g.fillStyle = 'rgba(243,239,227,.72)'; g.fillRect(mitad - 1, 0, 2, H);
  actualizarMarcadorDuo();
}

/* ---------- Entrada y bucle ---------- */
const teclas = { ArrowLeft: 'izq', a: 'izq', A: 'izq', ArrowRight: 'der', d: 'der', D: 'der', ArrowUp: 'aleteo', w: 'aleteo', W: 'aleteo', ' ': 'aleteo', ArrowDown: 'pica', s: 'pica', S: 'pica' };
window.addEventListener('keydown', e => {
  if (e.key === 'Escape' || e.key === 'p' || e.key === 'P') { alternarPausa(); return; }
  if (modo === 'duo' && est === 'juego') {
    const duoKeys = {
      a: [0, 'izq'], A: [0, 'izq'], d: [0, 'der'], D: [0, 'der'], w: [0, 'aleteo'], W: [0, 'aleteo'], s: [0, 'pica'], S: [0, 'pica'],
      ArrowLeft: [1, 'izq'], ArrowRight: [1, 'der'], ArrowUp: [1, 'aleteo'], ' ': [1, 'aleteo'], ArrowDown: [1, 'pica']
    };
    const duoKey = duoKeys[e.key]; if (duoKey) { sesiones[duoKey[0]].entrada[duoKey[1]] = true; e.preventDefault(); } return;
  }
  const k = teclas[e.key]; if (k) { entrada[k] = true; if (est === 'juego') e.preventDefault(); }
});
window.addEventListener('keyup', e => {
  if (modo === 'duo') {
    const duoKeys = { a: [0, 'izq'], A: [0, 'izq'], d: [0, 'der'], D: [0, 'der'], w: [0, 'aleteo'], W: [0, 'aleteo'], s: [0, 'pica'], S: [0, 'pica'], ArrowLeft: [1, 'izq'], ArrowRight: [1, 'der'], ArrowUp: [1, 'aleteo'], ' ': [1, 'aleteo'], ArrowDown: [1, 'pica'] };
    const duoKey = duoKeys[e.key]; if (duoKey) sesiones[duoKey[0]].entrada[duoKey[1]] = false; return;
  }
  const k = teclas[e.key]; if (k) entrada[k] = false;
});
function posX(e) { const r = lienzo.getBoundingClientRect(); return ((e.clientX - r.left) / r.width - 0.5) * 2 * ANCHO; }
lienzo.addEventListener('pointerdown', e => { entrada.tx = posX(e); entrada.aleteo = true; });
lienzo.addEventListener('pointermove', e => { if (entrada.tx !== null) entrada.tx = posX(e); });
for (const ev of ['pointerup', 'pointercancel', 'pointerleave']) lienzo.addEventListener(ev, () => { entrada.tx = null; entrada.aleteo = false; });
$('btnPica').addEventListener('pointerdown', () => { entrada.pica = true; });
$('btnPica').addEventListener('pointerup', () => { entrada.pica = false; });
$('btnPica').addEventListener('pointerleave', () => { entrada.pica = false; });

const clic = (id, f) => $(id).addEventListener('click', f);
clic('btnSolo', () => nuevoJuego('solo')); clic('btnDuo', () => nuevoJuego('duo')); clic('btnEnciclo', abrirEnciclopedia); clic('btnEncicloPausa', abrirEnciclopedia);
clic('btnVolar', () => { est = 'juego'; mostrar(null); });
clic('btnReanudar', alternarPausa); clic('btnPausa', alternarPausa);
clic('btnSigue', () => { if (nv < NIVELES.length - 1) iniciarNivel(nv + 1, p.vidas); else finJuego(true); });
clic('btnGuardar', guardarPuntaje);
clic('btnReiniciar', () => {
  if (modo === 'duo') nuevoJuego('duo');
  else nuevoJuego('solo');
});
clic('btnPuntajesMenu', async () => { await mostrarPuntajes(); abrirDialogo('panelPuntajes'); });
clic('btnPuntajesPausa', async () => { await mostrarPuntajes(); abrirDialogo('panelPuntajes'); });
clic('btnLogrosMenu', () => { dibujarLogros(); abrirDialogo('panelLogros'); });
clic('btnLogrosPausa', () => { dibujarLogros(); abrirDialogo('panelLogros'); });
clic('btnAjustes', () => abrirDialogo('panelAjustes'));
clic('btnMenuPausa', salirAlMenu);
const aplicarAjustes = () => {
  document.body.classList.toggle('alto-contraste', $('ajusteContraste').checked);
  document.body.classList.toggle('texto-grande', $('ajusteTexto').checked);
  localStorage.setItem('ajustes-condor', JSON.stringify({ contraste: $('ajusteContraste').checked, texto: $('ajusteTexto').checked }));
};
$('ajusteContraste').addEventListener('change', aplicarAjustes); $('ajusteTexto').addEventListener('change', aplicarAjustes);
try { const a = JSON.parse(localStorage.getItem('ajustes-condor') || '{}'); $('ajusteContraste').checked = !!a.contraste; $('ajusteTexto').checked = !!a.texto; aplicarAjustes(); } catch {}

function bucle(t) {
  const dt = Math.min(0.05, (t - ultimo) / 1000 || 0); ultimo = t;
  if (est === 'juego' && modo === 'duo') {
    for (let i = 0; i < 2; i++) if (!sesiones[i].terminado) { sesionActual = i; cargarSesion(sesiones[i]); actualizar(dt); sesiones[i] = guardarSesion(); }
    sesionActual = 0; cargarSesion(sesiones[0]); dibujarDuo();
  } else {
    if (est === 'juego') actualizar(dt); else if (est === 'menu') tiempo += dt;
    dibujar();
  }
  requestAnimationFrame(bucle);
}
ajustar(); crearMundo(3); actualizarHud(); mostrar('menu'); requestAnimationFrame(bucle);
