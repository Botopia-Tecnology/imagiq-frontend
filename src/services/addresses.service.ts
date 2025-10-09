/**
 * @module addresses.service
 * @description Servicio para interactuar con el API de direcciones del backend
 */

import { PlaceDetails } from '@/types/places.types';

/**
 * Interface para crear una nueva dirección
 */
export interface CreateAddressRequest {
  nombreDireccion: string;
  tipoDireccion: 'casa' | 'apartamento' | 'oficina' | 'otro';
  tipo: 'ENVIO' | 'FACTURACION' | 'AMBOS';
  esPredeterminada?: boolean;
  placeDetails: PlaceDetails;
  complemento?: string;
  instruccionesEntrega?: string;
  puntoReferencia?: string;
  usuarioId?: string; // Para usuarios invitados sin JWT
}

/**
 * Interface para la respuesta de dirección
 */
export interface AddressResponse {
  id: string;
  usuarioId: string;
  nombreDireccion: string;
  tipoDireccion: string;
  tipo: string;
  esPredeterminada: boolean;
  googlePlaceId: string;
  direccionFormateada: string;
  latitud: number;
  longitud: number;
  googleUrl?: string;
  vicinity?: string;
  departamento?: string;
  codigoPostal?: string;
  ciudad?: string;
  localidad?: string;
  barrio?: string;
  // Removed: numeroCalle, nombreCalle, nomenclaturaTipo, nomenclaturaNumero, nomenclaturaAdicional
  complemento?: string;
  instruccionesEntrega?: string;
  puntoReferencia?: string;
  pais: string;
  lineaUno: string;
  activa: boolean;
  zonaCobertura?: string;
  // Removed: tiempoEntregaEstimado, costoEnvioBase, vecesUtilizada
  fechaCreacion: Date;
  fechaUltimaActualizacion?: Date;
  fechaUltimaValidacion?: Date;
  validadaGoogle: boolean;
  enZonaCobertura: boolean;
}

/**
 * Configuración base del servicio
 */
const BASE_CONFIG = {
  API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
};

/**
 * Clase de servicio para direcciones
 */
export class AddressesService {
  private static instance: AddressesService;

  /**
   * Constructor privado para implementar Singleton
   */
  private constructor() {}

  /**
   * Obtiene la instancia única del servicio
   */
  public static getInstance(): AddressesService {
    if (!AddressesService.instance) {
      AddressesService.instance = new AddressesService();
    }
    return AddressesService.instance;
  }

  /**
   * Obtiene el token de autorización del localStorage o contexto de auth
   */
  private getAuthToken(): string {
    // Usar la clave correcta del token que se guarda en login
    const token = localStorage.getItem('imagiq_token') || sessionStorage.getItem('imagiq_token');
    return token || '';
  }

  /**
   * Headers base para las peticiones
   */
  private getHeaders(): HeadersInit {
    const token = this.getAuthToken();
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  /**
   * Crea una nueva dirección
   */
  public async createAddress(addressData: CreateAddressRequest): Promise<AddressResponse> {
    try {
      // Obtener información del usuario del localStorage
      const userInfo = JSON.parse(localStorage.getItem('imagiq_user') || '{}');
      const requestData = { ...addressData };

      // SIEMPRE incluir usuarioId explícitamente
      if (userInfo.id) {
        requestData.usuarioId = userInfo.id;
      } else if (userInfo.email) {
        requestData.usuarioId = userInfo.email;
      } else {
        throw new Error('No se encontró información del usuario. Por favor, inicia sesión nuevamente.');
      }

      const response = await fetch(`${BASE_CONFIG.API_URL}/api/addresses`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Error response from API:', errorText);
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch {
          errorData = { message: errorText };
        }
        throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      return result;
    } catch (error: unknown) {
      console.error('❌ Error creando dirección:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido creando dirección';
      throw new Error(errorMessage);
    }
  }

  /**
   * Obtiene todas las direcciones del usuario
   */
  public async getUserAddresses(): Promise<AddressResponse[]> {
    try {
      // Si no hay token JWT, incluir usuarioId como query param
      const token = this.getAuthToken();
      let url = `${BASE_CONFIG.API_URL}/api/addresses`;

      if (!token) {
        const userInfo = JSON.parse(localStorage.getItem('imagiq_user') || '{}');
        if (userInfo.id) {
          url += `?usuarioId=${encodeURIComponent(userInfo.id)}`;
        } else if (userInfo.email) {
          url += `?usuarioId=${encodeURIComponent(userInfo.email)}`;
        }
      }

      const response = await fetch(url, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Error obteniendo direcciones';
      throw new Error(errorMessage);
    }
  }

  /**
   * Obtiene direcciones por tipo
   */
  public async getUserAddressesByType(tipo: 'ENVIO' | 'FACTURACION' | 'AMBOS'): Promise<AddressResponse[]> {
    try {
      const response = await fetch(`${BASE_CONFIG.API_URL}/api/addresses/by-type/${tipo}`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Error obteniendo direcciones por tipo';
      throw new Error(errorMessage);
    }
  }

  /**
   * Obtiene la dirección predeterminada por tipo
   */
  public async getDefaultAddress(tipo: 'ENVIO' | 'FACTURACION' | 'AMBOS'): Promise<AddressResponse | null> {
    try {
      const response = await fetch(`${BASE_CONFIG.API_URL}/api/addresses/default/${tipo}`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (response.status === 404) {
        return null;
      }

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error: unknown) {
      return null;
    }
  }

  /**
   * Actualiza una dirección existente
   */
  public async updateAddress(addressId: string, updateData: Partial<CreateAddressRequest>): Promise<AddressResponse> {
    try {
      const response = await fetch(`${BASE_CONFIG.API_URL}/api/addresses/${addressId}`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Error actualizando dirección';
      throw new Error(errorMessage);
    }
  }

  /**
   * Desactiva una dirección
   */
  public async deactivateAddress(addressId: string): Promise<{ message: string }> {
    try {
      const response = await fetch(`${BASE_CONFIG.API_URL}/api/addresses/${addressId}`, {
        method: 'DELETE',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Error desactivando dirección';
      throw new Error(errorMessage);
    }
  }

  /**
   * Incrementa el contador de uso de una dirección
   */
  public async incrementUsageCount(addressId: string): Promise<{ message: string }> {
    try {
      const response = await fetch(`${BASE_CONFIG.API_URL}/api/addresses/${addressId}/increment-usage`, {
        method: 'POST',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Error incrementando contador de uso';
      throw new Error(errorMessage);
    }
  }
}

// Exportar instancia única
export const addressesService = AddressesService.getInstance();
