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
  const { submenus } = useSubmenus(currentMenu?.uuid || null);

  const hierarchy = useMemo(() => {
    // Encontrar categoría por nombre para obtener el código
    const category = categoriaNombre 
      ? visibleCategories.find(cat => cat.nombre === categoriaNombre)
      : null;
    const categoryCode = category?.nombre || '';

    // UUID de la categoría (para referencia, si se necesita)
    const categoryUuid = currentMenu?.categoriasVisiblesId || undefined;

    // UUID del menú actual
    const menuUuid = currentMenu?.uuid || undefined;

    // UUID del submenú: buscar en los submenus del currentMenu el que coincida con el filtro "submenu" activo
    let submenuUuid: string | undefined = undefined;

    const submenuParam = searchParams?.get('submenu');

    if (submenuParam && submenus.length > 0) {
      // Buscar el submenú que coincida con el nombre amigable del submenú seleccionado
      const selectedSubmenu = findSubmenuByFriendlyName(submenus, submenuParam);

      submenuUuid = selectedSubmenu?.uuid;
    }

    return {
      categoryCode,
      categoryUuid,
      menuUuid,
      submenuUuid,
      loading
    };
  }, [currentMenu, searchParams, loading, categoriaNombre, submenus, visibleCategories]);

  return hierarchy;
}
