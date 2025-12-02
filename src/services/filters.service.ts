/**
 * Servicio para obtener filtros dinámicos desde la API
 */

import { apiGet } from "@/lib/api-client";
import type {
  FiltersApiResponse,
  DynamicFilterConfig,
  FiltersByContextParams,
} from "@/types/filters";

/**
 * Obtiene filtros dinámicos según el contexto (categoría, menú, submenú)
 * 
 * @param params - Parámetros de contexto (categoriaUuid, menuUuid, submenuUuid)
 * @returns Promise con la respuesta de la API de filtros
 * 
 * @example
 * const filters = await getFiltersByContext({
 *   categoriaUuid: "2119a685-3a03-437f-8dd6-a8eb1ce7836d",
 *   menuUuid: "1ab46627-719d-4318-b6e4-5692ea46c4ee",
 * });
 */
export async function getFiltersByContext(
  params: FiltersByContextParams
): Promise<{ success: boolean; data: DynamicFilterConfig[]; message?: string }> {
  try {
    // Construir query params
    const queryParams = new URLSearchParams();
    
    if (params.categoriaUuid) {
      queryParams.append("categoriaUuid", params.categoriaUuid);
    }
    if (params.menuUuid) {
      queryParams.append("menuUuid", params.menuUuid);
    }
    if (params.submenuUuid) {
      queryParams.append("submenuUuid", params.submenuUuid);
    }

    const endpoint = `/api/filters/by-context?${queryParams.toString()}`;
    const response = await apiGet<FiltersApiResponse>(endpoint);

    // Si la respuesta tiene la estructura { success, data }
    if (response && typeof response === "object" && "success" in response) {
      return {
        success: response.success,
        data: response.data || [],
        message: response.message,
      };
    }

    // Fallback: asumir que la respuesta es directamente el array de filtros
    if (Array.isArray(response)) {
      return {
        success: true,
        data: response,
      };
    }

    // Si no tiene la estructura esperada, retornar vacío
    console.warn("Unexpected response format from filters API:", response);
    return {
      success: false,
      data: [],
      message: "Formato de respuesta inesperado",
    };
  } catch (error) {
    console.error("Error fetching filters by context:", error);
    return {
      success: false,
      data: [],
      message: error instanceof Error ? error.message : "Error al cargar filtros",
    };
  }
}

