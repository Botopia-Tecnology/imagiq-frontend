"use client";

import { useState, useMemo } from "react";
import UnifiedBundleCarousel from "./UnifiedBundleCarousel";
import ImageGalleryModal from "@/app/productos/dispositivos-moviles/detalles-producto/ImageGalleryModal";
import { getCloudinaryUrl } from "@/lib/cloudinary";
import type { BundleProduct } from "@/lib/api";

interface BundleImagesProps {
  bundleName: string;
  imagePreviewUrl: string[];
  mainProduct?: BundleProduct;
  allProducts?: BundleProduct[];
}

/**
 * Componente que muestra las imágenes del bundle
 * Utiliza un carrusel unificado que combina:
 * - Primera imagen: Composición del bundle completo
 * - Siguientes imágenes: Imágenes individuales de cada producto
 */
export function BundleImages({
  bundleName,
  imagePreviewUrl,
  mainProduct,
  allProducts,
}: BundleImagesProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImageIndex, setModalImageIndex] = useState(0);

  // Construir array completo de imágenes para el modal
  const allModalImages = useMemo(() => {
    const images: string[] = [];

    // Agregar imágenes compuestas del bundle
    if (imagePreviewUrl && imagePreviewUrl.length > 0) {
      imagePreviewUrl.forEach((url) => {
        images.push(getCloudinaryUrl(url, "catalog"));
      });
    }

    // Agregar imágenes de cada producto
    if (allProducts && allProducts.length > 0) {
      allProducts.forEach((product) => {
        // Agregar imagen preview
        if (product.imagePreviewUrl) {
          images.push(getCloudinaryUrl(product.imagePreviewUrl, "catalog"));
        }

        // Agregar imágenes de detalles
        if (product.imageDetailsUrls && product.imageDetailsUrls.length > 0) {
          product.imageDetailsUrls.forEach((url) => {
            images.push(getCloudinaryUrl(url, "catalog"));
          });
        }
      });
    }

    return images;
  }, [imagePreviewUrl, allProducts]);

  const handleOpenModal = (imageIndex: number) => {
    setModalImageIndex(imageIndex);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Carrusel unificado con imagen compuesta + productos individuales */}
      <UnifiedBundleCarousel
        bundleName={bundleName}
        bundleCompositeImages={imagePreviewUrl}
        mainProduct={mainProduct}
        allProducts={allProducts}
        onOpenModal={handleOpenModal}
      />

      {/* Modal de imagen ampliada con zoom y drag */}
      <ImageGalleryModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        images={allModalImages}
        currentIndex={modalImageIndex}
        productName={bundleName}
      />
    </div>
  );
}
