import React, { useState, useEffect } from "react";
import { Direccion } from "@/types/user";
import type { Address } from "@/types/address";
import AddNewAddressForm from "./AddNewAddressForm";

interface AddressSelectorProps {
  address: Direccion | null;
  addresses: Direccion[];
  addressEdit: boolean;
  onAddressChange: (address: Direccion) => void;
  onEditToggle: (edit: boolean) => void;
  onAddressAdded?: () => void;
  addressLoading?: boolean; // Para mostrar skeleton al recargar dirección desde header
}

/**
 * Helper para convertir Address a Direccion (legacy)
 */
const addressToDireccion = (address: Address): Direccion => {
  return {
    id: address.id,
    usuario_id: address.usuarioId,
    email: "", // Se llenará del localStorage si es necesario
    linea_uno: address.direccionFormateada,
    codigo_dane: "", // Backend lo llena
    ciudad: address.ciudad || "",
    pais: address.pais,
    esPredeterminada: address.esPredeterminada || false,
  };
};

export const AddressSelector: React.FC<AddressSelectorProps> = ({
  address,
  addresses,
  addressEdit,
  onAddressChange,
  onEditToggle,
  onAddressAdded,
  addressLoading = false,
}) => {
  const [showAddForm, setShowAddForm] = useState(false);

  // Si no hay dirección seleccionada, seleccionar por defecto la marcada
  useEffect(() => {
    if (!address && addresses.length > 0) {
      const defaultAddr =
        addresses.find((a) => a.esPredeterminada) || addresses[0];
      if (defaultAddr) onAddressChange(defaultAddr);
    }
  }, [address, addresses, onAddressChange]);

  const handleAddressAdded = (newAddress: Address) => {
    onAddressAdded?.();
    // Convertir Address a Direccion para mantener compatibilidad
    const direccion = addressToDireccion(newAddress);
    onAddressChange(direccion);
    setShowAddForm(false);
    onEditToggle(false);
  };

  return (
    <div className="space-y-4">
      {!addressEdit ? (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex-1">
            <h4 className="text-sm font-medium text-gray-900 mb-1">
              Dirección seleccionada
            </h4>
            {addressLoading ? (
              /* Skeleton mientras se actualiza la dirección desde el header */
              <div className="space-y-2 animate-pulse">
                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                <div className="h-4 bg-gray-300 rounded w-1/2"></div>
              </div>
            ) : (
              <p className="text-sm text-gray-600">
                {address
                  ? `${address.linea_uno}, ${address.ciudad}`
                  : "No hay dirección seleccionada"}
              </p>
            )}
          </div>
          <button
            type="button"
            className="text-blue-600 text-sm font-medium hover:text-blue-700 transition self-start sm:self-center cursor-pointer"
            onClick={() => onEditToggle(true)}
            disabled={addressLoading}
          >
            {address ? "Cambiar dirección" : "Seleccionar dirección"}
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          <form className="space-y-4">
            {addresses.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-base font-medium text-gray-900">
                  Direcciones guardadas
                </h4>
                <div className="space-y-2">
                  {addresses.map((ad, i) => (
                    <label
                      key={ad.id || i}
                      className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 cursor-pointer transition-all"
                    >
                      <input
                        type="radio"
                        name="address"
                        checked={address?.id === ad.id}
                        onChange={() => {
                          onAddressChange(ad);

                          // Disparar evento para sincronizar navbar con la dirección seleccionada
                          if (typeof window !== 'undefined') {
                            window.dispatchEvent(new CustomEvent('address-changed', {
                              detail: {
                                address: ad,
                                addressId: ad.id,
                                fromHeader: false
                              }
                            }));
                          }
                        }}
                        className="mt-1 accent-blue-600 h-4 w-4"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-gray-900 text-sm">
                          {ad.linea_uno}
                        </div>
                        <div className="text-gray-500 text-sm">
                          {ad.ciudad}, {ad.pais}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            )}

            <div className="border-t border-gray-200 pt-4">
              <button
                type="button"
                onClick={() => setShowAddForm(!showAddForm)}
                className="w-full sm:w-auto text-blue-600 text-sm font-medium hover:text-blue-700 transition flex items-center justify-center gap-2 p-3 border border-blue-200 rounded-lg hover:bg-blue-50 cursor-pointer"
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                {showAddForm
                  ? "Cancelar nueva dirección"
                  : "Añadir nueva dirección"}
              </button>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                className="flex-1 sm:flex-none text-gray-600 text-sm font-medium px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition cursor-pointer"
                onClick={() => {
                  onEditToggle(false);
                  setShowAddForm(false);
                }}
              >
                Cancelar
              </button>
            </div>
          </form>

          {showAddForm && (
            <div className="border-t border-gray-200 pt-6">
              <AddNewAddressForm
                onAddressAdded={handleAddressAdded}
                onCancel={() => setShowAddForm(false)}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};
