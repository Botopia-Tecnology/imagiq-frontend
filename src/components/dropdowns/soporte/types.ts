export interface SupportSection {
  title: string;
  links: SupportLink[];
}

export interface SupportLink {
  name: string;
  href: string;
}

export interface SupportImage {
  name: string;
  imageSrc: string;
  imageAlt: string;
  href: string;
}
