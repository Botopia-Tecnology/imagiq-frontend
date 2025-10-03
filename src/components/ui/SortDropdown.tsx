"use client";

import { cn } from "@/lib/utils";

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

const defaultOptions: SortOption[] = [
  { value: "relevancia", label: "Relevancia", default: true },
  { value: "precio-menor", label: "Precio: menor a mayor" },
  { value: "precio-mayor", label: "Precio: mayor a menor" },
  { value: "nombre", label: "Nombre A-Z" },
  { value: "calificacion", label: "Mejor calificados" },
];

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
      {placeholder && (
        <option value="" disabled>
          {placeholder}
        </option>
      )}
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}
