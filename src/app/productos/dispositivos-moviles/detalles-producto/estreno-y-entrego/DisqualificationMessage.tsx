import React from "react";
import { AlertCircle } from "lucide-react";
import { DISQUALIFICATION_MESSAGE } from "./constants/tradeInQuestions";

interface DisqualificationMessageProps {
  readonly onClose: () => void;
}

/**
 * Componente que muestra el mensaje de descalificación
 * cuando el usuario no cumple con los requisitos iniciales
 */
export default function DisqualificationMessage({
  onClose,
}: Readonly<DisqualificationMessageProps>) {
  return (
    <div className="px-6 md:px-10 py-8 flex flex-col items-center justify-center min-h-[300px]">
      <div className="flex flex-col items-center text-center max-w-md">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
          <AlertCircle className="w-8 h-8 text-red-600" />
        </div>

        <h3
          className="text-2xl font-bold text-[#222] mb-4"
          style={{ fontFamily: "SamsungSharpSans" }}
        >
          {DISQUALIFICATION_MESSAGE}
        </h3>

        <p
          className="text-base text-gray-600 mb-8"
          style={{ fontFamily: "SamsungSharpSans" }}
        >
          Tu dispositivo no cumple con los requisitos mínimos para participar
          en el programa de trade-in.
        </p>

        <button
          onClick={onClose}
          className="
            px-8 py-3 bg-[#007AFF] text-white rounded-xl
            font-medium text-base hover:bg-[#0056b3]
            transition-colors duration-200
          "
          style={{ fontFamily: "SamsungSharpSans" }}
        >
          Entendido
        </button>
      </div>
    </div>
  );
}
