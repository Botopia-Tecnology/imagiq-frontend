/**
 * @module billingUtils
 * @description Utility functions for billing
 */

import { InvoiceStatus } from '../../types';
import { CheckCircle2, Clock, AlertCircle, XCircle } from 'lucide-react';

export const getStatusConfig = (status: InvoiceStatus) => {
  switch (status) {
    case 'paid':
      return {
        label: 'Pagado',
        icon: CheckCircle2,
        textColor: 'text-gray-900',
        bgColor: 'bg-gray-900',
      };
    case 'pending':
      return {
        label: 'Pendiente',
        icon: Clock,
        textColor: 'text-gray-900',
        bgColor: 'bg-gray-200',
      };
    case 'overdue':
      return {
        label: 'Vencido',
        icon: AlertCircle,
        textColor: 'text-white',
        bgColor: 'bg-red-600',
      };
    case 'cancelled':
      return {
        label: 'Cancelado',
        icon: XCircle,
        textColor: 'text-gray-600',
        bgColor: 'bg-gray-100',
      };
  }
};

export const formatCurrency = (amount: number, currency: string = 'COP') => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
  }).format(amount);
};

export const formatDate = (date: Date) => {
  return new Date(date).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};
