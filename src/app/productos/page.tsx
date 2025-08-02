"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

function ProductosContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";

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
          <h3 className="text-lg font-semibold mb-2">Producto de ejemplo</h3>
          <p className="text-gray-600">
            Este es un producto de ejemplo que coincide con tu búsqueda.
          </p>
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
