import React from "react";
import { useCeroInteres } from "@/hooks/useCeroInteres";

interface AddiFinancingProps {
  productName?: string;
  selectedColor?: string;
  selectedStorage?: string;
  selectedRam?: string;
  currentPrice?: number;
  originalPrice?: number;
  indcerointeres: number; // 0 = sin cuotas, 1 = mostrar "test"
  allPrices?: number[]; // Todos los precios del producto (precioeccommerce)
  onAddToCart?: () => void;
  isLoading?: boolean;
  hasStock?: boolean;
}

export default function AddiFinancing({
  productName = "",
  selectedColor,
  selectedStorage,
  selectedRam,
  currentPrice = 0,
  originalPrice,
  indcerointeres,
  allPrices = [],
  onAddToCart,
  isLoading = false,
  hasStock = true,
}: AddiFinancingProps) {
  // Hook para cuotas sin interés (solo cuando indcerointeres === 1)
  const ceroInteres = useCeroInteres(
    allPrices,
    currentPrice,
    indcerointeres,
    true
  );

  const monthlyPayment = currentPrice > 0 ? Math.round(currentPrice / 12) : 0;
  const savings = originalPrice && currentPrice && originalPrice > currentPrice
    ? originalPrice - currentPrice
    : 0;

  // Si no hay precio, no mostramos nada
  if (currentPrice === 0) return null;

  // Renderizar información de precio según indcerointeres
  const renderPriceInfo = () => {
    if (indcerointeres === 0) {
      // CASO 0: Solo precio de contado (SIN cuotas)
      return (
        <div className="text-center mb-4">
          <h3 className="text-xl sm:text-2xl font-bold text-[#222] mb-1">
            ${currentPrice.toLocaleString()}
          </h3>
          {savings > 0 && originalPrice && (
            <div className="flex items-center justify-center gap-2 mt-2">
              <span className="text-sm text-gray-500 line-through">
                ${originalPrice.toLocaleString()}
              </span>
              <span className="text-base font-bold text-green-600">
                Ahorra ${savings.toLocaleString()}
              </span>
            </div>
          )}
        </div>
      );
    }

    if (indcerointeres === 1) {
      // CASO 1: Cuotas sin interés (0%)
      const textoInteresCompleto = ceroInteres.formatText();
      const textoInteresSimple = ceroInteres.formatTextSimple();
      
      // Si hay error o está cargando, solo mostrar precio
      if (ceroInteres.error || !textoInteresCompleto || !textoInteresSimple) {
        return (
          <div className="text-center mb-4">
            <h3 className="text-xl sm:text-2xl font-bold text-[#222] mb-1">
              ${currentPrice.toLocaleString()}
            </h3>
          </div>
        );
      }

      return (
        <div className="text-center mb-4">
          {/* Layout limpio - simplificado en móvil */}
          <div className="flex flex-col items-center gap-1 mb-2">
            {/* Móvil: Texto simplificado - Desktop: Texto completo */}
            <p className="text-sm sm:text-base md:text-lg font-bold text-[#222] leading-tight">
              <span className="md:hidden">{textoInteresSimple}</span>
              <span className="hidden md:inline">{textoInteresCompleto}</span>
            </p>
            {/* Separador "o" solo en móvil */}
            <span className="text-xs text-gray-500 md:hidden">o</span>
            {/* Precio de contado */}
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-[#222]">
              ${currentPrice.toLocaleString()}
            </h3>
          </div>
        </div>
      );
    }

    // DEFAULT: Con financiación Addi (para otros valores)
    return (
      <>
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
      </>
    );
  };

  return (
    <div className="space-y-6 w-full">
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

      {/* Precio y financiación - Condicional según indcerointeres */}
      <div className="mb-4">
        {renderPriceInfo()}

        <div className="flex items-center justify-center gap-2 text-xs sm:text-sm text-[#666] mb-4">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
          <span>Entregas: en 1-3 días laborables</span>
        </div>

        <button
          onClick={onAddToCart}
          disabled={isLoading || !hasStock}
          className="w-full rounded-full bg-[#4A90E2] text-white px-6 py-3 sm:py-4 font-bold text-base sm:text-lg shadow-lg hover:bg-[#357ABD] transition-all duration-200 hover:shadow-xl disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isLoading ? "Añadiendo..." : hasStock ? "Añadir al carrito" : "Sin stock"}
        </button>

        <p className="text-[10px] sm:text-xs text-[#999] text-center mt-3">
          *Financiación sujeta a aprobación
        </p>
      </div>
      </div>
    </div>
  );
}
