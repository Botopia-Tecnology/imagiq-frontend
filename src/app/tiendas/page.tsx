"use client";
/**
 * 🗺️ SECCIÓN DE TIENDAS - IMAGIQ ECOMMERCE
 *
 * - Mapa interactivo con ubicaciones de tiendas Samsung
 * - Panel lateral con buscador, filtros y cards de tiendas
 * - UX premium, responsivo, animado y escalable
 * - Código limpio y documentado
 * - Datos dinámicos desde el endpoint del backend
 */

import { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import { useStores } from "@/hooks/useStores";
import type { FormattedStore } from "@/types/store";
import TiendasFilters from "./TiendasFilters";
import StoreCardSkeleton from "./StoreCardSkeleton";
import MapSkeleton from "./MapSkeleton";
import Image from "next/image";

const MapSection = dynamic(() => import("./MapSection"), {
  ssr: false,
  loading: () => <MapSkeleton />
});

export default function TiendasPage() {
  // Obtener tiendas desde el endpoint usando el hook
  const { stores, loading, error } = useStores();

  // Estado de búsqueda y filtro
  const [search, setSearch] = useState("");
  const [filteredStores, setFilteredStores] = useState<FormattedStore[]>([]);

  // Filtrar tiendas por búsqueda de texto y coordenadas válidas
  const visibleStores = useMemo(() => {
    // Primero filtrar solo tiendas con coordenadas válidas
    const storesWithCoords = (filteredStores.length > 0 ? filteredStores : stores).filter(
      (store) => store.latitud !== 0 && store.longitud !== 0 &&
                 !isNaN(store.latitud) && !isNaN(store.longitud)
    );

    // Luego aplicar búsqueda de texto si existe
    if (!search.trim()) return storesWithCoords;

    const query = search.trim().toLowerCase();
    return storesWithCoords.filter(
      (store) =>
        store.descripcion?.toLowerCase().includes(query) ||
        store.direccion?.toLowerCase().includes(query) ||
        store.ciudad?.toLowerCase().includes(query)
    );
  }, [search, filteredStores, stores]);

  return (
    <div className="min-h-screen w-full bg-gray-50 flex flex-col">
      {/* Header centrado arriba */}
      <header
        className="w-full flex flex-col items-center pt-8 pb-2"
        style={{ zIndex: 10, position: "relative" }}
      >
        <h1
          className="text-3xl md:text-4xl font-bold text-center mb-1"
          style={{ fontFamily: "Samsung Sharp Sans, sans-serif" }}
        >
          ENCUENTRA TU SAMSUNG STORE
        </h1>
        <p className="text-center text-lg text-gray-700 mb-4">
          Elige la tienda más cercana, agenda tu visita y vive la experiencia
          Galaxy
        </p>
      </header>
      <main
        className="relative flex-1 w-full flex justify-center items-start"
        style={{ minHeight: 1400 }}
      >
        <MapSection stores={visibleStores} />
        <aside
          className="absolute top-32 left-12 w-[420px] max-w-full bg-white rounded-[18px] border border-black p-0 flex flex-col gap-0 z-20"
          style={{
            boxShadow: "0 2px 8px rgba(0,0,0,0.10)",
            backdropFilter: "none",
            overflow: "hidden",
          }}
        >
          <div className="w-full flex flex-col gap-2 px-6 pt-6 pb-2 bg-transparent">
            <div
              className="w-full flex items-center bg-[#E5E5E5] rounded-[16px] px-4"
              style={{ height: "36px", position: "relative" }}
            >
              <input
                type="text"
                placeholder="Buscar por nombre, dirección o ciudad..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-[#E5E5E5] rounded-[16px] px-2 py-0 text-[15px] border-none focus:outline-none font-bold text-gray-700"
                style={{
                  fontFamily: "Samsung Sharp Sans, sans-serif",
                  height: "28px",
                  fontWeight: "bold",
                  fontSize: "15px",
                  paddingRight: "32px",
                }}
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600">
                <svg
                  width="16"
                  height="16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </span>
            </div>
            {/* Filtros y Cerca de mí */}
            <TiendasFilters onUpdateStores={setFilteredStores} />
          </div>
          <div
            className="flex flex-col gap-5 overflow-y-auto px-4 pb-4 pt-2"
            style={{ maxHeight: 650, minHeight: 320 }}
          >
            {loading ? (
              // Mostrar skeleton mientras carga
              <>
                <StoreCardSkeleton />
                <StoreCardSkeleton />
                <StoreCardSkeleton />
              </>
            ) : error ? (
              // Mostrar error si hay problema
              <div className="text-center text-red-500 py-8">
                <p className="font-semibold mb-2">Error al cargar tiendas</p>
                <p className="text-sm">{error}</p>
              </div>
            ) : visibleStores.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                No se encontraron tiendas.
              </div>
            ) : (
              visibleStores.map((store) => (
                <div
                  key={store.codigo}
                  className="bg-white rounded-[16px] border border-black px-4 py-3 flex flex-col gap-2"
                  style={{ boxShadow: "none" }}
                >
                  <h2
                    className="font-bold text-[17px] mb-1 flex items-center gap-2 text-gray-900"
                    style={{ fontFamily: "Samsung Sharp Sans, sans-serif" }}
                  >
                    {store.descripcion}
                  </h2>
                  
                  {/* Botones de navegación arriba */}
                  <div className="flex gap-2 w-full">
                    <button
                      className="flex-1 bg-gray-500 text-white rounded-[12px] px-4 py-2 font-bold text-[14px] border-none shadow-sm hover:bg-gray-600 transition-all flex items-center justify-center gap-2"
                      style={{
                        fontFamily: "Samsung Sharp Sans, sans-serif",
                      }}
                      onClick={() => {
                        window.open(
                          `https://www.google.com/maps/search/?api=1&query=${store.latitud},${store.longitud}`,
                          "_blank"
                        );
                      }}
                    >
                      <Image 
                        src="https://res.cloudinary.com/dgnqk0ucm/image/upload/v1762445116/Google_Maps_icon__2020.svg_r4s0ks.png" 
                        alt="Google Maps"
                        width={14}
                        height={16}
                        className="w-3.5 h-4"
                      />
                      Google Maps
                    </button>
                    <button
                      className="flex-1 bg-[#33CCFF] text-white rounded-[12px] px-4 py-2 font-bold text-[14px] border-none shadow-sm hover:bg-[#00B8E6] transition-all flex items-center justify-center gap-2"
                      style={{
                        fontFamily: "Samsung Sharp Sans, sans-serif",
                      }}
                      onClick={() => {
                        window.open(
                          `https://waze.com/ul?ll=${store.latitud},${store.longitud}&navigate=yes`,
                          "_blank"
                        );
                      }}
                    >
                      <Image 
                        src="https://res.cloudinary.com/dgnqk0ucm/image/upload/v1762445166/unnamed_jfcf46.png" 
                        alt="Waze"
                        width={16}
                        height={16}
                        className="w-4 h-4"
                      />
                      Waze
                    </button>
                  </div>

                  {/* Información de la tienda */}
                  <div className="flex flex-col gap-2 mt-2 pt-2 border-t border-gray-200">
                    <div className="flex items-start gap-2">
                      <svg className="w-4 h-4 mt-0.5 flex-shrink-0 text-gray-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                        <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                      </svg>
                      <div className="flex-1">
                        <div className="text-[13px] text-gray-700 leading-relaxed">
                          {store.direccion}
                          {store.ubicacion_cc && ` - ${store.ubicacion_cc}`}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 flex-shrink-0 text-gray-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                      </svg>
                      <div className="text-[13px] text-gray-700">
                        {store.telefono}
                        {store.extension && ` Ext ${store.extension}`}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 flex-shrink-0 text-gray-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                      </svg>
                      <div className="text-[13px] text-gray-700 break-all">
                        {store.email}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 flex-shrink-0 text-gray-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                      </svg>
                      <div className="text-[13px] text-gray-700">
                        {store.ciudad}, {store.departamento}
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <svg className="w-4 h-4 mt-0.5 flex-shrink-0 text-gray-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="10"/>
                        <path d="M12 6v6l4 2"/>
                      </svg>
                      <div className="text-[13px] text-gray-700 leading-relaxed">
                        {store.horario}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </aside>
      </main>
      <style jsx>{`
        @media (max-width: 900px) {
          aside {
            position: fixed !important;
            left: 0 !important;
            top: auto !important;
            bottom: 0 !important;
            width: 100vw !important;
            max-width: 100vw !important;
            border-radius: 24px 24px 0 0 !important;
            box-shadow: 0 -4px 32px rgba(0, 0, 0, 0.1) !important;
            z-index: 40 !important;
          }
        }
      `}</style>
    </div>
  );
}
