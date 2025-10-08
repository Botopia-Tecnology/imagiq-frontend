export type MainItem = {
  name: string;
  href: string;
  imageSrc: string;
  imageAlt: string;
  twoLinesName?: string;
};

export type PromoItem = {
  title: string;
  href: string;
  imageSrc: string;
  imageAlt: string;
};

export type DropdownProps = {
  isMobile?: boolean;
  onItemClick?: () => void;
};
