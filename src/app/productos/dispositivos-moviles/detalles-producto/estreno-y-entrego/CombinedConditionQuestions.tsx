import React from "react";
import YesNoButtons from "./shared/YesNoButtons";
import {
  DAMAGE_FREE_QUESTION,
  GOOD_CONDITION_DETAILED_QUESTION,
} from "./constants/tradeInQuestions";

interface CombinedConditionQuestionsProps {
  readonly damageFreeAnswer: boolean | null;
  readonly goodConditionAnswer: boolean | null;
  readonly onDamageFreeAnswer: (answer: boolean) => void;
  readonly onGoodConditionAnswer: (answer: boolean) => void;
}

const FONT_FAMILY = "SamsungSharpSans";

export default function CombinedConditionQuestions({
  damageFreeAnswer,
  goodConditionAnswer,
  onDamageFreeAnswer,
  onGoodConditionAnswer,
}: CombinedConditionQuestionsProps) {
  return (
    <div className="px-6 md:px-10 py-6 space-y-8">
      <div className="pb-6 border-b border-gray-200">
        <div className="flex items-start justify-between gap-4 mb-3">
          <h3
            className="text-xs md:text-sm text-[#222] font-bold max-w-[70%]"
            style={{ fontFamily: FONT_FAMILY }}
          >
            {DAMAGE_FREE_QUESTION.question}
          </h3>
          <YesNoButtons value={damageFreeAnswer} onAnswer={onDamageFreeAnswer} />
        </div>
        {DAMAGE_FREE_QUESTION.details && (
          <div className="text-[11px] md:text-xs text-gray-600 space-y-0.5 mt-3">
            {DAMAGE_FREE_QUESTION.details.map((detail) => (
              <p key={detail}>{detail}</p>
            ))}
          </div>
        )}
      </div>

      <div className="pb-6 border-b border-gray-200">
        <div className="flex items-start justify-between gap-4 mb-3">
          <h3
            className="text-xs md:text-sm text-[#222] font-bold max-w-[70%]"
            style={{ fontFamily: FONT_FAMILY }}
          >
            {GOOD_CONDITION_DETAILED_QUESTION.question}
          </h3>
          <YesNoButtons value={goodConditionAnswer} onAnswer={onGoodConditionAnswer} />
        </div>
        {GOOD_CONDITION_DETAILED_QUESTION.details && (
          <div className="text-[11px] md:text-xs text-gray-600 space-y-0.5 mt-3">
            {GOOD_CONDITION_DETAILED_QUESTION.details.map((detail) => (
              <p key={detail}>{detail}</p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
