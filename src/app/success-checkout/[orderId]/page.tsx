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
import { useAnalytics } from "@/lib/analytics";

// API Base URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

interface OrderData {
  orden_id: string;
  fecha_creacion: string;
  usuario_id: string;
  envios?: Array<{
    numero_guia: string;
    tiempo_entrega_estimado: string;
  }>;
  order_items?: Array<{
    sku: string;
    quantity: number;
    product_name?: string;
  }>;
}

interface UserData {
  id: string;
  nombre: string;
  apellido: string;
  telefono: string;
}

interface CartItem {
  quantity?: number;
  name?: string;
  sku?: string;
}

export default function SuccessCheckoutPage({
  params,
}: Readonly<{ params: Promise<{ orderId: string }> }>) {
  const pathParams = use(params);
  const router = useRouter();
  const [open, setOpen] = useState(true);
  const { clearCart } = useCart();
  const { trackPurchase } = useAnalytics();
  const whatsappSentRef = useRef(false);
  const analyticsSentRef = useRef(false);

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
      console.log("🚀 [WhatsApp] Iniciando proceso de envío de mensaje...");
      
      if (whatsappSentRef.current) {
        console.log("⚠️ [WhatsApp] Ya se intentó enviar el mensaje anteriormente, omitiendo...");
        return; // Evitar envíos duplicados
      }
      whatsappSentRef.current = true; // Marcar como enviado inmediatamente

      try {
        console.log("📦 [WhatsApp] Obteniendo datos de la orden...", pathParams.orderId);
        
        // Obtener datos de la orden
        const orderResponse = await apiClient.get<OrderData>(
          `/api/orders/shipping-info/${pathParams.orderId}`
        );

        if (!orderResponse.success || !orderResponse.data) {
          console.error("❌ [WhatsApp] Error al obtener datos de la orden:", orderResponse);
          return;
        }

        console.log("✅ [WhatsApp] Datos de la orden obtenidos exitosamente");
        const orderData = orderResponse.data;

        // Obtener datos del usuario desde localStorage (misma clave que en checkout)
        console.log("👤 [WhatsApp] Obteniendo datos del usuario desde localStorage...");
        const userData = localStorage.getItem("imagiq_user");
        let userInfo: UserData | null = null;

        if (userData) {
          try {
            userInfo = JSON.parse(userData);
            console.log("✅ [WhatsApp] Usuario obtenido del localStorage:", {
              id: userInfo?.id,
              nombre: userInfo?.nombre,
              tieneTelefono: !!userInfo?.telefono
            });
          } catch (e) {
            console.error("❌ [WhatsApp] Error al parsear datos del usuario:", e);
          }
        } else {
          console.warn("⚠️ [WhatsApp] No se encontró 'imagiq_user' en localStorage");
        }

        if (!userInfo || !userInfo.telefono) {
          console.error("❌ [WhatsApp] No hay información de usuario o teléfono disponible", {
            tieneUserInfo: !!userInfo,
            tieneTelefono: !!userInfo?.telefono,
            telefono: userInfo?.telefono
          });
          return;
        }

        console.log("✅ [WhatsApp] Información de usuario válida");

        // Limpiar y formatear el teléfono (quitar espacios, guiones, paréntesis, etc.)
        let telefono = userInfo.telefono.toString().replace(/[\s+\-()]/g, "");
        console.log("📞 [WhatsApp] Teléfono original:", userInfo.telefono, "→ Limpiado:", telefono);
        
        // Asegurar que el teléfono tenga el código de país 57
        if (!telefono.startsWith("57")) {
          telefono = "57" + telefono;
          console.log("📞 [WhatsApp] Agregado código de país 57:", telefono);
        }
        
        console.log("✅ [WhatsApp] Teléfono formateado:", telefono);

        // Obtener datos del envío
        const envioData =
          orderData.envios && orderData.envios.length > 0
            ? orderData.envios[0]
            : null;

        // Obtener número de guía
        const numeroGuia =
          envioData?.numero_guia || orderData.orden_id.substring(0, 8);

        // Calcular fechas de entrega estimada (formato corto para WhatsApp)
        let fechaEntrega = "Próximamente";

        if (envioData?.tiempo_entrega_estimado) {
          const fechaCreacion = new Date(orderData.fecha_creacion);
          const dias = Number.parseInt(envioData.tiempo_entrega_estimado);

          // Fecha inicial
          fechaCreacion.setDate(fechaCreacion.getDate() + dias);
          const diaInicio = fechaCreacion.getDate();
          const mesInicio = fechaCreacion.toLocaleDateString("es-ES", {
            month: "short",
          });

          // Fecha final (2 días después)
          fechaCreacion.setDate(fechaCreacion.getDate() + 2);
          const diaFin = fechaCreacion.getDate();
          const mesFin = fechaCreacion.toLocaleDateString("es-ES", {
            month: "short",
          });

          // Formato corto: "29-31 de oct" o "29 oct - 1 nov"
          if (mesInicio === mesFin) {
            fechaEntrega = `${diaInicio}-${diaFin} de ${mesInicio}`;
          } else {
            fechaEntrega = `${diaInicio} ${mesInicio} - ${diaFin} ${mesFin}`;
          }
        }

        // Obtener items del carrito desde localStorage
        const cartItems = localStorage.getItem("cart-items");
        let productosDesc = "tus productos";
        let cantidadTotal = 0;

        if (cartItems) {
          try {
            const items = JSON.parse(cartItems);
            if (Array.isArray(items) && items.length > 0) {
              // Calcular cantidad total de productos
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

              // WhatsApp tiene límite de 30 caracteres para este campo
              if (descripcion.length <= 30) {
                productosDesc = descripcion;
              } else {
                // Si excede, usar "tus X productos" o "tu producto"
                productosDesc =
                  cantidadTotal === 1
                    ? "tu producto"
                    : `tus ${cantidadTotal} productos`;
              }
            }
          } catch (e) {
            console.error("Error al parsear cart-items:", e);
          }
        }

        // Capitalizar la primera letra del nombre
        const nombreCapitalizado =
          userInfo.nombre.charAt(0).toUpperCase() +
          userInfo.nombre.slice(1).toLowerCase();

        console.log("✂️ [WhatsApp] Validando y truncando datos antes de enviar...");

        // Validar y truncar productos si excede 30 caracteres
        let productosFinal = productosDesc;
        if (productosDesc.length > 30) {
          productosFinal = "tus productos";
          console.log("⚠️ [WhatsApp] Productos truncados (excedían 30 chars):", {
            original: productosDesc,
            length: productosDesc.length,
            truncado: productosFinal
          });
        }

        // Validar y truncar fechaEntrega si excede 30 caracteres
        let fechaEntregaFinal = fechaEntrega;
        if (fechaEntrega.length > 30) {
          fechaEntregaFinal = "Próximamente";
          console.log("⚠️ [WhatsApp] Fecha de entrega truncada (excedía 30 chars):", {
            original: fechaEntrega,
            length: fechaEntrega.length,
            truncado: fechaEntregaFinal
          });
        }

        console.log("✅ [WhatsApp] Datos validados y preparados:", {
          nombre: nombreCapitalizado,
          productos: productosFinal,
          productosLength: productosFinal.length,
          fechaEntrega: fechaEntregaFinal,
          fechaEntregaLength: fechaEntregaFinal.length,
          numeroGuia: numeroGuia,
          ordenId: pathParams.orderId
        });

        // Preparar payload para el endpoint /api/messaging/pedido-confirmado
        // El backend maneja el template_id internamente, no necesitamos enviarlo
        const payload = {
          to: telefono,
          nombre: nombreCapitalizado,
          ordenId: pathParams.orderId,
          numeroGuia: numeroGuia,
          productos: productosFinal,
          fechaEntrega: fechaEntregaFinal,
        };

        console.log("📦 [WhatsApp] Payload preparado:", payload);

        // Enviar mensaje de WhatsApp al backend
        const apiUrl = `${API_BASE_URL}/api/messaging/pedido-confirmado`;
        console.log("📤 [WhatsApp] Enviando request al backend...", {
          method: "POST",
          url: apiUrl,
          payload: payload
        });

        const whatsappResponse = await fetch(apiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        console.log("📥 [WhatsApp] Respuesta recibida del backend:", {
          status: whatsappResponse.status,
          statusText: whatsappResponse.statusText,
          ok: whatsappResponse.ok
        });

        // Verificar respuesta del backend
        if (!whatsappResponse.ok) {
          const errorData = await whatsappResponse.json().catch((parseError) => {
            console.error("❌ [WhatsApp] Error al parsear respuesta de error:", parseError);
            return {};
          });
          
          console.error("❌ [WhatsApp] Error al enviar mensaje de WhatsApp:", {
            status: whatsappResponse.status,
            statusText: whatsappResponse.statusText,
            error: errorData.error || errorData,
            details: errorData.details,
            fullResponse: errorData
          });
          
          // Resetear el flag para permitir reintento en caso de error
          whatsappSentRef.current = false;
          console.log("🔄 [WhatsApp] Flag reseteado, se puede reintentar");
          return;
        }

        const whatsappData = await whatsappResponse.json().catch((parseError) => {
          console.error("❌ [WhatsApp] Error al parsear respuesta exitosa:", parseError);
          return { success: false };
        });

        console.log("📄 [WhatsApp] Datos de respuesta parseados:", whatsappData);

        // Verificar respuesta exitosa según la especificación del endpoint
        if (whatsappData.success) {
          console.log("✅ [WhatsApp] Mensaje de WhatsApp enviado exitosamente", {
            messageId: whatsappData.messageId,
            message: whatsappData.message,
            fullResponse: whatsappData
          });
        } else {
          console.error("❌ [WhatsApp] Error en respuesta de WhatsApp (success: false):", {
            success: whatsappData.success,
            error: whatsappData.error,
            details: whatsappData.details,
            fullResponse: whatsappData
          });
          whatsappSentRef.current = false;
          console.log("🔄 [WhatsApp] Flag reseteado debido a success: false");
        }
      } catch (error) {
        console.error("❌ [WhatsApp] Error al procesar envío de WhatsApp (catch):", error);
        console.error("❌ [WhatsApp] Stack trace:", error instanceof Error ? error.stack : "No stack available");
        whatsappSentRef.current = false;
        console.log("🔄 [WhatsApp] Flag reseteado debido a excepción");
      }
    };

    console.log("🎬 [WhatsApp] useEffect ejecutado, llamando sendWhatsAppMessage...");
    sendWhatsAppMessage();
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
