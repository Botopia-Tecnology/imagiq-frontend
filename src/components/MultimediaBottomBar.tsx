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
  productName: string;
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
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed left-0 right-0 z-40 bg-white border-b border-gray-200 shadow-md top-[64px] xl:top-[100px]"
          style={{
            fontFamily: "SamsungSharpSans"
          }}
        >
          <div className="max-w-7xl mx-auto px-4 md:px-6">
            <div className="flex items-center justify-between gap-3 md:gap-4 py-2 md:py-2.5">
              {/* IZQUIERDA: Nombre del producto (oculto en móvil) */}
              <div className="hidden lg:block flex-shrink-0 max-w-[200px] xl:max-w-[250px]">
                <h3 className="text-sm font-semibold text-[#222] leading-tight line-clamp-2">
                  {productName}
                </h3>
              </div>

              {/* CENTRO: Precio completo pero minimalista */}
              <div className="flex-1 flex justify-center items-center">
                <div className="flex items-center gap-2 md:gap-3 flex-wrap justify-center">
                  {/* Precio de contado con descuento */}
                  <div className="flex items-baseline gap-2 flex-wrap">
                    <span className="text-lg md:text-xl font-bold text-[#222]">
                      {formatPrice(price)}
                    </span>
                    {originalPrice && originalPrice > price && (
                      <>
                        <span className="text-sm text-gray-400 line-through">
                          {formatPrice(originalPrice)}
                        </span>
                        <span className="text-sm text-green-600 font-semibold">
                          Ahorra {formatPrice(savings)}
                        </span>
                      </>
                    )}
                  </div>

                  {/* Separador minimalista */}
                  <span className="hidden sm:block text-gray-200">•</span>

                  {/* Cuotas Addi simplificadas */}
                  <div className="hidden sm:flex items-baseline gap-1">
                    <span className="text-sm text-gray-600">desde</span>
                    <span className="text-sm font-semibold text-[#0066CC]">
                      {formatPrice(monthlyPayment)}/mes
                    </span>
                    <span className="text-xs text-gray-500">con Addi</span>
                  </div>
                </div>
              </div>

              {/* DERECHA: CTA minimalista */}
              <div className="flex-shrink-0">
                <motion.button
                  onClick={onViewDetailsClick}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="
                    flex items-center gap-2
                    bg-[#0066CC] hover:bg-[#0052A3]
                    text-white
                    px-4 md:px-5 py-2
                    rounded-full
                    font-medium text-sm
                    transition-all duration-200
                    shadow-sm hover:shadow-md
                    whitespace-nowrap
                  "
                >
                  <FiShoppingCart className="text-base" />
                  <span>Comprar</span>
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
