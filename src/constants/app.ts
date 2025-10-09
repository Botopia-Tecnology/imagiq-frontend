/**
 * Constantes de la aplicación
 * Centraliza magic numbers, strings repetidos, y configuraciones
 */

// Impuestos y costos
export const TAX_RATES = {
  IVA: 0.19, // 19% IVA en Colombia
  IVA_REDUCED: 0.09, // 9% IVA reducido
} as const;

export const SHIPPING = {
  FREE_THRESHOLD: 0, // Envío gratis para todos
  COST: 0,
  ORIGINAL_COST: 20000,
} as const;

// Timeouts y delays (en milisegundos)
export const DELAYS = {
  DEBOUNCE_SEARCH: 300,
  TOAST_DURATION: 3000,
  ANIMATION_SHORT: 200,
  ANIMATION_MEDIUM: 300,
  ANIMATION_LONG: 500,
  MODAL_TRANSITION: 800,
  AUTOCOMPLETE_DELAY: 300,
} as const;

// Paginación
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 12,
  OPTIONS: [10, 15, 20, 25, 50] as const,
  MAX_PAGE_SIZE: 100,
} as const;

// Validación
export const VALIDATION = {
  MIN_PASSWORD_LENGTH: 8,
  MAX_PASSWORD_LENGTH: 128,
  MIN_SEARCH_LENGTH: 2,
  MAX_SEARCH_LENGTH: 100,
  PHONE_LENGTH: 10,
  DOCUMENT_MIN_LENGTH: 6,
  DOCUMENT_MAX_LENGTH: 20,
} as const;

// Cache y Storage
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'imagiq_token',
  USER_DATA: 'imagiq_user',
  CART_ITEMS: 'imagiq_cart_items',
  FAVORITES: 'imagiq_favorites',
  RECENT_SEARCHES: 'imagiq_recent_searches',
  USER_PREFERENCES: 'imagiq_preferences',
} as const;

// API y Endpoints
export const API = {
  TIMEOUT: 30000, // 30 segundos
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
} as const;

// Límites de archivo
export const FILE_LIMITS = {
  MAX_IMAGE_SIZE: 5 * 1024 * 1024, // 5MB
  MAX_DOCUMENT_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp'] as const,
} as const;

// Breakpoints (deben coincidir con Tailwind)
export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  '2XL': 1536,
} as const;

// Rating y Reviews
export const RATING = {
  MIN: 1,
  MAX: 5,
  DEFAULT: 4.8,
  MIN_REVIEWS_TO_SHOW: 5,
} as const;

// Productos
export const PRODUCT = {
  MAX_IMAGES: 10,
  DEFAULT_IMAGE_QUALITY: 80,
  THUMBNAIL_SIZE: 100,
  PREVIEW_SIZE: 400,
  DETAIL_SIZE: 1000,
} as const;
