export type MenuItem = {
  name: string;
  href: string;
  hasDropdown?: boolean;
};

export const MENU_ITEMS: MenuItem[] = [
  { name: "Tienda Online", href: "/" },
  { name: "Dispositivos móviles", href: "/productos/dispositivos-moviles", hasDropdown: true },
  { name: "Televisores y AV", href: "/productos/televisores-y-av", hasDropdown: true },
  { name: "Electrodomésticos", href: "/productos/Electrodomesticos", hasDropdown: true },
  { name: "Monitores", href: "/productos/monitores", hasDropdown: true },
  { name: "Accesorios", href: "/productos/accesorios", hasDropdown: true },
  { name: "Soporte", href: "/soporte/inicio_de_soporte" },
  { name: "Para Empresas", href: "/ventas-corporativas" },
];

export const FEATURED_PRODUCTS = [
  {
    name: "Galaxy Z Fold7",
    image: "https://res.cloudinary.com/dqay3uml6/image/upload/v1759849936/galaxy-zflod7_hrd0oj.webp",
    href: "/productos/multimedia/BSM-F966BE",
  },
  {
    name: "Galaxy Z Flip7",
    image: "https://res.cloudinary.com/dqay3uml6/image/upload/v1759849937/galaxy-zflip7_spfhq7.webp",
    href: "/productos/multimedia/BSM-F766BE",
  },
  {
    name: "Galaxy S25 Ultra",
    image: "https://res.cloudinary.com/dqay3uml6/image/upload/v1759849936/25s-ultra_xfxhqt.webp",
    href: "/productos/multimedia/BSM-S938BE",
  },
  {
    name: "Galaxy S25 | S25+",
    image: "https://res.cloudinary.com/dqay3uml6/image/upload/v1759849936/25s_skxtgm.webp",
    href: "/productos/multimedia/BSM-S936BE",
  },
  {
    name: "Galaxy Tab S10 Series",
    image: "https://res.cloudinary.com/dqay3uml6/image/upload/v1759858346/Tab-s10_e5pn9f.avif",
    href: "/productos/multimedia/BSM-X920",
  },
  {
    name: "Galaxy Buds3 Pro",
    image: "https://res.cloudinary.com/dqay3uml6/image/upload/v1759858345/Buds-3pro_nrortn.avif",
    href: "/productos/multimedia/BSM-R630",
  },
  {
    name: "Neo QLED 8K TV",
    image: "https://res.cloudinary.com/dqay3uml6/image/upload/v1759858336/Neo-qled-8k_izy66o.avif",
    href: "/productos/multimedia/QN65QN900FKXZL",
  },
  {
    name: "The Frame Pro",
    image: "https://res.cloudinary.com/dqay3uml6/image/upload/v1759858335/The-frame-pro_hwn86v.png",
    href: "/productos/multimedia/QN65LS03FAKXZL",
  },
  {
    name: "Odyssey OLED G8",
    image: "https://res.cloudinary.com/dqay3uml6/image/upload/v1759858335/odyssey-g8_lnte4i.avif",
    href: "/productos/multimedia/LS55BG970NNXGO",
  },
  {
    name: "Neveras",
    image: "https://res.cloudinary.com/dqay3uml6/image/upload/v1759858335/neveras-ofer_lxsxgb.avif",
    href: "/productos/view/RF26J7500SL",
  },
  {
    name: "Lavadoras y Secadoras",
    image: "https://res.cloudinary.com/dqay3uml6/image/upload/v1759858349/lavadoras-ofer_jzdngu.avif",
    href: "/productos/multimedia/DVG22C6370P",
  },
];
