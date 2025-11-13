import React from "react";
import ColorSelector from "./ColorSelector";
import { TradeInSelector } from "./estreno-y-entrego";
import type { ColorOption, StorageOption } from "@/hooks/useProductSelection";

interface ProductSelectorsProps {
  // Color
  colorOptions: ColorOption[];
  selectedColor: ColorOption | null;
  onColorChange: (color: ColorOption) => void;
  hasStock: () => boolean;

  // Storage
  storageOptions: StorageOption[];
  selectedStorage: StorageOption | null;
  onStorageChange: (storage: StorageOption) => void;
  variantsLoading: boolean;

  // Memory RAM
  memoriaramOptions: string[];
  selectedMemoriaram: string | null;
  onMemoriaramChange: (memoriaram: string) => void;

  // Trade-in modal
  onOpenTradeInModal: () => void;
  tradeInSelected?: boolean;
  onTradeInChange?: (selected: boolean) => void;
  tradeInCompleted?: boolean;
  tradeInDeviceName?: string;
  tradeInValue?: number;
  acceptsTradeIn?: boolean; // Indica si el producto acepta retoma
}

export default function ProductSelectors({
  colorOptions,
  selectedColor,
  onColorChange,
  hasStock,
  storageOptions,
  selectedStorage,
  onStorageChange,
  variantsLoading,
  memoriaramOptions,
  selectedMemoriaram,
  onMemoriaramChange,
  onOpenTradeInModal,
  tradeInSelected,
  onTradeInChange,
  tradeInCompleted,
  tradeInDeviceName,
  tradeInValue,
  acceptsTradeIn = true, // Por defecto true para compatibilidad con productos existentes
}: Readonly<ProductSelectorsProps>) {
  // Convertir boolean a "yes" | "no"
  const tradeInOption: "no" | "yes" = tradeInSelected ? "yes" : "no";

  const handleTradeInChange = (option: "no" | "yes") => {
    onTradeInChange?.(option === "yes");
  };

  // Filtrar valores "NO APLICA", "NO", "N/A", "NA" para opciones de RAM
  const validMemoriaramOptions = memoriaramOptions.filter(ram => {
    if (!ram || ram.trim() === '') return false;
    const normalizedRam = ram.toLowerCase().trim();
    return !normalizedRam.includes('no aplica') &&
           normalizedRam !== 'n/a' &&
           normalizedRam !== 'na' &&
           normalizedRam !== 'no';
  });

  // Filtrar valores "NO APLICA", "NO", etc. para opciones de color
  const validColorOptions = colorOptions.filter(color => {
    const normalizedLabel = color.color?.toLowerCase().trim() || '';
    return !normalizedLabel.includes('no aplica') &&
           normalizedLabel !== 'n/a' &&
           normalizedLabel !== 'na' &&
           normalizedLabel !== 'no' &&
           normalizedLabel !== '';
  });

  // Filtrar valores "NO APLICA", "NO", etc. para opciones de almacenamiento
  const validStorageOptions = storageOptions.filter(storage => {
    const normalizedLabel = storage.capacidad?.toLowerCase().trim() || '';
    return !normalizedLabel.includes('no aplica') &&
           normalizedLabel !== 'n/a' &&
           normalizedLabel !== 'na' &&
           normalizedLabel !== 'no' &&
           normalizedLabel !== '';
  });

  // Detectar el tipo de capacidad para mostrar el label apropiado
  const hasInches = validStorageOptions.some(storage =>
    storage.capacidad?.includes('"') || storage.capacidad?.includes('\"')
  );

  const hasKilograms = validStorageOptions.some(storage =>
    storage.capacidad?.toLowerCase().includes('kg')
  );

  // Detectar si es almacenamiento (GB/TB)
  const isStorage = validStorageOptions.some(storage => {
    const cap = storage.capacidad?.toUpperCase() || '';
    return cap.includes('GB') || cap.includes('TB');
  });

  // Determinar el label apropiado para el selector
  let storageLabel = "Elige tu Almacenamiento"; // Por defecto para GB/TB
  if (hasInches) {
    storageLabel = "Elige tu Tamaño";
  } else if (hasKilograms) {
    storageLabel = "Elige tu Capacidad";
  }

  // Mostrar selector de color si:
  // 1. Hay más de una opción de color, O
  // 2. Es un producto con almacenamiento (GB/TB) aunque tenga un solo color
  const shouldShowColorSelector = validColorOptions.length > 1 || isStorage;

  return (
    <>
      {/* Selector de color - Mostrar si hay múltiples colores o si es producto de almacenamiento (GB/TB) */}
      {shouldShowColorSelector && validColorOptions.length > 0 && (
        <>
          <section className="mb-8">
            <p className="block text-base text-[#222] font-semibold mb-4">
              Elige tu Color
            </p>
            {selectedColor && (
              <div className="text-sm text-[#222] mb-4">
                Color : <span className="font-normal">{selectedColor.nombreColorDisplay || selectedColor.color}</span>
              </div>
            )}
            <div className="flex gap-3 items-center">
              <ColorSelector
                colorOptions={validColorOptions}
                selectedColor={selectedColor}
                handleColorSelection={onColorChange}
                hasStock={hasStock}
              />
            </div>
          </section>

          {/* Línea separadora */}
          <div className="h-px bg-gray-200 mb-8"></div>
        </>
      )}

      {/* Selector de almacenamiento/tamaño - Solo mostrar si hay opciones válidas */}
      {validStorageOptions.length > 0 && (
        <>
          <section className="mb-8">
            <p className="block text-base text-[#222] font-semibold mb-5">
              {storageLabel}
            </p>
            <div className="grid grid-cols-2 gap-4">
              {variantsLoading ? (
                <div className="h-24 bg-gray-200 rounded-xl animate-pulse"></div>
              ) : (
                validStorageOptions.map((storage) => {
                  const storagePrice = storage.variants[0]?.precioeccommerce > 0
                    ? storage.variants[0].precioeccommerce
                    : storage.variants[0]?.precioNormal;

                  return (
                    <button
                      key={storage.capacidad}
                      className={`rounded-xl border-2 px-6 py-6 font-normal text-base transition-all duration-200 ease-in-out focus:outline-none flex flex-col items-center justify-center ${
                        selectedStorage?.capacidad === storage.capacidad
                          ? "border-[#222] bg-white text-[#222]"
                          : "border-gray-300 text-[#222] bg-white hover:border-[#222]"
                      }`}
                      onClick={() => onStorageChange(storage)}
                    >
                      <span className="font-semibold text-base mb-1">{storage.capacidad}</span>
                      {Boolean(storagePrice) && (
                        <span className="text-sm text-[#222] font-normal">
                          ${storagePrice.toLocaleString('es-CO')}
                        </span>
                      )}
                    </button>
                  );
                })
              )}
            </div>
          </section>

          {/* Línea separadora */}
          <div className="h-px bg-gray-200 mb-8"></div>
        </>
      )}

      {/* Selector de memoria RAM - Solo mostrar si hay opciones válidas */}
      {validMemoriaramOptions.length > 0 && (
        <>
          <section className="mb-8">
            <p className="block text-base text-[#222] font-semibold mb-5">
              Elige tu Memoria Ram
            </p>
            <div className="grid grid-cols-2 gap-4">
              {variantsLoading ? (
                <div className="h-24 bg-gray-200 rounded-xl animate-pulse"></div>
              ) : (
                validMemoriaramOptions.map((memoriaram) => {
                  return (
                    <button
                      key={memoriaram}
                      className={`rounded-xl border-2 px-6 py-6 font-normal text-base transition-all duration-200 ease-in-out focus:outline-none flex flex-col items-center justify-center ${
                        selectedMemoriaram === memoriaram
                          ? "border-[#222] bg-white text-[#222]"
                          : "border-gray-300 text-[#222] bg-white hover:border-[#222]"
                      }`}
                      onClick={() => onMemoriaramChange(memoriaram)}
                    >
                      <span className="font-semibold text-base mb-1">{memoriaram}</span>
                    </button>
                  );
                })
              )}
            </div>
          </section>

          {/* Línea separadora */}
          <div className="h-px bg-gray-200 mb-8"></div>
        </>
      )}

      {/* Trade-in selector - Solo se muestra si el producto acepta retoma */}
      {acceptsTradeIn && (
        <>
          <TradeInSelector
            selectedOption={tradeInOption}
            onSelectionChange={handleTradeInChange}
            onOpenModal={onOpenTradeInModal}
            isCompleted={tradeInCompleted}
            completedDeviceName={tradeInDeviceName}
            completedTradeInValue={tradeInValue}
          />

          {/* Línea separadora */}
          <div className="h-px bg-gray-200 mb-8"></div>
        </>
      )}
    </>
  );
}
