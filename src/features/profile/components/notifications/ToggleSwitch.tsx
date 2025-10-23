/**
 * @module ToggleSwitch
 * @description Samsung-style toggle switch - minimalist black/white
 */

import React from 'react';
import { cn } from '@/lib/utils';

interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  size?: 'sm' | 'md';
}

export const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  checked,
  onChange,
  disabled = false,
  size = 'md',
}) => {
  const switchSize = size === 'sm' ? 'w-10 h-6' : 'w-12 h-7';
  const toggleSize = size === 'sm' ? 'w-4 h-4' : 'w-5 h-5';
  const translateDistance = size === 'sm' ? 'translate-x-4' : 'translate-x-5';

  return (
    <button
      type="button"
      onClick={() => !disabled && onChange(!checked)}
      className={cn(
        'relative inline-flex rounded-full transition-colors duration-200 border-2',
        switchSize,
        checked ? 'bg-black border-black' : 'bg-white border-gray-300',
        disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-black'
      )}
      disabled={disabled}
    >
      <span
        className={cn(
          'inline-block rounded-full shadow-sm transform transition-transform duration-200',
          toggleSize,
          checked ? `${translateDistance} bg-white` : 'translate-x-1 bg-gray-900',
          'mt-0.5'
        )}
      />
    </button>
  );
};

export default ToggleSwitch;
