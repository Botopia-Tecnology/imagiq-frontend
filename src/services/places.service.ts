/**
 * @module places.service
 * @description Servicio para interactuar con el API de Google Places a través del backend
 * Siguiendo el Single Responsibility Principle (SRP) y Dependency Inversion Principle (DIP) de SOLID
 */

import {
  AutocompleteOptions,
  AutocompleteResponse,
  PlaceDetailsResponse,
  PlaceDetails,
  ColombianCity,
} from '@/types/places.types';

/**
 * Configuración base del servicio
 */
const BASE_CONFIG = {
  API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  DEFAULT_COUNTRY: 'CO',
  DEFAULT_LANGUAGE: 'es',
  DEFAULT_DEBOUNCE: 300,
  DEFAULT_MIN_LENGTH: 3,
  DEFAULT_MAX_RESULTS: 5,
  // Centro de Colombia para búsquedas por defecto
  DEFAULT_LOCATION: {
    lat: 4.570868,
    lng: -74.297333
  },
  // Radio por defecto en metros (toda Colombia)
  DEFAULT_RADIUS: 1000000
};

/**
 * Clase de servicio para Google Places
 * Implementa el patrón Singleton para mantener una única instancia
 */
export class PlacesService {
  private static instance: PlacesService;
  private sessionToken: string | null = null;
  private abortController: AbortController | null = null;

  /**
   * Constructor privado para implementar Singleton
   */
  private constructor() {
    this.generateSessionToken();
  }

  /**
   * Obtiene la instancia única del servicio
   */
  public static getInstance(): PlacesService {
    if (!PlacesService.instance) {
      PlacesService.instance = new PlacesService();
    }
    return PlacesService.instance;
  }

  /**
   * Genera un nuevo token de sesión para optimizar costos de API
   */
  private generateSessionToken(): void {
    this.sessionToken = this.generateUUID();
  }

  /**
   * Genera un UUID v4
   */
  private generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  /**
   * Cancela la petición anterior si existe
   */
  private cancelPreviousRequest(): void {
    if (this.abortController) {
      this.abortController.abort();
    }
  }

  /**
   * Construye los parámetros de búsqueda con valores colombianos por defecto
   */
  private buildSearchParams(input: string, options?: AutocompleteOptions): URLSearchParams {
    const params = new URLSearchParams({
      input,
      country: options?.countryRestriction?.toString() || BASE_CONFIG.DEFAULT_COUNTRY,
      language: options?.language || BASE_CONFIG.DEFAULT_LANGUAGE,
      sessionToken: this.sessionToken || '',
    });

    // Agregar ubicación para sesgar resultados
    const location = options?.location || BASE_CONFIG.DEFAULT_LOCATION;
    params.append('location', `${location.lat},${location.lng}`);

    // Agregar radio de búsqueda
    const radius = options?.radius || BASE_CONFIG.DEFAULT_RADIUS;
    params.append('radius', radius.toString());

    // Agregar tipos si se especifican
    if (options?.types && options.types.length > 0) {
      params.append('types', options.types.join('|'));
    }

    // Agregar campos específicos para optimizar costos
    if (options?.fields && options.fields.length > 0) {
      params.append('fields', options.fields.join(','));
    }

    // Filtro por ciudad colombiana
    if (options?.cityFilter) {
      params.append('cityFilter', options.cityFilter);
    }

    // Filtro por departamento colombiano
    if (options?.departmentFilter) {
      params.append('departmentFilter', options.departmentFilter);
    }

    return params;
  }

  /**
   * Busca predicciones de direcciones
   */
  public async searchPlaces(
    input: string,
    options?: AutocompleteOptions
  ): Promise<AutocompleteResponse> {
    // Validar longitud mínima
    if (input.length < (options?.minLength || BASE_CONFIG.DEFAULT_MIN_LENGTH)) {
      return {
        predictions: [],
        status: 'ZERO_RESULTS',
        sessionToken: this.sessionToken || undefined
      };
    }

    // Cancelar petición anterior
    this.cancelPreviousRequest();

    // Crear nuevo controlador para esta petición
    this.abortController = new AbortController();

    try {
      const params = this.buildSearchParams(input, options);
      const response = await fetch(
        `${BASE_CONFIG.API_URL}/api/places/autocomplete?${params}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          signal: this.abortController.signal
        }
      );

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      // Limitar resultados si se especifica
      if (options?.maxResults && data.predictions) {
        data.predictions = data.predictions.slice(0, options.maxResults);
      }

      return data;
    } catch (error: unknown) {
      // Si fue cancelado, retornar resultados vacíos
      if (error instanceof Error && error.name === 'AbortError') {
        return {
          predictions: [],
          status: 'OK',
          sessionToken: this.sessionToken || undefined
        };
      }

      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      return {
        predictions: [],
        status: 'ERROR',
        errorMessage,
        sessionToken: this.sessionToken || undefined
      };
    }
  }

  /**
   * Obtiene los detalles completos de un lugar
   */
  public async getPlaceDetails(placeId: string): Promise<PlaceDetailsResponse> {
    try {
      const params = new URLSearchParams({
        placeId,
        sessionToken: this.sessionToken || '',
        language: BASE_CONFIG.DEFAULT_LANGUAGE
      });

      const response = await fetch(
        `${BASE_CONFIG.API_URL}/api/places/details?${params}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      // Regenerar token después de obtener detalles (para optimizar costos)
      this.generateSessionToken();

      return data;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      return {
        place: {} as PlaceDetails,
        status: 'ERROR',
        errorMessage
      };
    }
  }

  /**
   * Valida si una dirección está dentro de las zonas de cobertura
   */
  public async validateCoverage(placeId: string): Promise<boolean> {
    try {
      const response = await fetch(
        `${BASE_CONFIG.API_URL}/api/places/validate-coverage`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ placeId })
        }
      );

      if (!response.ok) {
        return false;
      }

      const data = await response.json();
      return data.isInCoverage;
    } catch (error) {
      return false;
    }
  }

  /**
   * Obtiene las ciudades disponibles para entrega
   */
  public async getAvailableCities(): Promise<ColombianCity[]> {
    try {
      const response = await fetch(
        `${BASE_CONFIG.API_URL}/api/places/available-cities`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );

      if (!response.ok) {
        throw new Error('Error obteniendo ciudades disponibles');
      }

      const data = await response.json();
      return data.cities;
    } catch (error) {
      return [];
    }
  }

  /**
   * Parsea una dirección colombiana para extraer sus componentes
   */
  public parseColombianAddress(address: string): {
    streetType?: string;
    streetNumber?: string;
    crossStreet?: string;
    complement?: string;
  } {
    // Expresión regular para direcciones colombianas
    // Ej: Calle 80 # 15-25, Carrera 7 Bis # 124-15 Apto 301
    const regex = /^(Calle|Carrera|Diagonal|Transversal|Avenida|Circular|Vía|Cra|Cl|Dg|Tv|Av)\s+(\d+\w*)\s*(#|No\.?)?\s*(\d+\w*[-\s]\d+\w*)?\s*(.+)?$/i;

    const match = address.match(regex);

    if (match) {
      return {
        streetType: match[1],
        streetNumber: match[2],
        crossStreet: match[4],
        complement: match[5]
      };
    }

    return {};
  }
}

// Exportar instancia única
export const placesService = PlacesService.getInstance();