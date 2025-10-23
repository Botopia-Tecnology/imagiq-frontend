import React from "react";

interface ProgressBarProps {
  readonly currentStep: 1 | 2 | 3 | 4 | 5 | 6;
  readonly totalSteps?: number;
}

/**
 * Barra de progreso dinámica para el flujo de trade-in
 * Pasos visuales:
 * 1. Selección de dispositivo (Step 1)
 * 2. Preguntas iniciales 1 y 2 (Step 2)
 * 3. Preguntas de condición 3 y 4 (Step 3)
 * 4. IMEI (Step 6)
 */
export default function ProgressBar({
  currentStep,
  totalSteps = 4
}: ProgressBarProps) {
  // Mapear el paso actual al progreso visual
  // 1 -> 1, 2 -> 2, 3 -> 3, 6 -> 4
  const getVisualStep = () => {
    if (currentStep === 1) return 1;
    if (currentStep === 2) return 2;
    if (currentStep === 3) return 3;
    if (currentStep === 6) return 4;
    return 1;
  };

  const visualStep = getVisualStep();

  return (
    <div>
      <div className="flex gap-2">
        {Array.from({ length: totalSteps }, (_, index) => {
          const stepNumber = index + 1;
          return (
            <div key={`progress-step-${stepNumber}`} className="flex-1">
              <div
                className={`h-1 rounded-full transition-colors ${
                  visualStep >= stepNumber ? "bg-[#222]" : "bg-gray-300"
                }`}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
