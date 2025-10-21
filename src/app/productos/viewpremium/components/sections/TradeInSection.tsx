"use client";

import React from "react";

const TradeInSection: React.FC = () => {
  return (
    <div className="bg-gray-50 py-8">
      <div className="container mx-auto px-4 md:px-6 lg:px-12 max-w-7xl">
        {/* Descuento inmediato seleccionando Estreno y Entrego */}
        <div className="mb-8">
          <p className="text-sm font-semibold text-blue-600 mb-2">Nuevo</p>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Descuento inmediato seleccionando Estreno y Entrego. <span className="text-gray-600 text-base font-normal">Aplican T&C</span>
          </h2>
          <div className="bg-blue-50 p-4 rounded-lg mb-6">
            <p className="text-lg font-semibold text-blue-800 mb-2">Obtén hasta un 10% de descuento inmediato</p>
            <p className="text-gray-700">Completa la información de tu antiguo equipo y sobre el precio actual recibirás hasta 10% de descuento, lo verás reflejado en el carrito.</p>
          </div>
        </div>

        {/* Te presentamos Estreno y entrego & Pasarte de iOS a Galaxy */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Te presentamos Estreno y entrego */}
          <div className="bg-white p-6 rounded-lg shadow-sm flex items-center">
            <div className="w-24 h-24 flex-shrink-0 mr-4 bg-gray-200 rounded-full flex items-center justify-center">
              <span className="text-gray-600 text-2xl">📱</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">Te presentamos Estreno y entrego</h3>
              <p className="text-gray-700">Entrega tu teléfono antiguo y si aceptas nuestra oferta, recibirás el valor en tu cuenta</p>
            </div>
          </div>

          {/* ¡Pasarte de iOS a Galaxy es muy fácil! */}
          <div className="bg-white p-6 rounded-lg shadow-sm flex items-center">
            <div className="w-16 h-16 flex-shrink-0 mr-4 flex items-center justify-center bg-blue-600 rounded-full">
              <span className="text-white text-3xl font-bold">S</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">¡Pasarte de iOS a Galaxy es muy fácil!</h3>
              <p className="text-gray-700 text-sm">Cambia de teléfono, conserva lo importante con Smart Switch</p>
              <p className="text-gray-500 text-xs mt-1">*Se aplican términos y condiciones. Visita la página de Smart Switch para obtener más información.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TradeInSection;

