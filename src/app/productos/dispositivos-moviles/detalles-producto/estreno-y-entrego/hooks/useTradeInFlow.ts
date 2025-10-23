import { useState, useCallback } from "react";
import { DeviceState } from "../constants/tradeInQuestions";

/**
 * Tipos de pasos en el flujo de trade-in
 * 1: Selección de dispositivo
 * 2: Preguntas iniciales de elegibilidad
 * 3: Preguntas sobre estado del dispositivo (daños y condición)
 * 6: Sección IMEI
 */
export type TradeInStep = 1 | 2 | 3 | 6;

interface InitialQuestionAnswers {
  screenTurnsOn: boolean | null;
  deviceFreeInColombia: boolean | null;
}

interface TradeInFlowState {
  currentStep: TradeInStep;
  initialAnswers: InitialQuestionAnswers;
  damageFreeAnswer: boolean | null;
  goodConditionAnswer: boolean | null;
  deviceState: DeviceState | null;
  isDisqualified: boolean;
}

interface UseTradeInFlowReturn {
  flowState: TradeInFlowState;
  setCurrentStep: (step: TradeInStep) => void;
  handleInitialAnswer: (
    question: keyof InitialQuestionAnswers,
    answer: boolean
  ) => void;
  handleDamageFreeAnswer: (answer: boolean) => void;
  handleGoodConditionAnswer: (answer: boolean) => void;
  canContinueFromStep2: () => boolean;
  resetFlow: () => void;
}

const initialState: TradeInFlowState = {
  currentStep: 1,
  initialAnswers: {
    screenTurnsOn: null,
    deviceFreeInColombia: null,
  },
  damageFreeAnswer: null,
  goodConditionAnswer: null,
  deviceState: null,
  isDisqualified: false,
};

/**
 * Hook para manejar el flujo de trade-in
 */
export function useTradeInFlow(): UseTradeInFlowReturn {
  const [flowState, setFlowState] = useState<TradeInFlowState>(initialState);

  const setCurrentStep = useCallback((step: TradeInStep) => {
    setFlowState((prev) => ({ ...prev, currentStep: step }));
  }, []);

  const handleInitialAnswer = useCallback(
    (question: keyof InitialQuestionAnswers, answer: boolean) => {
      setFlowState((prev) => ({
        ...prev,
        initialAnswers: {
          ...prev.initialAnswers,
          [question]: answer,
        },
      }));
    },
    []
  );

  const handleDamageFreeAnswer = useCallback((answer: boolean) => {
    setFlowState((prev) => ({
      ...prev,
      damageFreeAnswer: answer,
      // Si responde "No", establecer estado C
      deviceState: answer ? prev.deviceState : DeviceState.C,
    }));
  }, []);

  const handleGoodConditionAnswer = useCallback((answer: boolean) => {
    setFlowState((prev) => ({
      ...prev,
      goodConditionAnswer: answer,
      deviceState: answer ? DeviceState.A : DeviceState.B,
    }));
  }, []);

  const canContinueFromStep2 = useCallback((): boolean => {
    const { screenTurnsOn, deviceFreeInColombia } = flowState.initialAnswers;

    // Si alguna es null, todavía no han respondido todas
    if (screenTurnsOn === null || deviceFreeInColombia === null) {
      return false;
    }

    // Si alguna es false, el usuario está descalificado
    if (!screenTurnsOn || !deviceFreeInColombia) {
      setFlowState((prev) => ({ ...prev, isDisqualified: true }));
      return false;
    }

    // Ambas son true, puede continuar
    return true;
  }, [flowState.initialAnswers]);

  const resetFlow = useCallback(() => {
    setFlowState(initialState);
  }, []);

  return {
    flowState,
    setCurrentStep,
    handleInitialAnswer,
    handleDamageFreeAnswer,
    handleGoodConditionAnswer,
    canContinueFromStep2,
    resetFlow,
  };
}
