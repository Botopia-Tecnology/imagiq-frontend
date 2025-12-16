"use client";

import { GoogleMapRouteMultiMode } from "@/app/tracking-service/components/GoogleMapRouteMultiMode";

interface DeliveryMapProps {
  direccionOrigen?: string;
  descripcionOrigen?: string;
  direccionDestino?: string;
  ciudadDestino?: string;
  latitudOrigen?: number;
  longitudOrigen?: number;
  latitudDestino?: number;
  longitudDestino?: number;
}

export function DeliveryMap({
  direccionOrigen,
  descripcionOrigen,
  direccionDestino,
  ciudadDestino,
  latitudOrigen,
  longitudOrigen,
  latitudDestino,
  longitudDestino,
}: Readonly<DeliveryMapProps>) {
  const fullDestinoAddress = direccionDestino && ciudadDestino
    ? `${direccionDestino}, ${ciudadDestino}`
    : direccionDestino || "Dirección de entrega";

  // Remover "Ses" del inicio de la descripción si existe
  const descripcionOrigenFormateada = descripcionOrigen
    ? descripcionOrigen.replace(/^Ses\s+/i, '').trim()
    : undefined;

  const fullOrigenAddress = direccionOrigen && descripcionOrigenFormateada
    ? `${direccionOrigen}, ${descripcionOrigenFormateada}`
    : direccionOrigen || descripcionOrigenFormateada || "Origen";

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Interactive Map with Google Maps - Multiple Transport Modes */}
      {(latitudOrigen && longitudOrigen) || direccionOrigen ? (
        <div className="relative w-full h-[495px]">
          <GoogleMapRouteMultiMode
            origenLat={latitudOrigen}
            origenLng={longitudOrigen}
            destinoLat={latitudDestino}
            destinoLng={longitudDestino}
            direccionOrigen={(latitudOrigen && longitudOrigen) ? fullOrigenAddress : undefined}
            direccionDestino={fullDestinoAddress}
          />
        </div>
      ) : (
        <div className="relative w-full h-[460px] bg-gray-100 flex items-center justify-center">
          <p className="text-gray-500">Cargando información de la ruta...</p>
        </div>
      )}

      {/* Route Info - Más compacta */}
      <div className="px-4 py-2.5 bg-white border-t border-gray-200">
        <div className="flex items-start gap-3">
          {/* Origen - Icono de camión (tienda) */}
          <div className="flex-1 flex items-start gap-2 min-w-0">
            <div className="w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" fill="white" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M15 18H9" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14" fill="white" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <circle cx="17" cy="18" r="2" fill="white" stroke="#000000" stroke-width="2"/>
                <circle cx="7" cy="18" r="2" fill="white" stroke="#000000" stroke-width="2"/>
              </svg>
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-xs font-medium text-gray-900 block break-words">
                {fullOrigenAddress}
              </span>
            </div>
          </div>

          {/* Flecha */}
          <div className="flex items-center flex-shrink-0 pt-0.5">
            <svg
              className="w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </div>

          {/* Destino - Icono de casa */}
          <div className="flex-1 flex items-start gap-2 min-w-0">
            <div className="w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" fill="white" stroke="#000000" stroke-width="2"/>
              </svg>
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-xs font-medium text-gray-900 block break-words">
                {fullDestinoAddress}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
