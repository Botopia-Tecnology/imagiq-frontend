import React, { useState, useEffect } from "react";
import type { Address } from "@/types/address";
import AddNewAddressForm from "./AddNewAddressForm";
import Modal from "@/components/ui/Modal";

interface AddressSelectorProps {
  address: Address | null;
  addresses: Address[];
  addressEdit: boolean;
  onAddressChange: (address: Address) => void;
  onEditToggle: (edit: boolean) => void;
  onAddressAdded?: (address?: Address) => void | Promise<void>;
  addressLoading?: boolean; // Para mostrar skeleton al recargar dirección desde header
}

/**
 * Helper para obtener el icono del tipo de dirección
 */
const getTipoDireccionIcon = (tipo?: string) => {
  switch(tipo?.toLowerCase()) {
    case 'casa': return '🏠';
    case 'apartamento': return '🏢';
    case 'oficina': return '🏢';
    default: return '📍';
  }
};

/**
 * Helper para obtener el label del tipo de dirección
 */
const getTipoDireccionLabel = (tipo?: string) => {
  if (!tipo) return 'Otro';
  return tipo.charAt(0).toUpperCase() + tipo.slice(1).toLowerCase();
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

  const handleAddressAdded = async (newAddress: Address) => {
    // Llamar a onAddressAdded y esperar si devuelve una promesa
    const result = onAddressAdded?.(newAddress);
    if (result instanceof Promise) {
      await result;
    }
    onAddressChange(newAddress);
    setShowAddForm(false);
    onEditToggle(false);
  };

  const handleCloseModal = () => {
    onEditToggle(false);
    setShowAddForm(false);
  };

  return (
    <Modal isOpen={addressEdit} onClose={handleCloseModal} size="lg" showCloseButton={false}>
      <div className="space-y-6">
        {/* Vista de selección de direcciones */}
        {!showAddForm && (
          <>
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-gray-200">
              <h4 className="text-xl font-semibold text-gray-900">
                Selecciona tu dirección de envío
              </h4>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="text-gray-700 text-sm font-medium hover:text-gray-900 transition flex items-center gap-1.5 px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddForm(true)}
                  className="px-4 py-2 text-sm font-medium text-white bg-black rounded-lg hover:bg-gray-800 transition flex items-center gap-1.5"
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
                  Añadir nueva
                </button>
              </div>
            </div>

            {/* Lista de direcciones */}
            {addresses.length > 0 && (
              <div className="space-y-2 max-h-[calc(100vh-350px)] overflow-y-auto pr-2">
                {addresses.map((ad, i) => {
                  const icon = getTipoDireccionIcon(ad.tipoDireccion);
                  const label = getTipoDireccionLabel(ad.tipoDireccion);
                  const mainAddress = ad.direccionFormateada || ad.nombreDireccion || 'Dirección';
                  const barrio = ad.barrio || '';
                  const ciudad = ad.ciudad || '';
                  const localidad = ad.localidad || '';
                  const complemento = ad.complemento || '';
                  const instruccionesEntrega = ad.instruccionesEntrega || '';

                  return (
                    <label
                      key={ad.id || i}
                      className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 cursor-pointer transition-all"
                    >
                      <input
                        type="radio"
                        name="address"
                        checked={address?.id === ad.id}
                        onChange={() => {
                          console.log('📍 [AddressSelector] Dirección seleccionada:', {
                            id: ad.id,
                            latitud: ad.latitud,
                            longitud: ad.longitud,
                            googleUrl: ad.googleUrl,
                            localidad: ad.localidad,
                            barrio: ad.barrio,
                            complemento: ad.complemento
                          });
                          onAddressChange(ad);

                          // Disparar evento para sincronizar navbar con la dirección seleccionada
                          // IMPORTANTE: fromHeader: true para forzar recálculo de tiendas
                          if (typeof window !== 'undefined') {
                            window.dispatchEvent(new CustomEvent('address-changed', {
                              detail: {
                                address: ad,
                                addressId: ad.id,
                                fromHeader: true
                              }
                            }));
                          }

                          // Cerrar el modal automáticamente después de seleccionar una dirección
                          handleCloseModal();
                        }}
                        className="mt-1 accent-blue-600 h-4 w-4"
                      />

                      {/* Layout responsive: una línea en desktop, multi-línea en mobile */}
                      <div className="flex-1 min-w-0 flex flex-col gap-1 text-sm">
                        {/* Primera línea: tipo + dirección principal */}
                        <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-2">
                          {/* Badge de tipo */}
                          <div className="flex items-center gap-1.5">
                            <span className="text-base">{icon}</span>
                            <span className="font-medium text-gray-900">{label}</span>
                          </div>

                          {/* Separador desktop */}
                          <span className="hidden md:inline text-gray-400">-</span>

                          {/* Dirección principal */}
                          <span className="font-medium text-gray-900">{mainAddress}</span>
                        </div>

                        {/* Segunda línea: ubicación (localidad, barrio, ciudad) */}
                        {(localidad || barrio || ciudad) && (
                          <div className="text-gray-500 text-xs md:text-sm">
                            {[localidad, barrio, ciudad].filter(Boolean).join(', ')}
                          </div>
                        )}

                        {/* Tercera línea: referencia e instrucciones de entrega */}
                        {(complemento || instruccionesEntrega) && (
                          <div className="text-gray-500 text-xs italic flex flex-wrap gap-1">
                            {complemento && <span>Ref: {complemento}</span>}
                            {complemento && instruccionesEntrega && <span className="text-gray-400">•</span>}
                            {instruccionesEntrega && <span>Observaciones: {instruccionesEntrega}</span>}
                          </div>
                        )}
                      </div>

                      {/* Indicador de predeterminada */}
                      {ad.esPredeterminada && (
                        <span className="text-blue-600 text-lg" title="Dirección predeterminada">
                          ✓
                        </span>
                      )}
                    </label>
                  );
                })}
              </div>
            )}

            {/* Mensaje cuando no hay direcciones */}
            {addresses.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <p className="mb-4">No tienes direcciones guardadas</p>
                <p className="text-sm">Haz click en &quot;Añadir nueva&quot; para crear tu primera dirección</p>
              </div>
            )}
          </>
        )}

        {/* Vista de formulario de nueva dirección */}
        {showAddForm && (
          <>
            {/* Header con botón de volver */}
            <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <svg
                  className="h-5 w-5 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <h4 className="text-xl font-semibold text-gray-900">
                Agregar nueva dirección
              </h4>
            </div>

            {/* Formulario con scroll independiente */}
            <div className="max-h-[calc(100vh-150px)] overflow-y-auto pr-2">
              <AddNewAddressForm
                onAddressAdded={handleAddressAdded}
                onCancel={() => setShowAddForm(false)}
                withContainer={false}
              />
            </div>
          </>
        )}
      </div>
    </Modal>
  );
};
