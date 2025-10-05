/**
 * @module OrdersPage
 * @description Elegant orders management page
 * Following Single Responsibility Principle - handles orders display and filtering
 */

import React, { useState } from 'react';
import { Search, Filter, Download, Package2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import Button from '@/components/Button';
import { useProfile } from '../../hooks/useProfile';
import PageHeader from '../layouts/PageHeader';
import OrderCard from '../sections/OrderCard';
import { Order, OrderStatus } from '../../types';

interface OrdersPageProps {
  onBack?: () => void;
  className?: string;
}

const statusFilters = [
  { value: 'all', label: 'Todos', count: 0 },
  { value: 'active', label: 'Activos', count: 0 },
  { value: 'delivered', label: 'Entregados', count: 0 },
  { value: 'cancelled', label: 'Cancelados', count: 0 }
];

const EmptyState: React.FC<{ filter: string }> = ({ filter }) => (
  <div className="text-center py-12">
    <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
      <Package2 className="w-8 h-8 text-gray-400" />
    </div>
    <h3 className="text-lg font-medium text-gray-900 mb-2">
      {filter === 'all' ? 'No tienes pedidos' : `No tienes pedidos ${filter.toLowerCase()}`}
    </h3>
    <p className="text-gray-500 mb-6 max-w-sm mx-auto">
      {filter === 'all'
        ? 'Cuando realices tu primera compra, aparecerá aquí'
        : 'No hay pedidos que coincidan con este filtro'
      }
    </p>
    {filter === 'all' && (
      <Button variant="primary" onClick={() => window.location.href = '/productos'}>
        Explorar Productos
      </Button>
    )}
  </div>
);

export const OrdersPage: React.FC<OrdersPageProps> = ({
  onBack,
  className
}) => {
  const { state } = useProfile();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  // Combine all orders and sort by date
  const allOrders = [...state.activeOrders, ...state.recentOrders]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  // Filter orders based on selected filter and search
  const filteredOrders = allOrders.filter(order => {
    const matchesSearch = order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.items.some(item => item.product.name.toLowerCase().includes(searchQuery.toLowerCase()));

    if (selectedFilter === 'all') return matchesSearch;
    if (selectedFilter === 'active') return matchesSearch && ['pending', 'confirmed', 'processing', 'shipped'].includes(order.status);
    if (selectedFilter === 'delivered') return matchesSearch && order.status === 'delivered';
    if (selectedFilter === 'cancelled') return matchesSearch && order.status === 'cancelled';

    return matchesSearch;
  });

  // Update filter counts
  const updatedFilters = statusFilters.map(filter => ({
    ...filter,
    count: filter.value === 'all' ? allOrders.length :
           filter.value === 'active' ? allOrders.filter(o => ['pending', 'confirmed', 'processing', 'shipped'].includes(o.status)).length :
           filter.value === 'delivered' ? allOrders.filter(o => o.status === 'delivered').length :
           allOrders.filter(o => o.status === 'cancelled').length
  }));

  const handleOrderDetails = (orderId: string) => {
    console.log('Navigate to order details:', orderId);
    // TODO: Implement order details navigation
  };

  const handleDownloadReceipt = () => {
    console.log('Download orders receipt');
    // TODO: Implement receipt download
  };

  return (
    <div className={cn('min-h-screen bg-gray-50', className)}>
      <PageHeader
        title="Mis Pedidos"
        subtitle={`${allOrders.length} ${allOrders.length === 1 ? 'pedido' : 'pedidos'} en total`}
        onBack={onBack}
        actions={
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownloadReceipt}
            className="hidden sm:flex"
          >
            <Download className="w-4 h-4 mr-2" />
            Descargar
          </Button>
        }
      />

      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Search and Filters */}
        <div className="bg-white rounded-lg p-4 shadow-sm">
          {/* Search Bar */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por número de pedido o producto..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="flex-shrink-0"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filtros
            </Button>

            <div className="flex gap-2 overflow-x-auto">
              {updatedFilters.map((filter) => (
                <button
                  key={filter.value}
                  onClick={() => setSelectedFilter(filter.value)}
                  className={cn(
                    'flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors',
                    selectedFilter === filter.value
                      ? 'bg-blue-100 text-blue-700 border border-blue-200'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  )}
                >
                  {filter.label}
                  {filter.count > 0 && (
                    <span className="ml-2 text-xs bg-white px-1.5 py-0.5 rounded-full">
                      {filter.count}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Orders List */}
        {filteredOrders.length > 0 ? (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                variant={['pending', 'confirmed', 'processing', 'shipped'].includes(order.status) ? 'active' : 'recent'}
                onViewDetails={handleOrderDetails}
                className="hover:shadow-md transition-shadow"
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg">
            <EmptyState filter={selectedFilter} />
          </div>
        )}

        {/* Load More Button (for pagination) */}
        {filteredOrders.length >= 10 && (
          <div className="text-center py-4">
            <Button variant="outline">
              Cargar más pedidos
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

OrdersPage.displayName = 'OrdersPage';

export default OrdersPage;