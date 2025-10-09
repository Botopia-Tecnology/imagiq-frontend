/**
 * Selectores de color y capacidad
 * - Selector de colores con círculos
 * - Selector de capacidades con pills
 */

import React from "react";
import { cn } from "@/lib/utils";
import type { ProductColor, ProductCapacity } from "../ProductCard";

interface ProductSelectorsProps {
  colors: ProductColor[];
  selectedColor: ProductColor | null;
  onColorSelect: (color: ProductColor) => void;
  capacities?: ProductCapacity[];
  selectedCapacity: ProductCapacity | null;
  onCapacitySelect: (capacity: ProductCapacity) => void;
}

export default function ProductSelectors({
  colors,
  selectedColor,
  onColorSelect,
  capacities,
  selectedCapacity,
  onCapacitySelect,
}: ProductSelectorsProps) {
  return (
    <>
      {/* Selector de colores */}
      {colors && colors.length > 0 && (
        <div className="mb-4">
          {selectedColor && (
            <p className="text-base text-gray-900 mb-2 font-medium">
              Color: <span className="font-normal">{selectedColor.label}</span>
            </p>
          )}
          <div className="flex gap-2">
            {colors.map((color) => (
              <button
                key={color.sku}
                onClick={(e) => {
                  e.stopPropagation();
                  onColorSelect(color);
                }}
                className={cn(
                  "w-8 h-8 rounded-full border-2 transition-all duration-200 cursor-pointer relative",
                  selectedColor?.name === color.name
                    ? "border-black ring-1 ring-offset-1 ring-black"
                    : "border-gray-300 hover:border-gray-600"
                )}
                style={{ backgroundColor: color.hex }}
                title={color.label}
                aria-label={`Seleccionar color ${color.label}`}
              >
                {/* Círculo interior para colores blancos */}
                {color.hex.toLowerCase() === "#ffffff" && (
                  <div className="absolute inset-0.5 rounded-full border border-gray-200" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Selector de capacidad */}
      {capacities && capacities.length > 0 && (
        <div className="mb-4">
          <div className="flex gap-2 flex-wrap">
            {capacities.map((capacity) => (
              <button
                key={capacity.value}
                onClick={(e) => {
                  e.stopPropagation();
                  onCapacitySelect(capacity);
                }}
                className={cn(
                  "px-4 py-2 text-base font-medium rounded-full border-2 transition-all duration-200 cursor-pointer",
                  selectedCapacity?.value === capacity.value
                    ? "border-black bg-white text-black"
                    : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
                )}
                title={capacity.label}
              >
                {capacity.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
