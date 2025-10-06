// Carrusel de imágenes del dispositivo
// Componente reutilizable para mostrar la imagen principal del dispositivo y navegación
import React, { useState, useEffect } from "react";
import Image, { StaticImageData } from "next/image";
import emptyImg from "@/img/empty.jpeg";

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
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  
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
  
  const goToPrevious = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };
  
  const goToNext = () => {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };
  
  const goToImage = (index: number) => {
    setCurrentImageIndex(index);
    setImageLoading(true);
    setImageError(false);
  };

  // Reset loading state cuando cambian las imágenes
  useEffect(() => {
    setImageLoading(true);
    setImageError(false);
  }, [currentImageIndex, imagePreviewUrl]);

  return (
    <div className="relative rounded-2xl px-2 py-2 w-full max-w-2xl bg-gray-100">
      {/* Flechas de navegación */}
      {images.length > 1 && (
        <>
          <button
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 text-4xl z-10 transition-colors w-12 h-12 flex items-center justify-center rounded-full hover:bg-gray-100"
            aria-label="Imagen anterior"
            onClick={goToPrevious}
          >
            ‹
          </button>
          <button
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 text-4xl z-10 transition-colors w-12 h-12 flex items-center justify-center rounded-full hover:bg-gray-100"
            aria-label="Imagen siguiente"
            onClick={goToNext}
          >
            ›
          </button>
        </>
      )}
      
      {/* Imagen del dispositivo con altura fija */}
      <div
        className="flex justify-center h-[500px] items-center relative cursor-pointer group"
        onClick={() => onImageClick?.(images, currentImageIndex)}
      >
        {/* Skeleton loader mientras carga la imagen */}
        {imageLoading && !imageError && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-pulse bg-gray-200 rounded-lg w-[80%] h-[80%] flex items-center justify-center">
              <svg 
                className="w-24 h-24 text-gray-300" 
                fill="currentColor" 
                viewBox="0 0 20 20"
              >
                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        )}
        
        <Image
          src={images[currentImageIndex] || emptyImg}
          alt={`${alt} - Imagen ${currentImageIndex + 1}`}
          width={1000}
          height={1600}
          className={`object-contain transition-opacity duration-300 max-h-full w-auto group-hover:opacity-90 ${
            imageLoading ? 'opacity-0' : 'opacity-100'
          }`}
          priority={currentImageIndex === 0}
          onLoad={() => setImageLoading(false)}
          onError={(e) => {
            // Si la imagen falla al cargar, usar empty.jpg
            const target = e.target as HTMLImageElement;
            target.src = emptyImg.src;
            setImageLoading(false);
            setImageError(true);
          }}
        />
      </div>
      
      {/* Puntos indicadores */}
      {images.length > 1 && (
        <div className="flex justify-center space-x-2 mt-6">
          {images.map((image, index) => (
            <button
              key={`image-${index}-${typeof image === 'string' ? image : 'static'}`}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentImageIndex ? "bg-blue-600" : "bg-gray-300 hover:bg-gray-400"
              }`}
              onClick={() => goToImage(index)}
              aria-label={`Ir a imagen ${index + 1}`}
            />
          ))}
        </div>
      )}

    </div>
  );
};

export default DeviceCarousel;
