/**
 * @module AddressCard
 * @description Individual address card component
 */

import React from "react";
import { Edit, Trash2, Check, Home, Building, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import Button from "@/components/Button";
import { ProfileAddress } from "../../types";

interface AddressCardProps {
  address: ProfileAddress;
  onEdit: (address: ProfileAddress) => void;
  onDelete: (addressId: string) => void;
  onSetDefault: (addressId: string) => void;
}

const AddressTypeIcon = ({ type }: { type: string }): React.ReactElement => {
  switch (type) {
    case "home":
      return <Home className="w-6 h-6 text-gray-900" strokeWidth={1.5} />;
    case "work":
      return <Building className="w-6 h-6 text-gray-900" strokeWidth={1.5} />;
    default:
      return <MapPin className="w-6 h-6 text-gray-900" strokeWidth={1.5} />;
  }
};

export const AddressCard: React.FC<AddressCardProps> = ({
  address,
  onEdit,
  onDelete,
  onSetDefault,
}) => {
  return (
    <div
      className={cn(
        "bg-white rounded-2xl border-2 p-6 md:p-8 transition-all",
        address.isDefault
          ? "border-black"
          : "border-gray-200 hover:border-gray-400"
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-3">
          <AddressTypeIcon type={address.type} />
          <div>
            <h3 className="text-xl font-bold text-gray-900">{address.alias}</h3>
            {address.isDefault && (
              <div className="flex items-center gap-1 mt-1">
                <Check className="w-4 h-4 text-gray-900" strokeWidth={2.5} />
                <span className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                  Predeterminada
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(address)}
            className="p-3 rounded-lg border-2 border-gray-200 hover:border-black hover:bg-black hover:text-white transition-colors"
            aria-label="Editar dirección"
          >
            <Edit className="w-5 h-5" strokeWidth={1.5} />
          </button>
          {!address.isDefault && (
            <button
              onClick={() => onDelete(address.id)}
              className="p-3 rounded-lg border-2 border-red-200 text-red-600 hover:border-red-600 hover:bg-red-600 hover:text-white transition-colors"
              aria-label="Eliminar dirección"
            >
              <Trash2 className="w-5 h-5" strokeWidth={1.5} />
            </button>
          )}
        </div>
      </div>

      {/* Address Details */}
      <div className="space-y-2 mb-6">
        <p className="text-base font-bold text-gray-900">{address.name}</p>
        <p className="text-base text-gray-600">{address.addressLine1}</p>
        {address.addressLine2 && (
          <p className="text-base text-gray-600">{address.addressLine2}</p>
        )}
        <p className="text-base text-gray-600">
          {address.city}, {address.state} {address.zipCode}
        </p>
        <p className="text-base text-gray-600">{address.country}</p>
        {address.instructions && (
          <div className="mt-4 pt-4 border-t-2 border-gray-100">
            <p className="text-sm font-bold text-gray-900 mb-1 uppercase tracking-wider">
              Instrucciones
            </p>
            <p className="text-sm text-gray-600">{address.instructions}</p>
          </div>
        )}
      </div>

      {/* Set as Default Button */}
      {!address.isDefault && (
        <div className="pt-4 border-t-2 border-gray-100">
          <Button
            variant="outline"
            size="md"
            onClick={() => onSetDefault(address.id)}
            className="w-full font-bold border-2 border-black hover:bg-black hover:text-white transition-colors"
          >
            Establecer como Predeterminada
          </Button>
        </div>
      )}
    </div>
  );
};

AddressCard.displayName = "AddressCard";

export default AddressCard;
