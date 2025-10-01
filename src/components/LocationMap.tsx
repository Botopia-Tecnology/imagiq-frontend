/**
 * 🗺️ MAPA INTERACTIVO DE TIENDAS SAMSUNG - IMAGIQ
 * Convertido a Google Maps para consistencia con el sistema de direcciones
 */

"use client";

import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import { Filter } from "lucide-react";
import { stores, type Store } from "./LocationsArray";
import { posthogUtils } from "@/lib/posthogClient";
import { StoreCard } from "./CardsMap";
import { useGoogleMaps } from "@/services/googleMapsLoader";

export default function LocationMap() {
  const [selectedCity, setSelectedCity] = useState<string>("Todas las ciudades");
  const [hoveredStore, setHoveredStore] = useState<Store | null>(null);
  const [isClient, setIsClient] = useState(false);
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<google.maps.Map | null>(null);
  const markers = useRef<google.maps.Marker[]>([]);
  const infoWindow = useRef<google.maps.InfoWindow | null>(null);

  // Usar el hook del servicio singleton
  const { isLoaded: isGoogleMapsLoaded, error: mapError, isLoading } = useGoogleMaps();

  // Marcar como cliente
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Inicializar mapa
  useEffect(() => {
    if (!mapContainer.current || mapError || !isGoogleMapsLoaded) return;

    try {
      // Coordenadas por defecto (centro de Colombia)
      const defaultCenter = { lat: 4.5709, lng: -74.2973 };

      // Configurar el mapa
      const mapOptions: google.maps.MapOptions = {
        center: defaultCenter,
        zoom: 6,
        mapTypeId: 'roadmap',
        disableDefaultUI: false,
        zoomControl: true,
        mapTypeControl: true,
        scaleControl: true,
        streetViewControl: true,
        rotateControl: true,
        fullscreenControl: true,
        gestureHandling: 'cooperative'
      };

      // Crear el mapa
      map.current = new google.maps.Map(mapContainer.current, mapOptions);

      // Crear InfoWindow global
      infoWindow.current = new google.maps.InfoWindow();

      console.log('Google Maps inicializado para tiendas Samsung');

    } catch (error) {
      console.error('Error inicializando Google Maps:', error);
    }
  }, [isGoogleMapsLoaded, mapError]);

  // Get unique cities for filter
  const cities = useMemo(
    () => [
      "Todas las ciudades",
      ...Array.from(new Set(stores.map((store) => store.city))).sort(),
    ],
    []
  );

  // Filter stores based on selected city
  const filteredStores = useMemo(() => {
    if (selectedCity === "Todas las ciudades") {
      return stores;
    }
    return stores.filter((store) => store.city === selectedCity);
  }, [selectedCity]);

  // City coordinates for map centering
  const cityCoordinates: Record<
    string,
    { lat: number; lng: number; zoom: number }
  > = useMemo(
    () => ({
      Bogotá: { lat: 4.6951, lng: -74.0306, zoom: 11 },
      Cali: { lat: 3.4516, lng: -76.532, zoom: 11 },
      Bucaramanga: { lat: 7.1254, lng: -73.1198, zoom: 12 },
      Chía: { lat: 4.8609, lng: -74.0276, zoom: 13 },
      Cúcuta: { lat: 7.8939, lng: -72.5078, zoom: 12 },
      Ibagué: { lat: 4.4389, lng: -75.2322, zoom: 12 },
      Manizales: { lat: 5.0703, lng: -75.5138, zoom: 12 },
    }),
    []
  );

  // Handle city selection with map repositioning
  const handleCityChange = useCallback((city: string) => {
    setSelectedCity(city);
    setHoveredStore(null);

    // Reposicionar mapa
    if (map.current) {
      if (city === "Todas las ciudades") {
        map.current.setCenter({ lat: 4.5709, lng: -74.2973 });
        map.current.setZoom(6);
      } else if (cityCoordinates[city]) {
        const coords = cityCoordinates[city];
        map.current.setCenter({ lat: coords.lat, lng: coords.lng });
        map.current.setZoom(coords.zoom);
      }
    }

    posthogUtils.capture("city_filter_change", {
      selected_city: city,
      stores_count: stores.filter(
        (store) => city === "Todas las ciudades" || store.city === city
      ).length,
    });
  }, [cityCoordinates]);

  // Handle store hover
  const handleStoreHover = useCallback((store: Store | null) => {
    setHoveredStore(store);
    if (store) {
      posthogUtils.capture("store_marker_hover", {
        store_name: store.name,
        store_city: store.city,
        store_mall: store.mall || "N/A",
      });
    }
  }, []);

  // Crear marcadores en el mapa
  useEffect(() => {
    if (!map.current || !isGoogleMapsLoaded) return;

    // Limpiar marcadores existentes completamente
    markers.current.forEach(marker => {
      marker.setMap(null);
      google.maps.event.clearInstanceListeners(marker);
    });
    markers.current = [];

    // Cerrar InfoWindow si está abierta
    if (infoWindow.current) {
      infoWindow.current.close();
    }

    // Crear nuevos marcadores para las tiendas filtradas
    filteredStores.forEach((store) => {
      const position = { lat: store.position[0], lng: store.position[1] };

      // Crear marcador personalizado con logo Samsung
      const marker = new google.maps.Marker({
        position: position,
        map: map.current,
        title: store.name,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 20,
          fillColor: '#1D8AFF', // Color Samsung azul
          fillOpacity: 1,
          strokeColor: '#ffffff',
          strokeWeight: 3,
        },
        animation: google.maps.Animation.DROP
      });

      // Event listeners para el marcador
      marker.addListener('mouseover', () => {
        handleStoreHover(store);
      });

      marker.addListener('mouseout', () => {
        // Small delay to allow moving to info window
        setTimeout(() => {
          if (hoveredStore?.name === store.name) {
            setHoveredStore(null);
          }
        }, 200);
      });

      marker.addListener('click', () => {
        // Crear contenido para InfoWindow
        const contentDiv = document.createElement('div');
        contentDiv.style.padding = '10px';
        contentDiv.style.maxWidth = '300px';
        contentDiv.innerHTML = `
          <div style="font-family: system-ui, -apple-system, sans-serif;">
            <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: bold; color: #1f2937;">
              📍 ${store.name}
            </h3>
            <p style="margin: 0 0 8px 0; font-size: 14px; color: #6b7280;">
              ${store.address}
            </p>
            ${store.mall ? `
              <p style="margin: 0 0 8px 0; font-size: 12px; color: #3b82f6;">
                🏢 ${store.mall}
              </p>
            ` : ''}
            <div style="margin: 8px 0; padding: 8px 0; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0 0 4px 0; font-size: 12px; color: #6b7280;">
                ⏰ ${store.hours}
              </p>
              ${store.phone ? `
                <p style="margin: 0; font-size: 12px; color: #6b7280;">
                  📞 ${store.phone}
                </p>
              ` : ''}
            </div>
          </div>
        `;

        // Mostrar InfoWindow
        if (infoWindow.current) {
          infoWindow.current.setContent(contentDiv);
          infoWindow.current.open(map.current, marker);
        }
      });

      markers.current.push(marker);
    });

  }, [filteredStores, isGoogleMapsLoaded, handleStoreHover, hoveredStore?.name]);

  // Convert Store to Location for StoreCard compatibility
  const convertStoreToLocation = (store: Store) => ({
    id: store.id || 0,
    name: store.name,
    address: store.address,
    hours: store.hours,
    phone: store.phone,
    lat: store.position[0],
    lng: store.position[1],
    city: store.city,
    mall: store.mall,
  });

  // Error state
  if (mapError) {
    return (
      <div className="w-full relative z-10">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-normal text-gray-900">
            Encuentra tu tienda mas cercana
          </h1>
        </div>

        <div className="relative bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="relative h-[600px] flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
            <div className="text-center p-6 max-w-sm">
              <div className="text-4xl mb-4">🗺️</div>
              <h3 className="text-blue-800 font-semibold mb-2">Google Maps No Disponible</h3>
              <p className="text-blue-600 text-sm mb-3">{mapError}</p>
              <div className="text-blue-500 text-xs space-y-1">
                <p>🔧 Backend debe estar corriendo en puerto 3001</p>
                <p>🔑 Google Places API configurada en backend</p>
                <p>⚡ Misma API key que el autocompletado</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Loading state
  if (!isClient || !isGoogleMapsLoaded || isLoading) {
    return (
      <div className="w-full relative z-10">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-normal text-gray-900">
            Encuentra tu tienda mas cercana
          </h1>
        </div>

        {/* City Filter - Always visible */}
        <div className="mb-6 flex justify-center">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 max-w-md w-full">
            <div className="flex items-center space-x-3">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={selectedCity}
                onChange={(e) => handleCityChange(e.target.value)}
                className="flex-1 bg-transparent border-none focus:outline-none text-sm font-medium text-gray-700 cursor-pointer"
              >
                {cities.map((city) => (
                  <option key={city} value={city}>
                    {city}{" "}
                    {city !== "Todas las ciudades" &&
                      `(${stores.filter((s) => s.city === city).length})`}
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-2 pt-2 border-t border-gray-100 text-xs text-gray-500 text-center">
              {filteredStores.length} tienda
              {filteredStores.length !== 1 ? "s" : ""} disponible
              {filteredStores.length !== 1 ? "s" : ""}
            </div>
          </div>
        </div>

        {/* Loading Map Placeholder */}
        <div className="relative bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="relative h-[600px] flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">
                {isLoading || !isGoogleMapsLoaded ? 'Cargando Google Maps...' : 'Inicializando mapa...'}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full relative z-10 flex flex-col items-center px-2 sm:px-4 md:px-0">
      {/* Header */}
      <div className="text-center mb-4 md:mb-6 animate-fade-in w-full">
        <h1 className="text-xl md:text-3xl font-bold text-black tracking-tight drop-shadow-sm leading-tight md:leading-normal">
           Encuentra tu tienda más cercana
        </h1>
      </div>

      {/* City Filter */}
      <div className="mb-6 flex justify-center w-full">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 max-w-md w-full">
          <div className="flex items-center space-x-3">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={selectedCity}
              onChange={(e) => handleCityChange(e.target.value)}
              className="flex-1 bg-transparent border-none focus:outline-none text-sm font-medium text-gray-700 cursor-pointer"
            >
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}{" "}
                  {city !== "Todas las ciudades" &&
                    `(${stores.filter((s) => s.city === city).length})`}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-2 pt-2 border-t border-gray-100 text-xs text-gray-500 text-center">
            {filteredStores.length} tienda
            {filteredStores.length !== 1 ? "s" : ""} disponible
            {filteredStores.length !== 1 ? "s" : ""}
          </div>
        </div>
      </div>

      {/* Card seleccionada arriba del mapa solo en móvil */}
      {hoveredStore && (
        <div className="md:hidden w-full flex justify-center mb-2 animate-fade-in px-1">
          <div className="rounded-xl p-3 w-full max-w-[99vw] mx-auto">
            <StoreCard store={convertStoreToLocation(hoveredStore)} />
          </div>
        </div>
      )}

      {/* Interactive Map Container */}
      <div className="relative rounded-xl overflow-hidden z-10 animate-fade-in w-full max-w-[99vw] mx-auto mt-1 md:mt-4 px-1 md:px-0 md:max-w-none md:rounded-2xl flex justify-center items-center">
        <div className="relative h-[220px] xs:h-[260px] sm:h-[280px] md:h-[500px] lg:h-[600px] md:w-[1200px] lg:w-[1400px] w-full flex justify-center items-center shadow-lg">
          {/* Contenedor del mapa */}
          <div
            ref={mapContainer}
            style={{ height: '100%', width: '100%' }}
            className="bg-gray-100 rounded-xl md:rounded-2xl"
            aria-label="Mapa interactivo de tiendas Samsung"
          />

          {/* Indicador de carga */}
          {(!isGoogleMapsLoaded || isLoading) && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-xl md:rounded-2xl">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
                <p className="text-gray-600 text-sm">
                  {isLoading || !isGoogleMapsLoaded ? 'Cargando Google Maps...' : 'Cargando mapa...'}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Info sobre Google Maps */}
      <div className="mt-4 text-center text-xs text-gray-500">
        <p>🗺️ Powered by Google Maps • 🔑 Configuración automática desde backend</p>
      </div>
    </div>
  );
}