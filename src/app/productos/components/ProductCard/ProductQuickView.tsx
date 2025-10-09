/**
 * ProductQuickView - Modal de vista rápida tipo Samsung
 * Muestra preview del producto con imagen, precio, colores y botón de compra
 */

"use client";

import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import Image from "next/image";
import { X } from "lucide-react";
import { ProductColor, ProductCapacity } from "../ProductCard";
import { cn } from "@/lib/utils";

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
  const imageSrc = typeof product.image === "string" ? product.image : product.image.src;
  const currentPrice = selectedCapacity?.price || selectedColor?.price || product.price;
  const currentOriginalPrice =
    selectedCapacity?.originalPrice || selectedColor?.originalPrice || product.originalPrice;

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-60" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white shadow-xl transition-all">
                {/* Header */}
                <div className="flex items-center justify-between border-b p-4">
                  <Dialog.Title className="text-lg font-bold text-gray-900">
                    Vista Rápida
                  </Dialog.Title>
                  <button
                    onClick={onClose}
                    className="rounded-full p-2 hover:bg-gray-100 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Content */}
                <div className="grid md:grid-cols-2 gap-6 p-6">
                  {/* Imagen */}
                  <div className="relative aspect-square bg-gray-50 rounded-lg overflow-hidden">
                    <Image
                      src={imageSrc}
                      alt={product.name}
                      fill
                      className="object-contain p-4"
                    />
                  </div>

                  {/* Detalles */}
                  <div className="flex flex-col">
                    {/* Título */}
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                      {product.name}
                    </h2>

                    {/* Rating */}
                    {product.rating && (
                      <div className="flex items-center gap-2 mb-4">
                        <div className="flex items-center gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={`quickview-star-${i}-${product.rating}`}
                              className="w-4 h-4 fill-current text-yellow-500"
                              viewBox="0 0 20 20"
                            >
                              <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                            </svg>
                          ))}
                        </div>
                        <span className="text-sm font-bold text-gray-900">{product.rating}</span>
                        <span className="text-sm text-gray-500">({product.reviewCount})</span>
                      </div>
                    )}

                    {/* Precio */}
                    <div className="mb-6">
                      {currentOriginalPrice && currentOriginalPrice !== currentPrice && (
                        <div className="flex flex-col gap-1 mb-2">
                          <span className="text-lg text-gray-500 line-through">
                            ${parseInt(currentOriginalPrice.replace(/[^\d]/g, "")).toLocaleString("es-CO")}
                          </span>
                          <span className="text-base font-bold text-blue-600">
                            Ahorra $
                            {(
                              parseInt(currentOriginalPrice.replace(/[^\d]/g, "")) -
                              parseInt(currentPrice?.replace(/[^\d]/g, "") || "0")
                            ).toLocaleString("es-CO")}
                          </span>
                        </div>
                      )}
                      <p className="text-3xl font-bold text-gray-900">
                        ${parseInt(currentPrice?.replace(/[^\d]/g, "") || "0").toLocaleString("es-CO")}
                      </p>
                    </div>

                    {/* Selector de color */}
                    {product.colors && product.colors.length > 0 && (
                      <div className="mb-6">
                        <p className="text-base font-medium text-gray-900 mb-3">
                          Color: <span className="font-normal">{selectedColor?.label}</span>
                        </p>
                        <div className="flex gap-2">
                          {product.colors.map((color) => (
                            <button
                              key={color.sku}
                              onClick={() => onColorSelect(color)}
                              className={cn(
                                "w-10 h-10 rounded-full border-2 transition-all duration-200",
                                selectedColor?.name === color.name
                                  ? "border-black ring-2 ring-offset-2 ring-black"
                                  : "border-gray-300 hover:border-gray-600"
                              )}
                              style={{ backgroundColor: color.hex }}
                              title={color.label}
                            >
                              {color.hex.toLowerCase() === "#ffffff" && (
                                <span className="block w-full h-full rounded-full border border-gray-300" />
                              )}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Selector de capacidad */}
                    {product.capacities && product.capacities.length > 0 && (
                      <div className="mb-6">
                        <p className="text-base font-medium text-gray-900 mb-3">Capacidad:</p>
                        <div className="flex gap-2 flex-wrap">
                          {product.capacities.map((capacity) => (
                            <button
                              key={capacity.value}
                              onClick={() => onCapacitySelect(capacity)}
                              className={cn(
                                "px-4 py-2 text-sm font-medium rounded-full border-2 transition-all",
                                selectedCapacity?.value === capacity.value
                                  ? "border-black bg-black text-white"
                                  : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
                              )}
                            >
                              {capacity.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Botones */}
                    <div className="mt-auto space-y-3">
                      <button
                        onClick={onAddToCart}
                        className="w-full bg-black text-white py-3.5 px-6 rounded-full text-base font-semibold hover:bg-gray-800 transition-all"
                      >
                        Agregar al carrito
                      </button>
                      <button
                        onClick={onViewDetails}
                        className="w-full bg-white text-black py-3.5 px-6 rounded-full text-base font-semibold border-2 border-gray-300 hover:bg-gray-50 transition-all"
                      >
                        Ver detalles completos
                      </button>
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
