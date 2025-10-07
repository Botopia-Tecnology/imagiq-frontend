import type { ProductItem, PromoItem } from "./types";

export const FEATURED_PRODUCTS: readonly ProductItem[] = [
  { name: "Galaxy Z Fold7", imageSrc: "https://res.cloudinary.com/dqay3uml6/image/upload/v1759849936/galaxy-zflod7_hrd0oj.webp" },
  { name: "Galaxy Z Flip7", imageSrc: "https://res.cloudinary.com/dqay3uml6/image/upload/v1759849937/galaxy-zflip7_spfhq7.webp" },
  { name: "Galaxy S25 Ultra", imageSrc: "https://res.cloudinary.com/dqay3uml6/image/upload/v1759849936/25s-ultra_xfxhqt.webp" },
  { name: "Galaxy S25 | S25+", imageSrc: "https://res.cloudinary.com/dqay3uml6/image/upload/v1759849936/25s_skxtgm.webp" },
  { name: "Galaxy Tab S10 Series", imageSrc: "https://res.cloudinary.com/dqay3uml6/image/upload/v1759858346/Tab-s10_e5pn9f.avif" },
  { name: "Galaxy Buds3 Pro", imageSrc: "https://res.cloudinary.com/dqay3uml6/image/upload/v1759858345/Buds-3pro_nrortn.avif" },
  { name: "Neo QLED 8K TV", imageSrc: "https://res.cloudinary.com/dqay3uml6/image/upload/v1759858336/Neo-qled-8k_izy66o.avif" },
  { name: "The Frame Pro", imageSrc: "https://res.cloudinary.com/dqay3uml6/image/upload/v1759858335/The-frame-pro_hwn86v.png" },
  { name: "Odyssey OLED G8", imageSrc: "https://res.cloudinary.com/dqay3uml6/image/upload/v1759858335/odyssey-g8_lnte4i.avif" },
  { name: "Neveras", imageSrc: "https://res.cloudinary.com/dqay3uml6/image/upload/v1759858335/neveras-ofer_lxsxgb.avif" },
  { name: "Lavadoras y Secadoras", imageSrc: "https://res.cloudinary.com/dqay3uml6/image/upload/v1759858349/lavadoras-ofer_jzdngu.avif" },
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
