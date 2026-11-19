/* Aspecto de cada ubicación: cielo, montaña de fondo, suelo y elementos del paisaje.
   cielo: paradas del degradado [posición 0..1, color]. monte.forma: ver render/montes.js.
   decor: [clase, peso] de los elementos repartidos a los lados; lugares: [clase, cantidad] de elementos especiales. */
export const PAISAJES = {
  cayambe: {
    cielo: [[0, '#1c2f40'], [1, '#e3b36a']], sol: { x: 0.22, y: 0.14, color: 'rgba(255,236,180,.9)', r: 0.06 }, bruma: 'rgba(227,179,106,.6)', nube: '255,236,214', nubes: 5,
    monte: { forma: 'cordillera', cuerpo: '#4b5d6d', nieve: '#eef2f4', x: 0.68 }, colinas: ['#3f5646', '#5a6b3c'], suelo: ['#6d7a3d', '#788640', '#6b7939'],
    decor: [['frailejon', 3], ['pajonal', 5], ['roca', 2], ['mancha', 3]], lugares: [['choza', 2], ['llama', 3], ['ave', 4], ['cultivo', 2]] },
  antisana: {
    cielo: [[0, '#25506e'], [0.55, '#7fb2c9'], [1, '#f2d9a6']], sol: { x: 0.8, y: 0.16, color: 'rgba(255,243,196,.95)', r: 0.05 }, bruma: 'rgba(242,217,166,.55)', nube: '255,255,255', nubes: 7,
    monte: { forma: 'cordillera', cuerpo: '#5a6f80', nieve: '#f2f6f8', x: 0.35 }, colinas: ['#4a6a58', '#6a7d43'], suelo: ['#76833f', '#808f46', '#707d38'],
    decor: [['frailejon', 3], ['pajonal', 4], ['roca', 2], ['quenua', 1], ['mancha', 3]], lugares: [['laguna', 3], ['ave', 3], ['llama', 1]] },
  cotopaxi: {
    cielo: [[0, '#1f4f86'], [0.6, '#6fa6d8'], [1, '#f4e0b8']], sol: { x: 0.18, y: 0.2, color: 'rgba(255,248,214,.95)', r: 0.05 }, bruma: 'rgba(244,224,184,.5)', nube: '255,255,255', nubes: 6,
    monte: { forma: 'cono', cuerpo: '#6b6560', nieve: '#f4f6f8', x: 0.62, humo: true }, colinas: ['#6a5f55', '#7a6f4f'], suelo: ['#8a7c62', '#948568', '#80735a'],
    decor: [['roca', 5], ['pajonal', 3], ['frailejon', 1], ['mancha', 4]], lugares: [['choza', 1], ['ave', 3], ['llama', 1]] },
  chimborazo: {
    cielo: [[0, '#161b2c'], [0.5, '#3a3f5e'], [1, '#a58a8e']], sol: { x: 0.3, y: 0.1, color: 'rgba(230,200,190,.55)', r: 0.045 }, bruma: 'rgba(150,140,160,.5)', nube: '120,125,150', nubes: 9,
    monte: { forma: 'domo', cuerpo: '#5b6277', nieve: '#dfe6f0', x: 0.6 }, colinas: ['#3c4150', '#55573f'], suelo: ['#7b7258', '#857b5f', '#716850'],
    decor: [['roca', 4], ['pajonal', 3], ['frailejon', 1], ['mancha', 4]], lugares: [['llama', 4], ['ave', 2]] },
  cajas: {
    cielo: [[0, '#52667a'], [0.6, '#9fb4c2'], [1, '#dfe6e4']], sol: { x: 0.5, y: 0.18, color: 'rgba(255,255,255,.35)', r: 0.07 }, bruma: 'rgba(220,230,228,.7)', nube: '240,244,246', nubes: 8,
    monte: { forma: 'colinas', cuerpo: '#6b7f86', nieve: '#cfd8da', x: 0.5 }, colinas: ['#587068', '#6e8466'], suelo: ['#5f7a4a', '#69864f', '#587043'],
    decor: [['quenua', 4], ['frailejon', 2], ['pajonal', 3], ['roca', 3], ['mancha', 3]], lugares: [['laguna', 8], ['ave', 3], ['llama', 1]] },
  podocarpus: {
    cielo: [[0, '#16314a'], [0.5, '#d98a5a'], [1, '#f6c47a']], sol: { x: 0.25, y: 0.12, color: 'rgba(255,214,150,.9)', r: 0.06 }, bruma: 'rgba(246,196,122,.45)', nube: '255,226,196', nubes: 6,
    monte: { forma: 'selva', cuerpo: '#2f5b45', nieve: '#cfe0d2', x: 0.6 }, colinas: ['#2c5240', '#3f6b46'], suelo: ['#3f6a3a', '#487540', '#386233'],
    decor: [['arbol', 7], ['quenua', 1], ['pajonal', 2], ['roca', 1], ['mancha', 2]], lugares: [['choza', 1], ['ave', 5]] }
};
