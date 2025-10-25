import { useState, useCallback } from 'react';
import { menusEndpoints, type Menu } from '@/lib/api';

interface MenusCache {
  [categoryUuid: string]: {
    data: Menu[];
    loading: boolean;
    error: string | null;
  };
}

export function useMenusLazy() {
  const [menusCache, setMenusCache] = useState<MenusCache>({});

  const loadMenus = useCallback(async (categoryUuid: string) => {
    // Si ya está cargado o cargando, no hacer nada
    if (menusCache[categoryUuid]) {
      return menusCache[categoryUuid].data;
    }

    // Marcar como cargando
    setMenusCache(prev => ({
      ...prev,
      [categoryUuid]: {
        data: [],
        loading: true,
        error: null
      }
    }));

    try {
      const response = await menusEndpoints.getMenusByCategory(categoryUuid);

      if (response.success && response.data) {
        const activeMenus = response.data
          .filter(menu => menu.activo)
          .sort((a, b) => a.orden - b.orden);

        setMenusCache(prev => ({
          ...prev,
          [categoryUuid]: {
            data: activeMenus,
            loading: false,
            error: null
          }
        }));

        return activeMenus;
      } else {
        const errorMsg = response.message || 'Error al cargar menús';
        setMenusCache(prev => ({
          ...prev,
          [categoryUuid]: {
            data: [],
            loading: false,
            error: errorMsg
          }
        }));
        return [];
      }
    } catch (err) {
      console.error('Error loading menus:', err);
      setMenusCache(prev => ({
        ...prev,
        [categoryUuid]: {
          data: [],
          loading: false,
          error: 'Error al cargar menús'
        }
      }));
      return [];
    }
  }, [menusCache]);

  const getMenus = useCallback((categoryUuid: string) => {
    return menusCache[categoryUuid]?.data || [];
  }, [menusCache]);

  const isLoading = useCallback((categoryUuid: string) => {
    return menusCache[categoryUuid]?.loading || false;
  }, [menusCache]);

  const getError = useCallback((categoryUuid: string) => {
    return menusCache[categoryUuid]?.error || null;
  }, [menusCache]);

  return {
    loadMenus,
    getMenus,
    isLoading,
    getError
  };
}
