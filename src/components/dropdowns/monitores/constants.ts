import type { MainItem, PromoItem } from "./types";

export const MAIN_ITEMS: readonly MainItem[] = [
  {
    name: "Odyssey Gaming",
    href: "/productos/monitores?seccion=odyssey-gaming",
    imageSrc: "https://res.cloudinary.com/dqay3uml6/image/upload/v1759773426/Odyssey-gaming_xmgp2x.webp",
    imageAlt: "Odyssey Gaming",
  },
  {
    name: "ViewFinity High Resolution",
    href: "/productos/monitores?seccion=viewfinity-high-resolution",
    imageSrc: "https://res.cloudinary.com/dqay3uml6/image/upload/v1759773428/View-finity-high-resolution_mfrm6w.webp",
    imageAlt: "ViewFinity High Resolution",
  },
  {
    name: "Smart Monitor",
    href: "/productos/monitores?seccion=smart-monitor",
    imageSrc: "https://res.cloudinary.com/dqay3uml6/image/upload/v1759773428/Smart-monitor_mp15xd.webp",
    imageAlt: "Smart Monitor",
  },
  {
    name: "Essential Monitor",
    href: "/productos/monitores?seccion=essential-monitor",
    imageSrc: "https://res.cloudinary.com/dqay3uml6/image/upload/v1759773429/Essential-monitor_fzlkt0.webp",
    imageAlt: "Essential Monitor",
  },
] as const;

export const SIZES = {
  main: { container: 100, image: 90 },
  promo: { default: 48 },
} as const;
