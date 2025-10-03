"use client";

import { cn } from "@/lib/utils";
import { DEFAULT_SORT_OPTIONS } from "@/lib/sortUtils";

export interface SortOption {
  value: string;
  label: string;
  default?: boolean;
}

export interface SortDropdownProps {
  value: string;
  onChange: (value: string) => void;
  options?: SortOption[];
  className?: string;
  placeholder?: string;
}

const defaultOptions: SortOption[] = DEFAULT_SORT_OPTIONS.map(opt => ({ value: opt.value, label: opt.label }));

export default function SortDropdown({
  value,
  onChange,
  options = defaultOptions,
  className,
  placeholder = "Ordenar por...",
}: SortDropdownProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={cn(
        "bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-sm font-medium text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 shadow-sm min-w-0 max-w-xs hover:border-gray-400",
        className
      )}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}
