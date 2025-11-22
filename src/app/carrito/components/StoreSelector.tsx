import React from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import type { FormattedStore } from "@/types/store";
import AddNewAddressForm from "./AddNewAddressForm";
import type { Address } from "@/types/address";

interface StoreSelectorProps {
  storeQuery: string;
  filteredStores: FormattedStore[];
  selectedStore: FormattedStore | null;
  onQueryChange: (query: string) => void;
  onStoreSelect: (store: FormattedStore) => void;
  storesLoading?: boolean;
  canPickUp?: boolean;
  allStores?: FormattedStore[];
  onAddressAdded?: () => void;
  onRefreshStores?: () => void;
  availableCities?: string[];
}


export const StoreSelector: React.FC<StoreSelectorProps> = ({
  storeQuery,
  filteredStores,
  selectedStore,
  onQueryChange,
  onStoreSelect,
  storesLoading = false,
  canPickUp = true,
  allStores = [],
  onAddressAdded,
  onRefreshStores,
  availableCities = [],
}) => {
  const [showAddAddressModal, setShowAddAddressModal] = React.useState(false);
  const [isMounted, setIsMounted] = React.useState(false);

  // Verificar si estamos en el cliente
  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  // Función para manejar cuando se agrega una nueva dirección
  const handleAddressAdded = (newAddress: Address) => {
    console.log('🆕 Nueva dirección agregada desde carrito:', newAddress);
    setShowAddAddressModal(false);
    onAddressAdded?.();

    // Recargar las tiendas candidatas con la nueva dirección predeterminada
    if (onRefreshStores) {
      onRefreshStores();
    }

    // Disparar eventos para que el navbar se actualice
    console.log('🔔 Disparando evento address-changed desde carrito');
    window.dispatchEvent(new CustomEvent('address-changed', { detail: { address: newAddress } }));
    window.dispatchEvent(new Event('storage')); // También disparar storage event
  };

  return (
    <div className="space-y-4">
      {!canPickUp && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm font-bold text-gray-900 mb-2">
            El producto en tu carrito no está disponible para recoger en tienda con tu dirección predeterminada.
          </p>
          <p className="text-xs text-gray-700 mb-2">
            Cambia tu dirección predeterminada a una zona de cobertura con una tienda disponible.
          </p>
          {availableCities.length > 0 && (
            <div className="mb-3 p-2 bg-white rounded border border-red-100">
              <p className="text-xs font-semibold text-gray-900 mb-1">
                El producto está disponible en las siguientes ciudades:
              </p>
              <div className="flex flex-wrap gap-1">
                {availableCities.map((city, index) => (
                  <span
                    key={index}
                    className="inline-block px-2 py-1 text-xs font-medium bg-blue-50 text-blue-700 rounded border border-blue-200"
                  >
                    {city}
                  </span>
                ))}
              </div>
            </div>
          )}
          <button
            onClick={() => setShowAddAddressModal(true)}
            className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg text-sm font-medium hover:bg-gray-900 transition"
          >
            Agregar nueva dirección
          </button>
        </div>
      )}

      {(
        <>
          <div className="flex gap-2">
            <input
              type="text"
              className="flex-1 border rounded-lg px-3 py-2 text-sm cursor-text"
              placeholder="Buscar tienda por nombre, ciudad o centro comercial..."
              value={storeQuery}
              onChange={(e) => {
                onQueryChange(e.target.value);
              }}
              disabled={storesLoading}
            />
          </div>

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
        </>
      )}

      {/* Modal para agregar dirección - usando Portal para renderizar fuera del componente */}
      {showAddAddressModal && isMounted && createPortal(
        <div
          className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/50"
          onClick={() => setShowAddAddressModal(false)}
        >
          <div
            className="bg-white rounded-lg shadow-2xl w-full max-w-3xl max-h-[85vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 flex-shrink-0">
              <h2 className="text-xl font-semibold text-gray-900">
                Agregar nueva dirección
              </h2>
              <button
                onClick={() => setShowAddAddressModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                type="button"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="overflow-y-auto p-6">
              <AddNewAddressForm
                onAddressAdded={handleAddressAdded}
                onCancel={() => setShowAddAddressModal(false)}
                withContainer={false}
              />
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};
