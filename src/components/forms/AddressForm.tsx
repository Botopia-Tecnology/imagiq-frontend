/**
 * Componente de formulario de direcciones
 * - Formulario para dirección de envío
 * - Opción para usar la misma dirección de facturación
 * - Formulario separado para dirección de facturación si es diferente
 * - Validación automática de campos requeridos
 */

"use client";

import { RegistrationAddress } from "@/types/registration";
import { MapPin, Home, Building } from "lucide-react";

interface AddressFormProps {
  shippingAddress: RegistrationAddress;
  billingAddress?: RegistrationAddress;
  useSameForBilling: boolean;
  onChange: (data: {
    shippingAddress: RegistrationAddress;
    billingAddress?: RegistrationAddress;
    useSameForBilling: boolean;
  }) => void;
  errors: Record<string, string>;
  disabled?: boolean;
}

export default function AddressForm({
  shippingAddress,
  billingAddress,
  useSameForBilling,
  onChange,
  errors,
  disabled = false
}: AddressFormProps) {

  const handleShippingChange = (field: keyof RegistrationAddress, value: string) => {
    const updated = { ...shippingAddress, [field]: value };
    onChange({
      shippingAddress: updated,
      billingAddress: useSameForBilling ? undefined : billingAddress,
      useSameForBilling
    });
  };

  const handleBillingChange = (field: keyof RegistrationAddress, value: string) => {
    if (useSameForBilling) return; // No debería suceder, pero por seguridad

    const updated = { ...billingAddress, [field]: value } as RegistrationAddress;
    onChange({
      shippingAddress,
      billingAddress: updated,
      useSameForBilling
    });
  };

  const toggleSameForBilling = () => {
    const newUseSame = !useSameForBilling;
    onChange({
      shippingAddress,
      billingAddress: newUseSame ? undefined : {
        type: 'home',
        name: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'Colombia',
        isDefault: false
      },
      useSameForBilling: newUseSame
    });
  };

  const renderAddressFields = (
    address: RegistrationAddress,
    onFieldChange: (field: keyof RegistrationAddress, value: string) => void,
    prefix: string,
    title: string,
    icon: React.ReactNode
  ) => (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        {icon}
        <h3 className="text-lg font-semibold text-[#002142]">{title}</h3>
      </div>

      {/* Nombre para la dirección */}
      <div>
        <label className="block text-sm font-medium text-[#002142] mb-1">
          Nombre de la dirección
        </label>
        <input
          type="text"
          value={address.name}
          onChange={(e) => onFieldChange('name', e.target.value)}
          placeholder="Ej: Casa, Oficina, Apartamento"
          disabled={disabled}
          className={`w-full px-3 py-2 border-2 rounded-lg text-[#002142] placeholder-[#bdbdbd] focus:outline-none focus:ring-2 focus:ring-[#002142] bg-[#f7fafd] transition-all duration-200 ${
            errors[`${prefix}Name`] ? "border-red-400" : "border-[#e5e5e5]"
          }`}
        />
        {errors[`${prefix}Name`] && (
          <p className="text-red-500 text-xs mt-1">{errors[`${prefix}Name`]}</p>
        )}
      </div>

      {/* Dirección línea 1 */}
      <div>
        <label className="block text-sm font-medium text-[#002142] mb-1">
          Dirección *
        </label>
        <input
          type="text"
          value={address.addressLine1}
          onChange={(e) => onFieldChange('addressLine1', e.target.value)}
          placeholder="Calle, carrera, número"
          disabled={disabled}
          className={`w-full px-3 py-2 border-2 rounded-lg text-[#002142] placeholder-[#bdbdbd] focus:outline-none focus:ring-2 focus:ring-[#002142] bg-[#f7fafd] transition-all duration-200 ${
            errors[`${prefix}AddressLine1`] ? "border-red-400" : "border-[#e5e5e5]"
          }`}
        />
        {errors[`${prefix}AddressLine1`] && (
          <p className="text-red-500 text-xs mt-1">{errors[`${prefix}AddressLine1`]}</p>
        )}
      </div>

      {/* Dirección línea 2 (opcional) */}
      <div>
        <label className="block text-sm font-medium text-[#002142] mb-1">
          Complemento
        </label>
        <input
          type="text"
          value={address.addressLine2 || ''}
          onChange={(e) => onFieldChange('addressLine2', e.target.value)}
          placeholder="Apartamento, casa, piso (opcional)"
          disabled={disabled}
          className="w-full px-3 py-2 border-2 border-[#e5e5e5] rounded-lg text-[#002142] placeholder-[#bdbdbd] focus:outline-none focus:ring-2 focus:ring-[#002142] bg-[#f7fafd] transition-all duration-200"
        />
      </div>

      {/* Ciudad y Departamento */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-[#002142] mb-1">
            Ciudad *
          </label>
          <input
            type="text"
            value={address.city}
            onChange={(e) => onFieldChange('city', e.target.value)}
            placeholder="Bogotá, Medellín..."
            disabled={disabled}
            className={`w-full px-3 py-2 border-2 rounded-lg text-[#002142] placeholder-[#bdbdbd] focus:outline-none focus:ring-2 focus:ring-[#002142] bg-[#f7fafd] transition-all duration-200 ${
              errors[`${prefix}City`] ? "border-red-400" : "border-[#e5e5e5]"
            }`}
          />
          {errors[`${prefix}City`] && (
            <p className="text-red-500 text-xs mt-1">{errors[`${prefix}City`]}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-[#002142] mb-1">
            Departamento *
          </label>
          <input
            type="text"
            value={address.state}
            onChange={(e) => onFieldChange('state', e.target.value)}
            placeholder="Cundinamarca, Antioquia..."
            disabled={disabled}
            className={`w-full px-3 py-2 border-2 rounded-lg text-[#002142] placeholder-[#bdbdbd] focus:outline-none focus:ring-2 focus:ring-[#002142] bg-[#f7fafd] transition-all duration-200 ${
              errors[`${prefix}State`] ? "border-red-400" : "border-[#e5e5e5]"
            }`}
          />
          {errors[`${prefix}State`] && (
            <p className="text-red-500 text-xs mt-1">{errors[`${prefix}State`]}</p>
          )}
        </div>
      </div>

      {/* Código postal */}
      <div>
        <label className="block text-sm font-medium text-[#002142] mb-1">
          Código postal *
        </label>
        <input
          type="text"
          value={address.zipCode}
          onChange={(e) => onFieldChange('zipCode', e.target.value)}
          placeholder="110111"
          disabled={disabled}
          className={`w-full px-3 py-2 border-2 rounded-lg text-[#002142] placeholder-[#bdbdbd] focus:outline-none focus:ring-2 focus:ring-[#002142] bg-[#f7fafd] transition-all duration-200 ${
            errors[`${prefix}ZipCode`] ? "border-red-400" : "border-[#e5e5e5]"
          }`}
        />
        {errors[`${prefix}ZipCode`] && (
          <p className="text-red-500 text-xs mt-1">{errors[`${prefix}ZipCode`]}</p>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Dirección de envío */}
      {renderAddressFields(
        shippingAddress,
        handleShippingChange,
        'shipping',
        'Dirección de envío',
        <Home className="w-5 h-5 text-[#002142]" />
      )}

      {/* Toggle para dirección de facturación */}
      <div className="border-t border-[#e5e5e5] pt-6">
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="sameForBilling"
            checked={useSameForBilling}
            onChange={toggleSameForBilling}
            disabled={disabled}
            className="w-4 h-4 text-[#002142] border-[#e5e5e5] rounded focus:ring-[#002142] focus:ring-2"
          />
          <label htmlFor="sameForBilling" className="text-sm font-medium text-[#002142] cursor-pointer">
            Usar la misma dirección para facturación
          </label>
        </div>
      </div>

      {/* Dirección de facturación (si es diferente) */}
      {!useSameForBilling && billingAddress && (
        <div className="border-t border-[#e5e5e5] pt-6">
          {renderAddressFields(
            billingAddress,
            handleBillingChange,
            'billing',
            'Dirección de facturación',
            <Building className="w-5 h-5 text-[#002142]" />
          )}
        </div>
      )}
    </div>
  );
}