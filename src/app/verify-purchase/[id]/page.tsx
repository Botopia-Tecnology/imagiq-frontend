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

    try {
      // Mantener isLoading en true durante toda la verificación y redirección
      const response = await fetch(
        `${API_BASE_URL}/api/orders/verify/${orderId}`
      );

      // Verificar primero el status HTTP de la respuesta
      if (!response.ok) {
        console.error("HTTP error:", response.status, response.statusText);
        // Mantener animación visible durante la redirección
        router.push("/error-checkout");
        return;
      }

      const data: { message: string; status: number } = await response.json();

      // Verificar el status del body de la respuesta
      if (data.status === 200) {
        // Mantener animación visible durante la redirección
        router.push(`/success-checkout/${orderId}`);
      } else {
        console.error("Verification failed with status:", data.status, data.message);
        router.push("/error-checkout");
      }
    } catch (error) {
      console.error("Error verifying order:", error);
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
