"use client";

import React, { forwardRef } from "react";
import { ProductCardProps } from "@/app/productos/components/ProductCard";

interface ProductInfoProps {
  product: ProductCardProps;
  selectedColor: string | null;
  selectedStorage: string | null;
  setSelectedColor: React.Dispatch<React.SetStateAction<string | null>>;
  setSelectedStorage: React.Dispatch<React.SetStateAction<string | null>>;
  setCurrentImageIndex: React.Dispatch<React.SetStateAction<number>>;
}

const ProductInfo = forwardRef<HTMLDivElement, ProductInfoProps>(({
  product,
  selectedColor,
  selectedStorage,
  setSelectedColor,
  setSelectedStorage,
  setCurrentImageIndex,
}, ref) => {
  return (
    <div ref={ref} className="w-full lg:col-span-3">
      <div className="sticky top-20">
        {/* Dispositivo */}
        <div className="mb-4">
          <div className="flex items-center gap-1.5 mb-1.5">
            <h3 className="text-lg font-bold text-gray-900">Dispositivo</h3>
            <span className="text-gray-400 cursor-help text-sm">?</span>
          </div>
          <p className="text-xs text-gray-600 mb-1.5">Selecciona tu dispositivo</p>
          <div className="border-2 border-blue-600 rounded-lg p-2">
            <div className="font-semibold text-gray-900 mb-0.5 text-xs">{product.name}</div>
            <div className="text-xs font-semibold text-gray-900">
              {(() => {
                const selectedCapacity = product.capacities?.find(c => c.value === selectedStorage);
                const priceStr = selectedCapacity?.price || product.price || "0";
                const priceNumber = parseInt(priceStr.replace(/[^\d]/g, ''));
                const monthlyPrice = Math.round(priceNumber / 24);
                return `Desde $ ${monthlyPrice.toLocaleString('es-CO')} al mes o`;
              })()}
            </div>
            <div className="text-base font-bold text-gray-900 mb-0.5">
              {(() => {
                const selectedCapacity = product.capacities?.find(c => c.value === selectedStorage);
                return selectedCapacity?.price || product.price || "Precio no disponible";
              })()}
            </div>
            <p className="text-xs text-blue-600 leading-tight">
              24 cuotas sin interés con bancos aliados. Continúa al carrito para ver el precio final con DTO
            </p>
          </div>
        </div>

        {/* Almacenamiento */}
        {product.capacities && product.capacities.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center gap-1.5 mb-1.5">
              <h3 className="text-base font-bold text-gray-900">Almacenamiento</h3>
              <span className="text-gray-400 cursor-help text-sm">?</span>
            </div>
            <p className="text-xs text-gray-600 mb-1.5">Compra tu smartphone de mayor capacidad a menor precio</p>
            
            <div className="space-y-1.5">
              {product.capacities.map((capacity, index) => {
                const isSelected = capacity.value === selectedStorage;
                const priceStr = capacity.price || "0";
                const priceNumber = parseInt(priceStr.replace(/[^\d]/g, ''));
                const monthlyPrice = Math.round(priceNumber / 24);
                const formattedLabel = String(capacity.label || "")
                  .replace(/(\d+)\s*gb\b/i, '$1 GB');
                
                return (
                  <div
                    key={index}
                    onClick={() => setSelectedStorage(capacity.value)}
                    className={`border-2 rounded-lg p-2 cursor-pointer transition-colors ${
                      isSelected
                        ? "border-blue-600 bg-blue-50"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                  >
                    <div className="font-semibold text-gray-900 mb-0.5 text-xs">
                      {formattedLabel}
                    </div>
                    <div className="text-xs font-semibold text-gray-900">
                      $ {monthlyPrice.toLocaleString('es-CO')} al mes o
                    </div>
                    <div className="text-base font-bold text-gray-900 mb-0.5">
                      {capacity.price || "Precio no disponible"}
                    </div>
                    <p className="text-xs text-blue-600 leading-tight">
                      Acumula puntos al comprar + 24 cuotas sin interés con bancos aliados. Continúa al carrito para ver el precio final con DTO
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Información importante */}
            <div className="mt-2 p-2 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-xs font-semibold text-gray-900 mb-0.5">
                Información importante: Memoria ROM
              </p>
              <p className="text-xs text-gray-600 leading-tight">
                Parte del espacio de la memoria esta ocupada por contenidos preinstalados. Para este dispositivo, el espacio disponible para el usuario es aproximadamente el 87% de la capacidad total de la memoria indicada.
              </p>
            </div>
          </div>
        )}

        {/* Color */}
        {product.colors && product.colors.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center gap-1.5 mb-1.5">
              <h3 className="text-base font-bold text-gray-900">Color</h3>
            </div>
            <p className="text-xs text-gray-600 mb-1.5">Selecciona el color de tu dispositivo.</p>
            
            <div className="flex gap-3">
              {product.colors.map((color, index) => {
                const isSelected = color.name === selectedColor;
                
                return (
                  <div
                    key={index}
                    onClick={() => {
                      setSelectedColor(color.name);
                      setCurrentImageIndex(0); // Resetear imagen al cambiar color
                    }}
                    className="flex flex-col items-center cursor-pointer transition-all"
                  >
                    <div 
                      className={`w-12 h-12 rounded-full border-3 transition-all ${
                        isSelected
                          ? "border-blue-600 ring-2 ring-blue-600 ring-offset-2 scale-110"
                          : "border-gray-300 hover:border-gray-400 hover:scale-105"
                      }`}
                      style={{ backgroundColor: color.hex }}
                    ></div>
                    <div className={`font-semibold text-center text-xs mt-1 ${
                      isSelected ? "text-blue-600" : "text-gray-700"
                    }`}>
                      {color.label}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Entregas */}
        <div className="mb-3">
          <p className="text-xs text-gray-600">Entregas: en 1-3 días laborables</p>
        </div>

        {/* Botones de acción */}
        <div className="space-y-2">
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-3 rounded-lg transition-colors text-xs">
            Comprar ahora
          </button>
          <button className="w-full bg-white hover:bg-gray-50 text-gray-900 font-semibold py-2.5 px-3 rounded-lg border-2 border-gray-300 transition-colors text-xs">
            Agregar al carrito
          </button>
        </div>
      </div>
    </div>
  );
});

ProductInfo.displayName = 'ProductInfo';

export default ProductInfo;
