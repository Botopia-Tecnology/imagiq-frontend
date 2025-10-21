"use client";

import React, { useState } from "react";

const TradeInSection: React.FC = () => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  return (
    <div className="bg-white py-8">
      <div className="container mx-auto px-4 md:px-6 lg:px-12 max-w-7xl">
        {/* Horizontal separator line */}
        <div className="border-t border-gray-200 mb-6"></div>

        {/* Estreno y Entrego section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Estreno y Entrego
          </h2>
          <p className="text-base text-gray-900 mb-6">
            Selecciona Estreno y Entrego y recibe una oferta por tu dispositivo antiguo
          </p>
          
          {/* Option cards */}
          <div className="flex gap-4 mb-4">
            <div 
              className={`flex-1 border rounded-lg p-4 cursor-pointer transition-colors ${
                selectedOption === 'yes' 
                  ? 'border-blue-500' 
                  : 'border-gray-300 hover:border-blue-500'
              }`}
              onClick={() => setSelectedOption('yes')}
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-gray-900">Sí, por favor</span>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Ahorra hasta</p>
                  <p className="text-lg font-bold text-blue-600">$ 599.992</p>
                </div>
              </div>
            </div>
            <div 
              className={`flex-1 border rounded-lg p-4 cursor-pointer transition-colors flex items-center ${
                selectedOption === 'no' 
                  ? 'border-blue-500' 
                  : 'border-gray-300 hover:border-blue-500'
              }`}
              onClick={() => setSelectedOption('no')}
            >
              <span className="font-semibold text-gray-900">No, gracias</span>
            </div>
          </div>

          <p className="text-sm text-blue-600 mb-6">
            Descuento inmediato seleccionando Estreno y Entrego. Aplican T&C
          </p>

          {/* 10% discount banner */}
          <div className="bg-gray-100 p-4 rounded-lg mb-6">
            <p className="text-lg font-bold text-black mb-2">Obtén hasta un 10% de descuento inmediato</p>
            <p className="text-gray-800">Completa la información de tu antiguo equipo y sobre el precio actual recibirás hasta 10% de descuento, lo verás reflejado en el carrito.</p>
          </div>
        </div>

        {/* Te presentamos Estreno y entrego & Pasarte de iOS a Galaxy */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Te presentamos Estreno y entrego */}
          <div className="bg-gray-100 p-3 rounded-lg shadow-sm border border-gray-100 relative">
            <div className="flex items-start">
              <div className="w-16 h-16 flex-shrink-0 mr-4 rounded-lg overflow-hidden">
                <img 
                  src="https://res.cloudinary.com/dcljjtnxr/image/upload/v1761056386/Trade-in_DM_Buying_How-to_Buy_page_Thumbnail_eulzhe.webp" 
                  alt="Trade-in video thumbnail" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-black mb-0">Te presentamos Estreno y entrego</h3>
                <p className="text-black">Entrega tu teléfono antiguo y si aceptas nuestra oferta, recibirás el valor en tu cuenta</p>
              </div>
            </div>
            <div className="absolute top-4 right-4">
              <div className="w-6 h-6 bg-gray-400 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">i</span>
              </div>
            </div>
          </div>

          {/* ¡Pasarte de iOS a Galaxy es muy fácil! */}
          <div className="bg-gray-100 p-3 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-start">
              <div className="w-16 h-16 flex-shrink-0 mr-4 rounded-lg overflow-hidden">
                <img 
                  src="https://res.cloudinary.com/dcljjtnxr/image/upload/v1761056415/smart_switch_PC_mrtvom.webp" 
                  alt="Smart Switch iOS to Galaxy" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-black mb-0">¡Pasarte de iOS a Galaxy es muy fácil!</h3>
                <p className="text-black text-sm mb-0">Cambia de teléfono, conserva lo importante con Smart Switch</p>
                <p className="text-black text-xs">*Se aplican términos y condiciones. Visita la página de Smart Switch para obtener más información.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TradeInSection;

