export type Variant = "desktop" | "tablet" | "mobile";

export type DropdownName =
  | "Ofertas"
  | "Dispositivos móviles"
  | "Televisores y AV"
  | "Electrodomésticos"
  | "Monitores"
  | "Accesorios"
  | "Soporte";

export type NavItem = {
  name: string;
  href: string;
  category: string;
};
