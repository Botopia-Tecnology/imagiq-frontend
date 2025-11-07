/**
 * StoreCarouselSkeleton - Loading skeleton para las tarjetas del carrusel de tiendas
 */

export default function StoreCarouselSkeleton() {
  return (
    <div
      className="flex-shrink-0 w-[280px] bg-white rounded-xl border-2 border-gray-200 shadow-md p-4 animate-pulse"
    >
      {/* Título skeleton */}
      <div className="h-4 bg-gray-200 rounded-md w-3/4 mb-2"></div>

      {/* Botones skeleton */}
      <div className="flex gap-2 mb-3">
        <div className="flex-1 bg-gray-200 rounded-lg h-9"></div>
        <div className="flex-1 bg-gray-200 rounded-lg h-9"></div>
      </div>

      {/* Información detallada skeleton */}
      <div className="space-y-2 pt-2.5 border-t border-gray-200">
        <div className="h-3 bg-gray-200 rounded-md w-full"></div>
        <div className="h-3 bg-gray-200 rounded-md w-2/3"></div>
        <div className="h-3 bg-gray-200 rounded-md w-4/5"></div>
        <div className="h-3 bg-gray-200 rounded-md w-3/4"></div>
        <div className="h-3 bg-gray-200 rounded-md w-full"></div>
      </div>
    </div>
  );
}
