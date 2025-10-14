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

import { useState, useMemo } from "react";
import { useCartContext } from "@/features/cart/CartContext";
import { useRouter } from "next/navigation";
import Image, { StaticImageData } from "next/image";
import { Heart, Loader, ChevronLeft, ChevronRight, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { posthogUtils } from "@/lib/posthogClient";
import { motion } from "framer-motion";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useCloudinaryImage } from "@/hooks/useCloudinaryImage";
import { getCloudinaryUrl } from "@/lib/cloudinary";

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
  viewMode?: "grid" | "list"; // Modo de visualización
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
  rating,
  reviewCount,
  selectedColor: selectedColorProp,
  selectedCapacity: selectedCapacityProp,
  puntos_q = 4, // Valor fijo por defecto
  viewMode = "grid", // Modo de visualización por defecto
  stock = 1, // Valor por defecto si no se proporciona
}: ProductCardProps & { puntos_q?: number }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isCompareSelected, setIsCompareSelected] = useState(false);

  // Verificar si el producto está sin stock
  const isOutOfStock = stock === 0;

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

  // Simular múltiples imágenes para el carrusel (en una implementación real, vendrían del backend)
  const productImages = [image, image, image, image, image, image];

  // Aplicar transformación de Cloudinary a todas las imágenes del carrusel
  const transformedImages = useMemo(() => {
    const originalImg = typeof image === "string" ? image : image?.src;
    console.log("🖼️ ProductCard - Imagen original:", originalImg);

    const transformed = productImages.map((img, index) => {
      const imgSrc = typeof img === "string" ? img : img?.src;
      const transformedUrl = getCloudinaryUrl(imgSrc, "catalog");

      if (index === 0) {
        console.log("🎨 ProductCard - Imagen transformada:", transformedUrl);
        console.log("📐 ProductCard - Tipo de transformación:", "catalog (1000x1000, c_fill)");
      }

      return transformedUrl;
    });

    return transformed;
  }, [productImages, image]);

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

  // Calcular cuotas mensuales (simulado - 12 cuotas sin interés)
  const monthlyPayment = currentPrice 
    ? Math.round(parseInt(currentPrice.replace(/[^\d]/g, '')) / 12).toLocaleString('es-CO')
    : null;

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
    // Navega a la página de multimedia con contenido Flixmedia
    router.push(`/productos/multimedia/${id}`);
    posthogUtils.capture("product_more_info_click", {
      product_id: id,
      product_name: name,
      source: "product_card",
      destination: "multimedia_page",
    });
  };

  // Handler para el click en la card completa
  // Navega a multimedia EXCEPTO si se hace click en botones interactivos
  const handleCardClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    
    // Verificar si el click fue en un botón o dentro de un botón
    const isButton = target.closest('button') !== null;
    const isCheckbox = target.closest('input[type="checkbox"]') !== null;
    
    // Si NO es un botón ni checkbox, navegar a multimedia
    if (!isButton && !isCheckbox) {
      handleMoreInfo();
    }
  };

  const cardReveal = useScrollReveal<HTMLDivElement>({
    offset: 60,
    duration: 500,
    direction: "up",
  });

  // Obtener imagen optimizada de Cloudinary para catálogo
  const cloudinaryImage = useCloudinaryImage({
    src: typeof image === "string" ? image : image.src,
    transformType: "catalog",
    responsive: true,
  });

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % productImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + productImages.length) % productImages.length);
  };

  return (
    <motion.div
      ref={cardReveal.ref}
      {...cardReveal.motionProps}
      onClick={handleCardClick}
      className={cn(
        "transition-all duration-300 cursor-pointer",
        isOutOfStock && "opacity-60",
        className
      )}
    >
      {/* Sección de imagen con carrusel */}
      <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden max-h-[350px]">
        {/* Carrusel de imágenes */}
        <div className="relative w-full h-full">
          {transformedImages.map((transformedSrc, index) => {
            return (
              <div
                key={index}
                className={cn(
                  "absolute inset-0 flex items-center justify-center p-4",
                  index === currentImageIndex ? "opacity-100" : "opacity-0"
                )}
              >
                <div className="relative w-full h-full">
                  <Image
                    src={transformedSrc}
                    alt={`${name} - imagen ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes={cloudinaryImage.imageProps.sizes}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Contenido del producto */}
      <div className="py-3 px-3 space-y-2">
        {/* Título del producto */}
        <h3
          onClick={handleCardClick}
          className={cn(
            "text-base font-bold hover:underline cursor-pointer line-clamp-1 overflow-hidden text-ellipsis whitespace-nowrap",
            isOutOfStock ? "text-gray-500" : "text-black"
          )}
        >
          {cleanProductName(name)}
        </h3>

        {/* Selector de colores */}
        <div className="min-h-[66px]">
          {colors && colors.length > 0 && (
            <div>
              <p className={cn(
                "text-xs py-1.5",
                isOutOfStock ? "text-gray-400" : "text-gray-600"
              )}>
                <span className="font-medium">Color:</span> {selectedColor?.label}
              </p>
              <div className="flex gap-2 flex-wrap">
                {colors.slice(0, 4).map((color) => (
                  <button
                    key={color.name}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!isOutOfStock) {
                        handleColorSelect(color);
                      }
                    }}
                    className={cn(
                      "w-6.5 h-6.5 rounded-full border transition-all duration-200 relative",
                      isOutOfStock ? "opacity-40 cursor-not-allowed" : "cursor-pointer",
                      selectedColor?.name === color.name
                        ? "border-black p-0.5"
                        : "border-gray-300 hover:border-gray-400"
                    )}
                    title={color.label}
                  >
                    <div
                      className="w-full h-full rounded-full"
                      style={{ backgroundColor: color.hex }}
                    />
                    {selectedColor?.name === color.name && (
                      <div className="absolute inset-0 rounded-full border-2 border-white" />
                    )}
                  </button>
                ))}
                {colors.length > 4 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!isOutOfStock) {
                        handleCardClick(e);
                      }
                    }}
                    className={cn(
                      "w-6.5 h-6.5 rounded-full border-2 border-gray-300 flex items-center justify-center text-[10px] font-medium text-gray-600 hover:border-gray-400",
                      isOutOfStock ? "opacity-40 cursor-not-allowed" : "cursor-pointer"
                    )}
                  >
                    +{colors.length - 4}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Selector de capacidad */}
        <div className="min-h-[44px]">
          {capacities && capacities.length > 0 && (
            <div className="space-y-1.5">
              <div className="flex gap-2 flex-wrap">
                {capacities.map((capacity) => (
                  <button
                    key={capacity.value}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!isOutOfStock) {
                        handleCapacitySelect(capacity);
                      }
                    }}
                    className={cn(
                      "px-3.5 py-2 text-sm font-medium rounded-md border transition-all duration-200",
                      isOutOfStock ? "opacity-40 cursor-not-allowed" : "cursor-pointer",
                      selectedCapacity?.value === capacity.value
                        ? "border-black bg-black text-white"
                        : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
                    )}
                  >
                    {capacity.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Precio */}
        <div className="min-h-[70px]">
          {currentPrice && (
            <div className="space-y-1">
              {/* Precio principal */}
              <div className={cn(
                "text-xl font-bold",
                isOutOfStock ? "text-gray-400" : "text-black"
              )}>
                {currentPrice}
              </div>

              {/* Precio original y ahorro (solo si hay descuento) */}
              {currentOriginalPrice && currentPrice !== currentOriginalPrice && (() => {
                const priceNum = parseInt(currentPrice.replace(/[^\d]/g, ''));
                const originalPriceNum = parseInt(currentOriginalPrice.replace(/[^\d]/g, ''));
                const savings = originalPriceNum - priceNum;
                if (savings > 0) {
                  return (
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={cn(
                        "text-sm line-through",
                        isOutOfStock ? "text-gray-300" : "text-gray-500"
                      )}>
                        {currentOriginalPrice}
                      </span>
                      <span className={cn(
                        "text-sm font-semibold",
                        isOutOfStock ? "text-gray-400" : "text-blue-600"
                      )}>
                        Ahorra $ {savings.toLocaleString('es-CO')}
                      </span>
                    </div>
                  );
                }
                return null;
              })()}
            </div>
          )}
        </div>

        {/* Botones de acción */}
        <div className="space-y-2">
          {isOutOfStock ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                alert("Te notificaremos cuando este producto esté disponible");
              }}
              className="w-full bg-black text-white py-2.5 px-4 rounded-full text-sm font-bold hover:bg-gray-800 transition-colors"
            >
              Notifícame
            </button>
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleAddToCart();
              }}
              disabled={isLoading}
              className={cn(
                "w-full bg-black text-white py-2.5 px-4 rounded-full text-sm font-bold",
                "hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors",
                isLoading && "animate-pulse"
              )}
            >
              {isLoading ? (
                <Loader className="w-4 h-4 mx-auto" />
              ) : (
                "Comprar ahora"
              )}
            </button>
          )}
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleMoreInfo();
            }}
            className="w-full text-black py-2.5 px-4 text-sm font-bold hover:underline transition-all border border-gray-300 rounded-full"
          >
            Más información
          </button>
        </div>
      </div>
    </motion.div>
  );
}
