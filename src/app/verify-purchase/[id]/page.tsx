"use client";
import LogoReloadAnimation from "@/app/carrito/LogoReloadAnimation";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { apiGet } from "@/lib/api-client";

export default function VerifyPurchase(
  props: Readonly<{ params: Readonly<Promise<{ id: string }>> }>
) {
  const { params } = props;
  const [orderId, setOrderId] = useState<string | null>(null);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    params.then(({ id }) => {
      setOrderId(id);
    });
  }, [params]);

  const getMessageText = (msg: string | object, fallback = "Error desconocido en la verificación") => {
    if (typeof msg === "string" && msg.trim().length > 0) return msg;
    if (msg && typeof msg === "object") {
      // Si es un objeto vacío {}, usamos el fallback
      if (Object.keys(msg).length === 0) return fallback;
      // Si es un objeto con contenido, stringificamos para mostrar algo útil
      try {
        return JSON.stringify(msg);
      } catch {
        return fallback;
      }
    }
    return fallback;
  };

  const verifyOrder = useCallback(async () => {
    if (!orderId) return;

    const startTime = Date.now();
    const MIN_ANIMATION_DURATION = 14000; // 14 segundos mínimo para ver la animación

    try {
      setIsLoading(true);
      const data = await apiGet<{ message: string | object; status: number }>(
        `/api/orders/verify/${orderId}`
      );

      // Calcular cuánto tiempo ha pasado
      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, MIN_ANIMATION_DURATION - elapsedTime);

      // Esperar el tiempo restante para completar la animación mínima
      await new Promise((resolve) => setTimeout(resolve, remainingTime));

      // Normalizar mensaje
      const messageText = getMessageText(data.message);

      if (data.status === 200) {
        router.push(`/success-checkout/${orderId}`);
      } else {
        console.error("Verification failed with status:", data.status, messageText);
        router.push(
          `/error-checkout?error=${encodeURIComponent(messageText)}`
        );
      }
    } catch (error) {
      console.error("Error verifying order:", error);
      let errorMessage = "Error desconocido en la verificación";
      if (error instanceof Error) errorMessage = error.message;
      else errorMessage = getMessageText(String(error), errorMessage);

      // Calcular cuánto tiempo ha pasado en caso de error
      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, MIN_ANIMATION_DURATION - elapsedTime);

      // Esperar el tiempo restante para completar la animación mínima
      await new Promise((resolve) => setTimeout(resolve, remainingTime));

      router.push(`/error-checkout?error=${encodeURIComponent(errorMessage)}`);
    }
    // NO hacer setIsLoading(false) para mantener la animación visible
    // hasta que la nueva página cargue completamente
  }, [orderId, router]);

  useEffect(() => {
    if (orderId) {
      verifyOrder();
    }
  }, [orderId, verifyOrder]);

  return (
    <div className="fixed inset-0 z-9999 bg-linear-to-br from-[#ffffff] via-[#969696] to-[#000000]">
      <LogoReloadAnimation open={isLoading} />
    </div>
  );
}
