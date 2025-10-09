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
    colors:
      product.colors?.map((color: ProductColor) => ({
        name: safeValue(color.name || color.label, "None"),
        hex: safeValue(color.hex, "#808080"),
      })) || [],
    specs: [],
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
  const [showContent, setShowContent] = React.useState(false);

  // Delay para asegurar transición suave
  React.useEffect(() => {
    if (!loading && product) {
      const timer = setTimeout(() => setShowContent(true), 150);
      return () => clearTimeout(timer);
    } else {
      setShowContent(false);
    }
  }, [loading, product]);

  if (!id) {
    return notFound();
  }
  if (loading || !showContent) {
    return <ProductDetailSkeleton />;
  }
  if (error) {
    return notFound();
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
  const convertedProduct = convertProductForView(product);
  const isRefrigerador = false;
  return (
    <>
      <SetApplianceFlag isRefrigerador={!!isRefrigerador} />
      {/* Detalles de producto refactorizado */}
      <DetailsProductSection product={product} /> 
      {/* Vista original de producto */}
      {isRefrigerador ? (
        /* Para electrodomésticos solo renderizar ViewProductAppliance */
        <ViewProductAppliance product={convertedProduct} />
      ) : (
        /* Para dispositivos móviles renderizar DetailsProductSection + ViewProduct */
        <>
          <DetailsProductSection product={product} />
          <ViewProduct product={convertedProduct} />
        </>
      )}
    </>
  );
}
