/**
 * @module OrderCard
 * @description Order display card component
 * Following Single Responsibility Principle - only handles order display
 */

import React from 'react';
import { ChevronRight, Package, Truck, CheckCircle, XCircle, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Order, OrderStatus } from '../../types';
import { useCart } from '@/hooks/useCart';

interface OrderCardProps {
  order: Order;
  variant?: 'active' | 'recent';
  onViewDetails: (orderId: string) => void;
  className?: string;
}

const getStatusInfo = (status: OrderStatus) => {
  const statusMap = {
    pending: {
      icon: Clock,
      label: 'Pendiente',
      color: 'text-yellow-600 bg-yellow-100',
      iconColor: 'text-yellow-600'
    },
    confirmed: {
      icon: CheckCircle,
      label: 'Confirmado',
      color: 'text-blue-600 bg-blue-100',
      iconColor: 'text-blue-600'
    },
    processing: {
      icon: Package,
      label: 'Procesando',
      color: 'text-orange-600 bg-orange-100',
      iconColor: 'text-orange-600'
    },
    shipped: {
      icon: Truck,
      label: 'Enviado',
      color: 'text-purple-600 bg-purple-100',
      iconColor: 'text-purple-600'
    },
    delivered: {
      icon: CheckCircle,
      label: 'Entregado',
      color: 'text-green-600 bg-green-100',
      iconColor: 'text-green-600'
    },
    cancelled: {
      icon: XCircle,
      label: 'Cancelado',
      color: 'text-red-600 bg-red-100',
      iconColor: 'text-red-600'
    }
  };

  return statusMap[status] || statusMap.pending;
};

const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('es-CO', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }).format(date);
};

export const OrderCard: React.FC<OrderCardProps> = ({
  order,
  variant = 'recent',
  onViewDetails,
  className
}) => {
  const { formatPrice } = useCart();
  const statusInfo = getStatusInfo(order.status);
  const StatusIcon = statusInfo.icon;

  const handleClick = () => {
    onViewDetails(order.id);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleClick();
    }
  };

  return (
    <div
      className={cn(
        'p-4 bg-white rounded-lg border border-gray-200',
        'cursor-pointer transition-all duration-200',
        'hover:border-blue-300 hover:shadow-md hover:scale-[1.02]',
        'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
        'active:scale-[0.98]',
        className
      )}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`Ver detalles del pedido ${order.orderNumber}`}
    >
      <div className="flex items-start justify-between">
        {/* Order Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-semibold text-gray-900 truncate">
              Pedido {order.orderNumber}
            </h3>

            {/* Status Badge */}
            <div className={cn(
              'inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium',
              statusInfo.color
            )}>
              <StatusIcon className={cn('w-3 h-3', statusInfo.iconColor)} />
              {statusInfo.label}
            </div>
          </div>

          {/* Order Details */}
          <div className="space-y-1 text-sm text-gray-600">
            <p>
              <span className="font-medium">Total:</span>{' '}
              {formatPrice(order.totalAmount)}
            </p>
            <p>
              <span className="font-medium">Fecha:</span>{' '}
              {formatDate(order.createdAt)}
            </p>
            {variant === 'active' && order.estimatedDelivery && (
              <p>
                <span className="font-medium">Entrega estimada:</span>{' '}
                {formatDate(order.estimatedDelivery)}
              </p>
            )}
          </div>

          {/* Items Preview */}
          {order.items.length > 0 && (
            <div className="mt-3">
              <p className="text-xs text-gray-500 mb-1">
                {order.items.length} {order.items.length === 1 ? 'artículo' : 'artículos'}
              </p>
              <div className="flex gap-2">
                {order.items.slice(0, 3).map((item) => (
                  <div
                    key={item.id}
                    className="w-10 h-10 bg-gray-100 rounded-md flex-shrink-0 overflow-hidden"
                  >
                    {(item.product.images?.[0] as unknown) && (
                      <img
                        src={typeof item.product.images[0] === 'string' ? (item.product.images[0] as string) : (item.product.images[0] as {url: string}).url}
                        alt={(item.product.name as string) || 'Product'}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                ))}
                {order.items.length > 3 && (
                  <div className="w-10 h-10 bg-gray-200 rounded-md flex items-center justify-center">
                    <span className="text-xs font-medium text-gray-600">
                      +{order.items.length - 3}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Arrow Icon */}
        <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0 ml-3" />
      </div>
    </div>
  );
};

OrderCard.displayName = 'OrderCard';

export default OrderCard;