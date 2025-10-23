/**
 * @module profile.service
 * @description Servicio para interactuar con el API de perfil del backend
 */

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
 */
export interface UpdateProfileRequest {
  nombre?: string;
  apellido?: string;
  telefono?: string;
  fecha_nacimiento?: Date;
}

/**
 * Configuración base del servicio
 */
const BASE_CONFIG = {
  API_URL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001",
};

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
   * Obtiene el token de autorización del localStorage
   */
  private getAuthToken(): string {
    const token = globalThis.localStorage?.getItem?.("imagiq_token") ?? "";
    return token;
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
   * Headers base para las peticiones
   */
  private getHeaders(): HeadersInit {
    const token = this.getAuthToken();
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };
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

      const response = await fetch(
        `${BASE_CONFIG.API_URL}/api/auth/profile/${id}`,
        {
          method: "GET",
          headers: this.getHeaders(),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ Error response from API:", errorText);
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch {
          errorData = { message: errorText };
        }
        throw new Error(
          errorData.message ||
            `Error ${response.status}: ${response.statusText}`
        );
      }

      const result = await response.json();
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
   * Actualiza información del perfil del usuario
   */
  public async updateProfile(
    userId: string,
    data: UpdateProfileRequest
  ): Promise<ProfileResponse> {
    try {
      console.log("📤 Actualizando perfil para usuario:", userId, data);

      const response = await fetch(
        `${BASE_CONFIG.API_URL}/api/auth/profile/${userId}`,
        {
          method: "PUT",
          headers: this.getHeaders(),
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ Error response from API:", errorText);
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch {
          errorData = { message: errorText };
        }
        throw new Error(
          errorData.message ||
            `Error ${response.status}: ${response.statusText}`
        );
      }

      const result = await response.json();
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
}

// Exportar instancia única
export const profileService = ProfileService.getInstance();
