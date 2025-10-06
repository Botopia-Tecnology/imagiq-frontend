import type { MainItem, PromoItem } from "./types";

export const MAIN_ITEMS: readonly MainItem[] = [
  {
    name: "Neo QLED",
    href: "/productos/televisores?seccion=neo-qled",
    imageSrc: "/CATEGORIAS/TV-AV/NEO_QLED.webp",
    imageAlt: "Neo QLED",
  },
  {
    name: "OLED",
    href: "/productos/televisores?seccion=oled",
    imageSrc: "/CATEGORIAS/TV-AV/OLED.webp",
    imageAlt: "OLED",
  },
  {
    name: "QLED",
    href: "/productos/televisores?seccion=qled",
    imageSrc: "/CATEGORIAS/TV-AV/Q_LED.webp",
    imageAlt: "QLED",
  },
  {
    name: "Crystal UHD",
    href: "/productos/televisores?seccion=crystal-uhd",
    imageSrc: "/CATEGORIAS/TV-AV/CRYSTAL_UHD.webp",
    imageAlt: "Crystal UHD",
  },
  {
    name: "The Frame",
    href: "/productos/televisores?seccion=the-frame",
    imageSrc: "/CATEGORIAS/TV-AV/THE_FRAME.webp",
    imageAlt: "The Frame",
  },
  {
    name: "Dispositivos de audio",
    href: "/productos/televisores?seccion=audio",
    imageSrc: "/CATEGORIAS/TV-AV/DISPOSITIVOS_DE_AUDIO.webp",
    imageAlt: "Dispositivos de audio",
  },
  {
    name: "Proyectores",
    href: "/productos/televisores?seccion=proyectores",
    imageSrc: "/CATEGORIAS/TV-AV/PROYECTORES.webp",
    imageAlt: "Proyectores",
  },
  {
    name: "Accesorios para televisor",
    href: "/productos/televisores?seccion=accesorios-tv",
    imageSrc: "/CATEGORIAS/TV-AV/ACCESORIOS_PARA_TELEVISOR.webp",
    imageAlt: "Accesorios para televisor",
  },
  {
    name: "Accesorios de audio",
    href: "/productos/televisores?seccion=accesorios-audio",
    imageSrc: "/CATEGORIAS/TV-AV/ACCESORIOS_DE_AUDIO.webp",
    imageAlt: "Accesorios de audio",
  },
] as const;

export const PROMOS: readonly PromoItem[] = [
  {
    title: "¿Por qué elegir un TV Samsung?",
    href: "/productos/televisores?seccion=por-que-samsung",
    imageSrc: "/CATEGORIAS/TV-AV/TV_SAMSUNG.webp",
    imageAlt: "¿Por qué elegir un TV Samsung?"
  },
  {
    title: "¿Por qué elegir Samsung OLED?",
    href: "/productos/televisores?seccion=por-que-oled",
    imageSrc: "/CATEGORIAS/TV-AV/PORQUE_OLED.webp",
    imageAlt: "¿Por qué elegir Samsung OLED?"
  },
  {
    title: "¿Por qué elegir los televisores Neo QLED?",
    href: "/productos/televisores?seccion=por-que-neo-qled",
    imageSrc: "/CATEGORIAS/TV-AV/PORQUE_NEOQLED.webp",
    imageAlt: "¿Por qué elegir los televisores Neo QLED?"
  },
  {
    title: "¿Por qué elegir The Frame?",
    href: "/productos/televisores?seccion=por-que-the-frame",
    imageSrc: "/CATEGORIAS/TV-AV/PORQUE_THEFRAME.webp",
    imageAlt: "¿Por qué elegir The Frame?"
  },
  {
    title: "Ayuda para elegir mi televisor",
    href: "/productos/televisores?seccion=ayuda",
    imageSrc: "/CATEGORIAS/TV-AV/Ayuda.webp",
    imageAlt: "Ayuda para elegir mi televisor"
  },
  {
    title: "Elija mi dispositivo de audio",
    href: "/productos/televisores?seccion=elegir-audio",
    imageSrc: "/CATEGORIAS/TV-AV/Elija-dispositivo.webp",
    imageAlt: "Elija mi dispositivo de audio"
  },
] as const;

export const SIZES = {
  main: { container: 100, image: 90 },
  promo: { default: 48 },
} as const;
