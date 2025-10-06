import type { MainItem, PromoItem } from "./types";

export const MAIN_ITEMS: readonly MainItem[] = [
  {
    name: "Odyssey Gaming",
    href: "/productos/monitores?seccion=odyssey-gaming",
    imageSrc: "/CATEGORIAS/MONI/Odyssey-gaming.webp",
    imageAlt: "Odyssey Gaming",
  },
  {
    name: "ViewFinity High Resolution",
    href: "/productos/monitores?seccion=viewfinity-high-resolution",
    imageSrc: "/CATEGORIAS/MONI/View-finity-high-resolution.webp",
    imageAlt: "ViewFinity High Resolution",
  },
  {
    name: "Smart Monitor",
    href: "/productos/monitores?seccion=smart-monitor",
    imageSrc: "/CATEGORIAS/MONI/Smart-monitor.webp",
    imageAlt: "Smart Monitor",
  },
  {
    name: "Essential Monitor",
    href: "/productos/monitores?seccion=essential-monitor",
    imageSrc: "/CATEGORIAS/MONI/Essential-monitor.webp",
    imageAlt: "Essential Monitor",
  },
] as const;

export const PROMOS: readonly PromoItem[] = [
  {
    title: "Por qué un Monitor Gaming Odyssey",
    href: "/productos/monitores?seccion=por-que-odyssey",
    imageSrc: "/CATEGORIAS/MONI/porque-gaming-odyssey.webp",
    imageAlt: "Por qué un Monitor Gaming Odyssey"
  },
  {
    title: "Ayúdame a elegir mi monitor",
    href: "/productos/monitores?seccion=ayuda-elegir",
    imageSrc: "/CATEGORIAS/MONI/Ayudame-elegir.webp",
    imageAlt: "Ayúdame a elegir mi monitor"
  },
] as const;

export const SIZES = {
  main: { container: 100, image: 90 },
  promo: { default: 48 },
} as const;
