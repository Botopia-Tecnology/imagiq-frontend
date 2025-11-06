"use client";
import AddNewAddressForm from "@/app/carrito/components/AddNewAddressForm";
import { Direccion } from "@/types/user";
import type { Address } from "@/types/address";
import { useState } from "react";

interface AddressStepProps {
  onAddressAdded?: (address: Direccion) => void;
}

/**
 * Helper para convertir Address a Direccion (legacy)
 */
const addressToDireccion = (address: Address): Direccion => {
  return {
    id: address.id,
    usuario_id: address.usuarioId,
    email: '',
    linea_uno: address.direccionFormateada,
    codigo_dane: '',
    ciudad: address.ciudad || '',
    pais: address.pais,
  };
};

export function AddressStep({ onAddressAdded }: AddressStepProps) {
  const [addressAdded, setAddressAdded] = useState(false);

  const handleAddressAdded = (address: Address) => {
    setAddressAdded(true);
    // Convertir Address a Direccion para mantener compatibilidad
    const direccion = addressToDireccion(address);
    onAddressAdded?.(direccion);
  };

  return (
    <div className="space-y-4">
      {addressAdded && (
        <p className="text-sm text-green-600">
          Dirección agregada exitosamente. Puedes continuar o agregar otra.
        </p>
      )}

      <AddNewAddressForm
        onAddressAdded={handleAddressAdded}
        withContainer={false}
      />
    </div>
  );
}
