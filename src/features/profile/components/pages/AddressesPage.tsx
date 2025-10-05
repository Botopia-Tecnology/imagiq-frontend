/**
 * @module AddressesPage
 * @description Elegant addresses management page
 * Following Single Responsibility Principle - handles address CRUD operations
 */

import React, { useState } from 'react';
import { Plus, MapPin, Home, Building, Star, Edit, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import Button from '@/components/Button';
import { useProfile } from '../../hooks/useProfile';
import PageHeader from '../layouts/PageHeader';
import { ProfileAddress } from '../../types';

interface AddressesPageProps {
  onBack?: () => void;
  className?: string;
}

const AddressTypeIcon = ({ type }: { type: string }) => {
  switch (type) {
    case 'home':
      return <Home className="w-5 h-5 text-blue-600" />;
    case 'work':
      return <Building className="w-5 h-5 text-green-600" />;
    default:
      return <MapPin className="w-5 h-5 text-gray-600" />;
  }
};

const AddressCard: React.FC<{
  address: ProfileAddress;
  onEdit: (address: ProfileAddress) => void;
  onDelete: (addressId: string) => void;
  onSetDefault: (addressId: string) => void;
}> = ({ address, onEdit, onDelete, onSetDefault }) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          {/* Header */}
          <div className="flex items-center gap-2 mb-2">
            <AddressTypeIcon type={address.type} />
            <h3 className="font-semibold text-gray-900">
              {address.alias}
            </h3>
            {address.isDefault && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                <Star className="w-3 h-3" />
                Por defecto
              </span>
            )}
          </div>

          {/* Address Details */}
          <div className="text-gray-600 text-sm space-y-1">
            <p className="font-medium">{address.name}</p>
            <p>{address.addressLine1}</p>
            {address.addressLine2 && <p>{address.addressLine2}</p>}
            <p>{address.city}, {address.state} {address.zipCode}</p>
            <p>{address.country}</p>
            {address.instructions && (
              <p className="text-gray-500 italic mt-2">
                Instrucciones: {address.instructions}
              </p>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2 ml-4">
          <button
            onClick={() => onEdit(address)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(address.id)}
            className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Set as Default Button */}
      {!address.isDefault && (
        <div className="mt-4 pt-3 border-t border-gray-100">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onSetDefault(address.id)}
            className="text-sm"
          >
            Establecer como predeterminada
          </Button>
        </div>
      )}
    </div>
  );
};

const EmptyState: React.FC<{ onAddAddress: () => void }> = ({ onAddAddress }) => (
  <div className="bg-white rounded-lg p-8 text-center">
    <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
      <MapPin className="w-8 h-8 text-gray-400" />
    </div>
    <h3 className="text-lg font-medium text-gray-900 mb-2">
      No tienes direcciones guardadas
    </h3>
    <p className="text-gray-500 mb-6 max-w-sm mx-auto">
      Agrega una dirección para que tus pedidos lleguen a donde quieras
    </p>
    <Button variant="primary" onClick={onAddAddress}>
      <Plus className="w-4 h-4 mr-2" />
      Agregar Primera Dirección
    </Button>
  </div>
);

export const AddressesPage: React.FC<AddressesPageProps> = ({
  onBack,
  className
}) => {
  const { state } = useProfile();
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'home' | 'work' | 'other'>('all');

  // Filter addresses
  const filteredAddresses = selectedFilter === 'all'
    ? state.addresses
    : state.addresses.filter(addr => addr.type === selectedFilter);

  const addressCounts = {
    all: state.addresses.length,
    home: state.addresses.filter(a => a.type === 'home').length,
    work: state.addresses.filter(a => a.type === 'work').length,
    other: state.addresses.filter(a => a.type === 'other').length
  };

  const handleAddAddress = () => {
    console.log('Add new address');
    // TODO: Open add address modal/form
  };

  const handleEditAddress = (address: ProfileAddress) => {
    console.log('Edit address:', address.id);
    // TODO: Open edit address modal/form
  };

  const handleDeleteAddress = (addressId: string) => {
    console.log('Delete address:', addressId);
    // TODO: Implement delete confirmation and API call
  };

  const handleSetDefaultAddress = (addressId: string) => {
    console.log('Set default address:', addressId);
    // TODO: Implement set default API call
  };

  const filters = [
    { value: 'all' as const, label: 'Todas', count: addressCounts.all, icon: MapPin },
    { value: 'home' as const, label: 'Casa', count: addressCounts.home, icon: Home },
    { value: 'work' as const, label: 'Trabajo', count: addressCounts.work, icon: Building },
    { value: 'other' as const, label: 'Otras', count: addressCounts.other, icon: MapPin }
  ];

  return (
    <div className={cn('min-h-screen bg-gray-50', className)}>
      <PageHeader
        title="Mis Direcciones"
        subtitle={`${state.addresses.length} ${state.addresses.length === 1 ? 'dirección' : 'direcciones'} guardadas`}
        onBack={onBack}
        actions={
          <Button
            variant="primary"
            size="sm"
            onClick={handleAddAddress}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Agregar Dirección</span>
          </Button>
        }
      />

      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Filter Tabs */}
        {state.addresses.length > 0 && (
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex gap-2 overflow-x-auto">
              {filters.map((filter) => {
                const Icon = filter.icon;
                return (
                  <button
                    key={filter.value}
                    onClick={() => setSelectedFilter(filter.value)}
                    className={cn(
                      'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors flex-shrink-0',
                      selectedFilter === filter.value
                        ? 'bg-blue-100 text-blue-700 border border-blue-200'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    {filter.label}
                    {filter.count > 0 && (
                      <span className="bg-white px-1.5 py-0.5 rounded-full text-xs">
                        {filter.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Addresses List */}
        {filteredAddresses.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2">
            {filteredAddresses.map((address) => (
              <AddressCard
                key={address.id}
                address={address}
                onEdit={handleEditAddress}
                onDelete={handleDeleteAddress}
                onSetDefault={handleSetDefaultAddress}
              />
            ))}
          </div>
        ) : state.addresses.length === 0 ? (
          <EmptyState onAddAddress={handleAddAddress} />
        ) : (
          <div className="bg-white rounded-lg p-8 text-center">
            <MapPin className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No hay direcciones en esta categoría
            </h3>
            <p className="text-gray-500">
              Cambia el filtro para ver otras direcciones
            </p>
          </div>
        )}

        {/* Help Text */}
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <div className="flex gap-3">
            <MapPin className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <h4 className="font-medium text-blue-900 mb-1">
                ¿Necesitas ayuda con las direcciones?
              </h4>
              <p className="text-blue-700">
                Puedes tener múltiples direcciones y elegir una como predeterminada.
                Las direcciones se verifican automáticamente para asegurar entregas exitosas.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

AddressesPage.displayName = 'AddressesPage';

export default AddressesPage;