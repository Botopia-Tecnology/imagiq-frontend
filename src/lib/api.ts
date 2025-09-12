/**
 * Cliente API para comunicación con microservicios
 * - Configuración base de Axios o Fetch
 * - Interceptors para auth tokens
 * - Manejo centralizado de errores
 * - Retry logic para requests fallidos
 * - Rate limiting y caching
 * - TypeScript interfaces para requests/responses
 */

// API Client configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

// Generic API response type
interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  errors?: string[];
}

// API Client class
export class ApiClient {
  private baseURL: string;
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
      const data = await response.json();

      return {
        data: data as T,
        success: response.ok,
        message: data.message,
        errors: data.errors,
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

// Product API endpoints
export const productEndpoints = {
  getAll: () => apiClient.get<ProductApiResponse>('/products'),
  getFiltered: (params: ProductFilterParams) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, String(value));
      }
    });
    const url = `/products/filtered?${searchParams.toString()}`;
    console.log(`🌐 URL completa generada: ${url}`);
    return apiClient.get<ProductApiResponse>(url);
  },
  getById: (id: string) => apiClient.get<ProductApiResponse>(`/products/${id}`),
  getByCategory: (category: string) => apiClient.get<ProductApiResponse>(`/products/filtered?categoria=${category}`),
  getBySubcategory: (subcategory: string) => apiClient.get<ProductApiResponse>(`/products/filtered?subcategoria=${subcategory}`),
  search: (query: string) => apiClient.get<ProductApiResponse>(`/products/filtered?nombre=${query}`),
  getOffers: () => apiClient.get<ProductApiResponse>('/products/filtered?conDescuento=true'),
};

// Product filter parameters interface
export interface ProductFilterParams {
  categoria?: string;
  subcategoria?: string;
  precioMin?: number;
  precioMax?: number;
  conDescuento?: boolean;
  stockMinimo?: number;
  color?: string;
  capacidad?: string;
  nombre?: string;
  desDetallada?: string; // Nuevo campo para buscar en descripción detallada
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
  codigoMarket: string;
  nombreMarket: string;
  categoria: string;
  subcategoria: string;
  modelo: string;
  color: string;
  capacidad: string;
  descGeneral: string;
  sku: string;
  desDetallada: string;
  stock: number;
  urlImagenes: string;
  urlRender3D: string;
  precioNormal: number;
  precioDescto: number;
  fechaInicioVigencia: string;
  fechaFinalVigencia: string;
}
