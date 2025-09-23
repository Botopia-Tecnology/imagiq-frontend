/** 
 * Funciones utilitarias para la sección de tablets
 */

import type { FilterState } from "../../components/FilterSidebar";
import type { ApiFilters } from "./sharedInterfaces";

/**
 * Convierte filtros de tablets a filtros de API
 */
export function getApiFilters(filters: FilterState): ApiFilters {
  const apiFilters: ApiFilters = {
    subcategory: "Tablets",
  };

  // Aplicar filtros específicos si existen
  if (filters.almacenamiento && filters.almacenamiento.length > 0) {
    // Mapear almacenamiento a capacidad
    const capacityMap: Record<string, string> = {
      "32GB": "32",
      "64GB": "64",
      "128GB": "128", 
      "256GB": "256",
      "512GB": "512"
    };
    
    const capacities = filters.almacenamiento.map(size => capacityMap[size]).filter(Boolean);
    if (capacities.length > 0) {
      apiFilters.capacity = capacities.join(',');
    }
  }

  if (filters.serie && filters.serie.length > 0) {
    // Buscar por serie en el nombre del producto
    apiFilters.descriptionKeyword = filters.serie.join(',');
  }

  if (filters.caracteristicas && filters.caracteristicas.length > 0) {
    // Buscar características específicas en la descripción detallada
    const selectedCharacteristics = filters.caracteristicas;
    const characteristicKeywords: string[] = [];
    
    selectedCharacteristics.forEach(characteristic => {
      if (characteristic === "S Pen") {
        // Buscar " S Pen " en desDetallada
        characteristicKeywords.push(" S Pen ");
      } else if (characteristic === "Carga rápida") {
        // Buscar " Fast " en desDetallada
        characteristicKeywords.push(" Fast ");
      } else if (characteristic === "Carga inalámbrica") {
        // Buscar " Wireless " en desDetallada
        characteristicKeywords.push(" Wireless Charging ");
      }
    });
    
    if (characteristicKeywords.length > 0) {
      // Si ya hay un descriptionKeyword, combinarlo con AND
      if (apiFilters.descriptionKeyword) {
        apiFilters.descriptionKeyword += `&${characteristicKeywords.join(',')}`;
      } else {
        apiFilters.descriptionKeyword = characteristicKeywords.join(',');
      }
    }
  }

  if (filters.uso && filters.uso.length > 0) {
    // Buscar uso en la descripción
    const existingKeywords = apiFilters.descriptionKeyword || '';
    const newKeywords = filters.uso.join(',');
    apiFilters.descriptionKeyword = existingKeywords 
      ? `${existingKeywords},${newKeywords}` 
      : newKeywords;
  }

  // Filtro de conectividad usando desDetallada
  if (filters.conectividad && filters.conectividad.length > 0) {
    const selectedConnectivity = filters.conectividad;
    const connectivityKeywords: string[] = [];
    
    selectedConnectivity.forEach(connectivity => {
      if (connectivity === "Wi-Fi") {
        // Buscar " Wi-Fi " o "WIFI" en desDetallada
        connectivityKeywords.push(" Wi-Fi ", "WIFI");
      } else if (connectivity === "LTE") {
        // Buscar " LTE " en desDetallada
        connectivityKeywords.push(" LTE ");
      } else if (connectivity === "5G") {
        // Buscar " 5G " en desDetallada
        connectivityKeywords.push(" 5G ");
      }
    });
    
    if (connectivityKeywords.length > 0) {
      // Si ya hay un descriptionKeyword, combinarlo con AND
      if (apiFilters.descriptionKeyword) {
        apiFilters.descriptionKeyword += `&${connectivityKeywords.join(',')}`;
      } else {
        apiFilters.descriptionKeyword = connectivityKeywords.join(',');
      }
    }
  }

  // Filtro de color usando query param color
  if (filters.color && filters.color.length > 0) {
    // Para color, usar OR (unión) - múltiples colores separados por coma
    const selectedColors = filters.color;
    apiFilters.color = selectedColors.join(',');
  }

  // Filtro de rango de precios usando query params precioMin y precioMax
  if (filters.rangoPrecio && filters.rangoPrecio.length > 0) {
    const selectedPriceRanges = filters.rangoPrecio;
    
    // Procesar cada rango de precio seleccionado
    let minPrice: number | undefined;
    let maxPrice: number | undefined;
    
    selectedPriceRanges.forEach(range => {
      // Para "Menos de $500.000" usar solo maxPrice
      if (range === "Menos de $500.000") {
        maxPrice = 500000;
      }
      // Para "Más de $2.000.000" usar solo minPrice
      else if (range === "Más de $2.000.000") {
        minPrice = 2000000;
      }
      // Para rangos intermedios, usar ambos valores
      else if (range === "$500.000 - $1.000.000") {
        minPrice = minPrice ? Math.min(minPrice, 500000) : 500000;
        maxPrice = maxPrice ? Math.max(maxPrice, 1000000) : 1000000;
      }
      else if (range === "$1.000.000 - $2.000.000") {
        minPrice = minPrice ? Math.min(minPrice, 1000000) : 1000000;
        maxPrice = maxPrice ? Math.max(maxPrice, 2000000) : 2000000;
      }
    });
    
    // Aplicar los valores de precio a los filtros de API
    if (minPrice !== undefined) {
      apiFilters.precioMin = minPrice;
    }
    if (maxPrice !== undefined) {
      apiFilters.precioMax = maxPrice;
    }
    
  }

  return apiFilters;
}
