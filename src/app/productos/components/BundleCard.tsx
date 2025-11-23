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
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { posthogUtils } from "@/lib/posthogClient";
import { getCloudinaryUrl } from "@/lib/cloudinary";
import { calculateSavings } from "./utils/productCardHelpers";
import type { BundleCardProps } from "@/lib/productMapper";

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

  const handleAddToCart = () => {
    // TODO: Implementar lógica para agregar bundle al carrito (próximamente)
    posthogUtils.capture("bundle_add_to_cart_click", {
      bundle_id: id,
      bundle_name: name,
      product_sku: selectedOption?.product_sku,
      skus_bundle,
      selected_option_index: selectedOptionIndex,
      selected_modelo: selectedOption?.modelo,
      source: "bundle_card",
    });
  };

  // Nombre dinámico: usar el modelo de la opción seleccionada o el nombre del bundle
  const displayName = selectedOption?.modelo || name;

  return (
    <div
      className={cn(
        "rounded-lg w-full h-full flex flex-col mx-auto",
        className
      )}
    >
      {/* Sección de imágenes del bundle - overflow visible para que las imágenes se "salgan" */}
      <div className="relative aspect-square bg-gray-100 rounded-lg overflow-visible">
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
              className="w-full text-left bg-transparent p-0 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-black text-black"
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
              </div>
            )}
        </div>

        {/* Selector de variantes del bundle */}
        {opciones && opciones.length > 1 && (
          <div className="px-3">
            <div className="flex flex-wrap gap-1.5">
              {opciones.map((opcion, index) => (
                <button
                  key={opcion.product_sku}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedOptionIndex(index);
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
        )}

        {/* Vigencia del bundle */}
        {fecha_inicio && fecha_final && (
          <div className="px-3">
            <p className="text-xs font-semibold whitespace-nowrap text-blue-600 leading-tight">
              Oferta válida hasta: {new Date(fecha_final).toLocaleDateString('es-CO')}
            </p>
          </div>
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
                  // if (process.env.NEXT_PUBLIC_MAINTENANCE_MODE === "true" || isOutOfStock) {
                  //   stockNotification.openModal();
                  // } else {
                    handleAddToCart();
                  //}
                }}
                //disabled={isLoading}
                className={cn(
                  "flex-1 bg-black text-white py-2 px-2 rounded-full text-xs lg:text-md font-semibold",
                  "hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors",
                 // isLoading && "animate-pulse"
                )}
              >
                Añadir al carrito
                {/* {isLoading ? (
                  <Loader className="w-4 h-4 mx-auto" />
                ) : process.env.NEXT_PUBLIC_MAINTENANCE_MODE === "true" ? (
                  "Notifícame"
                ) : isOutOfStock ? (
                  "Notifícame"
                ) : (
                  "Añadir al carrito"
                )} */}
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleMoreInfo();
                }}
                className="text-black text-sm font-medium hover:underline transition-all whitespace-nowrap"
              >
                Más información
              </button>
            </div>
        </div>
      </div>
    </div>
  );
}
