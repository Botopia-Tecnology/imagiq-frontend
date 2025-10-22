/**
 * @module AddressFilters
 * @description Filter tabs for addresses
 */

import React from 'react';
import { cn } from '@/lib/utils';

type AddressType = 'home' | 'work' | 'other';
type FilterValue = 'all' | AddressType;

interface FilterOption {
  value: FilterValue;
  label: string;
  count: number;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
}

interface AddressFiltersProps {
  selectedFilter: FilterValue;
  onFilterChange: (value: FilterValue) => void;
  filters: FilterOption[];
}

export const AddressFilters: React.FC<AddressFiltersProps> = ({
  selectedFilter,
  onFilterChange,
  filters
}) => {
  return (
    <div className="mb-8">
      <div className="flex gap-3 overflow-x-auto pb-2">
        {filters.map((filter) => {
          const Icon = filter.icon;
          return (
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
              <Icon className="w-5 h-5" strokeWidth={1.5} />
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
          );
        })}
      </div>
    </div>
  );
};

AddressFilters.displayName = 'AddressFilters';

export default AddressFilters;
