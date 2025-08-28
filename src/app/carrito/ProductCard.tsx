import React from "react";
import Image from "next/image";

export interface ProductCardProps {
  nombre: string;
  precio: number;
  cantidad: number;
  imagen: string;
  onQuantityChange: (cantidad: number) => void;
  onRemove: () => void;
}

/**
 * Componente para mostrar un producto en el carrito con controles y diseño Samsung
 * - Imagen, nombre, cantidad, precio
 * - Botones para aumentar/disminuir cantidad
 * - Botón para eliminar producto
 * - Layout responsivo y accesible
 */
const ProductCard: React.FC<ProductCardProps> = ({
  nombre,
  precio,
  cantidad,
  imagen,
  onQuantityChange,
  onRemove,
}) => {
  return (
    <div className="flex items-center justify-between py-4 border-b border-gray-300 last:border-b-0 bg-white rounded-xl">
      {/* Imagen */}
      <div className="w-20 h-20 flex-shrink-0 relative">
        <Image
          src={imagen}
          alt={nombre}
          fill
          className="object-contain rounded-xl bg-white"
          sizes="80px"
        />
      </div>
      {/* Info */}
      <div className="flex-1 px-4 min-w-0">
        <div className="font-semibold text-gray-900 text-sm mb-1 truncate">
          {nombre}
        </div>
      </div>
      {/* Cantidad y precio */}
      <div className="flex items-center gap-4">
        <div className="flex items-center border rounded-lg px-2 py-1 bg-white">
          <button
            className="px-2 text-lg text-gray-700 hover:text-blue-600 focus:outline-none"
            onClick={() => onQuantityChange(Math.max(1, cantidad - 1))}
            aria-label="Disminuir cantidad"
          >
            -
          </button>
          <span className="px-2 text-base font-medium text-gray-900 min-w-[24px] text-center">
            {cantidad}
          </span>
          <button
            className="px-2 text-lg text-gray-700 hover:text-blue-600 focus:outline-none"
            onClick={() => onQuantityChange(cantidad + 1)}
            aria-label="Aumentar cantidad"
          >
            +
          </button>
        </div>
        <div className="text-base font-bold text-gray-900 whitespace-nowrap">
          ${" "}
          {Number.isFinite(Number(precio))
            ? Number(precio).toLocaleString()
            : "0"}
        </div>
      </div>
      {/* Eliminar */}
      <button
        className="ml-4 text-red-500 hover:text-red-700 text-sm font-semibold px-2 py-1 rounded transition"
        onClick={onRemove}
        aria-label="Eliminar producto"
      >
        Eliminar
      </button>
    </div>
  );
};

export default ProductCard;
