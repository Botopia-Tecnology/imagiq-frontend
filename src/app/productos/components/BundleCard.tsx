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
import { useRouter } from "next/navigation";
import Image, { StaticImageData } from "next/image";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { posthogUtils } from "@/lib/posthogClient";
import { getCloudinaryUrl } from "@/lib/cloudinary";
import { useCloudinaryImage } from "@/hooks/useCloudinaryImage";
import { calculateSavings } from "./utils/productCardHelpers";
import { motion } from "framer-motion";
import type { BundleCardProps } from "@/lib/productMapper";

export default function BundleCard({
  id,
  name,
  image,
  price,
  originalPrice,
  discount,
  skus_bundle,
  categoria,
  menu,
  submenu,
  fecha_inicio,
  fecha_final,
  className,
}: BundleCardProps & { className?: string }) {
  const router = useRouter();
  const [currentImageIndex] = useState(0);

  // Simular múltiples imágenes para el carrusel (en una implementación real, vendrían del backend)
  const bundleImages = useMemo(
    () => [image, image, image],
    [image]
  );

  // Aplicar transformación de Cloudinary a todas las imágenes del carrusel
  const transformedImages = useMemo(() => {
    const transformed = bundleImages.map((img) => {
      const imgSrc = typeof img === "string" ? img : img?.src;
      return getCloudinaryUrl(imgSrc, "catalog");
    });

    return transformed;
  }, [bundleImages]);

  const handleMoreInfo = () => {
    // TODO: Navegar a página de detalle del bundle (próximamente)
    // Por ahora, solo registrar el evento
    posthogUtils.capture("bundle_more_info_click", {
      bundle_id: id,
      bundle_name: name,
      source: "bundle_card",
      skus_bundle,
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
      skus_bundle,
      source: "bundle_card",
    });
  };

  // Handler para el click en la card completa
  const handleCardClick = (e: React.MouseEvent | React.KeyboardEvent) => {
    const target = e.target as HTMLElement;

    // Verificar si el click fue en un botón o dentro de un botón
    const isButton = target.closest("button") !== null;
    const isCheckbox = target.closest('input[type="checkbox"]') !== null;

    // Si NO es un botón ni checkbox, navegar a más info
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
    <motion.div
      role="button"
      onClick={handleCardClick}
      onKeyDown={handleCardKeyDown}
      tabIndex={0}
      aria-label={`Ver detalles de ${name}`}
      whileHover={{
        scale: 1.02,
        transition: { duration: 0.2, ease: [0.25, 0.1, 0.25, 1] },
      }}
      className={cn(
        "cursor-pointer transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-lg w-full max-w-[350px] mx-auto",
        className
      )}
    >
      {/* Sección de imagen con carrusel */}
      <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
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
      </div>

      {/* Contenido del bundle */}
      <div className="py-2 space-y-2">
        {/* Título del bundle */}
        <div className="px-3 min-h-[48px]">
          <h3 className="text-base font-bold line-clamp-2 text-black">
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                handleMoreInfo();
              }}
              className="w-full text-left bg-transparent p-0 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-black text-black"
            >
              {name}
            </button>
          </h3>

          {/* Info de productos incluidos */}
          <p className="text-xs text-gray-500 mt-1">
            {skus_bundle.length} {skus_bundle.length === 1 ? 'producto incluido' : 'productos incluidos'}
          </p>
        </div>

        {/* Vigencia del bundle */}
        {fecha_inicio && fecha_final && (
          <div className="px-3">
            <p className="text-xs font-semibold whitespace-nowrap text-blue-600 leading-tight">
              Oferta válida hasta: {new Date(fecha_final).toLocaleDateString('es-CO')}
            </p>
          </div>
        )}

        {/* Precio */}
        <div className="px-3 space-y-3 mt-2">
          {price && (
            <div className="space-y-1 min-h-[32px]">
              {(() => {
                const { hasSavings, savings } = calculateSavings(
                  price,
                  originalPrice
                );

                if (!hasSavings) {
                  // Sin descuento: solo precio
                  return (
                    <div className="text-xl font-bold text-black">
                      {price}
                    </div>
                  );
                }

                // Con descuento: precio + info de descuento a la derecha
                return (
                  <div className="flex items-end gap-3">
                    {/* Precio final */}
                    <div className="text-xl font-bold text-black leading-tight">
                      {price}
                    </div>

                    {/* Info de descuento a la derecha */}
                    <div className="flex flex-col items-start justify-end">
                      {/* Precio anterior tachado */}
                      <span className="text-xs line-through text-gray-500 leading-tight">
                        {originalPrice}
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
    </motion.div>
  );
}
