  import type { SupportSection, SupportImage } from "./types";

  export const SUPPORT_SECTIONS: readonly SupportSection[] = [
    {
      title: "AYUDA CON UN PRODUCTO",
      links: [
        { name: "Inicio de soporte", href: "/soporte/inicio_de_soporte" },
        { name: "Manual y Software", href: "/soporte/manual_y_software" },
        { name: "Buscar soporte", href: "/soporte/buscar_soporte" },
        { name: "FAQ sobre la compra", href: "/soporte/faq_sobre_la_compra" },
      ],
    },
    {
      title: "REPARACIONES Y GARANTÍA",
      links: [
        { name: "Información de la garantía", href: "/soporte/informacion_de_la_garantia" },
        { name: "Reservar y reparar", href: "/soporte/reparar" },
        { name: "Costo de Reparación", href: "/soporte/costo_de_reparacion" },
      ],
    },
    {
      title: "SOPORTE ADICIONAL",
      links: [
        { name: "Noticias y alertas", href: "/soporte/noticias" },
        { name: "Comunidad", href: "/soporte/comunidad"},
      ],
    },
    {
      title: "CONTACTO",
      links: [
        { name: "WhatsApp", href: "/soporte/whatsapp" },
        { name: "Correo electrónico", href: "/soporte/correo_electronico"},
      ],
    },
  ] as const;

  export const SUPPORT_IMAGES: readonly SupportImage[] = [
    {
      name: "Garantía",
      imageSrc: "https://res.cloudinary.com/dqay3uml6/image/upload/v1759842073/sim-garantia_zsepcv.webp",
      imageAlt: "Garantía",
      href: "/soporte/informacion_de_la_garantia",
    },
    {
      name: "Descarga manual",
      imageSrc: "https://res.cloudinary.com/dqay3uml6/image/upload/v1759842074/sim-descarga_zymuvb.webp",
      imageAlt: "Descarga manual",
      href: "/soporte/manual_y_software",
    },
  ] as const;
