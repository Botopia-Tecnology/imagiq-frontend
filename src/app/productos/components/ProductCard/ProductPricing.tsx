/**
 * Componente de precios del producto
 * - Precio tachado
 * - Ahorro destacado
 * - Precio mensual con cuotas
 */

import React from "react";

interface ProductPricingProps {
  currentPrice: string;
  currentOriginalPrice?: string;
  savings: number;
  monthlyPrice: string | null;
  monthlyInstallments: number;
  isOutOfStock: boolean;
}

export default function ProductPricing({
  currentPrice,
  currentOriginalPrice,
  savings,
  monthlyPrice,
  monthlyInstallments,
  isOutOfStock,
}: ProductPricingProps) {
  if (!currentPrice) return null;

  // Clases base que cambian según stock
  const textPrimary = isOutOfStock ? "text-gray-400" : "text-gray-900";
  const textSecondary = isOutOfStock ? "text-gray-300" : "text-gray-600";
  const textTertiary = isOutOfStock ? "text-gray-300" : "text-gray-400";

  return (
    <div className="mb-2 md:mb-3">
      {/* Precio original tachado + Ahorro */}
      {currentOriginalPrice && currentOriginalPrice !== currentPrice && !isOutOfStock && (
        <div className="flex flex-col gap-0.5 md:gap-1 mb-1 md:mb-1.5">
          <span className="text-base md:text-lg text-gray-500 line-through">
            ${parseInt(currentOriginalPrice.replace(/[^\d]/g, "")).toLocaleString("es-CO")}
          </span>
          {savings > 0 && (
            <span className="text-sm md:text-base font-bold text-blue-600">
              Ahorra ${savings.toLocaleString("es-CO")}
            </span>
          )}
        </div>
      )}

      {/* Precio mensual - Versión en dos líneas */}
      {monthlyPrice && (
        <div className="mb-1.5 md:mb-2">
          <p className={`text-sm md:text-base ${textPrimary} leading-snug mb-0.5 md:mb-1`}>
            Desde <span className="font-bold">${monthlyPrice}</span> al mes
          </p>
          <p className={`text-xs md:text-sm ${textSecondary} mb-1 md:mb-2`}>
            en {monthlyInstallments} cuotas sin intereses*
          </p>
          <p className={`text-lg md:text-xl font-bold ${textPrimary}`}>
            ${parseInt(currentPrice.replace(/[^\d]/g, "")).toLocaleString("es-CO")}
          </p>
        </div>
      )}

      {/* Precio total (cuando no hay cuotas) */}
      {!monthlyPrice && (
        <p className={`text-xl md:text-2xl font-bold ${textPrimary} mb-1.5 md:mb-2`}>
          ${parseInt(currentPrice.replace(/[^\d]/g, "")).toLocaleString("es-CO")}
        </p>
      )}

      {/* Condiciones */}
      <p className={`text-[10px] md:text-xs ${textTertiary}`}>*Aplican términos y condiciones</p>
    </div>
  );
}
