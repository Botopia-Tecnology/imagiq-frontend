import React from "react";

interface ModalFooterProps {
  readonly currentStep: 1 | 2 | 3 | 4 | 5 | 6;
  readonly isStepValid: boolean;
  readonly onClose: () => void;
  readonly onBack?: () => void;
  readonly onContinue: () => void;
  readonly hideFooter?: boolean;
}

export default function ModalFooter({
  currentStep,
  isStepValid,
  onClose,
  onBack,
  onContinue,
  hideFooter = false,
}: ModalFooterProps) {
  // No mostrar footer si hideFooter es true o en pasos especiales
  if (hideFooter) {
    return null;
  }

  return (
    <div className="sticky bottom-0 bg-white px-6 md:px-10 pt-4 pb-6 md:pb-8 rounded-b-3xl">
      <div className="h-0.5 bg-gray-300 -mx-6 md:-mx-10 mb-4"></div>

      {/* Step 1: Cerrar + Continuar con la compra */}
      {currentStep === 1 && (
        <div className="flex gap-3 justify-center">
          <button
            onClick={onClose}
            className="bg-transparent border-2 border-[#222] text-[#222] py-2 px-8 rounded-full text-sm font-medium hover:bg-gray-50 transition-colors"
            style={{ fontFamily: "SamsungSharpSans" }}
          >
            Cerrar
          </button>
          <button
            onClick={onContinue}
            disabled={!isStepValid}
            className={`py-2 px-8 rounded-full text-sm font-medium transition-colors ${
              isStepValid
                ? "bg-[#0099FF] text-white hover:bg-[#0088EE] cursor-pointer"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
            style={{ fontFamily: "SamsungSharpSans" }}
          >
            Continuar con la compra
          </button>
        </div>
      )}

      {/* Steps 2, 3, 6: Regresar + Continuar */}
      {(currentStep === 2 || currentStep === 3 || currentStep === 6) && (
        <div className="flex gap-3 justify-center">
          <button
            onClick={onBack}
            className="bg-transparent border-2 border-[#222] text-[#222] py-2 px-8 rounded-full text-sm font-medium hover:bg-gray-50 transition-colors"
            style={{ fontFamily: "SamsungSharpSans" }}
          >
            Regresar
          </button>
          <button
            onClick={onContinue}
            disabled={!isStepValid}
            className={`py-2 px-8 rounded-full text-sm font-medium transition-colors ${
              isStepValid
                ? "bg-[#0099FF] text-white hover:bg-[#0088EE] cursor-pointer"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
            style={{ fontFamily: "SamsungSharpSans" }}
          >
            Continuar
          </button>
        </div>
      )}
    </div>
  );
}
