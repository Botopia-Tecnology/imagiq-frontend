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
  const [latitudDestino, setLatitudDestino] = useState<number | undefined>(undefined);
  const [longitudDestino, setLongitudDestino] = useState<number | undefined>(undefined);
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
    // Primero obtener el método de envío para saber qué endpoint usar
    apiClient.get<{ metodo_envio: number }>(`/api/orders/${pathParams.orderId}/delivery-method`)
      .then((deliveryMethodRes) => {
        const deliveryMethod = deliveryMethodRes.data;
        const metodoEnvio = deliveryMethod.metodo_envio;

        // Seleccionar el endpoint correcto según el método de envío
        let orderEndpoint = `/api/orders/shipping-info/${pathParams.orderId}`;
        if (metodoEnvio === 3) {
          // IMAGIQ - usar endpoint específico
          orderEndpoint = `/api/orders/${pathParams.orderId}/imagiq`;
        } else if (metodoEnvio === 2) {
          // Pickup - usar endpoint específico
          orderEndpoint = `/api/orders/${pathParams.orderId}/tiendas`;
        }
        // metodoEnvio === 1 (Coordinadora) usa shipping-info

        return Promise.all([
          apiClient.get<OrderDetails>(orderEndpoint),
          Promise.resolve(deliveryMethodRes)
        ]);
      })
      .then(([orderRes, deliveryMethodRes]) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const data = orderRes.data as any;
        const deliveryMethod = deliveryMethodRes.data;
        const metodoEnvio = deliveryMethod.metodo_envio;

        // Manejar datos según el método de envío
        let numeroGuia = "";
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let productosData: any[] = [];
        let tiendaData = null;
        let direccionEntrega = "";
        let ciudadEntrega = "";

        if (metodoEnvio === 3) {
          // IMAGIQ - estructura diferente con data.envio
          const envioData = data.envio || {};
          productosData = data.items || [];
          tiendaData = envioData.tienda_origen || null;
          direccionEntrega = envioData.direccion_destino?.linea_uno || envioData.direccion_destino?.direccion_formateada || "";
          ciudadEntrega = "";

          // Guardar coordenadas de destino para IMAGIQ
          if (envioData.direccion_destino?.latitud && envioData.direccion_destino?.longitud) {
            setLatitudDestino(parseFloat(String(envioData.direccion_destino.latitud)));
            setLongitudDestino(parseFloat(String(envioData.direccion_destino.longitud)));
          }

          // Set order number from envio
          numeroGuia = envioData.numero_guia || data.serial_id || data.id || "...";

          // Handle estimated delivery date
          if (envioData.tiempo_entrega_estimado && data.fecha_creacion) {
            const fechaCreacion = new Date(data.fecha_creacion);
            const dias = Number.parseInt(String(envioData.tiempo_entrega_estimado));

            fechaCreacion.setDate(fechaCreacion.getDate() + dias);
            setEstimatedInitDate(formatDate(fechaCreacion.toISOString()));

            fechaCreacion.setDate(fechaCreacion.getDate() + 1);
            setEstimatedFinalDate(formatDate(fechaCreacion.toISOString()));
          }

          // IMAGIQ no tiene eventos de tracking como Coordinadora
          setTrackingSteps([]);
          setPdfBase64("");

        } else if (metodoEnvio === 2) {
          // PICKUP - estructura con data.items y data.tienda
          productosData = data.items || [];
          
          // Mapear datos de la tienda explícitamente - asegurar que todos los campos se mapeen
          if (data.tienda && (data.tienda.direccion || data.tienda.ciudad || data.tienda.descripcion)) {
            // Asegurar que direccion y ciudad siempre tengan valores (requeridos por la interfaz)
            // Manejar null/undefined y hacer trim
            const direccionTienda = (data.tienda.direccion != null && data.tienda.direccion !== "")
              ? String(data.tienda.direccion).trim()
              : "";
            const ciudadTienda = (data.tienda.ciudad != null && data.tienda.ciudad !== "")
              ? String(data.tienda.ciudad).trim()
              : "";
            
            tiendaData = {
              nombre: (data.tienda.nombre != null && data.tienda.nombre !== "") 
                ? String(data.tienda.nombre).trim() 
                : undefined,
              descripcion: (data.tienda.descripcion != null && data.tienda.descripcion !== "") 
                ? String(data.tienda.descripcion).trim() 
                : undefined,
              direccion: direccionTienda || "Tienda IMAGIQ",
              ciudad: ciudadTienda || "Bogotá",
              telefono: (data.tienda.telefono != null && data.tienda.telefono !== "") 
                ? String(data.tienda.telefono).trim() 
                : undefined,
              horario: (data.tienda.horario != null && data.tienda.horario !== "") 
                ? String(data.tienda.horario).trim() 
                : undefined,
              latitud: (data.tienda.latitud != null && data.tienda.latitud !== "") 
                ? String(data.tienda.latitud).trim() 
                : undefined,
              longitud: (data.tienda.longitud != null && data.tienda.longitud !== "") 
                ? String(data.tienda.longitud).trim() 
                : undefined,
            };
          } else {
            tiendaData = null;
          }

          numeroGuia = data.serial_id || data.id || "...";
          setHoraRecogida(data.recogida_tienda?.hora_recogida_autorizada || "");
          setToken(data.token?.token || "");

        } else {
          // COORDINADORA - estructura con data.envios
          const envioData = data.envios && data.envios.length > 0 ? data.envios[0] : data;
          productosData = data.productos || [];
          tiendaData = data.tienda || null;
          direccionEntrega = data.direccion_entrega || "";
          ciudadEntrega = data.ciudad_entrega || "";

          numeroGuia = envioData.numero_guia || data.orden_id || "...";

          // Handle shipping-specific data
          if (envioData.tiempo_entrega_estimado && data.fecha_creacion) {
            const fechaCreacion = new Date(data.fecha_creacion);
            const dias = Number.parseInt(String(envioData.tiempo_entrega_estimado));

            fechaCreacion.setDate(fechaCreacion.getDate() + dias);
            setEstimatedInitDate(formatDate(fechaCreacion.toISOString()));

            fechaCreacion.setDate(fechaCreacion.getDate() + dias + 2);
            setEstimatedFinalDate(formatDate(fechaCreacion.toISOString()));
          }

          setTrackingSteps(envioData.eventos || []);
          setPdfBase64(envioData.pdf_base64 || "");
        }

        // Set common data
        setOrderNumber(numeroGuia);
        setMetodoEnvio(data.metodo_envio || "");
        setMedioPago(deliveryMethod.metodo_envio ?? data.medio_pago);
        setFechaCreacion(data.fecha_creacion || "");

        // Map productos to match ProductoDetalle interface
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const mappedProductos: ProductoDetalle[] = productosData.map((producto: any) => ({
          id: String(producto.id || ''),
          nombre: String(producto.nombre || ''),
          imagen: String(producto.imagen || producto.image_preview_url || ''),
          cantidad: Number(producto.cantidad || 0),
          precio: producto.precio ? Number(producto.precio) : (producto.unit_price ? parseFloat(String(producto.unit_price)) : undefined),
        }));

        setProductos(mappedProductos);
        // Set tiendaInfo - debe tener al menos direccion o ciudad para ser válido
        if (tiendaData && (tiendaData.direccion || tiendaData.ciudad)) {
          setTiendaInfo(tiendaData);
        } else {
          setTiendaInfo(undefined);
        }
        setDireccionEntrega(direccionEntrega);
        setCiudadEntrega(ciudadEntrega || "");
        setNombreDestinatario(data.nombre_destinatario || "");
        setTelefonoDestinatario(data.telefono_destinatario || "");

        setIsLoading(false);
      })
      .catch((error) => {
        console.error("❌ ERROR AL CARGAR DATOS:");
        console.error("Error completo:", error);
        console.error("Mensaje:", error?.message);
        console.error("Response:", error?.response?.data);
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
              nombreTienda={tiendaInfo?.nombre}
              descripcionTienda={tiendaInfo?.descripcion}
              latitudTienda={tiendaInfo?.latitud}
              longitudTienda={tiendaInfo?.longitud}
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
              tiendaOrigen={tiendaInfo}
              latitudDestino={latitudDestino}
              longitudDestino={longitudDestino}
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
