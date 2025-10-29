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
  // Legacy support (deprecated)
  subcategorias?: Array<{
    uuid: string;
    nombre: string;
    nombreVisible: string;
    descripcion: string;
    imagen: string;
    activo: boolean;
    categoriasVisiblesId: string;
    createdAt: string;
    updatedAt: string;
  }>;
  /**
   * @deprecated Los menús ahora se cargan bajo demanda al hacer hover/click.
   * Este campo ya no se llena desde useVisibleCategories.
   * En su lugar, se cargan dinámicamente desde /api/categorias/visibles/{uuid}/menus
   */
  menus?: Array<{
    uuid: string;
    nombre: string;
    nombreVisible: string;
    descripcion: string;
    imagen: string;
    activo: boolean;
    orden: number;
    categoriasVisiblesId: string;
    createdAt: string;
    updatedAt: string;
    submenus: Array<{
      uuid: string;
      nombre: string;
      nombreVisible: string;
      descripcion: string;
      imagen: string;
      activo: boolean;
      orden: number;
      menusVisiblesId: string;
      createdAt: string;
      updatedAt: string;
      totalProducts: number;
    }>;
  }>;
};
