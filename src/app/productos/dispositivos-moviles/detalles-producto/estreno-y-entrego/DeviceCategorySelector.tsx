import React from "react";
import { SmartphoneIcon, TabletIcon, WatchIcon } from "./DeviceIcons";
import type { DeviceCategory } from "./types";

interface DeviceCategorySelectorProps {
  selectedCategory: string;
  onSelectCategory: (categoryId: string) => void;
  categories: DeviceCategory[];
}

export default function DeviceCategorySelector({
  selectedCategory,
  onSelectCategory,
  categories,
}: Readonly<DeviceCategorySelectorProps>) {
  const getIconComponent = (categoryId: string) => {
    switch (categoryId) {
      case "watch":
        return WatchIcon;
      case "smartphone":
        return SmartphoneIcon;
      case "tablet":
        return TabletIcon;
      default:
        return WatchIcon;
    }
  };

  return (
    <div className="mb-8">
      <span className="block text-xs font-semibold text-[#222] mb-4">
        Selecciona la categoría de tu dispositivo
      </span>
      <div className="grid grid-cols-3 gap-3 max-w-2xl mx-auto">
        {categories.map((category) => {
          const IconComponent = getIconComponent(category.id);

          return (
            <button
              key={category.id}
              onClick={() => onSelectCategory(category.id)}
              className={`relative rounded-md p-3 transition-all duration-200 ${
                selectedCategory === category.id
                  ? "border-[#0099FF] bg-white"
                  : "border-gray-300 bg-white hover:border-[#222]"
              }`}
              style={
                selectedCategory === category.id
                  ? {
                      borderStyle: "dotted",
                      borderWidth: "2px",
                    }
                  : {
                      borderStyle: "solid",
                      borderWidth: "1px",
                    }
              }
            >
              <div className="flex flex-col items-center gap-2">
                <IconComponent className="w-12 h-12 text-[#222]" />
                <span className="text-sm font-bold text-[#222]">
                  {category.name}
                </span>
                <div className="text-xs text-gray-600 text-center leading-relaxed">
                  <span className="block">Recibe hasta</span>
                  <span className="block font-bold text-[#0099FF] text-base mt-1">
                    $ {category.maxPrice.toLocaleString('es-CO')}
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
