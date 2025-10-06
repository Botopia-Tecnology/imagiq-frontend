import type { MainItem } from "./types";

export const MAIN_ITEMS: readonly MainItem[] = [
  {
    name: "Accesorios para Smartphones Galaxy",
    href: "/productos/accesorios?seccion=smartphones-galaxy",
    imageSrc: "https://res.cloudinary.com/dqay3uml6/image/upload/v1759773307/Smartphone-galaxy_lpiauq.webp",
    imageAlt: "Accesorios para Smartphones Galaxy",
  },
  {
    name: "Accesorios para las Galaxy Tab",
    href: "/productos/accesorios?seccion=galaxy-tab",
    imageSrc: "https://res.cloudinary.com/dqay3uml6/image/upload/v1759773308/Galaxy-tab_sjxwun.webp",
    imageAlt: "Accesorios para las Galaxy Tab",
  },
  {
    name: "Accesorios para los Galaxy Watch",
    href: "/productos/accesorios?seccion=galaxy-watch",
    imageSrc: "https://res.cloudinary.com/dqay3uml6/image/upload/v1759773307/Galaxy-watch_sk1fmp.webp",
    imageAlt: "Accesorios para los Galaxy Watch",
  },
  {
    name: "Accesorios Galaxy Buds",
    href: "/productos/accesorios?seccion=galaxy-buds",
    imageSrc: "https://res.cloudinary.com/dqay3uml6/image/upload/v1759773307/Galaxy-buds_st262z.webp",
    imageAlt: "Accesorios Galaxy Buds",
  },
  {
    name: "Accesorios de audio",
    href: "/productos/accesorios?seccion=audio",
    imageSrc: "https://res.cloudinary.com/dqay3uml6/image/upload/v1759773307/Audio_z9uwke.webp",
    imageAlt: "Accesorios de audio",
  },
  {
    name: "Accesorios para proyector",
    href: "/productos/accesorios?seccion=proyector",
    imageSrc: "https://res.cloudinary.com/dqay3uml6/image/upload/v1759773307/Proyector_dlngsi.webp",
    imageAlt: "Accesorios para proyector",
  },
] as const;

export const SIZES = {
  main: { container: 100, image: 90 },
} as const;
