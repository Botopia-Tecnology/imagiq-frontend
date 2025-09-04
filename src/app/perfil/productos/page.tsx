"use client";

import MyPageSubHeader from "../../../components/MyPageSubHeader";
import Footer from "../../../components/Footer";

export default function ProductosPage() {
  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Sub-header con pestañas */}
      <MyPageSubHeader />

      {/* Contenido de Mis productos */}
      <section className="pt-32 pb-16 bg-gray-50 min-h-[400px]">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Mis productos
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Gestiona todos tus dispositivos Samsung registrados. Obtén soporte personalizado, garantías extendidas y más.
            </p>
          </div>

          {/* Botón para agregar producto */}
          <div className="text-center mb-8">
            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
              + Registrar nuevo producto
            </button>
          </div>

          {/* Lista de productos */}
          <div className="grid gap-6">
            {/* Producto ejemplo 1 */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">📱</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Galaxy S24 Ultra</h3>
                    <p className="text-gray-600 text-sm">256GB - Titanium Black</p>
                    <p className="text-gray-500 text-xs">Registrado: 15 marzo 2024</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="inline-block px-3 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                    Garantía activa
                  </span>
                  <p className="text-gray-500 text-xs mt-1">Expira: 15 marzo 2026</p>
                </div>
              </div>
              <div className="flex space-x-4 mt-4 pt-4 border-t border-gray-100">
                <button className="text-blue-600 text-sm hover:text-blue-700">Ver detalles</button>
                <button className="text-blue-600 text-sm hover:text-blue-700">Solicitar soporte</button>
                <button className="text-blue-600 text-sm hover:text-blue-700">Descargar manuales</button>
              </div>
            </div>

            {/* Producto ejemplo 2 */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">💻</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Galaxy Book3 Pro</h3>
                    <p className="text-gray-600 text-sm">512GB SSD - 16GB RAM</p>
                    <p className="text-gray-500 text-xs">Registrado: 8 enero 2024</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="inline-block px-3 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                    Garantía activa
                  </span>
                  <p className="text-gray-500 text-xs mt-1">Expira: 8 enero 2026</p>
                </div>
              </div>
              <div className="flex space-x-4 mt-4 pt-4 border-t border-gray-100">
                <button className="text-blue-600 text-sm hover:text-blue-700">Ver detalles</button>
                <button className="text-blue-600 text-sm hover:text-blue-700">Solicitar soporte</button>
                <button className="text-blue-600 text-sm hover:text-blue-700">Descargar manuales</button>
              </div>
            </div>

            {/* Estado vacío si no hay productos */}
            {/* 
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl text-gray-400">📦</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No tienes productos registrados</h3>
              <p className="text-gray-600 mb-6">Registra tus dispositivos Samsung para obtener soporte personalizado</p>
              <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                Registrar primer producto
              </button>
            </div>
            */}
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
