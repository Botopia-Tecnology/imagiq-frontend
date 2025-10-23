import React from "react";
import { Package, HelpCircle, CreditCard } from "lucide-react";

interface QuickActionsProps {
  onOrdersClick: () => void;
  onHelpClick: () => void;
  onPaymentMethodsClick: () => void;
}

const QuickActions: React.FC<QuickActionsProps> = ({
  onOrdersClick,
  onHelpClick,
  onPaymentMethodsClick
}) => {
  return (
    <div className="bg-gray-50 py-6">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Pedidos */}
          <button
            onClick={onOrdersClick}
            className="flex flex-col items-center justify-center gap-3 p-6 bg-white rounded-2xl border-2 border-gray-200 hover:border-black transition-all hover:shadow-lg"
          >
            <Package className="w-8 h-8" />
            <span className="font-bold text-lg">Pedidos</span>
          </button>

          {/* Ayuda */}
          <button
            onClick={onHelpClick}
            className="flex flex-col items-center justify-center gap-3 p-6 bg-white rounded-2xl border-2 border-gray-200 hover:border-black transition-all hover:shadow-lg"
          >
            <HelpCircle className="w-8 h-8" />
            <span className="font-bold text-lg">Ayuda</span>
          </button>

          {/* Métodos de Pago */}
          <button
            onClick={onPaymentMethodsClick}
            className="flex flex-col items-center justify-center gap-3 p-6 bg-white rounded-2xl border-2 border-gray-200 hover:border-black transition-all hover:shadow-lg"
          >
            <CreditCard className="w-8 h-8" />
            <span className="font-bold text-lg">Métodos de Pago</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuickActions;
