import type { Menu } from '@/lib/api';

export type DynamicDropdownProps = {
  menus: Menu[];
  categoryName: string;
  categoryCode: string;
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
