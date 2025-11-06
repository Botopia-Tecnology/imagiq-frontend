"use client";
import AddNewAddressForm from "@/app/carrito/components/AddNewAddressForm";
import { Direccion } from "@/types/user";
import { useState } from "react";

interface AddressStepProps {
  onAddressAdded?: (address: Direccion) => void;
}

export function AddressStep({ onAddressAdded }: AddressStepProps) {
  const [addressAdded, setAddressAdded] = useState(false);

  const handleAddressAdded = (address: Direccion) => {
    setAddressAdded(true);
    onAddressAdded?.(address);
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
