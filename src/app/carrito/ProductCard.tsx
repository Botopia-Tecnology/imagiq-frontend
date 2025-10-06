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
 * Componente minimalista para mostrar un producto en el carrito
 * - Layout vertical: imagen arriba, texto centrado abajo
 * - Sin fondos ni bordes para diseño limpio
 * - Controles compactos y discretos
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
    <div className="relative group">
      {/* Botón eliminar - esquina superior derecha */}
      <button
        className="absolute -top-1 -right-1 z-10 w-5 h-5 bg-red-500 hover:bg-red-600 text-white rounded-full text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center"
        onClick={onRemove}
        aria-label="Eliminar producto"
      >
        ×
      </button>

      {/* Imagen */}
      <div className="w-16 h-16 mx-auto mb-2 relative">
        <Image
          src={imagen}
          alt={nombre}
          fill
          className="object-contain"
          sizes="64px"
        />
      </div>

      {/* Nombre del producto */}
      <div className="text-center mb-1">
        <h3 className="text-xs font-medium text-gray-800 leading-tight line-clamp-2 min-h-[2rem]">
          {nombre}
        </h3>
      </div>

      {/* Precio */}
      <div className="text-center mb-2">
        <span className="text-sm font-semibold text-gray-900">
          ${Number.isFinite(Number(precio)) ? Number(precio).toLocaleString() : "0"}
        </span>
      </div>

      {/* Controles de cantidad */}
      <div className="flex items-center justify-center">
        <div className="flex items-center border border-gray-200 rounded-md">
          <button
            className="w-6 h-6 flex items-center justify-center text-gray-600 hover:text-gray-800 hover:bg-gray-50 text-sm"
            onClick={() => onQuantityChange(Math.max(1, cantidad - 1))}
            aria-label="Disminuir cantidad"
          >
            -
          </button>
          <span className="w-8 text-center text-xs font-medium text-gray-900">
            {cantidad}
          </span>
          <button
            className="w-6 h-6 flex items-center justify-center text-gray-600 hover:text-gray-800 hover:bg-gray-50 text-sm"
            onClick={() => onQuantityChange(cantidad + 1)}
            aria-label="Aumentar cantidad"
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
