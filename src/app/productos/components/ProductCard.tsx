/**
 * 🎴 PRODUCT CARD COMPONENT - IMAGIQ ECOMMERCE
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
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { posthogUtils } from "@/lib/posthogClient";

interface ProductColor {
  name: string;
  hex: string;
  label: string;
}

interface ProductCardProps {
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
  onAddToCart,
  onToggleFavorite,
  className,
}: ProductCardProps) {
  const router = useRouter();
  const [selectedColor, setSelectedColor] = useState<ProductColor>(colors[0]);
  const [isHovered, setIsHovered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Integración con el contexto del carrito
  const { addProduct } = useCartContext();

  // Tracking de interacciones
  const handleColorSelect = (color: ProductColor) => {
    setSelectedColor(color);
    posthogUtils.capture("product_color_select", {
      product_id: id,
      product_name: name,
      color_selected: color.name,
      color_label: color.label,
    });
  };

  const handleAddToCart = async () => {
    setIsLoading(true);
    posthogUtils.capture("add_to_cart_click", {
      product_id: id,
      product_name: name,
      selected_color: selectedColor.name,
      source: "product_card",
    });
    // Agrega el producto al carrito usando el contexto
    addProduct({
      id,
      name,
      image: typeof image === "string" ? image : image.src || "",
      price:
        typeof price === "string"
          ? parseInt(price.replace(/[^\d]/g, ""))
          : price || 0,
      quantity: 1,
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

  return (
    <div
      className={cn(
        "bg-[#D9D9D9] rounded-2xl shadow-sm border border-gray-300 overflow-hidden transition-all duration-300",
        "hover:shadow-lg hover:-translate-y-1",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Header con badges */}
      <div className="relative">
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
          onClick={handleToggleFavorite}
          className={cn(
            "absolute top-3 right-3 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200",
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
            className={cn(
              "object-contain transition-transform duration-300 p-6",
              isHovered && "scale-105"
            )}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      </div>

      {/* Contenido */}
      <div className="p-4 bg-[#D9D9D9]">
        {/* Título del producto */}
        <h3 className="font-semibold text-gray-900 text-base mb-3 line-clamp-2 leading-5">
          {name}
        </h3>

        {/* Color selection text */}
        <div className="mb-3">
          <span className="text-sm text-gray-700">
            Color: {selectedColor.label}
          </span>
        </div>

        {/* Selector de colores */}
        <div className="mb-4">
          <div className="flex gap-2">
            {colors.map((color) => (
              <button
                key={color.name}
                onClick={() => handleColorSelect(color)}
                className={cn(
                  "w-6 h-6 rounded-full border-2 transition-all duration-200",
                  selectedColor.name === color.name
                    ? "border-blue-600 ring-2 ring-blue-200"
                    : "border-gray-400 hover:border-gray-600"
                )}
                style={{ backgroundColor: color.hex }}
                title={color.label}
              />
            ))}
          </div>
        </div>

        {/* Precios */}
        {price && (
          <div className="mb-4">
            <div className="flex items-center gap-2 flex-wrap">
              {originalPrice && (
                <span className="text-sm text-gray-600 line-through">
                  {originalPrice}
                </span>
              )}
              <span className="text-xl font-bold text-gray-900">{price}</span>
            </div>
          </div>
        )}

        {/* Botones de acción */}
        <div className="space-y-2">
          <button
            onClick={handleAddToCart}
            disabled={isLoading}
            className={cn(
              "w-full bg-blue-900 text-white py-3 px-4 rounded-lg text-sm font-semibold",
              "transition-all duration-200 flex items-center justify-center gap-2",
              "hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed",
              isLoading && "animate-pulse"
            )}
          >
            {isLoading ? "Añadiendo..." : "Añadir al carrito"}
          </button>

          <button
            onClick={handleMoreInfo}
            className="w-full bg-white border border-gray-400 text-gray-700 py-3 px-4 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors duration-200"
          >
            Más Información
          </button>
        </div>
      </div>
    </div>
  );
}

// Tipos para export
export type { ProductCardProps, ProductColor };
