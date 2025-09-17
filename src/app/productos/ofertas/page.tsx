/**
 * Página de productos en oferta por categoría
 * Muestra solo los productos con descuento (porcentaje) de la categoría seleccionada
 * Reutiliza ProductCard y las imágenes existentes
 */

"use client";
import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import ProductCard from "../components/ProductCard";
import type { ProductCardProps } from "../components/ProductCard";
import { useProducts } from "@/features/products/useProducts";
import LoadingSpinner from "@/components/LoadingSpinner";

const categoryMap: Record<string, string> = {
  accesorios: "IM",
  "tv-monitores-audio": "TV",
  "smartphones-tablets": "IM",
  electrodomesticos: "EL",
};

function ProductosOfertasContent() {
  const searchParams = useSearchParams();
  const categoria = searchParams.get("categoria");
  
  // Usar el hook de productos con filtro de ofertas
  const { 
    products, 
    loading, 
    error, 
    refreshProducts 
  } = useProducts({
    withDiscount: true,
    category: categoria ? categoryMap[categoria] : undefined,
  });

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

  return (
    <div className="container mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">
        {categoria ? `Ofertas - ${categoria}` : 'Ofertas Samsung'}
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-8">
        {products.length === 0 ? (
          <div className="col-span-3 text-center text-gray-500 text-lg">
            No hay productos en oferta para esta categoría.
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

export default function ProductosOfertasPage() {
  return (
    <Suspense
      fallback={<div className="p-8 text-center">Cargando ofertas...</div>}
    >
      <ProductosOfertasContent />
    </Suspense>
  );
}
