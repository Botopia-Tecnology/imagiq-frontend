"use client";

import React, { use, useEffect } from "react";
import { useProduct } from "@/features/products/useProducts";
import { notFound } from "next/navigation";
import ProductDetailSkeleton from "@/app/productos/dispositivos-moviles/detalles-producto/ProductDetailSkeleton";
import StickyPriceBar from "@/app/productos/dispositivos-moviles/detalles-producto/StickyPriceBar";
import { useScrollNavbar } from "@/hooks/useScrollNavbar";

// Componentes
import ProductCarousel from "../components/ProductCarousel";
import ProductInfo from "../components/ProductInfo";
import ImageModal from "../components/ImageModal";
import TradeInSection from "../components/sections/TradeInSection";
import { useProductLogic } from "../hooks/useProductLogic";
import BenefitsSection from "../../dispositivos-moviles/detalles-producto/BenefitsSection";
import Specifications from "../../dispositivos-moviles/detalles-producto/Specifications";

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

  // Hook personalizado para manejar toda la lógica del producto
  const {
    selectedColor,
    selectedStorage,
    currentImageIndex,
    showStickyCarousel,
    isModalOpen,
    modalImageIndex,
    slideDirection,
    carouselRef,
    specsRef,
    premiumImages,
    productImages,
    detailImages,
    setSelectedColor,
    setSelectedStorage,
    setCurrentImageIndex,
    openModal,
    closeModal,
    goToNextImage,
    goToPrevImage,
    goToImage,
  } = useProductLogic(product);

  // Barra sticky superior con la misma animación/estilo de la vista normal
  const showStickyBar = useScrollNavbar(150, 50, true);

  // Efecto para ocultar/mostrar el header principal exactamente igual que en view normal
  React.useEffect(() => {
    if (typeof document === "undefined") return;
    if (showStickyBar) {
      document.body.classList.add("hide-main-navbar");
    } else {
      const timer = setTimeout(() => {
        document.body.classList.remove("hide-main-navbar");
      }, 250);
      return () => clearTimeout(timer);
    }
    return () => {
      document.body.classList.remove("hide-main-navbar");
    };
  }, [showStickyBar]);

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
  return (
    <>
      {/* StickyPriceBar exacto de la página view normal */}
      <StickyPriceBar
        deviceName={product.name}
        basePrice={(() => {
          const selectedCapacity = product.capacities?.find(c => c.value === selectedStorage);
          const priceStr = selectedCapacity?.price || product.price || "0";
          return parseInt(priceStr.replace(/[^\d]/g, ''));
        })()}
        selectedStorage={(selectedStorage || undefined) && String(selectedStorage).replace(/(\d+)\s*gb\b/i, '$1 GB')}
        selectedColor={selectedColor || undefined}
        hasAddiFinancing={true}
        isVisible={showStickyBar}
      />

      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 md:px-6 lg:px-12 py-4">
          <div className="max-w-7xl mx-auto">
            <p className="text-sm text-gray-600">
              Galaxy Z / Detalles del producto
            </p>
          </div>
        </div>
      </div>

      {/* Layout de dos columnas: Carrusel sin márgenes, Info con márgenes */}
      <div className="bg-white pt-8 pb-0 mb-0 min-h-screen">
        {/* Grid principal */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 items-start relative">
          {/* Columna izquierda: Carrusel - ocupa todo el ancho */}
          <div className="lg:col-span-9 lg:sticky lg:top-24 self-start lg:h-screen overflow-hidden">
            <ProductCarousel
              ref={carouselRef}
              product={product}
              selectedColor={selectedColor}
              currentImageIndex={currentImageIndex}
              setCurrentImageIndex={setCurrentImageIndex}
              showStickyCarousel={showStickyCarousel}
              premiumImages={premiumImages}
              productImages={productImages}
              onOpenModal={openModal}
              setSelectedColor={setSelectedColor}
            />
          </div>

          {/* Columna derecha: Información del producto con márgenes normales - SCROLLEABLE */}
          <div className="lg:col-span-3 px-4 md:px-6 lg:px-12 mt-0 lg:mt-0 lg:min-h-[200vh]">
            <div className="max-w-7xl mx-auto">
              <ProductInfo
                ref={specsRef}
                product={product}
                selectedColor={selectedColor}
                selectedStorage={selectedStorage}
                setSelectedColor={setSelectedColor}
                setSelectedStorage={setSelectedStorage}
                setCurrentImageIndex={setCurrentImageIndex}
                currentImageIndex={currentImageIndex}
                productImages={productImages}
                onOpenModal={openModal}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Sección de Estreno y Entrego - SIEMPRE fuera del grid, centrada */}
      <div className="bg-white pb-4 mt-8 lg:mt-4">
        <div className="container mx-auto px-4 md:px-6 lg:px-12">
          <div className="max-w-7xl mx-auto">
            <TradeInSection />
          </div>
        </div>
      </div>

      {/* Beneficios imagiq - Banner que ocupa todo el ancho */}
      <BenefitsSection />

      {/* Especificaciones y Flix Media */}
      <div className="relative flex items-center justify-center w-full min-h-[100px] py-0">
        <Specifications product={product} flix={product} />
      </div>

      {/* Modal para fotos del color seleccionado */}
      <ImageModal
        isOpen={isModalOpen}
        productImages={detailImages}
        modalImageIndex={modalImageIndex}
        slideDirection={slideDirection}
        product={product}
        selectedColor={selectedColor}
        onClose={closeModal}
        onNextImage={goToNextImage}
        onPrevImage={goToPrevImage}
        onGoToImage={goToImage}
      />
      {/* Estilos globales para animación de ocultar header, idénticos a view normal */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
          body.hide-main-navbar header[data-navbar="true"] {
            transform: translateY(-100%) scale(0.97) !important;
            opacity: 0 !important;
            filter: blur(3px) !important;
            transition:
              transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94),
              opacity 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94),
              filter 0.4s cubic-bezier(0.25, 0.1, 0.25, 1) !important;
            pointer-events: none !important;
          }

          .fixed-navbar-container {
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            right: 0 !important;
            z-index: 9999 !important;
            will-change: transform, opacity, filter !important;
          }

          .fixed-navbar-container::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%);
            border-radius: inherit;
            pointer-events: none;
          }

          .fixed-navbar-container * {
            backface-visibility: hidden;
            transform-style: preserve-3d;
          }
        `,
        }}
      />
    </>
  );
}
