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
    <div className={`bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 rounded-lg p-12 text-center min-h-[400px] flex items-center justify-center ${className}`}>
      <div className="max-w-md">
        {/* Spinner animado */}
        <div className="relative mb-6">
          <div className="w-16 h-16 mx-auto border-4 border-gray-200 border-t-[#0066CC] rounded-full animate-spin" />
          <div className="absolute inset-0 w-16 h-16 mx-auto border-4 border-transparent border-b-blue-300 rounded-full animate-spin animation-delay-150" />
        </div>
        
        {/* Placeholders de texto */}
        <div className="space-y-3 mb-6">
          <div className="h-4 bg-gray-200 rounded w-48 mx-auto animate-pulse" />
          <div className="h-3 bg-gray-200 rounded w-64 mx-auto animate-pulse" />
        </div>
        
        {/* Barra de progreso indeterminada */}
        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
          <div className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full animate-pulse" style={{ width: '60%' }} />
        </div>
        
        <div className="h-2 bg-gray-200 rounded w-32 mx-auto mt-4 animate-pulse" />
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
