"use client";

import React, { useState } from "react";

const TradeInSection: React.FC = () => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  return (
    <div className="bg-white py-0">
      <div className="container mx-auto px-4 md:px-6 lg:px-12 max-w-7xl">
        {/* Horizontal separator line */}
        <div className="border-t border-gray-200 mb-6"></div>

        {/* Estreno y Entrego section */}
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Estreno y Entrego
          </h2>
          <p className="text-base text-gray-900 mb-6">
            Selecciona Estreno y Entrego y recibe una oferta por tu dispositivo antiguo
          </p>
          
          {/* Option cards */}
          <div className="flex flex-col md:flex-row gap-3 md:gap-4 mb-4">
            <div 
              className={`flex-1 border rounded-lg p-3 md:p-4 cursor-pointer transition-colors ${
                selectedOption === 'yes' 
                  ? 'border-blue-500' 
                  : 'border-gray-300 hover:border-blue-500'
              }`}
              onClick={() => setSelectedOption('yes')}
            >
              <div className="flex items-start justify-between">
                <span className="font-semibold text-gray-900">Sí, por favor</span>
                <div className="text-right">
                  <p className="text-sm text-gray-600 mb-0">Ahorra hasta</p>
                  <p className="text-xl md:text-lg text-blue-600">$ 599.992</p>
                </div>
              </div>
            </div>

            {/* Blue text - shown between cards on mobile */}
            <p className="text-sm text-blue-600 md:hidden px-1">
              Descuento inmediato seleccionando Estreno y Entrego. Aplican T&C
            </p>

            <div 
              className={`flex-1 border rounded-lg p-3 md:p-4 cursor-pointer transition-colors flex items-center ${
                selectedOption === 'no' 
                  ? 'border-blue-500' 
                  : 'border-gray-300 hover:border-blue-500'
              }`}
              onClick={() => setSelectedOption('no')}
            >
              <span className="font-semibold text-gray-900">No, gracias</span>
            </div>
          </div>

          {/* Blue text - shown below cards on desktop */}
          <p className="text-sm text-blue-600 mb-6 hidden md:block">
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
          <div className="bg-gray-100 p-3 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center">
              <div className="w-20 h-20 flex-shrink-0 mr-4 rounded-lg overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
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
          </div>

          {/* ¡Pasarte de iOS a Galaxy es muy fácil! */}
          <div className="bg-gray-100 p-3 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center">
              <div className="w-20 h-20 flex-shrink-0 mr-4 rounded-lg overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
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

        {/* Separator line */}
        <div className="border-t border-gray-200 my-8"></div>

        {/* Beneficios section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-left">Beneficios</h2>
          
          {/* Benefits grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {/* Estreno y Entrego */}
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex-1 mr-4">
                  <p className="text-xs text-blue-600 mb-1 font-medium">Beneficio Samsung.com</p>
                  <h3 className="text-lg font-bold text-black mb-1">Estreno y Entrego</h3>
                  <p className="text-black text-sm">Selecciona Estreno y Entrego y obtén hasta $700.000 de descuento. Aplican TyC</p>
                </div>
                <div className="w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src="https://res.cloudinary.com/dcljjtnxr/image/upload/v1761056515/offers_tradeIn_c022s6.webp" 
                    alt="Estreno y Entrego" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Cuotas sin interés */}
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex-1 mr-4">
                  <p className="text-xs text-blue-600 mb-1 font-medium">Beneficio Samsung.com</p>
                  <h3 className="text-lg font-bold text-black mb-1">3, 6, 12 o 24 cuotas sin interés con bancos aliados*</h3>
                  <p className="text-black text-sm">Beneficio de lanzamiento</p>
                </div>
                <div className="w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src="https://res.cloudinary.com/dcljjtnxr/image/upload/v1761059888/01_ICONOS_PARADIGMA_0_INTERES_1_z6a2tz.webp" 
                    alt="Cuotas sin interés" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Puntos Rewards */}
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex-1 mr-4">
                  <p className="text-xs text-blue-600 mb-1 font-medium">Beneficio Samsung.com</p>
                  <h3 className="text-lg font-bold text-black mb-1">Acumula puntos Rewards</h3>
                  <p className="text-black text-sm">¡Usa tus Puntos Rewards como parte de pago multiplicados X10!</p>
                </div>
                <div className="w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src="https://res.cloudinary.com/dcljjtnxr/image/upload/v1761056582/offers_rewards_v2_uurjxh.webp" 
                    alt="Puntos Rewards" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Google AI Pro */}
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex-1 mr-4">
                  <p className="text-xs text-blue-600 mb-1 font-medium">Google AI Pro Offer</p>
                  <h3 className="text-lg font-bold text-black mb-1">Obtén Google AI Pro por 6 meses ($79.000 al mes una vez finalizado)</h3>
                  <p className="text-black text-sm cursor-pointer">Ver más</p>
                </div>
                <div className="w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src="https://res.cloudinary.com/dcljjtnxr/image/upload/v1761056609/Q7_Gifts_and_Savings_Thumbnail_Google_ai_pro_PC_80x80_w5zlxv.webp" 
                    alt="Google AI Pro" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Fifth card - same width as others */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex-1 mr-4">
                  <span className="inline-block bg-blue-600 text-white text-xs px-3 py-1 rounded-full mb-2 font-medium">Beneficio exclusivo Shop App</span>
                  <h3 className="text-lg font-bold text-black mb-2">¡Usa tus Puntos Rewards como parte de pago!</h3>
                  <p className="text-gray-600 text-sm mb-3">Ahora los multiplicamos X10: Redime 25.000 puntos y recibe $250.000 Dto. Puedes pagar hasta el 20% de tu compra con puntos.</p>
                  <div className="space-y-1">
                    <p className="text-black text-sm cursor-pointer underline">Descarga Shop App</p>
                    <p className="text-black text-sm cursor-pointer underline">Aplican Términos y condiciones</p>
                  </div>
                </div>
                <div className="w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src="https://res.cloudinary.com/dcljjtnxr/image/upload/v1761056719/COMPRA_REWARDS_MULTIPLICA_X10_2670X2670_cbcgej.webp" 
                    alt="Puntos Rewards X10" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Separator line */}
        <div className="border-t border-gray-200 my-8"></div>

        {/* Compra en línea. Ahorra más. */}
        <div className="bg-white py-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-left">Compra en línea. Ahorra más.</h2>
          
          {/* Benefits - horizontal scroll on mobile, grid on desktop */}
          <div className="overflow-x-auto md:overflow-visible -mx-4 px-4 md:mx-0 md:px-0">
            <div className="flex md:grid md:grid-cols-3 gap-6 md:max-w-4xl min-w-max md:min-w-0">
              {/* Precios exclusivos de Shop App */}
              <div className="bg-gray-100 p-6 rounded flex flex-col w-80 md:w-auto flex-shrink-0">
                <h3 className="text-lg font-bold text-black mb-2">Precios exclusivos de Shop App</h3>
                <p className="text-black text-sm mb-4 flex-grow">Descárgala, regístrate, loguéate y compra.</p>
                <a href="#" className="text-black text-sm font-medium underline">Descárgala</a>
              </div>

              {/* 0% de interés */}
              <div className="bg-gray-100 p-6 rounded flex flex-col w-80 md:w-auto flex-shrink-0">
                <h3 className="text-lg font-bold text-black mb-2">0% de interés</h3>
                <p className="text-black text-sm mb-4 flex-grow">3, 6 12 o 24* cuotas sin intereses pagando con tarjetas de crédito de bancos aliados</p>
                <a href="#" className="text-black text-sm font-medium underline">Más información</a>
              </div>

              {/* Samsung Rewards */}
              <div className="bg-gray-100 p-6 rounded flex flex-col w-80 md:w-auto flex-shrink-0">
                <h3 className="text-lg font-bold text-black mb-2">Samsung Rewards</h3>
                <p className="text-black text-sm flex-grow">Llévate tu nuevo Galaxy acumulando el 4% de tu compra en puntos Samsung Rewards y canjéalos X4</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TradeInSection;

