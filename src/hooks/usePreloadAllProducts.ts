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
import { menusEndpoints, type Submenu } from '@/lib/api';
import { usePrefetchProducts } from './usePrefetchProducts';
import { isStaticCategoryUuid } from '@/constants/staticCategories';
import type { VisibleCategory } from '@/lib/api';

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
  const { prefetchProducts } = usePrefetchProducts();
  const hasPreloadedRef = useRef(false);
  const prefetchingRef = useRef<Set<string>>(new Set());

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
    
    // Si llegamos aquí, algunos menús no se cargaron a tiempo, pero continuamos de todas formas
    console.debug('[PreloadAllProducts] Algunos menús no se cargaron a tiempo, continuando de todas formas');
  }, []);

  /**
   * Precarga todos los submenús de todos los menús en paralelo
   */
  const preloadAllSubmenus = useCallback(async (categories: VisibleCategory[]): Promise<Map<string, Submenu[]>> => {
    const submenusMap = new Map<string, Submenu[]>();
    const submenuPromises: Array<Promise<void>> = [];

    // Recopilar todos los menús de todas las categorías
    const allMenus: Array<{ menuUuid: string; categoryCode: string }> = [];
    
    for (const category of categories) {
      if (!category.uuid || !category.nombre) continue;
      const menus = preloadedMenus[category.uuid] || [];
      
      for (const menu of menus) {
        if (menu.activo && menu.uuid) {
          allMenus.push({
            menuUuid: menu.uuid,
            categoryCode: category.nombre,
          });
        }
      }
    }

    // Precargar todos los submenús en paralelo (sin límite de concurrencia para submenús)
    for (const { menuUuid } of allMenus) {
      const promise = menusEndpoints
        .getSubmenus(menuUuid)
        .then((response) => {
          if (response.success && response.data) {
            const activeSubmenus = (response.data as Submenu[]).filter(
              (submenu) => submenu.activo
            );
            submenusMap.set(menuUuid, activeSubmenus);
          }
        })
        .catch((error) => {
          // Silenciar errores al cargar submenús
          console.debug(`[PreloadAllProducts] Error cargando submenús para menú ${menuUuid}:`, error);
        });

      submenuPromises.push(promise);
    }

    // Esperar a que todos los submenús se carguen completamente
    await Promise.allSettled(submenuPromises);
    
    return submenusMap;
  }, [preloadedMenus]);

  /**
   * Precarga todas las combinaciones posibles de productos
   */
  const preloadAllCombinations = useCallback(async (categories: VisibleCategory[]) => {
    // Paso 1: Esperar activamente a que todos los menús estén cargados
    await waitForAllMenus(categories, menusLoaded);

    // Paso 2: Precargar todos los submenús en paralelo y esperar a que terminen
    const submenusMap = await preloadAllSubmenus(categories);

    // Paso 3: Generar todas las combinaciones de productos
    const prefetchPromises: Array<Promise<void>> = [];
    let activeRequests = 0;

    // Función para ejecutar prefetch con control de concurrencia mejorado
    const executePrefetch = async (
      categoryCode: string,
      menuUuid?: string,
      submenuUuid?: string
    ): Promise<void> => {
      // Generar clave única para evitar duplicados
      const key = `${categoryCode}|${menuUuid || ''}|${submenuUuid || ''}`;
      
      if (prefetchingRef.current.has(key)) {
        return;
      }

      prefetchingRef.current.add(key);

      // Esperar si hay demasiadas peticiones activas
      while (activeRequests >= MAX_CONCURRENT_REQUESTS) {
        await new Promise(resolve => setTimeout(resolve, 50)); // Reducido de 100ms a 50ms
      }

      activeRequests++;

      try {
        await prefetchProducts({
          categoryCode,
          menuUuid,
          submenuUuid,
        });
      } catch (error) {
        // Silenciar errores - no afectar la UX
        console.debug('[PreloadAllProducts] Error silencioso:', error);
      } finally {
        activeRequests--;
        prefetchingRef.current.delete(key);
      }
    };

    // Generar todas las combinaciones posibles
    for (const category of categories) {
      if (!category.uuid || !category.nombre) continue;

      const categoryCode = category.nombre;
      const menus = preloadedMenus[category.uuid] || [];

      // 1. Precargar productos de la categoría base (sin menú ni submenú)
      prefetchPromises.push(executePrefetch(categoryCode));

      // 2. Para cada menú, precargar productos
      for (const menu of menus) {
        if (!menu.activo || !menu.uuid) continue;

        // Precargar productos de categoría + menú
        prefetchPromises.push(executePrefetch(categoryCode, menu.uuid));

        // 3. Usar submenús ya precargados para precargar productos de cada combinación
        const submenus = submenusMap.get(menu.uuid) || [];
        
        for (const submenu of submenus) {
          if (!submenu.uuid) continue;
          prefetchPromises.push(
            executePrefetch(categoryCode, menu.uuid, submenu.uuid)
          );
        }
      }
    }

    // Ejecutar todas las precargas y esperar a que todas terminen
    // Esto asegura que todas las combinaciones se precarguen antes de considerar completado
    await Promise.allSettled(prefetchPromises);
    
    console.debug(`[PreloadAllProducts] Precarga completada: ${prefetchPromises.length} combinaciones procesadas`);
  }, [preloadedMenus, prefetchProducts, preloadAllSubmenus, waitForAllMenus, menusLoaded]);

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
      preloadAllCombinations(dynamicCategories).catch((error) => {
        // Silenciar errores finales - no afectar UX
        console.debug('[PreloadAllProducts] Error en precarga general:', error);
      });
    };

    // Usar Promise.resolve().then() para ejecutar en el siguiente microtask
    // Esto permite que el render inicial se complete antes de iniciar precarga
    Promise.resolve().then(() => {
      startPreload();
    });
  }, [categoriesLoading, visibleCategories.length, preloadAllCombinations]);
}

