// Carrusel de imágenes del dispositivo
// Componente reutilizable para mostrar la imagen principal del dispositivo y navegación
import React, { useState } from "react";
import Image, { StaticImageData } from "next/image";

interface DeviceCarouselProps {
  deviceImage: StaticImageData;
  alt: string;
  imageUrls?: string[];
}

/**
 * Carrusel de dispositivo con imagen y navegación funcional.
 */
const DeviceCarousel: React.FC<DeviceCarouselProps> = ({
  deviceImage,
  alt,
  imageUrls = [],
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Si hay URLs de imágenes, usarlas; de lo contrario, usar la imagen por defecto
  const images = imageUrls.length > 0 ? imageUrls : [deviceImage];
  
  const goToPrevious = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };
  
  const goToNext = () => {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };
  
  const goToImage = (index: number) => {
    setCurrentImageIndex(index);
  };

  return (
    <div className="relative bg-gray-100 rounded-2xl p-8 w-full max-w-2xl">
      {/* Flechas de navegación */}
      {images.length > 1 && (
        <>
          <button
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 text-2xl z-10 transition-colors"
            aria-label="Imagen anterior"
            onClick={goToPrevious}
          >
            ‹
          </button>
          <button
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 text-2xl z-10 transition-colors"
            aria-label="Imagen siguiente"
            onClick={goToNext}
          >
            ›
          </button>
        </>
      )}
      
      {/* Imagen del dispositivo */}
      <div className="flex justify-center">
        <Image
          src={images[currentImageIndex]}
          alt={`${alt} - Imagen ${currentImageIndex + 1}`}
          width={1000}
          height={1600}
          className="object-contain drop-shadow-2xl transition-opacity duration-300"
          priority={currentImageIndex === 0}
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
