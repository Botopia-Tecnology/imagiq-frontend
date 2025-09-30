// Selector de almacenamiento
// Componente reutilizable para mostrar las opciones de almacenamiento
import React from "react";
import { StorageOption, DeviceVariant } from "@/hooks/useDeviceVariants";

interface StorageSelectorProps {
  storageOptions: StorageOption[];
  selectedStorage: StorageOption | null;
  setSelectedStorage: (storage: StorageOption) => void;
  getDisplayPrice: (variant: DeviceVariant | null) => string;
}

/**
 * Selector de almacenamiento, muestra lista y permite seleccionar una opción.
 */
const StorageSelector: React.FC<StorageSelectorProps> = ({
  storageOptions,
  selectedStorage,
  setSelectedStorage,
  getDisplayPrice,
}) => (
  <div className="flex flex-col gap-3">
    {storageOptions.map((storageOption) => {
      const baseVariant = storageOption.variants[0];
      return (
        <button
          key={storageOption.capacidad}
          className={`flex items-center justify-between w-full rounded-xl border px-5 py-4 transition-colors shadow-sm focus:outline-none ${
            selectedStorage?.capacidad === storageOption.capacidad
              ? "border-[#17407A] bg-[#F2F6FA]"
              : "border-[#E3E8EF] bg-white hover:border-[#BFD7F2]"
          }`}
          onClick={() => setSelectedStorage(storageOption)}
          type="button"
        >
          <div className="flex items-center gap-4">
            <span
              className={`w-5 h-5 flex items-center justify-center rounded-full border-2 ${
                selectedStorage?.capacidad === storageOption.capacidad
                  ? "border-[#17407A] bg-[#17407A]"
                  : "border-[#BFD7F2] bg-white"
              }`}
            >
              {selectedStorage?.capacidad === storageOption.capacidad && (
                <span className="w-2.5 h-2.5 rounded-full bg-white block"></span>
              )}
            </span>
            <span
              className="text-[16px] font-semibold text-[#002142]"
              style={{ fontFamily: "SamsungSharpSans" }}
            >
              {storageOption.capacidad}
            </span>
          </div>
          <span
            className="text-[17px] font-bold text-[#002142]"
            style={{ fontFamily: "SamsungSharpSans" }}
          >
            {getDisplayPrice(baseVariant)}
          </span>
        </button>
      );
    })}
  </div>
);

export default StorageSelector;
