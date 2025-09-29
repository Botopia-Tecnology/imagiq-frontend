// Selector de dispositivo
// Componente reutilizable para mostrar la lista de dispositivos y seleccionar uno
import React from "react";
import Image, { StaticImageData } from "next/image";
import { DeviceVariant, DeviceOption } from "@/hooks/useDeviceVariants";

interface DeviceSelectorProps {
  deviceOptions: DeviceOption[];
  selectedDevice: DeviceOption | null;
  setSelectedDevice: (device: DeviceOption) => void;
  getDisplayPrice: (variant: DeviceVariant | null) => string;
  deviceImage: StaticImageData;
}

/**
 * Selector de dispositivos, muestra lista y permite seleccionar uno.
 */
const DeviceSelector: React.FC<DeviceSelectorProps> = ({
  deviceOptions,
  selectedDevice,
  setSelectedDevice,
  getDisplayPrice,
  deviceImage,
}) => (
  <div className="flex flex-col gap-3">
    {deviceOptions.map((deviceOption) => {
      const baseVariant = deviceOption.variants[0];
      return (
        <button
          key={deviceOption.nombreMarket}
          className={`flex items-center justify-between w-full rounded-xl border px-5 py-4 transition-colors shadow-sm focus:outline-none ${
            selectedDevice?.nombreMarket === deviceOption.nombreMarket
              ? "border-[#17407A] bg-[#F2F6FA]"
              : "border-[#E3E8EF] bg-white hover:border-[#BFD7F2]"
          }`}
          onClick={() => setSelectedDevice(deviceOption)}
          type="button"
        >
          <div className="flex items-center gap-4">
            <span
              className={`w-5 h-5 flex items-center justify-center rounded-full border-2 ${
                selectedDevice?.nombreMarket === deviceOption.nombreMarket
                  ? "border-[#17407A] bg-[#17407A]"
                  : "border-[#BFD7F2] bg-white"
              }`}
            >
              {selectedDevice?.nombreMarket === deviceOption.nombreMarket && (
                <span className="w-2.5 h-2.5 rounded-full bg-white block"></span>
              )}
            </span>
            <div className="flex flex-col items-start">
              <span
                className="text-[16px] font-semibold text-[#002142]"
                style={{ fontFamily: "SamsungSharpSans" }}
              >
                {deviceOption.nombreMarket}
              </span>
              <span
                className="text-[17px] font-bold text-[#002142]"
                style={{ fontFamily: "SamsungSharpSans" }}
              >
                {getDisplayPrice(baseVariant)}
              </span>
            </div>
          </div>
          <div className="flex items-center py-1">
            <Image
              src={deviceImage}
              alt={deviceOption.nombreMarket}
              width={56}
              height={80}
              className="object-contain"
            />
          </div>
        </button>
      );
    })}
  </div>
);

export default DeviceSelector;
