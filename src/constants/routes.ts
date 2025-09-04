/**
 * Rutas de la aplicación
 * - Rutas públicas y privadas
 * - URLs de navegación
 * - Breadcrumbs configuration
 * - Dynamic routes patterns
 */

// Public routes
export const PUBLIC_ROUTES = {
  HOME: "/",
  PRODUCTS: "/productos",
  PRODUCT_DETAIL: "/productos/[id]",
  LOGIN: "/login",
  REGISTER: "/register",
  SUPPORT: "/soporte",
  ABOUT: "/about",
  CONTACT: "/contact",
  TERMS: "/terms",
  PRIVACY: "/privacy",
} as const;

// Private routes (require authentication)
export const PRIVATE_ROUTES = {
  PROFILE: "/perfil",
  ORDERS: "/perfil/pedidos",
  FAVORITES: "/perfil/favoritos",
  SETTINGS: "/perfil/configuracion",
  CHECKOUT: "/checkout",
} as const;

// Admin routes
export const ADMIN_ROUTES = {
  DASHBOARD: "/dashboard",
  ANALYTICS: "/dashboard/analytics",
  SALES: "/dashboard/ventas",
  USERS: "/dashboard/usuarios",
  PRODUCTS_ADMIN: "/dashboard/productos",
  ORDERS_ADMIN: "/dashboard/pedidos",
} as const;

// API routes
export const API_ROUTES = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    LOGOUT: "/auth/logout",
    REFRESH: "/auth/refresh",
    PROFILE: "/auth/profile",
  },
  PRODUCTS: {
    LIST: "/products",
    DETAIL: "/products/:id",
    SEARCH: "/products/search",
    CATEGORIES: "/products/categories",
    RECOMMENDATIONS: "/products/recommendations",
  },
  CART: {
    GET: "/cart",
    ADD: "/cart/add",
    UPDATE: "/cart/update",
    REMOVE: "/cart/remove",
    CLEAR: "/cart/clear",
  },
  ORDERS: {
    CREATE: "/orders",
    LIST: "/orders",
    DETAIL: "/orders/:id",
    CANCEL: "/orders/:id/cancel",
  },
  USER: {
    PREFERENCES: "/user/preferences",
    FAVORITES: "/user/favorites",
    ADDRESSES: "/user/addresses",
  },
} as const;

// Navigation structure for UI
export const NAVIGATION = [
  { name: "Ofertas", href: "/tienda/outlet" },
  { name: "Dispositivos móviles", href: "/productos/dispositivos-moviles" },
  { name: "Televisores y AV", href: "/tienda/televisores" },
  { name: "Electrodomésticos", href: "/tienda/electrodomesticos" },
  { name: "Tiendas", href: "/tiendas" },
  { name: "Servicio Técnico", href: "/soporte" },
  { name: "Ventas corporativas", href: "/ventas-corporativas" },
];

// Breadcrumb configurations
export const BREADCRUMB_CONFIG = {
  [PUBLIC_ROUTES.PRODUCTS]: [
    { name: "Inicio", href: PUBLIC_ROUTES.HOME },
    { name: "Productos", href: PUBLIC_ROUTES.PRODUCTS },
  ],
  [PRIVATE_ROUTES.PROFILE]: [
    { name: "Inicio", href: PUBLIC_ROUTES.HOME },
    { name: "Mi Perfil", href: PRIVATE_ROUTES.PROFILE },
  ],
};
