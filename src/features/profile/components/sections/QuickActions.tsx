/**
 * @module QuickActions
 * @description Samsung-style quick action buttons - large and clean
 */

import React from 'react';
import { Package, HelpCircle, CreditCard } from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuickActionProps {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
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
      'flex items-center justify-center gap-3 p-6 rounded-xl border-2 border-gray-200',
      'transition-all duration-200',
      'hover:border-black hover:bg-black hover:text-white',
      'focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2',
      'active:scale-95',
      disabled && 'opacity-50 cursor-not-allowed'
    )}
    aria-label={label}
  >
    <Icon className="w-7 h-7" strokeWidth={1.5} />
    <span className="text-base font-bold">
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
    <div className={cn('bg-white border-b-2 border-gray-100', className)}>
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
            label="Métodos de Pago"
            onClick={onPaymentMethodsClick}
          />
        </div>
      </div>
    </div>
  );
};

QuickActions.displayName = 'QuickActions';

export default QuickActions;
