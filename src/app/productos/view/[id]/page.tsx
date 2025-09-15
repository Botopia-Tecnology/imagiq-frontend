"use client";

import { use } from "react";
import ViewProduct from "../../dispositivos-moviles/ViewProductMobile";
import { useProduct } from "@/features/products/useProducts";
import { notFound } from "next/navigation";
import LoadingSpinner from "@/components/LoadingSpinner";
import { StaticImageData } from "next/image";
import smartphonesImg from "@/img/dispositivosMoviles/cel1.png";

// Función para convertir ProductCardProps a ProductData compatible con ViewProduct
function convertProductForView(product: any) {
  // Si la imagen es un string (URL), usar imagen por defecto
  const image = typeof product.image === 'string' ? smartphonesImg : product.image;
  
  return {
    ...product,
    image: image as StaticImageData,
    colors: product.colors?.map((color: any) => ({
      name: color.name || color.label,
      hex: color.hex
    })) || []
  };
}

// @ts-expect-error Next.js infiere el tipo de params automáticamente
export default function ProductViewPage({ params }) {
  const resolvedParams = use(params) as { id: string };
  const { id } = resolvedParams;
  
  // Usar el hook de productos para obtener el producto específico
  const { product, loading, error } = useProduct(id);
  
  if (loading) {
    return (
      <div className="container mx-auto px-6 py-8">
        <div className="flex justify-center items-center min-h-[400px]">
          <LoadingSpinner />
        </div>
      </div>
    );
  }
  
  if (error || !product) {
    return notFound();
  }
  
  // Convertir el producto al formato esperado por ViewProduct
  const convertedProduct = convertProductForView(product);
  
  return <ViewProduct product={convertedProduct} />;
}
