// Carrusel de imágenes del dispositivo
// Componente reutilizable para mostrar la imagen principal del dispositivo y navegación
import React, { useState } from "react";
import Image, { StaticImageData } from "next/image";
import emptyImg from "@/img/empty.jpeg";
import { useCloudinaryImage } from "@/hooks/useCloudinaryImage";

interface DeviceCarouselProps {
  alt: string;
  imagePreviewUrl?: string;
  imageDetailsUrls?: string[];
  onImageClick?: (images: (string | StaticImageData)[], currentIndex: number) => void;
}

/**
 * Carrusel de dispositivo con imagen y navegación funcional.
 */
const DeviceCarousel: React.FC<DeviceCarouselProps> = ({
  alt,
  imagePreviewUrl,
  imageDetailsUrls = [],
  onImageClick,
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Construir array de imágenes: imagePreviewUrl primero, luego imageDetailsUrls
  const images: (string | StaticImageData)[] = [];

  // Agregar imagePreviewUrl como primera imagen si existe y no está vacío
  if (imagePreviewUrl && imagePreviewUrl.trim() !== '') {
    images.push(imagePreviewUrl);
  }

  // Agregar imageDetailsUrls, filtrando URLs vacías
  const validDetailUrls = imageDetailsUrls.filter(url => url && url.trim() !== '');
  images.push(...validDetailUrls);

  // Si no hay imágenes válidas del backend, usar empty.jpg
  if (images.length === 0) {
    images.push(emptyImg);
  }

  // Obtener imagen actual optimizada con Cloudinary para detalles de producto
  const currentImageSrc = images[currentImageIndex];
  const cloudinaryImage = useCloudinaryImage({
    src: typeof currentImageSrc === "string" ? currentImageSrc : currentImageSrc.src,
    transformType: "product-detail",
    responsive: true,
  });
  
  const goToPrevious = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };
  
  const goToNext = () => {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };
  
  const goToImage = (index: number) => {
    setCurrentImageIndex(index);
  };

  // Máximo de miniaturas visibles antes de mostrar "+X más"
  const maxVisibleThumbnails = 5;
  const hasMoreImages = images.length > maxVisibleThumbnails;
  const visibleImages = hasMoreImages ? images.slice(0, maxVisibleThumbnails) : images;
  const remainingCount = images.length - maxVisibleThumbnails;

  return (
    <div className="w-full">
      {/* Carrusel con fondo gris */}
      <div className="relative rounded-2xl px-4 py-4 w-full bg-gray-50">
        {/* Flechas de navegación */}
        {images.length > 1 && (
          <>
            <button
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 text-4xl z-10 transition-colors w-12 h-12 flex items-center justify-center rounded-full hover:bg-white/80"
              aria-label="Imagen anterior"
              onClick={goToPrevious}
            >
              ‹
            </button>
            <button
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 text-4xl z-10 transition-colors w-12 h-12 flex items-center justify-center rounded-full hover:bg-white/80"
              aria-label="Imagen siguiente"
              onClick={goToNext}
            >
              ›
            </button>
          </>
        )}

        {/* Imagen del dispositivo con altura aumentada */}
        <div
          className="flex justify-center h-[600px] items-center relative cursor-pointer group"
          onClick={() => onImageClick?.(images, currentImageIndex)}
        >
          <Image
            src={cloudinaryImage.src}
            alt={`${alt} - Imagen ${currentImageIndex + 1}`}
            width={cloudinaryImage.width}
            height={cloudinaryImage.height}
            className="object-contain transition-opacity duration-300 max-h-full w-auto group-hover:opacity-90"
            sizes={cloudinaryImage.imageProps.sizes}
            priority={currentImageIndex === 0}
          />
        </div>
      </div>
      
      {/* Miniaturas de imágenes - Fuera del fondo gris */}
      {images.length > 1 && (
        <div className="flex justify-center gap-2 mt-4 px-4">
          {visibleImages.map((image, index) => {
            // Obtener src de la imagen
            const thumbnailSrc = typeof image === 'string' ? image : image.src;

            return (
              <button
                key={`thumbnail-${index}-${typeof image === 'string' ? image : 'static'}`}
                className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden transition-all border-2 flex-shrink-0 ${
                  index === currentImageIndex 
                    ? "border-black shadow-md scale-105" 
                    : "border-gray-200 hover:border-gray-400 opacity-70 hover:opacity-100"
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
              className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden transition-all border-2 border-gray-200 hover:border-gray-400 flex-shrink-0 flex items-center justify-center bg-gray-100 hover:bg-gray-200"
              onClick={() => onImageClick?.(images, maxVisibleThumbnails)}
              aria-label={`Ver ${remainingCount} imágenes más`}
            >
              <span className="text-xs sm:text-sm font-semibold text-gray-600">
                +{remainingCount} más
              </span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default DeviceCarousel;
