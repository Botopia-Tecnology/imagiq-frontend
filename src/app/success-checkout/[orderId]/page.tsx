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
import { use, useEffect, useState } from "react";
import CheckoutSuccessOverlay from "../../carrito/CheckoutSuccessOverlay";
import { useCart } from "@/hooks/useCart";
import { apiClient } from "@/lib/api";

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

export default function SuccessCheckoutPage({
  params,
}: Readonly<{ params: Promise<{ orderId: string }> }>) {
  const pathParams = use(params);
  const router = useRouter();
  const [open, setOpen] = useState(true);
  const { clearCart } = useCart();
  const [whatsappSent, setWhatsappSent] = useState(false);

  // Enviar mensaje de WhatsApp cuando se carga la página
  useEffect(() => {
    const sendWhatsAppMessage = async () => {
      if (whatsappSent) return; // Evitar envíos duplicados

      try {
        // Obtener datos de la orden
        const orderResponse = await apiClient.get<OrderData>(`/api/orders/shipping-info/${pathParams.orderId}`);

        if (!orderResponse.success || !orderResponse.data) {
          console.error("Error al obtener datos de la orden");
          return;
        }

        const orderData = orderResponse.data;

        // Obtener datos del usuario desde localStorage (misma clave que en checkout)
        const userData = localStorage.getItem("imagiq_user");
        let userInfo: UserData | null = null;

        if (userData) {
          userInfo = JSON.parse(userData);
        }

        if (!userInfo || !userInfo.telefono) {
          console.log("No hay información de usuario o teléfono disponible");
          return;
        }

        // Asegurar que el teléfono tenga el código de país 57
        let telefono = userInfo.telefono.toString();
        if (!telefono.startsWith("57")) {
          telefono = "57" + telefono;
        }

        // Obtener datos del envío
        const envioData = orderData.envios && orderData.envios.length > 0 ? orderData.envios[0] : null;

        // Obtener número de guía
        const numeroGuia = envioData?.numero_guia || orderData.orden_id.substring(0, 8);

        // Calcular fechas de entrega estimada (formato corto para WhatsApp)
        let fechaEntrega = "Próximamente";

        if (envioData?.tiempo_entrega_estimado) {
          const fechaCreacion = new Date(orderData.fecha_creacion);
          const dias = parseInt(envioData.tiempo_entrega_estimado);

          // Fecha inicial
          fechaCreacion.setDate(fechaCreacion.getDate() + dias);
          const diaInicio = fechaCreacion.getDate();
          const mesInicio = fechaCreacion.toLocaleDateString("es-ES", { month: "short" });

          // Fecha final (2 días después)
          fechaCreacion.setDate(fechaCreacion.getDate() + 2);
          const diaFin = fechaCreacion.getDate();
          const mesFin = fechaCreacion.toLocaleDateString("es-ES", { month: "short" });

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
              cantidadTotal = items.reduce((total: number, item: { quantity?: number }) => {
                return total + (item.quantity || 1);
              }, 0);

              const descripcion = items.map((item: { quantity?: number; name?: string; sku?: string }) => {
                const quantity = item.quantity || 1;
                const name = item.name || item.sku || "producto";
                return `${quantity} ${name}`;
              }).join(", ");

              // WhatsApp tiene límite de 30 caracteres para este campo
              if (descripcion.length <= 30) {
                productosDesc = descripcion;
              } else {
                // Si excede, usar "tus X productos" o "tu producto"
                productosDesc = cantidadTotal === 1 ? "tu producto" : `tus ${cantidadTotal} productos`;
              }
            }
          } catch (e) {
            console.error("Error al parsear cart-items:", e);
          }
        }

        // Capitalizar la primera letra del nombre
        const nombreCapitalizado = userInfo.nombre.charAt(0).toUpperCase() + userInfo.nombre.slice(1).toLowerCase();

        // Enviar mensaje de WhatsApp
        const whatsappResponse = await fetch("/api/whatsapp", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            to: telefono,
            nombre: nombreCapitalizado,
            ordenId: pathParams.orderId,
            numeroGuia: numeroGuia,
            productos: productosDesc,
            fechaEntrega: fechaEntrega
          })
        });

        const whatsappData = await whatsappResponse.json();

        if (whatsappData.success) {
          console.log("Mensaje de WhatsApp enviado exitosamente");
          setWhatsappSent(true);
        } else {
          console.error("Error al enviar mensaje de WhatsApp:", whatsappData);
        }
      } catch (error) {
        console.error("Error al procesar envío de WhatsApp:", error);
      }
    };

    sendWhatsAppMessage();
  }, [pathParams.orderId, whatsappSent])

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
    <div className="min-h-screen flex items-center justify-center bg-white">
      <CheckoutSuccessOverlay
        open={open}
        onClose={handleClose}
        message="¡Tu compra ha sido exitosa!"
        triggerPosition={triggerPosition}
      />
    </div>
  );
}
