/**
 * Estados visuales del FlixmediaPlayer
 * Componentes de UI para diferentes estados del reproductor
 */

"use client";

interface StateCardProps {
  className?: string;
}

export function FlixmediaEmptyState({ className = "" }: StateCardProps) {
  return (
    <div className={`bg-gray-50 border border-gray-200 rounded-lg p-8 text-center ${className}`}>
      <div className="text-gray-400 mb-2">
        <svg
          className="w-12 h-12 mx-auto"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
          />
        </svg>
      </div>
      <p className="text-gray-500 text-sm">
        Contenido multimedia no disponible
      </p>
      <p className="text-gray-400 text-xs mt-1">
        No hay SKU o EAN asociado a este producto
      </p>
    </div>
  );
}

export function FlixmediaLoadingState({ className = "" }: StateCardProps) {
  return (
    <div className={`bg-white border border-gray-200 rounded-lg p-8 min-h-[400px] ${className}`}>
      {/* Skeleton estático - SIN animaciones de loading */}
      <div className="space-y-6">
        {/* Header skeleton */}
        <div className="h-8 bg-gray-100 rounded w-3/4" />
        
        {/* Content blocks */}
        <div className="space-y-4">
          <div className="h-64 bg-gray-100 rounded" />
          <div className="h-4 bg-gray-100 rounded w-full" />
          <div className="h-4 bg-gray-100 rounded w-5/6" />
          <div className="h-4 bg-gray-100 rounded w-4/5" />
        </div>
        
        {/* Bottom section */}
        <div className="grid grid-cols-2 gap-4 mt-6">
          <div className="h-32 bg-gray-100 rounded" />
          <div className="h-32 bg-gray-100 rounded" />
        </div>
      </div>
    </div>
  );
}

export function FlixmediaNotFoundState({ className = "" }: StateCardProps) {
  return (
    <div className={`bg-gray-50 border border-gray-200 rounded-lg p-8 text-center ${className}`}>
      <div className="text-gray-400 mb-2">
        <svg
          className="w-12 h-12 mx-auto"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
      <p className="text-gray-500 text-sm">
        Contenido multimedia no disponible
      </p>
      <p className="text-gray-400 text-xs mt-1">
        Este producto no tiene multimedia en Flixmedia
      </p>
    </div>
  );
}

export function FlixmediaSpecsSkeleton({ className = "" }: StateCardProps) {
  return (
    <div className={`w-full ${className}`}>
      {/* Header skeleton - ESTÁTICO */}
      <div className="border border-gray-200 rounded-lg bg-white p-6 mb-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="h-7 bg-gray-100 rounded w-64" />
          <div className="h-10 bg-gray-100 rounded w-40" />
        </div>
      </div>

      {/* Key features skeleton - ESTÁTICO */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="border border-gray-200 rounded-lg p-4 bg-white">
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 bg-gray-100 rounded" />
              <div className="h-4 bg-gray-100 rounded w-24" />
            </div>
          </div>
        ))}
      </div>

      {/* Specs table skeleton - ESTÁTICO */}
      <div className="border border-gray-200 rounded-lg bg-white p-6">
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex justify-between items-center py-3 border-b border-gray-100 last:border-0">
              <div className="h-4 bg-gray-100 rounded w-32" />
              <div className="h-4 bg-gray-100 rounded w-48" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
