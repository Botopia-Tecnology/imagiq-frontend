"use client";

import { useEffect, useRef, useState } from "react";
import { googleMapsLoader } from "@/services/googleMapsLoader";

interface GoogleMapRouteProps {
  origenLat?: number;
  origenLng?: number;
  destinoLat?: number;
  destinoLng?: number;
  direccionOrigen?: string;
  direccionDestino?: string;
  modoTransporte?: "bicycling" | "driving" | "walking" | "transit";
  onRouteCalculated?: (distance: string, duration: string) => void;
}

export function GoogleMapRoute({
  origenLat,
  origenLng,
  destinoLat,
  destinoLng,
  direccionOrigen,
  direccionDestino,
  modoTransporte = "bicycling",
  onRouteCalculated,
}: Readonly<GoogleMapRouteProps>) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const directionsServiceRef = useRef<google.maps.DirectionsService | null>(null);
  const directionsRendererRef = useRef<google.maps.DirectionsRenderer | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [routeInfo, setRouteInfo] = useState<{ distance: string; duration: string } | null>(null);

  useEffect(() => {
    let isMounted = true;

    const initializeMap = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Cargar Google Maps
        await googleMapsLoader.load();

        if (!isMounted || !mapRef.current) return;

        // Verificar que Google Maps esté disponible
        if (!window.google || !window.google.maps) {
          throw new Error("Google Maps API no está disponible");
        }

        const { maps } = window.google;

        // Determinar coordenadas de origen y destino
        let origin: google.maps.LatLng | string | null = null;
        let destination: google.maps.LatLng | string | null = null;

        if (origenLat && origenLng) {
          origin = new maps.LatLng(origenLat, origenLng);
        } else if (direccionOrigen) {
          origin = direccionOrigen;
        }

        if (destinoLat && destinoLng) {
          destination = new maps.LatLng(destinoLat, destinoLng);
        } else if (direccionDestino) {
          destination = direccionDestino;
        }

        if (!origin || !destination) {
          throw new Error("Se requiere origen y destino para mostrar la ruta");
        }

        // Crear mapa
        const map = new maps.Map(mapRef.current, {
          zoom: 13,
          center: origin instanceof maps.LatLng ? origin : undefined,
          mapTypeId: maps.MapTypeId.ROADMAP,
          disableDefaultUI: false,
          zoomControl: true,
          streetViewControl: false,
          fullscreenControl: true,
        });

        mapInstanceRef.current = map;

        // Crear servicio de direcciones
        const directionsService = new maps.DirectionsService();
        const directionsRenderer = new maps.DirectionsRenderer({
          map,
          suppressMarkers: false,
          polylineOptions: {
            strokeColor: "#17407A",
            strokeWeight: 5,
            strokeOpacity: 0.8,
          },
          markerOptions: {
            // Los marcadores por defecto de Google Maps son suficientes
          },
        });

        directionsServiceRef.current = directionsService;
        directionsRendererRef.current = directionsRenderer;

        // Calcular ruta
        directionsService.route(
          {
            origin,
            destination,
            travelMode: maps.TravelMode[modoTransporte.toUpperCase() as keyof typeof maps.TravelMode] || maps.TravelMode.BICYCLING,
          },
          (result, status) => {
            if (!isMounted) return;

            if (status === maps.DirectionsStatus.OK && result) {
              // Renderizar ruta
              directionsRenderer.setDirections(result);

              // Obtener información de la ruta
              const route = result.routes[0];
              if (route && route.legs && route.legs.length > 0) {
                const leg = route.legs[0];
                const distance = leg.distance?.text || "N/A";
                const duration = leg.duration?.text || "N/A";

                setRouteInfo({ distance, duration });
                onRouteCalculated?.(distance, duration);

                // Ajustar vista del mapa para mostrar toda la ruta
                const bounds = new maps.LatLngBounds();
                if (leg.start_location) bounds.extend(leg.start_location);
                if (leg.end_location) bounds.extend(leg.end_location);
                map.fitBounds(bounds);
              }
              setIsLoading(false);
            } else {
              console.error("Error calculando ruta:", status);
              setError(`No se pudo calcular la ruta: ${status}`);
              setIsLoading(false);
            }
          }
        );
      } catch (err) {
        if (!isMounted) return;
        console.error("Error inicializando mapa:", err);
        setError(err instanceof Error ? err.message : "Error desconocido");
        setIsLoading(false);
      }
    };

    initializeMap();

    return () => {
      isMounted = false;
      // Limpiar recursos si es necesario
      if (directionsRendererRef.current) {
        directionsRendererRef.current.setMap(null);
      }
    };
  }, [origenLat, origenLng, destinoLat, destinoLng, direccionOrigen, direccionDestino, modoTransporte, onRouteCalculated]);

  return (
    <div className="relative w-full h-full">
      <div ref={mapRef} className="w-full h-full" style={{ minHeight: "350px" }} />
      
      {isLoading && (
        <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10">
          <div className="text-center">
            <div className="w-10 h-10 border-4 border-gray-200 border-t-[#17407A] rounded-full animate-spin mx-auto mb-2" />
            <p className="text-sm text-gray-600">Calculando ruta...</p>
          </div>
        </div>
      )}

      {error && (
        <div className="absolute inset-0 bg-white/90 flex items-center justify-center z-10">
          <div className="text-center p-4">
            <p className="text-sm text-red-600 mb-2">{error}</p>
            <p className="text-xs text-gray-500">Verifica que las direcciones sean válidas</p>
          </div>
        </div>
      )}

      {routeInfo && !isLoading && !error && (
        <div className="absolute bottom-4 left-4 right-4 bg-white rounded-lg shadow-lg p-3 z-10 border border-gray-200">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <svg
                className="w-5 h-5 text-[#17407A]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
              <div>
                <p className="text-xs text-gray-500">Distancia</p>
                <p className="text-sm font-semibold text-gray-900">{routeInfo.distance}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <svg
                className="w-5 h-5 text-[#17407A]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div>
                <p className="text-xs text-gray-500">Tiempo estimado</p>
                <p className="text-sm font-semibold text-gray-900">{routeInfo.duration}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

