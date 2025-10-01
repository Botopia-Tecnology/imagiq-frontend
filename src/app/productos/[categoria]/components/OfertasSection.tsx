/**
 * Componente para mostrar productos en oferta por sección
 */

"use client";
import React, { useMemo } from "react";
import ProductCard from "../../components/ProductCard";
import { useProducts } from "@/features/products/useProducts";
import LoadingSpinner from "@/components/LoadingSpinner";

// Mapeo de secciones a filtros de API
const ofertasFiltersMap: Record<string, { category?: string; subcategory?: string }> = {
  accesorios: { subcategory: "Accesorios" },
  "tv-monitores-audio": { category: "AV,IT" },
  "smartphones-tablets": { subcategory: "Celulares,Tablets" },
  electrodomesticos: { category: "DA" },
};

// Mapeo de secciones a títulos
const ofertasTitles: Record<string, string> = {
  accesorios: "Accesorios",
  "tv-monitores-audio": "TV, Monitores y Audio",
  "smartphones-tablets": "Smartphones y Tablets", 
  electrodomesticos: "Electrodomésticos",
};

interface OfertasSectionProps {
  seccion?: string | null;
}

export default function OfertasSection({ seccion }: OfertasSectionProps) {
  // Memoizar los filtros para evitar recreaciones innecesarias
  const initialFilters = useMemo(() => {
    const baseFilters = { withDiscount: true };
    
    if (seccion && ofertasFiltersMap[seccion]) {
      const sectionFilters = ofertasFiltersMap[seccion];
      return {
        ...baseFilters,
        ...sectionFilters,
      };
    }
    
    return baseFilters;
  }, [seccion]);

  // Usar el hook de productos con filtro de ofertas
  const { 
    products, 
    loading, 
    error, 
    refreshProducts 
  } = useProducts(initialFilters);

  if (loading) {
    return (
      <div className="container mx-auto px-6 py-8">
        <div className="flex justify-center items-center min-h-[400px]">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-6 py-8">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error al cargar ofertas</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={refreshProducts}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  const sectionTitle = seccion ? ofertasTitles[seccion] : "Ofertas Samsung";

  return (
    <div className="container mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">
        {sectionTitle}
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-8">
        {products.length === 0 ? (
          <div className="col-span-3 text-center text-gray-500 text-lg">
            Vuelve pronto y encuentra las mejores ofertas
          </div>
        ) : (
          products.map((producto) => (
            <ProductCard key={producto.id} {...producto} />
          ))
        )}
      </div>
    </div>
  );
}
