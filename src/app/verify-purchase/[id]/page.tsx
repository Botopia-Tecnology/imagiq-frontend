"use client";
import LogoReloadAnimation from "@/app/carrito/LogoReloadAnimation";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { apiGet } from "@/lib/api-client";

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
      const data = await apiGet<{ message: string; status: number }>(
        `/api/orders/verify/${orderId}`
      );

      // Verificar el status del body de la respuesta
      if (data.status === 200) {
        // Mantener la animación visible durante la redirección
        router.push(`/success-checkout/${orderId}`);
      } else {
        console.error("Verification failed with status:", data.status, data.message);
        router.push("/error-checkout");
      }
    } catch (error) {
      console.error("Error verifying order:", error);
      router.push("/error-checkout");
    }
    // NO hacer setIsLoading(false) para mantener la animación visible
    // hasta que la nueva página cargue completamente
  }, [orderId, router]);

  return (
    <div className="fixed inset-0 z-[9999] bg-gradient-to-br from-[#ffffff] via-[#969696] to-[#000000]">
      <LogoReloadAnimation
        open={isLoading}
        onFinish={orderId ? verifyOrder : undefined}
      />
    </div>
  );
}
