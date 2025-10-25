import type { DropdownName } from "../types";

const DROPDOWNS: readonly DropdownName[] = [
  "Ofertas",
  "Dispositivos móviles",
  "Televisores y AV",
  "Electrodomésticos",
  "Monitores",
  "Accesorios",
  "Soporte",
] as const;

export const hasDropdownMenu = (name: string): name is DropdownName =>
  (DROPDOWNS as readonly string[]).includes(name);

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
