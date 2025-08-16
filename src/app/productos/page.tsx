"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useCartContext } from "../../features/cart/CartContext";
import Image from "next/image";

function ProductosContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";

  // Usar el contexto del carrito de forma estándar
  const { addProduct } = useCartContext();

  // Producto de ejemplo
  const productoEjemplo = {
    id: "1",
    nombre: "Samsung Galaxy S25 Ultra 5G 256GB, Azul",
    precio: 6719900,
    cantidad: 1,
    imagen: "/img/DispositivosMoviles/galaxy_s25.png",
  };

  // Handler para añadir al carrito
  function handleAddToCart() {
    addProduct({ id: productoEjemplo.id, quantity: 1 });
    // Animación o feedback
    alert("Producto añadido al carrito");
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold mb-6">Resultados de búsqueda</h1>
      {query && (
        <p className="text-gray-600 mb-4">
          Mostrando resultados para: <strong>&quot;{query}&quot;</strong>
        </p>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-2">
            {productoEjemplo.nombre}
          </h3>
          <Image
            src={productoEjemplo.imagen}
            alt={productoEjemplo.nombre}
            width={96}
            height={96}
            className="mb-2 w-24 h-24 object-contain"
          />
          <p className="text-gray-600 mb-2">
            $ {productoEjemplo.precio.toLocaleString()}
          </p>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-600 transition"
            onClick={handleAddToCart}
          >
            Añadir al carrito
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ProductosPage() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <ProductosContent />
    </Suspense>
  );
}
