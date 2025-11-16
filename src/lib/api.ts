/**
 * Cliente API para comunicación con microservicios
 * - Configuración base de Axios o Fetch
 * - Interceptors para auth tokens
 * - Manejo centralizado de errores
 * - Retry logic para requests fallidos
 * - Rate limiting y caching
 * - TypeScript interfaces para requests/responses
 */

import type { ProductFilterParams } from "./sharedInterfaces";
import type { StoresApiResponse } from "@/types/store";

// API Client configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

// Advertencia en desarrollo si no está configurada la API Key
if (!API_KEY && process.env.NODE_ENV === 'development') {
  console.warn(
    '⚠️ NEXT_PUBLIC_API_KEY no está configurada en .env.local\n' +
    'Las peticiones al API fallarán con error 401'
  );
}

// Generic API response type
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  errors?: string[];
  statusCode?: number; // Incluir statusCode para detectar errores HTTP como 429
}

// API Client class
export class ApiClient {
  private readonly baseURL: string;
  private headers: Record<string, string>;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
    this.headers = {
      "Content-Type": "application/json",
      // Agregar API Key automáticamente si está configurada
      ...(API_KEY && { "X-API-Key": API_KEY }),
    };
  }

  // Auth methods
  setAuthToken(token: string) {
    this.headers["Authorization"] = `Bearer ${token}`;
  }

  removeAuthToken() {
    delete this.headers["Authorization"];
  }

  // Generic request method
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    const config: RequestInit = {
      headers: this.headers,
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const responseData = await response.json();

      // Extraer statusCode del responseData si existe (para errores como 429)
      const statusCode = responseData?.statusCode || response.status;

      // Si la respuesta tiene la estructura { success, data, message, errors }
      if (responseData && typeof responseData === 'object' && 'success' in responseData) {
        return {
          data: responseData.data as T,
          success: responseData.success && response.ok,
          message: responseData.message,
          errors: responseData.errors,
          statusCode: !response.ok ? statusCode : undefined, // Solo incluir si hay error
        };
      }

      // Fallback para respuestas que no siguen el formato estándar
      return {
        data: responseData as T,
        success: response.ok,
        message: responseData.message,
        errors: responseData.errors,
        statusCode: !response.ok ? statusCode : undefined, // Solo incluir si hay error
      };
    } catch (error) {
      // Silenciar errores de abort - son esperados cuando el usuario cambia de filtros rápidamente
      if (error instanceof Error && (error.name === 'AbortError' || error.message.includes('aborted'))) {
        return {
          data: {} as T,
          success: false,
          message: "Request aborted",
        };
      }

      console.error("API request failed:", error);
      return {
        data: {} as T,
        success: false,
        message: "Request failed",
      };
    }
  }

  // HTTP methods
  async get<T>(endpoint: string, init?: RequestInit): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: "GET", ...(init || {}) });
  }

  async post<T>(endpoint: string, data?: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async put<T>(endpoint: string, data?: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: "DELETE" });
  }
}

// Export singleton instance
export const apiClient = new ApiClient();

// Re-export types used by this module
export type { ProductFilterParams } from "./sharedInterfaces";

// Product API endpoints
export const productEndpoints = {
  getAll: () => apiClient.get<ProductApiResponse>("/api/products"),
  getFiltered: (() => {
    const inFlightByKey: Record<string, Promise<ApiResponse<ProductApiResponse>> | undefined> = {};
    
    // Función para normalizar parámetros y crear clave de deduplicación
    // Ignora parámetros no críticos que no afectan qué productos se obtienen
    const normalizeParams = (params: ProductFilterParams): string => {
      const critical: Record<string, string> = {};
      
      // Solo incluir parámetros críticos que afectan qué productos se obtienen
      if (params.categoria) critical.categoria = String(params.categoria);
      if (params.menuUuid) critical.menuUuid = String(params.menuUuid);
      if (params.submenuUuid) critical.submenuUuid = String(params.submenuUuid);
      if (params.precioMin !== undefined) critical.precioMin = String(params.precioMin);
      if (params.lazyLimit !== undefined) critical.lazyLimit = String(params.lazyLimit);
      if (params.lazyOffset !== undefined) critical.lazyOffset = String(params.lazyOffset);
      
      // Ignorar: sortBy, sortOrder, page, limit (no afectan qué productos se obtienen)
      
      return Object.keys(critical).sort().map(k => `${k}:${critical[k]}`).join('|');
    };
    
    return (params: ProductFilterParams, init?: RequestInit) => {
      const normalizedKey = normalizeParams(params);
      
      // Construir URL completa para la petición real (con todos los parámetros)
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          searchParams.append(key, String(value));
        }
      });
      const url = `/api/products/filtered?${searchParams.toString()}`;

      // Usar clave normalizada para deduplicación
      if (inFlightByKey[normalizedKey]) {
        return inFlightByKey[normalizedKey] as Promise<ApiResponse<ProductApiResponse>>;
      }

      const p = apiClient.get<ProductApiResponse>(url, init).finally(() => {
        // liberar inmediatamente al resolver/rechazar para no cachear respuestas
        delete inFlightByKey[normalizedKey];
      });
      inFlightByKey[normalizedKey] = p;
      return p;
    };
  })(),
  getById: (id: string) =>
    apiClient.get<ProductApiResponse>(`/api/products/${id}`),
  getByCategory: (category: string) =>
    apiClient.get<ProductApiResponse>(
      `/api/products/filtered?categoria=${category}`
    ),
  getBySubcategory: (subcategory: string) =>
    apiClient.get<ProductApiResponse>(
      `/api/products/filtered?subcategoria=${subcategory}`
    ),
  getByCodigoMarket: (codigoMarket: string) =>
    apiClient.get<ProductApiResponse>(
      `/api/products/filtered?codigoMarket=${codigoMarket}`
    ),
  search: (query: string, params?: { precioMin?: number; page?: number; limit?: number }) => {
    const searchParams = new URLSearchParams();
    searchParams.append('query', query);
    searchParams.append('precioMin', String(params?.precioMin ?? 1));
    searchParams.append('page', String(params?.page ?? 1));
    searchParams.append('limit', String(params?.limit ?? 15));

    return apiClient.get<ProductApiResponse>(`/api/products/search/grouped?${searchParams.toString()}`);
  },
  getOffers: () =>
    apiClient.get<ProductApiResponse>(
      "/api/products/filtered?conDescuento=true"
    ),
  getFavorites: (id: string, params?: FavoriteFilterParams) => {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          searchParams.append(key, String(value));
        }
      });
    }

    const queryString = searchParams.toString();
    const url = queryString
      ? `/api/products/favorites/${id}?${queryString}`
      : `/api/products/favorites/${id}`;

    return apiClient.get<FavoriteApiResponse>(url);
  },
  addFavorite: (data: {
    productSKU: string;
    userInfo: {
      //userId?: string;
      id?: string;
      nombre?: string;
      apellido?: string;
      email?: string;
      telefono?: string;
      numero_documento?: string;
      rol?: string;
    };
  }) =>
    apiClient.post<{
      productSKU: string;
      userInfo: {
        id?: string;
        //userId?: string;
        nombre?: string;
        apellido?: string;
        email?: string;
        telefono?: string;
        numero_documento?: string | null;
        rol?: number;
      };
    }>(`/api/products/add-to-favorites`, data),
  removeFavorite: (id: string, productSKU: string) =>
    apiClient.delete<void>(
      `/api/products/remove-from-favorites/${id}?productSKU=${productSKU}`
    ),
  getCandidateStores: (data: { products: { sku: string; quantity: number }[]; user_id: string }) =>
    apiClient.post<CandidateStoresResponse>('/api/products/candidate-stores', data),
};

// Categories API endpoints
export const categoriesEndpoints = {
  getVisibleCategories: (() => {
    let cache: VisibleCategory[] | undefined;
    let inFlight: Promise<void> | null = null;
    let lastError: string | null = null;

    return async (): Promise<ApiResponse<VisibleCategory[]>> => {
      if (cache) {
        return { data: cache, success: true };
      }
      if (inFlight) {
        await inFlight;
        return { data: cache ?? [], success: !lastError, message: lastError || undefined };
      }

      inFlight = (async () => {
        const resp = await apiClient.get<VisibleCategory[]>('/api/categorias/visibles');
        if (resp.success && resp.data) {
          // Ordenar/filtrar activas aquí para que todos los consumidores lo reciban consistente
          cache = (resp.data as VisibleCategory[])
            .filter(c => (c as VisibleCategory).activo)
            .sort((a, b) => a.orden - b.orden);
          lastError = null;
        } else {
          cache = cache || [];
          lastError = resp.message || 'Error al cargar categorías visibles';
        }
      })();

      await inFlight;
      inFlight = null;
      return { data: cache ?? [], success: !lastError, message: lastError || undefined };
    };
  })(),

  getCompleteCategories: (() => {
    let cache: VisibleCategoryComplete[] | undefined;
    let inFlight: Promise<void> | null = null;
    let lastError: string | null = null;

    return async (): Promise<ApiResponse<VisibleCategoryComplete[]>> => {
      if (cache) {
        return { data: cache, success: true };
      }
      if (inFlight) {
        await inFlight;
        return { data: cache ?? [], success: !lastError, message: lastError || undefined };
      }

      inFlight = (async () => {
        const resp = await apiClient.get<VisibleCategoryComplete[]>('/api/categorias/visibles/completas');
        if (resp.success && resp.data) {
          cache = (resp.data as VisibleCategoryComplete[])
            .filter(c => c.activo)
            .sort((a, b) => a.orden - b.orden);
          lastError = null;
        } else {
          cache = cache || [];
          lastError = resp.message || 'Error al cargar categorías completas';
        }
      })();

      await inFlight;
      inFlight = null;
      return { data: cache ?? [], success: !lastError, message: lastError || undefined };
    };
  })(),
};

// Menus API endpoints
// Simple in-memory caches and in-flight maps to dedupe requests
const menusByCategoryCache: Record<string, Menu[] | undefined> = {};
const menusByCategoryInFlight: Record<string, Promise<void> | undefined> = {};

const submenusByMenuCache: Record<string, Submenu[] | undefined> = {};
const submenusByMenuInFlight: Record<string, Promise<void> | undefined> = {};

/**
 * Función helper para poblar el caché de submenús desde la respuesta completa
 * Esto evita múltiples peticiones HTTP al backend
 * Guarda tanto arrays con submenús como arrays vacíos para evitar futuras peticiones
 */
export const populateSubmenusCache = (completeCategories: VisibleCategoryComplete[]): void => {
  completeCategories.forEach((category) => {
    category.menus?.forEach((menu) => {
      if (menu.uuid && menu.submenus !== undefined) {
        // Poblar el caché de submenús directamente (incluyendo arrays vacíos)
        // Esto evita futuras peticiones incluso para menús sin submenús
        submenusByMenuCache[menu.uuid] = menu.submenus;
      }
    });
  });
};

export const menusEndpoints = {
  getSubmenus: async (menuUuid: string): Promise<ApiResponse<Submenu[]>> => {
    // Return from cache if present
    if (submenusByMenuCache[menuUuid]) {
      return { data: submenusByMenuCache[menuUuid] as Submenu[], success: true };
    }

    // Deduplicate concurrent calls
    if (submenusByMenuInFlight[menuUuid]) {
      await submenusByMenuInFlight[menuUuid];
      return { data: submenusByMenuCache[menuUuid] ?? [], success: true };
    }

    submenusByMenuInFlight[menuUuid] = (async () => {
      const resp = await apiClient.get<Submenu[]>(`/api/menus/visibles/${menuUuid}/submenus`);
      if (resp.success && resp.data) {
        // sort/filter handled by consumers; store as-is
        submenusByMenuCache[menuUuid] = resp.data;
      } else {
        submenusByMenuCache[menuUuid] = [];
      }
    })();

    await submenusByMenuInFlight[menuUuid];
    submenusByMenuInFlight[menuUuid] = undefined;
    return { data: submenusByMenuCache[menuUuid] ?? [], success: true };
  },

  getMenusByCategory: async (categoryUuid: string): Promise<ApiResponse<Menu[]>> => {
    // Return from cache if present
    if (menusByCategoryCache[categoryUuid]) {
      return { data: menusByCategoryCache[categoryUuid] as Menu[], success: true };
    }

    // Deduplicate concurrent calls
    if (menusByCategoryInFlight[categoryUuid]) {
      await menusByCategoryInFlight[categoryUuid];
      return { data: menusByCategoryCache[categoryUuid] ?? [], success: true };
    }

    menusByCategoryInFlight[categoryUuid] = (async () => {
      const resp = await apiClient.get<Menu[]>(`/api/categorias/visibles/${categoryUuid}/menus`);
      if (resp.success && resp.data) {
        menusByCategoryCache[categoryUuid] = resp.data;
      } else {
        menusByCategoryCache[categoryUuid] = [];
      }
    })();

    await menusByCategoryInFlight[categoryUuid];
    menusByCategoryInFlight[categoryUuid] = undefined;
    return { data: menusByCategoryCache[categoryUuid] ?? [], success: true };
  }
};

// Trade-in (Entrego y Estreno) API endpoints
export const tradeInEndpoints = {
  getHierarchy: () => apiClient.get<TradeInCategory[]>('/api/trade-in/hierarchy'),
  calculateValue: (data: TradeInValueRequest) =>
    apiClient.post<TradeInValueResponse>('/api/trade-in/value', data),
  checkSkuForTradeIn: (data: { sku: string }) =>
    apiClient.post<TradeInCheckResult>('/api/trade-in/check-sku', data)
};

// Stores API endpoints
export const storesEndpoints = {
  getAll: (() => {
    let cache: StoresApiResponse | undefined;
    let inFlight: Promise<void> | null = null;
    let lastError: string | null = null;

    return async (): Promise<ApiResponse<StoresApiResponse>> => {
      // Return from cache if available
      if (cache) {
        return { data: cache, success: true };
      }

      // Deduplicate concurrent calls
      if (inFlight) {
        await inFlight;
        return { data: cache ?? [], success: !lastError, message: lastError || undefined };
      }

      inFlight = (async () => {
        const resp = await apiClient.get<StoresApiResponse>('/api/stores');
        if (resp.success && resp.data) {
          cache = resp.data;
          lastError = null;
        } else {
          cache = cache || [];
          lastError = resp.message || 'Error al cargar tiendas';
        }
      })();

      await inFlight;
      inFlight = null;
      return { data: cache ?? [], success: !lastError, message: lastError || undefined };
    };
  })()
};

// Favorite filter
export interface FavoriteFilterParams {
  page?: number;
  limit?: number;
}

// API Response types
export interface ProductApiResponse {
  products: ProductApiData[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface ProductApiData {
  codigoMarketBase: string;
  codigoMarket: string[];
  nombreMarket: string[];
  categoria: string;
  subcategoria: string;
  modelo: string[];
  segmento?: string[]; // Campo para identificar productos premium (array)
  color: string[];
  nombreColor?: string[]; // Nombre del color para mostrar (ej: "Negro Medianoche")
  capacidad: string[];
  memoriaram: string[];
  descGeneral: string[];
  sku: string[];
  ean:string[];
  desDetallada: string[];
  stockTotal: number[];
  cantidadTiendas: number[];
  cantidadTiendasReserva: number[];
  urlImagenes: string[];
  urlRender3D: string[];
  imagePreviewUrl: string[];
  imageDetailsUrls: string[][];
  imagenPremium?: string[][]; // Campo para imágenes premium (array de arrays, uno por cada variante)
  videoPremium?: string[][]; // Campo para videos premium (array de arrays, uno por cada variante)
  imagen_premium?: string[][]; // Alias para compatibilidad
  video_premium?: string[][]; // Alias para compatibilidad
  precioNormal: number[];
  precioeccommerce: number[];
  fechaInicioVigencia: string[];
  fechaFinalVigencia: string[];
  indRetoma?: number[]; // Indicador de retoma (0 o 1 por cada variante)
  skuPostback?: string[];
  indcerointeres?: number[];
  ancho?: number[];
  alto?: number[];
  largo?: number[];
  peso?: number[];
}

export interface FavoriteApiResponse {
  products: ProductApiData[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

// Visible Categories types (legacy - deprecated)
export interface Subcategoria {
  uuid: string;
  nombre: string;
  nombreVisible: string;
  descripcion: string;
  imagen: string;
  activo: boolean;
  categoriasVisiblesId: string;
  createdAt: string;
  updatedAt: string;
}

export interface VisibleCategory {
  uuid: string;
  nombre: string;
  nombreVisible: string;
  descripcion: string | null;
  imagen: string | null;
  activo: boolean;
  orden: number;
  createdAt: string;
  updatedAt: string;
  totalProducts: number;
  // Legado: subcategorias ya no vienen en el endpoint ligero
  subcategorias?: Subcategoria[];
}

// Complete Visible Categories types (new structure)
export interface Submenu {
  uuid: string;
  nombre: string;
  nombreVisible: string;
  descripcion: string;
  imagen: string;
  activo: boolean;
  orden: number;
  menusVisiblesId: string;
  createdAt: string;
  updatedAt: string;
  totalProducts: number;
}

export interface Menu {
  uuid: string;
  nombre: string;
  nombreVisible: string;
  descripcion: string;
  imagen: string;
  activo: boolean;
  orden: number;
  categoriasVisiblesId: string;
  createdAt: string;
  updatedAt: string;
  submenus: Submenu[];
}

export interface VisibleCategoryComplete {
  uuid: string;
  nombre: string;
  nombreVisible: string;
  descripcion: string;
  imagen: string;
  activo: boolean;
  orden: number;
  createdAt: string;
  updatedAt: string;
  menus: Menu[];
}

// Trade-in (Entrego y Estreno) types
export interface TradeInModel {
  codModelo: string;
  modelo: string;
  capacidad: string;
}

export interface TradeInBrand {
  codMarca: string;
  marca: string;
  maxPrecio: number;
  models: TradeInModel[];
}

export interface TradeInCategory {
  categoria: string;
  maxPrecio: number;
  brands: TradeInBrand[];
}

export interface TradeInValueRequest {
  codMarca: string;
  codModelo: string;
  grado: 'A' | 'B' | 'C'; // A=Excelente, B=Buen estado, C=Estado regular
}

export interface TradeInValueResponse {
  codMarca: string;
  marca: string;
  codModelo: string;
  modelo: string;
  capacidad: string;
  categoria: string;
  grado: 'A' | 'B' | 'C';
  valorRetoma: number;
}

export interface TradeInCheckResult {
  aplica: boolean;
  sku: string;
  indRetoma?: number;
  mensaje?: string;
}

// Candidate stores types
export interface CandidateStore {
  codBodega: string;
  nombre_tienda: string;
  direccion: string;
  place_ID: string;
  distance: number;
  horario: string;
}

export interface DefaultDirection {
  id: string;
  google_place_id: string;
  linea_uno: string;
  ciudad: string;
}

export interface CandidateStoresResponse {
  stores: Record<string, CandidateStore[]>;
  canPickUp: boolean;
  default_direction: DefaultDirection;
}
