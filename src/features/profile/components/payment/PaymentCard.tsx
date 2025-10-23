/**
 * @module PaymentCard
 * @description Samsung-style payment card component
 */

import React from "react";
import { CreditCard, Edit, Trash2, Check } from "lucide-react";
import {
  FaCcVisa,
  FaCcMastercard,
  FaCcAmex,
  FaCcDiscover,
} from "react-icons/fa";
import { cn } from "@/lib/utils";
import Button from "@/components/Button";
import { PaymentMethod } from "../../types";

interface PaymentCardProps {
  payment: PaymentMethod;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onSetDefault: (id: string) => void;
}

export const PaymentCard: React.FC<PaymentCardProps> = ({
  payment,
  onEdit,
  onDelete,
  onSetDefault,
}) => {
  const getBrandIcon = (brand?: string) => {
    const iconProps = { className: "w-10 h-10 text-gray-900" };
    if (!brand)
      return (
        <CreditCard className="w-10 h-10 text-gray-900" strokeWidth={1.5} />
      );

    switch (brand.toLowerCase()) {
      case "visa":
        return <FaCcVisa {...iconProps} />;
      case "mastercard":
        return <FaCcMastercard {...iconProps} />;
      case "amex":
      case "american express":
        return <FaCcAmex {...iconProps} />;
      case "discover":
        return <FaCcDiscover {...iconProps} />;
      default:
        return (
          <CreditCard className="w-10 h-10 text-gray-900" strokeWidth={1.5} />
        );
    }
  };

  const formatCardNumber = (last4?: string) => {
    if (!last4) return "•••• •••• •••• ••••";
    return `•••• •••• •••• ${last4}`;
  };

  const getCardTypeName = (type: string) => {
    switch (type) {
      case "credit_card":
        return "Crédito";
      case "debit_card":
        return "Débito";
      case "bank_account":
        return "Cuenta Bancaria";
      default:
        return "Tarjeta";
    }
  };

  const isExpired = () => {
    if (!payment.expirationDate) return false;
    try {
      const [month, year] = payment.expirationDate.split("/");
      const expiry = new Date(
        2000 + Number.parseInt(year, 10),
        Number.parseInt(month, 10) - 1
      );
      return expiry < new Date();
    } catch {
      return false;
    }
  };

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border-2 transition-all duration-200",
        payment.isDefault
          ? "border-black"
          : "border-gray-200 hover:border-gray-400"
      )}
    >
      <div className="bg-white p-6 md:p-8">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-3">
            {getBrandIcon(payment.brand)}
            <div>
              <div className="text-xs font-bold text-gray-600 uppercase tracking-wider">
                {payment.brand || "Tarjeta"}
              </div>
              <div className="text-xs font-medium text-gray-500 mt-0.5">
                {getCardTypeName(payment.type)}
              </div>
            </div>
          </div>
          {payment.isDefault && (
            <div className="flex items-center gap-1 px-3 py-1 bg-black text-white rounded-full">
              <Check className="w-3 h-3" strokeWidth={2.5} />
              <span className="text-xs font-bold uppercase tracking-wider">
                Predeterminada
              </span>
            </div>
          )}
        </div>

        {/* Card Number */}
        <div className="mb-6">
          <div className="font-mono text-2xl md:text-3xl font-bold text-gray-900 tracking-wider">
            {formatCardNumber(payment.last4Digits)}
          </div>
        </div>

        {/* Card Details */}
        <div className="grid grid-cols-2 gap-4 mb-6 pb-6 border-b-2 border-gray-100">
          <div>
            <div className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-1">
              Alias
            </div>
            <div className="text-base font-bold text-gray-900">
              {payment.alias}
            </div>
          </div>
          {payment.expirationDate && (
            <div>
              <div className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-1">
                Vencimiento
              </div>
              <div
                className={cn(
                  "text-base font-bold",
                  isExpired() ? "text-red-600" : "text-gray-900"
                )}
              >
                {payment.expirationDate}
                {isExpired() && (
                  <span className="ml-2 text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-bold">
                    Expirada
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          {!payment.isDefault && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onSetDefault(payment.id)}
              className="flex-1 font-bold border-2 border-gray-200 hover:border-black hover:bg-black hover:text-white"
            >
              Predeterminada
            </Button>
          )}
          <button
            onClick={() => onEdit(payment.id)}
            className="p-3 rounded-lg border-2 border-gray-200 hover:border-black hover:bg-black hover:text-white transition-colors"
            aria-label="Editar"
          >
            <Edit className="w-4 h-4" strokeWidth={1.5} />
          </button>
          <button
            onClick={() => onDelete(payment.id)}
            className="p-3 rounded-lg border-2 border-red-200 text-red-600 hover:border-red-600 hover:bg-red-600 hover:text-white transition-colors"
            aria-label="Eliminar"
          >
            <Trash2 className="w-4 h-4" strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentCard;
