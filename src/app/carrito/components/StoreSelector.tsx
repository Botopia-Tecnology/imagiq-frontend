import React from "react";
import { Store } from "../../../components/LocationsArray";

interface StoreSelectorProps {
  storeQuery: string;
  filteredStores: Store[];
  selectedStore: Store | null;
  onQueryChange: (query: string) => void;
  onStoreSelect: (store: Store) => void;
}

export const StoreSelector: React.FC<StoreSelectorProps> = ({
  storeQuery,
  filteredStores,
  selectedStore,
  onQueryChange,
  onStoreSelect,
}) => {
  return (
    <div className="space-y-4">
      <input
        type="text"
        className="w-full border rounded-lg px-3 py-2 text-sm cursor-text"
        placeholder="Buscar tienda por nombre, ciudad o centro comercial..."
        value={storeQuery}
        onChange={(e) => onQueryChange(e.target.value)}
      />
      <div className="max-h-48 overflow-y-auto border rounded-lg bg-white shadow">
        {filteredStores.length === 0 ? (
          <div className="p-4 text-gray-500 text-sm">
            No se encontraron tiendas.
          </div>
        ) : (
          filteredStores.map((store) => (
            <div
              key={store.id}
              className={`p-3 cursor-pointer hover:bg-blue-50 ${
                selectedStore?.id === store.id ? "bg-blue-100" : ""
              }`}
              onClick={() => onStoreSelect(store)}
            >
              <div className="font-semibold text-sm">{store.name}</div>
              <div className="text-xs text-gray-600">
                {store.address} {store.city}
              </div>
              {store.mall && (
                <div className="text-xs text-gray-400">{store.mall}</div>
              )}
            </div>
          ))
        )}
      </div>
      {selectedStore && (
        <div className="p-4 border rounded-lg bg-blue-50">
          <div className="font-bold text-base mb-1">{selectedStore.name}</div>
          <div className="text-sm text-gray-700">
            {selectedStore.address}, {selectedStore.city}
          </div>
          {selectedStore.mall && (
            <div className="text-xs text-gray-500 mt-1">{selectedStore.mall}</div>
          )}
          <div className="text-xs text-gray-500 mt-1">
            Tel: {selectedStore.phone}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            Horario: {selectedStore.hours}
          </div>
        </div>
      )}
    </div>
  );
};
