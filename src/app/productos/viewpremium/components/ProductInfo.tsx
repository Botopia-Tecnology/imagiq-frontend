"use client";

import React, { forwardRef } from "react";
import { ProductCardProps } from "@/app/productos/components/ProductCard";
import ARExperienceHandler from "../../electrodomesticos/components/ARExperienceHandler";

interface ProductInfoProps {
  product: ProductCardProps;
  selectedColor: string | null;
  selectedStorage: string | null;
  selectedRam: string | null;
  setSelectedColor: React.Dispatch<React.SetStateAction<string | null>>;
  setSelectedStorage: React.Dispatch<React.SetStateAction<string | null>>;
  setSelectedRam: React.Dispatch<React.SetStateAction<string | null>>;
  setCurrentImageIndex: React.Dispatch<React.SetStateAction<number>>;
  currentImageIndex: number;
  productImages: string[];
  onOpenModal: () => void;
}

const ProductInfo = forwardRef<HTMLDivElement, ProductInfoProps>(({
  product,
  selectedColor,
  selectedStorage,
  selectedRam,
  setSelectedColor,
  setSelectedStorage,
  setSelectedRam,
  setCurrentImageIndex,
  currentImageIndex,
  productImages,
  onOpenModal,
}, ref) => {
  return (
    <div ref={ref} className="w-full lg:col-span-3">
      <div className="lg:sticky lg:top-20">
        {/* Espacio en blanco superior */}
        <div className="h-8"></div>


        {/* Dispositivo */}
        <div className="mb-20">
          {/* Información de SKU, Código y Stock */}
          <div className="mb-4 space-y-1">
            {(() => {
              // Buscar el índice de variante correspondiente al color seleccionado
              let variantSku = '';
              let variantCodigoMarket = '';
              let variantStockTotal = 0;

              if (product.apiProduct && selectedColor) {
                const variantIndex = product.apiProduct.color.findIndex(
                  (color: string) => color.toLowerCase().trim() === selectedColor.toLowerCase().trim()
                );

                if (variantIndex !== -1) {
                  variantSku = product.apiProduct.sku?.[variantIndex] || '';
                  variantCodigoMarket = product.apiProduct.codigoMarket?.[variantIndex] || '';
                  variantStockTotal = product.apiProduct.stockTotal?.[variantIndex] || 0;
                }
              }

              return (
                <>
                  {variantSku && (
                    <p className="text-sm text-gray-600">
                      SKU: {variantSku}
                    </p>
                  )}
                  {variantCodigoMarket && (
                    <p className="text-sm text-gray-600">
                      Código: {variantCodigoMarket}
                    </p>
                  )}
                  <p className="text-sm text-gray-600">
                    Stock Total: {variantStockTotal}
                  </p>
                </>
              );
            })()}
          </div>

          <div className="border-2 border-blue-600 rounded-md p-4 bg-blue-50/30">
            <div className="flex items-center justify-between gap-3">
              <div className="font-bold text-black text-lg flex-1 self-center">{product.name}</div>
              <div className="text-right self-center">
                <div className="text-sm text-black">
                  {(() => {
                    const selectedCapacity = product.capacities?.find(c => c.value === selectedStorage);
                    const priceStr = selectedCapacity?.price || product.price || "0";
                    const priceNumber = parseInt(priceStr.replace(/[^\d]/g, ''));
                    const monthlyPrice = Math.round(priceNumber / 12);
                    return `Desde $ ${monthlyPrice.toLocaleString('es-CO')} al mes o`;
                  })()}
                </div>
                <div className="text-2xl text-black">
                  {(() => {
                    const selectedCapacity = product.capacities?.find(c => c.value === selectedStorage);
                    return selectedCapacity?.price || product.price || "Precio no disponible";
                  })()}
                </div>
              </div>
            </div>
          </div>
          <p className="text-sm text-blue-600 leading-relaxed mt-3 mb-6">
            12 cuotas sin interés con bancos aliados. Continúa al carrito para ver el precio final con DTO
          </p>
        </div>

        {/* Almacenamiento */}
        {product.capacities && product.capacities.length > 0 && (
          <div className="mb-6 mt-8">
            <div className="flex items-center gap-2 mb-3">
              <h3 className="text-2xl font-bold text-black">Almacenamiento</h3>
            </div>
            <p className="text-sm text-black mb-4">Compra tu smartphone de mayor capacidad a menor precio</p>

            <div className="space-y-3">
              {product.capacities.map((capacity, index) => {
                const isSelected = capacity.value === selectedStorage;
                const priceStr = capacity.price || "0";
                const priceNumber = parseInt(priceStr.replace(/[^\d]/g, ''));
                const monthlyPrice = Math.round(priceNumber / 12);
                const formattedLabel = String(capacity.label || "")
                  .replace(/(\d+)\s*gb\b/i, '$1 GB');

                return (
                  <div key={index}>
                    <div
                      onClick={() => setSelectedStorage(capacity.value)}
                      className={`border-2 rounded-md p-4 cursor-pointer transition-all ${isSelected
                        ? "border-blue-600 bg-blue-50/30"
                        : "border-gray-300 hover:border-gray-400"
                        }`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="font-bold text-black text-base">
                          {formattedLabel}
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-700">
                            $ {monthlyPrice.toLocaleString('es-CO')} al mes o
                          </div>
                          <div className="text-lg text-black">
                            {capacity.price || "Precio no disponible"}
                          </div>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-blue-600 leading-snug mt-2">
                      Acumula puntos al comprar + 24 cuotas sin interés con bancos aliados. Continúa al carrito para ver el precio final con DTO
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Información importante */}
            <div className="mt-3 p-3">
              <p className="text-sm font-semibold text-gray-900 mb-1">
                Información importante: Memoria ROM
              </p>
              <p className="text-sm text-gray-600 leading-relaxed">
                Parte del espacio de la memoria esta ocupada por contenidos preinstalados. Para este dispositivo, el espacio disponible para el usuario es aproximadamente el 87% de la capacidad total de la memoria indicada.
              </p>
            </div>
          </div>
        )}

        {/* Memoria RAM */}
        {(() => {
          // Obtener opciones únicas de RAM del producto
          const ramOptions = product.apiProduct?.memoriaram
            ? Array.from(new Set(product.apiProduct.memoriaram)).filter(ram => ram && ram.trim() !== '')
            : [];

          // Solo mostrar si hay opciones de RAM
          if (ramOptions.length === 0) return null;

          return (
            <div className="mb-6 mt-8">
              <div className="flex items-center gap-2 mb-3">
                <h3 className="text-2xl font-bold text-black">Memoria RAM</h3>
              </div>
              <p className="text-sm text-black mb-4">Elige tu Memoria Ram</p>

              <div className="grid grid-cols-2 gap-4">
                {ramOptions.map((ram, index) => {
                  const isSelected = ram === selectedRam;

                  return (
                    <div
                      key={index}
                      onClick={() => setSelectedRam(ram)}
                      className={`border-2 rounded-md px-6 py-6 cursor-pointer transition-all ${
                        isSelected
                          ? "border-blue-600 bg-blue-50/30"
                          : "border-gray-300 hover:border-gray-400"
                      }`}
                    >
                      <span className="font-semibold text-base">{ram}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })()}

        {/* Color */}
        {product.colors && product.colors.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-base font-semibold text-gray-900">Color</h3>
            </div>
            <p className="text-xs text-gray-500 mb-3">Selecciona el color de tu dispositivo.</p>

            {/* Selectores de color - SOLO DESKTOP */}
            <div className="hidden lg:flex gap-4 justify-center">
              {product.colors.map((color, index) => {
                const isSelected = color.name === selectedColor;

                return (
                  <div
                    key={index}
                    onClick={() => {
                      setSelectedColor(color.name);
                      setCurrentImageIndex(0);
                    }}
                    className="flex flex-col items-center cursor-pointer transition-all"
                  >
                    <div
                      className={`w-12 h-12 rounded-full border-2 transition-all ${
                        isSelected
                          ? "border-black ring-2 ring-black ring-offset-2 scale-110"
                          : color.hex === '#000000' || color.hex.toLowerCase() === '#000000'
                            ? "border-gray-400 hover:border-gray-600 hover:scale-105"
                            : "border-gray-300 hover:border-gray-400 hover:scale-105"
                        }`}
                      style={{
                        backgroundColor: color.hex,
                        boxShadow: (color.hex === '#000000' || color.hex.toLowerCase() === '#000000') && !isSelected
                          ? 'inset 0 0 0 1px rgba(255,255,255,0.1)'
                          : undefined
                      }}
                    ></div>
                    <div className={`font-medium text-center text-xs mt-2 ${isSelected ? "text-black" : "text-gray-600"
                      }`}>
                      {color.label}
                    </div>
                  </div>
                );
              })}
            </div>
            {/* Botón AR Experience - SOLO DESKTOP Y TABLET */}
            {(() => {
              const variantIndex = product.apiProduct && selectedColor
                ? product.apiProduct.color.findIndex(
                    (color: string) => color.toLowerCase().trim() === selectedColor.toLowerCase().trim()
                  )
                : -1;

              const urlRender3D = variantIndex !== -1 && product.apiProduct?.urlRender3D?.[variantIndex]
                ? product.apiProduct.urlRender3D[variantIndex]
                : null;

              return urlRender3D && urlRender3D.trim() !== "" ? (
                <div className="hidden lg:flex justify-center mt-6">
                  <ARExperienceHandler
                    glbUrl={urlRender3D}
                    usdzUrl={urlRender3D}
                  />
                </div>
              ) : null;
            })()}

            {/* Carrusel de imágenes del color - SOLO MOBILE */}
            {productImages.length > 0 && (
              <div className="mt-6 lg:hidden">
                <div className="relative w-full h-[220px] flex items-center justify-center overflow-hidden bg-white">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    key={productImages[currentImageIndex % productImages.length]}
                    src={productImages[currentImageIndex % productImages.length]}
                    alt={`${product.name} - ${selectedColor} ${(currentImageIndex % productImages.length) + 1}`}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      console.error('Error loading image:', productImages[currentImageIndex % productImages.length], e);
                    }}
                  />
                </div>

                {/* Botón Ver más */}
                <div className="flex justify-center mt-4 mb-6">
                  <button
                    onClick={onOpenModal}
                    className="px-6 py-2.5 bg-white text-black border-2 border-black rounded-full text-sm font-medium hover:bg-black hover:text-white transition-all hover:scale-105"
                  >
                    Ver más
                  </button>
                </div>



                {/* Selectores de color - SOLO MOBILE - Debajo de Ver más */}
                <div className="flex gap-4 justify-center mb-6">
                  {product.colors.map((color, index) => {
                    const isSelected = color.name === selectedColor;

                    return (
                      <div
                        key={index}
                        onClick={() => {
                          setSelectedColor(color.name);
                          setCurrentImageIndex(0);
                        }}
                        className="flex flex-col items-center cursor-pointer transition-all"
                      >
                        <div
                          className={`w-12 h-12 rounded-full border-2 transition-all ${isSelected
                            ? "border-black ring-2 ring-black ring-offset-2 scale-110"
                            : "border-gray-300 hover:border-gray-400 hover:scale-105"
                            }`}
                          style={{ backgroundColor: color.hex }}
                        ></div>
                        <div className={`font-medium text-center text-xs mt-2 ${isSelected ? "text-black" : "text-gray-600"
                          }`}>
                          {color.label}
                        </div>
                      </div>
                    );
                  })}
                </div>
                {/* Botón AR Experience - Solo mobile, justo después de "Ver más" */}
                {(() => {
                  const variantIndex = product.apiProduct && selectedColor
                    ? product.apiProduct.color.findIndex(
                        (color: string) => color.toLowerCase().trim() === selectedColor.toLowerCase().trim()
                      )
                    : -1;

                  const urlRender3D = variantIndex !== -1 && product.apiProduct?.urlRender3D?.[variantIndex]
                    ? product.apiProduct.urlRender3D[variantIndex]
                    : null;

                  return urlRender3D && urlRender3D.trim() !== "" ? (
                    <div className="flex justify-center mb-6">
                      <ARExperienceHandler
                        glbUrl={urlRender3D}
                        usdzUrl={urlRender3D}
                      />
                    </div>
                  ) : null;
                })()}
              </div>
            )}
          </div>
        )}

        {/* Entregas */}
        <div className="mb-4 pb-32 md:pb-4 lg:border-b border-gray-200">
          <p className="text-xs text-gray-600">Entregas: en 1-3 días laborables</p>
        </div>
      </div>
    </div>
  );
});

ProductInfo.displayName = 'ProductInfo';

export default ProductInfo;
