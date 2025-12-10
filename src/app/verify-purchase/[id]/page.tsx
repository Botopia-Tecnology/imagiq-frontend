"use client";
import LogoReloadAnimation from "@/app/carrito/LogoReloadAnimation";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export default function VerifyPurchase(props: Readonly<{ params: Readonly<Promise<{ id: string }>>; }>) {
  const { params } = props;
  const [orderId, setOrderId] = useState<string | null>(null);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    params.then(({ id }) => {
      setOrderId(id);
    });
  }, [params]);

  const verifyOrder = useCallback(async () => {
    if (!orderId) return;

    console.log("🔍 [VERIFY] Iniciando verificación para orden:", orderId);

    try {
      // Mantener isLoading en true durante toda la verificación y redirección
      const response = await fetch(
        `${API_BASE_URL}/api/orders/verify/${orderId}`
      );

      console.log("📡 [VERIFY] Response status:", response.status, response.statusText);

      // Verificar primero el status HTTP de la respuesta
      if (!response.ok) {
        console.error("❌ [VERIFY] HTTP error:", response.status, response.statusText);
        // Mantener animación visible durante la redirección
        router.push("/error-checkout");
        return;
      }

      const data: {
        message: string;
        status: number | string;
        requiresAction?: boolean;
      } = await response.json();

      console.log("📦 [VERIFY] Response data completo:", JSON.stringify(data, null, 2));
      console.log("📊 [VERIFY] Status:", data.status);
      console.log("🔐 [VERIFY] RequiresAction:", data.requiresAction);

      // Manejar estado PENDING con requiresAction (3DS en proceso)
      if (data.status === "PENDING" && data.requiresAction) {
        console.log("⏳ [VERIFY] Transacción pendiente de validación 3D Secure. Reintentando en 5 segundos...");
        // Reintentar la verificación cada 5 segundos
        setTimeout(() => verifyOrder(), 5000);
        return;
      }

      // Verificar el status del body de la respuesta
      if (data.status === 200 || data.status === "APPROVED") {
        console.log("✅ [VERIFY] Transacción aprobada, redirigiendo a success...");
        // Mantener animación visible durante la redirección
        router.push(`/success-checkout/${orderId}`);
      } else {
        console.error("❌ [VERIFY] Verification failed with status:", data.status, data.message);
        console.error("❌ [VERIFY] Redirigiendo a error-checkout...");
        router.push("/error-checkout");
      }
    } catch (error) {
      console.error("💥 [VERIFY] Error verifying order:", error);
      router.push("/error-checkout");
    }
    // NO setear isLoading(false) para evitar el flash
    // La animación permanece hasta que la nueva página cargue
  }, [orderId, router]);

  return (
    <div className="fixed inset-0 z-50 bg-[#0057B7]">
      <LogoReloadAnimation
        open={isLoading}
        onFinish={orderId ? verifyOrder : undefined}
      />
    </div>
  );
}
