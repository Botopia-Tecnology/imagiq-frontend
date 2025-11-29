"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import { getCloudinaryUrl } from "@/lib/cloudinary";
import { BundlePreviewImages } from "@/app/productos/components/BundleCard";
import type { BundleProduct } from "@/lib/api";

/**
 * UnifiedBundleCarousel - Carrusel unificado del bundle
 *
 * Muestra en un solo carrusel:
 * 1. Primera imagen: Composición visual del bundle (múltiples productos en grid)
 * 2. Siguientes imágenes: Imágenes individuales de cada producto del bundle
 */

interface UnifiedBundleCarouselProps {
  bundleName: string;
  bundleCompositeImages: string[];
  mainProduct?: BundleProduct;
  allProducts?: BundleProduct[];
  onOpenModal?: (imageIndex: number) => void;
}

export default function UnifiedBundleCarousel({
  bundleName,
  bundleCompositeImages,
  allProducts,
  onOpenModal,
}: UnifiedBundleCarouselProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Verificar si hay imágenes del bundle composite
  const hasCompositeImage = bundleCompositeImages && bundleCompositeImages.length > 0;

  // Construir array de imágenes organizadas por producto
  const imagesByProduct = useMemo(() => {
    const organized: Array<{
      productName: string;
      images: Array<{ url: string; globalIndex: number }>;
    }> = [];

    let currentGlobalIndex = hasCompositeImage ? 1 : 0; // Comenzar después de la imagen del bundle

    if (allProducts && allProducts.length > 0) {
      allProducts.forEach((product) => {
        const productImages: Array<{ url: string; globalIndex: number }> = [];
        
        // Agregar imagen preview
        if (product.imagePreviewUrl) {
          const url = getCloudinaryUrl(product.imagePreviewUrl, "catalog");
          productImages.push({ url, globalIndex: currentGlobalIndex });
          currentGlobalIndex++;
        }
        
        // Agregar todas las imágenes de detalles
        if (product.imageDetailsUrls && product.imageDetailsUrls.length > 0) {
          product.imageDetailsUrls.forEach((imageUrl) => {
            const url = getCloudinaryUrl(imageUrl, "catalog");
            productImages.push({ url, globalIndex: currentGlobalIndex });
            currentGlobalIndex++;
          });
        }
        
        // Solo agregar el producto si tiene al menos una imagen
        if (productImages.length > 0) {
          organized.push({
            productName: product.modelo,
            images: productImages,
          });
        }
      });
    }

    return organized;
  }, [allProducts, hasCompositeImage]);

  // Construir array plano de todas las imágenes para el carrusel principal
  const allImages = useMemo(() => {
    const images: Array<{ url: string; productName: string; type: 'composite' | 'product' }> = [];
    
    // Agregar imagen compuesta del bundle
    if (hasCompositeImage) {
      images.push({
        url: '', // Se renderiza con BundlePreviewImages
        productName: bundleName,
        type: 'composite',
      });
    }
    
    // Agregar todas las imágenes de productos
    imagesByProduct.forEach(product => {
      product.images.forEach(img => {
        images.push({
          url: img.url,
          productName: product.productName,
          type: 'product',
        });
      });
    });
    
    return images;
  }, [imagesByProduct, hasCompositeImage, bundleName]);

  // Total de slides
  const totalSlides = allImages.length;

  // Si no hay imágenes, mostrar placeholder
  if (totalSlides === 0) {
    return (
      <div className="w-full aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="text-center text-gray-400">
          <div className="text-4xl mb-2">📷</div>
          <p className="text-sm">Sin imágenes disponibles</p>
        </div>
      </div>
    );
  }

  const handlePrevious = () => {
    setCurrentImageIndex((prev) => {
      const newIndex = prev === 0 ? totalSlides - 1 : prev - 1;
      return newIndex;
    });
  };

  const handleNext = () => {
    setCurrentImageIndex((prev) => {
      const newIndex = prev === totalSlides - 1 ? 0 : prev + 1;
      return newIndex;
    });
  };

  const handleThumbnailClick = (index: number) => {
    setCurrentImageIndex(index);
  };

  const handleImageClick = () => {
    onOpenModal?.(currentImageIndex);
  };

  // Determinar qué mostrar basado en el índice actual
  const currentImage = allImages[currentImageIndex];
  const isShowingComposite = currentImage?.type === 'composite';

  return (
    <div className="space-y-4">
      {/* Imagen principal */}
      <div className="relative aspect-square bg-gray-50 rounded-lg overflow-hidden group">
        {isShowingComposite ? (
          // Mostrar composición del bundle
          <div className="w-full h-full relative">
            <BundlePreviewImages images={bundleCompositeImages} bundleName={bundleName} />
          </div>
        ) : (
          // Mostrar imagen individual de producto
          currentImage && (
            <Image
              src={currentImage.url}
              alt={currentImage.productName}
              fill
              className="object-contain p-4 transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority={currentImageIndex === 0}
            />
          )
        )}

        {/* Botón de zoom */}
        {onOpenModal && (
          <button
            onClick={handleImageClick}
            className="absolute top-4 right-4 p-2 bg-white/90 hover:bg-white rounded-full shadow-md transition-all hover:scale-110 z-20"
            aria-label="Ampliar imagen"
          >
            <ZoomIn className="w-5 h-5 text-gray-700" />
          </button>
        )}

        {/* Navegación - Solo mostrar si hay más de una imagen */}
        {totalSlides > 1 && (
          <>
            {/* Botón anterior */}
            <button
              onClick={handlePrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/90 hover:bg-white rounded-full shadow-md transition-all hover:scale-110 opacity-0 group-hover:opacity-100 z-20"
              aria-label="Imagen anterior"
            >
              <ChevronLeft className="w-6 h-6 text-gray-700" />
            </button>

            {/* Botón siguiente */}
            <button
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/90 hover:bg-white rounded-full shadow-md transition-all hover:scale-110 opacity-0 group-hover:opacity-100 z-20"
              aria-label="Imagen siguiente"
            >
              <ChevronRight className="w-6 h-6 text-gray-700" />
            </button>

            {/* Indicador de posición */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-black/70 text-white text-sm rounded-full z-20">
              {currentImageIndex + 1} / {totalSlides}
            </div>
          </>
        )}
      </div>

      {/* Thumbnails organizados por filas de productos */}
      {totalSlides > 1 && (
        <div className="space-y-2">
          {/* Primera fila: Imagen compuesta del bundle + producto principal */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide justify-center">
            {/* Thumbnail de la imagen compuesta */}
            {hasCompositeImage && (
              <button
                onClick={() => handleThumbnailClick(0)}
                className={`
                  relative flex-shrink-0 w-[72px] h-[72px] rounded-xl overflow-hidden transition-all bg-white
                  ${
                    currentImageIndex === 0
                      ? "ring-2 ring-black shadow-md"
                      : "ring-1 ring-gray-200 hover:ring-gray-300"
                  }
                `}
                aria-label="Ver bundle completo"
              >
                <div className="w-full h-full relative">
                  <BundlePreviewImages images={bundleCompositeImages} bundleName={bundleName} />
                </div>
              </button>
            )}

            {/* Thumbnails del primer producto (producto principal) */}
            {imagesByProduct.length > 0 && imagesByProduct[0].images.slice(0, 4).map((image, imageIndex) => (
              <button
                key={imageIndex}
                onClick={() => handleThumbnailClick(image.globalIndex)}
                className={`
                  relative flex-shrink-0 w-[72px] h-[72px] rounded-xl overflow-hidden transition-all bg-white
                  ${
                    currentImageIndex === image.globalIndex
                      ? "ring-2 ring-black shadow-md"
                      : "ring-1 ring-gray-200 hover:ring-gray-300"
                  }
                `}
                aria-label={`Ver ${imagesByProduct[0].productName}`}
              >
                <Image
                  src={image.url}
                  alt={`${imagesByProduct[0].productName} thumbnail`}
                  fill
                  className="object-contain p-2"
                  sizes="72px"
                />
              </button>
            ))}

            {/* Indicador de más imágenes en la primera fila */}
            {imagesByProduct.length > 0 && imagesByProduct[0].images.length > 4 && (
              <div className="relative flex-shrink-0 w-[72px] h-[72px] rounded-xl overflow-hidden bg-gray-100 ring-1 ring-gray-200 flex items-center justify-center">
                <span className="text-sm font-medium text-gray-600">
                  +{imagesByProduct[0].images.length - 4} más
                </span>
              </div>
            )}
          </div>

          {/* Filas siguientes: Imágenes de los demás productos (saltando el primero) */}
          {imagesByProduct.slice(1).map((product, productIndex) => (
            <div key={productIndex + 1}>
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide justify-center">
                {product.images.slice(0, 5).map((image, imageIndex) => (
                  <button
                    key={imageIndex}
                    onClick={() => handleThumbnailClick(image.globalIndex)}
                    className={`
                      relative flex-shrink-0 w-[72px] h-[72px] rounded-xl overflow-hidden transition-all bg-white
                      ${
                        currentImageIndex === image.globalIndex
                          ? "ring-2 ring-black shadow-md"
                          : "ring-1 ring-gray-200 hover:ring-gray-300"
                      }
                    `}
                    aria-label={`Ver ${product.productName}`}
                  >
                    <Image
                      src={image.url}
                      alt={`${product.productName} thumbnail`}
                      fill
                      className="object-contain p-2"
                      sizes="72px"
                    />
                  </button>
                ))}

                {/* Indicador de más imágenes */}
                {product.images.length > 5 && (
                  <div className="relative flex-shrink-0 w-[72px] h-[72px] rounded-xl overflow-hidden bg-gray-100 ring-1 ring-gray-200 flex items-center justify-center">
                    <span className="text-sm font-medium text-gray-600">
                      +{product.images.length - 5} más
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
