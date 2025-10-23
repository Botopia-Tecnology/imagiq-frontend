import { useCallback } from "react";
import type { TradeInStep } from "./useTradeInFlow";
import type { Brand, DeviceCapacity, DeviceCategory, DeviceModel } from "../types";
import { DeviceState } from "../constants/tradeInQuestions";

interface StepTitle {
  title: string;
  subtitle: string | null;
}

interface UseTradeInHandlersProps {
  setCurrentStep: (step: TradeInStep) => void;
  canContinueFromStep2: () => boolean;
  resetForm: () => void;
  resetFlow: () => void;
  onClose: () => void;
  onContinue?: () => void;
  onCancelWithoutCompletion?: () => void;
  onCompleteTradeIn?: (deviceName: string, value: number) => void;
  tradeInValue: number;
  imeiInput: string;
  selectedBrand: Brand | null;
  selectedModel: DeviceModel | null;
  selectedCapacity: DeviceCapacity | null;
  categories: DeviceCategory[];
  selectedCategory: string;
  deviceState: DeviceState | null;
}

export function useTradeInHandlers({
  setCurrentStep,
  canContinueFromStep2,
  resetForm,
  resetFlow,
  onClose,
  onContinue,
  onCancelWithoutCompletion,
  onCompleteTradeIn,
  tradeInValue,
  imeiInput,
  selectedBrand,
  selectedModel,
  selectedCapacity,
  categories,
  selectedCategory,
  deviceState,
}: UseTradeInHandlersProps) {
  const handleClose = useCallback(() => {
    resetForm();
    resetFlow();
    onCancelWithoutCompletion?.(); // Resetear a NO cuando se cierra sin completar
    onClose();
  }, [resetForm, resetFlow, onCancelWithoutCompletion, onClose]);

  const handleContinueStep1 = useCallback(() => setCurrentStep(2), [setCurrentStep]);

  const handleContinueStep2 = useCallback(() => {
    if (canContinueFromStep2()) {
      setCurrentStep(3);
    }
  }, [canContinueFromStep2, setCurrentStep]);

  const handleContinueStep3 = useCallback(() => {
    setCurrentStep(6);
  }, [setCurrentStep]);

  const handleFinalContinue = useCallback(() => {
    // Completó el proceso exitosamente
    // Construir el nombre del dispositivo
    const deviceName = `${selectedBrand?.name || ''} ${selectedModel?.name || ''} ${selectedCapacity?.name || ''}`.trim();

    // Llamar al callback con la información completa
    onCompleteTradeIn?.(deviceName, tradeInValue);

    resetForm();
    resetFlow();
    onContinue?.();
    onClose();
  }, [resetForm, resetFlow, onContinue, onClose, onCompleteTradeIn, tradeInValue, selectedBrand, selectedModel, selectedCapacity]);

  const getStepTitle = useCallback((currentStep: TradeInStep): StepTitle => {
    switch (currentStep) {
      case 1:
        return {
          title: "Vamos a empezar:",
          subtitle: "¿Cuál dispositivo deseas entregar?",
        };
      case 2:
        return {
          title: "Verificación de elegibilidad",
          subtitle: "Por favor responde las siguientes preguntas",
        };
      case 3:
        return {
          title: "Condición del dispositivo",
          subtitle: "Preguntas sobre el estado de tu equipo",
        };
      case 6:
        return {
          title: "Casi listo",
          subtitle: "Por favor ingresa tu número de IMEI",
        };
      default:
        return {
          title: "",
          subtitle: null,
        };
    }
  }, []);

  const getContinueHandler = useCallback((currentStep: TradeInStep) => {
    if (currentStep === 1) return handleContinueStep1;
    if (currentStep === 2) return handleContinueStep2;
    if (currentStep === 3) return handleContinueStep3;
    return handleFinalContinue;
  }, [handleContinueStep1, handleContinueStep2, handleContinueStep3, handleFinalContinue]);

  const getBackHandler = useCallback((currentStep: TradeInStep) => {
    if (currentStep === 2) return () => setCurrentStep(1);
    if (currentStep === 3) return () => setCurrentStep(2);
    if (currentStep === 6) return () => setCurrentStep(3);
    return () => setCurrentStep(1);
  }, [setCurrentStep]);

  return {
    handleClose,
    getStepTitle,
    getContinueHandler,
    getBackHandler,
  };
}
