/**
 * BUNDLE CARD COMPONENT - IMAGIQ ECOMMERCE
 *
 * Componente para mostrar bundles (paquetes de productos)
 * - Diseño similar a ProductCard pero adaptado para bundles
 * - Muestra nombre del bundle, precio y descuento
 * - Próximamente: imagen preview del bundle
 */

"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { Plus, Loader } from "lucide-react";
import { cn } from "@/lib/utils";
import { posthogUtils } from "@/lib/posthogClient";
import { getCloudinaryUrl } from "@/lib/cloudinary";
import { calculateSavings } from "./utils/productCardHelpers";
import type { BundleCardProps, BundleOptionProps } from "@/lib/productMapper";
import { useCartContext } from "@/features/cart/CartContext";
import { apiGet } from "@/lib/api-client";
import type { BundleInfo, CartProduct } from "@/hooks/useCart";
import { toast } from "sonner";
import { useStockNotification } from "@/hooks/useStockNotification";
import StockNotificationModal from "@/components/StockNotificationModal";
import { shouldRenderValue } from "./utils/shouldRenderValue";

/**
 * Selector de variantes del bundle con colores y capacidades
 * - Muestra círculos de color cuando hay colores disponibles
 * - Muestra botones de capacidad cuando hay capacidades disponibles
 * - Fallback a números secuenciales si no hay datos de variantes
 */
function BundleVariantSelector({
  opciones,
  selectedOptionIndex,
  onSelectOption,
}: {
  opciones: BundleOptionProps[];
  selectedOptionIndex: number;
  onSelectOption: (index: number) => void;
}) {
  // Extraer colores únicos con sus índices
  const uniqueColors = useMemo(() => {
    const colorMap = new Map<string, { hex: string; name: string; indices: number[] }>();
    opciones.forEach((opcion, index) => {
      if (opcion.colorProductSku) {
        const existing = colorMap.get(opcion.colorProductSku);
        if (existing) {
          existing.indices.push(index);
        } else {
          colorMap.set(opcion.colorProductSku, {
            hex: opcion.colorProductSku,
            name: opcion.nombreColorProductSku || 'Color',
            indices: [index],
          });
        }
      }
    });
    return Array.from(colorMap.values());
  }, [opciones]);

  // Extraer capacidades únicas con sus índices
  const uniqueCapacities = useMemo(() => {
    const capacityMap = new Map<string, { value: string; indices: number[] }>();
    opciones.forEach((opcion, index) => {
      if (opcion.capacidadProductSku) {
        const existing = capacityMap.get(opcion.capacidadProductSku);
        if (existing) {
          existing.indices.push(index);
        } else {
          capacityMap.set(opcion.capacidadProductSku, {
            value: opcion.capacidadProductSku,
            indices: [index],
          });
        }
      }
    });
    return Array.from(capacityMap.values());
  }, [opciones]);

  // Determinar el color y capacidad actuales
  const selectedOption = opciones[selectedOptionIndex];
  const selectedColor = selectedOption?.colorProductSku;
  const selectedCapacity = selectedOption?.capacidadProductSku;

  // Verificar si hay datos de variantes
  const hasVariantData = uniqueColors.length > 0 || uniqueCapacities.length > 0;

  // Handler para seleccionar color - busca la primera opción con ese color y la capacidad actual (si aplica)
  const handleColorSelect = (colorHex: string) => {
    const colorData = uniqueColors.find(c => c.hex === colorHex);
    if (!colorData) return;

    // Si hay capacidad seleccionada, buscar opción con ese color Y esa capacidad
    if (selectedCapacity) {
      const matchIndex = colorData.indices.find(idx =>
        opciones[idx].capacidadProductSku === selectedCapacity
      );
      if (matchIndex !== undefined) {
        onSelectOption(matchIndex);
        return;
      }
    }
    // Si no, seleccionar la primera opción con ese color
    onSelectOption(colorData.indices[0]);
  };

  // Handler para seleccionar capacidad - busca la primera opción con esa capacidad y el color actual (si aplica)
  const handleCapacitySelect = (capacity: string) => {
    const capacityData = uniqueCapacities.find(c => c.value === capacity);
    if (!capacityData) return;

    // Si hay color seleccionado, buscar opción con esa capacidad Y ese color
    if (selectedColor) {
      const matchIndex = capacityData.indices.find(idx =>
        opciones[idx].colorProductSku === selectedColor
      );
      if (matchIndex !== undefined) {
        onSelectOption(matchIndex);
        return;
      }
    }
    // Si no, seleccionar la primera opción con esa capacidad
    onSelectOption(capacityData.indices[0]);
  };

  // Fallback: selector numérico si no hay datos de variantes
  if (!hasVariantData) {
    return (
      <div className="px-3">
        <div className="flex flex-wrap gap-1.5">
          {opciones.map((opcion, index) => (
            <button
              key={opcion.product_sku}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onSelectOption(index);
              }}
              className={cn(
                "px-2 py-1 text-xs rounded-md border transition-all",
                selectedOptionIndex === index
                  ? "border-black bg-black text-white"
                  : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
              )}
              title={opcion.modelo}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Obtener el nombre del color seleccionado
  const selectedColorName = selectedOption?.nombreColorProductSku;

  return (
    <div className="px-3 space-y-1.5">
      {/* Label del color seleccionado - igual que ProductCard */}
      {selectedColorName && shouldRenderValue(selectedColorName) && uniqueColors.length > 0 && (
        <p className="text-xs text-gray-600 font-medium">
          {`Color: ${selectedColorName}`}
        </p>
      )}

      {/* Selector de colores - mismo estilo que ProductCard */}
      {uniqueColors.length > 1 && (
        <div className="flex gap-2 flex-wrap">
          {uniqueColors.map((color) => (
            <button
              key={color.hex}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleColorSelect(color.hex);
              }}
              className={cn(
                "w-6.5 h-6.5 rounded-full border transition-all duration-200 relative cursor-pointer",
                selectedColor === color.hex
                  ? "border-black p-0.5"
                  : "border-gray-300 hover:border-gray-400"
              )}
              title={color.name}
              aria-label={`Color: ${color.name}`}
            >
              <div
                className="w-full h-full rounded-full"
                style={{ backgroundColor: color.hex }}
              />
              {selectedColor === color.hex && (
                <div className="absolute inset-0 rounded-full border-2 border-white" />
              )}
            </button>
          ))}
        </div>
      )}

      {/* Selector de capacidades - mismo estilo que ProductCard */}
      {uniqueCapacities.length > 1 && (
        <div className="flex gap-2 flex-wrap">
          {uniqueCapacities.map((capacity) => (
            <button
              key={capacity.value}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleCapacitySelect(capacity.value);
              }}
              className={cn(
                "px-2.5 py-1.5 text-xs font-medium rounded-md border transition-all duration-200 cursor-pointer",
                selectedCapacity === capacity.value
                  ? "border-black bg-black text-white"
                  : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
              )}
              title={capacity.value}
            >
              {capacity.value}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * Componente para mostrar las imágenes del bundle con superposición diagonal
 * - 2 imágenes: esquina superior-izquierda + esquina inferior-derecha, superpuestas ligeramente
 * - 3+ imágenes: distribución en esquinas con superposición
 */
function BundlePreviewImages({
  images,
  bundleName
}: {
  images: string[];
  bundleName: string;
}) {
  // Filtrar imágenes válidas y tomar máximo 4
  const validImages = images
    .filter(url => url && typeof url === 'string' && url.trim() !== '')
    .slice(0, 4);

  const imageCount = validImages.length;

  // Aplicar transformaciones de Cloudinary
  const transformedImages = useMemo(() => {
    return validImages.map(img => getCloudinaryUrl(img, "catalog"));
  }, [validImages]);

  if (imageCount === 0) {
    return null;
  }

  // Single image - mostrar grande y centrada
  if (imageCount === 1) {
    return (
      <div className="relative w-full h-full">
        <Image
          src={transformedImages[0]}
          alt={`${bundleName} - producto`}
          fill
          className="object-contain p-2"
          sizes="(max-width: 768px) 50vw, 33vw"
        />
      </div>
    );
  }

  // 2 imágenes: diagonal con mayor superposición y overflow - imagen 1 arriba-izquierda, imagen 2 abajo-derecha
  if (imageCount === 2) {
    return (
      <div className="relative w-full h-full overflow-visible">
        {/* Imagen 1: esquina superior-izquierda, se sale del contenedor */}
        <div className="absolute -top-6 -left-6 w-[65%] h-[65%] z-10">
          <Image
            src={transformedImages[0]}
            alt={`${bundleName} - producto 1`}
            fill
            className="object-contain"
            sizes="(max-width: 768px) 40vw, 25vw"
          />
        </div>
        {/* Imagen 2: esquina inferior-derecha, se sale del contenedor */}
        <div className="absolute -bottom-6 right-0 w-[60%] h-[60%] z-20">
          <Image
            src={transformedImages[1]}
            alt={`${bundleName} - producto 2`}
            fill
            className="object-contain"
            sizes="(max-width: 768px) 40vw, 25vw"
          />
        </div>
        {/* Símbolo + centrado */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
          <div className="bg-white rounded-full p-1 shadow-md">
            <Plus className="w-4 h-4 text-black" strokeWidth={2.5} />
          </div>
        </div>
      </div>
    );
  }

  // 3 imágenes: 2 arriba (izq y der) + 1 abajo centrada, sin superposición
  if (imageCount === 3) {
    return (
      <div className="relative w-full h-full">
        {/* Imagen 1: cuadrante superior-izquierdo */}
        <div className="absolute top-0 left-0 w-[50%] h-[50%]">
          <Image
            src={transformedImages[0]}
            alt={`${bundleName} - producto 1`}
            fill
            className="object-contain"
            sizes="(max-width: 768px) 30vw, 20vw"
          />
        </div>
        {/* Imagen 2: cuadrante superior-derecho */}
        <div className="absolute top-0 right-0 w-[50%] h-[50%]">
          <Image
            src={transformedImages[1]}
            alt={`${bundleName} - producto 2`}
            fill
            className="object-contain"
            sizes="(max-width: 768px) 30vw, 20vw"
          />
        </div>
        {/* Imagen 3: abajo centrada */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[50%] h-[50%]">
          <Image
            src={transformedImages[2]}
            alt={`${bundleName} - producto 3`}
            fill
            className="object-contain"
            sizes="(max-width: 768px) 30vw, 20vw"
          />
        </div>
        {/* Símbolo + centrado */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
          <div className="bg-white rounded-full p-1 shadow-md">
            <Plus className="w-4 h-4 text-black" strokeWidth={2.5} />
          </div>
        </div>
      </div>
    );
  }

  // 4 imágenes: grid 2x2, sin superposición
  return (
    <div className="relative w-full h-full">
      {/* Imagen 1: cuadrante superior-izquierdo */}
      <div className="absolute top-0 left-0 w-[50%] h-[50%]">
        <Image
          src={transformedImages[0]}
          alt={`${bundleName} - producto 1`}
          fill
          className="object-contain"
          sizes="(max-width: 768px) 25vw, 16vw"
        />
      </div>
      {/* Imagen 2: cuadrante superior-derecho */}
      <div className="absolute top-0 right-0 w-[50%] h-[50%]">
        <Image
          src={transformedImages[1]}
          alt={`${bundleName} - producto 2`}
          fill
          className="object-contain"
          sizes="(max-width: 768px) 25vw, 16vw"
        />
      </div>
      {/* Imagen 3: cuadrante inferior-izquierdo */}
      <div className="absolute bottom-0 left-0 w-[50%] h-[50%]">
        <Image
          src={transformedImages[2]}
          alt={`${bundleName} - producto 3`}
          fill
          className="object-contain"
          sizes="(max-width: 768px) 25vw, 16vw"
        />
      </div>
      {/* Imagen 4: cuadrante inferior-derecho */}
      <div className="absolute bottom-0 right-0 w-[50%] h-[50%]">
        <Image
          src={transformedImages[3]}
          alt={`${bundleName} - producto 4`}
          fill
          className="object-contain"
          sizes="(max-width: 768px) 25vw, 16vw"
        />
      </div>
      {/* Símbolo + centrado */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
        <div className="bg-white rounded-full p-1 shadow-md">
          <Plus className="w-4 h-4 text-black" strokeWidth={2.5} />
        </div>
      </div>
    </div>
  );
}

export default function BundleCard({
  id,
  baseCodigoMarket,
  codCampana,
  name,
  // image - ya no se usa, las imágenes vienen de previewImages en opciones
  // price, originalPrice, discount - no se usan, se toman de opciones
  opciones,
  categoria,
  menu,
  submenu,
  fecha_inicio,
  fecha_final,
  className,
}: BundleCardProps & { className?: string }) {
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Hook del carrito
  const { addBundleToCart } = useCartContext();

  // Hook para notificar stock
  const stockNotification = useStockNotification();

  // Opción actualmente seleccionada
  const selectedOption = opciones?.[selectedOptionIndex] || opciones?.[0];
  const skus_bundle = selectedOption?.skus_bundle || [];

  // Obtener las imágenes de preview de la opción seleccionada
  const previewImages = selectedOption?.imagePreviewUrl || [];

  // Las opciones se muestran como números simples (1, 2, 3...)
  // El nombre completo del bundle cambia dinámicamente al seleccionar cada opción

  const handleMoreInfo = () => {
    // TODO: Navegar a página de detalle del bundle (próximamente)
    // Por ahora, solo registrar el evento
    posthogUtils.capture("bundle_more_info_click", {
      bundle_id: id,
      bundle_name: name,
      source: "bundle_card",
      baseCodigoMarket,
      codCampana,
      opciones_count: opciones?.length || 0,
      categoria,
      menu,
      submenu,
    });
  };

  const handleAddToCart = async () => {
    if (!selectedOption || skus_bundle.length === 0) {
      toast.error("No se pudo agregar el bundle", {
        description: "No hay productos disponibles en este bundle",
      });
      return;
    }

    // Verificar stock antes de agregar al carrito
    if (isOutOfStock) {
      toast.error("Producto agotado", {
        description: "Este bundle no tiene stock disponible",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Verificar si tenemos el array de productos desde el backend
      console.log("Selected option products:", selectedOption.productos);
      if (selectedOption.productos && selectedOption.productos.length > 0) {
        // Usar datos completos del backend que ya vienen en la opción
        const firstProduct = selectedOption.productos[0];

        const products: Omit<CartProduct, "quantity">[] = selectedOption.productos.map((product, index) => ({
          id: product.sku,
          name: product.modelo,
          image: product.imagePreviewUrl || previewImages[index] || "/img/logo_imagiq.png",
          price: product.product_discount_price,
          originalPrice: product.product_original_price,
          sku: product.sku,
          ean: product.ean || product.sku,
          color: product.color,
          colorName: product.nombreColor,
          capacity: product.capacidad,
          ram: product.memoriaram,
          stock: product.stockTotal,
          modelo: product.modelo,
        }));

        const bundleInfo: BundleInfo = {
          codCampana,
          productSku: selectedOption.product_sku,
          skusBundle: skus_bundle,
          bundlePrice: firstProduct.bundle_price,
          bundleDiscount: firstProduct.bundle_discount,
          fechaFinal: new Date(fecha_final),
        };

        await addBundleToCart(products, bundleInfo);
      } else {
        // Fallback: usar datos básicos de la opción seleccionada
        toast.warning("Usando datos básicos del bundle", {
          description: "No se pudieron obtener los detalles completos",
        });

        // Construir productos básicos desde los SKUs disponibles
        const basicProducts: Omit<CartProduct, "quantity">[] = skus_bundle.map((sku, index) => ({
          id: sku,
          name: `${selectedOption.modelo || name} - Producto ${index + 1}`,
          image: previewImages[index] || "/img/logo_imagiq.png",
          price: 0, // Se calculará proporcionalmente
          sku,
          ean: sku,
          capacity: shouldRenderValue(selectedOption.capacidadProductSku) ? selectedOption.capacidadProductSku : undefined,
          color: shouldRenderValue(selectedOption.colorProductSku) ? selectedOption.colorProductSku : undefined,
          modelo: selectedOption.modelo,
          colorName: shouldRenderValue(selectedOption.nombreColorProductSku) ? selectedOption.nombreColorProductSku : undefined,
          stock: selectedOption.stockTotal,
          ram: shouldRenderValue(selectedOption.memoriaRamProductSku) ? selectedOption.memoriaRamProductSku : undefined
        }));

        const bundleInfo: BundleInfo = {
          codCampana,
          productSku: selectedOption.product_sku,
          skusBundle: skus_bundle,
          bundlePrice: parseFloat(selectedOption.originalPrice?.replace(/[^0-9]/g, "") || "0"),
          bundleDiscount: parseFloat(selectedOption.price?.replace(/[^0-9]/g, "") || "0"),
          fechaFinal: new Date(fecha_final),
        };

        await addBundleToCart(basicProducts, bundleInfo);
      }




      // Track del evento
      posthogUtils.capture("bundle_add_to_cart_success", {
        bundle_id: id,
        bundle_name: name,
        product_sku: selectedOption.product_sku,
        skus_bundle,
        selected_option_index: selectedOptionIndex,
        selected_modelo: selectedOption.modelo,
        stock_available: selectedOptionStock,
        source: "bundle_card",
      });
    } catch (error) {
      console.error("Error adding bundle to cart:", error);
      toast.error("Error al agregar el bundle", {
        description: "Por favor, intenta de nuevo más tarde",
      });

      posthogUtils.capture("bundle_add_to_cart_error", {
        bundle_id: id,
        bundle_name: name,
        error: error instanceof Error ? error.message : "Unknown error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Nombre dinámico: usar el modelo de la opción seleccionada o el nombre del bundle
  const displayName = selectedOption?.modelo || name;

  // Obtener el stock de la opción seleccionada
  const selectedOptionStock = useMemo(() => {
    if (selectedOption?.stockTotal === undefined || selectedOption?.stockTotal === null || selectedOption.stockTotal < 0) return null;
    return selectedOption.stockTotal;
  }, [selectedOption]);

  // Verificar si está agotado
  const isOutOfStock = selectedOptionStock === 0;

  // Handler para solicitar notificación de stock
  const handleRequestStockNotification = async (email: string) => {
    if (!selectedOption) return;

    await stockNotification.requestNotification({
      productName: displayName,
      sku: selectedOption.product_sku,
      email,
      codigoMarket: baseCodigoMarket,
    });
  };

  return (
    <div
      className={cn(
        "rounded-lg w-full h-full flex flex-col mx-auto",
        className
      )}
    >
      {/* Sección de imágenes del bundle - overflow visible para que las imágenes se "salgan" - Clickable */}
      <div
        className="relative aspect-square bg-gray-100 rounded-lg overflow-visible cursor-pointer"
        onClick={(e) => {
          e.stopPropagation();
          handleMoreInfo();
        }}
      >
        <BundlePreviewImages images={previewImages} bundleName={displayName} />
      </div>

      {/* Contenido del bundle */}
      <div className="py-2 space-y-2 flex-1 flex flex-col">
        {/* Título del bundle - muestra el modelo de la opción seleccionada */}
        <div className="px-3 min-h-[48px]">
          <h3 className="text-xs font-bold line-clamp-2 text-black">
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                handleMoreInfo();
              }}
              className="w-full text-left bg-transparent p-0 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-black text-black"
            >
              {displayName}
            </button>
          </h3>
          {/* Códigos del bundle - Solo si la variable de entorno lo permite */}
          {process.env.NEXT_PUBLIC_SHOW_PRODUCT_CODES === "true" &&
            process.env.NEXT_PUBLIC_MAINTENANCE_MODE !== "true" && (
              <div className="mt-1 space-y-0.5">
                {baseCodigoMarket && (
                  <p className="text-xs text-gray-500 font-medium">
                    Código Market: {baseCodigoMarket}
                  </p>
                )}
                {codCampana && (
                  <p className="text-xs text-gray-500 font-medium">
                    Código Campaña: {codCampana}
                  </p>
                )}
                {selectedOption?.product_sku && (
                  <p className="text-xs text-gray-500 font-medium">
                    SKU Opción: {selectedOption.product_sku}
                  </p>
                )}
                {skus_bundle && skus_bundle.length > 0 && (
                  <div className="text-xs text-gray-500 font-medium">
                    <span>SKUs Bundle: </span>
                    <span className="text-gray-400">
                      {skus_bundle.join(", ")}
                    </span>
                  </div>
                )}
                {selectedOptionStock !== null && (
                  <div className="text-xs text-gray-500 font-medium">
                    <span>Stock: </span>
                    <span className={cn(
                      "font-semibold",
                      selectedOptionStock > 5 ? "text-green-600" :
                        selectedOptionStock > 0 ? "text-orange-600" : "text-red-600"
                    )}>
                      {selectedOptionStock} unidades
                    </span>
                  </div>
                )}
              </div>
            )}
        </div>

        {/* Vigencia del bundle - Arriba del selector */}
        {fecha_inicio && fecha_final && (
          <div className="px-3">
            <p className="text-xs font-semibold whitespace-nowrap text-blue-600 leading-tight">
              Oferta válida hasta: {new Date(fecha_final).toLocaleDateString('es-CO')}
            </p>
          </div>
        )}

        {/* Selector de variantes del bundle - Color y Capacidad */}
        {opciones && opciones.length > 1 && (
          <BundleVariantSelector
            opciones={opciones}
            selectedOptionIndex={selectedOptionIndex}
            onSelectOption={setSelectedOptionIndex}
          />
        )}

        {/* Precio - usa la opción seleccionada */}
        <div className="px-3 space-y-3 mt-auto">
          {selectedOption && (
            <div className="space-y-1 min-h-[32px]">
              {(() => {
                // Usar precio de la opción seleccionada
                const currentPrice = selectedOption.price;
                const currentOriginalPrice = selectedOption.originalPrice;

                const { hasSavings, savings } = calculateSavings(
                  currentPrice,
                  currentOriginalPrice
                );

                if (!hasSavings) {
                  // Sin descuento: solo precio
                  return (
                    <div className="text-xl font-bold text-black">
                      {currentPrice}
                    </div>
                  );
                }

                // Con descuento: precio + info de descuento a la derecha
                return (
                  <div className="flex items-end gap-3">
                    {/* Precio final */}
                    <div className="text-xl font-bold text-black leading-tight">
                      {currentPrice}
                    </div>

                    {/* Info de descuento a la derecha */}
                    <div className="flex flex-col items-start justify-end">
                      {/* Precio anterior tachado */}
                      <span className="text-xs line-through text-gray-500 leading-tight">
                        {currentOriginalPrice}
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
                if (isOutOfStock) {
                  stockNotification.openModal();
                } else {
                  handleAddToCart();
                }
              }}
              disabled={isLoading}
              className={cn(
                "flex-1 py-2 px-2 rounded-full text-xs lg:text-md font-semibold transition-colors cursor-pointer",
                "bg-black text-white hover:bg-gray-800",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                isLoading && "animate-pulse"
              )}
            >
              {isLoading ? (
                <Loader className="w-4 h-4 mx-auto animate-spin" />
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

          {/* Mensaje de cuotas sin interés */}
          <div className="mt-3 flex flex-col items-center gap-1">
            <p className="text-[9px] sm:text-[10px] md:text-xs lg:text-sm text-blue-600 font-bold whitespace-nowrap">
              Compra en 3 cuotas con 0% de interés{" "}
              <span className="text-[7px] sm:text-[8px] md:text-[9px] text-gray-500">
                Aplican T&C
              </span>
            </p>
            <div className="flex items-center gap-6 justify-center">
              <Image 
                src="https://res.cloudinary.com/dzi2p0pqa/image/upload/v1764206134/u4er5lsqxgktchsmzgun.png"
                alt="Cuotas"
                width={20}
                height={20}
                className="object-contain w-4 h-4 sm:w-5 sm:h-5 md:w-[27px] md:h-[27px]"
              />
              <Image 
                src="https://res.cloudinary.com/dzi2p0pqa/image/upload/v1764208738/6c915dfc-5191-4308-aeac-169cb3b6d79e.png"
                alt="Pago"
                width={20}
                height={20}
                className="object-contain w-4 h-4 sm:w-5 sm:h-5 md:w-[27px] md:h-[27px]"
              />
              <Image 
                src="https://res.cloudinary.com/dzi2p0pqa/image/upload/v1764208643/e602aa74-3a3c-4e3c-aacf-bd47d1f423d9.png"
                alt="Seguridad"
                width={20}
                height={20}
                className="object-contain w-4 h-4 sm:w-5 sm:h-5 md:w-[27px] md:h-[27px]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Modal de notificación de stock */}
      <StockNotificationModal
        isOpen={stockNotification.isModalOpen}
        onClose={stockNotification.closeModal}
        productName={displayName}
        productImage={previewImages && previewImages.length > 0 ? getCloudinaryUrl(previewImages[0], "catalog") : undefined}
        selectedColor={shouldRenderValue(selectedOption?.nombreColorProductSku) ? selectedOption?.nombreColorProductSku : undefined}
        selectedStorage={shouldRenderValue(selectedOption?.capacidadProductSku) ? selectedOption?.capacidadProductSku : undefined}
        onNotificationRequest={handleRequestStockNotification}
      />
    </div>
  );
}
