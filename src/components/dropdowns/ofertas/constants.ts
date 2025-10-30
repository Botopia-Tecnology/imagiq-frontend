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



export const SIZES = {
  product: { container: 80, image: 70 },
  promo: { default: 48 },
} as const;
