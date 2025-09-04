"use client";

import MyPageSubHeader from "../../../components/MyPageSubHeader";
import Footer from "../../../components/Footer";

export default function CuponesPage() {
  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Sub-header con pestañas */}
      <MyPageSubHeader />

      {/* Contenido principal */}
      <div className="pt-32 pb-16 bg-gray-50 min-h-[400px]">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Mis cupones
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Gestiona tus cupones de descuento y ofertas especiales de Samsung.
            </p>
          </div>

          {/* Sección de cupones disponibles */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Cupón de ejemplo */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4">
                <div className="text-white">
                  <h3 className="text-lg font-semibold">10% OFF</h3>
                  <p className="text-blue-100 text-sm">En productos seleccionados</p>
                </div>
              </div>
              <div className="p-4">
                <p className="text-gray-800 font-medium mb-2">Descuento especial</p>
                <p className="text-gray-600 text-sm mb-3">
                  Válido para smartphones Galaxy S24 series
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">Expira: 31/12/2024</span>
                  <button className="bg-blue-600 text-white px-4 py-1.5 rounded text-sm font-medium hover:bg-blue-700 transition-colors">
                    Usar cupón
                  </button>
                </div>
              </div>
            </div>

            {/* Segundo cupón */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-green-600 to-green-700 p-4">
                <div className="text-white">
                  <h3 className="text-lg font-semibold">15% OFF</h3>
                  <p className="text-green-100 text-sm">Electrodomésticos</p>
                </div>
              </div>
              <div className="p-4">
                <p className="text-gray-800 font-medium mb-2">Hogar inteligente</p>
                <p className="text-gray-600 text-sm mb-3">
                  Aplicable en refrigeradores y lavadoras
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">Expira: 15/01/2025</span>
                  <button className="bg-green-600 text-white px-4 py-1.5 rounded text-sm font-medium hover:bg-green-700 transition-colors">
                    Usar cupón
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Cupones usados */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Cupones utilizados
            </h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                <div>
                  <p className="font-medium text-gray-800">5% OFF - Smartphones</p>
                  <p className="text-sm text-gray-600">Usado el 15/11/2024</p>
                </div>
                <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded">
                  Utilizado
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
