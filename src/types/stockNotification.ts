/**
 * Tipos para el sistema de notificaciones de disponibilidad de stock
 */

export interface StockNotificationRequest {
  productId: string;
  productName: string;
  email: string;
  color?: string;
  storage?: string;
  userId?: string; // Si el usuario está autenticado
}

export interface StockNotificationResponse {
  success: boolean;
  message: string;
  notificationId?: string;
}

/**
 * ENDPOINT SUGERIDO PARA EL BACKEND:
 *
 * POST /api/notifications/stock
 *
 * Body:
 * {
 *   "productId": "string",      // ID del producto
 *   "productName": "string",    // Nombre del producto
 *   "email": "string",          // Email del usuario
 *   "color": "string",          // Color seleccionado (opcional)
 *   "storage": "string",        // Almacenamiento seleccionado (opcional)
 *   "userId": "string"          // ID del usuario si está autenticado (opcional)
 * }
 *
 * Response:
 * {
 *   "success": true,
 *   "message": "Notificación registrada exitosamente",
 *   "notificationId": "uuid"
 * }
 *
 * Casos de uso del backend:
 * 1. Almacenar la solicitud en la base de datos
 * 2. Validar que el email sea válido
 * 3. Si userId existe, asociar la notificación al usuario
 * 4. Evitar duplicados (mismo email + producto + variante)
 * 5. Cuando el producto tenga stock, enviar email y marcar notificación como enviada
 * 6. Incluir un enlace directo al producto en el email
 */

export interface StockNotificationDbSchema {
  id: string;
  productId: string;
  productName: string;
  email: string;
  color: string | null;
  storage: string | null;
  userId: string | null;
  notified: boolean;
  notifiedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}
