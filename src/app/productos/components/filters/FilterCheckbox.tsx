/**
 * Componente de filtro tipo Checkbox
 * Soporta valores manuales, dinámicos y mixtos
 */

"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import type { DynamicFilterConfig, ValueConfig } from "@/types/filters";

interface FilterCheckboxProps {
  filter: DynamicFilterConfig;
  selectedValues: string[];
  onValueChange: (value: string, checked: boolean) => void;
}

/**
 * Obtiene todas las opciones disponibles para el filtro
 */
function getFilterOptions(filter: DynamicFilterConfig): Array<{
  value: string;
  label: string;
  operator?: string;
}> {
  const { valueConfig } = filter;
  const options: Array<{ value: string; label: string; operator?: string }> = [];

  if (valueConfig.type === "dynamic") {
    // Valores dinámicos
    if (valueConfig.selectedValues) {
      valueConfig.selectedValues.forEach((item) => {
        options.push({
          value: item.value,
          label: item.value,
        });
      });
    }
  } else if (valueConfig.type === "manual") {
    // Valores manuales
    if (valueConfig.values) {
      valueConfig.values.forEach((item) => {
        options.push({
          value: item.value,
          label: item.label || item.value,
        });
      });
    }
  } else if (valueConfig.type === "mixed") {
    // Valores mixtos: dinámicos + manuales
    if (valueConfig.dynamicValues) {
      valueConfig.dynamicValues.forEach((item) => {
        options.push({
          value: item.value,
          label: item.value,
          operator: item.operator,
        });
      });
    }
    if (valueConfig.manualValues) {
      valueConfig.manualValues.forEach((item) => {
        options.push({
          value: item.value,
          label: item.label || item.value,
          operator: item.operator,
        });
      });
    }
  }

  return options;
}

export default function FilterCheckbox({
  filter,
  selectedValues,
  onValueChange,
}: FilterCheckboxProps) {
  const prefersReducedMotion = useReducedMotion();
  const options = getFilterOptions(filter);

  return (
    <div className="space-y-2">
      {options.map((option, index) => {
        const isChecked = selectedValues.includes(option.value);

        return (
          <motion.label
            key={`${filter.id}-${option.value}-${index}`}
            className={cn(
              "flex items-center py-2 cursor-pointer rounded-md px-2 -mx-2 transition-all duration-200",
              "hover:bg-blue-50",
              isChecked && "bg-blue-50 font-semibold text-blue-700"
            )}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: prefersReducedMotion ? 0.01 : 0.3,
              delay: prefersReducedMotion ? 0 : index * 0.05,
              ease: [0.25, 0.1, 0.25, 1],
            }}
            whileHover={
              prefersReducedMotion
                ? {}
                : { scale: 1.02, transition: { duration: 0.2 } }
            }
          >
            <input
              type="checkbox"
              checked={isChecked}
              onChange={(e) => onValueChange(option.value, e.target.checked)}
              className="w-4 h-4 rounded border-gray-400 text-blue-600 focus:ring-blue-500 focus:ring-2 transition-all duration-200"
              aria-label={option.label}
            />
            <span className="ml-3 text-sm transition-colors duration-200">
              {option.label}
            </span>
          </motion.label>
        );
      })}
    </div>
  );
}

