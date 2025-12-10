import { useEffect, useRef, useState } from 'react';
import { tradeInEndpoints } from '@/lib/api';
import type { TradeInData, DeviceCategory, Brand, DeviceModel, DeviceCapacity } from '@/app/productos/dispositivos-moviles/detalles-producto/estreno-y-entrego/types';
import type { TradeInCategory } from '@/lib/api';

// Cache global para los datos de Trade-In
let tradeInCache: {
  data: TradeInData | null;
  timestamp: number;
  loading: boolean;
} = {
  data: null,
  timestamp: 0,
  loading: false,
};

// Listeners para notificar cambios en el cache
const listeners = new Set<() => void>();

const notifyListeners = () => {
  listeners.forEach((listener) => listener());
};

// TTL del cache (5 minutos)
const CACHE_TTL = 5 * 60 * 1000;

/**
 * Hook para hacer prefetch de los datos de Trade-In
 * Los datos se cargan automáticamente y se almacenan en caché global
 * Útil para cargar los datos antes de que el usuario abra el modal
 */
export function useTradeInPrefetch() {
  const hasInitialized = useRef(false);
  // Estado local para forzar re-render cuando el cache cambie
  const [, forceUpdate] = useState({});

  useEffect(() => {
    const listener = () => forceUpdate({});
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);

  useEffect(() => {
    // Solo ejecutar una vez por sesión
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    const shouldFetch = () => {
      // No hay datos en cache
      if (!tradeInCache.data) return true;

      // Cache expirado
      const now = Date.now();
      if (now - tradeInCache.timestamp > CACHE_TTL) return true;

      // Ya se está cargando
      if (tradeInCache.loading) return false;

      return false;
    };

    if (shouldFetch()) {
      console.log('🚀 [Trade-In Prefetch] Iniciando prefetch automático...');
      prefetchTradeInData();
    } else {
      console.log('✅ [Trade-In Prefetch] Datos ya en cache o cargando');
    }
  }, []);

  return {
    getCachedData: () => tradeInCache.data,
    isLoading: () => tradeInCache.loading,
    prefetch: prefetchTradeInData,
  };
}

/**
 * Hook para obtener los datos de Trade-In desde el cache
 * Si no están en cache, los carga automáticamente
 */
export function useTradeInDataFromCache() {
  // Estado local para mantener sincronizado con el cache global
  const [cacheState, setCacheState] = useState({
    data: tradeInCache.data,
    loading: tradeInCache.loading,
    timestamp: tradeInCache.timestamp
  });

  // Suscribirse a cambios en el cache global
  useEffect(() => {
    const listener = () => {
      setCacheState({
        data: tradeInCache.data,
        loading: tradeInCache.loading,
        timestamp: tradeInCache.timestamp
      });
    };
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);

  const getCachedData = () => {
    const now = Date.now();

    // Si no hay datos o están expirados, retornar null
    if (!cacheState.data || (now - cacheState.timestamp > CACHE_TTL)) {
      return null;
    }

    return cacheState.data;
  };

  const isLoading = () => cacheState.loading;

  // Si no hay datos, intentar cargarlos
  useEffect(() => {
    const cachedData = getCachedData();
    if (!cachedData && !isLoading()) {
      console.log('🔄 [Trade-In Cache] No hay datos, iniciando carga...');
      prefetchTradeInData();
    } else {
      console.log('📦 [Trade-In Cache] Datos disponibles:', {
        hasData: !!cachedData,
        isLoading: isLoading(),
        dataAge: cacheState.timestamp ? Date.now() - cacheState.timestamp : 0
      });
    }
  }, [cacheState.data, cacheState.timestamp, cacheState.loading]); // Dependencias actualizadas

  return {
    tradeInData: getCachedData(),
    loading: isLoading(),
  };
}

/**
 * Función para hacer prefetch de los datos de Trade-In
 * Se puede llamar desde cualquier parte de la aplicación
 */
async function prefetchTradeInData(): Promise<TradeInData | null> {
  // Evitar múltiples requests simultáneos
  if (tradeInCache.loading) {
    return tradeInCache.data;
  }

  try {
    tradeInCache.loading = true;
    notifyListeners(); // Notificar inicio de carga

    console.log('🔄 [Trade-In Prefetch] Cargando datos de trade-in...');

    const response = await tradeInEndpoints.getHierarchy();

    if (response.success && response.data) {
      const transformedData = transformHierarchyToTradeInData(response.data);

      tradeInCache = {
        data: transformedData,
        timestamp: Date.now(),
        loading: false,
      };
      notifyListeners(); // Notificar éxito

      console.log('✅ [Trade-In Prefetch] Datos cargados y almacenados en cache');
      return transformedData;
    } else {
      console.error('❌ [Trade-In Prefetch] Error en respuesta:', response.message);
      tradeInCache.loading = false;
      notifyListeners(); // Notificar error (fin de carga)
      return null;
    }
  } catch (error) {
    console.error('❌ [Trade-In Prefetch] Error de conexión:', error);
    tradeInCache.loading = false;
    notifyListeners(); // Notificar error (fin de carga)
    return null;
  }
}

/**
 * Transforma la jerarquía del backend al formato TradeInData del frontend
 * Copiado desde useTradeInData.ts para mantener la misma lógica
 */
function transformHierarchyToTradeInData(hierarchy: TradeInCategory[]): TradeInData {
  const categories: DeviceCategory[] = [];
  const brands: Brand[] = [];
  const models: DeviceModel[] = [];
  const capacities: DeviceCapacity[] = [];

  // Helper para procesar una marca
  const processBrand = (
    brand: TradeInCategory['brands'][number],
    brandId: string,
    categoryId: string,
    brandsArr: Brand[],
    modelsArr: DeviceModel[],
    capacitiesArr: DeviceCapacity[]
  ) => {
    const brandName = brand.marca.trim();

    // Agregar marca (solo si no existe)
    if (!brandsArr.some((b) => b.id === brandId)) {
      brandsArr.push({
        id: brandId,
        name: brandName,
        maxDiscount: brand.maxPrecio,
      });
    }

    // Agrupar modelos por nombre
    const modelGroups = new Map<string, { displayName: string; variants: typeof brand.models }>();

    for (const model of brand.models) {
      const originalName = model.modelo.trim();
      const normalizedName = originalName.toLowerCase().replaceAll(/\s+/g, ' ').trim();

      if (!modelGroups.has(normalizedName)) {
        modelGroups.set(normalizedName, { displayName: originalName, variants: [] });
      }
      modelGroups.get(normalizedName)!.variants.push(model);
    }

    // Procesar cada grupo de modelos
    for (const [, group] of modelGroups) {
      const modelName = group.displayName;
      const modelVariants = group.variants;

      const primaryCodModelo = modelVariants[0].codModelo.trim();
      const modelId = `${brandId}-model-${primaryCodModelo}`;

      modelsArr.push({
        id: modelId,
        name: modelName,
        brandId: brandId,
        categoryId: categoryId,
      });

      // Agregar capacidades
      for (const variant of modelVariants) {
        const capacityName = variant.capacidad.trim();
        const codModelo = variant.codModelo.trim();

        capacitiesArr.push({
          id: `${modelId}-${codModelo}`,
          name: capacityName,
          modelId: modelId,
          tradeInValue: 0,
        });
      }
    }
  };

  // Mapear iconos
  const iconMap: Record<string, 'watch' | 'smartphone' | 'tablet'> = {
    'Tablet': 'tablet',
    'Smartphone': 'smartphone',
    'Watch': 'watch',
    'Smartwatch': 'watch',
  };

  for (const category of hierarchy) {
    const categoryName = category.categoria.trim();
    const icon = iconMap[categoryName] || 'smartphone';
    const categoryId = categoryName.toLowerCase();

    categories.push({
      id: categoryId,
      name: categoryName.toUpperCase(),
      icon: icon,
      maxPrice: category.maxPrecio,
    });

    for (const brand of category.brands) {
      const brandName = brand.marca.trim();
      const codMarca = brand.codMarca.trim();
      const brandId = `${brandName.toLowerCase().replaceAll(/\s+/g, '-')}-${codMarca}`;

      processBrand(brand, brandId, categoryId, brands, models, capacities);
    }
  }

  return {
    categories,
    brands,
    models,
    capacities,
  };
}

/**
 * Función utilitaria para limpiar el cache manualmente
 */
export function clearTradeInCache() {
  tradeInCache = {
    data: null,
    timestamp: 0,
    loading: false,
  };
}