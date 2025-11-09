import React from "react";
import type { ProductVariant } from "@/hooks/useProductSelection";

interface PriceAndActionsProps {
  currentPrice: number;
  originalPrice?: number;
  discount?: number;
  selectedVariant?: ProductVariant | null;
  loading: boolean;
  onAddToCart: () => void;
  hasStock: boolean;
  onNotifyStock?: () => void;
}

export default function PriceAndActions({
  currentPrice,
  discount,
  selectedVariant,
  loading,
  onAddToCart,
  hasStock,
  onNotifyStock,
}: PriceAndActionsProps) {
  const discountText = React.useMemo(() => {
    if (selectedVariant && selectedVariant.precioeccommerce > 0 && selectedVariant.precioeccommerce < selectedVariant.precioNormal) {
      return `Descuento: $${(selectedVariant.precioNormal - selectedVariant.precioeccommerce).toLocaleString()}`;
    }
    return discount ? `Descuento: ${discount}` : "";
  }, [selectedVariant, discount]);

  return (
    <div className="mb-6">
      <div className="text-[1.9rem] font-bold text-[#222] leading-tight mb-1">
        {currentPrice ? `$${currentPrice.toLocaleString()}` : "$0"}
      </div>
      {discountText && (
        <div className="text-xs text-[#8A8A8A] mb-4">{discountText}</div>
      )}

      {!hasStock && (
        <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-sm text-amber-900 font-medium">
            Sin unidades disponibles
          </p>
        </div>
      )}

      <div className="flex flex-row gap-4">
        {hasStock ? (
          <button
            className="rounded-full bg-[#0099FF] text-white px-7 py-2 font-semibold text-sm shadow hover:bg-[#007ACC] transition-all duration-200 ease-in-out disabled:opacity-60"
            onClick={onAddToCart}
            disabled={loading}
          >
            {loading ? "Agregando..." : "Añadir al carrito"}
          </button>
        ) : (
          <button
            className="rounded-full bg-gray-800 text-white px-7 py-2 font-semibold text-sm shadow hover:bg-gray-700 transition-all duration-200 ease-in-out"
            onClick={onNotifyStock}
          >
            Notificarme cuando esté disponible
          </button>
        )}
      </div>
    </div>
  );
}
