/**
 * @module AccountSection
 * @description My Account section for profile page - Samsung style
 */

import React from "react";
import { MapPin, CreditCard, FileText } from "lucide-react";
import MenuItem from "./MenuItem";

interface AccountSectionProps {
  addressesCount: number;
  paymentMethodsCount: number;
  onAddressesClick: () => void;
  onPaymentMethodsClick: () => void;
  onBillingClick: () => void;
}

export const AccountSection: React.FC<AccountSectionProps> = ({
  addressesCount,
  paymentMethodsCount,
  onAddressesClick,
  onPaymentMethodsClick,
  onBillingClick,
}) => {
  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-4 px-2">Mi cuenta</h2>
      <div className="bg-white border-2 border-gray-100 rounded-2xl overflow-hidden">
        <MenuItem
          icon={MapPin}
          label="Direcciones"
          badge={addressesCount}
          onClick={onAddressesClick}
        />
        <MenuItem
          icon={CreditCard}
          label="Métodos de Pago"
          badge={paymentMethodsCount}
          onClick={onPaymentMethodsClick}
        />
        <MenuItem
          icon={FileText}
          label="Información de Facturación"
          onClick={onBillingClick}
        />
      </div>
    </div>
  );
};

AccountSection.displayName = "AccountSection";

export default AccountSection;
