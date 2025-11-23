"use client";

/**
 * Página de confirmación de compra exitosa
 * Muestra overlay de éxito con animación y mensaje de confirmación
 * Siempre redirige al usuario a la página principal al hacer clic en "Continuar"
 *
 * Características:
 * - Animación premium con video de confirmación
 * - Mensaje claro y directo
 * - Limpieza automática del carrito
 * - Redirección a la página principal para continuar comprando
 * - Diseño responsive y accesible
 * - Envío automático de mensaje de WhatsApp con confirmación
 */

import { useRouter } from "next/navigation";
import { use, useEffect, useRef, useState } from "react";
import CheckoutSuccessOverlay from "../../carrito/CheckoutSuccessOverlay";
import { useCart } from "@/hooks/useCart";
import { apiClient } from "@/lib/api";
import { useAnalyticsWithUser } from "@/lib/analytics";
import { apiPost } from "@/lib/api-client";
import { addBusinessDays, getNextBusinessDay } from "@/lib/dateUtils";

interface OrderItem {
  sku: string;
  quantity?: number;
  cantidad?: number;
  product_name?: string;
  nombre?: string;
  desdetallada?: string;
  unit_price?: string | number;
  precio?: string | number;
  image_preview_url?: string;
  picture_url?: string;
}

interface TiendaData {
  codigo?: string;
  descripcion?: string;
  nombre?: string;
  direccion?: string;
  ciudad?: string;
  latitud?: string;
  longitud?: string;
}

interface DireccionDestino {
  id?: string;
  linea_uno?: string;
  direccion_formateada?: string;
  ciudad?: string;
}

interface OrderData {
  id?: string;
  orden_id: string;
  fecha_creacion: string;
  usuario_id: string;
  metodo_envio?: number; // 1=Coordinadora, 2=Pickup, 3=Imagiq
  total_amount?: number;
  envios?: Array<{
    numero_guia: string;
    tiempo_entrega_estimado: string;
  }>;
  order_items?: OrderItem[];
  // Para Imagiq
  envio?: {
    numero_guia: string;
    tiempo_entrega_estimado: string;
    direccion_destino?: DireccionDestino;
    tienda_origen?: TiendaData;
  };
  items?: OrderItem[];
  // Para Pickup
  tienda?: TiendaData;
  tienda_origen?: TiendaData;
  token?: string;
  direccion_entrega?: string;
  shippingAddress?: string;
}

interface UserData {
  id: string;
  nombre: string;
  apellido: string;
  telefono: string;
  email?: string;
}


export default function SuccessCheckoutPage({
  params,
}: Readonly<{ params: Promise<{ orderId: string }> }>) {
  const pathParams = use(params);
  const router = useRouter();
  const [open, setOpen] = useState(true);
  const { clearCart } = useCart();
  const { trackPurchase } = useAnalyticsWithUser();
  const whatsappSentRef = useRef(false);
  const analyticsSentRef = useRef(false);
  const emailSentRef = useRef(false);

  // Enviar evento de purchase a analytics
  useEffect(() => {
    const sendPurchaseEvent = async () => {
      if (analyticsSentRef.current) return;
      analyticsSentRef.current = true;

      try {
        const orderResponse = await apiClient.get<OrderData>(
          `/api/orders/shipping-info/${pathParams.orderId}`
        );

        if (orderResponse.success && orderResponse.data) {
          const orderData = orderResponse.data;
          const items = orderData.order_items || [];

          // Calcular el valor total de la orden
          const totalValue = items.reduce(
            (sum, item) => sum + (item.quantity || 0) * 1000000,
            0
          ); // Estimado

          // Enviar evento de purchase
          trackPurchase(
            pathParams.orderId,
            items.map((item) => ({
              item_id: item.sku || "unknown",
              item_name: item.product_name || "Producto",
              item_brand: "Samsung",
              price: 1000000, // Precio estimado, idealmente debería venir de la orden
              quantity: item.quantity || 1,
            })),
            totalValue
          );
        }
      } catch (error) {
        console.error("[Analytics] Error sending purchase event:", error);
      }
    };

    sendPurchaseEvent();
  }, [pathParams.orderId, trackPurchase]);

  // Enviar mensaje de WhatsApp cuando se carga la página
  useEffect(() => {
    const sendWhatsAppMessage = async () => {
      if (whatsappSentRef.current) {
        return; // Evitar envíos duplicados
      }
      whatsappSentRef.current = true; // Marcar como enviado inmediatamente

      try {
        // Primero obtener el método de envío
        let metodoEnvio: number | undefined;
        try {
          const deliveryMethodRes = await apiClient.get<{ metodo_envio: number }>(
            `/api/orders/${pathParams.orderId}/delivery-method`
          );
          if (deliveryMethodRes.success && deliveryMethodRes.data) {
            metodoEnvio = deliveryMethodRes.data.metodo_envio;
          }
        } catch (error) {
          console.error("❌ [WhatsApp] Error al obtener método de envío:", error);
          return;
        }

        // Solo enviar WhatsApp si es Coordinadora (1) o Imagiq (3)
        if (metodoEnvio !== 1 && metodoEnvio !== 3) {
          console.log("ℹ️ [WhatsApp] WhatsApp no se envía para este método de envío:", {
            metodo_envio: metodoEnvio,
            ordenId: pathParams.orderId,
            razon: metodoEnvio === 2 ? "Pickup en tienda" : "Método desconocido"
          });
          return;
        }

        // Obtener datos de la orden según el método de envío
        let orderEndpoint = `/api/orders/shipping-info/${pathParams.orderId}`;
        if (metodoEnvio === 3) {
          orderEndpoint = `/api/orders/${pathParams.orderId}/imagiq`;
        }

        const orderResponse = await apiClient.get<OrderData>(orderEndpoint);

        if (!orderResponse.success || !orderResponse.data) {
          console.error("❌ [WhatsApp] Error al obtener datos de la orden:", orderResponse);
          return;
        }

        const orderData = orderResponse.data;

        // Obtener datos del usuario desde localStorage (misma clave que en checkout)
        const userData = localStorage.getItem("imagiq_user");
        let userInfo: UserData | null = null;

        if (userData) {
          try {
            userInfo = JSON.parse(userData);
          } catch (e) {
            console.error("❌ [WhatsApp] Error al parsear datos del usuario:", e);
          }
        }

        if (!userInfo || !userInfo.telefono) {
          console.error("❌ [WhatsApp] No hay información de usuario o teléfono disponible");
          return;
        }

        // Limpiar y formatear el teléfono (quitar espacios, guiones, paréntesis, etc.)
        let telefono = userInfo.telefono.toString().replace(/[\s+\-()]/g, "");

        // Asegurar que el teléfono tenga el código de país 57
        if (!telefono.startsWith("57")) {
          telefono = "57" + telefono;
        }

        // Obtener datos del envío según el método
        let numeroGuia: string;
        let tiempoEntregaEstimado: string | undefined;

        if (metodoEnvio === 3) {
          // Imagiq: datos vienen en orderData.envio
          numeroGuia = orderData.envio?.numero_guia || orderData.orden_id.substring(0, 8);
          tiempoEntregaEstimado = orderData.envio?.tiempo_entrega_estimado;
        } else {
          // Coordinadora: datos vienen en orderData.envios array
          const envioData =
            orderData.envios && orderData.envios.length > 0
              ? orderData.envios[0]
              : null;
          numeroGuia = envioData?.numero_guia || orderData.orden_id.substring(0, 8);
          tiempoEntregaEstimado = envioData?.tiempo_entrega_estimado;
        }

        // Calcular fechas de entrega estimada (formato corto para WhatsApp) - solo días hábiles
        let fechaEntrega = "Próximamente";

        if (tiempoEntregaEstimado) {
          const fechaCreacion = new Date(orderData.fecha_creacion);
          const dias = Number.parseInt(tiempoEntregaEstimado);

          // Calcular fecha inicial sumando días hábiles
          const fechaInicial = addBusinessDays(fechaCreacion, dias);
          const diaInicio = fechaInicial.getDate();
          const mesInicio = fechaInicial.toLocaleDateString("es-ES", {
            month: "short",
          });

          // Fecha final: un día hábil después de la inicial
          const fechaFinal = getNextBusinessDay(fechaInicial);
          const diaFin = fechaFinal.getDate();
          const mesFin = fechaFinal.toLocaleDateString("es-ES", {
            month: "short",
          });

          // Formato corto: "29-31 de oct" o "29 oct - 1 nov"
          if (mesInicio === mesFin) {
            fechaEntrega = `${diaInicio}-${diaFin} de ${mesInicio}`;
          } else {
            fechaEntrega = `${diaInicio} ${mesInicio} - ${diaFin} ${mesFin}`;
          }
        }

        // Obtener productos según el método
        let productosDesc = "tus productos";
        let cantidadTotal = 0;

        if (metodoEnvio === 3) {
          // Imagiq: productos vienen en orderData.items
          if (orderData.items && orderData.items.length > 0) {
            cantidadTotal = orderData.items.reduce(
              (total: number, item: { cantidad?: number }) => {
                return total + (item.cantidad || 1);
              },
              0
            );

            const descripcion = orderData.items
              .map((item: { cantidad?: number; desdetallada?: string; nombre?: string }) => {
                const quantity = item.cantidad || 1;
                const name = item.desdetallada || item.nombre || "producto";
                return `${quantity} ${name}`;
              })
              .join(", ");

            // WhatsApp tiene límite de 30 caracteres para este campo
            if (descripcion.length <= 30) {
              productosDesc = descripcion;
            } else {
              productosDesc =
                cantidadTotal === 1
                  ? "tu producto"
                  : `tus ${cantidadTotal} productos`;
            }
          }
        } else {
          // Coordinadora: obtener items del carrito desde localStorage
          const cartItems = localStorage.getItem("cart-items");
          if (cartItems) {
            try {
              const items = JSON.parse(cartItems);
              if (Array.isArray(items) && items.length > 0) {
                cantidadTotal = items.reduce(
                  (total: number, item: { quantity?: number }) => {
                    return total + (item.quantity || 1);
                  },
                  0
                );

                const descripcion = items
                  .map(
                    (item: {
                      quantity?: number;
                      name?: string;
                      sku?: string;
                    }) => {
                      const quantity = item.quantity || 1;
                      const name = item.name || item.sku || "producto";
                      return `${quantity} ${name}`;
                    }
                  )
                  .join(", ");

                if (descripcion.length <= 30) {
                  productosDesc = descripcion;
                } else {
                  productosDesc =
                    cantidadTotal === 1
                      ? "tu producto"
                      : `tus ${cantidadTotal} productos`;
                }
              }
            } catch {
              // Error al parsear cart-items, continuar con valor por defecto
            }
          }
        }

        // Capitalizar la primera letra del nombre
        const nombreCapitalizado =
          userInfo.nombre.charAt(0).toUpperCase() +
          userInfo.nombre.slice(1).toLowerCase();

        // Validar y truncar productos si excede 30 caracteres
        let productosFinal = productosDesc;
        if (productosDesc.length > 30) {
          productosFinal = "tus productos";
        }

        // Validar y truncar fechaEntrega si excede 30 caracteres
        let fechaEntregaFinal = fechaEntrega;
        if (fechaEntrega.length > 30) {
          fechaEntregaFinal = "Próximamente";
        }

        // Preparar payload para el endpoint /api/messaging/pedido-confirmado
        // El backend maneja el template_id internamente, no necesitamos enviarlo
        // Usar el id de la orden (puede venir como "id" en Imagiq o "orden_id" en Coordinadora)
        const ordenId = orderData.id || orderData.orden_id || pathParams.orderId;
        
        const payload = {
          to: telefono,
          nombre: nombreCapitalizado,
          ordenId: ordenId,
          numeroGuia: numeroGuia,
          productos: productosFinal,
          fechaEntrega: fechaEntregaFinal,
        };

        // Enviar mensaje de WhatsApp al backend usando apiPost
        try {
          const whatsappData = await apiPost<{
            success: boolean;
            messageId?: string;
            message?: string;
            error?: string;
            details?: string;
          }>('/api/messaging/pedido-confirmado', payload);

          // Verificar respuesta exitosa según la especificación del endpoint
          if (!whatsappData.success) {
            console.error("❌ [WhatsApp] Error en respuesta de WhatsApp:", {
              success: whatsappData.success,
              error: whatsappData.error,
              details: whatsappData.details
            });
            whatsappSentRef.current = false;
          } else {
            console.log("✅ [WhatsApp] Mensaje enviado exitosamente:", {
              messageId: whatsappData.messageId,
              message: whatsappData.message,
              ordenId: pathParams.orderId,
              telefono: telefono
            });
          }
        } catch (whatsappError) {
          console.error("❌ [WhatsApp] Error al enviar mensaje de WhatsApp:", whatsappError);
          // Resetear el flag para permitir reintento en caso de error
          whatsappSentRef.current = false;
          return;
        }
      } catch (error) {
        console.error("❌ [WhatsApp] Error al procesar envío de WhatsApp:", error);
        whatsappSentRef.current = false;
      }
    };

    sendWhatsAppMessage();
  }, [pathParams.orderId]); // Solo depende del orderId, useRef previene duplicados

  // Enviar email de confirmación cuando se carga la página
  useEffect(() => {
    const sendEmailConfirmation = async () => {
      if (emailSentRef.current) {
        return; // Evitar envíos duplicados
      }
      emailSentRef.current = true; // Marcar como enviado inmediatamente

      try {
        // Primero obtener el método de envío
        let metodoEnvio: number | undefined;
        try {
          const deliveryMethodRes = await apiClient.get<{ metodo_envio: number }>(
            `/api/orders/${pathParams.orderId}/delivery-method`
          );
          if (deliveryMethodRes.success && deliveryMethodRes.data) {
            metodoEnvio = deliveryMethodRes.data.metodo_envio;
          }
        } catch (error) {
          console.error("❌ [Email] Error al obtener método de envío:", error);
          return;
        }

        // Obtener datos de la orden según el método de envío
        let orderEndpoint = `/api/orders/shipping-info/${pathParams.orderId}`;
        if (metodoEnvio === 3) {
          orderEndpoint = `/api/orders/${pathParams.orderId}/imagiq`;
        } else if (metodoEnvio === 2) {
          orderEndpoint = `/api/orders/${pathParams.orderId}/tiendas`;
        }

        const orderResponse = await apiClient.get<OrderData>(orderEndpoint);

        if (!orderResponse.success || !orderResponse.data) {
          console.error("❌ [Email] Error al obtener datos de la orden:", orderResponse);
          return;
        }

        const orderData = orderResponse.data;

        // Obtener datos del usuario desde localStorage
        const userData = localStorage.getItem("imagiq_user");
        let userInfo: UserData | null = null;

        if (userData) {
          try {
            userInfo = JSON.parse(userData);
          } catch (e) {
            console.error("❌ [Email] Error al parsear datos del usuario:", e);
          }
        }

        if (!userInfo || !userInfo.email) {
          console.error("❌ [Email] No hay información de usuario o email disponible");
          return;
        }

        // Determinar si es recogida en tienda (metodo_envio === 2)
        const isRecogidaEnTienda = metodoEnvio === 2;

        if (isRecogidaEnTienda) {
          // Recogida en tienda: usar endpoint store-pickup
          const ordenId = orderData.id || orderData.orden_id || pathParams.orderId;
          
          // Obtener datos de la tienda desde orderData (para pickup)
          const tiendaData = orderData.tienda || orderData.tienda_origen;
          if (!tiendaData) {
            console.error("❌ [Email] No hay datos de tienda para recogida");
            return;
          }

          // Obtener productos
          const productos = orderData.items || orderData.order_items || [];
          const productosMapeados = productos.map((p: OrderItem) => ({
            name: p.desdetallada || p.nombre || p.product_name || p.sku || "Producto",
            quantity: p.cantidad || p.quantity || 1,
            image: p.image_preview_url || p.picture_url || undefined
          }));

          // Obtener token de recogida
          const token = orderData.token || "";

          // Construir dirección de la tienda
          const storeAddress = tiendaData.direccion 
            ? `${tiendaData.direccion}, ${tiendaData.ciudad || ""}`.trim()
            : tiendaData.descripcion || "";

          const payload = {
            to: userInfo.email,
            orderId: ordenId,
            customerName: `${userInfo.nombre} ${userInfo.apellido || ""}`.trim(),
            products: productosMapeados,
            storeName: tiendaData.descripcion || tiendaData.nombre || "Tienda IMAGIQ",
            storeAddress: storeAddress,
            storeMapsUrl: `https://maps.google.com/?q=${encodeURIComponent(storeAddress)}`,
            pickupToken: token,
            orderDate: new Date(orderData.fecha_creacion).toLocaleDateString('es-ES', {
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            }),
            totalValue: orderData.total_amount || 0
          };

          try {
            const emailData = await apiPost<{
              success: boolean;
              messageId?: string;
              message?: string;
              error?: string;
              details?: string;
            }>('/api/messaging/email/store-pickup', payload);

            if (!emailData.success) {
              console.error("❌ [Email] Error en respuesta de email:", {
                success: emailData.success,
                error: emailData.error,
                details: emailData.details
              });
              emailSentRef.current = false;
            } else {
              console.log("✅ [Email] Email de recogida enviado exitosamente:", {
                messageId: emailData.messageId,
                message: emailData.message,
                ordenId: pathParams.orderId,
                email: userInfo.email
              });
            }
          } catch (emailError) {
            console.error("❌ [Email] Error al enviar email de recogida:", emailError);
            emailSentRef.current = false;
          }
        } else {
          // Envío a domicilio (Coordinadora o Imagiq): usar endpoint order-confirmation
          const ordenId = orderData.id || orderData.orden_id || pathParams.orderId;

          // Obtener productos según el método
          let productos: OrderItem[] = [];
          if (metodoEnvio === 3) {
            // Imagiq
            productos = orderData.items || [];
          } else {
            // Coordinadora - intentar desde orderData o localStorage
            productos = orderData.order_items || [];
            if (productos.length === 0) {
              const cartItems = localStorage.getItem("cart-items");
              if (cartItems) {
                try {
                  const parsedItems = JSON.parse(cartItems);
                  if (Array.isArray(parsedItems)) {
                    productos = parsedItems as OrderItem[];
                  }
                } catch {
                  // Error al parsear, continuar con array vacío
                }
              }
            }
          }

          const productosMapeados = productos.map((p: OrderItem) => ({
            name: p.desdetallada || p.nombre || p.product_name || p.sku || "Producto",
            quantity: p.cantidad || p.quantity || 1,
            price: Number.parseFloat(String(p.unit_price || p.precio || 0)),
            image: p.image_preview_url || p.picture_url || undefined
          }));

          // Obtener dirección de envío
          let shippingAddress = "";
          if (metodoEnvio === 3) {
            // Imagiq
            const direccionDestino = orderData.envio?.direccion_destino;
            if (direccionDestino) {
              shippingAddress = direccionDestino.direccion_formateada || 
                `${direccionDestino.linea_uno || ""}, ${direccionDestino.ciudad || ""}`.trim();
            }
          } else {
            // Coordinadora - puede venir en diferentes lugares
            shippingAddress = orderData.direccion_entrega || 
              orderData.shippingAddress || "";
          }

          // Calcular fecha de entrega estimada
          let estimatedDelivery = "1-3 días hábiles";
          if (metodoEnvio === 3 && orderData.envio?.tiempo_entrega_estimado) {
            const dias = Number.parseInt(orderData.envio.tiempo_entrega_estimado);
            estimatedDelivery = `${dias} día${dias > 1 ? 's' : ''} hábil${dias > 1 ? 'es' : ''}`;
          } else if (orderData.envios && orderData.envios.length > 0) {
            const dias = Number.parseInt(orderData.envios[0].tiempo_entrega_estimado);
            estimatedDelivery = `${dias} día${dias > 1 ? 's' : ''} hábil${dias > 1 ? 'es' : ''}`;
          }

          // Construir URL de tracking
          const trackingUrl = `https://staging.imagiq.com/tracking-service/${ordenId}`;

          const payload = {
            to: userInfo.email,
            orderId: ordenId,
            customerName: `${userInfo.nombre} ${userInfo.apellido || ""}`.trim(),
            products: productosMapeados,
            total: orderData.total_amount || 0,
            shippingAddress: shippingAddress,
            shippingMethod: metodoEnvio === 3 ? "Envío Imagiq" : "Envío Estándar",
            estimatedDelivery: estimatedDelivery,
            trackingUrl: trackingUrl,
            orderDate: new Date(orderData.fecha_creacion).toLocaleDateString('es-ES', {
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            })
          };

          try {
            const emailData = await apiPost<{
              success: boolean;
              messageId?: string;
              message?: string;
              error?: string;
              details?: string;
            }>('/api/messaging/email/order-confirmation', payload);

            if (!emailData.success) {
              console.error("❌ [Email] Error en respuesta de email:", {
                success: emailData.success,
                error: emailData.error,
                details: emailData.details
              });
              emailSentRef.current = false;
            } else {
              console.log("✅ [Email] Email de confirmación enviado exitosamente:", {
                messageId: emailData.messageId,
                message: emailData.message,
                ordenId: pathParams.orderId,
                email: userInfo.email
              });
            }
          } catch (emailError) {
            console.error("❌ [Email] Error al enviar email de confirmación:", emailError);
            emailSentRef.current = false;
          }
        }
      } catch (error) {
        console.error("❌ [Email] Error al procesar envío de email:", error);
        emailSentRef.current = false;
      }
    };

    sendEmailConfirmation();
  }, [pathParams.orderId]); // Solo depende del orderId, useRef previene duplicados

  // Coordenadas para el efecto de expansión de la animación (centrado)
  const [triggerPosition, setTriggerPosition] = useState(() => {
    if (typeof window !== "undefined") {
      return {
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
      };
    }
    return { x: 0, y: 0 };
  });

  /**
   * Maneja el cierre del overlay y la redirección al tracking service
   * - Cierra suavemente la animación
   * - Limpia el carrito de compras
   * - Redirecciona al usuario al tracking service
   */
  const handleClose = () => {
    setOpen(false);

    // Pequeño retraso antes de redirigir para permitir que la animación de cierre termine
    setTimeout(() => {
      // Limpiar carrito al finalizar exitosamente usando el hook centralizado
      clearCart();

      // También limpiar otros datos relacionados con la compra
      if (typeof window !== "undefined") {
        localStorage.removeItem("applied-discount");
        localStorage.removeItem("current-order");
      }

      // Redirigir al tracking service
      router.push(`/tracking-service/${pathParams.orderId}`);
    }, 300);
  };

  // Ajustar posición al cambiar el tamaño de la ventana
  useEffect(() => {
    const handleResize = () => {
      setTriggerPosition({
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#009047]">
      <CheckoutSuccessOverlay
        open={open}
        onClose={handleClose}
        message="¡Tu compra ha sido exitosa!"
        triggerPosition={triggerPosition}
      />
    </div>
  );
}
