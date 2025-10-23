import { useSearchParams } from 'next/navigation';
import { useMemo } from 'react';
import { useCurrentMenu } from './useCurrentMenu';
import { useSubmenus } from './useSubmenus';
import type { CategoriaParams } from '@/app/productos/[categoria]/types';
import { findSubmenuByFriendlyName, submenuNameToFriendly } from '@/app/productos/[categoria]/utils/submenuUtils';

// Mapeo de categorías de URL a códigos de API
const CATEGORIA_TO_API_CODE: Record<CategoriaParams, string> = {
  'dispositivos-moviles': 'IM',
  'televisores': 'AV',
  'electrodomesticos': 'DA',
  'monitores': 'IT',
  'audio': 'AV',
  'ofertas': 'ofertas'
};

/**
 * Hook para obtener la jerarquía seleccionada (categoría, menú, submenú)
 * basándose en la URL y los filtros activos de serie
 */
export function useSelectedHierarchy(categoria: CategoriaParams, seccion?: string) {
  const searchParams = useSearchParams();
  const { currentMenu, loading } = useCurrentMenu(categoria, seccion);
  const { submenus } = useSubmenus(currentMenu?.uuid || null);

  const hierarchy = useMemo(() => {
    // Código de categoría (IM, DA, IT, AV)
    const categoryCode = CATEGORIA_TO_API_CODE[categoria];

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

      // Debug adicional para submenús
      console.log('🔍 Debug Submenu Search:', {
        submenuParam,
        availableSubmenus: submenus.map(s => ({
          uuid: s.uuid,
          nombre: s.nombre,
          nombreVisible: s.nombreVisible,
          friendly: submenuNameToFriendly(s.nombreVisible || s.nombre)
        })),
        selectedSubmenu: selectedSubmenu ? {
          uuid: selectedSubmenu.uuid,
          nombre: selectedSubmenu.nombre,
          nombreVisible: selectedSubmenu.nombreVisible
        } : null,
        submenuUuid
      });
    }

    // Debug: log para verificar el mapeo de categoría
    console.log('🔍 Debug useSelectedHierarchy:', {
      categoria,
      seccion,
      categoryCode,
      categoryUuid,
      menuUuid,
      submenuUuid,
      loading,
      currentMenuName: currentMenu?.nombreVisible || currentMenu?.nombre,
      submenuParam: searchParams?.get('submenu'),
      hasSubmenus: currentMenu?.submenus?.length || 0
    });

    return {
      categoryCode,
      categoryUuid,
      menuUuid,
      submenuUuid,
      loading
    };
  }, [currentMenu, searchParams, loading, categoria, submenus]);

  return hierarchy;
}
