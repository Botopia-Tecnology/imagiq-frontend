import React from "react";
import type { ProductCardProps } from "@/app/productos/components/ProductCard";
import FlixmediaDetails from "@/components/FlixmediaDetails";

interface SpecificationsProps {
  product: ProductCardProps;
  selectedSku?: string;
  selectedEan?: string;
}

const Specifications: React.FC<SpecificationsProps> = ({ product, selectedSku, selectedEan }) => {
  // Usar datos del producto si están disponibles
  const skuToUse = selectedSku;
  const eanToUse = selectedEan;


  // --- VISUAL: UX mejorada, tabs y contenido ---
  return (
    <section
      id="especificaciones-section"
      className="w-full max-w-5xl mx-auto px-2 sm:px-4 md:px-8 py-4 md:py-6 mt-2 md:mt-4"
      aria-label="Especificaciones técnicas"
    >
      <FlixmediaDetails
          mpn={skuToUse}
          ean={eanToUse}
          productName={product.name}
          className="w-full"
        />
    </section>
  );
};

export default Specifications;
