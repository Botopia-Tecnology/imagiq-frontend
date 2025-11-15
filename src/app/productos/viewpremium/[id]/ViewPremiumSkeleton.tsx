/**
 * Skeleton loader para la página viewPremium
 * Replica la estructura de dos columnas con carrusel sticky y panel de información
 */

export default function ViewPremiumSkeleton() {
  return (
    <div className="bg-white min-h-screen animate-pulse">

      {/* Layout principal de dos columnas */}
      <div className="bg-white pt-0 pb-0 mb-0 min-h-screen">
        {/* Breadcrumbs */}
        <div className="px-4 md:px-6 lg:px-12 mb-4 pt-4">
          <div className="h-4 bg-gray-200 rounded w-48"></div>
        </div>

        {/* Grid principal */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 items-start relative">
          {/* Columna izquierda: Carrusel - ocupa el ancho */}
          <div className="lg:col-span-9 lg:sticky lg:top-24 self-start lg:h-screen overflow-hidden">
            {/* DESKTOP: Carrusel grande */}
            <div className="hidden lg:block">
              <div className="w-full h-[700px] flex items-center justify-center bg-transparent">
                <div className="w-full h-full bg-gray-200"></div>
              </div>

              {/* Indicadores de navegación */}
              <div className="flex justify-center gap-2 mt-6 mb-4">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="w-3 h-3 rounded-full bg-gray-300"
                  ></div>
                ))}
              </div>
            </div>

            {/* MOBILE: Carrusel compacto */}
            <div className="lg:hidden">
              <div className="w-full h-[220px] bg-transparent flex items-center justify-center">
                <div className="w-full h-full bg-gray-200"></div>
              </div>

              {/* Indicadores mobile */}
              <div className="flex justify-center gap-2 mt-4 mb-4">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="w-3 h-3 rounded-full bg-gray-300"
                  ></div>
                ))}
              </div>
            </div>
          </div>

          {/* Columna derecha: Información del producto */}
          <div className="lg:col-span-3 px-4 md:px-6 lg:px-12 mt-0 lg:mt-0 lg:min-h-[200vh]">
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
