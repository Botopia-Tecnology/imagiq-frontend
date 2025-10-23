import React from "react";
import YesNoButtons from "./shared/YesNoButtons";

interface InitialQuestionsSectionProps {
  readonly screenTurnsOn: boolean | null;
  readonly deviceFreeInColombia: boolean | null;
  readonly onScreenTurnsOnAnswer: (answer: boolean) => void;
  readonly onDeviceFreeAnswer: (answer: boolean) => void;
}

const FONT_FAMILY = "SamsungSharpSans";

export default function InitialQuestionsSection({
  screenTurnsOn,
  deviceFreeInColombia,
  onScreenTurnsOnAnswer,
  onDeviceFreeAnswer,
}: InitialQuestionsSectionProps) {
  return (
    <div className="px-6 md:px-10 py-6 space-y-8">
      <div className="pb-6 border-b border-gray-200">
        <div className="flex items-start justify-between gap-4 mb-3">
          <h3
            className="text-xs md:text-sm text-[#222] font-bold max-w-[70%]"
            style={{ fontFamily: FONT_FAMILY }}
          >
            ¿La pantalla de su equipo enciende por más de 30 segundos sin
            estar conectado a una fuente de energía?
          </h3>
          <YesNoButtons value={screenTurnsOn} onAnswer={onScreenTurnsOnAnswer} />
        </div>
        <div className="text-[11px] md:text-xs text-gray-600 space-y-0.5 mt-3">
          <p>*Puede estar encendido más de 30 segundos (la batería tiene buen estado).</p>
          <p>*Realiza llamadas telefónicas (en caso de smartphones).</p>
          <p>
            *El touchscreen y la conectividad (Wifi, Bluetooth y Red Móvil)
            funcionan correctamente.
          </p>
          <p>*No está doblado, mojado o con daños profundos.</p>
        </div>
      </div>

      <div className="pb-6 border-b border-gray-200">
        <div className="flex items-start justify-between gap-4 mb-3">
          <h3
            className="text-xs md:text-sm text-[#222] font-bold max-w-[70%]"
            style={{ fontFamily: FONT_FAMILY }}
          >
            ¿Su equipo se encuentra libre de uso en Colombia?
            <br />
            ¿El IMEI de su equipo se encuentra libre de bloqueos y reportes? (en
            el caso de smartphones)
          </h3>
          <YesNoButtons value={deviceFreeInColombia} onAnswer={onDeviceFreeAnswer} />
        </div>
        <div className="text-[11px] md:text-xs text-gray-600 space-y-0.5 mt-3">
          <p>*El IMEI no está reportado (en caso de smartphones).</p>
          <p>
            *No cuenta con bloqueos ni cuentas registradas en Find My iPhone /
            Find My Device / Samsung ID / Google ID.
          </p>
          <p>*El face ID o huella funciona correctamente.</p>
        </div>
      </div>
    </div>
  );
}
