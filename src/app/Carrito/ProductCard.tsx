import React from "react";
import Image from "next/image";

export interface ProductCardProps {
  nombre: string;
  precio: number;
  cantidad: number;
  imagen: string;
}

/**
 * Componente para mostrar un producto en el carrito
 */
const ProductCard: React.FC<ProductCardProps> = ({
  nombre,
  precio,
  cantidad,
  imagen,
}) => {
  return (
    <div className="producto-item flex gap-4 items-center bg-white rounded-lg p-4 shadow-sm">
      <Image
        src={imagen}
        alt={nombre}
        width={80}
        height={80}
        className="producto-img"
      />
      <div className="flex-1">
        <div className="font-medium">{nombre}</div>
        <div className="flex items-center gap-2 mt-2">
          <input
            type="number"
            value={cantidad}
            min={1}
            readOnly
            className="cantidad-input w-12 text-center border rounded"
          />
          <span className="font-semibold">$ {precio.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
