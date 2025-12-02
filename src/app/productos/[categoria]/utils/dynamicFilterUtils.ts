/**
 * Utilidades para convertir filtros dinámicos a parámetros de API
 * Maneja diferentes operadores y modos (column vs per-value)
 */

import type {
  DynamicFilterConfig,
  DynamicFilterState,
  FilterOperator,
} from "@/types/filters";
import type { ApiFilters } from "@/lib/sharedInterfaces";

/**
 * Convierte filtros dinámicos seleccionados a parámetros de API
 * 
 * @param filterState - Estado de filtros dinámicos seleccionados
 * @param dynamicFilterConfigs - Configuraciones de filtros dinámicos disponibles
 * @returns Objeto con parámetros de API para filtrar productos
 */
export function convertDynamicFiltersToApi(
  filterState: DynamicFilterState,
  dynamicFilterConfigs: DynamicFilterConfig[]
): Partial<ApiFilters> {
  const apiFilters: Partial<ApiFilters> = {};

  // Procesar cada filtro dinámico seleccionado
  for (const filter of dynamicFilterConfigs) {
    const state = filterState[filter.id];
    if (!state) continue;

    const { column, operator, operatorMode, valueConfig } = filter;

    // Procesar según el modo de operador
    if (operatorMode === "column") {
      // Un operador para todos los valores
      processColumnModeFilter(
        apiFilters,
        column,
        operator,
        valueConfig,
        state
      );
    } else if (operatorMode === "per-value") {
      // Operador por valor
      processPerValueModeFilter(
        apiFilters,
        column,
        valueConfig,
        state
      );
    }
  }

  return apiFilters;
}

/**
 * Procesa un filtro en modo column (un operador para todos)
 */
function processColumnModeFilter(
  apiFilters: Partial<ApiFilters>,
  column: string,
  operator: FilterOperator,
  valueConfig: DynamicFilterConfig["valueConfig"],
  state: DynamicFilterState[string]
) {
  // Para operador range, procesar rangos
  if (operator === "range") {
    if (state.ranges && state.ranges.length > 0) {
      processRanges(apiFilters, column, state.ranges, valueConfig);
    } else if (state.min !== undefined || state.max !== undefined) {
      // Slider: min/max directos
      if (state.min !== undefined) {
        setFilterValue(apiFilters, column, state.min, "greater_than_or_equal");
      }
      if (state.max !== undefined) {
        setFilterValue(apiFilters, column, state.max, "less_than_or_equal");
      }
    }
    return;
  }

  // Para otros operadores, procesar valores
  if (state.values && state.values.length > 0) {
    processValues(apiFilters, column, operator, state.values, valueConfig);
  }
}

/**
 * Procesa un filtro en modo per-value (operador por valor)
 */
function processPerValueModeFilter(
  apiFilters: Partial<ApiFilters>,
  column: string,
  valueConfig: DynamicFilterConfig["valueConfig"],
  state: DynamicFilterState[string]
) {
  // Procesar valores dinámicos con operadores
  if (valueConfig.type === "dynamic" || valueConfig.type === "mixed") {
    if (state.values && state.values.length > 0 && valueConfig.dynamicValues) {
      for (const selectedValue of state.values) {
        const dynamicValue = valueConfig.dynamicValues.find(
          (dv) => dv.value === selectedValue
        );
        if (dynamicValue) {
          setFilterValue(
            apiFilters,
            column,
            selectedValue,
            dynamicValue.operator
          );
        }
      }
    }
  }

  // Procesar valores manuales con operadores
  if (valueConfig.type === "manual" || valueConfig.type === "mixed") {
    if (state.values && state.values.length > 0 && valueConfig.manualValues) {
      for (const selectedValue of state.values) {
        const manualValue = valueConfig.manualValues.find(
          (mv) => mv.value === selectedValue
        );
        if (manualValue && manualValue.operator) {
          setFilterValue(
            apiFilters,
            column,
            selectedValue,
            manualValue.operator
          );
        }
      }
    }
  }

  // Procesar rangos con operadores
  if (state.ranges && state.ranges.length > 0) {
    if (valueConfig.type === "manual" && valueConfig.ranges) {
      for (const selectedRangeLabel of state.ranges) {
        const range = valueConfig.ranges.find(
          (r) => r.label === selectedRangeLabel
        );
        if (range) {
          const rangeOperator = range.operator || "range";
          if (rangeOperator === "range") {
            setRangeFilter(apiFilters, column, range.min, range.max);
          } else {
            // Otros operadores con rangos
            if (rangeOperator === "greater_than_or_equal") {
              setFilterValue(apiFilters, column, range.min, rangeOperator);
            } else if (rangeOperator === "less_than_or_equal") {
              setFilterValue(apiFilters, column, range.max, rangeOperator);
            }
          }
        }
      }
    } else if (valueConfig.type === "mixed" && valueConfig.ranges) {
      for (const selectedRangeLabel of state.ranges) {
        const range = valueConfig.ranges.find(
          (r) => r.label === selectedRangeLabel
        );
        if (range) {
          const rangeOperator = range.operator || "range";
          if (rangeOperator === "range") {
            setRangeFilter(apiFilters, column, range.min, range.max);
          } else {
            if (rangeOperator === "greater_than_or_equal") {
              setFilterValue(apiFilters, column, range.min, rangeOperator);
            } else if (rangeOperator === "less_than_or_equal") {
              setFilterValue(apiFilters, column, range.max, rangeOperator);
            }
          }
        }
      }
    }
  }
}

/**
 * Procesa valores según el operador
 */
function processValues(
  apiFilters: Partial<ApiFilters>,
  column: string,
  operator: FilterOperator,
  values: string[],
  valueConfig: DynamicFilterConfig["valueConfig"]
) {
  switch (operator) {
    case "equal":
      // Múltiples valores iguales se unen con comas
      setFilterValue(apiFilters, column, values.join(","), "equal");
      break;

    case "not_equal":
      // Valores a excluir
      setFilterValue(apiFilters, column, values.join(","), "not_equal");
      break;

    case "in":
      // Valores en lista
      setFilterValue(apiFilters, column, values.join(","), "in");
      break;

    case "not_in":
      // Valores no en lista
      setFilterValue(apiFilters, column, values.join(","), "not_in");
      break;

    case "contains":
      // Contiene texto (para búsquedas)
      setFilterValue(apiFilters, column, values.join(","), "contains");
      break;

    case "greater_than":
    case "less_than":
    case "greater_than_or_equal":
    case "less_than_or_equal":
      // Operadores numéricos - tomar el primer valor
      if (values.length > 0) {
        const numValue = parseFloat(values[0]);
        if (!isNaN(numValue)) {
          setFilterValue(apiFilters, column, numValue, operator);
        }
      }
      break;

    default:
      console.warn(`Unknown operator: ${operator} for column ${column}`);
  }
}

/**
 * Procesa rangos seleccionados
 */
function processRanges(
  apiFilters: Partial<ApiFilters>,
  column: string,
  selectedRangeLabels: string[],
  valueConfig: DynamicFilterConfig["valueConfig"]
) {
  let minPrice: number | undefined;
  let maxPrice: number | undefined;

  // Buscar los rangos en la configuración
  const ranges =
    valueConfig.type === "manual"
      ? valueConfig.ranges
      : valueConfig.type === "mixed"
      ? valueConfig.ranges
      : undefined;

  if (!ranges) return;

  // Calcular min y max de todos los rangos seleccionados
  for (const label of selectedRangeLabels) {
    const range = ranges.find((r) => r.label === label);
    if (range) {
      if (minPrice === undefined || range.min < minPrice) {
        minPrice = range.min;
      }
      if (maxPrice === undefined || range.max > maxPrice) {
        maxPrice = range.max;
      }
    }
  }

  // Aplicar al filtro de API
  if (minPrice !== undefined || maxPrice !== undefined) {
    setRangeFilter(apiFilters, column, minPrice, maxPrice);
  }
}

/**
 * Establece un valor de filtro en los parámetros de API
 */
function setFilterValue(
  apiFilters: Partial<ApiFilters>,
  column: string,
  value: string | number,
  operator: FilterOperator
) {
  // Mapear columnas comunes a campos de API
  const columnMap: Record<string, keyof ApiFilters> = {
    precioNormal: "precioMin",
    precioeccommerce: "precioMin",
    nombreColor: "nombreColor",
    color: "nombreColor",
    stock: "stockMinimo",
    descuento: "conDescuento",
    capacidad: "capacity",
    memoriaram: "memoriaram",
    marca: "name",
    modelo: "model",
  };

  const apiField = columnMap[column] || (column as keyof ApiFilters);

  switch (operator) {
    case "equal":
      // Para igualdad, usar el campo directamente
      if (apiField === "precioMin" || apiField === "precioMax") {
        // Para precios, usar min/max según corresponda
        if (typeof value === "number") {
          if (column.includes("Min") || column === "precioNormal") {
            (apiFilters as any)[apiField] = value;
          } else {
            (apiFilters as any)["precioMax"] = value;
          }
        }
      } else if (apiField === "nombreColor") {
        // Para colores, unir con comas si hay múltiples
        const currentValue = (apiFilters as any)[apiField];
        if (currentValue) {
          (apiFilters as any)[apiField] = `${currentValue},${value}`;
        } else {
          (apiFilters as any)[apiField] = value;
        }
      } else {
        (apiFilters as any)[apiField] = value;
      }
      break;

    case "not_equal":
      // Para not_equal, podríamos necesitar un campo especial
      // Por ahora, usar el campo con un prefijo o sufijo
      console.warn(`not_equal operator not fully supported for ${column}`);
      break;

    case "greater_than":
    case "greater_than_or_equal":
      if (apiField === "precioMin" || apiField === "stockMinimo") {
        const currentValue = (apiFilters as any)[apiField];
        if (typeof value === "number") {
          (apiFilters as any)[apiField] = Math.max(
            currentValue || 0,
            value
          );
        }
      }
      break;

    case "less_than":
    case "less_than_or_equal":
      if (apiField === "precioMin") {
        // Para precios, usar precioMax
        if (typeof value === "number") {
          const currentMax = (apiFilters as any)["precioMax"];
          (apiFilters as any)["precioMax"] = currentMax
            ? Math.min(currentMax, value)
            : value;
        }
      }
      break;

    case "in":
    case "not_in":
    case "contains":
      // Para estos operadores, usar el campo directamente
      (apiFilters as any)[apiField] = value;
      break;

    default:
      console.warn(`Unknown operator: ${operator} for column ${column}`);
  }
}

/**
 * Establece un filtro de rango (min/max)
 */
function setRangeFilter(
  apiFilters: Partial<ApiFilters>,
  column: string,
  min: number | undefined,
  max: number | undefined
) {
  // Mapear columnas de precio
  if (column.includes("precio") || column === "precioNormal") {
    if (min !== undefined) {
      const currentMin = apiFilters.precioMin || 0;
      apiFilters.precioMin = Math.max(currentMin, min);
    }
    if (max !== undefined) {
      const currentMax = apiFilters.precioMax;
      apiFilters.precioMax = currentMax
        ? Math.min(currentMax, max)
        : max;
    }
  } else if (column === "stock") {
    if (min !== undefined) {
      apiFilters.stockMinimo = min;
    }
  } else {
    // Para otras columnas numéricas, usar capacity o el campo correspondiente
    if (min !== undefined || max !== undefined) {
      console.warn(`Range filter not fully supported for column: ${column}`);
    }
  }
}

