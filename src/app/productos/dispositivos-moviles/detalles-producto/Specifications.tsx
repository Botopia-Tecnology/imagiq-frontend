import React, { useMemo, useState, useEffect, useRef } from "react";
import type { ProductCardProps } from "@/app/productos/components/ProductCard";
import FlixmediaDetails from "@/components/FlixmediaDetails";
import { usePathname } from "next/navigation";

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
 * Si no hay contenido disponible, FlixmediaDetails se oculta automáticamente.
 */

const Specifications: React.FC<SpecificationsProps> = ({ product, flix, selectedSku }) => {
  const pathname = usePathname();
  const [mountKey, setMountKey] = useState(() => Date.now());
  const previousPathnameRef = useRef(pathname);
  const previousProductIdRef = useRef(product.id);
  const [hasFlixError, setHasFlixError] = useState(false);

  // Detectar cambios de ruta para forzar re-montaje
  useEffect(() => {
    if (pathname !== previousPathnameRef.current) {
      previousPathnameRef.current = pathname;
      setHasFlixError(false);
      setMountKey(Date.now());
    }
  }, [pathname]);

  // Detectar cambios de producto
  useEffect(() => {
    if (product.id !== previousProductIdRef.current) {
      previousProductIdRef.current = product.id;
      setHasFlixError(false);
      setMountKey(Date.now());
    }
  }, [product.id]);

  // Obtener el SKU para Flixmedia
  const productSku = useMemo(() => {
    const flixSkuMedia = flix?.skuflixmedia ||
      flix?.apiProduct?.skuflixmedia?.[0] ||
      product.skuflixmedia ||
      product.apiProduct?.skuflixmedia?.[0] ||
      selectedSku;

    const fallbackSku = product.apiProduct?.sku?.[0] ||
      product.colors?.[0]?.sku ||
      flix?.apiProduct?.sku?.[0];

    return flixSkuMedia?.trim() || fallbackSku?.trim() || null;
  }, [
    product.skuflixmedia,
    product.apiProduct?.skuflixmedia,
    product.apiProduct?.sku,
    product.colors,
    selectedSku,
    flix?.skuflixmedia,
    flix?.apiProduct?.skuflixmedia,
    flix?.apiProduct?.sku,
  ]);

  // Si no hay SKU o hubo error, no renderizar
  if (!productSku || hasFlixError) {
    return null;
  }

  return (
    <section
      id="especificaciones-section"
      className="w-full max-w-5xl mx-auto px-2 sm:px-4 md:px-8 py-4 md:py-6"
      aria-label="Especificaciones técnicas"
    >
      <FlixmediaDetails
        key={`flix-specs-${productSku}-${mountKey}`}
        mpn={productSku}
        className="w-full"
        onError={() => setHasFlixError(true)}
      />
    </section>
  );
};

export default Specifications;
