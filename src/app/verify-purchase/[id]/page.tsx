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
      setIsLoading(true);
      const response = await fetch(
        `${API_BASE_URL}/api/orders/verify/${orderId}`
      );
      const data: { message: string; status: number } = await response.json();

      if (data.status === 200) {
        router.push(`/success-checkout/${orderId}`);
      } else {
        router.push("/error-checkout");
      }
    } catch (error) {
      console.error("Error verifying order:", error);
      router.push("/error-checkout");
    } finally {
      setIsLoading(false);
    }
  }, [orderId, router]);

  return (
    <LogoReloadAnimation
      open={isLoading}
      onFinish={orderId ? verifyOrder : undefined}
    />
  );
}
