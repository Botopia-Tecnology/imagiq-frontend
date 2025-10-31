/**
 * Hook para pre-cargar los menús de todas las categorías dinámicas
 * cuando se carga la página. Los menús se cargan en paralelo para
 * mejorar el tiempo de respuesta cuando el usuario hace hover.
 */

import { useEffect, useState, useRef } from 'react';
import { menusEndpoints, type Menu } from '@/lib/api';
import { useVisibleCategories } from './useVisibleCategories';
import { isStaticCategoryUuid } from '@/constants/staticCategories';

interface PreloadedMenus {
  [categoryUuid: string]: Menu[];
}

interface LoadingState {
  [categoryUuid: string]: boolean;
}

/**
 * Hook que pre-carga los menús de todas las categorías dinámicas
 * Retorna los menús cargados y el estado de carga por categoría
 */
export function usePreloadCategoryMenus() {
  const { visibleCategories, loading: categoriesLoading } = useVisibleCategories();
  const [preloadedMenus, setPreloadedMenus] = useState<PreloadedMenus>({});
  const [loadingStates, setLoadingStates] = useState<LoadingState>({});
  // Ref para rastrear qué categorías ya están siendo procesadas
  const processingRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    // Esperar a que las categorías se carguen
    if (categoriesLoading || visibleCategories.length === 0) {
      return;
    }

    // Filtrar solo categorías dinámicas (no estáticas)
    const dynamicCategories = visibleCategories.filter(
      (category) => category.uuid && !isStaticCategoryUuid(category.uuid)
    );

    // Pre-cargar menús de todas las categorías dinámicas en paralelo
    const loadAllMenus = async () => {
      const menuPromises: Array<Promise<void>> = [];
      const loadingUpdates: LoadingState = {};

      // Primero, identificar qué categorías necesitan cargarse
      const categoriesToLoad = dynamicCategories.filter((category) => {
        if (!category.uuid) return false;
        // No cargar si ya está cargado, cargando, o siendo procesado
        return (
          !preloadedMenus[category.uuid] &&
          !loadingStates[category.uuid] &&
          !processingRef.current.has(category.uuid)
        );
      });

      // Marcar todas las categorías como siendo procesadas
      categoriesToLoad.forEach((category) => {
        if (category.uuid) {
          processingRef.current.add(category.uuid);
          loadingUpdates[category.uuid] = true;
        }
      });

      // Actualizar estados de carga
      if (Object.keys(loadingUpdates).length > 0) {
        setLoadingStates((prev) => ({ ...prev, ...loadingUpdates }));
      }

      // Crear promesas para cargar menús en paralelo
      categoriesToLoad.forEach((category) => {
        if (!category.uuid) return;

        const promise = menusEndpoints
          .getMenusByCategory(category.uuid)
          .then((response) => {
            if (response.success && response.data) {
              setPreloadedMenus((prev) => ({
                ...prev,
                [category.uuid]: response.data,
              }));
            }
          })
          .catch((error) => {
            console.error(`Error loading menus for category ${category.uuid}:`, error);
          })
          .finally(() => {
            processingRef.current.delete(category.uuid);
            setLoadingStates((prev) => {
              const updated = { ...prev };
              delete updated[category.uuid];
              return updated;
            });
          });

        menuPromises.push(promise);
      });

      // Esperar a que todas las peticiones terminen (o fallen)
      await Promise.allSettled(menuPromises);
    };

    loadAllMenus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoriesLoading, visibleCategories.length]); // Usar length en lugar de todo el array para evitar re-ejecuciones

  /**
   * Obtener los menús precargados de una categoría específica
   */
  const getMenus = (categoryUuid: string): Menu[] | undefined => {
    return preloadedMenus[categoryUuid];
  };

  /**
   * Verificar si los menús de una categoría están cargando
   */
  const isLoading = (categoryUuid: string): boolean => {
    return loadingStates[categoryUuid] || false;
  };

  /**
   * Verificar si los menús de una categoría ya están cargados
   */
  const isLoaded = (categoryUuid: string): boolean => {
    return !!preloadedMenus[categoryUuid];
  };

  return {
    preloadedMenus,
    loadingStates,
    getMenus,
    isLoading,
    isLoaded,
  };
}
