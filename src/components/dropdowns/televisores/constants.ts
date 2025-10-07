import type { MainItem, PromoItem } from "./types";

export const MAIN_ITEMS: readonly MainItem[] = [
  {
    name: "Neo QLED",
    href: "/productos/televisores?seccion=neo-qled",
    imageSrc: "https://res.cloudinary.com/dqay3uml6/image/upload/v1759773443/NEO_QLED_r1n0ew.webp",
    imageAlt: "Neo QLED",
  },
  {
    name: "OLED",
    href: "/productos/televisores?seccion=oled",
    imageSrc: "https://res.cloudinary.com/dqay3uml6/image/upload/v1759773443/OLED_fzt6n5.webp",
    imageAlt: "OLED",
  },
  {
    name: "QLED",
    href: "/productos/televisores?seccion=qled",
    imageSrc: "https://res.cloudinary.com/dqay3uml6/image/upload/v1759773451/Q_LED_zlnq9y.webp",
    imageAlt: "QLED",
  },
  {
    name: "Crystal UHD",
    href: "/productos/televisores?seccion=crystal-uhd",
    imageSrc: "https://res.cloudinary.com/dqay3uml6/image/upload/v1759773443/CRYSTAL_UHD_cri2ns.webp",
    imageAlt: "Crystal UHD",
  },
  {
    name: "The Frame",
    href: "/productos/televisores?seccion=the-frame",
    imageSrc: "https://res.cloudinary.com/dqay3uml6/image/upload/v1759773439/THE_FRAME_gflmei.webp",
    imageAlt: "The Frame",
  },
  {
    name: "Dispositivos de audio",
    href: "/productos/televisores?seccion=audio",
    imageSrc: "https://res.cloudinary.com/dqay3uml6/image/upload/v1759773435/DISPOSITIVOS_DE_AUDIO_hak34x.webp",
    imageAlt: "Dispositivos de audio",
  },
  {
    name: "Proyectores",
    href: "/productos/televisores?seccion=proyectores",
    imageSrc: "https://res.cloudinary.com/dqay3uml6/image/upload/v1759773435/PROYECTORES_mdrj8w.webp",
    imageAlt: "Proyectores",
  },
  {
    name: "Accesorios para televisor",
    href: "/productos/televisores?seccion=accesorios-tv",
    imageSrc: "https://res.cloudinary.com/dqay3uml6/image/upload/v1759773439/ACCESORIOS_PARA_TELEVISOR_icsuyv.webp",
    imageAlt: "Accesorios para televisor",
  },
  {
    name: "Accesorios de audio",
    href: "/productos/televisores?seccion=accesorios-audio",
    imageSrc: "https://res.cloudinary.com/dqay3uml6/image/upload/v1759773434/ACCESORIOS_DE_AUDIO_xrmytj.webp",
    imageAlt: "Accesorios de audio",
  },
] as const;

export const PROMOS: readonly PromoItem[] = [
  {
    title: "¿Por qué elegir un TV Samsung?",
    href: "/productos/televisores?seccion=por-que-samsung",
    imageSrc: "https://res.cloudinary.com/dqay3uml6/image/upload/v1759773451/TV_SAMSUNG_tvohw1.webp",
    imageAlt: "¿Por qué elegir un TV Samsung?"
  },
  {
    title: "¿Por qué elegir Samsung OLED?",
    href: "/productos/televisores?seccion=por-que-oled",
    imageSrc: "https://res.cloudinary.com/dqay3uml6/image/upload/v1759773439/PORQUE_OLED_vw0rjn.webp",
    imageAlt: "¿Por qué elegir Samsung OLED?"
  },
  {
    title: "¿Por qué elegir los televisores Neo QLED?",
    href: "/productos/televisores?seccion=por-que-neo-qled",
    imageSrc: "https://res.cloudinary.com/dqay3uml6/image/upload/v1759773443/PORQUE_NEOQLED_rrpss3.webp",
    imageAlt: "¿Por qué elegir los televisores Neo QLED?"
  },
  {
    title: "¿Por qué elegir The Frame?",
    href: "/productos/televisores?seccion=por-que-the-frame",
    imageSrc: "https://res.cloudinary.com/dqay3uml6/image/upload/v1759773439/PORQUE_THEFRAME_cnbgqq.webp",
    imageAlt: "¿Por qué elegir The Frame?"
  },
  {
    title: "Ayuda para elegir mi televisor",
    href: "/productos/televisores?seccion=ayuda",
    imageSrc: "https://res.cloudinary.com/dqay3uml6/image/upload/v1759773433/Ayuda_rjzowj.webp",
    imageAlt: "Ayuda para elegir mi televisor"
  },
  {
    title: "Elija mi dispositivo de audio",
    href: "/productos/televisores?seccion=elegir-audio",
    imageSrc: "https://res.cloudinary.com/dqay3uml6/image/upload/v1759773433/Elija-dispositivo_sqstcg.webp",
    imageAlt: "Elija mi dispositivo de audio"
  },
] as const;

export const SIZES = {
  main: { container: 100, image: 90 },
  promo: { default: 48 },
} as const;
