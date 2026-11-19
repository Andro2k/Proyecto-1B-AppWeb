/* Pregunta final de cada nivel (misma posición que en NIVELES). */
export const PREGUNTAS = [
  { q: '¿Qué parte de su vuelo pasa el cóndor aleteando?', ops: ['Cerca del 50 %', 'Cerca del 1 %', 'Casi todo el tiempo'], ok: 1,
    expl: 'Planea en térmicas y aletea cerca del 1 % del tiempo (Williams et al., 2020).' },
  { q: '¿Cómo encuentra el cóndor su comida?', ops: ['Cazando presas vivas', 'Solo por el olfato', 'Con la vista y siguiendo a otras aves carroñeras'], ok: 2,
    expl: 'Sus patas no agarran presas: busca carroña con la vista y observando a otras aves.' },
  { q: '¿Cuál fue la principal causa de cóndores heridos o muertos en el norte de Sudamérica (1979–2021)?', ops: ['El veneno', 'Las tormentas', 'La falta de agua'], ok: 0,
    expl: 'El veneno causó el 63 % de los casos registrados (Restrepo-Cardona et al., 2022).' }
];
PREGUNTAS.push(
  { q: '¿Cómo se reconoce a la cóndor hembra?', ops: ['Tiene una gran cresta en la cabeza', 'No tiene cresta y sus ojos son rojizos', 'Es más grande que el macho'], ok: 1,
    expl: 'El macho tiene cresta y ojos pardos; la hembra no tiene cresta, sus ojos son rojizos y es algo más pequeña (Andean condor, Wikipedia).' },
  { q: '¿Cuántos huevos pone un cóndor andino cada dos años?', ops: ['Uno', 'Cinco', 'Diez'], ok: 0,
    expl: 'Pone un solo huevo cada dos años y lo incuba de 54 a 58 días: cada cóndor cuenta.' },
  { q: '¿Qué debes hacer si ves a alguien poniendo veneno o cazando cóndores?', ops: ['Avisar a un guardaparque o a una autoridad', 'No hacer nada', 'Quedarte con sus plumas'], ok: 0,
    expl: 'Envenenar o cazar daña a una especie en peligro. Lo correcto es avisar a un guardaparque o a las autoridades.' }
);
