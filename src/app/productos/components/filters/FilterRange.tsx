/**
 * Componente de filtro tipo Range (rangos predefinidos)
 * Soporta valores manuales y mixtos con rangos
 */

"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import type { DynamicFilterConfig } from "@/types/filters";

interface FilterRangeProps {
  filter: DynamicFilterConfig;
  selectedRanges: string[];
  onRangeChange: (rangeLabel: string, checked: boolean) => void;
}

/**
 * Obtiene todos los rangos disponibles para el filtro
 */
function getFilterRanges(filter: DynamicFilterConfig): Array<{
  label: string;
  min: number;
  max: number;
  operator?: string;
}> {
  const { valueConfig } = filter;
  const ranges: Array<{
    label: string;
    min: number;
    max: number;
    operator?: string;
  }> = [];

  if (valueConfig.type === "manual") {
    // Rangos manuales
    if (valueConfig.ranges) {
      valueConfig.ranges.forEach((range) => {
        ranges.push({
          label: range.label,
          min: range.min,
          max: range.max,
          operator: range.operator,
        });
      });
    }
  } else if (valueConfig.type === "mixed") {
    // Rangos en modo mixto
    if (valueConfig.ranges) {
      valueConfig.ranges.forEach((range) => {
        ranges.push({
          label: range.label,
          min: range.min,
          max: range.max,
          operator: range.operator,
        });
      });
    }
  }

  return ranges;
}

export default function FilterRange({
  filter,
  selectedRanges,
  onRangeChange,
}: FilterRangeProps) {
  const prefersReducedMotion = useReducedMotion();
  const ranges = getFilterRanges(filter);

  return (
    <div className="space-y-2">
      {ranges.map((range, index) => {
        const isChecked = selectedRanges.includes(range.label);

        return (
          <motion.label
            key={`${filter.id}-${range.label}-${index}`}
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
              onChange={(e) => onRangeChange(range.label, e.target.checked)}
              className="w-4 h-4 rounded border-gray-400 text-blue-600 focus:ring-blue-500 focus:ring-2 transition-all duration-200"
              aria-label={range.label}
            />
            <span className="ml-3 text-sm transition-colors duration-200">
              {range.label}
            </span>
          </motion.label>
        );
      })}
    </div>
  );
}

