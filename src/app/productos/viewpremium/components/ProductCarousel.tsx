"use client";

import React, { forwardRef, useState } from "react";
import { ProductCardProps } from "@/app/productos/components/ProductCard";

interface ProductCarouselProps {
  product: ProductCardProps;
  selectedColor: string | null;
  currentImageIndex: number;
  setCurrentImageIndex: React.Dispatch<React.SetStateAction<number>>;
  showStickyCarousel: boolean;
  premiumImages: string[];
  productImages: string[];
  onOpenModal: () => void;
}

// Componente para manejar videos con control de reproducción
const VideoPlayer: React.FC<{ 
  src: string; 
  alt: string; 
  onVideoEnd?: () => void;
  onVideoStart?: () => void;
}> = ({ src, alt, onVideoEnd, onVideoStart }) => {
  const [videoError, setVideoError] = useState(false);
  
  // Usar directamente el tag video HTML5 para mejor compatibilidad
  if (videoError) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100">
        <div className="text-center text-gray-500">
          <div className="text-4xl mb-2">🎥</div>
          <div>Video no disponible</div>
        </div>
      </div>
    );
  }

  return (
    <video
      src={src}
      autoPlay
      loop
      muted
      playsInline
      controls={false}
      className="w-full h-full object-contain"
      onEnded={onVideoEnd}
      onPlay={onVideoStart}
      onError={(e) => {
        console.error('Error loading video:', src, e);
        setVideoError(true);
      }}
      onLoadStart={() => console.log('Video loading started:', src)}
      onCanPlay={() => console.log('Video can play:', src)}
    />
  );
};

const ProductCarousel = forwardRef<HTMLDivElement, ProductCarouselProps>(({
  product,
  selectedColor,
  currentImageIndex,
  setCurrentImageIndex,
  showStickyCarousel,
  premiumImages,
  productImages,
  onOpenModal,
}, ref) => {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  const handleVideoStart = () => {
    setIsVideoPlaying(true);
  };

  const handleVideoEnd = () => {
    setIsVideoPlaying(false);
  };

  return (
    <div ref={ref} className="w-full lg:col-span-9 lg:sticky lg:top-20 relative">
      {/* Carrusel de imágenes reales */}
      <div className={`relative w-full transition-opacity duration-500 ease-in-out ${showStickyCarousel ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        {(() => {
          // Determinar qué imágenes usar según el estado del scroll
          // Para el carrusel premium, usar SOLO las imágenes del API (sin contenido mockeado)
          const currentImages = showStickyCarousel 
            ? premiumImages
            : productImages;
          const currentImageSet = showStickyCarousel ? 'premium' : 'product';
          
          return currentImages.length > 0 ? (
            <>
              {/* Imagen principal - estilo Samsung */}
              <div className="relative w-full h-[600px] bg-white flex items-center justify-center">
                {(() => {
                  const currentSrc = currentImages[currentImageIndex];
                  const isVideo = currentSrc && (
                    currentSrc.includes('.webm') || 
                    currentSrc.includes('.mp4') || 
                    currentSrc.includes('.mov') ||
                    currentSrc.includes('video/upload')
                  );
                  
                  if (isVideo) {
                    return (
                      <div className="w-full h-full flex items-center justify-center">
                        <VideoPlayer 
                          src={currentSrc} 
                          alt={`${product.name} - ${currentImageSet === 'premium' ? 'Premium' : 'Producto'} ${currentImageIndex + 1}`}
                          onVideoStart={handleVideoStart}
                          onVideoEnd={handleVideoEnd}
                        />
                      </div>
                    );
                  } else {
                    return (
                      <img
                        key={currentSrc}
                        src={currentSrc}
                        alt={`${product.name} - ${currentImageSet === 'premium' ? 'Premium' : 'Producto'} ${currentImageIndex + 1}`}
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          console.error('Error loading image:', currentSrc, e);
                        }}
                      />
                    );
                  }
                })()}
                
                {/* Flechas de navegación - estilo Samsung */}
                {currentImages.length > 1 && (
                  <>
                    <button
                      onClick={() => setCurrentImageIndex((prev) => prev === 0 ? currentImages.length - 1 : prev - 1)}
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/80 hover:bg-white shadow-lg flex items-center justify-center transition-all hover:scale-110 border border-gray-200"
                    >
                      <span className="text-gray-600 text-xl">‹</span>
                    </button>
                    <button
                      onClick={() => setCurrentImageIndex((prev) => (prev + 1) % currentImages.length)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/80 hover:bg-white shadow-lg flex items-center justify-center transition-all hover:scale-110 border border-gray-200"
                    >
                      <span className="text-gray-600 text-xl">›</span>
                    </button>
                  </>
                )}
              </div>
              
              {/* Puntos de navegación - estilo Samsung */}
              {currentImages.length > 1 && (
                <div className="flex justify-center gap-2 mt-6">
                  {currentImages.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`h-2 rounded-full transition-all ${
                        index === currentImageIndex
                          ? "w-8 bg-gray-800"
                          : "w-2 bg-gray-300 hover:bg-gray-500"
                      }`}
                    />
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="w-full h-[600px] bg-white flex items-center justify-center text-gray-500 text-lg font-semibold">
              <div className="text-center">
                <div className="text-6xl mb-4">📱</div>
                <div>Imagen no disponible</div>
              </div>
            </div>
          );
        })()}
      </div>

      {/* Segundo carrusel - Solo imágenes del color seleccionado */}
      <div className={`absolute top-[5%] left-0 right-0 bottom-0 w-full transition-opacity duration-500 ease-in-out ${!showStickyCarousel ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        {productImages.length > 0 ? (
          <>
            {/* Imagen del producto - estilo Samsung */}
            <div className="relative w-full h-[600px] bg-white flex items-center justify-center">
              {(() => {
                const currentSrc = productImages[currentImageIndex % productImages.length];
                 
                return (
                  <img
                    key={currentSrc}
                    src={currentSrc}
                    alt={`${product.name} - ${selectedColor} ${(currentImageIndex % productImages.length) + 1}`}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      console.error('Error loading image:', currentSrc, e);
                    }}
                  />
                );
              })()}
            </div>
            {/* Botón pegado a la primera foto */}
            <div className="flex justify-center mt-2">
              <button
                onClick={onOpenModal}
                className="px-8 py-3 bg-white border-2 border-gray-300 rounded-full font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all shadow-sm hover:shadow-md"
              >
                Ver más
              </button>
            </div>
          </>
        ) : (
          <div className="w-full h-[600px] bg-white flex items-center justify-center text-gray-500 text-lg font-semibold">
            <div className="text-center">
              <div className="text-4xl mb-2">🎨</div>
              <div>No hay fotos específicas para el color {selectedColor}</div>
              <div className="text-sm mt-2">Selecciona otro color para ver más fotos</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

ProductCarousel.displayName = 'ProductCarousel';

export default ProductCarousel;