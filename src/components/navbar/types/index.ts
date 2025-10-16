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
  dropdownName?: string;
  uuid?: string;
  totalProducts?: number;
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
};
