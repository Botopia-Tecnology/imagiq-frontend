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

// Mapeo robusto de colores - Sincronizado con productMapper.ts
// Incluye variaciones, sinónimos y colores específicos de Samsung
const colorHexMap: Record<string, string> = {
  // ===== NEGROS =====
  'negro': '#000000',
  'black': '#000000',
  'negro medianoche': '#191970',
  'midnight black': '#191970',
  'negro titanio': '#2C2C2C',
  'titanium black': '#2C2C2C',
  'negro grafito': '#1C1C1C',
  'graphite black': '#1C1C1C',
  'negro phantom': '#1A1A1A',
  'phantom black': '#1A1A1A',
  'negro fantasma': '#1A1A1A',
  'negro espacial': '#0A0A0A',
  'space black': '#0A0A0A',
  
  // ===== BLANCOS =====
  'blanco': '#FFFFFF',
  'white': '#FFFFFF',
  'blanco perla': '#F8F8F8',
  'pearl white': '#F8F8F8',
  'blanco nube': '#F5F5F5',
  'cloud white': '#F5F5F5',
  'blanco phantom': '#F0F0F0',
  'phantom white': '#F0F0F0',
  'blanco lunar': '#FAFAFA',
  'lunar white': '#FAFAFA',
  'blanco crema': '#FFFDD0',
  'cream white': '#FFFDD0',
  
  // ===== GRISES =====
  'gris': '#808080',
  'gray': '#808080',
  'grey': '#808080',
  'gris titanio': '#5A6978',
  'titanium gray': '#5A6978',
  'gris grafito': '#4B5563',
  'graphite gray': '#4B5563',
  'gris phantom': '#6B7280',
  'phantom gray': '#6B7280',
  'gris espacial': '#52575D',
  'space gray': '#52575D',
  'gris niebla': '#9CA3AF',
  'misty gray': '#9CA3AF',
  'gris plata': '#C0C0C0',
  'silver gray': '#C0C0C0',
  
  // ===== PLATEADOS / PLATAS =====
  'plateado': '#C0C0C0',
  'silver': '#C0C0C0',
  'plata': '#C0C0C0',
  'plateado titanio': '#B8C5D6',
  'titanium silver': '#B8C5D6',
  'plata phantom': '#D3D3D3',
  'phantom silver': '#D3D3D3',
  
  // ===== AZULES =====
  'azul': '#1E40AF',
  'blue': '#1E40AF',
  'azul medianoche': '#003366',
  'midnight blue': '#003366',
  'azul marino': '#000080',
  'navy blue': '#000080',
  'azul naval': '#1e3a8a',
  'azul cielo': '#87CEEB',
  'sky blue': '#87CEEB',
  'azul hielo': '#B0E0E6',
  'ice blue': '#B0E0E6',
  'azul océano': '#006994',
  'ocean blue': '#006994',
  'azul cobalto': '#0047AB',
  'cobalt blue': '#0047AB',
  'azul phantom': '#2563EB',
  'phantom blue': '#2563EB',
  
  // ===== VERDES =====
  'verde': '#10B981',
  'green': '#10B981',
  'verde menta': '#86EFAC',
  'mint green': '#86EFAC',
  'menta': '#86EFAC',
  'mint': '#86EFAC',
  'verde oliva': '#6B8E23',
  'olive green': '#6B8E23',
  'verde bosque': '#228B22',
  'forest green': '#228B22',
  'verde esmeralda': '#50C878',
  'emerald green': '#50C878',
  'verde lima': '#32CD32',
  'lime green': '#32CD32',
  
  // ===== ROSAS / ROSADOS =====
  'rosa': '#EC4899',
  'pink': '#EC4899',
  'rosado': '#EC4899',
  'rosa oro': '#E8B4B8',
  'rose gold': '#E8B4B8',
  'oro rosa': '#E8B4B8',
  'pink gold': '#E8B4B8',
  'rosa claro': '#FFB6C1',
  'light pink': '#FFB6C1',
  'rosa pastel': '#FFD1DC',
  'pastel pink': '#FFD1DC',
  
  // ===== MORADOS / PÚRPURAS / VIOLETAS =====
  'morado': '#9333EA',
  'purple': '#9333EA',
  'purpura': '#9333EA',
  'violeta': '#8B5CF6',
  'violet': '#8B5CF6',
  'morado lavanda': '#B19CD9',
  'lavender purple': '#B19CD9',
  'lavanda': '#E6E6FA',
  'lavender': '#E6E6FA',
  'lila': '#C8A2C8',
  'lilac': '#C8A2C8',
  'ciruela': '#8E4585',
  'plum': '#8E4585',
  
  // ===== ROJOS =====
  'rojo': '#DC2626',
  'red': '#DC2626',
  'rojo cereza': '#D2042D',
  'cherry red': '#D2042D',
  'rojo carmesí': '#DC143C',
  'crimson red': '#DC143C',
  'rojo vino': '#722F37',
  'wine red': '#722F37',
  'borgoña': '#800020',
  'burgundy': '#800020',
  
  // ===== AMARILLOS / DORADOS =====
  'amarillo': '#EAB308',
  'yellow': '#EAB308',
  'dorado': '#FFD700',
  'gold': '#FFD700',
  'oro': '#FFD700',
  'amarillo limón': '#FFF44F',
  'lemon yellow': '#FFF44F',
  'champagne': '#F7E7CE',
  'champaña': '#F7E7CE',
  
  // ===== NARANJAS =====
  'naranja': '#F97316',
  'orange': '#F97316',
  'coral': '#FF7F50',
  'durazno': '#FFE5B4',
  'peach': '#FFE5B4',
  
  // ===== MARRONES / BEIGES =====
  'marron': '#8B4513',
  'brown': '#8B4513',
  'café': '#6F4E37',
  'coffee': '#6F4E37',
  'beige': '#F5F5DC',
  'arena': '#C2B280',
  'sand': '#C2B280',
  'bronce': '#CD7F32',
  'bronze': '#CD7F32',
  'cobre': '#B87333',
  'copper': '#B87333',
  
  // ===== ESPECIALES / OTROS =====
  'transparente': '#F9FAFB',
  'transparent': '#F9FAFB',
  'cristal': '#E5E7EB',
  'clear': '#E5E7EB',
  'no aplica': '#F3F4F6',
  'n/a': '#F3F4F6',
  'sin color': '#F3F4F6',
  'default': '#F3F4F6',
  'multicolor': '#A855F7',
  'multi': '#A855F7',
  
  // ===== COLORES SAMSUNG ESPECÍFICOS =====
  'phantom violet': '#8B5CF6',
  'violeta phantom': '#8B5CF6',
  'burgundy red': '#800020',
  'bora purple': '#9333EA',
  'purpura bora': '#9333EA',
  'awesome black': '#000000',
  'awesome white': '#FFFFFF',
  'awesome blue': '#1E40AF',
  'awesome violet': '#8B5CF6',
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
        if (variant.sku) {
          variants.push(variant);
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
        const variants = processApiData(apiData.products);
        const devices = groupByDevice(variants);

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