"use client";

import { use, useEffect, useState } from "react";
import { apiClient } from "@/lib/api";
import { OrderDetails, ProductoDetalle, TiendaInfo } from "@/app/tracking-service/interfaces/types.d";
import { LoadingSpinner, ErrorView, PickupOrderView } from "@/app/tracking-service/components";
import { EnhancedPickupOrderView } from "../components";

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

  // Use enhanced view if we have products or store info
  const useEnhancedView = productos.length > 0 || tiendaInfo;

  return (
    <div className="bg-gradient-to-br from-green-50 via-white to-blue-50 min-h-screen pt-4 md:pt-5">
      <main className="w-full max-w-7xl mx-auto px-2 sm:px-4">
        <div className="bg-white max-w-7xl mx-auto rounded-xl shadow-sm" style={{ minHeight: "500px" }}>
          {useEnhancedView ? (
            <EnhancedPickupOrderView
              orderNumber={orderNumber}
              token={token}
              horaRecogida={horaRecogida}
              fechaCreacion={fechaCreacion}
              products={productos}
              storeInfo={tiendaInfo}
              formatDate={formatDate}
            />
          ) : (
            <PickupOrderView
              orderNumber={orderNumber}
              token={token}
              horaRecogida={horaRecogida}
              formatDate={formatDate}
            />
          )}
        </div>
      </main>
    </div>
  );
}
