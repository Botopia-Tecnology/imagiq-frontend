/**
 * PRODUCT CARD COMPONENT - IMAGIQ ECOMMERCE
 *
 * Componente reutilizable para mostrar productos con:
 * - Diseño idéntico a Samsung Store
 * - Colores de dispositivos
 * - Botones de acción (Añadir al carrito, Más información)
 * - Tracking de interacciones
 * - Responsive design
 */

"use client";

import { useState } from "react";
import { useCartContext } from "@/features/cart/CartContext";
import { useRouter } from "next/navigation";
import Image, { StaticImageData } from "next/image";
import { Heart, Loader, ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";
import { posthogUtils } from "@/lib/posthogClient";
import { motion } from "framer-motion";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useSelectedColor } from "@/contexts/SelectedColorContext";

export interface ProductColor {
  name: string; // Nombre técnico del color (ej: "black", "white")
  hex: string; // Código hexadecimal del color (ej: "#000000")
  label: string; // Nombre mostrado al usuario (ej: "Negro Medianoche")
  sku: string; // SKU específico para esta variante de color
  price?: string; // Precio específico para este color (opcional)
  originalPrice?: string; // Precio original antes de descuento (opcional)
  discount?: string; // Descuento específico para este color (opcional)
}

export interface ProductCardProps {
  id: string;
  name: string;
  image: string | StaticImageData;
  colors: ProductColor[];
  rating?: number;
  reviewCount?: number;
  price?: string;
  originalPrice?: string;
  discount?: string;
  isNew?: boolean;
  isFavorite?: boolean;
  onAddToCart?: (productId: string, color: string) => void;
  onToggleFavorite?: (productId: string) => void;
  className?: string;
  // Datos adicionales para la página de detalle
  description?: string | null;
  brand?: string;
  model?: string;
  category?: string;
  subcategory?: string;
  capacity?: string | null;
  stock?: number;
  sku?: string | null;
  detailedDescription?: string | null;
  selectedColor?: ProductColor;
  setSelectedColor?: (color: ProductColor) => void;
}

export default function ProductCard({
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
  setSelectedColor: setSelectedColorProp,
}: ProductCardProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { setSelectedColor: setGlobalSelectedColor } = useSelectedColor();

  // Integración con el contexto del carrito
  const { addProduct } = useCartContext();

  // Si el estado viene de props, úsalo. Si no, usa local.
  const [selectedColorLocal, setSelectedColorLocal] =
    useState<ProductColor | null>(
      colors && colors.length > 0 ? colors[0] : null
    );
  const selectedColor = selectedColorProp ?? selectedColorLocal;
  const setSelectedColor = setSelectedColorProp ?? setSelectedColorLocal;

  // Calcular precios dinámicos basados en el color seleccionado
  const currentPrice = selectedColor?.price || price;
  const currentOriginalPrice = selectedColor?.originalPrice || originalPrice;
  const currentDiscount = selectedColor?.discount || discount;

  // Tracking de interacciones
  const handleColorSelect = (color: ProductColor) => {
    setSelectedColor(color);
    // Actualizar el color global para que ViewProductMobile lo use
    setGlobalSelectedColor(color.hex);
    posthogUtils.capture("product_color_select", {
      product_id: id,
      product_name: name,
      color_selected: color.name,
      color_label: color.label,
      color_sku: color.sku, // Incluir SKU del color
      price_change: color.price !== price,
    });
  };

  const handleAddToCart = async () => {
    setIsLoading(true);
    posthogUtils.capture("add_to_cart_click", {
      product_id: id,
      product_name: name,
      selected_color: selectedColor?.name || "Sin color",
      selected_color_sku: selectedColor?.sku || sku || id, // Incluir SKU del color seleccionado
      source: "product_card",
    });
    // Agrega el producto al carrito usando el contexto
    addProduct({
      id,
      name,
      image: typeof image === "string" ? image : image.src || "",
      price:
        typeof currentPrice === "string"
          ? parseInt(currentPrice.replace(/[^\d]/g, ""))
          : currentPrice || 0,
      quantity: 1,
      sku: selectedColor?.sku || sku || id, // Usar el SKU del color seleccionado
    });
    setIsLoading(false);
  };

  const handleToggleFavorite = () => {
    if (!onToggleFavorite) return;

    onToggleFavorite(id);
    posthogUtils.capture("toggle_favorite", {
      product_id: id,
      product_name: name,
      action: isFavorite ? "remove" : "add",
    });
  };

  const handleMoreInfo = () => {
    // Navega usando el id del mock, no el nombre ni slug
    router.push(`/productos/view/${id}`);
    posthogUtils.capture("product_more_info_click", {
      product_id: id,
      product_name: name,
      source: "product_card",
    });
  };

  const cardReveal = useScrollReveal<HTMLDivElement>({
    offset: 60,
    duration: 500,
    direction: "up",
  });

  return (
    <motion.div
      ref={cardReveal.ref}
      {...cardReveal.motionProps}
      onClick={handleMoreInfo}
      className={cn(
        // Diseño estándar para desktop/tablet
        "bg-[#D9D9D9] rounded-2xl max-w-72 shadow-sm border border-gray-300 overflow-hidden transition-all duration-300 cursor-pointer",
        // Diseño horizontal para mobile (< 640px)
        "max-[640px]:max-w-none max-[640px]:flex max-[640px]:h-36 max-[640px]:rounded-xl",
        className
      )}
    >
      {/* Header con badges - Desktop */}
      <div className="relative max-[640px]:hidden">
        {/* Badges */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
          {isNew && (
            <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              NUEVO
            </span>
          )}
          {discount && (
            <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              {discount}
            </span>
          )}
        </div>

        {/* Botón favorito */}
        <button
          onClick={(e) => {
            e.stopPropagation(); // Prevenir que se active el click de la card
            handleToggleFavorite();
          }}
          className={cn(
            "absolute top-3 right-3 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer",
            "bg-white shadow-md hover:shadow-lg",
            isFavorite ? "text-red-500" : "text-gray-400"
          )}
        >
          <Heart className={cn("w-4 h-4", isFavorite && "fill-current")} />
        </button>

        {/* Imagen del producto */}
        <div className="relative bg-white aspect-square overflow-hidden">
          <Image
            src={image}
            alt={name}
            fill
            className={cn("object-cover p-4")}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      </div>

      {/* Imagen del producto - Mobile */}
      <div className="hidden max-[640px]:block relative bg-white w-2/5 overflow-hidden">
        <div className="relative h-full">
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover p-2"
            sizes="40vw"
          />
          {/* Badges en mobile - esquina superior izquierda de la imagen */}
          <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
            {isNew && (
              <span className="bg-green-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                NUEVO
              </span>
            )}
            {discount && (
              <span className="bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                {discount}
              </span>
            )}
          </div>
          {/* Botón favorito en mobile - esquina superior derecha de la imagen */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleToggleFavorite();
            }}
            className={cn(
              "absolute top-2 right-2 z-10 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer",
              "bg-white shadow-md hover:shadow-lg",
              isFavorite ? "text-red-500" : "text-gray-400"
            )}
          >
            <Heart className={cn("w-3 h-3", isFavorite && "fill-current")} />
          </button>
        </div>
      </div>

      {/* Contenido - Desktop */}
      <div className="p-4 bg-[#D9D9D9] max-[640px]:hidden">
        {/* Título del producto */}
        <h3 className="font-semibold text-gray-900 text-base mb-3 line-clamp-2 leading-5 truncate">
          {name}
        </h3>

        {/* Selector de colores - OCULTO */}
        {/* {colors && colors.length > 0 && (
          <div className="mb-4">
            <div className="flex gap-2">
              {colors.map((color) => (
                <button
                  key={color.name}
                  onClick={(e) => {
                    e.stopPropagation(); // Prevenir que se active el click de la card
                    handleColorSelect(color);
                  }}
                  className={cn(
                    "w-6 h-6 rounded-full border-2 transition-all duration-200 cursor-pointer",
                    selectedColor?.name === color.name
                      ? "border-blue-600 ring-2 ring-blue-200"
                      : "border-gray-400 hover:border-gray-600"
                  )}
                  style={{ backgroundColor: color.hex }}
                  title={`${color.label} (SKU: ${color.sku})`}
                />
              ))}
            </div>
          </div>
        )} */}

        {/* Precios */}
        {currentPrice && (
          <div className="mb-4">
            <div className="flex items-center gap-2 flex-wrap">
              {currentOriginalPrice && (
                <span className="text-sm text-gray-600 line-through">
                  {currentOriginalPrice}
                </span>
              )}
              <span className="text-xl font-bold text-gray-900">
                {currentPrice}
              </span>
              {currentDiscount && (
                <span className="text-sm font-semibold text-red-600 bg-red-50 px-2 py-1 rounded">
                  {currentDiscount}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Botón de acción */}
        <div>
          <button
            onClick={(e) => {
              e.stopPropagation(); // Prevenir que se active el click de la card
              handleAddToCart();
            }}
            disabled={isLoading}
            className={cn(
              "w-full bg-sky-600 text-white py-3 px-4 rounded-lg text-sm font-semibold cursor-pointer",
              "transition-all duration-200 flex items-center justify-center gap-2",
              "hover:bg-sky-700 disabled:opacity-50 disabled:cursor-not-allowed",
              isLoading && "animate-pulse"
            )}
          >
            {isLoading ? <Loader className="w-4 h-4" /> : <ShoppingCart className="w-4 h-4" />}
            <span>Añadir al carrito</span>
          </button>
        </div>
      </div>

      {/* Contenido - Mobile */}
      <div className="hidden max-[640px]:flex max-[640px]:flex-col max-[640px]:justify-between p-3 bg-[#D9D9D9] w-3/5">
        {/* Título del producto */}
        <div className="flex-shrink-0">
          <h3 className="font-semibold text-gray-900 text-sm mb-2 line-clamp-2 leading-tight">
            {name}
          </h3>
        </div>

        {/* Selector de colores - OCULTO */}
        {/* {colors && colors.length > 0 && (
          <div className="flex-shrink-0 mb-2">
            <div className="flex gap-1.5">
              {colors.map((color) => (
                <button
                  key={color.name}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleColorSelect(color);
                  }}
                  className={cn(
                    "w-4 h-4 rounded-full border transition-all duration-200 cursor-pointer",
                    selectedColor?.name === color.name
                      ? "border-blue-600 ring-1 ring-blue-200"
                      : "border-gray-400 hover:border-gray-600"
                  )}
                  style={{ backgroundColor: color.hex }}
                  title={`${color.label}`}
                />
              ))}
            </div>
          </div>
        )} */}

        {/* Precios */}
        {currentPrice && (
          <div className="flex-shrink-0 mb-2">
            <div className="flex items-center gap-1 flex-wrap">
              {currentOriginalPrice && (
                <span className="text-xs text-gray-600 line-through">
                  {currentOriginalPrice}
                </span>
              )}
              <span className="text-base font-bold text-gray-900">
                {currentPrice}
              </span>
              {currentDiscount && (
                <span className="text-xs font-semibold text-red-600 bg-red-50 px-1 py-0.5 rounded">
                  {currentDiscount}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Botón de acción */}
        <div className="flex-shrink-0 mt-auto">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleAddToCart();
            }}
            disabled={isLoading}
            className={cn(
              "w-full bg-sky-600 text-white py-2 px-3 rounded-lg text-xs font-semibold cursor-pointer",
              "transition-all duration-200 flex items-center justify-center gap-1.5",
              "hover:bg-sky-700 disabled:opacity-50 disabled:cursor-not-allowed",
              isLoading && "animate-pulse"
            )}
          >
            {isLoading ? <Loader className="w-3 h-3" /> : <ShoppingCart className="w-3 h-3" />}
            <span>Añadir al carrito</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}
