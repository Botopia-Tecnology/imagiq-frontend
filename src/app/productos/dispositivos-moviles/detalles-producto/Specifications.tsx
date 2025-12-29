import React, { useMemo } from "react";
import type { ProductCardProps } from "@/app/productos/components/ProductCard";
import FlixmediaDetails from "@/components/FlixmediaDetails";

interface SpecificationsProps {
  product: ProductCardProps;
  flix?: ProductCardProps;
  selectedSku?: string;
}

/**
 * Componente de Especificaciones
 * 
 * Renderiza las especificaciones técnicas del producto usando FlixmediaDetails.
 * Los datos reales se cargan dinámicamente desde Flixmedia.
 * 
 * SOLO usa skuflixmedia - sin EANs para evitar duplicados
 */

const Specifications: React.FC<SpecificationsProps> = ({ product, flix, selectedSku }) => {
  // Obtener SOLO el skuflixmedia - sin EANs
  const productSku = useMemo(() => {
    // Prioridad: flix.skuflixmedia > flix.apiProduct.skuflixmedia > product.skuflixmedia > product.apiProduct.skuflixmedia > selectedSku
    const flixSkuMedia = flix?.skuflixmedia ||
      flix?.apiProduct?.skuflixmedia?.[0] ||
      product.skuflixmedia ||
      product.apiProduct?.skuflixmedia?.[0] ||
      selectedSku;

    return flixSkuMedia?.trim() || null;
  }, [
    product.skuflixmedia,
    product.apiProduct?.skuflixmedia,
    selectedSku,
    flix?.skuflixmedia,
    flix?.apiProduct?.skuflixmedia
  ]);

  // Renderizar FlixmediaDetails SOLO con SKU (sin EAN)
  return (
    <section
      id="especificaciones-section"
      className="w-full max-w-5xl mx-auto px-2 sm:px-4 md:px-8 py-4 md:py-6 mt-2 md:mt-4"
      aria-label="Especificaciones técnicas"
    >
      {productSku && (
        <FlixmediaDetails
          key={`flix-specs-${productSku}`}
          mpn={productSku}
          className="w-full"
        />
      )}
      {!productSku && (
        <div className="text-center text-gray-500 py-8">
          No hay especificaciones disponibles para este producto.
        </div>
      )}
    </section>
  );
};

export default Specifications;
