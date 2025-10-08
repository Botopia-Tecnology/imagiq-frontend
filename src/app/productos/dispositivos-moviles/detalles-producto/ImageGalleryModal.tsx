"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Image, { StaticImageData } from "next/image";
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, RotateCcw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ImageGalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  images: (string | StaticImageData)[];
  currentIndex: number;
  productName: string;
}

export default function ImageGalleryModal({
  isOpen,
  onClose,
  images,
  currentIndex: initialIndex,
  productName,
}: ImageGalleryModalProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [mounted, setMounted] = useState(false);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const MIN_SCALE = 1;
  const MAX_SCALE = 5;
  const SCALE_STEP = 0.5;

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    resetZoom();
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    resetZoom();
  };

  const goToImage = (index: number) => {
    setCurrentIndex(index);
    resetZoom();
  };

  const resetZoom = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  const handleZoomIn = () => {
    setScale((prev) => Math.min(prev + SCALE_STEP, MAX_SCALE));
  };

  const handleZoomOut = () => {
    setScale((prev) => {
      const newScale = Math.max(prev - SCALE_STEP, MIN_SCALE);
      if (newScale === MIN_SCALE) {
        setPosition({ x: 0, y: 0 });
      }
      return newScale;
    });
  };

  // Zoom con rueda del mouse
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (e.deltaY < 0) {
      handleZoomIn();
    } else {
      handleZoomOut();
    }
  };

  // Doble clic para zoom
  const handleDoubleClick = () => {
    if (scale === MIN_SCALE) {
      setScale(2.5);
    } else {
      resetZoom();
    }
  };

  // Handlers para drag cuando hay zoom
  const handleMouseDown = (e: React.MouseEvent) => {
    if (scale > MIN_SCALE) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && scale > MIN_SCALE) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Actualizar currentIndex cuando cambia initialIndex
  useEffect(() => {
    setCurrentIndex(initialIndex);
    resetZoom();
  }, [initialIndex]);

  // Asegurar que el componente esté montado antes de usar portal
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Resetear zoom cuando se cierra el modal
  useEffect(() => {
    if (!isOpen) {
      resetZoom();
    }
  }, [isOpen]);

  if (!isOpen || !mounted) return null;

  // Determinar cursor basado en el estado
  const getCursor = () => {
    if (scale <= MIN_SCALE) return 'default';
    return isDragging ? 'grabbing' : 'grab';
  };

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
                <motion.div
          key="modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[99999] flex items-center justify-center bg-white"
          onClick={onClose}
        >
          {/* Botón de cerrar */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 z-10 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
            aria-label="Cerrar galería"
          >
            <X className="w-6 h-6 text-gray-700" />
          </button>

          {/* Controles de zoom */}
          <div className="absolute top-6 left-6 z-10 flex gap-2 bg-white/90 backdrop-blur-sm rounded-lg p-2 shadow-lg">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleZoomIn();
              }}
              disabled={scale >= MAX_SCALE}
              className="p-2 rounded-md bg-gray-100 hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Acercar"
            >
              <ZoomIn className="w-5 h-5 text-gray-700" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleZoomOut();
              }}
              disabled={scale <= MIN_SCALE}
              className="p-2 rounded-md bg-gray-100 hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Alejar"
            >
              <ZoomOut className="w-5 h-5 text-gray-700" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                resetZoom();
              }}
              disabled={scale === MIN_SCALE}
              className="p-2 rounded-md bg-gray-100 hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Restablecer zoom"
            >
              <RotateCcw className="w-5 h-5 text-gray-700" />
            </button>
            <div className="flex items-center px-3 text-sm font-medium text-gray-700">
              {Math.round(scale * 100)}%
            </div>
          </div>

          {/* Contenido del modal */}
          <div
            className="w-full h-full flex items-center justify-center px-4 md:px-16 py-8 gap-8"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Imagen principal */}
            <div className="relative flex-1 h-[80vh] flex items-center justify-center overflow-hidden">
              {/* Flecha izquierda */}
              {images.length > 1 && (
                <button
                  onClick={goToPrevious}
                  className="absolute left-0 md:left-4 top-1/2 transform -translate-y-1/2 z-10 p-3 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors shadow-lg"
                  aria-label="Imagen anterior"
                >
                  <ChevronLeft className="w-6 h-6 text-gray-700" />
                </button>
              )}

              {/* Contenedor de imagen con zoom */}
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="relative w-full h-full"
                onWheel={handleWheel}
                onDoubleClick={handleDoubleClick}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                style={{
                  cursor: getCursor(),
                }}
              >
                <div
                  style={{
                    transform: `scale(${scale}) translate(${position.x / scale}px, ${position.y / scale}px)`,
                    transition: isDragging ? 'none' : 'transform 0.2s ease-out',
                    width: '100%',
                    height: '100%',
                    position: 'relative',
                  }}
                >
                  <Image
                    src={images[currentIndex]}
                    alt={`${productName} - Imagen ${currentIndex + 1}`}
                    fill
                    className="object-contain select-none"
                    priority
                    sizes="(max-width: 768px) 100vw, 70vw"
                    draggable={false}
                  />
                </div>
              </motion.div>

              {/* Flecha derecha */}
              {images.length > 1 && (
                <button
                  onClick={goToNext}
                  className="absolute right-0 md:right-4 top-1/2 transform -translate-y-1/2 z-10 p-3 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors shadow-lg"
                  aria-label="Imagen siguiente"
                >
                  <ChevronRight className="w-6 h-6 text-gray-700" />
                </button>
              )}
            </div>

            {/* Thumbnails verticales a la derecha */}
            {images.length > 1 && (
              <div className="hidden md:flex flex-col items-center gap-3 max-h-[80vh] overflow-y-auto pr-2">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => goToImage(index)}
                    className={`relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${
                      index === currentIndex
                        ? "border-[#0099FF] ring-2 ring-[#0099FF] ring-offset-2"
                        : "border-gray-200 hover:border-gray-400"
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`Thumbnail ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </button>
                ))}
                {/* Contador de imágenes */}
                <div className="mt-2 text-sm text-gray-600 text-center">
                  {currentIndex + 1} / {images.length}
                </div>
              </div>
            )}

            {/* Thumbnails horizontales en mobile */}
            {images.length > 1 && (
              <div className="md:hidden absolute bottom-8 left-0 right-0 flex items-center justify-center gap-3 px-4 overflow-x-auto">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => goToImage(index)}
                    className={`relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${
                      index === currentIndex
                        ? "border-[#0099FF] ring-2 ring-[#0099FF] ring-offset-2"
                        : "border-gray-200 hover:border-gray-400"
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`Thumbnail ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return createPortal(modalContent, document.body);
}
