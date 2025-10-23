/**
 * @module OrderUtils
 * @description Utility functions and types for orders
 */

import type { LucideIcon } from 'lucide-react';
import { Clock, CheckCircle, Package, Truck, XCircle } from 'lucide-react';
import { OrderStatus } from '../../types';
import { formatDate as formatDateUtil } from '../../utils/formatters';

export interface StatusInfo {
  icon: LucideIcon;
  label: string;
  color: string;
  iconColor: string;
  bgColor: string;
}

export const ORDER_STATUS_MAP: Record<OrderStatus, StatusInfo> = {
  pending: {
    icon: Clock,
    label: 'Pendiente',
    color: 'text-gray-900',
    iconColor: 'text-gray-600',
    bgColor: 'bg-gray-100'
  },
  confirmed: {
    icon: CheckCircle,
    label: 'Confirmado',
    color: 'text-gray-900',
    iconColor: 'text-gray-900',
    bgColor: 'bg-gray-100'
  },
  processing: {
    icon: Package,
    label: 'Procesando',
    color: 'text-gray-900',
    iconColor: 'text-gray-900',
    bgColor: 'bg-gray-100'
  },
  shipped: {
    icon: Truck,
    label: 'Enviado',
    color: 'text-gray-900',
    iconColor: 'text-gray-900',
    bgColor: 'bg-gray-100'
  },
  delivered: {
    icon: CheckCircle,
    label: 'Entregado',
    color: 'text-gray-900',
    iconColor: 'text-black',
    bgColor: 'bg-black'
  },
  cancelled: {
    icon: XCircle,
    label: 'Cancelado',
    color: 'text-gray-900',
    iconColor: 'text-gray-600',
    bgColor: 'bg-gray-100'
  }
};

export const getStatusInfo = (status: OrderStatus): StatusInfo => {
  return ORDER_STATUS_MAP[status] || ORDER_STATUS_MAP.pending;
};

// Re-export formatter para compatibilidad
export const formatDate = formatDateUtil;

export const isActiveOrder = (status: OrderStatus): boolean => {
  return ['pending', 'confirmed', 'processing', 'shipped'].includes(status);
};
