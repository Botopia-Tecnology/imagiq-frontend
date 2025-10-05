/**
 * PRODUCT CARD COMPONENT - SAMSUNG COLOMBIA STYLE
 *
 * Estructura siguiendo el diseño de Samsung Colombia:
 * 1. Título del producto (arriba)
 * 2. Imagen del producto
 * 3. Selector de color/características
 * 4. Beneficios de financiamiento (Addi)
 * 5. Precio original tachado + ahorro + precio final
 * 6. Aviso de T&C
 * 7. Dos CTAs: "Comprar ahora" y "Más información"
 */

"use client";

import { useState } from "react";
import { useCartContext } from "@/features/cart/CartContext";
import { useRouter } from "next/navigation";
import Image, { StaticImageData } from "next/image";
import { Heart, ShoppingCart, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { posthogUtils } from "@/lib/posthogClient";
import { motion } from "framer-motion";
import { useScrollReveal } from "@/hooks/useScrollReveal";

export interface ProductColor {
  name: string;
  hex: string;
  label: string;
  sku: string;
  price?: string;
  originalPrice?: string;
  discount?: string;
}

export interface ProductCardProps {
  id: string;
  name: string;
  image: string | StaticImageData;
  colors: ProductColor[];
  price?: string;
  originalPrice?: string;
  discount?: string;
  isNew?: boolean;
  isFavorite?: boolean;
  onToggleFavorite?: (productId: string) => void;
  className?: string;
  sku?: string | null;
  selectedColor?: ProductColor;
  setSelectedColor?: (color: ProductColor) => void;
  puntos_q?: number;
  // Datos para financiamiento
  addiMonthlyPayment?: string; // Cuota mensual con Addi
  addiMonths?: number; // Número de cuotas
  // Características destacadas
  features?: string[]; // Ej: ["128GB", "5G", "Pantalla 6.1\""]
}

export default function ProductCardNew({
  id,
  name,
  image,
  colors,
  price,
  originalPrice,
  discount,
  isNew = false,
  isFavorite = false,
  onToggleFavorite,
  className,
  sku,
  selectedColor: selectedColorProp,
  puntos_q = 4,
  addiMonthlyPayment,
  addiMonths = 12,
  features = [],
}: ProductCardProps) {
  const router = useRouter();
  const { addProduct } = useCartContext();

  const [selectedColorLocal, setSelectedColorLocal] = useState<ProductColor | null>(
    colors && colors.length > 0 ? colors[0] : null
  );
  const selectedColor = selectedColorProp ?? selectedColorLocal;

  // Calcular precios dinámicos basados en el color seleccionado
  const currentPrice = selectedColor?.price || price;
  const currentOriginalPrice = selectedColor?.originalPrice || originalPrice;
  const currentDiscount = selectedColor?.discount || discount;

  // Calcular ahorro si hay precio original
  const calculateSavings = () => {
    if (!currentOriginalPrice || !currentPrice) return null;
    const original = parseInt(currentOriginalPrice.replace(/[^\d]/g, ""));
    const final = parseInt(currentPrice.replace(/[^\d]/g, ""));
    return `$${(original - final).toLocaleString("es-CO")}`;
  };

  const handleAddToCart = () => {
    posthogUtils.capture("add_to_cart_click", {
      product_id: id,
      product_name: name,
      selected_color: selectedColor?.name || "Sin color",
      source: "product_card_new",
    });

    addProduct({
      id,
      name,
      image: typeof image === "string" ? image : image.src ?? "",
      price:
        typeof currentPrice === "string"
          ? parseInt(currentPrice.replace(/[^\d]/g, ""))
          : currentPrice || 0,
      quantity: 1,
      sku: selectedColor?.sku || sku || id,
      puntos_q,
    });
  };

  const handleMoreInfo = () => {
    router.push(`/productos/view/${id}`);
    posthogUtils.capture("product_more_info_click", {
      product_id: id,
      product_name: name,
      source: "product_card_new",
    });
  };

  const handleToggleFavorite = () => {
    if (!onToggleFavorite) return;
    onToggleFavorite(id);
    posthogUtils.capture("toggle_favorite", {
      product_id: id,
      action: isFavorite ? "remove" : "add",
    });
  };

  const handleColorSelect = (color: ProductColor) => {
    setSelectedColorLocal(color);
    posthogUtils.capture("color_selected", {
      product_id: id,
      color: color.label,
    });
  };

  const cardReveal = useScrollReveal<HTMLDivElement>({
    offset: 60,
    duration: 500,
    direction: "up",
  });

  const savings = calculateSavings();

  return (
    <motion.div
      ref={cardReveal.ref}
      {...cardReveal.motionProps}
      className={cn(
        "bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden",
        "transition-all duration-300 hover:shadow-md",
        "flex flex-col h-full",
        className
      )}
    >
      {/* 1. TÍTULO DEL PRODUCTO - Arriba */}
      <div className="px-4 pt-4 pb-2 relative">
        {/* Badges en esquina superior derecha */}
        <div className="absolute top-3 right-3 z-10 flex flex-col gap-1 items-end">
          {isNew && (
            <span className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded">
              NUEVO
            </span>
          )}
          {discount && (
            <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
              {discount}
            </span>
          )}
        </div>

        <h3 className="font-semibold text-gray-900 text-sm leading-tight line-clamp-2 pr-16 min-h-[2.5rem]">
          {name}
        </h3>
      </div>

      {/* 2. IMAGEN DEL PRODUCTO */}
      <div className="relative bg-gray-50 aspect-square overflow-hidden">
        <Image
          src={image}
          alt={name}
          fill
          className="object-contain p-6 hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />

        {/* Botón favorito superpuesto */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleToggleFavorite();
          }}
          className={cn(
            "absolute bottom-3 right-3 z-10 w-9 h-9 rounded-full flex items-center justify-center",
            "transition-all duration-200 shadow-md hover:shadow-lg",
            "bg-white/90 backdrop-blur-sm",
            isFavorite ? "text-red-500" : "text-gray-400 hover:text-red-400"
          )}
        >
          <Heart className={cn("w-4 h-4", isFavorite && "fill-current")} />
        </button>
      </div>

      {/* Contenido de la card */}
      <div className="px-4 pb-4 flex flex-col flex-1">
        {/* 3. SELECTOR DE COLOR / CARACTERÍSTICAS */}
        <div className="py-3 border-b border-gray-100">
          {colors && colors.length > 0 && (
            <div>
              <p className="text-xs text-gray-500 mb-2">Color: {selectedColor?.label}</p>
              <div className="flex gap-2 flex-wrap">
                {colors.map((color) => (
                  <button
                    key={color.name}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleColorSelect(color);
                    }}
                    className={cn(
                      "w-7 h-7 rounded-full border-2 transition-all duration-200",
                      "hover:scale-110 hover:shadow-md",
                      selectedColor?.name === color.name
                        ? "border-blue-600 ring-2 ring-blue-200 scale-110"
                        : "border-gray-300"
                    )}
                    style={{ backgroundColor: color.hex }}
                    title={color.label}
                    aria-label={`Seleccionar color ${color.label}`}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Características destacadas */}
          {features && features.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {features.slice(0, 3).map((feature, idx) => (
                <span
                  key={idx}
                  className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
                >
                  {feature}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* 4. BENEFICIOS DE FINANCIAMIENTO (ADDI) */}
        {addiMonthlyPayment && (
          <div className="py-3 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-xs">A</span>
              </div>
              <div>
                <p className="text-xs text-gray-600">
                  Hasta {addiMonths} cuotas de
                </p>
                <p className="text-sm font-bold text-gray-900">
                  {addiMonthlyPayment}/mes
                </p>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-1">Con Addi, sin intereses</p>
          </div>
        )}

        {/* 5. PRECIOS - Original tachado + Ahorro + Precio final */}
        {currentPrice && (
          <div className="py-3">
            {currentOriginalPrice && (
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm text-gray-500 line-through">
                  {currentOriginalPrice}
                </span>
                {savings && (
                  <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded">
                    Ahorra {savings}
                  </span>
                )}
              </div>
            )}
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-gray-900">
                {currentPrice}
              </span>
              {currentDiscount && !currentOriginalPrice && (
                <span className="text-sm font-semibold text-red-600">
                  {currentDiscount}
                </span>
              )}
            </div>
          </div>
        )}

        {/* 6. AVISO DE T&C */}
        <div className="text-xs text-gray-400 mb-3">
          <p>*Aplican términos y condiciones</p>
        </div>

        {/* 7. DOS CTAs - Comprar ahora y Más información */}
        <div className="mt-auto space-y-2">
          {/* CTA Principal: Comprar ahora */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleAddToCart();
            }}
            className={cn(
              "w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg",
              "font-semibold text-sm transition-all duration-200",
              "flex items-center justify-center gap-2",
              "shadow-sm hover:shadow-md"
            )}
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Comprar ahora</span>
          </button>

          {/* CTA Secundario: Más información */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleMoreInfo();
            }}
            className={cn(
              "w-full bg-white hover:bg-gray-50 text-blue-600 py-3 px-4 rounded-lg",
              "font-semibold text-sm transition-all duration-200",
              "flex items-center justify-center gap-2",
              "border border-blue-600"
            )}
          >
            <Info className="w-4 h-4" />
            <span>Más información</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}
