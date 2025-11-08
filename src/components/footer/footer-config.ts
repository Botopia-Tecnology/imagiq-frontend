/**
 * Footer Configuration
 * Configuración centralizada de todos los enlaces y datos del footer
 */

export interface FooterLink {
  name: string;
  href: string;
  external?: boolean;
}

export interface FooterSubsection {
  title: string;
  links: FooterLink[];
}

export interface FooterSection {
  title: string;
  links?: FooterLink[];
  subsections?: FooterSubsection[];
}

export const footerSections: FooterSection[] = [
  {
    title: "Tienda",
    links: [
      { name: "Ofertas", href: "/ofertas" },
      { name: "Dispositivos móviles", href: "/productos/dispositivos-moviles" },
      { name: "TV y audio", href: "/productos/tv-y-audio" },
      { name: "Electrodomésticos", href: "/productos/electrodomesticos" },
      { name: "Ofertas para empresas", href: "/ventas-corporativas" },
    ],
  },
  {
    title: "Productos",
    links: [
      {
        name: "Smartphones Galaxy",
        href: "/productos/dispositivos-moviles?seccion=smartphones-galaxy",
      },
      {
        name: "Galaxy Tab",
        href: "/productos/dispositivos-moviles?seccion=galaxy-tab",
      },
      {
        name: "Galaxy Watch",
        href: "/productos/dispositivos-moviles?seccion=galaxy-watch",
      },
      {
        name: "Galaxy Buds",
        href: "/productos/dispositivos-moviles?seccion=galaxy-buds",
      },
      { name: "TVs", href: "/productos/tv-y-audio" },
      {
        name: "Dispositivos de audio",
        href: "/productos/tv-y-audio?seccion=dispositivo-de-audio",
      },
      { name: "Neveras", href: "/productos/electrodomesticos?seccion=neveras" },
      {
        name: "Lavavajillas",
        href: "/productos/electrodomesticos?seccion=lavajillas",
      },
      {
        name: "Lavadoras y Secadoras",
        href: "/productos/electrodomesticos?seccion=lavadoreas-y-secadoras",
      },
      {
        name: "Aspiradoras",
        href: "/productos/electrodomesticos?seccion=aspiradoras",
      },
      { name: "Monitores", href: "/productos/monitores" },
      {
        name: "Accesorios",
        href: "/productos/dispositivos-moviles?seccion=accesorios-para-galaxy",
      },
    ],
  },
  {
    title: "Soporte",
    links: [
      { name: "Inicio de soporte", href: "/soporte/inicio_de_soporte" },
      {
        name: "T&C 0% de interés Bancolombia",
        href: "/soporte/tyc-bancolombia",
      },
      {
        name: "T&C 0% de interés Davivienda",
        href: "/soporte/tyc-davivienda",
      },
      {
        name: "Políticas generales",
        href: "/soporte/politicas-generales",
      },
      {
        name: "Políticas de uso de cookies",
        href: "/soporte/politica-cookies",
      },
      {
        name: "Tratamiento de datos personales",
        href: "/soporte/tratamiento-datos-personales",
      },
      {
        name: "Política anticorrupción y soborno",
        href: "/soporte/politica-anticorrupcion",
      },
      {
        name: "Aviso legal",
        href: "/soporte/aviso-legal",
      },
    ],
  },
  {
    title: "Account",
    links: [
      { name: "Iniciar sesión", href: "/login" },
      { name: "Pedidos", href: "/carrito/step1" },
    ],
  },
  // {
  //   title: "Sustentabilidad",
  //   links: [
  //     { name: "Medioambiente", href: "/sostenibilidad/ambiente" },
  //     { name: "Seguridad y privacidad", href: "/privacidad" },
  //     { name: "Accesibilidad", href: "/accesibilidad" },
  //     { name: "Diversidad · Igualdad · Inclusión", href: "/diversidad" },
  //     { name: "Ciudadanía corporativa", href: "/ciudadania", external: true },
  //     { name: "Sustentabilidad corporativa", href: "/sostenibilidad", external: true },
  //   ],
  // },
  // {
  //   title: "Sobre nosotros",
  //   links: [
  //     { name: "Información de la compañía", href: "/compania" },
  //     { name: "Área de negocios", href: "/negocios" },
  //     { name: "Identidad de la marca", href: "/marca" },
  //     { name: "Oportunidades laborales", href: "/empleos" },
  //     { name: "Relaciones con inversores", href: "/inversores", external: true },
  //     { name: "Noticias", href: "/noticias", external: true },
  //     { name: "Ética", href: "/etica" },
  //     { name: "Diseño de Samsung", href: "/diseno", external: true },
  //     { name: "Productos Electrónicos de consumo", href: "/electronica" },
  //   ],
  // },
];

export const legalLinks: FooterLink[] = [
  { name: "Privacidad", href: "/privacidad" },
  { name: "Legal", href: "/legal" },
  { name: "Mapa del Sitio", href: "/tiendas" },
  { name: "Cookies", href: "/cookies" },
  { name: "Políticas generales", href: "/politicas" },
];

export const socialLinks = [
  {
    name: "Facebook",
    href: "https://www.facebook.com/p/ImagiQ-100063440750636/?locale=es_LA",
    icon: "facebook",
  },
  //{ name: "Twitter", href: "https://twitter.com/imagiq", icon: "twitter" },
  {
    name: "Instagram",
    href: "https://www.instagram.com/imagiq_colombia?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==",
    icon: "instagram",
  },
  //{ name: "YouTube", href: "https://youtube.com/imagiq", icon: "youtube" },
] as const;

export const companyInfo = {
  copyright: "Copyright© 1995-2025 IMAGIQ. Todos los derechos reservados.",
  address:
    "IMAGIQ S.A.S NIT 900.565.091-1 Dirección Calle 98 #8-28 Bogotá D.C.",
  contact: "Canales de atención al público: 601 744 1176",
  country: "Colombia/Español",
  disclaimer: "¡Mantente informado!",
  superintendencia: true,
};
