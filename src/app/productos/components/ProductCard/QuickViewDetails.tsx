/**
 * QuickViewDetails - Detalles del producto en vista rápida
 * Incluye título, rating, selectores y precios
 */

"use client";

import { ProductColor, ProductCapacity } from "../ProductCard";

interface QuickViewDetailsProps {
  product: {
    name: string;
    rating?: number;
    reviewCount?: number;
    colors?: ProductColor[];
    capacities?: ProductCapacity[];
  };
  selectedColor: ProductColor | null;
  selectedCapacity: ProductCapacity | null;
  currentPrice?: string;
  currentOriginalPrice?: string;
  onColorSelect: (color: ProductColor) => void;
  onCapacitySelect: (capacity: ProductCapacity) => void;
}

export default function QuickViewDetails({
  product,
  selectedColor,
  selectedCapacity,
  currentPrice,
  currentOriginalPrice,
  onColorSelect,
  onCapacitySelect,
}: QuickViewDetailsProps) {
  return (
    <div className="flex flex-col">
      {/* Título */}
      <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 md:mb-4">
        {product.name}
      </h2>

      {/* Rating */}
      {product.rating && (
        <div className="flex items-center gap-2 mb-3 md:mb-4">
          <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => (
              <svg
                key={`star-${product.rating}-${i}`}
                className="w-3.5 h-3.5 md:w-4 md:h-4 fill-current text-yellow-500"
                viewBox="0 0 20 20"
              >
                <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
              </svg>
            ))}
          </div>
          <span className="text-xs md:text-sm text-gray-600">
            {product.rating} ({product.reviewCount || 0})
          </span>
        </div>
      )}

      {/* Selectores de Color */}
      {product.colors && product.colors.length > 0 && (
        <div className="mb-5 md:mb-6">
          <p className="text-xs md:text-sm text-gray-600 mb-3">
            Color: <span className="font-semibold text-gray-900">{selectedColor?.label || selectedColor?.name}</span>
          </p>
          <div className="flex flex-wrap gap-3 md:gap-4">
            {product.colors.map((color) => (
              <button
                key={color.sku}
                onClick={() => onColorSelect(color)}
                className={`w-9 h-9 md:w-10 md:h-10 rounded-full border-2 transition-all ${
                  selectedColor?.sku === color.sku
                    ? "border-black scale-110 shadow-md ring-2 ring-offset-2 ring-black"
                    : "border-gray-300 hover:border-gray-500"
                }`}
                style={{ backgroundColor: color.hex }}
                title={color.label}
                aria-label={`Seleccionar color ${color.label}`}
              >
                {color.hex.toLowerCase() === "#ffffff" && (
                  <span className="block w-full h-full rounded-full border border-gray-300" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Selectores de Capacidad */}
      {product.capacities && product.capacities.length > 0 && (
        <div className="mb-5 md:mb-6">
          <p className="text-xs md:text-sm text-gray-600 mb-3">Capacidad</p>
          <div className="flex flex-wrap gap-3 md:gap-4">
            {product.capacities.map((capacity) => (
              <button
                key={capacity.sku || capacity.value}
                onClick={() => onCapacitySelect(capacity)}
                className={`px-4 py-2 md:px-5 md:py-2.5 rounded-full text-xs md:text-sm font-medium transition-all ${
                  selectedCapacity?.value === capacity.value
                    ? "bg-black text-white"
                    : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                }`}
              >
                {capacity.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Precios */}
      {currentPrice && (
        <div className="mb-4 md:mb-6">
          {currentOriginalPrice && currentOriginalPrice !== currentPrice && (
            <p className="text-sm md:text-base text-gray-500 line-through mb-1">
              ${parseInt(currentOriginalPrice.replace(/[^\d]/g, "")).toLocaleString("es-CO")}
            </p>
          )}
          <p className="text-2xl md:text-3xl font-bold text-gray-900">
            ${parseInt(currentPrice.replace(/[^\d]/g, "")).toLocaleString("es-CO")}
          </p>
          <p className="text-xs md:text-sm text-gray-600 mt-1">
            En 12 cuotas sin intereses*
          </p>
        </div>
      )}
    </div>
  );
}
