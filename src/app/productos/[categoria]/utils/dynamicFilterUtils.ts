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
 * Estructura intermedia para manejar múltiples valores del mismo parámetro
 * Ahora soporta sintaxis extendida: column_operator=value
 */
interface ApiFiltersWithArrays {
  [key: string]: string | number | boolean | (string | number)[];
}

/**
 * Genera el nombre del query param con sintaxis extendida: column_operator
 * Convierte el nombre de la columna a lowercase y agrega el operador
 */
function getExtendedQueryParamName(column: string, operator: FilterOperator): string {
  // Convertir columna a lowercase para la sintaxis extendida
  const normalizedColumn = column.toLowerCase();
  return `${normalizedColumn}_${operator}`;
}

/**
 * Genera el nombre del query param para rangos: column_range_min o column_range_max
 */
function getRangeQueryParamName(column: string, rangeType: "min" | "max"): string {
  const normalizedColumn = column.toLowerCase();
  return `${normalizedColumn}_range_${rangeType}`;
}

/**
 * Convierte filtros dinámicos seleccionados a parámetros de API
 * 
 * @param filterState - Estado de filtros dinámicos seleccionados
 * @param dynamicFilterConfigs - Configuraciones de filtros dinámicos disponibles
 * @returns Objeto con parámetros de API para filtrar productos
 * 
 * Nota: Para operadores "equal" con múltiples valores, se crean arrays que luego
 * se convertirán a múltiples query params (ej: nombreColor=Rojo&nombreColor=Azul)
 */
export function convertDynamicFiltersToApi(
  filterState: DynamicFilterState,
  dynamicFilterConfigs: DynamicFilterConfig[]
): Partial<ApiFilters> {
  // Usar estructura intermedia que permite arrays
  const apiFiltersWithArrays: ApiFiltersWithArrays = {};

  // Procesar cada filtro dinámico seleccionado
  for (const filter of dynamicFilterConfigs) {
    const state = filterState[filter.id];
    if (!state) continue;

    const { column, operator, operatorMode, valueConfig } = filter;

    // Procesar según el modo de operador
    if (operatorMode === "column") {
      // Un operador para todos los valores
      processColumnModeFilter(
        apiFiltersWithArrays,
        column,
        operator,
        valueConfig,
        state
      );
    } else if (operatorMode === "per-value") {
      // Operador por valor
      processPerValueModeFilter(
        apiFiltersWithArrays,
        column,
        valueConfig,
        state
      );
    }
  }

  // Convertir arrays a formato compatible con ApiFilters
  // Los arrays se manejarán en la construcción de query params
  return convertToApiFilters(apiFiltersWithArrays);
}

/**
 * Convierte la estructura intermedia a ApiFilters
 * Para campos con arrays (especialmente con sintaxis extendida), se unen con comas
 * La construcción real de query params se hace en api.ts, que detectará la sintaxis extendida
 * y creará múltiples query params cuando sea necesario
 */
function convertToApiFilters(
  filtersWithArrays: ApiFiltersWithArrays
): Partial<ApiFilters & Record<string, string | number | boolean>> {
  const apiFilters: Partial<ApiFilters & Record<string, string | number | boolean>> = {};

  for (const [key, value] of Object.entries(filtersWithArrays)) {
    if (Array.isArray(value)) {
      // Para arrays, unir con comas
      // api.ts detectará si el key tiene sintaxis extendida y creará múltiples query params
      apiFilters[key] = value.join(",");
    } else {
      apiFilters[key] = value;
    }
  }

  return apiFilters;
}

/**
 * Procesa un filtro en modo column (un operador para todos)
 */
function processColumnModeFilter(
  apiFilters: ApiFiltersWithArrays,
  column: string,
  operator: FilterOperator,
  valueConfig: DynamicFilterConfig["valueConfig"],
  state: DynamicFilterState[string]
) {
  // Para operador range, procesar rangos usando sintaxis extendida
  if (operator === "range") {
    if (state.ranges && state.ranges.length > 0) {
      processRanges(apiFilters, column, state.ranges, valueConfig);
    } else if (state.min !== undefined || state.max !== undefined) {
      // Slider: min/max directos - usar sintaxis extendida para rangos
      setRangeFilter(apiFilters, column, state.min, state.max);
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
  apiFilters: ApiFiltersWithArrays,
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

  // Procesar rangos con operadores (usando sintaxis extendida)
  if (state.ranges && state.ranges.length > 0) {
    if (valueConfig.type === "manual" && valueConfig.ranges) {
      for (const selectedRangeLabel of state.ranges) {
        const range = valueConfig.ranges.find(
          (r) => r.label === selectedRangeLabel
        );
        if (range) {
          const rangeOperator = range.operator || "range";
          if (rangeOperator === "range") {
            // Usar sintaxis extendida: column_range_min y column_range_max
            setRangeFilter(apiFilters, column, range.min, range.max);
          } else {
            // Otros operadores con rangos - usar sintaxis extendida
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
            // Usar sintaxis extendida: column_range_min y column_range_max
            setRangeFilter(apiFilters, column, range.min, range.max);
          } else {
            // Otros operadores con rangos - usar sintaxis extendida
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
  apiFilters: ApiFiltersWithArrays,
  column: string,
  operator: FilterOperator,
  values: string[],
  valueConfig: DynamicFilterConfig["valueConfig"]
) {
  switch (operator) {
    case "equal":
      // Para "equal", crear múltiples query params (uno por valor)
      // Guardar como array para que se procese correctamente
      setFilterValueArray(apiFilters, column, values, "equal");
      break;

    case "not_equal":
      // Valores a excluir - también crear múltiples params
      setFilterValueArray(apiFilters, column, values, "not_equal");
      break;

    case "in":
      // Valores en lista - crear múltiples params
      setFilterValueArray(apiFilters, column, values, "in");
      break;

    case "not_in":
      // Valores no en lista - crear múltiples params
      setFilterValueArray(apiFilters, column, values, "not_in");
      break;

    case "contains":
      // Contiene texto (para búsquedas) - crear múltiples params
      setFilterValueArray(apiFilters, column, values, "contains");
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
  apiFilters: ApiFiltersWithArrays,
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
 * Establece múltiples valores de filtro (para operadores que requieren múltiples query params)
 * Usa sintaxis extendida: column_operator=value1&column_operator=value2
 */
function setFilterValueArray(
  apiFilters: ApiFiltersWithArrays,
  column: string,
  values: string[],
  operator: FilterOperator
) {
  // Usar sintaxis extendida: column_operator
  const queryParamName = getExtendedQueryParamName(column, operator);

  // Para operadores que requieren múltiples query params, crear array
  const multiParamOperators = ["equal", "not_equal", "in", "not_in", "contains", "starts_with", "ends_with"];
  if (multiParamOperators.includes(operator)) {
    const currentValue = apiFilters[queryParamName];
    if (Array.isArray(currentValue)) {
      // Si ya hay un array, agregar los nuevos valores
      apiFilters[queryParamName] = [...currentValue, ...values];
    } else if (currentValue !== undefined) {
      // Si hay un valor existente, convertirlo a array y agregar nuevos
      apiFilters[queryParamName] = [String(currentValue), ...values];
    } else {
      // Crear nuevo array
      apiFilters[queryParamName] = values;
    }
  }
}

/**
 * Establece un valor de filtro en los parámetros de API
 * Usa sintaxis extendida: column_operator=value
 */
function setFilterValue(
  apiFilters: ApiFiltersWithArrays,
  column: string,
  value: string | number,
  operator: FilterOperator
) {
  // Usar sintaxis extendida: column_operator
  const queryParamName = getExtendedQueryParamName(column, operator);

  switch (operator) {
    case "equal":
      // Para igualdad, agregar al array si ya existe, sino crear nuevo
      const currentValue = apiFilters[queryParamName];
      if (Array.isArray(currentValue)) {
        apiFilters[queryParamName] = [...currentValue, String(value)];
      } else if (currentValue !== undefined) {
        apiFilters[queryParamName] = [String(currentValue), String(value)];
      } else {
        apiFilters[queryParamName] = String(value);
      }
      break;

    case "not_equal":
      // Para not_equal, usar sintaxis extendida
      const currentNotEqual = apiFilters[queryParamName];
      if (Array.isArray(currentNotEqual)) {
        apiFilters[queryParamName] = [...currentNotEqual, String(value)];
      } else if (currentNotEqual !== undefined) {
        apiFilters[queryParamName] = [String(currentNotEqual), String(value)];
      } else {
        apiFilters[queryParamName] = String(value);
      }
      break;

    case "greater_than":
    case "greater_than_or_equal":
      // Para operadores de comparación numérica, usar el valor directamente
      if (typeof value === "number") {
        const currentNumValue = apiFilters[queryParamName];
        if (typeof currentNumValue === "number") {
          // Si ya hay un valor, usar el mayor (para greater_than) o el mayor (para greater_than_or_equal)
          apiFilters[queryParamName] = Math.max(currentNumValue, value);
        } else {
          apiFilters[queryParamName] = value;
        }
      } else {
        apiFilters[queryParamName] = String(value);
      }
      break;

    case "less_than":
    case "less_than_or_equal":
      // Para operadores de comparación numérica, usar el valor directamente
      if (typeof value === "number") {
        const currentNumValue = apiFilters[queryParamName];
        if (typeof currentNumValue === "number") {
          // Si ya hay un valor, usar el menor (para less_than) o el menor (para less_than_or_equal)
          apiFilters[queryParamName] = Math.min(currentNumValue, value);
        } else {
          apiFilters[queryParamName] = value;
        }
      } else {
        apiFilters[queryParamName] = String(value);
      }
      break;

    case "in":
    case "not_in":
    case "contains":
    case "starts_with":
    case "ends_with":
      // Para estos operadores, agregar al array si es necesario
      const currentValueForIn = apiFilters[queryParamName];
      if (Array.isArray(currentValueForIn)) {
        apiFilters[queryParamName] = [...currentValueForIn, String(value)];
      } else if (currentValueForIn !== undefined) {
        apiFilters[queryParamName] = [String(currentValueForIn), String(value)];
      } else {
        apiFilters[queryParamName] = String(value);
      }
      break;

    default:
      console.warn(`Unknown operator: ${operator} for column ${column}`);
  }
}

/**
 * Establece un filtro de rango (min/max)
 * Usa sintaxis extendida: column_range_min y column_range_max
 */
function setRangeFilter(
  apiFilters: ApiFiltersWithArrays,
  column: string,
  min: number | undefined,
  max: number | undefined
) {
  // Usar sintaxis extendida para rangos: column_range_min y column_range_max
  if (min !== undefined) {
    const minParamName = getRangeQueryParamName(column, "min");
    const currentMin = apiFilters[minParamName];
    if (typeof currentMin === "number") {
      // Si ya hay un valor, usar el mayor
      apiFilters[minParamName] = Math.max(currentMin, min);
    } else {
      apiFilters[minParamName] = min;
    }
  }
  
  if (max !== undefined) {
    const maxParamName = getRangeQueryParamName(column, "max");
    const currentMax = apiFilters[maxParamName];
    if (typeof currentMax === "number") {
      // Si ya hay un valor, usar el menor
      apiFilters[maxParamName] = Math.min(currentMax, max);
    } else {
      apiFilters[maxParamName] = max;
    }
  }
}

