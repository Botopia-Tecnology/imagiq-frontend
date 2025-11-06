/**
 * StoreCardSkeleton - Loading skeleton para las tarjetas de tiendas
 */

export default function StoreCardSkeleton() {
  return (
    <div
      className="bg-white rounded-[16px] border border-black px-4 py-3 flex flex-col gap-1 animate-pulse"
      style={{ boxShadow: "none" }}
    >
      {/* Título skeleton */}
      <div className="h-5 bg-gray-200 rounded-md w-3/4 mb-2"></div>

      {/* Dirección skeleton */}
      <div className="h-4 bg-gray-200 rounded-md w-full mb-1"></div>

      {/* Teléfono skeleton */}
      <div className="h-4 bg-gray-200 rounded-md w-2/3 mb-1"></div>

      {/* Email skeleton */}
      <div className="h-4 bg-gray-200 rounded-md w-4/5 mb-1"></div>

      {/* Horario skeleton */}
      <div className="h-4 bg-gray-200 rounded-md w-full mb-2"></div>

      {/* Botones skeleton */}
      <div className="flex gap-2 mt-2 justify-center">
        <div className="bg-gray-200 rounded-[16px] h-8 w-28"></div>
        <div className="bg-gray-200 rounded-[16px] h-8 w-32"></div>
      </div>
    </div>
  );
}
