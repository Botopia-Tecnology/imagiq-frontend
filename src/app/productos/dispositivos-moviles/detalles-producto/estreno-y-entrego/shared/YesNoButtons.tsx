import React from "react";

interface YesNoButtonsProps {
  readonly value: boolean | null;
  readonly onAnswer: (answer: boolean) => void;
}

export default function YesNoButtons({ value, onAnswer }: YesNoButtonsProps) {
  const buttonClass = (isSelected: boolean) => `
    px-5 py-1.5 rounded-full border-2 font-normal text-xs
    transition-all duration-200
    ${
      isSelected
        ? "border-[#222] bg-[#222] text-white"
        : "border-gray-300 bg-white text-[#222] hover:border-gray-400"
    }
  `;

  return (
    <div className="flex gap-3 shrink-0">
      <button
        onClick={() => onAnswer(true)}
        className={buttonClass(value === true)}
        style={{ fontFamily: "SamsungSharpSans" }}
      >
        Sí
      </button>
      <button
        onClick={() => onAnswer(false)}
        className={buttonClass(value === false)}
        style={{ fontFamily: "SamsungSharpSans" }}
      >
        No
      </button>
    </div>
  );
}
