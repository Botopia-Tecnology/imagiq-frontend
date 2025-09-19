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
  priceRange?: { min: number; max?: number };
  color?: string;
  capacity?: string;
  name?: string;
  withDiscount?: boolean;
  minStock?: number;
  descriptionKeyword?: string;
}

/**
 * Convierte filtros de tipo de accesorio a filtros de API
 */
export function getApiFilters(filters: FilterState): ApiFilters {
  const apiFilters: ApiFilters = {
    subcategory: "Accesorios",
  };

  // Si hay filtros de tipo de accesorio seleccionados, buscar por descripción
  if (filters.tipoAccesorio && filters.tipoAccesorio.length > 0) {
    // Usar el primer filtro seleccionado para buscar
    const selectedType = filters.tipoAccesorio[0];
    const keywords = keywordMap[selectedType];
    if (keywords && keywords.length > 0) {
      // Usar la primera palabra clave como filtro principal
      apiFilters.descriptionKeyword = keywords[0];
      console.log(
        `🔍 Buscando accesorios tipo "${selectedType}" con palabra clave: "${keywords[0]}"`
      );
      console.log(`📋 Palabras clave disponibles: ${keywords.join(", ")}`);
      console.log(`🔧 Filtros API generados:`, apiFilters);
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
    
    const selectedMaterial = filters.material[0];
    const materialKeyword = materialMap[selectedMaterial];
    if (materialKeyword) {
      apiFilters.descriptionKeyword = materialKeyword;
      console.log(`🔍 Buscando material "${selectedMaterial}" con palabra clave: "${materialKeyword}"`);
    }
  }

  // Filtro de color usando query param color
  if (filters.color && filters.color.length > 0) {
    const selectedColor = filters.color[0];
    apiFilters.color = selectedColor;
    console.log(`🎨 Filtrando por color: "${selectedColor}"`);
  }

  // Filtro de características usando desDetallada
  if (filters.caracteristicas && filters.caracteristicas.length > 0) {
    const characteristicsMap: Record<string, string> = {
      "Carga rápida": "Fast",
      "Inalámbrico": "Wireless", 
      "Magnético": "Magnet"
    };
    
    const selectedCharacteristic = filters.caracteristicas[0];
    const characteristicKeyword = characteristicsMap[selectedCharacteristic];
    if (characteristicKeyword) {
      apiFilters.descriptionKeyword = characteristicKeyword;
    }
  }

  // Filtro de rango de precios usando precioMin y precioMax
  if (filters.rangoPrecio && filters.rangoPrecio.length > 0) {
    // Para rangoPrecio, necesitamos buscar el objeto correspondiente en la configuración
    // ya que FilterState solo almacena strings, pero necesitamos los valores min/max
    const priceRanges = [
      { label: "Menos de $50.000", min: 0, max: 50000 },
      { label: "$50.000 - $100.000", min: 50000, max: 100000 },
      { label: "$100.000 - $200.000", min: 100000, max: 200000 },
      { label: "Más de $200.000", min: 200000, max: Infinity },
    ];
    
    const selectedLabel = filters.rangoPrecio[0];
    const selectedPriceRange = priceRanges.find(range => range.label === selectedLabel);
    
    if (selectedPriceRange) {
      apiFilters.priceRange = {
        min: selectedPriceRange.min,
        max: selectedPriceRange.max === Infinity ? undefined : selectedPriceRange.max
      };
      console.log(`💰 Filtrando por rango de precio: ${selectedPriceRange.min} - ${selectedPriceRange.max}`);
    }
  }

  return apiFilters;
}
