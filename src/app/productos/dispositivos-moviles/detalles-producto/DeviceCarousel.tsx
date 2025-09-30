// Carrusel de imágenes del dispositivo
// Componente reutilizable para mostrar la imagen principal del dispositivo y navegación
import React from "react";
import Image, { StaticImageData } from "next/image";

interface DeviceCarouselProps {
  deviceImage: StaticImageData;
  alt: string;
}

/**
 * Carrusel de dispositivo con imagen y navegación (placeholder).
 */
const DeviceCarousel: React.FC<DeviceCarouselProps> = ({
  deviceImage,
  alt,
}) => {
  // TODO: Mejorar para múltiples imágenes si es necesario
  return (
    <div className="relative bg-gray-100 rounded-2xl p-8 w-full max-w-2xl">
      {/* Flechas de navegación (placeholder) */}
      <button
        className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 text-2xl z-10"
        aria-label="Anterior dispositivo"
        tabIndex={-1}
        disabled
      >
        ‹
      </button>
      <button
        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 text-2xl z-10"
        aria-label="Siguiente dispositivo"
        tabIndex={-1}
        disabled
      >
        ›
      </button>
      {/* Imagen del dispositivo */}
      <div className="flex justify-center">
        <Image
          src={deviceImage}
          alt={alt}
          width={1000}
          height={1600}
          className="object-contain drop-shadow-2xl"
          priority
        />
      </div>
      {/* Puntos indicadores (placeholder) */}
      <div className="flex justify-center space-x-2 mt-6">
        {[0, 1, 2, 3].map((index) => (
          <div
            key={index}
            className={`w-2 h-2 rounded-full ${
              index === 0 ? "bg-blue-600" : "bg-gray-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default DeviceCarousel;
