/**
 * @module notifications.service
 * @description Servicio para interactuar con el API de notificaciones del backend
 */

import { apiGet, apiPatch } from "@/lib/api-client";

/**
 * Interface para la configuración de notificaciones del usuario
 */
export interface NotificationSettings {
  id: number;
  usuario_id: string;
  email: boolean;
  whatsapp: boolean;
  in_web: boolean;
}

/**
 * Request para actualizar configuración de notificaciones
 */
export interface UpdateNotificationSettingsRequest {
  email?: boolean;
  whatsapp?: boolean;
  in_web?: boolean;
}

/**
 * Clase de servicio para notificaciones
 */
export class NotificationsService {
  private static instance: NotificationsService;

  private constructor() {}

  /**
   * Obtiene la instancia única del servicio
   */
  public static getInstance(): NotificationsService {
    if (!NotificationsService.instance) {
      NotificationsService.instance = new NotificationsService();
    }
    return NotificationsService.instance;
  }

  /**
   * Obtiene la configuración de notificaciones del usuario
   * Endpoint: GET /users/:userId/notifications
   */
  public async getNotificationSettings(
    userId: string
  ): Promise<NotificationSettings> {
    try {
      console.log(
        "📤 Obteniendo configuración de notificaciones para:",
        userId
      );

      const result = await apiGet<NotificationSettings>(
        `/api/users/${userId}/notifications`
      );

      console.log("✅ Configuración de notificaciones obtenida:", result);
      return result;
    } catch (error: unknown) {
      console.error(
        "❌ Error obteniendo configuración de notificaciones:",
        error
      );
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Error desconocido obteniendo configuración de notificaciones";
      throw new Error(errorMessage);
    }
  }

  /**
   * Actualiza la configuración de notificaciones del usuario
   * Endpoint: PATCH /users/:userId/notifications
   */
  public async updateNotificationSettings(
    userId: string,
    settings: UpdateNotificationSettingsRequest
  ): Promise<NotificationSettings> {
    try {
      console.log("📤 Actualizando configuración de notificaciones:", settings);

      const result = await apiPatch<NotificationSettings>(
        `/api/users/${userId}/notifications`,
        settings
      );

      console.log("✅ Configuración de notificaciones actualizada:", result);
      return result;
    } catch (error: unknown) {
      console.error(
        "❌ Error actualizando configuración de notificaciones:",
        error
      );
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Error desconocido actualizando configuración de notificaciones";
      throw new Error(errorMessage);
    }
  }
}

// Exportar instancia única
export const notificationsService = NotificationsService.getInstance();
