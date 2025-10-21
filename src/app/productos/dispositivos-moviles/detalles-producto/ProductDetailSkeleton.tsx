/**
 * Skeleton loader para la página de detalles del producto
 * Muestra placeholders mientras el contenido se está cargando
 */

export default function ProductDetailSkeleton() {
  return (
    <main
      className="w-full bg-white min-h-screen"
      style={{ fontFamily: "SamsungSharpSans" }}
    >
      {/* DESKTOP: Grid principal */}
      <section className="hidden lg:block animate-pulse">
        <div className="max-w-[1400px] mx-auto px-8 py-12">
          <div className="grid grid-cols-12 gap-16 items-start">
            {/* Columna izquierda: Imagen */}
            <div className="col-span-6 sticky top-20">
              <div className="w-full flex flex-col items-center">
                {/* Placeholder de imagen principal */}
                <div className="flex justify-center h-[500px] items-center w-full">
                  <div className="w-full aspect-square bg-gray-200 rounded-2xl"></div>
                </div>

                {/* Puntos indicadores */}
                <div className="flex justify-center space-x-2 mt-6">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="w-2 h-2 rounded-full bg-gray-300"></div>
                  ))}
                </div>
              </div>
            </div>

            {/* Columna derecha: Info y acciones */}
            <div className="col-span-6 flex flex-col justify-start gap-4 pt-4">
              {/* Nombre del producto */}
              <div className="h-10 bg-gray-200 rounded-lg w-3/4 mb-2"></div>

              {/* SKU */}
              <div className="h-3 bg-gray-200 rounded w-32 mb-3"></div>

              {/* Calificación */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="w-4 h-4 bg-gray-200 rounded"></div>
                  ))}
                </div>
                <div className="h-4 bg-gray-200 rounded w-8"></div>
                <div className="h-3 bg-gray-200 rounded w-20"></div>
              </div>

              {/* Selector de color */}
              <div className="mb-4">
                <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-20 mb-3"></div>
                <div className="flex gap-3">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="w-10 h-10 bg-gray-200 rounded-full"></div>
                  ))}
                </div>
              </div>

              {/* Selector de almacenamiento */}
              <div className="mb-4">
                <div className="h-4 bg-gray-200 rounded w-40 mb-3"></div>
                <div className="flex gap-3">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-10 bg-gray-200 rounded-full w-24"></div>
                  ))}
                </div>
              </div>

              {/* Delivery Options */}
              <div className="space-y-3 mb-4">
                <div className="h-5 bg-gray-200 rounded w-40"></div>
                <div className="space-y-2">
                  {[...Array(2)].map((_, i) => (
                    <div key={i} className="h-16 bg-gray-200 rounded-lg w-full"></div>
                  ))}
                </div>
              </div>

              {/* Descripción */}
              <div className="space-y-2 mb-6">
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                <div className="h-4 bg-gray-200 rounded w-4/6"></div>
              </div>

              {/* Financing Section */}
              <div className="space-y-2">
                <div className="h-6 bg-gray-200 rounded w-56"></div>
                <div className="h-4 bg-gray-200 rounded w-48"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MOBILE: Stack vertical */}
      <section className="lg:hidden animate-pulse">
        <div className="px-4 py-8 max-w-md mx-auto">
          {/* Imagen mobile */}
          <div className="flex flex-col items-center mb-8">
            <div className="relative rounded-2xl px-2 py-2 w-full bg-gray-100">
              <div className="flex justify-center h-[400px] items-center">
                <div className="w-48 h-72 bg-gray-200 rounded-lg"></div>
              </div>
            </div>
          </div>

          {/* Header */}
          <div className="mb-4 text-center">
            <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-24 mx-auto mb-4"></div>
          </div>

          {/* Precio */}
          <div className="mb-4">
            <div className="h-8 bg-gray-200 rounded w-32 mx-auto mb-1"></div>
            <div className="h-3 bg-gray-200 rounded w-24 mx-auto mb-4"></div>
          </div>

          {/* Botones */}
          <div className="flex gap-3 mb-6 justify-center">
            <div className="h-10 bg-gray-200 rounded-full w-32"></div>
            <div className="h-10 bg-gray-200 rounded-full w-32"></div>
          </div>

          {/* Capacidad */}
          <div className="mb-6">
            <div className="h-4 bg-gray-200 rounded w-32 mx-auto mb-2"></div>
            <div className="flex gap-3 justify-center">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-10 bg-gray-200 rounded-full w-20"></div>
              ))}
            </div>
          </div>

          {/* Color */}
          <div className="mb-8">
            <div className="h-4 bg-gray-200 rounded w-20 mx-auto mb-2"></div>
            <div className="flex gap-5 items-center justify-center">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="w-10 h-10 bg-gray-200 rounded-full"></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
