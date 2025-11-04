/**
 * Hook para manejar la selección inteligente de productos
 * - Filtra colores y capacidades basado en las selecciones mutuas
 * - Calcula precios y SKUs dinámicamente según las opciones seleccionadas
 * - Maneja la lógica de arrays indexados donde cada índice representa un producto único
 */

import { useState, useMemo, useCallback, useEffect } from 'react';
import { ProductApiData } from '@/lib/api';
// colorMap deprecado: el API ahora entrega hex

export interface ProductVariant {
  index: number;
  color: string;
  capacity: string;
  memoriaram: string;
  sku: string;
  skuPostback: string;
  ean: string;
  codigoMarket: string;
  precioNormal: number;
  precioeccommerce: number;
  stockTotal: number;
  imagePreviewUrl?: string;
  urlRender3D?: string;
}

export interface SelectionState {
  selectedColor: string | null;
  selectedCapacity: string | null;
  selectedMemoriaram: string | null;
  selectedVariant: ProductVariant | null;
}

// Interfaces compatibles para componentes legacy
export interface ColorOption {
  color: string;
  nombreColorDisplay: string | null;
  hex: string;
  variants: ProductVariant[];
}

export interface StorageOption {
  capacidad: string;
  variants: ProductVariant[];
}

export interface UseProductSelectionReturn {
  // Estado de selección
  selection: SelectionState;
  
  // Opciones disponibles filtradas
  availableColors: string[];
  availableCapacities: string[];
  availableMemoriaram: string[];
  
  // Información del producto seleccionado
  selectedSku: string | null;
  selectedSkuPostback: string | null;
  selectedCodigoMarket: string | null;
  selectedPrice: number | null;
  selectedOriginalPrice: number | null;
  selectedDiscount: number | null;
  selectedStockTotal: number | null;
  selectedVariant: ProductVariant | null;
  
  // Funciones de selección
  selectColor: (color: string) => void;
  selectCapacity: (capacity: string) => void;
  selectMemoriaram: (memoriaram: string) => void;
  resetSelection: () => void;
  
  // Funciones helper para compatibilidad con componentes legacy
  getColorOptions: () => ColorOption[];
  getStorageOptions: () => StorageOption[];
  getSelectedColorOption: () => ColorOption | null;
  getSelectedStorageOption: () => StorageOption | null;
  
  // Información de debug
  allVariants: ProductVariant[];

}

export function useProductSelection(apiProduct: ProductApiData, productColors?: Array<{label: string, hex: string}>): UseProductSelectionReturn {  
  // Crear todas las variantes del producto basadas en los arrays indexados
  const allVariants = useMemo((): ProductVariant[] => {
    const variants: ProductVariant[] = [];
    
    // Asegurar que todos los arrays tengan el mismo tamaño
    const maxLength = Math.max(
      apiProduct.color.length,
      apiProduct.capacidad.length,
      apiProduct.memoriaram.length,
      apiProduct.sku.length,
      apiProduct.ean.length,
      apiProduct.codigoMarket.length,
      apiProduct.precioNormal.length,
      apiProduct.precioeccommerce.length,
      apiProduct.stockTotal.length
    );
    
    for (let i = 0; i < maxLength; i++) {
      variants.push({
        index: i,
        color: apiProduct.color[i] || '',
        capacity: apiProduct.capacidad[i] || '',
        memoriaram: apiProduct.memoriaram[i] || '',
        sku: apiProduct.sku[i] || '',
        skuPostback: apiProduct.skuPostback?.[i] || '',
        ean: apiProduct.ean[i] || '',
        codigoMarket: apiProduct.codigoMarket[i] || '',
        precioNormal: apiProduct.precioNormal[i] || 0,
        precioeccommerce: apiProduct.precioeccommerce[i] || 0,
        stockTotal: apiProduct.stockTotal[i] || 0,
        imagePreviewUrl: apiProduct.imagePreviewUrl?.[i],
        urlRender3D: apiProduct.urlRender3D?.[i]
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
        selectedMemoriaram: firstVariant.memoriaram,
        selectedVariant: firstVariant
      };
    }
    
    return {
      selectedColor: null,
      selectedCapacity: null,
      selectedMemoriaram: null,
      selectedVariant: null
    };
  });

  // Actualizar la selección cuando cambien las variantes disponibles
  useEffect(() => {
    // Si no hay selección actual y hay variantes disponibles, seleccionar la primera
    if (!selection.selectedColor && !selection.selectedCapacity && !selection.selectedMemoriaram && allVariants.length > 0) {
      const firstVariant = allVariants[0];
      setSelection({
        selectedColor: firstVariant.color,
        selectedCapacity: firstVariant.capacity,
        selectedMemoriaram: firstVariant.memoriaram,
        selectedVariant: firstVariant
      });
    }
  }, [allVariants, selection.selectedColor, selection.selectedCapacity, selection.selectedMemoriaram]);

  // Colores disponibles basado en la capacidad y memoria RAM seleccionadas
  const availableColorsFiltered = useMemo(() => {
    const colors = new Set<string>();
    
    for (const variant of allVariants) {
      const capacityMatch = !selection.selectedCapacity || variant.capacity === selection.selectedCapacity;
      const memoriaramMatch = !selection.selectedMemoriaram || variant.memoriaram === selection.selectedMemoriaram;
      
      if (capacityMatch && memoriaramMatch && variant.color && variant.color.trim() !== '') {
        colors.add(variant.color);
      }
    }
    
    return Array.from(colors);
  }, [allVariants, selection.selectedCapacity, selection.selectedMemoriaram]);

  // Capacidades disponibles basado en el color y memoria RAM seleccionados
  const availableCapacitiesFiltered = useMemo(() => {
    const capacities = new Set<string>();
    
    for (const variant of allVariants) {
      const colorMatch = !selection.selectedColor || variant.color === selection.selectedColor;
      const memoriaramMatch = !selection.selectedMemoriaram || variant.memoriaram === selection.selectedMemoriaram;
      
      if (colorMatch && memoriaramMatch && variant.capacity && variant.capacity.trim() !== '' && variant.capacity.toLowerCase() !== 'no aplica') {
        capacities.add(variant.capacity);
      }
    }
    
    return Array.from(capacities);
  }, [allVariants, selection.selectedColor, selection.selectedMemoriaram]);

  // Memoria RAM disponible basado en el color y capacidad seleccionados
  const availableMemoriaramFiltered = useMemo(() => {
    const memoriaram = new Set<string>();
    
    for (const variant of allVariants) {
      const colorMatch = !selection.selectedColor || variant.color === selection.selectedColor;
      const capacityMatch = !selection.selectedCapacity || variant.capacity === selection.selectedCapacity;
      
      if (colorMatch && capacityMatch && variant.memoriaram && variant.memoriaram.trim() !== '' && variant.memoriaram.toLowerCase() !== 'no aplica') {
        memoriaram.add(variant.memoriaram);
      }
    }
    
    return Array.from(memoriaram);
  }, [allVariants, selection.selectedColor, selection.selectedCapacity]);

  // Variante seleccionada actualmente
  const selectedVariant = useMemo(() => {
    if (!selection.selectedColor || !selection.selectedCapacity || !selection.selectedMemoriaram) {
      return null;
    }
    
    return allVariants.find(variant => 
      variant.color === selection.selectedColor && 
      variant.capacity === selection.selectedCapacity &&
      variant.memoriaram === selection.selectedMemoriaram
    ) || null;
  }, [allVariants, selection.selectedColor, selection.selectedCapacity, selection.selectedMemoriaram]);

  // Información del producto seleccionado
  const selectedSku = selectedVariant?.sku || null;
  const selectedCodigoMarket = selectedVariant?.codigoMarket || null;
  const selectedPrice = selectedVariant?.precioeccommerce || null;
  const selectedOriginalPrice = selectedVariant?.precioNormal || null;
  const selectedDiscount = selectedPrice && selectedOriginalPrice && selectedPrice < selectedOriginalPrice
    ? Math.round(((selectedOriginalPrice - selectedPrice) / selectedOriginalPrice) * 100)
    : null;
  const selectedStockTotal = selectedVariant?.stockTotal ?? null;

  // Funciones de selección
  const selectColor = useCallback((color: string) => {
    setSelection(prev => {
      const newSelection = { ...prev, selectedColor: color };

      // Si la capacidad actual no es compatible con el nuevo color, resetear capacidad
      if (prev.selectedCapacity) {
        const compatibleCapacity = allVariants.some(variant =>
          variant.color === color && variant.capacity === prev.selectedCapacity && variant.memoriaram === prev.selectedMemoriaram
        );

        if (!compatibleCapacity) {
          newSelection.selectedCapacity = null;
        }
      }

      // Si la memoria RAM actual no es compatible con el nuevo color, resetear memoria RAM
      if (prev.selectedMemoriaram) {
        const compatibleMemoriaram = allVariants.some(variant =>
          variant.color === color && variant.capacity === prev.selectedCapacity && variant.memoriaram === prev.selectedMemoriaram
        );

        if (!compatibleMemoriaram) {
          newSelection.selectedMemoriaram = null;
        }
      }

      // Buscar y actualizar selectedVariant con la nueva selección
      if (newSelection.selectedColor && newSelection.selectedCapacity && newSelection.selectedMemoriaram) {
        newSelection.selectedVariant = allVariants.find(variant =>
          variant.color === newSelection.selectedColor &&
          variant.capacity === newSelection.selectedCapacity &&
          variant.memoriaram === newSelection.selectedMemoriaram
        ) || null;
      } else {
        newSelection.selectedVariant = null;
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
          variant.capacity === capacity && variant.color === prev.selectedColor && variant.memoriaram === prev.selectedMemoriaram
        );

        if (!compatibleColor) {
          newSelection.selectedColor = null;
        }
      }

      // Si la memoria RAM actual no es compatible con la nueva capacidad, resetear memoria RAM
      if (prev.selectedMemoriaram) {
        const compatibleMemoriaram = allVariants.some(variant =>
          variant.capacity === capacity && variant.color === prev.selectedColor && variant.memoriaram === prev.selectedMemoriaram
        );

        if (!compatibleMemoriaram) {
          newSelection.selectedMemoriaram = null;
        }
      }

      // Buscar y actualizar selectedVariant con la nueva selección
      if (newSelection.selectedColor && newSelection.selectedCapacity && newSelection.selectedMemoriaram) {
        newSelection.selectedVariant = allVariants.find(variant =>
          variant.color === newSelection.selectedColor &&
          variant.capacity === newSelection.selectedCapacity &&
          variant.memoriaram === newSelection.selectedMemoriaram
        ) || null;
      } else {
        newSelection.selectedVariant = null;
      }

      return newSelection;
    });
  }, [allVariants]);

  const selectMemoriaram = useCallback((memoriaram: string) => {
    setSelection(prev => {
      const newSelection = { ...prev, selectedMemoriaram: memoriaram };

      // Si el color actual no es compatible con la nueva memoria RAM, resetear color
      if (prev.selectedColor) {
        const compatibleColor = allVariants.some(variant =>
          variant.memoriaram === memoriaram && variant.color === prev.selectedColor && variant.capacity === prev.selectedCapacity
        );

        if (!compatibleColor) {
          newSelection.selectedColor = null;
        }
      }

      // Si la capacidad actual no es compatible con la nueva memoria RAM, resetear capacidad
      if (prev.selectedCapacity) {
        const compatibleCapacity = allVariants.some(variant =>
          variant.memoriaram === memoriaram && variant.color === prev.selectedColor && variant.capacity === prev.selectedCapacity
        );

        if (!compatibleCapacity) {
          newSelection.selectedCapacity = null;
        }
      }

      // Buscar y actualizar selectedVariant con la nueva selección
      if (newSelection.selectedColor && newSelection.selectedCapacity && newSelection.selectedMemoriaram) {
        newSelection.selectedVariant = allVariants.find(variant =>
          variant.color === newSelection.selectedColor &&
          variant.capacity === newSelection.selectedCapacity &&
          variant.memoriaram === newSelection.selectedMemoriaram
        ) || null;
      } else {
        newSelection.selectedVariant = null;
      }

      return newSelection;
    });
  }, [allVariants]);

  const resetSelection = useCallback(() => {
    setSelection({
      selectedColor: null,
      selectedCapacity: null,
      selectedMemoriaram: null,
      selectedVariant: null
    });
  }, []);

  // Funciones helper para compatibilidad con componentes legacy
  const getColorOptions = useCallback((): ColorOption[] => {
    return availableColorsFiltered.map(color => {
      // Normalizar el color: trim
      const trimmedColor = color.trim();

      // Detectar si es un color hexadecimal
      const isHexColor = /^#[0-9A-F]{6}$/i.test(trimmedColor);

      let hex: string;

      if (isHexColor) {
        // Si es hexadecimal, usarlo directamente
        hex = trimmedColor;
      } else {
        // Si llega nombre (caso legacy), fallback a gris
        hex = '#808080';
      }

      // Encontrar el nombreColor correspondiente desde el API
      // Buscar la primera variante con este color para obtener su índice
      const firstVariantWithColor = allVariants.find(v => v.color === color);
      const nombreColorDisplay = firstVariantWithColor 
        ? (apiProduct.nombreColor?.[firstVariantWithColor.index] || null)
        : null;

      return {
        color, // Mantener el valor original para lógica interna
        nombreColorDisplay,
        hex,
        variants: allVariants.filter(v => v.color === color)
      };
    });
  }, [availableColorsFiltered, allVariants, apiProduct]);

  const getStorageOptions = useCallback((): StorageOption[] => {
    return availableCapacitiesFiltered.map(capacity => ({
      capacidad: capacity,
      variants: allVariants.filter(v => v.capacity === capacity)
    }));
  }, [availableCapacitiesFiltered, allVariants]);

  const getSelectedColorOption = useCallback((): ColorOption | null => {
    if (!selection.selectedColor) return null;
    const colorOptions = getColorOptions();
    return colorOptions.find(option => option.color === selection.selectedColor) || null;
  }, [selection.selectedColor, getColorOptions]);

  const getSelectedStorageOption = useCallback((): StorageOption | null => {
    if (!selection.selectedCapacity) return null;
    const storageOptions = getStorageOptions();
    return storageOptions.find(option => option.capacidad === selection.selectedCapacity) || null;
  }, [selection.selectedCapacity, getStorageOptions]);

  //END
  return {
    selection,
    availableColors: availableColorsFiltered,
    availableCapacities: availableCapacitiesFiltered,
    availableMemoriaram: availableMemoriaramFiltered,
    selectedSku,
    selectedSkuPostback: selectedVariant?.skuPostback || null,
    selectedCodigoMarket,
    selectedPrice,
    selectedOriginalPrice,
    selectedDiscount,
    selectedStockTotal,
    selectedVariant,
    selectColor,
    selectCapacity,
    selectMemoriaram,
    resetSelection,
    getColorOptions,
    getStorageOptions,
    getSelectedColorOption,
    getSelectedStorageOption,
    allVariants
  };
}
