/**
 * @module MenuItem
 * @description Reusable menu item component for profile navigation
 * Following Single Responsibility Principle - handles menu item display and interaction
 */

import React from 'react';
import { ChevronRight, LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MenuItemProps {
  icon: LucideIcon;
  label: string;
  badge?: string | number;
  hasChevron?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  testId?: string;
}

export const MenuItem: React.FC<MenuItemProps> = ({
  icon: Icon,
  label,
  badge,
  hasChevron = true,
  onClick,
  disabled = false,
  className,
  testId
}) => {
  const handleClick = () => {
    if (disabled) return;
    onClick?.();
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleClick();
    }
  };

  return (
    <div
      className={cn(
        'flex items-center gap-3 p-3 rounded-lg',
        'transition-all duration-200 ease-in-out',
        onClick && !disabled && [
          'cursor-pointer',
          'hover:bg-gray-50 hover:scale-[1.02]',
          'focus:outline-none focus:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
          'active:scale-[0.98]'
        ],
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={onClick && !disabled ? 0 : -1}
      role={onClick ? 'button' : 'listitem'}
      aria-label={label}
      aria-disabled={disabled}
      data-testid={testId}
    >
      {/* Icon */}
      <div className="flex items-center justify-center w-6 h-6 flex-shrink-0">
        <Icon className="w-5 h-5 text-gray-600" />
      </div>

      {/* Label */}
      <span className="flex-1 text-gray-900 font-medium">
        {label}
      </span>

      {/* Badge */}
      {badge && (
        <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
          {badge}
        </span>
      )}

      {/* Chevron */}
      {hasChevron && onClick && !disabled && (
        <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
      )}
    </div>
  );
};

MenuItem.displayName = 'MenuItem';

export default MenuItem;