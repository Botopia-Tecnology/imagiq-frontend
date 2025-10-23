/**
 * @module PaymentFilters
 * @description Filter tabs for payment methods
 */

import React from 'react';
import { cn } from '@/lib/utils';

type FilterValue = 'all' | 'credit_card' | 'debit_card' | 'bank_account';

interface PaymentFiltersProps {
  selectedFilter: FilterValue;
  onFilterChange: (filter: FilterValue) => void;
  counts: {
    all: number;
    credit_card: number;
    debit_card: number;
    bank_account: number;
  };
}

export const PaymentFilters: React.FC<PaymentFiltersProps> = ({
  selectedFilter,
  onFilterChange,
  counts,
}) => {
  const filters = [
    { value: 'all' as const, label: 'Todas', count: counts.all },
    { value: 'credit_card' as const, label: 'Crédito', count: counts.credit_card },
    { value: 'debit_card' as const, label: 'Débito', count: counts.debit_card },
    { value: 'bank_account' as const, label: 'Banco', count: counts.bank_account },
  ];

  return (
    <div className="mb-8">
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

export default PaymentFilters;
