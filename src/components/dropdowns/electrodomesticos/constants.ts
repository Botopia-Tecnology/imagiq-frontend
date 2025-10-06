import type { MainItem, PromoItem } from "./types";

export const MAIN_ITEMS: readonly MainItem[] = [
  {
    name: "Neveras",
    href: "/productos/electrodomesticos?seccion=neveras",
    imageSrc: "https://res.cloudinary.com/dqay3uml6/image/upload/v1759773410/neveras_es7cui.webp",
    imageAlt: "Neveras",
  },
  {
    name: "Hornos",
    href: "/productos/electrodomesticos?seccion=hornos",
    imageSrc: "https://res.cloudinary.com/dqay3uml6/image/upload/v1759773406/hornos_rsgzpx.webp",
    imageAlt: "Hornos",
  },
  {
    name: "Hornos Microondas",
    href: "/productos/electrodomesticos?seccion=hornos-microondas",
    imageSrc: "https://res.cloudinary.com/dqay3uml6/image/upload/v1759773406/horno_microondas_askklu.webp",
    imageAlt: "Hornos Microondas",
  },
  {
    name: "Lavavajillas",
    href: "/productos/electrodomesticos?seccion=lavavajillas",
    imageSrc: "https://res.cloudinary.com/dqay3uml6/image/upload/v1759773409/lavavajillas_t1yvwa.webp",
    imageAlt: "Lavavajillas",
  },
  {
    name: "Cocinas",
    href: "/productos/electrodomesticos?seccion=cocinas",
    imageSrc: "https://res.cloudinary.com/dqay3uml6/image/upload/v1759773405/cocinas_cs0svj.webp",
    imageAlt: "Cocinas",
  },
  {
    name: "Lavadoras y Secadoras",
    href: "/productos/electrodomesticos?seccion=lavadoras-secadoras",
    imageSrc: "https://res.cloudinary.com/dqay3uml6/image/upload/v1759773409/lavadoras_y_secadoras_nn5seu.webp",
    imageAlt: "Lavadoras y Secadoras",
  },
  {
    name: "Aspiradoras",
    href: "/productos/electrodomesticos?seccion=aspiradoras",
    imageSrc: "https://res.cloudinary.com/dqay3uml6/image/upload/v1759773412/aspiradoras_rpk655.webp",
    imageAlt: "Aspiradoras",
  },
  {
    name: "Aires acondicionados",
    href: "/productos/electrodomesticos?seccion=aires-acondicionados",
    imageSrc: "https://res.cloudinary.com/dqay3uml6/image/upload/v1759773392/aires_acondicionados_pcm4pp.avif",
    imageAlt: "Aires acondicionados",
  },
  {
    name: "Accesorios para electrodomésticos",
    href: "/productos/electrodomesticos?seccion=accesorios",
    imageSrc: "https://res.cloudinary.com/dqay3uml6/image/upload/v1759773402/accesorios_electrodomesticos_kenfgx.webp",
    imageAlt: "Accesorios para electrodomésticos",
  },
] as const;

export const PROMOS: readonly PromoItem[] = [
  {
    title: "Bespoke AI",
    href: "/productos/electrodomesticos?seccion=bespoke-ai",
    imageSrc: "https://res.cloudinary.com/dqay3uml6/image/upload/v1759773393/bespoke_ai_hulakk.webp",
    imageAlt: "Bespoke AI"
  },
  {
    title: "Bespoke AI Smartthings",
    href: "/productos/electrodomesticos?seccion=bespoke-ai-smartthings",
    imageSrc: "https://res.cloudinary.com/dqay3uml6/image/upload/v1759773393/bespoke-ai-smartthings_v1lymp.webp",
    imageAlt: "Bespoke AI Smartthings"
  },
  {
    title: "Ahorro de energía con AI",
    href: "/productos/electrodomesticos?seccion=ahorro-energia-ai",
    imageSrc: "https://res.cloudinary.com/dqay3uml6/image/upload/v1759773402/ahorro-energia-ai_abghns.webp",
    imageAlt: "Ahorro de energía con AI"
  },
  {
    title: "¿Por qué Electrodomésticos Samsung?",
    href: "/productos/electrodomesticos?seccion=por-que-samsung",
    imageSrc: "https://res.cloudinary.com/dqay3uml6/image/upload/v1759773402/porque_elec_samsung_ftamj9.webp",
    imageAlt: "¿Por qué Electrodomésticos Samsung?"
  },
  {
    title: "Guía de compra de neveras",
    href: "/productos/electrodomesticos?seccion=guia-neveras",
    imageSrc: "https://res.cloudinary.com/dqay3uml6/image/upload/v1759773405/guia_neveras_aickik.webp",
    imageAlt: "Guía de compra de neveras"
  },
  {
    title: "Guía de compra de lavadoras: Tamaño",
    href: "/productos/electrodomesticos?seccion=guia-lavadoras",
    imageSrc: "https://res.cloudinary.com/dqay3uml6/image/upload/v1759773394/guia_lavadoras_dijdpu.avif",
    imageAlt: "Guía de compra de lavadoras: Tamaño"
  },
  {
    title: "Pantallas Smart",
    href: "/productos/electrodomesticos?seccion=pantallas-smart",
    imageSrc: "https://res.cloudinary.com/dqay3uml6/image/upload/v1759773412/pantallas_smart_y9mvb1.webp",
    imageAlt: "Pantallas Smart"
  },
] as const;

export const SIZES = {
  main: { container: 100, image: 90 },
  promo: { default: 48 },
} as const;
