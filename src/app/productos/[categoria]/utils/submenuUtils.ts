/**
 * Utilidades para manejo de submenús
 */

/**
 * Convierte un nombre de submenú a una URL amigable
 */
export function submenuNameToFriendly(name: string): string {
  return name
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * Convierte una URL amigable de vuelta al nombre original
 * Esta función es aproximada ya que no podemos recuperar exactamente el nombre original
 */
export function friendlyToSubmenuName(friendly: string): string {
  return friendly
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Busca un submenú por su nombre amigable en una lista de submenús
 */
export function findSubmenuByFriendlyName(
  submenus: Array<{ uuid: string; nombre: string; nombreVisible: string }>,
  friendlyName: string
): { uuid: string; nombre: string; nombreVisible: string } | undefined {
  return submenus.find(submenu => {
    const submenuName = submenu.nombreVisible || submenu.nombre;
    const friendly = submenuNameToFriendly(submenuName);
    return friendly === friendlyName;
  });
}
