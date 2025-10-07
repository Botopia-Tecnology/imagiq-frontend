import type { ProductItem, PromoItem } from "./types";

export const FEATURED_PRODUCTS: readonly ProductItem[] = [
  { name: "Galaxy Z Fold7", imageSrc: "/productos/galaxy-z-fold7.webp" },
  { name: "Galaxy Z Flip7", imageSrc: "/productos/galaxy-z-flip7.webp" },
  { name: "Galaxy S25 Ultra", imageSrc: "/productos/galaxy-s25-ultra.webp" },
  { name: "Galaxy S25 | S25+", imageSrc: "/productos/galaxy-s25.webp" },
  { name: "Galaxy Tab S10 Series", imageSrc: "/productos/galaxy-tab-s10.webp" },
  { name: "Galaxy Buds3 Pro", imageSrc: "/productos/galaxy-buds3-pro.webp" },
  { name: "Neo QLED 8K TV", imageSrc: "/productos/neo-qled-8k.webp" },
  { name: "The Frame Pro", imageSrc: "/productos/the-frame-pro.webp" },
  { name: "Odyssey OLED G8", imageSrc: "/productos/odyssey-oled-g8.webp" },
  { name: "Neveras", imageSrc: "/productos/neveras.webp" },
  { name: "Lavadoras y Secadoras", imageSrc: "/productos/lavadoras-secadoras.webp" },
] as const;

export const PROMOS: readonly PromoItem[] = [
  {
    title: "Buy Direct Get More",
    href: "/ofertas?seccion=buy-direct",
    imageSrc: "https://res.cloudinary.com/dqay3uml6/image/upload/v1759773418/Buy-direct_wphba9.webp",
    imageAlt: "Buy Direct Get More"
  },
  {
    title: "Productos Destacados",
    href: "/ofertas?seccion=productos-destacados",
    imageSrc: "https://res.cloudinary.com/dqay3uml6/image/upload/v1759773417/productos-destacados_zeyonr.webp",
    imageAlt: "Productos Destacados"
  },
  {
    title: "Incríbete a la lista de espera",
    href: "/ofertas?seccion=app-samsung-shop",
    imageSrc: "https://res.cloudinary.com/dqay3uml6/image/upload/v1759773425/Descarga-app_fqwm3u.webp",
    imageAlt: "Descarga la App Samsung Shop"
  },
  {
    title: "SmartThings",
    href: "/ofertas?seccion=smartthings",
    imageSrc: "https://res.cloudinary.com/dqay3uml6/image/upload/v1759773421/SmartThings_teplew.webp",
    imageAlt: "SmartThings"
  },
  {
    title: "Samsung Care+",
    href: "/ofertas?seccion=samsung-care",
    imageSrc: "https://res.cloudinary.com/dqay3uml6/image/upload/v1759773422/Samsung-care_pfxe9w.webp",
    imageAlt: "Samsung Care+"
  },
  {
    title: "Descubre AI",
    href: "/ofertas?seccion=descubre-ai",
    imageSrc: "https://res.cloudinary.com/dqay3uml6/image/upload/v1759773418/Descubre-ai_pbkd0d.webp",
    imageAlt: "Descubre AI"
  },
  {
    title: "Samsung Rewards",
    href: "/ofertas?seccion=samsung-rewards",
    imageSrc: "https://res.cloudinary.com/dqay3uml6/image/upload/v1759773419/Samsung-rewards_mw12x9.webp",
    imageAlt: "Samsung Rewards"
  },
  {
    title: "Programas y Beneficios",
    href: "/ofertas?seccion=programas-beneficios",
    imageSrc: "https://res.cloudinary.com/dqay3uml6/image/upload/v1759773423/Programas-beneficios_hgyy5p.webp",
    imageAlt: "Programas y Beneficios"
  },
] as const;

export const SIZES = {
  product: { container: 80, image: 70 },
  promo: { default: 48 },
} as const;
