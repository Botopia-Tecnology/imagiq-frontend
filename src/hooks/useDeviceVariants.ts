/**
 * Hook wrapper para compatibilidad con componentes legacy
 * Usa useProductSelection internamente pero expone una API compatible
 */

import { useState, useEffect, useMemo } from 'react';
import { useProductSelection, type ColorOption, type StorageOption as ProductStorageOption, type ProductVariant as ProductSelectionVariant } from './useProductSelection';
import { productEndpoints, type ProductApiData } from '@/lib/api';

export type { ColorOption } from './useProductSelection';

// Re-exportar tipos desde useProductSelection
export type StorageOption = ProductStorageOption;
export type ProductVariant = ProductSelectionVariant;

export interface DeviceVariant {
  sku: string;
  ean: string;
  color: string;
  capacidad: string;
  nombreMarket?: string;
  precio: number;
  stockTotal: number;
}

export interface UseDeviceVariantsReturn {
  colorOptions: ColorOption[];
  storageOptions: StorageOption[];
  selectedDevice: DeviceVariant | null;
  selectedStorage: StorageOption | null;
  selectedColor: ColorOption | null;
  selectedVariant: DeviceVariant | null;
  currentPrice: number | null;
  loading: boolean;
  setSelectedColor: (color: ColorOption) => void;
  setSelectedStorage: (storage: StorageOption) => void;
}

export function useDeviceVariants(productId: string): UseDeviceVariantsReturn {
  const [apiProduct, setApiProduct] = useState<ProductApiData | null>(null);
  const [loading, setLoading] = useState(true);

  // Cargar datos del producto
  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        const response = await productEndpoints.getById(productId);
        if (response.success && response.data.products.length > 0) {
          setApiProduct(response.data.products[0]);
        }
      } catch (error) {
        console.error('Error loading product:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [productId]);

  // Usar el hook de selección de productos
  const productSelection = useProductSelection(
    apiProduct || {
      codigoMarketBase: productId,
      codigoMarket: [],
      nombreMarket: '',
      categoria: '',
      subcategoria: '',
      modelo: '',
      color: [],
      capacidad: [],
      memoriaram: [],
      descGeneral: null,
      sku: [],
      ean: [],
      desDetallada: [],
      stockTotal: [],
      urlImagenes: [],
      urlRender3D: [],
      imagePreviewUrl: [],
      imageDetailsUrls: [],
      precioNormal: [],
      precioeccommerce: [],
      fechaInicioVigencia: [],
      fechaFinalVigencia: [],
    } as ProductApiData
  );

  // Obtener opciones de color y almacenamiento
  const colorOptions = useMemo(() => {
    if (!apiProduct) return [];
    return productSelection.getColorOptions();
  }, [apiProduct, productSelection]);

  const storageOptions = useMemo(() => {
    if (!apiProduct) return [];
    return productSelection.getStorageOptions();
  }, [apiProduct, productSelection]);

  // Estado de selección actual
  const selectedColor = useMemo(() => {
    return productSelection.getSelectedColorOption();
  }, [productSelection]);

  const selectedStorage = useMemo(() => {
    return productSelection.getSelectedStorageOption();
  }, [productSelection]);

  // Variante seleccionada
  const selectedVariant = useMemo((): DeviceVariant | null => {
    const variant = productSelection.selectedVariant;
    if (!variant) return null;

    return {
      sku: variant.sku,
      ean: variant.ean,
      color: variant.color,
      capacidad: variant.capacity,
      nombreMarket: apiProduct?.nombreMarket,
      precio: variant.precioeccommerce,
      stockTotal: variant.stockTotal,
    };
  }, [productSelection.selectedVariant, apiProduct]);

  // Precio actual
  const currentPrice = productSelection.selectedPrice;

  // Funciones de selección
  const setSelectedColor = (color: ColorOption) => {
    productSelection.selectColor(color.color);
  };

  const setSelectedStorage = (storage: StorageOption) => {
    productSelection.selectCapacity(storage.capacidad);
  };

  return {
    colorOptions,
    storageOptions,
    selectedDevice: selectedVariant,
    selectedStorage,
    selectedColor,
    selectedVariant,
    currentPrice,
    loading,
    setSelectedColor,
    setSelectedStorage,
  };
}
