import React from "react";
import ColorSelector from "./ColorSelector";
import type { ColorOption, StorageOption } from "@/hooks/useDeviceVariants";

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
}: ProductSelectorsProps) {
  return (
    <>
      {/* Selector de color */}
      <section className="mb-8">
        <label className="block text-base text-[#222] font-semibold mb-4">
          Elige tu Color
        </label>
        {selectedColor && (
          <div className="text-sm text-[#222] mb-4">
            Color : <span className="font-normal">{selectedColor.color}</span>
          </div>
        )}
        <div className="flex gap-3 items-center">
          <ColorSelector
            colorOptions={colorOptions}
            selectedColor={selectedColor}
            handleColorSelection={onColorChange}
            hasStock={hasStock}
          />
        </div>
      </section>

      {/* Línea separadora */}
      <div className="h-px bg-gray-200 mb-8"></div>

      {/* Selector de almacenamiento */}
      <section className="mb-8">
        <label className="block text-base text-[#222] font-semibold mb-5">
          Elige tu Almacenamiento
        </label>
        <div className="grid grid-cols-2 gap-4">
          {variantsLoading ? (
            <>
              <div className="h-24 bg-gray-200 rounded-xl animate-pulse"></div>
            </>
          ) : storageOptions && storageOptions.length > 0 ? (
            storageOptions.map((storage) => {
              // Calcular el precio de esta opción de almacenamiento
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
                  {storagePrice && (
                    <span className="text-sm text-[#222] font-normal">
                      ${storagePrice.toLocaleString('es-CO')}
                    </span>
                  )}
                </button>
              );
            })
          ) : null}
        </div>
      </section>

      {/* Línea separadora */}
      <div className="h-px bg-gray-200 mb-8"></div>

      {/* Selector de memoria RAM */}
      <section className="mb-8">
        <label className="block text-base text-[#222] font-semibold mb-5">
          Elige tu Memoria Ram
        </label>
        <div className="grid grid-cols-2 gap-4">
          {variantsLoading ? (
            <>
              
              <div className="h-24 bg-gray-200 rounded-xl animate-pulse"></div>
            </>
          ) : (
            <>
              <button className="rounded-xl border-2 border-[#222] bg-white text-[#222] px-6 py-6 font-normal text-base transition-all duration-200 ease-in-out focus:outline-none">
                8 GB
              </button>
              <button className="rounded-xl border-2 border-gray-300 text-[#222] bg-white hover:border-[#222] px-6 py-6 font-normal text-base transition-all duration-200 ease-in-out focus:outline-none">
                12 GB
              </button>
            </>
          )}
        </div>
      </section>

      {/* Línea separadora */}
      <div className="h-px bg-gray-200 mb-8"></div>
    </>
  );
}
