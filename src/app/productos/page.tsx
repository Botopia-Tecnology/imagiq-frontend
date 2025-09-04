"use client";

import { Suspense, useState, useMemo } from "react";
import { productsData } from "./data_product/products";
import FilterSidebar, {
  FilterConfig,
  FilterState,
} from "./components/FilterSidebar";
import ProductGrid, { Product } from "./components/ProductGrid";

const allProducts: Product[] = [
  ...productsData["accesorios"],
  ...productsData["tv-monitores-audio"],
  ...productsData["smartphones-tablets"],
  ...productsData["electrodomesticos"],
];

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

function filterProducts(products: Product[], filters: FilterState) {
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

  // Filtrado funcional y robusto
  const filteredProducts = useMemo(
    () => filterProducts(allProducts, filters),
    [filters]
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

  return (
    <div className="container mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold mb-6">Productos Samsung</h1>
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
          <ProductGrid products={filteredProducts} />
        </main>
      </div>
    </div>
  );
}

export default function ProductosPage() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <ProductosContent />
    </Suspense>
  );
}
