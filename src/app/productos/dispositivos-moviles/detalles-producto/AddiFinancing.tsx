import React from "react";
import Image from "next/image";

interface AddiFinancingProps {
  productName?: string;
  selectedColor?: string;
  selectedStorage?: string;
  selectedRam?: string;
  currentPrice?: number;
  originalPrice?: number;
}

export default function AddiFinancing({
  productName = "",
  selectedColor,
  selectedStorage,
  selectedRam,
  currentPrice = 0,
  originalPrice,
}: AddiFinancingProps) {
  const monthlyPayment = currentPrice > 0 ? Math.round(currentPrice / 12) : 0;
  const savings = originalPrice && currentPrice && originalPrice > currentPrice 
    ? originalPrice - currentPrice 
    : 0;

  // Si no hay precio, no mostramos nada
  if (currentPrice === 0) return null;

  return (
    <div className="space-y-6 w-full">
      {/* Ofertas */}
      <section className="w-full">
        <h3 className="text-base font-semibold text-[#222] mb-5">Oferta</h3>

        {/* Oferta 1: Estreno y Entrego */}
        <div className="bg-gray-50 rounded-xl p-6 mb-4 border-2 border-gray-200 hover:border-gray-300 transition-all duration-200 shadow-sm hover:shadow-md">
          <div className="flex gap-5 items-center">
            <div className="flex-shrink-0 w-24 h-24 relative bg-white rounded-xl p-3 flex items-center justify-center">
              <Image
                src="/images/products_offers/ESTRENO_ENTREGO_2670x2670_v2.webp"
                alt="Estreno y Entrego"
                fill
                className="object-contain p-2"
                placeholder="blur"
                blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiBmaWxsPSIjZjNmNGY2Ii8+PC9zdmc+"
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="inline-block bg-blue-500 text-white text-xs font-semibold px-3 py-1 rounded-full mb-2">
                Beneficio Exclusivo
              </div>
              <h4 className="font-bold text-base text-[#222] mb-2 leading-tight">
                Selecciona Estreno y Entrego
              </h4>
              <p className="text-sm text-[#666] mb-3 leading-relaxed">
                Y obtén $300.000 de Dto. Inmediato en el carrito
              </p>
              <button className="text-sm font-semibold text-[#0099FF] hover:underline mb-1 block">
                Inscríbete en la lista de espera del App
              </button>
              <button className="text-xs text-[#666] underline hover:text-[#222]">
                Aplican Términos y condiciones
              </button>
            </div>
          </div>
        </div>

        {/* Oferta 2: Galaxy Buds3 FE */}
        <div className="bg-gray-50 rounded-xl p-6 mb-4 border-2 border-gray-200 hover:border-gray-300 transition-all duration-200 shadow-sm hover:shadow-md">
          <div className="flex gap-5 items-center">
            <div className="flex-shrink-0 w-24 h-24 relative bg-white rounded-xl p-3 flex items-center justify-center">
              <Image
                src="/images/products_offers/GALAXY_BUDS3_FE_2670x2670.webp"
                alt="Galaxy Buds3 FE"
                fill
                className="object-contain p-2"
                placeholder="blur"
                blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiBmaWxsPSIjZjNmNGY2Ii8+PC9zdmc+"
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="inline-block bg-blue-500 text-white text-xs font-semibold px-3 py-1 rounded-full mb-2">
                Beneficio de Lanzamiento
              </div>
              <h4 className="font-bold text-base text-[#222] mb-2 leading-tight">
                Por la compra de tu nuevo Galaxy S25 FE
              </h4>
              <p className="text-sm text-[#666] mb-3 leading-relaxed">
                Lleva unos Galaxy Buds3 FE sin pagar más
              </p>
              <button className="text-sm font-semibold text-[#0099FF] hover:underline mb-1 block">
                Inscríbete en la lista de espera del App
              </button>
              <button className="text-xs text-[#666] underline hover:text-[#222]">
                Aplican Términos y condiciones
              </button>
            </div>
          </div>
        </div>

        {/* Oferta 3: Puntos Rewards */}
        <div className="bg-gray-50 rounded-xl p-6 mb-4 border-2 border-gray-200 hover:border-gray-300 transition-all duration-200 shadow-sm hover:shadow-md">
          <div className="flex gap-5 items-center">
            <div className="flex-shrink-0 w-24 h-24 relative bg-white rounded-xl p-3 flex items-center justify-center">
              <Image
                src="/images/products_offers/COMPRA_REWARDS_MULTIPLICA_X10_2670X2670.webp"
                alt="Puntos Rewards"
                fill
                className="object-contain p-2"
                placeholder="blur"
                blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiBmaWxsPSIjZjNmNGY2Ii8+PC9zdmc+"
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="inline-block bg-blue-500 text-white text-xs font-semibold px-3 py-1 rounded-full mb-2">
                Beneficio exclusivo Shop App
              </div>
              <h4 className="font-bold text-base text-[#222] mb-2 leading-tight">
                ¡Usa tus Puntos Rewards como parte de pago!
              </h4>
              <p className="text-sm text-[#666] mb-3 leading-relaxed">
                Ahora los multiplicamos X10: Redime 25.000 puntos y recibe $250.000 Dto. Úsalos todos y ahorra.
              </p>
              <button className="text-sm font-semibold text-[#0099FF] hover:underline mb-1 block">
                Inscríbete en la lista de espera del App
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Resumen de Compra */}
      <div className="bg-gray-50 rounded-2xl p-4 sm:p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 mb-32 w-full">
        <h3 className="text-lg sm:text-xl font-bold text-[#222] mb-4">Resumen de Compra</h3>
      
      {productName && (
        <div className="mb-4">
          <h4 className="text-base sm:text-lg font-semibold text-[#222] mb-1">
            {productName}
          </h4>
          {(selectedColor || selectedStorage || selectedRam) && (
            <div className="text-sm text-[#666]">
              {selectedColor && <span>{selectedColor}</span>}
              {selectedColor && (selectedStorage || selectedRam) && <span> | </span>}
              {selectedStorage && <span>{selectedStorage}</span>}
              {selectedStorage && selectedRam && <span> | </span>}
              {selectedRam && <span>{selectedRam}</span>}
            </div>
          )}
        </div>
      )}

      <div className="border-t border-gray-300 pt-4 mb-4"></div>

      {/* Precio y financiación */}
      <div className="mb-4">
        <div className="text-center mb-4">
          <h3 className="text-xl sm:text-2xl font-bold text-[#222] mb-1">
            Desde ${monthlyPayment.toLocaleString()} al mes
          </h3>
          <p className="text-sm sm:text-base text-[#666] mb-1">
            en 12 cuotas sin intereses* o ${currentPrice.toLocaleString()}
          </p>
        </div>

        {savings > 0 && originalPrice && (
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="text-sm text-gray-500 line-through">
              ${originalPrice.toLocaleString()}
            </span>
            <span className="text-base font-bold text-blue-500">
              Ahorra ${savings.toLocaleString()}
            </span>
          </div>
        )}

        <div className="flex items-center justify-center gap-2 text-xs sm:text-sm text-[#666] mb-4">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
          <span>Entregas: en 1-3 días laborables</span>
        </div>

        <button className="w-full rounded-full bg-[#4A90E2] text-white px-6 py-3 sm:py-4 font-bold text-base sm:text-lg shadow-lg hover:bg-[#357ABD] transition-all duration-200 hover:shadow-xl">
          Comprar ahora
        </button>

        <p className="text-[10px] sm:text-xs text-[#999] text-center mt-3">
          *Financiación sujeta a aprobación
        </p>
      </div>
      </div>
    </div>
  );
}
