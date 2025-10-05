/**
 * @module QuickActions
 * @description Quick action buttons for profile navigation
 * Following Single Responsibility Principle - handles quick navigation actions
 */

import React from 'react';
import { Package, HelpCircle, CreditCard } from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuickActionProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  onClick: () => void;
  disabled?: boolean;
}

const QuickActionButton: React.FC<QuickActionProps> = ({
  icon: Icon,
  label,
  onClick,
  disabled = false
}) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    className={cn(
      'flex flex-col items-center gap-2 p-4 rounded-xl border border-gray-200',
      'transition-all duration-200 ease-in-out',
      'hover:border-blue-300 hover:bg-blue-50 hover:scale-105',
      'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
      'active:scale-95',
      disabled && 'opacity-50 cursor-not-allowed hover:border-gray-200 hover:bg-white hover:scale-100'
    )}
    aria-label={label}
  >
    <div className="flex items-center justify-center w-8 h-8">
      <Icon className="w-6 h-6 text-gray-600" />
    </div>
    <span className="text-sm font-medium text-gray-700 text-center leading-tight">
      {label}
    </span>
  </button>
);

interface QuickActionsProps {
  onOrdersClick: () => void;
  onHelpClick: () => void;
  onPaymentMethodsClick: () => void;
  className?: string;
}

export const QuickActions: React.FC<QuickActionsProps> = ({
  onOrdersClick,
  onHelpClick,
  onPaymentMethodsClick,
  className
}) => {
  return (
    <div className={cn('p-4 bg-white rounded-lg shadow-sm', className)}>
      {/* Use 2 columns on very small screens and 3 on small+ to avoid cramped buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <QuickActionButton
          icon={Package}
          label="Pedidos"
          onClick={onOrdersClick}
        />
        <QuickActionButton
          icon={HelpCircle}
          label="Ayuda"
          onClick={onHelpClick}
        />
        <QuickActionButton
          icon={CreditCard}
          label="Métodos de pago"
          onClick={onPaymentMethodsClick}
        />
      </div>
    </div>
  );
};

QuickActions.displayName = 'QuickActions';

export default QuickActions;