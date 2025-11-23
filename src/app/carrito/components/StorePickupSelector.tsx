import React from "react";
import { DeliveryIcon } from "./DeliveryIcon";
import type { FormattedStore } from "@/types/store";

interface StorePickupSelectorProps {
  deliveryMethod: string;
  onMethodChange: (method: string) => void;
  disabled?: boolean;
  isLoading?: boolean;
  availableStoresWhenCanPickUpFalse?: FormattedStore[];
  hasActiveTradeIn?: boolean;
}

export const StorePickupSelector: React.FC<StorePickupSelectorProps> = ({
  deliveryMethod,
  onMethodChange,
  disabled = false,
  isLoading = false,
  availableStoresWhenCanPickUpFalse = [],
  hasActiveTradeIn = false,
}) => {
  // Solo mostrar el mensaje si está deshabilitado, hay trade-in activo y hay tiendas disponibles
  const showStoresInfo = disabled && hasActiveTradeIn && !isLoading && availableStoresWhenCanPickUpFalse.length > 0;

  return (
    <div className="space-y-3">
      <label
        htmlFor="tienda"
        className={`flex items-center gap-4 p-4 border rounded-lg transition-all ${
          disabled || isLoading
            ? "border-gray-200 bg-gray-100 cursor-not-allowed opacity-60"
            : deliveryMethod === "tienda"
            ? "border-blue-500 bg-blue-50 cursor-pointer"
            : "border-gray-200 hover:border-gray-300 hover:bg-gray-50 cursor-pointer"
        }`}
      >
        <input
          type="radio"
          id="tienda"
          name="delivery"
          checked={deliveryMethod === "tienda"}
          onChange={(e) => {
            if (!disabled && !isLoading && e.target.checked) {
              onMethodChange("tienda");
            }
          }}
          disabled={disabled || isLoading}
          className="accent-blue-600 w-5 h-5"
        />
        <div className="flex items-center gap-3 flex-1">
          <DeliveryIcon />
          <div className="flex-1">
            <div className="font-semibold text-gray-900">Recoger en tienda</div>
            <div className="text-sm text-gray-600">
              {isLoading
                ? "Verificando disponibilidad..."
                : disabled
                ? "Tu producto no cuenta con esa opción"
                : "Recoge tu pedido en una de nuestras tiendas"}
            </div>
          </div>
          {isLoading && (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          )}
        </div>
      </label>

      {/* Mostrar información de tiendas disponibles cuando canPickUp es false y hay trade-in activo */}
      {showStoresInfo && (
        <div className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-200 rounded-lg shadow-sm">
          <p className="text-sm font-bold text-gray-900 mb-2">
            El producto en tu carrito no está disponible para recoger en tienda con tu dirección predeterminada.
          </p>
          <p className="text-xs text-gray-700 mb-3">
            Cambia tu dirección predeterminada a una zona de cobertura con una tienda disponible.
          </p>
          
          {/* Mostrar tiendas disponibles - agrupadas por ciudad */}
          {availableStoresWhenCanPickUpFalse.length > 0 && (() => {
            // Agrupar tiendas por ciudad
            const storesByCity = availableStoresWhenCanPickUpFalse.reduce((acc, store) => {
              const city = store.ciudad || 'Sin ciudad';
              if (!acc[city]) {
                acc[city] = [];
              }
              acc[city].push(store);
              return acc;
            }, {} as Record<string, typeof availableStoresWhenCanPickUpFalse>);

            return (
              <div className="mb-3 p-3 bg-white rounded-lg border border-gray-200 shadow-sm">
                <p className="text-xs font-semibold text-gray-900 mb-2">
                  El producto está disponible en las siguientes tiendas:
                </p>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {Object.entries(storesByCity).map(([city, cityStores]) => (
                    <div key={city} className="space-y-1">
                      <div className="text-xs font-bold text-gray-700 uppercase">{city}</div>
                      {cityStores.map((store) => (
                        <div
                          key={store.codigo}
                          className="ml-3 p-2 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200"
                        >
                          <div className="font-semibold text-sm text-gray-900">{store.descripcion}</div>
                          <div className="text-xs text-gray-600 mt-0.5">
                            {store.direccion}
                          </div>
                          {store.ubicacion_cc && (
                            <div className="text-xs text-gray-500 mt-0.5">{store.ubicacion_cc}</div>
                          )}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
};
