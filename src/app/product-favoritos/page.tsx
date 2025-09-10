"use client";
import Image from "next/image";

export default function FavoritosPage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-6 flex items-center justify-center gap-2">
          MIS FAVORITOS
          <span>
            {/* Ícono corazón */}
            <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
              <path
                d="M12 21s-7-5.434-7-10.5A5.5 5.5 0 0 1 12 5.5a5.5 5.5 0 0 1 7 5.5C19 15.566 12 21 12 21z"
                stroke="#222"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            </svg>
          </span>
        </h1>
        <div className="flex gap-8">
          {/* Filtros */}
          <aside className="w-64 bg-white rounded-lg shadow px-6 py-4">
            <h2 className="text-lg font-semibold mb-4">Filtros</h2>
            <div className="mb-2 text-gray-600">0 resultados</div>
            <div className="mb-4">
              <h3 className="font-semibold mb-2 text-sm">ALMACENAMIENTO</h3>
              <div className="flex flex-col gap-1">
                <label>
                  <input type="checkbox" /> 64GB
                </label>
                <label>
                  <input type="checkbox" /> 128GB
                </label>
                <label>
                  <input type="checkbox" /> 256GB
                </label>
                <label>
                  <input type="checkbox" /> 512GB
                </label>
                <label>
                  <input type="checkbox" /> 1TB
                </label>
              </div>
            </div>
            {/* Puedes agregar más filtros aquí */}
          </aside>
          {/* Productos favoritos */}
          <section className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Aquí se renderizarán los productos favoritos dinámicamente */}
          </section>
        </div>
      </div>
    </main>
  );
}