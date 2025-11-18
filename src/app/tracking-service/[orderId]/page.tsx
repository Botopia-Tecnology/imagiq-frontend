"use client";

import { use, useEffect, useState } from "react";

// Importación de iconos
import { apiClient } from "@/lib/api";
import { OrderDetails, EnvioEvento, ProductoDetalle, TiendaInfo } from "../interfaces/types.d";
import {
  LoadingSpinner,
  ErrorView,
  ShippingOrderView,
} from "../components";
import { ImagiqShippingView } from "@/app/imagiq-tracking/components/ImagiqShippingView";
import { PickupShippingView } from "@/app/pickup-tracking/components/PickupShippingView";

export default function TrackingService({
  params,
}: Readonly<{ params: Promise<{ orderId: string }> }>) {
  const [orderNumber, setOrderNumber] = useState("...");
  const [estimatedInitDate, setEstimatedInitDate] = useState("0000-00-00");
  const [estimatedFinalDate, setEstimatedFinalDate] = useState("000-00-00");
  const [trackingSteps, setTrackingSteps] = useState<EnvioEvento[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pdfBase64, setPdfBase64] = useState<string>("");
  const [metodoEnvio, setMetodoEnvio] = useState<string>("");
  const [medioPago, setMedioPago] = useState<number | undefined>(undefined);
  const [horaRecogida, setHoraRecogida] = useState<string>("");
  const [token, setToken] = useState<string>("");
  const [fechaCreacion, setFechaCreacion] = useState<string>("");
  const [productos, setProductos] = useState<ProductoDetalle[]>([]);
  const [tiendaInfo, setTiendaInfo] = useState<TiendaInfo | undefined>(undefined);
  const [direccionEntrega, setDireccionEntrega] = useState<string>("");
  const [ciudadEntrega, setCiudadEntrega] = useState<string>("");
  const [nombreDestinatario, setNombreDestinatario] = useState<string>("");
  const [telefonoDestinatario, setTelefonoDestinatario] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const pathParams = use(params);

  // Helper functions
  const formatDate = (
    dateString: string,
    options?: Intl.DateTimeFormatOptions
  ) => {
    try {
      return new Date(dateString).toLocaleString("es-ES", {
        weekday: "long",
        month: "long",
        day: "numeric",
        ...options,
      });
    } catch {
      return dateString;
    }
  };

  // Determinar el tipo de envío basado en medio_pago o fallback a metodo_envio
  const getShippingType = (): "pickup" | "imagiq" | "coordinadora" => {
    // Si tenemos medio_pago, usarlo directamente
    if (medioPago !== undefined) {
      if (medioPago === 2) return "pickup";
      if (medioPago === 3) return "imagiq";
      if (medioPago === 1) return "coordinadora";
    }

    // Fallback: inferir del metodo_envio si no hay medio_pago
    if (metodoEnvio?.toLowerCase().includes("recoger") || metodoEnvio?.toLowerCase().includes("tienda")) {
      return "pickup";
    }
    if (metodoEnvio?.toLowerCase().includes("imagiq")) {
      return "imagiq";
    }

    // Por defecto, coordinadora
    return "coordinadora";
  };

  useEffect(() => {
    // Cargar información de la orden y método de envío en paralelo
    Promise.all([
      apiClient.get<OrderDetails>(`/api/orders/shipping-info/${pathParams.orderId}`),
      apiClient.get<{ metodo_envio: number }>(`/api/orders/${pathParams.orderId}/delivery-method`)
    ])
      .then(([orderRes, deliveryMethodRes]) => {
        const data = orderRes.data;
        const deliveryMethod = deliveryMethodRes.data;

        // Extract envio data from the envios array if it exists
        const envioData = data.envios && data.envios.length > 0 ? data.envios[0] : data;

        // Set common data
        setOrderNumber(envioData.numero_guia || data.orden_id || "...");

        // Handle shipping-specific data
        if (envioData.tiempo_entrega_estimado) {
          const fechaCreacion = new Date(data.fecha_creacion);
          const dias = Number.parseInt(envioData.tiempo_entrega_estimado);

          fechaCreacion.setDate(fechaCreacion.getDate() + dias);
          setEstimatedInitDate(formatDate(fechaCreacion.toISOString()));

          fechaCreacion.setDate(fechaCreacion.getDate() + dias + 2);
          setEstimatedFinalDate(formatDate(fechaCreacion.toISOString()));
        }

        // Set tracking data
        setTrackingSteps(envioData.eventos || []);
        setPdfBase64(envioData.pdf_base64 || "");

        // Set pickup-specific data (from OrderDetails or fallback to envioData)
        setMetodoEnvio(data.metodo_envio || "");
        // Usar metodo_envio del endpoint específico, con fallback a medio_pago del shipping-info
        setMedioPago(deliveryMethod.metodo_envio ?? data.medio_pago);
        setHoraRecogida(data.hora_recogida_autorizada || "");
        setToken(data.token || "");
        setFechaCreacion(data.fecha_creacion || "");

        // Set new enhanced data
        setProductos(data.productos || []);
        setTiendaInfo(data.tienda);
        setDireccionEntrega(data.direccion_entrega || "");
        setCiudadEntrega(data.ciudad_entrega || "");
        setNombreDestinatario(data.nombre_destinatario || "");
        setTelefonoDestinatario(data.telefono_destinatario || "");

        console.log("📊 Método de envío detectado:", {
          medio_pago_endpoint: deliveryMethod.metodo_envio,
          medio_pago_shipping_info: data.medio_pago,
          metodo_envio: data.metodo_envio,
        });

        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching order data:", error);
        setError(
          "No se pudo cargar la información del pedido. Por favor, intenta nuevamente."
        );
        setIsLoading(false);
      });
  }, [pathParams]);

  if (isLoading) {
    return <LoadingSpinner message="Cargando información del pedido..." />;
  }

  if (error) {
    return (
      <ErrorView message={error} onRetry={() => window.location.reload()} />
    );
  }

  // Determinar qué vista mostrar basándose en el tipo de envío
  const shippingType = getShippingType();
  const showPickup = shippingType === "pickup";
  const showImagiq = shippingType === "imagiq";
  const showCoordinadora = shippingType === "coordinadora";

  console.log("🎯 Vista a mostrar:", {
    shippingType,
    showPickup,
    showImagiq,
    showCoordinadora,
  });

  return (
    <div className="bg-white pt-4 md:pt-5">
      {/* Main Content */}
      <main className="w-full max-w-7xl mx-auto px-2 sm:px-4">
        {/* Debug: Shipping Method Display */}
        {process.env.NEXT_PUBLIC_SHOW_PRODUCT_CODES === "true" && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-xs font-semibold text-blue-800 mb-2">
              Debug: Método de envío
            </p>
            <div className="text-xs text-blue-700 space-y-1">
              <p>
                <strong>medio_pago:</strong> {medioPago !== undefined ? medioPago : "undefined"}
              </p>
              <p>
                <strong>metodo_envio:</strong> {metodoEnvio || "N/A"}
              </p>
              <p>
                <strong>Tipo detectado:</strong>{" "}
                {shippingType === "pickup" && "📦 Pickup (2)"}
                {shippingType === "imagiq" && "🚚 Imagiq (3)"}
                {shippingType === "coordinadora" && "🚛 Coordinadora (1)"}
              </p>
            </div>
          </div>
        )}

        {/* Tracking Content - full-bleed white, no card border */}
        <div className="bg-white max-w-7xl mx-auto" style={{ minHeight: "500px" }}>
          {/* Pickup View - medio_pago: 2 */}
          {showPickup && (
            <PickupShippingView
              orderNumber={orderNumber}
              token={token}
              fechaCreacion={fechaCreacion ? formatDate(fechaCreacion) : formatDate(new Date().toISOString())}
              horaRecogida={horaRecogida}
              direccionTienda={tiendaInfo?.direccion}
              ciudadTienda={tiendaInfo?.ciudad}
              products={productos}
            />
          )}

          {/* IMAGIQ Shipping View - medio_pago: 3 */}
          {showImagiq && (
            <ImagiqShippingView
              orderNumber={orderNumber}
              estimatedInitDate={estimatedInitDate}
              estimatedFinalDate={estimatedFinalDate}
              trackingSteps={trackingSteps}
              direccionEntrega={direccionEntrega}
              ciudadEntrega={ciudadEntrega}
              nombreDestinatario={nombreDestinatario}
              telefonoDestinatario={telefonoDestinatario}
              products={productos}
            />
          )}

          {/* Coordinadora Shipping View - medio_pago: 1 */}
          {showCoordinadora && (
            <ShippingOrderView
              orderNumber={orderNumber}
              estimatedInitDate={estimatedInitDate}
              estimatedFinalDate={estimatedFinalDate}
              trackingSteps={trackingSteps}
              pdfBase64={pdfBase64}
            />
          )}
        </div>
      </main>
    </div>
  );
}
