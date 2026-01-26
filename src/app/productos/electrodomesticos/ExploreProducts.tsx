// ExploreProductList.tsx
"use client";

import SkeletonCard from "@/components/SkeletonCard";
import { useProducts } from "@/features/products/useProducts";
import { cn } from "@/lib/utils";
import { useEffect, useMemo, useRef } from "react";
import CardExplore from "./components/CardExplore";

interface ExploreProductsProps {
  viewMode?: "grid" | "list";
  title: string;
  filters?: {
    [key: string]: string;
  };
  limit?: number;
}

export default function ExploreProducts({
  viewMode = "grid",
  title,
  filters = {},
  limit = 4,
}: ExploreProductsProps) {
  //{descriptionKeyword: "Bespoke",}
  const lastFiltersRef = useRef<string>("");
  const apiFilters = useMemo(() => filters, [filters]);

  const initialFilters = useMemo(() => {
    const filters = {
      ...apiFilters,
      limit: 4,
    };
    return filters;
  }, [apiFilters]);

  //   const initialFilters = {
  //   ...filters,
  //   limit,
  // };

  const { products, loading, error, refreshProducts, filterProducts } =
    useProducts(initialFilters);

  // Actualizar filtros cuando cambien los parámetros de paginación
  useEffect(() => {
    const filtersWithPagination = {
      ...filters, //...aoiFilters
      page: 1,
      limit,
    };

    // Crear una clave única para evitar bucles infinitos
    const filtersKey = JSON.stringify(filtersWithPagination);

    if (lastFiltersRef.current !== filtersKey) {
      lastFiltersRef.current = filtersKey;
      filterProducts(filtersWithPagination);
    }
  }, [apiFilters, filterProducts, limit, filters]);

  if (loading) {
    return (
      <div className="bg-white">
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 max-w-7xl mx-auto px-4 py-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-6 py-8">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-red-600 mb-4">
              Error al cargar línea bespoke
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
    <div className="pb-8 bg-white">
      <h3
        className="text-gray pb-8 text-3xl text-center md:text-5xl font-bold mb-2 hover:text-gray-900 transition-all"
        style={{ fontFamily: "SamsungSharpSans", letterSpacing: "-1px" }}
      >
        {title}
      </h3>
      <div
        className={cn("grid gap-4 bg-white max-w-7xl mx-auto px-4", {
          "grid-cols-1": true,
          "sm:grid-cols-2": true,
          "md:grid-cols-3": true,
          "lg:grid-cols-4": true,
        })}
      >
        {products.length === 0 ? (
          <div className="col-span-full text-center py-12 text-gray-500">
            No se encontraron sugerencias.
          </div>
        ) : (
          products.map((product) => (
            <CardExplore
              key={product.id}
              id={product.id}
              name={product.name}
              image={product.image}
              className={viewMode === "list" ? "flex-row" : ""}
              onAddToCart={(productId: string, color: string) =>
                console.log(`Añadir al carrito: ${productId} - ${color}`)
              }
            />
          ))
        )}
      </div>
    </div>
  );
}
