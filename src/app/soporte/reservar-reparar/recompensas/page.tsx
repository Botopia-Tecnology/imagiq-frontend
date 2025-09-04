"use client";

import MyPageSubHeader from "../../../../components/MyPageSubHeader";
import Footer from "../../../../components/Footer";

export default function RecompensasPage() {
  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Sub-header con pestañas */}
      <MyPageSubHeader />

      {/* Contenido de Mis recompensas */}
      <section className="pt-32 pb-16 bg-gray-50 min-h-[400px]">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Mis recompensas
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Canjea tus puntos Samsung Members por increíbles recompensas, descuentos y experiencias exclusivas.
            </p>
          </div>

          {/* Balance de puntos */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-8 rounded-2xl mb-8">
            <div className="text-center">
              <h2 className="text-lg font-semibold mb-2">Puntos disponibles</h2>
              <div className="text-4xl font-bold mb-4">2,450</div>
              <p className="text-blue-100">Obtén más puntos comprando productos Samsung y participando en actividades</p>
            </div>
          </div>

          {/* Secciones de recompensas */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Recompensas destacadas */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Recompensas destacadas</h3>
              
              <div className="space-y-4">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="font-semibold text-gray-900">Galaxy Buds2 Pro</h4>
                      <p className="text-gray-600 text-sm">Auriculares inalámbricos premium</p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-blue-500">3,200 pts</div>
                    </div>
                  </div>
                  <button className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors">
                    Canjear
                  </button>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="font-semibold text-gray-900">Descuento 20%</h4>
                      <p className="text-gray-600 text-sm">En accesorios Samsung</p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-blue-500">800 pts</div>
                    </div>
                  </div>
                  <button className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors">
                    Canjear
                  </button>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 opacity-75">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="font-semibold text-gray-900">Galaxy Watch6</h4>
                      <p className="text-gray-600 text-sm">Smartwatch con GPS</p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-gray-400">4,500 pts</div>
                    </div>
                  </div>
                  <button className="w-full bg-gray-300 text-gray-500 py-2 px-4 rounded-lg cursor-not-allowed">
                    Puntos insuficientes
                  </button>
                </div>
              </div>
            </div>

            {/* Historial y estadísticas */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Actividad reciente</h3>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
                <h4 className="font-semibold text-gray-900 mb-4">Formas de ganar puntos</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Comprar productos</span>
                    <span className="font-semibold">1 punto = $1</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Escribir reseñas</span>
                    <span className="font-semibold">50 puntos</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Registrar productos</span>
                    <span className="font-semibold">100 puntos</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Referir amigos</span>
                    <span className="font-semibold">200 puntos</span>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-4">Historial de canjes</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2">
                    <div>
                      <div className="font-medium text-gray-900">Descuento 15%</div>
                      <div className="text-sm text-gray-500">12 marzo 2024</div>
                    </div>
                    <div className="text-red-600 font-semibold">-500 pts</div>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <div>
                      <div className="font-medium text-gray-900">Funda Galaxy S24</div>
                      <div className="text-sm text-gray-500">28 febrero 2024</div>
                    </div>
                    <div className="text-red-600 font-semibold">-1,200 pts</div>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <div>
                      <div className="font-medium text-gray-900">Envío gratis</div>
                      <div className="text-sm text-gray-500">15 febrero 2024</div>
                    </div>
                    <div className="text-red-600 font-semibold">-300 pts</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
