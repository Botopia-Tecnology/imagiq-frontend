/**
 * @module PaymentMethodsPage
 * @description Samsung-style payment methods page - optimized and modular (<150 lines)
 */

import React, { useState } from "react";
import { CreditCard, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import Button from "@/components/Button";
import { useProfile } from "../../hooks/useProfile";
import PageHeader from "../layouts/PageHeader";
import PaymentCard from "../payment/PaymentCard";
import PaymentEmptyState from "../payment/PaymentEmptyState";
import PaymentFilters from "../payment/PaymentFilters";
import PaymentSecurityNotice from "../payment/PaymentSecurityNotice";

interface PaymentMethodsPageProps {
  onBack?: () => void;
  className?: string;
}

type FilterValue = "all" | "credit_card" | "debit_card" | "bank_account";

export const PaymentMethodsPage: React.FC<PaymentMethodsPageProps> = ({
  onBack,
  className,
}) => {
  const { state } = useProfile();
  const [selectedFilter, setSelectedFilter] = useState<FilterValue>("all");

  const paymentMethods = state.paymentMethods || [];

  // Debug: Ver qué datos tiene state.paymentMethods
  console.log('💳 [PaymentMethodsPage] state.paymentMethods:', paymentMethods);

  // Filter payment methods
  const filteredPayments = paymentMethods.filter((payment) => {
    if (selectedFilter === "all") return true;
    return payment.type === selectedFilter;
  });

  // Count by type
  const paymentCounts = {
    all: paymentMethods.length,
    credit_card: paymentMethods.filter((p) => p.type === "credit_card").length,
    debit_card: paymentMethods.filter((p) => p.type === "debit_card").length,
    bank_account: paymentMethods.filter((p) => p.type === "bank_account")
      .length,
  };

  const handleAddNew = () => {
    console.log("Add new payment method");
    // NOTE: Placeholder - open add payment modal or route to add-payment screen
  };

  const handleEdit = (id: string) => {
    console.log("Edit payment:", id);
    // NOTE: Placeholder - open edit payment modal for the selected payment
  };

  const handleDelete = (id: string) => {
    console.log("Delete payment:", id);
    // NOTE: Placeholder - show confirmation and delete payment via API
  };

  const handleSetDefault = (id: string) => {
    console.log("Set default payment:", id);
    // NOTE: Placeholder - update default payment via API
  };

  const hasPayments = paymentMethods.length > 0;
  const hasFilteredResults = filteredPayments.length > 0;

  return (
    <div className={cn("min-h-screen bg-white", className)}>
      <PageHeader
        title="Métodos de Pago"
        subtitle={`${paymentMethods.length} ${
          paymentMethods.length === 1 ? "método guardado" : "métodos guardados"
        }`}
        onBack={onBack}
        actions={
          hasPayments && (
            <Button
              variant="primary"
              size="sm"
              onClick={handleAddNew}
              className="hidden sm:flex font-bold bg-black hover:bg-gray-800"
            >
              <Plus className="w-4 h-4 mr-2" />
              Agregar
            </Button>
          )
        }
      />

      <div className="max-w-6xl mx-auto px-4 pb-8 mt-10">
        {/* Filters */}
        {hasPayments && (
          <PaymentFilters
            selectedFilter={selectedFilter}
            onFilterChange={setSelectedFilter}
            counts={paymentCounts}
          />
        )}

        {/* Payment Methods Grid */}
        {(() => {
          if (hasFilteredResults) {
            return (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
                {filteredPayments.map((payment) => (
                  <PaymentCard
                    key={payment.id}
                    payment={payment}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onSetDefault={handleSetDefault}
                  />
                ))}
              </div>
            );
          }

          if (hasPayments) {
            return (
              <div className="bg-white rounded-2xl border-2 border-gray-100 p-12 text-center">
                <CreditCard
                  className="w-16 h-16 mx-auto mb-4 text-gray-400"
                  strokeWidth={1.5}
                />
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  No hay métodos en esta categoría
                </h3>
                <p className="text-gray-600">
                  Cambia el filtro para ver otros métodos de pago
                </p>
              </div>
            );
          }

          return <PaymentEmptyState onAddNew={handleAddNew} />;
        })()}

        {/* Security Notice */}
        {hasPayments && <PaymentSecurityNotice />}

        {/* Add Button Mobile */}
        {hasPayments && (
          <div className="sm:hidden mt-6">
            <Button
              variant="primary"
              onClick={handleAddNew}
              className="w-full font-bold py-4 bg-black hover:bg-gray-800"
            >
              <Plus className="w-5 h-5 mr-2" />
              Agregar Método de Pago
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

PaymentMethodsPage.displayName = "PaymentMethodsPage";

export default PaymentMethodsPage;
