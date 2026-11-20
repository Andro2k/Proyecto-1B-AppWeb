/* Los niveles son ubicaciones reales de la cordillera de los Andes del Ecuador, de norte a sur.
   Los cóndores se han registrado en estas zonas de páramo.
   lat/lon: ubicación real del lugar. pos: [lat, lon] donde se dibuja en el mapa, separada un poco para que
   los marcadores (grandes, para verse a 1 m) no se solapen. */
export const NIVELES = [
  { id: 'cayambe', nombre: 'Amanecer en el Cayambe', lugar: 'Cayambe', provincia: 'Pichincha', lat: 0.03, lon: -77.99, pos: [0.1, -77.95], alt: 4000,
    descripcion: 'Volcán nevado cuya cumbre se cruza con la línea ecuatorial.',
    largo: 500, vel: 13, termicas: 6, carronas: 5, venenos: 1, cables: 2,
    consejo: 'Aletear gasta energía. Planea y busca las columnas de aire caliente (térmicas).' },
  { id: 'antisana', nombre: 'Tendidos y veneno', lugar: 'Antisana', provincia: 'Napo y Pichincha', lat: -0.48, lon: -78.14, pos: [-0.55, -77.4], alt: 4100,
    descripcion: 'Volcán con glaciares, rodeado de páramo y lagunas.',
    largo: 650, vel: 14, termicas: 7, carronas: 6, venenos: 3, cables: 5,
    consejo: 'Come solo donde vuelan los gallinazos: la carroña sin aves puede estar envenenada.' },
  { id: 'cotopaxi', nombre: 'Sobre el Cotopaxi', lugar: 'Cotopaxi', provincia: 'Cotopaxi', lat: -0.68, lon: -78.44, pos: [-1.2, -78.45], alt: 4300,
    descripcion: 'Uno de los volcanes activos más altos del mundo.',
    largo: 750, vel: 15, termicas: 7, carronas: 6, venenos: 3, cables: 5,
    consejo: 'Más cables y más veneno: mira bien antes de bajar a comer.' },
  { id: 'chimborazo', nombre: 'Tormenta en el Chimborazo', lugar: 'Chimborazo', provincia: 'Chimborazo', lat: -1.47, lon: -78.82, pos: [-2.05, -79.0], alt: 4500,
    descripcion: 'La cumbre más lejana del centro de la Tierra.',
    largo: 800, vel: 15, termicas: 8, carronas: 6, venenos: 3, cables: 4, tormentas: 6, lluvia: true,
    consejo: 'Las nubes oscuras lanzan rayos: cuando el círculo rojo se fije en el suelo, ¡muévete de lado!' },
  { id: 'cajas', nombre: 'Lagunas del Cajas', lugar: 'El Cajas', provincia: 'Azuay', lat: -2.78, lon: -79.23, pos: [-3.0, -79.3], alt: 3900,
    descripcion: 'Parque nacional con cientos de lagunas de páramo.',
    largo: 900, vel: 16, termicas: 8, carronas: 6, venenos: 4, cables: 7,
    consejo: 'El recorrido es largo: cuida tu energía y tus vidas.' },
  { id: 'podocarpus', nombre: 'Rumbo al nido', lugar: 'Podocarpus', provincia: 'Loja y Zamora Chinchipe', lat: -4.1, lon: -79.17, pos: [-4.3, -79.05], alt: 3300,
    descripcion: 'Donde el páramo se une con el bosque nublado del sur.',
    largo: 1000, vel: 17, termicas: 9, carronas: 6, venenos: 4, cables: 6, tormentas: 4, lluvia: true,
    consejo: 'El nido está en un risco: llega a su altura y esquiva los rayos de la tormenta.' }
];
