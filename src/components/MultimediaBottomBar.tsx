/**
 * MultimediaBottomBar Component
 * 
 * Barra inferior sticky para la vista de multimedia
 * Muestra nombre, precio y botón CTA para ir a la vista detallada
 */

"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiShoppingCart } from "react-icons/fi";

interface MultimediaBottomBarProps {
  productName: string; // Kept for future use, not displayed
  price: number;
  originalPrice?: number;
  onViewDetailsClick?: () => void;
  isVisible?: boolean;
}

/**
 * Formatea precio a COP
 */
const formatPrice = (price: number): string => {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  }).format(price);
};

export default function MultimediaBottomBar({
  productName,
  price,
  originalPrice,
  onViewDetailsClick,
  isVisible = true,
}: MultimediaBottomBarProps) {
  const monthlyPayment = price / 12;
  const savings = originalPrice && originalPrice > price ? originalPrice - price : 0;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed bottom-0 left-0 right-0 z-[60] bg-white border-t border-gray-200 shadow-2xl"
          style={{ fontFamily: "SamsungSharpSans" }}
        >
          <div className="max-w-[1680px] mx-auto px-4 md:px-6 lg:px-12">
            <div className="flex items-center justify-between gap-4 md:gap-6 py-3 md:py-4">
              {/* IZQUIERDA: Nombre del producto */}
              <div className="flex-shrink-0 hidden md:block max-w-[280px]">
                <h3 className="text-base font-bold text-[#222] leading-tight line-clamp-2">
                  {productName}
                </h3>
              </div>

              {/* CENTRO: Precio con financiación */}
              <div className="flex-1 flex justify-center items-center min-w-0">
                <div className="text-center max-w-3xl">
                  <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 justify-center">
                    {/* Precio de contado */}
                    <div className="flex items-baseline gap-2 flex-wrap justify-center">
                      <span className="text-xl md:text-2xl lg:text-3xl font-bold text-[#222]">
                        {formatPrice(price)}
                      </span>
                      {originalPrice && originalPrice > price && (
                        <>
                          <span className="text-sm md:text-base text-gray-400 line-through">
                            {formatPrice(originalPrice)}
                          </span>
                          <span className="text-sm md:text-base text-green-600 font-semibold">
                            Ahorra {formatPrice(savings)}
                          </span>
                        </>
                      )}
                    </div>

                    {/* Separador */}
                    <span className="hidden sm:block text-gray-300">|</span>

                    {/* Cuotas Addi */}
                    <div className="flex items-baseline gap-1">
                      <span className="text-base md:text-lg text-gray-600">o desde</span>
                      <span className="text-lg md:text-xl font-bold text-[#0066CC]">
                        {formatPrice(monthlyPayment)}
                      </span>
                      <span className="text-sm md:text-base text-gray-500">/mes con Addi</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* DERECHA: CTA */}
              <div className="flex-shrink-0">
                <motion.button
                  onClick={onViewDetailsClick}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="
                    flex items-center gap-2 md:gap-3
                    bg-[#0066CC] hover:bg-[#0052A3]
                    text-white
                    px-4 md:px-6 lg:px-8 py-2.5 md:py-3 lg:py-4
                    rounded-full
                    font-semibold text-sm md:text-base
                    transition-all duration-200
                    shadow-lg hover:shadow-xl
                    whitespace-nowrap
                  "
                >
                  <FiShoppingCart className="text-lg md:text-xl" />
                  <span>Comprar</span>
                </motion.button>
              </div>
            </div>
          </div>

          {/* Línea decorativa superior con gradiente Samsung */}
          <div
            className="h-1 w-full"
            style={{
              background: "linear-gradient(90deg, #0066CC 0%, #00A3E0 100%)",
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
