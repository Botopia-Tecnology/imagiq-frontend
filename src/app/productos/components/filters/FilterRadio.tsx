/**
 * Componente de filtro tipo Radio
 * Soporta valores manuales, dinámicos y mixtos
 */

"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { ChevronDown, ChevronUp } from "lucide-react";
import type { DynamicFilterConfig } from "@/types/filters";

interface FilterRadioProps {
  filter: DynamicFilterConfig;
  selectedValue: string | null;
  onValueChange: (value: string) => void;
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

const INITIAL_OPTIONS_LIMIT = 10;

export default function FilterRadio({
  filter,
  selectedValue,
  onValueChange,
}: FilterRadioProps) {
  const prefersReducedMotion = useReducedMotion();
  const options = getFilterOptions(filter);
  const filterName = `filter-${filter.id}`;
  const [showAll, setShowAll] = useState(false);
  
  const hasMoreOptions = options.length > INITIAL_OPTIONS_LIMIT;
  const visibleOptions = showAll ? options : options.slice(0, INITIAL_OPTIONS_LIMIT);
  const hiddenCount = options.length - INITIAL_OPTIONS_LIMIT;

  return (
    <div className="space-y-2">
      {visibleOptions.map((option, index) => {
        const isChecked = selectedValue === option.value;

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
              type="radio"
              name={filterName}
              value={option.value}
              checked={isChecked}
              onChange={() => onValueChange(option.value)}
              className="w-4 h-4 rounded-full border-gray-400 text-blue-600 focus:ring-blue-500 focus:ring-2 transition-all duration-200"
              aria-label={option.label}
            />
            <span className="ml-3 text-sm transition-colors duration-200">
              {option.label}
            </span>
          </motion.label>
        );
      })}
      
      {hasMoreOptions && (
        <motion.button
          type="button"
          onClick={() => setShowAll(!showAll)}
          className={cn(
            "w-full flex items-center justify-center gap-2 py-2 px-2 mt-2 text-sm font-medium text-blue-600",
            "hover:bg-blue-50 rounded-md transition-colors duration-200",
            "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          )}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: prefersReducedMotion ? 0.01 : 0.2 }}
        >
          {showAll ? (
            <>
              <span>Ver menos</span>
              <ChevronUp className="w-4 h-4" />
            </>
          ) : (
            <>
              <span>Ver más ({hiddenCount} más)</span>
              <ChevronDown className="w-4 h-4" />
            </>
          )}
        </motion.button>
      )}
    </div>
  );
}

