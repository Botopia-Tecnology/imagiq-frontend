/**
 * Ejemplos de configuración para ProductBanner
 *
 * Usa estas configuraciones como plantilla para crear nuevos banners
 */

import { BannerConfig } from "./types";

/**
 * Ejemplo 1: Banner de AI TVs
 */
export const aiTVsConfig: BannerConfig = {
  images: {
    desktop: "https://res.cloudinary.com/dqsdl9bwv/image/upload/v1759811545/MDVD_Feature_KV_PC_1440x810_LTR_trxgtb.avif",
    mobile: "https://res.cloudinary.com/dqsdl9bwv/image/upload/v1759811702/MDVD_Feature_KV_MO_720X1120_e18si6.webp",
  },
  content: {
    title: "Nuevos AI TVs 2025",
    subtitle: "Sin interés a 3, 6 o 12 cuotas pagando con bancos aliados",
    buttonText: "Comprar",
    buttonHref: "/productos/tv-audio-video?categoria=televisores",
    ariaLabel: "Nuevos AI TVs 2025 Showcase",
  },
  theme: "dark",
  textAlignment: "left",
  trackingEvent: "ai_tvs_banner_click",
};

/**
 * Ejemplo 2: Banner genérico (plantilla)
 */
export const genericBannerConfig: BannerConfig = {
  images: {
    desktop: "URL_DESKTOP_AQUI",
    mobile: "URL_MOBILE_AQUI",
  },
  content: {
    title: "Título del Producto",
    subtitle: "Descripción o promoción",
    buttonText: "Ver más",
    buttonHref: "/productos/categoria",
    ariaLabel: "Descripción del banner",
  },
  theme: "dark", // o "light"
  textAlignment: "left", // o "center" o "right"
  trackingEvent: "custom_banner_click",
};

/**
 * Ejemplo 3: Banner con tema claro
 */
export const lightThemeBannerConfig: BannerConfig = {
  images: {
    desktop: "URL_DESKTOP_AQUI",
    mobile: "URL_MOBILE_AQUI",
  },
  content: {
    title: "Nuevo Producto 2025",
    subtitle: "Descubre las últimas innovaciones",
    buttonText: "Conocer más",
    buttonHref: "/productos/nuevo-producto",
    ariaLabel: "Nuevo Producto 2025",
  },
  theme: "light",
  textAlignment: "center",
  trackingEvent: "new_product_banner_click",
};
