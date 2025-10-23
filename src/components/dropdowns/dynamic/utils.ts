import type { Menu } from '@/lib/api';
import type { MenuItem } from './types';

/**
 * Genera la URL href para un menú basado en el código de categoría y nombre del menú
 */
export const generateMenuHref = (categoryCode: string, menuName: string): string => {
  const categoryHrefMap: Record<string, string> = {
    'IM': '/productos/dispositivos-moviles',
    'AV': '/productos/televisores',
    'DA': '/productos/electrodomesticos',
    'IT': '/productos/monitores'
  };

  const baseHref = categoryHrefMap[categoryCode] || `/productos/${categoryCode.toLowerCase()}`;

  // Mapeo de nombres de menú a secciones
  const sectionMap: Record<string, string> = {
    'Smartphones Galaxy': 'smartphones',
    'Galaxy Tab': 'tabletas',
    'Galaxy Watch': 'relojes',
    'Galaxy Buds': 'buds',
    'Accesorios para Galaxy': 'accesorios',
    // Añadir más mapeos según sea necesario
  };

  const section = sectionMap[menuName];

  if (section) {
    return `${baseHref}?seccion=${section}`;
  }

  // Si no hay mapeo específico, usar el nombre del menú normalizado
  const normalizedName = menuName.toLowerCase().replace(/\s+/g, '-');
  return `${baseHref}?seccion=${normalizedName}`;
};

/**
 * Convierte los menús de la API en items para el dropdown
 */
export const transformMenusToItems = (menus: Menu[], categoryCode: string): MenuItem[] => {
  return menus
    .filter(menu => menu.activo) // Solo menús activos
    .sort((a, b) => a.orden - b.orden) // Ordenar por campo orden
    .map(menu => ({
      uuid: menu.uuid,
      name: menu.nombreVisible || menu.nombre,
      href: generateMenuHref(categoryCode, menu.nombreVisible || menu.nombre),
      imageSrc: menu.imagen || undefined,
      imageAlt: menu.nombreVisible || menu.nombre,
      activo: menu.activo,
      orden: menu.orden
    }));
};
