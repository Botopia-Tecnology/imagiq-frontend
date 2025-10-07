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
      <section className="mb-6">
        <label className="block text-sm text-[#222] font-medium mb-3">
          Elige tu Color
        </label>
        {selectedColor && (
          <div className="text-xs text-[#8A8A8A] mb-4">
            {selectedColor.color}
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
      <div className="w-48 h-px bg-gray-200 mb-6"></div>

      {/* Selector de almacenamiento */}
      <section className="mb-6">
        <label className="block text-sm text-[#222] font-medium mb-4">
          Elige tu Almacenamiento
        </label>
        <div className="flex gap-3">
          {variantsLoading ? (
            <div className="flex gap-3 animate-pulse">
              <div className="h-10 bg-gray-200 rounded-full w-24"></div>
              <div className="h-10 bg-gray-200 rounded-full w-24"></div>
            </div>
          ) : storageOptions && storageOptions.length > 0 ? (
            storageOptions.map((storage) => (
              <button
                key={storage.capacidad}
                className={`rounded-full border px-6 py-2 font-semibold text-sm transition-all duration-200 ease-in-out focus:outline-none ${
                  selectedStorage?.capacidad === storage.capacidad
                    ? "border-[#0099FF] bg-[#0099FF] text-white"
                    : "border-[#0099FF] text-[#0099FF] bg-white hover:bg-[#F2F6FA]"
                }`}
                onClick={() => onStorageChange(storage)}
              >
                {storage.capacidad}
              </button>
            ))
          ) : null}
        </div>
      </section>

      {/* Línea separadora */}
      <div className="w-48 h-px bg-gray-200 mb-6"></div>

      {/* Selector de memoria RAM */}
      <section className="mb-6">
        <label className="block text-sm text-[#222] font-medium mb-4">
          Elige tu Memoria RAM
        </label>
        <div className="flex gap-3">
          {variantsLoading ? (
            <div className="flex gap-3 animate-pulse">
              <div className="h-10 bg-gray-200 rounded-full w-20"></div>
              <div className="h-10 bg-gray-200 rounded-full w-20"></div>
            </div>
          ) : (
            <>
              <button className="rounded-full border border-[#0099FF] bg-[#0099FF] text-white px-6 py-2 font-semibold text-sm transition-all duration-200 ease-in-out focus:outline-none">
                8 GB
              </button>
              <button className="rounded-full border border-[#0099FF] text-[#0099FF] bg-white hover:bg-[#F2F6FA] px-6 py-2 font-semibold text-sm transition-all duration-200 ease-in-out focus:outline-none">
                12 GB
              </button>
            </>
          )}
        </div>
      </section>

      {/* Línea separadora */}
      <div className="w-48 h-px bg-gray-200 mb-6"></div>
    </>
  );
}
