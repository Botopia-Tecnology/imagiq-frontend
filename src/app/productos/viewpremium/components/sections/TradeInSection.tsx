"use client";

import React, { useState, useEffect } from "react";
import { RefreshCcw } from "lucide-react";
import { TradeInModal, TradeInCompletedSummary } from "@/app/productos/dispositivos-moviles/detalles-producto/estreno-y-entrego";

interface TradeInSectionProps {
  onTradeInComplete?: (deviceName: string, value: number) => void;
}

const TradeInSection: React.FC<TradeInSectionProps> = ({ onTradeInComplete }) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tradeInCompleted, setTradeInCompleted] = useState(false);
  const [tradeInValue, setTradeInValue] = useState<number>(0);
  const [tradeInDeviceName, setTradeInDeviceName] = useState<string>("");

  // Cargar datos de Trade-In desde localStorage al montar el componente
  useEffect(() => {
    const storedTradeIn = localStorage.getItem('imagiq_trade_in');
    if (storedTradeIn) {
      try {
        const data = JSON.parse(storedTradeIn);
        if (data.completed) {
          setTradeInCompleted(true);
          setTradeInValue(data.value);
          setTradeInDeviceName(data.deviceName);
          setSelectedOption('yes');
        }
      } catch (error) {
        console.error('Error al cargar datos de Trade-In:', error);
      }
    }
  }, []);

  const handleYesClick = () => {
    setSelectedOption('yes');
    setIsModalOpen(true);
  };

  const handleNoClick = () => {
    setSelectedOption('no');
    setTradeInCompleted(false);
    setTradeInValue(0);
    setTradeInDeviceName("");
    // Limpiar localStorage si el usuario dice "No, gracias"
    localStorage.removeItem('imagiq_trade_in');
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

    // Guardar en localStorage para mostrar en el carrito
    const tradeInData = {
      deviceName,
      value,
      completed: true,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem('imagiq_trade_in', JSON.stringify(tradeInData));

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
    <div className="bg-white py-0">
      <div className="container mx-auto px-4 md:px-6 lg:px-12 max-w-7xl">
        {/* Horizontal separator line */}
        <div className="border-t border-gray-200 mb-6"></div>

        {/* Mostrar banner de resumen si el Trade-In está completado */}
        {tradeInCompleted && tradeInValue > 0 && tradeInDeviceName && (
          <TradeInCompletedSummary
            deviceName={tradeInDeviceName}
            tradeInValue={tradeInValue}
            onEdit={handleEdit}
          />
        )}

        {/* Estreno y Entrego section - Solo mostrar si NO está completado */}
        {!tradeInCompleted && (
          <div className="mb-5">
          <h2 className="text-2xl font-bold text-gray-900 mb-1.5">
            Estreno y Entrego
          </h2>
          <p className="text-sm text-gray-900 mb-4">
            Selecciona Estreno y Entrego y recibe una oferta por tu dispositivo antiguo
          </p>

          {/* Option cards */}
          <div className="flex flex-col md:flex-row gap-2.5 md:gap-3 mb-3">
            <div
              className={`flex-1 border rounded-lg p-2.5 md:p-3 cursor-pointer transition-colors ${selectedOption === 'yes'
                ? 'border-blue-500'
                : 'border-gray-300 hover:border-blue-500'
                }`}
              onClick={handleYesClick}
            >
              <div className="flex items-start justify-between">
                <span className="font-semibold text-sm text-gray-900">Sí, por favor</span>
                {tradeInCompleted && tradeInValue > 0 && (
                  <div className="text-right">
                    <p className="text-xs text-gray-600 mb-0">Ahorra hasta</p>
                    <p className="text-lg md:text-base text-blue-600">
                      $ {tradeInValue.toLocaleString('es-CO')}
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
              className={`flex-1 border rounded-lg p-2.5 md:p-3 cursor-pointer transition-colors flex items-center ${selectedOption === 'no'
                ? 'border-blue-500'
                : 'border-gray-300 hover:border-blue-500'
                }`}
              onClick={handleNoClick}
            >
              <span className="font-semibold text-sm text-gray-900">No, gracias</span>
            </div>
          </div>
        </div>
        )}

        {/* Te presentamos Estreno y entrego & Pasarte de iOS a Galaxy */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Te presentamos Estreno y entrego */}
          <div className="bg-gray-100 p-2.5 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center">
              <div className="w-16 h-16 flex-shrink-0 mr-3 rounded-lg bg-blue-50 flex items-center justify-center">
                <RefreshCcw className="w-8 h-8 text-blue-600" strokeWidth={2} />
              </div>
              <div className="flex-1">
                <h3 className="text-base font-semibold text-black mb-0">Te presentamos Estreno y entrego</h3>
                <p className="text-sm text-black">Entrega tu teléfono antiguo y si aceptas nuestra oferta, recibirás el valor en tu cuenta</p>
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
                <h3 className="text-base font-semibold text-black mb-0">¡Pasarte de iOS a Galaxy es muy fácil!</h3>
                <p className="text-black text-xs mb-0">Cambia de teléfono, conserva lo importante con Smart Switch</p>
                <p className="text-black text-[11px]">*Se aplican términos y condiciones. Visita la página de Smart Switch para obtener más información.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Separator line */}
        <div className="border-t border-gray-200 my-6"></div>
      </div>

      {/* Trade-In Modal */}
      <TradeInModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onContinue={() => setIsModalOpen(false)}
        onCancelWithoutCompletion={handleCancelWithoutCompletion}
        onCompleteTradeIn={handleCompleteTradeIn}
      />
    </div>
  );
};

export default TradeInSection;

