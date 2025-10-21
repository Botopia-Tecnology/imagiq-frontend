import React from "react";

interface ConditionQuestionProps {
  question: string;
  details: string[];
  answer: boolean | null;
  onAnswer: (answer: boolean) => void;
  isLast: boolean;
}

export default function ConditionQuestion({
  question,
  details,
  answer,
  onAnswer,
  isLast,
}: ConditionQuestionProps) {
  return (
    <div className="space-y-2">
      {/* Question with buttons on the right */}
      <div className="flex items-start justify-between gap-4">
        <h3 className="text-sm font-semibold text-[#222] flex-1">{question}</h3>
        <div className="flex gap-2 flex-shrink-0">
          <button
            onClick={() => onAnswer(true)}
            className={`px-5 py-1.5 rounded-full text-sm font-medium transition-all ${
              answer === true
                ? "bg-[#222] text-white border-2 border-[#222]"
                : "bg-white text-[#222] border-2 border-gray-300 hover:border-gray-400"
            }`}
          >
            Sí
          </button>
          <button
            onClick={() => onAnswer(false)}
            className={`px-5 py-1.5 rounded-full text-sm font-medium transition-all ${
              answer === false
                ? "bg-[#222] text-white border-2 border-[#222]"
                : "bg-white text-[#222] border-2 border-gray-300 hover:border-gray-400"
            }`}
          >
            No
          </button>
        </div>
      </div>

      {/* Details */}
      <div className="space-y-1">
        {details.map((detail, idx) => (
          <p key={idx} className="text-xs text-gray-600 leading-relaxed">
            {detail}
          </p>
        ))}
      </div>

      {/* Divider between questions */}
      {!isLast && <div className="h-px bg-gray-200 my-4"></div>}
    </div>
  );
}
