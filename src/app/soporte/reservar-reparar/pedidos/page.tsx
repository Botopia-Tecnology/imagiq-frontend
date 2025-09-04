"use client";

import MyPageSubHeader from "../../../../components/MyPageSubHeader";
import Footer from "../../../../components/Footer";

export default function MisPedidosPage() {
  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Sub-header con pestañas */}
      <MyPageSubHeader />

      {/* Contenido principal */}
      <div className="pt-32 pb-16 bg-gray-50 min-h-[400px]">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Mis pedidos
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Aquí podrás ver el historial de todos tus pedidos realizados en Samsung.
            </p>
          </div>

          {/* Estado vacío */}
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <div className="max-w-md mx-auto">
              <div className="mb-6">
                <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto flex items-center justify-center">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No tienes pedidos
              </h3>
              <p className="text-gray-600 mb-6">
                Cuando realices tu primera compra, podrás ver el estado de tus pedidos aquí.
              </p>
              <button className="bg-blue-500 text-white px-6 py-2 rounded-md font-medium hover:bg-blue-600 transition-colors">
                Explorar productos
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
