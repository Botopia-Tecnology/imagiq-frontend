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

export interface ProductColor {
  name: string; // Nombre técnico del color (ej: "black", "white")
  hex: string; // Código hexadecimal del color (ej: "#000000")
  label: string; // Nombre mostrado al usuario (ej: "Negro Medianoche")
  sku: string; // SKU específico para esta variante de color
  price?: string; // Precio específico para este color (opcional)
  originalPrice?: string; // Precio original antes de descuento (opcional)
  discount?: string; // Descuento específico para este color (opcional)
  capacity?: string; // Capacidad asociada a esta variante
}

export interface ProductCapacity {
  value: string; // Valor de capacidad (ej: "128GB", "256GB")
  label: string; // Etiqueta mostrada (ej: "128 GB")
  price?: string; // Precio para esta capacidad
  originalPrice?: string; // Precio original
  discount?: string; // Descuento
  sku?: string; // SKU específico
}

export interface ProductCardProps {
  id: string;
  name: string;
  image: string | StaticImageData;
  colors: ProductColor[];
  capacities?: ProductCapacity[]; // Capacidades disponibles
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
  selectedCapacity?: ProductCapacity;
  setSelectedCapacity?: (capacity: ProductCapacity) => void;
  puntos_q?: number; // Puntos Q acumulables por producto (valor fijo por ahora)
}

// Función para limpiar el nombre del producto
const cleanProductName = (productName: string): string => {
  // Patrones para eliminar conectividad
  const connectivityPatterns = [
    /\s*5G\s*/gi,
    /\s*4G\s*/gi,
    /\s*LTE\s*/gi,
    /\s*Wi-Fi\s*/gi,
    /\s*Bluetooth\s*/gi,
  ];

  // Patrones para eliminar almacenamiento
  const storagePatterns = [
    /\s*64GB\s*/gi,
    /\s*32GB\s*/gi,
    /\s*128GB\s*/gi,
    /\s*256GB\s*/gi,
    /\s*512GB\s*/gi,
    /\s*1TB\s*/gi,
    /\s*2TB\s*/gi,
    /\s*16GB\s*/gi,
    /\s*8GB\s*/gi,
  ];

  let cleanedName = productName;

  // Eliminar patrones de conectividad
  connectivityPatterns.forEach((pattern) => {
    cleanedName = cleanedName.replace(pattern, " ");
  });

  // Eliminar patrones de almacenamiento
  storagePatterns.forEach((pattern) => {
    cleanedName = cleanedName.replace(pattern, " ");
  });

  // Limpiar espacios múltiples y espacios al inicio/final
  cleanedName = cleanedName.replace(/\s+/g, " ").trim();

  return cleanedName;
};

export default function ProductCard({
  id,
  name,
  image,
  colors,
  capacities,
  price,
  originalPrice,
  discount,
  isNew = false,
  isFavorite = false,
  onToggleFavorite,
  className,
  sku,
  selectedColor: selectedColorProp,
  selectedCapacity: selectedCapacityProp,
  puntos_q = 4, // Valor fijo por defecto
}: ProductCardProps & { puntos_q?: number }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // Integración con el contexto del carrito
  const { addProduct } = useCartContext();

  // Si el estado viene de props, úsalo. Si no, usa local.
  const [selectedColorLocal, setSelectedColorLocal] = useState<ProductColor | null>(
    colors && colors.length > 0 ? colors[0] : null
  );
  const selectedColor = selectedColorProp ?? selectedColorLocal;

  const [selectedCapacityLocal, setSelectedCapacityLocal] = useState<ProductCapacity | null>(
    capacities && capacities.length > 0 ? capacities[0] : null
  );
  const selectedCapacity = selectedCapacityProp ?? selectedCapacityLocal;

  const handleColorSelect = (color: ProductColor) => {
    setSelectedColorLocal(color);
    posthogUtils.capture("product_color_selected", {
      product_id: id,
      product_name: name,
      color_name: color.name,
      color_label: color.label,
      color_sku: color.sku,
    });
  };

  const handleCapacitySelect = (capacity: ProductCapacity) => {
    setSelectedCapacityLocal(capacity);
    posthogUtils.capture("product_capacity_selected", {
      product_id: id,
      product_name: name,
      capacity_value: capacity.value,
      capacity_sku: capacity.sku,
    });
  };

  // Calcular precios dinámicos basados en capacidad seleccionada (prioridad) o color
  const currentPrice = selectedCapacity?.price || selectedColor?.price || price;
  const currentOriginalPrice = selectedCapacity?.originalPrice || selectedColor?.originalPrice || originalPrice;
  const currentDiscount = selectedCapacity?.discount || selectedColor?.discount || discount;

  const handleAddToCart = async () => {
    if (isLoading) {
      return; // Prevenir múltiples clics mientras está cargando
    }

    setIsLoading(true);

    try {
      posthogUtils.capture("add_to_cart_click", {
        product_id: id,
        product_name: name,
        selected_color: selectedColor?.name || "Sin color",
        selected_color_sku: selectedColor?.sku || sku || id,
        source: "product_card",
      });

      // Agrega el producto al carrito usando el contexto - SIEMPRE cantidad 1
      addProduct({
        id,
        name,
        image: typeof image === "string" ? image : image.src ?? "",
        price:
          typeof currentPrice === "string"
            ? parseInt(currentPrice.replace(/[^\d]/g, ""))
            : currentPrice || 0,
        quantity: 1, // SIEMPRE agregar de 1 en 1
        sku: selectedColor?.sku || sku || id,
        puntos_q,
      });
    } finally {
      // Restaurar el estado después de un delay para prevenir clics rápidos
      setTimeout(() => {
        setIsLoading(false);
      }, 300); // Tiempo reducido para mejor UX
    }
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
        // Diseño vertical para todos los tamaños
        "bg-white rounded-2xl w-full overflow-hidden transition-all duration-300 cursor-pointer",
        className
      )}
    >
      {/* Header con badges */}
      <div className="relative block">
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
        <div className="relative bg-gray-100 aspect-square overflow-hidden rounded-xl mx-4">
          <Image
            src={image}
            alt={name}
            fill
            className={cn("object-contain p-4")}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      </div>

      {/* Contenido */}
      <div className="p-4 bg-white">
        {/* Título del producto */}
        <h3 className="font-extrabold text-gray-900 text-base mb-3 line-clamp-2 leading-5">
          {cleanProductName(name)}
        </h3>

        {/* Selector de colores */}
        {colors && colors.length > 0 && (
          <div className="mb-3">
            {selectedColor && (
              <p className="text-sm text-gray-600 mb-2">
                Color: <span className="font-semibold">{selectedColor.label}</span>
              </p>
            )}
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
        )}

        {/* Selector de capacidad */}
        {capacities && capacities.length > 0 && (
          <div className="mb-4">
            {selectedCapacity && (
              <p className="text-sm text-gray-600 mb-2">
                Almacenamiento: <span className="font-semibold">{selectedCapacity.label}</span>
              </p>
            )}
            <div className="flex gap-2 flex-wrap">
              {capacities.map((capacity) => (
                <button
                  key={capacity.value}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCapacitySelect(capacity);
                  }}
                  className={cn(
                    "px-3 py-1.5 text-xs font-semibold rounded-md border-2 transition-all duration-200 cursor-pointer",
                    selectedCapacity?.value === capacity.value
                      ? "border-blue-600 bg-blue-50 text-blue-700"
                      : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
                  )}
                  title={capacity.label}
                >
                  {capacity.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Precios */}
        {currentPrice && (
          <div className="mb-4">
            {/* Precio con descuento */}
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-xl font-bold text-gray-900">
                {currentPrice}
              </span>
              {currentOriginalPrice && (
                <span className="text-sm text-gray-500 line-through">
                  {currentOriginalPrice}
                </span>
              )}
            </div>
            {/* Ahorro calculado */}
            {currentOriginalPrice && currentPrice !== currentOriginalPrice && (() => {
              const priceNum = parseInt(currentPrice.replace(/[^\d]/g, ''));
              const originalPriceNum = parseInt(currentOriginalPrice.replace(/[^\d]/g, ''));
              const savings = originalPriceNum - priceNum;
              if (savings > 0) {
                return (
                  <div className="text-sm">
                    <span className="text-gray-700">Ahorra </span>
                    <span className="font-bold text-[#1428A0]">
                      $ {savings.toLocaleString('es-CO')}
                    </span>
                  </div>
                );
              }
              return null;
            })()}
          </div>
        )}

        {/* Botones de acción */}
        <div className="space-y-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleAddToCart();
            }}
            disabled={isLoading}
            className={cn(
              "w-full bg-black text-white py-3 px-4 rounded-full text-sm font-semibold cursor-pointer",
              "transition-all duration-200 flex items-center justify-center",
              "hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed",
              isLoading && "animate-pulse"
            )}
          >
            {isLoading ? (
              <Loader className="w-4 h-4" />
            ) : (
              <span>Comprar ahora</span>
            )}
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleMoreInfo();
            }}
            className="w-full bg-white text-black py-3 px-4 rounded-full text-sm font-semibold cursor-pointer border border-gray-300 hover:bg-gray-50 transition-all duration-200"
          >
            Más información
          </button>
        </div>
      </div>

    </motion.div>
  );
}
