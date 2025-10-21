import React from "react";

interface ModalFooterProps {
  currentStep: 1 | 2 | 3;
  isStepValid: boolean;
  onClose: () => void;
  onBack: () => void;
  onContinue: () => void;
}

export default function ModalFooter({
  currentStep,
  isStepValid,
  onClose,
  onBack,
  onContinue,
}: ModalFooterProps) {
  return (
    <div className="sticky bottom-0 bg-white px-6 md:px-10 pt-4 pb-6 md:pb-8 rounded-b-3xl">
      <div className="h-0.5 bg-gray-300 -mx-6 md:-mx-10 mb-6"></div>

      {/* Step 1 Footer: Cerrar + Continuar con la compra */}
      {currentStep === 1 && (
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 bg-transparent border-2 border-[#222] text-[#222] py-3 md:py-4 rounded-full text-sm md:text-base font-semibold hover:bg-gray-50 transition-colors"
          >
            Cerrar
          </button>
          <button
            onClick={onContinue}
            disabled={!isStepValid}
            className={`flex-1 py-3 md:py-4 rounded-full text-sm md:text-base font-semibold transition-colors ${
              isStepValid
                ? "bg-[#0099FF] text-white hover:bg-[#0088EE] cursor-pointer"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            Continuar con la compra
          </button>
        </div>
      )}

      {/* Step 2 Footer: Regresar + Continuar con la compra */}
      {currentStep === 2 && (
        <div className="flex gap-3">
          <button
            onClick={onBack}
            className="flex-1 bg-transparent border-2 border-[#222] text-[#222] py-3 md:py-4 rounded-full text-sm md:text-base font-semibold hover:bg-gray-50 transition-colors"
          >
            Regresar
          </button>
          <button
            onClick={onContinue}
            disabled={!isStepValid}
            className={`flex-1 py-3 md:py-4 rounded-full text-sm md:text-base font-semibold transition-colors ${
              isStepValid
                ? "bg-[#0099FF] text-white hover:bg-[#0088EE] cursor-pointer"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            Continuar con la compra
          </button>
        </div>
      )}

      {/* Step 3 Footer: Regresar + Continuar */}
      {currentStep === 3 && (
        <div className="flex gap-3">
          <button
            onClick={onBack}
            className="flex-1 bg-transparent border-2 border-[#222] text-[#222] py-3 md:py-4 rounded-full text-sm md:text-base font-semibold hover:bg-gray-50 transition-colors"
          >
            Regresar
          </button>
          <button
            onClick={onContinue}
            disabled={!isStepValid}
            className={`flex-1 py-3 md:py-4 rounded-full text-sm md:text-base font-semibold transition-colors ${
              isStepValid
                ? "bg-[#0099FF] text-white hover:bg-[#0088EE] cursor-pointer"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            Continuar
          </button>
        </div>
      )}
    </div>
  );
}
