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
import LogoReloadAnimation from "../carrito/LogoReloadAnimation";

export default function ChargingResultPage() {
  const router = useRouter();
  const [open, setOpen] = useState(true);
  const [isSuccess] = useState(() => Math.random() > 0.1);

  // Elimina el setTimeout y usa el callback de la animación
  const handleFinish = () => {
    setOpen(false);
    if (isSuccess) {
      router.push("/success-checkout");
    } else {
      router.push("/error-checkout");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <LogoReloadAnimation open={open} onFinish={handleFinish} />
    </div>
  );
}
