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
import { useCeroInteres } from "@/hooks/useCeroInteres";

interface MultimediaBottomBarProps {
  productName: string;
  price: number;
  originalPrice?: number;
  indcerointeres: number; // 0 = sin cuotas, 1 = mostrar "test"
  allPrices?: number[]; // Todos los precios del producto (precioeccommerce)
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
  indcerointeres,
  allPrices = [],
  onViewDetailsClick,
  isVisible = true,
}: MultimediaBottomBarProps) {
  // Hook para cuotas sin interés (solo cuando indcerointeres === 1)
  const ceroInteres = useCeroInteres(
    allPrices,
    price,
    indcerointeres,
    true
  );

  const monthlyPayment = price / 12;
  const savings = originalPrice && originalPrice > price ? originalPrice - price : 0;

  // Renderizar información de precio según indcerointeres
  const renderPriceInfo = () => {
    if (indcerointeres === 0) {
      // CASO 0: Solo precio de contado (SIN cuotas)
      // Móvil: 3 filas (precio+tachado, nombre, ahorro)
      // Desktop: layout horizontal
      return (
        <>
          {/* Móvil: Layout de 3 filas */}
          <div className="flex flex-col items-start gap-0.5 md:hidden">
            {/* Fila 1: Precio actual + precio tachado */}
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold text-[#222]">
                {formatPrice(price)}
              </span>
              {originalPrice && originalPrice > price && (
                <span className="text-sm text-gray-400 line-through">
                  {formatPrice(originalPrice)}
                </span>
              )}
            </div>
            {/* Fila 2: Nombre del producto */}
            <span className="text-xs text-[#222] font-medium line-clamp-1">
              {productName}
            </span>
            {/* Fila 3: Ahorra X */}
            {originalPrice && originalPrice > price && (
              <span className="text-xs text-green-600 font-semibold">
                Ahorra {formatPrice(savings)}
              </span>
            )}
          </div>

          {/* Desktop: Layout horizontal original */}
          <div className="hidden md:flex items-baseline gap-2 flex-wrap justify-center">
            <span className="text-xl font-bold text-[#222]">
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
        </>
      );
    }

    if (indcerointeres === 1) {
      // CASO 1: Cuotas sin interés (0%)
      const textoInteresCompleto = ceroInteres.formatText();
      const textoInteresSimple = ceroInteres.formatTextSimple();

      // Si hay error o está cargando, solo mostrar precio
      if (ceroInteres.error || !textoInteresCompleto || !textoInteresSimple) {
        return (
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="text-lg md:text-xl font-bold text-[#222]">
              {formatPrice(price)}
            </span>
          </div>
        );
      }

      return (
        <>
          {/* Móvil: Layout de 3 filas a la izquierda */}
          <div className="flex flex-col items-start gap-0.5 md:hidden">
            {/* Fila 1: Cuota mensual */}
            <span className="text-sm font-bold text-[#222]">
              {textoInteresSimple}
            </span>
            {/* Fila 2: Nombre del producto */}
            <span className="text-xs text-[#222] font-medium line-clamp-1">
              {productName}
            </span>
            {/* Fila 3: Precio de contado */}
            <span className="text-xs text-gray-500">
              o {formatPrice(price)}
            </span>
          </div>

          {/* Desktop: Layout centrado original */}
          <div className="hidden md:flex flex-col items-center gap-1">
            <span className="text-base font-bold text-[#222] leading-tight text-center">
              {textoInteresCompleto}
            </span>
            <span className="text-sm font-bold text-[#222]">
              {formatPrice(price)}
            </span>
          </div>
        </>
      );
    }

    // DEFAULT: Con financiación Addi (para otros valores)
    return (
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
    );
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed left-0 right-0 z-40 bg-white top-[55px] xl:top-[100px]"
          style={{
            fontFamily: "SamsungSharpSans"
          }}
        >
          <div className=" mx-auto px-6 md:px-8">
            <div className="flex items-center justify-between gap-3 md:gap-4 py-2 md:py-2.5">
              {/* IZQUIERDA: Nombre del producto (oculto en móvil) */}
              <div className="hidden md:block flex-shrink min-w-0 max-w-[200px] xl:max-w-[250px]">
                <h3 className="text-sm font-semibold text-[#222] leading-tight line-clamp-2 break-words overflow-hidden">
                  {productName}
                </h3>
              </div>

              {/* CENTRO: Precio completo pero minimalista - izquierda en móvil */}
              <div className="flex-1 flex justify-start md:justify-center items-center">
                {renderPriceInfo()}
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
