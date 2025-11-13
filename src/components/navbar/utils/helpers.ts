import type { DropdownName, NavItem } from "../types";

const STATIC_DROPDOWNS: readonly DropdownName[] = [
  "Ofertas",
] as const;

/**
 * Determina si una categoría debe mostrar dropdown
 * - Categorías dinámicas con UUID: siempre muestran dropdown (los menús se cargan bajo demanda)
 * - Categorías estáticas: solo si están en STATIC_DROPDOWNS
 */
export const hasDropdownMenu = (name: string, item?: NavItem): name is DropdownName => {
  // Si la categoría tiene UUID y no es estática (ofertas, tiendas, soporte), tiene dropdown
  if (item?.uuid && !['ofertas', 'tiendas', 'soporte'].includes(item.uuid)) {
    return true;
  }
  
  // Para categorías estáticas, verificar si están en la lista
  return (STATIC_DROPDOWNS as readonly string[]).includes(name);
};

export const getDropdownPosition = (itemName: string) => {
  if (typeof window === "undefined") return { left: 0, top: 0 } as const;

  const itemEl = document.querySelector(
    `[data-item-name="${itemName}"]`
  ) as HTMLElement | null;

  const headerEl = document.querySelector(
    'header[data-navbar="true"]'
  ) as HTMLElement | null;

  const itemRect = itemEl?.getBoundingClientRect();
  const headerRect = headerEl?.getBoundingClientRect();

  const top = headerRect ? Math.round(headerRect.bottom) : Math.round((itemRect?.bottom ?? 0));
  const left = Math.round(itemRect?.left ?? 0);

  return { left, top } as const;
};
