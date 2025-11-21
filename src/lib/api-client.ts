/**
 * 🔐 API Client - Cliente HTTP con autenticación automática
 *
 * Este módulo proporciona funciones helper para hacer peticiones HTTP al backend
 * con autenticación automática:
 * - API Key (X-API-Key): Autenticación de la aplicación
 * - Bearer Token (Authorization): Autenticación del usuario (desde localStorage)
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

// Advertencia en desarrollo si no está configurada la API Key
if (!API_KEY && process.env.NODE_ENV === 'development') {
  console.warn(
    '⚠️ NEXT_PUBLIC_API_KEY no está configurada. Las peticiones al API fallarán.\n' +
    'Agrega NEXT_PUBLIC_API_KEY a tu archivo .env.local'
  );
}

/**
 * Cliente HTTP base con autenticación automática
 *
 * Incluye automáticamente:
 * - X-API-Key: Autenticación de la aplicación
 * - Authorization: Bearer token del usuario (si está logueado)
 *
 * @param endpoint - Ruta relativa del API (ej: '/api/products')
 * @param options - Opciones de fetch estándar
 * @returns Promise<Response>
 *
 * @example
 * const response = await apiClient('/api/products', { method: 'GET' });
 * const data = await response.json();
 */
export async function apiClient(
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> {
  const url = `${API_URL}${endpoint}`;

  // Obtener token de autenticación del usuario desde localStorage
  const authToken = typeof window !== 'undefined'
    ? localStorage.getItem('imagiq_token')
    : null;

  // Combinar headers: API Key + Auth Token + headers personalizados
  const headers = new Headers({
    'Content-Type': 'application/json',
    ...(API_KEY && { 'X-API-Key': API_KEY }),
    ...(authToken && { 'Authorization': `Bearer ${authToken}` }),
    ...options.headers,
  });

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });
    // Manejar errores específicos
    if (!response.ok) {
      if (response.status === 401) {
        const error = new Error('API Key inválida o faltante');
        console.error('🔐 Error de autenticación:', error.message);
        throw error;
      }
      if (response.status === 429) {
        const error = new Error('Demasiadas peticiones. Por favor intenta más tarde.');
        console.error('⚠️ Rate limit excedido:', error.message);
        throw error;
      }
      const data = await response?.json();
      throw new Error(data?.message ?? `HTTP Error ${response.status}: ${response.statusText}`);
    }

    return response;
  } catch (error) {
    if (error instanceof Error) {
      console.error('❌ API Client Error:', error.message, { endpoint, url });
    }
    throw error;
  }
}

/**
 * Helper para peticiones GET con tipado TypeScript
 *
 * @param endpoint - Ruta relativa del API
 * @returns Promise con datos parseados
 *
 * @example
 * const products = await apiGet<Product[]>('/api/products?limit=10');
 */
export async function apiGet<T = unknown>(endpoint: string): Promise<T> {
  const response = await apiClient(endpoint, { method: 'GET' });

  // Manejar respuestas vacías (204 No Content o respuestas sin body)
  if (response.status === 204) {
    return undefined as T;
  }

  // Verificar si la respuesta tiene contenido
  const contentLength = response.headers.get('content-length');
  const contentType = response.headers.get('content-type');

  // Si no hay contenido o no es JSON, retornar undefined
  if (contentLength === '0' || !contentType?.includes('application/json')) {
    console.warn(`[API] Empty or non-JSON response from ${endpoint}`);
    return undefined as T;
  }

  return response.json();
}

/**
 * Helper para peticiones POST con tipado TypeScript
 *
 * @param endpoint - Ruta relativa del API
 * @param data - Datos a enviar en el body
 * @returns Promise con datos parseados
 *
 * @example
 * const order = await apiPost<Order>('/api/orders', { items: [...] });
 */
export async function apiPost<T = unknown>(
  endpoint: string,
  data: unknown
): Promise<T> {
  const response = await apiClient(endpoint, {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return response.json();
}

/**
 * Helper para peticiones PUT con tipado TypeScript
 *
 * @param endpoint - Ruta relativa del API
 * @param data - Datos a actualizar
 * @returns Promise con datos parseados
 *
 * @example
 * const updatedUser = await apiPut<User>('/api/users/123', { name: 'New Name' });
 */
export async function apiPut<T = unknown>(
  endpoint: string,
  data: unknown
): Promise<T> {
  const response = await apiClient(endpoint, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
  return response.json();
}

/**
 * Helper para peticiones PATCH con tipado TypeScript
 *
 * @param endpoint - Ruta relativa del API
 * @param data - Datos parciales a actualizar
 * @returns Promise con datos parseados
 *
 * @example
 * const updated = await apiPatch<User>('/api/users/123', { email: 'new@email.com' });
 */
export async function apiPatch<T = unknown>(
  endpoint: string,
  data: unknown
): Promise<T> {
  const response = await apiClient(endpoint, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
  return response.json();
}

/**
 * Helper para peticiones DELETE con tipado TypeScript
 *
 * @param endpoint - Ruta relativa del API
 * @returns Promise con datos parseados (si los hay)
 *
 * @example
 * await apiDelete('/api/products/123');
 */
export async function apiDelete<T = unknown>(endpoint: string): Promise<T> {
  const response = await apiClient(endpoint, { method: 'DELETE' });

  // Algunas APIs de DELETE retornan 204 No Content
  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}

/**
 * Obtener URL base del API
 */
export function getApiUrl(): string {
  return API_URL;
}

/**
 * Verificar si la API Key está configurada
 */
export function isApiKeyConfigured(): boolean {
  return !!API_KEY;
}
