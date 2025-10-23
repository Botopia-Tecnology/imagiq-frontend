import { useSearchParams } from 'next/navigation';
import { useMemo } from 'react';
import { useCurrentMenu } from './useCurrentMenu';
import type { CategoriaParams } from '@/app/productos/[categoria]/types';

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

  const hierarchy = useMemo(() => {
    // Código de categoría (IM, DA, IT, AV)
    const categoryCode = CATEGORIA_TO_API_CODE[categoria];

    // UUID de la categoría (para referencia, si se necesita)
    const categoryUuid = currentMenu?.categoriasVisiblesId || undefined;

    // UUID del menú actual
    const menuUuid = currentMenu?.uuid || undefined;

    // UUID del submenú: buscar en los submenus del currentMenu el que coincida con el filtro "serie" activo
    let submenuUuid: string | undefined = undefined;

    const serieParam = searchParams?.get('serie');

    if (serieParam && currentMenu?.submenus) {
      // Buscar el submenú que coincida con el UUID de la serie seleccionada
      const selectedSubmenu = currentMenu.submenus.find(
        submenu => submenu.uuid === serieParam
      );

      submenuUuid = selectedSubmenu?.uuid;
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
      currentMenuName: currentMenu?.nombreVisible || currentMenu?.nombre
    });

    return {
      categoryCode,
      categoryUuid,
      menuUuid,
      submenuUuid,
      loading
    };
  }, [currentMenu, searchParams, loading, categoria]);

  return hierarchy;
}
