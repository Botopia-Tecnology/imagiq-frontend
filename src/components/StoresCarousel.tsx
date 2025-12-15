/**
 * 🏪 CARRUSEL DE TIENDAS - IMAGIQ ECOMMERCE
 * Componente de carrusel horizontal con tarjetas compactas
 */

"use client";

import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { useStores } from "@/hooks/useStores";
import { ChevronLeft, ChevronRight, Navigation, Search } from "lucide-react";
import Image from "next/image";
import { useSelectedStore } from "@/contexts/SelectedStoreContext";
import StoreCarouselSkeleton from "./StoreCarouselSkeleton";
import type { FormattedStore } from "@/types/store";

interface StoresCarouselProps {
  initialStores?: FormattedStore[];
}

export default function StoresCarousel({ initialStores }: StoresCarouselProps = {}) {
  const { stores: apiStores, loading: apiLoading } = useStores();

  // Usar stores iniciales si están disponibles, sino usar los de la API
  const effectiveStores = initialStores && initialStores.length > 0 ? initialStores : apiStores;
  const loading = initialStores && initialStores.length > 0 ? false : apiLoading;
  const [selectedCity, setSelectedCity] = useState<string>("Todas las ciudades");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isSearchingNearby, setIsSearchingNearby] = useState(false);
  const [nearbyStores, setNearbyStores] = useState<typeof apiStores>([]);
  const { selectedStoreCode, setSelectedStoreCode } = useSelectedStore();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Filtrar solo tiendas con coordenadas válidas
  const stores = useMemo(() => {
    return effectiveStores.filter(
      (store) =>
        store.latitud !== 0 &&
        store.longitud !== 0 &&
        !isNaN(store.latitud) &&
        !isNaN(store.longitud)
    );
  }, [effectiveStores]);

  // Obtener ciudades únicas
  const cities = useMemo(
    () => [
      "Todas las ciudades",
      ...Array.from(new Set(stores.map((store) => store.ciudad))).sort(),
    ],
    [stores]
  );

  // Filtrar tiendas por ciudad y búsqueda
  const filteredStores = useMemo(() => {
    // Si hay tiendas cercanas (de "Cerca de mí"), mostrar solo esas
    if (nearbyStores.length > 0) {
      return nearbyStores;
    }

    let result = stores;

    // Filtrar por ciudad
    if (selectedCity !== "Todas las ciudades") {
      result = result.filter((store) => store.ciudad === selectedCity);
    }

    // Filtrar por búsqueda
    if (searchQuery.trim()) {
      const query = searchQuery.trim().toLowerCase();
      result = result.filter((store) =>
        store.descripcion?.toLowerCase().includes(query) ||
        store.direccion?.toLowerCase().includes(query) ||
        store.ciudad?.toLowerCase().includes(query)
      );
    }

    return result;
  }, [selectedCity, searchQuery, stores, nearbyStores]);

  // Buscar tiendas cercanas usando geolocalización
  const handleCercaDeMi = useCallback(() => {
    if (!navigator.geolocation) {
      alert("La geolocalización no está soportada en este navegador.");
      return;
    }

    setIsSearchingNearby(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        // Calcular distancia a cada tienda
        const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
          const R = 6371; // km
          const dLat = ((lat2 - lat1) * Math.PI) / 180;
          const dLon = ((lon2 - lon1) * Math.PI) / 180;
          const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos((lat1 * Math.PI) / 180) *
              Math.cos((lat2 * Math.PI) / 180) *
              Math.sin(dLon / 2) *
              Math.sin(dLon / 2);
          const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
          return R * c;
        };

        // Obtener las 5 tiendas más cercanas (igual que en /tiendas)
        const nearestStores = stores
          .map((store) => ({
            ...store,
            distancia: getDistance(
              latitude,
              longitude,
              store.position[0],
              store.position[1]
            ),
          }))
          .sort((a, b) => a.distancia - b.distancia)
          .slice(0, 5);

        if (nearestStores.length > 0) {
          // Guardar las tiendas cercanas en el estado
          setNearbyStores(nearestStores);
          // Resetear filtros
          setSelectedCity("Todas las ciudades");
          setSearchQuery("");
        }

        setIsSearchingNearby(false);
      },
      (err) => {
        alert("No se pudo obtener la ubicación: " + err.message);
        setIsSearchingNearby(false);
      }
    );
  }, [stores]);

  // Navegación del carrusel por scroll
  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  // Centrar el scroll cuando cambian los filtros
  useEffect(() => {
    if (scrollContainerRef.current && filteredStores.length > 0) {
      scrollContainerRef.current.scrollTo({
        left: 0,
        behavior: "smooth",
      });
    }
  }, [selectedCity, searchQuery, filteredStores.length]);

  // Limpiar tiendas cercanas cuando el usuario cambia filtros manualmente
  useEffect(() => {
    if (nearbyStores.length > 0 && (selectedCity !== "Todas las ciudades" || searchQuery.trim())) {
      setNearbyStores([]);
    }
  }, [selectedCity, searchQuery, nearbyStores.length]);

  if (loading) {
    return (
      <div className="w-full px-4 py-2">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando tiendas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-4 py-2">
      <div className="max-w-7xl mx-auto">
        {/* Header y filtros */}
        <div className="text-center mb-3">
          <h2
            className="text-2xl md:text-3xl font-bold text-gray-900 mb-3"
            style={{ fontFamily: "Samsung Sharp Sans, sans-serif" }}
          >
            Encuentra tu tienda más cercana
          </h2>

          <div className="flex flex-col md:flex-row gap-3 items-center justify-center max-w-3xl mx-auto">
            {/* Búsqueda */}
            <div className="relative flex-1 w-full md:max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar tienda..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                style={{ fontFamily: "Samsung Sharp Sans, sans-serif" }}
              />
            </div>

            {/* Filtro ciudad */}
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full md:w-auto bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              style={{ fontFamily: "Samsung Sharp Sans, sans-serif" }}
            >
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                  {city !== "Todas las ciudades" &&
                    ` (${stores.filter((s) => s.ciudad === city).length})`}
                </option>
              ))}
            </select>

            {/* Cerca de mí */}
            <button
              onClick={handleCercaDeMi}
              disabled={isSearchingNearby}
              className="w-full md:w-auto bg-black hover:bg-gray-800 text-white rounded-lg px-5 py-2.5 text-sm font-bold flex items-center justify-center gap-2 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              style={{ fontFamily: "Samsung Sharp Sans, sans-serif" }}
            >
              {isSearchingNearby ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Buscando...
                </>
              ) : (
                <>
                  <Navigation className="w-4 h-4" />
                  Cerca de mí
                </>
              )}
            </button>
          </div>
        </div>

        {/* Carrusel */}
        {isSearchingNearby ? (
          <div className="relative">
            <div
              className="flex gap-3 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide justify-start"
              style={{
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
            >
              <StoreCarouselSkeleton />
              <StoreCarouselSkeleton />
              <StoreCarouselSkeleton />
            </div>
          </div>
        ) : filteredStores.length === 0 ? (
          <div className="text-center text-gray-500 py-12">
            No se encontraron tiendas
          </div>
        ) : (
          <div className="relative">
            {/* Botón anterior */}
            <button
              onClick={() => scroll("left")}
              className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 z-10 bg-white hover:bg-gray-100 rounded-full p-3 shadow-lg transition-colors items-center justify-center"
              aria-label="Deslizar izquierda"
            >
              <ChevronLeft className="w-6 h-6 text-gray-700" />
            </button>

            {/* Contenedor de tarjetas con scroll horizontal */}
            <div
              ref={scrollContainerRef}
              className={`flex gap-3 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide ${
                filteredStores.length <= 3 ? 'justify-center' : 'justify-start'
              }`}
              style={{
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
            >
              {filteredStores.map((store) => {
                const isSelected = selectedStoreCode === store.codigo;
                return (
                <div
                  key={store.codigo}
                  onClick={() => {
                    // Si la carta ya está seleccionada, la deseleccionamos
                    if (selectedStoreCode === store.codigo) {
                      setSelectedStoreCode(null);
                    } else {
                      // Si no, la seleccionamos
                      setSelectedStoreCode(store.codigo);
                    }
                  }}
                  className={`flex-shrink-0 w-[280px] bg-white rounded-xl border-2 shadow-md hover:shadow-xl transition-all p-4 snap-start flex flex-col cursor-pointer ${
                    isSelected ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200'
                  }`}
                >
                  <h3
                    className="text-sm font-bold text-gray-900 mb-2 line-clamp-2 min-h-[32px]"
                    style={{ fontFamily: "Samsung Sharp Sans, sans-serif" }}
                  >
                    {store.descripcion}
                  </h3>

                  {/* Botones arriba */}
                  <div className="flex gap-2 mb-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // Evitar que se seleccione la carta al hacer clic en el botón
                        window.open(
                          `https://www.google.com/maps/search/?api=1&query=${store.latitud},${store.longitud}`,
                          "_blank"
                        );
                      }}
                      className="flex-1 bg-gray-400 hover:bg-gray-500 text-white rounded-lg px-2 py-2 text-[11px] font-bold flex items-center justify-center gap-1 transition-colors whitespace-nowrap"
                      style={{ fontFamily: "Samsung Sharp Sans, sans-serif" }}
                    >
                      <Image 
                        src="https://res.cloudinary.com/dgnqk0ucm/image/upload/v1762445116/Google_Maps_icon__2020.svg_r4s0ks.png" 
                        alt="Google Maps"
                        width={12}
                        height={14}
                        className="w-3 h-3.5 flex-shrink-0"
                      />
                      <span className="leading-[1]">Maps</span>
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // Evitar que se seleccione la carta al hacer clic en el botón
                        window.open(
                          `https://waze.com/ul?ll=${store.latitud},${store.longitud}&navigate=yes`,
                          "_blank"
                        );
                      }}
                      className="flex-1 bg-[#33CCFF] hover:bg-[#2BB8E6] text-white rounded-lg px-2 py-2 text-[11px] font-bold flex items-center justify-center gap-1 transition-colors whitespace-nowrap"
                      style={{ fontFamily: "Samsung Sharp Sans, sans-serif" }}
                    >
                      <Image 
                        src="https://res.cloudinary.com/dgnqk0ucm/image/upload/v1762445166/unnamed_jfcf46.png" 
                        alt="Waze"
                        width={14}
                        height={14}
                        className="w-3.5 h-3.5 flex-shrink-0"
                      />
                      <span className="leading-[1]">Waze</span>
                    </button>
                  </div>

                  {/* Información detallada */}
                  <div className="space-y-2 pt-2.5 border-t border-gray-200">
                    {/* Dirección */}
                    <div className="flex items-start gap-2">
                      <svg className="w-3 h-3 mt-0.5 flex-shrink-0 text-gray-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                        <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                      </svg>
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] text-gray-700 leading-relaxed">
                          {store.direccion}
                          {store.ubicacion_cc && ` - ${store.ubicacion_cc}`}
                        </p>
                      </div>
                    </div>

                    {/* Teléfono */}
                    <div className="flex items-center gap-2">
                      <svg className="w-3 h-3 flex-shrink-0 text-gray-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                      </svg>
                      <p className="text-[10px] text-gray-700">
                        {store.telefono}
                        {store.extension && ` Ext ${store.extension}`}
                      </p>
                    </div>

                    {/* Correo */}
                    <div className="flex items-center gap-2">
                      <svg className="w-3 h-3 flex-shrink-0 text-gray-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                      </svg>
                      <p className="text-[10px] text-gray-700 truncate">
                        {store.email}
                      </p>
                    </div>

                    {/* Ciudad */}
                    <div className="flex items-center gap-2">
                      <svg className="w-3 h-3 flex-shrink-0 text-gray-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                      </svg>
                      <p className="text-[10px] text-gray-700">
                        {store.ciudad}, {store.departamento}
                      </p>
                    </div>

                    {/* Horario */}
                    <div className="flex items-start gap-2">
                      <svg className="w-3 h-3 mt-0.5 flex-shrink-0 text-gray-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="10"/>
                        <path d="M12 6v6l4 2"/>
                      </svg>
                      <p className="text-[10px] text-gray-700 leading-relaxed">
                        {store.horario}
                      </p>
                    </div>
                  </div>
                </div>
              );
              })}
            </div>

            {/* Botón siguiente */}
            <button
              onClick={() => scroll("right")}
              className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 z-10 bg-white hover:bg-gray-100 rounded-full p-3 shadow-lg transition-colors items-center justify-center"
              aria-label="Deslizar derecha"
            >
              <ChevronRight className="w-6 h-6 text-gray-700" />
            </button>
          </div>
        )}

        {/* Contador eliminado */}
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
