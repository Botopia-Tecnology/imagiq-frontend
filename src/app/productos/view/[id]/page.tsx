"use client";

import React, { use, useEffect } from "react";
import ViewProduct from "../../dispositivos-moviles/ViewProductMobile";
import { useProduct } from "@/features/products/useProducts";
import { notFound } from "next/navigation";
import smartphonesImg from "@/img/dispositivosmoviles/cel1.png";
import {
  ProductCardProps,
  ProductColor,
} from "@/app/productos/components/ProductCard";
import ViewProductAppliance from "../../electrodomesticos/ViewProductAppliance";
import DetailsProductSection from "@/app/productos/dispositivos-moviles/detalles-producto/DetailsProductSection";
import ProductDetailSkeleton from "@/app/productos/dispositivos-moviles/detalles-producto/ProductDetailSkeleton";
import { useProductContext } from "@/features/products/ProductContext";

// Convierte ProductCardProps a formato esperado por ViewProduct
function convertProductForView(product: ProductCardProps) {
  const image =
    typeof product.image === "string" ? smartphonesImg : product.image;
  const safeValue = (
    value: string | number | null | undefined,
    fallback: string = "None"
  ) => {
    if (
      value === null ||
      value === undefined ||
      value === "" ||
      (Array.isArray(value) && value.length === 0)
    ) {
      return fallback;
    }
    return String(value);
  };
  return {
    id: safeValue(product.id, "None"),
    name: safeValue(product.name, "None"),
    image: image,
    price: safeValue(product.price, "None"),
    originalPrice: product.originalPrice
      ? safeValue(product.originalPrice)
      : undefined,
    discount: product.discount ? safeValue(product.discount) : undefined,
    colors:
      product.colors?.map((color: ProductColor) => ({
        name: safeValue(color.name || color.label, "None"),
        hex: safeValue(color.hex, "#808080"),
      })) || [],
    description: safeValue(product.apiProduct?.descGeneral, "None"),
    specs: [
      { label: "Marca", value: "Samsung" }, // ProductApiData no tiene campo marca, todos son Samsung
      { label: "Modelo", value: safeValue(product.apiProduct?.modelo, "None") },
      { label: "Categoría", value: safeValue(product.apiProduct?.categoria, "None") },
      { label: "Subcategoría", value: safeValue(product.apiProduct?.subcategoria, "None") },
      { label: "Capacidad", value: safeValue(product.selectedCapacity?.value || product.capacities?.[0]?.value, "None") },
      { label: "SKU", value: safeValue(product.selectedColor?.sku || product.colors?.[0]?.sku, "None") },
    ],
  };
}

// Mantiene la integración con el contexto de tipo de producto
function SetApplianceFlag({ isRefrigerador }: { isRefrigerador: boolean }) {
  const { setIsAppliance } = useProductContext();
  useEffect(() => {
    setIsAppliance(isRefrigerador);
  }, [isRefrigerador, setIsAppliance]);
  return null;
}

// Wrapper para manejar el estado de carga de variantes
function ProductContentWithVariants({
  product,
  onVariantsReady
}: {
  product: ProductCardProps;
  onVariantsReady: (ready: boolean) => void;
}) {
  const convertedProduct = convertProductForView(product);

  return (
    <>
      <DetailsProductSection product={product} onVariantsReady={onVariantsReady} />
      <ViewProduct product={convertedProduct} flix={product} />
    </>
  );
}

// @ts-expect-error Next.js infiere el tipo de params automáticamente
export default function ProductViewPage({ params }) {
  const resolvedParams = use(params);
  type ParamsWithId = { id: string };
  const id =
    resolvedParams &&
    typeof resolvedParams === "object" &&
    "id" in resolvedParams
      ? (resolvedParams as ParamsWithId).id
      : undefined;
  const { product, loading, error } = useProduct(id ?? "");
  const [variantsReady, setVariantsReady] = React.useState(false);

  // Reset variants ready cuando cambia el producto
  React.useEffect(() => {
    setVariantsReady(false);
  }, [id]);

  if (!id) {
    return notFound();
  }

  if (error) {
    return notFound();
  }

  if (!product && loading) {
    return <ProductDetailSkeleton />;
  }

  if (!product) {
    return (
      <div className="container mx-auto px-6 py-8">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">
              Producto no encontrado
            </h2>
            <p className="text-gray-600">
              El producto que buscas no está disponible.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const isFullyLoaded = !loading && variantsReady;

  return (
    <>
      {/* Mostrar skeleton mientras carga */}
      {!isFullyLoaded && <ProductDetailSkeleton />}

      {/* Renderizar contenido (oculto o visible según estado) */}
      <div style={{ display: isFullyLoaded ? 'block' : 'none' }}>
        <ProductContentWithVariants
          product={product}
          onVariantsReady={setVariantsReady}
        />
      </div>
    </>
  );
}
