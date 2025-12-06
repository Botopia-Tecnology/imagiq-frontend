/**
 * @module orders.service
 * @description Servicio para interactuar con el API de órdenes del backend
 */

import { apiPost, apiDelete } from "@/lib/api-client";

/**
 * Interface para un item de orden
 */
export interface OrderItem {
  id: string;
  sku: string;
  nombre: string;
  cantidad: number;
  precio_unitario: number;
  impuestos: number;
}

/**
 * Estados posibles de una orden
 */
export type OrderStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "CANCELLED"
  | "ABANDONED"
  | "INTERNAL_ERROR";

/**
 * Interface para una orden
 */
export interface Order {
  id: string;
  serial_id: string;
  total_amount: number;
  shipping_amount: number;
  total_taxes_amount: number;
  currency: string;
  estado: OrderStatus;
  medio_de_pago: string;
  fecha_creacion: string;
  items: OrderItem[];
}

/**
 * Request para obtener órdenes del usuario
 */
interface GetOrdersRequest {
  email: string;
}

/**
 * Respuesta de cancelación de orden
 */
interface CancelOrderResponse {
  message: string;
}

/**
 * Clase de servicio para órdenes
 */
export class OrdersService {
  private static instance: OrdersService;

  private constructor() {}

  /**
   * Obtiene la instancia única del servicio
   */
  public static getInstance(): OrdersService {
    if (!OrdersService.instance) {
      OrdersService.instance = new OrdersService();
    }
    return OrdersService.instance;
  }

  /**
   * Obtiene todas las órdenes de un usuario por su email
   * Endpoint: POST /orders
   */
  public async getUserOrders(email: string): Promise<Order[]> {
    try {
      console.log("📤 Obteniendo órdenes para:", email);

      const payload: GetOrdersRequest = { email };
      const result = await apiPost<Order[]>("/api/orders", payload);

      console.log(
        "✅ Órdenes obtenidas exitosamente:",
        result.length,
        "órdenes"
      );
      return result;
    } catch (error: unknown) {
      console.error("❌ Error obteniendo órdenes:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Error desconocido obteniendo órdenes";
      throw new Error(errorMessage);
    }
  }

  /**
   * Cancela una orden existente
   * Endpoint: DELETE /orders/cancel/:orderId
   * Solo funciona para órdenes con estado PENDING o APPROVED
   */
  public async cancelOrder(orderId: string): Promise<CancelOrderResponse> {
    try {
      console.log("📤 Cancelando orden:", orderId);

      const result = await apiDelete<CancelOrderResponse>(
        `/api/orders/cancel/${orderId}`
      );

      console.log("✅ Orden cancelada exitosamente:", result.message);
      return result;
    } catch (error: unknown) {
      console.error("❌ Error cancelando orden:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Error desconocido cancelando orden";
      throw new Error(errorMessage);
    }
  }
}

// Exportar instancia única
export const ordersService = OrdersService.getInstance();

/**
 * Verifica si una orden puede ser cancelada
 * Solo órdenes con estado PENDING o APPROVED pueden cancelarse
 */
export function canCancelOrder(status: OrderStatus): boolean {
  return status === "PENDING" || status === "APPROVED";
}

/**
 * Helper para obtener el texto del estado en español
 */
export function getOrderStatusText(status: OrderStatus): string {
  const statusMap: Record<OrderStatus, string> = {
    PENDING: "Pendiente",
    APPROVED: "Aprobado",
    REJECTED: "Rechazado",
    CANCELLED: "Cancelado",
    ABANDONED: "Abandonado",
    INTERNAL_ERROR: "Error",
  };
  return statusMap[status] || status;
}

/**
 * Helper para obtener el color del estado
 */
export function getOrderStatusColor(status: OrderStatus): string {
  const colorMap: Record<OrderStatus, string> = {
    PENDING: "bg-yellow-100 text-yellow-800",
    APPROVED: "bg-green-100 text-green-800",
    REJECTED: "bg-red-100 text-red-800",
    CANCELLED: "bg-gray-100 text-gray-800",
    ABANDONED: "bg-orange-100 text-orange-800",
    INTERNAL_ERROR: "bg-red-100 text-red-800",
  };
  return colorMap[status] || "bg-gray-100 text-gray-800";
}
