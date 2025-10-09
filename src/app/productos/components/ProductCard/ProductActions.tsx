/**
 * Botones de acción del producto
 * - Comprar ahora
 * - Más información
 * - Notifícame (sin stock)
 */

import React from "react";
import { cn } from "@/lib/utils";

interface ProductActionsProps {
  isOutOfStock: boolean;
  isLoading: boolean;
  onAddToCart: (e: React.MouseEvent) => void;
  onMoreInfo: (e: React.MouseEvent) => void;
  onNotifyMe?: (e: React.MouseEvent) => void;
}

export default function ProductActions({
  isOutOfStock,
  isLoading,
  onAddToCart,
  onMoreInfo,
  onNotifyMe,
}: ProductActionsProps) {
  return (
    <div className="space-y-3 mt-auto">
      {isOutOfStock ? (
        <button
          onClick={onNotifyMe}
          className="w-full bg-black text-white py-3.5 px-4 rounded-full text-base font-semibold cursor-pointer transition-all duration-200 flex items-center justify-center hover:bg-gray-800"
        >
          Notifícame
        </button>
      ) : (
        <button
          onClick={onAddToCart}
          disabled={isLoading}
          className={cn(
            "w-full bg-black text-white py-3.5 px-4 rounded-full text-base font-semibold cursor-pointer",
            "transition-all duration-200 flex items-center justify-center",
            "hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed",
            isLoading && "animate-pulse"
          )}
        >
          {isLoading ? (
            <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          ) : (
            <span>Comprar ahora</span>
          )}
        </button>
      )}
      <button
        onClick={onMoreInfo}
        className="w-full bg-white text-black py-3.5 px-4 rounded-full text-base font-semibold cursor-pointer border border-gray-300 hover:bg-gray-50 transition-all duration-200"
      >
        Más información
      </button>
    </div>
  );
}
