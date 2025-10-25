import type { Menu } from '@/lib/api';

export type DynamicDropdownProps = {
  categoryUuid: string;
  categoryName: string;
  categoryCode: string;
  isMobile?: boolean;
  onItemClick?: () => void;
  // Deprecated: usar categoryUuid en su lugar
  menus?: Menu[];
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
