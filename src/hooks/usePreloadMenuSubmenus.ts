/**
 * Hook para verificar y cargar submenús bajo demanda cuando el usuario entra a un menú
 * 
 * Verifica si los submenús ya están en caché (cargados en batch inicial).
 * Si no están, los carga en batch.
 */

import { useEffect, useRef } from 'react';
import { menusEndpoints } from '@/lib/api';
import { executeBatchPrefetch } from '@/lib/batchPrefetch';
import { usePrefetchCoordinator } from './usePrefetchCoordinator';
import { productCache } from '@/lib/productCache';
import type { ProductFilterParams } from '@/lib/api';

/**
 * Hook que verifica y carga submenús bajo demanda
 */
export function usePreloadMenuSubmenus(
  categoryCode?: string,
  menuUuid?: string
) {
  const { shouldPrefetch } = usePrefetchCoordinator();
  const previousMenuUuidRef = useRef<string | undefined>(undefined);
  const isProcessingRef = useRef(false);

  useEffect(() => {
    // Solo procesar si tenemos los datos necesarios
    if (!categoryCode || !menuUuid) {
      return;
    }

    // Solo procesar si el menuUuid cambió (usuario entró a un menú diferente)
    if (previousMenuUuidRef.current === menuUuid) {
      return;
    }

    // Evitar procesamiento simultáneo
    if (isProcessingRef.current) {
      return;
    }

    // Actualizar referencia
    previousMenuUuidRef.current = menuUuid;
    isProcessingRef.current = true;

    // Procesar de forma asíncrona
    const processSubmenus = async () => {
      try {
        // Obtener submenús del menú
        const submenusResponse = await menusEndpoints.getSubmenus(menuUuid);

        if (!submenusResponse.success || !submenusResponse.data) {
          isProcessingRef.current = false;
          return;
        }

        const activeSubmenus = submenusResponse.data.filter(
          (submenu) => submenu.activo && submenu.uuid
        );

        if (activeSubmenus.length === 0) {
          isProcessingRef.current = false;
          return;
        }

        // Construir parámetros para cada submenú y verificar caché
        const buildParams = (submenuUuid: string): ProductFilterParams => ({
          page: 1,
          limit: 50,
          precioMin: 1,
          lazyLimit: 6,
          lazyOffset: 0,
          sortBy: "precio",
          sortOrder: "desc",
          categoria: categoryCode,
          menuUuid: menuUuid,
          submenuUuid: submenuUuid,
        });

        // Filtrar solo los submenús que NO están en caché
        const submenusToPrefetch: ProductFilterParams[] = [];

        for (const submenu of activeSubmenus) {
          if (!submenu.uuid) continue;

          const params = buildParams(submenu.uuid);

          // Verificar si ya está en caché
          const cached = productCache.get(params);
          if (cached) {
            // Ya está en caché, no hacer nada
            continue;
          }

          // Verificar con el coordinador si debe precargarse
          if (shouldPrefetch(params)) {
            submenusToPrefetch.push(params);
          }
        }

        // Si hay submenús sin cargar, hacer batch de ellos
        if (submenusToPrefetch.length > 0) {
          console.debug(
            `[usePreloadMenuSubmenus] Cargando ${submenusToPrefetch.length} submenús en batch para menú ${menuUuid}`
          );
          await executeBatchPrefetch(submenusToPrefetch, 'usePreloadMenuSubmenus');
        } else {
          console.debug(
            `[usePreloadMenuSubmenus] Todos los submenús del menú ${menuUuid} ya están en caché`
          );
        }
      } catch (error) {
        // Silenciar errores - no afectar UX
        console.debug('[usePreloadMenuSubmenus] Error al procesar submenús:', error);
      } finally {
        isProcessingRef.current = false;
      }
    };

    processSubmenus();
  }, [categoryCode, menuUuid, shouldPrefetch]);
}

