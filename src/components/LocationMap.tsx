/**
 * 🗺️ MAPA INTERACTIVO DE TIENDAS SAMSUNG - IMAGIQ
 */

"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { Filter } from "lucide-react";
import { stores, type Store } from "./LocationsArray";
import { posthogUtils } from "@/lib/posthogClient";
import dynamic from "next/dynamic";
import { StoreCard } from "./CardsMap";

// Dynamically import react-leaflet components
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);

const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);

const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);

const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), {
  ssr: false,
});

// Create a simple map controller component with proper types
const MapController = dynamic(
  () =>
    import("react-leaflet").then((mod) => {
      return function MapControllerInner({
        selectedCity,
        cityCoordinates,
      }: {
        selectedCity: string;
        cityCoordinates: Record<
          string,
          { lat: number; lng: number; zoom: number }
        >;
      }) {
        const map = mod.useMap();

        useEffect(() => {
          if (map && selectedCity) {
            if (selectedCity === "Todas las ciudades") {
              map.setView([4.5709, -74.2973], 6);
            } else if (cityCoordinates[selectedCity]) {
              const coords = cityCoordinates[selectedCity];
              map.setView([coords.lat, coords.lng], coords.zoom);
            }
          }
        }, [map, selectedCity, cityCoordinates]);

        return null;
      };
    }),
  { ssr: false }
);

// Global Leaflet instance
let L: Record<string, unknown> = {};

// Initialize Leaflet
const initializeLeaflet = async () => {
  if (typeof window !== "undefined" && !L.divIcon) {
    await import("leaflet/dist/leaflet.css");
    const leaflet = await import("leaflet");
    L = leaflet.default || leaflet;
  }
  return L;
};

// Type for Leaflet icon
type LeafletIcon = {
  iconSize: [number, number];
  iconAnchor: [number, number];
  popupAnchor: [number, number];
  className?: string;
  html?: string;
};

// Better custom marker icon with location pin design
const createCustomIcon = (isHovered: boolean): LeafletIcon | undefined => {
  const leafletLib = L as Record<string, unknown>;
  const divIcon = leafletLib?.divIcon as
    | ((options: Record<string, unknown>) => LeafletIcon)
    | undefined;

  if (!divIcon) return undefined;

  try {
    const size = isHovered ? 40 : 32;
    const backgroundColor = isHovered ? "#ef4444" : "#2563eb";

    return divIcon({
      html: `
        <div style="
          width: ${size}px; 
          height: ${size}px; 
          position: relative;
          transform: ${isHovered ? "scale(1.1)" : "scale(1)"};
          transition: all 0.3s ease;
          filter: drop-shadow(0 4px 8px rgba(0,0,0,0.3));
        ">
          <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22S19 14.25 19 9C19 5.13 15.87 2 12 2Z" 
                  fill="${backgroundColor}" 
                  stroke="white" 
                  stroke-width="2"/>
            <circle cx="12" cy="9" r="3" fill="white"/>
          </svg>
          ${
            isHovered
              ? `
            <div style="
              position: absolute;
              top: 0;
              left: 0;
              width: ${size}px;
              height: ${size}px;
              border-radius: 50% 50% 50% 0;
              border: 2px solid #fca5a5;
              animation: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite;
            "></div>
          `
              : ""
          }
        </div>
        <style>
          @keyframes ping {
            75%, 100% {
              transform: scale(1.5);
              opacity: 0;
            }
          }
        </style>
      `,
      className: "custom-marker",
      iconSize: [size, size],
      iconAnchor: [size / 2, size],
      popupAnchor: [0, -size],
    });
  } catch (error) {
    console.warn("Failed to create custom icon, using default", error);
    return undefined;
  }
};

export default function LocationMap() {
  const [selectedCity, setSelectedCity] =
    useState<string>("Todas las ciudades");
  const [hoveredStore, setHoveredStore] = useState<Store | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [leafletReady, setLeafletReady] = useState(false);
  const [mapKey, setMapKey] = useState(0);

  // Initialize Leaflet
  useEffect(() => {
    setIsClient(true);

    initializeLeaflet().then(() => {
      setLeafletReady(true);
    });
  }, []);

  // Force map remount when changing cities to avoid container reuse
  useEffect(() => {
    setMapKey((prev) => prev + 1);
  }, [selectedCity]);

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

  // City coordinates for map centering with proper typing
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

  // Handle city selection
  const handleCityChange = useCallback((city: string) => {
    setSelectedCity(city);
    setHoveredStore(null);

    posthogUtils.capture("city_filter_change", {
      selected_city: city,
      stores_count: stores.filter(
        (store) => city === "Todas las ciudades" || store.city === city
      ).length,
    });
  }, []);

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

  // Handle directions click
  const handleDirectionsClick = useCallback((store: Store) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${store.position[0]},${store.position[1]}`;
    window.open(url, "_blank");

    posthogUtils.capture("store_directions_click", {
      store_name: store.name,
      store_city: store.city,
    });
  }, []);

  // If not ready, show loading state
  if (!isClient || !leafletReady) {
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
              <p className="text-gray-600">Cargando mapa interactivo...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Store marker component with improved functionality
  const StoreMarkerComponent = ({ store }: { store: Store }) => {
    const isHovered = hoveredStore?.name === store.name;
    const markerIcon = createCustomIcon(isHovered);
    const position: [number, number] = [store.position[0], store.position[1]];
    const [hoverTimeout, setHoverTimeout] = useState<NodeJS.Timeout | null>(
      null
    );

    const baseProps = {
      position,
      eventHandlers: {
        mouseover: () => {
          console.log("Marker hovered:", store.name);
          // Clear any existing timeout
          if (hoverTimeout) {
            clearTimeout(hoverTimeout);
            setHoverTimeout(null);
          }
          handleStoreHover(store);
        },
        mouseout: () => {
          console.log("Marker mouseout:", store.name);
          // Add a delay before closing to allow moving to popup
          const timeout = setTimeout(() => {
            if (hoveredStore?.name === store.name) {
              handleStoreHover(null);
            }
          }, 200);
          setHoverTimeout(timeout);
        },
        click: () => {
          console.log("Marker clicked:", store.name);
          if (isHovered) {
            handleStoreHover(null);
          } else {
            handleStoreHover(store);
          }
        },
      },
    };

    return (
      <>
        {markerIcon ? (
          // @ts-expect-error - Leaflet icon types are complex and dynamically loaded
          <Marker {...baseProps} icon={markerIcon} />
        ) : (
          <Marker {...baseProps} />
        )}
        {isHovered && (
          <Popup
            position={position}
            closeButton={false}
            autoClose={false}
            closeOnClick={false}
            className="custom-popup"
            offset={[0, -10]}
            autoPan={false}
            keepInView={false}
            eventHandlers={{
              mouseover: () => {
                // Clear timeout and keep popup open when hovering over it
                if (hoverTimeout) {
                  clearTimeout(hoverTimeout);
                  setHoverTimeout(null);
                }
                handleStoreHover(store);
              },
              mouseout: () => {
                // Close popup when leaving it
                const timeout = setTimeout(() => {
                  handleStoreHover(null);
                }, 100);
                setHoverTimeout(timeout);
              },
            }}
          >
            <div
              onMouseEnter={() => {
                // Keep popup open when hovering over content
                if (hoverTimeout) {
                  clearTimeout(hoverTimeout);
                  setHoverTimeout(null);
                }
              }}
              onMouseLeave={() => {
                // Close popup when leaving content
                const timeout = setTimeout(() => {
                  handleStoreHover(null);
                }, 100);
                setHoverTimeout(timeout);
              }}
            >
              <StoreCard
                store={store}
                onDirectionsClick={handleDirectionsClick}
              />
            </div>
          </Popup>
        )}
      </>
    );
  };

  const center: [number, number] = [4.5709, -74.2973];

  return (
    <div className="w-full relative z-10">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-2xl font-normal text-gray-900">
          Encuentra tu tienda mas cercana
        </h1>
      </div>

      {/* City Filter - Elegant and minimal */}
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

          {/* Results counter */}
          <div className="mt-2 pt-2 border-t border-gray-100 text-xs text-gray-500 text-center">
            {filteredStores.length} tienda
            {filteredStores.length !== 1 ? "s" : ""} disponible
            {filteredStores.length !== 1 ? "s" : ""}
          </div>
        </div>
      </div>

      {/* Interactive Map Container */}
      <div className="relative bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden z-10">
        <div className="relative h-[600px]">
          <MapContainer
            key={`map-${mapKey}`}
            center={center}
            zoom={6}
            style={{ height: "100%", width: "100%" }}
            className="rounded-xl"
            scrollWheelZoom={true}
            zoomControl={true}
            doubleClickZoom={true}
            dragging={true}
            touchZoom={true}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />

            <MapController
              selectedCity={selectedCity}
              cityCoordinates={cityCoordinates}
            />

            {filteredStores.map((store, index) => (
              <StoreMarkerComponent
                key={`store-${store.name}-${index}-${mapKey}`}
                store={store}
              />
            ))}
          </MapContainer>

          {/* Map Info Overlay */}
          <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm rounded-lg px-4 py-3 shadow-md border border-gray-200 z-[400]">
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {filteredStores.length}
                </div>
                <div className="text-xs text-gray-600">Tiendas</div>
              </div>
              {selectedCity !== "Todas las ciudades" && (
                <div className="text-center">
                  <div className="text-lg font-bold text-green-600">1</div>
                  <div className="text-xs text-gray-600">Ciudad</div>
                </div>
              )}
            </div>
            <div className="mt-2 text-xs text-gray-500">
              {selectedCity === "Todas las ciudades"
                ? "🇨🇴 Colombia"
                : `📍 ${selectedCity}`}
            </div>
          </div>

          {/* Instructions */}
          <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-sm rounded-lg px-4 py-2 shadow-md border border-gray-200 z-[400]">
            <div className="text-xs text-gray-600 text-center">
              <div className="font-medium mb-1">
                Pasa el cursor sobre los marcadores
              </div>
              <div className="flex items-center justify-center space-x-2">
                <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                <span>Tienda Samsung</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export { LocationMap };
