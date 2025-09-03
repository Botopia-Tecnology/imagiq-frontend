"use client";

import { useState } from "react";
import { Search, Smartphone, Plus } from "lucide-react";

export default function ProductRegistration() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Registro de productos
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            El registro con un sitio web Samsung te da productos en versiones. Si tu producto no está en 
            tu lista, registra manualmente el producto.
          </p>
        </div>

        {/* Registration Card */}
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <div className="bg-blue-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Smartphone className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">
              ¿Necesitas registrar tu producto?
            </h3>
            <p className="text-gray-600">
              Busca tu dispositivo para comenzar el proceso de registro
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Buscar modelo de producto (ej: Galaxy S24, Smart TV 55&quot;)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
            />
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            <button 
              onClick={() => {/* Handle registration */}}
              className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              <Plus className="h-5 w-5" />
              Registrar Producto
            </button>
            
            <div className="text-center">
              <span className="text-gray-500">o</span>
            </div>
            
            <button className="w-full border-2 border-gray-300 text-gray-700 py-4 px-6 rounded-lg font-semibold hover:border-gray-400 transition-colors">
              Buscar productos registrados
            </button>
          </div>
        </div>

        {/* Quick Tips */}
        <div className="mt-12 grid md:grid-cols-3 gap-6 text-center">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="text-blue-600 text-2xl mb-3">📱</div>
            <h4 className="font-semibold text-gray-900 mb-2">Dispositivos Móviles</h4>
            <p className="text-gray-600 text-sm">Galaxy S, Galaxy Note, Galaxy A, Galaxy Z</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="text-blue-600 text-2xl mb-3">📺</div>
            <h4 className="font-semibold text-gray-900 mb-2">Smart TVs</h4>
            <p className="text-gray-600 text-sm">QLED, Neo QLED, Crystal UHD, The Frame</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="text-blue-600 text-2xl mb-3">🏠</div>
            <h4 className="font-semibold text-gray-900 mb-2">Electrodomésticos</h4>
            <p className="text-gray-600 text-sm">Refrigeradores, Lavadoras, Aires acondicionados</p>
          </div>
        </div>
      </div>
    </section>
  );
}
