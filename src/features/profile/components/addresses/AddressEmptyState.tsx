/**
 * @module AddressEmptyState
 * @description Empty state for addresses page
 */

import React from 'react';
import { MapPin, Plus } from 'lucide-react';
import Button from '@/components/Button';

interface AddressEmptyStateProps {
  onAddAddress: () => void;
}

export const AddressEmptyState: React.FC<AddressEmptyStateProps> = ({ onAddAddress }) => (
  <div className="bg-white rounded-2xl border-2 border-gray-100 p-12 text-center">
    <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
      <MapPin className="w-10 h-10 text-gray-400" strokeWidth={1.5} />
    </div>
    <h3 className="text-2xl font-bold text-gray-900 mb-3">No tienes direcciones</h3>
    <p className="text-gray-600 mb-8 max-w-md mx-auto">
      Agrega una dirección para que tus pedidos lleguen a donde quieras
    </p>
    <Button
      variant="primary"
      onClick={onAddAddress}
      className="font-bold px-8 bg-black hover:bg-gray-800"
    >
      <Plus className="w-5 h-5 mr-2" />
      Agregar Primera Dirección
    </Button>
  </div>
);

AddressEmptyState.displayName = 'AddressEmptyState';

export default AddressEmptyState;
