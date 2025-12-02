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
  flowState?: {
    initialAnswers?: {
      screenTurnsOn?: boolean | null;
      deviceFreeInColombia?: boolean | null;
    };
    damageFreeAnswer?: boolean | null;
    goodConditionAnswer?: boolean | null;
  };
  productSku?: string | null; // SKU del producto para asociar el trade-in
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
  selectedBrand,
  selectedModel,
  selectedCapacity,
  flowState,
  productSku,
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

    // Construir el objeto de detalles desde el flowState
    const detalles: Record<string, boolean> = {};
    if (flowState?.initialAnswers?.screenTurnsOn !== null && flowState?.initialAnswers?.screenTurnsOn !== undefined) {
      detalles.pantalla_enciende_mas_30_segundos = flowState.initialAnswers.screenTurnsOn;
    }
    if (flowState?.initialAnswers?.deviceFreeInColombia !== null && flowState?.initialAnswers?.deviceFreeInColombia !== undefined) {
      detalles.libre_uso_sin_bloqueo_operador = flowState.initialAnswers.deviceFreeInColombia;
    }
    if (flowState?.damageFreeAnswer !== null && flowState?.damageFreeAnswer !== undefined) {
      detalles.sin_danos_graves = flowState.damageFreeAnswer;
    }
    if (flowState?.goodConditionAnswer !== null && flowState?.goodConditionAnswer !== undefined) {
      detalles.buen_estado = flowState.goodConditionAnswer;
    }

    // IMPORTANTE: Guardar el nuevo trade-in en localStorage
    // Esto es CRÍTICO para usuarios NO logueados, ya que es la única forma de persistir el trade-in
    // También funciona para usuarios logueados como respaldo
    if (globalThis.window !== undefined) {
      try {
        const tradeInData = {
          deviceName,
          value: tradeInValue,
          completed: true,
          detalles: Object.keys(detalles).length > 0 ? detalles : undefined,
        };

        // Si hay un productSku, guardar por SKU (nuevo formato)
        if (productSku) {
          const raw = localStorage.getItem("imagiq_trade_in");
          let tradeIns: Record<string, typeof tradeInData> = {};

          if (raw) {
            try {
              const parsed = JSON.parse(raw);
              // Si es formato nuevo (objeto con SKUs), usarlo
              if (typeof parsed === 'object' && !parsed.deviceName) {
                tradeIns = parsed;
              }
            } catch {
              // Error parsing, usar objeto vacío
            }
          }

          tradeIns[productSku] = tradeInData;
          
          // FORZAR guardado en localStorage - CRÍTICO
          const tradeInString = JSON.stringify(tradeIns);
          localStorage.setItem("imagiq_trade_in", tradeInString);
          
          // Verificar que se guardó correctamente
          const verifySave = localStorage.getItem("imagiq_trade_in");
          if (!verifySave || verifySave !== tradeInString) {
            console.error("❌ ERROR: Trade-In NO se guardó correctamente en localStorage");
            // Reintentar el guardado
            localStorage.setItem("imagiq_trade_in", tradeInString);
          } else {
            console.log("✅ Trade-In guardado correctamente en localStorage para SKU:", productSku);
          }
          
          // Disparar eventos de storage para sincronizar entre tabs y componentes
          try {
            globalThis.dispatchEvent(new CustomEvent("localStorageChange", {
              detail: { key: "imagiq_trade_in" },
            }));
            globalThis.dispatchEvent(new Event("storage"));
          } catch (eventError) {
            console.error("Error disparando eventos de storage:", eventError);
          }
        } else {
          // Formato antiguo (sin SKU) - para compatibilidad
          const tradeInString = JSON.stringify(tradeInData);
          localStorage.setItem("imagiq_trade_in", tradeInString);
          
          // Verificar que se guardó correctamente
          const verifySave = localStorage.getItem("imagiq_trade_in");
          if (!verifySave || verifySave !== tradeInString) {
            console.error("❌ ERROR: Trade-In NO se guardó correctamente en localStorage");
            // Reintentar el guardado
            localStorage.setItem("imagiq_trade_in", tradeInString);
          }
          
          // Disparar eventos de storage
          try {
            globalThis.dispatchEvent(new CustomEvent("localStorageChange", {
              detail: { key: "imagiq_trade_in" },
            }));
            globalThis.dispatchEvent(new Event("storage"));
          } catch (eventError) {
            console.error("Error disparando eventos de storage:", eventError);
          }
        }
      } catch (storageError) {
        console.error("❌ Error guardando en localStorage:", storageError);
        // Reintentar una vez más
        try {
          if (productSku) {
            const raw = localStorage.getItem("imagiq_trade_in");
            let tradeIns: Record<string, typeof tradeInData> = {};
            if (raw) {
              try {
                const parsed = JSON.parse(raw);
                if (typeof parsed === 'object' && !parsed.deviceName) {
                  tradeIns = parsed;
                }
              } catch {
                // Ignorar
              }
            }
            tradeIns[productSku] = tradeInData;
            localStorage.setItem("imagiq_trade_in", JSON.stringify(tradeIns));
          } else {
            localStorage.setItem("imagiq_trade_in", JSON.stringify(tradeInData));
          }
        } catch (retryError) {
          console.error("❌ Error en reintento de guardado:", retryError);
        }
      }
    }

    // Llamar al callback con la información completa
    onCompleteTradeIn?.(deviceName, tradeInValue);

    resetForm();
    resetFlow();
    onContinue?.();
    onClose();
  }, [resetForm, resetFlow, onContinue, onClose, onCompleteTradeIn, tradeInValue, selectedBrand, selectedModel, selectedCapacity, flowState, productSku]);

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
