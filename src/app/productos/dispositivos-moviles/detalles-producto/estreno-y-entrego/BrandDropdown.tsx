import React, { useEffect, useRef } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { Brand } from "./types";

interface BrandDropdownProps {
  brands: Brand[];
  selectedBrand: Brand | null;
  isOpen: boolean;
  isDisabled?: boolean;
  onToggle: () => void;
  onSelectBrand: (brand: Brand) => void;
}

export default function BrandDropdown({
  brands,
  selectedBrand,
  isOpen,
  isDisabled = false,
  onToggle,
  onSelectBrand,
}: Readonly<BrandDropdownProps>) {
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to dropdown when it opens
  useEffect(() => {
    if (isOpen && !isDisabled) {
      setTimeout(() => {
        dropdownRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
      }, 100);
    }
  }, [isOpen, isDisabled]);

  const getButtonClasses = () => {
    if (isDisabled) return "bg-gray-100 cursor-not-allowed border-0 opacity-60";
    if (isOpen) return "border-0 bg-white ring-2 ring-[#0099FF]";
    if (selectedBrand) return "border border-[#0099FF] bg-white hover:bg-gray-50";
    return "border border-gray-200 bg-white hover:bg-gray-50";
  };

  const getTextClasses = () => {
    if (isDisabled) return "text-gray-400";
    return "text-[#222]";
  };

  const getLabelClasses = () => {
    if (isDisabled) return "text-gray-300";
    if (isOpen || selectedBrand) return "text-[#0099FF] font-medium";
    return "text-gray-400";
  };

  return (
    <div ref={dropdownRef} className="mb-6 max-w-2xl mx-auto">
      <span className={`block text-xs mb-3 transition-colors ${getLabelClasses()}`}>
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
          disabled={isDisabled}
          className={`w-full px-4 py-4 text-left rounded-md flex items-center justify-between transition-all ${getButtonClasses()}`}
        >
          <span className={`text-sm ${getTextClasses()}`}>
            {selectedBrand
              ? selectedBrand.name
              : "Selecciona la marca de tu dispositivo"}
          </span>
          {isOpen ? (
            <ChevronUp className={`w-4 h-4 ${isDisabled ? "text-gray-400" : "text-[#0099FF]"}`} />
          ) : (
            <ChevronDown className={`w-4 h-4 ${getTextClasses()}`} />
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
