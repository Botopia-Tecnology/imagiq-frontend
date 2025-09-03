"use client";

/**
 * Página de carga para el proceso de checkout
 * Muestra la animación de carga mientras se procesa el pago
 * Redirecciona automáticamente a la página de éxito o error según el resultado
 *
 * Características:
 * - Animación profesional durante el procesamiento
 * - Simulación realista del proceso de pago
 * - Redirección automática basada en el resultado
 * - Experiencia de usuario premium y fluida
 */

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import LogoReloadAnimation from "../LogoReloadAnimation";

export default function ChargingResultPage() {
  const router = useRouter();
  const [open, setOpen] = useState(true);

  /**
   * Simula el proceso de pago y redirecciona según el resultado
   * - Para fines de demostración: 90% probabilidad de éxito, 10% de error
   * - En producción se conectaría con un servicio real de procesamiento de pagos
   */
  useEffect(() => {
    const simulatePaymentProcess = () => {
      const isSuccess = Math.random() > 0.1;

      // Dar tiempo suficiente para que la animación se muestre
      const timeoutDuration = 3000; // 3 segundos para una buena experiencia

      setTimeout(() => {
        setOpen(false);

        // Redirigir según el resultado
        if (isSuccess) {
          // En caso de éxito, redirigir a la página de éxito
          router.push(`/carrito/SuccessCheckout`);
        } else {
          // En caso de error, redirigir a la página de error
          router.push(`/carrito/ErrorCheckout`);
        }
      }, timeoutDuration);
    };

    simulatePaymentProcess();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <LogoReloadAnimation
        open={open}
        onFinish={() => {
          // Este callback se dispara cuando la animación termina
          // pero la redirección ya está manejada por el useEffect
        }}
      />
    </div>
  );
}
