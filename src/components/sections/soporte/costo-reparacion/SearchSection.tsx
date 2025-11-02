"use client";

export function SearchSection() {
  return (
    <div className="bg-white py-12">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <h2 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-black mb-4">
          Precios de reparación
        </h2>
        <p className="text-xs md:text-sm lg:text-base text-gray-700 mb-8 max-w-4xl mx-auto">
          Escribe el modelo de tu dispositivo y consulta los costos de reparación con Samsung
        </p>
        
        {/* Barra de búsqueda */}
        <div className="w-full max-w-2xl mx-auto">
          <div className="bg-white rounded-full p-2 flex items-center shadow-lg border border-gray-200">
            <svg
              className="w-6 h-6 text-gray-400 ml-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="Elige tu modelo"
              className="flex-1 px-4 py-2 outline-none text-gray-800"
            />
            <button className="bg-black text-white px-6 py-2 rounded-full font-semibold hover:bg-gray-800 transition-colors duration-300 mr-2">
              Buscar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

