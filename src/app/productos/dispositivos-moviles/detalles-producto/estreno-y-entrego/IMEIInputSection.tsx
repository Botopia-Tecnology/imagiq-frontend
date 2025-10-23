import React from "react";
import Image from "next/image";
import type { DeviceCapacity, Brand, DeviceModel } from "./types";

interface IMEIInputSectionProps {
  readonly selectedCategory: string;
  readonly selectedBrand: Brand | null;
  readonly selectedModel: DeviceModel | null;
  readonly selectedCapacity: DeviceCapacity | null;
  readonly imeiInput: string;
  readonly onImeiChange: (value: string) => void;
  readonly tradeInValue?: number;
  readonly calculatingValue?: boolean;
}

export default function IMEIInputSection({
  selectedBrand,
  selectedModel,
  imeiInput,
  onImeiChange,
  tradeInValue = 0,
  calculatingValue = false,
}: Readonly<IMEIInputSectionProps>) {
  let imeiBorderClass = 'border-gray-300 focus:border-[#0099FF]';
  if (imeiInput.length > 0 && imeiInput.length < 15) {
    imeiBorderClass = 'border-red-500';
  } else if (imeiInput.length === 15) {
    imeiBorderClass = 'border-green-500';
  }
  return (
    <div className="px-6 md:px-10 py-6">
      {/* Title */}
      <h3
        className="text-base md:text-lg font-normal text-[#222] mb-6 text-center"
        style={{ fontFamily: "SamsungSharpSans" }}
      >
        Estreno y Entrego
      </h3>

      {/* Device Summary Card */}
      <div className="mb-6">
        <div className="border-2 border-[#0099FF] rounded-lg p-4 flex justify-between items-center">
          <div className="flex-1">
            <p
              className="text-xs text-[#222] uppercase mb-1"
              style={{ fontFamily: "SamsungSharpSans" }}
            >
              {selectedBrand?.name === "Apple" ? "WATCH" : selectedBrand?.name || "WATCH"}
            </p>
            <p
              className="text-sm font-medium text-[#222]"
              style={{ fontFamily: "SamsungSharpSans" }}
            >
              {selectedBrand?.name} {selectedModel?.name}
            </p>
          </div>
          <div className="text-right">
            <p
              className="text-xs text-gray-600 mb-1"
              style={{ fontFamily: "SamsungSharpSans" }}
            >
              Estreno y Entrego
            </p>
            {calculatingValue ? (
              <p
                className="text-lg font-bold text-gray-400"
                style={{ fontFamily: "SamsungSharpSans" }}
              >
                Calculando...
              </p>
            ) : (
              <>
                <p
                  className="text-lg font-bold text-[#0099FF]"
                  style={{ fontFamily: "SamsungSharpSans" }}
                >
                  -$ {tradeInValue > 0 ? tradeInValue.toLocaleString("es-CO") : "0"}
                </p>
                <p
                  className="text-[10px] text-gray-600"
                  style={{ fontFamily: "SamsungSharpSans" }}
                >
                  (Valor estimado)
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* IMEI Input and Instructions - Side by Side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column: IMEI Input */}
        <div>
          <label
            htmlFor="imei-input"
            className="block text-sm font-normal text-[#222] mb-2"
            style={{ fontFamily: "SamsungSharpSans" }}
          >
            Ingresa tu número IMEI (15 dígitos)
          </label>
          <input
            id="imei-input"
            type="text"
            value={imeiInput}
            onChange={(e) => {
              const value = e.target.value.replaceAll(/\D/g, '');
              onImeiChange(value);
            }}
            placeholder="Ejemplo: 350204507061806"
            maxLength={15}
            className={`w-full px-0 py-2 border-b-2 text-sm focus:outline-none transition-colors bg-transparent ${imeiBorderClass}`}
            style={{ fontFamily: "SamsungSharpSans" }}
          />
          {imeiInput.length > 0 && imeiInput.length < 15 && (
            <p className="text-xs text-red-500 mt-1">
              El IMEI debe tener exactamente 15 dígitos ({imeiInput.length}/15)
            </p>
          )}
          {imeiInput.length === 15 && (
            <p className="text-xs text-green-600 mt-1">
              ✓ IMEI válido
            </p>
          )}
        </div>

        {/* Right Column: Keypad and Instructions */}
        <div>
          <p
            className="text-sm font-normal text-[#222] mb-3"
            style={{ fontFamily: "SamsungSharpSans" }}
          >
            Encuentra tu número IMEI
          </p>
          <div className="flex gap-4 items-start">
            {/* Smaller Keypad Image */}
            <div className="flex-shrink-0">
              <Image
                src="https://res.cloudinary.com/dnglv0zqg/image/upload/v1761192679/trade-imei-keypad_jy0gtf.jpg"
                alt="Teclado IMEI *#06#"
                width={120}
                height={140}
                className="object-contain"
                priority
              />
            </div>

            {/* Instructions */}
            <div className="flex-1 space-y-2 text-xs text-[#222]">
              <div>
                <p
                  className="font-semibold mb-0.5"
                  style={{ fontFamily: "SamsungSharpSans" }}
                >
                  Opción 1
                </p>
                <p style={{ fontFamily: "SamsungSharpSans" }}>
                  Digita <span className="font-bold text-[#0099FF]">*#06#</span>{" "}
                  para identificar tu número de IMEI.
                </p>
              </div>
              <div>
                <p
                  className="font-semibold mb-0.5"
                  style={{ fontFamily: "SamsungSharpSans" }}
                >
                  Opción 2
                </p>
                <p style={{ fontFamily: "SamsungSharpSans" }}>
                  Ingrese en configuración → General →Información de IMEI
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
