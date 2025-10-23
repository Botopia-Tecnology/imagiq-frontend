"use client";

import React from "react";

const BenefitsSection: React.FC = () => {
  return (
    <div className="bg-white py-8">
      <div className="container mx-auto px-4 md:px-6 lg:px-12 max-w-7xl">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Beneficios</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: Estreno y Entrego */}
          <div className="bg-gray-50 p-6 rounded-lg shadow-sm flex items-start">
            <div className="w-12 h-12 flex-shrink-0 mr-4 flex items-center justify-center border border-gray-300 rounded-full">
              <span className="text-gray-600 text-2xl">📱</span>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 mb-1">Beneficio Samsung.com</p>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">Estreno y Entrego</h3>
              <p className="text-gray-700 text-sm">Selecciona Estreno y Entrego y obtén hasta $700.000 de descuento. Aplican TyC</p>
            </div>
          </div>

          {/* Card 2: 3, 6, 12 o 24 cuotas sin interés */}
          <div className="bg-gray-50 p-6 rounded-lg shadow-sm flex items-start">
            <div className="w-12 h-12 flex-shrink-0 mr-4 flex items-center justify-center border border-gray-300 rounded-full">
              <div className="relative">
                <span className="text-gray-600 text-2xl">💳</span>
                <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs font-bold rounded-full px-1">0%</span>
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 mb-1">Beneficio Samsung.com</p>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">3, 6, 12 o 24 cuotas sin interés con bancos aliados*</h3>
              <p className="text-gray-700 text-sm">Beneficio de lanzamiento</p>
            </div>
          </div>

          {/* Card 3: Acumula puntos Rewards */}
          <div className="bg-gray-50 p-6 rounded-lg shadow-sm flex items-start">
            <div className="w-12 h-12 flex-shrink-0 mr-4 flex items-center justify-center border border-gray-300 rounded-full">
              <span className="text-yellow-500 text-2xl">⭐</span>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 mb-1">Beneficio Samsung.com</p>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">Acumula puntos Rewards</h3>
              <p className="text-gray-700 text-sm">¡Usa tus Puntos Rewards como parte de pago multiplicados X10!</p>
            </div>
          </div>

          {/* Card 4: Google AI Pro Offer */}
          <div className="bg-gray-50 p-6 rounded-lg shadow-sm flex items-start">
            <div className="w-12 h-12 flex-shrink-0 mr-4 flex items-center justify-center border border-gray-300 rounded-full">
              <span className="text-purple-500 text-2xl">💎</span>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 mb-1">Google AI Pro Offer</p>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">Obtén Google AI Pro por 6 meses ($79.000 al mes uma vez finalizado)</h3>
              <a href="#" className="text-blue-600 text-sm font-semibold hover:underline">Ver más</a>
            </div>
          </div>

          {/* Card 5: ¡Usa tus Puntos Rewards como parte de pago! (Shop App) */}
          <div className="bg-blue-50 p-6 rounded-lg shadow-sm flex items-start md:col-span-2">
            <div className="w-12 h-12 flex-shrink-0 mr-4 flex items-center justify-center border border-blue-300 rounded-full bg-blue-100">
              <span className="text-blue-600 text-2xl">⭐</span>
            </div>
            <div>
              <p className="text-xs font-semibold text-blue-600 mb-1">Beneficio exclusivo Shop App</p>
              <h3 className="text-lg font-semibold text-blue-800 mb-1">¡Usa tus Puntos Rewards como parte de pago!</h3>
              <p className="text-blue-700 text-sm mb-2">Ahora los multiplicamos X10: Redime 25.000 puntos y recibe $250.000 Dto. Puedes pagar hasta el 20% de tu compra con puntos.</p>
              <a href="#" className="text-blue-600 text-sm font-semibold hover:underline block mb-1">Descarga Shop App</a>
              <p className="text-blue-500 text-xs">Aplican Términos y condiciones</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BenefitsSection;

