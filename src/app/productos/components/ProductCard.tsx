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
import { useProductSelection } from "@/hooks/useProductSelection";
import {
  calculateDynamicPrices,
  calculateSavings,
} from "./utils/productCardHelpers";
import { ColorSelector, CapacitySelector } from "./ProductCardComponents";
import { getCloudinaryUrl } from "@/lib/cloudinary";
import { ProductApiData } from "@/lib/api";

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
  imagePreviewUrl?: string; // URL de imagen específica para este color
  imagen_premium?: string[]; // URLs de imágenes premium para este color
  video_premium?: string[]; // URLs de videos premium para este color
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
  segmento?: string | string[]; // Segmento del producto (Premium, etc.) - puede ser string o array
  capacity?: string | null;
  stock?: number;
  sku?: string | null;
  ean?: string | null;
  skuArray?: string[];
  eanArray?: string[];
  detailedDescription?: string | null;
  imageDetailsUrls?: string[]; // URLs de imágenes adicionales para la galería
  // imagen_premium y video_premium ahora están a nivel de ProductColor
  selectedColor?: ProductColor;
  setSelectedColor?: (color: ProductColor) => void;
  selectedCapacity?: ProductCapacity;
  setSelectedCapacity?: (capacity: ProductCapacity) => void;
  puntos_q?: number; // Puntos Q acumulables por producto (valor fijo por ahora)
  // Datos de la API para el nuevo sistema de selección
  apiProduct?: ProductApiData;
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
  segmento, // Segmento del producto
  apiProduct, // Nuevo prop para el sistema de selección inteligente
}: ProductCardProps & { puntos_q?: number }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [currentImageIndex] = useState(0);

  // Hook para manejo inteligente de selección de productos
  const productSelection = useProductSelection(apiProduct || {
    codigoMarketBase: id,
    codigoMarket: [],
    nombreMarket: name,
    categoria: '',
    subcategoria: '',
    modelo: '',
    color: [],
    capacidad: [],
    memoriaram: [],
    descGeneral: null,
    sku: [],
    ean: [],
    desDetallada: [],
    stock: [],
    stockTotal: [],
    urlImagenes: [],
    urlRender3D: [],
    imagePreviewUrl: [],
    imageDetailsUrls: [],
    precioNormal: [],
    precioeccommerce: [],
    fechaInicioVigencia: [],
    fechaFinalVigencia: []
  });

  // Verificar si el producto está sin stock
  const isOutOfStock = productSelection.selectedStockTotal === 0 || stock === 0;

  // Integración con el contexto del carrito
  const { addProduct } = useCartContext();

  // Sistema de selección: usar el nuevo hook si está disponible, sino usar el sistema legacy
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

  // Usar datos del nuevo sistema si está disponible
  const currentSku = productSelection.selectedSku || selectedColor?.sku;
  const currentCodigoMarket = productSelection.selectedCodigoMarket || null;
  const currentPrice = productSelection.selectedPrice || null;
  const currentOriginalPrice = productSelection.selectedOriginalPrice || null;

  // Obtener la imagen del color seleccionado o usar la imagen por defecto
  const currentImage = useMemo(() => {
    
    // Si hay datos de API, usar la imagen de la variante seleccionada
    if (apiProduct && productSelection.selectedVariant?.imagePreviewUrl) {
      return productSelection.selectedVariant.imagePreviewUrl;
    }
    // Si no hay datos de API, usar el sistema legacy
    if (!apiProduct && selectedColor?.imagePreviewUrl) {
      return selectedColor.imagePreviewUrl;
    }
    // Fallback a la imagen por defecto
    return image;
  }, [apiProduct, productSelection.selectedVariant, selectedColor, image]);

  // Simular múltiples imágenes para el carrusel (en una implementación real, vendrían del backend)
  const productImages = useMemo(
    () => [currentImage, currentImage, currentImage, currentImage, currentImage, currentImage],
    [currentImage]
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
    if (apiProduct) {
      // Usar el nuevo sistema de selección
      productSelection.selectColor(color.label);
    } else {
      // Usar el sistema legacy
      setSelectedColorLocal(color);
    }
    
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
    if (apiProduct) {
      // Usar el nuevo sistema de selección
      productSelection.selectCapacity(capacity.label);
    } else {
      // Usar el sistema legacy
      setSelectedCapacityLocal(capacity);
    }
    
    posthogUtils.capture("product_capacity_selected", {
      product_id: id,
      product_name: name,
      capacity_value: capacity.value,
      capacity_sku: capacity.sku,
      capacity_ean: capacity.ean,
    });
  };

  // Calcular precios dinámicos: usar el nuevo sistema si está disponible, sino usar el legacy
  const { currentPrice: legacyPrice, currentOriginalPrice: legacyOriginalPrice } =
    calculateDynamicPrices(
      selectedCapacity,
      selectedColor,
      price,
      originalPrice,
      discount
    );

  // Usar precios del nuevo sistema si están disponibles
  const finalCurrentPrice = currentPrice ? `$ ${Math.round(currentPrice).toLocaleString('es-CO')}` : legacyPrice;
  const finalCurrentOriginalPrice = currentOriginalPrice ? `$${Math.round(currentOriginalPrice).toLocaleString('es-CO')}` : legacyOriginalPrice;

  const handleAddToCart = async () => {
    if (isLoading) {
      return; // Prevenir múltiples clics mientras está cargando
    }

    setIsLoading(true);

    try {
      // Validación estricta: debe existir un SKU válido
      const skuToUse = currentSku || selectedColor?.sku;
      const eanToUse = productSelection.selectedVariant?.ean || selectedColor?.ean || '';
      
      if (!skuToUse) {
        setIsLoading(false);
        return;
      }

      posthogUtils.capture("add_to_cart_click", {
        product_id: id,
        product_name: name,
        selected_color: selectedColor?.name || productSelection.selection.selectedColor,
        selected_color_sku: skuToUse,
        selected_color_ean: eanToUse,
        source: "product_card",
      });

      // Agrega el producto al carrito usando el contexto - SIEMPRE cantidad 1
      addProduct({
        id,
        name,
        image: typeof image === "string" ? image : image.src ?? "",
        price:
          typeof finalCurrentPrice === "string"
            ? Number.parseInt(finalCurrentPrice.replaceAll(/[^\d]/g, ""))
            : finalCurrentPrice ?? 0,
        originalPrice:
          typeof finalCurrentOriginalPrice === "string"
            ? Number.parseInt(finalCurrentOriginalPrice.replaceAll(/[^\d]/g, ""))
            : finalCurrentOriginalPrice,
        stock,
        shippingFrom: "Bogotá",
        quantity: 1, // SIEMPRE agregar de 1 en 1
        sku: skuToUse, // SKU del sistema seleccionado
        ean: eanToUse, // EAN del sistema seleccionado
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
      segment: segmento,
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
    src: typeof currentImage === "string" ? currentImage : currentImage.src,
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
        aria-label={`Ver detalles de ${apiProduct?.modelo || name}`}
      className={cn(
        "cursor-pointer transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-lg w-full max-w-[350px] mx-auto",
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
        <div className="px-3">
          <h3
            className="text-base font-bold line-clamp-1 overflow-hidden text-ellipsis whitespace-nowrap text-black"
          >
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                handleMoreInfo();
              }}
              className="w-full text-left bg-transparent p-0 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-black text-black"
            >
              {apiProduct?.modelo || name}
            </button>
          </h3>
          
          {/* SKU y CodigoMarket dinámicos */}
          {(currentSku || currentCodigoMarket) && (
            <div className="mt-1 space-y-0.5">
              {currentSku && (
                <p className="text-xs text-gray-500 font-medium">
                  SKU: {currentSku}
                </p>
              )}
              {currentCodigoMarket && (
                <p className="text-xs text-gray-500 font-medium">
                  Código: {currentCodigoMarket}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Selector de colores */}
        <div className="h-[40px] px-3">
          <ColorSelector
            colors={apiProduct ? 
              productSelection.availableColors.map(colorName => {
                // Crear un ProductColor basado en el nombre del color
                const normalizedColor = colorName.toLowerCase().trim();
                const colorInfo = colors.find(c => c.label.toLowerCase() === normalizedColor) || 
                  { name: normalizedColor.replaceAll(/\s+/g, '-'), hex: '#808080', label: colorName, sku: '', ean: '' };
                return colorInfo;
              }) : colors
            }
            selectedColor={apiProduct ? 
              colors.find(c => c.label === productSelection.selection.selectedColor) || null : 
              selectedColor
            }
            isOutOfStock={isOutOfStock}
            onColorSelect={handleColorSelect}
            onShowMore={handleCardClick}
          />
        </div>

        {/* Selector de capacidad */}
        <div className="h-[40px] px-3">
          <CapacitySelector
            capacities={apiProduct ? 
              productSelection.availableCapacities.map(capacityName => {
                // Crear un ProductCapacity basado en el nombre de la capacidad
                const capacityInfo = capacities?.find(c => c.label === capacityName) || 
                  { value: capacityName.toLowerCase().replaceAll(/\s+/g, ''), label: capacityName, sku: '', ean: '' };
                return capacityInfo;
              }) : (capacities || [])
            }
            selectedCapacity={apiProduct ? 
              productSelection.availableCapacities.map(capacityName => {
                const capacityInfo = capacities?.find(c => c.label === capacityName) || 
                  { value: capacityName.toLowerCase().replaceAll(/\s+/g, ''), label: capacityName, sku: '', ean: '' };
                return capacityInfo;
              }).find(c => c.label === productSelection.selection.selectedCapacity) || null : 
              selectedCapacity
            }
            isOutOfStock={isOutOfStock}
            onCapacitySelect={handleCapacitySelect}
          />
        </div>

        {/* Precio */}
        <div className="h-[150px] px-3 flex flex-col justify-between">
          {finalCurrentPrice && (
            <div className="space-y-1">
              {/* Precio principal */}
              <div
                className="text-xl font-bold text-black"
              >
                {finalCurrentPrice}
              </div>

              {/* Precio original y ahorro (solo si hay descuento) */}
              {(() => {
                const { hasSavings, savings } = calculateSavings(
                  finalCurrentPrice,
                  finalCurrentOriginalPrice
                );

                if (!hasSavings) return null;

                return (
                  <div className="flex items-center gap-1.5">
                    <span
                      className="text-xs line-through text-gray-500"
                    >
                      {finalCurrentOriginalPrice}
                    </span>
                    <span
                      className="text-xs font-semibold whitespace-nowrap text-blue-600"
                    >
                      Ahorra ${savings.toLocaleString("es-CO")}
                    </span>
                  </div>
                );
              })()}
            </div>
          )}
          {/* Botones de acción */}
          <div className="space-y-2">
            {/* Etiqueta "Sin unidades" si no hay stock */}
            {isOutOfStock && (
              <div className="w-full py-1.5 px-3 rounded-md bg-gray-50 border border-gray-200">
                <p className="text-xs text-gray-600 text-center font-medium">Sin unidades</p>
              </div>
            )}

            <button
              onClick={(e) => {
                e.stopPropagation();
                if (isOutOfStock) {
                  alert("Te notificaremos cuando este producto esté disponible");
                } else {
                  handleAddToCart();
                }
              }}
              disabled={isLoading}
              className={cn(
                "w-full bg-black text-white py-2.5 px-4 rounded-full text-xs lg:text-lg font-bold",
                "hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors",
                isLoading && "animate-pulse"
              )}
            >
              {isLoading ? (
                <Loader className="w-4 h-4 mx-auto" />
              ) : isOutOfStock ? (
                "Notifícame"
              ) : (
                "Comprar ahora"
              )}
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                handleMoreInfo();
              }}
              className="w-full text-black py-2.5 px-4 text-xs lg:text-md font-bold hover:underline transition-all border border-gray-300 rounded-full"
            >
              Más información
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
