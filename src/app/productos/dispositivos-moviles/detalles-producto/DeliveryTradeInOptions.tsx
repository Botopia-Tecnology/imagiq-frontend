import React from "react";
import { Truck, Zap } from "lucide-react";

interface DeliveryTradeInOptionsProps {
  deliveryOption: "standard" | "express";
  onDeliveryChange: (option: "standard" | "express") => void;
  estrenoYEntrego: boolean;
  onEstrenoChange: (value: boolean) => void;
}

export default function DeliveryTradeInOptions({
  deliveryOption,
  onDeliveryChange,
  estrenoYEntrego,
  onEstrenoChange,
}: DeliveryTradeInOptionsProps) {
  return (
    <>
      {/* Opciones de entrega */}
      <section className="mb-8">
        <label className="block text-base text-[#222] font-semibold mb-5">
          Opciones de Entrega
        </label>
        <div className="flex flex-col gap-4">
          {/* Entrega estándar */}
          <button
            onClick={() => onDeliveryChange("standard")}
            className={`flex items-center gap-3 px-4 py-4 rounded-xl border-2 transition-all duration-200 ${
              deliveryOption === "standard"
                ? "border-[#0099FF] bg-[#F0F8FF]"
                : "border-gray-300 bg-white hover:border-[#222]"
            }`}
          >
            <div className={`flex-shrink-0 ${deliveryOption === "standard" ? "text-[#0099FF]" : "text-gray-400"}`}>
              <Truck className="w-5 h-5" />
            </div>
            <div className="flex-1 text-left">
              <div className="text-sm font-semibold text-[#222]">
                Estándar
              </div>
              <div className="text-xs text-gray-600">
                1-3 días • Gratis
              </div>
            </div>
            <div className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center ${
              deliveryOption === "standard"
                ? "border-[#0099FF] bg-[#0099FF]"
                : "border-gray-300"
            }`}>
              {deliveryOption === "standard" && (
                <div className="w-2 h-2 bg-white rounded-full"></div>
              )}
            </div>
          </button>

          {/* Entrega express */}
          <button
            onClick={() => onDeliveryChange("express")}
            className={`flex items-center gap-3 px-4 py-4 rounded-xl border-2 transition-all duration-200 ${
              deliveryOption === "express"
                ? "border-[#0099FF] bg-[#F0F8FF]"
                : "border-gray-300 bg-white hover:border-[#222]"
            }`}
          >
            <div className={`flex-shrink-0 ${deliveryOption === "express" ? "text-[#0099FF]" : "text-gray-400"}`}>
              <Zap className="w-5 h-5" />
            </div>
            <div className="flex-1 text-left">
              <div className="text-sm font-semibold text-[#222]">
                Express
              </div>
              <div className="text-xs text-gray-600">
                Mismo día • +$20.000
              </div>
            </div>
            <div className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center ${
              deliveryOption === "express"
                ? "border-[#0099FF] bg-[#0099FF]"
                : "border-gray-300"
            }`}>
              {deliveryOption === "express" && (
                <div className="w-2 h-2 bg-white rounded-full"></div>
              )}
            </div>
          </button>
        </div>
      </section>

      {/* Línea separadora */}
      <div className="h-px bg-gray-200 mb-8"></div>

      {/* Estreno y Entrego */}
      <section className="mb-8">
        <label className="block text-base text-[#222] font-semibold mb-5">
          Obtén un descuento inmediato seleccionando Estreno y Entrego
        </label>
        <div className="grid grid-cols-2 gap-4">
          {/* Opción Sí */}
          <button
            onClick={() => onEstrenoChange(true)}
            className={`flex items-center justify-center gap-2 px-4 py-4 rounded-xl border-2 transition-all duration-200 ${
              estrenoYEntrego
                ? "border-[#0099FF] bg-[#F0F8FF]"
                : "border-gray-300 bg-white hover:border-[#222]"
            }`}
          >
            <div className="text-center">
              <div className={`text-base font-semibold ${estrenoYEntrego ? "text-[#0099FF]" : "text-[#222]"}`}>
                Sí
              </div>
              <div className="text-xs text-green-600 font-medium">
                10% de descuento
              </div>
            </div>
            <div className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center ${
              estrenoYEntrego
                ? "border-[#0099FF] bg-[#0099FF]"
                : "border-gray-300"
            }`}>
              {estrenoYEntrego && (
                <div className="w-2 h-2 bg-white rounded-full"></div>
              )}
            </div>
          </button>

          {/* Opción No */}
          <button
            onClick={() => onEstrenoChange(false)}
            className={`flex items-center justify-center gap-2 px-4 py-4 rounded-xl border-2 transition-all duration-200 ${
              !estrenoYEntrego
                ? "border-[#0099FF] bg-[#F0F8FF]"
                : "border-gray-300 bg-white hover:border-[#222]"
            }`}
          >
            <div className={`text-base font-semibold ${!estrenoYEntrego ? "text-[#0099FF]" : "text-[#222]"}`}>
              No
            </div>
            <div className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center ${
              !estrenoYEntrego
                ? "border-[#0099FF] bg-[#0099FF]"
                : "border-gray-300"
            }`}>
              {!estrenoYEntrego && (
                <div className="w-2 h-2 bg-white rounded-full"></div>
              )}
            </div>
          </button>
        </div>
      </section>
    </>
  );
}
