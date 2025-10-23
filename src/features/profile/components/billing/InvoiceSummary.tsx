/**
 * @module InvoiceSummary
 * @description Samsung-style invoice summary cards
 */

import React from 'react';
import { CheckCircle2, Clock, FileText } from 'lucide-react';
import { formatCurrency } from './billingUtils';

interface InvoiceSummaryProps {
  paidTotal: number;
  paidCount: number;
  pendingTotal: number;
  pendingCount: number;
  totalCount: number;
}

export const InvoiceSummary: React.FC<InvoiceSummaryProps> = ({
  paidTotal,
  paidCount,
  pendingTotal,
  pendingCount,
  totalCount,
}) => {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {/* Paid */}
      <div className="bg-white rounded-2xl border-2 border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6 text-white" strokeWidth={2} />
          </div>
          <div className="text-sm font-bold text-gray-600 uppercase tracking-wider">
            Total pagado
          </div>
        </div>
        <div className="text-3xl font-bold text-gray-900 mb-2">{formatCurrency(paidTotal)}</div>
        <div className="text-xs font-bold text-gray-600">
          {paidCount} {paidCount === 1 ? 'factura' : 'facturas'}
        </div>
      </div>

      {/* Pending */}
      <div className="bg-white rounded-2xl border-2 border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gray-200 rounded-xl flex items-center justify-center">
            <Clock className="w-6 h-6 text-gray-900" strokeWidth={2} />
          </div>
          <div className="text-sm font-bold text-gray-600 uppercase tracking-wider">
            Pendiente
          </div>
        </div>
        <div className="text-3xl font-bold text-gray-900 mb-2">
          {formatCurrency(pendingTotal)}
        </div>
        <div className="text-xs font-bold text-gray-600">
          {pendingCount} {pendingCount === 1 ? 'factura' : 'facturas'}
        </div>
      </div>

      {/* Total */}
      <div className="bg-white rounded-2xl border-2 border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
            <FileText className="w-6 h-6 text-gray-900" strokeWidth={1.5} />
          </div>
          <div className="text-sm font-bold text-gray-600 uppercase tracking-wider">
            Total facturas
          </div>
        </div>
        <div className="text-3xl font-bold text-gray-900 mb-2">{totalCount}</div>
        <div className="text-xs font-bold text-gray-600">Histórico completo</div>
      </div>
    </div>
  );
};

export default InvoiceSummary;
