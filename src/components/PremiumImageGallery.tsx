"use client";

import React, { useState, useEffect, useRef } from "react";
import Image, { StaticImageData } from "next/image";
import emptyImg from "@/img/empty.jpeg";
import { useCloudinaryImage } from "@/hooks/useCloudinaryImage";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface PremiumImageGalleryProps {
  alt: string;
  imagePreviewUrl?: string;
  imageDetailsUrls?: string[] | string[][]; // Puede ser array de strings o array de arrays
  imagen_premium?: string[]; // URLs de imágenes premium
  video_premium?: string[]; // URLs de videos premium
  productName?: string;
}

/**
 * Galería de imágenes premium con carrusel automático y modal
 * Similar a la página de Samsung
 */
const PremiumImageGallery: React.FC<PremiumImageGalleryProps> = ({
  alt,
  imagePreviewUrl,
  imageDetailsUrls = [],
  imagen_premium = [],
  video_premium = [],
  productName = "Producto",
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImageIndex, setModalImageIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const autoPlayIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Construir array de imágenes con prioridad: videos premium -> imágenes premium -> imagen principal -> imágenes adicionales
  const images: (string | StaticImageData)[] = [];

  // 1. PRIMERO: Videos premium (si existen)
  if (video_premium && video_premium.length > 0) {
    images.push(...video_premium.filter(url => url && url.trim() !== ""));
  }

  // 2. SEGUNDO: Imágenes premium (si existen)
  if (imagen_premium && imagen_premium.length > 0) {
    images.push(...imagen_premium.filter(url => url && url.trim() !== ""));
  }

  // 3. TERCERO: Imagen principal (fallback)
  if (imagePreviewUrl && imagePreviewUrl.trim() !== "") {
    images.push(imagePreviewUrl);
  }

  // 4. CUARTO: Imágenes adicionales (fallback)
  const validDetailUrls = (imageDetailsUrls || []).filter((url) => {
    // Si es un array, tomar el primer elemento
    if (Array.isArray(url)) {
      return url[0] && typeof url[0] === 'string' && url[0].trim() !== "";
    }
    // Si es un string
    return url && typeof url === 'string' && url.trim() !== "";
  }).map((url) => {
    // Si es un array, devolver el primer elemento
    if (Array.isArray(url)) {
      return url[0];
    }
    return url;
  });
  
  images.push(...validDetailUrls);

  if (images.length === 0) {
    images.push(emptyImg);
  }

  // Auto-play del carrusel (cambia cada 4 segundos)
  useEffect(() => {
    if (isAutoPlaying && images.length > 1 && !isModalOpen) {
      autoPlayIntervalRef.current = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
      }, 4000);
    }

    return () => {
      if (autoPlayIntervalRef.current) {
        clearInterval(autoPlayIntervalRef.current);
      }
    };
  }, [isAutoPlaying, images.length, isModalOpen]);

  // Pausar auto-play cuando el modal está abierto
  useEffect(() => {
    if (isModalOpen) {
      setIsAutoPlaying(false);
    }
  }, [isModalOpen]);

  const goToPrevious = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const goToImage = (index: number) => {
    setCurrentImageIndex(index);
    setIsAutoPlaying(false); // Pausar auto-play cuando el usuario navega manualmente
    setTimeout(() => setIsAutoPlaying(true), 10000); // Reanudar después de 10 segundos
  };

  const openModal = (index: number = currentImageIndex) => {
    setModalImageIndex(index);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const goToModalPrevious = () => {
    setModalImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToModalNext = () => {
    setModalImageIndex((prev) => (prev + 1) % images.length);
  };

  // Navegación con teclado en el modal
  useEffect(() => {
    if (!isModalOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
      if (e.key === "ArrowLeft") goToModalPrevious();
      if (e.key === "ArrowRight") goToModalNext();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isModalOpen, modalImageIndex]);

  const currentImageSrc = images[currentImageIndex];
  const cloudinaryImage = useCloudinaryImage({
    src: typeof currentImageSrc === "string" ? currentImageSrc : currentImageSrc.src,
    transformType: "product-detail",
    responsive: true,
  });

  const modalImageSrc = images[modalImageIndex];
  const modalCloudinaryImage = useCloudinaryImage({
    src: typeof modalImageSrc === "string" ? modalImageSrc : modalImageSrc.src,
    transformType: "product-detail",
    responsive: true,
  });

  // Máximo de miniaturas visibles antes de mostrar "+X más"
  const maxVisibleThumbnails = 5;
  const hasMoreImages = images.length > maxVisibleThumbnails;
  const visibleImages = hasMoreImages
    ? images.slice(0, maxVisibleThumbnails)
    : images;
  const remainingCount = images.length - maxVisibleThumbnails;

  return (
    <>
      <div className="w-full">
        {/* Carrusel principal */}
        <div className="relative w-full bg-white rounded-2xl overflow-hidden">
          {/* Flechas de navegación */}
          {images.length > 1 && (
            <>
              <button
                className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/90 hover:bg-white shadow-lg flex items-center justify-center transition-all hover:scale-110"
                onClick={goToPrevious}
                aria-label="Imagen anterior"
              >
                <ChevronLeft className="w-6 h-6 text-gray-700" />
              </button>
              <button
                className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/90 hover:bg-white shadow-lg flex items-center justify-center transition-all hover:scale-110"
                onClick={goToNext}
                aria-label="Imagen siguiente"
              >
                <ChevronRight className="w-6 h-6 text-gray-700" />
              </button>
            </>
          )}

          {/* Imagen principal */}
          <div
            className="relative w-full h-[600px] sm:h-[700px] flex items-center justify-center cursor-pointer group"
            onClick={() => openModal(currentImageIndex)}
          >
            <Image
              src={cloudinaryImage.src}
              alt={`${alt} - Imagen ${currentImageIndex + 1}`}
              width={cloudinaryImage.width}
              height={cloudinaryImage.height}
              className="object-contain max-h-full w-auto transition-all group-hover:scale-105"
              sizes={cloudinaryImage.imageProps.sizes}
              priority={currentImageIndex === 0}
            />

            {/* Indicadores de posición */}
            {images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {images.map((_, index) => (
                  <button
                    key={index}
                    className={`h-2 rounded-full transition-all ${
                      index === currentImageIndex
                        ? "w-8 bg-black"
                        : "w-2 bg-gray-400 hover:bg-gray-600"
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      goToImage(index);
                    }}
                    aria-label={`Ir a imagen ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Miniaturas */}
        {images.length > 1 && (
          <div className="flex justify-center gap-3 mt-6 px-4">
            {visibleImages.map((image, index) => {
              const thumbnailSrc = typeof image === "string" ? image : image.src;

              return (
                <button
                  key={`thumbnail-${index}`}
                  className={`relative w-20 h-20 rounded-xl overflow-hidden transition-all border-2 flex-shrink-0 ${
                    index === currentImageIndex
                      ? "border-black shadow-lg scale-110 ring-2 ring-black ring-offset-2"
                      : "border-gray-300 hover:border-gray-500 opacity-70 hover:opacity-100"
                  }`}
                  onClick={() => goToImage(index)}
                  aria-label={`Ver imagen ${index + 1}`}
                >
                  <Image
                    src={thumbnailSrc}
                    alt={`${alt} - Miniatura ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </button>
              );
            })}

            {/* Indicador de más imágenes */}
            {hasMoreImages && (
              <button
                className="relative w-20 h-20 rounded-xl overflow-hidden transition-all border-2 border-gray-300 hover:border-gray-500 flex-shrink-0 flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200"
                onClick={() => openModal(maxVisibleThumbnails)}
                aria-label={`Ver ${remainingCount} imágenes más`}
              >
                <span className="text-sm font-bold text-gray-700">+{remainingCount}</span>
                <span className="text-xs text-gray-600">más</span>
              </button>
            )}
          </div>
        )}

        {/* Botón "Ver más" */}
        {images.length > 5 && (
          <div className="flex justify-center mt-6">
            <button
              onClick={() => openModal(currentImageIndex)}
              className="px-8 py-3 bg-white border-2 border-gray-300 rounded-full font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all shadow-sm hover:shadow-md"
            >
              Ver más fotos
            </button>
          </div>
        )}
      </div>

      {/* Modal de galería completa */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={closeModal}
        >
          {/* Contenedor del modal */}
          <div
            className="relative max-w-6xl w-full h-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Botón cerrar */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 z-10 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all"
              aria-label="Cerrar"
            >
              <X className="w-6 h-6 text-white" />
            </button>

            {/* Flechas de navegación en el modal */}
            {images.length > 1 && (
              <>
                <button
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-14 h-14 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all"
                  onClick={goToModalPrevious}
                  aria-label="Imagen anterior"
                >
                  <ChevronLeft className="w-8 h-8 text-white" />
                </button>
                <button
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-14 h-14 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all"
                  onClick={goToModalNext}
                  aria-label="Imagen siguiente"
                >
                  <ChevronRight className="w-8 h-8 text-white" />
                </button>
              </>
            )}

            {/* Imagen en el modal */}
            <div className="relative w-full h-full flex items-center justify-center">
              <Image
                src={modalCloudinaryImage.src}
                alt={`${alt} - Imagen ${modalImageIndex + 1} (modal)`}
                width={modalCloudinaryImage.width}
                height={modalCloudinaryImage.height}
                className="object-contain max-h-full max-w-full"
                sizes="100vw"
              />
            </div>

            {/* Contador de imágenes en el modal */}
            {images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full text-sm">
                {modalImageIndex + 1} / {images.length}
              </div>
            )}

            {/* Miniaturas en el modal */}
            {images.length > 1 && (
              <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex gap-2 max-w-full overflow-x-auto px-4 pb-2">
                {images.map((image, index) => {
                  const thumbnailSrc =
                    typeof image === "string" ? image : image.src;

                  return (
                    <button
                      key={`modal-thumbnail-${index}`}
                      className={`relative w-16 h-16 rounded-lg overflow-hidden transition-all border-2 flex-shrink-0 ${
                        index === modalImageIndex
                          ? "border-white shadow-lg scale-110"
                          : "border-white/30 hover:border-white/60 opacity-70 hover:opacity-100"
                      }`}
                      onClick={() => setModalImageIndex(index)}
                      aria-label={`Ver imagen ${index + 1}`}
                    >
                      <Image
                        src={thumbnailSrc}
                        alt={`${alt} - Miniatura ${index + 1}`}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default PremiumImageGallery;

