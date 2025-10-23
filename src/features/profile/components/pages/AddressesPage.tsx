/**
 * @module AddressesPage
 * @description Samsung-style addresses page - clean and minimal
 */

import React, { useState, useMemo } from "react";
import { Plus, MapPin, Home, Building } from "lucide-react";
import { cn } from "@/lib/utils";
import Button from "@/components/Button";
import { useProfile } from "../../hooks/useProfile";
import PageHeader from "../layouts/PageHeader";
import { ProfileAddress } from "../../types";
import AddressCard from "../addresses/AddressCard";
import AddressEmptyState from "../addresses/AddressEmptyState";
import AddressFilters from "../addresses/AddressFilters";

interface AddressesPageProps {
  onBack?: () => void;
  className?: string;
}

type AddressType = "home" | "work" | "other";
type FilterValue = "all" | AddressType;

interface FilterOption {
  value: FilterValue;
  label: string;
  count: number;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
}

export const AddressesPage: React.FC<AddressesPageProps> = ({
  onBack,
  className,
}) => {
  const { state } = useProfile();
  const [selectedFilter, setSelectedFilter] = useState<FilterValue>("all");

  // Debug: Ver qué datos tiene state.addresses
  console.log('📍 [AddressesPage] state.addresses:', state.addresses);

  // Memoized address counts
  const addressCounts = useMemo(
    () => ({
      all: state.addresses.length,
      home: state.addresses.filter((a) => a.type === "home").length,
      work: state.addresses.filter((a) => a.type === "work").length,
      other: state.addresses.filter((a) => a.type === "other").length,
    }),
    [state.addresses]
  );

  // Memoized filtered addresses
  const filteredAddresses = useMemo(() => {
    return selectedFilter === "all"
      ? state.addresses
      : state.addresses.filter((addr) => addr.type === selectedFilter);
  }, [state.addresses, selectedFilter]);

  const handleAddAddress = (): void => {
    console.log("Add new address");
    // NOTE: Placeholder - UI should open add address modal/form.
    // This is intentionally left as a stub for integration with the modal component.
  };

  const handleEditAddress = (address: ProfileAddress): void => {
    console.log("Edit address:", address.id);
    // NOTE: Placeholder - UI should open edit address modal/form for given address.
  };

  const handleDeleteAddress = (addressId: string): void => {
    console.log("Delete address:", addressId);
    // NOTE: Placeholder - implement confirmation prompt and API delete call here.
  };

  const handleSetDefaultAddress = (addressId: string): void => {
    console.log("Set default address:", addressId);
    // NOTE: Placeholder - implement set-default API call to persist preference.
  };

  const filters: FilterOption[] = [
    { value: "all", label: "Todas", count: addressCounts.all, icon: MapPin },
    { value: "home", label: "Casa", count: addressCounts.home, icon: Home },
    {
      value: "work",
      label: "Trabajo",
      count: addressCounts.work,
      icon: Building,
    },
    {
      value: "other",
      label: "Otras",
      count: addressCounts.other,
      icon: MapPin,
    },
  ];

  const showNoResultsMessage =
    filteredAddresses.length === 0 && state.addresses.length > 0;

  return (
    <div className={cn("min-h-screen bg-white", className)}>
      <PageHeader
        title="Mis Direcciones"
        subtitle={`${state.addresses.length} ${
          state.addresses.length === 1 ? "dirección" : "direcciones"
        }`}
        onBack={onBack}
        actions={
          <Button
            variant="primary"
            size="sm"
            onClick={handleAddAddress}
            className="flex items-center gap-2 font-bold bg-black hover:bg-gray-800"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Agregar</span>
          </Button>
        }
      />

      <div className="max-w-6xl mx-auto px-4 pb-8 mt-10">
        {/* Filter Tabs */}
        {state.addresses.length > 0 && (
          <AddressFilters
            selectedFilter={selectedFilter}
            onFilterChange={setSelectedFilter}
            filters={filters}
          />
        )}

        {/* Addresses Grid */}
        {(() => {
          if (filteredAddresses.length > 0) {
            return (
              <div className="grid gap-6 md:grid-cols-2">
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
            );
          }

          if (state.addresses.length === 0) {
            return <AddressEmptyState onAddAddress={handleAddAddress} />;
          }

          if (showNoResultsMessage) {
            return (
              <div className="bg-white rounded-2xl border-2 border-gray-100 p-12 text-center">
                <MapPin
                  className="w-16 h-16 mx-auto mb-4 text-gray-400"
                  strokeWidth={1.5}
                />
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  No hay direcciones en esta categoría
                </h3>
                <p className="text-gray-600">
                  Cambia el filtro para ver otras direcciones
                </p>
              </div>
            );
          }

          return null;
        })()}

        {/* Help Text */}
        {state.addresses.length > 0 && (
          <div className="mt-8 bg-gray-50 border-2 border-gray-100 rounded-2xl p-6">
            <div className="flex gap-4">
              <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center flex-shrink-0">
                <MapPin className="w-5 h-5 text-white" strokeWidth={2} />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-2">
                  Acerca de tus direcciones
                </h4>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Puedes tener múltiples direcciones y elegir una como
                  predeterminada. Las direcciones se verifican automáticamente
                  para asegurar entregas exitosas.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

AddressesPage.displayName = "AddressesPage";

export default AddressesPage;
