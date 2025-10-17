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
import { Heart, Loader } from "lucide-react";
import { cn } from "@/lib/utils";
import { posthogUtils } from "@/lib/posthogClient";
import { useCloudinaryImage } from "@/hooks/useCloudinaryImage";
import {
  cleanProductName,
  calculateDynamicPrices,
  calculateSavings,
  validateCartSku,
} from "./utils/productCardHelpers";
import { ColorSelector, CapacitySelector } from "./ProductCardComponents";
import { getCloudinaryUrl } from "@/lib/cloudinary";

export interface ProductColor {
  name: string; // Nombre técnico del color (ej: "black", "white")
  hex: string; // Código hexadecimal del color (ej: "#000000")
  label: string; // Nombre mostrado al usuario (ej: "Negro Medianoche")
  sku: string; // SKU específico para esta variante de color
  ean: string; // SKU específico para esta variante de color
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
  ean?: string; // SKU específico
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
  ean?: string | null;
  skuArray?: string[];
  eanArray?: string[];
  detailedDescription?: string | null;
  selectedColor?: ProductColor;
  setSelectedColor?: (color: ProductColor) => void;
  selectedCapacity?: ProductCapacity;
  setSelectedCapacity?: (capacity: ProductCapacity) => void;
  puntos_q?: number; // Puntos Q acumulables por producto (valor fijo por ahora)
}


export default function ProductCard({
  id,
  name,
  image,
  colors,
  capacities,
  price,
  originalPrice,
  discount,
  isFavorite = false,
  onToggleFavorite,
  className,
  selectedColor: selectedColorProp,
  selectedCapacity: selectedCapacityProp,
  puntos_q = 4, // Valor fijo por defecto
  stock = 1, // Valor por defecto si no se proporciona
}: ProductCardProps & { puntos_q?: number }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [currentImageIndex] = useState(0);

  // Verificar si el producto está sin stock
  const isOutOfStock = stock === 0;

  // Integración con el contexto del carrito
  const { addProduct } = useCartContext();

  // Si el estado viene de props, úsalo. Si no, usa local.
  const [selectedColorLocal, setSelectedColorLocal] =
    useState<ProductColor | null>(
      colors && colors.length > 0 ? colors[0] : null
    );
  const selectedColor = selectedColorProp ?? selectedColorLocal;

  const [selectedCapacityLocal, setSelectedCapacityLocal] =
    useState<ProductCapacity | null>(
      capacities && capacities.length > 0 ? capacities[0] : null
    );
  const selectedCapacity = selectedCapacityProp ?? selectedCapacityLocal;

  // Simular múltiples imágenes para el carrusel (en una implementación real, vendrían del backend)
  const productImages = useMemo(
    () => [image, image, image, image, image, image],
    [image]
  );

  // Aplicar transformación de Cloudinary a todas las imágenes del carrusel
  const transformedImages = useMemo(() => {
    const transformed = productImages.map((img) => {
      const imgSrc = typeof img === "string" ? img : img?.src;
      return getCloudinaryUrl(imgSrc, "catalog");
    });

    return transformed;
  }, [productImages]);

  const handleColorSelect = (color: ProductColor) => {
    setSelectedColorLocal(color);
    posthogUtils.capture("product_color_selected", {
      product_id: id,
      product_name: name,
      color_name: color.name,
      color_label: color.label,
      color_sku: color.sku,
      color_ean: color.ean,
    });
  };

  const handleCapacitySelect = (capacity: ProductCapacity) => {
    setSelectedCapacityLocal(capacity);
    posthogUtils.capture("product_capacity_selected", {
      product_id: id,
      product_name: name,
      capacity_value: capacity.value,
      capacity_sku: capacity.sku,
      capacity_ean: capacity.ean,
    });
  };

  // Calcular precios dinámicos basados en capacidad seleccionada (prioridad) o color
  const { currentPrice, currentOriginalPrice } =
    calculateDynamicPrices(
      selectedCapacity,
      selectedColor,
      price,
      originalPrice,
      discount
    );

  const handleAddToCart = async () => {
    if (isLoading) {
      return; // Prevenir múltiples clics mientras está cargando
    }

    setIsLoading(true);

    try {
      // Validación estricta: debe existir un SKU válido del color seleccionado
      if (!validateCartSku(selectedColor, id, name, colors) || !selectedColor) {
        setIsLoading(false);
        return;
      }

      posthogUtils.capture("add_to_cart_click", {
        product_id: id,
        product_name: name,
        selected_color: selectedColor.name,
        selected_color_sku: selectedColor.sku,
        selected_color_ean: selectedColor.ean,
        source: "product_card",
      });

      // Agrega el producto al carrito usando el contexto - SIEMPRE cantidad 1
      addProduct({
        id,
        name,
        image: typeof image === "string" ? image : image.src ?? "",
        price:
          typeof currentPrice === "string"
            ? Number.parseInt(currentPrice.replaceAll(/[^\d]/g, ""))
            : currentPrice ?? 0,
        quantity: 1, // SIEMPRE agregar de 1 en 1
        sku: selectedColor.sku, // SKU estricto del color seleccionado
        ean: selectedColor.ean, // SKU estricto del color seleccionado
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
  const handleCardClick = (e: React.MouseEvent | React.KeyboardEvent) => {
    const target = e.target as HTMLElement;

    // Verificar si el click fue en un botón o dentro de un botón
    const isButton = target.closest("button") !== null;
    const isCheckbox = target.closest('input[type="checkbox"]') !== null;

    // Si NO es un botón ni checkbox, navegar a multimedia
    if (!isButton && !isCheckbox) {
      handleMoreInfo();
    }
  };

  // Handler para navegación con teclado
  const handleCardKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleCardClick(e);
    }
  };

  // Obtener imagen optimizada de Cloudinary para catálogo
  const cloudinaryImage = useCloudinaryImage({
    src: typeof image === "string" ? image : image.src,
    transformType: "catalog",
    responsive: true,
  });

  return (
    // eslint-disable-next-line jsx-a11y/prefer-tag-over-role
    <div
      role="button"
      onClick={handleCardClick}
      onKeyDown={handleCardKeyDown}
      tabIndex={0}
      aria-label={`Ver detalles de ${cleanProductName(name)}`}
      className={cn(
        "cursor-pointer transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-lg w-full max-w-[350px] mx-auto",
        isOutOfStock && "opacity-60",
        className
      )}
    >
      {/* Sección de imagen con carrusel */}
      <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
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
      <div className="py-3 space-y-2">
        {/* Título del producto */}
        <div className="h-[32px] px-3">
          <h3
            className={cn(
              "text-base font-bold line-clamp-1 overflow-hidden text-ellipsis whitespace-nowrap",
              isOutOfStock ? "text-gray-500" : "text-black"
            )}
          >
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                handleMoreInfo();
              }}
              className={cn(
                "w-full text-left bg-transparent p-0 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-black",
                isOutOfStock ? "text-gray-500" : "text-black"
              )}
            >
              {cleanProductName(name)}
            </button>
          </h3>
        </div>

        {/* Selector de colores */}
        <div className="h-[66px] px-3">
          <ColorSelector
            colors={colors}
            selectedColor={selectedColor}
            isOutOfStock={isOutOfStock}
            onColorSelect={handleColorSelect}
            onShowMore={handleCardClick}
          />
        </div>

        {/* Selector de capacidad */}
        <div className="h-[60px] px-3">
          <CapacitySelector
            capacities={capacities || []}
            selectedCapacity={selectedCapacity}
            isOutOfStock={isOutOfStock}
            onCapacitySelect={handleCapacitySelect}
          />
        </div>

        {/* Precio */}
        <div className="h-[150px] px-3 flex flex-col justify-between">
          {currentPrice && (
            <div className="space-y-1">
              {/* Precio principal */}
              <div
                className={cn(
                  "text-xl font-bold",
                  isOutOfStock ? "text-gray-400" : "text-black"
                )}
              >
                {currentPrice}
              </div>

              {/* Precio original y ahorro (solo si hay descuento) */}
              {(() => {
                const { hasSavings, savings } = calculateSavings(
                  currentPrice,
                  currentOriginalPrice
                );

                if (!hasSavings) return null;

                return (
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={cn(
                        "text-sm line-through",
                        isOutOfStock ? "text-gray-300" : "text-gray-500"
                      )}
                    >
                      {currentOriginalPrice}
                    </span>
                    <span
                      className={cn(
                        "text-sm font-semibold",
                        isOutOfStock ? "text-gray-400" : "text-blue-600"
                      )}
                    >
                      Ahorra $ {savings.toLocaleString("es-CO")}
                    </span>
                  </div>
                );
              })()}
            </div>
          )}
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
      </div>
    </div>
  );
}
