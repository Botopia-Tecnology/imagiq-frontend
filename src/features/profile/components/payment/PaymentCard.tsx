import React from "react";
import { CreditCard, Edit, Trash2, Check } from "lucide-react";
import { DBCard } from "../../types";

interface PaymentCardProps {
  card: DBCard;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onSetDefault: (id: string) => void;
}

const PaymentCard: React.FC<PaymentCardProps> = ({ card, onEdit, onDelete, onSetDefault }) => {
  // Obtener el nombre de la marca
  const getBrandName = () => {
    if (!card.marca) return "Tarjeta";
    const marca = card.marca.toUpperCase();
    if (marca.includes("VISA")) return "VISA";
    if (marca.includes("MASTER")) return "MASTERCARD";
    if (marca.includes("AMERICAN") || marca.includes("AMEX")) return "AMERICAN EXPRESS";
    return card.marca;
  };

  // Obtener el tipo de tarjeta
  const getCardType = () => {
    if (card.tipo_tarjeta === "credit_card") return "Crédito";
    if (card.tipo_tarjeta === "debit_card") return "Débito";
    return "Banco";
  };

  // Determinar si está expirada
  const isExpired = () => {
    if (!card.fecha_vencimiento) return false;
    const [month, year] = card.fecha_vencimiento.split("/");
    const expDate = new Date(2000 + parseInt(year), parseInt(month) - 1);
    return expDate < new Date();
  };

  // Determinar si es predeterminada
  const isDefault = card.es_predeterminada || false;
  const expired = isExpired();

  // Color del logo según marca
  const getBrandLogo = () => {
    const brandName = getBrandName();
    if (brandName === "VISA") {
      return (
        <div className="bg-blue-600 text-white px-3 py-1 rounded font-bold text-sm">
          VISA
        </div>
      );
    }
    if (brandName === "MASTERCARD") {
      return (
        <div className="bg-red-600 text-white px-3 py-1 rounded font-bold text-sm">
          MASTERCARD
        </div>
      );
    }
    if (brandName === "AMERICAN EXPRESS") {
      return (
        <div className="bg-blue-500 text-white px-3 py-1 rounded font-bold text-xs">
          AMERICAN EXPRESS
        </div>
      );
    }
    return (
      <div className="bg-gray-600 text-white px-3 py-1 rounded font-bold text-sm">
        {brandName}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 hover:border-gray-300 transition-all">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          {getBrandLogo()}
          <div>
            <p className="text-sm text-gray-600">{getCardType()}</p>
            {isDefault && (
              <div className="flex items-center gap-1 text-xs text-green-600 font-semibold mt-1">
                <Check className="w-3 h-3" />
                Predeterminada
              </div>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(card.id.toString())}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Editar"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(card.id.toString())}
            className="p-2 hover:bg-red-50 text-red-500 rounded-lg transition-colors"
            title="Eliminar"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {/* Número de tarjeta */}
        <div>
          <p className="text-2xl font-bold text-gray-900 tracking-wider">
            •••• •••• •••• {card.ultimos_dijitos}
          </p>
        </div>

        {/* Alias y Vencimiento */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-gray-500 uppercase mb-1">Alias</p>
            <p className="font-bold text-gray-900">
              {card.alias || card.nombre_titular || `${getCardType()} ${getBrandName()}`}
            </p>
          </div>
          {card.fecha_vencimiento && (
            <div>
              <p className="text-xs text-gray-500 uppercase mb-1">Vencimiento</p>
              <p className={`font-bold ${expired ? "text-red-500" : "text-gray-900"}`}>
                {card.fecha_vencimiento}
                {expired && <span className="ml-2 text-xs">Expirada</span>}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Botón predeterminada */}
      {!isDefault && !expired && (
        <button
          onClick={() => onSetDefault(card.id.toString())}
          className="w-full mt-4 py-2 border-2 border-gray-200 rounded-lg hover:border-black hover:bg-gray-50 transition-all font-semibold text-sm"
        >
          Predeterminada
        </button>
      )}
    </div>
  );
};

export default PaymentCard;
