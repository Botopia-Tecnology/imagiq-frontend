/**
 * Hook para pre-cargar los menús de todas las categorías dinámicas
 * cuando se carga la página. Los menús se cargan en paralelo para
 * mejorar el tiempo de respuesta cuando el usuario hace hover.
 * También precarga todos los submenús usando una sola petición al endpoint
 * /api/categorias/visibles/completas para evitar "Too many requests".
 */

import { useEffect, useState, useRef } from 'react';
import { menusEndpoints, categoriesEndpoints, populateSubmenusCache, type Menu } from '@/lib/api';
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
  // Ref para rastrear si ya se precargaron los submenús
  const submenusPreloadedRef = useRef<boolean>(false);

  useEffect(() => {
    // Esperar a que las categorías se carguen
    if (categoriesLoading || visibleCategories.length === 0) {
      return;
    }

    // Filtrar solo categorías dinámicas (no estáticas)
    const dynamicCategories = visibleCategories.filter(
      (category) => category.uuid && !isStaticCategoryUuid(category.uuid)
    );

    // PRECARGAR SUBMENÚS INMEDIATAMENTE (no esperar a que se carguen los menús)
    // Esto asegura que los submenús estén disponibles en caché antes de que el usuario los necesite
    if (!submenusPreloadedRef.current) {
      submenusPreloadedRef.current = true;

      // Función helper para cargar submenús con reintento
      const loadSubmenusWithRetry = async (attempt: number = 1, maxAttempts: number = 3): Promise<void> => {
        try {
          const response = await categoriesEndpoints.getCompleteCategories();
          if (response.success && response.data) {
            // Poblar el caché de submenús directamente desde la respuesta
            populateSubmenusCache(response.data);
          } else if (attempt < maxAttempts) {
            // Reintentar si falló pero no fue un error de red
            const backoffDelay = attempt * 2000; // 2s, 4s, 6s
            setTimeout(() => {
              loadSubmenusWithRetry(attempt + 1, maxAttempts);
            }, backoffDelay);
          }
        } catch (error) {
          // Reintentar en caso de error
          if (attempt < maxAttempts) {
            const backoffDelay = attempt * 2000; // 2s, 4s, 6s
            setTimeout(() => {
              loadSubmenusWithRetry(attempt + 1, maxAttempts);
            }, backoffDelay);
          }
        }
      };

      // Iniciar carga inmediatamente
      loadSubmenusWithRetry();
    }

    // Pre-cargar menús de todas las categorías dinámicas en paralelo
    // (Esto se ejecuta en paralelo con la carga de submenús)
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
              // Guardar en estado
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

      // Ejecutar en paralelo (no esperar)
      Promise.allSettled(menuPromises);
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

  /**
   * Priorizar la carga del menú de una categoría específica
   * Útil cuando el usuario hace hover sobre una categoría en el navbar
   * Si la categoría ya está cargada o cargando, retorna inmediatamente
   * Si no, inicia la carga inmediatamente
   */
  const prioritizeCategory = (categoryUuid: string): void => {
    // Si ya está cargada, no hacer nada
    if (preloadedMenus[categoryUuid]) {
      return;
    }

    // Si ya está cargando o siendo procesada, no iniciar otra carga
    // El endpoint menusEndpoints.getMenusByCategory ya maneja deduplicación
    if (loadingStates[categoryUuid] || processingRef.current.has(categoryUuid)) {
      return;
    }

    // Marcar como siendo procesada
    processingRef.current.add(categoryUuid);
    setLoadingStates((prev) => ({ ...prev, [categoryUuid]: true }));

    // Iniciar carga inmediatamente
    menusEndpoints
      .getMenusByCategory(categoryUuid)
      .then((response) => {
        if (response.success && response.data) {
          setPreloadedMenus((prev) => ({
            ...prev,
            [categoryUuid]: response.data,
          }));
        }
      })
      .catch((error) => {
        console.error(`Error prioritizing menu load for category ${categoryUuid}:`, error);
      })
      .finally(() => {
        processingRef.current.delete(categoryUuid);
        setLoadingStates((prev) => {
          const updated = { ...prev };
          delete updated[categoryUuid];
          return updated;
        });
      });
  };

  return {
    preloadedMenus,
    loadingStates,
    getMenus,
    isLoading,
    isLoaded,
    prioritizeCategory,
  };
}
