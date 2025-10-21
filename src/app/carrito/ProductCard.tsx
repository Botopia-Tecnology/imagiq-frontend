import React from "react";
import Image from "next/image";
import { Minus, Plus } from "lucide-react";

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
      <div className="md:hidden bg-white rounded-lg p-4 shadow-sm">
        <div className="flex gap-4">
          <div className="flex flex-col items-center gap-2">
            <div className="w-24 h-24 relative flex-shrink-0 bg-gray-100 rounded-xl p-2">
              <Image src={imagen} alt={nombre} fill className="object-contain p-2" sizes="96px" />
            </div>
            <button
              onClick={onRemove}
              className="text-xs text-sky-600 hover:text-sky-700 font-medium transition"
              aria-label="Eliminar producto"
            >
              Eliminar
            </button>
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
      <div className="hidden md:flex bg-white rounded-lg p-6 shadow-sm gap-6 items-start">
        {/* Imagen + Eliminar */}
        <div className="flex flex-col items-center gap-2">
          <div className="w-40 h-40 relative flex-shrink-0 bg-gray-100 rounded-xl p-3">
            <Image src={imagen} alt={nombre} fill className="object-contain p-3" sizes="160px" />
          </div>
          <button
            onClick={onRemove}
            className="text-sm text-sky-600 hover:text-sky-700 font-medium transition"
            aria-label="Eliminar producto"
          >
            Eliminar
          </button>
        </div>

        {/* Detalles - 80% */}
        <div className="flex-1 min-w-0">
          <div className="mb-2">
            <h3 className="text-base font-semibold text-gray-900 line-clamp-2 mb-1">{nombre}</h3>
            <p className="text-sm text-gray-500">Enviado desde {ubicacionEnvio}</p>
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
              <div className="flex items-baseline gap-2 flex-wrap">
                <span className="text-2xl font-bold text-gray-900">${precio.toLocaleString()}</span>
                {descuento && (
                  <>
                    <span className="text-sm text-gray-400 line-through">${precioOriginal?.toLocaleString()}</span>
                    <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-bold rounded whitespace-nowrap">
                      {descuento}%
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
