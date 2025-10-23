import { useMemo } from 'react';
import { useVisibleCategories } from './useVisibleCategories';
import type { Menu } from '@/lib/api';
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

// Mapeo de secciones a nombres de menú esperados (basado en los datos reales de la API)
const SECCION_TO_MENU_NAME: Record<string, string> = {
  'smartphones': 'Smartphones Galaxy',
  'tabletas': 'Galaxy Tab',
  'relojes': 'Galaxy Watch',
  'buds': 'Galaxy Buds',
  'accesorios': 'Accesorios para Galaxy',
  'refrigeradores': 'Neveras',
  'lavadoras': 'Lavadoras y Secadoras',
  'lavavajillas': 'Lavavajillas',
  'aire-acondicionado': 'Aire Acondicionado',
  'microondas': 'Hornos Microondas',
  'aspiradoras': 'Aspiradoras',
  'hornos': 'Hornos',
  'smart-tv': 'Smart TV',
  'qled': 'QLED',
  'crystal-uhd': 'Crystal UHD'
};

/**
 * Hook para obtener el menú actual basado en la categoría y sección activa
 */
export function useCurrentMenu(categoria: CategoriaParams, seccion?: string): {
  currentMenu: Menu | null;
  loading: boolean;
} {
  const { visibleCategories, loading } = useVisibleCategories();

  const currentMenu = useMemo(() => {
    // Si está cargando, no intentar buscar el menú aún
    if (loading) {
      return null;
    }

    // Obtener el código de API para la categoría
    const apiCode = CATEGORIA_TO_API_CODE[categoria];
    if (!apiCode) {
      return null;
    }

    // Buscar la categoría que coincida con el código
    const category = visibleCategories.find(cat => cat.nombre === apiCode);

    if (!category || !category.menus || category.menus.length === 0) {
      return null;
    }

    // Si no hay sección especificada, retornar el primer menú activo
    if (!seccion) {
      return category.menus.find(m => m.activo) || null;
    }

    // Obtener el nombre esperado del menú para la sección
    const expectedMenuName = SECCION_TO_MENU_NAME[seccion];

    // Debug: log para verificar el mapeo
    console.log('🔍 Debug useCurrentMenu:', {
      categoria,
      seccion,
      expectedMenuName,
      availableMenus: category.menus.map(m => ({
        uuid: m.uuid,
        nombre: m.nombre,
        nombreVisible: m.nombreVisible,
        activo: m.activo
      }))
    });

    // Buscar el menú que coincida con la sección
    const menu = category.menus.find(m => {
      if (!m.activo) return false;

      const menuName = (m.nombreVisible || m.nombre).toLowerCase();
      const sectionName = seccion.toLowerCase();

      // Match exacto con el nombre esperado
      if (expectedMenuName && menuName === expectedMenuName.toLowerCase()) {
        console.log('✅ Match exacto encontrado:', { menuName, expectedMenuName });
        return true;
      }

      // Match por inclusión
      const inclusionMatch = menuName.includes(sectionName) ||
             sectionName.includes(menuName) ||
             m.uuid === seccion;
      
      if (inclusionMatch) {
        console.log('✅ Match por inclusión encontrado:', { menuName, sectionName });
      }

      return inclusionMatch;
    });

    console.log('🔍 Menu encontrado:', menu ? { uuid: menu.uuid, nombre: menu.nombreVisible } : null);

    return menu || null;
  }, [visibleCategories, loading, categoria, seccion]);

  return { currentMenu, loading };
}
