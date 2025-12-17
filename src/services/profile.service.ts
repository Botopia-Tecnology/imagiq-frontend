/**
 * @module profile.service
 * @description Servicio para interactuar con el API de perfil del backend
 */

import { apiGet, apiPost, apiPatch } from "@/lib/api-client";
import { EncryptedCard } from "../features/profile/types";

/**
 * Interface para la respuesta completa del perfil del usuario
 * IMPORTANTE: Esta interfaz debe coincidir EXACTAMENTE con lo que retorna
 * la vista v_usuario_perfil en PostgreSQL del backend
 */
export interface ProfileResponse {
  // Datos básicos del usuario
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  numero_documento: string;

  // Datos adicionales del perfil
  ultimos_digitos?: string;
  email_verificado?: boolean;
  activo?: boolean;
  bloqueado?: boolean;
  fecha_creacion?: Date;
  ultimo_login?: Date | null;
  tipo_documento?: string;
  codigo_pais?: string;
  fecha_nacimiento?: Date;

  // ⚠️ CAMPOS JSON de la vista v_usuario_perfil
  // Estos vienen directamente como JSON arrays desde PostgreSQL
  tarjetas?: PaymentCardData[] | string; // Puede ser JSON string o array parseado
  direcciones?: AddressData[] | string; // Puede ser JSON string o array parseado
}

/**
 * Interface para datos de tarjetas de pago (FORMATO REAL DE LA BD)
 */
export interface PaymentCardData {
  id: number;
  ultimos_dijitos: string; // ⚠️ NOTA: En BD es "ultimos_dijitos" no "ultimos_digitos"
  tipo_tarjeta?: string; // 'credit_card' | 'debit_card'
  nombre_titular?: string;
  fecha_vencimiento?: string;
  es_predeterminada?: boolean;
  activa?: boolean;
  marca?: string; // 'visa' | 'mastercard' | 'amex'
  alias?: string;
}

/**
 * Interface para datos de direcciones (FORMATO REAL DE LA BD)
 */
export interface AddressData {
  id: string;
  linea_uno: string; // ⚠️ Formato real de la BD
  ciudad?: string;
  pais?: string;
  place_id?: string;
  tipo: string; // 'ENVIO' | 'FACTURACION' | 'AMBOS'

  // Campos opcionales que pueden venir del backend
  nombreDireccion?: string;
  tipoDireccion?: string; // 'casa' | 'apartamento' | 'oficina' | 'otro'
  esPredeterminada?: boolean;
  direccionFormateada?: string;
  departamento?: string;
  complemento?: string;
  instruccionesEntrega?: string;
  activa?: boolean;
}

/**
 * Interface para actualizar el perfil
 * Basada en la especificación del endpoint PATCH /auth/profile/:id
 */
export interface UpdateProfileRequest {
  nombre?: string;
  apellido?: string;
  email?: string;
  telefono?: string;
  tipo_documento?: string;
  numero_documento?: string;
  codigo_pais?: string;
  fecha_nacimiento?: Date | string;
}

/**
 * Interface para la respuesta del endpoint de actualización de perfil
 */
export interface UpdateProfileResponse {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  rol: number;
  telefono: string | null;
  numero_documento: string | null;
}

/**
 * Clase de servicio para el perfil de usuario
 */
export class ProfileService {
  private static instance: ProfileService;

  /**
   * Constructor privado para implementar Singleton
   */
  private constructor() {}

  /**
   * Obtiene la instancia única del servicio
   */
  public static getInstance(): ProfileService {
    if (!ProfileService.instance) {
      ProfileService.instance = new ProfileService();
    }
    return ProfileService.instance;
  }

  /**
   * Obtiene el ID del usuario del localStorage
   */
  private getUserId(): string | null {
    try {
      const userStr = globalThis.localStorage?.getItem?.("imagiq_user");
      if (!userStr) return null;
      const user = JSON.parse(userStr);
      return user.id || null;
    } catch {
      return null;
    }
  }

  /**
   * Obtiene el perfil completo del usuario autenticado
   * Llama al endpoint que retorna la vista v_usuario_perfil
   */
  public async getUserProfile(userId?: string): Promise<ProfileResponse> {
    try {
      const id = userId || this.getUserId();
      if (!id) {
        throw new Error("No se encontró el ID del usuario");
      }

      console.log("📤 Solicitando perfil para usuario:", id);

      const result = await apiGet<ProfileResponse>(`/api/auth/profile/${id}`);
      console.log("✅ Perfil obtenido exitosamente (RAW):", result);

      // ⚠️ IMPORTANTE: Si tarjetas/direcciones vienen como JSON strings, parsearlos
      // Normalizar tarjetas: si viene como string, parsear; si viene undefined, setear array
      if (typeof result.tarjetas === "string") {
        try {
          result.tarjetas = JSON.parse(result.tarjetas);
          console.log(
            "🔄 Tarjetas parseadas desde JSON string:",
            result.tarjetas
          );
        } catch (e) {
          console.error("❌ Error parseando tarjetas:", e);
          result.tarjetas = [];
        }
      }
      if (!result.tarjetas) result.tarjetas = [];

      // Normalizar direcciones: si viene como string, parsear; si viene undefined, setear array
      if (typeof result.direcciones === "string") {
        try {
          result.direcciones = JSON.parse(result.direcciones);
          console.log(
            "🔄 Direcciones parseadas desde JSON string:",
            result.direcciones
          );
        } catch (e) {
          console.error("❌ Error parseando direcciones:", e);
          result.direcciones = [];
        }
      }
      if (!result.direcciones) result.direcciones = [];

      console.log("✅ Perfil procesado final:", result);
      return result;
    } catch (error: unknown) {
      console.error("❌ Error obteniendo perfil:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Error desconocido obteniendo perfil";
      throw new Error(errorMessage);
    }
  }

  /**
   * Obtiene las tarjetas de pago encriptadas del usuario
   * Llama al endpoint /api/payments/cards/:userId que devuelve datos encriptados
   * IMPORTANTE: Los datos vienen encriptados y deben ser desencriptados con encryptionService
   */
  public async getUserPaymentMethodsEncrypted(
    userId?: string
  ): Promise<EncryptedCard[]> {
    try {
      const id = userId || this.getUserId();
      if (!id) {
        throw new Error("No se encontró el ID del usuario");
      }

      console.log("📤 Solicitando tarjetas encriptadas para usuario:", id);

      const result = await apiGet<EncryptedCard[]>(`/api/payments/cards/${id}`);
      console.log("✅ Tarjetas encriptadas obtenidas:", result);
      return result;
    } catch (error: unknown) {
      console.error("❌ Error obteniendo tarjetas encriptadas:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Error desconocido obteniendo tarjetas";
      throw new Error(errorMessage);
    }
  }

  /**
   * Actualiza información del perfil del usuario
   * Endpoint: PATCH /auth/profile/:id
   * Solo se actualizan los campos enviados (actualización parcial)
   */
  public async updateProfile(
    userId: string,
    data: UpdateProfileRequest
  ): Promise<UpdateProfileResponse> {
    try {
      console.log("📤 Actualizando perfil para usuario:", userId, data);

      const result = await apiPatch<UpdateProfileResponse>(
        `/api/auth/profile/${userId}`,
        data
      );
      console.log("✅ Perfil actualizado exitosamente:", result);
      return result;
    } catch (error: unknown) {
      console.error("❌ Error actualizando perfil:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Error desconocido actualizando perfil";
      throw new Error(errorMessage);
    }
  }

  /**
   * Obtiene solo las direcciones del usuario
   * Usa el servicio de direcciones existente como fallback
   */
  public async getUserAddresses(userId?: string): Promise<AddressData[]> {
    try {
      const profile = await this.getUserProfile(userId);
      // Garantizar que devolvemos un array de AddressData
      if (typeof profile.direcciones === "string") {
        try {
          return JSON.parse(profile.direcciones) as AddressData[];
        } catch {
          return [];
        }
      }
      return profile.direcciones || [];
    } catch (error: unknown) {
      console.error("❌ Error obteniendo direcciones desde perfil:", error);
      // Fallback: retornar array vacío
      return [];
    }
  }

  /**
   * Obtiene solo los métodos de pago del usuario
   */
  public async getUserPaymentMethods(
    userId?: string
  ): Promise<PaymentCardData[]> {
    try {
      const profile = await this.getUserProfile(userId);
      // Garantizar que devolvemos un array de PaymentCardData
      if (typeof profile.tarjetas === "string") {
        try {
          return JSON.parse(profile.tarjetas) as PaymentCardData[];
        } catch {
          return [];
        }
      }
      return profile.tarjetas || [];
    } catch (error: unknown) {
      console.error("❌ Error obteniendo métodos de pago desde perfil:", error);
      // Fallback: retornar array vacío
      return [];
    }
  }

  /**
   * Tokeniza una nueva tarjeta de crédito/débito
   * Llama al endpoint /api/payments/cards/tokenize
   */
  public async tokenizeCard(data: {
    userId: string;
    cardNumber: string;
    cardHolder: string;
    expiryMonth: string;
    expiryYear: string;
    cvv: string;
  }): Promise<{ success: boolean; message: string }> {
    try {
      console.log("📤 Tokenizando tarjeta para usuario:", data.userId);

      // Mapear cardHolder a cardHolderName para el backend
      const payload = {
        userId: data.userId,
        cardNumber: data.cardNumber,
        cardHolderName: data.cardHolder,
        cardExpMonth: data.expiryMonth,
        cardExpYear: data.expiryYear,
        cardCvc: data.cvv,
      };

      const result = await apiPost<{ success: boolean; message: string }>(
        "/api/payments/cards/tokenize",
        payload
      );
      console.log("✅ Tarjeta tokenizada exitosamente:", result);
      return result;
    } catch (error: unknown) {
      console.error("❌ Error tokenizando tarjeta:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Error desconocido tokenizando tarjeta";
      throw new Error(errorMessage);
    }
  }

  /**
   * NEW: Tokeniza una tarjeta con AMBOS procesadores (ePayco + Mercado Pago)
   * Llama al endpoint /api/payments/cards/tokenize-dual
   *
   * @param data Card data including Mercado Pago frontend token
   * @returns Tokenization result with dual processor information
   *
   * @important This method does NOT break existing tokenization
   * The original tokenizeCard() method continues to work normally
   */
  public async tokenizeCardDual(data: {
    userId: string;
    cardNumber: string;
    cardHolder: string;
    expiryMonth: string;
    expiryYear: string;
    cvv: string;
    customerEmail: string;
    customerDocNumber: string;
    customerPhone?: string;
    mercadoPagoFrontendToken?: string | null;
  }): Promise<any> {
    try {
      console.log("📤 [DUAL] Tokenizando tarjeta con ambos procesadores para usuario:", data.userId);

      // Mapear a formato del backend
      const payload = {
        userId: data.userId,
        cardNumber: data.cardNumber,
        cardHolderName: data.cardHolder,
        cardExpMonth: data.expiryMonth,
        cardExpYear: data.expiryYear,
        cardCvc: data.cvv,
        customerEmail: data.customerEmail,
        customerDocNumber: data.customerDocNumber,
        customerPhone: data.customerPhone,
        mercadoPagoFrontendToken: data.mercadoPagoFrontendToken,
      };

      const result = await apiPost<any>(
        "/api/payments/cards/tokenize-dual",
        payload
      );

      console.log("✅ [DUAL] Tokenización dual completada:", {
        success: result.success,
        epayco: result.dualTokenization?.epayco,
        mercadopago: result.dualTokenization?.mercadopago,
        partial: result.partialSuccess,
      });

      return result;
    } catch (error: unknown) {
      console.error("❌ [DUAL] Error en tokenización dual:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Error desconocido en tokenización dual";
      throw new Error(errorMessage);
    }
  }
}

// Exportar instancia única
export const profileService = ProfileService.getInstance();
