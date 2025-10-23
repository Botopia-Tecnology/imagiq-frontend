import React from "react";
import { Home, Building2, MapPin, Edit, Trash2, Check } from "lucide-react";
import { DBAddress } from "../../types";

interface AddressCardProps {
  address: DBAddress;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onSetDefault: (id: string) => void;
}

const AddressCard: React.FC<AddressCardProps> = ({
  address,
  onEdit,
  onDelete,
  onSetDefault,
}) => {
  // Determinar el icono según el tipo
  const getIcon = () => {
    const tipo = address.tipo?.toUpperCase();
    if (tipo === "CASA" || tipo === "AMBOS")
      return <Home className="w-5 h-5" />;
    if (tipo === "TRABAJO") return <Building2 className="w-5 h-5" />;
    return <MapPin className="w-5 h-5" />;
  };

  // Determinar el nombre del tipo
  const getTypeName = () => {
    const tipo = address.tipo?.toUpperCase();
    if (tipo === "CASA") return "Casa";
    if (tipo === "TRABAJO") return "Oficina";
    if (tipo === "AMBOS") return "Casa";
    return "Otra";
  };

  // Determinar si es predeterminada
  const isDefault = address.esPredeterminada || false;

  return (
    <div className="w-full max-w-sm bg-white rounded-2xl shadow-lg border border-gray-100 flex flex-col justify-between p-6 transition-all hover:shadow-xl relative min-h-[340px]">
      {/* Botones en la esquina superior derecha */}
      <div className="absolute top-4 right-4 flex gap-2 z-10">
        <button
          onClick={() => onEdit(address.id)}
          className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-gray-700"
          title="Editar"
        >
          <Edit className="w-4 h-4" />
        </button>
        <button
          onClick={() => onDelete(address.id)}
          className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-gray-700"
          title="Eliminar"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
      <div className="flex flex-col items-center w-full h-full justify-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-3">
          {getIcon()}
        </div>
        <h3 className="font-bold text-lg text-gray-900 mb-2 w-full text-center truncate">
          {address.nombreDireccion || getTypeName()}
        </h3>
        {isDefault && (
          <div className="flex items-center gap-1 text-xs text-green-600 font-semibold mb-2">
            <Check className="w-3 h-3" />
            Predeterminada
          </div>
        )}
        <div className="flex-1 flex flex-col justify-center w-full mt-1 items-start">
          <p className="text-gray-600 ">{address.linea_uno}</p>
          {address.complemento && (
            <p className="text-gray-600 ">{address.complemento}</p>
          )}
          <div className="text-gray-600 ">
            {(() => {
              if (address.ciudad && address.departamento) {
                return (
                  <p>
                    {address.ciudad}, {address.departamento}
                  </p>
                );
              } else if (address.ciudad) {
                return <p>{address.ciudad}</p>;
              } else {
                return null;
              }
            })()}
            {address.pais && (
              <p>{address.pais === "CO" ? "Colombia" : address.pais}</p>
            )}
          </div>
          {address.instruccionesEntrega && (
            <div className="mt-3 pt-3 border-t border-gray-200">
              <p className="text-xs font-semibold text-gray-500 uppercase mb-1">
                Instrucciones
              </p>
              <p className="text-sm text-gray-600">
                {address.instruccionesEntrega}
              </p>
            </div>
          )}
        </div>
      </div>
      {!isDefault && (
        <button
          onClick={() => onSetDefault(address.id)}
          className="w-full py-2 border border-gray-200 rounded-lg hover:border-black hover:bg-gray-50 transition-all font-semibold text-sm mt-4"
        >
          Establecer como Predeterminada
        </button>
      )}
    </div>
  );
};

export default AddressCard;
