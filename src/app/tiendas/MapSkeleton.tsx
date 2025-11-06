/**
 * MapSkeleton - Loading skeleton para el mapa
 */

export default function MapSkeleton() {
  return (
    <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          {/* Animated loading circle */}
          <div className="w-16 h-16 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
        </div>
        <div className="text-gray-600 font-semibold text-lg" style={{ fontFamily: "Samsung Sharp Sans, sans-serif" }}>
          Cargando mapa...
        </div>
      </div>
    </div>
  );
}
