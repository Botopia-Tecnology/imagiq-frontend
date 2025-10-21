import React from "react";
import type { DeviceCapacity, Brand, DeviceModel } from "./types";

interface IMEIInputSectionProps {
  selectedCategory: string;
  selectedBrand: Brand | null;
  selectedModel: DeviceModel | null;
  selectedCapacity: DeviceCapacity | null;
  imeiInput: string;
  onImeiChange: (value: string) => void;
}

export default function IMEIInputSection({
  selectedCategory,
  selectedBrand,
  selectedModel,
  selectedCapacity,
  imeiInput,
  onImeiChange,
}: IMEIInputSectionProps) {
  return (
    <div className="px-6 md:px-10 py-6">
      {/* Device Summary Card */}
      <div className="mb-6">
        <p className="text-sm font-semibold text-[#222] mb-3">Estreno y Entrego</p>
        <div className="border-2 border-[#0099FF] rounded-lg p-4">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs text-[#222] uppercase mb-1">{selectedCategory}</p>
              <p className="text-sm font-medium text-[#222]">
                {selectedBrand?.name} {selectedModel?.name} {selectedCapacity?.name}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-600 mb-1">Estreno y Entrego</p>
              <p className="text-lg font-bold text-[#0099FF]">
                -$ {selectedCapacity?.tradeInValue.toLocaleString("es-CO")}
              </p>
              <p className="text-[10px] text-gray-600">(Recibe hasta)</p>
            </div>
          </div>
        </div>
      </div>

      {/* IMEI Input Section */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-[#222] mb-3">
          Ingresa tu número IMEI
        </label>
        <input
          type="text"
          value={imeiInput}
          onChange={(e) => onImeiChange(e.target.value)}
          placeholder=""
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#0099FF] transition-colors"
        />
      </div>

      {/* How to find IMEI */}
      <div className="bg-gray-50 rounded-lg p-4">
        <p className="text-sm font-semibold text-[#222] mb-3">Encuentra tu número IMEI</p>
        <div className="space-y-2 text-xs text-gray-700">
          <div>
            <p className="font-semibold mb-1">Opción 1</p>
            <p>
              Digita <span className="font-bold">*#06#</span> para identificar tu número de IMEI.
            </p>
          </div>
          <div>
            <p className="font-semibold mb-1">Opción 2</p>
            <p>Ingrese en configuración → General → Información de IMEI</p>
          </div>
        </div>
      </div>
    </div>
  );
}
