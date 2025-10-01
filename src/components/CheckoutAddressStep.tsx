/**
 * @module CheckoutAddressStep
 * @description Paso del checkout para seleccionar dirección de envío
 */

import React, { useState, useEffect } from 'react';
import AddressAutocomplete from './forms/AddressAutocomplete';
import AddressMap3D from './AddressMap3D';
import { PlaceDetails } from '@/types/places.types';

interface CheckoutAddressStepProps {
  /**
   * Dirección inicial (si el usuario ya tiene una guardada)
   */
  initialAddress?: PlaceDetails | null;

  /**
   * Callback cuando se selecciona una dirección
   */
  onAddressChange?: (address: PlaceDetails | null) => void;

  /**
   * Callback para continuar al siguiente paso
   */
  onContinue?: (address: PlaceDetails) => void;

  /**
   * Callback para volver al paso anterior
   */
  onBack?: () => void;

  /**
   * Si está en modo loading
   */
  isLoading?: boolean;

  /**
   * Direcciones guardadas del usuario
   */
  savedAddresses?: PlaceDetails[];
}

export const CheckoutAddressStep: React.FC<CheckoutAddressStepProps> = ({
  initialAddress,
  onAddressChange,
  onContinue,
  onBack,
  isLoading = false,
  savedAddresses = []
}) => {
  const [selectedAddress, setSelectedAddress] = useState<PlaceDetails | null>(initialAddress || null);
  const [showMap, setShowMap] = useState(false);
  const [useNewAddress, setUseNewAddress] = useState(!initialAddress && savedAddresses.length === 0);

  useEffect(() => {
    onAddressChange?.(selectedAddress);
  }, [selectedAddress, onAddressChange]);

  const handleAddressSelect = (place: PlaceDetails) => {
    setSelectedAddress(place);
    setShowMap(true);
  };

  const handleSavedAddressSelect = (address: PlaceDetails) => {
    setSelectedAddress(address);
    setShowMap(true);
    setUseNewAddress(false);
  };

  const handleContinue = () => {
    if (selectedAddress) {
      onContinue?.(selectedAddress);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          📍 Dirección de Envío
        </h2>
        <p className="text-gray-600">
          Selecciona o ingresa la dirección donde quieres recibir tu pedido
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Lado izquierdo - Selección de dirección */}
        <div className="space-y-6">
          {/* Direcciones guardadas */}
          {savedAddresses.length > 0 && (
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-4">
                🏠 Mis Direcciones Guardadas
              </h3>
              <div className="space-y-3">
                {savedAddresses.map((address, index) => (
                  <div
                    key={index}
                    onClick={() => handleSavedAddressSelect(address)}
                    className={`
                      p-4 border rounded-lg cursor-pointer transition-all
                      ${selectedAddress?.placeId === address.placeId
                        ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }
                    `}
                  >
                    <div className="flex items-start gap-3">
                      <div className="text-blue-600 text-lg mt-1">📍</div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">
                          {address.name || 'Dirección guardada'}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          {address.formattedAddress}
                        </p>
                        {selectedAddress?.placeId === address.placeId && (
                          <div className="mt-2">
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                              ✓ Seleccionada
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4">
                <button
                  onClick={() => setUseNewAddress(true)}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  + Usar una dirección diferente
                </button>
              </div>
            </div>
          )}

          {/* Nueva dirección */}
          {(useNewAddress || savedAddresses.length === 0) && (
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-4">
                {savedAddresses.length > 0 ? '🆕 Nueva Dirección' : '📍 Dirección de Envío'}
              </h3>

              <AddressAutocomplete
                addressType="shipping"
                placeholder="Buscar dirección de envío (ej: Calle 80 # 15-25, Bogotá)"
                onPlaceSelect={handleAddressSelect}
                value={!savedAddresses.length && selectedAddress ? selectedAddress.formattedAddress : ''}
              />

              <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                <div className="flex items-start gap-2">
                  <div className="text-blue-600 text-sm">ℹ️</div>
                  <div className="text-blue-800 text-sm">
                    <p className="font-medium">Solo entregamos en zonas de cobertura</p>
                    <p className="text-blue-600 mt-1">
                      Ciudades disponibles: Bogotá, Medellín, Cali, Barranquilla, Cartagena y área metropolitana
                    </p>
                  </div>
                </div>
              </div>

              {savedAddresses.length > 0 && (
                <div className="mt-4">
                  <button
                    onClick={() => {
                      setUseNewAddress(false);
                      setSelectedAddress(savedAddresses[0]);
                      setShowMap(true);
                    }}
                    className="text-gray-600 hover:text-gray-700 text-sm"
                  >
                    ← Volver a direcciones guardadas
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Información de entrega */}
          {selectedAddress && (
            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-medium text-green-800 mb-2">✅ Dirección Confirmada</h4>
              <p className="text-green-700 text-sm mb-2">
                {selectedAddress.formattedAddress}
              </p>
              <div className="text-green-600 text-xs space-y-1">
                <p>• Tiempo estimado de entrega: 2-6 horas</p>
                <p>• Costo de envío: Calculado en el siguiente paso</p>
                <p>• Zona de cobertura confirmada ✓</p>
              </div>
            </div>
          )}
        </div>

        {/* Lado derecho - Mapa */}
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium text-gray-800 mb-4">
              🗺️ Vista del Mapa
            </h3>

            {selectedAddress && showMap ? (
              <AddressMap3D
                address={selectedAddress}
                height="400px"
                enable3D={true}
                showControls={true}
              />
            ) : (
              <div className="h-[400px] bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <div className="text-4xl mb-2">🗺️</div>
                  <p>Selecciona una dirección para ver el mapa</p>
                </div>
              </div>
            )}
          </div>

          {/* Información adicional */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-800 mb-2">📦 Información de Entrega</h4>
            <div className="text-sm text-gray-600 space-y-1">
              <p>• Las entregas se realizan de lunes a sábado</p>
              <p>• Horario: 8:00 AM - 6:00 PM</p>
              <p>• Recibirás notificaciones del estado de tu pedido</p>
              <p>• Puedes reprogramar la entrega si no estás disponible</p>
            </div>
          </div>
        </div>
      </div>

      {/* Botones de navegación */}
      <div className="mt-8 flex items-center justify-between pt-6 border-t border-gray-200">
        <button
          onClick={onBack}
          disabled={isLoading}
          className="flex items-center gap-2 px-6 py-3 text-gray-600 hover:text-gray-700 disabled:opacity-50"
        >
          ← Volver al carrito
        </button>

        <button
          onClick={handleContinue}
          disabled={!selectedAddress || isLoading}
          className={`
            flex items-center gap-2 px-8 py-3 rounded-lg font-medium transition-all
            ${selectedAddress && !isLoading
              ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }
          `}
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Procesando...
            </>
          ) : selectedAddress ? (
            <>
              Continuar al pago →
            </>
          ) : (
            'Selecciona una dirección'
          )}
        </button>
      </div>
    </div>
  );
};

export default CheckoutAddressStep;