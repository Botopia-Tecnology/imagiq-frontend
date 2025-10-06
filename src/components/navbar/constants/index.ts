import type { DropdownName } from "../types";

export const DROPDOWNS: readonly DropdownName[] = [
  "Ofertas",
  "Dispositivos móviles",
  "Televisores y AV",
  "Electrodomésticos",
  "Monitores",
  "Accesorios",
] as const;

export const MENU_ORDER: readonly string[] = [
  "Ofertas",
  "Dispositivos móviles",
  "Televisores y AV",
  "Electrodomésticos",
  "Monitores",
  "Accesorios",
] as const;

export const ICON_STYLES = {
  button: "flex items-center justify-center w-10 h-10",
  badge:
    "absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-extrabold transition-transform duration-150 ease-out",
} as const;
