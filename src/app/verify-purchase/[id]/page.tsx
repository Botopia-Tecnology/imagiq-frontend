"use client";
import LogoReloadAnimation from "@/app/carrito/LogoReloadAnimation";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
const MAX_RETRY_ATTEMPTS = 5; // 24 intentos x 5 segundos = 2 minutos máximo

export default function VerifyPurchase(props: Readonly<{ params: Readonly<Promise<{ id: string }>>; }>) {
  const { params } = props;
  const [orderId, setOrderId] = useState<string | null>(null);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const retryCountRef = useRef(0);

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
        orderStatus?: string;
      } = await response.json();

      console.log("📦 [VERIFY] Response data completo:", JSON.stringify(data, null, 2));
      console.log("📊 [VERIFY] Status:", data.status);
      console.log("🔐 [VERIFY] RequiresAction:", data.requiresAction);
      console.log("🔐 [VERIFY] OrderStatus:", data.orderStatus);

      // Manejar estado PENDING con requiresAction (3DS en proceso)
      // IMPORTANTE: No redirigir a success si requiresAction es true, aunque status sea 200
      if (data.requiresAction === true || data.orderStatus === "PENDING") {
        retryCountRef.current += 1;
        console.log(`⏳ [VERIFY] Transacción pendiente de validación 3D Secure (intento ${retryCountRef.current}/${MAX_RETRY_ATTEMPTS})`);
        console.log("🔐 [VERIFY] Status:", data.status, "- OrderStatus:", data.orderStatus);
        
        // Si superamos el máximo de reintentos, redirigir a error
        if (retryCountRef.current >= MAX_RETRY_ATTEMPTS) {
          console.error("❌ [VERIFY] Timeout: La validación 3DS no se completó en 2 minutos");
          console.error("❌ [VERIFY] Redirigiendo a error-checkout...");
          router.push("/error-checkout");
          return;
        }
        
        // Reintentar la verificación cada 5 segundos
        setTimeout(() => verifyOrder(), 5000);
        return;
      }

      // Resetear contador si la transacción ya no está pendiente
      retryCountRef.current = 0;

      // Verificar el status del body de la respuesta
      // Solo redirigir a success si NO hay requiresAction, NO está PENDING, y el status es 200 o APPROVED
      if ((data.status === 200 || data.status === "APPROVED") && data.orderStatus !== "PENDING") {
        console.log("✅ [VERIFY] Transacción aprobada, redirigiendo a success...");
        // Mantener animación visible durante la redirección
        router.push(`/success-checkout/${orderId}`);
      } else {
        console.error("❌ [VERIFY] Verification failed with status:", data.status, "- orderStatus:", data.orderStatus);
        console.error("❌ [VERIFY] Message:", data.message);
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
