"use client";
import { Direccion } from "@/types/user";
import React, { useState } from "react";
import AddressAutocomplete from "@/components/forms/AddressAutocomplete";
import AddressMap3D from "@/components/AddressMap3D";
import { PlaceDetails } from "@/types/places.types";
import { addressesService, CreateAddressRequest } from "@/services/addresses.service";

// Tipo extendido para manejar diferentes estructuras de PlaceDetails
type ExtendedPlaceDetails = PlaceDetails & {
  geometry?: {
    location: {
      lat: number;
      lng: number;
    };
  };
};

interface AddNewAddressFormProps {
  onAddressAdded?: (address: Direccion) => void;
  onCancel?: () => void;
  withContainer?: boolean; // Si debe mostrar el contenedor con padding y border
}

export default function AddNewAddressForm({
  onAddressAdded,
  onCancel,
  withContainer = true,
}: AddNewAddressFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<ExtendedPlaceDetails | null>(null);
  const [selectedBillingAddress, setSelectedBillingAddress] = useState<ExtendedPlaceDetails | null>(null);
  const [formData, setFormData] = useState({
    nombreDireccion: "",
    tipoDireccion: "casa" as "casa" | "apartamento" | "oficina" | "otro",
    usarMismaParaFacturacion: true,
    // Campos de dirección de envío
    complemento: "",
    instruccionesEntrega: "",
    puntoReferencia: "",
    // Campos de dirección de facturación
    nombreDireccionFacturacion: "",
    tipoDireccionFacturacion: "casa" as "casa" | "apartamento" | "oficina" | "otro",
    complementoFacturacion: "",
    instruccionesEntregaFacturacion: "",
    puntoReferenciaFacturacion: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!selectedAddress) {
      newErrors.address = "Selecciona una dirección de envío usando el autocompletado";
    }

    if (!formData.nombreDireccion.trim()) {
      newErrors.nombreDireccion = "El nombre de la dirección es requerido";
    }

    // Validar dirección de facturación si no usa la misma
    if (!formData.usarMismaParaFacturacion) {
      if (!selectedBillingAddress) {
        newErrors.billingAddress = "Selecciona una dirección de facturación usando el autocompletado";
      }

      if (!formData.nombreDireccionFacturacion.trim()) {
        newErrors.nombreDireccionFacturacion = "El nombre de la dirección de facturación es requerido";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm() || !selectedAddress) {
      return;
    }

    setIsLoading(true);

    try {
      // Validar que selectedAddress tenga la estructura necesaria
      if (!selectedAddress) {
        throw new Error('No se ha seleccionado una dirección válida');
      }

      console.log('📍 Selected address object:', selectedAddress);

      // Obtener coordenadas de manera segura - manejar diferentes estructuras posibles
      let latitude: number;
      let longitude: number;

      if (selectedAddress.latitude !== undefined && selectedAddress.longitude !== undefined) {
        // Estructura directa según PlaceDetails type
        latitude = selectedAddress.latitude;
        longitude = selectedAddress.longitude;
      } else if (selectedAddress.geometry?.location) {
        // Estructura de Google Places API
        latitude = selectedAddress.geometry.location.lat;
        longitude = selectedAddress.geometry.location.lng;
      } else {
        throw new Error('No se pudieron obtener las coordenadas de la dirección seleccionada');
      }

      // Transformar PlaceDetails al formato esperado por el backend
      const transformedPlaceDetails = {
        placeId: selectedAddress.placeId,
        formattedAddress: selectedAddress.formattedAddress,
        name: selectedAddress.name || '',
        latitude,
        longitude,
        addressComponents: selectedAddress.addressComponents || [],
        types: selectedAddress.types || [],
      };

      // Crear dirección de envío
      const shippingAddressRequest: CreateAddressRequest = {
        nombreDireccion: formData.nombreDireccion,
        tipoDireccion: formData.tipoDireccion,
        tipo: formData.usarMismaParaFacturacion ? 'AMBOS' : 'ENVIO',
        esPredeterminada: false, // No marcar como predeterminada desde checkout
        placeDetails: transformedPlaceDetails as PlaceDetails,
        complemento: formData.complemento || undefined,
        instruccionesEntrega: formData.instruccionesEntrega || undefined,
        puntoReferencia: formData.puntoReferencia || undefined,
      };

      console.log('📤 Creando dirección de envío en checkout:', shippingAddressRequest);
      const shippingResponse = await addressesService.createAddress(shippingAddressRequest);
      console.log('✅ Dirección de envío creada:', shippingResponse);

      // Si no usa la misma dirección, crear dirección de facturación separada
      if (!formData.usarMismaParaFacturacion && selectedBillingAddress) {
        console.log('📍 Selected billing address object:', selectedBillingAddress);

        // Obtener coordenadas de la dirección de facturación de manera segura
        let billingLatitude: number;
        let billingLongitude: number;

        if (selectedBillingAddress.latitude !== undefined && selectedBillingAddress.longitude !== undefined) {
          // Estructura directa según PlaceDetails type
          billingLatitude = selectedBillingAddress.latitude;
          billingLongitude = selectedBillingAddress.longitude;
        } else if (selectedBillingAddress.geometry?.location) {
          // Estructura de Google Places API
          billingLatitude = selectedBillingAddress.geometry.location.lat;
          billingLongitude = selectedBillingAddress.geometry.location.lng;
        } else {
          throw new Error('No se pudieron obtener las coordenadas de la dirección de facturación seleccionada');
        }

        // Transformar PlaceDetails de facturación al formato esperado por el backend
        const transformedBillingPlaceDetails = {
          placeId: selectedBillingAddress.placeId,
          formattedAddress: selectedBillingAddress.formattedAddress,
          name: selectedBillingAddress.name || '',
          latitude: billingLatitude,
          longitude: billingLongitude,
          addressComponents: selectedBillingAddress.addressComponents || [],
          types: selectedBillingAddress.types || [],
        };

        const billingAddressRequest: CreateAddressRequest = {
          nombreDireccion: formData.nombreDireccionFacturacion,
          tipoDireccion: formData.tipoDireccionFacturacion,
          tipo: 'FACTURACION',
          esPredeterminada: false,
          placeDetails: transformedBillingPlaceDetails as PlaceDetails,
          complemento: formData.complementoFacturacion || undefined,
          instruccionesEntrega: formData.instruccionesEntregaFacturacion || undefined,
          puntoReferencia: formData.puntoReferenciaFacturacion || undefined,
        };

        console.log('📤 Creando dirección de facturación en checkout:', billingAddressRequest);
        const billingResponse = await addressesService.createAddress(billingAddressRequest);
        console.log('✅ Dirección de facturación creada:', billingResponse);
      }

      // Convert AddressResponse to Direccion format for compatibility
      const direccionFormat: Direccion = {
        id: shippingResponse.id,
        usuario_id: shippingResponse.usuarioId,
        email: '', // This will be filled by the backend
        linea_uno: shippingResponse.direccionFormateada,
        codigo_dane: '', // This will be filled by the backend
        ciudad: shippingResponse.ciudad || 'N/A',
        pais: 'Colombia'
      };

      onAddressAdded?.(direccionFormat);

      // Reset form
      setFormData({
        nombreDireccion: "",
        tipoDireccion: "casa",
        usarMismaParaFacturacion: true,
        complemento: "",
        instruccionesEntrega: "",
        puntoReferencia: "",
        nombreDireccionFacturacion: "",
        tipoDireccionFacturacion: "casa",
        complementoFacturacion: "",
        instruccionesEntregaFacturacion: "",
        puntoReferenciaFacturacion: "",
      });
      setSelectedAddress(null);
      setSelectedBillingAddress(null);
    } catch (error) {
      console.error("Error al agregar dirección:", error);
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      setErrors({ submit: `Error al guardar la dirección: ${errorMessage}` });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleAddressSelect = (place: PlaceDetails) => {
    console.log('✅ Dirección de envío seleccionada en checkout:', place);
    setSelectedAddress(place as ExtendedPlaceDetails);
    // Clear address error when address is selected
    if (errors.address) {
      setErrors((prev) => ({ ...prev, address: "" }));
    }
  };

  const handleBillingAddressSelect = (place: PlaceDetails) => {
    console.log('✅ Dirección de facturación seleccionada en checkout:', place);
    setSelectedBillingAddress(place as ExtendedPlaceDetails);
    // Clear billing address error when address is selected
    if (errors.billingAddress) {
      setErrors((prev) => ({ ...prev, billingAddress: "" }));
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const usarMisma = e.target.checked;
    setFormData((prev) => ({ ...prev, usarMismaParaFacturacion: usarMisma }));

    // Si cambia a usar la misma dirección, limpiar datos de facturación
    if (usarMisma) {
      setSelectedBillingAddress(null);
      setFormData((prev) => ({
        ...prev,
        nombreDireccionFacturacion: "",
        tipoDireccionFacturacion: "casa",
        complementoFacturacion: "",
        instruccionesEntregaFacturacion: "",
        puntoReferenciaFacturacion: "",
      }));
      // Limpiar errores de facturación
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.billingAddress;
        delete newErrors.nombreDireccionFacturacion;
        return newErrors;
      });
    }
  };

  const formContent = (
    <form onSubmit={handleSubmit} className="space-y-4">
        {/* Sección de dirección de envío */}
        <div className="space-y-4">
          <h5 className="text-sm font-semibold text-gray-900 border-b border-gray-200 pb-1">
            Dirección de Envío
          </h5>

          {/* Campos básicos para envío */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="nombreDireccion" className="block text-sm font-medium text-gray-700 mb-1">
                Nombre de la dirección *
              </label>
              <input
                id="nombreDireccion"
                type="text"
                value={formData.nombreDireccion}
                onChange={(e) => handleInputChange("nombreDireccion", e.target.value)}
                placeholder="ej: Casa, Oficina, Casa de mamá"
                className={`w-full px-3 py-2 border rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                  errors.nombreDireccion ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.nombreDireccion && (
                <p className="text-red-500 text-xs mt-1">{errors.nombreDireccion}</p>
              )}
            </div>

            <div>
              <label htmlFor="tipoDireccion" className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de dirección
              </label>
              <select
                id="tipoDireccion"
                value={formData.tipoDireccion}
                onChange={(e) => handleInputChange("tipoDireccion", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              >
                <option value="casa">Casa</option>
                <option value="apartamento">Apartamento</option>
                <option value="oficina">Oficina</option>
                <option value="otro">Otro</option>
              </select>
            </div>
          </div>

          {/* Autocompletado de dirección de envío */}
          <div>
            <label htmlFor="direccionEnvio" className="block text-sm font-medium text-gray-700 mb-1">
              Dirección de envío *
            </label>
            <AddressAutocomplete
              addressType="shipping"
              placeholder="ej: Calle 80 # 15-25, Bogotá)"
              onPlaceSelect={handleAddressSelect}
            />
            {errors.address && (
              <p className="text-red-500 text-xs mt-1">{errors.address}</p>
            )}
          </div>
        </div>

        {/* Campos adicionales para dirección de envío */}
        <div className="space-y-4">
          <div>
            <label htmlFor="complemento" className="block text-sm font-medium text-gray-700 mb-1">
              Complemento (Opcional)
            </label>
            <input
              id="complemento"
              type="text"
              value={formData.complemento}
              onChange={(e) => handleInputChange("complemento", e.target.value)}
              placeholder="ej: Apartamento 301, Torre B, Piso 2"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>

          <div>
            <label htmlFor="instruccionesEntrega" className="block text-sm font-medium text-gray-700 mb-1">
              Instrucciones de entrega (Opcional)
            </label>
            <textarea
              id="instruccionesEntrega"
              value={formData.instruccionesEntrega}
              onChange={(e) => handleInputChange("instruccionesEntrega", e.target.value)}
              placeholder="ej: Portería 24 horas, llamar al celular al llegar"
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>

          <div>
            <label htmlFor="puntoReferencia" className="block text-sm font-medium text-gray-700 mb-1">
              Punto de referencia (Opcional)
            </label>
            <input
              id="puntoReferencia"
              type="text"
              value={formData.puntoReferencia}
              onChange={(e) => handleInputChange("puntoReferencia", e.target.value)}
              placeholder="ej: Frente al Centro Comercial Andino"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>


        {/* Checkbox para usar misma dirección para facturación */}
        <div className="border-t border-gray-200 pt-4">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={formData.usarMismaParaFacturacion}
              onChange={handleCheckboxChange}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm font-medium text-gray-700">
              Usar esta misma dirección para facturación
            </span>
          </label>
        </div>
        </div>

        {/* Sección de dirección de facturación (se muestra solo si no usa la misma) */}
        {!formData.usarMismaParaFacturacion && (
          <div className="space-y-4 border-t border-gray-200 pt-4">
            <h5 className="text-sm font-semibold text-gray-900 border-b border-gray-200 pb-1">
              Dirección de Facturación
            </h5>

            {/* Campos básicos para facturación */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="nombreDireccionFacturacion" className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre de la dirección *
                </label>
                <input
                  id="nombreDireccionFacturacion"
                  type="text"
                  value={formData.nombreDireccionFacturacion}
                  onChange={(e) => handleInputChange("nombreDireccionFacturacion", e.target.value)}
                  placeholder="ej: Oficina, Empresa, Otro"
                  className={`w-full px-3 py-2 border rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                    errors.nombreDireccionFacturacion ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.nombreDireccionFacturacion && (
                  <p className="text-red-500 text-xs mt-1">{errors.nombreDireccionFacturacion}</p>
                )}
              </div>

              <div>
                <label htmlFor="tipoDireccionFacturacion" className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo de dirección
                </label>
                <select
                  id="tipoDireccionFacturacion"
                  value={formData.tipoDireccionFacturacion}
                  onChange={(e) => handleInputChange("tipoDireccionFacturacion", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                >
                  <option value="casa">Casa</option>
                  <option value="apartamento">Apartamento</option>
                  <option value="oficina">Oficina</option>
                  <option value="otro">Otro</option>
                </select>
              </div>
            </div>

            {/* Autocompletado de dirección de facturación */}
            <div>
              <label htmlFor="direccionFacturacion" className="block text-sm font-medium text-gray-700 mb-1">
                Dirección de facturación *
              </label>
              <AddressAutocomplete
                addressType="billing"
                placeholder="Busca tu dirección de facturación (ej: Calle 80 # 15-25, Bogotá)"
                onPlaceSelect={handleBillingAddressSelect}
              />
              {errors.billingAddress && (
                <p className="text-red-500 text-xs mt-1">{errors.billingAddress}</p>
              )}
            </div>

            {/* Campos adicionales para facturación */}
            <div className="space-y-4">
              <div>
                <label htmlFor="complementoFacturacion" className="block text-sm font-medium text-gray-700 mb-1">
                  Complemento (Opcional)
                </label>
                <input
                  id="complementoFacturacion"
                  type="text"
                  value={formData.complementoFacturacion}
                  onChange={(e) => handleInputChange("complementoFacturacion", e.target.value)}
                  placeholder="ej: Apartamento 301, Torre B, Piso 2"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
              </div>

              <div>
                <label htmlFor="instruccionesEntregaFacturacion" className="block text-sm font-medium text-gray-700 mb-1">
                  Instrucciones de entrega (Opcional)
                </label>
                <textarea
                  id="instruccionesEntregaFacturacion"
                  value={formData.instruccionesEntregaFacturacion}
                  onChange={(e) => handleInputChange("instruccionesEntregaFacturacion", e.target.value)}
                  placeholder="ej: Horario de oficina, llamar antes de llegar"
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
              </div>

              <div>
                <label htmlFor="puntoReferenciaFacturacion" className="block text-sm font-medium text-gray-700 mb-1">
                  Punto de referencia (Opcional)
                </label>
                <input
                  id="puntoReferenciaFacturacion"
                  type="text"
                  value={formData.puntoReferenciaFacturacion}
                  onChange={(e) => handleInputChange("puntoReferenciaFacturacion", e.target.value)}
                  placeholder="ej: Edificio azul, junto al semáforo"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
              </div>
            </div>
          </div>
        )}

        {/* Mapas 3D */}
        {selectedAddress && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ubicación de dirección de envío en el mapa
              </label>
              <AddressMap3D
                address={selectedAddress}
                height="200px"
                enable3D={true}
                showControls={false}
              />
            </div>

            {/* Mapa de dirección de facturación si es diferente */}
            {!formData.usarMismaParaFacturacion && selectedBillingAddress && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ubicación de dirección de facturación en el mapa
                </label>
                <AddressMap3D
                  address={selectedBillingAddress}
                  height="200px"
                  enable3D={true}
                  showControls={false}
                />
              </div>
            )}
          </div>
        )}

        {/* Errores generales */}
        {errors.submit && (
          <div className="bg-red-50 border border-red-200 rounded-md p-3">
            <p className="text-red-500 text-sm">{errors.submit}</p>
          </div>
        )}

        {/* Botones */}
        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={
              isLoading ||
              !selectedAddress ||
              (!formData.usarMismaParaFacturacion && !selectedBillingAddress)
            }
            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Guardando...
              </span>
            ) : (
              "Agregar dirección"
            )}
          </button>

          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-gray-600 text-sm font-medium hover:text-gray-800 transition"
            >
              Cancelar
            </button>
          )}
        </div>
      </form>
  );

  return withContainer ? (
    <div className="p-4 rounded-lg border border-gray-200 shadow-lg bg-white w-full max-w-3xl">
      {formContent}
    </div>
  ) : (
    formContent
  );
}
