export type ProductItem = {
  readonly name: string;
  readonly imageSrc: string;
};

export type PromoItem = {
  readonly title: string;
  readonly href: string;
  readonly imageSrc: string;
  readonly imageAlt: string;
};

export type DropdownProps = {
  readonly isMobile?: boolean;
  readonly onItemClick?: () => void;
};
