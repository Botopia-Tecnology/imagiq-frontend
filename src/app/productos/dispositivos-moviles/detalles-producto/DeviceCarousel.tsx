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
