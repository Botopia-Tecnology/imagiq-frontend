/**
 * Hook para manejar la selección inteligente de productos
 * - Filtra colores y capacidades basado en las selecciones mutuas
 * - Calcula precios y SKUs dinámicamente según las opciones seleccionadas
 * - Maneja la lógica de arrays indexados donde cada índice representa un producto único
 */

import { useState, useMemo, useCallback, useEffect } from 'react';
import { ProductApiData } from '@/lib/api';

export interface ProductVariant {
  index: number;
  color: string;
  capacity: string;
  sku: string;
  ean: string;
  codigoMarket: string;
  precioNormal: number;
  precioeccommerce: number;
  stock: number;
  imagePreviewUrl?: string;
}

export interface SelectionState {
  selectedColor: string | null;
  selectedCapacity: string | null;
  selectedVariant: ProductVariant | null;
}

export interface UseProductSelectionReturn {
  // Estado de selección
  selection: SelectionState;
  
  // Opciones disponibles filtradas
  availableColors: string[];
  availableCapacities: string[];
  
  // Información del producto seleccionado
  selectedSku: string | null;
  selectedCodigoMarket: string | null;
  selectedPrice: number | null;
  selectedOriginalPrice: number | null;
  selectedDiscount: number | null;
  selectedStock: number | null;
  selectedVariant: ProductVariant | null;
  
  // Funciones de selección
  selectColor: (color: string) => void;
  selectCapacity: (capacity: string) => void;
  resetSelection: () => void;
  
  // Información de debug
  allVariants: ProductVariant[];
}

export function useProductSelection(apiProduct: ProductApiData): UseProductSelectionReturn {
  // Crear todas las variantes del producto basadas en los arrays indexados
  const allVariants = useMemo((): ProductVariant[] => {
    const variants: ProductVariant[] = [];
    
    // Asegurar que todos los arrays tengan el mismo tamaño
    const maxLength = Math.max(
      apiProduct.color.length,
      apiProduct.capacidad.length,
      apiProduct.sku.length,
      apiProduct.ean.length,
      apiProduct.codigoMarket.length,
      apiProduct.precioNormal.length,
      apiProduct.precioeccommerce.length,
      apiProduct.stock.length
    );
    
    for (let i = 0; i < maxLength; i++) {
      variants.push({
        index: i,
        color: apiProduct.color[i] || '',
        capacity: apiProduct.capacidad[i] || '',
        sku: apiProduct.sku[i] || '',
        ean: apiProduct.ean[i] || '',
        codigoMarket: apiProduct.codigoMarket[i] || '',
        precioNormal: apiProduct.precioNormal[i] || 0,
        precioeccommerce: apiProduct.precioeccommerce[i] || 0,
        stock: apiProduct.stock[i] || 0,
        imagePreviewUrl: apiProduct.imagePreviewUrl?.[i]
      });
    }
    
    return variants;
  }, [apiProduct]);

  // Estado de selección - inicializar con la primera variante disponible
  const [selection, setSelection] = useState<SelectionState>(() => {
    // Si hay variantes disponibles, seleccionar la primera
    if (allVariants.length > 0) {
      const firstVariant = allVariants[0];
      return {
        selectedColor: firstVariant.color,
        selectedCapacity: firstVariant.capacity,
        selectedVariant: firstVariant
      };
    }
    
    return {
      selectedColor: null,
      selectedCapacity: null,
      selectedVariant: null
    };
  });

  // Actualizar la selección cuando cambien las variantes disponibles
  useEffect(() => {
    // Si no hay selección actual y hay variantes disponibles, seleccionar la primera
    if (!selection.selectedColor && !selection.selectedCapacity && allVariants.length > 0) {
      const firstVariant = allVariants[0];
      setSelection({
        selectedColor: firstVariant.color,
        selectedCapacity: firstVariant.capacity,
        selectedVariant: firstVariant
      });
    }
  }, [allVariants, selection.selectedColor, selection.selectedCapacity]);

  // Colores únicos disponibles
  const availableColors = useMemo(() => {
    const colors = new Set<string>();
    
    allVariants.forEach(variant => {
      if (variant.color && variant.color.trim() !== '') {
        colors.add(variant.color);
      }
    });
    
    return Array.from(colors);
  }, [allVariants]);

  // Capacidades únicas disponibles
  const availableCapacities = useMemo(() => {
    const capacities = new Set<string>();
    
    allVariants.forEach(variant => {
      if (variant.capacity && variant.capacity.trim() !== '' && variant.capacity.toLowerCase() !== 'no aplica') {
        capacities.add(variant.capacity);
      }
    });
    
    return Array.from(capacities);
  }, [allVariants]);

  // Filtrar variantes basado en las selecciones actuales
  const filteredVariants = useMemo(() => {
    return allVariants.filter(variant => {
      const colorMatch = !selection.selectedColor || variant.color === selection.selectedColor;
      const capacityMatch = !selection.selectedCapacity || variant.capacity === selection.selectedCapacity;
      return colorMatch && capacityMatch;
    });
  }, [allVariants, selection.selectedColor, selection.selectedCapacity]);

  // Colores disponibles basado en la capacidad seleccionada
  const availableColorsFiltered = useMemo(() => {
    if (!selection.selectedCapacity) {
      return availableColors;
    }
    
    const colors = new Set<string>();
    allVariants.forEach(variant => {
      if (variant.capacity === selection.selectedCapacity && variant.color && variant.color.trim() !== '') {
        colors.add(variant.color);
      }
    });
    
    return Array.from(colors);
  }, [allVariants, selection.selectedCapacity, availableColors]);

  // Capacidades disponibles basado en el color seleccionado
  const availableCapacitiesFiltered = useMemo(() => {
    if (!selection.selectedColor) {
      return availableCapacities;
    }
    
    const capacities = new Set<string>();
    allVariants.forEach(variant => {
      if (variant.color === selection.selectedColor && variant.capacity && variant.capacity.trim() !== '' && variant.capacity.toLowerCase() !== 'no aplica') {
        capacities.add(variant.capacity);
      }
    });
    
    return Array.from(capacities);
  }, [allVariants, selection.selectedColor, availableCapacities]);

  // Variante seleccionada actualmente
  const selectedVariant = useMemo(() => {
    if (!selection.selectedColor || !selection.selectedCapacity) {
      return null;
    }
    
    return allVariants.find(variant => 
      variant.color === selection.selectedColor && 
      variant.capacity === selection.selectedCapacity
    ) || null;
  }, [allVariants, selection.selectedColor, selection.selectedCapacity]);

  // Información del producto seleccionado
  const selectedSku = selectedVariant?.sku || null;
  const selectedCodigoMarket = selectedVariant?.codigoMarket || null;
  const selectedPrice = selectedVariant?.precioeccommerce || null;
  const selectedOriginalPrice = selectedVariant?.precioNormal || null;
  const selectedDiscount = selectedPrice && selectedOriginalPrice && selectedPrice < selectedOriginalPrice 
    ? Math.round(((selectedOriginalPrice - selectedPrice) / selectedOriginalPrice) * 100)
    : null;
  const selectedStock = selectedVariant?.stock || null;

  // Funciones de selección
  const selectColor = useCallback((color: string) => {
    setSelection(prev => {
      const newSelection = { ...prev, selectedColor: color };
      
      // Si la capacidad actual no es compatible con el nuevo color, resetear capacidad
      if (prev.selectedCapacity) {
        const compatibleCapacity = allVariants.some(variant => 
          variant.color === color && variant.capacity === prev.selectedCapacity
        );
        
        if (!compatibleCapacity) {
          newSelection.selectedCapacity = null;
        }
      }
      
      return newSelection;
    });
  }, [allVariants]);

  const selectCapacity = useCallback((capacity: string) => {
    setSelection(prev => {
      const newSelection = { ...prev, selectedCapacity: capacity };
      
      // Si el color actual no es compatible con la nueva capacidad, resetear color
      if (prev.selectedColor) {
        const compatibleColor = allVariants.some(variant => 
          variant.capacity === capacity && variant.color === prev.selectedColor
        );
        
        if (!compatibleColor) {
          newSelection.selectedColor = null;
        }
      }
      
      return newSelection;
    });
  }, [allVariants]);

  const resetSelection = useCallback(() => {
    setSelection({
      selectedColor: null,
      selectedCapacity: null,
      selectedVariant: null
    });
  }, []);

  return {
    selection,
    availableColors: availableColorsFiltered,
    availableCapacities: availableCapacitiesFiltered,
    selectedSku,
    selectedCodigoMarket,
    selectedPrice,
    selectedOriginalPrice,
    selectedDiscount,
    selectedStock,
    selectedVariant,
    selectColor,
    selectCapacity,
    resetSelection,
    allVariants
  };
}
