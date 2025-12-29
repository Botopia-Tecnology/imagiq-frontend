import React, { useMemo, useState, useEffect } from "react";
import type { ProductCardProps } from "@/app/productos/components/ProductCard";
import FlixmediaDetails from "@/components/FlixmediaDetails";
import { generateMpnVariants } from "@/lib/flixmedia";

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
 * Si no hay contenido disponible, no renderiza nada (sin espacio en blanco)
 */

const Specifications: React.FC<SpecificationsProps> = ({ product, flix, selectedSku }) => {
  // null = verificando, true = hay contenido, false = no hay contenido
  const [hasContent, setHasContent] = useState<boolean | null>(null);
  // MPN que encontró contenido
  const [validMpn, setValidMpn] = useState<string | null>(null);

  // Obtener SOLO el skuflixmedia - sin EANs
  const productSku = useMemo(() => {
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

  // Verificar si hay contenido de Flixmedia disponible
  useEffect(() => {
    if (!productSku) {
      setHasContent(false);
      setValidMpn(null);
      return;
    }

    let isMounted = true;
    setHasContent(null); // Reset a verificando

    const checkContent = async () => {
      const mpnVariants = generateMpnVariants(productSku);
      
      for (const variant of mpnVariants) {
        if (!isMounted) return;
        
        try {
          const matchUrl = `https://media.flixcar.com/delivery/webcall/match/17257/f5/mpn/${encodeURIComponent(variant)}`;
          const response = await fetch(matchUrl);
          
          if (response.ok) {
            const data = await response.json();
            if (data.event === 'matchhit') {
              if (isMounted) {
                setHasContent(true);
                setValidMpn(variant); // Guardar el MPN que funcionó
              }
              return;
            }
          }
        } catch {
          // Continuar con siguiente variante
        }
      }
      
      // No se encontró contenido con ninguna variante
      if (isMounted) {
        setHasContent(false);
        setValidMpn(null);
      }
    };

    checkContent();

    return () => {
      isMounted = false;
    };
  }, [productSku]);

  // No renderizar nada si:
  // - No hay SKU
  // - No hay contenido (false) - confirmado que no existe
  if (!productSku || hasContent === false) {
    return null;
  }

  // Si está verificando (null) o hay contenido (true), renderizar
  // El FlixmediaDetails maneja su propio loading state
  return (
    <section
      id="especificaciones-section"
      className="w-full max-w-5xl mx-auto px-2 sm:px-4 md:px-8 py-4 md:py-6"
      aria-label="Especificaciones técnicas"
    >
      {validMpn ? (
        <FlixmediaDetails
          key={`flix-specs-${validMpn}`}
          mpn={validMpn}
          className="w-full"
        />
      ) : (
        <div className="w-full h-40 flex items-center justify-center">
          <div className="animate-pulse text-gray-400">
            Cargando especificaciones...
          </div>
        </div>
      )}
    </section>
  );
};

export default Specifications;
