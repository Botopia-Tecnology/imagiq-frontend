/**
 * Tipos compartidos para API Server y mappers
 *
 * Estos tipos son compatibles tanto con Server Components como Client Components
 */

// ============================================
// PRODUCTOS
// ============================================

/**
 * Producto agrupado (variantes del mismo modelo)
 */
export interface ProductGrouped {
  codigoMarketBase: string;
  codigoMarket: string[];
  nombreMarket: string[];
  modelo: string[];
  descGeneral: string[];
  categoria?: string;
  subcategoria?: string;
  menu?: string;
  submenu?: string;
  color: string[];
  nombreColor?: string[];
  capacidad: string[];
  sku: string[];
  ean: string[];
  desDetallada: string[];
  urlImagenes: string[];
  urlRender3D: string[];
  precioNormal: number[];
  precioeccommerce: number[];
  imagePreviewUrl: string[];
  imageDetailsUrls?: string[][];
  imagenPremium: string[][];
  videoPremium: string[][];
  imagenFinalPremium: string[][];
  stockTiendas: Record<string, number>[];
  stockTotal: number[];
  cantidadTiendas: number[];
  cantidadTiendasReserva: number[];
  segmento: string[];
  memoriaram: string[];
  metadatos: string[];
  indRetoma: number[];
  indcerointeres: number[];
  skuPostback: string[];
  ancho: number[];
  alto: number[];
  largo: number[];
  peso: number[];
  unidad?: string[];
  visibleStaging?: boolean[];
  visibleProduction?: boolean[];
  isBundle?: false;
}

/**
 * Opción de bundle (producto individual dentro del paquete)
 */
export interface BundleOption {
  product_sku: string;
  modelo: string;
  bundle_price?: number;
  bundle_discount?: number;
  ind_entre_estre?: number;
  skus_bundle: string[];
  stockTotal?: number;
  imagePreviewUrl?: string[];
  colorProductSku?: string;
  nombreColorProductSku?: string;
  capacidadProductSku?: string;
  memoriaRamProductSku?: string;
}

/**
 * Bundle (paquete promocional)
 */
export interface ProductBundle {
  isBundle: true;
  baseCodigoMarket: string;
  codCampana: string;
  categoria?: string;
  menu?: string;
  submenu?: string;
  fecha_inicio: Date;
  fecha_final: Date;
  hora_inicio: string;
  hora_final: string;
  opciones: BundleOption[];
  isBlackFriday: boolean;
}

/**
 * Tipo union: puede ser un producto o un bundle
 */
export type ProductOrBundle = ProductGrouped | ProductBundle;

// ============================================
// RESPUESTAS DE API
// ============================================

/**
 * Respuesta de búsqueda de productos con bundles (v2/filtered)
 */
export interface SearchBundlesResult {
  products: ProductOrBundle[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  hasMoreInPage?: boolean;
  lazyOffset?: number;
  lazyLimit?: number;
}

/**
 * Respuesta de búsqueda de productos agrupados (sin bundles)
 */
export interface SearchProductsGroupedResult {
  products: ProductGrouped[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

// ============================================
// CATEGORÍAS
// ============================================

/**
 * Submenú completo
 */
export interface SubmenuCompleto {
  uuid: string;
  nombre: string;
  nombreVisible?: string;
  orden: number;
  activo: boolean;
}

/**
 * Menú completo con sus submenús
 */
export interface MenuCompleto {
  uuid: string;
  nombre: string;
  nombreVisible?: string;
  orden: number;
  activo: boolean;
  submenus: SubmenuCompleto[];
}

/**
 * Categoría completa con sus menús y submenús
 */
export interface CategoriaCompleta {
  uuid: string;
  nombre: string;
  nombreVisible?: string;
  orden: number;
  activo: boolean;
  menus: MenuCompleto[];
}

// ============================================
// CAMPAÑAS
// ============================================

/**
 * Campaña activa (para banners)
 */
export interface Campaign {
  id: string;
  nombre: string;
  fecha_inicio: Date;
  fecha_final: Date;
  activo: boolean;
}
