import { useState, useEffect } from "react";
import { tradeInEndpoints } from "@/lib/api";
import { extractCodMarca, extractCodModelo } from "./useTradeInData";
import type { Brand, DeviceCapacity } from "../types";
import type { DeviceState } from "../constants/tradeInQuestions";

interface UseTradeInValueProps {
  currentStep: number;
  selectedBrand: Brand | null;
  selectedCapacity: DeviceCapacity | null;
  deviceState: DeviceState | null;
}

export function useTradeInValue({
  currentStep,
  selectedBrand,
  selectedCapacity,
  deviceState,
}: UseTradeInValueProps) {
  const [tradeInValue, setTradeInValue] = useState<number>(0);
  const [calculatingValue, setCalculatingValue] = useState(false);

  useEffect(() => {
    const calculateTradeInValue = async () => {
      if (
        currentStep === 6 &&
        selectedBrand &&
        selectedCapacity &&
        deviceState
      ) {
        const codMarca = extractCodMarca(selectedBrand.id);
        const codModelo = extractCodModelo(selectedCapacity.id);

        if (codMarca && codModelo) {
          setCalculatingValue(true);
          try {
            const response = await tradeInEndpoints.calculateValue({
              codMarca,
              codModelo,
              grado: deviceState,
            });

            if (response.success && response.data) {
              setTradeInValue(response.data.valorRetoma);
            } else {
              setTradeInValue(0);
            }
          } catch (error) {
            setTradeInValue(0);
          } finally {
            setCalculatingValue(false);
          }
        }
      }
    };

    calculateTradeInValue();
  }, [currentStep, deviceState, selectedBrand, selectedCapacity]);

  return { tradeInValue, calculatingValue };
}
