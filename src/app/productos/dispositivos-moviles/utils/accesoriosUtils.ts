/**
 * 🔧 ACCESORIOS UTILITIES
 *
 * Funciones utilitarias para la sección de accesorios
 */

import type { FilterState } from "../../components/FilterSidebar";
import { keywordMap } from "../constants/accesoriosConstants";

// Interfaces de tipos necesarias
export interface ApiFilters {
  category?: string;
  subcategory?: string;
  priceRange?: { min: number; max: number };
  color?: string;
  capacity?: string;
  name?: string;
  withDiscount?: boolean;
  minStock?: number;
  descriptionKeyword?: string;
}

/**
 * Convierte filtros de tipo de accesorio a filtros de API
 * Implementa lógica OR dentro del mismo tipo de filtro y AND entre diferentes tipos
 */
export function getApiFilters(filters: FilterState): ApiFilters {
  const apiFilters: ApiFilters = {
    subcategory: "Accesorios",
  };

  // Si hay filtros de tipo de accesorio seleccionados, buscar por descripción
  if (filters.tipoAccesorio && filters.tipoAccesorio.length > 0) {
    // Para tipo de accesorio, usar OR (unión) - múltiples tipos separados por coma
    const selectedTypes = filters.tipoAccesorio;
    const allKeywords: string[] = [];
    
    selectedTypes.forEach(type => {
      const keywords = keywordMap[type];
      if (keywords && keywords.length > 0) {
        allKeywords.push(...keywords);
      }
    });
    
    if (allKeywords.length > 0) {
      // Usar todas las palabras clave separadas por coma para OR
      apiFilters.descriptionKeyword = allKeywords.join(',');
      console.log(`🔍 Buscando accesorios tipos "${selectedTypes.join(', ')}" con palabras clave: "${allKeywords.join(',')}"`);
    }
  }

  // Filtro de material usando palabras específicas en desDetallada
  if (filters.material && filters.material.length > 0) {
    const materialMap: Record<string, string> = {
      "Silicona": "Silicone",
      "Cuero": "Leather", 
      "Metal": "Metal",
      "Plástico": "Plastic",
      "Cristal templado": "Crystal",
      "TPU": "Plastic" // TPU es un tipo de plástico
    };
    
    // Para material, usar OR (unión) - múltiples materiales separados por coma
    const selectedMaterials = filters.material;
    const materialKeywords = selectedMaterials
      .map(material => materialMap[material])
      .filter(Boolean);
    
    if (materialKeywords.length > 0) {
      // Si ya hay un descriptionKeyword, combinarlo con AND
      if (apiFilters.descriptionKeyword) {
        apiFilters.descriptionKeyword += `&${materialKeywords.join(',')}`;
      } else {
        apiFilters.descriptionKeyword = materialKeywords.join(',');
      }
      console.log(`🔍 Buscando materiales "${selectedMaterials.join(', ')}" con palabras clave: "${materialKeywords.join(',')}"`);
    }
  }

  // Filtro de color usando query param color
  if (filters.color && filters.color.length > 0) {
    // Para color, usar OR (unión) - múltiples colores separados por coma
    const selectedColors = filters.color;
    apiFilters.color = selectedColors.join(',');
    console.log(`🎨 Filtrando por colores: "${selectedColors.join(', ')}"`);
  }

  // Filtro de características usando desDetallada
  if (filters.caracteristicas && filters.caracteristicas.length > 0) {
    const characteristicsMap: Record<string, string> = {
      "Carga rápida": "Fast",
      "Inalámbrico": "Wireless", 
      "Magnético": "Magnet"
    };
    
    // Para características, usar OR (unión) - múltiples características separadas por coma
    const selectedCharacteristics = filters.caracteristicas;
    const characteristicKeywords = selectedCharacteristics
      .map(char => characteristicsMap[char])
      .filter(Boolean);
    
    if (characteristicKeywords.length > 0) {
      // Si ya hay un descriptionKeyword, combinarlo con AND
      if (apiFilters.descriptionKeyword) {
        apiFilters.descriptionKeyword += `&${characteristicKeywords.join(',')}`;
      } else {
        apiFilters.descriptionKeyword = characteristicKeywords.join(',');
      }
      console.log(`⚡ Buscando características "${selectedCharacteristics.join(', ')}" con palabras clave: "${characteristicKeywords.join(',')}"`);
    }
  }

  // Filtro de rango de precios usando precioMin y precioMax
  if (filters.rangoPrecio && filters.rangoPrecio.length > 0) {
    // Para rango de precios, usar OR (unión) - tomar el rango más amplio que cubra todos los rangos seleccionados
    const priceRanges = [
      { label: "Menos de $50.000", min: 0, max: 50000 },
      { label: "$50.000 - $100.000", min: 50000, max: 100000 },
      { label: "$100.000 - $200.000", min: 100000, max: 200000 },
      { label: "Más de $200.000", min: 200000, max: Infinity },
    ];
    
    const selectedLabels = filters.rangoPrecio;
    const selectedRanges = selectedLabels
      .map(label => priceRanges.find(range => range.label === label))
      .filter(Boolean);
    
    if (selectedRanges.length > 0) {
      // Calcular el rango más amplio que cubra todos los rangos seleccionados
      const minPrice = Math.min(...selectedRanges.map(range => range!.min));
      const maxPrice = Math.max(...selectedRanges.map(range => range!.max === Infinity ? Number.MAX_SAFE_INTEGER : range!.max));
      
      apiFilters.priceRange = {
        min: minPrice,
        max: maxPrice === Number.MAX_SAFE_INTEGER ? Number.MAX_SAFE_INTEGER : maxPrice
      };
      console.log(`💰 Filtrando por rangos de precio "${selectedLabels.join(', ')}" con rango combinado: ${minPrice} - ${maxPrice === Number.MAX_SAFE_INTEGER ? '∞' : maxPrice}`);
    }
  }

  return apiFilters;
}
