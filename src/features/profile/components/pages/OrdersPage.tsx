/**
 * @module OrdersPage
 * @description Samsung-style orders management page
 */

import React, { useState, useMemo } from "react";
import { Download } from "lucide-react";
import { cn } from "@/lib/utils";
import Button from "@/components/Button";
import { useProfile } from "../../hooks/useProfile";
import PageHeader from "../layouts/PageHeader";
import OrderCard from "../orders/OrderCard";
import OrderEmptyState from "../orders/OrderEmptyState";
import OrderFilters from "../orders/OrderFilters";
import { isActiveOrder } from "../orders/orderUtils";

interface OrdersPageProps {
  onBack?: () => void;
  className?: string;
}

type FilterValue = "all" | "active" | "delivered" | "cancelled";

interface FilterOption {
  value: FilterValue;
  label: string;
  count: number;
}

export const OrdersPage: React.FC<OrdersPageProps> = ({
  onBack,
  className,
}) => {
  const { state } = useProfile();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<FilterValue>("all");

  // Combine and sort all orders
  const allOrders = useMemo(() => {
    return [...state.activeOrders, ...state.recentOrders].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [state.activeOrders, state.recentOrders]);

  // Calculate filter counts
  const filterCounts = useMemo(
    () => ({
      all: allOrders.length,
      active: allOrders.filter((o) => isActiveOrder(o.status)).length,
      delivered: allOrders.filter((o) => o.status === "delivered").length,
      cancelled: allOrders.filter((o) => o.status === "cancelled").length,
    }),
    [allOrders]
  );

  // Filter orders
  const filteredOrders = useMemo(() => {
    return allOrders.filter((order) => {
      const matchesSearch =
        order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.items.some((item) =>
          item.product.name.toLowerCase().includes(searchQuery.toLowerCase())
        );

      if (!matchesSearch) return false;

      switch (selectedFilter) {
        case "all":
          return true;
        case "active":
          return isActiveOrder(order.status);
        case "delivered":
          return order.status === "delivered";
        case "cancelled":
          return order.status === "cancelled";
        default:
          return true;
      }
    });
  }, [allOrders, searchQuery, selectedFilter]);

  const handleOrderDetails = (orderId: string): void => {
    console.log("Navigate to order details:", orderId);
    // NOTE: Placeholder - implement navigation to order detail view (router push)
  };

  const handleDownloadReceipt = (): void => {
    console.log("Download orders receipt");
    // NOTE: Placeholder - implement receipt download or export
  };

  const filters: FilterOption[] = [
    { value: "all", label: "Todos", count: filterCounts.all },
    { value: "active", label: "Activos", count: filterCounts.active },
    { value: "delivered", label: "Entregados", count: filterCounts.delivered },
    { value: "cancelled", label: "Cancelados", count: filterCounts.cancelled },
  ];

  const showNoResultsMessage =
    filteredOrders.length === 0 && allOrders.length > 0;

  return (
    <div className={cn("min-h-screen bg-white", className)}>
      <PageHeader
        title="Mis Pedidos"
        subtitle={`${allOrders.length} ${
          allOrders.length === 1 ? "pedido" : "pedidos"
        }`}
        onBack={onBack}
        actions={
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownloadReceipt}
            className="hidden sm:flex font-bold border-2 border-black hover:bg-black hover:text-white"
          >
            <Download className="w-4 h-4 mr-2" />
            Descargar
          </Button>
        }
      />

      <div className="max-w-6xl mx-auto px-4 pb-8">
        {/* Search and Filters */}
        {allOrders.length > 0 && (
          <OrderFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedFilter={selectedFilter}
            onFilterChange={setSelectedFilter}
            filters={filters}
          />
        )}

        {/* Orders List */}
        {(() => {
          if (filteredOrders.length > 0) {
            return (
              <div className="grid gap-6 md:grid-cols-2">
                {filteredOrders.map((order) => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    onViewDetails={handleOrderDetails}
                  />
                ))}
              </div>
            );
          }

          if (allOrders.length === 0) {
            return <OrderEmptyState filter="all" />;
          }

          if (showNoResultsMessage) {
            return <OrderEmptyState filter={selectedFilter} />;
          }

          return null;
        })()}

        {/* Help Text - Samsung style */}
        {allOrders.length > 0 && (
          <div className="mt-8 bg-gray-50 border-2 border-gray-100 rounded-2xl p-6">
            <div className="flex gap-4">
              <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center flex-shrink-0">
                <Download className="w-5 h-5 text-white" strokeWidth={2} />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-2">
                  Acerca de tus pedidos
                </h4>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Puedes ver el estado de tus pedidos en tiempo real. Recibirás
                  notificaciones sobre cualquier actualización en el estado de
                  tu entrega.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

OrdersPage.displayName = "OrdersPage";

export default OrdersPage;
