import { useState, useEffect, useCallback } from "react";
import type { Brand, DeviceModel, DeviceCapacity, TradeInData } from "../types";
import {
  getAvailableBrands,
  getAvailableModels,
  getAvailableCapacities,
} from "../mockData";

type TradeInStep = 1 | 2 | 3;

interface TradeInFormState {
  selectedCategory: string;
  selectedBrand: Brand | null;
  selectedModel: DeviceModel | null;
  selectedCapacity: DeviceCapacity | null;
}

interface DropdownState {
  isBrandDropdownOpen: boolean;
  isModelDropdownOpen: boolean;
  isCapacityDropdownOpen: boolean;
}

interface ConditionAnswers {
  "no-damage": boolean | null;
  "good-condition": boolean | null;
  "unlocked-colombia": boolean | null;
}

interface UseTradeInFormProps {
  tradeInData: TradeInData;
  isOpen: boolean;
}

interface UseTradeInFormReturn {
  // State
  currentStep: TradeInStep;
  formState: TradeInFormState;
  dropdownState: DropdownState;
  conditionAnswers: ConditionAnswers;
  imeiInput: string;

  // Validation
  isStep1Valid: boolean;
  isStep2Valid: boolean;
  isStep3Valid: boolean;

  // Filtered data
  availableBrands: Brand[];
  availableModels: DeviceModel[];
  availableCapacities: DeviceCapacity[];

  // Setters
  setCurrentStep: (step: TradeInStep) => void;
  setSelectedCategory: (category: string) => void;
  setSelectedBrand: (brand: Brand | null) => void;
  setSelectedModel: (model: DeviceModel | null) => void;
  setSelectedCapacity: (capacity: DeviceCapacity | null) => void;
  setIsBrandDropdownOpen: (open: boolean) => void;
  setIsModelDropdownOpen: (open: boolean) => void;
  setIsCapacityDropdownOpen: (open: boolean) => void;
  setConditionAnswers: React.Dispatch<React.SetStateAction<ConditionAnswers>>;
  setImeiInput: (value: string) => void;

  // Actions
  handleConditionAnswer: (questionId: keyof ConditionAnswers, answer: boolean) => void;
  resetForm: () => void;
}

export function useTradeInForm({ tradeInData, isOpen }: UseTradeInFormProps): UseTradeInFormReturn {
  const [currentStep, setCurrentStep] = useState<TradeInStep>(1);

  // Form state
  const [formState, setFormState] = useState<TradeInFormState>({
    selectedCategory: "watch",
    selectedBrand: null,
    selectedModel: null,
    selectedCapacity: null,
  });

  // Dropdown state
  const [dropdownState, setDropdownState] = useState<DropdownState>({
    isBrandDropdownOpen: false,
    isModelDropdownOpen: false,
    isCapacityDropdownOpen: false,
  });

  // Condition answers
  const [conditionAnswers, setConditionAnswers] = useState<ConditionAnswers>({
    "no-damage": null,
    "good-condition": null,
    "unlocked-colombia": null,
  });

  // IMEI input
  const [imeiInput, setImeiInput] = useState<string>("");

  // Filtered data
  const availableBrands = getAvailableBrands(tradeInData, formState.selectedCategory);
  const availableModels = formState.selectedBrand
    ? getAvailableModels(tradeInData, formState.selectedBrand.id, formState.selectedCategory)
    : [];
  const availableCapacities = formState.selectedModel
    ? getAvailableCapacities(tradeInData, formState.selectedModel.id)
    : [];

  // Validation
  const isStep1Valid = Boolean(
    formState.selectedCategory &&
    formState.selectedBrand &&
    formState.selectedModel &&
    formState.selectedCapacity
  );
  const isStep2Valid = Object.values(conditionAnswers).every((answer) => answer === true);
  const isStep3Valid = imeiInput.trim().length > 0;

  // Reset dependent selections when category changes
  useEffect(() => {
    setFormState((prev) => ({
      ...prev,
      selectedBrand: null,
      selectedModel: null,
      selectedCapacity: null,
    }));
    setDropdownState({
      isBrandDropdownOpen: false,
      isModelDropdownOpen: false,
      isCapacityDropdownOpen: false,
    });
  }, [formState.selectedCategory]);

  // Reset dependent selections when brand changes
  useEffect(() => {
    setFormState((prev) => ({
      ...prev,
      selectedModel: null,
      selectedCapacity: null,
    }));
    setDropdownState((prev) => ({
      ...prev,
      isModelDropdownOpen: false,
      isCapacityDropdownOpen: false,
    }));
  }, [formState.selectedBrand]);

  // Reset capacity when model changes
  useEffect(() => {
    setFormState((prev) => ({
      ...prev,
      selectedCapacity: null,
    }));
    setDropdownState((prev) => ({
      ...prev,
      isCapacityDropdownOpen: false,
    }));
  }, [formState.selectedModel]);

  // Manage body scroll
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Condition answer handler
  const handleConditionAnswer = useCallback((questionId: keyof ConditionAnswers, answer: boolean) => {
    setConditionAnswers((prev) => ({ ...prev, [questionId]: answer }));
  }, []);

  // Reset form
  const resetForm = useCallback(() => {
    setCurrentStep(1);
    setFormState({
      selectedCategory: "watch",
      selectedBrand: null,
      selectedModel: null,
      selectedCapacity: null,
    });
    setDropdownState({
      isBrandDropdownOpen: false,
      isModelDropdownOpen: false,
      isCapacityDropdownOpen: false,
    });
    setConditionAnswers({
      "no-damage": null,
      "good-condition": null,
      "unlocked-colombia": null,
    });
    setImeiInput("");
  }, []);

  // Individual setters for form state
  const setSelectedCategory = useCallback((category: string) => {
    setFormState((prev) => ({ ...prev, selectedCategory: category }));
  }, []);

  const setSelectedBrand = useCallback((brand: Brand | null) => {
    setFormState((prev) => ({ ...prev, selectedBrand: brand }));
  }, []);

  const setSelectedModel = useCallback((model: DeviceModel | null) => {
    setFormState((prev) => ({ ...prev, selectedModel: model }));
  }, []);

  const setSelectedCapacity = useCallback((capacity: DeviceCapacity | null) => {
    setFormState((prev) => ({ ...prev, selectedCapacity: capacity }));
  }, []);

  // Individual setters for dropdown state
  const setIsBrandDropdownOpen = useCallback((open: boolean) => {
    setDropdownState((prev) => ({ ...prev, isBrandDropdownOpen: open }));
  }, []);

  const setIsModelDropdownOpen = useCallback((open: boolean) => {
    setDropdownState((prev) => ({ ...prev, isModelDropdownOpen: open }));
  }, []);

  const setIsCapacityDropdownOpen = useCallback((open: boolean) => {
    setDropdownState((prev) => ({ ...prev, isCapacityDropdownOpen: open }));
  }, []);

  return {
    // State
    currentStep,
    formState,
    dropdownState,
    conditionAnswers,
    imeiInput,

    // Validation
    isStep1Valid,
    isStep2Valid,
    isStep3Valid,

    // Filtered data
    availableBrands,
    availableModels,
    availableCapacities,

    // Setters
    setCurrentStep,
    setSelectedCategory,
    setSelectedBrand,
    setSelectedModel,
    setSelectedCapacity,
    setIsBrandDropdownOpen,
    setIsModelDropdownOpen,
    setIsCapacityDropdownOpen,
    setConditionAnswers,
    setImeiInput,

    // Actions
    handleConditionAnswer,
    resetForm,
  };
}
