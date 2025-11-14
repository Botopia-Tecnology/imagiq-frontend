"use client";

import { use, useEffect, useState } from "react";
import { apiClient } from "@/lib/api";
import { OrderDetails, ProductoDetalle, TiendaInfo } from "@/app/tracking-service/interfaces/types.d";
import { LoadingSpinner, ErrorView } from "@/app/tracking-service/components";
import { PickupShippingView } from "../components";

export default function PickupTrackingPage({
  params,
}: Readonly<{ params: Promise<{ orderId: string }> }>) {
  const [orderNumber, setOrderNumber] = useState("...");
  const [token, setToken] = useState<string>("");
  const [horaRecogida, setHoraRecogida] = useState<string>("");
  const [fechaCreacion, setFechaCreacion] = useState<string>("");
  const [productos, setProductos] = useState<ProductoDetalle[]>([]);
  const [tiendaInfo, setTiendaInfo] = useState<TiendaInfo | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
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

        // Set order information
        setOrderNumber(data.orden_id || "...");
        setToken(data.token || "");
        setHoraRecogida(data.hora_recogida_autorizada || "");
        setFechaCreacion(data.fecha_creacion || "");

        // Set products and store info
        setProductos(data.productos || []);
        setTiendaInfo(data.tienda);

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
    return <LoadingSpinner message="Cargando información de recogida..." />;
  }

  if (error) {
    return (
      <ErrorView message={error} onRetry={() => window.location.reload()} />
    );
  }

  return (
    <div className="bg-white min-h-screen">
      <main className="w-full max-w-7xl mx-auto">
        <PickupShippingView
          orderNumber={orderNumber}
          token={token}
          fechaCreacion={fechaCreacion ? formatDate(fechaCreacion) : formatDate(new Date().toISOString())}
          horaRecogida={horaRecogida}
          direccionTienda={tiendaInfo?.direccion}
          ciudadTienda={tiendaInfo?.ciudad}
          products={productos}
        />
      </main>
    </div>
  );
}
