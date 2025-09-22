// ExploreProductList.tsx
"use client";

import { cn } from "@/lib/utils";
import CardExplore from "./components/CardExplore";
import { StaticImageData } from "next/image";
interface Product {
  id: string;
  name: string;
  image: string | StaticImageData;
}

interface ExploreProductsProps {
  products: Product[];
  viewMode?: "grid" | "list";
  title: string;
}

export default function ExploreProducts({
  products,
  viewMode = "grid",
  title,
}: ExploreProductsProps) {
  return (
    <div className="pb-8 bg-white">
      <h3
        className="text-gray pb-8 text-3xl text-center md:text-5xl font-bold mb-2 hover:text-gray-900 transition-all"
        style={{ fontFamily: "SamsungSharpSans", letterSpacing: "-1px" }}
      >
        {title}
      </h3>
      <div
        className={cn("grid gap-6 bg-white max-w-7xl mx-auto pl-4 pr-4", {
          "grid-cols-2": true,
          "md:grid-cols-4": true,
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
