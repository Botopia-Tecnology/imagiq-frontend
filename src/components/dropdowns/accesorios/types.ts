export type MainItem = {
  readonly name: string;
  readonly href: string;
  readonly imageSrc: string;
  readonly imageAlt: string;
};

export type DropdownProps = {
  readonly isMobile?: boolean;
  readonly onItemClick?: () => void;
};
