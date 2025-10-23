/**
 * New Trade-In Flow Questions
 * Nuevo flujo de preguntas para el proceso de Entrego y Estreno
 */

export interface QuestionData {
  id: string;
  question: string;
  details?: string[];
}

/**
 * Paso 2: Preguntas iniciales de elegibilidad
 * Si alguna es "No" → Usuario descalifica del programa
 */
export const INITIAL_ELIGIBILITY_QUESTIONS: readonly QuestionData[] = [
  {
    id: "screen-turns-on",
    question:
      "1. ¿La pantalla de su equipo enciende por más de 30 segundos sin estar conectado a una fuente de energía?",
  },
  {
    id: "device-free-colombia",
    question:
      "2. ¿Su equipo se encuentra libre de uso en Colombia? ¿El IMEI de su equipo se encuentra libre de bloqueos y reportes? (en el caso de smartphones)",
  },
] as const;

/**
 * Paso 3: Pregunta sobre daños graves
 * Si "No" → Estado C → Ofrecer finalizar en tienda
 * Si "Sí" → Continuar a Paso 4
 */
export const DAMAGE_FREE_QUESTION: QuestionData = {
  id: "damage-free",
  question: "3. ¿El equipo está libre de daños graves?",
  details: [
    "- Realiza llamadas telefónicas (en caso de smartphones).",
    "- El touchscreen y la conectividad (Wifi, Bluetooth y Red Móvil) funcionan correctamente.",
    "- No está doblado, mojado o con daños profundos.",
  ],
} as const;

/**
 * Paso 4: Pregunta sobre buen estado general
 * Si "Sí" → Estado A → Ofrecer finalizar en tienda
 * Si "No" → Estado B → Ofrecer finalizar en tienda
 */
export const GOOD_CONDITION_DETAILED_QUESTION: QuestionData = {
  id: "good-condition-detailed",
  question: "4. ¿El equipo está en buen estado?",
  details: [
    "- La pantalla, el vidrio posterior y la lente de la cámara NO están rotos, separados o con defectos profundos (Perceptibles al tacto).",
    "- El equipo NO cuenta con modificaciones en la superficie como incrustaciones, pinturas, grabados, etc.",
    "- NO hay evidencia de daño por humedad en los puertos, cámaras, ranuras SIM, SD o pantalla.",
    "- El micrófono inferior, altavoces, vibrador y auriculares FUNCIONAN CORRECTAMENTE.",
    "- Las cámaras pueden tomar fotos y videos.",
    "- El face ID o huella FUNCIONAN CORRECTAMENTE.",
  ],
} as const;

/**
 * Mensaje de descalificación
 */
export const DISQUALIFICATION_MESSAGE =
  'Lastimosamente, no puedes aplicar al plan "Entrego y Estreno"' as const;

/**
 * Pregunta de finalización en tienda
 */
export const STORE_FINISH_QUESTION =
  "¿Deseas terminar el proceso en tu tienda más cercana y recibe el descuento estimado de tu equipo de forma inmediata?" as const;

/**
 * Estados del dispositivo según las respuestas
 */
export enum DeviceState {
  A = "A", // Respondió "Sí" a la pregunta 4
  B = "B", // Respondió "No" a la pregunta 4
  C = "C", // Respondió "No" a la pregunta 3
}
