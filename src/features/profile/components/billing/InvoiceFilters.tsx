/**
 * @module InvoiceFilters
 * @description Samsung-style invoice search and filters
 */

import React from 'react';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { InvoiceStatus } from '../../types';

interface FilterOption {
  value: InvoiceStatus | 'all';
  label: string;
  count: number;
}

interface InvoiceFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedStatus: InvoiceStatus | 'all';
  onStatusChange: (status: InvoiceStatus | 'all') => void;
  statusCounts: {
    all: number;
    paid: number;
    pending: number;
    overdue: number;
    cancelled: number;
  };
}

export const InvoiceFilters: React.FC<InvoiceFiltersProps> = ({
  searchQuery,
  onSearchChange,
  selectedStatus,
  onStatusChange,
  statusCounts,
}) => {
  const filters: FilterOption[] = [
    { value: 'all', label: 'Todas', count: statusCounts.all },
    { value: 'paid', label: 'Pagadas', count: statusCounts.paid },
    { value: 'pending', label: 'Pendientes', count: statusCounts.pending },
    { value: 'overdue', label: 'Vencidas', count: statusCounts.overdue },
  ];

  return (
    <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 space-y-4">
      {/* Search Bar - Samsung style */}
      <div className="relative">
        <Search
          className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-900"
          strokeWidth={1.5}
        />
        <input
          type="text"
          placeholder="Buscar por número de factura o pedido..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-black transition-colors text-base font-bold placeholder:font-normal placeholder:text-gray-400"
        />
      </div>

      {/* Status Filters - Samsung style */}
      <div className="flex gap-3 overflow-x-auto pb-2">
        {filters.map((filter) => (
          <button
            key={filter.value}
            onClick={() => onStatusChange(filter.value)}
            className={cn(
              'flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold transition-all flex-shrink-0 border-2',
              selectedStatus === filter.value
                ? 'bg-black text-white border-black'
                : 'bg-white text-gray-900 border-gray-200 hover:border-black'
            )}
          >
            {filter.label}
            {filter.count > 0 && (
              <span
                className={cn(
                  'px-2 py-0.5 rounded-full text-xs font-bold',
                  selectedStatus === filter.value
                    ? 'bg-white text-black'
                    : 'bg-gray-900 text-white'
                )}
              >
                {filter.count}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default InvoiceFilters;
