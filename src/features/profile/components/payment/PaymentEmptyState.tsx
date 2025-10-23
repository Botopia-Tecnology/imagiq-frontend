/**
 * @module PaymentEmptyState
 * @description Empty state for payment methods
 */

import React from 'react';
import { CreditCard, Plus } from 'lucide-react';
import Button from '@/components/Button';

interface PaymentEmptyStateProps {
  onAddNew: () => void;
}

export const PaymentEmptyState: React.FC<PaymentEmptyStateProps> = ({ onAddNew }) => (
  <div className="bg-white rounded-2xl border-2 border-gray-100 p-12 text-center">
    <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
      <CreditCard className="w-10 h-10 text-gray-400" strokeWidth={1.5} />
    </div>
    <h3 className="text-2xl font-bold text-gray-900 mb-3">No tienes métodos de pago</h3>
    <p className="text-gray-600 mb-8 max-w-md mx-auto">
      Agrega una tarjeta de crédito o débito para realizar compras más rápido
    </p>
    <Button
      variant="primary"
      onClick={onAddNew}
      className="font-bold px-8 bg-black hover:bg-gray-800"
    >
      <Plus className="w-5 h-5 mr-2" />
      Agregar Método de Pago
    </Button>
  </div>
);

export default PaymentEmptyState;
