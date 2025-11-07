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
      { name: "Buy Direct Get More", href: "/buy-direct" },
      { name: "SmartThings", href: "/smartthings" },
      { name: "Descubre AI", href: "/ai" },
      { name: "Samsung Care+", href: "/samsung-care" },
      { name: "Select AI", href: "/select-ai" },
      { name: "Promociones para estudiantes", href: "/estudiantes" },
      { name: "Ofertas para empresas", href: "/ventas-corporativas" },
      { name: "Productos Destacados", href: "/destacados" },
      { name: "Explora", href: "/explora" },
    ],
  },
  {
    title: "Productos",
    links: [
      { name: "Smartphones Galaxy", href: "/productos/dispositivos-moviles?seccion=smartphones-galaxy" },
      { name: "Galaxy Tab", href: "/productos/dispositivos-moviles?seccion=galaxy-tab" },
      { name: "Galaxy Watch", href: "/productos/dispositivos-moviles?seccion=galaxy-watch" },
      { name: "Galaxy Buds", href: "/productos/dispositivos-moviles?seccion=galaxy-buds" },
      { name: "TVs", href: "/productos/tv-y-audio" },
      { name: "Dispositivos de audio", href: "/productos/tv-y-audio?seccion=dispositivo-de-audio" },
      { name: "Neveras", href: "/productos/electrodomesticos?seccion=neveras" },
      { name: "Lavavajillas", href: "/productos/electrodomesticos?seccion=lavajillas" },
      { name: "Lavadoras y Secadoras", href: "/productos/electrodomesticos?seccion=lavadoreas-y-secadoras" },
      { name: "Aspiradoras", href: "/productos/electrodomesticos?seccion=aspiradoras" },
      { name: "Monitores", href: "/productos/monitores" },
      { name: "Accesorios", href: "/productos/dispositivos-moviles?seccion=accesorios-para-galaxy" },
    ],
  },
  {
    title: "Soporte",
    links: [
      { name: "Inicio de soporte", href: "/inicio_de_soporte" },
      { name: "Manual y Software", href: "/soporte/manual_y_software" },
      { name: "Buscar soporte", href: "/soporte/buscar_soporte" },
      { name: "FAQ sobre la compra", href: "/soporte/faq_sobre_la_compra" },
      { name: "Información de la garantía", href: "/soporte/informacion_de_la_garantia" },
      { name: "Reservar y reparar", href: "/soporte/reparar" },
      { name: "Costo de Reparación", href: "/soporte/costos" },
      { name: "WhatsApp", href: "/soporte/whatsapp"},
      { name: "Correo electrónico", href: "mailto:serviciocliente@imagiq.com", external: true },
      { name: "Términos y condiciones", href: "/terminos" },
      { name: "Sugerencias al Director", href: "/sugerencias", external: true },
    ],
  },
  {
    title: "Account",
    subsections: [
      {
        title: "",
        links: [
          { name: "Iniciar sesión", href: "/login" },
          { name: "Pedidos", href: "/pedidos" },
          { name: "Mi página", href: "/mi-cuenta" },
          { name: "Mis productos", href: "/mis-productos" },
        ],
      },
      {
        title: "Sustentabilidad",
        links: [
          { name: "Medioambiente", href: "/sostenibilidad/ambiente" },
          { name: "Seguridad y privacidad", href: "/privacidad" },
          { name: "Accesibilidad", href: "/accesibilidad" },
          { name: "Diversidad · Igualdad · Inclusión", href: "/diversidad" },
          { name: "Ciudadanía corporativa", href: "/ciudadania", external: true },
          { name: "Sustentabilidad corporativa", href: "/sostenibilidad", external: true },
        ],
      },
    ],
  },
  {
    title: "Sobre nosotros",
    links: [
      { name: "Información de la compañía", href: "/compania" },
      { name: "Área de negocios", href: "/negocios" },
      { name: "Identidad de la marca", href: "/marca" },
      { name: "Oportunidades laborales", href: "/empleos" },
      { name: "Relaciones con inversores", href: "/inversores", external: true },
      { name: "Noticias", href: "/noticias", external: true },
      { name: "Ética", href: "/etica" },
      { name: "Diseño de Samsung", href: "/diseno", external: true },
      { name: "Productos Electrónicos de consumo", href: "/electronica" },
    ],
  },
];

export const legalLinks: FooterLink[] = [
  { name: "Privacidad", href: "/privacidad" },
  { name: "Legal", href: "/legal" },
  { name: "Mapa del Sitio", href: "/tiendas" },
  { name: "Cookies", href: "/cookies" },
  { name: "Políticas generales", href: "/politicas" },
];

export const socialLinks = [
  { name: "Facebook", href: "https://facebook.com/imagiq", icon: "facebook" },
  { name: "Twitter", href: "https://twitter.com/imagiq", icon: "twitter" },
  { name: "Instagram", href: "https://www.instagram.com/imagiq_colombia?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==", icon: "instagram" },
  { name: "YouTube", href: "https://youtube.com/imagiq", icon: "youtube" },
] as const;

export const companyInfo = {
  copyright: "Copyright© 1995-2025 IMAGIQ. Todos los derechos reservados.",
  address: "IMAGIQ S.A.S NIT 900.565.091-1 Dirección Calle 98 #8-28 Bogotá D.C.",
  contact: "Canales de atención al público: 601 744 1176",
  country: "Colombia/Español",
  disclaimer: "¡Mantente informado!",
  superintendencia: true,
};
