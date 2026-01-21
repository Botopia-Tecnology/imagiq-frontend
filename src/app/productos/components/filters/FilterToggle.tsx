/**
 * Componente Toggle/Switch para filtros binarios
 *
 * Responsabilidad única (SRP): Solo renderiza un control toggle con label
 * Usa shadcn Switch (Radix UI) para accesibilidad y consistencia
 *
 * @example
 * ```tsx
 * <FilterToggle
 *   id="stock-filter"
 *   label="Solo con disponibilidad"
 *   description="Ocultar productos sin stock"
 *   checked={isEnabled}
 *   onChange={(checked) => setEnabled(checked)}
 * />
 * ```
 */
"use client";

import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";

export interface FilterToggleProps {
  /** ID único para accesibilidad */
  id: string;
  /** Texto principal del toggle */
  label: string;
  /** Descripción adicional (opcional) */
  description?: string;
  /** Estado actual del toggle */
  checked: boolean;
  /** Callback cuando cambia el estado */
  onChange: (checked: boolean) => void;
  /** Clases CSS adicionales */
  className?: string;
}

export default function FilterToggle({
  id,
  label,
  description,
  checked,
  onChange,
  className,
}: FilterToggleProps) {
  return (
    <div className={cn("flex items-center justify-between py-2", className)}>
      {/* Label y descripción */}
      <div className="flex flex-col">
        <label
          htmlFor={id}
          className="text-sm font-medium text-gray-900 cursor-pointer select-none"
        >
          {label}
        </label>
        {description && (
          <span className="text-xs text-gray-500 mt-0.5">{description}</span>
        )}
      </div>

      {/* shadcn Switch */}
      <Switch
        id={id}
        checked={checked}
        onCheckedChange={onChange}
        aria-label={`${label}: ${checked ? "activado" : "desactivado"}`}
      />
    </div>
  );
}
