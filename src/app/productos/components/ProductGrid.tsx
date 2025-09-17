// src/app/productos/components/ProductGrid.tsx
import Image, { StaticImageData } from "next/image";
import { ProductColor, ProductCardProps } from "./ProductCard";

export interface Product {
  id: string;
  name: string;
  image: string | StaticImageData;
  colors?: ProductColor[];
  rating?: number;
  reviewCount?: number;
  price: string;
  originalPrice?: string;
  discount?: string;
  isNew?: boolean;
}

interface ProductGridProps {
  products: ProductCardProps[];
}

export default function ProductGrid({ products }: ProductGridProps) {
  // Simulación de añadir al carrito
  function handleAddToCart(product: ProductCardProps) {
    alert(`Producto añadido: ${product.name}`);
  }

  if (!products.length) {
    return (
      <div className="col-span-full text-center py-12 text-gray-500">
        No se encontraron productos con los filtros seleccionados.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <div
          key={product.id}
          className="bg-white rounded-lg shadow-md p-6 flex flex-col justify-between hover:shadow-lg transition-shadow duration-200"
        >
          <div>
            <h3 className="text-lg font-semibold mb-2 text-gray-900">
              {product.name}
            </h3>
            <Image
              src={product.image}
              alt={product.name}
              width={120}
              height={120}
              className="mb-2 w-28 h-28 object-contain mx-auto"
            />
            <div className="flex flex-wrap gap-2 mb-2">
              {product.colors?.map((color) => (
                <span
                  key={color.label}
                  className="inline-flex items-center px-2 py-1 rounded text-xs font-medium border border-gray-200 bg-gray-50 text-gray-700"
                  style={{ backgroundColor: color.hex, color: "#fff" }}
                  title={color.label}
                >
                  {color.label}
                </span>
              ))}
            </div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-blue-700 font-bold text-lg">
                {product.price}
              </span>
              {product.originalPrice && (
                <span className="line-through text-gray-400 text-sm">
                  {product.originalPrice}
                </span>
              )}
              {product.discount && (
                <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-semibold">
                  {product.discount}
                </span>
              )}
            </div>
            {product.isNew && (
              <span className="inline-block bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-semibold mb-2">
                Nuevo
              </span>
            )}
          </div>
          <button
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200"
            onClick={() => handleAddToCart(product)}
          >
            Añadir al carrito
          </button>
        </div>
      ))}
    </div>
  );
}
