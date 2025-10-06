export type DropdownProps = {
  isMobile?: boolean;
  onItemClick?: () => void;
};

export type MainItem = {
  readonly name: string;
  readonly href: string;
  readonly imageSrc: string;
  readonly imageAlt: string;
};

export type PromoItem = {
  readonly title: string;
  readonly href: string;
  readonly imageSrc: string;
  readonly imageAlt: string;
};
