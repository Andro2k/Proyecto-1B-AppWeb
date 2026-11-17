/* Datos del cóndor, niveles y preguntas (separados de la lógica).
   Las fuentes vienen de la guía del proyecto: confirmarlas en el informe (APA 7). */
const DATOS = {
  vuelo: { titulo: 'Vuela sin aletear', texto: 'Aletea cerca del 1 % del tiempo de vuelo; el resto planea aprovechando las térmicas.', fuente: 'Williams et al. (2020), PNAS' },
  despegue: { titulo: 'Despegar cuesta', texto: 'Cerca del 75 % del aleteo ocurre al despegar desde el suelo.', fuente: 'Williams et al. (2020), PNAS' },
  tamano: { titulo: 'Gigante de los Andes', texto: 'Su envergadura promedia 2,8 m (hasta 3,3 m) y pesa de 10 a 15 kg.', fuente: 'Andean condor, Wikipedia' },
  alimentacion: { titulo: 'Limpia el páramo', texto: 'Es carroñero: al comer carroña limpia el ecosistema y evita enfermedades.', fuente: 'Andean condor, Wikipedia' },
  busqueda: { titulo: 'Ojos de cóndor', texto: 'Encuentra comida con la vista y siguiendo a otras aves carroñeras.', fuente: 'Andean condor, Wikipedia' },
  patas: { titulo: 'Patas para caminar', texto: 'Sus patas no sirven para agarrar presas: come en el suelo.', fuente: 'Andean condor, Wikipedia' },
  recorrido: { titulo: 'Grandes distancias', texto: 'Puede recorrer más de 200 km en un solo día.', fuente: 'Andean condor, Wikipedia' },
  nido: { titulo: 'Nidos en los riscos', texto: 'Anida en riscos entre 3.000 y 5.000 m de altitud.', fuente: 'Andean condor, Wikipedia' },
  reproduccion: { titulo: 'Crianza lenta', texto: 'Pone un solo huevo cada dos años; la incubación dura de 54 a 58 días.', fuente: 'Andean condor, Wikipedia' },
  longevidad: { titulo: 'Larga vida', texto: 'Puede vivir más de 50 años: cada cóndor perdido cuenta.', fuente: 'Andean condor, Wikipedia' },
  veneno: { titulo: 'Cebos envenenados', texto: 'El veneno causó el 63 % de los cóndores heridos o muertos registrados en el norte de Sudamérica (1979–2021).', fuente: 'Restrepo-Cardona et al. (2022), PLOS ONE' },
  cables: { titulo: 'Cables peligrosos', texto: 'Los choques y la electrocución en tendidos eléctricos son una amenaza real.', fuente: 'Restrepo-Cardona et al. (2022), PLOS ONE' },
  poblacion: { titulo: 'Quedan muy pocos', texto: 'Los censos de 2015 y 2018 estimaron entre 94 y 150 cóndores en Ecuador.', fuente: 'Guía del proyecto (confirmar fuente del censo)' },
  simbolo: { titulo: 'Ave nacional', texto: 'Es el ave nacional del Ecuador; el Día del Cóndor Andino es el 7 de julio.', fuente: 'Primicias (2019)' }
};

const NIVELES = [
  { nombre: 'Amanecer en el páramo', largo: 500, vel: 13, termicas: 6, carronas: 5, venenos: 1, cables: 2,
    consejo: 'Aletear gasta energía. Planea y busca las columnas de aire caliente (térmicas).' },
  { nombre: 'Tendidos y veneno', largo: 700, vel: 15, termicas: 7, carronas: 6, venenos: 3, cables: 5,
    consejo: 'Come solo donde vuelan los gallinazos: la carroña sin aves puede estar envenenada.' },
  { nombre: 'Rumbo al nido', largo: 900, vel: 17, termicas: 8, carronas: 6, venenos: 4, cables: 8,
    consejo: 'El nido está en un risco: llega a su altura para aterrizar en la repisa.' }
];

const PREGUNTAS = [
  { q: '¿Qué parte de su vuelo pasa el cóndor aleteando?', ops: ['Cerca del 50 %', 'Cerca del 1 %', 'Casi todo el tiempo'], ok: 1,
    expl: 'Planea en térmicas y aletea cerca del 1 % del tiempo (Williams et al., 2020).' },
  { q: '¿Cómo encuentra el cóndor su comida?', ops: ['Cazando presas vivas', 'Solo por el olfato', 'Con la vista y siguiendo a otras aves carroñeras'], ok: 2,
    expl: 'Sus patas no agarran presas: busca carroña con la vista y observando a otras aves.' },
  { q: '¿Cuál fue la principal causa de cóndores heridos o muertos en el norte de Sudamérica (1979–2021)?', ops: ['El veneno', 'Las tormentas', 'La falta de agua'], ok: 0,
    expl: 'El veneno causó el 63 % de los casos registrados (Restrepo-Cardona et al., 2022).' }
];
