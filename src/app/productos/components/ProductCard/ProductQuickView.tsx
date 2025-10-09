/**
 * ProductQuickView - Modal de vista rápida tipo Samsung
 * Muestra preview del producto con imagen, precio, colores y botón de compra
 */

"use client";

import { Fragment, useMemo, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { X } from "lucide-react";
import { ProductColor, ProductCapacity } from "../ProductCard";
import ImageGallery from "./ImageGallery";
import QuickViewDetails from "./QuickViewDetails";
import QuickViewActions from "./QuickViewActions";
import { useDeviceVariants } from "@/hooks/useDeviceVariants";

interface ProductQuickViewProps {
  isOpen: boolean;
  onClose: () => void;
  product: {
    id: string;
    name: string;
    image: string | { src: string };
    price?: string;
    originalPrice?: string;
    colors?: ProductColor[];
    capacities?: ProductCapacity[];
    rating?: number;
    reviewCount?: number;
  };
  selectedColor: ProductColor | null;
  selectedCapacity: ProductCapacity | null;
  onColorSelect: (color: ProductColor) => void;
  onCapacitySelect: (capacity: ProductCapacity) => void;
  onAddToCart: () => void;
  onViewDetails: () => void;
}

export default function ProductQuickView({
  isOpen,
  onClose,
  product,
  selectedColor,
  selectedCapacity,
  onColorSelect,
  onCapacitySelect,
  onAddToCart,
  onViewDetails,
}: ProductQuickViewProps) {
  // Solo cargar variantes cuando el modal esté abierto
  const [shouldLoadVariants, setShouldLoadVariants] = useState(false);
  
  useEffect(() => {
    if (isOpen) {
      setShouldLoadVariants(true);
    }
  }, [isOpen]);

  const { selectedVariant } = useDeviceVariants(shouldLoadVariants ? product.id : "");

  // Memoizar las imágenes para evitar recálculos
  const allImages = useMemo(() => {
    if (selectedVariant?.imageDetailsUrls && selectedVariant.imageDetailsUrls.length > 0) {
      return selectedVariant.imageDetailsUrls;
    } else if (selectedVariant?.imagePreviewUrl) {
      return [selectedVariant.imagePreviewUrl];
    } else if (typeof product.image === "string") {
      return [product.image];
    } else {
      return [product.image.src];
    }
  }, [selectedVariant?.imageDetailsUrls, selectedVariant?.imagePreviewUrl, product.image]);

  const currentPrice = selectedCapacity?.price || selectedColor?.price || product.price;
  const currentOriginalPrice =
    selectedCapacity?.originalPrice || selectedColor?.originalPrice || product.originalPrice;
  
  // No renderizar nada si el modal no está abierto
  if (!isOpen) return null;

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        {/* Overlay con fondo negro translúcido */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" />
        </Transition.Child>

        {/* Contenedor responsivo - widget desde abajo en mobile, modal en desktop */}
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-end md:items-center justify-center md:p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-full md:translate-y-0 md:scale-95"
              enterTo="opacity-100 translate-y-0 md:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 md:scale-100"
              leaveTo="opacity-0 translate-y-full md:translate-y-0 md:scale-95"
            >
              {/* Panel con bordes superiores curvados y espacio arriba en mobile */}
              <Dialog.Panel className="w-full md:max-w-2xl max-h-[92vh] md:h-auto transform overflow-hidden rounded-t-3xl md:rounded-2xl bg-white shadow-xl transition-all mt-auto">
                {/* Header con X para cerrar */}
                <div className="sticky top-0 z-10 flex items-center justify-between bg-white px-4 py-3 md:p-4 rounded-t-3xl md:rounded-t-2xl border-b">
                  <Dialog.Title className="text-base md:text-lg font-bold text-gray-900">
                    Vista Rápida
                  </Dialog.Title>
                  <button
                    onClick={onClose}
                    className="rounded-full p-1.5 hover:bg-gray-100 transition-colors"
                    aria-label="Cerrar"
                  >
                    <X className="w-6 h-6 md:w-5 md:h-5 stroke-[2.5]" />
                  </button>
                </div>

                {/* Content - scroll interno */}
                <div className="overflow-y-auto max-h-[calc(92vh-60px)] md:max-h-none">
                  <div className="flex flex-col md:grid md:grid-cols-2 gap-4 md:gap-6 p-4 md:p-6">
                    {/* Galería de imágenes */}
                    <ImageGallery 
                      images={allImages} 
                      productName={product.name}
                    />

                    {/* Detalles del producto */}
                    <div className="flex flex-col">
                      <QuickViewDetails
                        product={product}
                        selectedColor={selectedColor}
                        selectedCapacity={selectedCapacity}
                        currentPrice={currentPrice}
                        currentOriginalPrice={currentOriginalPrice}
                        onColorSelect={onColorSelect}
                        onCapacitySelect={onCapacitySelect}
                      />

                      {/* Botones de acción */}
                      <QuickViewActions
                        onAddToCart={onAddToCart}
                        onViewDetails={onViewDetails}
                      />
                    </div>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
