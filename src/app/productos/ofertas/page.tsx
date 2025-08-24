/**
 * Página de productos en oferta por categoría
 * Muestra solo los productos con descuento (porcentaje) de la categoría seleccionada
 * Reutiliza ProductCard y las imágenes existentes
 */

"use client";
import React from "react";
import { useSearchParams } from "next/navigation";
import ProductCard from "../components/ProductCard";
import type { ProductCardProps } from "../components/ProductCard";

// Importar productos de ambas carpetas

import { productsData } from "../data_product/products";

// Mapear categorías a sus datos (accesorios, tv-monitores-audio, smartphones-tablets, electrodomesticos)
const categoryMap: Record<string, ProductCardProps[]> = {
  accesorios: productsData.accesorios,
  "tv-monitores-audio": productsData["tv-monitores-audio"],
  "smartphones-tablets": productsData["smartphones-tablets"],
  electrodomesticos: productsData.electrodomesticos,
};

export default function ProductosOfertasPage() {
  const searchParams = useSearchParams();
  const categoria = searchParams.get("categoria");

  // Obtener productos de la categoría
  const productos: ProductCardProps[] =
    categoria && categoryMap[categoria]
      ? categoryMap[categoria].filter(
          (p) =>
            p.discount &&
            typeof p.discount === "string" &&
            p.discount.includes("%")
        )
      : [];

  const mainContent = (
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
  if (
    mainContent == null ||
    (typeof mainContent === "number" && isNaN(mainContent))
  ) {
    return <></>;
  } else {
    return mainContent;
  }
}
