import type { TradeInStep } from "../hooks/useTradeInFlow";

interface InitialAnswers {
  screenTurnsOn: boolean | null;
  deviceFreeInColombia: boolean | null;
}

export function isStepValid(
  currentStep: TradeInStep,
  isStep1Valid: boolean,
  initialAnswers: InitialAnswers,
  damageFreeAnswer: boolean | null,
  goodConditionAnswer: boolean | null,
  imeiInput: string
): boolean {
  if (currentStep === 1) return isStep1Valid;

  if (currentStep === 2) {
    return initialAnswers.screenTurnsOn !== null &&
           initialAnswers.deviceFreeInColombia !== null;
  }

  if (currentStep === 3) {
    return damageFreeAnswer !== null && goodConditionAnswer !== null;
  }

  if (currentStep === 6) return imeiInput.trim().length === 15;

  return false;
}
