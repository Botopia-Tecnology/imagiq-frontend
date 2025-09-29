"use client";

import { useState, useMemo, useCallback, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { useProducts } from "@/features/products/useProducts";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useDeviceType } from "@/components/responsive";
import { cn } from "@/lib/utils";
import CategoryProductsGrid from "./dispositivos-moviles/components/ProductsGrid";
import HeaderSection from "./dispositivos-moviles/components/HeaderSection";
import Pagination from "./dispositivos-moviles/components/Pagination";
import ItemsPerPageSelector from "./dispositivos-moviles/components/ItemsPerPageSelector";

// Sin configuración de filtros ya que no tenemos sidebar

function ProductosContent() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("q") || "";
  
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("relevancia");
  
  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(15);

  // Ref para productos
  const productsRef = useRef<HTMLDivElement>(null);

  // Configurar filtros iniciales basados en la búsqueda
  const initialFilters = useMemo(() => {
    const baseFilters: any = {
      page: currentPage,
      limit: itemsPerPage,
    };
    
    if (searchQuery) {
      baseFilters.searchQuery = searchQuery; // Usa tanto nombre como desDetallada con OR
    }
    
    return baseFilters;
  }, [searchQuery, currentPage, itemsPerPage]);

  // Usar el hook de productos con API real
  const { products, loading, error, totalItems, totalPages, refreshProducts } =
    useProducts(initialFilters);

  // Sin filtrado adicional, usamos directamente los productos de la API

  const device = useDeviceType();

  // No hay efectos de reset ya que no tenemos sidebar de filtros

  // Sin funciones de filtro ya que no tenemos sidebar

  // Controladores de paginación
  const handlePageChange = useCallback(async (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 200, behavior: "smooth" });
  }, []);

  const handleItemsPerPageChange = useCallback(async (items: number) => {
    setItemsPerPage(items);
    setCurrentPage(1);
    window.scrollTo({ top: 200, behavior: "smooth" });
  }, []);


  // Header (NO sticky): va en el flujo normal
  const HeaderSectionMemo = useMemo(
    () => (
      <HeaderSection
        title="Productos Samsung"
        totalItems={totalItems}
        sortBy={sortBy}
        setSortBy={setSortBy}
        viewMode={viewMode}
        setViewMode={setViewMode}
        onShowMobileFilters={() => {}}
        filters={{}}
        setFilters={() => {}}
        clearAllFiltersText="Ver todos los productos"
      />
    ),
    [totalItems, sortBy, viewMode]
  );

  if (loading && products.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        {HeaderSectionMemo}
        <div className="container mx-auto px-6 py-8">
          <div className="flex justify-center items-center min-h-[400px]">
            <LoadingSpinner />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white">
        {HeaderSectionMemo}
        <div className="container mx-auto px-6 py-8">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-red-600 mb-4">
              Error al cargar productos
            </h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={refreshProducts}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header de la lista (no sticky) */}
      {HeaderSectionMemo}

      {/* Contenido */}
      <div
        className={cn(
          "container mx-auto px-6 py-8",
          device === "mobile" && "px-5 py-4",
          device === "tablet" && "px-4 py-6"
        )}
      >
        {/* Sin sidebar de filtros - diseño centrado */}
        <CategoryProductsGrid
          ref={productsRef}
          products={products}
          loading={loading}
          error={error}
          refreshProducts={refreshProducts}
          viewMode={viewMode}
          categoryName="productos"
        />

        {!loading && !error && totalItems > 0 && (
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
    </div>
  );
}

export default function ProductosPage() {
  return (
    <ProductosContent />
  );
}
