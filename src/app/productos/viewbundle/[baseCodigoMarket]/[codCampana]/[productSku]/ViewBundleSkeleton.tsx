/**
 * ViewBundleSkeleton - Skeleton de carga para la vista de bundle
 *
 * Este componente muestra un esqueleto animado que simula el layout
 * de la página de bundle mientras se cargan los datos reales.
 *
 * Estructura:
 * - StickyPriceBar skeleton
 * - Breadcrumbs skeleton
 * - Grid de 2 columnas (carrusel + info con PurchaseSummary)
 * - Grid de productos del bundle
 * - Benefits section placeholder
 */

export default function ViewBundleSkeleton() {
  return (
    <div className="bg-white min-h-screen">
      {/* StickyPriceBar skeleton */}
      <div className="fixed top-[70px] xl:top-[95px] left-0 right-0 z-[1500] bg-white border-b border-gray-200 shadow-sm">
        <div className="mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between gap-2 md:gap-4 py-2.5 animate-pulse">
            {/* Nombre del dispositivo */}
            <div className="flex-shrink-0 max-w-[140px] md:max-w-[240px]">
              <div className="h-4 bg-gray-200 rounded w-32"></div>
            </div>
            {/* Precio */}
            <div className="flex-1 flex justify-center items-center">
              <div className="h-6 bg-gray-200 rounded w-24"></div>
            </div>
            {/* Botón */}
            <div className="flex-shrink-0">
              <div className="h-10 bg-gray-200 rounded-full w-32"></div>
            </div>
          </div>
        </div>
        <div className="h-0.5 w-full bg-gray-200"></div>
      </div>

      {/* Breadcrumbs skeleton */}
      <div className="bg-white pt-4">
        <div className="container mx-auto px-4 md:px-6 lg:px-12 mb-4 animate-pulse">
          <div className="flex items-center gap-2">
            <div className="h-4 bg-gray-200 rounded w-16"></div>
            <div className="h-4 w-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-20"></div>
            <div className="h-4 w-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-24"></div>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="bg-white pb-8">
        <div className="container mx-auto px-4 md:px-6 lg:px-12">
          <div className="max-w-7xl mx-auto">

            {/* Grid principal: Carrusel + Info */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12 animate-pulse">

              {/* Columna izquierda: Carrusel de imágenes */}
              <div className="space-y-4">
                {/* Imagen principal skeleton */}
                <div className="aspect-square bg-gray-200 rounded-xl relative overflow-hidden">
                  <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200"></div>
                </div>

                {/* Info del producto principal skeleton */}
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>

              {/* Columna derecha: Info del bundle */}
              <div className="space-y-6">
                {/* Título skeleton */}
                <div className="space-y-2 animate-pulse">
                  <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-5 bg-gray-200 rounded w-1/2"></div>
                </div>

                {/* Válido hasta skeleton */}
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-48"></div>
                </div>

                {/* Productos incluidos skeleton */}
                <div className="animate-pulse space-y-4">
                  <div className="h-6 bg-gray-200 rounded w-40"></div>
                  <div className="space-y-2">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-start gap-2">
                        <div className="w-4 h-4 bg-gray-200 rounded-full mt-1"></div>
                        <div className="flex-1 space-y-1">
                          <div className="h-4 bg-gray-200 rounded w-full"></div>
                          <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Selector de opciones skeleton */}
                <div className="animate-pulse space-y-3">
                  <div className="h-5 bg-gray-200 rounded w-32"></div>
                  <div className="flex gap-2">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-10 bg-gray-200 rounded-md w-20"></div>
                    ))}
                  </div>
                </div>

                {/* PurchaseSummary skeleton */}
                <div className="bg-gray-50 rounded-xl border border-gray-200 p-6 space-y-4 animate-pulse">
                  {/* Título */}
                  <div className="h-6 bg-gray-200 rounded w-48"></div>
                  {/* Producto info */}
                  <div className="space-y-2">
                    <div className="h-5 bg-gray-200 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  </div>
                  {/* Precio */}
                  <div className="space-y-2">
                    <div className="h-8 bg-gray-200 rounded w-32"></div>
                    <div className="h-4 bg-gray-200 rounded w-24"></div>
                  </div>
                  {/* Entrega */}
                  <div className="h-4 bg-gray-200 rounded w-40"></div>
                  {/* Botones */}
                  <div className="space-y-2">
                    <div className="h-12 bg-gray-200 rounded-full w-full"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Grid de productos del bundle skeleton */}
            <div className="border-t pt-12 animate-pulse">
              {/* Título skeleton */}
              <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-8"></div>

              {/* Grid de productos */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    {/* Imagen skeleton */}
                    <div className="relative w-full aspect-square bg-gray-200">
                      <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200"></div>
                    </div>
                    {/* Info skeleton */}
                    <div className="p-4 space-y-3">
                      <div className="h-5 bg-gray-200 rounded w-full"></div>
                      <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      <div className="h-10 bg-gray-200 rounded-full w-full mt-4"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Benefits Section skeleton */}
            <div className="mt-12 animate-pulse">
              <div className="bg-gray-50 rounded-lg p-8 text-center">
                <div className="h-6 bg-gray-200 rounded w-64 mx-auto"></div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Agregar la animación shimmer personalizada */}
      <style jsx>{`
        @keyframes shimmer {
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  );
}
