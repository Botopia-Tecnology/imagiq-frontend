import type { MainItem, PromoItem } from "./types";

export const MAIN_ITEMS: readonly MainItem[] = [
  {
    name: "Smartphones Galaxy",
    twoLinesName: "Smartphones\nGalaxy",
    href: "/productos/dispositivos-moviles?seccion=smartphones",
    imageSrc: "https://res.cloudinary.com/dqay3uml6/image/upload/v1759773359/Smartphones_galaxy_wfxaqa.webp",
    imageAlt: "Smartphones Galaxy",
  },
  {
    name: "Galaxy Tab",
    href: "/productos/dispositivos-moviles?seccion=tabletas",
    imageSrc: "https://res.cloudinary.com/dqay3uml6/image/upload/v1759773375/Galaxy_Tab_r2iqdr.webp",
    imageAlt: "Galaxy Tab",
  },
  {
    name: "Galaxy Watch",
    href: "/productos/dispositivos-moviles?seccion=relojes",
    imageSrc: "https://res.cloudinary.com/dqay3uml6/image/upload/v1759773381/Galaxy_Watch_d7sxjj.webp",
    imageAlt: "Galaxy Watch",
  },
  {
    name: "Galaxy Buds",
    href: "/productos/dispositivos-moviles?seccion=buds",
    imageSrc: "https://res.cloudinary.com/dqay3uml6/image/upload/v1759773371/Galaxy_Buds_hjecfo.webp",
    imageAlt: "Galaxy Buds",
  },
  {
    name: "Accesorios para Galaxy",
    twoLinesName: "Accesorios para\nGalaxy",
    href: "/productos/dispositivos-moviles?seccion=accesorios",
    imageSrc: "https://res.cloudinary.com/dqay3uml6/image/upload/v1759773382/Accesorios_para_galaxy_wrntkr.webp",
    imageAlt: "Accesorios para Galaxy",
  },
] as const;

export const PROMOS: readonly PromoItem[] = [
  {
    title: "Descubre los dispositivos móviles",
    href: "/productos/dispositivos-moviles",
    imageSrc: "https://res.cloudinary.com/dqay3uml6/image/upload/v1759773360/Descubre_los_dispositivos_moviles_ewotsz.webp",
    imageAlt: "Descubre dispositivos",
  },
  {
    title: "Galaxy AI",
    href: "/productos/dispositivos-moviles?seccion=galaxy-ai",
    imageSrc: "https://res.cloudinary.com/dqay3uml6/image/upload/v1759773360/Galaxy_AI_kxtltf.webp",
    imageAlt: "Galaxy AI",
  },
  {
    title: "One UI",
    href: "/productos/dispositivos-moviles?seccion=one-ui",
    imageSrc: "https://res.cloudinary.com/dqay3uml6/image/upload/v1759773371/One_UI_ttavcx.webp",
    imageAlt: "One UI",
  },
  {
    title: "Samsung Health",
    href: "/productos/dispositivos-moviles?seccion=samsung-health",
    imageSrc: "https://res.cloudinary.com/dqay3uml6/image/upload/v1759777221/Samsung_health_kz6lyi.webp",
    imageAlt: "Samsung Health",
  },
  {
    title: "Aplicaciones y Servicios",
    href: "/productos/dispositivos-moviles?seccion=apps-servicios",
    imageSrc: "https://res.cloudinary.com/dqay3uml6/image/upload/v1759773360/Aplicaciones-servicios_zfsonr.webp",
    imageAlt: "Apps y Servicios",
  },
  {
    title: "¿Por qué elegir Galaxy?",
    href: "/productos/dispositivos-moviles?seccion=por-que-galaxy",
    imageSrc: "https://res.cloudinary.com/dqay3uml6/image/upload/v1759773372/porque_elegir_galaxy_hwji9g.webp",
    imageAlt: "¿Por qué Galaxy?",
  },
  {
    title: "Cambia a Galaxy",
    href: "/productos/dispositivos-moviles?seccion=cambia",
    imageSrc: "https://res.cloudinary.com/dqay3uml6/image/upload/v1759773359/Cambia_a_galaxy_ebbyq4.webp",
    imageAlt: "Cambia a Galaxy",
  },
  {
    title: "Estreno y Entrego",
    href: "/productos/dispositivos-moviles?seccion=estreno-entrega",
    imageSrc: "https://res.cloudinary.com/dqay3uml6/image/upload/v1759773360/Estreno_y_Entrego_jnx5yp.webp",
    imageAlt: "Estreno y Entrega",
  },
] as const;

export const SIZES = {
  main: { container: 100, image: 90 },
  promo: {
    default: 48,
    small: 40,
    large: 52,
  },
  mobile: { promo: 40 },
} as const;
