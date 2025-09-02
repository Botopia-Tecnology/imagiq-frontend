"use client";
/**
 * 🗺️ SECCIÓN DE TIENDAS - IMAGIQ ECOMMERCE
 *
 * - Mapa interactivo con ubicaciones de tiendas Samsung
 * - Panel lateral con buscador, filtros y cards de tiendas
 * - UX premium, responsivo, animado y escalable
 * - Código limpio y documentado
 */

import { useState } from "react";
import dynamic from "next/dynamic";
import { stores } from "@/components/LocationsArray";
import TiendasFilters from "./TiendasFilters";

const MapSection = dynamic(() => import("./MapSection"), { ssr: false });

export default function TiendasPage() {
  // Estado de búsqueda y filtro
  const [search, setSearch] = useState("");
  const [filteredStores, setFilteredStores] = useState(stores);

  // Mostrar directamente los resultados filtrados por TiendasFilters
  const visibleStores = filteredStores;

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
                placeholder="Buscar tienda o dirección..."
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
            {visibleStores.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                No se encontraron tiendas.
              </div>
            ) : (
              visibleStores.map((store) => (
                <div
                  key={store.id}
                  className="bg-white rounded-[16px] border border-black px-4 py-3 flex flex-col gap-1"
                  style={{ boxShadow: "none" }}
                >
                  <h2
                    className="font-bold text-[16px] mb-1 flex items-center gap-2 text-gray-900"
                    style={{ fontFamily: "Samsung Sharp Sans, sans-serif" }}
                  >
                    {store.name}
                  </h2>
                  <div className="text-[14px] text-gray-700 mb-1">
                    <b>Dirección:</b> {store.address}
                  </div>
                  <div className="text-[14px] text-gray-700">
                    <b>Teléfono:</b> {store.phone}
                  </div>
                  <div className="text-[14px] text-gray-700">
                    <b>Correo Electrónico:</b> {store.email}
                  </div>
                  <div className="text-[14px] text-gray-700">
                    <b>Horario de atención:</b> {store.hours}
                  </div>
                  <div className="flex gap-2 mt-2 justify-center">
                    <button
                      className="bg-[#E5E5E5] text-gray-900 rounded-[16px] px-4 py-1 font-bold text-[15px] border-none shadow-none"
                      style={{
                        fontFamily: "Samsung Sharp Sans, sans-serif",
                        minWidth: "110px",
                      }}
                    >
                      Ver más
                    </button>
                    <button
                      className="bg-[#E5E5E5] text-gray-900 rounded-[16px] px-4 py-1 font-bold text-[15px] border-none shadow-none"
                      style={{
                        fontFamily: "Samsung Sharp Sans, sans-serif",
                        minWidth: "110px",
                      }}
                    >
                      Agendar visita
                    </button>
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
