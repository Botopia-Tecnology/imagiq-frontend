"use client";

import { useState, useMemo, useCallback, Suspense } from "react";
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
  return products.filter((product) => {
    return Object.entries(filters).every(([filterKey, values]) => {
      if (!values.length) return true;
      // Filtrado por color
      if (filterKey === "color") {
        return (
          Array.isArray(product.colors) &&
          values.some((v) =>
            product.colors!.some(
              (c: { label: string }) =>
                c.label.trim().toLowerCase() === v.trim().toLowerCase()
            )
          )
        );
      }
      // Filtrado por nombre
      if (filterKey === "nombre" || filterKey === "name") {
        return values.some((v) =>
          product.name.toLowerCase().includes(v.toLowerCase())
        );
      }
      // Filtrado genérico por cualquier campo string o array de strings
      if (Object.hasOwn(product, filterKey)) {
        const value = (product as unknown as Record<string, unknown>)[
          filterKey
        ];
        if (typeof value === "string") {
          return values.some((v) =>
            value.toLowerCase().includes(v.toLowerCase())
          );
        }
        if (Array.isArray(value)) {
          // Array de strings
          return values.some((v) =>
            (value as string[]).some(
              (item) =>
                typeof item === "string" &&
                item.toLowerCase() === v.toLowerCase()
            )
          );
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
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(15);

  // Obtener parámetro de búsqueda de la URL
  const searchQuery = searchParams?.get("q");

  // Memoizar los filtros para evitar recargas continuas
  const initialFilters = useMemo(() => {
    if (searchQuery) {
      // Búsqueda avanzada con filterMode=OR en múltiples campos
      return {
        name: searchQuery,
        descriptionKeyword: searchQuery,
        model: searchQuery,
        filterMode: "OR" as const,
        page: currentPage,
        limit: itemsPerPage
      };
    }
    return { page: currentPage, limit: itemsPerPage };
  }, [searchQuery, currentPage, itemsPerPage]);

  // Usar el hook de productos con API real y filtro de búsqueda
  const { 
    products, 
    loading, 
    error, 
    totalItems, 
    totalPages,
    refreshProducts 
  } = useProducts(initialFilters);

  // Filtrado funcional y robusto (combinando API filters con UI filters)
  const filteredProducts = useMemo(
    () => filterProducts(products, filters),
    [products, filters]
  );

  // UX: contador de resultados
  const resultCount = filteredProducts.length;

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
    setCurrentPage(1); // Resetear a página 1 al filtrar
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
    <div className="container mx-auto px-6 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">
          {searchQuery ? `Resultados para "${searchQuery}"` : "Productos Samsung"}
        </h1>
        <div className="text-sm text-gray-600">
          {totalItems > 0 && (
            <span>
              {totalItems} productos encontrados
            </span>
          )}
        </div>
      </div>

      <div className="flex gap-8">
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
        <main className={searchQuery ? "w-full max-w-7xl mx-auto" : "flex-1"}>
          {loading && products.length > 0 && (
            <div className="mb-4 flex justify-center">
              <LoadingSpinner />
            </div>
          )}
          
          {/* Grid de productos usando ProductCard avanzado */}
          {filteredProducts.length > 0 ? (
            <>
              <div className={`grid gap-6 ${searchQuery ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"}`}>
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    id={product.id}
                    name={product.name}
                    image={product.image}
                    colors={product.colors}
                    price={product.price}
                    originalPrice={product.originalPrice}
                    discount={product.discount}
                    isNew={product.isNew}
                    isFavorite={product.isFavorite}
                    onToggleFavorite={product.onToggleFavorite}
                    sku={product.sku}
                    puntos_q={product.puntos_q}
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
                    currentPage={currentPage}
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
