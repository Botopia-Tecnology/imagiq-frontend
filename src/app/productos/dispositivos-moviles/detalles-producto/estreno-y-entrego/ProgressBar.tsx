import React from "react";

interface ProgressBarProps {
  currentStep: 1 | 2 | 3;
}

export default function ProgressBar({ currentStep }: ProgressBarProps) {
  return (
    <div>
      <div className="flex gap-2">
        {/* Step 1 */}
        <div className="flex-1">
          <div
            className={`h-1 rounded-full transition-colors ${
              currentStep >= 1 ? "bg-[#222]" : "bg-gray-300"
            }`}
          ></div>
        </div>
        {/* Step 2 */}
        <div className="flex-1">
          <div
            className={`h-1 rounded-full transition-colors ${
              currentStep >= 2 ? "bg-[#222]" : "bg-gray-300"
            }`}
          ></div>
        </div>
        {/* Step 3 */}
        <div className="flex-1">
          <div
            className={`h-1 rounded-full transition-colors ${
              currentStep >= 3 ? "bg-[#222]" : "bg-gray-300"
            }`}
          ></div>
        </div>
      </div>
    </div>
  );
}
