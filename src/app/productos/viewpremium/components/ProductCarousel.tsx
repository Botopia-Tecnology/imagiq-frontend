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
  setSelectedColor: React.Dispatch<React.SetStateAction<string | null>>;
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
      className="w-full h-full object-cover"
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
  setSelectedColor,
}, ref) => {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  const handleVideoStart = () => {
    setIsVideoPlaying(true);
  };

  const handleVideoEnd = () => {
    setIsVideoPlaying(false);
  };

  return (
    <div ref={ref} className="w-full relative px-4 md:px-8">
      {/* Carrusel premium - estilo Samsung más grande */}
      <div className={`relative w-full transition-all duration-700 ease-in-out ${showStickyCarousel ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
        {(() => {
          // Determinar qué imágenes usar según el estado del scroll
          // Para el carrusel premium, usar SOLO las imágenes del API (sin contenido mockeado)
          const currentImages = showStickyCarousel 
            ? premiumImages
            : productImages;
          const currentImageSet = showStickyCarousel ? 'premium' : 'product';
          
          return currentImages.length > 0 ? (
            <>
              {/* Imagen principal - estilo Samsung más grande */}
              <div className="relative w-full h-[700px] bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center overflow-hidden">
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
                      <div className="relative w-full h-full flex items-center justify-center">
                        <VideoPlayer 
                          src={currentSrc} 
                          alt={`${product.name} - ${currentImageSet === 'premium' ? 'Premium' : 'Producto'} ${currentImageIndex + 1}`}
                          onVideoStart={handleVideoStart}
                          onVideoEnd={handleVideoEnd}
                        />
                        
                        {/* Botón de pausa/play estilo Samsung - parte inferior izquierda */}
                        <button
                          onClick={() => {
                            const video = document.querySelector('video');
                            if (video) {
                              if (video.paused) {
                                video.play();
                                setIsVideoPlaying(true);
                              } else {
                                video.pause();
                                setIsVideoPlaying(false);
                              }
                            }
                          }}
                          className="absolute bottom-6 right-6 w-12 h-12 rounded-full bg-black/70 hover:bg-black/90 backdrop-blur-sm flex items-center justify-center transition-all hover:scale-110 z-10"
                        >
                          {isVideoPlaying ? (
                            <div className="w-3 h-3 flex gap-1">
                              <div className="w-1 h-3 bg-white rounded-sm"></div>
                              <div className="w-1 h-3 bg-white rounded-sm"></div>
                            </div>
                          ) : (
                            <div className="w-0 h-0 border-l-[6px] border-l-white border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent ml-0.5"></div>
                          )}
                        </button>
                      </div>
                    );
                  } else {
                    return (
                      <img
                        key={currentSrc}
                        src={currentSrc}
                        alt={`${product.name} - ${currentImageSet === 'premium' ? 'Premium' : 'Producto'} ${currentImageIndex + 1}`}
                        className={`w-full h-full ${currentImageSet === 'premium' ? 'object-cover' : 'object-contain p-8'}`}
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
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/95 hover:bg-white shadow-lg flex items-center justify-center transition-all hover:scale-105"
                    >
                      <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <button
                      onClick={() => setCurrentImageIndex((prev) => (prev + 1) % currentImages.length)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/95 hover:bg-white shadow-lg flex items-center justify-center transition-all hover:scale-105"
                    >
                      <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </>
                )}
              </div>
              
              {/* Puntos de navegación - PARA AMBOS CARRUSELES - CÍRCULOS */}
              {currentImages.length > 1 && (
                <div className="flex justify-center gap-2 mt-6 mb-4">
                  {currentImages.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        index === currentImageIndex
                          ? "bg-black scale-110"
                          : "bg-gray-300 hover:bg-gray-400 hover:scale-105"
                      }`}
                    />
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="w-full h-[700px] bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center text-gray-500 text-lg font-semibold">
              <div className="text-center">
                <div className="text-6xl mb-4">📱</div>
                <div>Contenido premium no disponible</div>
              </div>
            </div>
          );
        })()}
      </div>

      {/* Segundo carrusel - Solo imágenes del color seleccionado (más pequeño) */}
      <div className={`absolute top-[5%] left-0 right-0 bottom-0 w-full transition-all duration-700 ease-in-out ${!showStickyCarousel ? 'opacity-100 scale-100' : 'opacity-0 scale-105 pointer-events-none'}`}>
        {productImages.length > 0 ? (
          <>
            {/* Imagen del producto - más pequeña y simple */}
            <div className="relative w-full h-[600px] bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center overflow-hidden">
              {/* Iconos de colores - SOLO en el segundo carrusel */}
              {product.colors && product.colors.length > 0 && (
                <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
                  {product.colors.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => {
                        setSelectedColor(color.name);
                        setCurrentImageIndex(0);
                      }}
                      className={`w-8 h-8 rounded-full border-2 transition-all hover:scale-110 ${
                        selectedColor === color.name 
                          ? 'border-black shadow-lg scale-110' 
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                      style={{ backgroundColor: color.hex }}
                      title={color.label || color.name}
                    />
                  ))}
                </div>
              )}
              {(() => {
                const currentSrc = productImages[currentImageIndex % productImages.length];
                 
                return (
                  <img
                    key={currentSrc}
                    src={currentSrc}
                    alt={`${product.name} - ${selectedColor} ${(currentImageIndex % productImages.length) + 1}`}
                    className="w-full h-full object-contain p-4"
                    onError={(e) => {
                      console.error('Error loading image:', currentSrc, e);
                    }}
                  />
                );
              })()}
            </div>
            {/* Botón Ver más - estilo Samsung */}
            <div className="flex justify-center mt-6">
              <button
                onClick={onOpenModal}
                className="px-6 py-2.5 bg-black text-white rounded-full text-sm font-medium hover:bg-gray-800 transition-all hover:scale-105"
              >
                Ver más
              </button>
            </div>
          </>
        ) : (
          <div className="w-full h-[500px] bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center text-gray-500 text-lg font-semibold rounded-2xl">
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