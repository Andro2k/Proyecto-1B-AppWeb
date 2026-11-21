/* Novela visual del final: «El nido de Kuntur». Pensada para niñas y niños mayores de 7 años.
   Cada línea: { fondo, izq, der, habla, quien, texto }.
     fondo: 'nido' | 'valle' | 'noche'.  izq / der: 'personaje' o 'personaje:expresión' (kuntur, killa, sami, luis).
     habla: 'izq' | 'der' (quién resalta; sin valor = narrador).  eleccion: { pregunta, opciones: [{ texto, respuesta: [líneas] }] }.
   Datos reales usados: un huevo cada dos años, incubación de 54 a 58 días, el veneno es la mayor amenaza (ver datos.js). */
export const TITULO_HISTORIA = 'El nido de Kuntur';

export const HISTORIA = [
  { fondo: 'nido', izq: 'kuntur', der: 'killa:feliz', quien: 'Narrador', texto: 'Después de cruzar los Andes de norte a sur, Kuntur llegó por fin a su nido.' },
  { fondo: 'nido', izq: 'kuntur', der: 'killa:feliz', habla: 'der', quien: 'Killa', texto: '¡Kuntur, volviste! Temí que los cables o el veneno te detuvieran.' },
  { fondo: 'nido', izq: 'kuntur:triste', der: 'killa', habla: 'izq', quien: 'Kuntur', texto: 'Casi, Killa. En el camino vi carne envenenada, cables sin señales y cazadores en el suelo.' },
  { fondo: 'nido', izq: 'kuntur:triste', der: 'killa:triste', habla: 'der', quien: 'Killa', texto: 'Por eso ponemos un solo huevo cada dos años. Cada cóndor cuenta.' },
  { fondo: 'nido', izq: 'kuntur', der: 'killa', habla: 'izq', quien: 'Kuntur', texto: 'Pero no todo fue malo: muchas personas cuidan el páramo. Te cuento lo que vi en el valle.' },

  { fondo: 'valle', izq: 'sami', der: 'luis', quien: 'Narrador', texto: 'En el valle, una niña llamada Sami paseaba con su perro por el campo de su tío.' },
  { fondo: 'valle', izq: 'sami:preocupada', der: 'luis', habla: 'izq', quien: 'Sami', texto: 'Don Luis, ¡mire! Mi tío dejó carne en el campo para espantar al zorro, pero huele raro.' },
  { fondo: 'valle', izq: 'sami:preocupada', der: 'luis:serio', habla: 'der', quien: 'Don Luis', texto: 'Hiciste bien en avisarme, Sami. Esa carne tiene veneno.' },
  { fondo: 'valle', izq: 'sami:preocupada', der: 'luis:serio', habla: 'izq', quien: 'Sami', texto: '¿Veneno? ¿Solo para el zorro?' },
  { fondo: 'valle', izq: 'sami:preocupada', der: 'luis:serio', habla: 'der', quien: 'Don Luis', texto: 'Para el zorro, para tu perro… y para los cóndores que comen carroña. Un solo cebo puede enfermar a muchos animales.' },
  { fondo: 'valle', izq: 'sami:triste', der: 'luis', habla: 'izq', quien: 'Sami', texto: 'Mi tío no quería hacer daño. Solo quiere proteger a sus ovejas.' },
  { fondo: 'valle', izq: 'sami:triste', der: 'luis:sonrie', habla: 'der', quien: 'Don Luis', texto: 'Lo sé. Hay otras formas: corrales seguros, perros pastores y vigilar de noche. Vamos a hablar con él.' },
  { fondo: 'valle', izq: 'sami:feliz', der: 'luis:sonrie', quien: 'Narrador', texto: 'Esa tarde, el tío de Sami retiró la carne. Entendió que cuidar a las ovejas y cuidar a los cóndores no son cosas opuestas.' },
  { fondo: 'valle', izq: 'sami:feliz', der: 'luis', habla: 'der', quien: 'Don Luis', texto: 'Y si ves a alguien cazar cóndores o poner veneno, avisa a un guardaparque o a las autoridades.' },
  { fondo: 'valle', izq: 'sami', der: 'luis', quien: 'Narrador',
    eleccion: {
      pregunta: 'Sami se pregunta: ¿qué puedo hacer yo por los cóndores?',
      opciones: [
        { texto: 'Contarle a mi familia lo que sé del cóndor', respuesta: [{ habla: 'izq', izq: 'sami:feliz', quien: 'Sami', texto: 'Cuando todos saben cómo es el cóndor, todos lo cuidan mejor.' }] },
        { texto: 'Avisar a un guardaparque si veo veneno o cacería', respuesta: [{ habla: 'der', der: 'luis:sonrie', quien: 'Don Luis', texto: 'Eso salva vidas. Avisar a tiempo lo cambia todo.' }] },
        { texto: 'Cuidar el páramo: no botar basura ni quemar los pastizales', respuesta: [{ habla: 'der', der: 'luis:sonrie', quien: 'Don Luis', texto: 'El páramo es la casa del cóndor y también guarda el agua que tomamos todos.' }] }
      ]
    } },
  { fondo: 'valle', izq: 'sami:feliz', der: 'luis:sonrie', habla: 'der', quien: 'Don Luis', texto: 'Todas las respuestas ayudan. Lo importante es empezar.' },

  { fondo: 'noche', izq: 'kuntur', der: 'killa', quien: 'Narrador', texto: 'Pasaron casi dos meses. Kuntur y Killa cuidaron el huevo de día y de noche.' },
  { fondo: 'noche', izq: 'kuntur', der: 'killa:feliz', quien: 'Narrador', texto: 'Una madrugada se oyó un golpecito dentro del huevo… y luego otro.' },
  { fondo: 'noche', izq: 'kuntur:feliz', der: 'killa:feliz', habla: 'der', quien: 'Killa', texto: '¡Kuntur, mira! ¡Ya está saliendo!' },
  { fondo: 'noche', izq: 'kuntur:feliz', der: 'killa:feliz', habla: 'izq', quien: 'Kuntur', texto: 'Qué pequeño es… Se llamará Wayra, que significa viento.' },
  { fondo: 'noche', izq: 'kuntur', der: 'killa:feliz', habla: 'der', quien: 'Killa', texto: 'Aprenderá a planear casi sin aletear, como nosotros.' },
  { fondo: 'noche', izq: 'kuntur', der: 'killa', habla: 'izq', quien: 'Kuntur', texto: 'Si cuidamos su cielo, volará libre. Y para eso necesitamos a las personas que nos cuidan desde abajo.' },

  { fondo: 'nido', izq: 'kuntur:feliz', der: 'killa:feliz', quien: 'Narrador', texto: 'Cuando salió el sol, los Andes brillaron. Un nuevo cóndor había nacido.' },
  { fondo: 'nido', izq: 'kuntur:feliz', der: 'killa:feliz', moraleja: 'Cada cóndor cuenta. El cielo es de todos, y cuidarlo empieza con pequeñas decisiones: no usar veneno, no cazar, avisar a un guardaparque y compartir lo que sabes.' }
];
