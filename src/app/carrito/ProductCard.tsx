import React from "react";
import Image from "next/image";
import { Minus, Plus, X } from "lucide-react";

export interface ProductCardProps {
  nombre: string;
  precio: number;
  precioOriginal?: number;
  cantidad: number;
  imagen: string;
  stock?: number;
  ubicacionEnvio?: string;
  onQuantityChange: (cantidad: number) => void;
  onRemove: () => void;
}

// Funciones puras para cálculos (SRP)
const calcularLimiteMaximo = (stock?: number): number => Math.min(stock ?? 5, 5);
const calcularDisponible = (stock: number | undefined, cantidadActual: number): number =>
  Math.max(0, (stock ?? 5) - cantidadActual);
const calcularDescuento = (original?: number, actual?: number): number | null =>
  original && actual && original > actual ? Math.round(((original - actual) / original) * 100) : null;

/**
 * Componente ProductCard para el carrito - Diseño Desktop/Mobile
 * Desktop: Imagen izquierda (20%) + Detalles derecha (80%)
 * Mobile: Layout vertical compacto
 */
const ProductCard: React.FC<ProductCardProps> = ({
  nombre,
  precio,
  precioOriginal,
  cantidad,
  imagen,
  stock,
  ubicacionEnvio = "Bogotá",
  onQuantityChange,
  onRemove,
}) => {
  const limiteMax = calcularLimiteMaximo(stock);
  const disponible = calcularDisponible(stock, cantidad);
  const descuento = calcularDescuento(precioOriginal, precio);

  return (
    <>
      {/* Mobile: Layout vertical */}
      <div className="md:hidden relative group bg-white rounded-lg p-4 shadow-sm">
        <button
          className="absolute top-2 right-2 z-10 w-7 h-7 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition"
          onClick={onRemove}
          aria-label="Eliminar producto"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex gap-4">
          <div className="w-20 h-20 relative flex-shrink-0">
            <Image src={imagen} alt={nombre} fill className="object-contain" sizes="80px" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 mb-1">{nombre}</h3>
            <p className="text-xs text-gray-500">Enviado desde {ubicacionEnvio}</p>

            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-lg font-bold text-gray-900">${precio.toLocaleString()}</span>
              {descuento && (
                <>
                  <span className="text-xs text-gray-400 line-through">${precioOriginal?.toLocaleString()}</span>
                  <span className="text-xs font-semibold text-green-600">-{descuento}%</span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-2 border border-gray-300 rounded-lg">
            <button
              onClick={() => onQuantityChange(Math.max(1, cantidad - 1))}
              className="p-2 hover:bg-gray-100 transition disabled:opacity-50"
              disabled={cantidad <= 1}
              aria-label="Disminuir cantidad"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-8 text-center font-semibold text-sm">{cantidad}</span>
            <button
              onClick={() => onQuantityChange(Math.min(limiteMax, cantidad + 1))}
              className="p-2 hover:bg-gray-100 transition disabled:opacity-50"
              disabled={cantidad >= limiteMax}
              aria-label="Aumentar cantidad"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <span className="text-xs text-gray-500">Disponibles: {disponible}</span>
        </div>
      </div>

      {/* Desktop: Layout horizontal */}
      <div className="hidden md:flex relative group bg-white rounded-lg p-6 shadow-sm gap-6 items-start">
        {/* Imagen - 20% */}
        <div className="w-32 h-32 relative flex-shrink-0">
          <Image src={imagen} alt={nombre} fill className="object-contain" sizes="128px" />
        </div>

        {/* Detalles - 80% */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4 mb-2">
            <div className="flex-1">
              <h3 className="text-base font-semibold text-gray-900 line-clamp-2 mb-1">{nombre}</h3>
              <p className="text-sm text-gray-500">Enviado desde {ubicacionEnvio}</p>
            </div>
            <button
              className="w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition flex-shrink-0"
              onClick={onRemove}
              aria-label="Eliminar producto"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-6 mt-4">
            {/* Selector de cantidad */}
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2 border border-gray-300 rounded-lg">
                <button
                  onClick={() => onQuantityChange(Math.max(1, cantidad - 1))}
                  className="p-2.5 hover:bg-gray-100 transition disabled:opacity-50"
                  disabled={cantidad <= 1}
                  aria-label="Disminuir cantidad"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-10 text-center font-semibold">{cantidad}</span>
                <button
                  onClick={() => onQuantityChange(Math.min(limiteMax, cantidad + 1))}
                  className="p-2.5 hover:bg-gray-100 transition disabled:opacity-50"
                  disabled={cantidad >= limiteMax}
                  aria-label="Aumentar cantidad"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <span className="text-xs text-gray-500 text-center">Disponibles: {disponible}</span>
            </div>

            {/* Precios */}
            <div className="flex flex-col gap-1">
              <div className="flex items-baseline gap-3">
                <span className="text-2xl font-bold text-gray-900">${precio.toLocaleString()}</span>
                {descuento && (
                  <>
                    <span className="text-sm text-gray-400 line-through">${precioOriginal?.toLocaleString()}</span>
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded">
                      Ahorras {descuento}%
                    </span>
                  </>
                )}
              </div>
              {descuento && precioOriginal && (
                <span className="text-sm text-green-600 font-medium">
                  Ahorras ${(precioOriginal - precio).toLocaleString()}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductCard;
