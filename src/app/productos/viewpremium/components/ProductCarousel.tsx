"use client";

import React, { forwardRef } from "react";
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
  return (
    <div ref={ref} className="w-full lg:col-span-9 lg:sticky lg:top-20 relative">
      {/* Carrusel de imágenes reales */}
      <div className={`relative w-full transition-opacity duration-500 ease-in-out ${showStickyCarousel ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        {(() => {
          // Determinar qué imágenes usar según el estado del scroll
          const currentImages = showStickyCarousel ? premiumImages : productImages;
          const currentImageSet = showStickyCarousel ? 'premium' : 'product';
          
          return currentImages.length > 0 ? (
            <>
              {/* Imagen principal - estilo Samsung */}
              <div className="relative w-full h-[600px] bg-white flex items-center justify-center">
                <img
                  src={currentImages[currentImageIndex]}
                  alt={`${product.name} - ${currentImageSet === 'premium' ? 'Premium' : 'Producto'} ${currentImageIndex + 1}`}
                  className="w-full h-full object-contain"
                />
                
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
      <div className={`absolute inset-0 w-full transition-opacity duration-500 ease-in-out ${!showStickyCarousel ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        {productImages.length > 0 ? (
          <>
            {/* Imagen del producto - estilo Samsung */}
            <div className="relative w-full h-[600px] bg-white flex items-center justify-center">
              <img
                src={productImages[currentImageIndex % productImages.length]}
                alt={`${product.name} - ${selectedColor} ${(currentImageIndex % productImages.length) + 1}`}
                className="w-full h-full object-contain"
              />
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
