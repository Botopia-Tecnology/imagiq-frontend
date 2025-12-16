/**
 * Hook para precargar automáticamente productos de todas las combinaciones posibles
 * (categorías, categorías+menús, categorías+menús+submenús) al cargar la página.
 * 
 * Se ejecuta de forma asíncrona y silenciosa en background para mejorar
 * la velocidad percibida cuando el usuario navega.
 */

import { useEffect, useRef, useCallback } from 'react';
import { useVisibleCategories } from './useVisibleCategories';
import { usePreloadCategoryMenus } from './usePreloadCategoryMenus';
import { getSubmenusFromCache, type Submenu } from '@/lib/api';
import { productCache } from '@/lib/productCache';
import { executeBatchPrefetch } from '@/lib/batchPrefetch';
import { usePrefetchCoordinator } from './usePrefetchCoordinator';
import { isStaticCategoryUuid } from '@/constants/staticCategories';
import type { VisibleCategory, ProductFilterParams } from '@/lib/api';

// Mapeo de secciones de ofertas a filtros de API
const ofertasFiltersMap: Record<string, { categoria?: string; menuUuid?: string }> = {
  accesorios: { categoria: "IM", menuUuid: '87c54352-5181-45b7-831d-8e9470d2288c' },
  "tv-monitores-audio": { categoria: "AV,IT" },
  "smartphones-tablets": { categoria: "IM", menuUuid: 'ff59c937-78ac-4f83-8c5e-2c3048b4ebb7,7609faf8-4c39-4227-915e-0d439d717e84' },
  electrodomesticos: { categoria: "DA" },
};

// Construir parámetros para una sección de ofertas
const buildOfertasParams = (seccion: string): ProductFilterParams | null => {
  const sectionFilters = ofertasFiltersMap[seccion];
  if (!sectionFilters) {
    return null;
  }

  const params: ProductFilterParams = {
    page: 1,
    limit: 50,
    sortBy: 'precio',
    sortOrder: 'desc',
    precioMin: 1,
    stockMinimo: 1,
    conDescuento: true,
    ...sectionFilters,
  };

  return params;
};

// Control de concurrencia: máximo de peticiones simultáneas (aumentado para precarga agresiva)
const MAX_CONCURRENT_REQUESTS = 30;

// Tiempo máximo de espera para que los menús se carguen (en milisegundos)
const MAX_WAIT_FOR_MENUS = 10000; // 10 segundos máximo
const MENU_CHECK_INTERVAL = 100; // Verificar cada 100ms

/**
 * Hook que precarga productos de todas las combinaciones posibles
 */
export function usePreloadAllProducts() {
  const { visibleCategories, loading: categoriesLoading } = useVisibleCategories();
  const { preloadedMenus, isLoaded: menusLoaded } = usePreloadCategoryMenus();
  const { shouldPrefetch } = usePrefetchCoordinator();
  const hasPreloadedRef = useRef(false);

  /**
   * Espera activamente a que todos los menús estén cargados
   */
  const waitForAllMenus = useCallback(async (
    categories: VisibleCategory[],
    menusLoaded: (uuid: string) => boolean
  ): Promise<void> => {
    const startTime = Date.now();
    
    while (Date.now() - startTime < MAX_WAIT_FOR_MENUS) {
      const allLoaded = categories.every(
        (category) => !category.uuid || menusLoaded(category.uuid)
      );
      
      if (allLoaded) {
        return;
      }
      
      // Esperar un poco antes de verificar de nuevo
      await new Promise(resolve => setTimeout(resolve, MENU_CHECK_INTERVAL));
    }
  }, []);

  /**
   * Obtiene todos los submenús desde el caché (ya precargados por usePreloadCategoryMenus)
   * No hace peticiones HTTP, solo lee del caché
   */
  const getSubmenusFromCacheMap = useCallback((categories: VisibleCategory[]): Map<string, Submenu[]> => {
    const submenusMap = new Map<string, Submenu[]>();

    // Recopilar todos los menús de todas las categorías y leer submenús desde caché
    for (const category of categories) {
      if (!category.uuid || !category.nombre) continue;
      const menus = preloadedMenus[category.uuid] || [];
      
      for (const menu of menus) {
        if (menu.activo && menu.uuid) {
          // Leer submenús directamente del caché (ya precargados)
          const cachedSubmenus = getSubmenusFromCache(menu.uuid);
          if (cachedSubmenus) {
            const activeSubmenus = cachedSubmenus.filter((submenu) => submenu.activo);
            submenusMap.set(menu.uuid, activeSubmenus);
          } else {
            // Si no están en caché, usar array vacío (evitar peticiones HTTP)
            submenusMap.set(menu.uuid, []);
          }
        }
      }
    }
    
    return submenusMap;
  }, [preloadedMenus]);

  /**
   * Construye los parámetros de API para un prefetch
   */
  const buildPrefetchParams = useCallback((
    categoryCode: string,
    menuUuid?: string,
    submenuUuid?: string
  ): ProductFilterParams => {
    const params: ProductFilterParams = {
      page: 1,
      limit: 50,
      precioMin: 1,
      lazyLimit: 6,
      lazyOffset: 0,
      sortBy: "precio",
      sortOrder: "desc",
      categoria: categoryCode,
    };

    if (menuUuid) {
      params.menuUuid = menuUuid;
    }
    if (submenuUuid) {
      params.submenuUuid = submenuUuid;
    }

    return params;
  }, []);

  /**
   * Precarga todas las combinaciones posibles de productos usando batch endpoint
   */
  const preloadAllCombinations = useCallback(async (categories: VisibleCategory[]) => {
    // Paso 1: Esperar activamente a que todos los menús estén cargados
    await waitForAllMenus(categories, menusLoaded);

    // Paso 2: Obtener todos los submenús desde el caché (ya precargados)
    const submenusMap = getSubmenusFromCacheMap(categories);

    // Paso 3: Generar todas las combinaciones de productos y filtrar las que ya están en caché
    const allCombinations: Array<{ params: ProductFilterParams; key: string }> = [];

    for (const category of categories) {
      if (!category.uuid || !category.nombre) continue;

      const categoryCode = category.nombre;
      const menus = preloadedMenus[category.uuid] || [];

      // 1. Combinación de categoría base (sin menú ni submenú)
      const categoryParams = buildPrefetchParams(categoryCode);
      if (shouldPrefetch(categoryParams)) {
        allCombinations.push({
          params: categoryParams,
          key: `${categoryCode}|${''}|${''}`,
        });
      }

      // 2. Para cada menú, generar combinaciones
      for (const menu of menus) {
        if (!menu.activo || !menu.uuid) continue;

        // Combinación de categoría + menú
        const menuParams = buildPrefetchParams(categoryCode, menu.uuid);
        if (shouldPrefetch(menuParams)) {
          allCombinations.push({
            params: menuParams,
            key: `${categoryCode}|${menu.uuid}|${''}`,
          });
        }

        // 3. Combinaciones de categoría + menú + submenú
        const submenus = submenusMap.get(menu.uuid) || [];
        for (const submenu of submenus) {
          if (!submenu.uuid) continue;
          const submenuParams = buildPrefetchParams(categoryCode, menu.uuid, submenu.uuid);
          if (shouldPrefetch(submenuParams)) {
            allCombinations.push({
              params: submenuParams,
              key: `${categoryCode}|${menu.uuid}|${submenu.uuid}`,
            });
          }
        }
      }
    }

    // 4. Agregar las 4 secciones de ofertas al batch
    const ofertasSecciones = [
      "smartphones-tablets",
      "tv-monitores-audio",
      "accesorios",
      "electrodomesticos",
    ];

    for (const seccion of ofertasSecciones) {
      const ofertasParams = buildOfertasParams(seccion);
      if (ofertasParams && shouldPrefetch(ofertasParams)) {
        allCombinations.push({
          params: ofertasParams,
          key: `ofertas:${seccion}`,
        });
      }
    }

    // Si no hay combinaciones pendientes, terminar
    if (allCombinations.length === 0) {
      return;
    }

    // Paso 5: Hacer una sola petición batch con todas las combinaciones usando helper centralizado
    const batchQueries = allCombinations.map(combo => combo.params);
    await executeBatchPrefetch(batchQueries, 'usePreloadAllProducts');
  }, [preloadedMenus, getSubmenusFromCacheMap, waitForAllMenus, menusLoaded, buildPrefetchParams, shouldPrefetch]);

  useEffect(() => {
    // Solo ejecutar una vez
    if (hasPreloadedRef.current) {
      return;
    }

    // Esperar a que las categorías se carguen
    if (categoriesLoading || visibleCategories.length === 0) {
      return;
    }

    // Iniciar precarga inmediatamente (sin delays innecesarios)
    // Usar un microtask para no bloquear el render inicial
    const startPreload = async () => {
      if (hasPreloadedRef.current) return;
      hasPreloadedRef.current = true;

      // Filtrar solo categorías dinámicas
      const dynamicCategories = visibleCategories.filter(
        (category) => category.uuid && !isStaticCategoryUuid(category.uuid)
      );

      if (dynamicCategories.length === 0) {
        return;
      }

      // Ejecutar precarga en background (no bloquea UI)
      // El orden estricto se maneja dentro de preloadAllCombinations
      preloadAllCombinations(dynamicCategories).catch(() => {
        // Silenciar errores finales - no afectar UX
      });
    };

    // Usar Promise.resolve().then() para ejecutar en el siguiente microtask
    // Esto permite que el render inicial se complete antes de iniciar precarga
    Promise.resolve().then(() => {
      startPreload();
    });
  }, [categoriesLoading, visibleCategories.length, preloadAllCombinations]);
}

