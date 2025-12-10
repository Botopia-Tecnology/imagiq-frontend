"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { GoogleMapRouteMultiMode } from "@/app/tracking-service/components/GoogleMapRouteMultiMode";

interface PickupMapProps {
  direccionTienda?: string;
  ciudadTienda?: string;
  nombreTienda?: string;
  descripcionTienda?: string;
  latitudTienda?: string;
  longitudTienda?: string;
}

export default function PickupMap({
  direccionTienda,
  ciudadTienda,
  nombreTienda,
  descripcionTienda,
  latitudTienda,
  longitudTienda,
}: Readonly<PickupMapProps>) {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);

  // Remover "Ses" del inicio de la descripción si existe
  const nombreTiendaFormateado = descripcionTienda
    ? descripcionTienda.replace(/^Ses\s+/i, '').trim()
    : nombreTienda || "Tienda IMAGIQ";

  // Construir dirección completa
  const fullTiendaAddress = direccionTienda && ciudadTienda
    ? `${direccionTienda}, ${ciudadTienda}`
    : direccionTienda || nombreTiendaFormateado || "Ubicación de la tienda";

  // Obtener ubicación del usuario - Solicitar permiso inmediatamente al cargar
  useEffect(() => {
    if (navigator.geolocation) {
      // Solicitar permiso de ubicación inmediatamente
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setLocationError(null);
        },
        (error) => {
          console.warn("Error obteniendo ubicación:", error);
          let errorMessage = "No se pudo obtener tu ubicación. La ruta se mostrará sin punto de origen.";
          if (error.code === error.PERMISSION_DENIED) {
            errorMessage = "Permiso de ubicación denegado. Por favor, permite el acceso a tu ubicación para ver la ruta desde tu posición actual.";
          } else if (error.code === error.POSITION_UNAVAILABLE) {
            errorMessage = "Tu ubicación no está disponible. La ruta se mostrará sin punto de origen.";
          } else if (error.code === error.TIMEOUT) {
            errorMessage = "Tiempo de espera agotado al obtener tu ubicación. La ruta se mostrará sin punto de origen.";
          }
          setLocationError(errorMessage);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0, // No usar caché, siempre obtener ubicación fresca
        }
      );
    } else {
      setLocationError("Tu navegador no soporta geolocalización.");
    }
  }, []);

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col h-full">
      {/* Header */}
      <div className="bg-white p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center aspect-square flex-shrink-0">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-black text-base mb-1">Ubicación de la tienda</h3>
              <p className="text-sm text-gray-500">
                {nombreTiendaFormateado}
              </p>
              {direccionTienda && (
                <p className="text-xs text-gray-600 mt-1">
                  {fullTiendaAddress}
                </p>
              )}
            </div>
          </div>
          
          {/* Navigation Buttons - Moved to header */}
          {(direccionTienda || nombreTiendaFormateado) && (
            <div className="flex gap-2">
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullTiendaAddress)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-3 py-2 bg-gray-400 text-white rounded-[12px] hover:bg-gray-500 transition text-sm font-medium shadow-sm"
              >
                <Image 
                  src="https://res.cloudinary.com/dgnqk0ucm/image/upload/v1762445116/Google_Maps_icon__2020.svg_r4s0ks.png" 
                  alt="Google Maps"
                  width={14}
                  height={16}
                  className="w-3.5 h-4"
                />
                Maps
              </a>
              <a
                href={`https://waze.com/ul?q=${encodeURIComponent(fullTiendaAddress)}&navigate=yes`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-3 py-2 bg-[#33CCFF] text-white rounded-[12px] hover:bg-[#00B8E6] transition text-sm font-medium shadow-sm"
              >
                <Image 
                  src="https://res.cloudinary.com/dgnqk0ucm/image/upload/v1762445166/unnamed_jfcf46.png" 
                  alt="Waze"
                  width={16}
                  height={16}
                  className="w-4 h-4"
                />
                Waze
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Interactive Map with Google Maps - Multiple Transport Modes */}
      {(latitudTienda && longitudTienda) || direccionTienda ? (
        <div className="relative w-full h-[350px]">
          {userLocation ? (
            <GoogleMapRouteMultiMode
              origenLat={userLocation.lat}
              origenLng={userLocation.lng}
              destinoLat={latitudTienda ? Number.parseFloat(String(latitudTienda).trim()) : undefined}
              destinoLng={longitudTienda ? Number.parseFloat(String(longitudTienda).trim()) : undefined}
              direccionDestino={fullTiendaAddress}
              isPickup={true}
            />
          ) : (
            <div className="relative w-full h-[350px]">
              <GoogleMapRouteMultiMode
                destinoLat={latitudTienda ? Number.parseFloat(String(latitudTienda).trim()) : undefined}
                destinoLng={longitudTienda ? Number.parseFloat(String(longitudTienda).trim()) : undefined}
                direccionDestino={fullTiendaAddress}
                isPickup={true}
              />
              {locationError && (
                <div className="absolute top-2 left-2 right-2 bg-yellow-50 border border-yellow-200 rounded-lg p-2 z-20">
                  <p className="text-xs text-yellow-800 font-medium mb-1">⚠️ {locationError}</p>
                  <p className="text-xs text-yellow-700">
                    El mapa muestra solo la ubicación de la tienda. Para ver la ruta desde tu ubicación, permite el acceso a tu ubicación.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="relative w-full h-[350px] bg-gray-100 flex items-center justify-center">
          <p className="text-gray-500">Cargando información de la tienda...</p>
        </div>
      )}

      {/* Store Info - Instructions */}
      <div className="px-6 py-4 bg-white border-t border-gray-200">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-white border-2 border-black rounded-full flex items-center justify-center flex-shrink-0 aspect-square">
            <span className="text-black text-base font-bold leading-none">S</span>
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-gray-900 mb-1">
              Instrucciones para recoger tu pedido:
            </p>
            <p className="text-xs text-gray-700 leading-relaxed">
              Presenta tu <strong>identificación</strong> y el <strong>token personal</strong> al personal de la tienda para recoger tu pedido.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Named export for compatibility
export { PickupMap };