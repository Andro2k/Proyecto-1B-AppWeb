/*
  Guardianes del Cóndor · mando de dos jugadores
  Placa: Arduino Uno / Nano / Mega (cualquiera con USB serie).  Velocidad: 115200 baudios.

  Cada botón conecta su pin a GND (usa resistencia interna INPUT_PULLUP, no hace falta resistencia externa).
  Envía una línea por cambio:  <jugador><botón><estado>\n
    jugador: 1 | 2     botón: I izquierda, D derecha, A aletear, P picada     estado: 1 pulsado, 0 soltado
    pausa:   S1 / S0
  Ejemplo: pulsar «aletear» del jugador 1 envía "1A1" y al soltar "1A0".
*/
struct Boton { uint8_t pin; const char* codigo; bool estado; unsigned long cambio; };

Boton botones[] = {
  { 2, "1I", false, 0 }, { 3, "1D", false, 0 }, { 4, "1A", false, 0 }, { 5, "1P", false, 0 },   // jugador 1
  { 6, "2I", false, 0 }, { 7, "2D", false, 0 }, { 8, "2A", false, 0 }, { 9, "2P", false, 0 },   // jugador 2
  { 10, "S", false, 0 }                                                                          // pausa
};
const uint8_t N = sizeof(botones) / sizeof(botones[0]);
const unsigned long ANTIREBOTE_MS = 15;

void setup() {
  Serial.begin(115200);
  for (uint8_t i = 0; i < N; i++) pinMode(botones[i].pin, INPUT_PULLUP);
}

void loop() {
  unsigned long ahora = millis();
  for (uint8_t i = 0; i < N; i++) {
    bool pulsado = digitalRead(botones[i].pin) == LOW;
    if (pulsado != botones[i].estado && ahora - botones[i].cambio > ANTIREBOTE_MS) {
      botones[i].estado = pulsado; botones[i].cambio = ahora;
      Serial.print(botones[i].codigo); Serial.println(pulsado ? 1 : 0);
    }
  }
}
