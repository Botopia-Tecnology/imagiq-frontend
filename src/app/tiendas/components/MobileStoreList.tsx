"use client";

import type { FormattedStore } from "@/types/store";
import StoreCard from "./StoreCard";
import StoreCardSkeleton from "../StoreCardSkeleton";
import TiendasFilters from "../TiendasFilters";

interface MobileStoreListProps {
  stores: FormattedStore[];
  loading: boolean;
  isFilterLoading: boolean;
  error: string | null;
  search: string;
  onSearchChange: (value: string) => void;
  onUpdateStores: (stores: FormattedStore[]) => void;
  onLoadingChange: (loading: boolean) => void;
  onStoreSelect?: (store: FormattedStore) => void;
  selectedStore?: FormattedStore | null;
}

export default function MobileStoreList({
  stores,
  loading,
  isFilterLoading,
  error,
  search,
  onSearchChange,
  onUpdateStores,
  onLoadingChange,
  onStoreSelect,
  selectedStore,
}: MobileStoreListProps) {
  return (
    <div className="fixed inset-0 z-30 bg-white flex flex-col">
      {/* Header sticky con búsqueda y filtros */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 pt-4 pb-2">
        <h2
          className="text-xl font-bold text-gray-900 mb-3"
          style={{ fontFamily: "Samsung Sharp Sans, sans-serif" }}
        >
          Tiendas Samsung
        </h2>

        {/* Input de búsqueda */}
        <div
          className="w-full flex items-center bg-[#E5E5E5] rounded-[16px] px-4 mb-3"
          style={{ height: "44px" }}
        >
          <input
            type="text"
            placeholder="Buscar por nombre, dirección o ciudad..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-transparent rounded-[16px] px-2 py-0 text-[15px]
                       border-none focus:outline-none font-bold text-gray-700"
            style={{
              fontFamily: "Samsung Sharp Sans, sans-serif",
              height: "36px",
            }}
          />
          <svg
            className="w-5 h-5 text-gray-600 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </div>

        {/* Filtros */}
        <TiendasFilters
          onUpdateStores={onUpdateStores}
          onLoadingChange={onLoadingChange}
        />
      </div>

      {/* Lista scrolleable */}
      <div
        className="flex-1 overflow-y-auto px-4 pb-24"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        <div className="flex flex-col gap-4 py-4">
          {loading || isFilterLoading ? (
            <>
              <StoreCardSkeleton />
              <StoreCardSkeleton />
              <StoreCardSkeleton />
            </>
          ) : error ? (
            <div className="text-center text-red-500 py-8">
              <p className="font-semibold mb-2">Error al cargar tiendas</p>
              <p className="text-sm">{error}</p>
            </div>
          ) : stores.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              No se encontraron tiendas.
            </div>
          ) : (
            stores.map((store) => (
              <StoreCard
                key={store.codigo}
                store={store}
                onSelect={onStoreSelect}
                isSelected={selectedStore?.codigo === store.codigo}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
