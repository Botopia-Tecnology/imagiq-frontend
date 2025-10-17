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

// API Client configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

// Generic API response type
interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  errors?: string[];
}

// API Client class
export class ApiClient {
  private readonly baseURL: string;
  private headers: Record<string, string>;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
    this.headers = {
      "Content-Type": "application/json",
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

      // Si la respuesta tiene la estructura { success, data, message, errors }
      if (responseData && typeof responseData === 'object' && 'success' in responseData) {
        return {
          data: responseData.data as T,
          success: responseData.success && response.ok,
          message: responseData.message,
          errors: responseData.errors,
        };
      }

      // Fallback para respuestas que no siguen el formato estándar
      return {
        data: responseData as T,
        success: response.ok,
        message: responseData.message,
        errors: responseData.errors,
      };
    } catch (error) {
      console.error("API request failed:", error);
      return {
        data: {} as T,
        success: false,
        message: "Request failed",
      };
    }
  }

  // HTTP methods
  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: "GET" });
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
  getFiltered: (params: ProductFilterParams) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        searchParams.append(key, String(value));
      }
    });
    const url = `/api/products/filtered?${searchParams.toString()}`;
    return apiClient.get<ProductApiResponse>(url);
  },
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
  search: (query: string, params?: { precioMin?: number; page?: number; limit?: number; sortBy?: string; sortOrder?: string }) => {
    const searchParams = new URLSearchParams();
    searchParams.append('query', query);
    searchParams.append('precioMin', String(params?.precioMin ?? 1));
    searchParams.append('page', String(params?.page ?? 1));
    searchParams.append('limit', String(params?.limit ?? 15));
    
    // Agregar parámetros de ordenamiento si están presentes
    if (params?.sortBy) {
      searchParams.append('sortBy', params.sortBy);
    }
    if (params?.sortOrder) {
      searchParams.append('sortOrder', params.sortOrder);
    }
    
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
};

// Categories API endpoints
export const categoriesEndpoints = {
  getVisibleCategories: () => apiClient.get<VisibleCategory[]>('/api/categorias/visibles')
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
  nombreMarket: string;
  categoria: string;
  subcategoria: string;
  modelo: string;
  color: string[];
  capacidad: string[];
  descGeneral: string | null;
  sku: string[];
  ean:string[];
  desDetallada: string[];
  stock: number[];
  urlImagenes: string[];
  urlRender3D: string[];
  imagePreviewUrl: string[];
  imageDetailsUrls: string[][];
  precioNormal: number[];
  precioeccommerce: number[];
  fechaInicioVigencia: string[];
  fechaFinalVigencia: string[];
}

export interface FavoriteApiResponse {
  products: ProductApiData[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

// Visible Categories types
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
  descripcion: string;
  imagen: string;
  activo: boolean;
  createdAt: string;
  updatedAt: string;
  subcategorias: Subcategoria[];
  totalProducts: number;
}
