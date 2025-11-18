"use client";

/**
 * DEPRECATED: Esta página ha sido consolidada en /tracking-service
 * Redirige automáticamente a la página unificada de tracking
 */

import { use, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function PickupTrackingPage({
  params,
}: Readonly<{ params: Promise<{ orderId: string }> }>) {
  const pathParams = use(params);
  const router = useRouter();

  useEffect(() => {
    // Redirigir a la página unificada de tracking
    router.replace(`/tracking-service/${pathParams.orderId}`);
  }, [pathParams.orderId, router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-gray-600">Redirigiendo...</p>
    </div>
  );
}
