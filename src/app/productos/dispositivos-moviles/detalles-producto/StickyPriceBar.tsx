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
      <div className="mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between gap-2 md:gap-4 py-2.5">
          {/* IZQUIERDA: Nombre del dispositivo */}
          <div className="flex-shrink-0 max-w-[140px] md:max-w-[240px]">
            <h3 className="text-xs md:text-sm font-semibold text-[#222] leading-snug line-clamp-2">
              {fullDeviceName}
            </h3>
          </div>

          {/* CENTRO: Información de precio */}
          <div className="flex-1 flex justify-center items-center min-w-0">
            {hasAddiFinancing ? (
              <div className="text-center">
                {/* Móvil: Solo precio de contado */}
                <div className="md:hidden">
                  <span className="text-base font-bold text-[#222]">
                    {formatPrice(basePrice)}
                  </span>
                </div>

                {/* Desktop: Información completa */}
                <div className="hidden md:block">
                  {/* Primera línea: Precio mensual con cuotas */}
                  <div className="flex items-baseline justify-center gap-1 flex-wrap text-xs">
                    <span className="text-gray-600">Desde</span>
                    <span className="text-base md:text-lg font-bold text-[#222]">
                      {formatPrice(monthlyPayment)}
                    </span>
                    <span className="text-gray-600">al mes en 12 cuotas sin intereses*</span>
                  </div>

                  {/* Segunda línea: Precio de contado y condiciones */}
                  <div className="flex items-center justify-center gap-1 flex-wrap text-xs">
                    <span className="text-gray-600">o</span>
                    <span className="font-semibold text-[#222]">
                      {formatPrice(basePrice)}
                    </span>
                    <span className="text-gray-500">
                      *Aplican condiciones. Sujeto a aprobación crediticia.
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              // Si no hay financiación Addi, mostrar solo precio normal
              <div className="flex items-baseline gap-2 flex-wrap justify-center">
                <span className="text-xl md:text-2xl font-bold text-[#222]">
                  {formatPrice(basePrice)}
                </span>
                {originalPrice && originalPrice > basePrice && (
                  <>
                    <span className="text-base text-gray-400 line-through">
                      {formatPrice(originalPrice)}
                    </span>
                    <span className="text-green-600 font-semibold text-sm">
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
                flex items-center gap-2
                bg-[#0066CC] hover:bg-[#0052A3]
                text-white
                px-5 md:px-6 py-2 md:py-2.5
                rounded-full
                font-semibold text-sm
                transition-colors duration-200
                whitespace-nowrap
              "
            >
              <FiShoppingCart className="text-lg" />
              <span className="hidden sm:inline">Añadir al carrito</span>
              <span className="sm:hidden">Añadir</span>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Línea decorativa superior con gradiente Samsung */}
      <div
        className="h-0.5 w-full"
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
          className="fixed top-[70px] xl:top-[95px] left-0 right-0 z-[1500] bg-white border-b border-gray-200 shadow-sm"
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
            }}
            animate={{
              y: 0,
              opacity: 1,
            }}
            exit={{
              y: -100,
              opacity: 0,
            }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30,
              opacity: {
                duration: 0.3,
              },
            }}
            className="fixed top-0 left-0 right-0 z-[9999] bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-md"
            style={{
              fontFamily: "SamsungSharpSans",
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
