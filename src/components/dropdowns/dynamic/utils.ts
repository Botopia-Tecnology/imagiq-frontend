import type { Menu } from '@/lib/api';
import type { MenuItem } from './types';
import { toSlug } from '@/app/productos/[categoria]/utils/slugUtils';

/**
 * Genera la URL href para un menú basado en el código de categoría y nombre del menú
 * Ahora completamente dinámico usando slugs generados desde nombres de la API
 */
export const generateMenuHref = (
  categoryCode: string, 
  menuName: string,
  categoryVisibleName?: string  // Nombre visible de la categoría para generar slug dinámico
): string => {
  // Si tenemos nombre visible, generar slug dinámicamente
  // Si no, usar el código como fallback
  const baseHref = categoryVisibleName 
    ? `/productos/${toSlug(categoryVisibleName)}`
    : `/productos/${categoryCode.toLowerCase()}`;

  // Generar slug del menú dinámicamente desde su nombre
  const section = toSlug(menuName);

  // IMPORTANTE: Cuando cambiamos de menú, eliminar el parámetro submenu
  // porque el submenu pertenece al menú anterior, no al nuevo
  return `${baseHref}?seccion=${section}`;
};

/**
 * Convierte los menús de la API en items para el dropdown
 * Ahora acepta nombreVisible de la categoría para generar URLs dinámicas
 */
export const transformMenusToItems = (
  menus: Menu[], 
  categoryCode: string,
  categoryVisibleName?: string
): MenuItem[] => {
  return menus
    .filter(menu => menu.activo) // Solo menús activos
    .sort((a, b) => a.orden - b.orden) // Ordenar por campo orden
    .map(menu => ({
      uuid: menu.uuid,
      name: menu.nombreVisible || menu.nombre,
      href: generateMenuHref(categoryCode, menu.nombreVisible || menu.nombre, categoryVisibleName),
      imageSrc: menu.imagen || undefined,
      imageAlt: menu.nombreVisible || menu.nombre,
      activo: menu.activo,
      orden: menu.orden
    }));
};
