"use client";

import { use, useEffect, useState } from "react";

// Importación de iconos
import { apiClient } from "@/lib/api";
import { OrderDetails, EnvioEvento, ProductoDetalle, TiendaInfo } from "../interfaces/types.d";
import {
  LoadingSpinner,
  ErrorView,
  PickupOrderView,
  ShippingOrderView,
} from "../components";
import { ImagiqShippingView } from "@/app/imagiq-tracking/components/ImagiqShippingView";
import { EnhancedPickupOrderView } from "@/app/pickup-tracking/components/EnhancedPickupOrderView";

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

  const isPickupOrder = (metodo: string) => {
    return (
      metodo?.toLowerCase().includes("recoger") ||
      metodo?.toLowerCase().includes("tienda")
    );
  };

  useEffect(() => {
    apiClient
      .get<OrderDetails>(`/api/orders/shipping-info/${pathParams.orderId}`)
      .then((res) => {
        const data = res.data;

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

  // Determine which view to show
  const showPickup = isPickupOrder(metodoEnvio);
  const showEnhancedPickup = showPickup && (productos.length > 0 || tiendaInfo);
  const showImagiqShipping = !showPickup && !pdfBase64;
  const showCoordinadoraShipping = !showPickup && pdfBase64;

  return (
    <div className="bg-white pt-4 md:pt-5">
      {/* Main Content */}
      <main className="w-full max-w-7xl mx-auto px-2 sm:px-4">
        {/* Tracking Content - full-bleed white, no card border */}
        <div className="bg-white max-w-7xl mx-auto" style={{ minHeight: "500px" }}>
          {/* Enhanced Pickup View - with products */}
          {showEnhancedPickup && (
            <EnhancedPickupOrderView
              orderNumber={orderNumber}
              token={token}
              horaRecogida={horaRecogida}
              fechaCreacion={fechaCreacion}
              products={productos}
              storeInfo={tiendaInfo}
              formatDate={formatDate}
            />
          )}

          {/* Basic Pickup View - fallback */}
          {showPickup && !showEnhancedPickup && (
            <PickupOrderView
              orderNumber={orderNumber}
              token={token}
              horaRecogida={horaRecogida}
              formatDate={formatDate}
            />
          )}

          {/* IMAGIQ Shipping View - no PDF */}
          {showImagiqShipping && (
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

          {/* Coordinadora Shipping View - with PDF */}
          {showCoordinadoraShipping && (
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
