/**
 * @module notificationConfig
 * @description Configuration for notification settings
 */

import {
  Bell,
  Package,
  Heart,
  Megaphone,
  Star,
  Settings,
  Shield,
  Clock,
} from "lucide-react";
import { NotificationSetting } from "./NotificationRow";

export const createNotificationSettings = (
  emailEnabled: boolean = true,
  pushEnabled: boolean = true,
  marketingEnabled: boolean = false
): NotificationSetting[] => [
  // General Notifications
  {
    id: "order-updates",
    title: "Actualizaciones de Pedidos",
    description: "Estado de tus pedidos, confirmaciones y entregas",
    icon: Package,
    category: "general",
    channels: {
      email: emailEnabled,
      push: pushEnabled,
    },
  },
  {
    id: "order-delivered",
    title: "Pedido Entregado",
    description: "Cuando tu pedido haya sido entregado exitosamente",
    icon: Bell,
    category: "general",
    channels: {
      email: emailEnabled,
      push: pushEnabled,
    },
  },
  {
    id: "wishlist-updates",
    title: "Lista de Deseos",
    description: "Productos en oferta o cambios de precio en tu lista",
    icon: Heart,
    category: "general",
    channels: {
      email: false,
      push: true,
    },
  },

  // Marketing Notifications
  {
    id: "promotions",
    title: "Promociones y Ofertas",
    description: "Descuentos especiales, cupones y ofertas exclusivas",
    icon: Megaphone,
    category: "marketing",
    channels: {
      email: marketingEnabled,
      push: marketingEnabled,
    },
  },
  {
    id: "new-products",
    title: "Nuevos Productos",
    description: "Productos nuevos en tus categorías favoritas",
    icon: Star,
    category: "marketing",
    channels: {
      email: marketingEnabled,
      push: false,
    },
  },
  {
    id: "recommendations",
    title: "Recomendaciones",
    description: "Productos sugeridos basados en tus compras",
    icon: Settings,
    category: "marketing",
    channels: {
      email: false,
      push: marketingEnabled,
    },
  },

  // Security Notifications
  {
    id: "account-security",
    title: "Seguridad de la Cuenta",
    description: "Cambios de contraseña y accesos desde nuevos dispositivos",
    icon: Shield,
    category: "security",
    channels: {
      email: true,
      push: true,
    },
  },
  {
    id: "payment-alerts",
    title: "Alertas de Pago",
    description: "Problemas con métodos de pago y transacciones",
    icon: Clock,
    category: "security",
    channels: {
      email: true,
      push: true,
    },
  },
];
