import { useState, useEffect } from 'react';
import { tradeInEndpoints, type TradeInCategory } from '@/lib/api';
import type { TradeInData, DeviceCategory, Brand, DeviceModel, DeviceCapacity } from '../types';

/**
 * Hook para cargar y transformar datos del endpoint /api/trade-in/hierarchy
 * Convierte la estructura jerárquica del backend al formato usado en el frontend
 */
export function useTradeInData() {
  const [tradeInData, setTradeInData] = useState<TradeInData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTradeInData = async () => {
      try {
        setLoading(true);
        const response = await tradeInEndpoints.getHierarchy();

        if (response.success && response.data) {
          const transformedData = transformHierarchyToTradeInData(response.data);
          setTradeInData(transformedData);
          setError(null);
        } else {
          setError(response.message || 'Error al cargar datos de trade-in');
        }
      } catch {
        setError('Error de conexión al cargar datos');
      } finally {
        setLoading(false);
      }
    };

    fetchTradeInData();
  }, []);

  return { tradeInData, loading, error };
}

/**
 * Transforma la jerarquía del backend al formato TradeInData del frontend
 * Los precios ya vienen calculados desde el backend
 */
function transformHierarchyToTradeInData(hierarchy: TradeInCategory[]): TradeInData {
  const categories: DeviceCategory[] = [];
  const brands: Brand[] = [];
  const models: DeviceModel[] = [];
  const capacities: DeviceCapacity[] = [];

  // Helper para procesar una marca: agrega la marca, modelos y capacidades a los arrays proporcionados
  const processBrand = (
    brand: TradeInCategory['brands'][number],
    brandId: string,
    categoryId: string,
    brandsArr: Brand[],
    modelsArr: DeviceModel[],
    capacitiesArr: DeviceCapacity[]
  ) => {
  const brandName = brand.marca.trim();
    
    // Agregar marca (solo si no existe) con precio que viene del backend
    if (!brandsArr.some((b) => b.id === brandId)) {
      brandsArr.push({
        id: brandId,
        name: brandName,
        maxDiscount: brand.maxPrecio,
      });
    }

    // Agrupar modelos por nombre (mismo modelo, diferentes capacidades)
    // Hacer agrupamiento case-insensitive: normalizamos el nombre para la clave
    const modelGroups = new Map<string, { displayName: string; variants: typeof brand.models }>();

    for (const model of brand.models) {
      const originalName = model.modelo.trim();
      // Normalizar: trim + a minúsculas + colapsar espacios
      const normalizedName = originalName.toLowerCase().replaceAll(/\s+/g, ' ').trim();

      if (!modelGroups.has(normalizedName)) {
        modelGroups.set(normalizedName, { displayName: originalName, variants: [] });
      }
      modelGroups.get(normalizedName)!.variants.push(model);
    }

    // Procesar cada grupo de modelos (usando el displayName original para mostrar)
    for (const [, group] of modelGroups) {
      const modelName = group.displayName;
      const modelVariants = group.variants;

      // Usar el codModelo del primer variant como ID del modelo
      const primaryCodModelo = modelVariants[0].codModelo.trim();
      const modelId = `${brandId}-model-${primaryCodModelo}`;

      // Agregar modelo una sola vez
      modelsArr.push({
        id: modelId,
        name: modelName,
        brandId: brandId,
        categoryId: categoryId,
      });

      // Agregar todas las capacidades de este modelo
      for (const variant of modelVariants) {
        const capacityName = variant.capacidad.trim();
        const codModelo = variant.codModelo.trim();

        capacitiesArr.push({
          id: `${modelId}-${codModelo}`,
          name: capacityName,
          modelId: modelId,
          tradeInValue: 0, // El valor se calculará con /api/trade-in/value según el grado
        });
      }
    }
  };

  // Mapear categorías del backend a iconos del frontend
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

    // Agregar categoría con precio que viene del backend
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

      // Procesar la marca (agregar marca, modelos y capacidades)
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
 * Helper para obtener el codMarca desde el brandId
 * Ejemplo: "apple-01" → "01"
 */
export function extractCodMarca(brandId: string): string | null {
  const re = /-([^-]+)$/;
  const match = re.exec(brandId);
  return match ? match[1] : null;
}

/**
 * Helper para obtener el codModelo desde el capacityId
 * Ejemplo: "apple-01-model-01038-01040" → "01040"
 * El capacityId tiene el formato: brandId-model-primaryCodModelo-specificCodModelo
 */
export function extractCodModelo(capacityId: string): string | null {
  // Extraer el último segmento después del último guion
  const re = /-([^-]+)$/;
  const match = re.exec(capacityId);
  return match ? match[1] : null;
}
