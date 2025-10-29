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
  categoryCode?: string;
  categoryVisibleName?: string; // Nombre visible de la categoría para generar slugs dinámicos
  dropdownName?: string;
  uuid?: string;
  /**
   * Total de productos en esta categoría.
   * Este valor ahora viene directamente del endpoint /api/categorias/visibles
   */
  totalProducts?: number;
  orden?: number;
};
