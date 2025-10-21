import React from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { Brand } from "./types";

interface BrandDropdownProps {
  brands: Brand[];
  selectedBrand: Brand | null;
  isOpen: boolean;
  onToggle: () => void;
  onSelectBrand: (brand: Brand) => void;
}

export default function BrandDropdown({
  brands,
  selectedBrand,
  isOpen,
  onToggle,
  onSelectBrand,
}: Readonly<BrandDropdownProps>) {
  return (
    <div className="mb-6 max-w-2xl mx-auto">
      <span className="block text-xs font-semibold text-[#222] mb-3">
        Marca
      </span>
      <div
        className="relative"
        style={
          isOpen
            ? {
                borderStyle: "dotted",
                borderWidth: "2px",
                borderColor: "#0099FF",
                borderRadius: "6px",
                padding: "0",
              }
            : {}
        }
      >
        <button
          onClick={onToggle}
          className={`w-full px-4 py-4 text-left rounded-md bg-white flex items-center justify-between transition-colors ${
            isOpen ? "border-0" : "border-2 border-[#0099FF] hover:bg-gray-50"
          }`}
        >
          <span className="text-sm text-[#222]">
            {selectedBrand
              ? selectedBrand.name
              : "Selecciona la marca de tu dispositivo"}
          </span>
          {isOpen ? (
            <ChevronUp className="w-4 h-4 text-[#222]" />
          ) : (
            <ChevronDown className="w-4 h-4 text-[#222]" />
          )}
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              {brands.map((brand, index) => (
                <button
                  key={brand.id}
                  onClick={() => onSelectBrand(brand)}
                  className={`w-full px-4 py-4 text-left hover:bg-gray-50 transition-colors flex items-center justify-between ${
                    index === brands.length - 1 ? "" : "border-b border-gray-200"
                  }`}
                >
                  <span className="text-sm font-medium text-[#222]">
                    {brand.name}
                  </span>
                  <span className="text-sm font-semibold text-[#0099FF]">
                    Recibe hasta $ {brand.maxDiscount.toLocaleString('es-CO')}
                  </span>
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
