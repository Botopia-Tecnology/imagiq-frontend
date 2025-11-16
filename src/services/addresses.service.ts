/**
 * @module addresses.service
 * @description Servicio para interactuar con el API de direcciones del backend
 */

import { PlaceDetails } from "@/types/places.types";
import type { Address } from "@/types/address";
import { safeGetLocalStorage } from "@/lib/localStorage";
import { apiGet, apiPost, apiPut, apiDelete } from "@/lib/api-client";

/**
 * Interface para crear una nueva dirección
 */
export interface CreateAddressRequest {
  nombreDireccion: string;
  tipoDireccion: "casa" | "apartamento" | "oficina" | "otro";
  tipo: "ENVIO" | "FACTURACION" | "AMBOS";
  esPredeterminada?: boolean;
  placeDetails: PlaceDetails;
  complemento?: string;
  instruccionesEntrega?: string;
  puntoReferencia?: string;
  usuarioId?: string; // Para usuarios invitados sin JWT
}

/**
 * Interface para la respuesta de dirección (compatibilidad)
 * @deprecated Use Address type from @/types/address instead
 */
export type AddressResponse = Address;

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
   * Crea una nueva dirección
   */
  public async createAddress(
    addressData: CreateAddressRequest
  ): Promise<Address> {
    try {
      // Obtener información del usuario del localStorage
      const userInfo = safeGetLocalStorage<{ id?: string; email?: string }>(
        "imagiq_user",
        {}
      );
      const requestData = { ...addressData };

      // SIEMPRE incluir usuarioId explícitamente
      if (userInfo.id) {
        requestData.usuarioId = userInfo.id;
      } else if (userInfo.email) {
        requestData.usuarioId = userInfo.email;
      } else {
        throw new Error(
          "No se encontró información del usuario. Por favor, inicia sesión nuevamente."
        );
      }

      console.log("📤 Enviando datos de dirección:", {
        ...requestData,
        placeDetails: requestData.placeDetails ? "PlaceDetails object" : "null",
      });

      const result = await apiPost<Address>("/api/addresses", requestData);
      console.log("✅ Dirección creada exitosamente:", result);
      return result;
    } catch (error: unknown) {
      console.error("❌ Error creando dirección:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Error desconocido creando dirección";
      throw new Error(errorMessage);
    }
  }

  /**
   * Obtiene todas las direcciones del usuario
   */
  public async getUserAddresses(): Promise<Address[]> {
    try {
      // El backend requiere usuarioId siempre (con o sin token JWT)
      const userInfo = safeGetLocalStorage<{ id?: string; email?: string }>(
        "imagiq_user",
        {}
      );

      let endpoint = "/api/addresses";

      if (userInfo.id) {
        endpoint += `?usuarioId=${encodeURIComponent(userInfo.id)}`;
      } else if (userInfo.email) {
        endpoint += `?usuarioId=${encodeURIComponent(userInfo.email)}`;
      } else {
        // Si no hay userInfo, retornar array vacío
        console.warn("No hay información de usuario para obtener direcciones");
        return [];
      }

      const data = await apiGet<Address[]>(endpoint);
      console.log("Direcciones obtenidas:", data);
      return data;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Error obteniendo direcciones";
      console.error("Error en getUserAddresses:", errorMessage);
      // Retornar array vacío en lugar de lanzar error
      return [];
    }
  }

  /**
   * Obtiene direcciones por tipo
   */
  public async getUserAddressesByType(
    tipo: "ENVIO" | "FACTURACION" | "AMBOS",
    usuarioId: string
  ): Promise<Address[]> {
    try {
      return await apiGet<Address[]>(
        `/api/addresses/by-type/${tipo}?usuarioId=${usuarioId}`
      );
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Error obteniendo direcciones por tipo";
      throw new Error(errorMessage);
    }
  }

  /**
   * Obtiene la dirección predeterminada por tipo
   */
  public async getDefaultAddress(
    tipo: "ENVIO" | "FACTURACION" | "AMBOS"
  ): Promise<Address | null> {
    try {
      // Obtener información del usuario del localStorage
      const userInfo = safeGetLocalStorage<{ id?: string; email?: string }>(
        "imagiq_user",
        {}
      );

      if (!userInfo.id && !userInfo.email) {
        console.warn(
          "No hay información de usuario para obtener dirección predeterminada"
        );
        return null;
      }

      const usuarioId = userInfo.id || userInfo.email || "";
      const endpoint = `/api/addresses/default/${tipo}?usuarioId=${encodeURIComponent(
        usuarioId
      )}`;

      return await apiGet<Address>(endpoint);
    } catch {
      return null;
    }
  }

  /**
   * Actualiza una dirección existente
   */
  public async updateAddress(
    addressId: string,
    updateData: Partial<CreateAddressRequest>
  ): Promise<Address> {
    try {
      return await apiPut<Address>(`/api/addresses/${addressId}`, updateData);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Error actualizando dirección";
      throw new Error(errorMessage);
    }
  }

  /**
   * Desactiva una dirección
   */
  public async deactivateAddress(
    addressId: string
  ): Promise<{ message: string }> {
    try {
      return await apiDelete<{ message: string }>(`/api/addresses/${addressId}`);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Error desactivando dirección";
      throw new Error(errorMessage);
    }
  }

  /**
   * Incrementa el contador de uso de una dirección
   */
  public async incrementUsageCount(
    addressId: string
  ): Promise<{ message: string }> {
    try {
      return await apiPost<{ message: string }>(
        `/api/addresses/${addressId}/increment-usage`,
        {}
      );
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Error incrementando contador de uso";
      throw new Error(errorMessage);
    }
  }

  /**
   * Establece una dirección como predeterminada
   * Desmarca otras direcciones predeterminadas del mismo tipo automáticamente
   *
   * @param addressId - ID de la dirección a establecer como predeterminada
   * @returns Dirección actualizada
   */
  public async setDefaultAddress(addressId: string): Promise<Address> {
    try {
      // Obtener información del usuario del localStorage
      const userInfo = safeGetLocalStorage<{ id?: string; email?: string }>(
        "imagiq_user",
        {}
      );

      if (!userInfo.id && !userInfo.email) {
        throw new Error(
          "No se encontró información del usuario. Por favor, inicia sesión nuevamente."
        );
      }

      const usuarioId = userInfo.id || userInfo.email || "";
      const endpoint = `/api/addresses/${addressId}/set-default?usuarioId=${encodeURIComponent(
        usuarioId
      )}`;

      return await apiPost<Address>(endpoint, {});
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Error estableciendo dirección predeterminada";
      throw new Error(errorMessage);
    }
  }
}

// Exportar instancia única
export const addressesService = AddressesService.getInstance();
