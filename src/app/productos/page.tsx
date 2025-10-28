"use client";

import { useState, useMemo, useCallback, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useProducts } from "@/features/products/useProducts";
import FilterSidebar, {
  FilterConfig,
  FilterState,
} from "./components/FilterSidebar";
import ProductCard, { ProductCardProps } from "./components/ProductCard";
import LoadingSpinner from "@/components/LoadingSpinner";
import Pagination from "./dispositivos-moviles/components/Pagination";
import ItemsPerPageSelector from "./dispositivos-moviles/components/ItemsPerPageSelector";
import HeaderSection from "./[categoria]/components/HeaderSection";

// Configuración de filtros (puedes personalizar según la categoría)
const filterConfig: FilterConfig = {
  color: [
    "Negro",
    "Blanco",
    "Azul",
    "Rojo",
    "Verde",
    "Gris",
    "Dorado",
    "Plateado",
    "Rosa",
    "Morado",
    "Amarillo",
    "Naranja",
  ],
  // Puedes agregar más filtros aquí
};

function filterProducts(products: ProductCardProps[], filters: FilterState) {
  const matchesColor = (product: ProductCardProps, colorValue: string) => {
    return Array.isArray(product.colors) &&
      product.colors.some((c: { label: string }) =>
        c.label.trim().toLowerCase() === colorValue.trim().toLowerCase()
      );
  };

  const matchesStringValue = (value: string, searchValue: string) => {
    return value.toLowerCase().includes(searchValue.toLowerCase());
  };

  const matchesArrayValue = (value: string[], searchValue: string) => {
    return value.some((item) =>
      typeof item === "string" && item.toLowerCase() === searchValue.toLowerCase()
    );
  };

  return products.filter((product) => {
    return Object.entries(filters).every(([filterKey, values]) => {
      if (!values.length) return true;
      // Filtrado por color
      if (filterKey === "color") {
        return values.some((v) => matchesColor(product, v));
      }
      // Filtrado por nombre
      if (filterKey === "nombre" || filterKey === "name") {
        return values.some((v) => matchesStringValue(product.name, v));
      }
      // Filtrado genérico por cualquier campo string o array de strings
      if (Object.hasOwn(product, filterKey)) {
        const value = (product as unknown as Record<string, unknown>)[filterKey];
        if (typeof value === "string") {
          return values.some((v) => matchesStringValue(value, v));
        }
        if (Array.isArray(value)) {
          return values.some((v) => matchesArrayValue(value as string[], v));
        }
      }
      return true;
    });
  });
}

function ProductosContent() {
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState<FilterState>({});
  const [expandedFilters, setExpandedFilters] = useState<Set<string>>(
    new Set(["color"])
  );

  // Estados para paginación
  const [itemsPerPage, setItemsPerPage] = useState(15);

  // Estados para vista y ordenamiento
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("precio-mayor"); // Por defecto: precio mayor a menor

  // Obtener parámetro de búsqueda de la URL
  const searchQuery = searchParams?.get("q");

  // Memoizar los filtros para evitar recargas continuas
  const initialFilters = useMemo(() => {
    // Si hay búsqueda, no cargar productos inicialmente
    if (searchQuery) {
      return null;
    }
    return { page: 1, limit: itemsPerPage };
  }, [searchQuery, itemsPerPage]);

  // Usar el hook de productos con API real
  const {
    products,
    loading,
    error,
    totalItems,
    totalPages,
    currentPage: hookCurrentPage,
    refreshProducts,
    searchProducts,
    goToPage
  } = useProducts(initialFilters);

  // Ejecutar búsqueda cuando hay searchQuery
  useEffect(() => {
    if (searchQuery) {
      searchProducts(searchQuery, 1);
    }
  }, [searchQuery, searchProducts]);

  // Handler para cambio de ordenamiento
  const handleSortChange = useCallback((newSortBy: string) => {
    setSortBy(newSortBy);
    
    if (searchQuery) {
      // Si estamos en modo búsqueda, hacer nueva búsqueda sin ordenamiento
      searchProducts(searchQuery, 1);
    }
    // Si no estamos en modo búsqueda, el ordenamiento se aplica localmente
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [searchQuery, searchProducts]);

  // Filtrado funcional y robusto (combinando API filters con UI filters)
  const filteredProducts = useMemo(
    () => filterProducts(products, filters),
    [products, filters]
  );

  // Aplicar ordenamiento local solo cuando NO hay búsqueda (para productos normales)
  const sortedProducts = useMemo(() => {
    if (searchQuery) {
      // En modo búsqueda, los productos ya vienen ordenados de la API
      return filteredProducts;
    }
    
    // Para productos normales, aplicar ordenamiento local
    if (!sortBy) return filteredProducts;
    
    const sorted = [...filteredProducts];
    
    switch (sortBy) {
      case "precio-menor":
        return sorted.sort((a, b) => {
          const priceA = Number.parseFloat(a.price || "0");
          const priceB = Number.parseFloat(b.price || "0");
          return priceA - priceB;
        });
      case "precio-mayor":
        return sorted.sort((a, b) => {
          const priceA = Number.parseFloat(a.price || "0");
          const priceB = Number.parseFloat(b.price || "0");
          return priceB - priceA;
        });
      case "nombre":
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      default:
        return sorted;
    }
  }, [filteredProducts, sortBy, searchQuery]);

  // UX: contador de resultados
  const resultCount = sortedProducts.length;

  // Compute grid classes
  const gridClasses = useMemo(() => {
    if (viewMode === "list") return "grid-cols-1";
    if (searchQuery) return "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4";
    return "grid-cols-1 sm:grid-cols-2 md:grid-cols-3";
  }, [viewMode, searchQuery]);

  // Handlers para paginación
  const handlePageChange = useCallback((page: number) => {
    goToPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [goToPage]);

  const handleItemsPerPageChange = useCallback((items: number) => {
    setItemsPerPage(items);
    // Si estamos en modo búsqueda, mantener la búsqueda pero ir a página 1
    if (searchQuery) {
      searchProducts(searchQuery, 1);
    } else {
      goToPage(1);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [searchQuery, searchProducts, goToPage]);

  // UX: animación de scroll al filtrar
  function handleFilterChange(
    filterType: string,
    value: string,
    checked: boolean
  ) {
    setFilters((prev) => ({
      ...prev,
      [filterType]: checked
        ? [...(prev[filterType] || []), value]
        : (prev[filterType] || []).filter((item) => item !== value),
    }));
    // Resetear a página 1 al filtrar (solo para filtros UI, no para búsquedas)
    if (!searchQuery) {
      goToPage(1);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleToggleFilter(filterKey: string) {
    const newExpanded = new Set(expandedFilters);
    if (newExpanded.has(filterKey)) {
      newExpanded.delete(filterKey);
    } else {
      newExpanded.add(filterKey);
    }
    setExpandedFilters(newExpanded);
  }

  if (loading && products.length === 0) {
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
    );
  }

  return (
    <div className={searchQuery ? "w-full px-6 py-8" : "container mx-auto px-6 py-8"}>
      {/* HeaderSection con controles de ordenamiento y vista */}
      <HeaderSection
        title={searchQuery ? `Resultados para "${searchQuery}"` : "Productos Samsung"}
        totalItems={resultCount}
        sortBy={sortBy}
        setSortBy={handleSortChange}
        viewMode={viewMode}
        setViewMode={setViewMode}
        onShowMobileFilters={() => {}} // No hay filtros móviles en esta página
        filters={filters}
        setFilters={setFilters}
        clearAllFiltersText="Ver todos los productos"
      />

      <div className={searchQuery ? "" : "flex gap-8"}>
        {/* Panel de filtros - solo mostrar cuando NO hay búsqueda */}
        {!searchQuery && (
          <aside className="hidden lg:block w-80 flex-shrink-0">
            <FilterSidebar
              filterConfig={filterConfig}
              filters={filters}
              onFilterChange={handleFilterChange}
              resultCount={resultCount}
              expandedFilters={expandedFilters}
              onToggleFilter={handleToggleFilter}
            />
          </aside>
        )}
        <main className={searchQuery ? "w-full" : "flex-1"}>
          {loading && products.length > 0 && (
            <div className="mb-4 flex justify-center">
              <LoadingSpinner />
            </div>
          )}

          <div className={searchQuery ? "" : "flex gap-6"}>
            {/* Grid de productos usando ProductCard avanzado */}
            <div className={searchQuery ? "w-full" : "flex-1"}>
              {sortedProducts.length > 0 ? (
                <>
                  <div className={`grid gap-4 md:gap-5 lg:gap-6 justify-items-center ${gridClasses}`}>
                    {sortedProducts.map((product) => (
                      <ProductCard
                        key={product.id}
                        id={product.id}
                        name={product.name}
                        image={product.image}
                        colors={product.colors}
                        capacities={product.capacities}
                        price={product.price}
                        originalPrice={product.originalPrice}
                        discount={product.discount}
                        isFavorite={product.isFavorite}
                        onToggleFavorite={product.onToggleFavorite}
                        puntos_q={product.puntos_q}
                        stock={product.stock}
                        segmento={product.segmento}
                        apiProduct={product.apiProduct}
                      />
                    ))}
                  </div>
              
                  {/* Paginación */}
                  {!error && products.length > 0 && (
                    <div className="mt-8">
                      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
                        <ItemsPerPageSelector
                          itemsPerPage={itemsPerPage}
                          onItemsPerPageChange={handleItemsPerPageChange}
                        />
                      </div>
                      <Pagination
                        currentPage={hookCurrentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                        totalItems={totalItems}
                        itemsPerPage={itemsPerPage}
                      />
                    </div>
                  )}
                </>
              ) : (
                <div className="col-span-full text-center py-12 text-gray-500">
                  {searchQuery
                    ? `No se encontraron productos para "${searchQuery}"`
                    : "No se encontraron productos con los filtros seleccionados."
                  }
                </div>
              )}
            </div>

            {/* Banner promocional vertical - Solo visible cuando hay productos y no hay búsqueda */}
            {!searchQuery && sortedProducts.length >= 4 && (
              <aside className="hidden lg:block w-64 flex-shrink-0">
                <div className="sticky top-4">
                  <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl p-6 min-h-[600px] flex flex-col items-center justify-center text-white shadow-lg">
                    <h3 className="text-2xl font-bold mb-4 text-center">¡Oferta Especial!</h3>
                    <p className="text-center mb-6">Descuentos exclusivos en productos seleccionados</p>
                    <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                      Ver Promociones
                    </button>
                  </div>
                </div>
              </aside>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

// Componente de loading para el Suspense boundary
function ProductosPageLoading() {
  return (
    <div className="container mx-auto px-6 py-8">
      <div className="flex justify-center items-center min-h-[400px]">
        <LoadingSpinner />
      </div>
    </div>
  );
}

export default function ProductosPage() {
  return (
    <Suspense fallback={<ProductosPageLoading />}>
      <ProductosContent />
    </Suspense>
  );
}
