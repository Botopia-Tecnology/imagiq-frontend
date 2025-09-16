import React, { useEffect, useState } from "react";
import { Direccion } from "@/types/user";
import AddNewAddressForm from "./AddNewAddressForm";

interface AddressSelectorProps {
  address: Direccion | null;
  addresses: Direccion[];
  addressEdit: boolean;
  onAddressChange: (address: Direccion) => void;
  onEditToggle: (edit: boolean) => void;
  onAddressAdded?: (userIdentifier: string) => void;
}

export const AddressSelector: React.FC<AddressSelectorProps> = ({
  address,
  addresses,
  addressEdit,
  onAddressChange,
  onEditToggle,
  onAddressAdded,
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [userIdentifier, setUserIdentifier] = useState<string>("");

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("imagiq_user") || "{}");
    if (userInfo && (userInfo.id || userInfo.email)) {
      setUserIdentifier(userInfo.id || userInfo.email);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddressChange(address!)
    onEditToggle(false);
    setShowAddForm(false);
  };

  const handleAddressAdded = (newAddress: Direccion) => {
    onAddressAdded?.(userIdentifier);
    onAddressChange(newAddress);
    setShowAddForm(false);
    onEditToggle(false);
  };

  return (
    <div className="ml-8 mt-2">
      {!addressEdit ? (
        <div className="flex items-center gap-2">
          <span className="text-gray-700 text-sm">
            {address
              ? `${address.linea_uno}, ${address.ciudad}`
              : "No hay dirección seleccionada"}
          </span>
          <button
            type="button"
            className="text-blue-600 text-xs underline ml-2 hover:text-blue-800 transition"
            onClick={() => onEditToggle(true)}
          >
            Modificar domicilio o elegir otro
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <form
            className="flex flex-col gap-3 items-start"
            onSubmit={handleSubmit}
          >
            {addresses.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-900">
                  Direcciones guardadas:
                </h4>
                {addresses.map((ad, i) => (
                  <label
                    key={ad.id || i}
                    className="flex items-center gap-3 text-sm p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition"
                  >
                    <input
                      type="radio"
                      name="address"
                      checked={address === ad}
                      onChange={() => onAddressChange(ad)}
                      className="accent-blue-600 h-4 w-4"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">
                        {ad.linea_uno}
                      </div>
                      <div className="text-gray-600 text-xs">
                        {ad.ciudad}, {ad.pais}
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            )}

            <button
              type="button"
              onClick={() => setShowAddForm(!showAddForm)}
              className="text-blue-600 text-sm font-medium hover:text-blue-800 transition flex items-center gap-1"
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
                : "Añadir una nueva dirección"}
            </button>

            <div className="flex gap-2 mt-4">
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition"
              >
                Guardar selección
              </button>
              <button
                type="button"
                className="text-gray-500 text-sm px-4 py-2 hover:text-gray-700 transition"
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
            <div className="mt-4">
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
