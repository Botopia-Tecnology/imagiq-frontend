import { useMemo, useEffect, useState } from 'react';
import { useVisibleCategories } from './useVisibleCategories';
import { menusEndpoints, type Menu } from '@/lib/api';
import type { CategoriaParams } from '@/app/productos/[categoria]/types';
import { toSlug } from '@/app/productos/[categoria]/utils/slugUtils';

/**
 * Hook para obtener el menú actual basado en la categoría y sección activa.
 * Los menús se cargan bajo demanda desde el endpoint /api/categorias/visibles/{uuid}/menus
 */
export function useCurrentMenu(categoriaNombre?: string, seccion?: string): {
  currentMenu: Menu | null;
  loading: boolean;
} {
  const { visibleCategories, loading: categoriesLoading } = useVisibleCategories();
  const [menus, setMenus] = useState<Menu[]>([]);
  const [menusLoading, setMenusLoading] = useState(false);

  // Obtener la categoría actual por nombre
  const category = useMemo(() => {
    if (!categoriaNombre) return null;
    return visibleCategories.find(cat => cat.nombre === categoriaNombre);
  }, [visibleCategories, categoriaNombre]);

  // Cargar menús cuando la categoría está disponible
  useEffect(() => {
    if (!category?.uuid || categoriesLoading) return;

    let isMounted = true;

    const loadMenus = async () => {
      setMenusLoading(true);
      try {
        const response = await menusEndpoints.getMenusByCategory(category.uuid);
        if (response.success && response.data && isMounted) {
          setMenus(response.data);
        }
      } catch (error) {
        console.error('Error loading menus for category:', error);
      } finally {
        if (isMounted) {
          setMenusLoading(false);
        }
      }
    };

    loadMenus();

    return () => {
      isMounted = false;
    };
  }, [category?.uuid, categoriesLoading]);

  const currentMenu = useMemo(() => {
    // Si está cargando, no intentar buscar el menú aún
    if (categoriesLoading || menusLoading) {
      return null;
    }

    if (!menus.length) {
      return null;
    }

    // Si no hay sección especificada, retornar el primer menú activo
    if (!seccion) {
      return menus.find(m => m.activo) || null;
    }

    // Buscar menú por slug dinámicamente
    const sectionName = seccion.toLowerCase();

    // Buscar el menú que coincida con la sección por slug dinámicamente
    const menu = menus.find(m => {
      if (!m.activo) return false;

      const menuName = (m.nombreVisible || m.nombre).toLowerCase();

      // Prioridad 1: Match por slug dinámico
      const menuSlug = toSlug(menuName);
      
      if (menuSlug === sectionName) {
        return true;
      }

      // Prioridad 2: Match por UUID directo
      if (m.uuid === seccion) {
        return true;
      }

      return false;
    });

    return menu || null;
  }, [menus, menusLoading, categoriesLoading, seccion]);

  return {
    currentMenu,
    loading: categoriesLoading || menusLoading
  };
}
