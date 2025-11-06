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
  desDetallada?: string;
  indcerointeres: number;
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
  selectVariant: (variant: ProductVariant) => void;
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
        urlRender3D: apiProduct.urlRender3D?.[i],
        desDetallada: apiProduct.desDetallada?.[i] || '',
        indcerointeres: apiProduct.indcerointeres?.[i] ?? 0,
      });
    }
    
    return variants;
  }, [apiProduct]);

  // Estados para rastrear qué filtros están activos (seleccionados explícitamente por el usuario)
  // Al inicio, aunque selectedColor tenga valores, estos filtros están inactivos hasta que el usuario los seleccione
  const [activeCapacityFilter, setActiveCapacityFilter] = useState<string | undefined>();
  const [activeRamFilter, setActiveRamFilter] = useState<string | undefined>();

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

  // Colores disponibles basado en SOLO los filtros activos (no en la selección actual)
  const availableColorsFiltered = useMemo(() => {
    const colors = new Set<string>();

    for (const variant of allVariants) {
      // Filtrado cruzado: solo mostrar colores que tengan la capacidad y RAM activos
      const capacityMatch = !activeCapacityFilter || variant.capacity === activeCapacityFilter;
      const memoriaramMatch = !activeRamFilter || variant.memoriaram === activeRamFilter;

      if (capacityMatch && memoriaramMatch && variant.color && variant.color.trim() !== '') {
        colors.add(variant.color);
      }
    }

    return Array.from(colors);
  }, [allVariants, activeCapacityFilter, activeRamFilter]);

  // Capacidades disponibles basado en el color seleccionado y RAM activo
  const availableCapacitiesFiltered = useMemo(() => {
    const capacities = new Set<string>();

    for (const variant of allVariants) {
      // Filtrado cruzado: solo mostrar capacidades que tengan el color seleccionado y RAM activo
      const colorMatch = !selection.selectedColor || variant.color === selection.selectedColor;
      const memoriaramMatch = !activeRamFilter || variant.memoriaram === activeRamFilter;

      if (colorMatch && memoriaramMatch && variant.capacity && variant.capacity.trim() !== '' && variant.capacity.toLowerCase() !== 'no aplica') {
        capacities.add(variant.capacity);
      }
    }

    return Array.from(capacities);
  }, [allVariants, selection.selectedColor, activeRamFilter]);

  // Memoria RAM disponible basado en el color seleccionado y capacidad activa
  const availableMemoriaramFiltered = useMemo(() => {
    const memoriaram = new Set<string>();

    for (const variant of allVariants) {
      // Filtrado cruzado: solo mostrar RAM que tengan el color seleccionado y capacidad activa
      const colorMatch = !selection.selectedColor || variant.color === selection.selectedColor;
      const capacityMatch = !activeCapacityFilter || variant.capacity === activeCapacityFilter;

      if (colorMatch && capacityMatch && variant.memoriaram && variant.memoriaram.trim() !== '' && variant.memoriaram.toLowerCase() !== 'no aplica') {
        memoriaram.add(variant.memoriaram);
      }
    }

    return Array.from(memoriaram);
  }, [allVariants, selection.selectedColor, activeCapacityFilter]);

  // Función auxiliar para encontrar la variante exacta que coincida con los parámetros
  const findVariant = useCallback((color: string, capacity?: string, memoriaram?: string) => {
    return allVariants.find((variant) => {
      const matchesColor = variant.color === color;
      const matchesCapacity = !capacity || variant.capacity === capacity;
      const matchesMemoriaram = !memoriaram || variant.memoriaram === memoriaram;

      return matchesColor && matchesCapacity && matchesMemoriaram;
    });
  }, [allVariants]);

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

  // Funciones de selección con lógica de filtros activos
  const selectColor = useCallback((color: string) => {
    // Buscar la primera variante con este color que coincida con los filtros activos
    const variant = findVariant(color, activeCapacityFilter, activeRamFilter);

    if (variant) {
      setSelection({
        selectedColor: variant.color,
        selectedCapacity: variant.capacity,
        selectedMemoriaram: variant.memoriaram,
        selectedVariant: variant
      });
    } else {
      // Si no hay coincidencia con los filtros, buscar cualquier variante de ese color
      const anyVariant = allVariants.find((v) => v.color === color);
      if (anyVariant) {
        setSelection({
          selectedColor: anyVariant.color,
          selectedCapacity: anyVariant.capacity,
          selectedMemoriaram: anyVariant.memoriaram,
          selectedVariant: anyVariant
        });
        // Actualizar los filtros activos con los valores de la nueva variante
        setActiveCapacityFilter(anyVariant.capacity);
        setActiveRamFilter(anyVariant.memoriaram);
      }
    }
  }, [allVariants, findVariant, activeCapacityFilter, activeRamFilter]);

  const selectCapacity = useCallback((capacity: string) => {
    // Activar filtro de capacidad
    setActiveCapacityFilter(capacity);

    if (!selection.selectedColor) return;

    // Buscar la primera variante con este color y capacidad (manteniendo RAM si es compatible)
    const variant = findVariant(selection.selectedColor, capacity, activeRamFilter);
    if (variant) {
      setSelection({
        selectedColor: variant.color,
        selectedCapacity: variant.capacity,
        selectedMemoriaram: variant.memoriaram,
        selectedVariant: variant
      });
    }
  }, [selection.selectedColor, findVariant, activeRamFilter]);

  const selectMemoriaram = useCallback((memoriaram: string) => {
    // Activar filtro de RAM
    setActiveRamFilter(memoriaram);

    if (!selection.selectedColor) return;

    // Buscar la primera variante con este color y RAM (manteniendo capacidad si es compatible)
    const variant = findVariant(selection.selectedColor, activeCapacityFilter, memoriaram);
    if (variant) {
      setSelection({
        selectedColor: variant.color,
        selectedCapacity: variant.capacity,
        selectedMemoriaram: variant.memoriaram,
        selectedVariant: variant
      });
    }
  }, [selection.selectedColor, findVariant, activeCapacityFilter]);

  const resetSelection = useCallback(() => {
    setSelection({
      selectedColor: null,
      selectedCapacity: null,
      selectedMemoriaram: null,
      selectedVariant: null
    });
    // Resetear también los filtros activos
    setActiveCapacityFilter(undefined);
    setActiveRamFilter(undefined);
  }, []);

  // Función para seleccionar una variante completa directamente
  const selectVariant = useCallback((variant: ProductVariant) => {
    setSelection({
      selectedColor: variant.color,
      selectedCapacity: variant.capacity,
      selectedMemoriaram: variant.memoriaram,
      selectedVariant: variant
    });
    // Actualizar filtros activos
    setActiveCapacityFilter(variant.capacity);
    setActiveRamFilter(variant.memoriaram);
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
    selectVariant,
    resetSelection,
    getColorOptions,
    getStorageOptions,
    getSelectedColorOption,
    getSelectedStorageOption,
    allVariants
  };
}
