"use client";

import React from "react";
import { ProductCardProps } from "@/app/productos/components/ProductCard";

interface ImageModalProps {
  isOpen: boolean;
  productImages: string[];
  modalImageIndex: number;
  slideDirection: 'left' | 'right';
  product: ProductCardProps;
  selectedColor: string | null;
  onClose: () => void;
  onNextImage: () => void;
  onPrevImage: () => void;
  onGoToImage: (index: number) => void;
}

const ImageModal: React.FC<ImageModalProps> = ({
  isOpen,
  productImages,
  modalImageIndex,
  slideDirection,
  product,
  selectedColor,
  onClose,
  onNextImage,
  onPrevImage,
  onGoToImage,
}) => {
  if (!isOpen || productImages.length === 0) return null;

  return (
    <>
      {/* Estilos CSS para animaciones */}
      <style jsx>{`
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        @keyframes slideInLeft {
          from {
            transform: translateX(-100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        .animate-slide-in-right {
          animation: slideInRight 0.5s ease-in-out;
        }
        
        .animate-slide-in-left {
          animation: slideInLeft 0.5s ease-in-out;
        }
      `}</style>
      
      <div className="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center p-8">
        <div className="relative w-full h-full max-w-6xl max-h-[90vh] bg-white rounded-2xl shadow-2xl flex items-center justify-center overflow-hidden">
          {/* Botón cerrar */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-[10000] w-10 h-10 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center text-gray-800 text-xl transition-all"
          >
            ×
          </button>

          {/* Imagen principal con efecto slide */}
          <div className="relative w-full h-full flex items-center justify-center">
            <img
              key={modalImageIndex}
              src={productImages[modalImageIndex]}
              alt={`${product.name} - ${selectedColor} ${modalImageIndex + 1}`}
              className={`w-full h-full object-contain ${
                slideDirection === 'right' 
                  ? 'animate-slide-in-right' 
                  : 'animate-slide-in-left'
              }`}
            />
          </div>

          {/* Flechas de navegación */}
          {productImages.length > 1 && (
            <>
              <button
                onClick={onPrevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center text-gray-800 text-2xl transition-all"
              >
                ‹
              </button>
              <button
                onClick={onNextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center text-gray-800 text-2xl transition-all"
              >
                ›
              </button>
            </>
          )}

          {/* Puntos de navegación */}
          {productImages.length > 1 && (
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
              {productImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => onGoToImage(index)}
                  className={`h-2 rounded-full transition-all ${
                    index === modalImageIndex
                      ? "w-8 bg-gray-800"
                      : "w-2 bg-gray-400 hover:bg-gray-600"
                  }`}
                />
              ))}
            </div>
          )}

          {/* Información del color */}
          <div className="absolute bottom-8 left-8 text-gray-800">
            <div className="text-lg font-semibold">{selectedColor}</div>
            <div className="text-sm opacity-75">
              {modalImageIndex + 1} de {productImages.length}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ImageModal;
