/**
 * Skeleton loader para la página viewPremium
 * Replica la estructura de dos columnas con carrusel sticky y panel de información
 */

export default function ViewPremiumSkeleton() {
  return (
    <div className="bg-white min-h-screen animate-pulse">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 md:px-6 lg:px-12 py-4">
          <div className="max-w-7xl mx-auto">
            <div className="h-4 bg-gray-200 rounded w-48"></div>
          </div>
        </div>
      </div>

      {/* Layout principal de dos columnas */}
      <div className="pt-8 pb-0">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 items-start">
          {/* Columna izquierda: Carrusel - ocupa el ancho */}
          <div className="lg:col-span-9">
            {/* DESKTOP: Carrusel grande */}
            <div className="hidden lg:block">
              <div className="w-full h-screen flex items-center justify-center bg-gray-50">
                <div className="w-96 h-[600px] bg-gray-200 rounded-2xl"></div>
              </div>

              {/* Indicadores de navegación */}
              <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="w-2 h-2 rounded-full bg-gray-300"
                  ></div>
                ))}
              </div>
            </div>

            {/* MOBILE: Carrusel compacto */}
            <div className="lg:hidden px-4">
              <div className="w-full h-[500px] bg-gray-100 rounded-2xl flex items-center justify-center">
                <div className="w-64 h-96 bg-gray-200 rounded-xl"></div>
              </div>

              {/* Indicadores mobile */}
              <div className="flex justify-center gap-2 mt-4">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="w-2 h-2 rounded-full bg-gray-300"
                  ></div>
                ))}
              </div>
            </div>
          </div>

          {/* Columna derecha: Información del producto */}
          <div className="lg:col-span-3 px-4 md:px-6 lg:px-12 mt-8 lg:mt-0">
            <div className="max-w-7xl mx-auto space-y-6">
              {/* Caracteristicas */}
              <div className="space-y-3">
                <div className="flex gap-3">
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className="w-12 h-12 bg-gray-200 rounded-full"
                    ></div>
                  ))}
                </div>
              </div>

              {/* Dispositivo */}
              <div className="space-y-2">
                <div className="h-8 bg-gray-200 rounded-lg w-full"></div>
              </div>

              {/* SKU */}
              <div className="h-3 bg-gray-200 rounded w-32"></div>

              {/* Precio */}
              <div className="space-y-3 pt-4">
                <div className="space-y-2">
                  {[...Array(1)].map((_, i) => (
                    <div
                      key={i}
                      className="h-20 bg-gray-200 rounded-lg w-full"
                    ></div>
                  ))}
                </div>
              </div>

              {/* Almacenamiento */}
              <div className="space-y-2">
                <div className="h-8 bg-gray-200 rounded-lg w-full"></div>
              </div>

              {/* Descripción */}
              <div className="space-y-2 pt-4">
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-11/12"></div>
                <div className="h-4 bg-gray-200 rounded w-10/12"></div>
                <div className="h-4 bg-gray-200 rounded w-9/12"></div>
              </div>

              {/* Opciones de entrega */}
              <div className="space-y-3 pt-4">
                <div className="h-5 bg-gray-200 rounded w-48"></div>
                <div className="space-y-2">
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className="h-20 bg-gray-200 rounded-lg w-full"
                    ></div>
                  ))}
                </div>
              </div>
              {/*Color */}
              <div className="space-y-3">
                <div className="flex gap-3">
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className="w-12 h-12 bg-gray-200 rounded-full"
                    ></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sección de Trade-In */}
      <div className="bg-white pb-4 mt-8 lg:mt-4">
        <div className="container mx-auto px-4 md:px-6 lg:px-12">
          <div className="max-w-7xl mx-auto">
            <div className="h-48 bg-gray-200 rounded-2xl"></div>
          </div>
        </div>
      </div>

      {/* Banner de beneficios */}
      <div className="bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="space-y-4">
            <div className="h-8 bg-gray-200 rounded w-64 mx-auto"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Especificaciones */}
      <div className="py-12">
        <div className="container mx-auto px-4 md:px-6 lg:px-12">
          <div className="max-w-7xl mx-auto">
            <div className="h-10 bg-gray-200 rounded w-56 mx-auto mb-8"></div>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
