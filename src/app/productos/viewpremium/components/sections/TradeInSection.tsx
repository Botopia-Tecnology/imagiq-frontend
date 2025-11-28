"use client";

import React, { useState, useEffect } from "react";
import { RefreshCcw } from "lucide-react";
import {
  TradeInModal,
  TradeInCompletedSummary,
} from "@/app/productos/dispositivos-moviles/detalles-producto/estreno-y-entrego";

interface TradeInSectionProps {
  onTradeInComplete?: (deviceName: string, value: number) => void;
  productSku?: string;
}

const TradeInSection: React.FC<TradeInSectionProps> = ({
  onTradeInComplete,
  productSku,
}) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tradeInCompleted, setTradeInCompleted] = useState(false);
  const [tradeInValue, setTradeInValue] = useState<number>(0);
  const [tradeInDeviceName, setTradeInDeviceName] = useState<string>("");

  // Cargar datos de Trade-In desde localStorage al montar el componente
  useEffect(() => {
    const storedTradeIn = localStorage.getItem("imagiq_trade_in");
    if (storedTradeIn) {
      try {
        const data = JSON.parse(storedTradeIn);

        let tradeInData = data;

        // Si hay un SKU específico, buscar los datos para ese SKU
        if (productSku && typeof data === 'object' && !data.deviceName) {
          tradeInData = data[productSku];
        }

        if (tradeInData && tradeInData.completed) {
          setTradeInCompleted(true);
          setTradeInValue(tradeInData.value);
          setTradeInDeviceName(tradeInData.deviceName);
          setSelectedOption("yes");
        } else {
          // Si no hay datos completados para este SKU, resetear estado
          setTradeInCompleted(false);
          setTradeInValue(0);
          setTradeInDeviceName("");
          setSelectedOption(null);
        }
      } catch (error) {
        console.error("Error al cargar datos de Trade-In:", error);
      }
    } else {
      // Si no hay nada en localStorage, resetear estado
      setTradeInCompleted(false);
      setTradeInValue(0);
      setTradeInDeviceName("");
      setSelectedOption(null);
    }
  }, [productSku]);

  const handleYesClick = () => {
    setSelectedOption("yes");
    setIsModalOpen(true);
  };

  const handleNoClick = () => {
    setSelectedOption("no");
    setTradeInCompleted(false);
    setTradeInValue(0);
    setTradeInDeviceName("");

    // Limpiar localStorage para este SKU
    if (productSku) {
      try {
        const storedTradeIn = localStorage.getItem("imagiq_trade_in");
        if (storedTradeIn) {
          const data = JSON.parse(storedTradeIn);
          if (typeof data === 'object' && !data.deviceName) {
            delete data[productSku];
            localStorage.setItem("imagiq_trade_in", JSON.stringify(data));
          }
        }
      } catch (e) {
        console.error("Error cleaning trade-in for SKU:", e);
      }
    } else {
      // Fallback para comportamiento antiguo
      localStorage.removeItem("imagiq_trade_in");
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    if (!tradeInCompleted) {
      setSelectedOption(null);
    }
  };

  const handleCompleteTradeIn = (deviceName: string, value: number) => {
    setTradeInCompleted(true);
    setTradeInValue(value);
    setTradeInDeviceName(deviceName);
    setIsModalOpen(false);

    // NOTA: El guardado en localStorage ya lo maneja el TradeInModal internamente
    // cuando se le pasa el productSku. No necesitamos duplicar esa lógica aquí.

    if (onTradeInComplete) {
      onTradeInComplete(deviceName, value);
    }
  };

  const handleCancelWithoutCompletion = () => {
    setSelectedOption(null);
    setIsModalOpen(false);
  };

  const handleEdit = () => {
    setIsModalOpen(true);
  };

  return (
    <div className="bg-white pt-2 pb-8 sticky top-[120px] z-30">
      <div className="container mx-auto px-4 md:px-6 lg:px-12 max-w-7xl">
        {/* Horizontal separator line */}
        <div className="border-t border-gray-200 mb-2 md:mb-3"></div>

        {/* Mostrar banner de resumen si el Trade-In está completado */}
        {tradeInCompleted && tradeInValue > 0 && tradeInDeviceName && (
          <TradeInCompletedSummary
            deviceName={tradeInDeviceName}
            tradeInValue={tradeInValue}
            onEdit={handleEdit}
          />
        )}

        {/* Entrego y Estreno section - Solo mostrar si NO está completado */}
        {!tradeInCompleted && (
          <div className="mb-3 md:mb-5">
            <h2 className="text-2xl font-bold text-gray-900 mb-1 md:mb-1.5">
              Entrego y Estreno
            </h2>
            <p className="text-sm text-gray-900 mb-3 md:mb-4">
              Selecciona Entrego y Estreno y recibe una oferta por tu
              dispositivo antiguo
            </p>

            {/* Option cards */}
            <div className="flex flex-col md:flex-row gap-2.5 md:gap-3 mb-2 md:mb-3">
              <div
                className={`flex-1 border rounded-lg p-2.5 md:p-3 cursor-pointer transition-colors ${selectedOption === "yes"
                    ? "border-blue-500"
                    : "border-gray-300 hover:border-blue-500"
                  }`}
                onClick={handleYesClick}
              >
                <div className="flex items-start justify-between">
                  <span className="font-semibold text-sm text-gray-900">
                    Sí, por favor
                  </span>
                  {tradeInCompleted && tradeInValue > 0 && (
                    <div className="text-right">
                      <p className="text-xs text-gray-600 mb-0">Ahorra hasta</p>
                      <p className="text-lg md:text-base text-blue-600">
                        $ {tradeInValue.toLocaleString("es-CO")}
                      </p>
                    </div>
                  )}
                </div>
                {tradeInCompleted && tradeInDeviceName && (
                  <p className="text-[11px] text-gray-500 mt-1.5">
                    Dispositivo: {tradeInDeviceName}
                  </p>
                )}
              </div>

              <div
                className={`flex-1 border rounded-lg p-2.5 md:p-3 cursor-pointer transition-colors flex items-center ${selectedOption === "no"
                    ? "border-blue-500"
                    : "border-gray-300 hover:border-blue-500"
                  }`}
                onClick={handleNoClick}
              >
                <span className="font-semibold text-sm text-gray-900">
                  No, gracias
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Te presentamos Entrego y Estreno & Pasarte de iOS a Galaxy */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
          {/* Te presentamos Entrego y Estreno */}
          <div className="bg-gray-100 p-2.5 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center">
              <div className="w-16 h-16 flex-shrink-0 mr-3 rounded-lg bg-blue-50 flex items-center justify-center">
                <RefreshCcw className="w-8 h-8 text-blue-600" strokeWidth={2} />
              </div>
              <div className="flex-1">
                <h3 className="text-base font-semibold text-black mb-0">
                  Te presentamos Entrego y Estreno
                </h3>
                <p className="text-sm text-black">
                  Entrega tu teléfono antiguo y si aceptas nuestra oferta,
                  recibirás el valor en tu cuenta
                </p>
              </div>
            </div>
          </div>

          {/* ¡Pasarte de iOS a Galaxy es muy fácil! */}
          <div className="bg-gray-100 p-2.5 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center">
              <div className="w-16 h-16 flex-shrink-0 mr-3 rounded-lg overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://res.cloudinary.com/dcljjtnxr/image/upload/v1761056415/smart_switch_PC_mrtvom.webp"
                  alt="Smart Switch iOS to Galaxy"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <h3 className="text-base font-semibold text-black mb-0">
                  ¡Pasarte de iOS a Galaxy es muy fácil!
                </h3>
                <p className="text-black text-xs mb-0">
                  Cambia de teléfono, conserva lo importante con Smart Switch
                </p>
                <p className="text-black text-[11px]">
                  *Se aplican términos y condiciones. Visita la página de Smart
                  Switch para obtener más información.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trade-In Modal */}
      <TradeInModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onContinue={() => setIsModalOpen(false)}
        onCancelWithoutCompletion={handleCancelWithoutCompletion}
        onCompleteTradeIn={handleCompleteTradeIn}
        productSku={productSku}
      />
    </div>
  );
};

export default TradeInSection;
