"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiShoppingCart } from "react-icons/fi";

interface StickyPriceBarProps {
  deviceName: string;
  basePrice: number;
  originalPrice?: number;
  discount?: number;
  selectedStorage?: string;
  selectedColor?: string;
  hasAddiFinancing?: boolean;
  onBuyClick?: () => void;
  isVisible?: boolean;
}

/**
 * Componente StickyPriceBar
 *
 * Barra sticky que muestra:
 * - Al inicio: Visible debajo del navbar principal (top-[70px])
 * - Al hacer scroll: Sube a top-0 con animaciones y oculta el navbar principal
 */
const StickyPriceBar: React.FC<StickyPriceBarProps> = ({
  deviceName,
  basePrice,
  originalPrice,
  discount,
  selectedStorage,
  selectedColor,
  hasAddiFinancing = true,
  onBuyClick,
  isVisible = false,
}) => {
  // Cálculos de financiación Addi
  const monthlyPayment = basePrice / 12;
  const savings = discount || (originalPrice ? originalPrice - basePrice : 0);

  // Formatear precio en COP
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Nombre completo con configuración
  const fullDeviceName = `${deviceName}${selectedStorage ? ` ${selectedStorage}` : ""}${selectedColor ? ` - ${selectedColor}` : ""}`;

  // Contenido compartido
  const BarContent = () => (
    <>
      <div className="max-w-[1680px] mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between gap-6 py-4">
          {/* IZQUIERDA: Nombre del dispositivo - Permite 2 líneas */}
          <div className="flex-shrink-0 hidden md:block max-w-[280px]">
            <h3 className="text-base font-bold text-[#222] leading-tight line-clamp-2">
              {fullDeviceName}
            </h3>
          </div>

          {/* CENTRO: Información de precio - Centrado y compacto */}
          <div className="flex-1 flex justify-center items-center min-w-0">
            {hasAddiFinancing ? (
              <div className="text-center max-w-3xl">
                {/* Primera línea: Precio mensual con cuotas */}
                <div className="flex items-baseline justify-center gap-1.5 flex-wrap text-xs">
                  <span className="text-gray-600">Desde</span>
                  <span className="text-lg md:text-xl font-bold text-[#222]">
                    {formatPrice(monthlyPayment)}
                  </span>
                  <span className="text-gray-600">al mes en 12 cuotas sin intereses*</span>
                </div>

                {/* Segunda línea: Precio de contado y condiciones */}
                <div className="flex items-center justify-center gap-1.5 flex-wrap text-xs mt-0.5">
                  <span className="text-gray-600">o</span>
                  <span className="font-semibold text-[#222]">
                    {formatPrice(basePrice)}
                  </span>
                  <span className="text-gray-500">
                    *Aplican condiciones. Sujeto a aprobación crediticia.
                  </span>
                </div>
              </div>
            ) : (
              // Si no hay financiación Addi, mostrar solo precio normal
              <div className="flex items-baseline gap-3 flex-wrap justify-center">
                <span className="text-2xl md:text-3xl font-bold text-[#222]">
                  {formatPrice(basePrice)}
                </span>
                {originalPrice && originalPrice > basePrice && (
                  <>
                    <span className="text-lg text-gray-400 line-through">
                      {formatPrice(originalPrice)}
                    </span>
                    <span className="text-green-600 font-semibold">
                      Ahorra {formatPrice(savings)}
                    </span>
                  </>
                )}
              </div>
            )}
          </div>

          {/* DERECHA: CTA */}
          <div className="flex-shrink-0">
            <motion.button
              onClick={onBuyClick}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="
                flex items-center gap-3
                bg-[#0066CC] hover:bg-[#0052A3]
                text-white
                px-6 md:px-8 py-3 md:py-4
                rounded-full
                font-semibold text-sm md:text-base
                transition-all duration-200
                shadow-lg hover:shadow-xl
                whitespace-nowrap
              "
            >
              <FiShoppingCart className="text-xl" />
              <span className="hidden sm:inline">Comprar ahora</span>
              <span className="sm:hidden">Comprar</span>
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
    </>
  );

  return (
    <>
      {/* Versión inicial: siempre visible debajo del navbar principal */}
      {!isVisible && (
        <div
          className="fixed top-[70px] xl:top-[85px] left-0 right-0 z-[1500] bg-white border-b border-gray-200 shadow-2xl"
          style={{ fontFamily: "SamsungSharpSans" }}
        >
          <BarContent />
        </div>
      )}

      {/* Versión scroll: aparece en top-0 con animaciones cuando isVisible=true */}
      <AnimatePresence mode="wait">
        {isVisible && (
          <motion.div
            key="sticky-price-bar-scroll"
            initial={{
              y: -100,
              opacity: 0,
              scale: 0.95,
              filter: "blur(4px)",
            }}
            animate={{
              y: 0,
              opacity: 1,
              scale: 1,
              filter: "blur(0px)",
            }}
            exit={{
              y: -100,
              opacity: 0,
              scale: 0.98,
              filter: "blur(2px)",
            }}
            transition={{
              type: "spring",
              stiffness: 280,
              damping: 35,
              mass: 1.2,
              opacity: {
                duration: 0.6,
                ease: [0.25, 0.46, 0.45, 0.94],
              },
              scale: {
                duration: 0.5,
                ease: [0.25, 0.46, 0.45, 0.94],
              },
              filter: {
                duration: 0.45,
                ease: [0.25, 0.1, 0.25, 1],
              },
            }}
            className="fixed top-0 left-0 right-0 z-[9999] bg-white/92 backdrop-blur-xl border-b border-gray-200/30 shadow-2xl"
            style={{
              fontFamily: "SamsungSharpSans",
              backdropFilter: "blur(20px) saturate(1.1)",
              WebkitBackdropFilter: "blur(20px) saturate(1.1)",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1), 0 2px 8px rgba(0, 0, 0, 0.05)",
              willChange: "transform, opacity, filter",
            }}
          >
            <BarContent />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default StickyPriceBar;
