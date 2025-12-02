/**
 * Tipos TypeScript para el sistema de filtros dinámicos
 * Basado en la estructura de respuesta de la API /api/filters/by-context
 */

/**
 * Modo de operador: column (un operador para todos) o per-value (operador por valor)
 */
export type OperatorMode = "column" | "per-value";

/**
 * Tipo de valores: manual, dynamic, o mixed (combinación)
 */
export type ValueConfigType = "manual" | "dynamic" | "mixed";

/**
 * Tipos de display para filtros
 */
export type DisplayType = "checkbox" | "radio" | "range" | "slider" | "list";

/**
 * Operadores disponibles para filtros
 */
export type FilterOperator =
  | "equal"
  | "not_equal"
  | "range"
  | "greater_than"
  | "less_than"
  | "greater_than_or_equal"
  | "less_than_or_equal"
  | "contains"
  | "in"
  | "not_in";

/**
 * Valor dinámico seleccionado (desde la API)
 */
export interface DynamicValue {
  value: string;
}

/**
 * Valor manual con etiqueta opcional
 */
export interface ManualValue {
  value: string;
  label?: string;
  operator?: FilterOperator; // Solo en modo per-value
}

/**
 * Rango manual con operador opcional
 */
export interface ManualRange {
  label: string;
  min: number;
  max: number;
  operator?: FilterOperator; // Solo en modo per-value
}

/**
 * Valor dinámico con operador (modo per-value)
 */
export interface DynamicValueWithOperator {
  value: string;
  operator: FilterOperator;
}

/**
 * Configuración de valores para filtros
 */
export interface ValueConfig {
  type: ValueConfigType;
  
  // Para type: "dynamic"
  selectedValues?: DynamicValue[];
  
  // Para type: "manual"
  values?: ManualValue[];
  ranges?: ManualRange[];
  
  // Para type: "mixed"
  dynamicValues?: DynamicValueWithOperator[];
  manualValues?: ManualValue[];
  ranges?: ManualRange[]; // Rangos también pueden estar en mixed
}

/**
 * Scope (alcance) del filtro - define dónde se aplica
 */
export interface FilterScope {
  categories: string[]; // Array de UUIDs de categorías
  menus: string[]; // Array de UUIDs de menús
  submenus: string[]; // Array de UUIDs de submenús
}

/**
 * Orden de los filtros por contexto
 */
export interface FilterOrder {
  categories: Record<string, number>; // UUID -> order number
  menus: Record<string, number>;
  submenus: Record<string, number>;
}

/**
 * Configuración completa de un filtro dinámico
 */
export interface DynamicFilterConfig {
  id: string;
  sectionName: string;
  column: string;
  operator: FilterOperator;
  operatorMode: OperatorMode;
  valueConfig: ValueConfig;
  displayType: DisplayType;
  scope: FilterScope;
  order: FilterOrder;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Respuesta de la API de filtros
 */
export interface FiltersApiResponse {
  success: boolean;
  data: DynamicFilterConfig[];
  message?: string;
  errors?: string[];
}

/**
 * Estado de selección de un filtro dinámico
 * Mapea el ID del filtro a sus valores seleccionados
 */
export interface DynamicFilterState {
  [filterId: string]: {
    // Para checkbox/radio con valores simples
    values?: string[];
    // Para range/slider
    min?: number;
    max?: number;
    // Para rangos seleccionados (por label)
    ranges?: string[];
  };
}

/**
 * Parámetros para obtener filtros por contexto
 */
export interface FiltersByContextParams {
  categoriaUuid?: string;
  menuUuid?: string;
  submenuUuid?: string;
}

