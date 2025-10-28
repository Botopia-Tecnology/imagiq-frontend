import { useMemo, useEffect, useState } from 'react';
import { useVisibleCategories } from './useVisibleCategories';
import { menusEndpoints, type Menu } from '@/lib/api';
import type { CategoriaParams } from '@/app/productos/[categoria]/types';
import { CATEGORY_API_CODES, getMenuNameForSection } from '@/app/productos/[categoria]/config/category-mappings';

/**
 * Hook para obtener el menú actual basado en la categoría y sección activa.
 * Los menús se cargan bajo demanda desde el endpoint /api/categorias/visibles/{uuid}/menus
 */
export function useCurrentMenu(categoria: CategoriaParams, seccion?: string): {
  currentMenu: Menu | null;
  loading: boolean;
} {
  const { visibleCategories, loading: categoriesLoading } = useVisibleCategories();
  const [menus, setMenus] = useState<Menu[]>([]);
  const [menusLoading, setMenusLoading] = useState(false);

  // Obtener la categoría actual
  const apiCode = CATEGORY_API_CODES[categoria];
  const category = visibleCategories.find(cat => cat.nombre === apiCode);

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

    // Obtener el nombre esperado del menú para la sección usando la nueva fuente de verdad
    const expectedMenuName = getMenuNameForSection(categoria, seccion);
    const sectionName = seccion.toLowerCase();

    // Buscar el menú que coincida con la sección
    const menu = menus.find(m => {
      if (!m.activo) return false;

      const menuName = (m.nombreVisible || m.nombre).toLowerCase();

      // Prioridad 1: Match exacto con el nombre esperado (más preciso)
      if (expectedMenuName && menuName === expectedMenuName.toLowerCase()) {
        return true;
      }

      // Prioridad 2: Match exacto por slug (convertir menuName a slug y comparar)
      // Esto maneja casos como "Hornos Microondas" → "hornos-microondas"
      const menuSlug = menuName
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Eliminar acentos
        .replace(/\s+/g, '-') // Espacios a guiones
        .replace(/[^\w-]/g, '') // Remover caracteres especiales
        .replace(/-+/g, '-') // Múltiples guiones a uno solo
        .replace(/^-|-$/g, ''); // Remover guiones al inicio/final
      
      if (menuSlug === sectionName) {
        return true;
      }

      // Prioridad 3: Match por UUID directo
      if (m.uuid === seccion) {
        return true;
      }

      // No hacer match si hay expectedMenuName definido
      return false;
    });

    return menu || null;
  }, [menus, menusLoading, categoriesLoading, seccion]);

  return {
    currentMenu,
    loading: categoriesLoading || menusLoading
  };
}
