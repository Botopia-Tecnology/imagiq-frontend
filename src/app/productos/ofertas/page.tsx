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
import { productsData } from "../data_product/products";

const categoryMap: Record<string, ProductCardProps[]> = {
  accesorios: productsData.accesorios,
  "tv-monitores-audio": productsData["tv-monitores-audio"],
  "smartphones-tablets": productsData["smartphones-tablets"],
  electrodomesticos: productsData.electrodomesticos,
};

function ProductosOfertasContent() {
  const searchParams = useSearchParams();
  const categoria = searchParams.get("categoria");
  const productos: ProductCardProps[] =
    categoria && categoryMap[categoria]
      ? categoryMap[categoria].filter(
          (p) =>
            p.discount &&
            typeof p.discount === "string" &&
            p.discount.includes("%")
        )
      : [];
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-8">
      {productos.length === 0 ? (
        <div className="col-span-3 text-center text-gray-500 text-lg">
          No hay productos en oferta para esta categoría.
        </div>
      ) : (
        productos.map((producto) => (
          <ProductCard key={producto.id} {...producto} />
        ))
      )}
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
