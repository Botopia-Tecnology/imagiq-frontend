/**
 * @module OrderCard
 * @description Samsung-style order card component
 */

import React from 'react';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Order } from '../../types';
import { getStatusInfo, formatDate, isActiveOrder } from './orderUtils';

interface OrderCardProps {
  order: Order;
  onViewDetails: (orderId: string) => void;
  className?: string;
}

export const OrderCard: React.FC<OrderCardProps> = ({
  order,
  onViewDetails,
  className
}) => {
  const statusInfo = getStatusInfo(order.status);
  const StatusIcon = statusInfo.icon;
  const isActive = isActiveOrder(order.status);

  const handleClick = (): void => {
    onViewDetails(order.id);
  };

  const handleKeyDown = (event: React.KeyboardEvent): void => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleClick();
    }
  };

  return (
    <div
      className={cn(
        'bg-white rounded-2xl border-2 border-gray-200 p-6 md:p-8',
        'cursor-pointer transition-all duration-200',
        'hover:border-black hover:shadow-lg',
        'focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2',
        className
      )}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`Ver detalles del pedido ${order.orderNumber}`}
    >
      <div className="flex items-start justify-between mb-6">
        <div className="flex-1">
          {/* Order Number */}
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            #{order.orderNumber}
          </h3>

          {/* Date */}
          <p className="text-sm text-gray-600 font-medium">
            {formatDate(order.createdAt)}
          </p>
        </div>

        {/* Status Badge - Samsung style */}
        <div
          className={cn(
            'inline-flex items-center gap-2 px-4 py-2 rounded-full border-2',
            statusInfo.bgColor === 'bg-black'
              ? 'bg-black text-white border-black'
              : 'bg-gray-100 text-gray-900 border-gray-200'
          )}
        >
          <StatusIcon className="w-4 h-4" strokeWidth={2} />
          <span className="text-xs font-bold uppercase tracking-wider">
            {statusInfo.label}
          </span>
        </div>
      </div>

      {/* Order Details */}
      <div className="border-t-2 border-gray-100 pt-6 mb-6">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-1">
              Total
            </p>
            <p className="text-xl font-bold text-gray-900">
              ${order.totalAmount.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-1">
              Artículos
            </p>
            <p className="text-xl font-bold text-gray-900">
              {order.items.length}
            </p>
          </div>
        </div>

        {/* Estimated Delivery */}
        {isActive && order.estimatedDelivery && (
          <div>
            <p className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-1">
              Entrega estimada
            </p>
            <p className="text-base font-bold text-gray-900">
              {formatDate(order.estimatedDelivery)}
            </p>
          </div>
        )}
      </div>

      {/* Items Preview - Samsung style: clean images */}
      {order.items.length > 0 && (
        <div className="border-t-2 border-gray-100 pt-6">
          <p className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-3">
            Productos
          </p>
          <div className="flex gap-3">
            {order.items.slice(0, 4).map((item) => {
              const imageUrl = item.product.images?.[0]
                ? typeof item.product.images[0] === 'string'
                  ? item.product.images[0]
                  : (item.product.images[0] as { url: string }).url
                : null;

              return (
                <div
                  key={item.id}
                  className="w-16 h-16 bg-gray-100 rounded-xl flex-shrink-0 overflow-hidden border-2 border-gray-200"
                >
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-xs text-gray-400 font-bold">
                        {item.product.name.charAt(0)}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
            {order.items.length > 4 && (
              <div className="w-16 h-16 bg-gray-900 text-white rounded-xl flex items-center justify-center border-2 border-gray-900">
                <span className="text-sm font-bold">
                  +{order.items.length - 4}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* View Details Button */}
      <div className="border-t-2 border-gray-100 pt-6 mt-6">
        <div className="flex items-center justify-between text-sm font-bold text-gray-900">
          <span className="uppercase tracking-wider">Ver detalles</span>
          <ChevronRight className="w-5 h-5" strokeWidth={2.5} />
        </div>
      </div>
    </div>
  );
};

OrderCard.displayName = 'OrderCard';

export default OrderCard;
