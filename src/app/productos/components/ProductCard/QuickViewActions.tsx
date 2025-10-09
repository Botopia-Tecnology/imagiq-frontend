/**
 * QuickViewActions - Botones de acción para vista rápida
 * Incluye botones de agregar al carrito y ver detalles
 */

"use client";

interface QuickViewActionsProps {
  onAddToCart: () => void;
  onViewDetails: () => void;
}

export default function QuickViewActions({
  onAddToCart,
  onViewDetails,
}: QuickViewActionsProps) {
  return (
    <div className="mt-auto space-y-2 md:space-y-3 sticky bottom-0 bg-white pt-3 md:pt-0 pb-4 md:pb-0 -mx-4 px-4 md:mx-0 md:px-0 border-t md:border-t-0">
      <button
        onClick={onAddToCart}
        className="w-full bg-black text-white py-2.5 md:py-3 rounded-full font-semibold text-sm md:text-base hover:bg-gray-800 transition-colors"
      >
        Agregar al carrito
      </button>
      <button
        onClick={onViewDetails}
        className="w-full bg-white text-black border-2 border-black py-2.5 md:py-3 rounded-full font-semibold text-sm md:text-base hover:bg-gray-50 transition-colors"
      >
        Ver detalles completos
      </button>
    </div>
  );
}
