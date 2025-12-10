import { useState, useEffect, useCallback, useMemo } from "react";
import type { Brand, DeviceModel, DeviceCapacity, TradeInData } from "../types";

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

interface UseTradeInFormProps {
  tradeInData: TradeInData;
  isOpen: boolean;
}

interface UseTradeInFormReturn {
  formState: TradeInFormState;
  dropdownState: DropdownState;
  imeiInput: string;
  isStep1Valid: boolean;
  availableBrands: Brand[];
  availableModels: DeviceModel[];
  availableCapacities: DeviceCapacity[];
  setSelectedCategory: (category: string) => void;
  setSelectedBrand: (brand: Brand | null) => void;
  setSelectedModel: (model: DeviceModel | null) => void;
  setSelectedCapacity: (capacity: DeviceCapacity | null) => void;
  setIsBrandDropdownOpen: (open: boolean) => void;
  setIsModelDropdownOpen: (open: boolean) => void;
  setIsCapacityDropdownOpen: (open: boolean) => void;
  setImeiInput: (value: string) => void;
  termsAccepted: boolean;
  setTermsAccepted: (accepted: boolean) => void;
  resetForm: () => void;
}

const getFilteredBrands = (data: TradeInData, categoryId: string): Brand[] => {
  const categoryModels = data.models.filter((m) => m.categoryId === categoryId);
  const brandIds = new Set(categoryModels.map((m) => m.brandId));
  return data.brands.filter((b) => brandIds.has(b.id));
};

const getFilteredModels = (data: TradeInData, brandId: string, categoryId: string): DeviceModel[] => {
  return data.models.filter((m) => m.brandId === brandId && m.categoryId === categoryId);
};

const getFilteredCapacities = (data: TradeInData, modelId: string): DeviceCapacity[] => {
  return data.capacities.filter((c) => c.modelId === modelId);
};

export function useTradeInForm({ tradeInData, isOpen }: UseTradeInFormProps): UseTradeInFormReturn {
  const [formState, setFormState] = useState<TradeInFormState>({
    selectedCategory: "watch",
    selectedBrand: null,
    selectedModel: null,
    selectedCapacity: null,
  });

  const [dropdownState, setDropdownState] = useState<DropdownState>({
    isBrandDropdownOpen: false,
    isModelDropdownOpen: false,
    isCapacityDropdownOpen: false,
  });

  const [imeiInput, setImeiInput] = useState<string>("");
  const [termsAccepted, setTermsAccepted] = useState<boolean>(false);

  const availableBrands = useMemo(
    () => getFilteredBrands(tradeInData, formState.selectedCategory),
    [tradeInData, formState.selectedCategory]
  );

  const availableModels = useMemo(
    () => formState.selectedBrand ? getFilteredModels(tradeInData, formState.selectedBrand.id, formState.selectedCategory) : [],
    [tradeInData, formState.selectedBrand, formState.selectedCategory]
  );

  const availableCapacities = useMemo(
    () => formState.selectedModel ? getFilteredCapacities(tradeInData, formState.selectedModel.id) : [],
    [tradeInData, formState.selectedModel]
  );

  const isStep1Valid = Boolean(
    formState.selectedCategory &&
    formState.selectedBrand &&
    formState.selectedModel &&
    formState.selectedCapacity
  );

  // Auto-abrir dropdown de marca cuando se selecciona categoría
  useEffect(() => {
    setFormState((prev) => ({
      ...prev,
      selectedBrand: null,
      selectedModel: null,
      selectedCapacity: null,
    }));
    // Auto-abrir marca si hay opciones disponibles
    setDropdownState({
      isBrandDropdownOpen: availableBrands.length > 0,
      isModelDropdownOpen: false,
      isCapacityDropdownOpen: false,
    });
  }, [formState.selectedCategory, availableBrands.length]);

  // Auto-abrir dropdown de modelo cuando se selecciona marca
  useEffect(() => {
    setFormState((prev) => ({
      ...prev,
      selectedModel: null,
      selectedCapacity: null,
    }));
    // Auto-abrir modelo si se seleccionó marca y hay opciones
    if (formState.selectedBrand && availableModels.length > 0) {
      setDropdownState((prev) => ({
        ...prev,
        isBrandDropdownOpen: false,
        isModelDropdownOpen: true,
        isCapacityDropdownOpen: false,
      }));
    } else {
      setDropdownState((prev) => ({
        ...prev,
        isModelDropdownOpen: false,
        isCapacityDropdownOpen: false,
      }));
    }
  }, [formState.selectedBrand, availableModels.length]);

  // Auto-abrir dropdown de capacidad cuando se selecciona modelo
  useEffect(() => {
    setFormState((prev) => ({ ...prev, selectedCapacity: null }));
    // Auto-abrir capacidad si se seleccionó modelo y hay opciones
    if (formState.selectedModel && availableCapacities.length > 0) {
      setDropdownState((prev) => ({
        ...prev,
        isModelDropdownOpen: false,
        isCapacityDropdownOpen: true,
      }));
    } else {
      setDropdownState((prev) => ({ ...prev, isCapacityDropdownOpen: false }));
    }
  }, [formState.selectedModel, availableCapacities.length]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const resetForm = useCallback(() => {
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
    setImeiInput("");
    setTermsAccepted(false);
  }, []);

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
    formState,
    dropdownState,
    imeiInput,
    isStep1Valid,
    availableBrands,
    availableModels,
    availableCapacities,
    setSelectedCategory,
    setSelectedBrand,
    setSelectedModel,
    setSelectedCapacity,
    setIsBrandDropdownOpen,
    setIsModelDropdownOpen,
    setIsCapacityDropdownOpen,
    setImeiInput,
    termsAccepted,
    setTermsAccepted,
    resetForm,
  };
}
