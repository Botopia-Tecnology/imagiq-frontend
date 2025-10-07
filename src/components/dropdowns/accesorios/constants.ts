import type { MainItem } from "./types";

export const MAIN_ITEMS: readonly MainItem[] = [
  {
    name: "Accesorios para Smartphones",
    href: "/productos/accesorios?seccion=smartphones-galaxy",
    imageSrc: "https://res.cloudinary.com/dqay3uml6/image/upload/v1759801666/Acc-smartphone_ngj5pq.webp",
    imageAlt: "Accesorios para Smartphones",
  },
  {
    name: "Accesorios para las Galaxy Tab",
    href: "/productos/accesorios?seccion=galaxy-tab",
    imageSrc: "https://res.cloudinary.com/dqay3uml6/image/upload/v1759801666/Acc-tab_lzxmso.webp",
    imageAlt: "Accesorios para las Galaxy Tab",
  },
  {
    name: "Accesorios para los Galaxy Watch",
    href: "/productos/accesorios?seccion=galaxy-watch",
    imageSrc: "https://res.cloudinary.com/dqay3uml6/image/upload/v1759801665/Acc-watch-galaxy_tjlm69.webp",
    imageAlt: "Accesorios para los Galaxy Watch",
  },
  {
    name: "Accesorios Galaxy Buds",
    href: "/productos/accesorios?seccion=galaxy-buds",
    imageSrc: "https://res.cloudinary.com/dqay3uml6/image/upload/v1759801666/Acc-galaxy-buds_qh3osd.webp",
    imageAlt: "Accesorios Galaxy Buds",
  },
  {
    name: "Accesorios de audio",
    href: "/productos/accesorios?seccion=audio",
    imageSrc: "https://res.cloudinary.com/dqay3uml6/image/upload/v1759801666/Acc-para-audio_jwwbhf.webp",
    imageAlt: "Accesorios de audio",
  },
  {
    name: "Accesorios para proyector",
    href: "/productos/accesorios?seccion=proyector",
    imageSrc: "https://res.cloudinary.com/dqay3uml6/image/upload/v1759801665/Acc-proyector_b0zhcx.webp",
    imageAlt: "Accesorios para proyector",
  },
] as const;

export const SIZES = {
  main: { container: 100, image: 90 },
  large: { container: 130, image: 120 }, // Para Galaxy Tab
  medium: { container: 110, image: 100 }, // Para Galaxy Watch
  mediumSmall: { container: 115, image: 105 }, // Para Galaxy Buds
} as const;
