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
import { useAnalytics } from "@/lib/analytics/hooks/useAnalytics";
import { useCloudinaryImage } from "@/hooks/useCloudinaryImage";
import { useProductSelection } from "@/hooks/useProductSelection";
import {
  calculateDynamicPrices,
  calculateSavings,
} from "./utils/productCardHelpers";
import { ColorSelector, CapacitySelector } from "./ProductCardComponents";
import { getCloudinaryUrl } from "@/lib/cloudinary";
import { ProductApiData } from "@/lib/api";
import {
  shouldShowColorSelector,
  shouldShowCapacitySelector,
} from "./utils/categoryColorConfig";
import StockNotificationModal from "@/components/StockNotificationModal";
import { useStockNotification } from "@/hooks/useStockNotification";
import { shouldRenderValue } from "./utils/shouldRenderValue";

/**
 * Formatea la capacidad para mostrar correctamente GB, TB, litros o pulgadas
 * - Para almacenamiento: mantiene el formato original (128GB, 256GB, etc.)
 * - Para litros: normaliza el formato (859LT -> 859 LT, 809 LT -> 809 LT)
 * - Para pulgadas: agrega comillas si es solo un número (75 -> 75")
 */
function formatCapacityLabel(capacity: string): string {
  if (!capacity) return capacity;

  // Si ya tiene GB, TB, o comillas, retornar tal cual
  if (capacity.includes('GB') || capacity.includes('TB') || capacity.includes('"') || capacity.includes('pulgada')) {
    return capacity;
  }

  // Normalizar litros: asegurar espacio entre número y LT (859LT -> 859 LT)
  if (capacity.toUpperCase().includes('LT')) {
    return capacity.replace(/(\d+)(LT)/gi, '$1 $2').trim();
  }

  // Si es solo un número (probablemente pulgadas de TV), agregar comillas
  const numericValue = capacity.trim();
  if (/^\d+$/.test(numericValue)) {
    return `${numericValue}"`;
  }

  // En cualquier otro caso, retornar tal cual
  return capacity;
}

export interface ProductColor {
  name: string; // Nombre técnico del color (ej: "black", "white")
  hex: string; // Código hexadecimal del color (ej: "#000000")
  label: string; // Nombre mostrado al usuario (ej: "Negro Medianoche")
  nombreColorDisplay?: string; // Nombre del color del API para mostrar después de "Color:"
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
  capacities?: ProductCapacity[];
  price?: string;
  originalPrice?: string;
  discount?: string;
  isFavorite?: boolean;
  onToggleFavorite?: (productId: string) => void;
  className?: string;
  segmento?: string | string[];
  selectedColor?: ProductColor;
  selectedCapacity?: ProductCapacity;
  puntos_q?: number;
  apiProduct?: ProductApiData;
  acceptsTradeIn?: boolean;
  desDetallada?: string; // Indica si el producto acepta retoma (basado en indRetoma)
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
  segmento, // Segmento del producto
  apiProduct, // Nuevo prop para el sistema de selección inteligente
}: ProductCardProps & { puntos_q?: number }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [currentImageIndex] = useState(0);
  useAnalytics();

  // Hook para notificaciones de stock
  const stockNotification = useStockNotification();

  // Hook para manejo inteligente de selección de productos
  const productSelection = useProductSelection(
    apiProduct || {
      codigoMarketBase: id,
      codigoMarket: [],
      nombreMarket: [name],
      categoria: "",
      subcategoria: "",
      modelo: [name],
      color: [],
      capacidad: [],
      memoriaram: [],
      descGeneral: [],
      sku: [],
      ean: [],
      desDetallada: [],
      stockTotal: [],
      cantidadTiendas: [],
      cantidadTiendasReserva: [],
      urlImagenes: [],
      urlRender3D: [],
      imagePreviewUrl: [],
      imageDetailsUrls: [],
      precioNormal: [],
      precioeccommerce: [],
      fechaInicioVigencia: [],
      fechaFinalVigencia: [],
      indRetoma: [],
      indcerointeres: [],
      skuPostback: [],
    }
  );

  // Determinar si debe mostrar selectores de color/capacidad basándose en la categoría
  const showColorSelector = shouldShowColorSelector(
    apiProduct?.categoria,
    apiProduct?.subcategoria
  );
  const showCapacitySelector = shouldShowCapacitySelector(
    apiProduct?.categoria,
    apiProduct?.subcategoria
  );

  // DEBUG: Log para verificar capacidades en TV
  if (apiProduct?.categoria === 'AV' && process.env.NODE_ENV === 'development') {
    console.log('🔍 TV Product Debug:', {
      modelo: apiProduct?.modelo?.[0],
      categoria: apiProduct?.categoria,
      showCapacitySelector,
      availableCapacities: productSelection.availableCapacities,
      capacidadFromAPI: apiProduct?.capacidad,
    });
  }

  // Integración con el contexto del carrito
  const { addProduct, getQuantityBySku } = useCartContext();

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
  const currentskuPostback = productSelection.selectedSkuPostback || null;

  // Calcular stock real descontando lo que está en el carrito
  const quantityInCart = currentSku ? getQuantityBySku(currentSku) : 0;
  const realStock = Math.max(0, (productSelection.selectedVariant?.stockDisponible ?? 0) - quantityInCart);
  
  // Verificar si la VARIANTE SELECCIONADA está sin stock
  // Si el usuario selecciona color + almacenamiento específico, verificar ESA combinación
  const isOutOfStock = realStock <= 0;

  // Obtener el nombre del modelo basado en la variante seleccionada
  // Si hay una variante seleccionada, usar el modelo del índice correspondiente
  const currentProductName = useMemo(() => {
    if (apiProduct && productSelection.selectedVariant?.index !== undefined) {
      const variantIndex = productSelection.selectedVariant.index;
      // Usar modelo del índice de la variante seleccionada, o nombreMarket como fallback
      const modelName = apiProduct.modelo?.[variantIndex] || apiProduct.nombreMarket?.[variantIndex];
      if (modelName) {
        return modelName;
      }
    }
    // Fallback al nombre original o primer modelo
    return apiProduct?.modelo?.[0] || apiProduct?.nombreMarket?.[0] || name;
  }, [apiProduct, productSelection.selectedVariant, name]);

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
    () => [
      currentImage,
      currentImage,
      currentImage,
      currentImage,
      currentImage,
      currentImage,
    ],
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
      // El color.name contiene el valor hexadecimal del campo "color" de la API
      // Usar directamente ese valor para seleccionar
      productSelection.selectColor(color.name);
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
      product_name: currentProductName,
      capacity_value: capacity.value,
      capacity_sku: capacity.sku,
      capacity_ean: capacity.ean,
    });
  };

  // Calcular precios dinámicos: usar el nuevo sistema si está disponible, sino usar el legacy
  const {
    currentPrice: legacyPrice,
    currentOriginalPrice: legacyOriginalPrice,
  } = calculateDynamicPrices(
    selectedCapacity,
    selectedColor,
    price,
    originalPrice,
    discount
  );

  // Usar precios del nuevo sistema si están disponibles
  const finalCurrentPrice = currentPrice
    ? `$ ${Math.round(currentPrice).toLocaleString("es-CO")}`
    : legacyPrice;
  const finalCurrentOriginalPrice = currentOriginalPrice
    ? `$${Math.round(currentOriginalPrice).toLocaleString("es-CO")}`
    : legacyOriginalPrice;

  const handleAddToCart = async () => {
    if (isLoading) {
      return; // Prevenir múltiples clics mientras está cargando
    }

    setIsLoading(true);

    try {
      // Validación estricta: debe existir un SKU válido
      const skuToUse = currentSku || selectedColor?.sku;
      const eanToUse =
        productSelection.selectedVariant?.ean || selectedColor?.ean || "";

      if (!skuToUse) {
        setIsLoading(false);
        return;
      }

      posthogUtils.capture("add_to_cart_click", {
        product_id: id,
        product_name: name,
        selected_color:
          selectedColor?.name || productSelection.selection.selectedColor,
        selected_color_sku: currentSku || "",
        selected_color_ean: eanToUse,
        source: "product_card",
      });

      // Agrega el producto al carrito usando el contexto - SIEMPRE cantidad 1
      // shippingCity y shippingStore se obtienen automáticamente del backend
      await addProduct({
        id,
        name,
        image:
          typeof currentImage === "string"
            ? currentImage
            : typeof image === "string"
            ? image
            : image.src ?? "",
        price:
          typeof finalCurrentPrice === "string"
            ? Number.parseInt(finalCurrentPrice.replaceAll(/[^\d]/g, ""))
            : finalCurrentPrice ?? 0,
        originalPrice:
          typeof finalCurrentOriginalPrice === "string"
            ? Number.parseInt(
                finalCurrentOriginalPrice.replaceAll(/[^\d]/g, "")
              )
            : finalCurrentOriginalPrice,
        stock: productSelection.selectedVariant?.stockDisponible ?? 0,
        quantity: 1, // SIEMPRE agregar de 1 en 1
        sku: currentSku || "", // SKU del sistema seleccionado
        ean: eanToUse, // EAN del sistema seleccionado
        puntos_q,
        color: displayedSelectedColor?.hex && shouldRenderValue(displayedSelectedColor.hex) ? displayedSelectedColor.hex : undefined,
        colorName:
          (displayedSelectedColor?.nombreColorDisplay && shouldRenderValue(displayedSelectedColor.nombreColorDisplay)) ? displayedSelectedColor.nombreColorDisplay :
          (productSelection.selection.selectedColor && shouldRenderValue(productSelection.selection.selectedColor)) ? productSelection.selection.selectedColor :
          (selectedColor?.label && shouldRenderValue(selectedColor.label)) ? selectedColor.label :
          undefined,
        capacity:
          (productSelection.selection.selectedCapacity && shouldRenderValue(productSelection.selection.selectedCapacity)) ? productSelection.selection.selectedCapacity :
          (selectedCapacity?.label && shouldRenderValue(selectedCapacity.label)) ? selectedCapacity.label :
          undefined,
        ram: (productSelection.selection.selectedMemoriaram && shouldRenderValue(productSelection.selection.selectedMemoriaram)) ? productSelection.selection.selectedMemoriaram : undefined,
        skuPostback: productSelection.selectedSkuPostback || "",
        desDetallada: productSelection.selectedVariant?.desDetallada,
        modelo: apiProduct?.modelo?.[0] || "",
        categoria: apiProduct?.categoria || "",
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

  const handleRequestStockNotification = async (email: string) => {
    // Obtener el SKU del color seleccionado
    const selectedColorSku = displayedSelectedColor?.sku;

    // Obtener el codigoMarket correspondiente a la variante seleccionada
    const codigoMarket =
      productSelection.selectedCodigoMarket ||
      apiProduct?.codigoMarketBase ||
      "";

    await stockNotification.requestNotification({
      productName: currentProductName,
      email,
      sku: selectedColorSku,
      codigoMarket,
    });
  };

  const handleMoreInfo = () => {
    // Guardar la selección actual del usuario en localStorage
    const selectedProductData = {
      productId: id,
      productName: currentProductName,
      price: currentPrice || (typeof finalCurrentPrice === "string" ? Number.parseInt(finalCurrentPrice.replaceAll(/[^\d]/g, "")) : finalCurrentPrice),
      originalPrice: currentOriginalPrice || (typeof finalCurrentOriginalPrice === "string" ? Number.parseInt(finalCurrentOriginalPrice.replaceAll(/[^\d]/g, "")) : finalCurrentOriginalPrice),
      color: displayedSelectedColor?.nombreColorDisplay || productSelection.selection.selectedColor || selectedColor?.label,
      colorHex: displayedSelectedColor?.hex || selectedColor?.hex,
      capacity: productSelection.selection.selectedCapacity || selectedCapacity?.label,
      ram: productSelection.selection.selectedMemoriaram,
      sku: currentSku,
      ean: productSelection.selectedVariant?.ean || selectedColor?.ean,
      image: typeof currentImage === "string" ? currentImage : typeof image === "string" ? image : image.src,
      indcerointeres: apiProduct?.indcerointeres?.[0] ?? 0,
      allPrices: apiProduct?.precioeccommerce || [],
    };

    // Guardar en localStorage con una clave única por producto
    localStorage.setItem(`product_selection_${id}`, JSON.stringify(selectedProductData));

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

  // Obtener imagen optimizada de Cloudinary para catálogo
  const cloudinaryImage = useCloudinaryImage({
    src: typeof currentImage === "string" ? currentImage : currentImage.src,
    transformType: "catalog",
    responsive: true,
  });

  // Color seleccionado para UI (coincide con el selector de colores)
  const displayedSelectedColor = useMemo(() => {
    if (apiProduct) {
      // Obtener las opciones de color con nombreColorDisplay desde el hook
      const colorOptions = productSelection.getColorOptions().map((colorOption) => ({
        name: colorOption.color,
        hex: colorOption.hex,
        label: colorOption.nombreColorDisplay || colorOption.color,
        nombreColorDisplay: colorOption.nombreColorDisplay || undefined,
        sku: colorOption.variants[0]?.sku || "",
        ean: colorOption.variants[0]?.ean || "",
      }));

      // Buscar por el valor de color (hex) ya que productSelection.selection.selectedColor contiene el hex
      return (
        colorOptions.find(
          (c) => c.name === productSelection.selection.selectedColor ||
                 c.hex === productSelection.selection.selectedColor
        ) || null
      );
    }
    return selectedColor;
  }, [
    apiProduct,
    productSelection,
    selectedColor,
  ]);

  return (
    <>
        <StockNotificationModal
        isOpen={stockNotification.isModalOpen}
        onClose={stockNotification.closeModal}
        productName={currentProductName}
        productImage={
          typeof currentImage === "string"
            ? currentImage
            : typeof image === "string"
            ? image
            : image.src ?? ""
        }
        selectedColor={
          (displayedSelectedColor?.nombreColorDisplay && shouldRenderValue(displayedSelectedColor.nombreColorDisplay)) ? displayedSelectedColor.nombreColorDisplay :
          (productSelection.selection.selectedColor && shouldRenderValue(productSelection.selection.selectedColor)) ? productSelection.selection.selectedColor :
          undefined
        }
        selectedStorage={
          (productSelection.selection.selectedCapacity && shouldRenderValue(productSelection.selection.selectedCapacity)) ? productSelection.selection.selectedCapacity : undefined
        }
        onNotificationRequest={handleRequestStockNotification}
      />

      <div
        className={cn(
          "rounded-lg w-full h-full flex flex-col mx-auto",
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
          {/* Carrusel de imágenes - Clickable */}
          <div
            className="relative w-full h-full cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              handleMoreInfo();
            }}
          >
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
                      key={`${id}-${transformedSrc}-${index}`}
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

          {/* Etiqueta "Sin unidades" en la parte inferior de la imagen */}
          {isOutOfStock && process.env.NEXT_PUBLIC_MAINTENANCE_MODE !== "true" && (
            <div className="absolute bottom-0 left-0 right-0 mx-3 mb-3">
              <div className="w-full py-1.5 px-3 rounded-md bg-white/95 backdrop-blur-sm border border-gray-200">
                <p className="text-xs text-gray-600 text-center font-medium">
                  Sin unidades
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Contenido del producto */}
        <div className="py-2 space-y-2 flex-1 flex flex-col">
          {/* Título del producto */}
          <div className="px-3 min-h-[48px]">
            <h3 className="text-base font-bold line-clamp-2 text-black">
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  handleMoreInfo();
                }}
                className="w-full text-left bg-transparent p-0 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-black text-black"
              >
                {currentProductName}
              </button>
            </h3>
            {/* SKU y CodigoMarket dinámicos - Solo si la variable de entorno lo permite */}
            {process.env.NEXT_PUBLIC_SHOW_PRODUCT_CODES === "true" &&
              process.env.NEXT_PUBLIC_MAINTENANCE_MODE !== "true" &&
              (currentSku || currentCodigoMarket || currentskuPostback) && (
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
                  {currentskuPostback && (
                    <div>
                      <p className="text-xs text-gray-500 font-medium">
                        SKU Postback: {currentskuPostback}
                      </p>
                    </div>
                  )}

                  {/* Mostrar stock disponible ajustado */}
                  {productSelection.selectedVariant && (
                    <div className="text-sm text-gray-600 mt-2">
                      Stock disponible:{" "}
                      <span
                        className={cn(
                          "ml-1 font-semibold",
                          realStock > 0
                            ? "text-green-600"
                            : "text-red-600"
                        )}
                      >
                        {realStock}
                      </span>
                      {quantityInCart > 0 && (
                        <span className="text-xs text-blue-600 ml-1">
                          ({quantityInCart} en carrito)
                        </span>
                      )}
                      <span className="text-xs text-gray-500 ml-1">
                        (Total: {productSelection.selectedVariant.stockTotal} en{" "}
                        {productSelection.selectedVariant.cantidadTiendas}{" "}
                        {productSelection.selectedVariant.cantidadTiendas === 1
                          ? "tienda"
                          : "tiendas"}
                        )
                      </span>
                    </div>
                  )}
                </div>
              )}
          </div>

          {/* Nombre de color del API (antes del selector) - Mostrar solo si es válido */}
          {displayedSelectedColor?.nombreColorDisplay && shouldRenderValue(displayedSelectedColor.nombreColorDisplay) && (
            <div className="px-3 mb-1">
              <p className="text-xs text-gray-600 font-medium">
                {`Color: ${displayedSelectedColor.nombreColorDisplay}`}
              </p>
            </div>
          )}

          {/* Selector de colores - Solo para categorías específicas Y si hay colores disponibles */}
          {showColorSelector &&
            (apiProduct
              ? productSelection.availableColors.length > 0
              : colors && colors.length > 0) && (
              <div className="min-h-[48px] px-3">
                <ColorSelector
                  colors={
                    apiProduct
                      ? productSelection.getColorOptions().map((colorOption) => ({
                          name: colorOption.color,
                          hex: colorOption.hex,
                          label: colorOption.nombreColorDisplay || colorOption.color,
                          nombreColorDisplay: colorOption.nombreColorDisplay || undefined,
                          sku: colorOption.variants[0]?.sku || "",
                          ean: colorOption.variants[0]?.ean || "",
                        }))
                      : colors
                  }
                  selectedColor={displayedSelectedColor}
                  onColorSelect={handleColorSelect}
                  onShowMore={handleMoreInfo}
                />
              </div>
            )}

          {/* Selector de capacidad - Solo para categorías específicas Y si hay capacidades disponibles */}
          {showCapacitySelector &&
            (apiProduct
              ? productSelection.availableCapacities.length > 0
              : capacities && capacities.length > 0) && (
              <div className="min-h-[48px] px-3">
                <CapacitySelector
                  capacities={
                    apiProduct
                      ? productSelection.availableCapacities.map(
                          (capacityName) => {
                            // Crear un ProductCapacity basado en el nombre de la capacidad
                            const formattedLabel = formatCapacityLabel(capacityName);
                            const capacityInfo = capacities?.find(
                              (c) => c.label === capacityName
                            ) || {
                              value: capacityName
                                .toLowerCase()
                                .replaceAll(/\s+/g, ""),
                              label: formattedLabel,
                              sku: "",
                              ean: "",
                            };
                            return capacityInfo;
                          }
                        )
                      : capacities || []
                  }
                  selectedCapacity={
                    apiProduct
                      ? productSelection.availableCapacities
                          .map((capacityName) => {
                            const formattedLabel = formatCapacityLabel(capacityName);
                            const capacityInfo = capacities?.find(
                              (c) => c.label === capacityName
                            ) || {
                              value: capacityName
                                .toLowerCase()
                                .replaceAll(/\s+/g, ""),
                              label: formattedLabel,
                            };
                            return capacityInfo;
                          })
                          .find(
                            (c) =>
                              c.label === formatCapacityLabel(productSelection.selection.selectedCapacity || "")
                          ) || null
                      : selectedCapacity
                  }
                  onCapacitySelect={handleCapacitySelect}
                />
              </div>
            )}

          {/* Precio */}
          <div className="px-3 space-y-3 mt-auto">
            {finalCurrentPrice && (
              <div className="space-y-1 min-h-[32px]">
                {(() => {
                  const { hasSavings, savings } = calculateSavings(
                    finalCurrentPrice,
                    finalCurrentOriginalPrice
                  );

                  if (!hasSavings) {
                    // Sin descuento: solo precio
                    return (
                      <div className="text-xl font-bold text-black">
                        {finalCurrentPrice}
                      </div>
                    );
                  }

                  // Con descuento: precio + info de descuento a la derecha
                  return (
                    <div className="flex items-end gap-3">
                      {/* Precio final */}
                      <div className="text-xl font-bold text-black leading-tight">
                        {finalCurrentPrice}
                      </div>

                      {/* Info de descuento a la derecha */}
                      <div className="flex flex-col items-start justify-end">
                        {/* Precio anterior tachado */}
                        <span className="text-xs line-through text-gray-500 leading-tight">
                          {finalCurrentOriginalPrice}
                        </span>
                        {/* Ahorro */}
                        <span className="text-xs font-semibold whitespace-nowrap text-blue-600 leading-tight">
                          Ahorra ${savings.toLocaleString("es-CO")}
                        </span>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}
            {/* Botones de acción - Horizontal */}
            <div className="flex items-center gap-3">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (process.env.NEXT_PUBLIC_MAINTENANCE_MODE === "true" || isOutOfStock) {
                    stockNotification.openModal();
                  } else {
                    handleAddToCart();
                  }
                }}
                disabled={isLoading}
                className={cn(
                  "flex-1 bg-black text-white py-2 px-2 rounded-full text-xs lg:text-md font-semibold cursor-pointer",
                  "hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors",
                  isLoading && "animate-pulse"
                )}
              >
                {isLoading ? (
                  <Loader className="w-4 h-4 mx-auto" />
                ) : process.env.NEXT_PUBLIC_MAINTENANCE_MODE === "true" ? (
                  "Notifícame"
                ) : isOutOfStock ? (
                  "Notifícame"
                ) : (
                  "Añadir al carrito"
                )}
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleMoreInfo();
                }}
                className="text-black text-sm font-medium hover:underline transition-all whitespace-nowrap cursor-pointer"
              >
                Más información
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
