import { Check } from "lucide-react";

interface Step {
  id: number;
  name: string;
  required: boolean;
}

interface StepIndicatorProps {
  steps: Step[];
  currentStep: number;
}

export function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
  return (
    <>
      {/* Mobile: Horizontal */}
      <div className="flex items-center justify-between md:hidden">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center flex-1">
            <div className="flex flex-col items-center flex-1">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                  currentStep > step.id
                    ? "bg-green-500 text-white"
                    : currentStep === step.id
                    ? "bg-black text-white ring-4 ring-gray-200"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {currentStep > step.id ? <Check className="w-5 h-5" /> : step.id}
              </div>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`h-0.5 flex-1 transition-all ${
                  currentStep > step.id ? "bg-green-500" : "bg-gray-200"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Desktop: Vertical */}
      <div className="hidden md:flex flex-col">
        {steps.map((step, index) => (
          <div key={step.id} className="flex flex-col">
            <div className="flex items-center gap-4">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all flex-shrink-0 ${
                  currentStep > step.id
                    ? "bg-green-500 text-white"
                    : currentStep === step.id
                    ? "bg-black text-white ring-4 ring-gray-200"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {currentStep > step.id ? <Check className="w-5 h-5" /> : step.id}
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-900">{step.name}</span>
                {!step.required && <span className="text-xs text-gray-500">Opcional</span>}
              </div>
            </div>
            {index < steps.length - 1 && (
              <div className={`ml-5 w-0.5 h-8 my-2 transition-all ${
                currentStep > step.id ? "bg-green-500" : "bg-gray-200"
              }`} />
            )}
          </div>
        ))}
      </div>
    </>
  );
}
