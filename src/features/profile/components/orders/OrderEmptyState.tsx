/**
 * @module OrderEmptyState
 * @description Empty state for orders page
 */

import React from "react";
import { Package2 } from "lucide-react";
import Button from "@/components/Button";

interface OrderEmptyStateProps {
  filter: string;
}

export const OrderEmptyState: React.FC<OrderEmptyStateProps> = ({ filter }) => (
  <div className="bg-white rounded-2xl border-2 border-gray-100 p-12 text-center">
    <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
      <Package2 className="w-10 h-10 text-gray-400" strokeWidth={1.5} />
    </div>
    <h3 className="text-2xl font-bold text-gray-900 mb-3">
      {filter === "all"
        ? "No tienes pedidos"
        : `No tienes pedidos ${filter.toLowerCase()}`}
    </h3>
    <p className="text-gray-600 mb-8 max-w-md mx-auto">
      {filter === "all"
        ? "Cuando realices tu primera compra, aparecerá aquí"
        : "No hay pedidos que coincidan con este filtro"}
    </p>
    {filter === "all" && (
      <Button
        variant="primary"
        onClick={() => {
          globalThis.location.href = "/productos";
        }}
        className="font-bold px-8 bg-black hover:bg-gray-800"
      >
        Explorar Productos
      </Button>
    )}
  </div>
);

OrderEmptyState.displayName = "OrderEmptyState";

export default OrderEmptyState;
