/**
 * @module OrdersSection
 * @description Orders display section for profile page - Samsung style
 */

import React from "react";
import OrderCard from "./OrderCard";
import { Order } from "../../types";

interface OrdersSectionProps {
  title: string;
  orders: Order[];
  variant: "active" | "recent";
  showViewAll?: boolean;
  onViewDetails: (orderId: string) => void;
  onViewAllOrders?: () => void;
}

export const OrdersSection: React.FC<OrdersSectionProps> = ({
  title,
  orders,
  variant,
  showViewAll = false,
  onViewDetails,
  onViewAllOrders,
}) => {
  if (orders.length === 0) return null;

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        {showViewAll && onViewAllOrders && (
          <button
            onClick={onViewAllOrders}
            className="text-sm font-bold hover:underline"
          >
            Ver todos
          </button>
        )}
      </div>
      <div className="space-y-4">
        {orders.map((order) => (
          <OrderCard
            key={order.id}
            order={order}
            variant={variant}
            onViewDetails={onViewDetails}
          />
        ))}
      </div>
    </div>
  );
};

OrdersSection.displayName = "OrdersSection";

export default OrdersSection;
