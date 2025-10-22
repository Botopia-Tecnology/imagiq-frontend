/**
 * 🎬 MULTIMEDIA PAGE - IMAGIQ ECOMMERCE
 * 
 * Página dedicada para mostrar contenido multimedia enriquecido de Flixmedia
 * Se accede desde el botón "Más información" de las cards de producto
 * 
 * Ruta: /productos/multimedia/[id]
 * 
 * Características:
 * - Carga contenido 360°, videos y especificaciones de Samsung
 * - Obtiene MPN/EAN del producto desde el backend
 * - Diseño limpio enfocado en el contenido multimedia
 * - Botón para volver a la vista anterior
 */

"use client";

import React, { use } from "react";
import { useRouter } from "next/navigation";
import { useProduct } from "@/features/products/useProducts";
import FlixmediaPlayer from "@/components/FlixmediaPlayer";
import MultimediaBottomBar from "@/components/MultimediaBottomBar";
import { motion } from "framer-motion";

// Skeleton de carga mejorado
function MultimediaPageSkeleton() {
  return (
    
    <div className="min-h-screen bg-white flex flex-col">
        {/* Skeleton del bottom bar */}
      <div className="fixed bottom-0 left-0 right-0 z-[60] bg-white border-t border-gray-200 shadow-2xl">
        <div className="max-w-[1680px] mx-auto px-4 md:px-6 lg:px-12">
          <div className="flex items-center justify-between gap-4 md:gap-6 py-3 md:py-4">
            {/* Skeleton nombre del producto */}
            <div className="flex-shrink-0 hidden md:block max-w-[280px]">
              <div className="h-5 bg-gray-200 rounded w-48 animate-pulse" />
            </div>

            {/* Skeleton precio */}
            <div className="flex-1 flex justify-center items-center">
              <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
                <div className="h-8 bg-gray-200 rounded w-32 animate-pulse" />
                <div className="hidden sm:block w-px h-6 bg-gray-200" />
                <div className="h-6 bg-gray-200 rounded w-40 animate-pulse" />
              </div>
            </div>

            {/* Skeleton botón */}
            <div className="flex-shrink-0">
              <div className="h-12 bg-gray-200 rounded-full w-32 animate-pulse" />
            </div>
          </div>
        </div>
        
        {/* Línea decorativa */}
        <div className="h-1 w-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse" />
      </div>
      {/* Skeleton del contenido principal */}
      <div className="flex-1">
        {/* Skeleton del iframe de Flixmedia */}
        <div className="w-full h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 relative overflow-hidden">
          {/* Efecto de brillo */}
          <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent" />
          
          {/* Icono central de carga */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 border-4 border-gray-200 border-t-[#0066CC] rounded-full animate-spin" />
              <div className="space-y-3">
                <div className="h-3 bg-gray-200 rounded w-48 mx-auto animate-pulse" />
                <div className="h-2 bg-gray-200 rounded w-32 mx-auto animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </div>

    
    </div>
  );
}

// Componente principal
export default function MultimediaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const resolvedParams = use(params);
  const { id } = resolvedParams;

  const { product, loading, error } = useProduct(id);


  // Loading state
  if (loading) {
    return <MultimediaPageSkeleton />;
  }

  // Error state
  if (error || !product) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <svg
              className="w-16 h-16 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Producto no encontrado
          </h2>
          <p className="text-gray-600 mb-6">
            No pudimos cargar la información del producto
          </p>
          <button
            onClick={() => router.back()}
            className="bg-black text-white px-6 py-3 rounded-full font-semibold hover:bg-gray-800 transition-colors"
          >
            Volver atrás
          </button>
        </div>
      </div>
    );
  }

  // Extraer SKU y EAN del producto
  const productSku = product.sku;
  const productEan = product.ean || null;

  // Parsear precios a números
  const parsePrice = (price: string | number | undefined): number => {
    if (typeof price === "number") return price;
    if (!price) return 0;
    return parseInt(price.replace(/[^\d]/g, "")) || 0;
  };

  const numericPrice = parsePrice(product.price);
  const numericOriginalPrice = product.originalPrice
    ? parsePrice(product.originalPrice)
    : undefined;
  
  // Función helper para verificar si el producto es premium
  const isPremiumProduct = (segmento?: string | string[]): boolean => {
    if (!segmento) return false;
    const segmentoValue = Array.isArray(segmento) ? segmento[0] : segmento;
    return segmentoValue?.toLowerCase() === 'premium';
  };

  // Determinar la ruta según el segmento del producto
  const isPremium = isPremiumProduct(product.segmento);
  const viewRoute = isPremium 
    ? `/productos/viewpremium/${id}` 
    : `/productos/view/${id}`;

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Top Bar con info del producto y CTA - Fixed debajo del Navbar */}
      <MultimediaBottomBar
        productName={product.name}
        price={numericPrice}
        originalPrice={numericOriginalPrice}
        onViewDetailsClick={() => router.push(viewRoute)}
        isVisible={true}
      />

      {/* Contenido principal - Flixmedia Player con padding para el navbar y el bar fijo */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex-1 pt-[70px] xl:pt-[50px]"
      >
        <FlixmediaPlayer
          mpn={productSku}
          ean={productEan}
          productName={product.name}
          productId={id}
          segmento={product.segmento}
          className=""
        />
      </motion.div>
    </div>
  );
}
