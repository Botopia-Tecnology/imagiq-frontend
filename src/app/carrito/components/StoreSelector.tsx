import React from "react";
import type { FormattedStore } from "@/types/store";

interface StoreSelectorProps {
  storeQuery: string;
  filteredStores: FormattedStore[];
  selectedStore: FormattedStore | null;
  onQueryChange: (query: string) => void;
  onStoreSelect: (store: FormattedStore) => void;
  storesLoading?: boolean;
}

export const StoreSelector: React.FC<StoreSelectorProps> = ({
  storeQuery,
  filteredStores,
  selectedStore,
  onQueryChange,
  onStoreSelect,
  storesLoading = false,
}) => {
  return (
    <div className="space-y-4">
      <input
        type="text"
        className="w-full border rounded-lg px-3 py-2 text-sm cursor-text"
        placeholder="Buscar tienda por nombre, ciudad o centro comercial..."
        value={storeQuery}
        onChange={(e) => onQueryChange(e.target.value)}
        disabled={storesLoading}
      />
      <div className="max-h-48 overflow-y-auto border rounded-lg bg-white shadow">
        {storesLoading ? (
          <div className="p-4 text-gray-500 text-sm">
            Cargando tiendas...
          </div>
        ) : filteredStores.length === 0 ? (
          <div className="p-4 text-gray-500 text-sm">
            No se encontraron tiendas.
          </div>
        ) : (
          filteredStores.map((store) => (
            <div
              key={store.codigo}
              className={`p-3 cursor-pointer hover:bg-blue-50 ${
                selectedStore?.codigo === store.codigo ? "bg-blue-100" : ""
              }`}
              onClick={() => onStoreSelect(store)}
            >
              <div className="font-semibold text-sm">{store.descripcion}</div>
              <div className="text-xs text-gray-600">
                {store.direccion}, {store.ciudad}
              </div>
              {store.ubicacion_cc && (
                <div className="text-xs text-gray-400">{store.ubicacion_cc}</div>
              )}
            </div>
          ))
        )}
      </div>
      {selectedStore && (
        <div className="p-4 border rounded-lg bg-blue-50">
          <div className="font-bold text-base mb-1">{selectedStore.descripcion}</div>
          <div className="text-sm text-gray-700">
            {selectedStore.direccion}, {selectedStore.ciudad}
          </div>
          {selectedStore.ubicacion_cc && (
            <div className="text-xs text-gray-500 mt-1">{selectedStore.ubicacion_cc}</div>
          )}
          <div className="text-xs text-gray-500 mt-1">
            Tel: {selectedStore.telefono} {selectedStore.extension ? `Ext ${selectedStore.extension}` : ""}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            Horario: {selectedStore.horario}
          </div>
        </div>
      )}
    </div>
  );
};
