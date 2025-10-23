/**
 * @module CouponFilters
 * @description Filter tabs and search for coupons page
 */

import React from 'react';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';

type FilterValue = 'all' | 'active' | 'used' | 'expired';

interface FilterOption {
  value: FilterValue;
  label: string;
  count: number;
}

interface CouponFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedFilter: FilterValue;
  onFilterChange: (value: FilterValue) => void;
  filters: FilterOption[];
}

export const CouponFilters: React.FC<CouponFiltersProps> = ({
  searchQuery,
  onSearchChange,
  selectedFilter,
  onFilterChange,
  filters
}) => {
  return (
    <div className="mb-8">
      {/* Search Bar */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Buscar por código o descripción..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl font-medium focus:outline-none focus:border-black transition-colors"
        />
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-3 overflow-x-auto pb-2">
        {filters.map((filter) => (
          <button
            key={filter.value}
            onClick={() => onFilterChange(filter.value)}
            className={cn(
              'flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold transition-all flex-shrink-0 border-2',
              selectedFilter === filter.value
                ? 'bg-black text-white border-black'
                : 'bg-white text-gray-900 border-gray-200 hover:border-black'
            )}
          >
            {filter.label}
            {filter.count > 0 && (
              <span
                className={cn(
                  'px-2 py-0.5 rounded-full text-xs font-bold',
                  selectedFilter === filter.value
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

CouponFilters.displayName = 'CouponFilters';

export default CouponFilters;
