/**
 * Hook personalizado para manejar variantes de dispositivos
 * Obtiene todas las variantes de un dispositivo por codigoMarket
 */

"use client";

import { useState, useEffect, useCallback } from 'react';
import { productEndpoints, ProductApiData } from '@/lib/api';

export interface DeviceVariant {
  sku: string;
  nombreMarket: string;
  color: string;
  capacidad: string;
  precioNormal: number;
  precioDescto: number;
  stock: number;
  urlImagen?: string;
  urlRender3D?: string;
  imagePreviewUrl?: string;
  imageDetailsUrls?: string[];
}

export interface DeviceOption {
  nombreMarket: string;
  variants: DeviceVariant[];
}

export interface StorageOption {
  capacidad: string;
  variants: DeviceVariant[];
}

export interface ColorOption {
  color: string;
  hex: string;
  variants: DeviceVariant[];
}

interface UseDeviceVariantsReturn {
  deviceOptions: DeviceOption[];
  storageOptions: StorageOption[];
  colorOptions: ColorOption[];
  selectedDevice: DeviceOption | null;
  selectedStorage: StorageOption | null;
  selectedColor: ColorOption | null;
  selectedVariant: DeviceVariant | null;
  currentPrice: number | null;
  loading: boolean;
  error: string | null;
  setSelectedDevice: (device: DeviceOption | null) => void;
  setSelectedStorage: (storage: StorageOption | null) => void;
  setSelectedColor: (color: ColorOption | null) => void;
}

// Mapeo de colores
const colorHexMap: Record<string, string> = {
  'azul': '#1E40AF',
  'azul naval': '#1e3a8a',
  'azul hielo': '#bfdbfe',
  'negro': '#000000',
  'blanco': '#FFFFFF',
  'verde': '#10B981',
  'rosado': '#EC4899',
  'rosa': '#EC4899',
  'gris': '#808080',
  'plateado': '#C0C0C0',
  'dorado': '#D4AF37',
  'menta': '#86efac',
  'gris titanio': '#4B5563',
  'negro titanio': '#1F2937',
};

export const useDeviceVariants = (productId: string): UseDeviceVariantsReturn => {
  const [deviceOptions, setDeviceOptions] = useState<DeviceOption[]>([]);
  const [storageOptions, setStorageOptions] = useState<StorageOption[]>([]);
  const [colorOptions, setColorOptions] = useState<ColorOption[]>([]);
  const [selectedDevice, setSelectedDeviceState] = useState<DeviceOption | null>(null);
  const [selectedStorage, setSelectedStorageState] = useState<StorageOption | null>(null);
  const [selectedColor, setSelectedColorState] = useState<ColorOption | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<DeviceVariant | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Función para procesar los datos de la API y crear variantes
  const processApiData = useCallback((apiData: ProductApiData[]): DeviceVariant[] => {
    const variants: DeviceVariant[] = [];

    apiData.forEach(product => {
      // Cada índice corresponde a una variante específica
      const maxVariants = Math.max(
        product.sku.length,
        product.color.length,
        product.capacidad.length,
        product.precioNormal.length
      );

      for (let i = 0; i < maxVariants; i++) {
        const variant: DeviceVariant = {
          sku: product.sku[i] || '',
          nombreMarket: product.nombreMarket,
          color: product.color[i] || product.color[0] || '',
          capacidad: product.capacidad[i] || product.capacidad[0] || '',
          precioNormal: product.precioNormal[i] || 0,
          precioDescto: product.precioDescto[i] || 0,
          stock: product.stock[i] || 0,
          urlImagen: product.urlImagenes[i],
          urlRender3D: product.urlRender3D[i],
          imagePreviewUrl: product.imagePreviewUrl?.[i],
          imageDetailsUrls: product.imageDetailsUrls?.[i] || [],
        };

        // Solo agregar variantes con SKU válido (stock puede ser 0)
        console.log('🔍 processApiData - variant:', variant);
        if (variant.sku) {
          variants.push(variant);
          console.log('✅ processApiData - variant added:', variant);
        } else {
          console.log('❌ processApiData - variant filtered out:', variant, 'sku:', variant.sku);
        }
      }
    });

    return variants;
  }, []);

  // Función para agrupar variantes por dispositivo
  const groupByDevice = useCallback((variants: DeviceVariant[]): DeviceOption[] => {
    const deviceMap = new Map<string, DeviceVariant[]>();

    variants.forEach(variant => {
      const key = variant.nombreMarket;
      if (!deviceMap.has(key)) {
        deviceMap.set(key, []);
      }
      deviceMap.get(key)!.push(variant);
    });

    return Array.from(deviceMap.entries()).map(([nombreMarket, variants]) => ({
      nombreMarket,
      variants,
    }));
  }, []);

  // Función para filtrar almacenamiento basado en dispositivo seleccionado
  const getStorageOptionsForDevice = useCallback((deviceOption: DeviceOption | null): StorageOption[] => {
    if (!deviceOption) return [];

    const storageMap = new Map<string, DeviceVariant[]>();

    deviceOption.variants.forEach(variant => {
      const key = variant.capacidad;
      if (!storageMap.has(key)) {
        storageMap.set(key, []);
      }
      storageMap.get(key)!.push(variant);
    });

    return Array.from(storageMap.entries()).map(([capacidad, variants]) => ({
      capacidad,
      variants,
    }));
  }, []);

  // Función para filtrar colores basado en dispositivo y almacenamiento seleccionados
  const getColorOptionsForDeviceAndStorage = useCallback((
    deviceOption: DeviceOption | null,
    storageOption: StorageOption | null
  ): ColorOption[] => {
    let variantsToFilter = deviceOption?.variants || [];

    if (storageOption) {
      variantsToFilter = variantsToFilter.filter(v => v.capacidad === storageOption.capacidad);
    }

    const colorMap = new Map<string, DeviceVariant[]>();

    variantsToFilter.forEach(variant => {
      const key = variant.color.toLowerCase();
      if (!colorMap.has(key)) {
        colorMap.set(key, []);
      }
      colorMap.get(key)!.push(variant);
    });

    return Array.from(colorMap.entries()).map(([color, variants]) => ({
      color,
      hex: colorHexMap[color.toLowerCase()] || '#808080',
      variants,
    }));
  }, []);

  // Función para filtrar capacidades basado en dispositivo y color seleccionados
  const getStorageOptionsForDeviceAndColor = useCallback((
    deviceOption: DeviceOption | null,
    colorOption: ColorOption | null
  ): StorageOption[] => {
    let variantsToFilter = deviceOption?.variants || [];

    if (colorOption) {
      variantsToFilter = variantsToFilter.filter(v => v.color.toLowerCase() === colorOption.color.toLowerCase());
    }

    const storageMap = new Map<string, DeviceVariant[]>();

    variantsToFilter.forEach(variant => {
      const key = variant.capacidad;
      if (!storageMap.has(key)) {
        storageMap.set(key, []);
      }
      storageMap.get(key)!.push(variant);
    });

    return Array.from(storageMap.entries()).map(([capacidad, variants]) => ({
      capacidad,
      variants,
    }));
  }, []);

  // Función para obtener la variante seleccionada actual
  const getCurrentVariant = useCallback((): DeviceVariant | null => {
    if (!selectedDevice || !selectedStorage || !selectedColor) return null;

    return selectedColor.variants.find(variant =>
      variant.nombreMarket === selectedDevice.nombreMarket &&
      variant.capacidad === selectedStorage.capacidad &&
      variant.color.toLowerCase() === selectedColor.color.toLowerCase()
    ) || null;
  }, [selectedDevice, selectedStorage, selectedColor]);

  // Función para cargar datos de la API
  const fetchDeviceVariants = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const codigoMarketBase = productId;
      const response = await productEndpoints.getByCodigoMarket(codigoMarketBase);

      if (response.success && response.data) {
        const apiData = response.data;
        console.log('🔍 useDeviceVariants - apiData.products:', apiData.products);
        const variants = processApiData(apiData.products);
        console.log('🔍 useDeviceVariants - processed variants:', variants);
        const devices = groupByDevice(variants);
        console.log('🔍 useDeviceVariants - grouped devices:', devices);

        setDeviceOptions(devices);

        // Seleccionar automáticamente el primer dispositivo
        if (devices.length > 0) {
          setSelectedDeviceState(devices[0]);
          const storages = getStorageOptionsForDevice(devices[0]);
          setStorageOptions(storages);

          // Seleccionar automáticamente el primer almacenamiento
          if (storages.length > 0) {
            setSelectedStorageState(storages[0]);
            const colors = getColorOptionsForDeviceAndStorage(devices[0], storages[0]);
            setColorOptions(colors);

            // Seleccionar automáticamente el primer color
            if (colors.length > 0) {
              setSelectedColorState(colors[0]);
            }
          }
        }
      } else {
        setError(response.message || 'Error al cargar variantes del dispositivo');
      }
    } catch (err) {
      console.error('Error fetching device variants:', err);
      setError('Error de conexión al cargar variantes del dispositivo');
    } finally {
      setLoading(false);
    }
  }, [productId, processApiData, groupByDevice, getStorageOptionsForDevice, getColorOptionsForDeviceAndStorage]);

  // Funciones para cambiar selecciones
  const setSelectedDevice = useCallback((device: DeviceOption | null) => {
    setSelectedDeviceState(device);

    if (device) {
      const storages = getStorageOptionsForDevice(device);
      setStorageOptions(storages);

      // Resetear selecciones dependientes
      setSelectedStorageState(storages.length > 0 ? storages[0] : null);
      const colors = getColorOptionsForDeviceAndStorage(device, storages[0] || null);
      setColorOptions(colors);
      setSelectedColorState(colors.length > 0 ? colors[0] : null);
    } else {
      setStorageOptions([]);
      setColorOptions([]);
      setSelectedStorageState(null);
      setSelectedColorState(null);
    }
  }, [getStorageOptionsForDevice, getColorOptionsForDeviceAndStorage]);

  const setSelectedStorage = useCallback((storage: StorageOption | null) => {
    setSelectedStorageState(storage);

    if (selectedDevice) {
      const colors = getColorOptionsForDeviceAndStorage(selectedDevice, storage);
      setColorOptions(colors);
      
      // Si el color actual no está disponible para la nueva capacidad, seleccionar el primero disponible
      const currentColorStillAvailable = colors.find(c => c.color.toLowerCase() === selectedColor?.color.toLowerCase());
      setSelectedColorState(currentColorStillAvailable || (colors.length > 0 ? colors[0] : null));
    }
  }, [selectedDevice, selectedColor, getColorOptionsForDeviceAndStorage]);

  const setSelectedColor = useCallback((color: ColorOption | null) => {
    setSelectedColorState(color);

    if (selectedDevice) {
      const storages = getStorageOptionsForDeviceAndColor(selectedDevice, color);
      setStorageOptions(storages);
      
      // Si la capacidad actual no está disponible para el nuevo color, seleccionar la primera disponible
      const currentStorageStillAvailable = storages.find(s => s.capacidad === selectedStorage?.capacidad);
      setSelectedStorageState(currentStorageStillAvailable || (storages.length > 0 ? storages[0] : null));
    }
  }, [selectedDevice, selectedStorage, getStorageOptionsForDeviceAndColor]);

  // Actualizar variante seleccionada cuando cambien las selecciones
  useEffect(() => {
    setSelectedVariant(getCurrentVariant());
  }, [getCurrentVariant]);

  // Cargar datos cuando cambie el productId
  useEffect(() => {
    if (productId) {
      fetchDeviceVariants();
    }
  }, [productId, fetchDeviceVariants]);

  // Función para obtener el precio actual basado en la variante seleccionada
  const getCurrentPrice = useCallback(() => {
    if (!selectedVariant) return null;
    return selectedVariant.precioDescto > 0 ? selectedVariant.precioDescto : selectedVariant.precioNormal;
  }, [selectedVariant]);

  return {
    deviceOptions,
    storageOptions,
    colorOptions,
    selectedDevice,
    selectedStorage,
    selectedColor,
    selectedVariant,
    currentPrice: getCurrentPrice(),
    loading,
    error,
    setSelectedDevice,
    setSelectedStorage,
    setSelectedColor,
  };
};