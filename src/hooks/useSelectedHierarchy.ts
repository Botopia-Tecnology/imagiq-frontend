import { useSearchParams } from 'next/navigation';
import { useMemo } from 'react';
import { useCurrentMenu } from './useCurrentMenu';
import { useSubmenus } from './useSubmenus';
import type { CategoriaParams } from '@/app/productos/[categoria]/types';
import { findSubmenuByFriendlyName } from '@/app/productos/[categoria]/utils/submenuUtils';
import { useVisibleCategories } from './useVisibleCategories';

/**
 * Hook para obtener la jerarquía seleccionada (categoría, menú, submenú)
 * basándose en la URL y los filtros activos de serie
 */
export function useSelectedHierarchy(categoriaNombre?: string, seccion?: string) {
  const searchParams = useSearchParams();
  const { visibleCategories } = useVisibleCategories();
  const { currentMenu, loading } = useCurrentMenu(categoriaNombre, seccion);
  // Evitar cargar submenús si no hay sección seleccionada
  const { submenus } = useSubmenus(seccion ? (currentMenu?.uuid || null) : null);

  const hierarchy = useMemo(() => {
    // Encontrar categoría por nombre para obtener el código
    const category = categoriaNombre 
      ? visibleCategories.find(cat => cat.nombre === categoriaNombre)
      : null;
    const categoryCode = category?.nombre || '';

    // UUID de la categoría (para referencia, si se necesita)
    const categoryUuid = currentMenu?.categoriasVisiblesId || undefined;

    // UUID del menú actual: solo incluir si hay una sección en la URL
    // Si no hay sección, NO incluir menuUuid para que se muestren todos los productos de la categoría
    const menuUuid = seccion && currentMenu?.uuid ? currentMenu.uuid : undefined;

    // UUID del submenú: buscar en los submenus del currentMenu el que coincida con el filtro "submenu" activo
    // IMPORTANTE: Solo buscar submenu si hay un menú actual y submenús disponibles
    // Si cambiamos de menú, el submenu anterior no debería aplicarse al nuevo menú
    let submenuUuid: string | undefined = undefined;

    const submenuParam = searchParams?.get('submenu');

    // Solo buscar submenu si:
    // 1. Hay un parámetro submenu en la URL
    // 2. Hay un menú actual (seccion existe y currentMenu existe)
    // 3. Hay submenús disponibles para el menú actual
    if (submenuParam && seccion && currentMenu && submenus.length > 0) {
      // Buscar el submenú que coincida con el nombre amigable del submenú seleccionado
      const selectedSubmenu = findSubmenuByFriendlyName(submenus, submenuParam);

      // Solo usar el submenuUuid si el submenu encontrado pertenece al menú actual
      if (selectedSubmenu) {
        submenuUuid = selectedSubmenu.uuid;
      }
      // Si no se encuentra el submenu en los submenus del menú actual, no usar ningún submenuUuid
      // Esto previene que un submenu de un menú anterior se aplique a un menú nuevo
    }

    return {
      categoryCode,
      categoryUuid,
      menuUuid,
      submenuUuid,
      loading
    };
  }, [currentMenu, searchParams, loading, categoriaNombre, submenus, visibleCategories, seccion]);

  return hierarchy;
}
