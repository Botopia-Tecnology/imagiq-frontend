"use client";

import { useEffect, useRef, useState, type ReactElement } from "react";
import { googleMapsLoader } from "@/services/googleMapsLoader";

type TransportMode = "driving" | "bicycling" | "walking";

interface RouteInfo {
  distance: string;
  duration: string;
}

// Interfaz extendida para el mapa con marcadores personalizados
interface MapWithCustomMarkers extends google.maps.Map {
  customMarkers?: google.maps.Marker[];
}

interface GoogleMapRouteMultiModeProps {
  origenLat?: number;
  origenLng?: number;
  destinoLat?: number;
  destinoLng?: number;
  direccionOrigen?: string;
  direccionDestino?: string;
  isPickup?: boolean; // Si es true, el destino se muestra como "S" azul (tienda)
}

export function GoogleMapRouteMultiMode({
  origenLat,
  origenLng,
  destinoLat,
  destinoLng,
  direccionOrigen,
  direccionDestino,
  isPickup = false,
}: Readonly<GoogleMapRouteMultiModeProps>) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const directionsServiceRef = useRef<google.maps.DirectionsService | null>(null);
  const directionsRendererRef = useRef<google.maps.DirectionsRenderer | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMode, setSelectedMode] = useState<TransportMode>("driving"); // Por defecto carro
  const [mapType, setMapType] = useState<"roadmap" | "satellite">("roadmap");
  const [routesInfo, setRoutesInfo] = useState<Record<TransportMode, RouteInfo | null>>({
    driving: null,
    bicycling: null,
    walking: null,
  });

  const calculateRoute = (mode: TransportMode) => {
    if (!mapInstanceRef.current || !directionsServiceRef.current || !directionsRendererRef.current || !window.google) {
      return;
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
      return;
    }

    // Calcular ruta
    directionsServiceRef.current.route(
      {
        origin,
        destination,
        travelMode: maps.TravelMode[mode.toUpperCase() as keyof typeof maps.TravelMode],
      },
      (result, status) => {
        if (status === maps.DirectionsStatus.OK && result) {
          // Guardar información de la ruta
          const route = result.routes[0];
          if (route && route.legs && route.legs.length > 0) {
            const leg = route.legs[0];
            const distance = leg.distance?.text || "N/A";
            const duration = leg.duration?.text || "N/A";

            setRoutesInfo((prev) => ({
              ...prev,
              [mode]: { distance, duration },
            }));

            // Renderizar ruta SIEMPRE si es el modo seleccionado
            if (mode === selectedMode && directionsRendererRef.current) {
              // Renderizar la ruta (sin marcadores porque suppressMarkers: true)
              directionsRendererRef.current.setDirections(result);
              
              // Ajustar vista del mapa para mostrar ambos puntos A y B
              if (mapInstanceRef.current) {
                const bounds = new maps.LatLngBounds();
                if (leg.start_location) bounds.extend(leg.start_location);
                if (leg.end_location) bounds.extend(leg.end_location);
                // Agregar padding generoso para que la ruta y los marcadores se vean bien
                mapInstanceRef.current.fitBounds(bounds, 80);
              }
            }
          }
        } else {
          console.error(`Error calculando ruta para ${mode}:`, status);
          setRoutesInfo((prev) => ({
            ...prev,
            [mode]: null,
          }));
        }
      }
    );
  };

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

        // Permitir mostrar solo destino si no hay origen (especialmente para pickup)
        if (!destination) {
          throw new Error("Se requiere al menos un destino para mostrar el mapa");
        }
        
        // Si no hay origen, solo mostraremos el marcador de destino sin ruta
        if (!origin) {
          // Continuar sin error, solo mostraremos el destino
        }

        // Determinar centro del mapa (punto medio si hay ambos puntos, sino usar origen o destino)
        let mapCenter: google.maps.LatLng | undefined = undefined;
        if (origenLat && origenLng && destinoLat && destinoLng) {
          // Punto medio entre origen y destino
          const centerLat = (origenLat + destinoLat) / 2;
          const centerLng = (origenLng + destinoLng) / 2;
          mapCenter = new maps.LatLng(centerLat, centerLng);
        } else if (destination instanceof maps.LatLng) {
          mapCenter = destination; // Priorizar destino si no hay origen
        } else if (origin instanceof maps.LatLng) {
          mapCenter = origin;
        }

        // Crear mapa
        const map = new maps.Map(mapRef.current, {
          zoom: mapCenter ? 13 : 10,
          center: mapCenter,
          mapTypeId: maps.MapTypeId.ROADMAP,
          disableDefaultUI: true, // Deshabilitar controles por defecto para usar los personalizados
          zoomControl: true,
          zoomControlOptions: {
            position: maps.ControlPosition.RIGHT_CENTER, // Posición del zoom control
          },
          streetViewControl: false,
          fullscreenControl: true,
          fullscreenControlOptions: {
            position: maps.ControlPosition.RIGHT_TOP,
          },
        });

        mapInstanceRef.current = map;

        // Crear servicio de direcciones
        const directionsService = new maps.DirectionsService();
        const directionsRenderer = new maps.DirectionsRenderer({
          map,
          suppressMarkers: true, // Suprimir marcadores del DirectionsRenderer (usaremos los personalizados)
          polylineOptions: {
            strokeColor: "#17407A",
            strokeWeight: 6,
            strokeOpacity: 0.9,
            zIndex: 1,
          },
          preserveViewport: false, // Permitir que el mapa se ajuste para mostrar ambos puntos
        });

        directionsServiceRef.current = directionsService;
        directionsRendererRef.current = directionsRenderer;

        // Guardar referencias de marcadores personalizados
        const customMarkers: google.maps.Marker[] = [];

        // Si hay coordenadas de destino, mostrar marcador de destino (tienda o entrega)
        if (destinoLat && destinoLng) {
          const destPoint = new maps.LatLng(destinoLat, destinoLng);
          
          // Si hay origen y destino, mostrar ambos y ajustar bounds
          if (origenLat && origenLng) {
            const bounds = new maps.LatLngBounds();
            const originPoint = new maps.LatLng(origenLat, origenLng);
            
            bounds.extend(originPoint);
            bounds.extend(destPoint);
            map.fitBounds(bounds, 80);
            
            // Agregar marcador de origen (A)
            const originMarker = new maps.Marker({
              position: originPoint,
              map: map,
              label: {
                text: "A",
                color: "white",
                fontWeight: "bold",
                fontSize: "14px",
              },
              icon: {
                path: maps.SymbolPath.CIRCLE,
                scale: 12,
                fillColor: "#10B981",
                fillOpacity: 1,
                strokeColor: "white",
                strokeWeight: 3,
              },
              title: direccionOrigen || "Origen",
              zIndex: 1000,
            });
            customMarkers.push(originMarker);
          } else {
            // Solo destino: centrar en la tienda/destino
            map.setCenter(destPoint);
            map.setZoom(15);
          }
          
          // Agregar marcador de destino (S para tienda en pickup, B para envío)
          const destMarker = new maps.Marker({
            position: destPoint,
            map: map,
            label: {
              text: isPickup ? "S" : "B",
              color: "white",
              fontWeight: "bold",
              fontSize: "14px",
            },
            icon: {
              path: maps.SymbolPath.CIRCLE,
              scale: 12,
              fillColor: isPickup ? "#3B82F6" : "#EF4444", // Azul para pickup (tienda), rojo para envío
              fillOpacity: 1,
              strokeColor: "white",
              strokeWeight: 3,
            },
            title: direccionDestino || (isPickup ? "Tienda" : "Destino"),
            zIndex: 1000,
          });
          customMarkers.push(destMarker);
        }
        
        // Guardar referencias para limpiar después
        (mapInstanceRef.current as MapWithCustomMarkers).customMarkers = customMarkers;

        // Calcular rutas solo si hay origen y destino
        setIsLoading(false);
        
        // Calcular todas las rutas solo si hay origen
        if (origin) {
          calculateRoute("driving");
          calculateRoute("walking");
        }
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
      if (directionsRendererRef.current) {
        directionsRendererRef.current.setMap(null);
      }
      // Limpiar marcadores personalizados
      const mapWithMarkers = mapInstanceRef.current as MapWithCustomMarkers;
      if (mapWithMarkers?.customMarkers) {
        mapWithMarkers.customMarkers.forEach(marker => {
          marker.setMap(null);
        });
      }
    };
  }, [origenLat, origenLng, destinoLat, destinoLng, direccionOrigen, direccionDestino]);

  // Recalcular y renderizar ruta cuando cambia el modo seleccionado
  useEffect(() => {
    if (mapInstanceRef.current && directionsServiceRef.current && directionsRendererRef.current && window.google) {
      // Si ya tenemos la información de la ruta para este modo, renderizarla inmediatamente
      const { maps } = window.google;
      
      // Recalcular la ruta para asegurar que se renderice
      calculateRoute(selectedMode);
      
      // También intentar renderizar si ya tenemos datos guardados
      if (routesInfo[selectedMode]) {
        // La ruta se renderizará cuando calculateRoute complete
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedMode]);

  // Efecto para cambiar el tipo de mapa
  useEffect(() => {
    if (mapInstanceRef.current && window.google) {
      const { maps } = window.google;
      mapInstanceRef.current.setMapTypeId(
        mapType === "satellite" ? maps.MapTypeId.SATELLITE : maps.MapTypeId.ROADMAP
      );
    }
  }, [mapType]);

  const modeConfig: Record<TransportMode, { label: string; icon: ReactElement; color: string }> = {
    driving: {
      label: "Carro",
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z" stroke="currentColor" strokeWidth="0.5" fill="currentColor"/>
        </svg>
      ),
      color: "#3B82F6",
    },
    bicycling: {
      label: "Bicicleta",
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.5 5.5c-1.95 0-4.05.4-5.5 1.5l-4 4.5H4v7h2v-5l2.5-2.5 2.5 2.5v5h2v-4.5l3.5-3.5c1.1-.9 2.5-1.5 4-1.5 2.21 0 4 1.79 4 4s-1.79 4-4 4-4-1.79-4-4c0-.73.19-1.41.5-2H14l-2-2h-1.5l-2.5 2.5H7v-2h1.5l2.5-2.5L13.5 9c1.1-.9 2.5-1.5 4-1.5 2.21 0 4 1.79 4 4s-1.79 4-4 4-4-1.79-4-4c0-.73.19-1.41.5-2H14l-2-2h-1.5l-2.5 2.5H7v-2h1.5l2.5-2.5L13.5 9c1.1-.9 2.5-1.5 4-1.5z"/>
        </svg>
      ),
      color: "#10B981",
    },
    walking: {
      label: "A pie",
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <circle cx="12" cy="5" r="2"/>
          <path d="M9 20v-8h6v8h-2v-6h-2v6H9zm-1-8l1.5-4h3L13 12H8z"/>
        </svg>
      ),
      color: "#F59E0B",
    },
  };

  return (
    <div className="relative w-full h-full">
      <div ref={mapRef} className="w-full h-full" style={{ minHeight: "350px" }} />

      {/* Controles de tipo de mapa - Arriba a la izquierda */}
      <div className="absolute top-3 left-3 z-10 flex gap-1 bg-white/95 backdrop-blur-sm rounded-lg shadow-md border border-gray-200 overflow-hidden">
        <button
          onClick={() => setMapType("roadmap")}
          className={`px-4 py-2 text-sm font-medium transition-all ${
            mapType === "roadmap"
              ? "bg-[#17407A] text-white"
              : "bg-white text-gray-700 hover:bg-gray-50"
          }`}
        >
          Mapa
        </button>
        <button
          onClick={() => setMapType("satellite")}
          className={`px-4 py-2 text-sm font-medium transition-all ${
            mapType === "satellite"
              ? "bg-[#17407A] text-white"
              : "bg-white text-gray-700 hover:bg-gray-50"
          }`}
        >
          Satélite
        </button>
      </div>

      {/* Selector de modo de transporte - Más pequeño, esquina inferior izquierda */}
      <div className="absolute bottom-1 left-2 z-10 flex gap-0.5 bg-white/95 backdrop-blur-sm rounded-md p-0.5 shadow-md border border-gray-200">
        {(["driving", "walking"] as TransportMode[]).map((mode) => {
          const config = modeConfig[mode];
          const isSelected = selectedMode === mode;
          const routeInfo = routesInfo[mode];

          return (
            <button
              key={mode}
              onClick={() => setSelectedMode(mode)}
              className={`flex items-center justify-center gap-1 px-1.5 py-1 rounded transition-all ${
                isSelected
                  ? "bg-[#17407A] border-[#17407A] text-white shadow-sm"
                  : "bg-white border-gray-300 text-gray-700 hover:border-[#17407A] hover:bg-gray-50"
              }`}
              title={config.label}
            >
              <div className={`w-3.5 h-3.5 ${isSelected ? "text-white" : "text-gray-600"}`}>
                {config.icon}
              </div>
            </button>
          );
        })}
      </div>

      {isLoading && (
        <div className="absolute inset-0 bg-gray-100 z-10">
          {/* Skeleton del mapa */}
          <div className="w-full h-full bg-gradient-to-br from-gray-200 via-gray-100 to-gray-200 animate-pulse">
            {/* Skeleton de controles */}
            <div className="absolute top-3 left-3 flex gap-1">
              <div className="h-9 w-20 bg-white/80 rounded-lg"></div>
              <div className="h-9 w-20 bg-white/80 rounded-lg"></div>
            </div>
            <div className="absolute bottom-1 left-2 flex gap-0.5">
              <div className="h-8 w-8 bg-white/80 rounded-md"></div>
              <div className="h-8 w-8 bg-white/80 rounded-md"></div>
            </div>
            {/* Indicador de carga centrado */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center bg-white/90 rounded-lg p-4 shadow-lg">
                <div className="w-10 h-10 border-4 border-gray-200 border-t-[#17407A] rounded-full animate-spin mx-auto mb-2" />
                <p className="text-sm text-gray-600 font-medium">Cargando mapa...</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="absolute inset-0 bg-white/95 flex items-center justify-center z-10">
          <div className="text-center p-4 max-w-md">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <p className="text-sm font-semibold text-gray-900 mb-2">Ruta no disponible</p>
            <p className="text-xs text-gray-600 mb-4">
              {error.includes("REQUEST_DENIED") 
                ? "La API de Google Maps Directions no está habilitada. Por favor, contacta al administrador del sistema."
                : error}
            </p>
            {/* Mostrar marcadores aunque no haya ruta */}
            {origenLat && origenLng && destinoLat && destinoLng && (
              <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-xs text-blue-800 mb-2">📍 Ubicaciones detectadas:</p>
                <p className="text-xs text-blue-700">Origen: {origenLat.toFixed(4)}, {origenLng.toFixed(4)}</p>
                <p className="text-xs text-blue-700">Destino: {destinoLat.toFixed(4)}, {destinoLng.toFixed(4)}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Información de la ruta seleccionada - Esquina inferior derecha */}
      {routesInfo[selectedMode] && !isLoading && !error && (
        <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-sm rounded-lg shadow-md px-2.5 py-1.5 z-10 border border-gray-200">
          <div className="flex items-center gap-3 text-xs">
            <div className="flex items-center gap-1.5">
              <svg
                className="w-3.5 h-3.5 text-[#17407A]"
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
              <span className="text-gray-700 font-medium">
                {routesInfo[selectedMode]!.distance}
              </span>
            </div>
            <span className="text-gray-300">•</span>
            <div className="flex items-center gap-1.5">
              <svg
                className="w-3.5 h-3.5 text-[#17407A]"
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
              <span className="text-gray-700 font-medium">
                {routesInfo[selectedMode]!.duration}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

