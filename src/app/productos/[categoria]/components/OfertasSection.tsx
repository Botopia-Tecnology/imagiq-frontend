/**
 * Componente para mostrar productos en oferta por sección
 */

"use client";
import React, { useMemo, useState, useCallback } from "react";
import ProductCard from "../../components/ProductCard";
import BundleCard from "../../components/BundleCard";
import { useProducts } from "@/features/products/useProducts";
import LoadingSpinner from "@/components/LoadingSpinner";
import ItemsPerPageSelector from "../../electrodomesticos/components/ItemsPerPageSelector";
import Pagination from "../../electrodomesticos/components/Pagination";
import Banner from "@/components/Banner";
import { OFERTAS_BANNERS_MAP } from "@/config/banners";
import type { MixedProductItem } from "@/lib/productMapper";

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
  // Estados para paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(50);

  // Memoizar los filtros para evitar recreaciones innecesarias
  const initialFilters = useMemo(() => {
    const baseFilters = { 
      withDiscount: true,
      page: currentPage,
      limit: itemsPerPage,
      sortBy: 'precio',
      sortOrder:'desc',
      precioMin: 1,
    };
    
    if (seccion && ofertasFiltersMap[seccion]) {
      const sectionFilters = ofertasFiltersMap[seccion];
      return {
        ...baseFilters,
        ...sectionFilters,
      };
    }
    
    return baseFilters;
  }, [seccion, currentPage, itemsPerPage]);

  // Usar el hook de productos con filtro de ofertas
  const { 
    products, 
    bundles,
    orderedItems,
    loading, 
    error, 
    totalItems,
    totalPages,
    refreshProducts 
  } = useProducts(initialFilters);

  // Handlers para paginación
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleItemsPerPageChange = useCallback((items: number) => {
    setItemsPerPage(items);
    setCurrentPage(1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

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

  // Obtener el banner para esta sección
  const bannerConfig = seccion ? OFERTAS_BANNERS_MAP[seccion] : null;

  return (
    <div className="container mx-auto px-4 md:px-8 lg:px-12 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">
        {sectionTitle}
      </h1>

      {/* Banner promocional */}
      {bannerConfig && <Banner config={bannerConfig} className="mb-10 max-w-7xl mx-auto" />}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-8">
        {orderedItems.length === 0 ? (
          <div className="col-span-3 text-center text-gray-500 text-lg py-4">
            Vuelve pronto y encuentra las mejores ofertas
          </div>
        ) : (
          orderedItems.map((item: MixedProductItem) => {
            if (item.itemType === 'bundle') {
              // Renderizar BundleCard para bundles
              const { itemType, ...bundleProps } = item;
              return (
                <BundleCard 
                  key={bundleProps.id} 
                  {...bundleProps}
                />
              );
            } else {
              // Renderizar ProductCard para productos
              const { itemType, ...productProps } = item;
              return (
                <ProductCard 
                  key={productProps.id} 
                  {...productProps}
                />
              );
            }
          })
        )}
      </div>

      {/* Paginación */}
      {!error && orderedItems.length > 0 && (
        <div className="mt-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
            <ItemsPerPageSelector
              itemsPerPage={itemsPerPage}
              onItemsPerPageChange={handleItemsPerPageChange}
            />
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
          />
        </div>
      )}
    </div>
  );
}
