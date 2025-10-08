import React from "react";
import type { DeviceVariant } from "@/hooks/useDeviceVariants";

interface PriceAndActionsProps {
  currentPrice: number;
  originalPrice?: number;
  discount?: number;
  selectedVariant?: DeviceVariant | null;
  loading: boolean;
  onBuyNow: () => void;
  onAddToCart: () => void;
}

export default function PriceAndActions({
  currentPrice,
  discount,
  selectedVariant,
  loading,
  onBuyNow,
  onAddToCart,
}: PriceAndActionsProps) {
  const discountText = React.useMemo(() => {
    if (selectedVariant && selectedVariant.precioDescto > 0 && selectedVariant.precioDescto < selectedVariant.precioNormal) {
      return `Descuento: $${(selectedVariant.precioNormal - selectedVariant.precioDescto).toLocaleString()}`;
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
      <div className="flex flex-row gap-4">
        <button
          className="rounded-full bg-[#0099FF] text-white px-7 py-2 font-semibold text-sm shadow hover:bg-[#007ACC] transition-all duration-200 ease-in-out disabled:opacity-60"
          onClick={onBuyNow}
          disabled={loading}
        >
          {loading ? "Procesando..." : "Comprar ahora"}
        </button>
        <button
          className="rounded-full border border-[#0099FF] text-[#0099FF] px-7 py-2 font-semibold text-sm bg-white hover:bg-[#F2F6FA] transition-all duration-200 ease-in-out disabled:opacity-60"
          onClick={onAddToCart}
          disabled={loading}
        >
          {loading ? "Agregando..." : "Añadir al carrito"}
        </button>
      </div>
    </div>
  );
}
