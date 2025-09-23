"use client";

import { Suspense, useState, useMemo } from "react";
import { useProducts } from "@/features/products/useProducts";
import FilterSidebar, {
  FilterConfig,
  FilterState,
} from "./components/FilterSidebar";
import ProductGrid from "./components/ProductGrid";
import { ProductCardProps } from "./components/ProductCard";
import LoadingSpinner from "@/components/LoadingSpinner";

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
      if (Object.prototype.hasOwnProperty.call(product, filterKey)) {
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
  const [filters, setFilters] = useState<FilterState>({});
  const [expandedFilters, setExpandedFilters] = useState<Set<string>>(
    new Set(["color"])
  );

  // Usar el hook de productos con API real
  const { products, loading, error, totalItems, refreshProducts } =
    useProducts();

  // Filtrado funcional y robusto (combinando API filters con UI filters)
  const filteredProducts = useMemo(
    () => filterProducts(products, filters),
    [products, filters]
  );

  // UX: contador de resultados
  const resultCount = filteredProducts.length;

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
        <h1 className="text-3xl font-bold">Productos Samsung</h1>
        <div className="text-sm text-gray-600">
          {totalItems > 0 && (
            <span>
              Mostrando {resultCount} de {totalItems} productos
            </span>
          )}
        </div>
      </div>

      <div className="flex gap-8">
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
        <main className="flex-1">
          {loading && products.length > 0 && (
            <div className="mb-4 flex justify-center">
              <LoadingSpinner />
            </div>
          )}
          <ProductGrid products={filteredProducts} />
        </main>
      </div>
    </div>
  );
}

export default function ProductosPage() {
  return (
    <ProductosContent />
  );
}
