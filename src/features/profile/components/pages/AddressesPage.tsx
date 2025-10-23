import React, { useState } from "react";
import { ArrowLeft, Plus } from "lucide-react";
import { useProfile } from "../../hooks/useProfile";
import AddressCard from "../addresses/AddressCard";

interface AddressesPageProps {
  onBack: () => void;
  className?: string;
}

const AddressesPage: React.FC<AddressesPageProps> = ({ onBack }) => {
  const { state } = useProfile();
  const [selectedFilter, setSelectedFilter] = useState<
    "all" | "home" | "work" | "other"
  >("all");

  // Obtener direcciones del usuario
  const addresses = state.user?.direcciones || [];

  // Filtrar direcciones
  const filteredAddresses = addresses.filter((addr) => {
    if (selectedFilter === "all") return true;

    const tipo = addr.tipo?.toUpperCase();
    if (selectedFilter === "home") return tipo === "CASA" || tipo === "AMBOS";
    if (selectedFilter === "work")
      return tipo === "TRABAJO" || tipo === "AMBOS";
    if (selectedFilter === "other")
      return tipo !== "CASA" && tipo !== "TRABAJO" && tipo !== "AMBOS";

    return true;
  });

  // Contar direcciones por tipo
  const counts = {
    all: addresses.length,
    home: addresses.filter(
      (a) =>
        a.tipo?.toUpperCase() === "CASA" || a.tipo?.toUpperCase() === "AMBOS"
    ).length,
    work: addresses.filter(
      (a) =>
        a.tipo?.toUpperCase() === "TRABAJO" || a.tipo?.toUpperCase() === "AMBOS"
    ).length,
    other: addresses.filter((a) => {
      const tipo = a.tipo?.toUpperCase();
      return tipo !== "CASA" && tipo !== "TRABAJO" && tipo !== "AMBOS";
    }).length,
  };

  const handleAddAddress = () => {
    console.log("Agregar dirección");
    // TODO: Implementar modal/navegación para agregar dirección
  };

  const handleEditAddress = (id: string) => {
    console.log("Editar dirección:", id);
    // TODO: Implementar edición
  };

  const handleDeleteAddress = (id: string) => {
    console.log("Eliminar dirección:", id);
    // TODO: Implementar eliminación
  };

  const handleSetDefault = (id: string) => {
    console.log("Establecer como predeterminada:", id);
    // TODO: Implementar cambio de dirección predeterminada
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b-2 border-gray-100 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={onBack}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Mis Direcciones
                </h1>
                <p className="text-sm text-gray-600">
                  {addresses.length} direcciones
                </p>
              </div>
            </div>
            <button
              onClick={handleAddAddress}
              className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-semibold"
            >
              <Plus className="w-5 h-5" />
              Agregar
            </button>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex gap-2 overflow-x-auto">
            <button
              onClick={() => setSelectedFilter("all")}
              className={`px-4 py-2 rounded-full font-semibold whitespace-nowrap transition-colors ${
                selectedFilter === "all"
                  ? "bg-black text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Todas{" "}
              {counts.all > 0 && <span className="ml-1">({counts.all})</span>}
            </button>
            <button
              onClick={() => setSelectedFilter("home")}
              className={`px-4 py-2 rounded-full font-semibold whitespace-nowrap transition-colors ${
                selectedFilter === "home"
                  ? "bg-black text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Casa{" "}
              {counts.home > 0 && <span className="ml-1">({counts.home})</span>}
            </button>
            <button
              onClick={() => setSelectedFilter("work")}
              className={`px-4 py-2 rounded-full font-semibold whitespace-nowrap transition-colors ${
                selectedFilter === "work"
                  ? "bg-black text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Trabajo{" "}
              {counts.work > 0 && <span className="ml-1">({counts.work})</span>}
            </button>
            <button
              onClick={() => setSelectedFilter("other")}
              className={`px-4 py-2 rounded-full font-semibold whitespace-nowrap transition-colors ${
                selectedFilter === "other"
                  ? "bg-black text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Otras{" "}
              {counts.other > 0 && (
                <span className="ml-1">({counts.other})</span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Lista de direcciones */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        {filteredAddresses.length === 0 ? (
          <div className="bg-white rounded-2xl border-2 border-gray-200 p-12 text-center">
            <p className="text-gray-500 mb-4">
              No tienes direcciones en esta categoría
            </p>
            <button
              onClick={handleAddAddress}
              className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-semibold"
            >
              Agregar dirección
            </button>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredAddresses.map((address) => (
              <AddressCard
                key={address.id}
                address={address}
                onEdit={handleEditAddress}
                onDelete={handleDeleteAddress}
                onSetDefault={handleSetDefault}
              />
            ))}
          </div>
        )}
      </div>

      {/* Info al final */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center flex-shrink-0">
              {/* Location icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5z"
                />
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-1">
                Acerca de tus direcciones
              </h3>
              <p className="text-xs text-gray-600">
                Puedes tener múltiples direcciones y elegir una como
                predeterminada. Las direcciones se verifican automáticamente
                para asegurar entregas exitosas.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddressesPage;
