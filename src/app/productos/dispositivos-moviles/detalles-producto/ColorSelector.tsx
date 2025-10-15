// Selector de color
// Componente reutilizable para mostrar las opciones de color y seleccionar una
import React from "react";
import { ColorOption } from "@/hooks/useDeviceVariants";

interface ColorSelectorProps {
  colorOptions: ColorOption[];
  selectedColor: ColorOption | null;
  handleColorSelection: (color: ColorOption) => void;
  hasStock: () => boolean;
  showStockMessage?: boolean;
}

/**
 * Selector de color, muestra lista de colores y permite seleccionar uno.
 */
const ColorSelector: React.FC<ColorSelectorProps> = ({
  colorOptions,
  selectedColor,
  handleColorSelection,
  hasStock,
  showStockMessage = true,
}) => (
  <div>
    <div className="flex gap-3">
      {colorOptions.map((colorOption) => (
        <button
          key={colorOption.color}
          className={`relative w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${
            selectedColor?.color === colorOption.color
              ? "ring-2 ring-[#222] ring-offset-2"
              : "ring-1 ring-gray-300"
          }`}
          style={{ backgroundColor: colorOption.hex }}
          onClick={() => handleColorSelection(colorOption)}
          aria-label={colorOption.color}
          title={colorOption.color}
        >
          <span className="sr-only">{colorOption.color}</span>
        </button>
      ))}
    </div>
    {/* Mensaje de stock */}
    {showStockMessage && !hasStock() && (
      <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-600 text-sm font-medium text-center">
          Sin stock
        </p>
      </div>
    )}
  </div>
);

export default ColorSelector;
