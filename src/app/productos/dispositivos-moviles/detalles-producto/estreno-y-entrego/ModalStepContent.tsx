import React, { useEffect } from "react";
import DeviceCategorySelector from "./DeviceCategorySelector";
import BrandDropdown from "./BrandDropdown";
import SimpleDropdown from "./SimpleDropdown";
import TradeInInformation from "./TradeInInformation";
import IMEIInputSection from "./IMEIInputSection";
import InitialQuestionsSection from "./InitialQuestionsSection";
import CombinedConditionQuestions from "./CombinedConditionQuestions";
import DisqualificationMessage from "./DisqualificationMessage";
import type {
  Brand,
  DeviceModel,
  DeviceCapacity,
  DeviceCategory,
} from "./types";
import type { TradeInStep } from "./hooks/useTradeInFlow";

interface ModalStepContentProps {
  readonly currentStep: TradeInStep;
  readonly isDisqualified: boolean;
  readonly loadingData: boolean;
  readonly selectedCategory: string;
  readonly selectedBrand: Brand | null;
  readonly selectedModel: DeviceModel | null;
  readonly selectedCapacity: DeviceCapacity | null;
  readonly categories: DeviceCategory[];
  readonly availableBrands: Brand[];
  readonly availableModels: DeviceModel[];
  readonly availableCapacities: DeviceCapacity[];
  readonly isBrandDropdownOpen: boolean;
  readonly isModelDropdownOpen: boolean;
  readonly isCapacityDropdownOpen: boolean;
  readonly screenTurnsOn: boolean | null;
  readonly deviceFreeInColombia: boolean | null;
  readonly damageFreeAnswer: boolean | null;
  readonly goodConditionAnswer: boolean | null;
  readonly imeiInput: string;
  readonly tradeInValue: number;
  readonly calculatingValue: boolean;
  readonly onSelectCategory: (category: string) => void;
  readonly onSelectBrand: (brand: Brand) => void;
  readonly onSelectModel: (model: DeviceModel) => void;
  readonly onSelectCapacity: (capacity: DeviceCapacity) => void;
  readonly onToggleBrandDropdown: () => void;
  readonly onToggleModelDropdown: () => void;
  readonly onToggleCapacityDropdown: () => void;
  readonly onScreenTurnsOnAnswer: (answer: boolean) => void;
  readonly onDeviceFreeAnswer: (answer: boolean) => void;
  readonly onDamageFreeAnswer: (answer: boolean) => void;
  readonly onGoodConditionAnswer: (answer: boolean) => void;
  readonly onImeiChange: (value: string) => void;
  readonly onClose: () => void;
}

export default function ModalStepContent({
  currentStep,
  isDisqualified,
  loadingData,
  selectedCategory,
  selectedBrand,
  selectedModel,
  selectedCapacity,
  categories,
  availableBrands,
  availableModels,
  availableCapacities,
  isBrandDropdownOpen,
  isModelDropdownOpen,
  isCapacityDropdownOpen,
  screenTurnsOn,
  deviceFreeInColombia,
  damageFreeAnswer,
  goodConditionAnswer,
  imeiInput,
  tradeInValue,
  calculatingValue,
  onSelectCategory,
  onSelectBrand,
  onSelectModel,
  onSelectCapacity,
  onToggleBrandDropdown,
  onToggleModelDropdown,
  onToggleCapacityDropdown,
  onScreenTurnsOnAnswer,
  onDeviceFreeAnswer,
  onDamageFreeAnswer,
  onGoodConditionAnswer,
  onImeiChange,
  onClose,
}: ModalStepContentProps) {
  // Persistir respuestas dentro del objeto `imagiq_trade_in` bajo la propiedad `detalles`
  const persistDetalle = (partial: Partial<Record<string, boolean>>) => {
    if (globalThis.window === undefined) return;

    const raw = localStorage.getItem("imagiq_trade_in");
    let tradeInObj: Record<string, unknown> = {};
    if (raw) {
      try {
        tradeInObj = JSON.parse(raw) as Record<string, unknown>;
      } catch {
        tradeInObj = {};
      }
    }

    const existingDetalles =
      (tradeInObj.detalles as Record<string, boolean>) || {};
    const mergedDetalles = { ...(existingDetalles || {}), ...(partial || {}) };

    const newObj = { ...tradeInObj, detalles: mergedDetalles };
    localStorage.setItem("imagiq_trade_in", JSON.stringify(newObj));
  };

  const handleScreenTurnsOnAnswer = (answer: boolean) => {
    onScreenTurnsOnAnswer(answer);
    persistDetalle({ pantalla_enciende_mas_30_segundos: Boolean(answer) });
  };

  const handleDeviceFreeAnswer = (answer: boolean) => {
    onDeviceFreeAnswer(answer);
    persistDetalle({ libre_uso_sin_bloqueo_operador: Boolean(answer) });
  };

  const handleDamageFreeAnswer = (answer: boolean) => {
    onDamageFreeAnswer(answer);
    persistDetalle({ sin_danos_graves: Boolean(answer) });
  };

  const handleGoodConditionAnswer = (answer: boolean) => {
    onGoodConditionAnswer(answer);
    persistDetalle({ buen_estado: Boolean(answer) });
  };

  // Persistir el valor de retoma dentro del objeto `imagiq_trade_in` existente
  useEffect(() => {
    if (globalThis.window === undefined) return;
    if (tradeInValue === undefined || tradeInValue === null) return;
    if (typeof tradeInValue !== "number" || Number.isNaN(tradeInValue)) return;

    const raw = localStorage.getItem("imagiq_trade_in");
    let obj: Record<string, unknown> = {};
    if (raw) {
      try {
        obj = JSON.parse(raw) as Record<string, unknown>;
      } catch {
        obj = {};
      }
    }

    const newObj = { ...obj, value: tradeInValue };
    localStorage.setItem("imagiq_trade_in", JSON.stringify(newObj));
  }, [tradeInValue]);

  if (loadingData) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    );
  }

  if (isDisqualified) {
    return <DisqualificationMessage onClose={onClose} />;
  }

  if (currentStep === 1) {
    return (
      <div className="px-10 md:px-20 lg:px-24 py-6">
        <DeviceCategorySelector
          selectedCategory={selectedCategory}
          onSelectCategory={onSelectCategory}
          categories={categories}
        />
        <BrandDropdown
          brands={availableBrands}
          selectedBrand={selectedBrand}
          isOpen={isBrandDropdownOpen}
          onToggle={onToggleBrandDropdown}
          onSelectBrand={onSelectBrand}
        />
        <SimpleDropdown
          label="Modelo"
          placeholder="Selecciona el modelo de tu dispositivo"
          isOpen={isModelDropdownOpen}
          isDisabled={!selectedBrand}
          options={availableModels}
          selectedOption={selectedModel}
          onToggle={onToggleModelDropdown}
          onSelectOption={onSelectModel}
        />
        <SimpleDropdown
          label="Capacidad"
          placeholder="Selecciona la capacidad de tu dispositivo"
          isOpen={isCapacityDropdownOpen}
          isDisabled={!selectedModel}
          options={availableCapacities}
          selectedOption={selectedCapacity}
          onToggle={onToggleCapacityDropdown}
          onSelectOption={onSelectCapacity}
        />
        <div className="-mx-10 md:-mx-20 lg:-mx-24 px-6 md:px-10 py-6">
          <TradeInInformation />
        </div>
      </div>
    );
  }

  if (currentStep === 2) {
    return (
      <InitialQuestionsSection
        screenTurnsOn={screenTurnsOn}
        deviceFreeInColombia={deviceFreeInColombia}
        onScreenTurnsOnAnswer={handleScreenTurnsOnAnswer}
        onDeviceFreeAnswer={handleDeviceFreeAnswer}
      />
    );
  }

  if (currentStep === 3) {
    return (
      <CombinedConditionQuestions
        damageFreeAnswer={damageFreeAnswer}
        goodConditionAnswer={goodConditionAnswer}
        onDamageFreeAnswer={handleDamageFreeAnswer}
        onGoodConditionAnswer={handleGoodConditionAnswer}
      />
    );
  }

  if (currentStep === 6) {
    return (
      <IMEIInputSection
        selectedCategory={selectedCategory}
        selectedBrand={selectedBrand}
        selectedModel={selectedModel}
        selectedCapacity={selectedCapacity}
        imeiInput={imeiInput}
        onImeiChange={onImeiChange}
        tradeInValue={tradeInValue}
        calculatingValue={calculatingValue}
      />
    );
  }

  return null;
}
