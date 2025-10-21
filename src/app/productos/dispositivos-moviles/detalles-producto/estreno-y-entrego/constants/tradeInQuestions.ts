/**
 * Trade-In Condition Questions
 * Preguntas de verificación de condición del dispositivo para el proceso de trade-in
 */

export interface ConditionQuestionData {
  id: string;
  question: string;
  details: string[];
}

export const CONDITION_QUESTIONS: readonly ConditionQuestionData[] = [
  {
    id: "no-damage",
    question: "¿El equipo está libre de daños graves?",
    details: [
      "*Puede estar encendido más de 30 segundos (la batería tiene buen estado).",
      "*Realiza llamadas telefónicas (en caso de smartphones).",
      "*El touchscreen y la conectividad (Wifi, Bluetooth y Red Móvil) funcionan correctamente.",
      "*No está doblado, mojado o con daños profundos.",
    ],
  },
  {
    id: "good-condition",
    question: "¿El equipo está en buen estado?",
    details: [
      "*La pantalla, el vidrio posterior y la lente de la cámara no están rotos, separados o con defectos profundos.",
      "*El equipo no cuenta con modificaciones en la superficie como incrustaciones, pinturas, grabados, etc.",
      "*No hay evidencia de daño por humedad en los puertos, cámara, ranuras SIM, SD o pantalla.",
      "*El micrófono inferior, altavoces, vibrador y auriculares están bien.",
      "*Las cámaras pueden tomar fotos y videos.",
    ],
  },
  {
    id: "unlocked-colombia",
    question: "¿El equipo está libre para uso en Colombia?",
    details: [
      "*El IMEI no está reportado (en caso de smartphones).",
      "*No cuenta con bloqueos ni cuentas registradas en Find My iPhone / Find My Device / Samsung ID / Google ID.",
      "*El face ID o huella funciona correctamente.",
    ],
  },
] as const;
