"use client";

import { use, useEffect, useState } from "react";
import { apiClient } from "@/lib/api";
import { OrderDetails, EnvioEvento, ProductoDetalle } from "@/app/tracking-service/interfaces/types.d";
import { LoadingSpinner, ErrorView } from "@/app/tracking-service/components";
import { ImagiqShippingView } from "../components";

export default function ImagiqTrackingPage({
  params,
}: Readonly<{ params: Promise<{ orderId: string }> }>) {
  const [orderNumber, setOrderNumber] = useState("...");
  const [estimatedInitDate, setEstimatedInitDate] = useState("0000-00-00");
  const [estimatedFinalDate, setEstimatedFinalDate] = useState("000-00-00");
  const [trackingSteps, setTrackingSteps] = useState<EnvioEvento[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [direccionEntrega, setDireccionEntrega] = useState<string>("");
  const [ciudadEntrega, setCiudadEntrega] = useState<string>("");
  const [nombreDestinatario, setNombreDestinatario] = useState<string>("");
  const [telefonoDestinatario, setTelefonoDestinatario] = useState<string>("");
  const [productos, setProductos] = useState<ProductoDetalle[]>([]);
  const [error, setError] = useState<string | null>(null);
  const pathParams = use(params);

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

  useEffect(() => {
    apiClient
      .get<OrderDetails>(`/api/orders/shipping-info/${pathParams.orderId}`)
      .then((res) => {
        const data = res.data;
        const envioData = data.envios && data.envios.length > 0 ? data.envios[0] : data;

        // Set order number
        setOrderNumber(envioData.numero_guia || data.orden_id || "...");

        // Calculate estimated delivery dates
        if (envioData.tiempo_entrega_estimado) {
          const fechaCreacion = new Date(data.fecha_creacion);
          const dias = Number.parseInt(envioData.tiempo_entrega_estimado);

          fechaCreacion.setDate(fechaCreacion.getDate() + dias);
          setEstimatedInitDate(formatDate(fechaCreacion.toISOString()));

          fechaCreacion.setDate(fechaCreacion.getDate() + 2);
          setEstimatedFinalDate(formatDate(fechaCreacion.toISOString()));
        }

        // Set tracking data
        setTrackingSteps(envioData.eventos || []);

        // Set delivery information
        setDireccionEntrega(data.direccion_entrega || "");
        setCiudadEntrega(data.ciudad_entrega || "");
        setNombreDestinatario(data.nombre_destinatario || "");
        setTelefonoDestinatario(data.telefono_destinatario || "");

        // Set products
        setProductos(data.productos || []);

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
    return <LoadingSpinner message="Cargando información del envío..." />;
  }

  if (error) {
    return (
      <ErrorView message={error} onRetry={() => window.location.reload()} />
    );
  }

  return (
    <div className="bg-white min-h-screen pt-4 md:pt-5">
      <main className="w-full max-w-7xl mx-auto px-2 sm:px-4">
        <div className="bg-white max-w-7xl mx-auto" style={{ minHeight: "500px" }}>
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
        </div>
      </main>
    </div>
  );
}
