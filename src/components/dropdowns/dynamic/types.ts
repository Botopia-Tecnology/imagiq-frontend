import type { Menu } from '@/lib/api';

export type DynamicDropdownProps = {
  menus: Menu[];
  categoryName: string;
  categoryCode: string;
  categoryVisibleName?: string; // Nombre visible de la categoría para generar slugs dinámicos
  isMobile?: boolean;
  onItemClick?: () => void;
  loading?: boolean;
};

export type MenuItem = {
  uuid: string;
  name: string;
  href: string;
  imageSrc?: string;
  imageAlt?: string;
  activo: boolean;
  orden: number;
};
