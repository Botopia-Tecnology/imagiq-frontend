"use client";
import LogoReloadAnimation from "@/app/carrito/LogoReloadAnimation";
import { useRouter } from "next/navigation";
import { use, useCallback, useState } from "react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export function VerifyPurchase({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const pathParams = use(params);
  const orderId = pathParams.id;
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  const verifyOrder = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `${API_BASE_URL}/api/orders/verify/${orderId}`
      );
      const data: { message: string; status: number } = await response.json();

      if (data.status === 200) {
        router.push("/success-checkout");
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

  return <LogoReloadAnimation open={isLoading} onFinish={verifyOrder} />;
}

export default VerifyPurchase;
